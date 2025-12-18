<!-- FILE: PLANS.md -->

# PLANS (Codex task index)

This repo uses ExecPlans + initiation prompts to run discrete Codex implementations.

## Active plans you can run

### Site UI Fixes (A–E)
- ExecPlan: `ExecPlan_Site_UI_Fixes.md`
- Spec: `codex/SITE_UI_FIXES_SPEC.md`
- Initiation prompt: `codex/CODEX_INIT_PROMPT_SITE_UI_FIXES.md`
- Validator: `node scripts/validate-site-ui-fixes.js`

### Pricing UI tuning (existing)
- ExecPlan: `ExecPlan_Pricing_UI_Tuning.md`
- Prompt: `codex/CODEX_INIT_PROMPT_PRICING_UI_TUNING.md`

### Pricing embed (existing)
- ExecPlan: `ExecPlan.md`
- Prompt: `codex/CODEX_INIT_PROMPT.md`

## Standard workflow
1. Setup (once per machine):
   - `bash scripts/codex.setup.sh`
2. Start Codex with the initiation prompt for the chosen plan.
3. After changes:
   - run the plan’s validator(s)
   - then run: `bash scripts/codex.maintenance.sh`
