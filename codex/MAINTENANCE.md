<!-- FILE: codex/MAINTENANCE.md -->
# Maintenance & Safe Changes

Use this doc when:
- Maintaining pricing embed/tuning
- Adding a new niche page
- Making site UI fixes covered by a Codex spec + validator

## Quick maintenance command
Run:
- `bash scripts/codex.maintenance.sh`

## Quick site UI fixes command
Run:
- `bash scripts/codex.ui-fixes.sh`

## Quick pricing UI tuning command
Run:
- `bash scripts/codex.pricing-tuning.sh`

Environment variables (optional):
- `CODEX_SKIP_NPM=1` to skip `npm install`
- `CODEX_SKIP_BUILD=1` to skip `npm run build`
- `CODEX_SKIP_WIDGET_BUILD=1` to skip widget build
- `CODEX_FORCE_WIDGET_BUILD=1` to rebuild widget even if assets already exist
- `CODEX_PRICING_UI_TUNING_STRICT=1` to run the tuning validator in strict mode inside `scripts/codex.maintenance.sh`
- `CODEX_SITE_UI_FIXES_STRICT=1` to run the site UI fixes validator in strict mode inside `scripts/codex.maintenance.sh`

## Site UI fixes (A–E)
1. Read:
   - `.agent/ExecPlan.SiteUI.Fixes.md`
   - `codex/SITE_UI_FIXES_SPEC.md`
2. Implement changes in:
   - `.html` pages (top-level + `niches/*.html`)
   - `src/css/**`, `src/js/**`
3. Rebuild:
   - `npm run build`
4. Validate:
   - `bash scripts/codex.ui-fixes.sh`
   - Or directly:
     - `node scripts/validate-site-ui-fixes.js --strict`

## Updating pricing copy
1. Edit `PRICING_COPY_MAP.md` only.
2. Run:
   - `node scripts/validate-pricing-copy-map.js`

## Changing the widget code
1. Make changes only inside the pricing widget isolated folder (recommended: `pricing-widget/`).
2. Build widget outputs:
   - `assets/js/pricing-widget.js`
   - `assets/css/pricing-widget.css`
3. Validate mounts:
   - `node scripts/validate-pricing-mounts.js`
