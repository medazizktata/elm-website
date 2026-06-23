import { sync } from "glob";
import { resolve } from "path";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

const htmlInputs = sync("./*.html").filter(
  (file) => !file.includes("dist/") && !file.includes("node_modules/")
);

export default defineConfig({
  root: ".",
  publicDir: false,
  plugins: [
    handlebars({
      partialDirectory: resolve("./partials"),
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
