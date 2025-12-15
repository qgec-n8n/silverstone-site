<!-- FILE: PLANS.md -->

# Execution Playbook

This file defines how Codex must plan, execute, verify, and report changes in this repository.
`ExecPlan.md` is the task-specific spec. Follow this process strictly.

## Operating principles
1) Scope discipline
- Only implement what is explicitly required by `ExecPlan.md`.
- No unrelated refactors or cleanup.

2) Preserve design system
- Typography and visual language must remain consistent.
- Only change what the spec requires.

3) Mobile vs desktop conditionality
- Mobile-only changes must not regress desktop.
- Verify mobile and desktop separately.

4) Protect critical UX components
- Minimizing menu banner, cookie consent banner, magnetic buttons are protected.
- If touched, isolate changes and justify.

5) Gate-driven rollout
- Do not proceed to the next phase until the current phase’s verification gates pass.

## Phase gates (must follow)
Phase 0 — Preflight
- Run setup/maintenance scripts.
- Confirm builds run.
- Map exact files you will edit.

Gate:
- You can name the files you will touch per requirement.

Phase 1 — Mobile nav correctness (highest priority)
- Separate “tap to expand” behavior from hamburger behavior.
- Fix panel direction contract (do not invert).
- Fix arrow contract (Services left arrow; Back right arrow).
- Set extremely slow timing contract (panel slide + stagger + reveal).
- Replace X control with Back button in top-right on both panels.

Gate:
- `node scripts/assert-ui-spec.js --strict` passes
- `node scripts/validate-niche-pages.js --strict` passes

Phase 2 — Overlay opacity reduction
- Implement global overlay opacity variable, lighten overlay everywhere.

Gate:
- `node scripts/assert-ui-spec.js --strict` passes

Phase 3 — Desktop FAQ centering
- Re-center on desktop; keep mobile contained.

Gate:
- No mobile overflow reintroduced.

Phase 4 — Marquee eager start on mobile
- Ensure images are visible and moving from page load.
- Remove gating that delays init or hides images.

Gate:
- `node scripts/assert-ui-spec.js --strict` passes

Phase 5 — Rebuild + regression verification
Run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/assert-ui-spec.js --strict`

## Deterministic verification standard
This repo has no browser-based automated tests. Therefore:
- Add deterministic static checks where possible (see `scripts/assert-ui-spec.js`).
- If a behavior is interactive, encode correctness via explicit constants/variables/labels that the script can verify.

## Final report format (required)
- Change log (file paths + why)
- Commands run + pass/fail
- Requirements checklist (1–13) PASS/FAIL
- CRITICAL contract checklist PASS/FAIL:
  - panel direction
  - arrow direction
  - slow timing
  - overlay opacity
- Rollback guidance (commits or file groups)
