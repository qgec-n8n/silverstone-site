<!-- PLANS.md -->

# PLANS – ExecPlan & slice breakdown for `silverstone-site-main`

This document tells Codex (and human contributors) **how to use ExecPlans** in this repository and provides a **slice‑level breakdown** of the refactor work for `silverstone-site-main`.

## 1. How ExecPlans are used in this repo

- ExecPlans are detailed design documents that a coding agent can follow from design through implementation.
- The canonical ExecPlan for the Estate Agents refactor lives at:
  - `./ExecPlan.md`
- ExecPlans in this repo must:
  - Be self‑contained and understandable to a novice.
  - Describe observable outcomes and how to validate them.
  - Be updated as work progresses (especially the `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` sections).
- When implementing a complex refactor (like the Estate Agents work), Codex should:
  - Read `AGENTS.md`, `PLANS.md`, `ExecPlan.md`, `RULES.md`, `TESTS_PLAN.md`, and `ESTATE-AGENTS-NOTES.md` before making changes.
  - Follow the slices and subtasks in this document.
  - Keep ExecPlans in sync with reality as tasks complete.

## 2. Non‑negotiable requirements for work guided by this PLANS.md

- **Visual parity first**: Except for explicitly documented bugs, the site must look and behave identically after each slice.
- **Small diffs**: Prefer many small, reviewable patches over large sweeping edits.
- **Tests as gatekeepers**: Tests from `TESTS_PLAN.md` (V*, F*, D*) must be implemented and used to validate changes before moving to later slices.
- **Page‑scoped overrides**: For Estate Agents work, prefer page‑scoped CSS (e.g., `.page-estate-agents`) instead of editing global base rules early.
- **No new `!important`**: Avoid adding new `!important` rules except when explicitly permitted by `RULES.md`, and even then, treat it as a last resort.

## 3. Refactor slices overview

The refactor is broken into slices that can be executed sequentially. Each slice references:

- **Scope**: Files and areas in play.
- **Rules of engagement**: Constraints drawn from `RULES.md`.
- **Tests**: Visual (V*), E2E (F*), DOM (D*).

### Slice 0 – Tests & visual baselines

**Goal:** Establish a thin but strong safety net (tests) before changing CSS/JS.

- **Scope:**
  - `package.json`
  - New `tests/` directory (e.g., `tests/e2e`, `tests/dom`, `tests/visual`)
  - Possibly `netlify.toml` (if any CI hooks are later added; optional)
- **Rules of engagement:**
  - No CSS or JS behavioural changes in this slice; only additions for tests and tooling.
  - Do not alter production assets except minimally (e.g., add `data-testid` attributes if tests genuinely require them, and only with care).
- **Subtasks:**
  1. Add test dependencies (Playwright, Vitest/Jest, axe/Lighthouse harness) to `package.json`.
  2. Create the directory structure under `tests/`.
  3. Implement DOM tests D1–D7.
  4. Implement E2E flows F1–F6.
  5. Implement visual regression scenarios V1–V10 (screenshot comparisons).
  6. Add scripts to `package.json`:
     - `test:dom`, `test:e2e`, `test:visual`, `test:accessibility` (names may be adjusted as long as ExecPlan and docs match).
- **Tests to run at the end of this slice:**
  - D1–D7, F1–F6, V1–V10 (dom/e2e/visual commands).
  - Optional: Accessibility checks on key pages.

### Slice 1 – Estate card background unification

**Goal:** Make all cards on the Estate Agents page share the same dark, opaque background as the “Show the numbers, not just promises” cards.

- **Scope:**
  - `niches/estate-agents.html`
  - `assets/css/custom.css` or a new Estate‑specific CSS section/file
  - Possibly existing inline `<style>` in `niches/estate-agents.html`
- **Rules of engagement (see `RULES.md`):**
  - Do **not** change the global `.neon-card` base styles in `assets/css/styles.css` in this slice.
  - Use a page‑scoped wrapper (e.g., `.page-estate-agents`) or section‑specific classes/IDs to apply the dark background.
  - Avoid using `!important` for new rules.
