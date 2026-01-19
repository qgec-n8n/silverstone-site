<!-- FILE: codex/prompts/CODEX_INITIATION_PROMPT_SCROLL_WHEEL.md -->
# Codex initiation prompt — restore page mousewheel scrolling (preserve pricing internal scroll)

Paste the content below into a fresh Codex CLI session.

---

You are Codex (GPT-5.2). Your task: restore normal mouse wheel scrolling at the **page level** across this site while preserving the pricing widget’s internal scroll behavior.

You MUST use the internet (web search) during this work to validate uncertain browser/event semantics and debugging techniques.

## Non-negotiable constraints

- Restore mouse wheel scrolling for page-level scroll on:
  - index.html
  - about.html
  - services.html
  - book.html
  - contact.html
  - niches/*.html

- Preserve the pricing feature’s internal scroll behavior on:
  - index.html (pricing section)
  - services.html (pricing section)

- No visual differences, no other functional changes, no UX “improvements,” and no refactors unrelated to restoring page scroll.

- If any instruction conflicts with “no visual/functional changes” or “pricing internal scroll unchanged,” prioritize:
  1) pricing internal scroll unchanged
  2) no visual/functional changes
  3) restoring page wheel scroll

- Delete any code that blocks the fix ONLY if it is proven to be the blocker.

## Required workflow (do not skip)

1) Read repo guidance files (before editing any code):
   - AGENTS.md
   - PLANS.md
   - ExecPlans.md
   - codex/execplans/2026-01-19_restore-wheel-scroll.md
   - codex/checklists/scroll-wheel-validation.md
   - codex/snippets/wheel-debug-snippet.md

2) Follow the active ExecPlan exactly.
   - Treat it as a living doc: update its Progress/Decision/Discoveries sections as you go.

3) Reproduce the issue locally (mandatory).
   - Use `bash scripts/codex.serve.sh 4173`
   - Confirm the bug on every required page (at least one niche page).
   - Capture evidence (wheel logs, defaultPrevented state, computed overflow, etc).

4) Diagnose before patching (mandatory).
   - Run:
     - `bash scripts/codex.audit.scroll-lock.sh`
     - `bash scripts/codex.inventory.pages.sh`
   - Use DevTools instrumentation:
     - Capture-phase wheel logging
     - preventDefault tracing
     - confirm scroll container and computed overflow

5) Prove the single primary root cause (mandatory).
   - Produce a root-cause statement that points to:
     - the exact file(s)/function(s) or CSS rule(s),
     - why it blocks wheel scroll,
     - why it affects all pages listed.
   - If multiple contributors exist, name primary vs secondary.

6) Implement the smallest safe fix.
   - Prefer changing build sources under `src/` and rebuilding bundles:
     - `npm run build:css`
     - `npm run build:js`
   - Avoid touching pricing widget files unless you can prove they are the root cause.
   - No new dependencies unless absolutely required for validation; if you add any, justify in the ExecPlan.

7) Validate thoroughly and prove non-regression.
   - Run:
     - `bash scripts/codex.validate.scroll.sh`
   - Manually follow:
     - `codex/checklists/scroll-wheel-validation.md`
   - Explicitly re-test pricing internal scroll on index/services.
   - Spot-check overlays (nav/lightbox/services overlay) for correct scroll lock/unlock behavior.

8) Deliver a final report (in your final message).
   - Root cause (with evidence)
   - Fix summary (minimal diff rationale)
   - Files changed (and why each was necessary)
   - Validation performed (per-page + pricing scroll)
   - Confirmation: no UI/UX changes beyond restored page wheel scroll

## Output discipline

- Do not “improve” formatting, spacing, copy, or styles unless required to fix scroll.
- Keep commit history clean with small commits.
- If you cannot prove root cause, stop and extend diagnosis; do not guess.

Begin now by reading the required repo guidance files, then start Milestone 0 from the ExecPlan.
