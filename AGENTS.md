<!-- FILE: AGENTS.md -->

# Silverstone Site — Codex Operating Guide (Pricing Widget Integration)

## What you are doing in this repo (this run only)
This Codex run is **only** for implementing the **React Pricing Widget** by replacing the existing **pricing placeholder text** on:

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

**Hard scope guard:** On each target HTML page, you may replace **only** the pricing placeholder region (the placeholder `<p class="section-subtitle">...Transparent pricing tables...</p>`).  
Everything else in those HTML files must remain byte-for-byte identical (structure, copy, styles, behavior), except for the minimal placeholder swap.

## Authoritative inputs (must use)
1) `new_pricing_code.pdf` (authoritative React code; use the user-pasted version as the clean fallback)
2) `Silverstone_Service_Master_List.csv` (authoritative products + prices)

## Internal reference pattern to mirror
Use the repo’s existing JS delivery model:
- Static HTML pages load `assets/js/app.js` (root pages) or `../assets/js/app.js` (niche pages).
- `assets/js/app.js` is built by concatenation from `src/js/*` via `scripts/build-js.js`.
- **Do not add new `<script>` tags to pages** (that would violate the “only replace placeholder region” rule).

Therefore:
- Pricing widget bootstrap must be added to `src/js/` and bundled into `assets/js/app.js`.
- The heavy React widget bundle must be lazy-loaded by the bootstrap **only when mount containers exist**.

## Read-first order (mandatory)
1) `ExecPlan.md` (executable spec, constraints, acceptance checks)
2) `codex/PRICING_WIDGET_REFERENCE.md` (exact placeholder IDs + page→SKU mapping tables)
3) `scripts/validate-pricing-embeds.js` (defines pass/fail checks)

## Non-negotiable requirements (repeat)
- Replace **ONLY** the pricing placeholder region on each target page.
- Embed React widget using “React-on-any-website” pattern (mount into a div) while matching this repo’s `app.js` bundling convention.
- Use **only** CSV-backed items and prices. No invented prices or product names.
- Must be idempotent (re-run safe): no duplicate mount blocks, no duplicate script injection.
- Must fail gracefully: page must render normally; only the mount container may show a minimal fallback message.

## Commands you must run before finishing
- `bash scripts/codex.maintenance.sh`
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-pricing-embeds.js --strict`
