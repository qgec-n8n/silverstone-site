<!-- FILE: ExecPlans.md -->
# ExecPlans

This repository uses an **ExecPlan-driven** workflow for Codex CLI runs.

**Definition:** An **ExecPlan** is a single, self-contained, living design+runbook that a novice can follow (with only this repo checkout) to implement a scoped change end-to-end, with checkpoints, validation gates, and evidence capture.

## Active ExecPlan

- `ExecPlan.md` — **Requested Edits 1–7** (hero shader colors per page, hero glass removal, hero copy/CTA reposition for legibility without blocking the midline animation, index “Streamline Workflows” one-line pill, global subtitle grey rules across all pages including `niches/*.html`, about/services image cover-fill).

## One command that must stay green

- `bash scripts/codex.requested-edits.sh`

This rebuilds CSS/JS bundles and runs a grader that enforces the requested edits via proof markers + structural checks.

## How Codex should operate in this repo

1. Read `PLANS.md` first (it defines what an ExecPlan must contain).
2. Read `ExecPlan.md` (the runbook) and keep it updated as work proceeds.
3. Read the spec + verification contract:
   - `codex/REQUESTED_EDITS_SPEC.md`
   - `codex/VERIFICATION_PROTOCOL.md`
4. Run:
   - `bash scripts/codex.setup.sh`
   - `bash scripts/codex.requested-edits.sh` (baseline; expected to fail before changes)
5. Implement only what the ExecPlan and the spec require.
6. Finish only when:
   - `bash scripts/codex.requested-edits.sh` passes
   - `codex/MANUAL_QA_CHECKLIST.md` is completed
   - The “Final evidence table” in `ExecPlan.md` is filled 1:1 for Requested Edits 1–7

## Scope guardrails

- If any doc in this repo mentions “Pricing Feature Implementation plan”, treat that as **out of scope** for this task unless a change is strictly necessary to satisfy Requested Edits 1–7.
- Do not edit `pricing-widget/**` for this task.
