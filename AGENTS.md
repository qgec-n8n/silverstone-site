<!-- FILE: AGENTS.md -->

# Silverstone Site — Codex Operating Guide

## Read first
You must read and follow:
- `ExecPlan.md` (source of truth)
- `PLANS.md` (phase gates + verification discipline)
- `codex/INITIATION.md` (how to start a session)
- `codex/MAINTENANCE.md` (ongoing upkeep)

## CRITICAL LOCKED UI CONTRACTS (DO NOT GET WRONG)

Mobile menu direction contract (never invert):
- Panel 1 enters RIGHT → LEFT
- Panel 1 → Panel 2: Panel 1 exits RIGHT; Panel 2 enters LEFT → RIGHT
- Panel 2 → Panel 1: Panel 1 enters RIGHT → LEFT; Panel 2 exits LEFT
- Close from Panel 1: Panel 1 exits LEFT → RIGHT; re-enable minimize after 2000ms

Arrow contract (never invert):
- Services must be `← Services` (left arrow BEFORE the word)
- Back must be `Back →` (right arrow AFTER the word)

Back location contract:
- No X control on either panel
- Back button exists top-right on BOTH panels
- Panel 2 has only one Back button, same location as Panel 1

Timing contract (slow but not overly slow; do not go faster):
- Panel slide >= 1200ms
- Item stagger >= 250ms per item
- Item reveal duration >= 400ms
- Reveals begin only after slide completes

Services parity contract:
- Desktop nav “Services” must match Home/About/Book/Contact font + size exactly
- Mobile Panel 1 “Services” must match other pills and must not be bold

Overlay contract:
- Background overlay must be a slight dark overlay, much lighter than current
- Implement via a single `--body-section-overlay-opacity` global variable, no mobile override

If any of the above are wrong, the rollout is not complete.

## Nonnegotiables (scope + UX)
- Do EXACTLY the items listed in `ExecPlan.md` — no extra refactors, no “nice-to-haves”.
- Preserve typography and visual language.
- Desktop must not regress while fixing mobile.
- Remove ALL scroll-triggered effects EXCEPT:
  - body-section parallax effect
  - minimizing menu banner behavior
- NEVER ship any grey/silver shader variant.

## Protected components (do not change unless explicitly required)
- Minimizing menu banner
- Cookie consent banner
- Magnetic buttons

If touched:
- Smallest possible isolated change
- Justify why
- Add verification proving no regressions

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
- PASS/FAIL checklist for:
  - panel direction
  - arrows
  - timing
  - overlay
  - new points 1–9
- Rollback guidance
