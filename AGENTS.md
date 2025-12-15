<!-- FILE: AGENTS.md -->

# Silverstone Site — Codex Operating Guide

## Read first
You must read and follow:
- `ExecPlan.md` (source of truth)
- `PLANS.md` (phase gates + verification discipline)
- `codex/INITIATION.md` (how to start a session)
- `codex/MAINTENANCE.md` (ongoing upkeep)

## CRITICAL LOCKED UI CONTRACTS (DO NOT GET WRONG)
These are repeated here because they are frequently implemented incorrectly.

Mobile menu:
- Panel directions are locked (do not invert):
  - Panel 1 enters RIGHT → LEFT
  - Panel 1 → Panel 2: Panel 1 exits RIGHT, Panel 2 enters LEFT → RIGHT
  - Panel 2 → Panel 1: Panel 1 enters RIGHT → LEFT, Panel 2 exits LEFT
  - Close from Panel 1: Panel 1 exits LEFT → RIGHT; re-enable minimize after 2000ms
- Arrow directions are locked:
  - Services shows left arrow before text: `← Services`
  - Back shows right arrow after text: `Back →`
- Back button location is locked:
  - Back → appears top-right on both panels
  - No X button on either panel
- Timings are locked and must be extremely slow:
  - Panel slide >= 1800ms
  - Stagger per item >= 500ms
  - Reveal duration >= 600ms
- Button text alignment is locked:
  - Panel 1 pill text must be centered inside each button
  - Services font size must match other buttons exactly
- Overlay opacity is locked:
  - Overlay must be much lighter across all pages (slight dark overlay only)
  - Use `--body-section-overlay-opacity` (single global value; no mobile override)

If any of the above are wrong, the rollout is not complete.

## Nonnegotiables (scope + UX)
- Do EXACTLY the items listed in `ExecPlan.md` — no extra refactors, no “nice-to-haves”.
- Preserve typography and visual language (font family/weights/colors/sizes).
- Desktop must not regress while fixing mobile.
- Remove ALL scroll-triggered animations/effects EXCEPT:
  - body-section parallax effect
  - minimizing menu banner behavior
- NEVER ship any grey/silver shader variant.

## Protected components (do not change unless explicitly required)
These must remain intact:
- Minimizing menu banner
- Cookie consent banner
- Magnetic buttons

If any protected component must be touched to satisfy a requirement:
- Make the smallest possible isolated change
- Explain why it was required
- Add verification proving nothing else changed

## Implementation constraints
- Prefer editing `src/` and rebuilding into `assets/`.
- Avoid editing generated bundles directly unless rebuild cannot reproduce.
- Avoid new dependencies unless unavoidable.

## Required verification tools
You must run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/assert-ui-spec.js --strict`

## Final response requirements
Include:
- Change log with file paths
- Commands run + pass/fail
- Requirements 1–13 PASS/FAIL
- CRITICAL contract PASS/FAIL (directions, arrows, timing, overlay)
- Rollback guidance
