<!-- FILE: PLANS.md -->
# PLANS

This repo uses plans as **operational safety rails** for Codex CLI work. Plans exist to:

- Prevent accidental UI/behavior changes.
- Force reproduction + measurement before edits.
- Keep diffs small, reversible, and well-justified.
- Ensure every fix has a validation gate.

## Plan types in this repo

### ExecPlans

An **ExecPlan** is the single source of truth for a multi-step change. It is:

- Evidence-driven (every claim ties back to an observation, log line, computed style, or reproduction).
- Checkpointed (repro → isolate → fix → verify → regressions → signoff).
- Minimal-risk (smallest possible diffs; no broad refactors; no restyling).

ExecPlans live in: `codex/execplans/`  
The active plan is indexed in: `ExecPlans.md`

### Checklists

Checklists are small, reusable validation sequences. They live in: `codex/checklists/`

### Snippets

Snippets are copy/paste helpers for DevTools or terminal usage. They live in: `codex/snippets/`

### SEO Indexability

When the active work targets SEO/indexability, the ExecPlan must reference:
- `codex/checklists/CHECKLIST.seo-indexability.md`
- `scripts/seo-audit.js` (audit) and `npm run sitemap:generate` (update)

## Non-negotiable rules for plans

1. **Reproduce before fixing.** If you cannot reproduce, you must first improve observability.
2. **Document root cause.** A fix without a root cause narrative is not complete.
3. **Minimize diffs.** Prefer the smallest localized edit; avoid formatting-only churn.
4. **Guard against regressions.** Validate on all pages named in the ExecPlan, and validate parallax behavior.
5. **No silent broad changes.** If a change impacts visuals/behavior outside the targeted bug, it must be rejected or reverted.
6. **SEO changes must be verified.** If HTML head, `robots.txt`, favicon/manifest, or `sitemap.xml` changes, `node scripts/seo-audit.js` must pass and `sitemap.xml` must match indexable canonicals.

## ExecPlan authoring conventions

- Filename: `YYYY-MM-DD_<short-description>.md`
- Use checkboxes for progress.
- Include:
  - Problem statement
  - Constraints and "must not change" list
  - Hypothesis matrix (cause → where to check → how to prove/disprove)
  - Step-by-step plan with explicit validation gates
  - Decision log

## If you need a new plan

1. Create a new file in `codex/execplans/`.
2. Add it to the top of `ExecPlans.md` under Active ExecPlans.
3. Ensure the plan references any relevant checklist(s) and snippet(s).
