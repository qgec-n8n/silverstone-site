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

# ExecPlan — Requested Website Edits (1–8): Stats + Parallax + Marquee Speeds + Pricing Animations

Follow gates in order. Do not skip validation gates. Specs are in **PLANS.md**; guardrails are in **AGENTS.md**.

## Mission
Implement exactly Requested Edits **1–8** (and nothing else):
1) about stats card → “30 Minute Automation Audit”
2) index add new stats row (copy + 4 cards)
3) counters only about + index stats (never niches)
4) double marquee significantly slower (top faster than bottom)
5) single marquee significantly slower
6) index pricing section 2 internal scroll + height match (like services)
7) pricing toggle price scroll animation on index/services/niches
8) niches mobile background parity: ensure the parallax body-section background image + overlay matches root pages on mobile

## Definition of Done
- All acceptance criteria in PLANS.md satisfied.
- Main build outputs regenerated:
  - `assets/css/styles.css`
  - `assets/js/app.js`
- Pricing widget outputs regenerated:
  - `assets/css/pricing-widget.css`
  - `assets/js/pricing-widget.js`
- `bash scripts/codex.requested-edits.sh` passes.
- Manual QA checks completed (see `codex/MANUAL_QA_CHECKLIST.md`).

---

## Gate 0 — Preflight baseline (measure)
1. Read `AGENTS.md`, `PLANS.md`, and this ExecPlan.
2. Run:
   - `bash scripts/codex.setup.sh`
3. Run baseline validator (expected to fail until changes are implemented):
   - `bash scripts/codex.requested-edits.sh`

Exit gate when:
- You have identified the exact insertion point in `index.html` for the new stats section (replace the commented “Proof in Numbers” block).
- You have identified the existing services section2 pricing scroll/height-match code in pricing widget sources (to mirror for index).

---

## Gate 1 — Content: about.html + index.html stats section (Edits 1–2)
### Implement
- **about.html**
  - In “Experience by the Numbers” stats row:
    - Replace the “Years Combined Experience” card with:
      - number target 30 (starts at 0)
      - label “Minute Automation Audit”
  - Add `data-counter="on"` to this `.stats` container.
- **index.html**
  - Remove the malformed commented “Proof in Numbers” block entirely (do not leave partial/unclosed comments).
  - Add the new stats section with:
    - Title: “No hype. Just measurable wins.”
    - Subtitle: exact sentence from PLANS.md
    - `.stats data-counter="on"`
    - 4 cards with targets: 525600, 780, 100, 80 (each starts at 0)

### Validate
- `node scripts/validate-requested-edits.js --strict` (expected to fail until later gates if it checks for built outputs)

Exit gate when:
- The HTML strings and targets match PLANS.md exactly.
- No `Proof in Numbers` substring remains in index.html.

---

## Gate 2 — Main JS: stats counters + mobile niche background parity (Edits 3 + 8)
### Implement (Edit 3)
- Update `src/js/stats.js` so it:
  - Animates only `.stats[data-counter="on"]`
  - Never touches `.stats[data-counter="off"]`
  - Supports `prefers-reduced-motion: reduce` (no animation; set final values)
  - Includes marker: `SS_STATS_SPEC: COUNTER_ANIMATION_ABOUT_INDEX_ONLY`

### Implement (Edit 8)
- Update `src/js/parallax.js` so that the **mobile** parallax stage background image URL resolves correctly from `niches/*.html`.
  - The parallax image must load from `assets/images/body_section_parallax/body-section-background-2025.webp` for nested pages too.
  - Do this by resolving the image URL relative to the loaded app.js bundle location (script-based resolution), not relative to the current document path.
  - Include marker: `SS_PARALLAX_SPEC: NICHE_MOBILE_BG_PARITY`

### Rebuild main JS
- `node scripts/build-js.js`

### Validate
- `node scripts/validate-requested-edits.js --strict`

Exit gate when:
- Validator confirms:
  - No niche page has `data-counter="on"`
  - stats.js includes required marker and gating
  - parallax.js includes required marker and robust URL resolution
  - built `assets/js/app.js` includes both markers

---

## Gate 3 — Marquee speeds (Edits 4–5)
### Implement
- In `src/css/features/marquee.css`:
  - Add marker: `SS_MARQUEE_SPEC: SPEEDS_SLOWER_SINGLE_DOUBLE`
  - Single marquee duration: 120s
  - Double marquee:
    - fast: 90s
    - slow: 150s
- Rebuild CSS:
  - `node build-css.js`

### Validate
- `node scripts/validate-requested-edits.js --strict`

Exit gate when:
- Validator confirms updated durations in both source CSS and built `assets/css/styles.css`.

---

## Gate 4 — Index pricing section 2: internal scroll + height match (Edit 6)
### Implement
- In `pricing-widget/src/pricing-widget.css`:
  - Mirror the `services.html` section 2 internal scroll rules for `index.html` section 2 only.
  - Add marker: `SS_PRICING_SPEC: INDEX_SECTION2_INTERNAL_SCROLL`
- In `pricing-widget/src/embed.jsx`:
  - Extend height-match logic (currently services-only) to also support:
    - `index.html` section 1 → section 2
  - Add marker: `SS_PRICING_SPEC: INDEX_SECTION2_HEIGHT_MATCH`
- Rebuild pricing widget:
  - `(cd pricing-widget && npm install && npm run build)`

### Validate
- `node scripts/validate-requested-edits.js --strict`
- `node scripts/validate-pricing-mounts.js` (ensures mounts/assets intact)

Exit gate when:
- Index section 2 has internal scrolling list region and section2 card heights match section1 on desktop/tablet widths (manual spot-check recommended here).

---

## Gate 5 — Pricing toggle price scroll animation (Edit 7)
### Implement
- In `pricing-widget/src/PricingWidget.jsx`:
  - Replace the plain `£{priceValue}` text rendering with a “scroll/roll” animation component that animates on value changes.
  - Must work for Monthly ↔ Setup toggles across all pages (section 1).
  - Add marker: `SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION`
  - Respect reduced motion.
- In `pricing-widget/src/pricing-widget.css`:
  - Add the required styles for the scroll/roll animation and reduced motion handling.
  - Add marker: `SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION`
- Rebuild pricing widget:
  - `(cd pricing-widget && npm run build)`

### Validate
- `node scripts/validate-requested-edits.js --strict`

Exit gate when:
- Validator confirms markers/classes exist in source and built assets.

---

## Gate 6 — Final verify + no-scope-creep closeout
1. Run the full required command:
   - `bash scripts/codex.requested-edits.sh`
2. Perform manual QA:
   - `codex/MANUAL_QA_CHECKLIST.md`

Exit gate when:
- All validations pass.
- Manual QA checks pass.
- No unrelated files changed.

---

## Decision Log (must keep updated during implementation)
Record any ambiguity resolutions here (do not ask the user questions; choose simplest valid interpretation aligned to PLANS.md).

- (empty by design; populate during execution)

