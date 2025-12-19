<!-- FILE: PLANS.md -->
# Codex Execution Plans (ExecPlans)

An ExecPlan is a repository-specific, self-contained plan used to implement multi-file work safely. In this repo, the active plan is `ExecPlan.md`.

## Required workflow for this repo

1. Read in order:
   - `AGENTS.md`
   - `PLANS.md`
   - `ExecPlan.md`
   - `codex/REQUESTED_EDITS_SPEC.md`

2. Setup (once per fresh checkout):
   - `bash scripts/codex.setup.sh`

3. Iterate gate-by-gate (per `ExecPlan.md`):
   - Implement the next gate.
   - Rebuild outputs using repo scripts (no manual edits to generated files).
   - Run `bash scripts/codex.requested-edits.sh` and fix failures before continuing.
   - Update `ExecPlan.md` Progress + any discoveries/decisions.

## Commands (repo root)

- One-command rebuild + validate:
  - `bash scripts/codex.requested-edits.sh`

- Quick rebuilds (useful while iterating):
  - Site CSS: `node build-css.js`
  - Site JS: `node scripts/build-js.js`
  - Pricing widget: `(cd pricing-widget && npm run build)`

## Manual preview

Serve the repo root and load static pages in a browser:
- `python3 -m http.server 8000`

Pages to check for Requested Edits 1–7:
- `http://localhost:8000/index.html`
- `http://localhost:8000/services.html`
- `http://localhost:8000/niches/estate-agents.html` (reference layout pattern)
- At least one additional niche page (any `niches/*.html`)

Mobile viewports to check (minimum):
- 390×844
- 375×667
