import { sync } from "glob";
import { resolve } from "path";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

const htmlInputs = sync("./*.html").filter(
  (file) => !file.includes("dist/") && !file.includes("node_modules/")
);

const SITE_NAME = "ELM Media Design";
const base = process.env.SITE_BASE || "/";

export default defineConfig({
  base,
  root: ".",
  publicDir: false,
  plugins: [
    handlebars({
      partialDirectory: resolve("./partials"),
      context() {
        return { siteName: SITE_NAME };
      },
      helpers: {
        documentTitle(pageTitle) {
          if (!pageTitle) return SITE_NAME;
          return `${pageTitle} | ${SITE_NAME}`;
        },
      },
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: htmlInputs,
    },
    copyPublicDir: false,
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    open: "/index.html",
  },
});
