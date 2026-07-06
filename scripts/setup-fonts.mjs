import { cpSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nohemiSrc = resolve(root, "node_modules/@tamagui/font-nohemi/fonts");
const almaraiSrc = resolve(root, "node_modules/@fontsource/almarai/files");
const nohemiOut = resolve(root, "fonts/nohemi");
const almaraiOut = resolve(root, "fonts/almarai");

if (!existsSync(nohemiSrc)) {
 console.error("Run pnpm install first @tamagui/font-nohemi missing");
 process.exit(1);
}
if (!existsSync(almaraiSrc)) {
 console.error("Run pnpm install first @fontsource/almarai missing");
 process.exit(1);
}

mkdirSync(nohemiOut, { recursive: true });
mkdirSync(almaraiOut, { recursive: true });

const nohemi = ["Nohemi-Bold.ttf", "Nohemi-SemiBold.ttf"];
const almarai = [
 "almarai-arabic-400-normal.woff2",
 "almarai-arabic-700-normal.woff2",
 "almarai-latin-400-normal.woff2",
 "almarai-latin-700-normal.woff2",
];

for (const file of nohemi) {
 cpSync(resolve(nohemiSrc, file), resolve(nohemiOut, file));
 console.log(`OK fonts/nohemi/${file}`);
}

for (const file of almarai) {
 cpSync(resolve(almaraiSrc, file), resolve(almaraiOut, file));
 console.log(`OK fonts/almarai/${file}`);
}

cpSync(
 resolve(root, "node_modules/@tamagui/font-nohemi/LICENSE"),
 resolve(nohemiOut, "LICENSE")
);
