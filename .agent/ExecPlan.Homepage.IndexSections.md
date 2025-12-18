<!-- FILE: .agent/ExecPlan.Homepage.IndexSections.md -->

# ExecPlan: Homepage "Our Services" + "Transparent Pricing" (index.html only)

## Objective (user-visible outcome)

After completing this plan, the homepage (`index.html`) will:
- Show improved, clearer Services messaging in the existing 4-card layout.
- Replace the old homepage pricing grid + "Popular Solutions" block with the embedded pricing widget layout used elsewhere (2 blocks × 3 cards).
- Load the pricing widget correctly on the homepage (CSS/JS included; copy map contains `index.html`).

## Hard constraints (non-negotiable)

- Scope: edit ONLY the two homepage sections described in `codex/HOMEPAGE_INDEX_SECTIONS_SPEC.md`.
- Do not change any other homepage sections (hero, stats, proof, FAQs, footer, etc.).
- Do not redesign styles or refactor JS.
- Do not invent or change pricing plans/prices/features.
- Keep diffs minimal: text swaps + required embed plumbing only.

## Allowed files to change (this task)

Primary:
- `index.html`

Pricing widget support (required for homepage mounts to render):
- `scripts/pricing.constants.js`
- `PRICING_COPY_MAP.md`
- `pricing-widget/src/pricing-copy-map.json` (generated via script)
- `assets/js/pricing-widget.js` (generated)
- `assets/css/pricing-widget.css` (generated)

Task-specific validation + wrapper scripts:
- `scripts/validate-homepage-index-sections.js`
- `scripts/codex.homepage-index-sections.sh`

Do not edit other files unless a validator requires it AND the change is directly caused by the above edits.

## Definitions (to avoid ambiguity)

- "Services section" refers to the block in `index.html` under the comment `<!-- Grouped services section -->` containing the 4 `.package-card` service cards.
- "Pricing section" refers to the block in `index.html` starting at `<!-- Pricing integrated into the same section -->`.
- "Pricing widget mounts" are the two `<div class="ss-pricing" ...>` elements, placed inside `<section id="pricing">`.
- "Page key" is the value used in `data-ss-pricing-page="..."` and must match a top-level key in `pricing-widget/src/pricing-copy-map.json`.

## Gate 0 — Preflight + baseline

### Steps
1) Confirm you are in repo root and required files exist:
   - `index.html`
   - `pricing-widget/`
   - `assets/js/pricing-widget.js`
   - `assets/css/pricing-widget.css`
   - `codex/HOMEPAGE_INDEX_SECTIONS_SPEC.md`

2) Run baseline setup (safe, no functional changes expected):
   - `bash scripts/codex.setup.sh`

3) Confirm pricing widget works on `services.html` (static check):
   - Verify `services.html` contains:
     - `data-ss-pricing-page="services.html"` mounts
     - CSS include `assets/css/pricing-widget.css`
     - JS include `assets/js/pricing-widget.js`

### Exit criteria
- Setup script completes.
- You have located the two target sections in `index.html` using the anchors in the spec.

## Gate 1 — Implement Services section copy (index.html)

### Steps
1) Open `index.html`.
2) Locate the Services section via `<!-- Grouped services section -->`.
3) Apply the exact copy changes defined in:
   - `codex/HOMEPAGE_INDEX_SECTIONS_SPEC.md` → "Required copy: Services section"
4) Do not change:
   - number of cards
   - icons
   - classes
   - layout structure

### Validate (services-only)
- Run:
  - `node scripts/validate-homepage-index-sections.js --services-only`

### Exit criteria
- Validator passes for services-only mode.
- `index.html` changes are strictly within the Services section.

## Gate 2 — Replace homepage pricing with pricing widget embed (index.html)

### Steps
1) In `index.html`, locate pricing block starting at:
   - `<!-- Pricing integrated into the same section -->`
2) Replace the entire pricing block with the `section#pricing` + mounts markup from the spec.
3) Add required asset includes:
   - CSS link in `<head>`: `assets/css/pricing-widget.css`
   - JS script near end of `<body>`: `assets/js/pricing-widget.js`

### Validate (pricing-only structural checks)
- Run:
  - `node scripts/validate-homepage-index-sections.js --pricing-only`

### Exit criteria
- Pricing-only validation passes.
- Old homepage pricing grid + "Popular Solutions" markup is removed.

## Gate 3 — Make pricing widget render for index page key

At this point, `index.html` contains mounts with `data-ss-pricing-page="index.html"`.
Now ensure the pricing copy map supports that page key and rebuild the widget.

### Steps
1) Update target list:
   - Edit `scripts/pricing.constants.js` to include `index.html` in `TARGET_PAGES`.

2) Update pricing copy source-of-truth:
   - In `PRICING_COPY_MAP.md`, add a new page block `## index.html`.
   - Copy/paste the entire `## services.html` block and paste it as `## index.html` with no internal edits.

3) Generate widget JSON from markdown:
   - Run:
     - `node scripts/validate-pricing-copy-map.js --json-out pricing-widget/src/pricing-copy-map.json`

4) Rebuild widget outputs:
   - Run:
     - `(cd pricing-widget && npm install && npm run build)`

### Validate (pricing system)
- Run:
  - `node scripts/validate-pricing-copy-map.js`
  - `node scripts/validate-pricing-mounts.js`

### Exit criteria
- Pricing copy map validates.
- Pricing mounts validate (now including `index.html` as a required page).

## Gate 4 — Full task validation + regression checks

### Full validation
- Run:
  - `node scripts/validate-homepage-index-sections.js`

### Recommended regression checks (should be clean)
- Run:
  - `node scripts/validate-core-pages.js`
  - `node scripts/validate-services-page.js --strict`
  - `node scripts/validate-niche-pages.js --strict`

### Exit criteria
- All validations pass.

## Gate 5 — Scope guard (prevent drift)

### Required check
1) List modified files.
2) Confirm all changes are limited to the "Allowed files to change" list in this ExecPlan.

If anything outside the allowlist changed, revert it unless it is strictly required for the pricing embed/build.

## Final output requirements (what to report when done)

- Summary of changes grouped by:
  - Services section copy
  - Pricing embed on index
  - Pricing data updates + widget build
- List of files changed
- Commands run + confirmation all validators passed

## Decision log (append-only)

Record any non-obvious choices you made and why, especially if you had to interpret HTML boundaries or fix minor formatting issues.
