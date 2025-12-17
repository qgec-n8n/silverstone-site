<!-- FILE: PLANS.md -->
# Plans — Pricing React Embed (Static Site)

This file defines the only acceptable workstream for the pricing integration. Codex must follow the phases in order and must meet each phase’s exit criteria before continuing.

## Phase 0 — Read-only discovery
**Inputs to inspect (required):**
- `PRICING_COPY_MAP.md`
- `pricing_code.tsx`
- `src/js/hero-shader.js`
- `assets/js/app.js`
- `scripts/build-js.js` and `build-css.js`
- Target HTML pages (`services.html`, `niches/*.html`)
- Existing steering docs (`ExecPlan.md`, `AGENTS.md`, `.codex/config.toml`, `codex/*.md`)

**Deliverable (internal note):**
- A short bullet list confirming:
  - pricing placeholder location per page
  - hero shader selectors that must remain stable
  - which build system is used (concat JS/CSS)

Exit criteria:
- No edits made
- Findings recorded (either in the Codex run log or a short note file)

## Phase 1 — Copy parsing + validation
Goal: make pricing copy deterministic and fail-fast.

Required outcomes:
- A parser that converts `PRICING_COPY_MAP.md` → structured data
- Automated validation that enforces:
  - every target page exists in the copy map
  - each page has Row 1 + Row 2
  - each row has exactly 3 cards/plans
  - all required fields exist and currency values parse to numbers

Exit criteria:
- `node scripts/validate-pricing-copy-map.js` passes

## Phase 2 — Build toolchain (React + TS + Tailwind)
Goal: build a standalone React widget into static assets.

Constraints:
- No framework migration (no Next.js, no Astro, no rewrite)
- Output must be two stable files:
  - `assets/css/pricing-widget.css`
  - `assets/js/pricing-widget.js`
- Tailwind must be scoped to the pricing mount (so host CSS is not reset/overwritten)

Exit criteria:
- Build produces both assets with stable filenames
- Site remains visually unchanged on non-pricing sections (quick smoke check)

## Phase 3 — UI implementation (must remain visually identical)
Goal: adapt `pricing_code.tsx` to:
- use page-specific copy
- implement Monthly/Setup toggle for Row 1
- render Row 2 without a toggle
- keep the component’s look, layout, and animation behavior consistent with the baseline design

Exit criteria:
- On a sample page, 6 cards appear (2×3)
- Toggle switches prices between monthly and setup fee values
- Row 2 has no toggle and shows all row-2 content without truncation

## Phase 4 — HTML integration (mount + asset includes)
Goal: embed the widget into each target page safely.

Constraints:
- Only modify the pricing placeholder region (`<section id="pricing">`) on each page
- Do not touch hero shader DOM or script references
- Use a per-page `data-ss-pricing-page` attribute to select correct copy

Exit criteria:
- `node scripts/validate-pricing-mounts.js` passes

## Phase 5 — Regression verification
Automated:
- `npm run validate`
- `node scripts/validate-pricing-copy-map.js`
- `node scripts/validate-pricing-mounts.js`

Manual (required):
- Open every target page and verify:
  - hero shader renders
  - pricing copy matches the correct page block
  - row 1 toggle works
  - row 2 has no toggle
  - component looks like the baseline design

Exit criteria:
- All automated checks pass + manual checks pass
