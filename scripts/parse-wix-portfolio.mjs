import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function mapGallery(html, id) {
  const start = html.indexOf(`id="${id}"`);
  const end = html.indexOf('id="wix-warmup-data"', start);
  const gallery = html.slice(start, end > start ? end : undefined);
  const byTitle = {};
  for (const block of gallery.split("data-idx=").slice(1)) {
    const title = block.match(/item-title[^>]*>([^<]+)</)?.[1]?.trim();
    const uri = block.match(/4179ac_[a-f0-9]+~mv2\.jpg/)?.[0];
    if (title && uri && !byTitle[title]) byTitle[title] = uri;
  }
  return byTitle;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../elm-wix-archive");
const portfolio = readFileSync(
  resolve(root, "elmmediadesign23.wixsite.com/elmmediadesign/portfolio.html"),
  "utf8"
);
const home = readFileSync(
  resolve(root, "elmmediadesign23.wixsite.com/elmmediadesign.html"),
  "utf8"
);

const portfolioMap = mapGallery(portfolio, "pro-gallery-comp-lr0nyf45");
const homeMap = mapGallery(home, "pro-gallery-comp-lpcj15ii");

console.log("portfolio", portfolioMap);
console.log("home", homeMap);
