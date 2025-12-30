<!-- FILE: codex/CODEX_INIT_PROMPT.md -->
# Codex Initiation Prompt (Copy/paste into Codex CLI)

You are Codex CLI running GPT-5.2. Your job is to implement Requested Edits 1–7 for this static website repo with maximum correctness and minimal scope drift.

Non-negotiable rules:
- Implement EXACTLY and ONLY Requested Edits 1–7 as defined in `codex/REQUESTED_EDITS_SPEC.md`.
- Ignore any mention of “Pricing Feature Implementation plan” as out of scope.
- Do not modify `pricing-widget/**`.
- Do not redesign unrelated sections. No “nice-to-have” improvements.
- Rebuild bundles after source edits (`src/css/**` -> `assets/css/styles.css`, `src/js/**` -> `assets/js/app.js`).

Before coding:
1) Read these files fully:
   - `PLANS.md`
   - `ExecPlan.md`
   - `codex/REQUESTED_EDITS_SPEC.md`
   - `codex/VERIFICATION_PROTOCOL.md`
   - `codex/REPO_UI_MAP.md`
   - `codex/PAGE_AUDIT_MATRIX.md`
2) Use web search (if available) to open the three specified OpenAI Cookbook pages from the user request, and extract only the practical patterns relevant to:
   - preventing scope drift
   - making plans self-contained and verifiable
   - running an evaluation flywheel with automated graders
   If network access is not available, proceed using the repo docs above.

Setup + baseline:
- Run: `bash scripts/codex.setup.sh`
- Run: `bash scripts/codex.requested-edits.sh`
- Record baseline failures in `codex/UI_CHANGE_LOG.md` under “Baseline”.

Execution:
- Follow `ExecPlan.md` milestones in order.
- After each milestone, run: `bash scripts/codex.requested-edits.sh`
- Add SPEC proof markers exactly as listed in `codex/REQUESTED_EDITS_SPEC.md`.

Validation:
- Do not declare done until:
  - `bash scripts/codex.requested-edits.sh` passes
  - Manual QA checklist is completed: `codex/MANUAL_QA_CHECKLIST.md`
  - Evidence table in `ExecPlan.md` is filled for each edit 1–7

Output format (when reporting progress):
- Keep updates compact:
  - What changed
  - Where (file paths)
  - How verified (commands run + key results)
  - Remaining risks / open items
- Update the ExecPlan “Progress” section with timestamps at every stopping point.
