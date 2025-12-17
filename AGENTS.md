<!-- FILE: AGENTS.md -->
# Agent Rules — Static Site + Embedded React Widgets

These rules apply to Codex agents working in this repo.

## 1) Primary objective

The pricing widget embed is already implemented. Your primary objective is to **tune the existing embedded React pricing widget UI** (without changing copy or core behavior) so that:

- The pricing widget matches Silverstone’s website palette and “premium light mode” aesthetic (light neon aqua blues, icy whites, neon pink accents).
- `services.html` — Pricing Section 2: the lower list area inside each card has internal scroll, and the three cards match the height of the cards in Pricing Section 1 above.
- All `niches/*.html` pages — Pricing Section 1: card titles are moved down/cleared so the “Most popular” badge is never overlapped (and titles stay aligned across cards).

WITHOUT breaking the existing static site layout.

## 2) Allowed sources for pricing semantics vs theming (non-negotiable)

### A) Pricing behavior + copy (do not change)

For pricing behavior and copy mapping, treat these as source-of-truth and do not modify copy:
- `PRICING_COPY_MAP.md`
- `pricing-widget/src/pricing-copy-map.json` (generated copy data used by the widget)
- `pricing_code_prompt.md`
- `Embed_React_Guide.md`
- the referenced Medium embedding article
- the referenced 21st.dev Pricing Section 4 reference UI

### B) Site palette / aesthetic (you MUST match the existing site)

For the site color palette and overall look-and-feel, use:
- `assets/css/styles.css` (especially `:root` variables and neon gradients)
- existing markup/classes on target pages for context (read-only; do not rework pages)

## 3) Safety rules (must follow)

- Minimize diffs. No mass formatting changes.
- Do not modify unrelated sections of HTML pages.
- Do not change pricing copy. Do not edit `PRICING_COPY_MAP.md`.
- Prefer changes limited to:
  - `pricing-widget/src/pricing-widget.css`
  - `pricing-widget/src/PricingWidget.jsx` and/or `pricing-widget/src/embed.jsx` (ONLY if required for the height-match + scroll behavior)
  - rebuilt outputs:
    - `assets/css/pricing-widget.css`
    - `assets/js/pricing-widget.js`
- Do not modify global site CSS (`assets/css/styles.css`) unless an ExecPlan explicitly calls for it (this tuning task should not require global CSS edits).
- Do not touch hero shader DOM structure or its script references:
  - `id="hero-shader-canvas"` must remain present and functional.

## 4) Visual fidelity rules (non-negotiable)

- Keep the component’s layout, spacing system, and micro-interactions consistent with the existing pricing widget.
- Preserve:
  - toggle sliding animation (Section 1 only)
  - sparkle animation (but you may recolor it to suit light mode)
  - bullet formatting consistency
  - card structure and hierarchy
- Changes should be primarily palette + targeted layout fixes (scroll + badge/title clearance).

## 5) Copy rules (non-negotiable)

- Copy must remain identical to what is currently mapped from `PRICING_COPY_MAP.md`.
- Do not reword, summarize, or “fix” copy.
- Do not edit `PRICING_COPY_MAP.md`. If copy appears wrong, stop and report.

## 6) Data + rendering invariants (must not regress)

- Each target page must continue to render **two distinct pricing sections** stacked vertically.
- Each section must continue to render exactly **3 cards**.
- Section behavior must remain:
  - Section 1:
    - toggle labels: “Monthly” and “Setup”
    - toggles between monthly retainer and setup fee values for each card
  - Section 2:
    - no toggle rendered
    - group layout remains (label, one-liner, plan list)

## 7) Verification rules

Before finalizing:
- Run base validators:
  - `node scripts/validate-services-page.js --strict`
  - `node scripts/validate-niche-pages.js --strict`
- Run pricing validators:
  - `node scripts/validate-pricing-copy-map.js`
  - `node scripts/validate-pricing-mounts.js`
- Run tuning validator (strict when the tuning work is complete):
  - `node scripts/validate-pricing-ui-tuning.js --strict`

Preferred wrapper:
- `bash scripts/codex.pricing-tuning.sh`

If a validator fails:
- Fix the minimum necessary code.
- Do not expand scope.

## 8) Stop conditions (must stop and report)

Stop immediately if:
- Achieving the light theme requires editing large portions of global site CSS.
- The scroll/height-match requirement appears to require rewriting page layouts or changing HTML structure outside the widget.
- Any change affects hero shader markup, the main nav, or other global site layout.
- You find yourself changing copy to “make it fit”.
