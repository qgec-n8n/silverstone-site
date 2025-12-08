# ExecPlan: Estate Agents page bugfixes & layout consistency

**Status:** Complete
**Owner:** Codex for the Silverstone site  
**Scope:** Estate Agents niche page and closely related shared components (cookie banner, navigation, parallax, image handling, and Codex config).

---

## 1. Summary / Overview

This ExecPlan describes how Codex should analyze and fix a set of tightly scoped issues on the Silverstone marketing site, with a focus on the **Estate Agents** niche page and cross-page behaviors.

High-level goals:

- Fix cookie-consent banner behavior on the Estate Agents page and ensure consistent behavior across all key pages.
- Adjust vertical spacing between specific sections on the Estate Agents page.
- Normalize card background opacity across all cards on the Estate Agents page.
- Align the **Services** item in the desktop navigation and the Services pill in the mobile menu with other items.
- Fix background image handling for:
  - Estate Agents mobile hero/background.
  - Mobile parallax body-section backgrounds on `index.html` and `services.html` (no more “jumping” when the URL bar appears/disappears).
- Disable the “Proof in numbers” counter animation for the Estate Agents page and display `68%` and `42%` with percent signs.
- Ensure Estate Agents page uses the correct image assets:
  - Desktop: `Real_Estate_*.jpeg`
  - Mobile: `Real_Estate_*_Mobile.jpeg`
- Review `.codex/config.toml` and align it with recommended Codex settings (model, reasoning effort, feature flags, internet access).

---

## 2. Context & current behavior (to be filled in by Codex)

Before making any changes, **Codex must**:

1. Read:
   - `AGENTS.md` (repo root)
   - `PLANS.md` (repo root)
   - This ExecPlan file (`estate-agents-bugfixes.ExecPlan.md`)
   - `.codex/config.toml` (if present)

2. Discover relevant files and components:

   **Pages & markup**
   - `niches/estate-agents.html` (Estate Agents niche page)
   - `index.html`
   - `about.html`
   - `services.html`
   - `book.html`
   - `contact.html`

   **CSS**
   - `assets/css/styles.css`
   - `assets/css/custom-styles.css`
   - `assets/css/custom.css`
   - `assets/css/mobile.css`
   - `assets/css/parallax-fix.css`
   - `assets/css/services.css`
   - Any inline `<style>` blocks inside `niches/estate-agents.html` (especially those defining sections, cards, and stats).

   **JavaScript**
   - `assets/js/cookie-consent.js`
   - `assets/js/script.js`
   - `assets/js/hero-shader.js` (for hero visual effects and background behavior)
   - Any other referenced scripts (e.g. marquee, grid) if they interact with the Estate Agents page.

   **Images**
   - Estate Agents images:
     - `assets/images/socialmedia/Real_Estate_1.jpeg` and `_Mobile.jpeg`
     - `assets/images/socialmedia/Real_Estate_2.jpeg` and `_Mobile.jpeg`
     - `assets/images/socialmedia/Real_Estate_3.jpeg` and `_Mobile.jpeg`
   - Mobile hero backgrounds:
     - `assets/images/internet/hero/book-hero-calendly-mobile-2025.webp`
     - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp`
     - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@2x.webp`
     - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@3x.webp`

   **Codex configuration**
   - `.codex/config.toml` (feature flags, model, reasoning effort, sandbox/network settings).

3. For each area below, Codex should capture a short internal summary (in its reasoning and/or as notes in a “Progress” section if present):

   - **Cookie banner behavior** on:
     - `niches/estate-agents.html`
     - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`
     - How `assets/js/cookie-consent.js` sets and reads the consent choice (e.g. `localStorage` key, cookie, or other).
   - **Spacing** between:
     - “The branch experience after launch” and “Plug, personalise, launch”
     - “Pricing” and “FAQs”
     - “Never Miss a Viewing” pack section and “Show the numbers, not just promises”
   - **Card backgrounds**:
     - Styles applied to cards in “Show the numbers, not just promises”.
     - Styles applied to “Where deals leak away”, “Answer instantly. Confirm automatically. Keep the chain warm.”, “Plug, personalise, launch”, and “Safe, compliant, and fully supported” cards.
   - **Navigation & mobile menu**:
     - Desktop header markup on multiple pages: `<header class="site-header">…`
     - The Services dropdown button (`.services-toggle`, `.services-label`, `.services-menu`) in the desktop nav.
     - The mobile Services overlay and its pills (`.services-overlay`, `.service-pill`, `.service-link`).
   - **Parallax & backgrounds**:
     - How `.parallax-section` and related classes are styled in `assets/css/parallax-fix.css` and `assets/css/mobile.css`.
     - Any JS-driven parallax or scroll logic in `assets/js/script.js` and `assets/js/hero-shader.js`.
   - **Counters & stats**:
     - The “Show the numbers, not just promises” section markup in `niches/estate-agents.html` (e.g. `.stats`, `.number`, `data-target` attributes).
     - The counter animation logic in `assets/js/script.js` (likely operating on `[data-target]` or `.number` elements).
   - **Codex configuration**:
     - Which model is configured in `.codex/config.toml`, if any.
     - Whether `model_reasoning_effort` is set.
     - How feature flags are declared (root-level booleans vs `[features]` table).
     - Whether any sandbox/network settings are present.

