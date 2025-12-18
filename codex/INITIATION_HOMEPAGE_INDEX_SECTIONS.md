<!-- FILE: codex/INITIATION_HOMEPAGE_INDEX_SECTIONS.md -->

# How to run Codex on this repo (Homepage Services + Pricing only)

This repo contains multiple ExecPlans. This run is ONLY for updating two sections in `index.html`:
- "Our Services"
- "Transparent, Affordable Pricing"

## What Codex should read (in order)
1) `codex/HOMEPAGE_INDEX_SECTIONS_SPEC.md`
2) `.agent/ExecPlan.Homepage.IndexSections.md`
3) `codex/CODEX_INIT_PROMPT_HOMEPAGE_INDEX_SECTIONS.md` (paste into Codex CLI as first message)

## Human preflight
From repo root:
1) `npm install`
2) `bash scripts/codex.setup.sh`

## Post-run human verification
After Codex finishes:
1) Run the wrapper:
   - `bash scripts/codex.homepage-index-sections.sh`
2) Open `index.html` locally and confirm:
   - Services section text matches the spec
   - Pricing widget loads and shows two pricing blocks
   - Toggle works in pricing section 1 (Monthly/Setup)
