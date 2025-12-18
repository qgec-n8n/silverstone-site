<!-- FILE: AGENTS.md -->

# Codex Repo Instructions (AGENTS)

These rules apply to all Codex runs in this repo.

## Models (constraint)
Use only:
- gpt-5.2
- gpt-5.1-codex-max

## Source of truth
For any run, the user’s initiation prompt + the referenced ExecPlan/spec files are authoritative.
If older docs conflict, follow the active spec for the run.

## Scope discipline
- Make the smallest change that satisfies the spec.
- No design refresh, no copy rewrites, no refactors unrelated to the requested behavior.
- Keep edits localized to the file targets named in the active spec.

## Build outputs (required)
If you modify anything under `src/css/**` or `src/js/**`, you MUST rebuild:
- `npm run build:css` (updates `assets/css/styles.css`)
- `npm run build:js`  (updates `assets/js/app.js`)

## Styling/token rules (strict)
- Do not invent new color tokens or one-off hex values when the spec says to reuse existing tokens.
- Prefer existing CSS variables (e.g., `var(--color-blue)`, `var(--color-white)`, etc.) and existing structural classes.
- For services.html “Core Bundle Bullets” (C1): follow the spec exactly (two-line heading, same line-break technique as “General Service Lines”).

## Nested-page path hygiene
For runtime JS that constructs asset URLs, prefer absolute paths like `/assets/...` so it works from `/niches/*.html` without needing `../`.

## Validation
Before finishing:
- Run the task-specific validator(s) referenced by the spec.
- Then run: `bash scripts/codex.maintenance.sh`

## Final response format
End with:
- List of files changed
- Commands run
- Requirement-by-requirement checklist
