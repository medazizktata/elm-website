import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import subsetFontPkg from "subset-font";

const subsetFont = subsetFontPkg.default || subsetFontPkg;

const root = resolve(".");
const fontPath = resolve(root, "fonts/LineIcons.woff2");
const glyphs = "\uEA22\uEA55\uEA58\uEA63\uEB33\uEB51\uEB7B\uEBAF";

const input = await readFile(fontPath);
const output = await subsetFont(input, glyphs, { targetFormat: "woff2" });
await writeFile(fontPath, output);
console.log(`OK fonts/LineIcons.woff2 subset (${output.length} bytes)`);
