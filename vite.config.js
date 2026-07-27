import { sync } from "glob";
import { basename, resolve } from "path";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { SITE_NAME, SITE_URL } from "./scripts/site-config.mjs";

const pageFiles = sync("pages/**/*.html").filter(
  (file) => !file.includes("node_modules/") && !/\.report\.html$/i.test(file)
);

const htmlInputs = Object.fromEntries(
  pageFiles.map((file) => [basename(file, ".html"), resolve(file)])
);

const base = process.env.SITE_BASE || "/";

/** Emit pages/*.html as dist/*.html so production URLs stay flat. */
function flattenPagesOutput() {
  return {
    name: "flatten-pages-output",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        if (!fileName.startsWith("pages/") || !fileName.endsWith(".html")) continue;
        const chunk = bundle[fileName];
        const flat = fileName.slice("pages/".length);
        delete bundle[fileName];
        chunk.fileName = flat;
        if (chunk.type === "asset" && typeof chunk.source === "string") {
          chunk.source = chunk.source
            .replaceAll('href="../assets/', 'href="/assets/')
            .replaceAll('src="../assets/', 'src="/assets/')
            .replaceAll("href='../assets/", "href='/assets/")
            .replaceAll("src='../assets/", "src='/assets/");
        }
        bundle[flat] = chunk;
      }
    },
  };
}

/** Dev: serve /contact.html from pages/contact.html (flat URLs like prod). */
function pagesDevRewrite() {
  return {
    name: "pages-dev-rewrite",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) return next();
        const [pathname, query = ""] = req.url.split("?");
        const qs = query ? `?${query}` : "";
        if (pathname === "/" || pathname === "/index.html") {
          req.url = `/pages/index.html${qs}`;
        } else if (/^\/[^/]+\.html$/.test(pathname)) {
          req.url = `/pages${pathname}${qs}`;
        }
        next();
      });
    },
  };
}

const deferOptionalCss = {
  name: "defer-optional-css",
  transformIndexHtml: {
    order: "post",
    enforce: "post",
    handler(html) {
      let out = html
        .replaceAll('href="../assets/', 'href="/assets/')
        .replaceAll('src="../assets/', 'src="/assets/');

      out = out.replace(
        /<link rel="stylesheet" crossorigin href="(\/(?:assets\/)?(?:odometer|fancybox|swiper)[^"]+\.css)">/g,
        '<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'">'
      );
      if (out.includes("data-elm-main-css") || out.includes("head-critical") || out.includes(".hero__media-img")) {
        out = out.replace(
          /<link([^>]*href="\/(?:assets\/)?(?:style|bootstrap)[^"]+\.css"[^>]*)>/g,
          (full, attrs) => {
            if (/media=/.test(attrs)) return full;
            return `<link${attrs} media="print" onload="this.media='all'">`;
          }
        );
        out = out.replace(
          /<link([^>]*href="css\/(?:style|bootstrap)[^"]+\.css"[^>]*)>/g,
          (full, attrs) => {
            if (/media=/.test(attrs)) return full;
            return `<link${attrs} media="print" onload="this.media='all'">`;
          }
        );
        let keptStyle = false;
        out = out.replace(
          /<link[^>]*href="(?:\/(?:assets\/)?|css\/)style[^"]*\.css"[^>]*>/g,
          (tag) => {
            if (keptStyle) return "";
            keptStyle = true;
            return tag.includes("media=")
              ? tag
              : tag.replace(/>$/, ' media="print" onload="this.media=\'all\'">');
          }
        );
        out = out.replace(/\s*data-elm-main-css/g, "");
      }
      return out;
    },
  },
};

export default defineConfig({
  base,
  root: ".",
  publicDir: "public",
  plugins: [
    handlebars({
      partialDirectory: resolve("./partials"),
      context() {
        return { siteName: SITE_NAME, siteUrl: SITE_URL };
      },
      helpers: {
        documentTitle(pageTitle) {
          if (!pageTitle) return SITE_NAME;
          return `${pageTitle} | ${SITE_NAME}`;
        },
        webpSrc(path, width = 800) {
          if (!path) return "";
          const base = String(path)
            .replace(/^images\//, "")
            .replace(/\.(jpe?g|png|webp|avif)$/i, "");
          return `images/${base}-${width}.webp`;
        },
      },
    }),
    flattenPagesOutput(),
    pagesDevRewrite(),
    deferOptionalCss,
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: htmlInputs,
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) {
            return "three";
          }
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    open: "/",
  },
});
