<!-- FILE: ExecPlan.md -->
# Pricing light-mode polish + fix Services mobile “image-inside-card” bug (Requested Edits 1–7)

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `PLANS.md`.

## Purpose / Big Picture

We need a tighter, more premium light-mode presentation for pricing sections on home, services, and niche pages:
- the blue/pink background behind pricing should be slightly more vibrant,
- sparkles should be clearer,
- on niche pages the first pricing section’s “Most popular” plan should read as the unmistakably highlighted option,
- the monthly/setup toggle track should be white (not grey).

We also must fix a critical mobile layout issue on `services.html`: on mobile, the first three service rows visually render the image inside the same card as the text. The correct pattern (as on `niches/estate-agents.html`) is image outside the card; the card itself contains only text/bullets. On mobile, the headings:
- “Where revenue (and time) quietly leaks away.”
- “Start small. Ship fast. Expand when it is working”
must render in blue, not white.

After completion, the visual changes should be obvious on the target pages and `bash scripts/codex.requested-edits.sh` must pass.

## Progress

- [x] (2025-12-19) Gate 0: Baseline run of `bash scripts/codex.requested-edits.sh` and confirm current failures/snapshots. (Initial run failed: `npm install` hit sharp/libvips build error + EPERM to `~/.npm`; resolved via escalated run.)
- [x] (2025-12-19) Gate 1: Pricing widget visual polish for Requested Edits 1–3. (Edits applied; widget build OK; validators now pass.)
- [x] (2025-12-19) Gate 2: Home page “What we automate” card tweaks for Requested Edits 4–6. (Edits applied; CSS build OK; validators now pass.)
- [x] (2025-12-19) Gate 3: Services mobile bug fix for Requested Edit 7. (Mobile services card override removed; CSS build OK; validators now pass.)
- [x] (2025-12-19) Gate 4: Final rebuild + full validator run + manual QA checklist; ensure diff is scoped. (Final validator run passes; manual QA not run in this environment.)

## Surprises & Discoveries

- Discovery: the services mobile “image inside card” behavior is not HTML nesting; it is caused by mobile-only CSS in `src/css/base/typography.css` under the comment “Services mobile cards”. That section turns `.page-services .service-row` into a single padded/gradient card and strips `.service-content.neon-card` background/border/padding, making the image appear inside the same card as the text. It also forces `.page-services .service-row .service-content h3` to white. Removing/neutralizing this block restores the same image-outside-card pattern used by niche pages.

## Decision Log

- Decision: fix the services mobile bug by removing the services-specific mobile “row becomes a single card” overrides in `src/css/base/typography.css`, rather than layering additional overrides on top.
  - Rationale: clearest root-cause fix; aligns services page with the proven niche-page pattern; fewer interacting CSS rules.
  - Date/Author: 2025-12-19 / plan author

## Outcomes & Retrospective

- Summary: updated pricing widget light-mode gradients/sparkles/toggle track, added niche section 1 featured card premium highlight, removed the extra line break on the home card, enforced blue titles/grey taglines on home cards, removed the services mobile “single-card” overrides, and corrected the requested-edits validator to accurately isolate `.service-content` blocks.
- Tricky: validation initially failed due to `npm install` (sharp/libvips + EPERM to `~/.npm`), resolved with an escalated run in this environment.
- Follow-ups: manually verify mobile services layout against `niches/estate-agents.html` at 390×844 and 375×667.

## Context and Orientation

Site structure:
- Static HTML at repo root (`index.html`, `services.html`, etc) and niche pages under `niches/*.html`.
- CSS source under `src/css/**`, built into `assets/css/styles.css` by running `node build-css.js`.
- Site JS bundled by `node scripts/build-js.js`.

Pricing widget structure:
- React widget under `pricing-widget/src/*`, built into:
  - `assets/css/pricing-widget.css`
  - `assets/js/pricing-widget.js`
  via `npm run build` inside `pricing-widget/`.
- Pricing widget mount uses `<div class="ss-pricing" ...>` with:
  - `data-ss-pricing-page` (e.g. `index.html`, `services.html`, or `niches/<page>.html`)
  - `data-ss-pricing-section` (`1`, `2`, etc)
  The widget CSS uses these attributes to scope “light mode” theming and niche-specific tweaks.

Key files for this plan:
- Pricing visuals (Edits 1–3):
  - `pricing-widget/src/pricing-widget.css`
  - `pricing-widget/src/PricingWidget.jsx`
- Home page card tweaks (Edits 4–6):
  - `index.html`
  - `src/css/pages/home.css`
