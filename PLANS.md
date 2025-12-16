<!-- FILE: PLANS.md -->

# Execution Playbook (Codex CLI) — Pricing Widget Integration

This repo uses an ExecPlan workflow:
- `ExecPlan.md` is the executable task spec.
- You must proceed gate-by-gate and verify after each gate.

## Operating principles
1) **Scope discipline**
- Implement exactly and only the pricing widget feature.
- No unrelated refactors, formatting, or cleanup.
- Do not modify HTML outside the pricing placeholder region on each target page.

2) **Repo-convention alignment**
- Keep the site static.
- Keep `assets/js/app.js` as the global JS entry (built from `src/js/*`).
- Add a small bootstrap module to `src/js/` and include it in `scripts/build-js.js`.

3) **Isolation**
- Widget styling must not leak into host pages.
- Use Shadow DOM for the widget mount and inject widget CSS into the shadow root.

4) **Deterministic data**
- Pricing data must be generated from `Silverstone_Service_Master_List.csv`.
- No hand-edited prices in JS/TS source.

## Gate sequence

### Gate 0 — Preflight
- Read `AGENTS.md`, `ExecPlan.md`, `codex/PRICING_WIDGET_REFERENCE.md`.
- Inventory target HTML files (exact list is in `AGENTS.md`).

### Gate 1 — Recon complete
- Confirm each target page contains the expected pricing placeholder `<p class="section-subtitle">Transparent pricing tables will appear here soon...`
- Confirm the site loads only `assets/js/app.js` (or `../assets/js/app.js`) and no page-specific scripts.
- Confirm build scripts:
  - `scripts/build-js.js` concatenates `src/js/*` into `assets/js/app.js`
  - `build-css.js` concatenates `src/css/*` into `assets/css/styles.css`

### Gate 2 — Data pipeline implemented
- Create `scripts/generate-pricing-data.js` to generate a TS module (for the React widget build) from the CSV.
- Create `scripts/validate-pricing-embeds.js` to enforce:
  - placeholder removed
  - mount blocks exist exactly once
  - mapping SKUs match CSV

### Gate 3 — Widget build pipeline implemented
- Create `scripts/build-pricing-widget.js`:
  - builds Tailwind CSS for the widget
  - bundles React widget to `assets/js/ss-pricing-widget.iife.js`
- Add `src/js/pricing-widget-loader.js` and ensure it is included in `scripts/build-js.js` so it ends up in `assets/js/app.js`.
- Loader must:
  - detect mount containers
  - lazy-load the widget bundle once
  - mount into Shadow DOM
  - fail safely

### Gate 4 — HTML placeholder replacement
For each target HTML page:
- Replace **only** the pricing placeholder `<p class="section-subtitle">...Transparent pricing tables...</p>` with the mount block defined in `codex/PRICING_WIDGET_REFERENCE.md`.
- Do not modify any other HTML on those pages (including script tags).

### Gate 5 — Final validation
Must run and PASS:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-pricing-embeds.js --strict`

Also provide a constrained diff summary:
- Only the allowlisted files changed (see `ExecPlan.md`).
- No target HTML file has edits outside the placeholder region.
