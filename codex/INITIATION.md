<!-- FILE: codex/INITIATION.md -->

# Codex Initiation Instructions (Silverstone Site)

## Start here
Run Codex from the repository root so it loads `AGENTS.md`.

## One-time setup per environment
Run:
- `bash scripts/codex.setup.sh`

Then sanity check:
- `bash scripts/codex.maintenance.sh`

## Required session settings
- Model: `gpt-5.1-codex-max`
- Reasoning effort: high
- Approval policy: on-request (recommended)

## Kickoff prompt guidance
When starting a Codex task, instruct it:
- to read `ExecPlan.md` and `PLANS.md`
- to implement the full spec end-to-end without stopping early
- to run verification commands and report PASS/FAIL

Critical instruction to include:
- “Do not invert mobile panel directions. Follow the direction table in ExecPlan.md exactly.”
- “Set motion timings to extremely slow minimums (>= 1800ms slide; >= 500ms stagger).”

## Required commands before finishing
Codex must run at the end:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/assert-ui-spec.js --strict`
