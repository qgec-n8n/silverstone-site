<!-- FILE: PLANS.md -->

# Execution Playbook

This file defines how Codex must plan, execute, verify, and report changes in this repository.
For the current workstream, `ExecPlan.md` is the task-specific plan; this file is the reusable runbook
and quality gate.

## Operating principles
1) Scope discipline
- Only implement what the user explicitly requested in `ExecPlan.md`.
- No unrelated refactors, no “cleanup”, no stylistic rewrites.

2) Preserve the design system
- Typography, spacing rhythm, and overall visual language must stay consistent.
- Any required visual change must be narrowly targeted to the spec.

3) Mobile vs desktop conditionality
- Mobile-only requirements must not alter desktop behavior unless explicitly required.
- Verify mobile and desktop separately (different acceptance criteria).

4) Protect critical UX components
- Minimizing menu banner, cookie consent banner, magnetic buttons are protected.
- If a protected component must be touched to satisfy a requirement, isolate the smallest change and explain why.

5) Batch and verify
- Prefer fewer, coherent edits over repeated micro-edits.
- Every phase ends with deterministic verification before moving on.

## Recommended workflow (phase gates)
Phase 0 — Preflight
- Inventory impacted pages and modules (do not edit yet).
- Identify where each requirement “lives” (HTML vs CSS vs JS; `src/` vs built `assets/`).
- Confirm build/validation commands run.

Gate to proceed:
- You can name the exact files you will touch for each requirement.

Phase 1 — Mobile navigation refinement
- Separate “Tap to expand” behavior from hamburger-triggered off-canvas panels.
- Enforce two-panel drill-down behavior, slow transitions, staggered reveals, and Back button rules.
- Ensure minimizing banner gating behaves per spec (including 2s re-enable delay after closing Panel 1).

Gate to proceed:
- Niche validator passes and menu wiring remains correct.

Phase 2 — Overlay parity + FAQ desktop centering
- Ensure mobile overlay matches desktop intensity (avoid stacked overlays on mobile).
- Center desktop FAQ expand controls while keeping mobile FAQ contained (no overflow).

Gate to proceed:
- Deterministic checks confirm no regressions to background image selection and no FAQ overflow.

Phase 3 — Marquee eager start on mobile
- Ensure single/double marquees render and animate from page load on mobile.
- Keep stability requirements: no resets, no intermittent rendering.

Gate to proceed:
- No re-init loops, no DOM duplication, no intermittent rendering in code paths.

Phase 4 — Rebuild + regression verification
- Rebuild CSS/JS outputs.
- Run repo validations and grep/assert checks.
- Confirm protected components still function.

Gate to finish:
- Requirements 1–13 are marked PASS with evidence.

## Verification library (commands you should use)
Prefer `rg`; fallback to `grep -R` if `rg` is unavailable.

Baseline build/validation:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`

Body background checks:
- Ensure the background asset exists:
  - `ls -al assets/images/body_section_parallax/body-section-background-2025.webp`
- Ensure it is referenced where it will take effect:
  - Search for `body-section-background-2025.webp`
- Ensure no other images in that folder are referenced:
  - Search for `assets/images/body_section_parallax/` and confirm only the 2025 filename is used

No grey/silver shader checks:
- Search code surfaces for forbidden palette keywords:
  - Search for whole words: `gray`, `grey`, `silver` in `src` and `assets`

Scroll-effect removal checks (allowlist mindset):
- Search for scroll reveal/counters/observers in `src/js`:
  - Only allowed: parallax and minimizing menu banner logic
  - Everything else must be removed/disabled

Mobile nav refinement checks (structural/deterministic)
Because animations and interaction are hard to fully assert without a browser, force verification via stable identifiers:
- Require an explicit “indicator expand” path that does NOT open the off-canvas.
- Require an explicit “hamburger open” path that opens Panel 1.
- Require a named 2-second re-enable delay for minimizing behavior after closing Panel 1.

Verification approach:
- Search `src/js/header-nav.js` for:
  - “indicator” handling
  - “hamburger” handling
  - a clearly named 2000ms delay constant for re-enabling minimizing behavior after close

FAQ checks:
- Search `src/css/components/faq.css` and confirm:
  - Desktop-only centering rules exist under desktop breakpoints
  - Mobile rules still prevent overflow/clipping

Marquee eager start checks:
- Search `src/js/marquee.js` for:
  - eager initialization on page load (not scroll/intersection gated)
  - avoidance of lazy-loading behaviors that delay images on mobile
- Confirm `services.html` uses only the double marquee logic and other pages use only single marquee logic.

## Reporting format (required)
Final response must include:
- Change log: what changed, where, and why (file paths)
- Commands run + pass/fail
- Requirements 1–13 checklist with PASS/FAIL and evidence
- Rollback guidance:
  - Preferred: reference commits that can be reverted
  - If no commits: list the exact files changed, grouped by phase
