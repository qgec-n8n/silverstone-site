<!-- FILE: PLANS.md -->
# Codex Execution Plan Rules for this Repo

This file defines how to write and execute ExecPlans in this repository so changes are **correct, minimal, and verifiable**.

## Core principles
- **Single source of truth:** Every task must have an authoritative Spec file that lists requirements and acceptance criteria.
- **Gated execution:** Break work into small gates; validate after each gate.
- **Deterministic verification:** Every requirement must have a pass/fail check (scripted if possible; otherwise a manual QA step).
- **Scope discipline:** List exact files that may change. Treat everything else as read-only.
- **Build artifacts are real:** This repo commits built outputs in `assets/`. Any source change that affects them must be rebuilt and committed.

## Repo-specific build + validation commands
Use these exact commands (they are treated as “known-good” for this repo):

- Setup (idempotent): `bash scripts/codex.setup.sh`
- Build main CSS bundle: `node build-css.js`
- Build main JS bundle: `node scripts/build-js.js`
- Build pricing widget: `(cd pricing-widget && npm run build)`
- Full rebuild + full validation: `bash scripts/codex.requested-edits.sh`

## Marker convention (required for verifiability)
When implementing a new behavior, add a short marker comment near the change so validators can assert it exists in:
1) the source file(s), and
2) the rebuilt output(s) in `assets/`.

Marker prefixes used in this repo:
- `SS_TEXT_SPEC:` (text color system / CSS)
- `SS_STATS_SPEC:` (stats/counter JS)
- `SS_CONTACT_SPEC:` (contact-specific tweaks)
- `SS_PRICING_SPEC:` (pricing widget CSS/JS)

Markers must be:
- unique,
- stable (don’t rename without updating validators), and
- present in built artifacts after rebuild.

## Evaluation flywheel workflow (required)
For each gate in an ExecPlan:
1) Implement the **smallest possible** change that satisfies a well-defined subset of acceptance criteria.
2) Rebuild only what changed (CSS/JS/widget), then run `bash scripts/codex.requested-edits.sh`.
3) Fix only what fails.
4) Repeat until the gate is green, then move on.

Do not stack multiple unrelated edits before validating.

## Required structure for every ExecPlan
Every ExecPlan must include:
1) Goal + non-goals
2) In-scope file list
3) Definitions for ambiguous terms (repo-grounded)
4) Gate-by-gate steps with “done when” criteria
5) A page-by-page acceptance checklist (if pages are involved)
6) A decision log (any ambiguity resolutions)
7) Final “definition of done” checklist (what must pass)

## Conflict resolution rule
If there is a conflict between existing repo guidance and the user’s current request:
- the user request wins,
- but preserve repo conventions unless they directly block the request.
