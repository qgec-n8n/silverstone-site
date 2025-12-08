# ExecPlan: Estate Agents page bugfixes & layout consistency

**Status:** In progress (Codex must not change this to “Complete”)  
**Owner:** Codex for the Silverstone site  
**Scope:** Estate Agents niche page and shared components (cookie banner, navigation, spacing, card styling, imagery, and Codex config).

This ExecPlan is a living document and must be maintained in accordance with `PLANS.md`.

---

## Purpose / Big Picture

This plan exists to:

- Make the **Estate Agents** niche page feel as polished and robust as the main site.
- Fix cookie-consent behavior across key pages so it is predictable and shared.
- Align navigation and card styling so they feel consistent between the niche page and the main site.
- Preserve the **parallax experience** on both desktop and mobile while focusing first on:
  - Cookie banner,
  - Spacing,
  - Card backgrounds,
  - Desktop nav alignment,
  - Mobile Services pill,
  - Counters,
  - Desktop vs mobile Estate Agents images.
- Ensure the correct imagery (desktop vs mobile, hero vs parallax backgrounds) is used without regressions.

The **mobile URL-bar “jumping” issue** for parallax is explicitly deferred to a **separate ExecPlan** (`parallax-mobile-hardening.ExecPlan.md`) to avoid destructive changes in this phase.

After this plan, users should see:

- A cookie banner that behaves sensibly and consistently across the specified pages.
- Clean, even spacing between key sections on the Estate Agents page, consistent with `index.html`.
- Cards with coherent, darker background opacity on Estate Agents.
- A perfectly aligned Services item in the desktop nav and a coherent Services pill on mobile.
- Parallax still present and visually consistent (even if the mobile URL-bar jump still exists).
- Estate Agents numbers showing `68%` and `42%` as static percentages (no animation).
- Estate Agents imagery switching correctly between desktop (`Real_Estate_*.jpeg`) and mobile (`Real_Estate_*_Mobile.jpeg`) variants.

---

## Progress

Codex must keep this section up to date with timestamped, granular entries. Use checkboxes here only, and always include file paths.

For **Phase 1 (analysis-only)**, entries must describe reading/inspection steps only; no HTML/CSS/JS modifications should occur until several analysis entries are present.

Examples (Codex should add real entries while working):

