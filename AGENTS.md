<!-- FILE: AGENTS.md -->

# Silverstone Site — Codex Operating Guide

## What this repo is
- Static marketing site (HTML + built CSS/JS in `assets/`).
- Source CSS/JS live in `src/` and are compiled into `assets/` via build scripts.
- Pages:
  - Root: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`
  - Niches: `niches/*.html`

## Current mission (do this first)
This repository is under a **UI/UX bugfix + polish spec**. Treat `ExecPlan.md` as the **single source of truth** for required edits/bugfixes and acceptance criteria.

Before editing anything:
1) Read `ExecPlan.md`
2) Then read `PLANS.md`
3) Use `codex/INITIATION.md` for how to start a Codex session
4) Use `codex/MAINTENANCE.md` for ongoing upkeep

Important:
- Ignore legacy/generated planning docs in `.agent/` and any outdated narrative docs like `Output_1.md` / `Output_2.md`.
- Only `ExecPlan.md` defines what must be changed right now.

## Nonnegotiables (scope + UX)
- Do EXACTLY the items listed in `ExecPlan.md` — no extra refactors, no “nice-to-haves”.
- Preserve the existing typography system and visual language (font family/weights/colors/sizes).
- Desktop must not regress while fixing mobile.
- Remove ALL scroll-triggered animations/effects EXCEPT:
  - The body section parallax effect, and
  - The minimizing menu banner behavior
- NEVER ship any grey/silver shader variant anywhere (replace with vibrant variants).

## Protected components (do not change unless explicitly required)
These must remain functionally intact and visually consistent:
- Minimizing menu banner (header minimization behavior)
- Cookie consent banner
- Magnetic buttons

If any protected component must be touched to satisfy a requirement:
- Make the smallest possible, isolated change
- Explain why it was required
- Add a verification step proving nothing else changed

## Implementation constraints
- Prefer editing source files under `src/` and rebuilding outputs into `assets/`.
- Do not hand-edit generated bundles in `assets/` unless the repo does not support rebuilding that artifact.
- No new runtime dependencies unless unavoidable to satisfy the spec.
- Keep edits cohesive: read enough context, then batch related changes (avoid thrashing).

## Codex CLI hygiene (tooling + execution discipline)
- Fast search: prefer `rg`; if unavailable, use `grep -R`.
- Prefer patch-style edits for precision.
- Batch file reads/searches when possible; avoid re-reading the same files repeatedly.
- Avoid destructive git operations unless explicitly approved.

## Recommended local commands
Setup (one-time per environment):
    bash scripts/codex.setup.sh

Build outputs after changes:
    npm run build:css
    npm run build:js

Validation (must run after any HTML/nav change):
    node scripts/validate-niche-pages.js --strict

Optional repo health checks:
    bash scripts/codex.maintenance.sh

## Delivery requirements for every Codex run
In the final message, include:
- A checklist for requirements 1–13 (PASS/FAIL) with the exact file paths changed per requirement
- The exact commands run and whether they passed
- A rollback plan (what commit to revert, or which files were changed per phase)
