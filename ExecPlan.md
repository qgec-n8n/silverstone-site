<!-- FILE: ExecPlan.md -->
# ExecPlan — Pricing Widget React Embed (Two Sections Per Page)

This ExecPlan is written to maximize safe execution by Codex (GPT‑5.1 Codex Max or GPT‑5.2) while preventing unrelated site changes.

## Objective

Embed the React pricing widget (from `pricing_code_prompt.md`) into the existing static site so that:

- `services.html` and all target niche pages show **two stacked pricing sections**.
- Each section has **3 cards** (total 6 cards per page).
- **Section 1** includes a **Monthly / Setup** toggle (Setup replaces Yearly).
- **Section 2** has **no toggle**, and cards are reformatted to fit the “other options summaries” copy while keeping the same overall UI design language.

## Inputs and source-of-truth constraints

Only these sources may define integration semantics and UI fidelity:

- `PRICING_COPY_MAP.md` (all copy + per-page mapping)
- `pricing_code_prompt.md` (the reference React component implementation)
- `Embed_React_Guide.md` (embed method summary used in this repo)
- The referenced Medium embedding article (embed method source-of-truth)
- The referenced 21st.dev component page (visual/behavioral reference)

OpenAI Cookbook material may be used only for improving execution planning reliability, not for changing integration semantics.

## Target pages (must all be updated)

The canonical list is defined in `scripts/pricing.constants.js` and `codex/PRICING_COPY_MAP_SPEC.md`.

Do not “discover” additional pages via grep; follow the canonical list only.

## Non-negotiables

- Two mounts per page:
  - `data-ss-pricing-section="1"` (toggle)
  - `data-ss-pricing-section="2"` (no toggle)
- Copy must match `PRICING_COPY_MAP.md` exactly (no paraphrasing).
- Preserve existing site layout:
  - No global CSS nukes
  - No mass reformatting
  - Only edit the pricing placeholder region and add the minimal asset includes
- Preserve hero shader invariants (must remain unchanged on every page):
  - `id="hero-shader-canvas"` and the existing hero section structure
  - existing `assets/js/app.js` include remains

## New guardrails and validators

Pre-embed (should pass immediately):

- `node scripts/validate-services-page.js --strict`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/validate-pricing-copy-map.js`

Post-embed (should pass only after implementation):

- `node scripts/validate-pricing-mounts.js`

Preferred wrappers:

- `bash scripts/codex.setup.sh`
- `bash scripts/codex.maintenance.sh`

## Deliverables Codex must produce (implementation phase)

Codex will implement these later; this ExecPlan constrains how.

1. A self-contained pricing widget build output:
   - `assets/js/pricing-widget.js`
   - `assets/css/pricing-widget.css`
   - Stable names (no hashes)

2. Updated HTML pages:
   - Replace the pricing placeholder content with two mount containers inside `<section id="pricing">`
   - Add one CSS include + one JS include for the widget (path differs for `niches/*`)

3. Correct mapping:
   - `PRICING_COPY_MAP.md` mapped deterministically by `data-ss-pricing-page` + `data-ss-pricing-section`

## Execution strategy

Follow an evaluation flywheel:

- Make the smallest safe change
- Run the most relevant validator(s)
- Only then move to the next change
- If a validator fails, fix forward without expanding scope

## Stop conditions (hard)

Stop and report (do not keep hacking) if any of these occur:

- A target page is missing `<section id="pricing">`
- The pricing placeholder region differs so much that insertion would require reworking the page layout
- Any change affects hero shader markup, the main nav, or global CSS
- Copy mapping can’t be made exact without editing `PRICING_COPY_MAP.md`

## Milestone gates

### Gate 0 — Preflight / repo grounding (no edits)

Commands:

- `node scripts/validate-pricing-copy-map.js`
- `node scripts/validate-services-page.js --strict`
- `node scripts/validate-niche-pages.js --strict`

Confirm:

- Target pages exist at the paths listed in `scripts/pricing.constants.js`
- Every target page contains a pricing placeholder region in `<section id="pricing">`
- No existing React embed system exists (this repo is static + built JS/CSS)

### Gate 1 — Copy mapping plan is deterministic

Output requirements:

- Decide the runtime copy lookup key:
  - Must use `data-ss-pricing-page` attribute value equal to the repo-relative HTML path (e.g., `niches/dentists.html`)
  - Must use `data-ss-pricing-section` value `"1"` or `"2"`

Validation:

- `node scripts/validate-pricing-copy-map.js --print-json` (inspect structure)
- Confirm every page has:
  - Section 1: title + subtitle + 3 plan cards
  - Section 2: title + subtitle + 3 group cards

### Gate 2 — Widget build scaffolding (minimal, isolated)

Constraints:

- All React widget work must be isolated to a new subproject folder (recommended: `pricing-widget/`).
- Do not add React deps to the root project.
- Build output must be stable-named and copied/emitted into `assets/js/` and `assets/css/`.

Key embed requirement:

- The built `assets/js/pricing-widget.js` must mount itself safely by scanning the DOM for `.ss-pricing` mount nodes after DOM is ready.

CSS safety requirement:

- Widget CSS must not contain global resets that impact the rest of the site.

### Gate 3 — Implement Section 1 vs Section 2 behavior

Section 1 requirements:

- Toggle shows “Monthly” and “Setup”
- Sliding highlight animation works exactly like reference
- Prices switch between monthly retainer and setup fee values from `PRICING_COPY_MAP.md`

Section 2 requirements:

- No toggle rendered at all
- Card content supports the “other options summaries” layout:
  - group label
  - one-liner
  - bullet list (and optional subcategory headings)

Animations:

- Sparkles background must run
- Toggle animation must run (Section 1 only)

### Gate 4 — HTML integration (page-by-page, minimal diffs)

For each target page:

1. Replace the pricing placeholder content inside `<section id="pricing">` with two mount containers:
   - `<div class="ss-pricing" data-ss-pricing-page="..." data-ss-pricing-section="1"></div>`
   - `<div class="ss-pricing" data-ss-pricing-page="..." data-ss-pricing-section="2"></div>`

2. Add includes:
   - `assets/css/pricing-widget.css` in `<head>`
   - `assets/js/pricing-widget.js` near end of `<body>` (or alongside existing scripts)

Relative path rule:

- Root pages: `assets/...`
- Niche pages: `../assets/...`

Do not touch other sections.

### Gate 5 — Automated validations

Run:

- `node scripts/validate-pricing-copy-map.js`
- `node scripts/validate-pricing-mounts.js`

Plus baseline validators to ensure no unrelated breakage:

- `node scripts/validate-services-page.js --strict`
- `node scripts/validate-niche-pages.js --strict`

### Gate 6 — Manual spot checks (minimal, targeted)

Open in a browser:

- `services.html`
- One representative niche page
- One “complex plans” page (services, estate-agents)

Check:

- Two stacked pricing sections exist
- Section 1 toggle works and switches values correctly
- Section 2 has no toggle and has readable bullets
- Visual design matches the reference component within reasonable site constraints
- No layout regressions elsewhere on page

## Definition of done

All of the following are true:

- Every target page has exactly two mounts with correct data attributes
- Widget assets exist at `assets/js/pricing-widget.js` and `assets/css/pricing-widget.css`
- `node scripts/validate-pricing-mounts.js` passes
- Copy in rendered UI matches `PRICING_COPY_MAP.md` exactly
- No unrelated diffs outside:
  - target HTML pages (`services.html`, `niches/*.html`)
  - widget subproject folder
  - `assets/js/pricing-widget.js`, `assets/css/pricing-widget.css`
  - these guardrail scripts/docs
