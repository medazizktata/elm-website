# ELM image asset manifest

Replace template placeholders with final ELM media as it becomes available.

## Temporary placeholders (v1)

Run `pnpm run images:placeholders` to refresh stock photos and video from **Pexels / Unsplash** (free licence — replace before launch with client-owned LFAM photography).

| File | Current source | Intended final use |
|------|----------------|-------------------|
| `slide01–08.jpg` | Pexels/Unsplash | Hero, projects, timeline |
| `side-image01–03.jpg` | Pexels/Unsplash | WHO WE ARE collage, About sections |
| `step01–03.jpg` | Pexels | Engagement process |
| `section-bg01–02.jpg` | Pexels | Dark section backgrounds (black + blue overlay in CSS) |
| `tab01–05.jpg` | Pexels | Technology gallery (B4) |
| `certificate01–04.jpg` | Pexels | UAE compliance cards (policy imagery until official badges) |
| `video-poster01.jpg` | Pexels | Video section poster frame |
| `author01.jpg` | Unsplash | Contact avatar |
| `team01–08.jpg` | Pexels/Unsplash | Leadership page (noindex) |
| `videos/video01.mp4` | Pexels | LFAM / 3D printing loop (replace with ELM facility footage) |

Service icons use **LineIcons** (`lni-cog`, `lni-construction`, `lni-world`) — no PNG placeholders.

## Logo

| File | Source | Use |
|------|--------|-----|
| `logo.svg` | `ico/logo/logo_ELM_svg.svg` | Nav, footer, side menu (transparent mark) |
| `logo.png` | `ico/logo/logo_ELMx1.png` | OG, Twitter, JSON-LD |
| `ico/favicon.svg` | `ico/logo/logo_ELM_svg.svg` | Tab icon (SVG) — `pnpm run favicons:generate` |
| — | `ico/logo/logo_ELM.png` | Master / print only (full lockup, not used on site) |

## Brand backgrounds (`images/background/`)

Gradient: **#BD1F71 → #592C7B → #0A76B5** (also in `$gradient-brand` SCSS).

JPEG backgrounds use `$bg-photo-overlay`: **black 60% → 50%** (minimum 50% opacity). Footer CTA uses `$bg-photo-overlay-heavy` (75% → 55%).

| File | Used on |
|------|---------|
| `branding-elm-18.jpg` | Home hero (`.slider`) |
| `bg_elm-1.jpg` | Inner page headers (`.page-header`) |
| `bg_elm-4.jpg` | Calculator section |
| `branding-elm-7.jpg` | Footer CTA bar (`.footer-bar`) |
| `bg_elm.jpg`, `bg_elm-2.jpg`, `bg_elm-3.jpg`, `branding-elm-6.jpg` | Spare / future sections |

Deprecated template PNGs (`icon01–03`, `certificate01–04`, `side-image01.png`) — no longer referenced in HTML.
