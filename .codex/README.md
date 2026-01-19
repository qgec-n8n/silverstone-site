<!-- FILE: .codex/README.md -->
# Repo-local Codex configuration

This repository ships a repo-scoped Codex configuration in `.codex/`.

`scripts/codex.run.sh` sets `CODEX_HOME` to `.codex/` so Codex uses:
- `.codex/config.toml` for model/sandbox/features
- `.codex/` for any Codex-local state created during a session

---

## Intended workflow

1. Setup:
   - Run `bash scripts/codex.setup.sh`
2. Run Codex:
   - Use `bash scripts/codex.run.sh`
3. Follow the Active ExecPlan:
   - See `ExecPlans.md` for the active runbook and constraints.
4. Use web search during debugging:
   - Confirm browser/DOM behaviors and known pitfalls.
   - Keep repo code changes minimal and directly tied to proven root cause.

---

## Current focus

Active ExecPlan (see `ExecPlans.md`):
- Restore mouse wheel vertical page scrolling while preserving pricing internal scroll behavior.
