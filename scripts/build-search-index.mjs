import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";
import { basename, resolve } from "path";

const root = resolve(".");
const outPath = resolve(root, "js/search-index.json");

const categoryByFile = {
  "index.html": "Home",
  "about-company.html": "About",
  "our-history.html": "About",
  "core-values.html": "About",
  "certificates.html": "About",
  "services.html": "Technologies",
  "technology-robotic-concrete.html": "Technologies",
  "technology-polymer-lfam.html": "Technologies",
  "technology-architectural-manufacturing.html": "Technologies",
  "solutions.html": "Solutions",
  "solution-property-infrastructure.html": "Solutions",
  "solution-industrial-mobility.html": "Solutions",
  "solution-ooh-the-loop.html": "Solutions",
  "solution-hospitality-leisure.html": "Solutions",
  "solution-creative-culture.html": "Solutions",
  "projects.html": "Projects",
  "project-recarlo-milan.html": "Projects",
  "project-bergamo-airport.html": "Projects",
  "contact.html": "Contact",
  "leadership.html": "About",
  "offices.html": "Contact",
  "news.html": "News",
  "news-single.html": "News",
};

const keywordExtras = {
  "index.html": [
    "LFAM",
    "3D printing",
    "Dubai",
    "UAE",
    "facades",
    "hospitality",
    "government",
    "concrete",
    "polymer",
    "robotic",
    "consultation",
  ],
  "about-company.html": ["who we are", "LFAM", "fabrication", "engagement", "architectural scale"],
  "our-history.html": ["story", "timeline", "founding", "Europe", "UAE capability"],
  "core-values.html": ["why ELM", "differentiators", "sustainability", "agile"],
  "certificates.html": ["compliance", "ICV", "Dubai 2030", "Net Zero", "Dubai 2040", "policy"],
  "services.html": ["technologies", "robotic concrete", "polymer", "LFAM", "manufacturing", "capabilities"],
  "solutions.html": ["solutions", "industries", "verticals", "THE LOOP", "hospitality", "infrastructure"],
  "solution-ooh-the-loop.html": ["THE LOOP", "OOH", "out of home", "robotic media", "LED", "kinetic"],
  "projects.html": ["portfolio", "case studies", "LFAM projects", "Recarlo", "Bergamo", "OOH", "THE LOOP"],
  "project-recarlo-milan.html": ["Recarlo", "Milan", "retail", "polymer", "Caracol"],
  "project-bergamo-airport.html": ["Bergamo", "airport", "concrete", "WASP", "infrastructure"],
  "contact.html": ["consultation", "RFQ", "phone", "email", "facility tour", "Dubai HQ", "+971"],
  "leadership.html": ["team", "leadership", "management"],
  "offices.html": ["office", "location", "Dubai"],
};

const quickLinks = [
  { title: "Technologies & LFAM", url: "services.html", category: "Quick link" },
  { title: "Industry Solutions", url: "solutions.html", category: "Quick link" },
  { title: "THE LOOP OOH", url: "solution-ooh-the-loop.html", category: "Quick link" },
  { title: "View Projects", url: "projects.html", category: "Quick link" },
  { title: "Request Consultation", url: "contact.html", category: "Quick link" },
  { title: "Who We Are", url: "about-company.html", category: "Quick link" },
  { title: "UAE Compliance", url: "certificates.html", category: "Quick link" },
];

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractMeta(content) {
  const match = content.match(/\{\{>\s*meta\s+title="([^"]+)"\s+description="([^"]+)"/);
  if (!match) return null;
  return { title: match[1], description: match[2] };
}

function extractHeading(content) {
  const partial = content.match(/\{\{>\s*page-header\s+title="([^"]+)"(?:\s+subtitle="([^"]+)")?/);
  if (partial) {
    return { heading: partial[1], subtitle: partial[2] || "" };
  }

  const pageHeader = content.match(/<header class="page-header">[\s\S]*?<h1>([\s\S]*?)<\/h1>/);
  if (pageHeader) {
    const subtitleMatch = content.match(/<header class="page-header">[\s\S]*?<h6>([\s\S]*?)<\/h6>/);
    return {
      heading: stripHtml(pageHeader[1]),
      subtitle: subtitleMatch ? stripHtml(subtitleMatch[1]) : "",
    };
  }

  const hero = content.match(/<h1>([\s\S]*?)<\/h1>/);
  if (hero) {
    return { heading: stripHtml(hero[1]), subtitle: "" };
  }

  return { heading: "", subtitle: "" };
}

const junkPatterns = [
  /small programs perfect for beginners/i,
  /lorem ipsum/i,
  /compliment interested discretion/i,
  /to they four in love/i,
  /Consto Construction/i,
  /Life Science Center/i,
];

function isJunkText(text) {
  if (!text) return true;
  return junkPatterns.some(function (re) {
    return re.test(text);
  });
}

function extractParagraphs(content) {
  const body = content.replace(/^[\s\S]*?<body>/i, "").replace(/<\/body>[\s\S]*$/, "");
  const paragraphs = [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripHtml(m[1]))
    .filter((p) => p.length > 30 && !isJunkText(p) && !/^(HOME|PREV|NEXT)$/i.test(p));
  return paragraphs.slice(0, 3).join(" ");
}

function extractProjects(content, file) {
  if (file !== "projects.html") return [];
  const urlByTitle = {
    "Recarlo Milan": "project-recarlo-milan.html",
    "Bergamo Airport": "project-bergamo-airport.html",
    "UAE Commercial LFAM": "contact.html#consultation-form",
    "Oval Digital Billboard": "solution-ooh-the-loop.html",
    "Dubai Eagle": "solution-ooh-the-loop.html",
    "The Flouka": "solution-ooh-the-loop.html",
    "Dubai Watch": "solution-ooh-the-loop.html",
  };
  return [...content.matchAll(/<h5>([^<]+)<\/h5>/g)].map((m, i) => ({
    id: `project-${i + 1}`,
    title: m[1].trim(),
    heading: m[1].trim(),
    description: "LFAM project in the ELM portfolio.",
    url: urlByTitle[m[1].trim()] || "projects.html",
    category: "Project",
    keywords: ["project", "portfolio", "LFAM", m[1].trim().toLowerCase()],
  }));
}

const items = [];

for (const filePath of globSync("*.html", { cwd: root })) {
  const file = basename(filePath);
  const content = readFileSync(resolve(root, filePath), "utf8");
  const meta = extractMeta(content);
  if (!meta) continue;

  const { heading, subtitle } = extractHeading(content);
  const cleanSubtitle = isJunkText(subtitle) ? "" : subtitle;
  const excerptRaw = extractParagraphs(content);
  const excerpt = isJunkText(excerptRaw) ? meta.description : excerptRaw || meta.description;
  const noindex = /\bnoindex\s*=\s*true/.test(content);

  items.push({
    id: file.replace(".html", ""),
    title: meta.title,
    heading: heading || meta.title.split("|")[0].trim(),
    subtitle: cleanSubtitle,
    description: meta.description,
    excerpt,
    url: file === "index.html" ? "index.html" : file,
    category: categoryByFile[file] || "Page",
    keywords: keywordExtras[file] || [],
    noindex,
  });

  items.push(...extractProjects(content, file));
}

const payload = {
  version: 1,
  generated: new Date().toISOString(),
  items: items.filter((item) => !item.noindex),
  quickLinks,
};

writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${items.filter((i) => !i.noindex).length} search entries to js/search-index.json`);
