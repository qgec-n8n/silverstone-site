<!-- FILE: ExecPlan.md -->

# ExecPlan — Silverstone UI Fixes (Hard-Precision + Page Polish)

This ExecPlan is a **hard-precision executable specification**. Codex must implement it exactly, rebuild, run the required validations, and produce the required final report.

If Codex gets any “CRITICAL / MUST” item wrong (especially panel directions, arrow directions, timing, overlay opacity, or marquee touch behavior), it must treat that as a failed rollout and immediately correct it before finishing.

## Mission

Resolve the remaining issues:

A) **Mobile navigation menu** behavior, panel directions, arrows, button alignment, and **slow-but-not-too-slow** motion + stagger.  
B) **Body section overlay** is currently far too opaque — make it **much lighter** across all pages.  
C) **Desktop FAQ** expand buttons are pushed left — re-center on desktop while keeping mobile no-overflow.  
D) **Mobile marquees** (single + double): images don’t reliably display until touch — ensure images are visible and moving without touch.  
E) **Additional page polish (NEW points 1–9)**: index/about/services content alignment + color fixes.

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

## SPEC MARKERS (MANDATORY)

To prevent Codex from “almost” doing the right thing, each requirement below includes a required `SPEC:` marker comment.

**Codex must add these markers (exact text) near the final implementation points** in `src/` (JS/CSS/HTML as appropriate).  
The deterministic validator `scripts/assert-ui-spec.js` will fail if markers are missing.

Required markers:

- `SPEC: MOBILE_NAV_TIMINGS_TUNED`
- `SPEC: DESKTOP_NAV_SERVICES_FONT_PARITY`
- `SPEC: MOBILE_NAV_P1_SERVICES_FONT_PARITY`
- `SPEC: INDEX_SMALL_BIZ_KPI_BLUE_TITLES`
- `SPEC: INDEX_SMALL_BIZ_FOOTNOTE_GREY`
- `SPEC: INDEX_STREAMLINE_CARDS_CENTER_MOBILE`
- `SPEC: ABOUT_VALUES_CARDS_CENTER_MOBILE`
- `SPEC: ABOUT_WHAT_DRIVES_US_IMAGES_VISIBLE_MOBILE`
- `SPEC: SERVICES_CTA_KPI_TITLES_BLUE`
- `SPEC: SERVICES_CTA_KPI_BODY_LEFT_ALIGN`
- `SPEC: MARQUEE_NO_TOUCH_REQUIRED`

## CRITICAL LOCKED CONTRACTS (MUST BE EXACT)

These items are repeated intentionally because Codex frequently inverts them.

### CRITICAL: Panel direction contract (do not invert)

Panels must move exactly as follows (translateX-based):

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
- Panel 2 **EXITS to the LEFT**
- Translation:
  - Panel 1: `translateX(100%)` → `translateX(0)`
  - Panel 2: `translateX(0)` → `translateX(-100%)`

4) **Close menu from Panel 1 (press Back on Panel 1)**
- Panel 1 **EXITS LEFT → RIGHT** out of view
- Translation: `translateX(0)` → `translateX(100%)`
- Minimizing menu banner must re-enable **exactly 2000ms after** the panel is fully offscreen.

If ANY of these directions are reversed, the task is not complete.

### CRITICAL: Arrow direction + placement contract (do not invert)

- Panel 1 “Services” pill must visually read as: **left arrow then Services**
  - Example: `← Services` (or `<-- Services`)
  - Arrow is on the **LEFT** of the word and points **LEFT**.
- Back pill must visually read as: **Back then right arrow**
  - Example: `Back →` (or `Back -->`)
  - Arrow is on the **RIGHT** of the word and points **RIGHT**.

### CRITICAL: Back button location contract (do not change per panel)

- Remove the top-right X (and any combined X/arrow control) from BOTH panels.
- Use a single “Back →” button in the **top-right corner** of BOTH panels.
- Panel 2 must have **only one** Back button, in the **same top-right location** as Panel 1.

