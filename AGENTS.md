<!-- FILE: AGENTS.md -->
# AGENTS

This file defines how Codex should behave in this repo.

## Global guardrails

- **Do not change visuals or behavior** except for the two explicitly targeted outcomes in the active ExecPlan:
  1) Fix the mobile background coverage gap (no bottom-of-viewport gap).
  2) Remove all desktop-console 404s from the provided log (zero console errors on load).
- **Parallax must continue to work** on both mobile and desktop. Do not disable or remove parallax.
- **Minimal diffs only.** No broad refactors. No renaming or reformatting for style. No dependency churn unless required for verification tooling.
- **Evidence-first.** Every edit must be preceded by reproduction + measurement and followed by verification + regression checks.

## Operating loop (evaluation flywheel)

Repeat until acceptance criteria are met:

1. Analyze: reproduce, collect logs/metrics/screenshots, map hypotheses to code.
2. Measure: define an observable pass/fail signal for each hypothesis.
3. Improve: make the smallest possible change; immediately re-measure.
4. If regression or ambiguity: revert and pick the next hypothesis.

## Roles (simulate these, even as a single agent)

### Investigator
- Parses the provided desktop console log.
- Finds the code path(s) responsible for each 404.
- Diagnoses the mobile viewport gap by inspecting computed layout and runtime parallax elements.

### Implementer
- Applies the smallest-possible fix aligned with the root cause.
- Keeps diffs localized and reversible.

### Verifier
- Runs the relevant checklist(s) and scripts.
- Confirms:
  - No mobile background gap across all specified pages.
  - No desktop console errors on load.
  - Parallax still functions on mobile + desktop.
  - No unexpected UI changes.

### Scribe
- Updates the active ExecPlan with:
  - What was observed
  - What changed and why
  - Before/after evidence
  - Any tradeoffs or follow-ups

## What “done” means

A change is only “done” when:

- Acceptance criteria in the active ExecPlan are met.
- The validation checklists pass.
- The diff is minimal and restricted to what is necessary.
- The ExecPlan has a clear root cause explanation and a reproducible verification procedure.

## Prohibited actions

- Deleting parallax code or forcing parallax off to “fix” the issue.
- Changing spacing/typography/colors “to look better.”
- Running repo-wide formatters that touch unrelated files.
- “Fixing” unrelated warnings or refactoring modules not required for the two target outcomes.
