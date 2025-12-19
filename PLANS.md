<!-- FILE: PLANS.md -->
# Specification — Requested Website Edits (1–8) (Single Source of Truth)

This document is the **only** product scope for the current Codex run.

## Global constraints (apply to every change)
- Implement **only** Requested Edits 1–8. No additional UI/UX changes.
- Keep diffs small and localized.
- Rebuild committed outputs after source changes:
  - `assets/css/styles.css`
  - `assets/js/app.js`
  - `assets/css/pricing-widget.css`
  - `assets/js/pricing-widget.js`
- Add required marker comments (listed below) exactly, to enable deterministic validation.

## Assumptions (explicit; do not ask follow-ups)
- “30 Minute Automation Audit” in the about.html stats row is represented as:
  - Number: `30`
  - Label: `Minute Automation Audit`
  so the rendered card reads as “30 Minute Automation Audit”.
- The pricing toggle exists only in pricing section 1 (the widget already renders the toggle only for `sectionId === "1"`).  
  Therefore, the “Setup/Monthly” price scroll animation applies to **all pages’ section 1 pricing cards** across `index.html`, `services.html`, and `niches/*.html`.
- Mobile niche background parity (Edit 8) is achieved by making the shared mobile-parallax background image URL resolution work correctly on nested pages (`/niches/*`) without per-page HTML hacks.

---

## Required markers (must exist exactly)
These markers are required so scripts can validate changes without a browser.

### Stats (main site)
- In `src/js/stats.js` add:
  - `SS_STATS_SPEC: COUNTER_ANIMATION_ABOUT_INDEX_ONLY`

### Parallax mobile niche background parity (main site)
- In `src/js/parallax.js` add:
  - `SS_PARALLAX_SPEC: NICHE_MOBILE_BG_PARITY`

### Marquee speeds
- In `src/css/features/marquee.css` add:
  - `SS_MARQUEE_SPEC: SPEEDS_SLOWER_SINGLE_DOUBLE`

### Pricing widget
- In `pricing-widget/src/PricingWidget.jsx` add:
  - `SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION`
- In `pricing-widget/src/pricing-widget.css` add:
  - `SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION`
  - `SS_PRICING_SPEC: INDEX_SECTION2_INTERNAL_SCROLL`
- In `pricing-widget/src/embed.jsx` add:
  - `SS_PRICING_SPEC: INDEX_SECTION2_HEIGHT_MATCH`

---

# Requested Edit 1
## about.html: “Experience by the Numbers” — change the “10 Years of Combined Experience” card to “30 Minute Automation Audit”

### Targets
- `about.html` (only)

### Required change (exact intent)
In the `.stats` row under “Experience by the Numbers”:
- Replace the 4th stat card:
  - From label: `Years Combined Experience` and target `10`
  - To label: `Minute Automation Audit` and target `30`
- Ensure the card’s number element continues to use:
  - `<div class="number" data-target="...">0</div>` (start at `0` for animation)

### Additional requirement for Edit 3 (counter gating)
- Add `data-counter="on"` to the `.stats` container on about.html.

### Acceptance criteria
- about.html contains **no** `Years Combined Experience`
- about.html contains:
  - `data-target="30"` within the relevant stats card
  - label text `Minute Automation Audit`
- The `.stats` container for this section is `data-counter="on"`

---

# Requested Edit 2
## index.html: Add a numbers/stats row (same styling as about.html) with specified copy

### Targets
- `index.html` (only)

### Required section copy (exact)
- Section Title: `No hype. Just measurable wins.`
- Section Subtitle (one sentence, exactly):
  `If you’re sceptical about AI, start with the basics: we build simple automation that answers calls, follows up leads and chases admin in the background, so small teams can win back time, reduce no-shows and respond instantly — even outside office hours.`

### Required cards (exact intent)
Use the same markup/styling pattern as `about.html` stats cards:
- Card 1:
  - Number target: `525600`
  - Label: `Minutes of Always-On Coverage`
