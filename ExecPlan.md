<!-- FILE: ExecPlan.md -->

# ExecPlan — Silverstone UI Fixes (Hard-Precision Refinement)

This ExecPlan is a **hard-precision executable specification**. Codex must implement it exactly, rebuild, run the required validations, and produce the required final report.

If Codex gets any “CRITICAL / MUST” item wrong (especially panel directions, arrow directions, timing), it must treat that as a failed rollout and immediately correct it before finishing.

## Mission

Resolve the remaining issues:

1) **Mobile navigation menu** behavior, panel directions, arrows, button alignment, and **extremely slow** motion + stagger.
2) **Body section overlay** is currently far too opaque, especially on mobile — make it **much lighter** across all pages.
3) **Desktop FAQ** expand buttons are pushed left — re-center on desktop while keeping mobile no-overflow.
4) **Mobile marquees** (single + double): images don’t reliably appear immediately — ensure images are visible and moving from page load, so they’re already smoothly animating when user scrolls down.

## In-scope pages

Root:
- `index.html`
- `about.html`
- `services.html`
- `book.html`
- `contact.html`
- `privacy-policy.html`

Niches:
- `niches/*.html` (all niche pages)

## Nonnegotiables

- Do NOT broaden scope beyond what’s specified here.
- Preserve typography/design system except where explicitly required.
- Preserve protected components:
  - minimizing menu banner (header minimization)
  - cookie consent banner
  - magnetic buttons
- Remove ALL scroll-triggered effects except:
  - body-section parallax scroll effect
  - minimizing menu banner behavior
- Never reintroduce any silver/grey shader usage.

## CRITICAL LOCKED CONTRACTS (MUST BE EXACT)

These items are repeated intentionally because Codex has been doing them incorrectly.

### CRITICAL: Panel direction contract (do not invert)
Panels must move exactly as follows (use translateX-based motion; directions must match this table):

1) **Open Panel 1 (hamburger click)**
- Panel 1 **ENTERS from RIGHT → LEFT**
- Translation: `translateX(100%)` → `translateX(0)`

2) **Panel 1 → Panel 2 (press Services)**
- Panel 1 **EXITS to the RIGHT**
- Panel 2 **ENTERS from LEFT → RIGHT** until it replaces Panel 1
- Translation:
  - Panel 1: `translateX(0)` → `translateX(100%)`
  - Panel 2: `translateX(-100%)` → `translateX(0)`

3) **Panel 2 → Panel 1 (press Back on Panel 2)**
- Panel 1 **ENTERS from RIGHT → LEFT**
- Panel 2 **EXITS to the LEFT** (Panel 1 pushes it out)
- Translation:
  - Panel 1: `translateX(100%)` → `translateX(0)`
  - Panel 2: `translateX(0)` → `translateX(-100%)`

4) **Close menu from Panel 1 (press Back on Panel 1)**
- Panel 1 **EXITS LEFT → RIGHT** out of view
- Translation: `translateX(0)` → `translateX(100%)`
- Minimizing menu banner must re-enable **exactly 2000ms after** the panel is fully offscreen.

If ANY of the above directions are reversed, the task is not complete.

### CRITICAL: Arrow direction + placement contract (do not invert)
- Panel 1 “Services” pill must visually read as: **left arrow then Services**
  - Example: `← Services`
  - The arrow must be on the **LEFT side** of the word and point **LEFT**.
- Back pill must visually read as: **Back then right arrow**
  - Example: `Back →`
  - The arrow must be on the **RIGHT side** of the word and point **RIGHT**.

### CRITICAL: Back button location contract (do not change per panel)
- Remove the top-right X (and any combined X/arrow control) from BOTH panels.
- Use a single “Back →” button in the **top-right corner** of BOTH panels.
- Panel 2 must have **only one** Back button, in the **same top-right location** as Panel 1.

### CRITICAL: EXTREMELY SLOW motion + stagger contract
Codex must implement these timings as a **minimum** pacing (slower is allowed; faster is NOT allowed):

- Panel slide duration (open/close/swap): **>= 1800ms**
- Button reveal stagger delay: **>= 500ms per item** (top → bottom)
- Button reveal animation duration: **>= 600ms**
- Button reveals must start only after the panel finishes sliding into place (no overlapping reveal during slide).

This is intentionally “very slow / extremely slow” so users can see every button appear.

### CRITICAL: Button text alignment contract
- Panel 1 button text (including the Services arrow+label) must be **centered inside each button** (horizontally centered, vertically centered).
- The Services button font size must be **exactly the same** as other buttons (not smaller).

### CRITICAL: Overlay opacity contract
- The body-section background overlay is currently too opaque.
- Reduce it to a **slight** dark overlay across **all pages** (desktop + mobile).
- Implement as a single global CSS variable:
  - `--body-section-overlay-opacity`
- Target value: **0.22 to 0.30** (pick one and use it everywhere; do not override on mobile).
- The background image must remain clearly visible behind the overlay.

