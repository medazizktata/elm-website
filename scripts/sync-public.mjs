import { cpSync, existsSync, mkdirSync, rmSync } from "fs";
import { resolve } from "path";

const root = resolve(".");
const publicDir = resolve(root, "public");
const dirs = ["ico", "fonts", "videos", "locales"];

if (existsSync(publicDir)) {
  rmSync(publicDir, { recursive: true, force: true });
}

mkdirSync(publicDir, { recursive: true });

for (const dir of dirs) {
  const src = resolve(root, dir);
  if (!existsSync(src)) continue;
  cpSync(src, resolve(publicDir, dir), { recursive: true });
  console.log(`Synced ${dir}/ → public/${dir}/`);
}

const jsOut = resolve(publicDir, "js");
mkdirSync(jsOut, { recursive: true });

for (const srcDir of ["vendor/js", "src/js"]) {
  const src = resolve(root, srcDir);
  if (!existsSync(src)) continue;
  cpSync(src, jsOut, { recursive: true });
  console.log(`Synced ${srcDir}/ → public/js/`);
}
