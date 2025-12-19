<!-- FILE: ExecPlan_UI_Fixes.md -->
# ExecPlan — UI Fixes (Requested Edits 1–4)

## Purpose

Implement **only** Requested Edits 1–4 as defined in `codex/REQUESTED_EDITS_SPEC.md`, with minimal change surface area and strong verification.

## Non‑negotiable scope rules

- In-scope: ONLY Requested Edits **1–4** from `codex/REQUESTED_EDITS_SPEC.md`.
- Out-of-scope: Any other visual tweaks, refactors, dependency upgrades, copy changes, accessibility rewrites, or “while we’re here” improvements.
- Do not hand-edit generated files under `assets/`. Update sources and rebuild via repo scripts.

## Primary files involved (expected)

Pricing (Edits 1–2):
- `pricing-widget/src/pricing-widget.css`
- `pricing-widget/src/PricingWidget.jsx` (only if CSS-only cannot satisfy acceptance criteria)
- Built output (generated): `assets/css/pricing-widget.css`, `assets/js/pricing-widget.js`

Services (Edit 3):
- `src/css/pages/services.css`
- Built output (generated): `assets/css/styles.css`
- Source page for spot-check: `services.html`

Home (Edit 4):
- `src/css/pages/home.css`
- Built output (generated): `assets/css/styles.css`
- Source page for spot-check: `index.html`

Orchestration / validation:
- `scripts/codex.requested-edits.sh`
- `scripts/validate-pricing-ui-tuning.js`
- `scripts/validate-requested-edits.js`

## Implementation Map (pre-filled)

### Pricing feature map (where it lives and how it works)

Pricing mounts:
- `index.html` mounts two widgets via:
  - `<div class="ss-pricing" data-ss-pricing-page="index.html" data-ss-pricing-section="1"></div>`
  - `<div class="ss-pricing" data-ss-pricing-page="index.html" data-ss-pricing-section="2"></div>`
- `services.html` mounts two widgets via the same pattern with `data-ss-pricing-page="services.html"`.
- `niches/*.html` mount widgets with `data-ss-pricing-page="niches/<page>.html"` (the CSS uses a prefix selector to cover all niches).

Pricing rendering code:
- `pricing-widget/src/embed.jsx`:
  - Finds `.ss-pricing` mounts and renders `PricingWidget`.
  - Also contains the “section 2 height match” logic for `index.html` + `services.html`.
- `pricing-widget/src/PricingWidget.jsx`:
  - Section 1 uses `PlanCard` (3 cards).
  - Section 2 uses `GroupCard` (3 cards).
  - Both card types render the “Book a Call” CTA as an `<a class="ss-pricing__cta">` followed by a `<div class="ss-pricing__includes">`.

Pricing “light mode / washed out aesthetic” implementation:
- `pricing-widget/src/pricing-widget.css`:
  - Base (default) styling is dark.
  - Light-mode for pricing sections is applied via page attribute selectors:
    - `.ss-pricing[data-ss-pricing-page="index.html"], ...`
    - `.ss-pricing[data-ss-pricing-page="services.html"], ...`
    - `.ss-pricing[data-ss-pricing-page^="niches/"], ...`
  - The washed-out look is driven primarily by:
    - The top `linear-gradient(... rgba(255,255,255,alpha) ...)` being very opaque.
    - Blue/pink `radial-gradient(...)` layers having relatively low alpha.
    - Additional opacity/blend layers like `.ss-pricing__gridlines` and `.ss-pricing__glow` in the light-mode scope.

Pricing CTA alignment root cause:
- `pricing-widget/src/pricing-widget.css` currently uses:
  - `.ss-pricing__card { display:flex; flex-direction:column; ... }`
  - `.ss-pricing__includes { margin-top:auto; ... }`
- Because the CTA sits *above* the includes block in the DOM, `margin-top:auto` on the includes creates a variable “gap” above includes, leaving the CTA at a variable vertical position (dependent on description height). The fix should anchor the CTA deterministically across cards.

### Services mobile image container map

Markup:
- `services.html` service rows use:
  - `<div class="service-row">`
  - `<div class="service-image neon-card">` containing a `<picture>` and `<img class="service-img">`
  - `<div class="service-content neon-card">` containing the heading and text

Base component styling:
- `src/css/components/cards.css` defines `.service-image` with an aspect-ratio padding technique on desktop, and a mobile override:
  - At `max-width: 768px`, it removes the padding-top aspect ratio and makes the image position static with `width:100%` and `height:auto` so the container wraps tightly.

Services page override causing mobile padding/space:
- `src/css/pages/services.css` adds `.page-services .service-row .service-image` and image rules with `height:100%` and `display:flex`, plus `img { height:100% !important; width:auto !important; }`.
- These overrides can reintroduce “tall container / small image” behavior on mobile, producing empty vertical space above/below images.

### Home page “Our Services” cards icon/title map

Markup:
- `index.html` “Our Services” cards are `.package-card` items in `.packages-grid`.
- Each card includes:
  - `<div class="service-title">`
  - `<img class="service-icon-img" ...>`
  - `<h3>...</h3>`

CSS causing misalignment:
- `src/css/pages/home.css` currently styles `.packages-grid .service-icon-img` with `margin-bottom: 0.75rem; display:block;`, which stacks the icon above the title.
- The fix is to make `.service-title` a flex row and remove the bottom margin from the icon.

## Execution gates

### Gate 0 — Baseline (no product changes)

Steps:
1) Run the full build + validator script:
   - `bash scripts/codex.requested-edits.sh`
2) If anything fails **before** making edits:
   - Fix only orchestration/validator issues that block the loop (record in Decision Log).
   - Do not “fix the site” yet.

