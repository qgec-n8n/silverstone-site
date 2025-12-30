<!-- FILE: codex/UI_CHANGE_LOG.md -->
# UI Change Log (Evaluation Flywheel Logbook)

Use this file to record:
- baseline failures
- discoveries that change your approach
- the per-edit implementation strategy
- verification evidence

This is the paper trail that lets a future contributor understand what happened and why.

---

## Baseline (Measure-first)

Date:
- Environment notes (Node/npm versions, any install constraints):

Commands run:
- `bash scripts/codex.setup.sh`
- `bash scripts/codex.requested-edits.sh`

Baseline result (paste a concise summary of failures):
- Failures:
  - (expected until Requested Edits 1–8 are implemented)
- Suspected causes:
  - (fill only after confirming in codebase)

---

## Root-cause notes (must fill before implementing)

Write 1–3 sentences per edit.

### Edit 1 — Desktop hero tight container
Root cause:
Files involved:
Planned minimal fix:

### Edit 2 — About desktop images fill + neon border wrap
Root cause:
Files involved:
Planned minimal fix:

### Edit 3 — Services desktop General_Services HD
Root cause:
Files involved:
Planned minimal fix:

### Edit 4 — Services mobile General_Services portrait 2:3
Root cause:
Files involved:
Planned minimal fix:

### Edit 5 — Services Neural Grid replace square/landscape assets
Root cause:
Files involved:
Planned minimal fix:

### Edit 6 — Services Neural Grid replace portrait assets with varied prefixes
Root cause:
Files involved:
Planned minimal fix:

### Edit 7 — Mobile hero remove grey subheadings without layout shift
Root cause:
Files involved:
Planned minimal fix:

### Edit 8 — Index two sentences white → grey
Root cause:
Files involved:
Planned minimal fix:

---

## Iteration log (Analyze → Measure → Improve)

Use one entry per loop.

- Loop:
  - Analyze (what failed; why):
  - Measure (what command; what changed in output):
  - Improve (what targeted change you made):
  - Result:

---

## Final summary (fill at the end)

- What changed (high-level):
- What commands pass:
- Manual QA completed (yes/no + notes):
- Any known limitations (ideally none):
- Where evidence is recorded (ExecPlan evidence table, QA checklist):
