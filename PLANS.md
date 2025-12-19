<!-- FILE: PLANS.md -->
# Planning + ExecPlan Rules (Codex CLI)

This repo uses ExecPlans to make multi-step changes reliable and reviewable.

## What must be true before editing any site code

1. Read these files (in order):
   - `AGENTS.md`
   - `codex/REQUESTED_EDITS_SPEC.md` (single source of truth for the requested edits)
   - `ExecPlan.md` (the active plan to follow)

2. Confirm scope:
   - Only implement **Requested Edits (1–5)** from `codex/REQUESTED_EDITS_SPEC.md`.
   - Do not “improve” anything else (no refactors, no copy tweaks, no layout changes outside what’s explicitly requested).

## How to use ExecPlans in this repo

- `ExecPlan.md` is a **living document**.
  - Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` up to date while working.
  - If you change the plan, update *all* impacted sections (not just one paragraph).

- Work in small, verifiable milestones (“gates”):
  - Implement one gate.
  - Rebuild required artifacts.
  - Run validations.
  - Only then proceed to the next gate.

## Measurement loop (evaluation flywheel, repo-style)

When something fails (visual mismatch, validator failure, or regression):

1. Analyze
   - Identify the exact failure mode (which page / breakpoint / selector / component).
2. Measure
   - Add/adjust deterministic checks (marker comments + validators) so the failure is caught automatically.
3. Improve
   - Apply the smallest targeted fix, then re-run validations.

Repeat until failure rate is effectively zero for the requested scope.

## Required commands (run from repo root)

- One-command build + validate:
  - `bash scripts/codex.requested-edits.sh`

- Local manual preview (for final visual confirmation):
  - `python3 -m http.server 8000`
  - Then open:
    - `/index.html`
    - `/services.html`
    - `/about.html`
    - at least 2 pages from `/niches/*.html`

## Non-negotiable output expectations

- Any changes to `src/css/**` must be reflected in `assets/css/styles.css` via `node scripts/build-css.js`.
- Any changes to `pricing-widget/src/**` must be reflected in:
  - `assets/css/pricing-widget.css`
  - `assets/js/pricing-widget.js`
  via `pricing-widget`’s build script (see `scripts/codex.requested-edits.sh`).

- All required marker comments listed in `codex/REQUESTED_EDITS_SPEC.md` must exist in BOTH:
  - source files (authoritative)
  - built outputs (proof of rebuild)
