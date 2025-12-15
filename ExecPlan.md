<!-- FILE: ExecPlan.md -->

# ExecPlan — Silverstone UI Spec Fixes

## Objective
Guide Codex to implement the exact edits/bugfixes listed in the user spec, with premium,
professional UX, tight scope discipline, and deterministic verification gates.

## In-scope pages
Root pages:
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `privacy-policy.html`

Niche pages:
- `niches/dentists.html`
- `niches/ecommerce.html`
- `niches/estate-agents.html`
- `niches/fitness-coaches.html`
- `niches/gyms-fitness-studios.html`
- `niches/hospitality.html`
- `niches/physios-chiropractors.html`
- `niches/salons-barbers.html`
- `niches/trades-virtual-office.html`

## Scope matrix (what must change)
Edits for BOTH desktop and mobile:
1) Body section background image on all HTMLs is `body-section-background-2025.webp` from `assets/images/body_section_parallax/`, with dark overlay and body-section parallax preserved.
2) Remove ALL scroll-related animations/effects except the body-section parallax scroll effect. Keep minimizing menu banner, cookie consent banner, magnetic buttons untouched.
3) Never use silver/grey shader on any page. Replace any grey shader usage with pink/purple/magenta/cyan/green variants wherever grey is included.

Edits for ONLY mobile:
4) Premium right-side off-canvas drill-down menu with staggered reveals and horizontal panel transitions. Typography unchanged; font color remains blue. Panel color is “icey blue white”. Minimizing menu banner still functions, but while the off-canvas is open the menu bar must NOT minimize; it can minimize again only after closing.
5) Confirm mobile body section background uses `body-section-background-2025.webp` with dark overlay + parallax (all pages).
6) `index.html` “Our Services” 2x2 grid stacks vertically (one card per row) on mobile.
7) FAQs on `index.html` and ALL niche pages fit inside viewport on mobile (no overflow/cutoff).
8) `about.html` “What Drives Us” images are all visible on mobile (fix disappearance).
9) Hero Primary + Secondary CTA buttons on each HTML stack vertically with a small vertical gap on mobile.
10) All niche pages confirm body section background image is `body-section-background-2025.webp`.
11) Single marquee: works on all HTMLs except `services.html`; must not load slowly, reset, render intermittently, or appear/disappear.
12) `services.html`: service cards must have image ABOVE text (never side-by-side) on mobile.
13) `services.html`: double marquee must be stable (no slow reload, single-layer-only, partial-time rendering, or constant disappearing/reset).

## Nonnegotiable constraints (must obey)
- Do NOT broaden scope beyond the listed requirements.
- Preserve existing typography and design system (except shader palette and specified menu panel color).
- Protected components (do not modify logic/styles unless unavoidable to satisfy a listed requirement):
  - Minimizing menu banner
  - Cookie consent banner
  - Magnetic buttons
- Do not introduce new dependencies unless unavoidable.
- Prefer editing `src/` sources and rebuilding `assets/` outputs.

## Operating checklist distilled from Codex-Max guidance
- Batch reads/searches before editing; avoid repeated micro-edits.
- Prefer precise patch edits; keep changes cohesive.
- Persist through implementation + verification + final checklist (do not stop at partial fixes).
- Avoid destructive git operations unless explicitly approved.
- Close the loop: every requirement must be explicitly marked PASS/FAIL at the end.

## Execution phases

### Phase 0 — Preflight mapping (no edits)
1) Baseline build/validation sanity:
   - Run setup/build/validation commands (see Phase 7 for exact list).
2) Inventory where features likely live (confirm by search):
   - Parallax + body background: likely `src/js/parallax*` and `src/css/features/parallax*` and/or per-page HTML attributes/classes.
   - Scroll animations/counters: likely `src/js/scroll-*`, `src/js/stats-*`, and related CSS classes (`.animate`, `.visible`, etc).
   - Shader: likely `src/js/hero-shader*` and a per-page “theme” selector.
   - Mobile nav: likely `src/js/header-nav*` and nav-related CSS in `src/css/components/*` and/or `src/css/layout/*`.
   - Marquees: likely `src/js/marquee*` and `src/css/features/marquee*`.

Gate:
- You can list the exact files you will change for each requirement (or a short candidate set per requirement).

### Phase 1 — Body section background + body-section-only parallax (Req 1, 5, 10)
Goal: every page’s body section uses the same background image with the existing dark overlay, and
parallax applies to the body section across pages (and only the body section).

