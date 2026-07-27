import { existsSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import sharp from "sharp";

const root = resolve(".");
const imagesDir = resolve(root, "images");

const jobs = [
  {
    input: "hero-abstract-elm.png",
    outputs: [
      { file: "hero-abstract-elm.webp", width: 1920, format: "webp", quality: 82 },
      { file: "hero-abstract-elm.avif", width: 1920, format: "avif", quality: 55 },
    ],
  },
  {
    input: "video-poster01.jpg",
    outputs: [
      { file: "video-poster01-400.webp", width: 640, format: "webp", quality: 68 },
      { file: "video-poster01.webp", width: 800, format: "webp", quality: 72 },
      { file: "video-poster01.avif", width: 800, format: "avif", quality: 48 },
    ],
  },
  {
    input: "step02.jpg",
    outputs: [
      { file: "step02-400.webp", width: 400, format: "webp", quality: 80 },
      { file: "step02-800.webp", width: 800, format: "webp", quality: 82 },
    ],
  },
  ...["01", "02", "03", "04", "05", "06"].flatMap((n) => [
    {
      input: `bg-gradient-${n}.jpg`,
      outputs: [
        { file: `bg-gradient-${n}.webp`, width: 1920, format: "webp", quality: 82 },
        { file: `bg-gradient-${n}.avif`, width: 1920, format: "avif", quality: 52 },
      ],
    },
  ]),
  ...["step01", "step03"].flatMap((base) => [
    {
      input: `${base}.jpg`,
      outputs: [
        { file: `${base}-400.webp`, width: 400, format: "webp", quality: 80 },
        { file: `${base}-800.webp`, width: 800, format: "webp", quality: 82 },
      ],
    },
  ]),
  ...[
    "slide04",
    "slide05",
    "slide06",
    "slide07",
    "slide08",
    "slide01-gradient",
    "tab01",
    "tab02",
    "tab03",
    "side-image01",
    "side-image02",
    "side-image03",
    "sticky-concrete",
    "sticky-polymer",
    "sticky-architecture",
    "lfam-robot-gradient",
    "tab01-gradient",
    "tab05",
    "spec-concrete",
    "spec-polymer",
    "spec-architecture",
    "tech-platform",
    "tech-stack-concrete",
  ].flatMap((base) => [
    {
      input: `${base}.jpg`,
      outputs: [
        { file: `${base}-400.webp`, width: 400, format: "webp", quality: 80 },
        { file: `${base}-800.webp`, width: 800, format: "webp", quality: 82 },
        { file: `${base}-1200.webp`, width: 1200, format: "webp", quality: 82 },
      ],
    },
  ]),
  {
    input: "logo-full.png",
    outputs: [{ file: "logo-full.webp", width: 416, format: "webp", quality: 88 }],
  },
  {
    input: "logo-full-dark.png",
    outputs: [{ file: "logo-full-dark.webp", width: 416, format: "webp", quality: 88 }],
  },
  {
    input: "background/branding-elm-18.jpg",
    outputs: [
      { file: "background/branding-elm-18-400.webp", width: 400, format: "webp", quality: 80 },
      { file: "background/branding-elm-18-800.webp", width: 800, format: "webp", quality: 82 },
      { file: "background/branding-elm-18-1200.webp", width: 1200, format: "webp", quality: 82 },
    ],
  },
  {
    input: "section-bg02.jpg",
    outputs: [{ file: "section-bg02.webp", width: 1920, format: "webp", quality: 82 }],
  },
  {
    input: "section-bg-industrial.jpg",
    outputs: [{ file: "section-bg-industrial.webp", width: 1920, format: "webp", quality: 82 }],
  },
  {
    input: "bg-partners-gradient.jpg",
    outputs: [{ file: "bg-partners-gradient.webp", width: 1920, format: "webp", quality: 82 }],
  },
];

async function encode(inputPath, outPath, { width, format, quality }) {
  mkdirSync(dirname(outPath), { recursive: true });
  let pipeline = sharp(inputPath).rotate().resize({ width, withoutEnlargement: true });

  if (format === "webp") {
    pipeline = pipeline.webp({ quality, effort: 4 });
  } else if (format === "avif") {
    pipeline = pipeline.avif({ quality, effort: 4 });
  }

  await pipeline.toFile(outPath);
  const meta = await sharp(outPath).metadata();
  console.log(`OK ${outPath.replace(imagesDir + "/", "")} (${meta.width}x${meta.height})`);
}

for (const job of jobs) {
  const inputPath = resolve(imagesDir, job.input);
  if (!existsSync(inputPath)) {
    console.warn(`Skip missing ${job.input}`);
    continue;
  }

  for (const output of job.outputs) {
    await encode(inputPath, resolve(imagesDir, output.file), output);
  }
}
