<!-- FILE: codex/INITIATION.md -->
# How to run Codex on this repo (UI/UX Bugfixes A–H)

This repo ships a Codex-ready instruction package for implementing UI/UX fixes A–H.

## What Codex should read (in order)

1. `AGENTS.md` — guardrails and repo map
2. `PLANS.md` — full specification for A–H
3. `ExecPlan.md` — step-by-step gated workflow
4. `codex/CODEX_INIT_PROMPT.md` — the initiation prompt you paste into Codex CLI

## Local environment preflight (human)

- Ensure Node.js is installed (the repo uses Node scripts for building CSS/JS).
- From repo root:
  - `npm install`
  - `bash scripts/codex.setup.sh`

## Starting Codex (human)

1. Start Codex CLI in the repo root directory.
2. Select a supported model:
   - `gpt-5.1-codex-max` (recommended for long-horizon exec plans)
   - `gpt-5.2-codex` (also allowed)
3. Paste the full contents of `codex/CODEX_INIT_PROMPT.md` as the first message.
4. Ensure Codex follows `ExecPlan.md` gates and runs `bash scripts/codex.maintenance.sh` during and after changes.

## After Codex finishes (human)

- Confirm the build outputs were regenerated:
  - `assets/css/styles.css`
  - `assets/js/app.js`
- Open the site locally and verify the manual checks described in ExecPlan.md:
  - desktop Services dropdown hover behavior
  - mobile menu panel timing & typography
  - mobile marquees preload behavior
  - mobile hero CTA cutoff fix
  - niche mobile background parity + overlay opacity change
