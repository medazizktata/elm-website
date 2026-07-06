import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.resolve(siteRoot, '../../../../Docs');
const imagesRoot = path.join(siteRoot, 'images');
const archiveRoot = path.join(imagesRoot, 'elm-source');

/** @type {Array<{ dest: string; src: string; archive?: string }>} */
const mapping = [
  { dest: 'slide01.jpg', src: 'ELM presentation/5.png', archive: 'wasp-crane-dome-print.jpg' },
  { dest: 'slide02.jpg', src: 'corporate profile 2026 ELM/15.jpg', archive: 'concrete-print-aerial.jpg' },
  { dest: 'slide03.jpg', src: 'corporate profile 2026 ELM/6.jpg', archive: 'modular-3d-printed-pods.jpg' },
  { dest: 'slide04.jpg', src: 'ELM presentation/41.jpg', archive: 'recarlo-milan-interior.jpg' },
  { dest: 'slide05.jpg', src: 'corporate profile 2026 ELM/16.jpg', archive: 'the-loop-dubai-geodesic.jpg' },
  { dest: 'slide06.jpg', src: 'ELM presentation/42.jpg', archive: 'bergamo-airport-building.jpg' },
  { dest: 'slide07.jpg', src: 'ELM presentation/14.png', archive: 'infrastructure-highway.jpg' },
  { dest: 'slide08.jpg', src: 'ELM presentation/35.jpg', archive: 'dubai-skyline-night.jpg' },
  { dest: 'slide09.jpg', src: 'corporate profile 2026 ELM/14.jpg', archive: 'urban-plaza-architecture.jpg' },
  { dest: 'tab01.jpg', src: 'corporate profile 2026 ELM/4.jpg', archive: 'robotic-concrete-extrusion.jpg' },
  { dest: 'tab02.jpg', src: 'corporate profile 2026 ELM/7.jpg', archive: 'polymer-lattice-structure.jpg' },
  { dest: 'tab03.jpg', src: 'corporate profile 2026 ELM/8.jpg', archive: 'architectural-manufacturing-render.jpg' },
  { dest: 'tab04.jpg', src: 'corporate profile 2026 ELM/23.jpg', archive: 'engagement-hourglass.jpg' },
  { dest: 'tab05.jpg', src: 'ELM presentation/35.jpg', archive: 'dubai-marina-policy.jpg' },
  { dest: 'step01.jpg', src: 'corporate profile 2026 ELM/22.jpg', archive: 'digital-design-mesh.jpg' },
  { dest: 'step02.jpg', src: 'corporate profile 2026 ELM/11.jpg', archive: 'industrial-robot-arm.jpg' },
  { dest: 'step03.jpg', src: 'corporate profile 2026 ELM/10.jpg', archive: 'printed-building-install.jpg' },
  { dest: 'side-image01.jpg', src: 'ELM presentation/13.png', archive: 'property-dubai-tower.jpg' },
  { dest: 'side-image02.jpg', src: 'ELM presentation/41.jpg', archive: 'hospitality-recarlo.jpg' },
  { dest: 'side-image03.jpg', src: 'corporate profile 2026 ELM/8.jpg', archive: 'creative-culture-render.jpg' },
  { dest: 'video-poster01.jpg', src: 'ELM presentation/6.png', archive: 'lfam-robot-concrete-walls.jpg' },
  { dest: 'section-bg01.jpg', src: 'ELM presentation/12.jpg', archive: 'abstract-tech-bg-01.jpg' },
  { dest: 'section-bg02.jpg', src: 'corporate profile 2026 ELM/9.jpg', archive: 'abstract-tech-bg-02.jpg' },
  { dest: 'section-bg-industrial.jpg', src: 'corporate profile 2026 ELM/11.jpg', archive: 'industrial-robot-lfam-bg.jpg' },
  { dest: 'background/branding-elm-18.jpg', src: 'ELM presentation/6.png', archive: 'hero-lfam-robot.jpg' },
  { dest: 'background/bg_elm-1.jpg', src: 'corporate profile 2026 ELM/1.jpg', archive: 'elm-brand-header.jpg' },
  { dest: 'background/branding-elm-7.jpg', src: 'corporate profile 2026 ELM/5.jpg', archive: 'footer-abstract-brand.jpg' },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function pngToJpeg(srcPath, destPath) {
  const script = [
    'Add-Type -AssemblyName System.Drawing',
    `$img = [System.Drawing.Image]::FromFile('${srcPath.replace(/'/g, "''")}')`,
    `$img.Save('${destPath.replace(/'/g, "''")}', [System.Drawing.Imaging.ImageFormat]::Jpeg)`,
    '$img.Dispose()',
  ].join('; ');

  const result = spawnSync(
    'powershell',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script],
    { encoding: 'utf8' },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Failed converting ${srcPath}`);
  }
}

function writeImage(srcPath, destPath) {
  const ext = path.extname(srcPath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    fs.copyFileSync(srcPath, destPath);
    return;
  }
  if (ext === '.png') {
    pngToJpeg(srcPath, destPath);
    return;
  }
  throw new Error(`Unsupported image type: ${srcPath}`);
}

ensureDir(imagesRoot);
ensureDir(archiveRoot);
ensureDir(path.join(imagesRoot, 'background'));

let copied = 0;
for (const { dest, src, archive } of mapping) {
  const srcPath = path.join(docsRoot, src);
  const destPath = path.join(imagesRoot, dest);
  if (!fs.existsSync(srcPath)) {
    console.warn(`skip missing: ${src}`);
    continue;
  }
  ensureDir(path.dirname(destPath));
  writeImage(srcPath, destPath);
  if (archive) {
    writeImage(srcPath, path.join(archiveRoot, archive));
  }
  copied += 1;
  console.log(`${src} -> ${dest}`);
}

console.log(`\nSynced ${copied} doc images into images/`);
