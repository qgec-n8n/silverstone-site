<!-- FILE: codex/UI_CHANGE_LOG.md -->
# UI Change Log

Use this log to record decisions, deviations, and verification notes while implementing Requested Edits 1–12.

## Baseline

- Date:
- `bash scripts/codex.requested-edits.sh` baseline result:
- Known issues before changes:

## Decisions (why we chose an approach)

Record only decisions that could otherwise be “mysterious” later.

- Date — Area — Decision — Why — Alternatives considered

## Deviations (when repo reality conflicts with request)

Format:
- Date
- Requested edit #
- Conflict (what didn’t match repo reality)
- Deviation (what we did)
- Why it still satisfies user intent
- Follow-up (if any)

## Changelog (what changed)

- Date — Files changed — Summary — Validations run — Manual checks done

## Final verification summary

When finished:
- Automated: list commands that passed
- Manual QA: confirm completion of `codex/MANUAL_QA_CHECKLIST.md`
- Remaining risks / known limitations (should be empty or explicitly accepted)