---

## 3. Goals

Codex should ultimately satisfy **all** of the following goals:

- **Cookie-consent banner**
  - [ ] On each page with a banner (`index`, `about`, `services`, `contact`, `book`, `niches/estate-agents`):
    - The banner **appears on page load** if the user has not yet accepted or declined.
    - The banner **stays visible while scrolling** until a choice is made.
    - After clicking **Accept** or **Decline**:
      - The choice is stored in a way that is shared across all pages (e.g. consistent `localStorage` key).
      - The banner **does not reappear** on any page.
  - [ ] The Estate Agents page uses the same underlying logic and state as the other pages; no special-case drift.

- **Vertical spacing on Estate Agents page**
  - [ ] Reduce excess vertical space in the three specific gaps:
    - Between “The branch experience after launch” and “Plug, personalise, launch”.
    - Between “Pricing” and “FAQs”.
    - Between “Never Miss a Viewing” pack and “Show the numbers, not just promises”.
  - [ ] Spacing in these locations matches (or closely matches) the spacing between “Show the numbers, not just promises” and “The branch experience after launch” and respects the site’s design system/scale.

- **Card background opacity**
  - [ ] All cards on the Estate Agents page use a **consistent darker/more opaque** background, matching the appearance of “Show the numbers, not just promises” cards.
  - [ ] This is implemented via reusable CSS (a shared class or updated `.neon-card` variant), scoped so that other pages are not unintentionally affected.

- **Navigation alignment (desktop)**
  - [ ] On desktop, the Services dropdown button in the header sits perfectly aligned with the other nav items.
  - [ ] The fix is implemented via CSS/layout (flex alignment, padding, line-height, etc.), not brittle pixel-offset hacks.

- **Mobile menu: Services pill styling**
  - [ ] In the mobile overlay/menu, the “Services” pill:
    - Uses the same font family, size, weight, and color as other pill buttons.
    - Has the same vertical/horizontal centering and padding.
  - [ ] The Services pill still behaves as a dropdown (opening the services overlay), but visually matches its peers.

- **Estate Agents mobile background image**
  - [ ] The Estate Agents mobile view uses `book-hero-calendly-mobile-2025@*x.webp` as its intended mobile background image for the appropriate hero/section.
  - [ ] Implementation follows existing patterns used on other pages (e.g. `index.html` or `book.html`) to maintain consistency.

- **Index & Services mobile parallax behavior**
  - [ ] On mobile viewports for `index.html` and `services.html`, the body-section background participating in parallax:
    - Continues to have a parallax-like effect while scrolling (if reasonably achievable).
    - **Does not jump or reposition** when the mobile browser’s URL bar appears or disappears due to viewport height changes.
  - [ ] If disabling parallax on mobile is ultimately chosen for robustness, that tradeoff is clearly documented and the effect remains on desktop.

- **Disable counter effect & add `%`**
  - [ ] The counter animation is **disabled** for the “Show the numbers, not just promises” section on the Estate Agents page.
  - [ ] The `68` and `42` values are displayed as `68%` and `42%` (with literal percent signs) in a way that does not break the layout or responsiveness.

