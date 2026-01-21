<!-- FILE: .codex/README.md -->
# Repo-local Codex configuration

This repo is set up so Codex can run with a **project-local CODEX_HOME** (stored inside this repo under `.codex/`).

## Why this exists

- Keep prompts, ExecPlans, and checklists version-controlled with the repo.
- Keep Codex state/history close to the work for easier auditing and reproducibility.
- Ensure consistent behavior across contributors.

## How to use

Preferred entrypoint:

- Run `bash scripts/codex.run.sh` from the repo root.

That script sets `CODEX_HOME` to the repo’s `.codex/` directory so Codex reads:

- `.codex/config.toml` (project configuration)
- `codex/execplans/` (execution plans)
- `codex/checklists/` (verification checklists)
- `codex/snippets/` (debug snippets)

## Trust & safety

- If Codex prompts you to trust the workspace, choose trust so it can read and edit files.
- If you want to avoid repeated prompts, add a `[projects."..."]` trust entry in `.codex/config.toml` using an absolute path.

## Internet access

This repo’s workflow expects Codex to use web search to read online documentation referenced in the initiation prompt.

If web search does not work:

- Confirm you are using the repo config (`bash scripts/codex.run.sh`).
- Confirm `.codex/config.toml` enables web search and allows network access in workspace-write mode.

## Where to put inputs for an ExecPlan

Recommended convention (create if missing):

- `artifacts/input/` for user-provided logs, screenshots, etc.
- `artifacts/output/` for before/after console captures, screenshots, and notes generated during the fix.

Keep artifacts small and text-first (logs, diffs, short notes).
