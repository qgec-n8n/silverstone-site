<!-- FILE: ExecPlan.md -->
# Codex ExecPlan — React Pricing Embed (Two-Row, Page-Specific Copy)

## Mission
Embed a React pricing section into this static site (no framework lock-in) for:
- `services.html`
- every file in `/niches/*.html`

The pricing UI must match the look/behavior of the existing `pricing_code.tsx` component (sourced from the Pricing Section 4 design) with ONLY the explicitly required functional/copy changes:
- **Two rows × three cards** (6 total) per target page
- **Row 1 toggle exists**: labels are `Monthly` + `Setup` (rename the existing `Yearly` label to `Setup`)
- **Row 1 price toggles** between Monthly Retainer and Setup Fee values from `PRICING_COPY_MAP.md`
- **Row 2 has no toggle**, and cards are lightly reformatted to present Row 2 copy cleanly (no creative redesign)
- Nothing else on the website regresses (especially the hero shader)

## Source-of-truth inputs (do not deviate)
1. `PRICING_COPY_MAP.md` — the canonical per-page pricing copy and mapping (including `services.html`)
2. `pricing_code.tsx` — the canonical baseline component markup/visual treatment to preserve
3. Hero shader integration — how it’s loaded and what DOM identifiers/structure it depends on (see `src/js/hero-shader.js` and the compiled bundle in `assets/js/app.js`)
4. Steering + guardrails files — `ExecPlan.md`, `PLANS.md`, `AGENTS.md`, `.codex/config.toml`, `/scripts/*`, and any related `codex/*.md`

## Hard invariants (must never be broken)
### I1 — Hero shader DOM invariants
Do NOT remove or rename any of the following, and do NOT restructure the hero in any way that changes these query results:
- `#hero-shader-canvas`
- `.hero.title-band`
- `.hero .title-wrap`
- `.hero-media`

Reason: the shader code queries these selectors and uses their geometry for sizing and interaction.

### I2 — No unrelated refactors
No whitespace-only rewrites, no formatting passes, no changing unrelated styles, no re-ordering scripts, no navigation/footer edits, no “cleanup”.

### I3 — Copy fidelity
All pricing content must come from `PRICING_COPY_MAP.md` only:
- Do not paraphrase
- Do not invent missing items
- Do not “improve” wording
- Preserve currency, punctuation, and plan names

### I4 — Output determinism
- Pricing build outputs must use **stable, non-hashed filenames** so HTML does not require per-build edits.

## Target pages (must all be implemented)
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

## Site reality check (repository-grounded)
### Pricing placeholder location (all target pages)
Each target page currently contains:
- `<section id="pricing" ...>`
- Inside it, a `.neon-card` with `<h2 class="section-title">Pricing</h2>` and a `<p>` containing the placeholder text:
  `Transparent pricing tables will appear here soon...`

Integration should replace this placeholder with a React mount point without impacting other sections.

### Existing JS/CSS bundling behavior
- `assets/js/app.js` is produced by concatenating files from `src/js/` (see `scripts/build-js.js`).
- `assets/css/styles.css` and `assets/css/mobile.css` are produced by concatenating files from `src/css/` (see `build-css.js`).

The React pricing widget must integrate in a way that is consistent with the site's existing “build to static assets then include” approach (same pattern used by the hero shader bundle), and consistent with the two referenced Medium embedding guides (build React to static JS/CSS, include on the target pages, mount into a dedicated div).

---

# Gate-based execution (Codex MUST follow this order)

## Gate 0 — Discovery & inventory (no edits)
**Goal:** establish exact integration points and invariants.

1. Enumerate the target HTML pages (list above) and confirm each contains the pricing placeholder.
2. Confirm hero shader invariants:
   - Verify each page contains `#hero-shader-canvas` and `.hero.title-band`.
   - Verify each page still includes `assets/js/app.js`.
3. Inspect `pricing_code.tsx` and confirm which imported dependencies are missing from repo.
4. Record findings in a short markdown note (new file allowed) if needed, but do not change production HTML/CSS/JS yet.

**Exit criteria (Gate 0):**
- All target pages found and contain the placeholder
- Hero shader invariants confirmed present on all target pages
- Clear list of files that must be created for the React widget

## Gate 1 — Deterministic copy extraction
**Goal:** make `PRICING_COPY_MAP.md` machine-readable with strict validation.

