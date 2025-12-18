<!-- FILE: codex/CODEX_INIT_PROMPT_SITE_UI_FIXES.md -->

You are Codex running inside this repository.

Task: Implement the Site UI fixes A–E exactly as specified in `codex/SITE_UI_FIXES_SPEC.md`.

Constraints:
- Only consider Codex models: gpt-5.2 (default) or gpt-5.1-codex-max.
- Do not redesign or refactor. Minimal diffs. Stay strictly within A–E.
- Respect desktop-vs-mobile separation (especially D1 vs D2 and B mobile-only).
- For services.html “Core Bundle Bullets” (C1): reuse existing tokens only; do NOT invent new colors/tokens; mirror the “General Service Lines” line-break technique.
- Rebuild compiled assets when touching `src/css/**` or `src/js/**`:
  - `npm run build:css`
  - `npm run build:js`

Workflow (follow in order):
1. Read `AGENTS.md`, then `ExecPlan_Site_UI_Fixes.md`, then `codex/SITE_UI_FIXES_SPEC.md`.
2. Run `bash scripts/codex.ui-fixes.sh` once to get the baseline failures.
3. Implement fixes in small phases (per `ExecPlan_Site_UI_Fixes.md`), running:
   - `node scripts/validate-site-ui-fixes.js`
   after each phase, and fixing failures immediately.
4. Before finishing, run:
   - `bash scripts/codex.maintenance.sh`

Finish by outputting:
- A checklist mapping each requirement (A–E) → what changed → how it was verified
- Manual QA notes for Desktop dropdown/minimize behavior (D1)