Steps:
1) Confirm `assets/images/body_section_parallax/body-section-background-2025.webp` exists; if missing, stop and report.
2) Locate how the body section background is currently selected:
   - If per-page HTML attributes/classes pick a theme/image, standardize that selection to the new image.
   - If CSS defines the body section background, update it to the new image.
   - If JS injects background layers for mobile parallax, ensure it uses the new image.
3) Ensure the dark overlay remains exactly as before (no brightness change unless required to preserve it).
4) Restrict parallax behavior:
   - Keep parallax for the body section.
   - Remove/disable parallax application for other sections (if currently applied elsewhere), unless doing so would break the “body section parallax” behavior.

Verification gate (deterministic):
- File exists:
    ls -al assets/images/body_section_parallax/body-section-background-2025.webp
- References:
    rg -n "body-section-background-2025\\.webp" .
- No other body_section_parallax image referenced:
    rg -n "assets/images/body_section_parallax/" . | rg -v "body-section-background-2025\\.webp"

### Phase 2 — Remove scroll-triggered animations/effects (Req 2)
Goal: eliminate scroll-based reveals/counters/scroll effects except:
- body section parallax, and
- minimizing menu banner behavior

Steps:
1) Identify all scroll-based behaviors:
   - Scroll reveal (class toggles like `.animate` to `.visible`)
   - Stats counters triggered on scroll
   - Any scroll-based “glow”, “fade”, “slide”, or “indicator” effects that are not the minimizing menu banner
2) Remove/disable them at the source (prefer removing initialization/registration over leaving dead code).
3) Confirm protected components remain intact:
   - Minimizing menu banner still works normally (except for the mobile gating behavior in Req 4).
   - Cookie banner unchanged.
   - Magnetic buttons unchanged.

Verification gate:
- Search for remaining reveal/counter hooks:
    rg -n "scroll-reveal|\\banimate\\b|\\bvisible\\b|stats-counter|countUp|counter" src
- If scroll listeners remain, they must be attributable to only:
  - body parallax, and
  - minimizing menu banner logic
  (Document where they live.)

### Phase 3 — Eliminate grey/silver shader everywhere (Req 3)
Goal: no page uses a grey/silver shader palette; replace with vibrant variants.

Steps:
1) Locate shader palette definitions and any per-page shader theme selection.
2) Remove grey/silver palettes and any references selecting them.
3) Replace with palettes that clearly read as one (or more) of:
   - pink / purple / magenta / cyan / green
4) Ensure typography and other hero styling remains unchanged.

Verification gate:
- Search code surfaces for “grey/gray/silver” references:
    rg -n "\\b(gray|grey|silver)\\b" src assets
- If the site supports per-page themes, confirm each page selects a non-grey variant.

### Phase 4 — Mobile off-canvas drill-down menu (Req 4)
Goal: a premium right-side off-canvas menu with drill-down panels.

Hard requirements:
- Off-canvas opens from the right.
- Drill-down behavior:
  - Top-level items → tap opens a child panel.
  - A back control returns to the previous panel.
- Motion:
  - Staggered item reveals (small delays per item; “premium”, not flashy).
  - Horizontal panel transitions (translateX-based, not fades).
- Visuals:
  - Typography and font sizing unchanged.
  - Font color remains blue.
  - Panel background is “icey blue white” (a very light blue-tinted white; avoid pure grey).
- Interaction with minimizing menu banner:
  - Minimizing menu banner behavior remains intact generally.
  - While the off-canvas is open, the menu bar must NOT minimize due to scroll.
  - Minimize can resume only after the hamburger is clicked again to close.

Implementation guidance (high-level):
1) Introduce a single, explicit “nav open” state (one source of truth).
2) While nav is open:
   - Lock body scroll if currently used in the site, but do not break the cookie banner or other overlays.
   - Gate/disable the header minimization response to scroll.
3) Ensure closing the menu restores normal scroll + header behavior.

Verification gate:
- Confirm menu open state is explicit and used to gate header minimization.
- Confirm drill-down panels exist and animate horizontally.
- Confirm blue typography is preserved and panel background is not grey.

### Phase 5 — Mobile layout fixes (Req 6, 7, 8, 9, 12)
Goal: satisfy all mobile-only layout requirements without desktop regressions.

Req 6 — `index.html` services cards stack:
- On mobile, “Our Services” 2x2 becomes 1xN vertical stack (one per row).

Req 7 — FAQ overflow fixes:
- On mobile, FAQs on `index.html` and every niche page fit in viewport:
  - No horizontal scroll
  - No clipped accordion content
  - No fixed heights that cut off content

Req 8 — About “What Drives Us” images visible:
- On mobile, ensure all images in that section render and are not hidden by:
  - overflow clipping
  - negative margins
  - incorrect absolute positioning
  - breakpoint-specific display rules

