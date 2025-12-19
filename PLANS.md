<!-- FILE: PLANS.md -->
# Plans & ExecPlans Workflow

This repo is configured for **ExecPlans-based work**: one active ExecPlan, strict scope, deterministic validation, and an evaluation loop.

## The single source of truth

- Requirements: `codex/REQUESTED_EDITS_SPEC.md`
- Execution workflow: `ExecPlans.md` → active ExecPlan file
- Validation loop: `bash scripts/codex.requested-edits.sh`
- Manual verification: `codex/MANUAL_QA_CHECKLIST.md`

If there is any conflict, the spec wins.

## Evaluation flywheel loop (apply at every gate)

1) Understand
- Read the spec requirements for the gate.
- Map the current implementation (selectors, variables, DOM structure, build outputs).
- Identify the smallest change surface that can satisfy the requirement.

2) Implement
- Make one coherent change set (avoid mixing multiple fixes in one commit-sized unit).
- Add the required SS_* marker comments near every change required by the spec.

3) Evaluate
- Rebuild through repo scripts (never hand-edit built artifacts).
- Run `bash scripts/codex.requested-edits.sh`.
- Spot-check the target pages / viewports for that gate.

4) Iterate
- If something is off visually or a validator fails, adjust only what is needed.
- Keep iterating until the gate is clearly satisfied.

5) Record
- Update the active ExecPlan Progress tracker.
- Append decisions to the ExecPlan Decision Log if a judgment call was required.
- When all gates are complete, append an entry to `codex/UI_CHANGE_LOG.md`.

## Guardrails that prevent scope drift

- Implement ONLY Requested Edits 1–4 (no extra UI tweaks).
- Do not change copy, headings, or content structure.
- Do not reformat unrelated HTML/CSS/JS.
- Prefer CSS-variable and layout tweaks over markup changes.
- If a change outside the expected surfaces is truly required:
  - justify it in the ExecPlan Decision Log
  - keep it minimal
  - ensure validators and manual QA still pass

## Expected working style in this repo

- Work gate-by-gate. Do not “batch” all changes without intermediate validation.
- Keep changes reversible and localized.
- Treat validators as acceptance tests: they should prove the required changes exist and builds are updated correctly.
