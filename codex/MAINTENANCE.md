<!-- FILE: codex/MAINTENANCE.md -->

# Maintenance Instructions (Silverstone Site)

These rules keep the site consistent after the UI spec changes land.

## Golden rules
1) New pages must inherit the same global UX invariants
- Body section uses `assets/images/body_section_parallax/body-section-background-2025.webp`
- Dark overlay stays consistent
- Body-section-only parallax remains the only parallax/scroll effect (except the minimizing menu banner)
- No grey/silver shader variants anywhere

2) Mobile-first checks are mandatory on nav, CTAs, FAQ blocks, and cards
- Mobile off-canvas drill-down must remain right-side and “premium”
- Hero CTAs must remain stacked on mobile
- FAQ content must never overflow or clip on mobile
- Services cards must keep image-over-text layout on mobile

3) Marquees must remain stable
- Single marquee on all HTMLs except `services.html`
- Double marquee only on `services.html`
- No re-init loops, no disappearing/reset behavior

## When you modify layout or navigation
After any nav/HTML/CSS changes, run:
    npm run build:css
    npm run build:js
    node scripts/validate-niche-pages.js --strict
    bash scripts/codex.maintenance.sh

Then run targeted grep checks:
    rg -n "body-section-background-2025\\.webp" .
    rg -n "assets/images/body_section_parallax/" . | rg -v "body-section-background-2025\\.webp"
    rg -n "\\b(gray|grey|silver)\\b" src assets

## Update discipline
- Keep changes small and reversible.
- Prefer separate commits for:
  - nav/menu changes
  - parallax/background changes
  - marquee changes
  - mobile layout changes
- If something regresses, revert the smallest commit rather than “fixing forward” with messy patches.

## If the spec changes
Update these docs in this order:
1) `ExecPlan.md` (source of truth)
2) `AGENTS.md` (guardrails and repo expectations)
3) `PLANS.md` (process/gates)
4) `.codex/config.toml` (only if needed for tool/approval/model behavior)