- Card 2:
  - Number target: `780`
  - Label: `Potential Hours Reclaimed Per Year`
- Card 3:
  - Number target: `100`
  - Label: `Times Better Contact Odds in 5 Minutes`
- Card 4:
  - Number target: `80`
  - Label: `Callers Lost to Voicemail`

### Placement guidance (scope-safe)
- Replace/remove the currently commented-out “Proof in Numbers” block (do not leave malformed/unclosed HTML comments).
- Insert the new section near the same location (after the “Streamline. Optimize. Succeed.” features block is acceptable).

### Additional requirement for Edit 3 (counter gating)
- The new `.stats` container on index.html must be `data-counter="on"`.

### Acceptance criteria
- index.html includes the exact title and subtitle sentence above.
- index.html includes a `.stats` container with `data-counter="on"`.
- index.html includes exactly the four required `data-target` numbers: 525600, 780, 100, 80.
- index.html no longer contains the substring `Proof in Numbers` (remove the old commented block entirely).

---

# Requested Edit 3
## Add a counter animation ONLY for about.html + index.html stats; never niches/*

### Targets
- `src/js/stats.js`
- `about.html`, `index.html`
- Explicitly NOT: `niches/*.html`

### Required behavior
- Counter animation runs only for `.stats[data-counter="on"]`.
- Any `.stats[data-counter="off"]` is never animated and must not be mutated.
- If `prefers-reduced-motion: reduce` is enabled:
  - No animation; set final values immediately (for `data-counter="on"` sections).

### Implementation constraints (hard)
- Do **not** add counters to niches:
  - Do not remove `data-counter="off"` from any `niches/*.html`.
  - Do not introduce `data-counter="on"` anywhere except about.html and index.html.

### Acceptance criteria
- All niche pages still contain `.stats` with `data-counter="off"` and none contain `data-counter="on"`.
- `src/js/stats.js` contains marker `SS_STATS_SPEC: COUNTER_ANIMATION_ABOUT_INDEX_ONLY`.
- `assets/js/app.js` contains that marker after rebuild.

---

# Requested Edit 4
## Double marquee: make both layers significantly slower; top still faster than bottom

### Targets
- `src/css/features/marquee.css` (only)

### Required change (exact)
Update animation durations to:
- Top layer (`.double-marquee .marquee-track.fast`): **90s**
- Bottom layer (`.double-marquee .marquee-track.slow`): **150s**
Keep the class relationship the same (top uses `.fast`, bottom uses `.slow`), ensuring top remains faster than bottom.

### Acceptance criteria
- `src/css/features/marquee.css` contains marker `SS_MARQUEE_SPEC: SPEEDS_SLOWER_SINGLE_DOUBLE`.
- Double marquee durations are exactly:
  - fast: 90s
  - slow: 150s
- `assets/css/styles.css` contains those updated durations after rebuild.

---

# Requested Edit 5
## Single marquee: make it significantly slower

### Targets
- `src/css/features/marquee.css` (only)

### Required change (exact)
Update single marquee track duration:
- `.single-marquee .marquee-track` from 60s → **120s**

### Acceptance criteria
- Single marquee duration is exactly 120s in `src/css/features/marquee.css`.
- `assets/css/styles.css` contains the updated duration after rebuild.

---

# Requested Edit 6
## index.html: pricing section 2 internal scroll like services.html; keep section 2 from pushing page down; match section 1 card heights

### Targets
- `pricing-widget/src/pricing-widget.css`
- `pricing-widget/src/embed.jsx`

### Required behavior
On `index.html` pricing **section 2** only:
- The “other plans” list area scrolls internally (do not scroll the full card).
- Section 2 cards match the height of section 1 cards at desktop/tablet widths (same approach as services.html).
- Must be scoped only to:
  - `.ss-pricing[data-ss-pricing-page="index.html"][data-ss-pricing-section="2"]`

