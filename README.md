# ELM Media Design, Website

Marketing website for **ELM Media Design**, a Dubai-based large-format additive manufacturing (LFAM) company.

**Live repo:** [github.com/medazizktata/elm-website](https://github.com/medazizktata/elm-website) (private)

**Production domain:** [theelmdesign.com](https://www.theelmdesign.com)

---

## About ELM

ELM Media Design provides industrial 3D printing at architectural scale, robotic concrete printing, polymer LFAM, and end-to-end architectural manufacturing for developers, hospitality, government, and the built environment in the UAE.

---

## Site structure (target)

| Section | Pages |
|---------|-------|
| Home | Hero, technologies, industries, Why ELM, featured projects |
| About | Who We Are, Our Story, Why ELM |
| Technologies | Overview + Robotic Concrete, Polymer LFAM, Architectural Manufacturing |
| Solutions | Overview + 5 industry verticals (incl. THE LOOP OOH) |
| Projects | Portfolio with case studies |
| Contact | Form, Dubai location, 4-step engagement process |

Content and IA are defined in the project `Docs/website_proposal.pdf`.

---

## Tech stack

- Static HTML, CSS, JavaScript
- Bootstrap 4
- Swiper, Isotope, Fancybox, Odometer
- SCSS (`src/scss/style.scss` → `css/style.css`)

---

## Brand

From `Docs/branding elm.pdf`:

| Token | Hex |
|-------|-----|
| Dark | `#121212` |
| Magenta (primary) | `#BD1F71` |
| Blue | `#0A76B5` |
| Purple | `#592C7B` |
| Cream (background) | `#ECEBE4` |
| White | `#FFFFFF` |

**Typography:** Nohemi Bold / SemiBold (EN) · Readex Pro Bold / SemiBold / Regular (AR), `pnpm run fonts:setup` after install.

Edit brand tokens in `src/scss/style.scss` (`$color-dark`, `$color-main`, etc.), then recompile.

---

## Local development

```bash
pnpm install
pnpm run fonts:setup   # first time / after font deps update
pnpm dev               # http://localhost:5173
pnpm run build         # dist/
pnpm run sass          # compile SCSS
pnpm run deploy        # build + wrangler deploy (local)
pnpm run deploy:ci     # wrangler deploy only (Cloudflare CI)
pnpm run images:placeholders
```

---

## Cloudflare Workers deployment

Production runs on **Cloudflare Workers** (`elm-website`), not GitHub Pages.

**Workers Builds settings** (Cloudflare dashboard → Workers → elm-website → Settings → Builds):

| Setting | Value |
|---------|-------|
| Build command | `pnpm build` |
| Deploy command | `pnpm run deploy:ci` |
| Node | 22 |

Apex → www redirect is handled in `worker/index.js` (301 to `www.theelmdesign.com`). Requires `run_worker_first = true` in `wrangler.toml` so the worker runs before static assets.

**Fallback (dashboard only if worker redirect fails):** Rules → Redirect Rules → When `(http.host eq "theelmdesign.com")` → 301 to `concat("https://www.theelmdesign.com", http.request.uri.path)`.

```bash
pnpm run deploy        # local: build + deploy
pnpm exec wrangler deploy   # deploy dist/ only
```

---

## Project layout

```
├── pages/                  # HTML pages (flat URLs in dist/)
├── partials/               # Handlebars partials
├── src/
│   ├── scss/               # Source styles → css/style.css
│   ├── js/                 # App scripts (synced to public/js)
│   └── hero-3d/            # Three.js hero (Vite module)
├── vendor/js/              # Third-party JS (synced to public/js)
├── css/                    # Compiled + vendor CSS
├── images/ fonts/ videos/ ico/ locales/
├── scripts/                # Build tooling
├── worker/                 # Cloudflare Worker
├── robots.txt sitemap.xml  # Generated / static SEO
└── wrangler.toml
```

---

## Assets

Replace files in `images/` with ELM photography, robot/process video, THE LOOP visuals, and logo (`images/logo.png`) as they become available.

---

## Contact (business)

- **Mobile:** +971 56 466 3334
- **Email:** amin@letsadsmedia.com
- **Website:** www.theelmdesign.com
- **Location:** Dubai, UAE

---

## Related documentation

Stored in the parent ELM project `Docs/` folder (not in this repo):

- `website_proposal.pdf`, site IA and content spec
- `branding elm.pdf`, visual identity and tone
- `corporate profile 2026 ELM.pdf`, company copy
- `ELM presentation.pdf`, proof points and case studies

---

## License

© ELM Media Design / Propagenda.
