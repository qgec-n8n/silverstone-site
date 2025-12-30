<!-- FILE: codex/VERIFICATION_PROTOCOL.md -->
# Verification Protocol (Automated + Manual)

This file defines what “verified” means for Requested Edits 1–7.

## Automated verification (grader)

Primary command:
- `bash scripts/codex.requested-edits.sh`

What it does:
- Rebuilds CSS and JS bundles:
  - `npm run build:css`
  - `npm run build:js`
- Runs the grader:
  - `node scripts/assert-ui-spec.js`

The grader enforces:
- Required proof markers exist in the built bundles.
- Required per-page hero shader variants exist in HTML.
- Targeted class hooks exist (index nowrap button; image cover-fill class).
- Key CSS layout constraints for the hero are present (no glass panel; content not centered over midline).

Success criteria:
- The script exits with status 0.

Failure handling (evaluation flywheel loop):
1) Analyze:
- Read the failing assertion and identify which Requested Edit is failing.
2) Measure:
- Re-run the same script after a minimal change to confirm the failure moved.
3) Improve:
- Apply the smallest possible targeted fix.
- Re-run until the failure is eliminated.

## Manual verification (required for visual constraints)

Manual QA is mandatory because:
- “Does not obstruct the shader midline” is a visual constraint.
- “Neon” and “fire orange” are perceptual.

Use:
- `codex/MANUAL_QA_CHECKLIST.md`

Minimum manual scope:
- Desktop + mobile checks for:
  - index.html, about.html, services.html, book.html, contact.html
- At least 2 niche pages (different templates) for:
  - hero layout + subtitle grey rule

Success criteria:
- Checklist completed with notes.
- Any discovered edge cases are fixed and re-verified.

## Evidence capture (required)

Before declaring done:
- Fill the evidence table in `ExecPlan.md`.
- Ensure each edit is supported by:
  - the corresponding proof marker
  - automated grader pass
  - manual QA confirmation where required