### Implementation guidance (repo-aligned)
- Mirror the existing services.html section2 approach:
  - CSS overflow on `.ss-pricing__includes-body`
  - Height matching via `--ss-pricing-match-height` computed from section 1 cards
  - Desktop-only height matching via media query (min-width 781px is already used)

### Acceptance criteria
- `pricing-widget/src/pricing-widget.css` includes marker `SS_PRICING_SPEC: INDEX_SECTION2_INTERNAL_SCROLL`.
- CSS includes index-scoped selectors for section 2 internal scroll and height rule using `--ss-pricing-match-height`.
- `pricing-widget/src/embed.jsx` includes marker `SS_PRICING_SPEC: INDEX_SECTION2_HEIGHT_MATCH` and implements height matching for `index.html` analogous to services.
- After rebuild, `assets/css/pricing-widget.css` includes the index-scoped rules.

---

# Requested Edit 7
## Pricing sections on index/services/niches: clicking Setup/Monthly updates prices with a scroll animation

### Targets
- `pricing-widget/src/PricingWidget.jsx`
- `pricing-widget/src/pricing-widget.css`

### Required behavior (exact intent)
When the user toggles:
- Monthly ↔ Setup
the displayed price value in each pricing card scroll-animates to the new value (vertical “roll/scroll” effect).

### Constraints
- Must not change pricing copy sources.
- Must respect reduced motion:
  - If `prefers-reduced-motion: reduce`, do not animate; swap instantly.
- Must be applied universally wherever section 1 pricing cards render:
  - `index.html`, `services.html`, and all `niches/*.html`

### Acceptance criteria
- `pricing-widget/src/PricingWidget.jsx` includes marker `SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION`.
- `pricing-widget/src/pricing-widget.css` includes marker `SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION`.
- A dedicated CSS/DOM structure exists for the rolling number (validator checks class names).
- After rebuild:
  - `assets/js/pricing-widget.js` contains the marker
  - `assets/css/pricing-widget.css` contains the marker

---

# Requested Edit 8
## niches/*.html: Mobile background image + overlay must match root pages (services/index/about/book/contact)

### Problem statement (what must be fixed)
On mobile viewports, `niches/*.html` pages do not visibly show the parallax body-section background image:
- `assets/images/body_section_parallax/body-section-background-2025.webp`

Result: niches pages appear as if the background image is missing (often showing only a dark layer).

### Targets (preferred minimal fix)
- `src/js/parallax.js` (primary)
- Rebuild:
  - `assets/js/app.js` via `node scripts/build-js.js`

### Required behavior (exact intent)
- On mobile (<= 768px) niches pages must display the same parallax background image and dark overlay as root pages.
- Fix must work from nested paths (`/niches/*`) without adding per-page background hacks.
- Overlay must remain consistent with the existing parallax system (same overlay gradient + opacity).

### Implementation constraint (hard)
- The mobile parallax image URL must resolve correctly regardless of page directory depth:
  - Root pages at `/`
  - Niche pages under `/niches/`
- Implement by resolving the image URL relative to the location of the loaded main JS bundle (app.js) so it works from any directory depth.

### Acceptance criteria (deterministic + manual)
Deterministic (validator-enforced):
- `src/js/parallax.js` contains marker `SS_PARALLAX_SPEC: NICHE_MOBILE_BG_PARITY`.
- `src/js/parallax.js` uses robust URL resolution (validator checks for URL constructor usage and script-based resolution).
- `assets/js/app.js` contains marker after rebuild.
- The image file exists at:
  - `assets/images/body_section_parallax/body-section-background-2025.webp`

Manual (must be checked):
- On a mobile viewport, open:
  - `services.html` and at least 2 niche pages
- Confirm niche pages show the same background image and overlay appearance as services/root pages.

---

## Validation (must pass at end)
Run:
- `bash scripts/codex.requested-edits.sh`

It must pass with exit code 0.
