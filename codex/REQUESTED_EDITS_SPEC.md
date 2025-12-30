<!-- FILE: codex/REQUESTED_EDITS_SPEC.md -->
# Requested Edits 1–8 — Source of Truth Spec

This is the **only** authoritative definition of what Codex must implement.

If any other document mentions “Requested Edits 1–7”, treat it as outdated.

If any other document mentions “Pricing Feature Implementation plan”, interpret it as referring to these Requested Edits **1–8** (no separate scope).

---

## Hard constraints

- Implement **exactly and only** Edits 1–8 below.
- Respect desktop-only vs mobile-only instructions.
- Do NOT modify `pricing-widget/**`.
- No unrelated refactors, redesigns, or “while we’re here” improvements.
- Preserve existing copy everywhere except Edit 8.

---

## Build + validation contract

After any changes:
- Run `bash scripts/codex.requested-edits.sh`

This:
- rebuilds `assets/css/styles.css` and `assets/js/app.js`
- runs `node scripts/assert-ui-spec.js` (fatal if requirements not met)

---

## Proof markers (non-negotiable)

Codex must add these exact markers in the specified files. The grader enforces them.

1) Hero desktop container:
- Marker: `SPEC: HERO_DESKTOP_COPY_CTA_TIGHT_CONTAINER_2025_12_30`
- File: `src/css/components/hero.css`
- Must appear inside the desktop-only styling (min-width 769px) implementing Edit 1.

2) Hero mobile subheading removal (no layout shift):
- Marker: `SPEC: HERO_MOBILE_HIDE_GREY_SUBHEADINGS_PRESERVE_LAYOUT_2025_12_30`
- File: `src/css/components/hero.css`
- Must appear inside the mobile-only styling (max-width 768px) implementing Edit 7.

3) About desktop image fill + neon border wrap:
- Marker: `SPEC: ABOUT_DESKTOP_SILVERSTONE_22_28_COVER_FILL_NEON_WRAP_2025_12_30`
- File: `src/css/pages/about.css` (preferred) OR another narrowly-scoped CSS file that targets `.page-about` only.
- Must be inside a desktop-only block (min-width 769px).

4) Services desktop HD General_Services images:
- Marker: `SPEC: SERVICES_DESKTOP_GENERAL_SERVICES_IMAGES_HD_2025_12_30`
- File: `services.html`

5) Services mobile portrait 2:3 General_Services cards:
- Marker: `SPEC: SERVICES_MOBILE_GENERAL_SERVICES_CARDS_PORTRAIT_2_3_2025_12_30`
- File: `src/css/pages/services.css`
- Must be inside a mobile-only block (max-width 768px).

6) Services Neural Grid swaps (square + landscape):
- Marker: `SPEC: SERVICES_NEURAL_GRID_REPLACE_SQUARE_LANDSCAPE_2025_12_30`
- File: `src/js/gallery.js`

7) Services Neural Grid swaps (portrait):
- Marker: `SPEC: SERVICES_NEURAL_GRID_REPLACE_PORTRAIT_2025_12_30`
- File: `src/js/gallery.js`

8) Index targeted subtitles grey:
- Marker: `SPEC: INDEX_SUBTITLES_GREY_TARGETED_SENTENCES_2025_12_30`
- File: whichever CSS file defines the new class used by Edit 8 (recommended: `src/css/base/layout.css` or `src/css/pages/home.css`).

---

## Requested Edit details + acceptance criteria

### Edit 1 — Desktop hero copy + CTA tight container (mobile unchanged by this desktop-only change)

**Goal:** On desktop, the hero shader title + copy + CTA buttons must sit inside a tightly-wrapping container to improve legibility.

Where:
- HTML structure across pages uses: `.hero.title-band .content` (contains h1, p, `.cta-buttons`).
- Implement in `src/css/components/hero.css`.

Rules:
- Desktop-only (min-width 769px).
- Container must be tight to the content (not full-width).
- Must increase legibility (e.g., background/overlay + padding) without changing the layout on mobile due to this desktop-only rule.

Proof marker:
- `SPEC: HERO_DESKTOP_COPY_CTA_TIGHT_CONTAINER_2025_12_30`

---

### Edit 2 — Desktop only on about.html: Silverstone_22 + Silverstone_28 fill container; neon border wraps container

**Goal:** These two images must fill their image card on desktop and the neon border must tightly wrap the container.

Where:
- `about.html` uses these inside service rows:
  - `assets/images/zip/Silverstone_28.jpg`
  - `assets/images/zip/Silverstone_22.jpg`
- They already have `class="img-cover-center"`.

Root-cause to confirm:
- Desktop card image rules in `src/css/components/cards.css` override cover behavior (object-fit contain / height auto) via higher specificity.

Implementation:
- Add a desktop-only `.page-about` override (preferred in `src/css/pages/about.css`) targeting `img.img-cover-center` inside the service-row image card to enforce cover fill.
- Ensure border wraps container tightly (likely by applying border to the container or ensuring the image fills fully under the border).

Desktop-only requirement:
- Must not alter mobile behavior for these images.