- [ ] (YYYY-MM-DDThh:mmZ) Phase 1: Analyzed cookie banner logic in `assets/js/cookie-consent.js` and banner markup in `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, and `niches/estate-agents.html`.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 1: Documented Estate Agents section structure and spacing in `niches/estate-agents.html` and compared against analogous sections in `index.html`.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 1: Mapped Estate Agents card types and styles (including `.neon-card`, `.stat`, `.value-card`) and identified darker card rules.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 1: Mapped desktop nav and mobile Services pill structure and styling across `index.html`, `services.html`, `niches/estate-agents.html`, and `assets/css/styles.css`.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 1: Verified current parallax-related selectors and backgrounds (for preservation only) in `assets/css/parallax-fix.css` and `assets/js/script.js`.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 2: Implemented cookie banner persistence fix in `assets/js/cookie-consent.js` and updated relevant markup.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 2: Adjusted Estate Agents spacing, dark card styling, nav alignment, mobile Services pill, counters, and imagery using localized edits.
- [ ] (YYYY-MM-DDThh:mmZ) Phase 3: Validated all acceptance criteria on desktop and mobile for Estate Agents and related pages.

The final state of this section must reflect **actual work done and remaining**, not an optimistic summary.

---

## Surprises & Discoveries

Codex must record unexpected findings here: bugs not in the original description, tricky browser behaviors, or regressions discovered during analysis.

Example entries:

- Observation: Estate Agents cookie banner uses inline `style="display: none"` and receives scroll-based toggling from a leftover script, causing it to flicker instead of showing on load.
  - Evidence: Snippet from `niches/estate-agents.html` and relevant scroll logic in `assets/js/script.js`.

- Observation: `assets/css/styles.css` contains duplicated blocks and stray fragments (e.g. `j0px` near Calendly styles), likely from prior Codex runs. Large, blind edits to this file are risky.
  - Evidence: Locations in `styles.css` where classes and sections are duplicated or truncated.

Codex must update this section with real observations during Phase 1.

---

## Decision Log

Log every material decision and tradeoff here.

Example entries:

- Decision: Scope dark card styling for Estate Agents by using a page-specific selector (e.g. `body.page-estate-agents .neon-card.dark-card`) rather than altering global `.neon-card`.
  - Rationale: Keeps other pages visually unchanged while aligning all Estate Agents cards.
  - Date/Author: 2025-12-08 / Codex

- Decision: Leave mobile parallax jumping unmodified in this ExecPlan and handle it in `parallax-mobile-hardening.ExecPlan.md`.
  - Rationale: Avoid further damage to complex parallax CSS/JS while focusing on the requested Estate Agents behaviors.
  - Date/Author: 2025-12-08 / Codex

Codex must fill in actual decisions as work progresses.

---

## Outcomes & Retrospective

Use this section after substantial implementation and validation:

- Summarize which bugs were fixed and how.
- Note where the plan had to be adjusted.
- Identify follow-up work for the parallax-hardening ExecPlan or other future tasks.

---

## Context and Orientation

### Repository context

For this plan, the main files are:

- **HTML**
  - `index.html`
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
  - `niches/estate-agents.html`

- **CSS**
  - `assets/css/styles.css` – nav, base layouts, global cards/sections.
  - `assets/css/custom-styles.css`, `assets/css/custom.css` – additional styling, potentially including Estate Agents.
  - `assets/css/mobile.css` – mobile-specific tweaks.
  - `assets/css/parallax-fix.css` – parallax sections and background handling (to be preserved in this plan).
  - `assets/css/services.css` – services-specific layout and cards.

- **JavaScript**
  - `assets/js/cookie-consent.js` – cookie banner logic and persistence.
  - `assets/js/script.js` – nav/menu logic, Services overlay, parallax behavior, counters.
  - `assets/js/hero-shader.js` – hero visuals.

- **Images**
  - Estate Agents imagery:
    - `assets/images/socialmedia/Real_Estate_1.jpeg` / `Real_Estate_1_Mobile.jpeg`
    - `assets/images/socialmedia/Real_Estate_2.jpeg` / `Real_Estate_2_Mobile.jpeg`
    - `assets/images/socialmedia/Real_Estate_3.jpeg` / `Real_Estate_3_Mobile.jpeg`
  - Hero/background images:
    - `assets/images/internet/hero/book-hero-calendly-mobile-2025.webp`
    - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp`, `@2x.webp`, `@3x.webp`

- **Config**
  - `.codex/config.toml` – Codex config (model, reasoning effort, features).

### Known starting issues

From user reports and prior Codex attempts:

- Cookie banner:
  - Estate Agents banner does not show correctly on load, flickers on scroll, and may reappear after Accept/Decline.
  - Cross-page behavior does not consistently respect stored consent.

- Spacing:
  - Excess vertical space for specific section pairs on Estate Agents:
    - “Never Miss a Viewing” ↔ “Show the numbers”
    - “The branch experience after launch” ↔ “Plug, personalise, launch”
    - “Pricing” ↔ “FAQs”

- Card backgrounds:
  - “Show the numbers” cards use a darker background.
  - Other Estate Agents cards do not match this opacity/style.

- Navigation and mobile Services pill:
  - Desktop Services dropdown sits slightly lower than other nav items.
  - Mobile Services pill has typography and alignment different from overlay pills, or resembles dropdown chips instead of initial overlay pills.

- Counters and imagery:
  - Counters previously animated `68` and `42` without `%`.
  - Real Estate images now partially use correct mobile/desktop variants but must be verified.

- Parallax:
  - Parallax was previously damaged when Codex tried to “fix” mobile jumping; this plan must **preserve** parallax and overlays, not fix jumping.

---

## Plan of Work

### Phase 1 – Analysis-only (no HTML/CSS/JS edits)

1. Cookie-consent:
   - Read `assets/js/cookie-consent.js`.
   - For each relevant page, inspect `#cookie-banner` markup.
   - Document:
     - Storage key(s) used.
     - When the banner is shown/hidden.
     - Differences between Estate Agents and other pages.

2. Estate Agents spacing:
   - In `niches/estate-agents.html`, identify wrappers and classes for:
     - “Never Miss a Viewing” pack.
     - “Show the numbers, not just promises”.
     - “The branch experience after launch”.
     - “Plug, personalise, launch”.
     - “Pricing”.
     - “FAQs”.
   - In `index.html`, find analogous sections and record typical spacing.

