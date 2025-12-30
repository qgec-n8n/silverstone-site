<!-- FILE: PLANS.md -->
# Codex Execution Plans (ExecPlans)

This document defines the requirements for an execution plan (“ExecPlan”) in this repository.

An ExecPlan is not “nice to have.” It is the mechanism that makes long, multi-file changes reliable: it forces discovery, prevents scope drift, and makes correctness checkable.

## How to use ExecPlans and PLANS.md

When AUTHORING or UPDATING an ExecPlan:
- Follow this document exactly.
- Write as if the reader is a complete novice to this repo.
- Do not rely on external context, prior conversations, or “obvious” assumptions.
- Include validation instructions that prove user-visible behavior, not just code edits.

When IMPLEMENTING an ExecPlan:
- Do not ask the user for “next steps.”
- Proceed milestone-by-milestone and keep the ExecPlan itself updated (Progress, Surprises, Decision Log, Outcomes).
- Run validation at every micro-gate and record evidence.

When DISCUSSING an ExecPlan:
- Record decisions and surprises in the plan so it remains restartable from the plan alone.

## Non-negotiable requirements

Every ExecPlan in this repo MUST:
1. Be fully self-contained:
   - All repo orientation, file paths, selectors, and commands needed must be embedded.
2. Be a living document:
   - The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be updated as work proceeds.
3. Define success as observable behavior:
   - Validation must include objective checks and clear manual QA steps.
4. Prevent scope drift:
   - Explicitly list “Non-goals” and forbid unrelated refactors/design changes.
5. Include idempotence and recovery:
   - Steps must be safe to re-run; failures must include retry guidance.

## Repo-specific orientation (must be restated in ExecPlan.md)

This is a static multi-page website with a small build pipeline:

Pages:
- Root: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`
- Niche pages: `niches/*.html` (all must be included in cross-page audits)

CSS:
- Source: `src/css/**`
- Build script: `build-css.js`
- Output bundle: `assets/css/styles.css`
- Build command: `npm run build:css`

JavaScript:
- Source: `src/js/**` (concatenated in a stable order)
- Build script: `scripts/build-js.js`
- Output bundle: `assets/js/app.js`
- Build command: `npm run build:js`

Validation (the “grader” contract):
- Primary command: `bash scripts/codex.requested-edits.sh`
- This rebuilds CSS/JS and runs: `node scripts/assert-ui-spec.js`

Manual QA:
- A local static server is sufficient (no framework runtime).
- Use the checklist in `codex/MANUAL_QA_CHECKLIST.md`.

## Prompt discipline blocks (use in Codex initiation prompts)

Use explicit constraints to keep GPT-5.2 disciplined:

output_verbosity_spec:
- Keep narration compact and structured.
- Prefer checklists and short bullets over long prose.
- Do not rephrase requirements unless it changes semantics.
- For multi-file tasks: always report
  - What changed
  - Where
  - How verified
  - Remaining risks / open items

design_and_scope_constraints:
- Implement EXACTLY and ONLY the requested edits.
- No extra features, no “nice-to-have” styling changes, no redesigns.
- Use existing tokens/variables where possible.
- Prefer page-scoped selectors to avoid collateral changes.
- Do not touch pricing work or pricing-widget code for this task.

validation_contract:
- Run `bash scripts/codex.requested-edits.sh` after each milestone.
- Do not declare done until it passes AND manual QA is completed.

## Standard ExecPlan section checklist

An ExecPlan file in this repo must include the following top-level sections (in this order is recommended):
- Purpose / Big Picture
- Progress
- Surprises & Discoveries
- Decision Log
- Outcomes & Retrospective
- Context and Orientation
- Plan of Work
- Concrete Steps
- Validation and Acceptance
- Idempotence and Recovery
- Artifacts and Notes
- Interfaces and Dependencies

If an ExecPlan is missing any of these, it is not acceptable for a long Codex run.
