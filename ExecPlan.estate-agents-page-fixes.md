# Estate Agents page: cookie, layout, and responsive fixes

## Purpose / Big Picture

The goal of this ExecPlan is to bring the Estate Agents niche page and its shared components up to the same level of polish and reliability as the rest of the Silverstone site.

After this work:

- Users visiting the Estate Agents page see a **stable, compliant cookie banner** that behaves identically to other pages.
- The page’s **section spacing** feels consistent and intentional across desktop and mobile.
- All **cards share a consistent dark, legible background**, reinforcing the visual design.
- The **“Services” navigation button and mobile pill** align and style correctly with other nav items.
- The **background and parallax effect** work for the Estate Agents page on mobile and desktop, including the `book-hero-calendly-mobile-2025@*x.webp` imagery.
- The **“Show the numbers, not just promises”** section shows static stats (with `%` where expected) and no longer animates.
- The Estate Agents page uses **responsive Real_Estate images** (`Real_Estate_*_Mobile.jpeg` vs `Real_Estate_*.jpeg`) based on viewport.

The reader should assume no prior context: you have only this ExecPlan, the working tree, and any guidance in `AGENTS.md` and `PLANS.md`.

---

## Progress

Use this section as a living checklist while implementing the plan. Do not modify it unless a task explicitly asks you to update the ExecPlan.

- [ ] Confirm repository orientation and relevant files identified.
- [ ] Verify current Estate Agents page behavior (cookie banner, spacing, cards, nav, background, counters, images).
- [ ] Fix cookie consent behavior on Estate Agents page (and validate cross-page behavior).
- [ ] Adjust vertical spacing between the specified section pairs.
- [ ] Standardize card background opacity on the Estate Agents page.
- [ ] Fix desktop Services dropdown menu button alignment.
- [ ] Align Services pill styling in the mobile menu overlay.
- [ ] Fix mobile background image & parallax behavior for the Estate Agents page.
- [ ] Disable counters & show percentages for “Show the numbers, not just promises”.
- [ ] Implement responsive Real_Estate imagery (mobile vs desktop).
- [ ] Run any relevant build/check commands and sanity-check HTML/CSS/JS.
- [ ] Summarize changes and update this ExecPlan’s Decision Log and Outcomes (if requested).

---

## Surprises & Discoveries

Leave notes here when you discover non-obvious behavior or constraints while working (only when a future task asks you to keep this updated). Examples:

- Unexpected interactions between `assets/js/script.js` mobile-parallax logic and `assets/css/mobile.css`.
- Cross-page side-effects of CSS selectors (e.g. `.faq-section`, `.stats`, `.neon-card`).
- Any inconsistencies between pages using the shared header and services overlay.

---

## Decision Log

Record significant decisions here (only if a task asks to update the ExecPlan). Include:

- What you changed.
- Why you chose that approach over alternatives.
- Any tradeoffs (e.g. scoping CSS to `.page-estate-agents` vs modifying global utilities).

---

## Outcomes & Retrospective

At the end of the work (if asked to update), capture:

- Which acceptance criteria were fully met.
- Any remaining limitations or follow-up tasks.
- Notes on what went well or was difficult for Codex in this repo.

---

## Context and Orientation

### Project structure

This is a static site with:

- HTML pages:
  - `index.html` (home)
  - `about.html`
  - `services.html`
  - `book.html`
  - `contact.html`
  - `niches/estate-agents.html` (Estate Agents niche page)
  - Other content pages (e.g. `privacy-policy.html`)

- CSS (under `assets/css/`):
  - `styles.css` – main site styles (layout, cards, nav, grid, etc.).
  - `custom.css` – additional hero/animation/cookie tweaks.
  - `custom-styles.css` – further overrides and refinements.
  - `mobile.css` – mobile-specific adjustments (backgrounds, spacing).
  - `parallax-fix.css` – parallax-related backgrounds and mobile parallax helpers.
  - `hero-base.css` – base hero styling shared across pages.
  - `services.css`, `premium-gallery.css`, `marquee-single.css`, `marquee-double.css`, `icons.css` – other component styles.

