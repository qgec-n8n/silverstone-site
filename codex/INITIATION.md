<!-- FILE: codex/INITIATION.md -->
# Initiation (Human + Codex)

This repo is designed for Codex CLI to implement UI changes safely.

## Human steps

1. Ensure Node.js (LTS) and npm are available.
2. From repo root, run:
   - `npm install`
   - `bash scripts/codex.setup.sh`

## Starting Codex

- Use the contents of `codex/CODEX_INIT_PROMPT.md` as your initial message.
- Ensure Codex has access to the files listed in `.codex/config.toml`.

## What “done” means

- `bash scripts/codex.requested-edits.sh` passes
- `codex/MANUAL_QA_CHECKLIST.md` is completed
- `codex/UI_CHANGE_LOG.md` includes a short summary and any deviations
