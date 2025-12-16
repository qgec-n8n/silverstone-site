<!-- FILE: ExecPlan.md -->

# ExecPlan — Embed React Pricing (Two-Row, Per-Page Copy) Without Breaking Site

## Mission
Implement a **React pricing section** (surgically embedded into this static site) on:

- `services.html`
- `niches/estate-agents.html`
- `niches/hospitality.html`
- `niches/salons-barbers.html`
- `niches/trades-virtual-office.html`
- `niches/ecommerce.html`
- `niches/physios-chiropractors.html`
- `niches/dentists.html`
- `niches/gyms-fitness-studios.html`
- `niches/fitness-coaches.html`

…using **PRICING_COPY_MAP.md as the source of truth**, and **pricing_code.tsx as the UI behavior reference**.

This run MUST preserve **all existing site behavior**, especially the **hero shader**.

---

## Authoritative inputs (must use)
1) `PRICING_COPY_MAP.md`  
   - Single source of truth for: which pages get pricing, and exactly what copy/prices appear per page.
2) `pricing_code.tsx`  
   - UI behavior reference (toggle, “popular” treatment, card layout conventions, etc.).
3) Hero shader system
   - `src/js/hero-shader.js` + page markup using `#hero-shader-canvas` and `.hero.title-band`.
4) Steering + ops
   - `ExecPlan.md`, `PLANS.md`, `AGENTS.md`, `.codex/config.toml`, scripts/ directory, codex/ directory docs.

---

## Non-negotiable UI requirements (pricing feature)
### A) Layout per target page
- Exactly **2 rows × 3 cards** (6 cards total).

### B) Row 1 (highlighted picks)
- Includes a toggle with labels:
  - “Monthly”
  - “Setup” (this is the “Yearly” label renamed)
- Switching to “Setup” MUST switch displayed numeric prices to **Setup fee** values from `PRICING_COPY_MAP.md`.
- Card 2 MUST show a “Most popular” badge (per Cross-page rules in `PRICING_COPY_MAP.md`).

### C) Row 2 (other options summaries)
- NO toggle.
- Cards are **slightly restyled/reformatted** only as needed to present the “Plan group label / Plans included / One-liner” content from `PRICING_COPY_MAP.md`.
- No creative redesign.

### D) Safety: preserve site and shader
- Must not regress hero shader initialization/rendering, layout, or stacking.
- Must not introduce global CSS regressions.
- Prefer Shadow DOM for isolation.

### E) Deterministic mapping
Codex MUST:
- Correctly locate where to mount on each page.
- Select correct copy for that page key.
- Keep DOM stable where shader depends on it.

---

## Embed strategy (must follow; aligns with “embed React into static site” guidance)
### High-level
- Each target page contains **one mount container** with a page key:
  - `data-ss-pricing-page="services.html"` or `data-ss-pricing-page="niches/estate-agents.html"`, etc.
- Existing global JS bundle (`assets/js/app.js`) gets a **tiny loader module** that:
  - Finds mount containers.
  - Lazily injects a **single** widget bundle (`assets/js/ss-pricing-widget.iife.js`) only if needed.
  - Calls a global mount API exposed by the widget.

### Widget bundle
- Built as an IIFE exposing:
  - `window.SS_PRICING_WIDGET.mount(el, { pageKey })`
  - optional: `window.SS_PRICING_WIDGET.mountAll()`
- Renders into a **ShadowRoot** attached to the mount element.
- Injects widget CSS into the ShadowRoot (no global CSS leakage).
- Uses generated copy data parsed from `PRICING_COPY_MAP.md` (no hand-typed prices).

---

## Gate-by-gate execution (do in order, do not skip)
### Gate 0 — Recon & invariants (must document findings in the PR)
1) Inventory target pages:
   - Confirm each target page includes the placeholder sentence:
     - “Transparent pricing tables will appear here soon…”
2) Confirm hero shader invariants:
   - Each page must retain:
     - `<canvas id="hero-shader-canvas" ...>`
     - a hero container matching `.hero.title-band`
3) Confirm JS delivery model:
   - Root pages load `assets/js/app.js`
   - Niche pages load `../assets/js/app.js`