- JS (under `assets/js/`):
  - `script.js` – main behavior:
    - Enhanced header/nav (desktop + mobile overlay).
    - Services dropdown and services overlay behavior.
    - Scroll-hide header logic and indicator bar.
    - Mobile parallax/background behavior using `PARALLAX_MAP` and `data-parallax-theme`.
    - Stats counter animation for elements with `.stats` and `.number[data-target]`.
  - `cookie-consent.js` – cookie banner logic, using `localStorage` and a cookie `silverstone_cookie_choice`.
  - `hero-shader.js` – hero canvas shader, not directly modified here.

- Node tooling:
  - `package.json` – simple build tooling (CSS build, image optimization) but no runtime framework.
  - `build-css.js`, `scripts/optimize-images.js` – optional utilities for building CSS / optimizing images.

### Estate Agents page structure

The main file is `niches/estate-agents.html`. Key areas:

- Body:
  - `<body class="page-estate-agents">` used to scope page-specific CSS.
- Shared header and nav:
  - `<header class="site-header">` with:
    - `.nav-toggle` (hamburger).
    - `<nav><ul>…</ul></nav>` with nav items:
      - `<li><a href="../index.html">Home</a></li>`
      - `<li><a href="../about.html">About</a></li>`
      - `<li class="nav-dropdown">` containing:
        - `<button class="services-toggle">`
        - `.services-label`, `.chevron`.
        - `.services-menu` with `.service-link` anchors, including Estate Agents.
    - This structure is shared across other pages (different hrefs / active link).
- Cookie banner:
  - `<div id="cookie-banner" class="cookie-banner" style="display: none;">...` with:
    - Buttons `#cookie-accept-btn` and `#cookie-decline-btn`.
  - Shared markup with other pages (paths differ in the privacy link).
- Sections (in order):
  1. Hero section (title-band style hero with `hero` and `hero-shader-canvas`).
  2. “Where deals leak away”:
     - `<section class="section bg-lines animate parallax-section" data-parallax-theme="book">`
     - `.service-row`, `.service-image.neon-card`, `.service-content.neon-card.dark-card`.
  3. “The 'Never Miss a Viewing' pack”:
     - `<section class="section bg-circuit animate parallax-section" data-parallax-theme="book">`
     - Heading with `id="never-miss-viewing-pack"`.
     - `.service-row` with `.service-content.neon-card.dark-card`.
  4. “Show the numbers, not just promises”:
     - `<section class="section bg-lines animate parallax-section compact-section" data-parallax-theme="book">`
     - `<div class="stats">` with `.neon-card.stat` children.
     - Each `.number` uses `data-target` (e.g. `68`, `42`) and currently text content like `68`, `42` (without `%`).
     - Script in `assets/js/script.js` animates `.number[data-target]` when the section is in view, unless `data-counter="off"` is set on the `.stats` container.
  5. “The branch experience after launch”:
     - `<section class="section bg-circuit animate parallax-section" data-parallax-theme="book">`
     - `.service-row` with `Real_Estate_2` imagery.
  6. “Plug, personalise, launch”:
     - `<section class="section bg-lines animate parallax-section compact-section" data-parallax-theme="book">`
     - `.values` containing `.value-card.neon-card.dark-card`.
  7. “Safe, compliant, and fully supported”:
     - `<section class="section bg-lines animate parallax-section compact-section" data-parallax-theme="book">`
     - `.value-grid` with `.value-card.neon-card.dark-card`.
  8. “Pricing”:
     - `<section class="section bg-lines animate parallax-section compact-section" data-parallax-theme="book" id="pricing">`
     - A single `.neon-card` around the pricing text.
  9. “Estate Agent Automation FAQs”:
     - `<section class="section bg-lines animate parallax-section compact-section" data-parallax-theme="book">`
     - `.faq-section` containing `<details class="neon-card faq-item">` entries.
     - `.faq-section` has global `margin-top: 3rem` in `assets/css/styles.css`.
  10. Final CTA / banner section.

### Card backgrounds

- Base card style: `.neon-card` (global in `assets/css/styles.css`) gives semi-transparent, glassy background.
- Estate-specific darkening:
  - Inline CSS in `niches/estate-agents.html` defines `.dark-card` as a darker, more opaque background, applied to specific cards:
    - `.service-content.neon-card.dark-card` in “Where deals leak away” and “Never Miss a Viewing”.
    - `.value-card.neon-card.dark-card` in “Plug, personalise, launch” and “Safe, compliant, and fully supported”.
