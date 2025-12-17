<!-- FILE: codex/INITIATION.md -->
# Codex initiation

Use this in the repo before starting a Codex task.

## Quick Start (Pricing UI tuning)
1. Run `bash scripts/codex.setup.sh`
2. Start Codex with the prompt in `codex/CODEX_INIT_PROMPT_PRICING_UI_TUNING.md`

## Quick Start (Original pricing embed)
1. Run `bash scripts/codex.setup.sh`
2. Start Codex with the prompt in `codex/CODEX_INIT_PROMPT.md`

## What Codex Must Read (Pricing UI tuning, in order)
1. `codex/CODEX_INIT_PROMPT_PRICING_UI_TUNING.md`
2. `ExecPlan_Pricing_UI_Tuning.md`
3. `codex/PRICING_UI_TUNING_SPEC.md`
4. `AGENTS.md`
5. `assets/css/styles.css` (palette reference)
6. Pricing widget sources:
   - `pricing-widget/src/pricing-widget.css`
   - `pricing-widget/src/PricingWidget.jsx`
   - `pricing-widget/src/embed.jsx`
7. Existing pricing embed validators:
   - `scripts/validate-pricing-mounts.js`
   - `scripts/validate-pricing-copy-map.js`

## What Codex Must Read (Original pricing embed, in order)
1. `codex/CODEX_INIT_PROMPT.md` (the copy/paste run prompt)
2. `ExecPlan.md`
3. `codex/PRICING_WIDGET_SPEC.md`
4. `codex/PRICING_COPY_MAP_SPEC.md`
5. `codex/PRICING_INTEGRATION_SPEC.md`
6. `AGENTS.md`
7. `PRICING_COPY_MAP.md`
8. `pricing_code_prompt.md`
9. Hero shader code: `src/js/hero-shader.js` (and confirm invariants in target HTML pages)

## Definition of Done (Pricing UI tuning)
- Widget palette is light-mode and matches the site aesthetic (aqua/icy-white/pink accents) while preserving layout and functionality
- `services.html` Pricing Section 2:
  - cards match the height of Pricing Section 1 above (desktop layout)
  - the lower list area scrolls internally (no card height growth)
- All niche pages (`niches/*.html`) Pricing Section 1:
  - “Most popular” badge is never overlapped/covered by the title
  - titles remain aligned across the 3 cards
- Copy remains unchanged
- All validations pass:
  - `node scripts/validate-services-page.js --strict`
  - `node scripts/validate-niche-pages.js --strict`
  - `node scripts/validate-pricing-copy-map.js`
  - `node scripts/validate-pricing-mounts.js`
  - `node scripts/validate-pricing-ui-tuning.js --strict`

## Definition of Done (pricing embed)
- Every target page has 2 pricing sections × 3 cards each (6 cards total)
- Section 1 includes a Monthly/Setup toggle that switches prices correctly
- Section 2 has no toggle and shows all mapped copy
- Visual fidelity matches pricing reference component
- Hero shader remains functional and unchanged
- All validations pass:
  - `node scripts/validate-services-page.js --strict`
  - `node scripts/validate-niche-pages.js --strict`
  - `node scripts/validate-pricing-copy-map.js`
  - `node scripts/validate-pricing-mounts.js`
