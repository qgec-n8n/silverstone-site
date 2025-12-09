<!-- ExecPlan.md -->

# Pixel‑safe refactor of `silverstone-site-main` (Estate Agents, nav, and CSS/JS architecture)

This ExecPlan is a living document. The sections **Progress**, **Surprises & Discoveries**, **Decision Log**, and **Outcomes & Retrospective** must be kept up to date as work proceeds.

This plan must be maintained in accordance with `PLANS.md` at the repository root, which describes how ExecPlans are authored and used in this project. A coding agent (Codex) or human contributor must always read both `ExecPlan.md` and `PLANS.md` before making changes guided by this plan.

---

## Purpose / Big Picture

The goal of this ExecPlan is to **safely refactor the CSS and JavaScript for `silverstone-site-main`** so that:

- The **Estate Agents** page (`niches/estate-agents.html`) behaves and looks correct on desktop and mobile.
- The **header / nav**, **Services dropdown & overlay**, **cookie banner**, and **Book / Contact flows** remain stable and predictable.
- The rest of the site (`index.html`, `services.html`, `book.html`, `contact.html`, `about.html`, `privacy-policy.html`) **retains its current visual appearance and behaviour**, except where we explicitly fix documented bugs.
- The codebase becomes easier to maintain via:
  - Page‑scoped CSS overrides instead of global hacks.
  - Reduced reliance on `!important`.
  - Clear JS responsibilities per feature (cookie banner, nav, stats, forms).
  - A minimal but meaningful test suite (visual, E2E, DOM, accessibility/performance).

After completing this plan, a non‑developer site owner should be able to request future layout tweaks or bug fixes with a much lower risk of regressions, and Codex should be able to work safely in this repo using the tests and rules of engagement defined here.

---

## Progress

Use this section as the single source of truth for work state. Every time work pauses, update the checklist, splitting items into “done” vs “remaining” as needed. Timestamps are in UTC.

- [x] (2025‑12‑09 00:00Z) Initial ExecPlan drafted for `silverstone-site-main`. No code changes yet; this file and support docs (`PLANS.md`, `AGENTS.md`, `RULES.md`, `TESTS_PLAN.md`, `ESTATE-AGENTS-NOTES.md`) created.
- [ ] Slice 0 – Test & visual baselines implemented (V1–V10, F1–F6, D1–D7 wired up; basic Lighthouse/axe checks scripted).
- [ ] Slice 1 – Estate Agents card backgrounds unified via page‑scoped CSS; all cards match the “Show the numbers, not just promises” section.
- [ ] Slice 2 – Estate Agents vertical spacing normalized between specific sections without altering global section spacing.
- [ ] Slice 3 – Estate Agents mobile hero background integrated, reusing the existing book hero mobile image/parallax system.
- [ ] Slice 4 – Cookie banner made stable (no flicker on Estate Agents, correct persistence across all pages).
- [ ] Slice 5 – Header/nav & Services dropdown/overlay alignment corrected on desktop and mobile.
- [ ] Slice 6 – Book & Contact flows hardened (Calendly visibility, contact status messages, no broken JS).
- [ ] Slice 7 – Estate Agents CSS consolidated into page‑scoped styles; inline `<style>` minimized.
- [ ] Slice 8 – Optional global CSS/JS cleanup (careful restructuring of `styles.css`, `mobile.css`, and relevant JS with full test coverage).
- [ ] Final pass of Lighthouse/axe on key pages; documentation updates to reflect new structure and testing commands.

---

## Surprises & Discoveries

Record any unexpected behaviours or design discoveries encountered while executing the plan. Include short evidence (e.g., test output snippets, layout screenshots, brief code excerpts).

- Observation: _To be filled during implementation._
  - Evidence: _Add relevant logs/test output here._

---

## Decision Log

Record every notable decision along with rationale and timestamp.

