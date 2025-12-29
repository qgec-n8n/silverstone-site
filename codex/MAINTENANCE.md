<!-- FILE: codex/MAINTENANCE.md -->
# Maintenance

After any change touching CSS/JS or hero/shader wiring, run:

- `bash scripts/codex.maintenance.sh`

This rebuilds outputs and re-runs the validators enforcing Requested Edits 1–6.

## If validations fail

1. Read the error output carefully.
2. Re-check `codex/REQUESTED_EDITS_SPEC.md` (scope + acceptance criteria).
3. Fix the smallest possible area and re-run:
   - `bash scripts/codex.requested-edits.sh`

## Keep proof markers intact

Do not remove SPEC markers required by `node scripts/assert-ui-spec.js`:
- `SPEC: SHADER_COLORS_PER_PAGE_2025_12`
- `SPEC: HERO_NO_GLASS_PANEL_2025_12`
- `SPEC: INDEX_STREAMLINE_WORKFLOWS_NOWRAP_2025_12`
- `SPEC: SECTION_SUBTITLES_GREY_GLOBAL_2025_12`
- `SPEC: SERVICES_NICHES_IMAGES_FILL_CARD_NO_HEIGHT_CROP_2025_12`
- `SPEC: ABOUT_IMAGES_COPY_VISIBLE_NO_CROP_2025_12`
