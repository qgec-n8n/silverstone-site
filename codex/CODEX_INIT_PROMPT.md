<!-- FILE: codex/CODEX_INIT_PROMPT.md -->
# Codex Initiation Prompt — Requested Edits 1–7

You are working inside this repository. Implement Requested Edits 1–7 exactly as defined in `codex/REQUESTED_EDITS_SPEC.md`.

## Non-negotiable rules

- Read and follow: `AGENTS.md`, `PLANS.md`, `ExecPlan.md`, `codex/REQUESTED_EDITS_SPEC.md`.
- Stay within the allowed edit surfaces in `AGENTS.md`.
- Add/keep the required SS_* marker comments exactly as written in the spec.
- Do not hand-edit generated files under `assets/`. Rebuild via repo scripts only.
- Keep diffs minimal; do not reformat unrelated HTML/CSS.

## Execution plan

1) Baseline
- Run: `bash scripts/codex.requested-edits.sh`
- Update `ExecPlan.md` Progress with baseline status and any early discoveries.

2) Gate 1 — Pricing widget polish (Requested Edits 1–3)
- Implement edits 1–3 in:
  - `pricing-widget/src/pricing-widget.css`
  - `pricing-widget/src/PricingWidget.jsx`
- Rebuild widget: `(cd pricing-widget && npm run build)`
- Run: `bash scripts/codex.requested-edits.sh`
- Update `ExecPlan.md` Progress + any discoveries/decisions.

3) Gate 2 — Home page “What we automate” tweaks (Requested Edits 4–6)
- Implement edits 4–6 in:
  - `index.html`
  - `src/css/pages/home.css`
- Rebuild site CSS: `node build-css.js`
- Run: `bash scripts/codex.requested-edits.sh`
- Update `ExecPlan.md` Progress.

4) Gate 3 — Services mobile bug fix (Requested Edit 7)
- Fix root cause in `src/css/base/typography.css` by removing/disabling the mobile “Services mobile cards” block so services matches the estate-agents pattern (image outside card; card is text-only).
- Ensure mobile headings are blue (not white).
- Rebuild site CSS: `node build-css.js`
- Run: `bash scripts/codex.requested-edits.sh`
- Manually verify `/services.html` at 390×844 and 375×667 and compare to `/niches/estate-agents.html`.

5) Finalize
- Run `bash scripts/codex.requested-edits.sh` one more time.
- Walk `codex/MANUAL_QA_CHECKLIST.md`.
- Provide a concise summary: what changed, files touched, and how it was verified.
