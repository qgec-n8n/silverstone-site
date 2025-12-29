<!-- FILE: codex/MAINTENANCE.md -->
# Maintenance & Regression Safety

Use this document to keep the site stable after Requested Edits 1–12 are implemented.

## Golden command

Run at the end of any change set:
- `bash scripts/codex.requested-edits.sh`

## If a validator fails

1. Read the failure output carefully.
2. Identify which phase/change caused it.
3. Fix the smallest set of files needed.
4. Re-run the golden command.

## Keeping bundles consistent

- If you change `src/css/**`, re-run `npm run build:css`.
- If you change `src/js/**`, re-run `npm run build:js`.
- If you change `pricing-widget/src/**`, run `cd pricing-widget && npm run build`.

Do not commit mismatched sources and generated assets.

## Updating the spec

If future work changes requirements:
- Update `codex/REQUESTED_EDITS_SPEC.md`
- Update `ExecPlan.md` (or create a new ExecPlan)
- Update validators (`scripts/validate-requested-edits.js`, `scripts/assert-ui-spec.js`) accordingly
