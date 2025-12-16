<!-- FILE: codex/MAINTENANCE.md -->

# Maintenance Instructions (Silverstone Site)

## Always preserve these invariants
- Target HTML pages are only modified within the pricing placeholder region.
- No page-level script tag additions for pricing.
- Pricing widget mounts in Shadow DOM and injects its own CSS inside the shadow root only.
- Loader is lazy: if no `.ss-react-pricing` elements exist, it does nothing.
- Loader/script injection is idempotent (no duplicates).

## After any pricing/widget change
Run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-pricing-embeds.js --strict`

## If a regression occurs
- Revert the smallest commit that introduced it.
- Re-run the commands above to confirm restoration.
