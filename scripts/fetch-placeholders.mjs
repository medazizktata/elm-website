import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { resolve } from "path";

const out = resolve("images");
const q = "?auto=compress&cs=tinysrgb";

/** Pexels / Unsplash — temporary placeholders; replace with client LFAM assets */
const assets = {
  "slide01.jpg": `https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg${q}&w=1600`,
  "slide02.jpg": `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80`,
  "slide03.jpg": `https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg${q}&w=1600`,
  "slide04.jpg": `https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg${q}&w=1600`,
  "slide05.jpg": `https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg${q}&w=1600`,
  "slide06.jpg": `https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg${q}&w=1600`,
  "slide07.jpg": `https://images.pexels.com/photos/276024/pexels-photo-276024.jpeg${q}&w=1600`,
  "slide08.jpg": `https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg${q}&w=1600`,
  "step01.jpg": `https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg${q}&w=800`,
  "step02.jpg": `https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg${q}&w=800`,
  "step03.jpg": `https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg${q}&w=800`,
  "section-bg01.jpg": `https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg${q}&w=1920`,
  "section-bg02.jpg": `https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg${q}&w=1920`,
  "tab01.jpg": `https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg${q}&w=1200`,
  "tab02.jpg": `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80`,
  "tab03.jpg": `https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg${q}&w=1200`,
  "tab04.jpg": `https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg${q}&w=1200`,
  "tab05.jpg": `https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg${q}&w=1200`,
  "author01.jpg": `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80`,
};

async function download(name, url) {
  const res = await fetch(url, { headers: { "User-Agent": "ELM-website-placeholder-fetch" } });
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  await pipeline(res.body, createWriteStream(resolve(out, name)));
  console.log(`OK ${name}`);
}

for (const [name, url] of Object.entries(assets)) {
  await download(name, url);
}