- Decision: Use page‑scoped CSS overrides for Estate Agents (`.page-estate-agents` wrapper) instead of changing global `.neon-card` or `section` rules in early slices.
  - Rationale: Minimizes cross‑page regressions and keeps other marketing pages visually identical while we fix Estate Agents‑only bugs.
  - Date/Author: 2025‑12‑09 / ExecPlan author.

- Decision: Introduce a small but high‑value test suite (visual, E2E, DOM) before any large refactors.
  - Rationale: Provides guardrails for visual parity and behaviours on the Estate Agents page and main funnels (Home→Services→Estate→Book/Contact).
  - Date/Author: 2025‑12‑09 / ExecPlan author.

_Add further decisions here as Codex or human contributors refine the implementation._

---

## Outcomes & Retrospective

Summarize outcomes after major milestones or at completion.

At the end of this ExecPlan, this section should explain:

- Which Estate Agents bugs were fixed and how they were validated.
- How much CSS/JS was simplified and how the new structure improves maintainability.
- Any remaining known issues and suggested follow‑up ExecPlans.

_Initially empty; to be filled as work concludes._

---

## Context and Orientation

Treat the reader as a complete beginner to this repository.

### Repository overview

- Root: `silverstone-site-main/`
- Hosting: Static site on Netlify (see `netlify.toml` and `netlify/functions/send-email.js`).
- HTML entry points:
  - `index.html` – Home / main marketing page.
  - `services.html` – Services overview (includes Services overlay).
  - `niches/estate-agents.html` – Estate Agents niche landing page (top priority).
  - `book.html` – Booking page with Calendly embed.
  - `contact.html` – Contact form (Netlify function backed).
  - `about.html`, `privacy-policy.html` – Additional content pages.

### CSS structure (key files)

- `assets/css/styles.css` – Large global “god file” with base styles, layout, typography, cards, hero sections, etc. Contains many `!important` rules.
- `assets/css/mobile.css` – Mobile overrides and breakpoints, especially for layout and hero backgrounds.
- `assets/css/custom.css`, `assets/css/custom-styles.css` – Additional global and component tweaks.
- `assets/css/parallax-fix.css`, `assets/css/hero-base.css` – Parallax and hero base behaviour/shared styles.
- `assets/css/services.css` – Services overlay and related components.
- `assets/css/marquee-*.css`, `assets/css/premium-gallery.css`, `assets/css/neural-grid.css` – Visual flourishes (marquee, gallery, neural grid).
- Inline `<style>` inside `niches/estate-agents.html` – Estate‑specific overrides (`.dark-card`, section spacing tweaks, etc.).

### JS structure (key files)

- `assets/js/script.js` – Main JS entry:
  - Nav and Services overlay toggling.
  - Scroll behaviours.
  - Stats counters.
  - Some parallax helper logic and class toggling.
- `assets/js/cookie-consent.js` – Cookie banner show/hide and persistence logic.
- `assets/js/hero-shader.js`, `assets/js/premium-gallery.js`, `assets/js/marquee-*.js`, `assets/js/neural-grid.js`, `assets/js/magnetic-buttons.js` – Hero, marquee, gallery, grid, and button interactions.
- Inline contact form JS inside `contact.html` – Submits to `netlify/functions/send-email.js`, shows success/error messages.

### Key patterns

- Header and nav: Shared across pages via common markup (`.site-header`, `.nav-links`, `.nav-item`, `.services-toggle`), with a mobile nav overlay and Services pill buttons.
- Cookie banner: A bottom‑aligned banner (likely `.cookie-banner` / similar IDs/classes) controlled by `cookie-consent.js`.
- Cards: `.neon-card` in various sections (pain points, stats, pricing, FAQs). Estate Agents has additional modifiers (e.g., `.dark-card`, `.compact-section`, `.stats`).
- Sections: `.section`, `.section.bg-*`, parallax sections with `data-parallax-theme`.
- Estate Agents page: Combination of hero, “Where deals leak away”, “Show the numbers, not just promises” stats, “The branch experience after launch”, “Plug, personalise, launch”, “The ‘Never Miss a Viewing’ pack”, “Safe, compliant, and fully supported”, pricing, FAQs, and CTAs.

