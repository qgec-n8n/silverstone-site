<!-- FILE: ExecPlans.md -->
# ExecPlans Index

This repository uses **ExecPlans** as the primary control surface for Codex CLI work. An ExecPlan is a checkpoint-heavy, repo-grounded, verification-first plan that Codex must follow.

## Active ExecPlan

- **ExecPlan.md** — *Silverstone UI/UX + content fixes (Requested Edits 1–12, 2025-12)*  
  Scope: pricing widget light-mode vibrancy, neon borders on service images, global subtitle color, hero legibility/CTA spacing, Calendly performance, content updates, index section swap to image tiles + lightbox, and mobile-only menu/hero fixes.

## How to add a new ExecPlan

1. Create a new file `ExecPlan_<topic>_<yyyy-mm>.md` (or update `ExecPlan.md` if it supersedes current work).
2. Add:
   - Goals + non-goals
   - Repo map (exact file paths + key selectors / IDs)
   - Phased plan with gates
   - Acceptance criteria per requirement
   - Verification commands + manual QA steps
   - Rollback criteria
3. Update this index and `.codex/config.toml` include list so Codex always reads the active plan.