- **Desktop vs mobile images for Estate Agents**
  - [ ] Estate Agents content images:
    - Use `Real_Estate_*.jpeg` on desktop.
    - Use `Real_Estate_*_Mobile.jpeg` on mobile.
  - [ ] Implementation uses a standards-aligned approach (e.g. `<picture>` with `<source media="(max-width: …)">`, or CSS background images with media queries).
  - [ ] There are no noticeable layout shifts or unnecessary double-loading.

- **Codex configuration alignment**
  - [ ] `.codex/config.toml` (if used for this project) is updated or confirmed to:
    - Prefer `gpt-5.1-codex-max`.
    - Set `model_reasoning_effort` to `"xhigh"` for this repo by default or within an appropriate profile.
    - Use the recommended `[features]` table for flags like `web_search_request` and `view_image_tool`.
    - Handle sandbox/network settings in a safe, documented way (e.g. `sandbox_workspace_write.network_access` only if intentional).

---

## 4. Non-goals

Codex **must not**:

- Redesign the overall visual identity, typography, or color palette of the site.
- Introduce new frameworks (no React, Vue, Tailwind, etc.) or new build tools.
- Change routing, file structure, or page URLs.
- Implement unrelated features, new pages, or content changes beyond what is required to satisfy the above goals.
- Break existing behaviors on pages not listed, unless strictly required by a well-justified fix (and then it must be documented).

---

## 5. Files & components to inspect (detailed)

Codex should examine at least the following:

- **Estate Agents page**
  - `niches/estate-agents.html`
    - Cookie banner markup (`#cookie-banner`).
    - Sections:
      - “Never miss a viewing or instruction again.” hero.
      - “Never Miss a Viewing” pack content.
      - “Show the numbers, not just promises” stats (`.stats`, `.number`, `data-target`).
      - “The branch experience after launch”.
      - “Plug, personalise, launch”.
      - “Pricing”.
      - “FAQs”.
    - Inline `<style>` element in `<head>` defining `.section`, `.compact-section`, `.stats`, `.neon-card`, etc.
    - Header and navigation markup (desktop and mobile Services overlay).

- **Shared pages**
  - `index.html` (hero, parallax sections, cookie banner, header/nav, services overlay).
  - `services.html` (services layout, parallax section, header/nav).
  - `about.html`, `book.html`, `contact.html` (cookie banner, header/nav).

- **CSS**
  - `assets/css/styles.css` (global layout, header, nav, buttons).
  - `assets/css/custom-styles.css`, `assets/css/custom.css` (cards, sections, gradients, overlays).
  - `assets/css/mobile.css` (mobile-specific styles, parallax adjustments, hero backgrounds).
  - `assets/css/parallax-fix.css` (parallax system, especially mobile handling).
  - `assets/css/services.css` (services-related sections and cards).
  - Any other CSS file referenced by `index.html`, `services.html`, or `niches/estate-agents.html`.

- **JavaScript**
  - `assets/js/cookie-consent.js`:
    - How it checks existing consent.
    - How it shows/hides `#cookie-banner`.
    - Which storage mechanism and key it uses.
  - `assets/js/script.js`:
    - Any scroll, header, or layout-related logic.
    - Counter animation for `[data-target]` or `.number` elements.
    - Parallax or background-position behavior, especially on mobile.
  - `assets/js/hero-shader.js`:
    - How hero media/visuals are configured for `data-variant="amber"` and other variants.
    - Any interactions with hero backgrounds on mobile.

