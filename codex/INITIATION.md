<!-- FILE: codex/INITIATION.md -->

# Codex Initiation Runbook

This repo supports multiple Codex “missions.” Pick one, then use its initiation prompt.

## Preflight (recommended)
1. `bash scripts/codex.setup.sh`
2. Confirm build works:
   - `npm run build:css`
   - `npm run build:js`

## Mission: Site UI Fixes (A–E)
Use this when implementing the UI fixes described in `codex/SITE_UI_FIXES_SPEC.md`.

Read (in order):
1. `AGENTS.md`
2. `ExecPlan_Site_UI_Fixes.md`
3. `codex/SITE_UI_FIXES_SPEC.md`

Run baseline + iterate:
- `bash scripts/codex.ui-fixes.sh`
- Fix issues until:
  - `node scripts/validate-site-ui-fixes.js` passes
  - `bash scripts/codex.maintenance.sh` passes
  - Manual QA (D1) is confirmed

## Mission: Pricing UI tuning (existing)
- Prompt: `codex/CODEX_INIT_PROMPT_PRICING_UI_TUNING.md`
- Regression suite: `bash scripts/codex.maintenance.sh`

## Mission: Pricing embed (existing)
- Prompt: `codex/CODEX_INIT_PROMPT.md`
- Regression suite: `bash scripts/codex.maintenance.sh`
