<!-- FILE: codex/INITIATION.md -->
# Codex initiation

Use this repository’s steering artifacts to implement the pricing React embed safely.

## Required reading order (do not skip)
1. `ExecPlan.md`
2. `codex/PRICING_WIDGET_SPEC.md`
3. `codex/PRICING_COPY_MAP_SPEC.md`
4. `AGENTS.md`
5. `PRICING_COPY_MAP.md`
6. `pricing_code.tsx`
7. Hero shader code: `src/js/hero-shader.js` (and confirm invariants in target HTML pages)

## What “done” means
- Pricing widget renders on:
  - `services.html`
  - every `/niches/*.html` page
- Each target page shows:
  - Row 1: 3 plan cards + toggle labeled “Monthly” and “Setup”
  - Row 2: 3 summary cards, no toggle
- Copy matches the per-page block in `PRICING_COPY_MAP.md`
- Hero shader still works and its DOM selectors remain intact
- Build + validations pass (see `ExecPlan.md` Gate 5)

## Local commands to run
- `bash scripts/codex.setup.sh`
- After implementation: `bash scripts/codex.maintenance.sh`

## Notes
- Keep HTML edits confined to the pricing placeholder region.
- Prefer scoped styling for the widget to prevent global regressions.
