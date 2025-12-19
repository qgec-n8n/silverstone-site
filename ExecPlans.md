<!-- FILE: ExecPlans.md -->
# ExecPlans

This repository uses **Codex Execution Plans (“ExecPlans”)** to make multi-file, UI-sensitive edits reliably and verifiably.

## How to use ExecPlans in this repo
- Read `AGENTS.md` (scope + guardrails).
- Read `PLANS.md` (rules for ExecPlans and the validation workflow).
- Use the **active** ExecPlan below and follow it gate-by-gate.
- After each gate, run `bash scripts/codex.requested-edits.sh` and fix only what fails.

## Active ExecPlan for the current request
- `ExecPlan.md` — Requested front-end edits (1–8): counter slowdown, copy removal, grey→white text changes with exceptions, pricing widget theme updates, and per-digit pricing animation.

## Legacy / historical ExecPlans (do not use for the current request)
These were written for earlier iterations and may conflict with the current request:
- `ExecPlan_Pricing_UI_Tuning.md`
- `ExecPlan_Pricing_Widget_Niche_Metadata.md`

If you are implementing the current request, **ignore legacy plans** and use `ExecPlan.md` + `codex/REQUESTED_EDITS_SPEC.md`.