## Requirements checklist (still enforce 1–13)
All original requirements still apply. This refinement focuses on the remaining gaps and clarifies exact behavior.

## Implementation map (where changes should happen)
Do not hand-edit built bundles unless rebuild cannot reproduce output.

Likely files:
- Mobile nav: `src/js/header-nav.js`, `src/css/components/header.css`
- Overlay: `src/css/base/variables.css`, `src/css/features/parallax.css`
- FAQ: `src/css/components/faq.css`
- Marquee: `src/js/marquee.js`, `src/css/features/marquee.css`
- App entry: `src/js/app.js`
- Pages: root HTML + `niches/*.html` (only where needed for marquee image lazy-loading or structural hooks)

## Phase plan with verification gates

### Phase 0 — Preflight (no edits)
Run:
- `bash scripts/codex.setup.sh`
- `bash scripts/codex.maintenance.sh`
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`

Gate:
- You can list the exact files you will touch for:
  - nav behavior
  - overlay opacity
  - FAQ desktop centering
  - marquee eager start

### Phase 1 — Mobile navigation: state separation + direction correctness + extremely slow motion
Implement all Mobile Navigation Menu items, with special focus on the CRITICAL contracts.

Functional rules:
1) Tap-to-expand banner:
- Tapping the “tap to expand” banner must ONLY expand/maximize the mobile menu bar.
- It must NOT open the sliding panel(s).

2) Hamburger:
- The sliding panel(s) must appear ONLY when hamburger is clicked.

Panel structure:
- Panel 1 (main): Home, About, Services, Book, Contact
- Panel 2 (services): Services + niche links
- Panel 2 appears ONLY when Services on Panel 1 is pressed

Header text rule for Panel 2:
- “Explore” left aligned
- “Services” directly under it, left aligned, in-line with Explore (same left edge)

Gate (must pass):
- `node scripts/assert-ui-spec.js --strict`
- `node scripts/validate-niche-pages.js --strict`

### Phase 2 — Overlay opacity reduction (all pages)
Implement the CRITICAL overlay opacity contract:
- Use global `--body-section-overlay-opacity` set to 0.22–0.30.
- Ensure it is not overridden by mobile-specific rules.
- Ensure background remains visible and consistent across breakpoints.

Gate:
- `node scripts/assert-ui-spec.js --strict`
- Confirm body-section background still uses `body-section-background-2025.webp` everywhere.

### Phase 3 — Desktop FAQ centering (without mobile overflow)
Fix the desktop layout issue:
- Desktop: FAQ expand controls should be centered again.
- Mobile: keep no overflow/cutoff.

Gate:
- No mobile horizontal overflow is reintroduced.
- Desktop FAQ toggles no longer shoved left.

### Phase 4 — Marquee eager start on mobile (single + double)
Goal:
- On mobile, marquee images must be visible and moving from page load (no late render).

Rules:
- Do not gate marquee initialization behind scroll or intersection observers.
- Do not lazy-load marquee images.
- Ensure the animation starts at page load (or earliest safe lifecycle) and continues smoothly.

Gate:
- `node scripts/assert-ui-spec.js --strict`

### Phase 5 — Rebuild + full validation (must run at end)
Run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/assert-ui-spec.js --strict`

## Acceptance criteria (explicit)

### Mobile navigation (must be exact)
- Tap-to-expand expands header only; panels remain hidden.
- Hamburger opens Panel 1:
  - Panel 1 enters RIGHT → LEFT (slow)
  - Buttons reveal top→bottom extremely slowly (>= 500ms stagger)
  - Button text is centered inside buttons
  - Services label shows left arrow before Services (← Services)
  - Services font size matches others
- Press Services:
  - Panel 1 exits to the RIGHT
  - Panel 2 enters LEFT → RIGHT (slow) replacing Panel 1
  - Panel 2 buttons reveal top→bottom slowly
  - No X button exists; only Back → exists top-right on both panels
- Press Back on Panel 2:
  - Panel 1 enters RIGHT → LEFT
  - Panel 2 exits to the LEFT
- Press Back on Panel 1:
  - Panel 1 exits LEFT → RIGHT out of view to page
  - Minimizing banner re-enables exactly 2000ms after panel is fully gone

### Overlay
- Overlay is a slight dark overlay (0.22–0.30) on all pages; background clearly visible.
- No darker mobile override.

### Desktop FAQ
- Desktop FAQ expand buttons centered.
- Mobile still fits viewport.

### Mobile marquee behavior
- Images visible and moving from page load.
- No intermittent rendering or delayed appearance.

## Final output requirements (Codex must report)
- Change log: what changed, where, why (paths)
- Commands run + pass/fail
- Requirements checklist (1–13) PASS/FAIL
- CRITICAL contract confirmation:
  - Panel direction contract PASS/FAIL
  - Arrow contract PASS/FAIL
  - Timing contract PASS/FAIL
  - Overlay contract PASS/FAIL
- Rollback guidance (commits to revert or file list grouped by phase)
