<!-- FILE: codex/REQUESTED_EDITS_SPEC.md -->
# Requested Website Edits (1–7) — Source of Truth

This document is the single source of truth for the current task. Implement all seven edits, and do not make unrelated changes.

## Pages in scope

- `index.html`
- `services.html`
- `niches/*.html` (pricing widgets only; no content/copy changes expected)

## Shared constraints

- Preserve existing copy exactly, except Requested Edit 4 which removes a single extra line break (no wording changes).
- Preserve dark-mode design; pricing changes are specifically for the pricing widget’s “light mode” look on index/services/niches pages.
- Keep all visual changes page-scoped and section-scoped using existing selectors and data attributes (avoid global overrides).
- Do not hand-edit generated files under `assets/`; only update them through build scripts.

## Required marker comments

To keep validation deterministic, Codex must add/keep these marker comments (exact strings):

Pricing widget:
- In `pricing-widget/src/pricing-widget.css` (and therefore in `assets/css/pricing-widget.css` after build):
  - `SS_PRICING_SPEC: LIGHT_MODE_BG_BODYSECTION_INSPIRED_NOT_IDENTICAL` (existing; update values beneath it)
  - `SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE` (existing; keep and tune)
  - `SS_PRICING_SPEC: TOGGLE_TRACK_WHITE_LIGHT_MODE` (new)
  - `SS_PRICING_SPEC: NICHES_SECTION1_FEATURED_CARD_PREMIUM_HIGHLIGHT` (new)
- In `pricing-widget/src/PricingWidget.jsx`:
  - `SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE` (existing; keep and tune)

Home page:
- In `src/css/pages/home.css` (and therefore in `assets/css/styles.css` after build):
  - `SS_HOME_SPEC: SERVICES_TITLES_BLUE_TAGLINES_GREY` (new; place next to the rule that enforces titles blue)

Services mobile bug fix:
- In `src/css/base/typography.css` (and therefore in `assets/css/styles.css` after build):
  - `SS_SERVICES_SPEC: MOBILE_IMAGE_OUTSIDE_TEXT_CARD_MATCH_NICHE_PATTERN` (new; place where the mobile “Services mobile cards” block was removed)

## Requested Edit 1 — Pricing background more vibrant + sparkles clearer

Files to change (widget only):
- `pricing-widget/src/pricing-widget.css`
- `pricing-widget/src/PricingWidget.jsx`

Definition of done (acceptance + verification):
- Only pricing widgets on `index.html`, `services.html`, and `niches/*` are affected (scoped via `data-ss-pricing-page`); other pages keep existing styling.
- In the light-mode block, increase the blue/pink radial gradient alphas to these exact values:
  - blue: `rgba(0, 174, 239, 0.30)` and `rgba(0, 174, 239, 0.17)`
  - pink: `rgba(255, 79, 216, 0.26)` and `rgba(255, 79, 216, 0.15)`
  (keep the same overall layering order and background image usage; this is a vibrancy boost, not a redesign)
- Sparkles are visibly clearer against the light background by:
  - slightly increasing particle visibility in `PricingWidget.jsx` (raise alpha floor + radius floor; keep motion subtle)
  - slightly strengthening the `.ss-pricing__sparkles` filter/clarity within the existing light-mode scope
- Rebuild the widget and confirm the change renders on at least:
  - `/index.html` pricing section
  - `/services.html` pricing section
  - one `/niches/*.html` pricing section
- `node scripts/validate-pricing-ui-tuning.js --strict` passes.

## Requested Edit 2 — Niche pages: first pricing section featured card is extremely premium

Files to change:
- `pricing-widget/src/pricing-widget.css`

Definition of done (acceptance + verification):
- Only niche pages (`data-ss-pricing-page^="niches/"`) and only the first pricing section (`data-ss-pricing-section="1"`) get the stronger highlight.
- The featured card (`.ss-pricing__card.is-featured`) is unmistakably the highlighted option via a premium “raised” treatment (transform + stronger shadow + clearer border/accent), without breaking grid layout.
- The “Most popular” badge remains legible, not clipped, and does not overlap the plan title (works at mobile and desktop widths).
- Non-featured cards remain visually consistent with the existing light-mode design (no global retheme).
- Verify on at least two niche pages at desktop and mobile widths.
- `node scripts/validate-pricing-ui-tuning.js --strict` passes.

## Requested Edit 3 — Pricing toggle track is white (not grey)

Files to change:
- `pricing-widget/src/pricing-widget.css`

Definition of done (acceptance + verification):
- For pricing widgets that render the monthly/setup toggle, the toggle track background is white in light mode (not grey/dark).
- Styling remains page-scoped to index/services/niches and does not affect other widgets/pages.
- Toggle remains readable: active/inactive states are clear and the slider still feels premium.
- Rebuild and verify on pages where the toggle exists.
- `node scripts/validate-pricing-ui-tuning.js --strict` passes.

## Requested Edit 4 — index.html: remove extra line in Systems & Data Integration card

Files to change:
- `index.html`

Definition of done (acceptance + verification):
- Remove the extra blank line between:
  - “Connect your tools so data flows without copy-paste.”
  - “Link CRM, booking, email and payments”
  (This is currently a literal `<br />` in the card content.)
- Do not change wording, punctuation, or spacing of any other copy in that card.
- `node scripts/validate-requested-edits.js --strict` passes.

## Requested Edit 5 — index.html “Our services” taglines are grey

Files to change:
- `src/css/pages/home.css` (preferred; scope to `.page-home`)

Definition of done (acceptance + verification):
- In the “What we automate” cards on `index.html`, these taglines render as grey text:
  - “Get clear on what to automate first - and what to leave alone.”
  - “Stop enquiries going cold with fast, personal follow-up.”
  - “Remove manual admin and get visibility across your ops.”
  - “Connect your tools so data flows without copy-paste.”
- The change is scoped to the home page card section (no global `.tagline` changes site-wide).
- `node scripts/validate-requested-edits.js --strict` passes.

## Requested Edit 6 — index.html “Our services” titles are blue

Files to change:
- `src/css/pages/home.css` (preferred; scope to `.page-home`)

Definition of done (acceptance + verification):
- In the “What we automate” cards on `index.html`, these titles render blue:
  - “AI Consulting & Readiness”
  - “Automated Lead Follow-Up”
  - “Workflow Automation & Reporting”
  - “Systems & Data Integration”
- Do not change the card layout, spacing, or copy.
- `node scripts/validate-requested-edits.js --strict` passes.

## Requested Edit 7 — EXTREMELY IMPORTANT: services.html mobile image-in-card bug fix

Files to change (root-cause fix expected in CSS):
- `src/css/base/typography.css`
- (Do not change `services.html` unless absolutely necessary)

Definition of done (acceptance + verification):
- On mobile widths (test 390×844 and 375×667), in `services.html`, the following three service rows must match the `niches/estate-agents.html` pattern:
  - “Where revenue (and time) quietly leaks away.”
  - “Start small. Ship fast. Expand when it is working”
  - “General Service Lines:”
  Specifically: image outside the text card; the card contains only text/bullets.
- The fix must remove/disable the mobile-only “Services mobile cards” styling that turns the whole `.service-row` into one card (currently in `src/css/base/typography.css`).
- On mobile, the two headings “Where revenue…leaks away.” and “Start small…working” must render in blue (not white).
- Desktop layout must remain unchanged; only mobile behavior is affected.
- `node scripts/validate-requested-edits.js --strict` passes.
