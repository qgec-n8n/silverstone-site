<!-- FILE: AGENTS.md -->
# Agents Guide

## ExecPlans

When implementing Requested Edits (1–7) or any multi-file/UI task, follow `ExecPlan.md` and `PLANS.md`.

## Scope for current task (Requested Edits 1–7)

Implement seven tightly scoped changes across:
- pricing widget light-mode visuals (index/services/niches)
- home page “What we automate” cards (colors + one formatting fix)
- services page mobile layout bug fix (image must not appear inside the text card; headings must be blue on mobile)

## Allowed edit surfaces (for this task)

Planning/config:
- `ExecPlan.md`, `ExecPlans.md`, `PLANS.md`, `AGENTS.md`
- `codex/REQUESTED_EDITS_SPEC.md`, `codex/CODEX_INIT_PROMPT.md`, `codex/MANUAL_QA_CHECKLIST.md`, `codex/MAINTENANCE.md`
- `.codex/config.toml`
- `scripts/*.js`, `scripts/*.sh`

Product sources (only as required by the spec):
- `index.html`
- `services.html` (only if absolutely necessary; prefer CSS root-cause fix first)
- `src/css/pages/home.css`
- `src/css/pages/services.css` (preserve existing mobile ordering marker)
- `src/css/base/typography.css` (remove the services-specific mobile card-merge styling)
- `pricing-widget/src/pricing-widget.css`
- `pricing-widget/src/PricingWidget.jsx`

Generated outputs (must be produced via build scripts, not hand-edited):
- `assets/css/styles.css`
- `assets/css/pricing-widget.css`
- `assets/js/pricing-widget.js`

## Non-goals / Do not change

- Do not change copy other than the single line-break removal described in Requested Edit 4.
- Do not change pricing plan names, prices, or pricing logic (no edits to `pricing-widget/src/pricingData.js` expected).
- Do not re-theme dark mode or global design tokens.
- Do not add new dependencies or refactor unrelated CSS.
- Do not change niche/service imagery assets.

## Quality bar

- Small, scoped diffs.
- Root-cause bug fixes (avoid “band-aid” overrides unless necessary and documented in `ExecPlan.md`).
- Validators must pass: `bash scripts/codex.requested-edits.sh`.
- Manual QA must match `codex/MANUAL_QA_CHECKLIST.md`.