### Known issues to address

On `niches/estate-agents.html`:

- Cookie banner:
  - Flickers and appears/disappears on scroll.
  - Does not consistently respect Accept/Decline persistence.
- Vertical spacing:
  - Excess gaps between specific sections compared with others (e.g., between “The branch experience after launch” and “Plug, personalise, launch”; between “Pricing” and “FAQs”; and between “The ‘Never Miss a Viewing’ pack” and “Show the numbers, not just promises”).
- Card backgrounds:
  - Some cards are lighter/more transparent than the dark cards in “Show the numbers, not just promises”.
- Nav / Services button:
  - Desktop Services dropdown button is slightly misaligned vertically relative to other nav items.
  - Mobile Services pill styling does not match other pills (font, alignment, color).
- Mobile hero:
  - Estate Agents mobile hero lacks the expected background image (`book-hero-calendly-mobile-2025@*x.webp`) and may not participate correctly in the parallax/mobile background system.

Further details, including desired outcomes and constraints, are captured in `ESTATE-AGENTS-NOTES.md` and `RULES.md`.

---

## Plan of Work

This section narrates the refactor in **incremental slices** (“strangler” pattern). Each slice targets a small, observable improvement, while tests protect the rest of the site.

The slices are also enumerated and broken down into subtasks in `PLANS.md`:

1. **Slice 0 – Tests & baselines**  
   - Introduce a minimal test harness (e.g., Playwright + a basic DOM test runner).  
   - Implement visual regression scenarios V1–V10, E2E flows F1–F6, and DOM interaction tests D1–D7 (described in `TESTS_PLAN.md`).  
   - Ensure these tests can run locally and are described in `README`/`TESTS_PLAN.md`.

2. **Slice 1 – Estate card background unification**  
   - Introduce or refine a page‑scoped selector (e.g., `.page-estate-agents`) wrapping Estate content.  
   - Apply consistent dark/opaque card background via Estate‑specific CSS (without touching global `.neon-card` in early slices).  
   - Verify via V2 (“Estate Agents – cards & stats (desktop + mobile)”) and relevant E2E flows.

3. **Slice 2 – Estate section spacing normalization**  
   - Adjust spacing between the specific Estate sections with problematic gaps using page‑scoped selectors (e.g., `.page-estate-agents .section` or more specific section IDs).  
   - Avoid modifying the global `section` base spacing until later slices.  
   - Verify via V3 (“Estate Agents – Pricing + FAQs spacing”) and flows touching those sections.

4. **Slice 3 – Estate hero mobile background**  
   - Wire the Estate Agents hero into the existing hero/parallax mobile background system used on other pages (`hero-base.css`, `parallax-fix.css`, `mobile.css`).  
   - Ensure `book-hero-calendly-mobile-2025@*x.webp` is used on mobile for the Estate hero, while desktop hero remains unchanged.  
   - Verify via V1 (Estate hero desktop), V4 (Estate hero mobile), and E2E flows that hit the hero.

5. **Slice 4 – Cookie banner stability & persistence**  
   - Refine `assets/js/cookie-consent.js` and any CSS hooks to:
     - Show the banner only when no decision is stored.
     - Remain stable (no flicker) across scroll.
     - Persist Accept/Decline across all pages via localStorage/cookies.  
   - Make changes internal (no changes to banner markup or IDs unless all references are updated and tests are adjusted).  
   - Verify via D1–D3 and E2E flows F1–F3, F6.

