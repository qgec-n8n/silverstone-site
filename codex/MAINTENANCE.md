<!-- FILE: codex/MAINTENANCE.md -->
# Maintenance & Validation (Requested Edits 1–8)

This doc describes the one-command rebuild + validation flow for the Requested Edits 1–8 task.

## One-command verification
From repo root:

- `bash scripts/codex.requested-edits.sh`

This will:
1. rebuild main site CSS + JS
2. rebuild the pricing widget bundle
3. run deterministic validators enforcing Requested Edits 1–8

## What it rebuilds
- Main site:
  - `node build-css.js` → `assets/css/styles.css`
  - `node scripts/build-js.js` → `assets/js/app.js`
- Pricing widget:
  - `(cd pricing-widget && npm run build)` → `assets/css/pricing-widget.css`, `assets/js/pricing-widget.js`

## If validation fails
- Read the error output; it names the file and the missing condition.
- Fix only what is required for Edits 1–8 (no extra changes).
- Rerun:
  - `bash scripts/codex.requested-edits.sh`
