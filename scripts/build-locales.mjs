import { writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { en, ar } from "./locale-bundle.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const localesDir = resolve(root, "locales");

mkdirSync(localesDir, { recursive: true });

writeFileSync(resolve(localesDir, "en.json"), JSON.stringify(en, null, 2) + "\n", "utf8");
writeFileSync(resolve(localesDir, "ar.json"), JSON.stringify(ar, null, 2) + "\n", "utf8");

console.log("Wrote locales/en.json and locales/ar.json");