6. **Slice 5 – Header/nav & Services dropdown/overlay alignment**  
   - Adjust CSS for `.site-header`, nav items, Services dropdown button, and mobile Services pill to align visually and match typography of other nav items/pills.  
   - Keep ARIA and existing JS hooks (class names, data attributes) intact.  
   - Verify via V5 (“Home hero + nav”), V7 (“Services hero + overlay”), and DOM tests for nav/overlay (D4–D5).

7. **Slice 6 – Book & Contact UX hardening**  
   - Ensure Calendly embed on `book.html` is visible and responsive across breakpoints; handle any viewport/overflow issues via CSS.  
   - Refine contact form JS to provide clear success/failure feedback while preserving the Netlify function contract (`netlify/functions/send-email.js`).  
   - Verify via V8–V10 and DOM tests D6–D7 plus E2E flows F4–F6.

8. **Slice 7 – Estate CSS consolidation (page‑scoped)**  
   - Move Estate‑specific inline styles into a dedicated CSS file or into appropriate existing CSS files under a page‑scoped wrapper.  
   - Remove redundant rules while keeping tests passing.  
   - Confirm that Estate remains visually correct (all V* / F* / D* that touch Estate).

9. **Slice 8 – Optional global CSS/JS cleanup**  
   - Carefully restructure `assets/css/styles.css`, `assets/css/mobile.css`, and relevant JS (e.g., factor out helpers in `script.js`) to make future work easier:
     - Extract utility classes.
     - Introduce simple design tokens (colors, spacing, breakpoints).
     - Reduce `!important` usage where test‑safe.  
   - Only proceed with this slice once slices 0–7 are stable and tests are trustworthy.

---

## Concrete Steps

This section lists concrete commands and actions. It must be updated as work progresses and as actual test commands are created. The initial version uses **placeholder commands**; Codex should adjust them once test tooling is added.

Working directory: repository root (`silverstone-site-main/`).

1. **Slice 0 – Bootstrapping tests (initial concrete steps)**  
   - Install dependencies (assumes Node and npm are available):
     
       - `npm install`
   - Introduce a basic test toolchain (to be implemented in Slice 0):
     
       - Add Playwright for visual + E2E tests.
       - Add a minimal DOM test runner (e.g., Vitest/Jest + jsdom) for behavioural tests.
       - Add scripts in `package.json` like:
         - `npm run test:e2e`
         - `npm run test:dom`
         - `npm run test:visual`
         - `npm run test:accessibility` (optional wrapper around Lighthouse/axe).
   - Once test commands exist, standard validation after each slice should follow a pattern like:
     
       - `npm run test:dom`
       - `npm run test:e2e`
       - `npm run test:visual`
       - (Optionally) `npm run test:accessibility`

2. **Per‑slice pattern (applies to slices 1–8)**  
   For each slice:

   - Read `ExecPlan.md`, `PLANS.md`, `RULES.md`, and `ESTATE-AGENTS-NOTES.md` to understand scope and constraints.
   - Identify the specific files listed for that slice in `PLANS.md` (e.g., `assets/css/services.css`, `assets/css/mobile.css`, `assets/js/cookie-consent.js`, `niches/estate-agents.html`).
   - Make small, targeted edits using `apply_patch` (Codex) or manual edits.
   - Run the relevant tests:
     - Always run the DOM tests and E2E flows that mention this slice.
     - Always run the visual regression tests that include the modified sections.
   - If tests fail, fix the implementation or roll back changes while keeping the plan updated.
   - Update **Progress**, **Surprises & Discoveries**, and **Decision Log** in this ExecPlan when a slice is completed or a major issue is discovered.

3. **Documenting outcomes**  
   - At the end of each slice, add an entry to **Outcomes & Retrospective** capturing:
     - What changed.
     - Which tests were added or updated.
     - Any noteworthy architectural decisions.

---

## Validation and Acceptance

Validation is behaviour‑based and test‑based:

