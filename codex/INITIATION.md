<!-- FILE: codex/INITIATION.md -->
# Codex Initiation (Human Guide)

This repo is configured for a constrained Codex workflow using:
- an active ExecPlan
- a single requested-edits validation script
- deterministic spec markers

## What to run

1) Confirm the active plan:
- Open `ExecPlans.md` and note the active ExecPlan (expected: `ExecPlan_UI_Fixes.md`).

2) Launch Codex CLI from the repo root and use the initiation prompt:
- See `codex/CODEX_INIT_PROMPT.md` (or use the “Revised Initiation Prompt for Codex” in the current task instructions).

3) Validate continuously:
- Run `bash scripts/codex.requested-edits.sh` after each gate in the ExecPlan.

## Important constraints

- Only implement Requested Edits 1–4 in `codex/REQUESTED_EDITS_SPEC.md`.
- Do not change site copy or restructure pages.
- Do not hand-edit built assets under `assets/`; rebuild after editing sources.
