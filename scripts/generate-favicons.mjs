import { cpSync, existsSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

const root = resolve(".");
const logoSvg = resolve(root, "ico/logo/logo_ELM_svg.svg");
const icoDir = resolve(root, "ico");

if (!existsSync(logoSvg)) {
  console.error("Missing ico/logo/logo_ELM_svg.svg");
  process.exit(1);
}

cpSync(logoSvg, resolve(icoDir, "favicon.svg"));

const sizes = [
  ["favicon.png", 32],
  ["apple-touch-icon-57-precomposed.png", 57],
  ["apple-touch-icon-72-precomposed.png", 72],
  ["apple-touch-icon-114-precomposed.png", 114],
  ["apple-touch-icon-144-precomposed.png", 144],
  ["apple-touch-icon.png", 180],
];

for (const [name, size] of sizes) {
  execSync(
    `magick -background none -density 300 "${logoSvg}" -resize ${size}x${size} "${resolve(icoDir, name)}"`,
    { stdio: "inherit" },
  );
}

execSync(
  `magick "${resolve(icoDir, "favicon.png")}" "${resolve(icoDir, "favicon.ico")}"`,
  { stdio: "inherit" },
);

console.log("Favicons generated in ico/");
