<!-- FILE: AGENTS.md -->
# AGENTS

This file defines how Codex should behave in this repo.

## Repository architecture

- This repository intentionally contains two website implementations.
- The legacy vanilla HTML, CSS, and JavaScript website at the repository root is a frozen migration reference until a future task explicitly removes or edits it.
- The global legacy-site visual, parallax, SEO, and minimal-diff guardrails apply to the root legacy implementation.
- The active development target is the React application under `/web`.
- Active `/web` work follows `/web/AGENTS.override.md`; read it before changing files under `/web`.
- `/docs/silverstone-transformation/` contains authoritative specifications, audits, decisions, and handoff records.
- Do not assume future work happens on separate transformation branches. Future instructed work occurs from the current repository state unless the user explicitly says otherwise.

## Workspace skills & MCP

- Shared agent skills live in `.agents/skills/` (canonical store); Claude tooling
  resolves them via `.claude/skills/` symlinks, and Codex MCP servers are
  generated into `.codex/config.toml` from `.mcp.json`.
- After adding/removing a skill or editing `.mcp.json`, run
  `node .agents/sync-skills.mjs` to regenerate the wiring (`--check` verifies it).
- See `.agents/SKILLS.md` for reuse in future projects and the cross-Repl limitation.

## Global guardrails

- **Do not change visuals or behavior** except for the explicitly targeted outcomes in the active ExecPlan.
- **SEO/indexability work is allowed** when the active ExecPlan targets it: edits to HTML `<head>`, `robots.txt`, `sitemap.xml`, favicon/manifest references, and sitemap/SEO scripts are in scope.
- **Parallax must continue to work** on both mobile and desktop. Do not disable or remove parallax.
- **Minimal diffs only.** No broad refactors. No renaming or reformatting for style. No dependency churn unless required for verification tooling.
- **Evidence-first.** Every edit must be preceded by reproduction + measurement and followed by verification + regression checks.

## Operating loop (evaluation flywheel)

Repeat until acceptance criteria are met:

1. Analyze: reproduce, collect logs/metrics/screenshots, map hypotheses to code.
2. Measure: define an observable pass/fail signal for each hypothesis.
3. Improve: make the smallest possible change; immediately re-measure.
4. If regression or ambiguity: revert and pick the next hypothesis.

## Roles (simulate these, even as a single agent)

### Investigator
- Parses the provided desktop console log.
- Finds the code path(s) responsible for each 404.
- Diagnoses the mobile viewport gap by inspecting computed layout and runtime parallax elements.
- Audits HTML indexability signals, canonical URLs, robots directives, and sitemap coverage.

### Implementer
- Applies the smallest-possible fix aligned with the root cause.
- Keeps diffs localized and reversible.

### Verifier
- Runs the relevant checklist(s) and scripts.
- Confirms:
  - No mobile background gap across all specified pages.
  - No desktop console errors on load.
  - Parallax still functions on mobile + desktop.
  - HTML pages are indexable and sitemap/robots are compliant (when SEO is in scope).
  - No unexpected UI changes.

### Scribe
- Updates the active ExecPlan with:
  - What was observed
  - What changed and why
  - Before/after evidence
  - Any tradeoffs or follow-ups

## What “done” means

A change is only “done” when:

- Acceptance criteria in the active ExecPlan are met.
- The validation checklists pass.
- The diff is minimal and restricted to what is necessary.
- The ExecPlan has a clear root cause explanation and a reproducible verification procedure.
- When SEO/indexability is in scope, `node scripts/seo-audit.js` passes and `sitemap.xml` matches indexable canonicals.

## Prohibited actions

- Deleting parallax code or forcing parallax off to “fix” the issue.
- Changing spacing/typography/colors “to look better.”
- Running repo-wide formatters that touch unrelated files.
- “Fixing” unrelated warnings or refactoring modules not required for the active outcomes.
- Adding `noindex`/robots blocks or removing canonical/sitemap entries unless explicitly required by the active ExecPlan.
