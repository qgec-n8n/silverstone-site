<!-- FILE: codex/MAINTENANCE.md -->
# Maintenance

After any change touching hero layout, shader wiring, section subtitle styling, or card images, run:

- `bash scripts/codex.maintenance.sh`

This rebuilds outputs and re-runs the validators enforcing Requested Edits 1–7.

## If validations fail

1. Read the error output carefully; it will tell you which requirement failed.
2. Re-check `codex/REQUESTED_EDITS_SPEC.md` for acceptance criteria and exclusions.
3. Fix the smallest possible area, rebuild, and re-run:
   - `bash scripts/codex.requested-edits.sh`

## Proof markers must remain intact

The grader script (`node scripts/assert-ui-spec.js`) expects these markers to exist in the built bundles (`assets/css/styles.css` and/or `assets/js/app.js`) and/or in HTML:

- `SPEC: REQ1_HERO_SHADER_COLORS_PER_PAGE_2025_12_30`
- `SPEC: REQ2_HERO_GLASS_PANEL_REMOVED_2025_12_30`
- `SPEC: REQ3_HERO_COPY_CTA_POSITIONED_OFF_MIDLINE_2025_12_30`
- `SPEC: REQ4_INDEX_STREAMLINE_WORKFLOWS_ONE_LINE_2025_12_30`
- `SPEC: REQ5_SECTION_SUBTITLES_GREY_2025_12_30`
- `SPEC: REQ6_ABOUT_IMAGES_COVER_CENTER_2025_12_30`
- `SPEC: REQ7_SERVICES_IMAGES_COVER_CENTER_2025_12_30`