### CRITICAL: Timing contract (slow + readable, but not overly slow)

User feedback: current animation is “too slow”. Keep it premium and readable, but speed it up slightly.

**Minimum pacing (do not go faster than these minimums):**
- Panel slide duration (open/close/swap): **>= 1200ms**
- Button reveal stagger delay: **>= 250ms per item** (top → bottom)
- Button reveal animation duration: **>= 400ms**
- Button reveals must start only after the panel finishes sliding into place.

Add marker near the timing constants:
- `SPEC: MOBILE_NAV_TIMINGS_TUNED`

### CRITICAL: Button text alignment + Services style parity

- Panel 1 pill button text must be **centered inside each button** (both axes).
- Services in Panel 1:
  - Must not be bold.
  - Must match the exact font, font-size, and style of Home/About/Book/Contact.
  - Must include the left arrow BEFORE the label (← Services).

Add marker near final font parity fix:
- `SPEC: MOBILE_NAV_P1_SERVICES_FONT_PARITY`

### CRITICAL: Overlay opacity contract

- The body-section overlay is too opaque (especially mobile).
- Reduce to a **slight** dark overlay across **all pages** (desktop + mobile).
- Implement as a single global CSS variable:
  - `--body-section-overlay-opacity`
- Target value: **0.22 to 0.30** (pick one and use it everywhere; do not override on mobile).
- Background image must remain clearly visible behind overlay.

## ADDITIONAL NEW REQUIREMENTS (9 points)

These are additional edits Codex must implement **in addition** to everything above.

### (1) index.html — “What small businesses usually get back” section
1a) Make the **titles** on all 3 cards the same **blue** as other card titles.
- Example: “Hours back each week” goes from white to blue.
- Marker: `SPEC: INDEX_SMALL_BIZ_KPI_BLUE_TITLES`

1b) Make the text under the cards (the benchmark/disclaimer sentence) **grey**, not white.
- Marker: `SPEC: INDEX_SMALL_BIZ_FOOTNOTE_GREY`

### (2) index.html (mobile) — “Streamline. Optimize. Succeed.” cards centered
Ensure the 3 stacked cards are **horizontally centered** in the viewport on mobile (currently shifted left).
- This is a container alignment issue (center the stack as a whole, not just text).
- Marker: `SPEC: INDEX_STREAMLINE_CARDS_CENTER_MOBILE`

### (3) about.html (mobile) — “Our Values” cards centered
Ensure the 3 stacked cards are **horizontally centered** in the viewport on mobile (currently shifted left).
- Marker: `SPEC: ABOUT_VALUES_CARDS_CENTER_MOBILE`

### (4) about.html (mobile) — “What Drives Us” images all visible
Ensure all 3 images render and remain visible on mobile.
- Currently only one appears; the other two become thin neon lines (likely layout/overflow/height collapse).
- Fix by ensuring image containers have stable sizing at mobile breakpoints and are not clipped or reduced to near-zero size.
- Marker: `SPEC: ABOUT_WHAT_DRIVES_US_IMAGES_VISIBLE_MOBILE`

### (5) Desktop nav — Services matches other items
Ensure “Services” in the desktop nav has the **exact same font, font size, and style** as Home/About/Book/Contact.
- Marker: `SPEC: DESKTOP_NAV_SERVICES_FONT_PARITY`

### (6) Mobile nav Panel 1 — Services matches other pills and is not bold
Ensure “Services” on Mobile Panel 1 matches the exact font, size, style of other pill buttons, and is **not bold**.
- Marker: `SPEC: MOBILE_NAV_P1_SERVICES_FONT_PARITY`

### (7) Timings: speed up slightly (do not revert to fast)
Already handled in Timing Contract above. Ensure final values satisfy:
- slide >= 1200ms, stagger >= 250ms, reveal >= 400ms
- Marker: `SPEC: MOBILE_NAV_TIMINGS_TUNED`

