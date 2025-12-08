# ExecPlan: Estate Agents page bugfixes & layout consistency

**Status:** In progress (Codex must not change this to “Complete”)  
**Owner:** Codex for the Silverstone site  
**Scope:** Estate Agents niche page and shared components (cookie banner, navigation, parallax, image handling, and Codex config).

This ExecPlan is a living document and must be maintained in accordance with `PLANS.md`.

---

## Purpose / Big Picture

This plan exists to:

- Make the **Estate Agents** niche page feel as polished and robust as the main site.
- Fix cookie-consent behavior across key pages so it is predictable and shared.
- Align navigation and card styling so they feel consistent between the niche page and the main site.
- Preserve the **parallax experience** on both desktop and mobile while eliminating mobile “jumping” when the browser URL bar appears or disappears.
- Ensure the correct imagery (desktop vs mobile, hero vs parallax backgrounds) is used without regressions.

After this plan, users should see:

- A cookie banner that behaves sensibly and consistently.
- Clean, even spacing between Estate Agents sections.
- Cards with coherent background opacity.
- A perfectly aligned Services item in the desktop nav and a coherent Services pill on mobile.
- A parallax effect that feels smooth and stable on desktop and mobile.
- Estate Agents numbers showing `68%` and `42%` without animation.
- Estate Agents imagery switching correctly between desktop and mobile variants.

---

## Progress

Codex must keep this section up to date with timestamped, granular entries. Use checkboxes here only, and always include file paths.

Examples (Codex should add real entries while working):

- [x] (2025-12-08T21:10Z) Reviewed cookie banner logic in `assets/js/cookie-consent.js` and banner markup in `index.html` and `niches/estate-agents.html` (inline display styles noted).
- [x] (2025-12-08T21:10Z) Audited Estate Agents content structure, counters, and card classes in `niches/estate-agents.html` (identified animated stats via `.stats` without `data-counter="off"`).
- [x] (2025-12-08T21:10Z) Inspected parallax configuration in `assets/css/parallax-fix.css` and `assets/js/script.js` (mobile stage uses book-hero assets for multiple themes).
- [x] (2025-12-08T21:10Z) Located navigation layout rules in `assets/css/styles.css` (nav ul lacks `align-items`, Services toggle inline-flex with minimal padding).
- [x] (2025-12-08T21:13Z) Implemented Estate Agents spacing tweaks, stat dark-card styling, counter disablement, and desktop/mobile imagery swaps in `niches/estate-agents.html`.
- [x] (2025-12-08T21:13Z) Updated nav alignment and mobile Services pill styling in `assets/css/styles.css`; corrected parallax mobile asset paths in `assets/js/script.js`.
- [ ] (YYYY-MM-DDThh:mmZ) Implement fixes for cookie banner persistence and retest across all six pages.
- [ ] (YYYY-MM-DDThh:mmZ) Validate navigation alignment, parallax behavior, spacing, card backgrounds, counters, and imagery on desktop and mobile per acceptance criteria.

The final state of this section must reflect **actual work done and remaining**, not an optimistic summary.

---

## Surprises & Discoveries

Codex must record unexpected findings here: bugs that were not in the original description, tricky browser behaviors, or previous regressions discovered during analysis.

Example format:

- Observation: On `niches/estate-agents.html`, the cookie banner is styled with `display: none` inline and only toggled via scroll events, not on load.
  - Evidence: Snippet from `niches/estate-agents.html` and relevant JS lines.
- Observation: Mobile parallax is implemented using a sticky background layer in `assets/js/script.js`.
  - Evidence: Function or block name, key lines, and how it interacts with `.parallax-section`.

- Observation: Stats block on `niches/estate-agents.html` uses `.stats` with `data-target` attributes and no `data-counter="off"`, so the shared counter animation in `assets/js/script.js` will animate values instead of keeping `68%`/`42%` static.
  - Evidence: `.stats` markup around the “Show the numbers” section and counter logic at lines ~413–445 of `assets/js/script.js`.
- Observation: Parallax mapping applies `book-hero-calendly-mobile-2025@*x.webp` to multiple themes (e.g., `lines`) in both `assets/css/parallax-fix.css` and `assets/js/script.js`, risking that the hero art becomes a de facto global background instead of page-specific imagery.
  - Evidence: Theme definitions in `assets/css/parallax-fix.css` and `PARALLAX_MAP` entries in `assets/js/script.js`.
- Observation: Navigation flex container (`nav ul`) lacks `align-items: center`, while `.services-toggle` uses inline-flex with tighter padding, which can cause the Services item to sit off-baseline compared to text-only links.
  - Evidence: Nav rules in `assets/css/styles.css`.
