<!-- FILE: ExecPlan_Pricing_UI_Tuning.md -->
# ExecPlan — Pricing Widget UI Tuning (Light Mode Theme + Services Scroll + Niche Badge Clearance)

This ExecPlan is written to maximize safe execution by Codex (GPT‑5.1 Codex Max or GPT‑5.2) while preventing unrelated site changes.

## Objective

The pricing widget embed is already implemented. This work tunes the existing pricing widget UI so it looks like a first-class part of the Silverstone website (premium light mode aesthetic), and fixes two specific layout issues:

1) Theme: Shift the pricing widget from the current dark-mode look to a light-mode look that matches the site palette (aqua blues, icy whites, neon pink accents).

2) `services.html` Pricing Section 2: Make the card “includes / plan list” area internally scrollable so the 3 cards do not grow taller than Pricing Section 1 above. The card heights in Section 2 must match the Section 1 card height in the layout where both sections are visible as stacked blocks (desktop/tablet).

3) `niches/*.html` Pricing Section 1: Ensure the “Most popular” badge never overlaps or is covered by the card title. Move titles down slightly for all 3 cards in Section 1 so titles remain aligned across cards.

## Scope and constraints

### Hard constraints (non-negotiable)

- Do not change pricing copy.
  - Do not edit `PRICING_COPY_MAP.md`.
  - Do not edit `pricing-widget/src/pricing-copy-map.json`.
- Do not change widget behavior beyond what is required for the scroll + height-match behavior.
  - Keep Section 1 toggle and sparkle animation fully functional.
  - Keep Section 2 toggle absent.
- Do not rework static pages.
  - Avoid editing `services.html` and `niches/*.html` unless there is no other viable option.
- Do not edit global site CSS (`assets/css/styles.css`) for this task.
- Minimize diffs; no mass formatting.

### Files that are allowed to change

Preferred (should be sufficient for this task):
- `pricing-widget/src/pricing-widget.css` (theme + targeted layout fixes)
- `pricing-widget/src/PricingWidget.jsx` and/or `pricing-widget/src/embed.jsx` (ONLY if needed for services Section 2 height-match behavior)

Generated outputs (must be rebuilt and committed after source changes):
- `assets/css/pricing-widget.css`
- `assets/js/pricing-widget.js`

Guardrails / tooling:
- `scripts/validate-pricing-ui-tuning.js` (added in this repo)
- `scripts/codex.pricing-tuning.sh` (wrapper for build + validations)

## Acceptance criteria

All of the following must be true:

### A) Light-mode theme matches the site

- The pricing widget background and cards are light/icy (not dark).
- Accent colors match the site palette (use the existing site CSS variables and gradients as the source).
- Text is readable in light mode and retains the current hierarchy (title, subtitle, price, description, list).
- Toggle and sparkle animations remain present and smooth.

### B) Services page — Section 2 internal scroll + height match

On `services.html`, Pricing Section 2 cards:
- The “plans list” area (the lower section containing the list) scrolls internally when content exceeds available space.
- The overall card heights in Pricing Section 2 match the card height of Pricing Section 1 above (in the desktop/tablet layout).
- Behavior degrades gracefully on small screens (height match may be recalculated per breakpoint, but must not break layout).

### C) Niche pages — Section 1 badge/title clearance

On every page in `niches/*.html`, Pricing Section 1:
- The “Most popular” badge is fully visible and never covered by the title.
- All 3 card titles are aligned (same vertical starting position).
- This is achieved via CSS scoped to niche pages and section 1 only (no global changes).

### D) No regressions

- Existing validators still pass:
  - `node scripts/validate-services-page.js --strict`
  - `node scripts/validate-niche-pages.js --strict`
  - `node scripts/validate-pricing-copy-map.js`
  - `node scripts/validate-pricing-mounts.js`
- Tuning validator passes (strict):
  - `node scripts/validate-pricing-ui-tuning.js --strict`

## Implementation notes (required approach)

### 1) Theme work must be tokenized and scoped

Implement the light-mode theme by introducing pricing-widget-scoped CSS custom properties inside `.ss-pricing` (or `.ss-pricing .ss-pricing__widget`) and then re-pointing existing rules to those properties.

