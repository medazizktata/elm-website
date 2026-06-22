import { cpSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

const root = resolve(".");
const dist = resolve("dist");
const dirs = ["css", "js", "images", "fonts", "ico", "videos"];

if (!existsSync(dist)) mkdirSync(dist, { recursive: true });

for (const dir of dirs) {
  const src = resolve(root, dir);
  if (existsSync(src)) {
    cpSync(src, resolve(dist, dir), { recursive: true });
    console.log(`Copied ${dir}/`);
  }
}
