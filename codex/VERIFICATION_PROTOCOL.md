<!-- FILE: codex/VERIFICATION_PROTOCOL.md -->
# Verification Protocol (Requested Edits 1–6)

This file defines how Codex should prove each requirement is complete.

## One command to rule them all

Primary automated gate:
- `bash scripts/codex.requested-edits.sh`

This runs:
- build CSS + JS
- marker checks (`node scripts/assert-ui-spec.js`)
- shader variant checks (`node scripts/validate-core-pages.js`)
- requirement checks (`node scripts/validate-requested-edits.js --strict`)

## Manual QA

Some requirements (legibility and image crop correctness) are inherently visual.
Use:
- `codex/MANUAL_QA_CHECKLIST.md`

## Per-edit verification mapping

### Edit 1 — Shader colors per page
Automated proof:
- `node scripts/validate-core-pages.js` confirms:
  - about: no data-variant (or default)
  - services: green
  - book: pink
  - contact: orange
  - niches: no data-variant
- `node scripts/assert-ui-spec.js` confirms marker `SPEC: SHADER_COLORS_PER_PAGE_2025_12`

Manual proof:
- Visually confirm hue on each page at desktop + mobile

### Edit 2 — Hero glass panel removed
Automated proof:
- `node scripts/validate-requested-edits.js --strict` checks:
  - no backdrop-filter in `.hero.title-band .content`
  - no tinted background, border, or box-shadow in that rule
- Marker required: `SPEC: HERO_NO_GLASS_PANEL_2025_12`

Manual proof:
- Confirm there is no translucent panel behind hero copy/CTAs
- Confirm legibility on: index, services, contact, and at least one niche page

### Edit 3 — Index nowrap button
Automated proof:
- `validate-requested-edits.js --strict` checks:
  - index anchor includes `btn-nowrap`
  - buttons.css defines `.btn-nowrap { white-space: nowrap; }`
  - marker `SPEC: INDEX_STREAMLINE_WORKFLOWS_NOWRAP_2025_12` exists

Manual proof:
- Confirm at narrow widths (mobile) the button label doesn’t wrap

### Edit 4 — Section subtitles grey globally
Automated proof:
- `validate-requested-edits.js --strict` checks:
  - `.section-subtitle` uses `--color-silver-original` (or a dedicated subtitle token)
  - no inline `section-subtitle` uses `color: var(--color-silver)` or any white forcing

Manual proof:
- Spot check 2–3 core pages and 2–3 niche pages

### Edit 5 — Services + niches image fill (width crop only)
Automated proof:
- `validate-requested-edits.js --strict` checks that CSS contains fill rules:
  - `.page-services` + `.page-niche` targeting `.service-img`
  - includes `height: 100%`, `width: auto`, `max-width: none`, and a centering mechanism

Manual proof:
- On services page + at least 2 niche pages:
  - image touches card edges (no inner blank space)
  - any crop is left/right only (top/bottom preserved)

### Edit 6 — About images copy visible
Automated proof:
- `validate-requested-edits.js --strict` checks:
  - about-scoped rules include `object-fit: contain`
  - (strict) object-position pinned to top

Manual proof:
- Confirm top-embedded copy in the two about images is fully visible on mobile + desktop
