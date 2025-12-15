<!-- FILE: codex/INITIATION.md -->

# Codex Initiation Instructions (Silverstone Site)

Use this file to start a reliable Codex session for the current UI spec.

## 1) Start in the correct directory
- Ensure your terminal CWD is the repository root (where `index.html` and `AGENTS.md` live).

## 2) One-time environment setup
Run:
    bash scripts/codex.setup.sh

If dependencies are not installed yet, install them with your standard workflow, then rerun the setup script.

## 3) Confirm Codex is reading project guidance
In a Codex session, ask it to:
- Summarize which instruction files it loaded
- Summarize the current mission from `ExecPlan.md`

Expected:
- It references `AGENTS.md` and confirms it will follow `ExecPlan.md` and `PLANS.md`.

## 4) Recommended session configuration
- Model: `gpt-5.1-codex-max`
- Reasoning effort: high
- Approvals: allow workspace edits and local commands (do not allow outbound network unless you explicitly need it)

If you prefer to run non-interactively, use `codex exec` with full-auto enabled and instruct it to read and follow `ExecPlan.md`.

## 5) Kickoff prompt (paste into Codex)
Use a prompt that:
- Tells Codex to read `ExecPlan.md` and implement it end-to-end
- Requires the final report format (change log, commands run, requirements 1–13 PASS/FAIL)

Example wording (adapt as needed):
- “Read `ExecPlan.md` and implement requirements 1–13 exactly. Do not broaden scope. Rebuild outputs, run validations, then report with the required checklist and change log.”
