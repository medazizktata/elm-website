import { writeFileSync } from "fs";
import { resolve } from "path";
import { SITE_URL } from "./site-config.mjs";

const content = `User-agent: *
Allow: /

Disallow: /offices.html
Disallow: /project-single.html

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(resolve("robots.txt"), `${content}\n`, "utf8");
console.log(`Wrote robots.txt for ${SITE_URL}`);
