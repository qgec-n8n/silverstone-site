<!-- FILE: codex/UI_CHANGE_LOG.md -->
# UI Change Log

This file is an append-only record of UI changes made via Codex ExecPlans in this repo.

## How to use

When an ExecPlan is completed:
- add a new entry at the top of the “Entries” section
- include: date, request name, files touched, summary of changes, and verification performed
- do not edit older entries

## Entries
- 2025-02-12 — UI Fixes (Requested Edits 1–4)
  Files: `pricing-widget/src/pricing-widget.css`, `assets/css/pricing-widget.css`, `src/css/pages/services.css`, `src/css/pages/home.css`, `assets/css/styles.css`, `scripts/validate-pricing-copy-map.js`, `ExecPlan_UI_Fixes.md`
  Summary: tuned pricing light-mode background alphas, aligned pricing CTAs, tightened services mobile image wrap, made home service icon/title inline, allowed `--strict` on pricing copy validator
  Verification: `bash scripts/codex.requested-edits.sh`
