<!-- FILE: codex/PRICING_UI_TUNING_SPEC.md -->
# Pricing Widget UI Tuning Spec (Light Mode + Services Scroll + Niche Badge Clearance)

This spec complements `ExecPlan_Pricing_UI_Tuning.md`. It provides concrete, file-scoped guidance for Codex to implement the tuning changes with minimal risk.

## Scope

This work tunes the already-embedded pricing widget. It must not change copy or core behavior.

### Do not change
- `PRICING_COPY_MAP.md`
- `pricing-widget/src/pricing-copy-map.json`
- `services.html` and `niches/*.html` (avoid editing)
- global site styles (`assets/css/styles.css`)

### Allowed to change
- `pricing-widget/src/pricing-widget.css`
- `pricing-widget/src/PricingWidget.jsx` and/or `pricing-widget/src/embed.jsx` (only for services height-match logic)
- rebuilt outputs in `assets/`

## Site palette reference (repo source-of-truth)

Use the existing site CSS variables as the basis for the pricing widget theme:

- `--color-blue` (primary aqua accent)
- `--color-purple` (secondary accent)
- `--color-green` (supporting neon accent)
- neutrals such as `--color-white` and `--color-black`

These are defined in `assets/css/styles.css` under `:root`.

The pricing widget must reference these variables (with safe fallbacks) via CSS custom properties.

## Required CSS tokens

Add a token block near the top of `pricing-widget/src/pricing-widget.css`:

- `SS_PRICING_SPEC: THEME_LIGHT_MODE_NEON`

Token names must match the ExecPlan requirements:

- `--ss-pricing-bg`: widget background (light / icy)
- `--ss-pricing-surface`: card surface background (white with subtle tint)
- `--ss-pricing-text`: primary text (dark)
- `--ss-pricing-muted`: muted text
- `--ss-pricing-border`: card/widget border color
- `--ss-pricing-accent`: derive from `var(--color-blue, ...)`
- `--ss-pricing-accent-2`: derive from `var(--color-purple, ...)`
- `--ss-pricing-accent-pink`: neon pink accent (local variable is fine)

Guidelines:
- Prefer subtle gradients and soft shadows.
- Keep the existing layout, spacing, and typography scale; only adjust colors, borders, and shadows.
- Ensure contrast for text against light backgrounds.

## Sparkles + glow in light mode

The sparkle canvas and glow layers must remain functional. In light mode:
- If white sparkles become invisible, recolor them (aqua/pink) or use blending so they remain visible but subtle.
- Keep `prefers-reduced-motion` behavior intact.

## Services page — Section 2 internal scroll

Goal:
- Only the list area scrolls internally.
- The rest of the card (title/description/CTA) stays fixed.

Required marker in CSS near the scoping rules:
- `SS_PRICING_SPEC: SERVICES_SECTION2_INTERNAL_SCROLL`

Scoping (must be exact and narrow):
- Use the parent mount attributes:
  - `.ss-pricing[data-ss-pricing-page="services.html"][data-ss-pricing-section="2"] ...`

Implementation options (choose the smallest viable):
1) Add a wrapper element inside Section 2 “includes” content (recommended):
   - `.ss-pricing__includes-body` wraps the list.
   - Apply `overflow-y: auto;` to the wrapper.
   - Ensure the wrapper can shrink inside a flex column by setting `min-height: 0` on appropriate ancestors.

2) If avoiding markup changes:
   - Apply overflow directly to `.ss-pricing__group-list`, but only if layout still allows the list to shrink and scroll.

## Services page — Section 2 height match

Goal:
- Match Section 2 card heights to the Section 1 card height above on `services.html`.

Required marker in JS (in either `pricing-widget/src/embed.jsx` or `pricing-widget/src/PricingWidget.jsx`):
- `SS_PRICING_SPEC: SERVICES_SECTION2_HEIGHT_MATCH`

Required behavior:
- Do not hardcode a fixed pixel height.
- Compute the height from the rendered Section 1 cards (post-render).
- Apply height to Section 2 cards via a CSS custom property (example name is flexible, but must be applied to Section 2 cards).
- Recompute on resize and when Section 1 changes size.

Failure-tolerant rules:
- If Section 1 mount cannot be found, do nothing (do not crash).
- Ensure cleanup on unmount.

## Niche pages — Section 1 badge/title clearance

Problem:
- The Section 1 featured badge (“Most popular”) overlaps/gets covered by the title on niche pages.

Goal:
- Titles move down slightly for all cards (alignment preserved).
- The badge never overlaps/gets covered.

Required marker in CSS near the scoping rules:
- `SS_PRICING_SPEC: NICHES_SECTION1_BADGE_TITLE_CLEARANCE`

Scoping:
- `.ss-pricing[data-ss-pricing-page^="niches/"][data-ss-pricing-section="1"] ...`

Recommended fix (CSS-only):
- Give the badge a clear stacking order:
  - set a `z-index` on `.ss-pricing__badge`
- Reserve horizontal space so titles never render under the badge:
  - add `padding-right` to `.ss-pricing__card-title` within the scoped selector
- Move titles down slightly for all cards in Section 1 niche pages:
  - add a small `margin-top` or `padding-top` on `.ss-pricing__card-title` (scoped)

Do not change badge text or positioning outside the widget.

## Validation commands

During implementation:
- `node scripts/validate-pricing-ui-tuning.js` (non-strict; for progress checks)

After completion:
- `bash scripts/codex.pricing-tuning.sh`
- Or run:
  - `node scripts/validate-services-page.js --strict`
  - `node scripts/validate-niche-pages.js --strict`
  - `node scripts/validate-pricing-copy-map.js`
  - `node scripts/validate-pricing-mounts.js`
  - `node scripts/validate-pricing-ui-tuning.js --strict`
