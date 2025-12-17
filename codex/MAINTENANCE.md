<!-- FILE: codex/MAINTENANCE.md -->
# Maintenance — Pricing React embed

This repo is a static site with a small Node-based build step. The pricing widget adds a separate build output for React + Tailwind.

## Routine build + validation
Run from repo root:

1. Install deps (first time or after changes):
   - `npm install`

2. Build:
   - `npm run build`

3. Validate:
   - `npm run validate`
   - `node scripts/validate-pricing-copy-map.js`
   - `node scripts/validate-pricing-mounts.js`

## When updating pricing copy
- Edit only `PRICING_COPY_MAP.md`.
- Re-run:
  - `node scripts/validate-pricing-copy-map.js`
  - Full build + validate commands above

## When adding a new niche page
1. Add the new HTML file under `/niches/`.
2. Add a new page block to `PRICING_COPY_MAP.md` using the exact page id heading format.
3. Ensure the HTML pricing section contains the pricing mount element with:
   - `class="ss-pricing"`
   - `data-ss-pricing-page="niches/<file>.html"`
4. Re-run full build + validations.

## Failure policy
If validation fails:
- Fix the smallest possible change to restore:
  - copy mapping completeness
  - mount correctness
  - hero shader invariants
- Do not “fix” by weakening validation.
