<!-- FILE: codex/INITIATION.md -->
# Initiation (Codex CLI)

This folder contains the “source of truth” docs for a reliable Codex run.

## Read in this order

1) `PLANS.md` (defines ExecPlan requirements)
2) `ExecPlan.md` (the runbook; must stay updated)
3) `codex/REQUESTED_EDITS_SPEC.md` (what to implement + proof markers)
4) `codex/ASSET_REPLACEMENT_MATRIX.md` (deterministic image mapping)
5) `codex/REPO_UI_MAP.md` (where things live)
6) `codex/VERIFICATION_PROTOCOL.md` (how to verify correctness)
7) `codex/PAGE_AUDIT_MATRIX.md` (cross-page audit grid)
8) `codex/MANUAL_QA_CHECKLIST.md` (visual/responsive verification)

## Setup

- `bash scripts/codex.setup.sh`

## Baseline

- `bash scripts/codex.requested-edits.sh`

Record baseline failures and any constraints in:
- `codex/UI_CHANGE_LOG.md`

## Definition of done

- `bash scripts/codex.requested-edits.sh` passes
- Manual QA is complete: `codex/MANUAL_QA_CHECKLIST.md`
- Evidence table in `ExecPlan.md` is completed 1:1 for Requested Edits 1–8
