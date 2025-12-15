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
- Confirm `scripts/assert-ui-spec.js` runs (it may fail before fixes).

Gate:
- You can name the files you will touch per requirement area.

Phase 1 — Navigation correctness + timing tuning + Services parity
- Separate “tap to expand” behavior from hamburger behavior.
- Fix panel directions (never invert).
- Fix arrow directions (Services left arrow; Back right arrow).
- Replace X with Back button top-right on both panels.
- Tune timing to slow-but-not-overly-slow minimums:
  - slide >= 1200ms; stagger >= 250ms; reveal >= 400ms
- Ensure Services font/size parity:
  - Desktop nav Services matches other items
  - Mobile Panel 1 Services matches other pills and is not bold
- Ensure SPEC markers are placed exactly as required in ExecPlan.

Gate:
- `node scripts/assert-ui-spec.js --strict` passes
- `node scripts/validate-niche-pages.js --strict` passes

Phase 2 — Overlay opacity reduction
- Implement global `--body-section-overlay-opacity` with lighter overlay across all pages.
- Ensure no mobile override darkens it.
- Add required SPEC marker(s) per ExecPlan.

Gate:
- `node scripts/assert-ui-spec.js --strict` passes

Phase 3 — Desktop FAQ centering + page polish (NEW points 1–4, 8)
- Desktop: center FAQ expand controls again.
- Mobile: preserve no overflow/cutoff.
- Index:
  - “What small businesses usually get back” KPI titles blue; footnote grey
  - “Streamline. Optimize. Succeed.” cards centered as a stack on mobile
- About:
  - “Our Values” cards centered as a stack on mobile
  - “What Drives Us” images all visible on mobile (no neon lines)
- Services:
  - CTA bottom KPI titles blue
  - KPI body text left-aligned; titles remain centered
- Add required SPEC markers per ExecPlan.

Gate:
- `node scripts/assert-ui-spec.js --strict` passes

Phase 4 — Marquee touch fix (NEW point 9)
- Diagnose and fix why marquee requires touch to fully display.
- Ensure marquee images are visible and moving without any interaction.
- Ensure images are not lazy-loaded and init is not gated behind touch/scroll.
- Add required SPEC marker per ExecPlan.

Gate:
- `node scripts/assert-ui-spec.js --strict` passes

Phase 5 — Rebuild + regression verification
Run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/assert-ui-spec.js --strict`

## Deterministic verification standard
No browser tests exist, so:
- Encode correctness into explicit constants/variables and required SPEC markers.
- `scripts/assert-ui-spec.js` must pass in --strict mode.

## Final report format (required)
- Change log (file paths + why)
- Commands run + pass/fail
- PASS/FAIL checklist for:
  - panel direction
  - arrows
  - back button placement
  - timing
  - overlay opacity
  - new points 1–9
- Rollback guidance (commits or file groups)
