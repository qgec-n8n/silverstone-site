# ExecPlan: Parallax mobile hardening & URL-bar jump fix

**Status:** In progress (Codex must not change this to “Complete”)  
**Owner:** Codex for the Silverstone site  
**Scope:** Parallax sections and body-section backgrounds on `index.html`, `services.html`, and `niches/estate-agents.html`, focusing on mobile behavior and URL-bar “jumping”.

This ExecPlan is a follow-on to `estate-agents-bugfixes.ExecPlan.md` and must be run **after** that plan’s acceptance criteria are met.

---

## Purpose / Big Picture

This plan exists to:

- Refine the parallax background system across `index.html`, `services.html`, and `niches/estate-agents.html`.
- Eliminate or significantly reduce the **mobile URL-bar “jumping”** issue where background layers move abruptly as the browser chrome appears/disappears.
- Clean up obviously broken or duplicated parallax-related CSS/JS while preserving the existing visual design (dark overlays, hero imagery, section themes).
- Avoid the destructive, large diffs that prior runs made to `assets/css/styles.css`.

After this plan, users should see:

- Parallax sections that:
  - Behave smoothly on desktop.
  - Provide a subtle parallax-like feel on mobile without jumping when the URL bar appears/disappears.
- Background images that:
  - Use the correct assets for each theme (lines, waves, mesh, book, etc.).
  - Are not overly zoomed or duplicated across unrelated sections.
- A cleaner, more maintainable parallax implementation with fewer duplicated rules.

---

## Progress

Codex must keep this section up to date with timestamped entries. Phase 1 entries must be **analysis-only**.

Examples:

- [ ] (YYYY-MM-DDThh:mmZ) Phase 1: Mapped all `.parallax-section` instances and `data-parallax-theme` usage in `index.html`, `services.html`, `niches/estate-agents.html`.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 1: Documented parallax-related rules in `assets/css/parallax-fix.css` and parallax code paths in `assets/js/script.js`.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 1: Identified duplicated or broken parallax CSS/JS introduced by prior runs in `assets/css/styles.css`.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 2: Implemented minimal CSS/JS adjustments to stabilize mobile parallax and fix URL-bar jumping while preserving design.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 3: Validated parallax behavior on desktop and mobile for all three pages.

---

## Surprises & Discoveries

Record unexpected findings:

- Observation: Certain parallax mobile assets are referenced with root-relative vs page-relative URLs inconsistently, causing missing backgrounds on nested pages.
  - Evidence: Diff between `PARALLAX_MAP` entries in `assets/js/script.js` and CSS theme definitions.

- Observation: `assets/css/styles.css` contains multiple repeated parallax and service-row blocks with slightly different values, suggesting prior “merge of merges”.
  - Evidence: Pointers to duplicated selector blocks.

---

## Decision Log

Log key decisions and tradeoffs:

- Decision: Use a single, shared approach for mobile parallax heights that avoids direct dependence on `vh` where possible, to reduce URL-bar jump.
  - Rationale: Many mobile browsers adjust `vh` when the URL bar hides/shows.
  - Date/Author: YYYY-MM-DD / Codex

- Decision: Limit edits to `assets/css/styles.css` to small, parallax-related blocks instead of reformatting entire file.
  - Rationale: Avoid introducing new regressions in unrelated layouts.
  - Date/Author: YYYY-MM-DD / Codex

---

## Outcomes & Retrospective

After implementation and validation:

- Summarize changes to parallax behavior and any constraints discovered.
- Capture any remaining edge cases (e.g. specific devices where jumping is still noticeable) as follow-up issues.

---

## Context and Orientation

### Repository context (parallax-specific)

- **HTML**
  - `index.html` – main parallax sections and themes.
  - `services.html` – parallax sections for services blocks.
  - `niches/estate-agents.html` – parallax sections themed around `book` for Estate Agents.

- **CSS**
  - `assets/css/parallax-fix.css` – base parallax section positioning, layering, and overlays.
  - `assets/css/mobile.css` – mobile-specific adjustments that may affect section heights.
  - `assets/css/styles.css` – additional parallax-related selectors, some duplicated and noisy from prior runs.

- **JavaScript**
  - `assets/js/script.js` – parallax logic for mobile:
    - Uses `PARALLAX_MAP` (or similar) to map themes to mobile images.
    - Creates sticky background layers and updates on scroll.
  - `assets/js/hero-shader.js` – hero canvas, generally independent but visually coordinated.

