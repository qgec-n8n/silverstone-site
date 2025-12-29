<!-- FILE: codex/REQUESTED_EDITS_SPEC.md -->
# Requested Edits Spec (1–6) — Source of Truth

This document is the **only** authoritative requirements list for the current Codex run.

## Scope (do exactly this)

Implement **Requested Edits 1–6** only. Any other edit lists (especially anything mentioning pricing) are out of scope and must be ignored.

## Proof markers (required)

For reliability, Codex must add these SPEC markers near the final implementation points:

- Edit 1: `SPEC: SHADER_COLORS_PER_PAGE_2025_12`
- Edit 2: `SPEC: HERO_NO_GLASS_PANEL_2025_12`
- Edit 3: `SPEC: INDEX_STREAMLINE_WORKFLOWS_NOWRAP_2025_12`
- Edit 4: `SPEC: SECTION_SUBTITLES_GREY_GLOBAL_2025_12`
- Edit 5: `SPEC: SERVICES_NICHES_IMAGES_FILL_CARD_NO_HEIGHT_CROP_2025_12`
- Edit 6: `SPEC: ABOUT_IMAGES_COPY_VISIBLE_NO_CROP_2025_12`

These markers are enforced by `node scripts/assert-ui-spec.js`.

---

## Edit 1 — Shader colors per page

### Requirement
- `about.html` shader: **purple**
- `services.html` hero shader: **green**
- `book.html` shader: **bright neon pink**
- `contact.html` hero shader: **fire orange**

### Implementation constraints
- Keep the existing shader architecture (theme map + per-page selector mechanism).
- Prefer per-page wiring via a single clear mechanism (e.g., canvas `data-variant`).

### Color intent (guidance)
- Purple: should match the existing “default” purple look (dark purples + vivid purple lines).
- Green: should read as neon green on a dark background.
- Bright neon pink: recommended hex family: neon pink (#FF10F0 / #FF13F0 range).
- Fire orange: recommended hex family: fire orange (#FF7700 range) and/or deep flame oranges.

### Acceptance criteria
- Opening each page shows the correct dominant shader hue immediately.
- The chosen colors do not reduce hero text legibility (especially after Edit 2).

### Proof
- Add `SPEC: SHADER_COLORS_PER_PAGE_2025_12` in the shader theme definition file near the updated theme map.

---

## Edit 2 — Remove blurred hero content container (keep extreme legibility)

### Requirement
Remove the blurred “glass” container behind hero copy + CTA buttons. Replace with typography/color/layout changes so:
- shader is visible behind content (no big translucent panel)
- hero copy/CTAs remain **extremely legible**
- works on mobile + desktop

### Implementation constraints
- Do not add a new solid/blurred panel elsewhere to “cheat” the requirement.
- Prefer text-shadow, spacing, max-width, and thoughtful layout over background overlays.

### Acceptance criteria
- The hero text area has no blurred/translucent background container.
- Copy is readable at common breakpoints (mobile + desktop) across core + niche pages.

### Proof
- Add `SPEC: HERO_NO_GLASS_PANEL_2025_12` near the updated hero content rule.

---

## Edit 3 — index.html: “Streamline workflows” stays on one line

### Requirement
On `index.html`, ensure the “Streamline workflows” button text stays on a single line.

### Implementation constraints
- Use a deterministic mechanism (recommended: add a `btn-nowrap` class to that anchor and a `.btn-nowrap { white-space: nowrap; }` rule).

### Acceptance criteria
- The label never wraps at common mobile widths.
- Does not cause overflow or layout breakage.

### Proof
- Add `SPEC: INDEX_STREAMLINE_WORKFLOWS_NOWRAP_2025_12` near the HTML class change and/or the CSS rule.

---

## Edit 4 — Section subtitles (white subheadings) must be grey across ALL pages

### Requirement
Across all pages including `niches/*.html`, change the “white subheadings” (white subtitles under blue titles in body sections) to **grey**.

### Notes
- Many pages currently force subtitle color via:
  - variable overrides that turn “silver” into white
  - inline styles like `color: var(--color-silver)` which may resolve to white
- Fix must apply across all pages, not just index.

### Acceptance criteria
- Subtitles under blue section titles are grey on:
  - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`
  - every `niches/*.html`
- Inline styles do not force white or “silver-that-becomes-white”.

### Proof
- Add `SPEC: SECTION_SUBTITLES_GREY_GLOBAL_2025_12` near the `.section-subtitle` definition change.

---

## Edit 5 — Services + niche page images fill card (width crop only, no height crop)

### Requirement
On `services.html` and `niches/*.html`, ensure the image fills its card:
- width may be cropped to fit
- height must not be cropped
- crop as little as possible

### Implementation constraints
- This must not break about page images (Edit 6).
- Recommended approach:
  - target `.service-img` on `.page-services` and `.page-niche`
  - allow horizontal overflow by removing `max-width: 100%`
  - size the image by height and clip overflow in width

### Acceptance criteria
- No “letterboxing” inside the image card on desktop layouts.
- Visible crop (if any) happens on left/right edges only, not top/bottom.

### Proof
- Add `SPEC: SERVICES_NICHES_IMAGES_FILL_CARD_NO_HEIGHT_CROP_2025_12` near the final CSS rule.

---

## Edit 6 — About page images: copy must remain visible (top-safe)

### Requirement
On `about.html`, ensure the image fits the card and **all embedded copy in the image is visible**, especially copy near the top of two images.

### Implementation constraints
- Do not use a cropping approach on about images.
- Strongly recommended:
  - keep `object-fit: contain` for about images
  - pin `object-position` to top (top-safe)

### Acceptance criteria
- No text embedded in the about images is cut off on any breakpoint.
- About page images still sit cleanly within their cards.

### Proof
- Add `SPEC: ABOUT_IMAGES_COPY_VISIBLE_NO_CROP_2025_12` near the about-specific image rule.

---

## Verification contract

Codex must use:
- Automated:
  - `bash scripts/codex.requested-edits.sh`
- Manual:
  - `codex/MANUAL_QA_CHECKLIST.md`

Work is not complete until both automated + manual are satisfied.
