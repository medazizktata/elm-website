import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";
import { basename, resolve } from "path";

const root = resolve(".");
const baseUrl = "https://www.elmmdesign.com";
const outPath = resolve(root, "sitemap.xml");

const priorityByFile = {
  "index.html": "1.0",
  "technologies.html": "0.9",
  "solutions.html": "0.9",
  "projects.html": "0.9",
  "contact.html": "0.9",
  "who-we-are.html": "0.8",
};

function isNoindex(content) {
  return /\bnoindex\s*=\s*true/.test(content);
}

const urls = [];

for (const filePath of globSync("*.html", { cwd: root })) {
  const file = basename(filePath);
  const content = readFileSync(resolve(root, filePath), "utf8");
  if (!/\{\{>\s*meta/.test(content) || isNoindex(content)) continue;

  const path = file === "index.html" ? "" : file;
  const loc = `${baseUrl}/${path}`;
  const priority = priorityByFile[file] || "0.7";

  urls.push({ loc, priority });
}

urls.sort((a, b) => a.loc.localeCompare(b.loc));

const lastmod = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(outPath, `${xml}\n`, "utf8");
console.log(`Wrote ${urls.length} URLs to sitemap.xml`);
