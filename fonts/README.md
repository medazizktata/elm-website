# ELM brand fonts

| Role | Font | Weight | Files |
|------|------|--------|-------|
| EN H1 | Nohemi Bold | 700 | `nohemi/Nohemi-Bold.ttf` |
| EN H2+body | Nohemi SemiBold | 600 | `nohemi/Nohemi-SemiBold.ttf` |
| AR H1 | Almarai Bold | 700 | `almarai/almarai-*-700-normal.woff2` |
| AR body/H2 | Almarai Regular | 400 | `almarai/almarai-*-400-normal.woff2` |

Refresh after `pnpm install`:

```bash
pnpm run fonts:setup
```

Sources: `@tamagui/font-nohemi` (Nohemi, freeware/commercial per Rajesh Rajput), `@fontsource/almarai` (SIL OFL).

Arabic: set on `<html lang="ar">` via locale switch (or wrap copy in `.lang-ar`).
