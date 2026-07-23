# ELM Media Design, Website

Marketing website for **ELM Media Design**, a Dubai-based large-format additive manufacturing (LFAM) company. Built on the [Consto](https://themezinho.net) industrial HTML template, customized to ELM brand guidelines and content requirements.

**Live repo:** [github.com/medazizktata/elm-website](https://github.com/medazizktata/elm-website) (private)

**Production domain:** [elmmdesign.com](https://www.elmmdesign.com)

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
- SCSS (`scss/style.scss` → `css/style.css`)

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

Edit brand tokens in `scss/style.scss` (`$color-dark`, `$color-main`, etc.), then recompile.

---

## Local development

```bash
pnpm install
pnpm run fonts:setup   # first time / after font deps update
pnpm dev               # http://localhost:5173
pnpm run build         # dist/
pnpm run sass          # compile SCSS
pnpm run images:placeholders
```

---

## Project layout

```
├── index.html              # Home
├── who-we-are.html      # About
├── technologies.html           # Technologies (base template)
├── projects.html           # Portfolio grid
├── project-recarlo-milan.html
├── project-bergamo-airport.html
├── project-single.html     # Redirect → projects (noindex)
├── contact.html
├── robots.txt              # Crawl rules (copied to dist/)
├── sitemap.xml             # Generated on build (19 indexable URLs)
├── css/                    # Compiled styles
├── scss/                   # Source styles (edit here)
├── js/                     # Scripts
├── images/                 # Site images (replace with ELM assets)
├── fonts/
└── videos/
```

---

## Assets

Template ships with placeholder images. Replace files in `images/` with ELM photography, robot/process video, THE LOOP visuals, and logo (`images/logo.png`) as they become available.

---

## Contact (business)

- **Mobile:** +971 56 466 3334
- **Email:** amin@letsadsmedia.com
- **Website:** www.elmmdesign.com
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

Consto template © Themezinho. ELM content and customizations © ELM Media Design / Propagenda.