- The stats cards in “Show the numbers, not just promises” are just `.neon-card.stat` (no `dark-card`), but visually the user wants all cards to match one consistent dark style.

### Nav and services overlay

- Desktop nav uses:
  - `<li><a>` links for most items.
  - `<li class="nav-dropdown">` with a `<button class="services-toggle">` and `.services-menu`.
- Mobile behavior (in `assets/js/script.js`):
  - A full-screen overlay nav on small viewports (controlled via `body` classes and injected CSS).
  - A separate **Services overlay** overlay, with structure:
    - `.services-overlay`, `.services-overlay__title`, `.services-overlay__grid`, `.service-pill.service-link`.
  - On mobile, the “Services” entry in the nav must look and feel like the other nav pills.

### Cookie consent logic

`assets/js/cookie-consent.js`:

- On `DOMContentLoaded`, it:
  - Queries `#cookie-banner`, `#cookie-accept-btn`, `#cookie-decline-btn`.
  - Uses `STORAGE_KEY = 'silverstone_cookie_choice'`.
  - Checks both `localStorage.getItem(STORAGE_KEY)` and a cookie of the same name.
  - If a value is found, hides the banner and returns.
  - Otherwise:
    - Sets `banner.style.display = 'flex'`.
    - Wires click handlers:
      - Accept/decline store the choice in `localStorage` and as a cookie (`path=/`, long `max-age`).
      - Hides the banner once clicked.

The reported issue is that on the Estate Agents page the banner:
- Sometimes doesn’t show on load.
- May flicker with scroll.
- May continue to appear/disappear with scroll even after accept/decline.

We will need to:
- Confirm the banner is found and initialized identically on all pages.
- Check for CSS or JS interactions unique to `page-estate-agents` that toggle visibility while scrolling.
- Make the behavior deterministic and identical across pages.

### Background images and parallax

- CSS (`assets/css/mobile.css`, `assets/css/parallax-fix.css`) sets:
  - Mobile backgrounds for `.section.bg-lines` and `.section.bg-circuit` using `book-hero-calendly-mobile-2025@1x.webp` / `@2x.webp` and `section-waves.webp`.
- JS parallax (`assets/js/script.js`):
  - Defines `PARALLAX_MAP` with themes like `"lines"`, `"circuit"`, and `"book"`.
  - Uses `.parallax-section[data-parallax-theme]` to attach background layers on mobile.
  - For `data-parallax-theme="book"`, it also uses `book-hero-calendly-mobile-2025@*x.webp` for the parallax mobile layer.
  - Paths like `assets/images/...` must resolve correctly for:
    - Root pages (`index.html`, `services.html`, etc.).
    - Nested pages like `niches/estate-agents.html`.

The Estate Agents page sections (`.section.bg-lines` / `.bg-circuit` with `data-parallax-theme="book"`) must still show their backgrounds correctly on mobile, even from the nested path.

### Real_Estate imagery

- Estate Agents content uses:
  - `../assets/images/socialmedia/Real_Estate_1.jpeg`
  - `../assets/images/socialmedia/Real_Estate_2.jpeg`
  - `../assets/images/socialmedia/Real_Estate_3.jpeg`
- The corresponding mobile variants exist:
  - `Real_Estate_1_Mobile.jpeg`
  - `Real_Estate_2_Mobile.jpeg`
  - `Real_Estate_3_Mobile.jpeg`

We want:
- Desktop: `Real_Estate_*.jpeg`
- Mobile: `Real_Estate_*_Mobile.jpeg`
- Implemented via `<picture>` + `<source media="(max-width: …)">` or `srcset`/`sizes`, while keeping existing layout and classes (`.service-image`, `.service-img`).

---

## Plan of Work

High-level phases:

1. **Orientation and verification**
   - Confirm the relevant files and selectors for each bug.
   - Verify actual behavior (at least by reasoning from code, and ideally by running a static server and inspecting in a browser).

2. **Cookie consent behavior**
   - Compare markup and behavior across pages.
   - Ensure `cookie-consent.js` initializes the banner exactly once per page.
   - Confirm persistence via `localStorage` and cookies works across root and nested paths.
   - Fix any per-page differences or scroll-triggered visibility issues.

