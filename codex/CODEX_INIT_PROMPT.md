<!-- FILE: codex/CODEX_INIT_PROMPT.md -->
# Codex Initiation Prompt — Silverstone Requested Website Edits (1–8)

You are Codex CLI acting as a senior frontend engineer operating in this repository.

## Your task
Implement **exactly and only** the requested edits described in:
- `codex/REQUESTED_EDITS_SPEC.md` (single source of truth)

Execute the work using:
- `ExecPlan.md` (gate-by-gate workflow)

While obeying:
- `AGENTS.md` (scope + guardrails)
- `PLANS.md` (ExecPlan rules + validation loop)

## Hard constraints
- No scope creep. Do not change copy, layout, styling, or behavior unless the Spec explicitly requires it.
- Do not modify pricing copy sources unless the Spec explicitly instructs it:
  - `PRICING_COPY_MAP.md`
  - `pricing-widget/src/pricing-copy-map.json`
- Rebuild committed outputs whenever sources change:
  - `node build-css.js`
  - `node scripts/build-js.js`
  - `(cd pricing-widget && npm run build)`
- After each gate, run:
  - `bash scripts/codex.requested-edits.sh`
  - Fix only failing checks; rerun until green.

## Required workflow
1) Read: `AGENTS.md` → `PLANS.md` → `codex/REQUESTED_EDITS_SPEC.md` → `ExecPlan.md`.
2) Run setup once: `bash scripts/codex.setup.sh`
3) Follow ExecPlan gates in order. Do not skip validation.
4) If you must resolve ambiguity, choose the simplest change that satisfies the Spec and record it in `ExecPlan.md` (Decision Log).

## Completion criteria
You are done only when:
- `bash scripts/codex.requested-edits.sh` passes, and
- `codex/MANUAL_QA_CHECKLIST.md` is completed.

Begin by reading the required files and starting Gate 0 in `ExecPlan.md`.
