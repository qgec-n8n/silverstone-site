<!-- FILE: codex/MAINTENANCE.md -->

# Maintenance Notes (React Pricing Embed)

## Always preserve these invariants
- Hero shader markup remains intact on all pages:
  - `#hero-shader-canvas` exists
  - `.hero.title-band` exists
- Pricing copy values remain sourced from `PRICING_COPY_MAP.md` (never duplicated by hand).
- Widget remains isolated (Shadow DOM + shadow-scoped CSS).
- Loader is lazy and idempotent (no mounts/injections on pages without mount containers).

## After any pricing change
Run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/build-pricing-widget.js`
- `node scripts/validate-pricing-copy-map.js --strict`
- `node scripts/validate-pricing-embed-markup.js --strict`

## If a regression occurs
- Revert the smallest change set.
- Re-run the strict validators above.
- Manually confirm hero shader still renders on at least one root page and one niche page.