- **Subtasks:**
  1. Confirm the wrapper class or add one around Estate page content.
  2. Identify all Estate card types (e.g., `.neon-card`, `.dark-card`, stats cards, pricing cards).
  3. Add page‑scoped CSS that applies a single card background and relevant text color.
  4. Remove or simplify any redundant inline card background styles on Estate agents while keeping tests green.
- **Tests for this slice:**
  - Visual: V2 (“Estate Agents – cards & stats (desktop & mobile)”).
  - E2E: F2–F3 (Estate flows that hit cards).
  - DOM: D6 (stats counter behaviour) to ensure card refactors don’t break scripts.

### Slice 2 – Estate section spacing normalization

**Goal:** Fix vertical gaps between the specific Estate sections without altering global spacing.

- **Scope:**
  - `niches/estate-agents.html`
  - Estate‑specific CSS in `assets/css/custom.css` or a dedicated file
- **Rules of engagement:**
  - Do **not** change global `section` padding/margin or `.section` in `assets/css/styles.css` yet.
  - Use section IDs or page‑scoped selectors to adjust only the problematic gaps.
- **Subtasks:**
  1. Identify the three problematic section transitions and their selectors.
  2. Add targeted CSS to reduce the gap (e.g., tweak margin/padding on those specific sections).
  3. Verify that other Estate section transitions still use the baseline gap.
- **Tests:**
  - Visual: V3 (“Estate Agents – Pricing + FAQs gap (desktop)”).
  - E2E: Any flow that scrolls through these sections (F1–F3).
  - Manual: Quick eyeball check on Desktop & common mobile width.

### Slice 3 – Estate hero mobile background

**Goal:** Ensure the Estate Agents **mobile** hero uses `book-hero-calendly-mobile-2025@*x.webp` (or the appropriate mobile hero asset) and participates correctly in parallax/mobile behaviour.

- **Scope:**
  - `niches/estate-agents.html` (hero markup)
  - `assets/css/hero-base.css`
  - `assets/css/mobile.css`
  - `assets/css/parallax-fix.css`
- **Rules of engagement:**
  - Do not break hero backgrounds on other pages (`index.html`, `book.html`, etc.).
  - Use existing parallax/mobile patterns; avoid copy‑pasting new ad‑hoc mobile background rules.
- **Subtasks:**
  1. Document how the existing book hero uses the mobile hero asset and parallax classes.
  2. Apply the same pattern (or a safe variant) to the Estate hero.
  3. Confirm correct behaviour at typical mobile widths (e.g., 375px, 414px).
- **Tests:**
  - Visual: V1 (Estate hero desktop), V4 (Estate hero mobile).
  - E2E: F1–F3 (flows that land on the Estate hero).

### Slice 4 – Cookie banner stability & persistence

**Goal:** Ensure the cookie banner behaves correctly (shows once, no scroll flicker, persists across pages).

- **Scope:**
  - `assets/js/cookie-consent.js`
  - Any relevant CSS controlling banner positioning (likely `assets/css/styles.css` or `custom.css`)
  - Banner markup in HTML pages (selector consistency)
- **Rules of engagement:**
  - Preserve existing storage keys and semantics for Accept/Decline unless tests and docs are updated.
  - Avoid introducing new dependencies; keep logic simple and readable.
  - Do not change banner text or layout except if required to fix flicker/positioning.
- **Subtasks:**
  1. Map current banner behaviour across pages (especially Estate Agents) using tests and manual runs.
  2. Stabilize scroll behaviour (e.g., avoid re‑creating/destroying the banner on scroll events).
  3. Ensure Accept/Decline is persisted (likely in localStorage) and read on all pages.
- **Tests:**
  - DOM: D1–D3 (cookie banner tests).
  - E2E: F1–F3, F6 (flows covering cookie behaviour).

### Slice 5 – Header/nav & Services dropdown alignment (desktop + mobile)

**Goal:** Fix misalignment and styling inconsistencies for the Services nav item and mobile Services pill without breaking nav behaviour.

- **Scope:**
  - `assets/css/styles.css`, `assets/css/services.css`, `assets/css/mobile.css`
  - `assets/js/script.js` (for nav/overlay behaviour)
  - Header markup in HTML (nav items and Services overlay)