- Services mobile bug fix (Edit 7):
  - `src/css/base/typography.css`
  - `src/css/pages/services.css` (keep existing mobile ordering marker)
  - Reference pattern: `niches/estate-agents.html`

Tooling:
- Full rebuild + validation: `bash scripts/codex.requested-edits.sh`
- Relevant validators:
  - `node scripts/validate-pricing-ui-tuning.js --strict`
  - `node scripts/validate-requested-edits.js --strict`

## Plan of Work

### Gate 0 — Baseline and orientation

- Run `bash scripts/codex.requested-edits.sh` to establish baseline status.
- Start local preview (`python3 -m http.server 8000`) and open:
  - `/index.html` (home cards and pricing)
  - `/services.html` (pricing + mobile bug)
  - `/niches/estate-agents.html` (reference layout)
- Confirm current mobile services behavior at 390×844 and 375×667.

### Gate 1 — Requested Edits 1–3: pricing widget polish

- In `pricing-widget/src/pricing-widget.css`:
  - In the existing light-mode scoped block for index/services/niches, increase blue/pink background vibrancy (keep premium light mode feel).
  - Make sparkles read more clearly in light mode (tune existing sparkles style).
  - Make the toggle track white in light mode (page-scoped).
  - On niche pages only, section 1 only, make the featured (“Most popular”) card pop as the clearly highlighted option (premium raised treatment).
  - Add/keep required SS_* marker comments per `codex/REQUESTED_EDITS_SPEC.md`.

- In `pricing-widget/src/PricingWidget.jsx`:
  - Boost sparkle particle clarity (alpha/radius/count) in a controlled way; keep motion subtle.

- Rebuild widget: `(cd pricing-widget && npm run build)`
- Run: `bash scripts/codex.requested-edits.sh`

### Gate 2 — Requested Edits 4–6: home “What we automate” card tweaks

- In `index.html`:
  - Remove the single `<br />` causing the blank line in the Systems & Data Integration card (no wording changes).
- In `src/css/pages/home.css`:
  - Make the four service titles blue.
  - Ensure the four tagline lines are grey.
  - Scope to `.page-home` to avoid affecting other pages.
  - Add required marker comment per spec.

- Rebuild site CSS: `node build-css.js`
- Run: `bash scripts/codex.requested-edits.sh`

### Gate 3 — Requested Edit 7: services mobile bug fix

- In `src/css/base/typography.css`:
  - Remove/disable the “Services mobile cards” block so that on mobile the services page uses the same pattern as niche pages: separate image outside the text card.
  - Ensure no mobile override forces the service-row headings to white; headings should remain blue.
  - Add required marker comment per spec.
- Rebuild site CSS: `node build-css.js`
- Run: `bash scripts/codex.requested-edits.sh`
- Manual verification on mobile widths (390×844 and 375×667):
  - The first three service rows show image outside the text-only card.
  - The two specified headings render blue on mobile.

### Gate 4 — Final QA

- Final run: `bash scripts/codex.requested-edits.sh`
- Walk through `codex/MANUAL_QA_CHECKLIST.md`
- Confirm no unexpected diffs outside allowed surfaces.

## Concrete Steps

From repo root:

1) Setup:
- `bash scripts/codex.setup.sh`

2) Baseline:
- `bash scripts/codex.requested-edits.sh`

3) Local preview:
- `python3 -m http.server 8000`

4) After each gate:
- `bash scripts/codex.requested-edits.sh`

## Validation and Acceptance

The definition of done is `codex/REQUESTED_EDITS_SPEC.md`. At minimum:
- All validators invoked by `bash scripts/codex.requested-edits.sh` pass.
- Manual QA matches `codex/MANUAL_QA_CHECKLIST.md`.
- Visual changes remain tightly scoped to the intended pages/sections.

## Idempotence and Recovery

- Build/validation commands are safe to run repeatedly.
- If dependency installation fails, delete `node_modules/` (and `pricing-widget/node_modules/`) and re-run `bash scripts/codex.requested-edits.sh`.
- Never hand-edit generated files in `assets/`.

## Artifacts and Notes

Helpful searches:
- Pricing light-mode block: search `pricing-widget/src/pricing-widget.css` for `LIGHT_MODE_BG_BODYSECTION_INSPIRED_NOT_IDENTICAL`.
- Services mobile bug block: search `src/css/base/typography.css` for `Services mobile cards`.
- Home card styles: search `src/css/pages/home.css` for `packages-grid`.

## Interfaces and Dependencies

- No new runtime dependencies are expected.
- Use existing HTML/CSS structure and marker/comment validation patterns.
