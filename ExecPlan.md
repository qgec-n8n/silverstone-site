<!-- FILE: ExecPlan.md -->

# ExecPlan — React Pricing Widget Embed (Services + Niche Pages)

## Objective
Replace the existing “Transparent pricing tables will appear here soon…” placeholder on `services.html` and all `niches/*.html` pages with a React pricing widget built from the authoritative pricing component code and powered by CSV pricing.

## Target HTML files (must update)
1) `services.html`
2) `niches/dentists.html`
3) `niches/ecommerce.html`
4) `niches/estate-agents.html`
5) `niches/fitness-coaches.html`
6) `niches/gyms-fitness-studios.html`
7) `niches/hospitality.html`
8) `niches/physios-chiropractors.html`
9) `niches/salons-barbers.html`
10) `niches/trades-virtual-office.html`

## Hard constraints (non-negotiable)
1) **HTML edits are restricted**
- On each target HTML page, edit **only** the pricing placeholder region:
  - Replace only the `<p class="section-subtitle">Transparent pricing tables will appear here soon...</p>` element.
- Do not change any other markup, attributes, whitespace, copy, ordering, or script includes.

2) **Use repo conventions**
- Do not add new `<script>` tags to HTML pages.
- Add a small loader module to `src/js/` and include it in `scripts/build-js.js` so it becomes part of the existing `assets/js/app.js` bundle.

3) **Use authoritative inputs**
- Pricing widget UI must use the component code from `new_pricing_code.pdf` (user-pasted code is the clean fallback).
- Prices and product names must come from `Silverstone_Service_Master_List.csv`.

4) **Isolation**
- Widget styles must not leak to host pages.
- Must mount inside a Shadow DOM root and inject widget CSS into the shadow root.

5) **Idempotency**
- Re-running the implementation must not duplicate:
  - mount containers in HTML
  - lazy-loaded script insertion
  - React mounts

6) **Graceful failure**
- If the widget bundle fails to load or mount, the page must render normally.
- Only the mount container may show a minimal fallback message.

## Embed approach (must follow)
### High-level flow
A) HTML pages contain a mount container:
- `<div class="ss-react-pricing" data-ss-pricing-key="...">...</div>`

B) `assets/js/app.js` (built from `src/js/*`) includes a small loader:
- Detects mount containers.
- Determines correct asset base path from the actual `app.js` script URL.
- Injects `assets/js/ss-pricing-widget.iife.js` once (lazy-loaded).
- Calls a global mount function exposed by the widget bundle for each container.

C) The widget bundle:
- Uses React + ReactDOM to render.
- Attaches Shadow DOM to the mount container.
- Injects widget CSS into the shadow root.
- Renders pricing cards for the page key based on generated CSV-backed data.

### Why this approach
- Matches the “React-on-any-website” embed pattern (mount to a div, ship static assets).
- Matches this repo’s shader/JS convention (single global `app.js` entry, no per-page scripting).
- Meets the strict constraint: “HTML changes only within placeholder region.”

## CSV-backed mapping (no ambiguity allowed)
All page→SKU mappings are explicitly defined in `codex/PRICING_WIDGET_REFERENCE.md`.
- `services.html` shows the “Starter Pack” bundle (`*-01`) across all niches.
- Each niche page shows the 5 niche bundles (`*-01` to `*-05`) for that niche.

## Implementation steps (Codex must execute in order)

### Phase 1 — Add data generator + validators
1) Add `scripts/generate-pricing-data.js`
- Reads `Silverstone_Service_Master_List.csv`
- Outputs a generated TS module (location determined by widget build layout; generator must write deterministically)
- Must include SKU, Sales_Name_External, Setup_Fee_GBP, Monthly_Retainer_GBP, Deliverables_List
- Must fail fast if any required SKUs are missing

2) Add `scripts/validate-pricing-embeds.js`
- In `--strict`:
  - Confirms each target HTML file no longer contains the placeholder sentence prefix:
    - `Transparent pricing tables will appear here soon.`
  - Confirms each target HTML file contains exactly one mount container with the expected `data-ss-pricing-key`
  - Confirms `assets/js/ss-pricing-widget.iife.js` exists after build
  - Confirms generated data contains the expected SKUs and prices from the CSV

### Phase 2 — Build the React widget (self-contained bundle)
3) Add `scripts/tailwind.pricing.config.cjs` (widget-only Tailwind config)
- Dark mode: class-based (but implemented via host class toggling on the shadow host)
- Content globs restricted to the widget source directory only

4) Add `scripts/build-pricing-widget.js`
- Runs the generator script first
- Builds widget CSS with Tailwind (widget-only)
- Bundles widget TSX via esbuild to:
  - `assets/js/ss-pricing-widget.iife.js`
- Bundle must expose exactly one global API:
  - `window.SS_PRICING_WIDGET.mountAll()`
  - and/or `window.SS_PRICING_WIDGET.mount(el, pageKey)`
- Must catch and handle errors so loader can fail gracefully

### Phase 3 — Loader in app.js (repo convention alignment)
5) Add `src/js/pricing-widget-loader.js`
- Must be written as a safe, self-invoking module consistent with other `src/js/*` files.
- Must do nothing unless `.ss-react-pricing` exists on the page.
- Must lazy-load `ss-pricing-widget.iife.js` once:
  - Use a deterministic script element id, e.g. `ss-pricing-widget-script`
  - If already present, do not add another
- Must compute correct script URL base:
  - Find the `<script>` tag that loaded `app.js` and derive its directory
  - Load `ss-pricing-widget.iife.js` from the same directory
- Must mount idempotently:
  - If `data-ss-mounted="1"` exists, skip
  - Otherwise set it once mount attempt begins

6) Update `scripts/build-js.js`
- Add `pricing-widget-loader.js` at the end of the `jsOrder` array so it is included in `assets/js/app.js`.

### Phase 4 — Replace placeholder regions in HTML (ONLY allowed HTML edits)
7) For each target HTML file:
- Locate the pricing placeholder `<p class="section-subtitle">` whose text starts with:
  - `Transparent pricing tables will appear here soon.`
- Replace only that `<p ...>...</p>` element with the mount block specified in:
  - `codex/PRICING_WIDGET_REFERENCE.md`

**No other edits to the HTML files are permitted.**
- Do not add script tags.
- Do not change indentation outside the replaced block.
- Do not touch other sections.

### Phase 5 — Final checks
8) Run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-pricing-embeds.js --strict`

9) Provide a file-change allowlist report
Allowed changes:
- `services.html` (placeholder region only)
- `niches/*.html` (placeholder region only)
- `src/js/pricing-widget-loader.js` (new)
- `scripts/build-js.js` (append loader to bundle order)
- `scripts/generate-pricing-data.js` (new)
- `scripts/build-pricing-widget.js` (new)
- `scripts/validate-pricing-embeds.js` (new)
- `scripts/tailwind.pricing.config.cjs` (new)
- `scripts/codex.setup.sh` and `scripts/codex.maintenance.sh` (updated to include pricing checks)
- Additional widget source files + build deps as needed (but no unrelated changes)

## Acceptance criteria (must all pass)
- All placeholders are removed from all target pages and replaced by a mount container once.
- Pricing widget renders correct products and prices per page according to CSV mapping tables.
- No HTML changes exist outside the placeholder region on target pages.
- Re-running build does not duplicate mounts or injected scripts.
- If widget fails to load, only the mount area shows a minimal message; the rest of the page renders normally.
