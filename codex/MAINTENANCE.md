<!-- FILE: codex/MAINTENANCE.md -->

# Maintenance Instructions (Silverstone Site)

These rules keep the site consistent after the UI refinements land.

## Golden rules
1) New pages must inherit the same global UX invariants
- Body section uses `assets/images/body_section_parallax/body-section-background-2025.webp`
- Dark overlay stays consistent across desktop and mobile (mobile must not be darker)
- Body-section-only parallax remains the only parallax/scroll effect (except the minimizing menu banner)
- No grey/silver shader variants anywhere

2) Mobile-first checks are mandatory on nav, CTAs, FAQ blocks, and cards
- “Tap to expand” expands header only; hamburger opens the off-canvas panels
- Two-panel drill-down remains right-side off-canvas with slow slide + staggered reveals
- Back button replaces the X control; 2s delay before minimizing reactivates after closing from Panel 1
- Hero CTAs remain stacked on mobile
- FAQ content must never overflow or clip on mobile
- Services cards must keep image-over-text layout on mobile

3) Marquees must remain stable and eager-start on mobile
- Single marquee on all HTMLs except `services.html`
- Double marquee only on `services.html`
- Images must be visible and moving from page load on mobile
- No re-init loops, no disappearing/reset behavior

## When you modify layout or navigation
After any nav/HTML/CSS/JS changes, run:
    npm run build:css
    npm run build:js
    node scripts/validate-niche-pages.js --strict
    bash scripts/codex.maintenance.sh

Then run targeted grep checks (use `rg` if available; fallback `grep -R`):
- Confirm body background references:
  - search for `body-section-background-2025.webp`
- Confirm no grey/silver palette keywords in code:
  - search for `gray`, `grey`, `silver` in `src` and `assets`
- Confirm marquee and nav modules still exist and are referenced:
  - check `src/js/header-nav.js`, `src/js/marquee.js`, `src/css/components/header.css`, `src/css/features/marquee.css`

## Update discipline
- Keep changes small and reversible.
- Prefer separate commits for:
  - nav/menu changes
  - parallax/background overlay changes
  - marquee changes
  - FAQ/layout changes
- If something regresses, revert the smallest commit rather than “fixing forward” with messy patches.

## If the spec changes
Update these docs in this order:
1) `ExecPlan.md` (source of truth)
2) `AGENTS.md` (guardrails and repo expectations)
3) `PLANS.md` (process/gates)
4) `.codex/config.toml` (only if needed for tool/approval/model behavior)
