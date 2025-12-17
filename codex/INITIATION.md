<!-- FILE: codex/INITIATION.md -->
# Codex initiation

Use this in the repo before starting a Codex task.

## Quick Start
1. Run `bash scripts/codex.setup.sh`
2. Start Codex with the prompt in `codex/CODEX_INIT_PROMPT.md`

## What Codex Must Read (in order)
1. `codex/CODEX_INIT_PROMPT.md` (the copy/paste run prompt)
2. `ExecPlan.md`
3. `codex/PRICING_WIDGET_SPEC.md`
4. `codex/PRICING_COPY_MAP_SPEC.md`
5. `codex/PRICING_INTEGRATION_SPEC.md`
6. `AGENTS.md`
7. `PRICING_COPY_MAP.md`
8. `pricing_code_prompt.md`
9. Hero shader code: `src/js/hero-shader.js` (and confirm invariants in target HTML pages)

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
