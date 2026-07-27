import { sync } from "glob";
import { resolve } from "path";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { SITE_NAME, SITE_URL } from "./scripts/site-config.mjs";

const htmlInputs = sync("./*.html").filter(
  (file) =>
    !file.includes("dist/") &&
    !file.includes("node_modules/") &&
    !/\.report\.html$/i.test(file)
);

const base = process.env.SITE_BASE || "/";

const deferOptionalCss = {
  name: "defer-optional-css",
  transformIndexHtml: {
    order: "post",
    enforce: "post",
    handler(html) {
      let out = html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/(?:odometer|fancybox|swiper)[^"]+\.css)">/g,
        '<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'">'
      );
      // Homepage: defer main CSS (marked via data-elm-main-css or injected style-*.css when critical CSS present)
      if (out.includes("data-elm-main-css") || out.includes("head-critical") || out.includes(".hero__media-img")) {
        out = out.replace(
          /<link([^>]*href="\/assets\/(?:style|bootstrap)[^"]+\.css"[^>]*)>/g,
          (full, attrs) => {
            if (/media=/.test(attrs)) return full;
            return `<link${attrs} media="print" onload="this.media='all'">`;
          }
        );
        // Keep a single style-*.css link
        let keptStyle = false;
        out = out.replace(
          /<link[^>]*href="\/assets\/style-[^"]+\.css"[^>]*>/g,
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
    open: "/index.html",
  },
});
