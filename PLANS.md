<!-- FILE: PLANS.md -->

# Execution Playbook

This file defines how Codex must plan, execute, verify, and report changes in this repository.
For the current workstream, `ExecPlan.md` is the task-specific plan; this file is the reusable
runbook and quality gate.

## Operating principles
1. Scope discipline
   - Only implement what the user explicitly requested in `ExecPlan.md`.
   - No unrelated refactors, no “cleanup”, no stylistic rewrites.
2. Preserve the design system
   - Typography, spacing rhythm, and overall visual language must stay consistent.
   - Any required visual change must be narrowly targeted to the spec.
3. Mobile vs desktop conditionality
   - Mobile-only requirements must not alter desktop behavior unless explicitly required.
   - Verify mobile and desktop separately (different acceptance criteria).
4. Protect critical UX components
   - Minimizing menu banner, cookie consent banner, magnetic buttons are protected.
5. Batch and verify
   - Prefer fewer, coherent edits over repeated micro-edits.
   - Every phase ends with deterministic verification before moving on.

## Recommended workflow (phase gates)
Phase 0 — Preflight
- Inventory impacted pages and modules (do not edit yet).
- Identify where each requirement “lives” (HTML vs CSS vs JS; source vs built output).
- Confirm build/validation commands run.

Gate to proceed:
- You can name the files you will touch for each requirement.

Phase 1 — Implement cross-page changes (desktop + mobile)
- Global body section background image + dark overlay + body-section-only parallax
- Remove scroll-triggered animations (except allowed)
- Remove grey/silver shader usage

Gate to proceed:
- Deterministic checks show the intended asset is referenced, and scroll/grey rules are satisfied.

Phase 2 — Implement mobile-only changes
- Off-canvas drill-down menu behavior and visuals
- Mobile layout fixes (services grid, FAQs overflow, about images, CTA stacking, services cards)

Gate to proceed:
- Mobile acceptance criteria pass on all relevant page types.

Phase 3 — Marquee stability
- Single marquee stable on all HTMLs except `services.html`
- Double marquee stable on `services.html`

Gate to proceed:
- No re-init loops, no DOM duplication, no disappearing/reset behavior under resize/orientation changes.

Phase 4 — Rebuild + regression verification
- Rebuild CSS/JS outputs.
- Run repo validations and grep/assert checks.
- Confirm protected components still function.

Gate to finish:
- All requirements 1–13 are marked PASS with evidence.

## Verification library (commands you should use)
Note: prefer `rg`; fallback to `grep -R` if needed.

File existence / asset checks:
- Ensure the new body background exists on disk:
    ls -al assets/images/body_section_parallax/body-section-background-2025.webp

Reference checks (must reflect spec intent):
- Ensure the new background filename is referenced somewhere it will take effect:
    rg -n "body-section-background-2025\\.webp" .

- Ensure no other file is referenced from the body-section parallax directory:
    rg -n "assets/images/body_section_parallax/" . | rg -v "body-section-background-2025\\.webp"

Scroll-effect removal (allowlist mindset):
- Find remaining scroll/reveal hooks (and remove them unless explicitly allowed):
    rg -n "scroll-reveal|\\banimate\\b|\\bvisible\\b|IntersectionObserver|stats-counter|countUp|counter" src

Shader greys (code surface only; docs can mention grey):
- Audit for grey/silver palette usage:
    rg -n "\\b(gray|grey|silver)\\b" src assets

Niche integrity (must stay valid):
    node scripts/validate-niche-pages.js --strict

## Reporting format (required)
Your final response must include:
- Change log: what changed, where, and why (file paths)
- Commands run + pass/fail
- Requirements 1–13 checklist with PASS/FAIL
- Rollback guidance:
  - Preferred: reference commits that can be reverted
  - If no commits: list the exact files changed, grouped by phase