- **Images**
  - Estate Agents images:
    - `assets/images/socialmedia/Real_Estate_1.jpeg` / `Real_Estate_1_Mobile.jpeg`
    - `assets/images/socialmedia/Real_Estate_2.jpeg` / `Real_Estate_2_Mobile.jpeg`
    - `assets/images/socialmedia/Real_Estate_3.jpeg` / `Real_Estate_3_Mobile.jpeg`
  - Hero mobile backgrounds:
    - `assets/images/internet/hero/book-hero-calendly-mobile-2025.webp`
    - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp`, `@2x.webp`, `@3x.webp`

- **Codex configuration**
  - `.codex/config.toml`:
    - Existing keys and structure.
    - How feature flags like `web_search_request` and `view_image_tool` are declared.
    - Any model or reasoning settings present.

---

## 6. Detailed milestones & implementation strategy

Codex should work through the following milestones in order. Each milestone should be fully analyzed and verified before moving on.

### Milestone 0 – Environment, configuration, and baseline checks

- [ ] Confirm repo root and files are available.
- [ ] Read:
  - `AGENTS.md`
  - `PLANS.md`
  - This ExecPlan.
  - `.codex/config.toml`
- [ ] Summarize (internally or briefly in chat) the key instructions from `AGENTS.md` and `PLANS.md`.
- [ ] Note any configuration in `.codex/config.toml` that conflicts with:
  - The desire to use `gpt-5.1-codex-max`.
  - `model_reasoning_effort = "xhigh"`.
  - The need for web search / internet access.
- [ ] If possible, run any lightweight build command that makes sense (e.g. `npm install` once, then `npm run build:css` or `npm run build`) to confirm there are no build-time errors.
- [ ] Determine how to preview the static site (e.g. a simple static file server) and use it consistently for later milestones.

### Milestone 1 – Cookie-consent banner behavior (all pages)

- [ ] Inspect `assets/js/cookie-consent.js`:
  - Identify the storage mechanism (e.g. `localStorage` key name).
  - Determine when and how it decides whether to show the banner.
  - Understand how Accept/Decline are wired (event listeners and style changes).
- [ ] Compare banner markup on:
  - `index.html`
  - `about.html`
  - `services.html`
  - `contact.html`
  - `book.html`
  - `niches/estate-agents.html`
- [ ] Using the preview environment:
  - With cleared storage (no prior consent), open each page and observe:
    - Whether the banner appears on load.
    - Whether it remains visible while scrolling.
  - Click Accept and Decline on at least one page each and verify:
    - Banner disappears and does not reappear on reload.
    - Other pages respect the stored choice.
- [ ] Specifically reproduce the reported Estate Agents behavior:
  - Banner not appearing on initial load.
  - Banner appearing/disappearing only on scroll.
  - Banner reappearing on scroll even after Accept/Decline.
- [ ] Form a hypothesis about why Estate Agents behaves differently (e.g.:
  - Page-specific styles overlapping with banner positioning.
  - Duplicate layout wrappers or z-index issues.
  - Interaction with scroll/animation logic in `script.js`.
- [ ] Implement a **surgical fix** that:
  - Uses a consistent, cross-page storage key for consent.
  - Displays the banner on page load when no choice is stored.
  - Keeps the banner visible and fixed during scroll until Accept/Decline is clicked.
  - Hides the banner permanently (across all pages) after a choice is made.
  - Does **not** introduce page-specific hacks unless necessary; if it does, scope them with a body class such as `.page-estate-agents`.
- [ ] Re-test the banner across all listed pages in both fresh and accepted/declined states.

### Milestone 2 – Vertical spacing between Estate Agents sections

- [ ] In `niches/estate-agents.html`, locate sections containing:
  - “The branch experience after launch”
  - “Plug, personalise, launch”
  - “Pricing”
  - “FAQs”
  - “Never Miss a Viewing” pack
  - “Show the numbers, not just promises”
- [ ] Identify which classes control section spacing (e.g. `.section`, `.compact-section`, modifiers on those sections).
- [ ] Use the browser’s devtools (if available) to inspect margin/padding values for:
  - The **baseline** spacing between “Show the numbers, not just promises” and “The branch experience after launch”.
  - The three problematic gaps listed in the goals.
- [ ] Adjust CSS and/or inline styles to:
  - Reduce the larger gaps so they visually match the baseline spacing.
  - Use existing spacing tokens/scale where possible (e.g. consistent rem values or existing utility classes).
  - Avoid adding arbitrary magic numbers unless absolutely necessary; if used, document why.
- [ ] Confirm that:
  - Desktop layout looks balanced and consistent.
  - Mobile layout remains readable and not overly cramped.

### Milestone 3 – Card background opacity consistency

- [ ] Identify card-related classes on the Estate Agents page:
  - `.neon-card`
  - `.stat`
  - `.dark-card` or similar modifiers.
  - Section-specific wrappers around cards.
- [ ] In CSS and inline styles:
  - Find where card background colors and opacities are defined (e.g. RGBA values, gradients, overlay layers).
  - Compare styles for “Show the numbers, not just promises” cards vs:
    - “Where deals leak away”
    - “Answer instantly. Confirm automatically. Keep the chain warm.”
    - “Plug, personalise, launch”
    - “Safe, compliant, and fully supported”
- [ ] Design a **shared card style** for this page:
  - Either:
    - Promote the darker/opaque background used by stats cards into a shared class.
    - Or update `.neon-card` / `.neon-card` variants under `.page-estate-agents` so that all relevant cards share the darker style.
- [ ] Implement the change in a maintainable way:
  - Prefer scoping via `.page-estate-agents` in CSS to avoid affecting other pages.
  - Avoid duplicating large blocks of CSS; instead, factor common styles.
- [ ] Verify:
  - All specified cards on the Estate Agents page match the desired darker/opaque look.
  - Cards on other pages (e.g. services cards on `services.html`) remain visually unchanged.

### Milestone 4 – Desktop menu banner alignment (Services dropdown)

- [ ] Inspect nav markup on `index.html` and `niches/estate-agents.html`:
  - `<header class="site-header">`, `<nav>`, `<ul>`, `<li>`.
  - The `<li>` containing the Services dropdown:
    - `.services-toggle`
    - `.services-label`
    - `.services-menu`
- [ ] Inspect the CSS responsible for header layout:
  - Header container (`.header-inner`, `.site-header`).
  - Nav list styling.
  - Any rules targeting `.services-toggle` or `.services-label` specifically.
- [ ] Determine why the Services button sits lower (e.g.:
  - Extra top/bottom padding or line-height.
  - Flex alignment differences.
  - Inline-block vs flex children).
- [ ] Adjust the CSS so that:
  - All header nav items (including Services) share consistent vertical alignment.
  - The fix is robust across pages and responsive breakpoints.
- [ ] Verify alignment visually on desktop widths (e.g. ≥ 1024px) on multiple pages.

### Milestone 5 – Mobile menu Services pill styling

- [ ] Inspect the mobile Services overlay markup:
  - `.services-overlay`, `.services-overlay__panel`, `.services-overlay__header`, `.services-overlay__title`.
  - `.service-pill.service-link` elements inside `.services-overlay__grid`.
- [ ] Identify the pill styling for:
  - Regular service pills (`.service-pill.service-link`).
  - Any special styling applied to the “Services” title or pill when seen in the mobile menu context.
- [ ] Confirm the current differences:
  - Font family, size, weight, color.
  - Padding and alignment.
- [ ] Update CSS so that:
  - The Services pill / Services dropdown entry uses the same typography and alignment as other mobile menu pills.
  - The interactive behavior (tapping to open Services overlay or equivalent) remains intact.
- [ ] Test on mobile-width view:
  - Open and close the mobile menu.
  - Interact with the Services entry and other pills.
  - Ensure no regression in click targets or accessibility attributes (e.g. `aria-expanded`).

### Milestone 6 – Background images & parallax behavior

#### 6A – Estate Agents mobile background image

- [ ] Study how mobile hero/background images are handled on:
  - `index.html`
  - `book.html`
  - `services.html`
  - `assets/css/styles.css`, `assets/css/mobile.css`, `assets/css/parallax-fix.css`
  - `assets/js/hero-shader.js` (if it selects variants or canvases based on page/body classes).
- [ ] Determine the appropriate section on the Estate Agents page that should use `book-hero-calendly-mobile-2025@*x.webp` as a mobile background (likely the hero or a top body section).
- [ ] Implement mobile-specific background handling for the Estate Agents page that:
  - Uses the existing patterns for background images (e.g. CSS background-image with media queries, or `<picture>` + `<source>`).
  - Uses the `@1x`, `@2x`, `@3x` versions if appropriate for high-density screens.
  - Is scoped via `.page-estate-agents` to avoid affecting other pages.
- [ ] Verify on mobile:
  - The intended background appears and looks correct.
  - The hero canvas/effects (if present) still behave correctly.

#### 6B – Index & services mobile parallax stability

- [ ] Inspect `assets/css/parallax-fix.css` and `assets/css/mobile.css`:
  - How `.parallax-section` and related layers are defined.
  - Any `background-attachment`, `background-position`, or `transform` rules.
- [ ] Inspect `assets/js/script.js` for:
  - Any scroll event handlers or parallax-specific logic.
  - Any direct use of `window.innerHeight`, `vh` units, or similar that might be sensitive to browser chrome changes.
- [ ] Reproduce the issue (conceptually or via preview):
  - On `index.html` and `services.html`, narrow the viewport to mobile sizes and simulate scroll with the mobile browser URL bar appearing/disappearing.
  - Observe how the body-section parallax background jumps.
- [ ] Design a fix that:
  - Keeps a parallax-like effect on mobile if possible (e.g. translating background layers relative to scroll, but not tied directly to viewport height).
  - Avoids `background-attachment: fixed` on mobile browsers known to cause jumpiness, or uses a more stable transform-based approach.
- [ ] Implement the fix:
  - Prefer CSS-only adjustments if sufficient (e.g. revised `background-attachment`, using wrappers with `overflow: hidden`, adjusting positioning).
  - If JS is needed, keep it small and robust; avoid expensive scroll handlers; consider throttling if necessary.
- [ ] If you determine that a robust parallax effect on mobile is infeasible without significant complexity:
  - Clearly document the tradeoff in a short comment or ExecPlan note.
  - Implement a conservative fallback:
    - Disable parallax on small screens while keeping it on desktop.
- [ ] Verify:
  - Desktop parallax still functions as before.
  - On mobile, the background no longer jumps with URL bar changes.
  - Layout and content remain readable.

### Milestone 7 – Disable counter effect and add `%`

- [ ] In `niches/estate-agents.html`, inspect the “Show the numbers, not just promises” section:
  - `.stats` container.
  - `.number` elements with `data-target="68"` and `data-target="42"`.
- [ ] In `assets/js/script.js`, find the counter logic (likely selecting elements with `data-target` or `.number`).
- [ ] Confirm whether this logic is globally applied or scoped to specific sections/pages.
- [ ] Implement a change so that:
  - The Estate Agents “Show the numbers” section no longer animates counts.
  - The numbers for the first two stats are rendered as literal `68%` and `42%` in the DOM.
  - A third stat (`2x`) continues to render correctly.
- [ ] Possible strategies (Codex to choose based on codebase):
  - Disable the counter script entirely if it is only used on this page.
  - Or teach the script to skip elements that already contain a `%` or specific data attributes.
  - Or remove `data-target` attributes from these specific elements and set their text to the final values.
- [ ] Verify that:
  - The section renders correctly on desktop and mobile.
  - There are no JS errors related to missing `data-target` or counter elements.

### Milestone 8 – Desktop vs mobile Estate Agents images

- [ ] Locate all `Real_Estate_*.jpeg` references in `niches/estate-agents.html`.
- [ ] Ensure that each corresponding `_Mobile` variant is available in `assets/images/socialmedia`.
- [ ] Decide on an implementation approach, for example:
  - Wrap each `<img>` in a `<picture>` element with:
    - `<source>` for mobile (using `media` with a max-width breakpoint) pointing to `Real_Estate_*_Mobile.jpeg`.
    - `<img>` fallback pointing to the desktop `Real_Estate_*.jpeg`.
  - Or use CSS background images with media queries on appropriately sized wrappers.
- [ ] Implement the chosen pattern consistently for all three Estate Agents images.
- [ ] Verify:
  - On desktop widths, desktop images (`Real_Estate_*.jpeg`) are used.
  - On mobile widths, mobile images (`Real_Estate_*_Mobile.jpeg`) are used.
  - Layout and aspect ratios remain correct; no unwanted stretching or layout shifts.

### Milestone 9 – `.codex/config.toml` review and alignment

- [ ] Open `.codex/config.toml` and map the current contents against the Codex configuration docs:
  - Confirm whether:
    - A `model` is set.
    - `model_reasoning_effort` is present.
    - Feature flags like `web_search_request` and `view_image_tool` are declared using the `[features]` table.
    - Any sandbox/sandbox_workspace_write settings exist, including `network_access`.
- [ ] Decide on a minimal, aligned configuration for this project, consistent with:
  - Using `gpt-5.1-codex-max` for default work.
  - Setting `model_reasoning_effort = "xhigh"` for this repo or in a dedicated profile.
  - Enabling `web_search_request` and `view_image_tool` under `[features]` where appropriate.
  - Keeping `sandbox_workspace_write.network_access` disabled by default unless the human explicitly wants internet access for command execution; internet access for *the agent* can still be configured separately in cloud environments.
- [ ] Implement changes carefully without breaking TOML syntax, for example (conceptual, not a final diff):
  - Add or update:
    - `model = "gpt-5.1-codex-max"`
    - `model_reasoning_effort = "xhigh"`
  - Introduce or update:
    - `[features]`
      - `web_search_request = true`
      - `view_image_tool = true`
  - Adjust or add sandbox settings only if necessary and in line with docs.
- [ ] Document the changes briefly in comments within `.codex/config.toml` or in this ExecPlan’s notes so future users understand why they were made.

---

## 7. Testing & verification plan

At the end of implementation, Codex must perform the following checks:

1. **Cookie-consent banner**
   - Clear localStorage/cookies or use a private window.
   - Visit, in any order:
     - `index.html`
     - `about.html`
     - `services.html`
     - `contact.html`
     - `book.html`
     - `niches/estate-agents.html`
   - Verify on each page:
     - Banner appears on load when no choice is stored.
     - Banner remains visible during scroll.
   - Accept cookies on one page, reload all pages, and confirm:
     - Banner does not appear anywhere.
   - Repeat with Decline (from a fresh state), confirming the same behavior.

2. **Estate Agents layout**
   - On desktop and on a mobile-width viewport:
     - Scroll through the Estate Agents page and visually check:
       - Spacing between the specific pairs of sections.
       - Card backgrounds (all specified cards match the darker/opaque reference).
       - Header navigation alignment.
       - Mobile menu Services pill styling.
       - The “Show the numbers” section displays `68%` and `42%` without animation.

3. **Background & parallax**
   - Estate Agents page:
     - On mobile width, confirm that the intended mobile background image is visible in the hero/body section.
   - `index.html` and `services.html`:
     - On desktop, verify parallax looks unchanged.
     - On mobile, scroll and observe:
       - No visible jumping or repositioning when the URL bar appears/disappears.
       - Background still behaves as intended (either parallax-like or stable fallback).

4. **Estate Agents images (desktop vs mobile)**
   - At desktop width, confirm that `Real_Estate_1/2/3.jpeg` are used.
   - At mobile width, confirm that `Real_Estate_1/2/3_Mobile.jpeg` are used.
   - Check for any console errors or 404s related to image paths.

5. **Configuration**
   - Re-open `.codex/config.toml` and confirm:
     - `model` and `model_reasoning_effort` are set as intended.
     - Feature flags live under `[features]`.
     - The file is valid TOML and matches the patterns in the Codex configuration docs.

6. **Sanity checks**
   - If feasible, re-run:
     - `npm run build:css`
     - `npm run build`
   - Confirm:
     - No new build errors.
     - No unexpected console errors on key pages.

---

## 8. Logging & change tracking expectations

While executing this ExecPlan, Codex should:

- Update checkboxes in this document as milestones are completed (if allowed in the environment).
- Optionally add a short **“Progress & Notes”** section at the bottom summarizing:
  - What was changed in each milestone.
  - Any tradeoffs made (e.g. disabling mobile parallax).
- When preparing commits or summaries:
  - Group changes by milestone/concern (cookie banner, spacing, card styling, navigation, parallax, counters, images, config).
  - Use clear, human-readable descriptions that map back to the goals listed above.

This ExecPlan is complete when all goals in Section 3 are met and the testing plan in Section 7 passes without regressions.

## Progress & Notes

- [x] Cookie banner made consistent across all pages with explicit show/hide states and supporting CSS.
- [x] Estate Agents spacing tightened between specified sections; cards share a unified darker background treatment.
- [x] Numbers section now static (`68%`, `42%`, `2x`) with counters disabled on this page.
- [x] Desktop navigation Services item aligned; mobile Services pill typography aligned with other entries.
- [x] Mobile parallax replaced with static themed backgrounds to eliminate URL-bar jumpiness while keeping desktop unchanged.
- [x] Estate Agents images now serve mobile variants via `<picture>` sources.
- [x] `.codex/config.toml` reviewed—already aligned with recommended model, reasoning effort, and features.
