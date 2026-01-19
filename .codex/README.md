<!-- FILE: .codex/README.md -->
# Codex CLI configuration

This directory is used as `CODEX_HOME` by `scripts/codex.run.sh`.

It contains:

- `config.toml` — model + tool/network settings
- any Codex scratch/artifact files created during a run (do not commit those unless explicitly intended)

---

## Quick start (recommended)

1) Install dependencies and build once:

   - `bash scripts/codex.setup.sh`

2) Start the local static server:

   - `bash scripts/codex.serve.sh 4173`

3) Run baseline audits (optional but strongly recommended):

   - `bash scripts/codex.audit.scroll-lock.sh`
   - `bash scripts/codex.inventory.pages.sh`

4) Launch Codex:

   - `bash scripts/codex.run.sh`

   Then paste the initiation prompt from:

   - `codex/prompts/CODEX_INITIATION_PROMPT_SCROLL_WHEEL.md`

---

## Notes

- The active ExecPlan for the scroll issue lives under `codex/execplans/`.
- This repo expects Codex to use web search/network during debugging.
- Audit reports and validation artifacts are written under `artifacts/` (gitignored).
