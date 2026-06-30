import {
  createWriteStream,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "fs";
import { pipeline } from "stream/promises";
import { resolve } from "path";

const root = resolve(".");
const imagesDir = resolve(root, "images");
const backgroundDir = resolve(imagesDir, "background");
const videosDir = resolve(root, "videos");
const q = "?auto=compress&cs=tinysrgb";

for (const dir of [imagesDir, backgroundDir, videosDir]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

const pexels = (id, w = 1600, h) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg${q}&w=${w}${h ? `&h=${h}&fit=crop` : ""}`;

const unsplash = (photoId, w = 1600, h) =>
  `https://images.unsplash.com/photo-${photoId}?w=${w}&q=80&auto=format&fit=crop${h ? `&h=${h}` : ""}`;

/**
 * @type {Record<string, { subject: string; source: string; url: string; w?: number; h?: number; fallbacks?: string[] }>}
 */
const imageAssets = {
  "slide01.jpg": {
    subject: "Industrial robotic LFAM system in production",
    source: "Unsplash",
    url: unsplash("1581091226825-a6a2a5aee158", 1920),
  },
  "slide02.jpg": {
    subject: "Robotic LFAM manufacturing facility",
    source: "Unsplash",
    url: unsplash("1581092160562-40aa08e78837", 1920),
  },
  "slide03.jpg": {
    subject: "Luxury retail interior environment",
    source: "Pexels",
    url: pexels(323705, 1920),
  },
  "slide04.jpg": {
    subject: "Recarlo Milan LFAM architectural wall panels",
    source: "Unsplash",
    url: unsplash("1618221195710-dd6bd9ef3bbf", 1920),
    fallbacks: [unsplash("1560448204-e02f11c3d0e2", 1920)],
  },
  "slide05.jpg": {
    subject: "Urban OOH environment — kinetic media deployment",
    source: "Pexels",
    url: pexels(323780, 1920),
  },
  "slide06.jpg": {
    subject: "Bergamo Airport LFAM service building",
    source: "Unsplash",
    url: unsplash("1581094794329-c8112a89af12", 1920),
    fallbacks: [pexels(8293774, 1920)],
  },
  "slide07.jpg": {
    subject: "Dubai skyline — premium deployment locations",
    source: "Pexels",
    url: pexels(276024, 1920),
  },
  "slide08.jpg": {
    subject: "UAE commercial LFAM programme — Dubai Marina",
    source: "Pexels",
    url: pexels(3787839, 1920),
    fallbacks: [pexels(2404843, 1920), pexels(323705, 1920)],
  },
  "slide09.jpg": {
    subject: "Creative culture public art installation",
    source: "Pexels",
    url: pexels(1193743, 1600, 1133),
  },

  "side-image01.jpg": {
    subject: "Property and infrastructure LFAM facade",
    source: "Pexels",
    url: pexels(323780, 1200),
  },
  "side-image02.jpg": {
    subject: "Hospitality LFAM installation — luxury hotel",
    source: "Pexels",
    url: pexels(1571460, 900),
  },
  "side-image03.jpg": {
    subject: "Creative culture public art sculpture",
    source: "Pexels",
    url: pexels(1193743, 900),
  },

  "step01.jpg": {
    subject: "Digital design and material specification",
    source: "Pexels",
    url: pexels(3861969, 900),
  },
  "step02.jpg": {
    subject: "Robotic LFAM fabrication in progress",
    source: "Pexels",
    url: pexels(4489702, 900),
  },
  "step03.jpg": {
    subject: "On-site installation of printed component",
    source: "Pexels",
    url: pexels(1216589, 900),
  },

  "section-bg01.jpg": {
    subject: "Industrial construction site — dark section backdrop",
    source: "Pexels",
    url: pexels(1108101, 1920),
  },
  "section-bg02.jpg": {
    subject: "Modern architecture — dark section backdrop",
    source: "Pexels",
    url: pexels(442150, 1920),
  },

  "tab01.jpg": {
    subject: "Robotic concrete 3D printing in progress",
    source: "Unsplash",
    url: unsplash("1581094794329-c8112a89af12", 1400),
  },
  "tab02.jpg": {
    subject: "Polymer LFAM facade element",
    source: "Unsplash",
    url: unsplash("1618221195710-dd6bd9ef3bbf", 1400),
    fallbacks: [pexels(256381, 1400)],
  },
  "tab03.jpg": {
    subject: "Custom architectural manufacturing installation",
    source: "Pexels",
    url: pexels(323780, 1400),
  },
  "tab04.jpg": {
    subject: "LFAM design workflow and technical scoping",
    source: "Pexels",
    url: pexels(6476589, 1400),
  },
  "tab05.jpg": {
    subject: "Dubai development and urban growth",
    source: "Pexels",
    url: pexels(3787839, 1400),
    fallbacks: [pexels(2219024, 1400)],
  },

  "certificate01.jpg": {
    subject: "Dubai 3D Printing Strategy 2030",
    source: "Pexels",
    url: pexels(3787839, 800, 1000),
  },
  "certificate02.jpg": {
    subject: "ICV certification alignment — UAE business",
    source: "Pexels",
    url: pexels(3184292, 800, 1000),
  },
  "certificate03.jpg": {
    subject: "UAE Net Zero 2050 — sustainable energy",
    source: "Pexels",
    url: pexels(2804928, 800, 1000),
  },
  "certificate04.jpg": {
    subject: "Dubai 2040 Urban Master Plan",
    source: "Pexels",
    url: pexels(2404843, 800, 1000),
  },

  "video-poster01.jpg": {
    subject: "LFAM facility video poster frame",
    source: "Unsplash",
    url: unsplash("1581092160562-40aa08e78837", 1280, 720),
  },

  "author01.jpg": {
    subject: "ELM Media Design editorial author",
    source: "Unsplash",
    url: unsplash("1472099645785-5658abf4ff4e", 200, 200),
  },

  "team01.jpg": { subject: "Leadership team portrait", source: "Pexels", url: pexels(2379004, 400, 500) },
  "team02.jpg": { subject: "Leadership team portrait", source: "Pexels", url: pexels(774909, 400, 500) },
  "team03.jpg": { subject: "Leadership team portrait", source: "Pexels", url: pexels(415829, 400, 500) },
  "team04.jpg": { subject: "Leadership team portrait", source: "Pexels", url: pexels(1516680, 400, 500) },
  "team05.jpg": { subject: "Leadership team portrait", source: "Pexels", url: pexels(1181690, 400, 500) },
  "team06.jpg": { subject: "Leadership team portrait", source: "Pexels", url: pexels(2182970, 400, 500) },
  "team07.jpg": { subject: "Leadership team portrait", source: "Pexels", url: pexels(3756679, 400, 500) },
  "team08.jpg": { subject: "Leadership team portrait", source: "Pexels", url: pexels(3756681, 400, 500) },
};

const backgroundAssets = {
  "branding-elm-18.jpg": {
    subject: "Home hero — LFAM manufacturing atmosphere",
    source: "Unsplash",
    url: unsplash("1581092160562-40aa08e78837", 1920),
  },
  "bg_elm-1.jpg": {
    subject: "Inner page headers — modern architecture",
    source: "Pexels",
    url: pexels(323780, 1920),
  },
  "bg_elm-4.jpg": {
    subject: "Engagement section — construction programme",
    source: "Pexels",
    url: pexels(1216589, 1920),
    fallbacks: [pexels(1108101, 1920)],
  },
  "branding-elm-7.jpg": {
    subject: "Footer CTA — industrial construction",
    source: "Pexels",
    url: pexels(1108101, 1920),
  },
  "bg_elm.jpg": {
    subject: "Spare — additive manufacturing close-up",
    source: "Pexels",
    url: pexels(4489702, 1920),
  },
  "bg_elm-2.jpg": {
    subject: "Spare — urban OOH environment",
    source: "Pexels",
    url: pexels(276024, 1920),
  },
  "bg_elm-3.jpg": {
    subject: "Spare — architectural LFAM output",
    source: "Pexels",
    url: pexels(3787839, 1920),
  },
  "branding-elm-6.jpg": {
    subject: "Spare — Dubai skyline development",
    source: "Pexels",
    url: pexels(3787839, 1920),
  },
};

const videoAssets = {
  "video01.mp4": {
    subject: "LFAM / 3D printing facility loop",
    source: "Mixkit",
    urls: [
      "https://assets.mixkit.co/videos/21087/21087-720.mp4",
      "https://assets.mixkit.co/videos/16237/16237-720.mp4",
      "https://assets.mixkit.co/videos/23761/23761-720.mp4",
    ],
  },
};

async function downloadFirst(name, urls, dir) {
  const list = Array.isArray(urls) ? urls : [urls];
  for (const url of list) {
    try {
      await download(name, url, dir);
      return;
    } catch (err) {
      console.warn(`skip ${name} ← ${url} (${err.message})`);
    }
  }
  throw new Error(`${name}: all sources failed`);
}

async function download(name, url, dir) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Referer: "https://www.pexels.com/",
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  await pipeline(res.body, createWriteStream(resolve(dir, name)));
  console.log(`OK ${name}`);
}

async function installImage(name, asset) {
  await downloadFirst(name, [asset.url, ...(asset.fallbacks ?? [])], imagesDir);
}

async function downloadVideo(name, urls, dir) {
  await downloadFirst(name, urls, dir);
}

const manifest = { images: {}, backgrounds: {}, videos: {} };

for (const [name, asset] of Object.entries(imageAssets)) {
  await installImage(name, asset);
  manifest.images[name] = {
    subject: asset.subject,
    alt: asset.subject,
    source: asset.source,
    license: "Free stock — replace before launch",
  };
}

for (const [name, asset] of Object.entries(backgroundAssets)) {
  const fallbacks = [asset.url, ...(asset.fallbacks ?? [])];
  await downloadFirst(name, fallbacks, backgroundDir);
  manifest.backgrounds[name] = {
    subject: asset.subject,
    source: asset.source,
    license: "Free stock — replace before launch",
  };
}

for (const [name, asset] of Object.entries(videoAssets)) {
  await downloadVideo(name, asset.urls, videosDir);
  manifest.videos[name] = {
    subject: asset.subject,
    source: asset.source,
    license: "Mixkit License — replace with ELM facility footage",
  };
}

writeFileSync(
  resolve(imagesDir, "placeholders.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8"
);
console.log("Wrote images/placeholders.json");
