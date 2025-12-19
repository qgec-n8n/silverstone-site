<!-- FILE: AGENTS.md -->
# Agent Guidance (Codex CLI / coding agents)

## Prime directive
Implement **exactly and only** what the active ExecPlan + Spec require — no scope creep.

## Read order (required)
1) `AGENTS.md` (this file)
2) `PLANS.md`
3) `ExecPlans.md`
4) `ExecPlan.md` (active)
5) `codex/REQUESTED_EDITS_SPEC.md` (single source of truth for this request)

## Default scope for the current request
You may edit only what is necessary to satisfy `codex/REQUESTED_EDITS_SPEC.md` and to keep build artifacts in sync.

Allowed (expected) edits:
- Pages:
  - `index.html`
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
  - `niches/*.html`
- Main source code:
  - `src/css/**/*.css`
  - `src/js/stats.js`
- Pricing widget source:
  - `pricing-widget/src/**/*`
- Build outputs (must be regenerated if sources change):
  - `assets/css/styles.css`
  - `assets/js/app.js`
  - `assets/css/pricing-widget.css`
  - `assets/js/pricing-widget.js`
- Tooling and guidance:
  - `scripts/codex.requested-edits.sh`
  - `scripts/validate-requested-edits.js`
  - `scripts/validate-pricing-ui-tuning.js`
  - `ExecPlan.md`, `ExecPlans.md`, `PLANS.md`, `AGENTS.md`
  - `codex/*.md`
  - `.codex/config.toml`

Do NOT edit (unless the Spec explicitly instructs you to):
- `PRICING_COPY_MAP.md`
- `pricing-widget/src/pricing-copy-map.json`

## Implementation rules
- No refactors. No reorganizing files. No formatting churn.
- Don’t change copy except where the Spec explicitly demands it.
- Don’t introduce `!important` unless the Spec explicitly requires it.
- Prefer page-scoped selectors and variable overrides over global styling changes.
- If you must resolve ambiguity, pick the simplest solution that satisfies the Spec and record it in `ExecPlan.md` (Decision Log).

## Required validation loop
After each gate in `ExecPlan.md`:
1) Rebuild affected bundles.
2) Run: `bash scripts/codex.requested-edits.sh`
3) Fix only failing checks, then rerun.

## Definition of done
Done means ALL of the following:
- `bash scripts/codex.requested-edits.sh` passes.
- Manual QA is completed (`codex/MANUAL_QA_CHECKLIST.md`).
- Diffs are limited to the allowed scope above.