3. **Spacing fixes**
   - Identify all CSS rules and HTML structures that contribute to vertical spacing between:
     - “The 'Never Miss a Viewing' pack” and “Show the numbers, not just promises”.
     - “Show the numbers, not just promises” and “The branch experience after launch” (desired baseline gap).
     - “The branch experience after launch” and “Plug, personalise, launch”.
     - “Pricing” and “FAQs”.
   - Use Estate-specific selectors (e.g. `body.page-estate-agents`) to adjust padding/margins so the three problematic gaps visually match the baseline spacing.

4. **Card background consistency**
   - Decide which card background is the visual baseline (per the report: the darker/more opaque “Show the numbers” style).
   - Implement a DRY CSS rule that makes all `.neon-card`-based cards on the Estate Agents page share this background, without altering other pages.
   - Remove redundant inline styles if appropriate.

5. **Nav alignment and Services pill styling**
   - On desktop:
     - Inspect `.nav-dropdown` / `.services-toggle` styles relative to `<li><a>` nav links.
     - Adjust line-height, padding, or flex alignment so the “Services” button is vertically aligned with peers.
   - On mobile:
     - Inspect the mobile nav overlay and services overlay.
     - Ensure the Services pill/dropdown matches other pills in font family, size, color, and center alignment by sharing existing classes/utilities.

6. **Mobile background and parallax**
   - Verify how `PARALLAX_MAP` resolves image URLs and how they behave from `niches/estate-agents.html`.
   - Ensure `book-hero-calendly-mobile-2025@1x/2x.webp` is used on mobile for the Estate Agents backgrounds (either via CSS or JS, ideally both in a consistent way).
   - Fix relative paths or logic so nested pages use the same imagery and parallax behavior as root pages.

7. **Counters and percentages**
   - Restrict counter animation logic to stats sections that should animate (home/about).
   - Disable animation for the Estate Agents “Show the numbers” stats, e.g. using `data-counter="off"` on that `.stats` container.
   - Set the metric numbers to show `68%` and `42%` as static text.

8. **Responsive Real_Estate imagery**
   - Replace simple `<img>` tags for Real_Estate assets with responsive `<picture>` or `srcset` patterns.
   - Ensure mobile uses `Real_Estate_*_Mobile.jpeg` and desktop uses `Real_Estate_*.jpeg`.
   - Keep lazy-loading and classes (`.service-img`) intact.

9. **Validation and checks**
   - Run any relevant `npm` scripts if needed after CSS/JS edits.
   - Manually (or by careful code inspection) verify each bug’s acceptance criteria.
   - Summarize changes for human reviewers.

10. **Config alignment**
    - If `.codex/config.toml` exists, confirm or suggest (in a future task) that:
      - `model = "gpt-5.1-codex-max"`.
      - `model_reasoning_effort = "xhigh"`.
      - Internet tools (web search) are enabled only for documentation domains.
    - Do not create or edit `.codex/config.toml` unless explicitly asked.

---

## Concrete Steps

Follow these steps in order when implementing this ExecPlan.

### 1. Orientation

1. From the repo root, inspect key files:
    - `niches/estate-agents.html`
    - `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`
    - `assets/css/styles.css`, `assets/css/custom.css`, `assets/css/custom-styles.css`, `assets/css/mobile.css`, `assets/css/parallax-fix.css`, `assets/css/hero-base.css`, `assets/css/services.css`
    - `assets/js/script.js`, `assets/js/cookie-consent.js`, `assets/js/hero-shader.js`
2. Use a search tool (e.g. `rg`):
    - To find `cookie-banner`, `page-estate-agents`, `parallax-section`, `data-parallax-theme`, `.stats`, `.neon-card`, `.faq-section`, `Real_Estate_`.
3. Optionally run a local static server to reason about actual behavior:
    - From the repo root, run something like:
      - `python -m http.server 4173` or `npx http-server .` (depending on environment).
    - Access `index.html` and `niches/estate-agents.html` in a browser to visually inspect the issues described.

### 2. Cookie consent behavior

1. Confirm markup:
    - Ensure each page includes exactly one `<div id="cookie-banner" class="cookie-banner">`.
    - The Estate Agents page should match the structure found in `index.html`, differing only in the privacy link URL.