- **Images**
  - `assets/images/internet/mobile/section-*.webp` – mobile parallax backgrounds for different themes.
  - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@*x.webp` – mobile hero for `book` theme.
  - Corresponding desktop hero/section images.

### Known issues

- URL-bar “jumping” on mobile:
  - The parallax background appears to move/jump when the browser chrome hides/shows.
- Prior Codex runs:
  - Introduced noisy modifications to `styles.css`, including duplicated parallax blocks and stray junk near the Calendly styles.

---

## Plan of Work

### Phase 1 – Analysis-only

1. Map parallax sections:
   - In each of `index.html`, `services.html`, `niches/estate-agents.html`:
     - List all `.parallax-section` elements and their `data-parallax-theme` values.
     - Note their approximate height and content.

2. Analyze CSS:
   - Read `assets/css/parallax-fix.css`:
     - Understand the base positioning, layering, and overlay behavior.
   - Read relevant parts of:
     - `assets/css/mobile.css` (section heights, media queries).
     - `assets/css/styles.css` (any `.parallax-section` overrides and duplicates).

3. Analyze JS:
   - Read parallax code in `assets/js/script.js`:
     - Understand how `PARALLAX_MAP` works.
     - Identify how mobile vs desktop is detected (media queries, `matchMedia`).
     - Identify any direct dependence on `vh` or viewport height that might be sensitive to URL-bar changes.

4. Document:
   - For each page:
     - Brief description of how the parallax effect currently works on desktop and on mobile, based on code.
   - For mobile:
     - Hypothesize why URL-bar changes cause jumping (e.g. computing stage height from `window.innerHeight` or `vh` units without accounting for environment changes).

### Phase 2 – Implementation

Goal: minimize changes while stabilizing mobile parallax.

1. Choose a strategy:
   - For example:
     - Use a fixed pixel or rem-based height for parallax stage on mobile instead of `vh`, or
     - Recompute heights only when necessary, or
     - Use CSS `background-attachment: scroll` with transform-based parallax instead of fixed backgrounds.

2. Implement changes:
   - In `assets/js/script.js`:
     - Adjust calculations that depend on viewport height for mobile parallax.
     - Ensure `PARALLAX_MAP` uses consistent asset paths that work for nested pages without duplication.
   - In `assets/css/parallax-fix.css` and related CSS:
     - Adjust any `vh`-based heights or fixed positions that amplify URL-bar changes.
     - Keep dark overlays and general visual design intact.

3. Clean up minimal parallax-related CSS noise:
   - In `assets/css/styles.css`:
     - Identify and, if safe, remove or consolidate **obviously duplicated** parallax blocks.
     - Do not refactor unrelated sections or reorder large parts of the file.

### Phase 3 – Validation

- For each of `index.html`, `services.html`, `niches/estate-agents.html`:

  1. Desktop:
     - Parallax sections still behave as originally intended (subtle background motion, correct images, overlays intact).

  2. Mobile (conceptual or via preview):
     - Simulate scrolling with the URL bar visible and hidden:
       - Background layers should not jump up/down abruptly.
       - The effect may be subtle but should feel stable.

- Confirm that:
  - Estate Agents-specific parallax and backgrounds remain correct.
  - No new layout issues or spacing regressions are introduced by these changes.

---

## Concrete Steps

Codex should expand this plan into detailed steps in `Progress`, making sure that:

- Phase 1 steps clearly show code reading and hypotheses.
- Phase 2 steps link specific changes to specific hypotheses.
- Phase 3 steps explicitly check each page and viewport.

---

## Validation and Acceptance

This plan is functionally complete when:

1. **Desktop parallax**
   - On `index.html`, `services.html`, `niches/estate-agents.html`:
     - Parallax sections display the intended backgrounds and overlays.
     - No obvious regressions from prior visual design.

2. **Mobile parallax**
   - On the same pages, in mobile viewport:
     - Parallax-like effect is present (subtle background motion or parallax).
     - Background layers do **not** jump or visually snap when the browser URL bar appears or disappears (to the extent possible given browser constraints).

3. **Background assets**
   - Each `data-parallax-theme` uses the correct asset set (lines, mesh, waves, book, etc.).
   - Nested pages (like `niches/estate-agents.html`) load mobile parallax images correctly (no 404s).

4. **Code cleanliness**
   - Parallax-related CSS/JS is in a more coherent state:
     - No obviously duplicated blocks left in `styles.css` if they were safe to dedupe.
     - No stray junk tokens like `j0px` in parallax-related regions.

If any acceptance criteria remain partially met (e.g. a specific mobile browser keeps a small jump), Codex must:

- Document that precisely in `Outcomes & Retrospective`.
- Suggest whether further work is needed or whether it’s acceptable as a browser quirk.

---

## Idempotence and Recovery

- Keep parallax changes localized and reversible.
- If a change causes regressions:
  - Record it in `Surprises & Discoveries`.
  - Revert or narrow the change, then try a smaller, more conservative adjustment.

---

## Artifacts and Notes

Codex may:

- Record performance or paint timing observations.
- Note specific browser/device combinations where behavior was tested (if available).

---

## Interfaces and Dependencies

Key interfaces for this plan:

- `.parallax-section[data-parallax-theme]` elements in HTML.
- Parallax-related CSS in:
  - `assets/css/parallax-fix.css`
  - Relevant portions of `assets/css/styles.css` and `assets/css/mobile.css`.
- Parallax logic in:
  - `assets/js/script.js`.

Codex must reference these precisely and avoid unrelated refactors.

This ExecPlan should only be run after `estate-agents-bugfixes.ExecPlan.md` has brought the site into a stable state for cookie banners, spacing, navigation, cards, counters, and imagery.
