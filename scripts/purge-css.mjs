import { writeFile } from "fs/promises";
import { sync } from "glob";
import { PurgeCSS } from "purgecss";
import { resolve } from "path";

const root = resolve(".");
const cssPath = resolve(root, "css/style.css");

const content = [
  ...sync("*.html", { cwd: root, ignore: ["**/dist/**", "**/*.report.html"] }),
  ...sync("partials/**/*.html", { cwd: root }),
  ...sync("js/**/*.js", { cwd: root, ignore: ["**/*.min.js"] }),
  ...sync("src/**/*.js", { cwd: root }),
].map((f) => resolve(root, f));

const result = await new PurgeCSS().purge({
  content,
  css: [cssPath],
  fontFace: true,
  keyframes: true,
  variables: true,
  safelist: {
    standard: [
      "show",
      "active",
      "open",
      "collapse",
      "collapsing",
      "sticky",
      "overflow",
      "fade",
      "in",
      "rtl",
    ],
    deep: [
      /^is-/,
      /^has-/,
      /^js-/,
      /^swiper/,
      /^fancybox/,
      /^odometer/,
      /^lni/,
      /^page-loader/,
      /^hero/,
      /^navbar/,
      /^side-widget/,
      /^search-/,
      /^theme-/,
      /^locale-/,
      /^data-theme/,
      /^elm-/,
      /^custom-button/,
      /^content-section/,
      /^col-(?:sm|md|lg|xl|xxl)?-?\d*/,
      /^row$/,
      /^container/,
      /^g-[0-5]/,
      /^gy-[0-5]/,
      /^gx-[0-5]/,
    ],
    greedy: [/swiper/, /fancybox/, /odometer/],
  },
});

const purged = result[0]?.css;
if (!purged) {
  console.error("PurgeCSS produced no output");
  process.exit(1);
}

const before = (await import("fs")).statSync(cssPath).size;
await writeFile(cssPath, purged);
const after = Buffer.byteLength(purged);
console.log(`OK css/style.css purged (${before} → ${after}, -${before - after} bytes)`);
