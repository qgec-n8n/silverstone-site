<!-- FILE: codex/REQUESTED_EDITS_SPEC.md -->
# Requested UI Fixes (1–5) — Source of Truth

This file is the single source of truth for the current Codex CLI task.

## Pages in scope

- Pricing edits (1–2):
  - `index.html`
  - `services.html`
  - `niches/*.html`

- Services mobile-only card edit (3):
  - `services.html`

- Stats icons + styling edits (4–5):
  - `index.html`
  - `about.html`
  - `services.html`
  - `niches/*.html`

## Global constraints (apply to all edits)

- Do not change copy unless explicitly instructed (this spec has **no** copy changes).
- Do not change layout or functionality unless explicitly instructed.
- Prefer CSS variable overrides and scoped selectors over refactors.
- Keep all existing marker comments not replaced by this spec.

## Required marker comments (must exist exactly)

These markers are REQUIRED for deterministic validation. They must appear in BOTH:
- the source file
- the rebuilt output file (if the file has a build output)

### Stats markers

- `SS_STATS_SPEC: ICONS_ADDED_HOME_ABOUT`
  - Must appear in: `index.html`, `about.html`

- `SS_STATS_SPEC: COLORS_ICON_GREEN_NUMBER_BLUE_LABEL_WHITE`
  - Must appear in: `src/css/components/stats.css`
  - Must also appear in rebuilt: `assets/css/styles.css`

### Services mobile marker

- `SS_SERVICES_SPEC: MOBILE_IMAGE_TOP_PATTERN`
  - Must appear in: `src/css/pages/services.css`
  - Must also appear in rebuilt: `assets/css/styles.css`

### Pricing widget markers

- `SS_PRICING_SPEC: GBP_SYMBOL_BASELINE_ALIGN`
  - Must appear in: `pricing-widget/src/pricing-widget.css`
  - Must also appear in rebuilt: `assets/css/pricing-widget.css`

- `SS_PRICING_SPEC: LIGHT_MODE_BG_BODYSECTION_INSPIRED_NOT_IDENTICAL`
  - Must appear in: `pricing-widget/src/pricing-widget.css`
  - Must also appear in rebuilt: `assets/css/pricing-widget.css`

- `SS_PRICING_SPEC: CTA_BOOK_CALL_PREMIUM_LIGHT_MODE`
  - Must appear in: `pricing-widget/src/pricing-widget.css`
  - Must also appear in rebuilt: `assets/css/pricing-widget.css`

- `SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE`
  - Must appear in:
    - `pricing-widget/src/pricing-widget.css`
    - `pricing-widget/src/PricingWidget.jsx`
  - Must also appear in rebuilt:
    - `assets/css/pricing-widget.css`
    - `assets/js/pricing-widget.js`

## Edit 1 — Pricing “£” alignment (index/services/niches)

Goal:
- In all pricing displays, the “£” symbol must baseline-align with the digits (no vertical drift).

Implementation requirements:
- Prefer a CSS-only fix in the pricing widget:
  - Target `ss-pricing__price-digits` and `ss-pricing__price-prefix`.
  - Ensure the container aligns items on the baseline (not bottom).
  - Ensure the prefix has an explicit line-height consistent with the digits.
- Do not change:
  - any number values
  - any plan names
  - the monthly/setup toggle behavior or animation logic (no functionality changes)

Acceptance criteria:
- On index/services and at least 2 niches pages:
  - Check both billing modes (Monthly + Setup) at desktop and mobile widths.
  - “£” visually aligns with the first digit across all cards.

## Edit 2 — Pricing background redesign (index/services/niches only)

Goal:
- Make the pricing section background visually aligned with `body-section-background-2025.webp` (palette + vibe),
  but clearly not identical.
- The result must feel:
  - sleek
  - vibrant
  - premium/luxurious
  - light-mode (high-key, bright surfaces, not dark “night mode”)