- **Rules of engagement:**
  - Maintain ARIA attributes and existing JS hooks (IDs, classes, data attributes).
  - Avoid global nav colour/typography changes that would affect all links unless needed.
  - Mobile pills: ensure Services pill uses same font, alignment, and spacing as other pills.
- **Subtasks:**
  1. Document current nav structure and classes for Services desktop and mobile.
  2. Adjust CSS so Services desktop link aligns vertically with its siblings.
  3. Adjust CSS for mobile Services pill to match other pills’ typography and layout.
- **Tests:**
  - Visual: V5 (Home hero + nav), V7 (Services hero + overlay).
  - DOM: D4–D5 (nav and overlay tests).
  - E2E: F1–F5 (any flow using nav).

### Slice 6 – Book & Contact UX hardening

**Goal:** Ensure Booking (Calendly) and Contact flows are robust and clearly communicate success/failure.

- **Scope:**
  - `book.html`
  - `contact.html`
  - `assets/js/script.js` if it interacts with these sections
  - `netlify/functions/send-email.js` (API contract)
- **Rules of engagement:**
  - Do not break the Netlify function’s interface.
  - Keep user‑visible text and semantics consistent unless there is a clear UX reason to adjust.
- **Subtasks:**
  1. Confirm Calendly iframe or embed is visible and responsive across breakpoints.
  2. Ensure no CSS rules hide or clip the Calendly section on mobile.
  3. Verify the contact form JS:
     - Submits via fetch/XHR as expected.
     - Shows success and error states.
     - Handles validation gracefully.
- **Tests:**
  - Visual: V8–V10.
  - DOM: D7 (contact form behaviour).
  - E2E: F4–F6.

### Slice 7 – Estate CSS consolidation (page‑scoped)

**Goal:** Simplify and centralize Estate‑specific CSS, reducing inline styles and scattered overrides.

- **Scope:**
  - Inline `<style>` in `niches/estate-agents.html`
  - Estate sections within global CSS files:
    - `assets/css/custom.css`
    - Potentially a new `assets/css/estate-agents.css` if warranted
- **Rules of engagement:**
  - Only refactor CSS **after** slices 1–3 have stabilized card backgrounds and spacing under tests.
  - Keep page‑scoped selectors (`.page-estate-agents`) and avoid introducing new global selectors.
- **Subtasks:**
  1. Identify all Estate‑specific CSS rules across files and inline styles.
  2. Move them into a dedicated section/file using consistent naming.
  3. Remove dead or redundant CSS once tests confirm no visual changes.
- **Tests:**
  - All relevant Estate tests: V1–V4, V2–V3, F1–F3, D1–D3, D6.

### Slice 8 – Optional global CSS/JS cleanup

**Goal:** Carefully modernize and re‑organize global CSS/JS to reduce complexity while keeping behaviour identical.

- **Scope:**
  - `assets/css/styles.css`, `assets/css/mobile.css`, `assets/css/custom.css`
  - `assets/js/script.js` (non‑Estate, non‑cookie, non‑nav logic)
- **Rules of engagement:**
  - Only attempt this once slices 0–7 are fully green and stable.
  - Make changes in small steps (e.g., introduce new utilities, then gradually adopt them).
  - Preserve behaviour; new “features” are out of scope.
- **Subtasks:**
  1. Identify global CSS “god file” sections that can be split by role (base/layout/components/utilities).
  2. Introduce light‑weight tokens (colours, spacing) where there is obvious duplication.
  3. Modernize layout where safe (flex/grid) based on `RULES.md`.
- **Tests:**
  - Run **all** tests (V, F, D, accessibility/performance) after each batch of changes.
  - Be ready to revert if regressions are detected.

## 4. How to use this PLANS.md

When running Codex on this repository:

1. Start in the repository root.
2. Ensure `AGENTS.md`, `ExecPlan.md`, `PLANS.md`, `RULES.md`, `TESTS_PLAN.md`, and `ESTATE-AGENTS-NOTES.md` are all present.
3. Ask Codex (or configure via CLI) to:
   - Read `AGENTS.md` and `PLANS.md`.
   - Follow the slices in order.
   - For each slice, update `ExecPlan.md` as work proceeds.
4. Use `TESTS_PLAN.md` to interpret test IDs (V*, F*, D*).
5. Avoid skipping slices; each builds safety and structure needed by the next.
