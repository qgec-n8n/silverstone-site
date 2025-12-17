<!-- FILE: PLANS.md -->
# Plans — Pricing React Embed

## Inputs
- `PRICING_COPY_MAP.md`
- `pricing_code_prompt.md`
- `Embed_React_Guide.md`
- `codex/PRICING_WIDGET_SPEC.md`
- `codex/PRICING_COPY_MAP_SPEC.md`
- `codex/PRICING_INTEGRATION_SPEC.md`
- `AGENTS.md`

## Phase 0 — Preflight / No Changes
Run:
- `node scripts/validate-services-page.js --strict`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/validate-pricing-copy-map.js`

Exit criteria:
- All validators pass
- Target pages exist (see `scripts/pricing.constants.js`)

## Phase 1 — Copy Map → Data Model
Goal: produce a deterministic, auditable structure from `PRICING_COPY_MAP.md` that can power the widget.

Rules:
- Do not edit `PRICING_COPY_MAP.md`
- Each page has exactly:
  - Section 1: 3 plans with (name, setup fee, monthly retainer, best-for, bullets, optional badge)
  - Section 2: 3 groups with (group label, one-liner, plans list)

Exit criteria:
- `node scripts/validate-pricing-copy-map.js` passes
- Codex can point to a single lookup keyed by:
  - `data-ss-pricing-page` AND
  - `data-ss-pricing-section`

## Phase 2 — Widget Build Scaffolding
Goal: create a self-contained React widget build output that can be embedded in static HTML.

Constraints:
- Isolate widget in a new folder (`pricing-widget/` recommended)
- Output stable built assets into:
  - `assets/js/pricing-widget.js`
  - `assets/css/pricing-widget.css`
- Do not introduce global CSS resets that can affect the rest of the site.

Exit criteria:
- Widget can mount on a dummy HTML page by scanning for `.ss-pricing` containers.

## Phase 3 — UI Implementation (Section 1 + Section 2)
Goal: adapt the component code in `pricing_code_prompt.md` to:
- Render **Section 1** with the “Monthly / Setup” toggle and correct price switching
- Render **Section 2** without any toggle and with content formatting suitable for group summaries

Exit criteria:
- On a sample page, 6 cards appear (2×3)
- Toggle switches prices between monthly and setup fee values
- Section 2 has no toggle and shows all section-2 content without truncation
- Sparkles and toggle animations work as intended

## Phase 4 — HTML Integration Across All Pages
Goal: integrate the widget into each target HTML page while preserving layout.

Constraints:
- Only modify the pricing placeholder region (`<section id="pricing">`) on each page
- Do not touch hero shader DOM or script references
- Use `data-ss-pricing-page` and `data-ss-pricing-section` attributes on each mount container

Exit criteria:
- Every page contains exactly two mounts inside `<section id="pricing">`
  - section 1 mount: `data-ss-pricing-section="1"`
  - section 2 mount: `data-ss-pricing-section="2"`
- Each page includes the correct relative paths to the widget assets

## Phase 5 — Automated Validation
Run:
- `node scripts/validate-services-page.js --strict`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/validate-pricing-copy-map.js`
- `node scripts/validate-pricing-mounts.js` (post-embed)

Exit criteria:
- All validators pass

## Phase 6 — Manual Browser Smoke Test
Spot check:
- `services.html`
- a niche page
- the “estate agents” niche page
- confirm both sections render, toggle works in section 1 only, and visuals match.

Exit criteria:
- Visual + behavioral parity within constraints
- No regressions in other sections
