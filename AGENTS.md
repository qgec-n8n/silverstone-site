<!-- FILE: AGENTS.md -->
# Codex Agent Guardrails (Silverstone Site)

These guardrails exist to keep Codex CLI precise for **Requested Edits (1–5)**.

## Source of truth (must follow)

1. `codex/REQUESTED_EDITS_SPEC.md`
2. `ExecPlan.md`
3. `PLANS.md`

If anything conflicts, the ordering above wins.

## Scope rules (hard constraints)

- Implement **only** Requested Edits (1–5).
- Do **not** change site copy anywhere unless the spec explicitly instructs it.
- Do **not** change layout or functionality unless the spec explicitly instructs it.
- Prefer minimal diffs and established patterns over “better” rewrites.

## Allowed edit surfaces (website code)

Only edit these files for the UI implementation work:

- Pages:
  - `index.html`
  - `about.html`
  - `services.html`
  - `niches/*.html` (only if required by the spec; most niche changes should be CSS-level)

- Shared CSS source (must rebuild into `assets/css/styles.css`):
  - `src/css/components/stats.css`
  - `src/css/pages/services.css`
  - `src/css/pages/estate-agents.css` (only if needed to remove conflicting stat icon styling)
  - `src/css/components/cards.css` (only if absolutely required for the services mobile fix)

- Pricing widget source (must rebuild into `assets/css/pricing-widget.css` and `assets/js/pricing-widget.js`):
  - `pricing-widget/src/pricing-widget.css`
  - `pricing-widget/src/PricingWidget.jsx`

- Built outputs (generated; must stay in sync with sources):
  - `assets/css/styles.css`
  - `assets/css/pricing-widget.css`
  - `assets/js/pricing-widget.js`

## Allowed edit surfaces (tooling/docs)

- `ExecPlan.md`, `ExecPlans.md`, `PLANS.md`
- `codex/REQUESTED_EDITS_SPEC.md`, `codex/MANUAL_QA_CHECKLIST.md`
- `scripts/codex.requested-edits.sh`
- `scripts/validate-requested-edits.js`
- `scripts/validate-pricing-ui-tuning.js`

## Explicit non-goals / forbidden edits

- Do not edit:
  - `PRICING_COPY_MAP.md`
  - pricing amounts, plan names, or included items copy (these are functionality/copy)
- Do not introduce new frameworks, build systems, or refactor existing architecture.
- Avoid `!important` unless it is the only way to meet a requirement without changing layout.

## Build + verification requirements

- After each gate in `ExecPlan.md`, run:
  - `bash scripts/codex.requested-edits.sh`
- Do not mark work “done” until all validators pass and `codex/MANUAL_QA_CHECKLIST.md` is satisfied.

## Search + implementation habits (to reduce drift)

- Search before editing (use grep/rg) to find canonical definitions and avoid duplicates.
- When adding new UI rules, prefer:
  - CSS variables and scoped selectors
  - page scoping via existing body classes and `data-ss-pricing-page` attributes
- Add/keep the required `SS_*_SPEC:` marker comments listed in the spec.
