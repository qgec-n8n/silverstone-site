<!-- FILE: codex/CODEX_INIT_PROMPT.md -->
# Codex Initiation Prompt (Repo-local)

Use this file as a copy/paste starter prompt when launching Codex CLI in this repo.

## Prompt

You are working in the Silverstone site repo. Implement ONLY Requested Edits 1–4 as specified in `codex/REQUESTED_EDITS_SPEC.md`.

Operating rules:
- Follow the active ExecPlan listed in `ExecPlans.md` (expected: `ExecPlan_UI_Fixes.md`).
- Do not implement any extra fixes or refactors.
- Do not change any copy.
- Do not hand-edit generated files under `assets/`; edit sources and rebuild.
- Add all required SS_* marker comments exactly as written in the spec.
- Work gate-by-gate and validate after each gate.

Execution loop:
1) Read: `ExecPlans.md`, `ExecPlan_UI_Fixes.md`, `PLANS.md`, `AGENTS.md`, `codex/CODEX_SYSTEM_PROMPT.md`, `codex/REQUESTED_EDITS_SPEC.md`, `codex/MANUAL_QA_CHECKLIST.md`.
2) Run: `bash scripts/codex.requested-edits.sh` to establish baseline.
3) Implement gates in order and re-run `bash scripts/codex.requested-edits.sh` until green.
4) After all gates, complete manual QA checklist and append an entry to `codex/UI_CHANGE_LOG.md`.

Stop condition:
- If any requirement seems to require out-of-scope changes, record the issue in the ExecPlan Decision Log and choose the most minimal in-scope option.
