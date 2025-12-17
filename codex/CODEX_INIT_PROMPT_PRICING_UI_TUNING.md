<!-- FILE: codex/CODEX_INIT_PROMPT_PRICING_UI_TUNING.md -->
# Codex Initiation Prompt — Pricing Widget UI Tuning

You are Codex running in this repository.

## Model constraint

Use only **GPT-5.1 Codex Max** or **GPT-5.2**.

## Mission

The pricing widget is already embedded and working. Your mission is to tune the pricing widget UI WITHOUT changing pricing copy or core behavior:

1) Restyle the pricing widget to a **premium light-mode** look that matches the site palette (aqua blues, icy whites, neon pink accents).

2) `services.html` — Pricing Section 2:
   - Add internal scroll to the lower list area inside each card.
   - Ensure Section 2 cards match the height of Section 1 cards above (desktop/tablet layout).
   - Do not hardcode a fragile pixel height.

3) All `niches/*.html` — Pricing Section 1:
   - Fix the “Most popular” badge/title overlap by moving titles down slightly (for all 3 cards) and ensuring the badge is never covered.
   - Titles must remain aligned across cards.

## Non-negotiable constraints

- Do not modify copy:
  - Do not edit `PRICING_COPY_MAP.md`.
  - Do not edit `pricing-widget/src/pricing-copy-map.json`.
- Do not modify page HTML unless absolutely unavoidable (this task should be achievable inside the widget).
- Do not edit global site styles (`assets/css/styles.css`) for this task.
- Preserve:
  - Section 1 toggle behavior and sliding animation
  - sparkle animation (may recolor for light mode)
  - Section 2 has no toggle

## Required reading order

Read these files before editing:
1. `ExecPlan_Pricing_UI_Tuning.md`
2. `codex/PRICING_UI_TUNING_SPEC.md`
3. `AGENTS.md`
4. `assets/css/styles.css` (palette reference)
5. Pricing widget sources:
   - `pricing-widget/src/pricing-widget.css`
   - `pricing-widget/src/PricingWidget.jsx`
   - `pricing-widget/src/embed.jsx`

## Execution rules

Follow `ExecPlan_Pricing_UI_Tuning.md` gates in order.

Use an evaluation flywheel:
- make a small change
- rebuild the widget
- run the most relevant validator(s)
- proceed

## Required markers (must be added exactly)

You must add these marker comments (used by `scripts/validate-pricing-ui-tuning.js`):

In `pricing-widget/src/pricing-widget.css`:
- `SS_PRICING_SPEC: THEME_LIGHT_MODE_NEON`
- `SS_PRICING_SPEC: SERVICES_SECTION2_INTERNAL_SCROLL`
- `SS_PRICING_SPEC: NICHES_SECTION1_BADGE_TITLE_CLEARANCE`

In `pricing-widget/src/embed.jsx` OR `pricing-widget/src/PricingWidget.jsx`:
- `SS_PRICING_SPEC: SERVICES_SECTION2_HEIGHT_MATCH`

## Build + validate

After every meaningful change:
- Rebuild widget:
  - `(cd pricing-widget && npm install && npm run build)`

At the end, run:
- `bash scripts/codex.pricing-tuning.sh`

## Completion output

When finished, summarize:
- Which files changed
- Which commands were run
- Manual checks performed on `services.html` and at least one niche page
- Any deviations (should be none)
