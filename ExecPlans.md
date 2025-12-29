<!-- FILE: ExecPlans.md -->
# ExecPlans

This repository uses an **ExecPlan-driven** workflow for Codex CLI runs. The ExecPlan is the single authoritative execution runbook (phases, gates, verification, and evidence capture).

## Active ExecPlan (current work)

- `ExecPlan.md` — **Shader colors per page + hero legibility (no glass panel) + index CTA nowrap + subtitle grey + services/niches image fit + about image copy visibility**  
  (This ExecPlan implements **Requested Edits 1–6** only.)

## How Codex should use ExecPlans in this repo

1. **Read `ExecPlan.md` fully** before changing any application files.
2. Run the **baseline command**: `bash scripts/codex.requested-edits.sh`  
   - Expect failures until Requested Edits 1–6 are implemented.
3. Follow the ExecPlan **phase gates** strictly:
   - Discovery → Approach → Implement → Verify (automated + manual) → Regression scan → Final evidence table
4. Work is complete only when all are true:
   - `bash scripts/codex.requested-edits.sh` passes
   - `codex/MANUAL_QA_CHECKLIST.md` is completed
   - The ExecPlan’s **final evidence mapping** is filled (each edit → proof)

## IMPORTANT: scope discipline

If any file in this repo mentions “Pricing Feature Implementation” or unrelated edits, treat that as a **mislabel**. The only source of truth is **Requested Edits 1–6** in:
- `codex/REQUESTED_EDITS_SPEC.md`
- `ExecPlan.md`