2. Inspect `assets/js/cookie-consent.js`:
    - Confirm it:
      - Uses a consistent `STORAGE_KEY = 'silverstone_cookie_choice'`.
      - Checks `localStorage` and cookies.
      - Sets `banner.style.display = 'flex'` only when no choice is stored.
      - Hides the banner (via `display = 'none'` or similar) after accept/decline.
3. Compare script inclusion:
    - Ensure all pages include `assets/js/cookie-consent.js` with the correct relative path (e.g. `../assets/js/cookie-consent.js` in `niches/`, `assets/js/cookie-consent.js` at root).
4. Debug potential Estate-specific issues:
    - Check for any CSS in `assets/css/styles.css`, `assets/css/custom.css`, or inline styles that might:
      - Alter `.cookie-banner` visibility on scroll (e.g. `position`, `transform`, or `opacity` tied to header state).
    - Check `assets/js/script.js` to confirm it does not indirectly manipulate `.cookie-banner`.
5. Implement fixes:
    - Ensure the banner:
      - Appears on page load only when no choice is stored.
      - Stays fixed at the bottom and does not flicker while scrolling.
      - Disappears permanently after accept or decline, on all pages.
    - If needed, add a simple guard in `cookie-consent.js` to:
      - Prevent re-initialization if it was already initialized once per page load.
      - Normalize any inline `style` values that may be overwritten by CSS.
6. Validate:
    - In a browser, test:
      - Estate page as a first visit (no LS/cookie) → banner visible and stable until action.
      - Click accept/decline → banner hides and stays hidden on scroll.
      - Navigate to other pages → banner remains hidden.
      - If accept/decline is clicked on another page first, visit the Estate Agents page → banner does not appear.

### 3. Spacing between specific sections

1. Identify spacing contributors:
    - Base spacing: `.section` in `assets/css/styles.css` (padding top/bottom).
    - Compact spacing: `.section.compact-section` defined in inline CSS in `niches/estate-agents.html`.
    - Additional margins:
      - `.stats` (inline CSS: `margin-top: 2rem`).
      - `.faq-section` (`margin-top: 3rem` in `styles.css`).
2. Focus on the three problematic pairs:
    - Pair A:
      - “The 'Never Miss a Viewing' pack” (`<section class="section bg-circuit animate parallax-section">`) and
      - “Show the numbers, not just promises” (`<section class="section bg-lines animate parallax-section compact-section">`).
    - Pair B:
      - “The branch experience after launch” (`<section class="section bg-circuit animate parallax-section">`) and
      - “Plug, personalise, launch” (`<section class="section bg-lines animate parallax-section compact-section">`).
    - Pair C:
      - “Pricing” (`<section id="pricing" class="section bg-lines animate parallax-section compact-section">`) and
      - “Estate Agent Automation FAQs” (`<section class="section bg-lines animate parallax-section compact-section">` containing `.faq-section`).
3. Use the baseline:
    - Observe or reason about the gap between:
      - “Show the numbers, not just promises” and “The branch experience after launch”.
    - Use that spacing as the target visual gap for the other three interfaces.
4. Implement scoped adjustments:
    - Prefer CSS under a `body.page-estate-agents` scope in `assets/css/custom-styles.css` or `assets/css/custom.css`, for example:
      - Reduce `margin-top` for `.faq-section` only on this page.
      - Adjust `padding-top` for `.section.bg-lines.compact-section` when it follows `.section.bg-circuit` on this page.
      - Optionally fine-tune `.stats` margin-top specifically under `.page-estate-agents`.
    - Avoid changing global `.section` spacing that would affect other pages.
5. Validate:
    - Compare vertical gaps:
      - Pair A, B, C vs the baseline pair.
    - Ensure spacing still looks good across mobile and desktop breakpoints.

### 4. Card background opacity consistency

1. Determine baseline visual style:
    - Inspect `.neon-card` background and `.dark-card` override in:
      - `assets/css/styles.css` (base `.neon-card`).
      - Inline `<style>` in `niches/estate-agents.html` (for `.dark-card`).
    - Decide which background is the correct “final” appearance (per the spec, match the darker/more opaque appearance used on the metrics cards or whichever is most legible).