- **Estate Agents page:**
  - On desktop, all cards in the primary sections (“Where deals leak away”, “Show the numbers, not just promises”, pricing, FAQs, etc.) share consistent dark backgrounds and spacing.  
  - On mobile, the Estate hero shows the correct background image and participates correctly in any parallax or scroll effects.
  - Cookie banner:
    - Appears on first visit when no decision is recorded.
    - Does not flicker or re‑appear when scrolling the Estate page.
    - Does not appear again after Accept or Decline on any page.
- **Nav & Services:**
  - Desktop Services nav button is vertically aligned with other nav items.
  - Mobile Services pill matches font, size, color, and alignment of other nav pills.
- **Book & Contact flows:**
  - Calendly embed is visible and usable at typical desktop and mobile widths.
  - Contact form submits successfully (in a test/staging context), with clear success/failure feedback and no JS errors.

Test‑based acceptance (once Slice 0 is implemented):

- `npm run test:dom` passes, including D1–D7.
- `npm run test:e2e` passes, including F1–F6.
- `npm run test:visual` passes, ensuring V1–V10 remain visually stable.
- Optional: `npm run test:accessibility` passes basic Lighthouse/axe thresholds on Home, Services, Estate, Book, and Contact.

---

## Idempotence and Recovery

- Slices are designed to be **incremental and reversible**:
  - Each slice is scoped to a small set of files and behaviours.
  - If a slice introduces regressions, it can be reverted (e.g., via git) while leaving other slices intact.
- Changes should be additive and test‑backed:
  - Prefer adding new page‑scoped CSS rules, then gradually removing redundant ones once tests confirm safety.
  - For JS, prefer refactoring via helper functions and behaviour‑preserving reorganizations before changing external behaviour.
- If tests or commands fail halfway:
  - Fix the underlying problem, re‑run tests, and update the **Progress** section to reflect what remains.
  - Avoid leaving partially applied refactors; complete or roll back to a stable state.

---

## Artifacts and Notes

As work proceeds, add:

- Short snippets of failing vs passing test output (e.g., from `npm run test:visual`).
- Before/after screenshots or references to updated visual baseline images, if used.
- Links or references to key CSS/JS blocks that were refactored, with a short explanation of why the change was made.

Example (to be replaced with real output):

- Example test output (DOM tests):

    - Before Slice 4 fix:

          FAIL  tests/dom/cookie-banner.test.ts
          - expected banner to remain hidden after reload
          + banner visible after reload

    - After Slice 4 fix:

          PASS  tests/dom/cookie-banner.test.ts
          7 passed, 0 failed

---

## Interfaces and Dependencies

Key interfaces and expectations:

- **CSS:**
  - Global card and section styles live primarily in:
    - `assets/css/styles.css`
    - `assets/css/mobile.css`
    - `assets/css/custom.css`
  - Estate page should rely on page‑scoped wrappers (e.g., `.page-estate-agents`) for overrides.
  - Nav/Services overlays rely on `assets/css/services.css` and shared nav styles.

- **JS:**
  - Cookie banner:
    - Primary logic in `assets/js/cookie-consent.js`.
    - Relies on known DOM hooks (banner container, accept/decline buttons).
  - Nav:
    - Main interactions in `assets/js/script.js` (nav toggle, Services overlay, scroll behaviours).
  - Stats counters:
    - Implemented in `assets/js/script.js` with selectors tied to stats sections.
  - Contact form:
    - Inline script in `contact.html` calling `netlify/functions/send-email.js`.

- **Tests:**
  - Test harness (to be implemented in Slice 0) should live under `tests/` (e.g., `tests/e2e`, `tests/dom`, `tests/visual`).
  - Test IDs V1–V10, F1–F6, D1–D7 are documented in `TESTS_PLAN.md` and referenced in `PLANS.md` and this ExecPlan.

Contributors must maintain these interfaces or update all call sites and tests when they change. Any change to these contracts must be recorded in the **Decision Log** and reflected in all related documentation.