- Observation: Parallax mobile assets were referenced with page-relative paths (`assets/...`) in `assets/js/script.js`, which would 404 on niche pages like `niches/estate-agents.html` and leave mobile parallax layers blank.
  - Evidence: `PARALLAX_MAP` URLs prior to correction in `assets/js/script.js`.

---

## Decision Log

Every material decision must be recorded here, including tradeoffs and rejected approaches.

Example format:

- Decision: Preserve the existing mobile parallax system and adjust thresholds rather than disabling parallax.
  - Rationale: Keeps the intended visual effect while reducing URL-bar-induced jumps.
  - Date/Author: 2025-12-08 / Codex

- Decision: Switch mobile parallax asset URLs in `assets/js/script.js` to root-relative paths so niche pages load backgrounds correctly without duplicating per-directory variants.
  - Rationale: Avoids 404s on nested pages while keeping the parallax system intact and consistent with CSS asset locations.
  - Date/Author: 2025-12-08 / Codex
- Decision: Disable Estate Agents stats counter animation via `data-counter="off"` and set explicit values (including `%` and `x`) with dark-card styling to meet static metrics and card consistency requirements without affecting other counters.
  - Rationale: Meets acceptance criteria while scoping changes to the niche page only.
  - Date/Author: 2025-12-08 / Codex
- Decision: Introduce a shared `.section-gap-top` utility on the Estate Agents page to normalize spacing between key sections using the existing spacing scale instead of global spacing changes.
  - Rationale: Targets the specified section pairs without altering site-wide rhythm.
  - Date/Author: 2025-12-08 / Codex

Codex must update this section during implementation, not just at the end.

---

## Outcomes & Retrospective

This section is for summarizing outcomes once significant portions of the plan have been executed and validated.

Codex should fill this in **only after** running the Validation and Acceptance steps and reconciling with user feedback. It is not used to prematurely declare completion.

---

## Context and Orientation

### Repository context

Relevant files:

- **HTML pages**
  - `index.html`
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
  - `niches/estate-agents.html`

- **CSS**
  - `assets/css/styles.css`
  - `assets/css/custom-styles.css`
  - `assets/css/custom.css`
  - `assets/css/mobile.css`
  - `assets/css/parallax-fix.css`
  - `assets/css/services.css`
  - Inline `<style>` in `niches/estate-agents.html` (cards, sections, stats)

- **JavaScript**
  - `assets/js/cookie-consent.js` (cookie banner logic)
  - `assets/js/script.js`:
    - Desktop and mobile navigation behavior.
    - Services dropdown and overlay controls.
    - Mobile parallax for `.parallax-section` using `data-parallax-theme`.
    - Counter animation for stats (`data-target` / `.number`).
  - `assets/js/hero-shader.js` (hero visuals)
  - Other scripts that should not be materially altered for this plan.

- **Images**
  - Estate Agents:
    - `assets/images/socialmedia/Real_Estate_1.jpeg` and `Real_Estate_1_Mobile.jpeg`
    - `assets/images/socialmedia/Real_Estate_2.jpeg` and `Real_Estate_2_Mobile.jpeg`
    - `assets/images/socialmedia/Real_Estate_3.jpeg` and `Real_Estate_3_Mobile.jpeg`
  - Hero/parallax backgrounds:
    - `assets/images/internet/hero/book-hero-calendly-mobile-2025.webp`
    - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp`, `@2x.webp`, `@3x.webp`
    - `section-*.webp` parallax theme images.

- **Configuration**
  - `.codex/config.toml` (model, reasoning effort, features, sandbox/network settings)

### Known issues and prior regressions

Prior work:

- Correct:
  - Darkened card backgrounds on Estate Agents.
  - Switched Estate Agents images to mobile variants.
  - Disabled counter effect and added `%` for `68` and `42`.

- Still broken/insufficient:
  - Desktop Services nav alignment.
  - Mobile Services pill typography and alignment.
  - Cookie-consent banner behavior on Estate Agents / cross-pages.
  - Excess vertical spacing between several Estate Agents sections.

- Regressions:
  - Parallax backgrounds on `index.html`, `services.html`, and `niches/estate-agents.html` zoomed or over-large.
  - Mobile parallax disabled or replaced with static backgrounds.
  - Incorrect/multiple body backgrounds on Estate Agents, including parallax assets.

This plan treats these regressions as **bugs to fix**, not acceptable outcomes.

---

## Plan of Work

Phases:

1. **Orientation and configuration sanity**
2. **Cookie-consent banner**
3. **Estate Agents spacing and card backgrounds**
4. **Desktop navigation and mobile Services pill**
5. **Backgrounds and parallax**
6. **Counters and percentages**
7. **Desktop vs mobile images on Estate Agents**
8. **Config alignment**

Each phase includes analysis, implementation, and validation.

---

## Concrete Steps

(Codex will expand in `Progress`, but at high level:)

1. **Orientation**
   - Open all relevant HTML/CSS/JS files listed above.
   - Verify `.codex/config.toml` configuration and note needed changes.

2. **Cookie-consent**
   - Inspect `assets/js/cookie-consent.js`:
     - Storage key and usage.
     - How/when banner is shown/hidden.
   - Compare `#cookie-banner` markup across:
     - `index.html`, `about.html`, `services.html`, `contact.html`, `book.html`, `niches/estate-agents.html`.
   - Reproduce or reason through current broken behavior:
     - Estate Agents banner not appearing on load, appearing/disappearing on scroll, not respecting accept/decline.
   - Implement fixes:
     - Single cross-page state (e.g. `localStorage`).
     - Banner appears on load when no choice is stored.
     - Banner stays fixed/visible while scrolling until accept/decline.
     - Banner never reappears after choice (unless requirements change).
   - Test across all pages and states.

