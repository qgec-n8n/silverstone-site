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
- Operate gate-by-gate per `PLANS.md`
- Do not stop early; implement full spec end-to-end
- Run verification commands and report PASS/FAIL

## Absolute constraints to repeat in the Codex session prompt
- Only replace pricing placeholder regions in the target HTML files.
- Do not add new script tags to HTML pages.
- Use Shadow DOM to prevent styling leakage.
- Prices and product names must come from `Silverstone_Service_Master_List.csv`.

## Required commands before finishing
Codex must run at the end:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-pricing-embeds.js --strict`
- `bash scripts/codex.maintenance.sh`