### Gate 1 — Deterministic copy extraction pipeline
Implement scripts and rules (see `codex/PRICING_COPY_PARSER_SPEC.md`):
1) Add generator:
   - `scripts/pricing-copy-map-to-json.js`
   - Reads `PRICING_COPY_MAP.md`
   - Writes `codex/_generated/pricing-copy.json` (deterministic output)
2) Add validator:
   - `scripts/validate-pricing-copy-map.js --strict`
   - Must enforce:
     - 10 pages present
     - each page has 3 Row-1 plans and 3 Row-2 groups
     - Row-1 card 2 is “Most popular” and no other card is

Failure policy:
- If parsing fails or a page is missing, STOP and fix the parser. No manual “patching” of prices in code.

### Gate 2 — React widget implementation (self-contained)
Create widget source (new directory is OK) derived from `pricing_code.tsx` behavior but adapted to this repo:
- Must implement `codex/PRICING_WIDGET_UI_SPEC.md` exactly.
- Must consume `codex/_generated/pricing-copy.json` (or build-time embedded equivalent).
- Must render Row 1 + Row 2 for the provided pageKey.
- Must support toggle only on Row 1 (Monthly vs Setup).

### Gate 3 — Build pipeline for widget
1) Add `scripts/build-pricing-widget.js`
   - Runs generator first (Gate 1)
   - Bundles widget to `assets/js/ss-pricing-widget.iife.js`
2) Add required deps to `package.json` (minimal):
   - `react`, `react-dom`, `esbuild` (and only what is necessary)

### Gate 4 — Loader integrated into site JS bundle
1) Add `src/js/pricing-widget-loader.js`
   - No-op unless it finds mount containers.
   - Inject widget bundle once (idempotent script element id).
   - Derive widget URL base from the actual `app.js` script src.
   - Mount each container once (idempotent `data-ss-mounted="1"`).
2) Update `scripts/build-js.js` to include loader at end of concatenation order.

### Gate 5 — HTML mount injection (surgical)
For each target HTML file:
- Replace only the pricing placeholder text node region with a mount container as specified in:
  - `codex/PRICING_PAGE_MOUNT_MAP.md`
- DO NOT change:
  - hero markup
  - script tags
  - nav markup
  - section ordering
  - whitespace outside the replaced block

### Gate 6 — Verification & regression checks
Run:
1) `npm run build:css`
2) `npm run build:js`
3) `node scripts/build-pricing-widget.js`
4) `node scripts/validate-pricing-copy-map.js --strict`
5) `node scripts/validate-pricing-embed-markup.js --strict`
6) `bash scripts/codex.maintenance.sh`

Manual checks (must do):
- Open each target page locally and confirm:
  - Row 1 toggle shows “Monthly” and “Setup”
  - Toggle switches numeric values correctly to Setup fee
  - Row 2 has no toggle
  - Copy matches `PRICING_COPY_MAP.md` for that exact page
  - No console errors
  - Hero shader animates as before (or gracefully respects reduced-motion)

---

## Allowed change surface (hard scope)
### Allowed
- `services.html` and `niches/*.html` (pricing placeholder region only)
- `src/js/pricing-widget-loader.js` (new)
- `scripts/build-js.js` (append loader in order)
- `scripts/build-pricing-widget.js` (new)
- `scripts/pricing-copy-map-to-json.js` (new)
- `scripts/validate-pricing-copy-map.js` (new)
- `scripts/validate-pricing-embed-markup.js` (new)
- `codex/_generated/*` (generated)
- `package.json`, `package-lock.json` (only to add minimal deps needed)
- New widget source directory (only pricing widget; no unrelated utilities)

### Forbidden
- Any changes to hero shader markup/CSS/JS beyond what is explicitly required by this plan (normally: none)
- Global CSS refactors
- Touching unrelated pages
- Reformatting HTML files wholesale

---

## Acceptance criteria (must all pass)
- All 10 target pages render a **2×3 pricing layout** with correct per-page copy.
- Row 1 toggle is present with labels “Monthly” and “Setup” and switches to Setup fee values.
- Row 2 has no toggle and correctly presents group summaries.
- No shader regressions:
  - `#hero-shader-canvas` still present and renders as before.
- No global CSS/JS regressions.
- Validators pass in strict mode.
