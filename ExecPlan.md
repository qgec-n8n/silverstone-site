<!-- FILE: ExecPlan.md -->
# ExecPlan — UI Fixes (Requested Edits 1–5)

Owner: Codex CLI
Scope: Silverstone Site frontend UI fixes per `codex/REQUESTED_EDITS_SPEC.md`.

## Progress

- [ ] Gate 0 — Baseline scan + confirm file locations + run current validations
- [ ] Gate 1 — Stats icons added (index + about) + stats color rules enforced globally
- [ ] Gate 2 — Services mobile-only “image on top of text card” pattern (services.html)
- [ ] Gate 3 — Pricing “£” baseline alignment fix (index/services/niches pricing areas)
- [ ] Gate 4 — Pricing background redesign (light-mode, premium; CTA upgrade; sparkles high visibility; page-scoped)
- [ ] Gate 5 — Full validation pass + manual QA checklist pass

## Non-negotiable constraints (do not violate)

- No copy changes unless explicitly required (this request has **no** copy changes).
- No pricing layout / functionality changes; aesthetics only (colors/fonts/backgrounds/buttons/sparkles visibility).
- No scope creep outside the pages/files listed in `AGENTS.md`.

## Repo orientation (what to touch)

- Pages:
  - `index.html` (stats icons + pricing mount)
  - `about.html` (stats icons)
  - `services.html` (mobile card pattern + pricing mount + stats styling)
  - `niches/*.html` (pricing + stats styling; generally CSS-driven)

- Pricing widget:
  - Source: `pricing-widget/src/PricingWidget.jsx`, `pricing-widget/src/pricing-widget.css`
  - Outputs: `assets/js/pricing-widget.js`, `assets/css/pricing-widget.css`

- Shared CSS:
  - Source: `src/css/components/stats.css`, `src/css/pages/services.css`, `src/css/pages/estate-agents.css` (only if needed)
  - Output: `assets/css/styles.css`

## Execution strategy (gated)

### Gate 0 — Baseline scan + validations

1. Identify all pricing mounts:
   - Confirm `index.html`, `services.html`, and `niches/*.html` contain `.ss-pricing` mounts with `data-ss-pricing-page=...`.
2. Identify stats sections:
   - Confirm index/about have `.stats` blocks without icons today (baseline).
3. Run baseline build + validations:
   - `bash scripts/codex.requested-edits.sh`
4. Record any surprises in the section below.

### Gate 1 — Stats icons + global stats colors

Goal:
- Add icons to stats cards on **index.html** and **about.html** (match the services.html structure).
- Enforce global stats styling rules:
  - icons: green
  - numbers: blue
  - labels: white

Constraints:
- Do not change stat numbers or label copy.
- Use only existing local Font Awesome icon class names already mapped in `src/css/base/typography.css`.

Deliverables:
- Marker: `SS_STATS_SPEC: ICONS_ADDED_HOME_ABOUT` in index/about.
- Marker: `SS_STATS_SPEC: COLORS_ICON_GREEN_NUMBER_BLUE_LABEL_WHITE` in `src/css/components/stats.css` and built css.

Verification:
- `node scripts/validate-requested-edits.js --strict` must pass after rebuild.

### Gate 2 — Services mobile-only image-top pattern

Goal:
- On **services.html**, for service rows that include an image card, ensure that on mobile the image appears **above** the text card (and is not nested inside the text card), matching the niche-page mobile pattern.

Constraints:
- Desktop/tablet layout must remain unchanged.
- Prefer CSS-only reordering in a mobile media query; avoid HTML restructuring unless required.

Deliverables:
- Marker: `SS_SERVICES_SPEC: MOBILE_IMAGE_TOP_PATTERN` in `src/css/pages/services.css` and built css.

Verification:
- `node scripts/validate-requested-edits.js --strict` must pass after rebuild.

### Gate 3 — Pricing “£” alignment

Goal:
- In pricing areas on index/services/niches pages, ensure the “£” symbol aligns cleanly with the digits (baseline-aligned, not floating).

Constraints:
- Do not change pricing amounts, plan labels, or the monthly/setup toggle behavior.
- Do not remove per-digit scroll animation (existing behavior).

Deliverables:
- Marker: `SS_PRICING_SPEC: GBP_SYMBOL_BASELINE_ALIGN` in pricing widget css + built css.

Verification:
- `node scripts/validate-pricing-ui-tuning.js --strict` must pass after rebuild.
- Manual check: multiple breakpoints, toggle monthly/setup.

### Gate 4 — Pricing section background redesign (page-scoped)

Goal:
- On index/services/niches pages only:
  - Make pricing section backgrounds aesthetically similar to `body-section-background-2025.webp` but not identical.
  - Achieve a sleek, vibrant, premium/luxurious **light-mode** aesthetic.
  - Make “Book a Call” buttons more enticing.
  - Keep sparkles animation extremely visible.
  - Use some of the site’s blue for key text accents.
  - Keep copy/layout/functionality unchanged.

Constraints:
- Page-scoped via existing `data-ss-pricing-page` attribute.
- Do not change pricing markup structure except what’s required for sparkles visibility or symbol alignment.

Deliverables:
- Marker: `SS_PRICING_SPEC: LIGHT_MODE_BG_BODYSECTION_INSPIRED_NOT_IDENTICAL` in pricing widget css + built css.
- Marker: `SS_PRICING_SPEC: CTA_BOOK_CALL_PREMIUM_LIGHT_MODE` in pricing widget css + built css.
- Marker: `SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE` in pricing widget css + PricingWidget.jsx + built outputs.

Verification:
- `node scripts/validate-pricing-ui-tuning.js --strict` must pass after rebuild.
- Manual check: sparkles visibility on light background, CTA hover/focus states.

### Gate 5 — Final pass

1. Run full validation script:
   - `bash scripts/codex.requested-edits.sh`
2. Run manual QA:
   - Follow `codex/MANUAL_QA_CHECKLIST.md` exactly.

## Surprises & discoveries

(Write findings here during execution.)

## Decision log

(Record decisions that affect implementation, e.g., chosen icon mapping, chosen pricing theme variable values, any scoping choices.)

## Outcomes & retrospective

(After completion: what changed, what was tricky, what to watch next time.)