2. Implement DRY styling:
    - Introduce an Estate-scoped rule in a shared CSS file (e.g. `assets/css/custom-styles.css`):
      - Example approach:
        - `body.page-estate-agents .neon-card { /* dark background & border consistent with .dark-card */ }`
      - Or, if more precise:
        - `body.page-estate-agents .section .neon-card` (and variants for `.value-card.neon-card`, `.service-content.neon-card`, `.cta-card.neon-card`, `.faq-item.neon-card`).
    - Optionally refactor `.dark-card` so the rule simply reuses that token for all Estate cards, or remove the `.dark-card` class entirely if redundant (but keep this localized to Estate Agents usage).
3. Ensure no global regressions:
    - Do not modify `.neon-card` globally without a `body.page-estate-agents` prefix.
    - Confirm other pages (home, about, services) still render their cards as before.
4. Validate:
    - On the Estate Agents page, confirm:
      - Cards in:
        - “Show the numbers, not just promises”
        - “Where deals leak away”
        - “Answer instantly. Confirm automatically. Keep the chain warm.”
        - “Plug, personalise, launch”
        - “Safe, compliant, and fully supported”
        - Pricing & FAQs cards
      - All share the same dark, opaque background.

### 5. Services nav alignment and mobile pill styling

1. Desktop nav alignment:
    - Inspect header markup in `index.html` and `niches/estate-agents.html`:
      - `<li><a>` nav links vs `<button class="services-toggle">` inside `<li class="nav-dropdown">`.
    - In `assets/css/styles.css` and `assets/css/custom.css`:
      - Locate styles for `.site-header nav`, `.nav-dropdown`, `.services-toggle`, `.services-label`, `.chevron`.
    - Adjust CSS so that:
      - `.services-toggle` shares the same vertical alignment, font, and padding as regular nav links.
      - Consider making `.services-toggle` adopt the same base styles as `.site-header nav a` and tweak only what’s necessary (e.g. arrow icon).
2. Mobile Services pill styling:
    - Inspect mobile overlay nav and services overlay:
      - Look for `.services-overlay`, `.services-overlay__title`, `.services-overlay__grid`, `.service-pill`, `.service-link`.
    - Ensure the “Services” entry (the dropdown/pill control) in the mobile overlay:
      - Uses the same font family, size, weight, and color as other nav pills.
      - Is horizontally and vertically centered like other pill buttons.
    - If needed:
      - Apply a shared class (e.g. `.service-pill`) to the Services control.
      - Or create a small modifier class that extends the common pill styles.
3. Validate:
    - On desktop, confirm nav items appear in one straight line.
    - On mobile, open the nav overlay and verify:
      - The Services entry matches other pills visually.
      - Tapping Services still opens the services overlay as before.

### 6. Mobile background and parallax for Estate Agents

1. Inspect CSS background rules:
    - In `assets/css/mobile.css` and `assets/css/parallax-fix.css`, find:
      - `.section.bg-lines`, `.section.bg-circuit` rules.
      - Usage of `book-hero-calendly-mobile-2025@1x.webp` / `@2x.webp`.
      - `parallax-mobile-stage` / `parallax-mobile-layer` styles.
2. Inspect JS parallax logic:
    - In `assets/js/script.js`:
      - Find `PARALLAX_MAP` and the entry for `book` theme.
      - Confirm mobile backgrounds for theme `"book"` (standard/fallback images) use the correct URLs.
      - Confirm the code that:
        - Selects `.parallax-section[data-parallax-theme]` elements.
        - Creates `parallax-mobile-stage` and `parallax-mobile-layer` elements.
        - Sets `layer.style.backgroundImage` based on `PARALLAX_MAP`.
3. Fix relative paths for nested pages:
    - Ensure image URLs used by `PARALLAX_MAP` work from both:
      - Root pages (e.g. `index.html`).
      - `niches/estate-agents.html`.
    - Potential approaches:
      - Compute an `assetBase` dynamically using `document.currentScript.src` or `window.location.pathname`, then construct URLs like `${assetBase}/images/...`.
      - Or normalize to root-relative URLs (e.g. `/assets/images/...`) if the hosting environment supports it.
4. Confirm Estate Agents sections use correct theme:
    - Estate Agents sections (e.g. `.section.bg-lines` and `.section.bg-circuit` with `data-parallax-theme="book"`) should:
      - Continue to use the same imagery and parallax behavior as other pages.
      - Show `book-hero-calendly-mobile-2025@*x.webp` on mobile.
