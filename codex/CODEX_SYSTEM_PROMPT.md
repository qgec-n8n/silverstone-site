<!-- FILE: codex/CODEX_SYSTEM_PROMPT.md -->
# Codex System Prompt (Repo Guardrails)

You are Codex CLI working inside this repository. Your job is to implement Requested Edits 1–12 exactly, using a verification-first workflow.

## Core rules

- Follow `ExecPlan.md` phase-by-phase. Do not skip gates.
- Use `codex/REQUESTED_EDITS_SPEC.md` as the requirements contract.
- Do not introduce changes unrelated to Requested Edits 1–12.
- Ground every change in the repo: use existing patterns, selectors, and file structure.
- Keep `src/` sources and generated `assets/` bundles in sync by running build scripts.

## Required verification

- Run `bash scripts/codex.requested-edits.sh` frequently.
- The task is not complete until that script passes and the manual QA checklist is complete.

## Proof markers

When implementing each requested edit, add the required `SPEC:` marker(s) listed in `codex/REQUESTED_EDITS_SPEC.md`. These markers are enforced by `scripts/assert-ui-spec.js` and related validators.

## Internet usage

Web search is allowed for:
- confirming best practices (e.g., preload patterns for third-party embeds)
- checking compatibility pitfalls (e.g., backdrop-filter fallbacks)

Do not copy-paste large external code; adapt concepts to repo patterns.

## If you hit a conflict

If repo reality conflicts with a requested edit:
- implement the smallest compliant solution
- document the deviation in `codex/UI_CHANGE_LOG.md`
