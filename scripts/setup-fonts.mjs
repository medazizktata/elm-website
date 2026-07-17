import { cpSync, existsSync, mkdirSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nohemiSrc = resolve(root, "node_modules/@tamagui/font-nohemi/fonts");
const readexSrc = resolve(root, "node_modules/@fontsource/readex-pro/files");
const nohemiOut = resolve(root, "fonts/nohemi");
const readexOut = resolve(root, "fonts/readex-pro");
const almaraiOut = resolve(root, "fonts/almarai");

if (!existsSync(nohemiSrc)) {
  console.error("Run pnpm install first — @tamagui/font-nohemi missing");
  process.exit(1);
}
if (!existsSync(readexSrc)) {
  console.error("Run pnpm install first — @fontsource/readex-pro missing");
  process.exit(1);
}

mkdirSync(nohemiOut, { recursive: true });
mkdirSync(readexOut, { recursive: true });

const nohemi = ["Nohemi-Bold.ttf", "Nohemi-SemiBold.ttf"];
const readex = [
  "readex-pro-arabic-400-normal.woff2",
  "readex-pro-arabic-600-normal.woff2",
  "readex-pro-arabic-700-normal.woff2",
  "readex-pro-latin-400-normal.woff2",
  "readex-pro-latin-600-normal.woff2",
  "readex-pro-latin-700-normal.woff2",
];

for (const file of nohemi) {
  cpSync(resolve(nohemiSrc, file), resolve(nohemiOut, file));
  console.log(`OK fonts/nohemi/${file}`);
}

for (const file of readex) {
  cpSync(resolve(readexSrc, file), resolve(readexOut, file));
  console.log(`OK fonts/readex-pro/${file}`);
}

cpSync(
  resolve(root, "node_modules/@tamagui/font-nohemi/LICENSE"),
  resolve(nohemiOut, "LICENSE")
);

if (existsSync(almaraiOut)) {
  rmSync(almaraiOut, { recursive: true, force: true });
  console.log("Removed fonts/almarai/");
}
