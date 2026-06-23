# ELM image asset manifest

Replace template placeholders with final ELM media as it becomes available.

## Refresh placeholders

```bash
pnpm run images:placeholders
```

Downloads subject-matched stock photos from **Pexels / Unsplash / Mixkit**, writes `images/placeholders.json` (semantic alt text per file), and refreshes `images/background/` brand JPEGs.

**Replace all stock media before launch** with client-owned LFAM photography.

## Semantic map

| File | Subject (use as `alt`) | Source |
|------|------------------------|--------|
| `slide01.jpg` | Industrial robotic LFAM system in production | Unsplash |
| `slide02.jpg` | Robotic LFAM manufacturing facility | Unsplash |
| `slide03.jpg` | Luxury retail display — Dubai Watch | Pexels |
| `slide04.jpg` | Recarlo Milan LFAM architectural wall panels | Pexels |
| `slide05.jpg` | Oval digital billboard — THE LOOP OOH | Pexels |
| `slide06.jpg` | Bergamo Airport LFAM service building | Pexels |
| `slide07.jpg` | Dubai Eagle OOH installation skyline | Pexels |
| `slide08.jpg` | UAE commercial LFAM programme — Dubai Marina | Pexels |
| `slide09.jpg` | The Flouka creative OOH installation | ELM Wix portfolio |
| `side-image01.jpg` | Property and infrastructure LFAM facade | Pexels |
| `side-image02.jpg` | Hospitality LFAM installation — luxury hotel | Pexels |
| `side-image03.jpg` | Creative culture public art sculpture | Pexels |
| `step01.jpg` | Digital design and material specification | Pexels |
| `step02.jpg` | Robotic LFAM fabrication in progress | Pexels |
| `step03.jpg` | On-site installation of printed component | Pexels |
| `section-bg01.jpg` | Industrial construction — dark section backdrop | Pexels |
| `section-bg02.jpg` | Modern architecture — dark section backdrop | Pexels |
| `tab01.jpg` | Robotic concrete 3D printing in progress | Unsplash |
| `tab02.jpg` | Polymer LFAM facade element | Pexels |
| `tab03.jpg` | Custom architectural manufacturing installation | Pexels |
| `tab04.jpg` | LFAM design workflow and technical scoping | Pexels |
| `tab05.jpg` | Dubai development and urban growth | Pexels |
| `certificate01–04.jpg` | UAE policy cards (Dubai 2030, ICV, Net Zero, 2040) | Pexels |
| `video-poster01.jpg` | LFAM facility video poster frame | Pexels |
| `author01.jpg` | ELM editorial author | Unsplash |
| `team01–08.jpg` | Leadership team portraits (noindex page) | Pexels |
| `videos/video01.mp4` | LFAM / 3D printing facility loop | Mixkit |

Machine-readable registry: **`images/placeholders.json`**

## Logo

| File | Source | Use |
|------|--------|-----|
| `logo.svg` | `ico/logo/logo_ELM_svg.svg` | Nav, footer, side menu |
| `logo.png` | `ico/logo/logo_ELMx1.png` | OG, Twitter, JSON-LD |
| `ico/favicon.svg` | `ico/logo/logo_ELM_svg.svg` | Tab icon — `pnpm run favicons:generate` |

## Brand backgrounds (`images/background/`)

Gradient: **#BD1F71 → #592C7B → #0A76B5** (`$gradient-brand` in SCSS).

JPEG backgrounds use `$bg-photo-overlay`: black 60% → 50%. Footer CTA uses `$bg-photo-overlay-heavy`.

| File | Subject | Used on |
|------|---------|---------|
| `branding-elm-18.jpg` | LFAM manufacturing atmosphere | Home hero slideshow |
| `bg_elm-1.jpg` | Modern architecture | Inner page headers |
| `bg_elm-4.jpg` | Construction programme | Calculator section |
| `branding-elm-7.jpg` | Industrial construction | Footer CTA bar |
| `bg_elm.jpg`, `bg_elm-2/3.jpg`, `branding-elm-6.jpg` | Spare themed backdrops | Future sections |

Service icons use **LineIcons** — no PNG placeholders.
