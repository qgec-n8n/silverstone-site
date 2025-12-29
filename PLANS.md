<!-- FILE: PLANS.md -->
# Plans

This file is a high-level entrypoint for Codex CLI. The **execution-grade runbook** is `ExecPlan.md`.

## Current mission (Requested Edits 1–6 only)

Implement exactly these six frontend edits:

1) Shader colors per page (about purple, services green, book neon pink, contact fire orange)  
2) Remove blurred/glass hero content container; maintain extreme legibility without obscuring shader  
3) `index.html`: keep “Streamline workflows” button text on one line  
4) Global: section subtitles (white subheadings under blue titles) must be grey across all pages incl. `niches/*.html`  
5) `services.html` + `niches/*.html`: image fills its card; crop width only; no height cropping; minimal crop  
6) `about.html`: images fit card and embedded copy remains fully visible (top-safe)

## Non-goals (explicit)

- No pricing feature work
- No copy rewrites (except what is necessary to meet the six edits)
- No redesigns, refactors, or unrelated accessibility/SEO tweaks beyond what’s required by these edits

## Where to start

1) Read:
- `codex/REQUESTED_EDITS_SPEC.md`
- `ExecPlan.md`
- `codex/VERIFICATION_PROTOCOL.md`

2) Run baseline:
- `bash scripts/codex.setup.sh`
- `bash scripts/codex.requested-edits.sh`

3) Execute `ExecPlan.md` gates:
- Discovery → Approach → Implement → Verify → Regression → Evidence mapping
