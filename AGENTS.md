<!-- FILE: AGENTS.md -->
# Silverstone Static Site — Codex Agent Guardrails (Requested Edits 1–8)

You are running as Codex CLI in this repo. Your job is to implement **only** the product edits listed in **PLANS.md** (Requested Edits 1–8) by following **ExecPlan.md**.

## Non-negotiables (scope control)
1. **No scope creep.** Implement only Requested Edits 1–8. No extra UI changes, no content rewrites, no “improvements”.
2. **Minimum diffs.** Change the smallest surface area that satisfies each requirement.
3. **Source-first builds.**
   - Main site: edit `src/css/**`, `src/js/**`, and specific `.html` pages; then rebuild:
     - `assets/css/styles.css` via `node build-css.js`
     - `assets/js/app.js` via `node scripts/build-js.js`
   - Pricing widget: edit `pricing-widget/src/**`; then rebuild:
     - `assets/css/pricing-widget.css`
     - `assets/js/pricing-widget.js`
4. **Hard file targeting rules**
   - Counter animation must apply **only** to stats sections explicitly marked `data-counter="on"` (about.html + index.html only).
   - **Never** enable counters on `niches/*.html` (they must remain `data-counter="off"`).
5. **Do not change pricing copy.**
   - Do not edit `PRICING_COPY_MAP.md`
   - Do not edit `pricing-widget/src/pricing-copy-map.json`
6. **Do not touch niche HTML files** unless a plan step explicitly requires it (it does not for this task).
7. **Niche mobile background parity (Edit 8)**
   - Fix must be achieved via shared parallax/background system (prefer `src/js/parallax.js`), not by per-page hacks in each niche file.
   - Goal: niches pages look identical to root pages for the parallax background image + overlay on mobile.

## Allowed files to change (primary)
- Content/markup:
  - `about.html`
  - `index.html`
- Main site behavior:
  - `src/js/stats.js` (stats counter animation gating + behavior)
  - `src/js/parallax.js` (mobile parallax background image URL must work from /niches/* pages)
- Marquee speed:
  - `src/css/features/marquee.css`
- Pricing widget behavior/layout:
  - `pricing-widget/src/PricingWidget.jsx` (price scroll animation on toggle)
  - `pricing-widget/src/embed.jsx` (index section2 height matching, scoped)
  - `pricing-widget/src/pricing-widget.css` (index section2 internal scroll + height match styling, scoped; pricing price scroll animation CSS)
- Build outputs (must be regenerated after source changes):
  - `assets/js/app.js`
  - `assets/css/styles.css`
  - `assets/js/pricing-widget.js`
  - `assets/css/pricing-widget.css`
- Control-plane tooling (added/edited by this instruction package):
  - `scripts/validate-requested-edits.js`
  - `scripts/codex.requested-edits.sh`
  - `.codex/config.toml`
  - `codex/*` docs
  - `ExecPlans.md`, `ExecPlan.md`, `PLANS.md`, `AGENTS.md`

## Forbidden changes
- Any edits to `niches/*.html` (except if a validator shows a pre-existing violation of `data-counter="off"`—then fix only that attribute and nothing else).
- Any “redesign” CSS, new colors, new components unrelated to the specified tasks.
- Any changes to pricing copy sources (`PRICING_COPY_MAP.md`, `pricing-widget/src/pricing-copy-map.json`).
- Any changes to marquee image lists (this task is speed only, not image set).
- Any changes to the parallax image asset itself; only fix visibility/parity on mobile.

## Required validation loop (must run repeatedly)
During the work and at the end, run:

- `bash scripts/codex.requested-edits.sh`

This script rebuilds everything needed and enforces all acceptance checks for Requested Edits 1–8.

## Output expectations at the end of the Codex run
- Summary grouped by Requested Edit # (1–8)
- List of files changed
- Confirmation that all builds were regenerated
- Confirmation `bash scripts/codex.requested-edits.sh` passed
- Manual QA confirmations from `codex/MANUAL_QA_CHECKLIST.md`
