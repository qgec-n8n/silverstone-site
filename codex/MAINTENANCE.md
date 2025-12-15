<!-- FILE: codex/MAINTENANCE.md -->

# Maintenance Instructions (Silverstone Site)

## Always preserve these invariants
- Mobile menu direction contract stays correct (never invert).
- Services shows left arrow before label; Back shows right arrow after label.
- Back button is top-right on both panels; no X control.
- Mobile menu motion remains extremely slow (panel slide >= 1800ms; stagger >= 500ms; reveal >= 600ms).
- Body-section overlay remains light (global `--body-section-overlay-opacity` with no mobile override).
- Marquees animate from page load on mobile; images are not delayed or intermittently missing.

## After any nav / overlay / marquee / FAQ change
Run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/assert-ui-spec.js --strict`

## If a regression occurs
- Revert the smallest commit that introduced it.
- Re-run the two strict validators above to confirm restoration.
