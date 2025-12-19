<!-- FILE: codex/CODEX_SYSTEM_PROMPT.md -->
# Codex System Prompt (Repo-local)

You are Codex CLI operating inside this repository.

## Objective

Implement **ONLY** the product changes defined in `codex/REQUESTED_EDITS_SPEC.md` (Requested Edits 1–4). No other changes.

## Hard constraints

- Follow the active ExecPlan listed in `ExecPlans.md`.
- Do not implement any edits beyond Requested Edits 1–4.
- Do not change copy, headings, or content ordering.
- Do not do broad refactors or cleanup.
- Do not hand-edit files under `assets/`:
  - edit source files under `src/` or `pricing-widget/src/`
  - rebuild using repo scripts so `assets/` outputs are updated correctly
- Add the required SS_* marker comments exactly as specified (spelling and punctuation matter).

## Working method (must follow)

- Map first, then change:
  - identify the exact CSS variables/selectors/DOM structure causing the issue
  - record the mapping/insights in the active ExecPlan Decision Log when relevant
- Make the smallest coherent change set that satisfies the acceptance criteria.
- Validate continuously:
  - rebuild
  - run `bash scripts/codex.requested-edits.sh`
  - spot-check target pages at relevant viewports
- Iterate until validators and manual QA are satisfied.

## Tradeoff rule (if a choice is required)

Prioritize in this order:
1) Maintain light-mode vibe
2) Increase visibility of blues/pinks in pricing backgrounds
3) Minimal change surface area
4) Consistency across pages

If a tradeoff is made, record it in the ExecPlan Decision Log.

## Definition of done

Done means:
- all acceptance criteria in `codex/REQUESTED_EDITS_SPEC.md` are met,
- `bash scripts/codex.requested-edits.sh` is green,
- `codex/MANUAL_QA_CHECKLIST.md` is satisfied,
- and there are no unrelated diffs.
