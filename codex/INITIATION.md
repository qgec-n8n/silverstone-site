<!-- FILE: codex/INITIATION.md -->
# Initiation (Codex CLI)

This repo is configured for a gated, verification-driven Codex run.

## What to read first

- `ExecPlan.md`
- `codex/REQUESTED_EDITS_SPEC.md`
- `codex/VERIFICATION_PROTOCOL.md`
- `codex/REPO_UI_MAP.md`

## Run setup

- `bash scripts/codex.setup.sh`

## Run baseline + iterate

- `bash scripts/codex.requested-edits.sh`

Record baseline failures and decisions in:
- `codex/UI_CHANGE_LOG.md`

## Definition of done

- `bash scripts/codex.requested-edits.sh` passes
- Manual QA complete: `codex/MANUAL_QA_CHECKLIST.md`
- Evidence recorded for Requested Edits 1–6 (see `ExecPlan.md`)
