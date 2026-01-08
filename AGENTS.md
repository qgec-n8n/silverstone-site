<!-- FILE: AGENTS.md -->
# Agents & Roles (Codex CLI workflow)

This repo expects Codex to operate as a multi-role workflow (even if a single
agent executes it). The goal is to reduce missed requirements and scope drift,
especially on changes that must be applied across many pages.

## ExecPlans (how to pick the runbook)

Rule (non-negotiable):
- Read `PLANS.md` first.
- Then read `ExecPlans.md` and open the **active** ExecPlan listed there.
- Treat the active ExecPlan as the single runbook for the entire task.

Conflict resolution:
1) `ExecPlans.md` (which plan is active)
2) the active ExecPlan file
3) any `codex/*.md` hard specs referenced by the active ExecPlan

## Roles (run sequentially)

### 1) Scout / Mapper
Goal: Build a precise map of “what controls what” before changing the site.

Responsibilities:
- Enumerate all HTML pages that are in scope:
  - root `*.html`
  - `niches/*.html`
- Confirm the footer is duplicated across pages and locate the exact
  `div.footer-contact` block on at least:
  - one root page
  - one niche page
- Confirm where the shared CSS and JS bundles are loaded.

Exit conditions:
- You can name the exact insertion points for:
  - WhatsApp floating button markup
  - footer Contact Us phone row

### 2) Planner / Decomposer
Goal: Translate requirements into a minimal, testable change set with micro-gates.

Responsibilities:
- Read the hard spec referenced by the active ExecPlan (for the WhatsApp task,
  this is `codex/WHATSAPP_SPEC.md`).
- Decide the smallest set of files to touch to satisfy the spec.
- Identify risks and mitigations (duplicates, missing niche pages, z-index).
- Confirm which proof markers are required by the grader scripts.

Exit conditions:
- Clear, ordered steps exist in the active ExecPlan’s “Concrete Steps”.

### 3) Implementer
Goal: Implement with strict scope control.

Responsibilities:
- Implement in small groups:
  - icons + CSS first
  - then HTML updates across pages
- After each group:
  - rebuild bundles as required
  - run the active plan’s validation command (for WhatsApp: `bash scripts/codex.whatsapp.sh`)
- Keep changes minimal and avoid formatting churn.

Exit conditions:
- Automated checks pass.

### 4) Verifier / QA
Goal: Prove the result is correct and robust.

Responsibilities:
- Run automated validation:
  - the active plan’s validation script
- Run manual validation:
  - the checklist referenced by the active plan (for WhatsApp: `codex/WHATSAPP_MANUAL_QA_CHECKLIST.md`)

Exit conditions:
- Automated checks pass.
- Manual checklist completed.

## Scope enforcement rules (non-negotiable)

- Implement **exactly and only** what the active ExecPlan describes.
- Prefer the smallest surface-area changes.
- Avoid redesigns and “nice-to-have” changes.
- Do not touch `pricing-widget/**`.
