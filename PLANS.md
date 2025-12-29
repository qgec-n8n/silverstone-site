<!-- FILE: PLANS.md -->
# Planning & Execution Rules for Codex CLI

This repo is intentionally structured so Codex can make safe, correct UI changes with strong guardrails.

## Canonical “source of truth” docs

Codex must always read and follow these (in this order):

1. `ExecPlan.md` (active execution plan and gates)
2. `codex/REQUESTED_EDITS_SPEC.md` (requirements + acceptance criteria)
3. `codex/REPO_UI_MAP.md` (repo-grounded map of where things live)
4. `codex/MANUAL_QA_CHECKLIST.md` (human visual verification)
5. `AGENTS.md` (role split and handoffs)

## Workflow contract (do not skip steps)

### 0) Preflight

- Run: `bash scripts/codex.setup.sh`
- Run baseline: `bash scripts/codex.requested-edits.sh`
- If baseline fails, record failures in `codex/UI_CHANGE_LOG.md` under “Baseline”.

### 1) Work in phases with gates

Follow the phase ordering in `ExecPlan.md`.

For each phase:
- Identify exact selectors / files in-repo first
- Implement the minimal change
- Add the required `SPEC:` proof marker(s)
- Rebuild bundles if `src/` changed
- Run the relevant validators
- Do the manual check for that phase

### 2) Post-change verification (required)

At the end, run:
- `bash scripts/codex.requested-edits.sh`

And complete:
- `codex/MANUAL_QA_CHECKLIST.md`

## Build system rules (keep outputs in sync)

- CSS edits: change `src/css/**` then run `npm run build:css` to regenerate `assets/css/styles.css`.
- JS edits: change `src/js/**` then run `npm run build:js` to regenerate `assets/js/app.js`.
- Pricing widget edits: change `pricing-widget/src/**` then run `cd pricing-widget && npm run build` to regenerate:
  - `assets/js/pricing-widget.js`
  - `assets/css/pricing-widget.css`

Do not hand-edit built bundles unless there is no corresponding source file (if that happens, log it and keep the diff minimal).

## Scope control / change hygiene

Allowed changes:
- Only what is necessary to satisfy Requested Edits 1–12.

Not allowed:
- Refactors, renames, or “cleanups” unrelated to requested behavior
- Styling changes outside specified sections
- Reformatting entire files (keep diffs local)

If an implementation choice has multiple valid options:
- Choose the smallest diff that matches existing patterns.
- Prefer copying an existing approach already used elsewhere in the repo.

## Conflict-handling rule

If the requested edit conflicts with repo reality:
1. Prefer repo truth (what exists and how it works).
2. Implement the smallest compliant change that satisfies user intent.
3. Record the deviation in `codex/UI_CHANGE_LOG.md` with:
   - What conflicted
   - What you did instead
   - Why it is still compliant

## Evaluation flywheel (required)

After each phase, explicitly answer (in your own working notes or final summary):
- What changed?
- What did you verify automatically?
- What did you verify manually?
- What could still be wrong?
- If something is uncertain, stop and reduce uncertainty before moving on.

## Rollback criteria

Immediately rollback or pause if:
- A validator fails and the failure is not understood
- A change creates broad unrelated diffs
- Mobile menu/hero changes regress desktop layout
- The pricing widget becomes harder to read (contrast regression)

Rollback method:
- Revert the smallest set of files related to the last phase
- Re-run `bash scripts/codex.requested-edits.sh` to confirm recovery