5. Validate:
    - Reason about mobile behavior from the code and, if possible, in a browser/emulator:
      - Estate Agents page on mobile should show the background imagery behind the content.
      - Parallax behavior (scrolling with static-like background) should still feel intact.
    - Confirm no regressions on other pages that use parallax themes.

### 7. Counters and percentages for “Show the numbers, not just promises”

1. Inspect stats markup in `niches/estate-agents.html`:
    - Confirm:
      - `div class="stats">` container around `.neon-card.stat`.
      - `.number` elements with `data-target="68"` / `42` etc.
2. Inspect stats counter logic in `assets/js/script.js`:
    - The script:
      - Finds `.stats` containers.
      - Filters out any with `data-counter="off"`.
      - For each `.number[data-target]`, animates from 0 to the target (with optional `data-plus` suffix).
3. Implement Estate-specific behavior:
    - In `niches/estate-agents.html`:
      - Add `data-counter="off"` to the `div class="stats">` container for “Show the numbers, not just promises”.
      - Change the first two metric values to show `68%` and `42%` as static text:
        - Either:
          - Set `data-target="68"` and inner text `68%`, or
          - Remove `data-target` attributes entirely and simply use `68%` / `42%`.
      - Ensure any suffixes (`data-plus` attributes) are not needed for these particular metrics.
4. Confirm that:
    - Home and about stats keep their counter behavior.
    - The Estate Agents stats display static values with `%` visible and do not animate.

### 8. Responsive Real_Estate imagery

1. Identify Real_Estate images:
    - In `niches/estate-agents.html`, locate `<img>` tags where `src` contains `Real_Estate_1.jpeg`, `Real_Estate_2.jpeg`, `Real_Estate_3.jpeg`.
2. Convert to responsive markup:
    - Replace each simple `<img>` with a `<picture>` pattern that:
      - Uses `Real_Estate_*_Mobile.jpeg` for mobile (small viewports).
      - Uses `Real_Estate_*.jpeg` for larger viewports as default.
    - Example pattern:
      - `<picture>`
        - `<source srcset="../assets/images/socialmedia/Real_Estate_1_Mobile.jpeg" media="(max-width: 768px)">`
        - `<source srcset="../assets/images/socialmedia/Real_Estate_1.jpeg">`
        - `<img src="../assets/images/socialmedia/Real_Estate_1.jpeg" alt="..." class="service-img" loading="lazy" />`
      - Preserve `class="service-img"` and `loading="lazy"`.
3. Confirm the layout:
    - The `.service-image.neon-card` wrappers and `.service-row` layout should remain unchanged.
    - No extra spacing or alignment regressions should appear.

### 9. Validation and checks

1. Run any relevant commands:
    - If CSS/JS bundling is part of the workflow, run:
      - `npm install` (if dependencies are missing or changed).
      - `npm run build` or `npm run build:css` as appropriate.
2. Sanity checks:
    - Use `rg` or a similar tool to confirm:
      - No unintended occurrences of new classes outside `niches/estate-agents.html`.
      - Changes are localized to intended HTML/CSS/JS files.
3. Browser-centered validation (for a human reviewer):
    - On desktop:
      - Open `index.html` and `niches/estate-agents.html`.
      - Verify cookie behavior, nav alignment, card backgrounds, spacing, and stats.
    - On mobile / in device emulation:
      - Verify mobile nav and Services pill styling.
      - Confirm Estate Agents backgrounds show correctly and parallax feels intact.
      - Confirm Real_Estate images switch to mobile variants.
4. Summarize for review:
    - Provide a brief bullet-point summary:
      - Files changed, with purpose.
      - How each of the eight issues has been resolved.
      - Any remaining caveats or manual testing recommendations.

---

## Validation and Acceptance

The work described by this ExecPlan is complete when:

1. **Cookie banner**
   - On any first visit (no prior choice), the cookie banner appears on page load on all pages (including Estate Agents) and stays visible during scroll until accept/decline is clicked.
   - After a choice is made on any page, the banner does not appear again on any page (including Estate Agents), even on reload or navigation.

2. **Spacing**
   - The vertical gaps:
     - Between “Never Miss a Viewing pack” and “Show the numbers, not just promises”.
     - Between “The branch experience after launch” and “Plug, personalise, launch”.
     - Between “Pricing” and “FAQs”.
   - Are visually consistent with the gap between “Show the numbers, not just promises” and “The branch experience after launch”, on both desktop and mobile.

