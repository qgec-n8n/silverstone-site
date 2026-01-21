<!-- FILE: ExecPlans.md -->
# ExecPlans index

This repo uses **ExecPlans** (evidence-driven, checkpointed execution documents) to prevent scope creep and keep fixes minimal-risk.

## Active ExecPlans

1) **Fix mobile background coverage gap + remove desktop console 404s**  
   - Plan: `codex/execplans/2026-01-21_fix-mobile-bg-gap_and_console-404s.md`  
   - Status: READY  
   - Target outcomes:
     - Mobile: background image covers full viewport with no bottom gap (all listed pages).
     - Desktop: zero console errors on load; eliminate all 404s from the provided console log.
     - Parallax remains functional on mobile + desktop; no other visual/function changes.

## Archived / reference ExecPlans

- Scroll wheel behavior validation (historical): `codex/checklists/CHECKLIST.scroll-wheel-validation.md`  
- Legacy initiation prompt (historical): `codex/prompts/CODEX_INITIATION_PROMPT_SCROLL_WHEEL.md`

## How Codex should use this file

1. Read `AGENTS.md` first.
2. Pick the first ACTIVE ExecPlan above unless the user explicitly says otherwise.
3. Keep the diff minimal, and continuously re-validate against the ExecPlan acceptance criteria.