1. Implement a parser per `codex/PRICING_COPY_MAP_SPEC.md`.
2. Add `scripts/validate-pricing-copy-map.js` that:
   - Parses `PRICING_COPY_MAP.md`
   - Validates every target page has:
     - Row 1 title/subtitle + 3 plans (each with setupFee, monthlyRetainer, bestFor, includes)
     - Row 2 title/subtitle + 3 cards (each with label, plansIncluded[], oneLiner)
3. Add a generator script (implementation task) to produce a typed TS module consumed by the React bundle.

**Exit criteria (Gate 1):**
- `node scripts/validate-pricing-copy-map.js` exits 0
- Parsed page IDs exactly match the target pages list

## Gate 2 — React widget build system (minimal, isolated)
**Goal:** add the smallest possible React+TS+Tailwind toolchain to output static assets.

Requirements:
- TypeScript + React 18
- Tailwind (prefer v4) with **CSS scoped to the pricing mount** (no global resets on the host site)
- Only the dependencies required by `pricing_code.tsx` and the provided dependency components

Outputs (stable filenames; no hashing):
- `assets/css/pricing-widget.css`
- `assets/js/pricing-widget.js`

**Exit criteria (Gate 2):**
- `npm run build` (or equivalent) produces both files
- The CSS is scoped so it does not affect the rest of the site

## Gate 3 — Pricing component implementation (two rows)
**Goal:** implement the pricing UI using `pricing_code.tsx` as the baseline.

Implementation rules:
1. Preserve the existing structure, classes, and visual effects from `pricing_code.tsx` for Row 1 and overall section visuals.
2. Inject page-specific copy from the generated copy module.
3. Modify the switch:
   - Keep the UI exactly the same
   - Rename label `Yearly` → `Setup`
   - Toggle changes numeric prices:
     - `Monthly` shows the page's “Monthly Retainer”
     - `Setup` shows the page's “Setup Fee (one-time)”
4. Render two separate grids:
   - Row 1: 3 plan cards + toggle
   - Row 2: 3 summary cards, **no toggle**
5. Ensure there is a visible break between row 1 and row 2 (simple divider/spacing; no redesign).
6. Row 2 formatting must follow `codex/PRICING_WIDGET_SPEC.md` rules for long “Plans included” lists.

**Exit criteria (Gate 3):**
- For a representative page (services + one niche), the rendered DOM contains:
  - 6 cards total
  - Exactly one toggle component (Row 1 only)
  - Toggle changes displayed numbers and `/month` vs `/setup` label
  - Row 2 shows all “Plans included” content without truncation

## Gate 4 — Static HTML integration
**Goal:** safely mount React into existing HTML without breaking the site.

Per target page:
1. Replace the existing placeholder content in `<section id="pricing">` with a mount element:
   - Must include `class="ss-pricing"`
   - Must include `data-ss-pricing-page="..."`
2. Include the new static assets on each target page:
   - `<link rel="stylesheet" href="assets/css/pricing-widget.css">`
   - `<script src="assets/js/pricing-widget.js"></script>`
3. Ensure the hero shader markup and script tags remain untouched.

Add `scripts/validate-pricing-mounts.js` to verify:
- mount present on each target page with correct `data-ss-pricing-page`
- placeholder string removed
- hero shader selectors still present
- pricing widget assets referenced in HTML

**Exit criteria (Gate 4):**
- `node scripts/validate-pricing-mounts.js` exits 0

## Gate 5 — Verification & regression safety
**Goal:** prove correctness and prevent regressions.

Automated:
- `npm run validate` (existing)
- `node scripts/validate-pricing-copy-map.js`
- `node scripts/validate-pricing-mounts.js`

Manual (required):
- Open each target page in a browser and confirm:
  - No console errors
  - Hero shader renders and animates as before
  - Row 1 toggle shows “Monthly” and “Setup”
  - Switching the toggle updates prices to correct numbers (spot-check each plan)
  - Row 2 has no toggle, shows 3 cards, and contains the expected plan group copy
  - Visual break exists between row 1 and row 2
  - Overall look matches the baseline component visual style

**Exit criteria (Gate 5):**
- All automated checks pass
- Manual spot-check confirms page-specific copy correctness and no shader regressions