3. **Estate Agents spacing**
   - In `niches/estate-agents.html`, identify sections:
     - “The branch experience after launch”
     - “Plug, personalise, launch”
     - “Pricing”
     - “FAQs”
     - “Never Miss a Viewing” pack
     - “Show the numbers, not just promises”
   - Inspect section classes (`.section`, `.compact-section`, modifiers).
   - Adjust spacing via CSS / class assignments using existing spacing values.
   - Validate visually on desktop and mobile.

4. **Card backgrounds**
   - Identify card classes (`.neon-card`, `.dark-card`, wrappers).
   - Determine which rules produce the darker background for “Show the numbers” cards.
   - Apply same treatment to:
     - “Where deals leak away”
     - “Answer instantly. Confirm automatically. Keep the chain warm.”
     - “Plug, personalise, launch”
     - “Safe, compliant, and fully supported”
   - Scope via `body.page-estate-agents` to avoid affecting other pages.
   - Re-check all affected cards.

5. **Desktop navigation and mobile Services pill**
   - Review header/nav markup + CSS in `index.html`, `services.html`, `niches/estate-agents.html`.
   - Desktop:
     - Find cause of lower Services dropdown (padding, line-height, flex alignment).
     - Fix alignment with layout-based adjustments (no brittle offsets).
   - Mobile:
     - Inspect `.services-overlay`, `.service-pill.service-link`.
     - Make Services pill match other pills in font, size, weight, color, and centering.
     - Preserve overlay trigger behavior.
   - Verify on multiple viewport widths.

6. **Backgrounds and parallax**
   - Understand `.parallax-section` in `assets/css/parallax-fix.css` and themes.
   - Analyze mobile parallax block in `assets/js/script.js`.
   - Audit `.parallax-section` usage in `index.html`, `services.html`, `niches/estate-agents.html`.
   - Undo destructive overrides; restore intended backgrounds.
   - Adjust logic to avoid mobile jumping (e.g. stable height, avoid problematic `vh` uses or sticky misconfig).
   - Do **not** disable parallax or replace with static backgrounds as final solution.
   - Validate:
     - Desktop: parallax behaves as originally intended.
     - Mobile: parallax-like effect present, no URL-bar jump.

7. **Counters and percentages**
   - Confirm “Show the numbers” in `niches/estate-agents.html` renders `68%`, `42%`, `2x`.
   - Confirm `assets/js/script.js` no longer animates these values:
     - Exclude this section from counters or remove `data-target` and set static text.
   - Ensure other counters (if any) remain functional.

8. **Desktop vs mobile images**
   - Verify use of `Real_Estate_*.jpeg` and `Real_Estate_*_Mobile.jpeg` on Estate Agents.
   - Implement or confirm `<picture>` + `source media="(max-width: …)"` or equivalent CSS-based approach.
   - Validate correct image usage and absence of layout shifts.

9. **Config alignment**
   - Inspect `.codex/config.toml`:
     - Model, reasoning effort, `[features]` section.
   - Ensure:
     - `model = "gpt-5.1-codex-max"`
     - `model_reasoning_effort = "xhigh"`
     - `[features] web_search_request = true`, `view_image_tool = true`
   - Keep TOML valid and changes minimal.

---

## Validation and Acceptance

