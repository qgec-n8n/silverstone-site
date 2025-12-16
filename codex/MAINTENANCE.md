<!-- FILE: codex/MAINTENANCE.md -->

# Maintenance Instructions (Silverstone Site)

## Always preserve these invariants
- Mobile menu direction contract stays correct (never invert).
- Services shows left arrow before label; Back shows right arrow after label.
- Back button is top-right on both panels; no X control.
- Mobile menu timing stays slow-but-not-overly-slow:
  - panel slide >= 1200ms; stagger >= 250ms; reveal >= 400ms
- Desktop nav Services matches other desktop nav items exactly (font + size).
- Mobile Panel 1 Services matches other pills and is not bold.
- Body-section overlay remains light:
  - global `--body-section-overlay-opacity`, no mobile override.
- Marquees animate without touch:
  - images visible and moving without interaction; no lazy-load gating.

## After any nav / overlay / marquee / FAQ / page-polish change
Run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/assert-ui-spec.js --strict`

## If a regression occurs
- Revert the smallest commit that introduced it.
- Re-run the strict validators above to confirm restoration.
