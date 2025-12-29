<!-- FILE: AGENTS.md -->
# Agents & Roles (Codex CLI workflow)

Codex should operate as a **multi-role workflow** (even if executed by a single agent). This reduces missed requirements and scope drift.

## Operating principle

- Treat `codex/REQUESTED_EDITS_SPEC.md` as the **source of truth**
- Treat `ExecPlan.md` as the **execution runbook**
- Use `codex/VERIFICATION_PROTOCOL.md` as the **grader/verification contract**
- Run the “evaluation flywheel” loop: measure → change → re-measure → tighten

## Roles (run sequentially)

### 1) Scout / Mapper
Goal: Build a precise understanding of “what controls what” before edits.

Responsibilities:
- Identify exact files/selectors/attributes for each requested edit
- Update `codex/REPO_UI_MAP.md` with concrete pointers and pitfalls
- Note conflicts or repo realities in `codex/UI_CHANGE_LOG.md`

Exit conditions:
- Repo map updated for all six edits
- You can name the exact file(s) you will change for each requirement

### 2) Planner / Decomposer
Goal: Convert requirements into a minimal change set with verifiable checkpoints.

Responsibilities:
- Write a per-edit approach in `codex/UI_CHANGE_LOG.md`:
  - What to change
  - Why it’s minimal
  - How to verify
  - Which SPEC proof marker(s) will be added
- Decide ordering to avoid rework
- Identify regression risks and how you’ll detect them

Exit conditions:
- Approach documented for edits 1–6
- All proof markers are accounted for

### 3) Implementer
Goal: Implement edits with strict scope control.

Responsibilities:
- Implement in small increments, one edit at a time
- After each edit:
  - rebuild CSS/JS if needed
  - run relevant validator(s)
  - confirm no unrelated files changed
- Add SPEC proof markers as required

Exit conditions:
- All six edits implemented
- Local validations for each edit passing

### 4) Verifier / QA
Goal: Prove the work is correct.

Responsibilities:
- Run `bash scripts/codex.requested-edits.sh` (must pass)
- Follow `codex/MANUAL_QA_CHECKLIST.md` for visual/responsive checks
- Fill the final evidence mapping in `ExecPlan.md` or `codex/UI_CHANGE_LOG.md`

Exit conditions:
- Automated validators pass
- Manual QA checklist completed
- Evidence recorded 1:1 for edits 1–6

## Scope enforcement rules

- If a change cannot be tied directly to Requested Edits 1–6, **do not make it**.
- Do not “improve” unrelated styles, spacing, or copy.
- Prefer page-scoped selectors (e.g., `.page-services`, `.page-niche`, `.page-about`) to avoid collateral changes.