3. Card backgrounds:
   - Identify card containers (e.g. `.neon-card`, `.stat`, `.value-card`) on Estate Agents.
   - Locate CSS rules that produce darker card backgrounds (for “Show the numbers”).
   - Note which cards currently share that style.

4. Navigation & mobile Services pill:
   - Inspect header/nav markup in `index.html`, `services.html`, `niches/estate-agents.html`.
   - Inspect nav-related CSS in `assets/css/styles.css`.
   - Document:
     - Why Services sits lower (line-height, padding, flex alignment).
     - How overlay pills and the Services pill are styled/equipped differently on mobile.

5. Counters and imagery:
   - Inspect Estate Agents “Show the numbers” section markup.
   - Inspect counter logic in `assets/js/script.js`.
   - Confirm Real_Estate images usage and whether `<picture>` or CSS is already used.

6. Config:
   - Confirm `.codex/config.toml` uses `model = "gpt-5.1-codex-max"` and `model_reasoning_effort = "xhigh"` and has a `[features]` table enabling web search and image tools.

### Phase 2 – Implementation

Once the above is written into this ExecPlan, implement:

1. Cookie-consent:
   - Unify behavior so that:
     - A single stored consent value (e.g. `cookieConsentChoice`) controls visibility across all relevant pages.
     - Banner appears on load only when no choice is stored.
     - Banner remains visible until Accept/Decline.
     - After Accept or Decline, banner does not reappear.
   - Fix Estate Agents markup and inline styles to follow the same logic (no scroll-flicker behavior).

2. Estate Agents spacing:
   - Adjust section padding/margins for the three problematic gaps:
     - Never Miss ↔ Show the numbers.
     - Branch experience ↔ Plug.
     - Pricing ↔ FAQs.
   - Use existing spacing values (e.g. `3rem`, `4rem`); you may introduce a small utility like `.section-gap-top` scoped to Estate Agents.

3. Card backgrounds:
   - Implement a shared dark card variant for Estate Agents, e.g.:
     - `body.page-estate-agents .neon-card.dark-card` or similar.
   - Apply this to:
     - “Show the numbers” cards.
     - “Where deals leak away”.
     - “Answer instantly…”.
     - “Plug, personalise, launch”.
     - “Safe, compliant, and fully supported”.

4. Desktop nav alignment:
   - Normalize flex alignment and line-height for `nav ul` items and `.services-toggle`.
   - Fix misalignment using robust layout changes (not pixel hacks).

5. Mobile Services pill:
   - Ensure the overlay Services pill has:
     - Same font, size, weight, color, and centering as other overlay pills.
   - Keep the dropdown behavior intact.

6. Counters and percentages:
   - Disable counter animation for Estate Agents “Show the numbers” section (e.g. via `data-counter="off"` or by excluding those elements from the counter logic).
   - Render `68%`, `42%`, and `2x` as static text.
   - Verify other counters remain unaffected.

7. Desktop vs mobile Estate Agents images:
   - Convert Real_Estate image usages into `<picture>` elements or use CSS media queries so that:
     - Desktop uses `Real_Estate_*.jpeg`.
     - Mobile uses `Real_Estate_*_Mobile.jpeg`.

### Phase 3 – Validation

- Walk through each item in **Validation and Acceptance** (below).
- Use desktop and mobile widths to reason about appearance.
- If preview is limited, provide code-based reasoning and clearly label any partially verified items.

---

## Concrete Steps

Codex should translate this Plan of Work into a detailed action list in `Progress` during execution. The key rule:

- Phase 1 entries must be analysis-only (no code edits).
- Later entries must link specific diffs to specific bugs.

---

## Validation and Acceptance

Codex must verify these before treating this plan as functionally complete (even though `Status` remains “In progress”):

1. **Cookie-consent banner**
   - Fresh state:
     - On each of: `index.html`, `about.html`, `services.html`, `contact.html`, `book.html`, `niches/estate-agents.html`:
       - Banner appears on load.
       - Banner remains visible while scrolling until Accept or Decline is clicked.
   - Accepted state:
     - After Accept on any page, reloading each page above does **not** show the banner.
   - Declined state:
     - After Decline in a fresh state, reloading each page above does **not** show the banner.

