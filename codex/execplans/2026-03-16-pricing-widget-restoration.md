# Pricing Widget Restoration

## Observed

- `index.html`, `services.html`, and the niche landing pages still contained `.ss-pricing` mount nodes.
- The standalone pricing assets still existed at `assets/css/pricing-widget.css` and `assets/js/pricing-widget.js`.
- Those pages no longer loaded either pricing asset, so the placeholders remained empty at runtime.

## Root Cause

- The pricing widget is not bundled into `assets/css/styles.css` or `assets/js/app.js`.
- The affected templates had lost their explicit pricing widget asset tags, orphaning the existing mount points.

## Change

- Restored the pricing widget stylesheet include in the `<head>` of:
  - `index.html`
  - `services.html`
  - `niches/dentists.html`
  - `niches/ecommerce.html`
  - `niches/estate-agents.html`
  - `niches/fitness-coaches.html`
  - `niches/gyms-fitness-studios.html`
  - `niches/hospitality.html`
  - `niches/physios-chiropractors.html`
  - `niches/salons-barbers.html`
  - `niches/trades-virtual-office.html`
- Restored the pricing widget script include after `app.js` on the same pages.
- Left the pricing widget source, placeholder markup, content map, and interaction logic unchanged to preserve previous behavior.

## Verification

- `npm run build:css`
- `npm run build:js`
- `rg -n "pricing-widget\\.(css|js)" index.html services.html niches/*.html`

## Notes

- No additional styling changes were applied in this pass. Preserving the prior pricing appearance and behavior was the safer fix for this regression.
