<!-- FILE: codex/MAINTENANCE.md -->
# Maintenance

After any change touching hero layout, section subtitle styling, about/services images, or the services gallery, run:

- `bash scripts/codex.maintenance.sh`

This rebuilds outputs and re-runs the validators enforcing Requested Edits 1–8.

## If validations fail

1. Read the error output carefully; it will tell you which requirement failed.
2. Re-check `codex/REQUESTED_EDITS_SPEC.md` for acceptance criteria and exclusions.
3. Fix the smallest possible area, rebuild, and re-run:
   - `bash scripts/codex.requested-edits.sh`

## Proof markers must remain intact

The grader script (`node scripts/assert-ui-spec.js`) expects these markers to exist in the built bundles (`assets/css/styles.css` and/or `assets/js/app.js`) and/or in HTML:

- `SPEC: HERO_DESKTOP_COPY_CTA_TIGHT_CONTAINER_2025_12_30`
- `SPEC: HERO_MOBILE_HIDE_GREY_SUBHEADINGS_PRESERVE_LAYOUT_2025_12_30`
- `SPEC: ABOUT_DESKTOP_SILVERSTONE_22_28_COVER_FILL_NEON_WRAP_2025_12_30`
- `SPEC: SERVICES_DESKTOP_GENERAL_SERVICES_IMAGES_HD_2025_12_30`
- `SPEC: SERVICES_MOBILE_GENERAL_SERVICES_CARDS_PORTRAIT_2_3_2025_12_30`
- `SPEC: SERVICES_NEURAL_GRID_REPLACE_SQUARE_LANDSCAPE_2025_12_30`
- `SPEC: SERVICES_NEURAL_GRID_REPLACE_PORTRAIT_2025_12_30`
- `SPEC: INDEX_SUBTITLES_GREY_TARGETED_SENTENCES_2025_12_30`