Hard constraints:
- Do NOT change:
  - pricing layout
  - pricing copy
  - plan structure
  - CTA text (“Book a Call” must remain exactly)
  - any functionality/JS behavior (except aesthetics of sparkles visibility)

Page scoping (mandatory):
- The new light-mode theme must apply ONLY when:
  - `data-ss-pricing-page="index.html"`
  - `data-ss-pricing-page="services.html"`
  - `data-ss-pricing-page` starts with `niches/`
- Other pages that mount pricing must keep the existing styling.

Design requirements:
- Background:
  - Use a new background stack (gradients/overlays) that is inspired by the body-section background.
  - It may reuse `body-section-background-2025.webp` as one layer, but must add enough new layering
    (e.g., brighter overlay + different gradient arrangement) so the combined result is not identical.
  - Ensure the base is light-mode (bright, airy, premium).
- Blue accents:
  - Use the site blue (`--color-blue`) for selected headings/emphasis where it improves the aesthetic.
- CTA (“Book a Call”) button:
  - Must look more enticing than current: stronger contrast, premium gradient, subtle glow, clear hover/focus.
- Sparkles:
  - Must remain extremely visible against the new light background.
  - Achieve via CSS filters/opacity and/or sparkles rendering tweaks (aesthetics-only).

Acceptance criteria:
- On index/services and at least 2 niches pages:
  - Pricing background looks light-mode and premium.
  - Sparkles remain obvious at a glance (not faint).
  - CTA is visually prominent and premium without changing its text.

## Edit 3 — Services page mobile-only image/top-of-card pattern

Goal:
- On `services.html` (mobile only), service rows with images must match the niche-page mobile pattern:
  - image appears above the text card
  - image is NOT nested inside the text card

Constraints:
- Desktop/tablet layout must remain unchanged.
- Prefer CSS reordering in the mobile media query rather than HTML restructuring.
- Only apply this behavior on mobile breakpoints.

Acceptance criteria:
- At <= 768px width:
  - Each `.service-row` image is visually stacked above its corresponding text card.
  - No `<img>` elements are nested inside `.service-content` for these rows.

## Edit 4 — Add stats icons on index + about

Goal:
- Add icons above the numbers on `index.html` and `about.html`, matching the structure on `services.html`.

Icon mapping (use exactly these class names):

- index.html stats icons:
  - 24/7 Always-On Coverage  -> `fa-solid fa-bell`
  - Under 60 Seconds         -> `fa-solid fa-clock`
  - 50+ Workflows Delivered  -> `fa-solid fa-gears`
  - 5-Star Rated             -> `fa-solid fa-check-circle`

- about.html stats icons:
  - 7+ Years Experience              -> `fa-solid fa-calendar-check`
  - 300% Average Efficiency Gains    -> `fa-solid fa-chart-line`
  - 20+ Automation Systems Built     -> `fa-solid fa-diagram-project`
  - 0 Wasted Time                    -> `fa-solid fa-bolt`

Constraints:
- Do not change the stat number text or label copy.
- Icons must be inserted as:
  - `<div class="stat-icon"><i class="fa-solid fa-..."></i></div>`
  and must appear above the `.number` element.

## Edit 5 — Stats styling consistency

Goal:
- Across index/about/services/niches pages:
  - stat icons are green
  - stat numbers are blue
  - stat labels are white

Implementation requirements:
- Implement via `src/css/components/stats.css` (shared component styling).
- If any page-specific css overrides `.stat-icon` color (e.g., `src/css/pages/estate-agents.css`), remove or neutralize it.

Acceptance criteria:
- All listed pages show:
  - icons: green
  - numbers: blue
  - labels: white
- No regressions to layout/spacing in stats cards.

## How to verify (mandatory)

1. Run automated validations:
   - `bash scripts/codex.requested-edits.sh`

2. Run manual QA:
   - Follow `codex/MANUAL_QA_CHECKLIST.md`
