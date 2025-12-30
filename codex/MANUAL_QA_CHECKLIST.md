<!-- FILE: codex/MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist (Visual + Responsive)

Manual QA is mandatory because multiple requirements are visual (shader colors, “midline obstruction,” and image crop behavior).

## Setup

1) Build bundles:
- `bash scripts/codex.requested-edits.sh`

2) Start a simple static server from repo root (any simple HTTP server works).

3) Use browser responsive mode:
- Mobile breakpoint: <= 768px
- Desktop breakpoint: >= 769px

## Global checks (all pages with heroes)

Applies to:
- Root pages: index, about, services, book, contact, privacy-policy
- All `niches/*.html`

For each page:
- [ ] Hero has no visible glass/blur panel behind the hero copy/CTAs.
- [ ] Hero copy and CTA buttons do not sit across the shader’s midline region (center band); the animation remains clearly visible.
- [ ] Hero copy remains easy to read (contrast, spacing, and no awkward overlaps) on:
  - [ ] mobile
  - [ ] desktop
- [ ] Hero CTAs remain reachable and not clipped on small screens.

## Requested Edit 1 — Shader colors (visual confirmation)

- [ ] about.html: shader appears neon yellow
- [ ] services.html: shader appears green
- [ ] book.html: shader appears bright neon pink
- [ ] contact.html: shader appears fire orange

## Requested Edit 4 — Index “Streamline Workflows” button

On `index.html` (service tiles area):
- [ ] “Streamline workflows” stays on one line at narrow mobile widths.
- [ ] Text is centered with balanced padding on both sides.
- [ ] The pill doesn’t look cramped or off-center.

## Requested Edit 5 — Qualifying subtitles grey (cross-page audit)

Definition reminder:
- Only subtitles directly under blue titles in body sections (not inside cards/CTA banners/pill buttons).

On each root page:
- [ ] Qualifying subtitles under blue `.section-title` are grey.
- [ ] Exclusions are respected (subtitles in CTA cards/banners/pills not incorrectly recolored).

On niche pages:
- Check at least these 3 (or more):
  - [ ] niches/dentists.html
  - [ ] niches/estate-agents.html
  - [ ] niches/hospitality.html
- [ ] Qualifying subtitles are grey.
- [ ] No collateral recoloring inside cards.

## Requested Edit 6 — About images cover-fill

On `about.html`:
- [ ] Silverstone_28.jpg fills its card (cover), centered crop.
- [ ] Silverstone_22.jpg fills its card (cover), centered crop.
- [ ] Cropping looks intentional (no awkward top-only crop or off-center focal point).

## Requested Edit 7 — Services images cover-fill

On `services.html`:
- [ ] General_Services_1.jpeg fills its card (cover), centered crop.
- [ ] General_Services_2A.jpeg fills its card (cover), centered crop.
- [ ] General_Services_2B.jpeg fills its card (cover), centered crop.
- [ ] General_Services_3.jpeg fills its card (cover), centered crop.

## Notes / screenshots (optional but helpful)

- Notes:
- Any edge cases:
- If something fails, note the exact viewport width and the page/section.
