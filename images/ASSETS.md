# ELM image assets

Client-owned media synced from PDF extracts in `Docs/`:

| PDF source folder | MD reference |
|---|---|
| `Docs/ELM presentation/` | `Docs/ELM presentation.md` |
| `Docs/corporate profile 2026 ELM/` | `Docs/corporate profile 2026 ELM.md` |

## Refresh from PDF extracts

```bash
pnpm run images:sync-docs
```

Copies/converts extracted images into `images/` and archives originals under `images/elm-source/`.

## Semantic map (doc → site slot)

| Site file | Doc source | Subject |
|---|---|---|
| `slide01.jpg` | presentation `5.png` | WASP Crane dome print |
| `slide02.jpg` | corporate `15.jpg` | Aerial concrete LFAM site |
| `slide03.jpg` | corporate `6.jpg` | Modular 3D-printed pods |
| `slide04.jpg` | presentation `41.jpg` | Recarlo Milan interior panels |
| `slide05.jpg` | corporate `16.jpg` | THE LOOP / Dubai geodesic |
| `slide06.jpg` | presentation `42.jpg` | Bergamo Airport service building |
| `slide07.jpg` | presentation `14.png` | Infrastructure / mobility |
| `slide08.jpg` | presentation `35.jpg` | Dubai skyline (UAE programme) |
| `slide09.jpg` | corporate `14.jpg` | Property / urban plaza |
| `tab01.jpg` | corporate `4.jpg` | Robotic concrete extrusion |
| `tab02.jpg` | corporate `7.jpg` | Polymer lattice LFAM |
| `tab03.jpg` | corporate `8.jpg` | Architectural manufacturing render |
| `tab04.jpg` | corporate `23.jpg` | Engagement / response time |
| `tab05.jpg` | presentation `35.jpg` | Dubai policy / urban growth |
| `step01.jpg` | corporate `22.jpg` | Digital design mesh |
| `step02.jpg` | corporate `11.jpg` | Industrial robot arm |
| `step03.jpg` | corporate `10.jpg` | Printed building install |
| `side-image01.jpg` | presentation `13.png` | Property & infrastructure |
| `side-image02.jpg` | presentation `41.jpg` | Hospitality / Recarlo |
| `side-image03.jpg` | corporate `8.jpg` | Creative & culture |
| `video-poster01.jpg` | presentation `6.png` | LFAM robot concrete walls |
| `section-bg01.jpg` | presentation `12.jpg` | Abstract tech backdrop |
| `section-bg02.jpg` | corporate `9.jpg` | Abstract tech backdrop |
| `section-bg-industrial.jpg` | corporate `11.jpg` | Industrial LFAM robot (applications bg) |
| `background/branding-elm-18.jpg` | presentation `6.png` | Home hero LFAM |
| `background/bg_elm-1.jpg` | corporate `1.jpg` | Inner page headers |
| `background/branding-elm-7.jpg` | corporate `5.jpg` | Footer CTA bar |

## Logo

| File | Use |
|---|---|
| `logo.svg` | Nav, footer, side menu |
| `logo.png` | OG / JSON-LD (generate if needed) |

## Video

| File | Use |
|---|---|
| `videos/video01.mp4` | Facility loop (home, why-elm) |