Done when:
- The script runs end-to-end (it may fail on missing spec markers until implementation begins).

### Gate 1 — Pricing discovery & diagnosis (Edit 1 groundwork)

Goal:
- Confirm the Implementation Map remains accurate after opening the relevant files.
- Identify precisely which layer(s) to tune for washout.

Steps:
1) Re-check the light-mode pricing block in `pricing-widget/src/pricing-widget.css` and list the alpha values for:
   - the white linear gradient layer
   - the blue radial gradient stops
   - the pink radial gradient stops
2) Confirm whether any blend/opacity layers (`gridlines`, `glow`, card surface) are muting the background.

Done when:
- A short note is appended in Decision Log confirming which layers will be tuned (and which will not).

### Gate 2 — Pricing color washout tuning (Requested Edit 1)

Goal:
- Make blue/pink background washes **significantly more visible** while preserving a light-mode vibe.

Constraints:
- Keep the existing design language; do not redesign the pricing widget.
- Prefer adjusting existing gradient alpha/opacity rather than adding new layers.
- Must apply consistently across `index.html`, `services.html`, and `niches/*.html` pricing sections.

Steps:
1) Update light-mode background tuning in `pricing-widget/src/pricing-widget.css`:
   - Follow the acceptance thresholds in `codex/REQUESTED_EDITS_SPEC.md`.
   - Add the required marker comment exactly.
2) Rebuild pricing widget:
   - `(cd pricing-widget && npm install --no-fund --no-audit && npm run build)` (or use the repo script loop)
3) Verify visually on at least:
   - `index.html` (pricing sections 1 and 2)
   - `services.html` (pricing sections 1 and 2)
   - One niche page (e.g., `niches/estate-agents.html`) (pricing sections 1 and 2)

Done when:
- Blue/pink background washes are clearly visible (not subtle/near-white).
- The UI still reads as “light mode” (not dark or overly saturated).
- `node scripts/validate-pricing-ui-tuning.js --strict` passes.

### Gate 3 — Pricing cards CTA alignment (Requested Edit 2)

Goal:
- In every row of 3 pricing cards, the “Book a Call” buttons align horizontally.

Steps:
1) Implement the spec’s alignment strategy in `pricing-widget/src/pricing-widget.css` (and only touch JSX if strictly necessary).
2) Rebuild widget.
3) Verify on desktop widths where the grid is 3 columns:
   - Buttons align in section 1 (plan cards).
   - Buttons align in section 2 (group cards).

Done when:
- Visual alignment is consistent across each 3-card row.
- `node scripts/validate-pricing-ui-tuning.js --strict` passes.

### Gate 4 — Services mobile image container tight wrap (Requested Edit 3)

Goal:
- On mobile, the image containers above the four specified services cards tightly wrap the image (no empty vertical padding in the container).

Steps:
1) In `src/css/pages/services.css`, add a mobile-only override that:
   - Removes any forced container height behavior.
   - Ensures images render at `width: 100%` and `height: auto` inside a non-stretched container.
   - Uses the required marker comment exactly.
2) Rebuild site CSS:
   - `npm run build:css` (or run the repo script loop)
3) Manual spot-check at mobile viewports (e.g., 390×844 and 375×667) on `services.html` for the four headings listed in the spec.

Done when:
- Those image containers no longer show extra empty space above/below the image on mobile.
- `node scripts/validate-requested-edits.js --strict` passes.

### Gate 5 — Home “Our Services” icon/title inline layout (Requested Edit 4)

Goal:
- In the “Our Services” cards on `index.html`, the icon stays top-left and the title sits inline to the right on the same row.

Steps:
1) Adjust `src/css/pages/home.css` to enforce the inline layout using a flex row on the title wrapper.
2) Rebuild site CSS.
3) Spot-check on mobile and desktop widths.

Done when:
- Icon + title are on one row; icon top-left; title to its right.
- `node scripts/validate-requested-edits.js --strict` passes.

### Gate 6 — Final verification & closeout

Steps:
1) Run: `bash scripts/codex.requested-edits.sh` until fully green.
2) Walk through `codex/MANUAL_QA_CHECKLIST.md`.
3) Append a short entry to `codex/UI_CHANGE_LOG.md` describing the change and verification.
4) Ensure the change set touches only files required by the spec.

Done when:
- All validators are green.
- Manual QA checklist is satisfied.

## Progress tracker

- [x] Gate 0 complete (baseline runnable)
- [x] Gate 1 complete (tuning decisions recorded)
- [x] Gate 2 complete (pricing washout tuned + validated)
- [x] Gate 3 complete (CTA alignment fixed + validated)
- [x] Gate 4 complete (services mobile images fixed + validated)
- [x] Gate 5 complete (home service cards icon/title fixed + validated)
- [ ] Gate 6 complete (final pass + QA + change log)

## Decision log (append-only)

Record any judgment calls that affect implementation details, especially:
- Any tradeoff between light-mode vibe vs. color visibility.
- Any need to touch files outside the expected surfaces.
- Any alternative implementation chosen vs. the spec’s default approach.

- 2025-02-12: Gate 0 blocker fix — `scripts/validate-pricing-copy-map.js` now accepts `--strict` to match `scripts/codex.requested-edits.sh` invocation; no behavior change beyond arg parsing.
- 2025-02-12: Gate 1 washout diagnosis — light-mode `--ss-pricing-bg` uses white linear-gradient alphas 0.96/0.92/0.88 with blue radial 0.30/0.17 and pink radial 0.26/0.15; plan is to tune only these gradient alphas (keep gridlines/glow/card layers unchanged).
