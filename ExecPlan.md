<!-- FILE: ExecPlans.md -->
# Silverstone — Codex ExecPlans Index (Control Plane)

This repo uses **ExecPlans** (execution plans) to make Codex CLI implement changes with high fidelity and minimal scope creep.

## Active work (ONLY scope for this run)

### ExecPlan.md — “Requested Website Edits (1–8)”
**This is the only in-scope plan for the current task.**  
It implements exactly the requested edits:

1) about.html stats card text change  
2) index.html add new stats row (same styling as about.html stats row)  
3) counter animation only about.html + index.html stats (never niches)  
4) slow double marquee (both layers; top faster than bottom)  
5) slow single marquee  
6) index.html pricing section 2 internal scroll + height match to section 1 (like services.html)  
7) pricing toggle (Setup/Monthly) scroll-animates price changes on index/services/niches  
8) niches/*.html mobile background parity: ensure the body-section parallax background image + overlay matches root pages (services/index/about/book/contact) on mobile

**Start here:** `AGENTS.md` → `PLANS.md` → `ExecPlan.md`

## Out of scope (do not do during this run)
- Any other UI/UX changes not explicitly listed above.
- Any “cleanup”, refactors, formatting-only changes, or copy edits outside the specified strings.
- Any additional animations beyond the specific requested counters and pricing price scroll animation.
- Any changes to imagery sets; this task is about **visibility/parity** of an existing background image on mobile, not swapping images.
