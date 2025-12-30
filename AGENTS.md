<!-- FILE: AGENTS.md -->
# Agents & Roles (Codex CLI workflow)

This repo expects Codex to operate as a multi-role workflow (even if a single agent executes it). The goal is to reduce missed requirements and scope drift.

## ExecPlans

When implementing any non-trivial, multi-file change (especially UI changes spanning multiple pages), use an ExecPlan from design through verification.

Rule:
- Read `PLANS.md` first.
- Use `ExecPlan.md` as the single runbook and keep it updated as work proceeds.

## Roles (run sequentially)

### 1) Scout / Mapper
Goal: Build a precise map of “what controls what” before changing site code.

Responsibilities:
- Enumerate all HTML pages that are in scope:
  - root `*.html`
  - `niches/*.html`
- Identify exact files/selectors responsible for:
  - hero shader variant selection (per page)
  - hero “glass/blur” container
  - hero typography/layout rules (desktop + mobile)
  - qualifying body-section subtitles under blue titles
  - index “Streamline workflows” pill button layout
  - specified images that must become cover-fill
- Update `codex/REPO_UI_MAP.md` with concrete pointers (paths + selectors + pitfalls).

Exit conditions:
- `codex/REPO_UI_MAP.md` is updated with direct file+selector references for each Requested Edit 1–7.

### 2) Planner / Decomposer
Goal: Translate requirements into a minimal, testable change set with micro-gates.

Responsibilities:
- In `codex/UI_CHANGE_LOG.md`, write a per-edit approach:
  - minimal change locations
  - risks + mitigations
  - verification plan (automated + manual)
  - which SPEC proof marker(s) will be added
- Define the exact sequence of work to avoid rework (shader first, then hero layout, then global subtitle rule, then targeted fixes).

Exit conditions:
- Each Requested Edit has an explicit approach, a proof marker, and a verification step.

### 3) Implementer
Goal: Implement with strict scope control.

Responsibilities:
- Change one edit at a time.
- After each edit:
  - rebuild CSS/JS bundles as needed
  - run `bash scripts/codex.requested-edits.sh`
  - ensure no unrelated files changed
- Add SPEC proof markers as required by `codex/REQUESTED_EDITS_SPEC.md`.

Exit conditions:
- All edits implemented; validators pass; no unrelated churn.

### 4) Verifier / QA
Goal: Prove the result is correct and robust.

Responsibilities:
- Run automated validation:
  - `bash scripts/codex.requested-edits.sh`
- Run manual validation:
  - `codex/MANUAL_QA_CHECKLIST.md`
- Fill the final evidence mapping in `ExecPlan.md`.

Exit conditions:
- Automated checks pass.
- Manual QA completed.
- Evidence table completed 1:1 for Requested Edits 1–7.

## Scope enforcement rules (non-negotiable)

- If a change cannot be tied directly to Requested Edits 1–7, do not make it.
- Do not touch pricing-widget code, pricing maps, or pricing behavior.
- Prefer page-scoped selectors (e.g., `.page-services`, `.page-about`, `.page-niche`) and narrowly targeted utilities.
- Do not introduce new UI features or new sections.
