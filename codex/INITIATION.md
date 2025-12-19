<!-- FILE: codex/INITIATION.md -->
# Initiating Codex CLI in this Repo

This repo is set up to run Codex with a gated ExecPlan workflow and deterministic validators.

## Files that define the workflow
- `codex/CODEX_INIT_PROMPT.md` — the first message to paste into Codex CLI
- `ExecPlan.md` — the gate-by-gate execution plan for the current request
- `codex/REQUESTED_EDITS_SPEC.md` — the single source of truth for requirements
- `scripts/codex.requested-edits.sh` — rebuild + validate loop

## One-time setup (per fresh checkout)
1) From the repo root, run:
   - `bash scripts/codex.setup.sh`
2) Confirm the toolchain works:
   - `bash scripts/codex.requested-edits.sh`
   (It may fail until the requested edits are implemented; that’s expected.)

## Starting a Codex session
1) Start Codex CLI in the repo root.
2) Paste the full contents of `codex/CODEX_INIT_PROMPT.md` as the first message.
3) Codex should:
   - read the referenced files,
   - follow `ExecPlan.md` gate-by-gate,
   - run `bash scripts/codex.requested-edits.sh` after each gate,
   - stop only when it is fully green.

## If Codex gets stuck
- Re-run `bash scripts/codex.requested-edits.sh` to see the current failing check.
- Fix only the failing check (no unrelated edits).
- Update `ExecPlan.md` Decision Log if a judgment call was required.
