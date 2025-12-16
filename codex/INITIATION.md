<!-- FILE: codex/INITIATION.md -->

# Codex Initiation (React Pricing Embed)

## Run location
Run Codex from the repository root so it automatically loads:
- `AGENTS.md`
- `ExecPlan.md`
- `PLANS.md`

## One-time setup per environment
Run:
- `bash scripts/codex.setup.sh`

## During work (fast checks)
Run:
- `bash scripts/codex.maintenance.sh`

## Session rules to paste into Codex at start
- Follow `ExecPlan.md` gate-by-gate; do not skip gates.
- Use `PRICING_COPY_MAP.md` as the only source of truth for pricing copy and values.
- Preserve hero shader invariants (`#hero-shader-canvas`, `.hero.title-band`).
- Replace only the pricing placeholder regions in target HTML files.
- Prefer Shadow DOM to prevent CSS leakage.
- Run strict validators before finishing.

## Critical troubleshooting rule (encrypted_content verification errors)
If you see an error like:
- `invalid_encrypted_content` / “The encrypted content gAAA... could not be verified.”

Do NOT keep retrying “continue” in the same thread. Instead:
1) Exit Codex completely.
2) Start a NEW Codex thread in the repo (do not resume the old one).
3) If it still happens quickly, run: `bash scripts/codex.reset-session.sh`
4) Relaunch using the fallback profile:
   - `codex --profile fallback_gpt51`

This failure is session/thread state related and is not fixed by changing repo code mid-thread.

## Required commands before finishing
- `npm run build:css`
- `npm run build:js`
- `node scripts/build-pricing-widget.js`
- `node scripts/validate-pricing-copy-map.js --strict`
- `node scripts/validate-pricing-embed-markup.js --strict`
- `bash scripts/codex.maintenance.sh`
