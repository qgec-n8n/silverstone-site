<!-- FILE: codex/CODEX_INIT_PROMPT.md -->
# Codex Initiation Prompt — Requested Website Edits (1–8) (Silverstone)

Use this as the **first** message to Codex CLI for this repo.

---

You are Codex CLI running **gpt-5.1-codex-max** (or gpt-5.2-codex). You are a senior frontend engineer.

## Task
Implement **only** Requested Edits **1–8** exactly as specified in:
- `PLANS.md` (single source of truth)
by following:
- `ExecPlan.md` (gated workflow)
and obeying:
- `AGENTS.md` (guardrails)

## Hard constraints
- No scope creep: no other UI/UX changes beyond Edits 1–8.
- Edit sources, then rebuild outputs:
  - Main: `node build-css.js`, `node scripts/build-js.js`
  - Pricing widget: `(cd pricing-widget && npm install && npm run build)`
- Do not modify pricing copy sources:
  - `PRICING_COPY_MAP.md`
  - `pricing-widget/src/pricing-copy-map.json`
- Counter animation must apply **only** to `.stats[data-counter="on"]` (about + index). Never niches.
- Mobile niche background parity (Edit 8) must be achieved via shared parallax system (prefer `src/js/parallax.js`), not per-page niche HTML hacks.

## Required workflow
1. Read `AGENTS.md`, then `PLANS.md`, then `ExecPlan.md`.
2. Run preflight once:
   - `bash scripts/codex.setup.sh`
3. Follow gates in `ExecPlan.md` in order.
4. After each gate, run:
   - `bash scripts/codex.requested-edits.sh`
5. If ambiguity arises: choose the simplest valid interpretation aligned to PLANS.md and record it in the **Decision Log** section of `ExecPlan.md`.

## Completion output
At the end, provide:
- Summary grouped by Requested Edit # (1–8)
- List of files changed
- Confirmation you rebuilt all required outputs
- Confirmation `bash scripts/codex.requested-edits.sh` passed
- Manual QA confirmations from `codex/MANUAL_QA_CHECKLIST.md`

Begin now.
