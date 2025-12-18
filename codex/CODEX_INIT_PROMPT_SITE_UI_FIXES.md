<!-- FILE: codex/CODEX_INIT_PROMPT_SITE_UI_FIXES.md -->

# Codex Initiation Prompt — Site UI Fixes (A–E)

You are Codex running in this repository.

## Model constraint
Use only **GPT-5.1 Codex Max** or **GPT-5.2**.

## Mission
Implement the site UI fixes specified in:
- `codex/SITE_UI_FIXES_SPEC.md`
- following the gates in `.agent/ExecPlan.SiteUI.Fixes.md`

This includes (must not miss):
1) **Desktop Services hover corridor** (hover gap is hoverable; banner + dropdown stay maximized during downward travel)
2) **Global uniform section spacing** + additional boundary reductions on `services.html` and all `niches/*.html`
3) **Mobile marquee always-loaded behavior** (images decoded before animation; no pop-in)

## Non-negotiable constraints
- Desktop-only behavior must be gated to desktop (`(hover:hover) and (pointer:fine)`).
- Mobile-only behavior must be gated to mobile (`max-width: 768px`, `(hover:none)`).
- Services C1: reuse existing “General Service Lines” heading markup + tokens; do not create new color tokens/classes.
- Keep diffs minimal; no formatting churn.

## Required reading order (do this first)
1. `.agent/ExecPlan.SiteUI.Fixes.md`
2. `codex/SITE_UI_FIXES_SPEC.md`
3. `AGENTS.md`
4. Targets:
   - `src/js/header-nav.js`, `src/css/components/header.css`
   - `src/js/marquee.js`, `src/css/features/marquee.css`
   - `src/css/base/variables.css`, `src/css/base/layout.css`, `src/css/base/typography.css`

## Execution rules (evaluation flywheel)
Work in small steps:
- make a focused change
- run `npm run build`
- run `node scripts/validate-site-ui-fixes.js --strict`
- fix failures immediately before moving on

Use the wrapper:
- `bash scripts/codex.ui-fixes.sh`

## Completion checklist (must report)
When done, summarize:
- Files changed
- Commands run
- Manual checks performed (desktop hover corridor + mobile marquees + spacing)
- Confirm `node scripts/validate-site-ui-fixes.js --strict` passes
