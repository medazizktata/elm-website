import { cpSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { resolve } from "path";

const root = resolve(".");
const dist = resolve("dist");
const dirs = ["css", "js", "images", "fonts", "ico", "videos"];
const rootFiles = ["robots.txt", "sitemap.xml"];

if (!existsSync(dist)) mkdirSync(dist, { recursive: true });

for (const dir of dirs) {
  const src = resolve(root, dir);
  if (existsSync(src)) {
    cpSync(src, resolve(dist, dir), { recursive: true });
    console.log(`Copied ${dir}/`);
  }
}

for (const file of rootFiles) {
  const src = resolve(root, file);
  if (existsSync(src)) {
    copyFileSync(src, resolve(dist, file));
    console.log(`Copied ${file}`);
  }
}
