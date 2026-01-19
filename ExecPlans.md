<!-- FILE: ExecPlans.md -->
# ExecPlans index

This repo uses ExecPlans (see `PLANS.md`) to guide Codex through complex tasks that require careful diagnosis, minimal diffs, and strict non-regression.

---

## How to run Codex with this repo

Preferred entrypoint:

- Run Codex via `bash scripts/codex.run.sh` (it sets `CODEX_HOME` to `.codex/` for consistent config).

Typical workflow:

1) Setup (once per environment)
   - `bash scripts/codex.setup.sh`

2) Serve locally
   - `bash scripts/codex.serve.sh 4173`
   - Open affected pages in a browser and reproduce.

3) Baseline audits
   - `bash scripts/codex.audit.scroll-lock.sh`
   - `bash scripts/codex.inventory.pages.sh`

4) Run Codex
   - Start Codex and paste the initiation prompt in `codex/prompts/`.

5) Before finalizing a fix (must)
   - `bash scripts/codex.validate.scroll.sh`
   - Follow `codex/checklists/scroll-wheel-validation.md`

---

## Active ExecPlans

- `codex/execplans/2026-01-19_restore-wheel-scroll.md`
  - Restore mouse wheel page scrolling across:
    - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `niches/*.html`
  - Preserve protected pricing internal scroll on:
    - `index.html` + `services.html`

(Keep this file updated whenever new ExecPlans are added or retired.)
