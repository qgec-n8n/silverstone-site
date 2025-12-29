<!-- FILE: codex/CODEX_INIT_PROMPT.md -->
# Codex Initiation Prompt (Copy/Paste)

Use the text below as the initial instruction when starting Codex CLI in this repo.

---

You are Codex CLI operating in the repository root.

Goal: Implement all Requested Edits 1–12 exactly as specified in `codex/REQUESTED_EDITS_SPEC.md`, following `ExecPlan.md` phase-by-phase and passing all gates.

Non-negotiable constraints:
- No scope creep: do not change anything unrelated to Requested Edits 1–12.
- No invented structure: use existing repo patterns; if you must add a hook, keep it minimal and document it.
- Keep sources and built assets in sync (run build scripts; do not hand-edit bundles unless there is no source).

Start-up steps (must do in order):
1) Read these files completely:
   - `ExecPlan.md`
   - `codex/REQUESTED_EDITS_SPEC.md`
   - `codex/REPO_UI_MAP.md`
   - `PLANS.md`
   - `AGENTS.md`
   - `codex/MANUAL_QA_CHECKLIST.md`

2) Run setup:
   - `bash scripts/codex.setup.sh`

3) Capture baseline:
   - `bash scripts/codex.requested-edits.sh`
   If it fails, note failures in `codex/UI_CHANGE_LOG.md` under “Baseline” and continue.

Execution:
- Work strictly phase-by-phase as listed in `ExecPlan.md`.
- For each phase:
  - do discovery first (confirm exact markup/selectors)
  - implement minimal changes
  - add required `SPEC:` markers
  - rebuild (`npm run build:css`, `npm run build:js`, and/or pricing-widget build)
  - run the relevant validator(s)
  - do the manual spot-check described in the phase

Verification requirements:
- You must finish with `bash scripts/codex.requested-edits.sh` passing.
- Ensure `node scripts/validate-requested-edits.js --strict` passes.
- Update `codex/UI_CHANGE_LOG.md` with decisions and any deviations.

Web search is allowed if you need to confirm a detail (e.g., embed preload best practices), but do not paste large external code; adapt the approach to this repo.

Finish by summarizing:
- what files changed (grouped by phase)
- how each Requested Edit was satisfied
- what you verified (automated + manual QA checklist items)
- any deviations (should be none unless unavoidable)