### (8) services.html — CTA banner (bottom) KPI cards
8a) Make the 3 card titles blue (from white to blue):
- “Hours back each week”, “Fewer missed appointments”, “Faster lead response”
- Marker: `SPEC: SERVICES_CTA_KPI_TITLES_BLUE`

8b) For all 3 cards, the body text directly under titles must be **left-aligned**, while the titles remain **center-aligned**.
- Marker: `SPEC: SERVICES_CTA_KPI_BODY_LEFT_ALIGN`

### (9) Marquees: fix “touch required” rendering
Codex must determine why marquee content becomes fully displayed only after touch and fix it so:
- On mobile, marquee is visible and animating without any user interaction.
- By the time the user scrolls to the bottom, marquees are already moving smoothly.
- Common causes to check and eliminate:
  - marquee image lazy-loading (`loading="lazy"`) on marquee images
  - initialization gated behind touch/pointer/scroll handlers
  - CSS animation paused until interaction
  - container starts `opacity: 0` and only changes on interaction
  - missing explicit image sizing causing collapsed layout until repaint
- Marker: `SPEC: MARQUEE_NO_TOUCH_REQUIRED`

## Implementation map (where changes should happen)

Prefer `src/` and rebuild into `assets/`. Do not hand-edit generated bundles unless rebuild cannot reproduce.

Likely files:
- Mobile nav + desktop nav: `src/js/header-nav.js`, `src/css/components/header.css`
- Overlay: `src/css/base/variables.css`, `src/css/features/parallax.css`
- FAQ: `src/css/components/faq.css`
- Marquee: `src/js/marquee.js`, `src/js/app.js`, `src/css/features/marquee.css`
- Index + About + Services page CSS (page-level or component CSS under `src/css/**`)

## Phase plan with verification gates

### Phase 0 — Preflight (no edits)
Run:
- `bash scripts/codex.setup.sh`
- `bash scripts/codex.maintenance.sh`
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`

Gate:
- List the exact files you will touch for:
  - nav behavior (mobile + desktop)
  - overlay opacity
  - FAQ desktop centering
  - marquee touch fix
  - index/about/services page polish

### Phase 1 — Navigation correctness + timings + Services parity
Implement all mobile nav rules and desktop Services parity.

Gate (must pass):
- `node scripts/assert-ui-spec.js --strict`
- `node scripts/validate-niche-pages.js --strict`

### Phase 2 — Overlay opacity reduction (all pages)
Implement the global overlay reduction.

Gate:
- `node scripts/assert-ui-spec.js --strict`

### Phase 3 — Desktop FAQ centering + page polish (NEW points 1–4, 8)
Implement:
- Desktop FAQ centered without mobile overflow regression
- Index and About mobile centering fixes
- Index small-biz KPI title blue + footnote grey
- About “What Drives Us” image visibility on mobile
- Services CTA KPI banner title blue + body text left-aligned

Gate:
- `node scripts/assert-ui-spec.js --strict`

### Phase 4 — Marquee touch fix (NEW point 9)
Fix “touch required” behavior and ensure eager visibility and animation.

Gate:
- `node scripts/assert-ui-spec.js --strict`

### Phase 5 — Rebuild + full validation (must run at end)
Run:
- `npm run build:css`
- `npm run build:js`
- `node scripts/validate-niche-pages.js --strict`
- `node scripts/assert-ui-spec.js --strict`

## Final output requirements (Codex must report)
- Change log: what changed, where, why (paths)
- Commands run + pass/fail
- Requirements checklist PASS/FAIL:
  - panel direction contract
  - arrow contract
  - back button contract
  - timing contract
  - overlay opacity contract
  - NEW points 1–9
- Rollback guidance (commits to revert or file list grouped by phase)
