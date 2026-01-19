<!-- FILE: ExecPlans.md -->
# Codex ExecPlans index (repo-local)

This repo uses **ExecPlans** as task-specific, step-by-step runbooks that force:
- deep, repo-wide investigation,
- evidence-backed root-cause isolation,
- the smallest safe code edits,
- tight verification + regression checks,
- clear documentation of what changed and why.

ExecPlans are meant to be followed **literally**. If an ExecPlan conflicts with a general repo rule, the ExecPlan wins.

---

## Active ExecPlan

**Active:** `codex/execplans/2026-01-19_restore-wheel-scroll.md`

Problem focus:
- Mouse wheel vertical scroll is blocked on:
  - `index.html`
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
  - `niches/*.html`

Non-regression:
- Keep the **pricing feature internal scroll** (on `index.html` + `services.html`) unchanged.

---

## How Codex should use this repo

Codex must:
1. Read these files first (in order):
   - `ExecPlans.md`
   - `PLANS.md`
   - `AGENTS.md`
   - the Active ExecPlan listed above
2. Run the audit scripts referenced by the active ExecPlan.
3. Follow an evaluation-flywheel loop:
   - reproduce → hypothesize → instrument → narrow → patch → re-test → document
4. Keep diffs minimal and scoped to the proven root cause.
5. Use internet-enabled research during diagnosis (behavior/spec pitfalls), but ground fixes strictly in repo code.

---

## Creating new ExecPlans

When adding a new ExecPlan:
- Put it in `codex/execplans/` using a date prefix: `YYYY-MM-DD_<short_slug>.md`
- Include:
  - explicit acceptance criteria (pass/fail)
  - non-goals (what must NOT change)
  - protected behaviors/components (must remain unchanged)
  - step-by-step investigation sequence
  - instrumentation steps (console snippets are fine)
  - smallest-change patch policy
  - verification + regression checklist
  - “stop conditions” (when to roll back / re-evaluate)

Then update the “Active ExecPlan” section above.

