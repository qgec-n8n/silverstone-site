<!-- FILE: codex/CODEX_INIT_PROMPT.md -->
# Codex Initiation Prompt (paste into Codex CLI)

You are operating inside the repo. Implement **Requested Edits 1–6 only** (shader colors per page, hero no-glass legibility, index button nowrap, subtitles grey globally, services/niches image fill width-crop-only, about images copy visible).

CRITICAL:
- Ignore any references to pricing or “Pricing Feature Implementation” — that is a mislabel.
- Do not redesign or refactor anything unrelated.

Process (must follow gates):
1) Read: `ExecPlan.md`, `codex/REQUESTED_EDITS_SPEC.md`, `codex/VERIFICATION_PROTOCOL.md`.
2) Run setup + baseline:
   - `bash scripts/codex.setup.sh`
   - `bash scripts/codex.requested-edits.sh`
   Record baseline failures in `codex/UI_CHANGE_LOG.md`.
3) Discovery:
   - Map where each requirement lives (files/selectors/attributes).
   - Update `codex/REPO_UI_MAP.md`.
4) Write approach:
   - In `codex/UI_CHANGE_LOG.md`, write a per-edit approach for edits 1–6.
   - If uncertain, use web search to confirm best practice (briefly record conclusions).
5) Implement incrementally:
   - Implement edits 1–6 in the order suggested by `ExecPlan.md`.
   - Add required SPEC markers from `codex/REQUESTED_EDITS_SPEC.md`.
   - After each edit, rebuild CSS/JS as needed and re-run relevant checks.
6) Verification:
   - `bash scripts/codex.requested-edits.sh` must pass.
   - Complete `codex/MANUAL_QA_CHECKLIST.md`.
7) Final evidence:
   - Fill the evidence mapping in `ExecPlan.md` (or in `codex/UI_CHANGE_LOG.md`) for edits 1–6.

Stop if:
- You are about to change something not required by edits 1–6.
- A validation failure suggests a misunderstanding of the spec; re-read the spec and adjust.