2. **Estate Agents layout & spacing**
   - On desktop and mobile:
     - Spacing between:
       - “Never Miss a Viewing” ↔ “Show the numbers, not just promises”.
       - “The branch experience after launch” ↔ “Plug, personalise, launch”.
       - “Pricing” ↔ “FAQs”.
     - Is visually similar to the baseline spacing between “Show the numbers” and “The branch experience after launch”.
     - Uses the site’s existing spacing scale.

3. **Card backgrounds**
   - On the Estate Agents page:
     - The following cards share the darker, more opaque background:
       - “Show the numbers, not just promises”.
       - “Where deals leak away”.
       - “Answer instantly. Confirm automatically. Keep the chain warm.”
       - “Plug, personalise, launch”.
       - “Safe, compliant, and fully supported”.
   - Cards on other pages are not unintentionally altered.

4. **Navigation and mobile Services pill**
   - Desktop header on `index.html`, `services.html`, `niches/estate-agents.html`:
     - All nav items, including Services, share a common baseline (no vertical misalignment).
   - Mobile nav/menu:
     - Services pill matches other overlay pills in font family, size, weight, color, and centering.
     - Services pill still opens the Services overlay when tapped.

5. **Backgrounds and parallax (preservation only)**
   - `index.html`, `services.html`, `niches/estate-agents.html`:
     - Existing parallax sections still display appropriate backgrounds and dark overlays.
     - No large unintended zooming, cropping, or “broken” overlays are introduced by this plan.
   - The mobile URL-bar “jumping” issue may still exist; that is acceptable and explicitly addressed later by `parallax-mobile-hardening.ExecPlan.md`.

6. **Counters and percentages**
   - “Show the numbers” on Estate Agents:
     - Displays `68%`, `42%`, and `2x` as static text.
     - No counter animation runs on this section.
     - Layout remains intact.

7. **Desktop vs mobile images**
   - Estate Agents images:
     - Desktop widths show `Real_Estate_1/2/3.jpeg`.
     - Mobile widths show `Real_Estate_1/2/3_Mobile.jpeg`.
   - No 404s or obvious layout shifts.

8. **Configuration**
   - `.codex/config.toml`:
     - Uses `model = "gpt-5.1-codex-max"` and `model_reasoning_effort = "xhigh"`.
     - Has `[features]` with `web_search_request = true` and `view_image_tool = true`.
     - Remains valid TOML.

If any of these fail, Codex must continue iterating rather than editing this plan to claim success.

---

## Idempotence and Recovery

- Prefer incremental, idempotent changes:
  - Small `apply_patch` diffs with minimal context.
  - Page-scoped selectors (`body.page-estate-agents`, `.page-services`) for CSS changes.
- For risky files (especially `assets/css/styles.css`):
  - Avoid reformatting or emitting the whole file.
  - Confine edits to the smallest necessary regions (nav, pills, card styles).
- If a change introduces regressions:
  - Note them in `Surprises & Discoveries`.
  - Revert or narrow the change and attempt a better-targeted fix.

---

## Artifacts and Notes

Codex may record here:

- Key diff snippets (minimal context).
- Example console logs or errors before/after.
- “Before vs after” descriptions for specific features (cookie banner, spacing, nav, pills, cards, imagery).

---

## Interfaces and Dependencies

Key interfaces:

- HTML structure:
  - Nav, cookie banners, Estate Agents sections, stats, cards.
- CSS:
  - Classes and properties in:
    - `assets/css/styles.css`
    - `assets/css/custom-styles.css`
    - `assets/css/custom.css`
    - `assets/css/mobile.css`
    - `assets/css/parallax-fix.css`
    - `assets/css/services.css`
- JS:
  - Functions and event handlers in:
    - `assets/js/cookie-consent.js`
    - `assets/js/script.js`
- Config:
  - `.codex/config.toml`

Codex must:

- Reference these by path and name when discussing changes.
- Avoid renaming or removing core interfaces (e.g. `.parallax-section`, `.services-overlay`, `.cookie-banner`) unless absolutely necessary and documented in `Decision Log`.

This ExecPlan is functionally complete only when all **Validation and Acceptance** criteria are satisfied and the human owner is satisfied with behavior, even though the `Status` remains “In progress” until they explicitly update it.
