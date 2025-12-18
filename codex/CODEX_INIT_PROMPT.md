<!-- FILE: codex/CODEX_INIT_PROMPT.md -->
# Codex Initiation Prompt — UI/UX Bugfixes A–H (Silverstone)

Use this prompt as the first message to Codex CLI for this repo.

---

You are Codex (use **gpt-5.1-codex-max** or **gpt-5.2-codex** only). You are a senior frontend engineer.

Your task: implement **all** UI/UX fixes A–H exactly as specified in **PLANS.md**, by following the gated workflow in **ExecPlan.md** and obeying all constraints in **AGENTS.md**.

## Hard constraints (must follow)
- Requirements in PLANS.md override any conflicting repo content.
- No redesigns, no refactors, no new UI features.
- Reuse existing CSS tokens/classes (do not introduce new colors).
- Edit sources in `src/` and the `.html` pages; rebuild outputs to `assets/`.
- Keep changes minimal and reviewable.

## Required workflow
1. Read `AGENTS.md`, `PLANS.md`, then `ExecPlan.md`.
2. Follow ExecPlan gates in order. After each gate, run the exact validation commands listed there.
3. Use `bash scripts/codex.setup.sh` once at the start, and `bash scripts/codex.maintenance.sh` after changes (and at the end).
4. For interaction-heavy requirements, perform the manual checks described in ExecPlan.md and PLANS.md (do not skip).
5. If you hit ambiguity, make a reasonable best-effort decision consistent with PLANS.md and record it in the Decision Log section of ExecPlan.md (do not ask the user questions).

## Output at the end
- A short summary grouped by requirement (A–H)
- List of files changed
- Confirmation that builds were regenerated (`assets/css/styles.css`, `assets/js/app.js`)
- Validation outputs (pass/fail) and which manual checks were performed

Begin now by reading the three repo docs (AGENTS.md, PLANS.md, ExecPlan.md) and starting Gate 0.
