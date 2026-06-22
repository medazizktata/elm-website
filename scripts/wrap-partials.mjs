import fs from "fs";
import { globSync } from "glob";

const year = new Date().getFullYear();

const pageMeta = {
  "index.html": {
    title: "Industrial 3D Printing Dubai | ELM Media Design",
    description:
      "Commercial-scale LFAM in UAE. Robotic concrete and polymer 3D printing for buildings, facades, hospitality and government projects.",
    ogPath: "",
  },
  "about-company.html": {
    title: "Who We Are | ELM Media Design",
    description:
      "ELM Media Design delivers industrial 3D printing at architectural scale in Dubai, UAE.",
    ogPath: "about-company.html",
  },
  "our-history.html": {
    title: "Our Story | ELM Media Design",
    description: "How ELM Media Design was founded to close the UAE LFAM capability gap.",
    ogPath: "our-history.html",
  },
  "core-values.html": {
    title: "Why ELM | ELM Media Design",
    description:
      "Agile manufacturing, sustainability, and UAE policy alignment with Dubai 2030 3D printing mandates.",
    ogPath: "core-values.html",
  },
  "certificates.html": {
    title: "UAE Compliance | ELM Media Design",
    description:
      "Dubai 3D Printing Strategy 2030, ICV certification, Net Zero 2050 and Dubai 2040 alignment.",
    ogPath: "certificates.html",
  },
  "services.html": {
    title: "Technologies | ELM Media Design",
    description:
      "Robotic concrete 3D printing, polymer LFAM and architectural manufacturing in Dubai.",
    ogPath: "services.html",
  },
  "projects.html": {
    title: "Projects | ELM Media Design",
    description: "LFAM portfolio and case studies from ELM Media Design, UAE.",
    ogPath: "projects.html",
  },
  "project-single.html": {
    title: "Project Case Study | ELM Media Design",
    description: "Detailed LFAM project case study from ELM Media Design.",
    ogPath: "project-single.html",
  },
  "contact.html": {
    title: "Contact | ELM Media Design Dubai",
    description:
      "Request a consultation. 30-minute briefing, facility tour, and 72-hour RFQ response.",
    ogPath: "contact.html",
  },
  "leadership.html": {
    title: "Leadership | ELM Media Design",
    description: "ELM Media Design leadership team.",
    ogPath: "leadership.html",
    noindex: true,
  },
  "offices.html": {
    title: "Offices | ELM Media Design",
    description: "ELM Media Design office locations.",
    ogPath: "offices.html",
    noindex: true,
  },
  "news.html": {
    title: "News | ELM Media Design",
    description: "News and insights from ELM Media Design.",
    ogPath: "news.html",
    noindex: true,
  },
  "news-single.html": {
    title: "Article | ELM Media Design",
    description: "ELM Media Design news article.",
    ogPath: "news-single.html",
    noindex: true,
  },
};

const defaultMeta = {
  title: "ELM Media Design",
  description: "Large-format additive manufacturing in Dubai, UAE.",
  ogPath: "",
};

for (const file of globSync("*.html")) {
  const html = fs.readFileSync(file, "utf8");
  if (html.includes("{{> meta")) continue;

  const navEnd = html.indexOf("<!-- end navbar -->");
  const footerStart = html.indexOf('<section class="footer-bar">');
  if (navEnd === -1 || footerStart === -1) {
    console.warn(`Skip ${file}: markers not found`);
    continue;
  }

  const body = html.slice(navEnd + "<!-- end navbar -->".length, footerStart);
  const meta = pageMeta[file] ?? defaultMeta;
  const noindexAttr = meta.noindex ? " noindex=true" : "";

  const wrapped = `<!doctype html>
<html lang="en">
<head>
{{> meta title="${meta.title}" description="${meta.description}" ogPath="${meta.ogPath}"${noindexAttr}}}
{{> head-css}}
</head>
<body>
{{> chrome year="${year}"}}
${body}
{{> footer year="${year}"}}
{{> scripts}}
</body>
</html>
`;

  fs.writeFileSync(file, wrapped);
  console.log(`Wrapped ${file}`);
}