Required variables (must exist in `pricing-widget/src/pricing-widget.css`):
- `--ss-pricing-bg`
- `--ss-pricing-surface`
- `--ss-pricing-text`
- `--ss-pricing-muted`
- `--ss-pricing-border`
- `--ss-pricing-accent` (must be derived from `var(--color-blue, ...)`)
- `--ss-pricing-accent-2` (must be derived from `var(--color-purple, ...)`)
- `--ss-pricing-accent-pink` (neon pink accent)

This approach keeps changes localized and makes future palette tuning trivial.

Add this required marker comment near the token block:

- `SS_PRICING_SPEC: THEME_LIGHT_MODE_NEON`

### 2) Services Section 2 scroll must scroll only the list area

The scroll must apply only to the list area, not the whole card.

Preferred implementation:
- Add a dedicated wrapper inside the “includes” section for Section 2 cards only (example: `.ss-pricing__includes-body`) so overflow can be applied to that wrapper.
- Ensure the flexbox layout allows the scroll region to shrink; set `min-height: 0` on the relevant flex containers.

Add this required marker comment near the CSS for this behavior:

- `SS_PRICING_SPEC: SERVICES_SECTION2_INTERNAL_SCROLL`

### 3) Services Section 2 height matching must be automatic

Hardcoding a pixel height is not acceptable (it will break across typography changes and breakpoints).

Preferred implementation:
- Measure the rendered card height from Pricing Section 1 (on `services.html`) and apply that value to Section 2 cards as a CSS custom property on the Section 2 mount or widget root (example: `--ss-pricing-match-height: 520px;`).
- Recompute on resize and when the Section 1 widget size changes (e.g., using `ResizeObserver`).

Add this required marker comment near the JS implementation:

- `SS_PRICING_SPEC: SERVICES_SECTION2_HEIGHT_MATCH`

### 4) Niche Section 1 badge/title clearance must be scoped and consistent

Implement this with CSS scoped to:

- parent mount: `.ss-pricing[data-ss-pricing-page^="niches/"][data-ss-pricing-section="1"]`

Required behavior:
- Move titles down slightly for all 3 cards (not just the featured card) to keep alignment.
- Reserve space so titles never render under the badge, and ensure the badge is always above other content (use z-index if needed).

Add this required marker comment near the CSS for this behavior:

- `SS_PRICING_SPEC: NICHES_SECTION1_BADGE_TITLE_CLEARANCE`

## Milestone gates

### Gate 0 — Baseline (no edits)

Run:
- `bash scripts/codex.setup.sh`
- `bash scripts/codex.maintenance.sh`

Confirm:
- All existing validators pass.
- Pricing widget is present on `services.html` and `niches/*.html`.

### Gate 1 — Apply tokenized light theme (CSS only)

1. Edit `pricing-widget/src/pricing-widget.css`:
   - Add the required CSS custom property token block.
   - Replace existing dark gradients/colors with token references.
   - Keep spacing/layout unchanged.

2. Rebuild widget:
   - `(cd pricing-widget && npm install && npm run build)`

3. Validate:
   - `node scripts/validate-pricing-ui-tuning.js` (non-strict is fine mid-flight)
   - `node scripts/validate-pricing-mounts.js`

### Gate 2 — Services Section 2 scroll + height match

1. Implement internal scroll and height matching (minimal, scoped to `services.html` section 2 only).
2. Rebuild widget.
3. Validate:
   - `bash scripts/codex.pricing-tuning.sh`

### Gate 3 — Niche Section 1 badge/title clearance

1. Implement scoped CSS fix for niche pages section 1.
2. Rebuild widget.
3. Validate:
   - `bash scripts/codex.pricing-tuning.sh`

### Gate 4 — Manual spot checks

Open in a browser:
- `services.html` (check both sections)
- `niches/estate-agents.html` (or any niche page where the badge previously overlapped)

Confirm visually:
- Light theme matches site aesthetic.
- Toggle works (Monthly ↔ Setup) and animation intact.
- Services Section 2 cards are equal height to Section 1 and list scrolls internally.
- Niche Section 1 badge is not overlapped and titles align.

## Stop conditions (hard)

Stop and report if:
- Achieving the light theme requires modifying global site CSS.
- Height matching cannot be achieved without hardcoding fragile pixel heights.
- Fixing the badge overlap requires changing pricing copy.
- Any unrelated HTML layout changes occur outside the pricing widget.
