<!-- FILE: codex/MAINTENANCE.md -->
# Maintenance & Safe Changes

Use this doc when:
- Updating pricing copy
- Adding a new niche page
- Making changes to the embedded React widget
- Validating existing embeds
- Tuning the pricing widget UI theme/layout

## Quick maintenance command
Run:

- `bash scripts/codex.maintenance.sh`

## Quick pricing UI tuning command
Run:

- `bash scripts/codex.pricing-tuning.sh`

Environment variables (optional):
- `CODEX_SKIP_NPM=1` to skip `npm install`
- `CODEX_SKIP_BUILD=1` to skip `npm run build`
- `CODEX_SKIP_WIDGET_BUILD=1` to skip widget build
- `CODEX_FORCE_WIDGET_BUILD=1` to rebuild widget even if assets already exist
- `CODEX_PRICING_UI_TUNING_STRICT=1` to run the tuning validator in strict mode inside `scripts/codex.maintenance.sh`

## Updating pricing copy
1. Edit `PRICING_COPY_MAP.md` only.
2. Run:
   - `node scripts/validate-pricing-copy-map.js`
3. If validation passes, update the widget’s data mapping accordingly (per `codex/PRICING_COPY_MAP_SPEC.md`).

## Changing the widget code
1. Make changes only inside the pricing widget isolated folder (recommended: `pricing-widget/`).
2. Build widget outputs:
   - `assets/js/pricing-widget.js`
   - `assets/css/pricing-widget.css`
3. Validate mounts:
   - `node scripts/validate-pricing-mounts.js`

## Pricing UI tuning (theme + scroll + badge clearance)
Use this workflow for:
- Light-mode palette restyle
- Services page Section 2 internal-scroll + height-match
- Niche pages Section 1 badge/title clearance

1. Read:
   - `ExecPlan_Pricing_UI_Tuning.md`
   - `codex/PRICING_UI_TUNING_SPEC.md`
2. Make changes only in:
   - `pricing-widget/src/pricing-widget.css`
   - `pricing-widget/src/PricingWidget.jsx` and/or `pricing-widget/src/embed.jsx` (only if needed)
3. Rebuild widget:
   - `(cd pricing-widget && npm install && npm run build)`
4. Validate (strict):
   - `bash scripts/codex.pricing-tuning.sh`
   - Or:
     - `node scripts/validate-services-page.js --strict`
     - `node scripts/validate-niche-pages.js --strict`
     - `node scripts/validate-pricing-copy-map.js`
     - `node scripts/validate-pricing-mounts.js`
     - `node scripts/validate-pricing-ui-tuning.js --strict`

## Adding a new niche page with pricing
1. Create the HTML page in `niches/`.
2. Ensure `<section id="pricing">` exists and contains two mount containers:
   - `data-ss-pricing-section="1"`
   - `data-ss-pricing-section="2"`
3. Add a new page block in `PRICING_COPY_MAP.md` for that page path.
4. Update `scripts/pricing.constants.js` to include the new page.
5. Run:
   - `node scripts/validate-pricing-copy-map.js`
   - `node scripts/validate-pricing-mounts.js`