3. **Card backgrounds**
   - All Estate Agents cards (stats, services, value cards, pricing card, FAQ cards, final CTA) share a consistent, darker card background and border treatment.
   - Other pages using `.neon-card` are unaffected.

4. **Nav alignment / Services pill**
   - On desktop, the “Services” dropdown button is vertically aligned with Home/About/Book/Contact.
   - On mobile, the Services entry in the nav overlay looks and feels like the other nav pills (same font family, size, color, and centered alignment).

5. **Mobile background & parallax**
   - On the Estate Agents page, mobile users see the intended background imagery (using `book-hero-calendly-mobile-2025@1x/2x.webp`) for the relevant sections.
   - Parallax behavior (as defined by `parallax-fix.css` and `script.js`) still works sensibly on both mobile and desktop.
   - Root pages that use parallax remain correct.

6. **Counters & percentages**
   - The “Show the numbers, not just promises” stats:
     - Display `68%` and `42%` (and other values as specified) with visible percent signs where appropriate.
     - Do not animate or count up on scroll.
   - The home and about stats still animate correctly.

7. **Responsive Real_Estate images**
   - On mobile, the Estate Agents Real_Estate imagery uses `Real_Estate_*_Mobile.jpeg`.
   - On desktop, those sections use `Real_Estate_*.jpeg`.
   - The layout of the sections remains unchanged.

8. **No unintended regressions**
   - Navigation, cookie behavior, layouts, and hero sections on other pages behave as before, aside from the intended improvements.

---

## Idempotence and Recovery

- Keep changes small and localized so they can be easily reverted (e.g. via `git diff` and `git checkout`).
- Ensure this ExecPlan remains valid even after partial progress:
  - Each section describes self-contained steps that can be resumed.
- If a change introduces regressions:
  - Prefer to revert only the problematic patch.
  - Update (if explicitly asked) the Decision Log with the reasoning and the corrected approach.

---

## Artifacts and Notes

Artifacts expected after completing this ExecPlan:

- Updated HTML:
  - `niches/estate-agents.html`:
    - Spacing adjustments (class changes / attributes).
    - Stats section attributes (`data-counter="off"`, static `%` values).
    - `<picture>` structures for Real_Estate images.
- Updated CSS:
  - One or more scoped rules in `assets/css/custom-styles.css` and/or `assets/css/custom.css` to:
    - Adjust Estate-specific spacing.
    - Standardize Estate card backgrounds.
    - Adjust nav alignment & Services pill styling.
- Updated JS:
  - Possibly in `assets/js/cookie-consent.js` for banner stability.
  - In `assets/js/script.js` to:
    - Refine parallax `PARALLAX_MAP` paths for nested pages.
    - (Optionally) reinforce stats counter logic if needed (while keeping behavior unchanged on existing pages).

---

## Interfaces and Dependencies

- **Cookie behavior**:
  - `assets/js/cookie-consent.js` depends on the presence of `#cookie-banner` and its buttons across HTML files.
  - Browser storage (`localStorage` and `document.cookie`) is shared across pages; ensure choices persist across root and nested paths.

- **Parallax and backgrounds**:
  - `assets/js/script.js` mobile parallax logic depends on `PARALLAX_MAP` and `.parallax-section[data-parallax-theme]`.
  - CSS in `assets/css/mobile.css` and `assets/css/parallax-fix.css` provides the base imagery and parallax layering.
  - Relative paths must account for nested pages like `niches/estate-agents.html`.

- **Stats counters**:
  - JS counters depend on `.stats` containers and `.number[data-target]`.
  - Estate-specific behavior is controlled via `data-counter="off"` to avoid impacting other pages.

- **Nav and services overlay**:
  - `assets/js/script.js` handles nav toggling and services overlay.
  - CSS in `assets/css/styles.css` and `assets/css/custom.css` defines appearance.
  - HTML in all pages shares the same header structure; CSS changes must work across all.

- **Responsive images**:
  - `<picture>` or `srcset` markup in `niches/estate-agents.html` depends on actual files in `assets/images/socialmedia/`.
  - No build pipeline is required for these changes; they must work as plain static assets.

This ExecPlan should provide enough guidance for a new engineer—or Codex—to analyze, implement, and validate all requested Estate Agents fixes without needing prior context.
