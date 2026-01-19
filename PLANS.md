<!-- FILE: PLANS.md -->
# Codex Execution Plans (ExecPlans) for this repo

This file defines what an ExecPlan is and how Codex must use it in this codebase.

An **ExecPlan** is a self-contained, evidence-driven design + execution document that a new contributor (human or agent) can follow to deliver a working change with minimal risk and minimal scope.

---

## When an ExecPlan is required

Use an ExecPlan when any of the following are true:

- The task involves **debugging a behavior issue** with an uncertain root cause.
- The task spans **multiple files or layers** (HTML/CSS/JS/build scripts).
- The task includes **hard constraints** (no visual/UX changes, protected components, etc.).
- The task is expected to require more than a few quick edits.
- The task could easily regress other behaviors.

If you are unsure: write an ExecPlan.

---

## Non-negotiable principles

1. **Evidence before edits**
   - Do not patch “likely” causes.
   - Prove the cause with repo evidence + runtime observation.

2. **Smallest safe change**
   - Minimize diff size and blast radius.
   - Prefer scoping/guarding over refactors.
   - Make one change at a time.

3. **Protected behaviors are sacred**
   - Anything marked protected in the active ExecPlan must not change.
   - If a protected behavior must be touched, the ExecPlan must be updated **before editing** with:
     - justification,
     - added validations,
     - rollback plan.

4. **No scope drift**
   - No redesigns, “UX improvements”, perf refactors, accessibility changes, or cleanups unless required to fix the issue.
   - If something is messy but unrelated: document it, don’t refactor it.

5. **Measure, then improve (evaluation flywheel)**
   - **Analyze:** capture failing cases + label failure modes.
   - **Measure:** create repeatable checks (scripts + manual steps).
   - **Improve:** make one targeted change.
   - Re-run the same checks; iterate only if necessary.

---

## Required sections in every ExecPlan

Every ExecPlan must include, at minimum:

### A) Problem statement
- What is broken, where, and what “working” looks like.

### B) Scope and constraints
- Explicit in-scope / out-of-scope.
- Explicit conflict-handling rule (what to prioritize if constraints conflict).

### C) Repo grounding
- Commands to run and files to read first.
- Inventory of relevant code paths and assets.

### D) Hypothesis matrix (must be evidence-backed)
For each plausible cause category:
- Concrete repo evidence (files, selectors, functions).
- A targeted experiment to confirm/refute.
- Pass/Fail result and notes.

### E) Milestones (step-by-step)
Each milestone includes:
- Preconditions
- Exact commands to run
- Expected outputs/observations
- A checkpoint requirement before proceeding

### F) Validation & non-regression plan
- Explicit per-page verification steps.
- Explicit protected-component verification steps.
- “No other changes” audit (diff review + build confirmation).

### G) Risks & mitigations
### H) Rollback plan
### I) Living logs
- Progress log
- Decision log
- Surprises / discoveries

---

## Formatting rules for plans in this repo

- Plans must be executable by someone unfamiliar with this repo.
- Prefer **indented command blocks** rather than fenced code blocks (to avoid nested fence issues).
- Avoid vague language like “check scroll code”. Use explicit file paths and commands.

---

## Working style requirements for Codex

- Read **AGENTS.md**, this **PLANS.md**, and the active ExecPlan **before changing code**.
- Use the repository scripts (in `scripts/`) for setup, serving, audits, and validation.
- Use internet research when browser behaviors are uncertain, but do not paste external code into the repo.
- Commit frequently with small, explainable commits.
