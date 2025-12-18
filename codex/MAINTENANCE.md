<!-- FILE: codex/MAINTENANCE.md -->
# Maintenance & Validation (UI/UX Bugfixes A–H)

This doc describes the “happy path” commands to rebuild and validate the site after UI/UX changes.

## Build outputs

This repo keeps build outputs committed:

- CSS: `src/css/**` → `node build-css.js` → `assets/css/styles.css`
- JS: `src/js/**` → `node scripts/build-js.js` → `assets/js/app.js`

Always rebuild after editing source CSS/JS.

## One-command maintenance run

From repo root:

- `bash scripts/codex.maintenance.sh`

This will:
1. rebuild CSS and JS
2. run the validation scripts that enforce the A–H requirements

## Marquee image set maintenance

When images are added/removed under `assets/images/socialmedia/`, regenerate the marquee list:

- Update list (writes into `src/js/marquee.js`):
  - `node scripts/generate-marquee-images.js`
- Check list is up-to-date (CI-style, no write):
  - `node scripts/generate-marquee-images.js --check`

## If validations fail

- Read the error output; it’s designed to tell you which file and what condition failed.
- Fix the source file (usually an HTML attribute, class, or a CSS/JS rule) and rerun:
  - `bash scripts/codex.maintenance.sh`
