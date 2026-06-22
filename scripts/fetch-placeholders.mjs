import { createWriteStream, existsSync, mkdirSync } from "fs";
import { pipeline } from "stream/promises";
import { resolve } from "path";

const root = resolve(".");
const imagesDir = resolve(root, "images");
const videosDir = resolve(root, "videos");
const q = "?auto=compress&cs=tinysrgb";

if (!existsSync(videosDir)) mkdirSync(videosDir, { recursive: true });

/** Pexels / Unsplash — temporary; replace with client LFAM media before launch */
const imageAssets = {
  // Hero + projects
  "slide01.jpg": `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80`,
  "slide02.jpg": `https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg${q}&w=1600`,
  "slide03.jpg": `https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg${q}&w=1600`,
  "slide04.jpg": `https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg${q}&w=1600`,
  "slide05.jpg": `https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg${q}&w=1600`,
  "slide06.jpg": `https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg${q}&w=1600`,
  "slide07.jpg": `https://images.pexels.com/photos/276024/pexels-photo-276024.jpeg${q}&w=1600`,
  "slide08.jpg": `https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg${q}&w=1600`,
  // Side collage (WHO WE ARE, About, History)
  "side-image01.jpg": `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80`,
  "side-image02.jpg": `https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg${q}&w=700`,
  "side-image03.jpg": `https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg${q}&w=700`,
  // Process steps
  "step01.jpg": `https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg${q}&w=800`,
  "step02.jpg": `https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg${q}&w=800`,
  "step03.jpg": `https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg${q}&w=800`,
  // Section backgrounds
  "section-bg01.jpg": `https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg${q}&w=1920`,
  "section-bg02.jpg": `https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg${q}&w=1920`,
  // Technology tabs
  "tab01.jpg": `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80`,
  "tab02.jpg": `https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg${q}&w=1200`,
  "tab03.jpg": `https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg${q}&w=1200`,
  "tab04.jpg": `https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg${q}&w=1200`,
  "tab05.jpg": `https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg${q}&w=1200`,
  "video-poster01.jpg": `https://assets.mixkit.co/videos/21087/21087-thumb-720-0.jpg`,
  "certificate01.jpg": `https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg${q}&w=800&h=1000&fit=crop`,
  "certificate02.jpg": `https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg${q}&w=800&h=1000&fit=crop`,
  "certificate03.jpg": `https://images.pexels.com/photos/2804928/pexels-photo-2804928.jpeg${q}&w=800&h=1000&fit=crop`,
  "certificate04.jpg": `https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg${q}&w=800&h=1000&fit=crop`,
  "author01.jpg": `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80`,
  "team01.jpg": `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg${q}&w=400&h=500&fit=crop`,
  "team02.jpg": `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg${q}&w=400&h=500&fit=crop`,
  "team03.jpg": `https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg${q}&w=400&h=500&fit=crop`,
  "team04.jpg": `https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg${q}&w=400&h=500&fit=crop`,
  "team05.jpg": `https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg${q}&w=400&h=500&fit=crop`,
  "team06.jpg": `https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg${q}&w=400&h=500&fit=crop`,
  "team07.jpg": `https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg${q}&w=400&h=500&fit=crop`,
  "team08.jpg": `https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg${q}&w=400&h=500&fit=crop`,
};

const videoAssets = {
  "video01.mp4": [
    "https://assets.mixkit.co/videos/21087/21087-720.mp4",
    "https://assets.mixkit.co/videos/16237/16237-720.mp4",
    "https://assets.mixkit.co/videos/23761/23761-720.mp4",
  ],
};

async function download(name, url, dir) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Referer: "https://www.pexels.com/",
    },
  });
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  await pipeline(res.body, createWriteStream(resolve(dir, name)));
  console.log(`OK ${name}`);
}

async function downloadVideo(name, urls, dir) {
  for (const url of urls) {
    try {
      await download(name, url, dir);
      return;
    } catch (err) {
      console.warn(`skip ${url} — ${err.message}`);
    }
  }
  throw new Error(`${name}: all sources failed`);
}

for (const [name, url] of Object.entries(imageAssets)) {
  await download(name, url, imagesDir);
}

for (const [name, urls] of Object.entries(videoAssets)) {
  await downloadVideo(name, urls, videosDir);
}