Proof marker:
- `SPEC: ABOUT_DESKTOP_SILVERSTONE_22_28_COVER_FILL_NEON_WRAP_2025_12_30`

---

### Edit 3 — Desktop only on services.html: General_Services_* look pixelated → make HD

**Goal:** On desktop, the four General_Services image cards must not appear pixelated; the baked-in overlay text in the images must appear crisp.

Files/assets involved:
- `services.html` `<picture>` blocks for:
  - `General_Services_1`
  - `General_Services_2A`
  - `General_Services_2B`
  - `General_Services_3`
- Current desktop sources include `.webp` which is suspected to be too compressed.

Required implementation (deterministic):
- Desktop must **not** load the `.webp` versions for these four images.
- Keep mobile webp sources intact.
- Desktop should load the `.jpeg` versions.

Proof marker:
- `SPEC: SERVICES_DESKTOP_GENERAL_SERVICES_IMAGES_HD_2025_12_30` in `services.html`.

---

### Edit 4 — Mobile only on services.html: General_Services cards are landscape; match niches portrait 2:3

**Goal:** On mobile, those same four General_Services cards must render as **portrait 2:3 and visually match niches image-card styling**.

Root-cause to confirm:
- Page-specific aspect ratio rules on services override the mobile card behavior and force a landscape container.

Required structure change:
- Add a specific class hook on the four General_Services image card wrappers in `services.html`:
  - Required class name: `general-services-card`

Required CSS behavior (mobile-only):
- In `src/css/pages/services.css` under `@media (max-width: 768px)`:
  - `.page-services .general-services-card` must be portrait 2:3 (aspect-ratio 2 / 3).
  - The image should fill appropriately (avoid letterboxing).

Proof marker:
- `SPEC: SERVICES_MOBILE_GENERAL_SERVICES_CARDS_PORTRAIT_2_3_2025_12_30`

---

### Edit 5 — Services Innovation Gallery Neural Grid: replace all 1:1 and 3:2 images with allowed `services_*` images

**Goal:** Remove all legacy `1-1` and `3-2` images from the Services Neural Grid curated list and replace them with the allowed `services_*` assets.

Where:
- `src/js/gallery.js` → `CURATED_IMAGES`

Allowed replacements:
- `services_lead_followup_mobile.jpg`
- `services_consulting_mobile.jpg`
- `services_data_integration_mobile.jpg`
- `services_workflow_automation_mobile.jpg`
- `services_data_integration.jpg`
- `services_workflow_automation.jpg`
- `services_consulting.jpg`
- `services_lead_followup.jpg`

Rule of thumb:
- Use `*_mobile.jpg` for square entries, and non-mobile `.jpg` for landscape entries.

Proof marker:
- `SPEC: SERVICES_NEURAL_GRID_REPLACE_SQUARE_LANDSCAPE_2025_12_30`

---

### Edit 6 — Services Innovation Gallery Neural Grid: replace all 2:3 images with `*_#_Mobile.jpeg` variety

**Goal:** Replace all portrait (2:3) tiles in the Services Neural Grid with images matching:
- `*_1_Mobile.jpeg` OR `*_2_Mobile.jpeg` OR `*_3_Mobile.jpeg`

Variety requirement:
- Avoid using multiple variants of the same prefix; all portrait tiles should use distinct prefixes.

Where:
- `src/js/gallery.js` → `CURATED_IMAGES` entries with portrait type.

Proof marker:
- `SPEC: SERVICES_NEURAL_GRID_REPLACE_PORTRAIT_2025_12_30`

---

### Edit 7 — Mobile only: remove grey hero subheadings (no layout shift)

**Goal:** On mobile only, the hero shader section must show:
- title
- CTA buttons
…and must not show any grey subheading text, while keeping title/CTA positions unchanged.

Implementation constraint:
- Hiding must not cause the title/CTA to move (no layout shift).
- Achieve this by hiding visibility (or equivalent) while preserving space.

Where:
- `src/css/components/hero.css`

Proof marker:
- `SPEC: HERO_MOBILE_HIDE_GREY_SUBHEADINGS_PRESERVE_LAYOUT_2025_12_30`

---

### Edit 8 — index.html: recolor two exact sentences to grey

Sentences:
1) “Four practical ways we help UK small businesses save time, respond faster, and keep customers moving - without ripping out the tools you already use.”
2) “Clear setup + monthly support. Start with a flagship system, or pick a smaller module if you're fixing one leak first.”

Goal:
- Change these sentences from white to grey on `index.html` only.
- Do not recolor other subtitles globally.

Required implementation:
- Add a dedicated class (recommended name: `subtitle-muted`) to the `<p>` elements containing those sentences (or wrap the sentence in a span with that class).
- Define `.subtitle-muted` color as the grey token (use `--color-silver-original`).

Proof marker:
- `SPEC: INDEX_SUBTITLES_GREY_TARGETED_SENTENCES_2025_12_30`

---

## Required reference mapping

Codex must follow:
- `codex/ASSET_REPLACEMENT_MATRIX.md`

This file defines the exact recommended replacements so the result is deterministic and passes grading.
