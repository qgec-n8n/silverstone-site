<!-- FILE: codex/CODEX_INIT_PROMPT.md -->
# Codex Initiation Prompt — Pricing Widget Embed

You are Codex running in this repository.

## Model constraint

Use only **GPT-5.1 Codex Max** or **GPT-5.2**.

## Mission

Implement the React “Pricing Section” widget into:

- `services.html`
- every `niches/*.html` page listed in `scripts/pricing.constants.js`

The implementation must produce **two stacked pricing sections per page** (each with 3 cards).

You must not break the existing site layout.

## Non-negotiable constraints

### Allowed sources for pricing integration semantics

For HOW to embed React and what the widget should look/behave like, you may ONLY use:

- `PRICING_COPY_MAP.md`
- `pricing_code_prompt.md`
- `Embed_React_Guide.md`
- the referenced Medium embedding article
- the referenced 21st.dev pricing-section-4 reference

You may use OpenAI Cookbook pages only for execution planning robustness.

### Do not destroy the site

- No unrelated refactors.
- No formatting churn.
- No global CSS resets.
- Keep diffs minimal and localized.

### Preserve hero shader invariants

On every modified page, the hero shader canvas must remain:

- `id="hero-shader-canvas"`

Do not change its DOM, its scripts, or the surrounding hero section structure.

## Required deliverables

1. Build output committed to stable filenames:

   - `assets/js/pricing-widget.js`
   - `assets/css/pricing-widget.css`

2. HTML changes for every target page:

   - Replace pricing placeholder inside `<section id="pricing">` with two mount containers:
     - `.ss-pricing[data-ss-pricing-page="<page>"][data-ss-pricing-section="1"]`
     - `.ss-pricing[data-ss-pricing-page="<page>"][data-ss-pricing-section="2"]`
   - Add:
     - one CSS `<link>` for `pricing-widget.css`
     - one JS `<script>` for `pricing-widget.js`
   - Use correct relative paths:
     - root pages: `assets/...`
     - niche pages: `../assets/...`

3. Correct behavior:

   - Section 1:
     - toggle exists with labels “Monthly” and “Setup”
     - toggling switches between Monthly Retainer and Setup Fee values from `PRICING_COPY_MAP.md`
   - Section 2:
     - toggle does not exist
     - cards show group summary copy (group label, one-liner, plan list)

4. Validation passes:

   - `node scripts/validate-services-page.js --strict`
   - `node scripts/validate-niche-pages.js --strict`
   - `node scripts/validate-pricing-copy-map.js`
   - `node scripts/validate-pricing-mounts.js`

## Execution rules

Follow `ExecPlan.md` gates, in order, and do not skip validation.

Use an evaluation flywheel:

- make a small change
- run relevant validator(s)
- fix any issues
- proceed

If you hit a stop condition in `ExecPlan.md`, stop and report with exact file + reason.

## Required reading order

Read these files before editing:

1. `ExecPlan.md`
2. `AGENTS.md`
3. `codex/PRICING_WIDGET_SPEC.md`
4. `codex/PRICING_COPY_MAP_SPEC.md`
5. `codex/PRICING_INTEGRATION_SPEC.md`
6. `PRICING_COPY_MAP.md`
7. `pricing_code_prompt.md`
8. `Embed_React_Guide.md`

## Implementation guardrails

- Do not modify `PRICING_COPY_MAP.md`.
- Do not add React deps to the root project.
- Put all widget source + deps in a new isolated folder (recommended `pricing-widget/`).
- Ensure widget CSS is scoped so it cannot impact `.container`, body styles, or other site elements outside `.ss-pricing`.

## Completion output

When finished, summarize:

- Which files changed
- Which commands were run
- Any manual checks performed
- Any deviations (should be none)
