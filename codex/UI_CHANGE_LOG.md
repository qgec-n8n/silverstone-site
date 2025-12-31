<!-- FILE: codex/UI_CHANGE_LOG.md -->
# UI Change Log (Evaluation Flywheel Logbook)

Use this file to record:
- baseline failures
- discoveries that change your approach
- the per-edit implementation strategy
- verification evidence

This is the paper trail that lets a future contributor understand what happened and why.

---

## Baseline (Measure-first)

Date:
- Environment notes (Node/npm versions, any install constraints):
  - Node v24.7.0, npm 11.6.4
  - `npm ci` in `scripts/codex.setup.sh` failed while building `sharp` (missing `vips/vips8`, EPERM accessing `/Users/quentingeczy/.npm`).

Commands run:
- `bash scripts/codex.setup.sh`
- `bash scripts/codex.requested-edits.sh`

Baseline result (paste a concise summary of failures):
- Failures:
  - `scripts/codex.setup.sh` failed during `npm ci` while building `sharp`.
  - `scripts/codex.requested-edits.sh` failed in `scripts/assert-ui-spec.js` due to missing proof marker `SPEC: HERO_DESKTOP_COPY_CTA_TIGHT_CONTAINER_2025_12_30` in built CSS.
- Suspected causes:
  - Proof markers and edit-specific changes not yet implemented.

---

## Root-cause notes (must fill before implementing)

Write 1–3 sentences per edit.

### Edit 1 — Desktop hero tight container
Root cause:
  - `.hero.title-band .content` is currently transparent and max-width only; no desktop-only tight container or legibility panel exists in `src/css/components/hero.css`.
Files involved:
  - `src/css/components/hero.css` (desktop media query).
Planned minimal fix:
  - Add desktop-only container styling for `.hero.title-band .content` with tight-fit background/padding; include proof marker. Risk: unintended mobile change → keep in `@media (min-width: 769px)`. Verify via `bash scripts/codex.requested-edits.sh` + desktop hero check.

### Edit 2 — About desktop images fill + neon border wrap
Root cause:
  - `src/css/components/cards.css` sets `.service-image.neon-card img` to `object-fit: contain` with a border, overriding `img-cover-center` on desktop.
Files involved:
  - `about.html`, `src/css/components/cards.css`, `src/css/pages/about.css`.
Planned minimal fix:
  - Add desktop-only `.page-about` override to force cover fill for the two service-row images and ensure border wraps the container; include proof marker. Risk: other about images affected → scope to service-row `img.img-cover-center`. Verify on desktop about page + grader.

### Edit 3 — Services desktop General_Services HD
Root cause:
  - `services.html` uses `<source type="image/webp" media="(min-width: 769px)">` for General_Services images, causing pixelated desktop rendering.
Files involved:
  - `services.html`.
Planned minimal fix:
  - Remove/replace desktop `.webp` sources for the four General_Services cards so desktop uses `.jpeg`, keep mobile `.webp`; add proof marker in HTML. Risk: unintended mobile changes → keep mobile sources intact. Verify desktop zoom + grader.

### Edit 4 — Services mobile General_Services portrait 2:3
Root cause:
  - `src/css/pages/services.css` sets `.page-services .service-image` aspect-ratio to 79/53 and other rules that keep cards landscape even on mobile.
Files involved:
  - `services.html`, `src/css/pages/services.css`.
Planned minimal fix:
  - Add `general-services-card` class to the four wrappers and override in mobile media query to aspect-ratio 2/3 with cover fill; add proof marker. Risk: layout shifts on other service cards → scope to `.general-services-card` only. Verify on mobile services + grader.

### Edit 5 — Services Neural Grid replace square/landscape assets
Root cause:
  - `src/js/gallery.js` `CURATED_IMAGES` uses legacy `1-1` and `3-2` filenames; these are injected at runtime into `#neural-grid`.
Files involved:
  - `src/js/gallery.js`.
Planned minimal fix:
  - Replace all square + landscape entries per `codex/ASSET_REPLACEMENT_MATRIX.md`, add proof marker. Risk: broken image paths → use exact filenames from matrix. Verify via gallery rendering + grader.

### Edit 6 — Services Neural Grid replace portrait assets with varied prefixes
Root cause:
  - `CURATED_IMAGES` portrait entries still reference legacy `2-3` assets.
Files involved:
  - `src/js/gallery.js`.
Planned minimal fix:
  - Swap all portrait entries to the specified `*_#_Mobile.jpeg` set with unique prefixes; add proof marker. Risk: duplicate prefixes → use matrix list verbatim. Verify via gallery render + grader.

### Edit 7 — Mobile hero remove grey subheadings without layout shift
Root cause:
  - `.hero.title-band .content p` is visible on mobile; no rule hides it while preserving spacing in `src/css/components/hero.css`.
Files involved:
  - `src/css/components/hero.css` (mobile media query).
Planned minimal fix:
  - Add mobile-only rule to hide subtitle via `visibility: hidden` (retain space), include proof marker. Risk: unintended desktop change → keep in `@media (max-width: 768px)`. Verify on mobile hero + grader.

### Edit 8 — Index two sentences white → grey
Root cause:
  - `index.html` uses `p.section-subtitle` and home page tokens make these two subtitles white; no targeted class exists.
Files involved:
  - `index.html`, `src/css/base/layout.css` or `src/css/pages/home.css`.
Planned minimal fix:
  - Add class to the two specific `<p>` elements and define color with `--color-silver-original`, include proof marker. Risk: recoloring other subtitles → class only on two sentences. Verify on index desktop/mobile + grader.

---

## Iteration log (Analyze → Measure → Improve)

Use one entry per loop.

- Loop: 1
  - Analyze (what failed; why): Grader failed sequentially on missing proof markers for Edits 1–8 as expected pre-implementation.
  - Measure (what command; what changed in output): `bash scripts/codex.requested-edits.sh` after each edit; failures progressed until all markers present, then pass.
  - Improve (what targeted change you made): Implemented Edits 1–8 per spec with scoped CSS/HTML/JS updates and proof markers.
  - Result: Grader passes; manual QA pending.
- Loop: 2
  - Analyze (what failed; why): New request to re-enable mobile hero subtitles on about/contact only and add about image lightbox affordance.
  - Measure (what command; what changed in output): `bash scripts/codex.requested-edits.sh` after changes; PASS.
  - Improve (what targeted change you made): Added mobile-only subtitle visibility overrides for `.page-about`/`.page-contact`; wrapped about images in lightbox triggers with “Tap to expand” label and styles.
  - Result: Grader still passes; manual QA pending for new changes.

---

## Final summary (fill at the end)

- What changed (high-level): Implemented Edits 1–8 across hero, about, services cards, neural grid assets, and index subtitle styling; added required proof markers.
- What commands pass: `bash scripts/codex.requested-edits.sh` (PASS).
- Manual QA completed (yes/no + notes): No — pending completion of `codex/MANUAL_QA_CHECKLIST.md`.
- Any known limitations (ideally none): `scripts/codex.setup.sh` still fails on `sharp` install; grader runs without it.
- Where evidence is recorded (ExecPlan evidence table, QA checklist): ExecPlan evidence table updated; manual QA checklist pending.