Codex must meet all of these before considering work functionally complete (even though `Status` stays “In progress”):

1. **Cookie-consent banner**
   - Fresh state:
     - On each of: `index.html`, `about.html`, `services.html`, `contact.html`, `book.html`, `niches/estate-agents.html`:
       - Banner appears on load.
       - Banner remains visible while scrolling until choice.
   - Accepted state:
     - After Accept, banner does not appear on any of the above pages.
   - Declined state:
     - After Decline (from fresh state), banner similarly does not reappear on any page.

2. **Estate Agents layout & spacing**
   - On desktop and mobile, spacing between:
     - “The branch experience after launch” ↔ “Plug, personalise, launch”
     - “Pricing” ↔ “FAQs”
     - “Never Miss a Viewing” pack ↔ “Show the numbers, not just promises”
   - Matches or closely matches the baseline spacing between “Show the numbers, not just promises” and “The branch experience after launch” and respects site spacing scale.

3. **Card backgrounds**
   - Estate Agents cards:
     - “Show the numbers, not just promises”
     - “Where deals leak away”
     - “Answer instantly. Confirm automatically. Keep the chain warm.”
     - “Plug, personalise, launch”
     - “Safe, compliant, and fully supported”
   - All share the darker, more opaque background.
   - Cards on other pages not unintentionally altered.

4. **Navigation and mobile Services pill**
   - Desktop header on `index.html`, `services.html`, `niches/estate-agents.html`:
     - All nav items, including Services, are vertically aligned.
   - Mobile nav/menu:
     - Services pill matches other pills (font family, size, weight, color, centering).
     - Still opens Services overlay.

5. **Backgrounds and parallax**
   - `index.html` and `services.html`:
     - Desktop: parallax sections behave as intended.
     - Mobile: parallax-like effect present, backgrounds do not jump when URL bar appears/disappears.
   - `niches/estate-agents.html`:
     - Body/sections have correct backgrounds, no unintended multiple images.
     - `book-hero-calendly-mobile-2025@*x.webp` used appropriately, not as global body background.
     - Parallax (if present) behaves smoothly.

6. **Counters and percentages**
   - “Show the numbers” on Estate Agents:
     - Displays `68%`, `42%`, and `2x` statically.
     - No counter animation.
     - Layout intact.

7. **Desktop vs mobile images**
   - Estate Agents images:
     - Desktop: `Real_Estate_1/2/3.jpeg`.
     - Mobile: `Real_Estate_1/2/3_Mobile.jpeg`.
   - No 404s or layout shifts.

8. **Configuration**
   - `.codex/config.toml`:
     - Uses `gpt-5.1-codex-max` + `xhigh`.
     - Has `[features]` with `web_search_request = true` and `view_image_tool = true`.
     - Remains valid TOML.

If any criterion fails, Codex must keep iterating; it may not “fix” the ExecPlan text to claim success.

---

## Idempotence and Recovery

- Keep changes **additive and scoped**:
  - Use page-specific selectors (`body.page-estate-agents`) where possible.
  - Prefer small CSS tweaks over large rewrites.
- For risky changes (parallax, nav, cookie logic):
  - Make small, reversible diffs.
  - If regressions appear, revert or narrow scope, then attempt a more precise solution.
- Plan steps should be safe to re-run:
  - Build commands can be executed multiple times without corruption.
  - Reapplying edits should converge on stable behavior.

Risky changes must be documented in `Decision Log` with a clear path to revert.

---

## Artifacts and Notes

Codex may (optionally) record here:

- Short diff snippets illustrating key changes.
- Example console logs or error messages before/after fixes.
- “Before vs after” behavior summaries for tricky UI (parallax, cookie banner).

---

## Interfaces and Dependencies

Main interfaces:

- DOM structure of navigation, cookie banners, sections, cards.
- CSS classes + custom properties in:
  - `assets/css/styles.css`
  - `assets/css/custom-styles.css`
  - `assets/css/custom.css`
  - `assets/css/mobile.css`
  - `assets/css/parallax-fix.css`
- JS functions/modules in:
  - `assets/js/cookie-consent.js`
  - `assets/js/script.js`
- Config in:
  - `.codex/config.toml`

Codex must:

- Reference these by path; mention key selectors or function names when relevant.
- Avoid renaming/removing core interfaces (e.g. `.parallax-section`, `.services-overlay`, `.cookie-banner`) unless strictly necessary and justified in `Decision Log`.

This ExecPlan is functionally complete only when all **Validation and Acceptance** criteria are met in the running site and the human owner is satisfied, even though the `Status` field remains “In progress” until they decide otherwise.
