<!-- FILE: .agent/PLANS.md -->

# PLANS.md (Codex Execution Plans)

This folder contains execution plans (“ExecPlans”) that Codex should follow exactly.

## How to Use These Plans
- **One active workstream at a time.**
- Read the “Batch” ExecPlan first (if present), then run per-scope ExecPlans in the order listed.
- Treat the repository as the source of truth:
  - Prefer copying existing patterns rather than inventing new ones.
  - Keep changes minimal and consistent across pages.

## Active Workstream: Niche Pages Generation
**Primary plan:** `.agent/ExecPlan.Niches.Batch.md`  
**Supporting plans:** `.agent/ExecPlan.Niche.*.md` (one per niche page)

These plans instruct Codex to generate new niche pages using:
- `niches/estate-agents.html` as the markup/layout template.
- `niche_copy_templates/*_Template.md` as the copy and image source-of-truth.
- `.agent/ICON_CATALOG.md` as the allowed icon inventory (do not use icon classes not listed there).

---

## ExecPlan Required Structure
Each `ExecPlan.*.md` must include:

1. **Objective**
2. **In scope / Out of scope**
3. **Inputs (source files)**
4. **Outputs (files created/edited)**
5. **Step-by-step procedure** (actionable, file-specific)
6. **Entry criteria / Exit criteria**
7. **Verification** (commands + what success looks like)
8. **Rollback safety** (how to undo safely)

---

## Editing Rules (Repo-wide)
- Prefer:
  - Editing `src/` for CSS/JS and running `npm run build:css` / `npm run build:js`
  - Editing HTML files (`*.html`) directly as authored pages
- Avoid:
  - Large formatting churn
  - Reordering sections unnecessarily
  - Introducing new dependencies unless absolutely needed

---

## Shared Verification Expectations
All plan runs should end with:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict` (for niche-page workstream completion)

---

## Notes on Copy Templates
The `niche_copy_templates/*_Template.md` files contain:
- Exact copy to be inserted into the niche pages
- Bracketed instructions (e.g., **_[Codex should generate ...]_**) that must be replaced with final copy
- Exact image filenames (case-sensitive) that must be referenced in the generated HTML
