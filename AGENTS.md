<!-- FILE: AGENTS.md -->
# Agents — Codex CLI Operating Rules (UI Fixes)

These instructions apply to any Codex agent working in this repo.

## Mission

Implement **ONLY** the Requested Edits **1–4** defined in `codex/REQUESTED_EDITS_SPEC.md`.

## Non‑negotiable rules

- Read and follow (in order):
  1) `ExecPlans.md` (identify the active ExecPlan)
  2) the active ExecPlan file
  3) `PLANS.md`
  4) `codex/CODEX_SYSTEM_PROMPT.md`
  5) `codex/REQUESTED_EDITS_SPEC.md`
  6) `codex/MANUAL_QA_CHECKLIST.md`
- Stay strictly in scope: Requested Edits 1–4 only.
- Preserve existing copy and content structure.
- Do not hand-edit generated files under `assets/`.
  - Change source files and rebuild instead.
- Keep diffs minimal:
  - no whitespace-only changes
  - no reformatting of unrelated blocks
- Add the required SS_* marker comments exactly as written in the spec.

## Expected edit surfaces (use these unless proven insufficient)

Pricing (Edits 1–2):
- `pricing-widget/src/pricing-widget.css`
- `pricing-widget/src/PricingWidget.jsx` (only if a CSS-only solution cannot meet acceptance criteria)

Services (Edit 3):
- `src/css/pages/services.css`

Home (Edit 4):
- `src/css/pages/home.css`

Orchestration/validation (allowed):
- `ExecPlans.md`, active ExecPlan, `PLANS.md`
- `codex/*` docs included by `.codex/config.toml`
- `scripts/codex.requested-edits.sh`
- `scripts/validate-pricing-ui-tuning.js`
- `scripts/validate-requested-edits.js`

Touch any other file only if it is required to satisfy the spec; record the rationale in the ExecPlan Decision Log.

## Build + verify loop (required)

After each gate in the ExecPlan:
- Run: `bash scripts/codex.requested-edits.sh`
- Fix only what is needed for the failing check or acceptance criterion.
- Repeat until green.

## Search conventions

- Prefer `rg -n` for searching if available.
- If `rg` is not available, use `grep -R -n`.
- When locating styling causes, always trace:
  - source CSS (under `src/` or `pricing-widget/src/`)
  - built outputs (under `assets/`)
  - the relevant HTML mount / DOM structure

## Definition of “done”

The work is done only when:
- all Requested Edits 1–4 acceptance criteria are met,
- `bash scripts/codex.requested-edits.sh` is fully green,
- `codex/MANUAL_QA_CHECKLIST.md` is satisfied,
- and the change set contains no unrelated edits.