Req 9 — Hero CTA buttons stack on every HTML:
- On mobile, primary and secondary CTAs stack vertically with a small vertical gap.
- Ensure tap targets remain comfortable and consistent.

Req 12 — Services cards: image above text on mobile:
- On mobile, service card layout must be vertical (image top, text below).
- Never side-by-side on mobile (no split columns).

Verification gate:
- Confirm mobile breakpoint rules do not affect desktop layouts.
- Confirm CTA stacking applies across all pages (root + niche).

### Phase 6 — Marquee stability (Req 11, 13)
Goal: marquees are stable, persistent, and do not reset/disappear.

Req 11 — Single marquee:
- Must appear and work on ALL HTMLs except `services.html`.
- Must be stable:
  - No slow “reload” feel
  - No constant resetting to start
  - No intermittent rendering
  - No appear/disappear behavior

Req 13 — Double marquee on services:
- Must be stable and fully rendered:
  - Both layers present
  - No partial-time rendering
  - No constant resetting/disappearing

Implementation guidance (high-level):
1) Ensure marquee initialization is idempotent:
   - It should not remove/recreate marquee repeatedly during scroll/resize.
   - It should not fight other scripts for the same DOM slot.
2) Ensure page detection is correct:
   - `services.html` uses double marquee only.
   - All other HTMLs use single marquee.
3) Ensure animations are continuous and not tied to scroll events.

Verification gate:
- Confirm there is exactly one marquee instance per page type (single vs double).
- Confirm no code path destroys/rebuilds marquees during ordinary runtime events.

### Phase 7 — Rebuild + full verification (must run at end)
1) Rebuild outputs:
    npm run build:css
    npm run build:js
2) Validate niche pages remain wired correctly:
    node scripts/validate-niche-pages.js --strict
3) Run reference and policy checks:
    rg -n "body-section-background-2025\\.webp" .
    rg -n "assets/images/body_section_parallax/" . | rg -v "body-section-background-2025\\.webp"
    rg -n "\\b(gray|grey|silver)\\b" src assets
    rg -n "scroll-reveal|\\banimate\\b|\\bvisible\\b|stats-counter|countUp|counter" src

## Acceptance criteria (explicit per page type)

### Index page (`index.html`)
Desktop + Mobile:
- Body section background is `body-section-background-2025.webp` with dark overlay and body-section parallax.
- No scroll reveals/counters/other scroll animations.
- No grey/silver shader usage.

Mobile only:
- Off-canvas drill-down menu meets Req 4 and does not trigger header minimization while open.
- “Our Services” is one card per row (vertical stack).
- FAQs do not overflow/cut off.
- Hero CTAs stack vertically with small gap.
- Single marquee is stable.

### About page (`about.html`)
Desktop + Mobile:
- Body section background + overlay + body-section parallax.
- No scroll reveals/counters/other scroll animations.
- No grey/silver shader usage.

Mobile only:
- Off-canvas drill-down menu meets Req 4.
- “What Drives Us” images all visible.
- Hero CTAs stack vertically with small gap.
- Single marquee is stable.

### Services page (`services.html`)
Desktop + Mobile:
- Body section background + overlay + body-section parallax.
- No scroll reveals/counters/other scroll animations.
- No grey/silver shader usage.

Mobile only:
- Off-canvas drill-down menu meets Req 4.
- Service cards: image above text (never side-by-side).
- Double marquee is stable.

### Niche pages (`niches/*.html`)
Desktop + Mobile:
- Body section background is `body-section-background-2025.webp` with overlay + body-section parallax.
- No scroll reveals/counters/other scroll animations.
- No grey/silver shader usage.

Mobile only:
- Off-canvas drill-down menu meets Req 4.
- FAQs fit viewport; no overflow/cutoff.
- Hero CTAs stack vertically with small gap.
- Single marquee is stable.

### Other root pages (`book.html`, `contact.html`, `privacy-policy.html`)
Desktop + Mobile:
- Body section background + overlay + body-section parallax.
- No scroll reveals/counters/other scroll animations.
- No grey/silver shader usage.

Mobile only:
- Off-canvas drill-down menu meets Req 4.
- Hero CTAs (if present) stack vertically with small gap.
- Single marquee is stable.

## Final output requirements (what Codex must report)
At the end, provide:
1) Change log (file paths + brief rationale per file)
2) Commands run + pass/fail
3) Requirements checklist (1–13) with PASS/FAIL and the files involved
4) Rollback guidance (preferred: commits to revert; otherwise: grouped file list by phase)
