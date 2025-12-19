<!-- FILE: codex/MAINTENANCE.md -->
# Codex Maintenance

This repo intentionally uses marker comments + validators to keep UI work deterministic and regression-resistant.

## One-command rebuild + validate

From repo root:
- `bash scripts/codex.requested-edits.sh`

This script:
- installs deps (root and pricing-widget)
- builds `assets/css/styles.css`
- bundles site JS
- builds the pricing widget into `assets/css/pricing-widget.css` and `assets/js/pricing-widget.js`
- runs repo validators

## Fixing validator failures

- Fix failures in source files (HTML/CSS/JS), then rebuild via scripts.
- Do not patch `assets/` outputs directly.
- If a validator expects an SS_* marker, keep it exactly as specified in `codex/REQUESTED_EDITS_SPEC.md`.

## Dependency resets

If installs become inconsistent:
- remove `node_modules/` and `pricing-widget/node_modules/`
- re-run `bash scripts/codex.requested-edits.sh`
