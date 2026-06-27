# ELM image asset manifest

Replace template placeholders with final ELM media as it becomes available.

## Refresh placeholders

```bash
pnpm run images:placeholders
```

Downloads subject-matched stock photos and **ELM Wix portfolio** assets (`images/wix-portfolio.json`), writes `images/placeholders.json`, and refreshes `images/background/` brand JPEGs.

Portfolio OOH / retail images (Dubai Watch, THE LOOP, Dubai Eagle, Flouka) are copied from `../../elm-wix-archive/media/` when available.

**Replace all stock media before launch** with client-owned LFAM photography.

## Semantic map

| File | Subject (use as `alt`) | Source |
|------|------------------------|--------|
| `slide01.jpg` | Industrial robotic LFAM system in production | Unsplash |
| `slide02.jpg` | Robotic LFAM manufacturing facility | Unsplash |
| `slide03.jpg` | Luxury retail display — Dubai Watch | ELM client media |
| `slide04.jpg` | Recarlo Milan LFAM architectural wall panels | Unsplash |
| `slide05.jpg` | Oval digital billboard — THE LOOP OOH | ELM client media |
| `slide06.jpg` | Bergamo Airport LFAM service building | Unsplash |
| `slide07.jpg` | Dubai Eagle OOH installation skyline | ELM client media |
| `slide08.jpg` | UAE commercial LFAM programme — Dubai Marina | Pexels |
| `slide09.jpg` | The Flouka creative OOH installation | ELM client media |
| `side-image01.jpg` | Property and infrastructure LFAM facade | Pexels |
| `side-image02.jpg` | Dubai Watch luxury retail OOH display | ELM client media |
| `side-image03.jpg` | The Flouka creative OOH monument | ELM client media |
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
| `video-poster01.jpg` | Oval Digital Billboard video poster | ELM client media |
| `author01.jpg` | ELM editorial author | Unsplash |
| `team01–08.jpg` | Leadership team portraits (noindex page) | Pexels |
| `videos/video01.mp4` | LFAM / construction facility loop | ELM client media |

Project galleries: **`images/projects/`** (`dubai-watch/`, `oval-digital-billboard/`, `dubai-eagle/`, `the-flouka/`). Raw zip extract kept locally in `images/elm-source/` (gitignored).

Machine-readable registry: **`images/placeholders.json`** · Wix project map: **`images/wix-portfolio.json`**

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
