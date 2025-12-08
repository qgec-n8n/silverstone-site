# Estate Agents & Shared Layout Bugfix ExecPlan

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This ExecPlan must be maintained in accordance with the root `PLANS.md` file and the guidance in `AGENTS.md`. It is dedicated to analyzing and fixing the Estate Agents page and closely related shared components (cookie banners, navigation, parallax backgrounds, card styling, and counters), as well as aligning `.codex/config.toml` with the desired Codex behavior.

---

## Purpose / Big Picture

Visitors to the Silverstone site should experience:

- A cookie-consent banner that behaves consistently across key pages, appears when it should, and stays dismissed once the visitor has given a choice.
- Clean, consistent spacing between key sections on the Estate Agents page without awkward extra gaps.
- Card components with coherent background opacity and styling, especially in the Estate Agents “Show the numbers, not just promises” and related sections.
- A desktop navigation bar whose **Services** dropdown button aligns vertically with other nav items.
- A mobile menu where the **Services** pill is visually consistent with other pills (font, color, weight, alignment).
- Stable background imagery on mobile for the Estate Agents page, home page, and services page (no jumping when the browser address bar shows/hides).
- A “Show the numbers, not just promises” stats section on the Estate Agents page that presents static percentages (e.g. `68%`, `42%`) without counter animation, while leaving other stats where appropriate.
- Correct use of Estate Agents imagery: desktop images on desktop viewports, mobile-optimized images on small screens.
- A `.codex/config.toml` that aligns with using `gpt-5.1-codex-max`, `model_reasoning_effort = "xhigh"`, and internet access for this project.

---

## Context and Current Behavior

This section captures the current state of the relevant code at the time this ExecPlan was authored.

### Repo orientation

Key files at the repository root:

- Pages:
  - `index.html`
  - `about.html`
  - `services.html`
  - `contact.html`
  - `book.html`
  - `privacy-policy.html`
  - `niches/estate-agents.html`
- Stylesheets:
  - `assets/css/styles.css` – main site styles (including `.neon-card`, header, base sections).
  - `assets/css/custom.css` – overrides and additions (includes `.cookie-banner` styles).
  - `assets/css/custom-styles.css` – additional layout and card styles.
  - `assets/css/mobile.css` – mobile overrides for sections, hero text, cards, etc.
  - `assets/css/parallax-fix.css` – parallax background system and themed background assets.
  - `assets/css/hero-base.css` – shader-based hero styling.
- JavaScript:
  - `assets/js/script.js` – main JS for nav, mobile menu, animation, parallax, and stats counters.
  - `assets/js/cookie-consent.js` – cookie-consent banner logic and persistence.
- Configuration:
  - `.codex/config.toml` – Codex configuration for this project (local to repo).

### Cookie-consent banner

- Each of `index.html`, `about.html`, `services.html`, `contact.html`, and `book.html` includes a cookie banner near the top of `<body>`:

  - Markup characteristics:
    - Wrapper: `<div id="cookie-banner" class="cookie-banner" style="position: fixed; bottom: 0; left: 0; right: 0; display: none;">`
    - Text body: `<p>` describing cookie usage and linking to `privacy-policy.html`.
    - Actions:
      - `<button id="cookie-accept-btn" class="btn btn-primary">Accept</button>`
      - `<button id="cookie-decline-btn" class="btn btn-secondary">Decline</button>`

- The Estate Agents page (`niches/estate-agents.html`) includes a similar banner:

  - The same IDs and classes.
  - Link path adjusted to `../privacy-policy.html`.
  - Inline style on the wrapper is also `position: fixed; bottom: 0; left: 0; right: 0; display: none;`.

- CSS in `assets/css/custom.css` defines the look of `.cookie-banner` and `.cookie-actions`:

  - `.cookie-banner` is fixed at the bottom, dark background, white text, with flex layout.
  - `.cookie-actions` arranges the buttons with a gap and right alignment.
  - Links inside `.cookie-banner` use a colored, underlined style.

- JS in `assets/js/cookie-consent.js`:

  - Listens for `DOMContentLoaded`.
  - Grabs `#cookie-banner`, `#cookie-accept-btn`, `#cookie-decline-btn`. If any are missing, the script returns early.
  - Uses a storage key like `cookieConsentChoice` in `localStorage` plus a `cookieConsent` cookie.
  - If either `localStorage` entry or the cookie is present, it immediately hides the banner (`banner.style.display = 'none'`) and returns.
  - Otherwise:
    - Shows the banner (`banner.style.display = 'flex'`).
    - On Accept/Decline:
      - Writes the choice to `localStorage` and sets a `cookieConsent` cookie with a 1-year expiry.
      - Hides the banner and marks it dismissed via `data-consent-dismissed`.

- Observed implications:
  - Banner behavior is meant to be consistent across all pages that include the markup and load `assets/js/cookie-consent.js`.
  - Any inconsistency is likely due to:
    - Markup differences between pages.
    - CSS positioning and stacking interactions with other elements.
    - Timing issues or duplicate IDs (if multiple banners exist by mistake).

### Estate Agents page structure and cards

- `niches/estate-agents.html` uses `<body class="page-estate-agents">`.

- The page includes:
  - A hero section:

    - `<section class="hero title-band">`.
    - Uses `<canvas id="hero-shader-canvas" data-variant="amber"></canvas>` plus hero content.

  - Multiple parallax-backed sections, e.g.:

    - `<section class="section bg-lines animate parallax-section" data-parallax-theme="book">`
    - `<section class="section bg-circuit animate parallax-section" data-parallax-theme="book">`
    - Additional `.section ... parallax-section compact-section` blocks.

  - A custom `<style>` block in the `<head>` that defines:
    - `.stats` layout (flex, gap, centered).
    - `.stats .stat` card layout (flex basis, padding).
    - `.dark-card`:

      - `background: rgba(11, 12, 16, 0.9);`
      - Subtle border (`rgba(255, 255, 255, 0.08)`).

    - `.section.compact-section` padding (3rem top and bottom).

- Card usage:

  - The “Where deals leak away.” card uses:

    - `<div class="service-content neon-card dark-card">`.

  - The “Answer instantly. Confirm automatically. Keep the chain warm.” card also uses `neon-card dark-card`.

  - The “Plug, personalise, launch” and “Safe, compliant, and fully supported” sections use value cards:

    - `<div class="value-card neon-card dark-card">` for each list item.

  - The “Show the numbers, not just promises” stats section uses:

    - `<section class="section bg-lines animate parallax-section compact-section" data-parallax-theme="book">`.
    - `<div class="stats">` containing several cards:
      - `<div class="neon-card stat">`.
      - Each includes:
        - An icon.
        - A `<div class="number" data-target="68">68</div>` or `data-target="42">42</div>`.
        - A caption label.

- Global card styling:

  - `assets/css/styles.css` defines `.neon-card` with a semi-opaque, blurred background (e.g. `background: rgba(12, 16, 24, 0.55)` plus border and shadow).
  - Estate Agents page overrides (`.dark-card`) increase opacity to `0.9`, making those cards appear darker and more solid.

- Result:
  - Cards with `dark-card` are darker than plain `.neon-card` cards.
  - “Show the numbers, not just promises” cards currently use `.neon-card stat` (no `dark-card`), so they are more translucent than the darker content cards.

### Navigation and Services menu

- Desktop nav (e.g. in `index.html` header):

  - `<header class="site-header">` with `.header-inner` flex layout.
  - `nav > ul > li` items:
    - `Home` and `About` as anchor links.
    - A `li.nav-dropdown` containing:
      - `<button class="services-toggle" type="button" aria-expanded="false">` with:
        - `<span class="services-label">Services</span>`.
        - A `.chevron` span.
      - A `.services-menu` dropdown with `.service-link` items.

- Mobile menu structure:

  - A `.nav-toggle` hamburger button.
  - A full-screen overlay or sliding nav (controlled via JS in `assets/js/script.js`).
  - A `.services-overlay` element outside the header, containing:
    - `.services-overlay__panel`, `.services-overlay__header`.
    - A row with:
      - `button.services-overlay__back`.
      - A `.services-overlay__title` containing `.services-label` and `.chevron`.
    - A `.services-overlay__grid` of `.service-pill.service-link` elements for each service.

- CSS for services nav (in `assets/css/styles.css`):

  - Under a comment like “Premium Services dropdown navigation”:
    - `.nav-dropdown` is `display: flex; align-items: center;`.
    - `.services-toggle` is `inline-flex`, aligned center, with gap, padding, and typographic styling.
    - `.services-menu` is absolutely positioned, centered beneath the button with a blurred, translucent background.
    - `.services-overlay` and related classes define the mobile overlay behavior and grid layout.

- CSS for `.service-pill`:

  - `display: inline-flex; align-items: center; justify-content: center; padding; font-weight: 700; border-radius; gradient background; box-shadow`.
  - Intended to make each pill appear consistent.

- Potential causes of misalignment issues:

  - Differences between `li > a` top/bottom padding vs `li.nav-dropdown > button.services-toggle`.
  - Vertical alignment within `.header-inner` or baseline alignment across inline-flex vs inline-block items.
  - Mobile pill font, padding, or color overrides that apply specifically to `.service-pill` vs other items.

### Background images and parallax

- `assets/css/parallax-fix.css` implements a themed parallax system:

  - Defines generic `.parallax-section` and `.parallax-layer` behavior, plus mobile-specific `.parallax-mobile-stage` and `.parallax-mobile-layer` classes.
  - For each `data-parallax-theme` value, background and mobile fallbacks are configured, for example:

    - `data-parallax-theme="lines"` uses book-related imagery:
      - `background-image: var(--parallax-overlay), url('../images/internet/mobile/book-hero-calendly-mobile-2025@3x.webp');`
      - Mobile image sets with `book-hero-calendly-mobile-2025@1x/2x/3x.webp`.

    - `data-parallax-theme="circuit"`, `"mesh"`, `"waves"` use other section backgrounds (waves/mesh graphics).

    - `data-parallax-theme="book"` uses:

      - `background-image: var(--parallax-overlay), url('../images/internet/hero/book-hero-calendly-mobile-2025.webp');`
      - Mobile image set:
        - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp`
        - `@2x` and `@3x`.

- Usage:

  - `index.html` has a core parallax section with `class="section bg-lines animate parallax-section"` and `data-parallax-theme="lines"`.
  - `services.html` has a parallax section with `data-parallax-theme="circuit"`.
  - The Estate Agents page has multiple parallax sections with `data-parallax-theme="book"` (even when classes include `bg-lines` or `bg-circuit`).

- JS parallax logic in `assets/js/script.js`:

  - A self-invoking function collects `.parallax-section` elements.
  - Constructs a mobile stage (`.parallax-mobile-stage`) and uses `IntersectionObserver` to track which section is in view.
  - For each theme (`lines`, `mesh`, `waves`, `book`), a `themeConfig` entry defines:
    - `backgroundColor`.
    - A `mobileImages` object containing `fallback`, `standard`, and `webkit` image-set values, e.g. for `book`:
      - `fallback: "url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp')"`.

- Observed implications:

  - On mobile, backgrounds are simulated via a sticky layer rather than `background-attachment: fixed`.
  - Address bar show/hide can still cause apparent jumps if the sticky container height or scroll calculations are off, or if the stage is positioned relative to the viewport in a way that interacts poorly with browsers like Safari or Chrome on Android.

### Stats / counter behavior

- `assets/js/script.js` also implements stat counters:

  - It selects all `.stats` containers where `section.dataset.counter !== 'off'`.
  - For each `.number` element within `.stats`:
    - Reads `data-target` as the integer target (default 0).
    - Optionally reads `data-plus` attribute to append a suffix (e.g. “+”).
    - If `prefers-reduced-motion` is true:
      - Sets `number.textContent` directly to `target.toLocaleString()` plus suffix.
    - Otherwise:
      - Animates from 0 to the target over a fixed duration using `requestAnimationFrame`.
      - Uses an `IntersectionObserver` to start animation when the `.stats` section is at least partially visible (`threshold: 0.4`).

- Estate Agents stats section:

  - `niches/estate-agents.html`:

    - `<div class="stats">` (no `data-counter` attribute).
    - Contains `.number` elements with `data-target="68">68</div` and `data-target="42">42</div>`, plus other metrics.
    - Currently displays numbers as plain integers; there are no `%` signs in the markup.

- Home page stats section (Proof in Numbers):

  - `index.html` uses `.stats` with `.number` elements and `data-target` values, with comments explaining that numbers count up via JS.

- Result:

  - By default, counters animate on both home and Estate Agents pages.
  - To disable animation on specific sections, `data-counter="off"` can be used on the `.stats` container; or the ExecPlan can apply a more targeted logic change.

### Images for Estate Agents cards

- Assets:

  - Desktop images:
    - `assets/images/socialmedia/Real_Estate_1.jpeg`
    - `assets/images/socialmedia/Real_Estate_2.jpeg`
    - `assets/images/socialmedia/Real_Estate_3.jpeg`
  - Mobile variants:
    - `assets/images/socialmedia/Real_Estate_1_Mobile.jpeg`
    - `assets/images/socialmedia/Real_Estate_2_Mobile.jpeg`
    - `assets/images/socialmedia/Real_Estate_3_Mobile.jpeg`

- Usage in `niches/estate-agents.html`:

  - `<img src="../assets/images/socialmedia/Real_Estate_1.jpeg" ...>`
  - `<img src="../assets/images/socialmedia/Real_Estate_2.jpeg" ...>`
  - `<img src="../assets/images/socialmedia/Real_Estate_3.jpeg" ...>`

- There is currently no `<picture>` element or `srcset` logic to swap these for mobile-specific assets.

### `.codex/config.toml` current state

- The project’s `.codex/config.toml` currently contains:

  - A comment header documenting its purpose.
  - Two top-level flags:
    - `web_search_request = true`
    - `view_image_tool = true`

- There is no explicit model selection, reasoning effort, profile, or features section here yet.
- The Codex configuration docs and example config indicate that:
  - A `model` key can be set to force a default model (e.g. `"gpt-5.1-codex-max"`).
  - `model_reasoning_effort` can be set to `"xhigh"` for deeper reasoning (supported on `gpt-5.1-codex-max`).
  - Tool flags are usually configured either under `[tools]` or `[features]`, but aliases like `web_search_request` and `view_image_tool` are supported.

---

## Goals

For this ExecPlan, the goals are:

1. **Cookie-Consent Banner Behavior (Estate Agents Page & Cross-Page Consistency)**  
   - Ensure the cookie banner:
     - Appears on first visit to any of the key pages (`index`, `about`, `services`, `contact`, `book`, `niches/estate-agents`) when no consent has been recorded.
     - Disappears as soon as the visitor chooses Accept or Decline.
     - Does not reappear on any of these pages for at least one year after a choice is stored (assuming cookies/localStorage remain intact).
   - Ensure HTML structure, CSS classes, and JS behavior are consistent and robust across these pages, with only necessary path differences (e.g. `privacy-policy.html` vs `../privacy-policy.html`).

2. **Excess Vertical Space Between Specific Sections**  
   - Identify and remove unintended extra vertical space between key sections on the Estate Agents page (e.g. between hero and first content section, between parallax blocks and stats).
   - Adjust spacing using page-scoped or section-scoped CSS rather than global changes, preserving layout on other pages.

3. **Card Background Opacity Consistency**  
   - Make the background opacity of cards in:
     - “Show the numbers, not just promises” stats section.
     - “Where deals leak away.”
     - “Answer instantly. Confirm automatically. Keep the chain warm.”
     - “Plug, personalise, launch.”
     - “Safe, compliant, and fully supported.”
     visually consistent according to the desired art direction:
   - Outcome: cards that are meant to belong to the same design family look coherent (e.g. either all using the darker `.dark-card` treatment, or a clearly defined contrast pattern across sections).

4. **Desktop Menu Banner Alignment**  
   - Correct any vertical misalignment of the **Services** dropdown button in the desktop nav so that:
     - The baseline and visual height matches other nav items.
     - Hover and active states remain consistent.

5. **Mobile Menu: Services Pill Styling**  
   - Align the styling of the **Services** pill in the mobile overlay with other service pills:
     - Font size, weight, and color.
     - Padding, border radius, and alignment within the grid.
   - Ensure tap targets remain generous and accessible.

6. **Estate Agents Page Mobile Background Image**  
   - Confirm that Estate Agents parallax sections use the intended mobile background image:
     - `book-hero-calendly-mobile-2025@1x/2x/3x.webp` for mobile.
     - Appropriate hero/section imagery for desktop.
   - Fix any mismatches or missing configurations, using `data-parallax-theme="book"` appropriately.

7. **Index & Services Mobile Background Image Scroll Behavior**  
   - Stabilize mobile-parallax behavior on:
     - `index.html` (theme `lines`).
     - `services.html` (theme `circuit`).
   - Specifically, ensure background layers do not jump or jitter when the browser address bar shows/hides on mobile.

8. **Disable Counter Effect & Add Percent Signs**  
   - On the Estate Agents stats section:
     - Disable the counter animation.
     - Display static percentages (e.g. `68%`, `42%`) instead of plain integers.
   - Leave counters on other pages (e.g. home Proof in Numbers) unaffected unless explicitly desired.
   - Ensure text layout remains stable (numbers do not shift as they would during animation).

9. **Image Selection Desktop vs Mobile (Estate Agents Page)**  
   - Use desktop images for larger viewports and mobile-specific images for smaller screens:
     - Desktop: `Real_Estate_1/2/3.jpeg`.
     - Mobile: `Real_Estate_1/2/3_Mobile.jpeg`.
   - Implement this via `<picture>` elements or `srcset` with media queries, minimizing markup duplication and bandwidth.

10. **Codex Configuration Alignment**  
    - Update `.codex/config.toml` to:
      - Use `gpt-5.1-codex-max` as the default model.
      - Set `model_reasoning_effort = "xhigh"`.
      - Keep web search and image tools enabled.
    - Ensure the configuration is valid and compatible with Codex docs.

---

## Non-goals

- No global redesign of the site’s visual identity, typography, or layout.
- No changes to copywriting text beyond:
  - Adding percent signs (`%`) where specified.
  - Small spacing tweaks (e.g. non-breaking spaces) if absolutely necessary.
- No introduction of new tracking scripts or analytics.
- No new frameworks or build systems (the site remains static HTML/CSS/JS).
- No changes to unrelated pages (e.g. `privacy-policy.html`) unless required for cookie-banner links.

---

## Impacted Files

Planned files to inspect and possibly modify:

- HTML:
  - `index.html`
  - `about.html`
  - `services.html`
  - `contact.html`
  - `book.html`
  - `niches/estate-agents.html`

- CSS:
  - `assets/css/styles.css`
  - `assets/css/custom.css`
  - `assets/css/custom-styles.css`
  - `assets/css/mobile.css`
  - `assets/css/parallax-fix.css`
  - `assets/css/hero-base.css` (read-only unless hero changes become necessary)

- JavaScript:
  - `assets/js/script.js`
  - `assets/js/cookie-consent.js`

- Images (read-only, referenced from markup/CSS/JS):
  - `assets/images/socialmedia/Real_Estate_1.jpeg`
  - `assets/images/socialmedia/Real_Estate_1_Mobile.jpeg`
  - `assets/images/socialmedia/Real_Estate_2.jpeg`
  - `assets/images/socialmedia/Real_Estate_2_Mobile.jpeg`
  - `assets/images/socialmedia/Real_Estate_3.jpeg`
  - `assets/images/socialmedia/Real_Estate_3_Mobile.jpeg`
  - `assets/images/internet/hero/book-hero-calendly-mobile-2025.webp`
  - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp`
  - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@2x.webp`
  - `assets/images/internet/mobile/book-hero-calendly-mobile-2025@3x.webp`
  - `assets/images/internet/section-waves*.webp` and `assets/images/internet/mobile/section-waves@*.webp`
  - `assets/images/internet/section-mesh*.webp` and `assets/images/internet/mobile/section-mesh@*.webp`

- Config:
  - `.codex/config.toml`

If additional files are discovered that must be touched, they should be added to this list before editing.

---

## Plan of Work & Milestones

### Milestone 0 – Orientation and config inspection

1. Read `AGENTS.md` and `PLANS.md` from the repo root and ensure this ExecPlan complies with both.
2. Open `.codex/config.toml` and record:
   - Current flags (web search / image tools).
   - Any other settings, if added since this ExecPlan was written.
3. Confirm available models and reasoning settings from the environment (where visible) and note any mismatch with:
   - Desired model: `gpt-5.1-codex-max`.
   - Desired reasoning effort: `xhigh`.

**Acceptance for Milestone 0:**

- This ExecPlan’s `Context and Current Behavior` section accurately reflects the state of `.codex/config.toml` and core layout/behavior files.
- Any discrepancies discovered later are added to `Surprises & Discoveries` and the `Decision Log`.

---

### Milestone 1 – Cookie-consent banner analysis and fixes

1. Inspect cookie banner markup and scripts:

   - Compare `#cookie-banner` blocks in:
     - `index.html`
     - `about.html`
     - `services.html`
     - `contact.html`
     - `book.html`
     - `niches/estate-agents.html`
   - Verify:
     - Consistent IDs: `cookie-banner`, `cookie-accept-btn`, `cookie-decline-btn`.
     - Correct privacy policy link paths (`privacy-policy.html` vs `../privacy-policy.html`).
     - Consistent inline style usage (`display: none;`, positioning).
   - Review `assets/js/cookie-consent.js` for:
     - Storage strategy (localStorage + cookie).
     - Conditions for showing/hiding the banner.
     - Any page-specific assumptions (there should be none).

2. Identify current behavior issues:

   - Check for:
     - Banner not appearing on the Estate Agents page while appearing on others (or vice versa).
     - Banner flickering or re-appearing incorrectly after choice.
     - Layout conflicts where the banner overlaps nav or other UI.

3. Implement fixes:

   - Normalize markup where necessary, ensuring one banner per page with consistent structure.
   - If behavior bugs are found:
     - Tighten the logic in `cookie-consent.js`, keeping it page-agnostic.
     - Consider adding a `data-cookie-banner="primary"` attribute as a safeguard, if needed, and update JS accordingly.
   - Avoid changing the meaning of Accept vs Decline; only adjust visibility and persistence.

4. Visual verification:

   - Run a static server from the repo root and load each page.
   - In a fresh browser context (no prior cookie/localStorage):
     - Ensure banner appears on each of the six pages.
   - After Accept:
     - Confirm the banner disappears immediately and stays hidden during navigation across those pages.
   - After clearing storage and Decline:
     - Confirm the same behavior (hidden across pages after the choice).

---

### Milestone 2 – Section spacing cleanup on Estate Agents page

1. Map key sections in `niches/estate-agents.html`:

   - Identify the order of:
     - Hero (`.hero.title-band`).
     - Intro / “The cost of a slow response in property is brutal.”
     - “Where deals leak away.”
     - “The "Never Miss a Viewing" pack.”
     - “Show the numbers, not just promises.”
     - “The branch experience after launch.”
     - “Plug, personalise, launch.”
     - “Safe, compliant, and fully supported.”
     - Final CTA blocks.

2. Inspect spacing sources:

   - Global section spacing in `assets/css/styles.css` (e.g. `.section { padding: 4rem 0; }`).
   - Estate Agents inline overrides: `.section.compact-section` with 3rem top/bottom.
   - Mobile overrides in `assets/css/mobile.css` for `.section`.

3. Identify problem gaps:

   - Look for pairs of adjacent blocks where:
     - Combined padding/margins create visually excessive gaps on desktop and/or mobile.
   - Use browser dev tools in local preview to measure spacing.

4. Implement scoped adjustments:

   - Prefer adding Estate Agents-specific rules, e.g.:

     - `body.page-estate-agents .section.compact-section { ... }`
     - Target specific section IDs or headings if needed.

   - Reduce or rebalance padding where gaps are too large.
   - Avoid changing `.section` globally (to protect other pages).

5. Re-verify after changes:

   - Refresh `niches/estate-agents.html` on desktop and mobile widths.
   - Confirm:
     - Sections flow naturally.
     - No content is cramped or overlapping.

---

### Milestone 3 – Card background opacity consistency

1. Catalog card types:

   - On the Estate Agents page, list:
     - All `.neon-card` instances.
     - All `.neon-card.dark-card`.
     - All `.value-card.neon-card` and `.value-card.neon-card.dark-card`.
   - Note which belong to:
     - “Show the numbers, not just promises” stats.
     - “Where deals leak away.”
     - “Answer instantly. Confirm automatically. Keep the chain warm.”
     - “Plug, personalise, launch.”
     - “Safe, compliant, and fully supported.”

2. Determine desired design convention:

   - Use existing usage as a guide:
     - `.dark-card` denotes a more solid, high-contrast card.
     - Plain `.neon-card` is a more translucent, light card.
   - Decide whether stats cards should:
     - Match the darker content cards, or
     - Intentionally remain lighter while others stay dark.
   - Record the decision in the `Decision Log`.

3. Implement adjustments:

   - If stats cards should be darker:
     - Add `dark-card` class to the relevant `.neon-card stat` elements.
     - Or apply a targeted CSS rule:
       - `body.page-estate-agents .stats .neon-card.stat { ... }`
   - If content/value cards need lighter treatment:
     - Adjust `.dark-card` or introduce a more specific class for certain sections.
   - Ensure no global `.neon-card` change inadvertently affects cards on the home or services pages.

4. Visual check:

   - On `niches/estate-agents.html`, confirm:
     - Card backgrounds look consistent with the chosen convention.
     - Text contrast remains good for accessibility.

---

### Milestone 4 – Desktop nav alignment and mobile Services pill styling

1. Desktop nav alignment:

   - Compare nav items in `index.html` (and cross-check other pages sharing the header):
     - `li > a` items for Home / About, etc.
     - `li.nav-dropdown > button.services-toggle`.
   - Inspect CSS in `assets/css/styles.css` and `assets/css/custom.css` for:
     - `header-inner`, `nav`, `nav ul`, `nav li`, `nav a`.
     - `.nav-dropdown` and `.services-toggle`.

   - Identify differences that might cause the Services button to sit lower:
     - Unequal vertical padding.
     - Line-height differences.
     - `display` types (inline vs inline-flex).
     - Margin or transform on `.services-toggle` or its container.

   - Implement minimal fixes, such as:
     - Aligning `line-height` for `.services-toggle` with links.
     - Matching vertical padding.
     - Adjusting `align-items` in `.header-inner` or `.nav-dropdown`.

2. Mobile Services pill styling:

   - Inspect `.services-overlay__grid` and `.service-pill` in `index.html`.
   - Review CSS definitions for `.service-pill` in `assets/css/styles.css` and any overrides in `assets/css/mobile.css`.

   - Confirm whether the Services pill is:
     - Using a different class or extra modifiers.
     - Receiving special styling from context selectors.

   - Make modifications so the Services pill matches others:
     - Consistent font-family, size, weight, and color.
     - Same padding, border radius, and gradient.
     - No misalignment inside the grid.

3. Test nav behavior:

   - Desktop:
     - On `index.html`, `services.html`, and `niches/estate-agents.html`, confirm:
       - The Services button sits flush with other nav items.
       - Dropdown opens/closes correctly.
   - Mobile:
     - Trigger mobile nav and open Services overlay.
     - Confirm all pills, including the “Services” pill, share consistent visual styling and alignment.

---

### Milestone 5 – Parallax and background imagery

1. Estate Agents mobile background:

   - Confirm in `assets/css/parallax-fix.css` that `data-parallax-theme="book"` defines:
     - `background-image` including `book-hero-calendly-mobile-2025.webp` for desktop.
     - Mobile fallbacks using `book-hero-calendly-mobile-2025@1x/2x/3x.webp`.
   - Verify `niches/estate-agents.html` uses `data-parallax-theme="book"` for the intended sections.

   - If any section is mis-themed (e.g. using `"lines"` or another theme when it should be `"book"`):
     - Adjust `data-parallax-theme` attributes accordingly.

2. Index and services mobile parallax scroll behavior:

   - Review the parallax JS segment in `assets/js/script.js`:
     - Theme configuration object mapping theme names to `mobileImages` and `backgroundColor`.
     - IntersectionObserver logic and sticky layer sizing/positioning.
   - Confirm theme mappings:
     - `index.html` section uses `data-parallax-theme="lines"` and has a corresponding entry.
     - `services.html` section uses `data-parallax-theme="circuit"` and has a corresponding entry.

   - Investigate potential causes of scroll jitter:
     - Stage height vs section height calculations.
     - `position: sticky` container offset.
     - Use of `vh` units that might react to address bar changes.

   - Implement conservative fixes:
     - Prefer CSS-only adjustments (e.g. ensuring the mobile stage fills the viewport without relying on dynamic `vh`).
     - Only adjust JS if necessary, keeping logic simple and well-commented.

3. Verification on mobile:

   - On a mobile-sized viewport (or device simulator), scroll through:
     - `index.html` parallax section.
     - `services.html` parallax section.
     - `niches/estate-agents.html` parallax sections.
   - Confirm:
     - Backgrounds appear stable.
     - No visible jumps occur when the browser chrome shows/hides.

---

### Milestone 6 – Disable Estate Agents stats counter and add percent signs

1. Target the Estate Agents stats section:

   - In `niches/estate-agents.html`, locate the “Show the numbers, not just promises” section:

     - `<section class="section bg-lines animate parallax-section compact-section" data-parallax-theme="book">`.
     - `<div class="stats">` inside it with `.number data-target="68"` and `.number data-target="42"`.

2. Disable animation:

   - Either:
     - Add `data-counter="off"` to this specific `.stats` container; or
     - Update the JS to skip counting on this page (e.g. by checking `body.page-estate-agents`).

   - Prefer the `data-counter="off"` attribute for clarity and reuse.

3. Add percent signs:

   - Update the markup so that the rendered numbers show `68%` and `42%` (and any other metrics that should be percentages).
   - Options:
     - Change the text content in HTML to include `%` and avoid using the counter script.
     - Or, if the script is still used for other metrics on this page, ensure the disabled container does not use the counter at all.

   - Avoid relying on JS to append `%` here; static text is simpler and more robust.

4. Ensure other counters remain intact:

   - Confirm that the home page (`index.html`) `Proof in Numbers` section still uses animated counters as before.
   - Confirm that no other `.stats` sections unintentionally receive `data-counter="off"`.

5. Visual verification:

   - Reload `niches/estate-agents.html`:
     - Confirm stats show `68%`, `42%`, etc. immediately.
     - Verify no counting animation runs.
   - Reload `index.html`:
     - Confirm counters still animate when scrolled into view.

---

### Milestone 7 – Desktop vs mobile image selection on Estate Agents page

1. Identify all Estate Agents card images:

   - In `niches/estate-agents.html`, list `<img>` tags using:
     - `../assets/images/socialmedia/Real_Estate_1.jpeg`
     - `../assets/images/socialmedia/Real_Estate_2.jpeg`
     - `../assets/images/socialmedia/Real_Estate_3.jpeg`

2. Introduce responsive image markup:

   - Replace each plain `<img>` with a `<picture>` structure, for example (paths adjusted accordingly):

     - `picture`
       - `source` with `media="(max-width: 767px)"` and `srcset="../assets/images/socialmedia/Real_Estate_1_Mobile.jpeg"`
       - `img` fallback using `src="../assets/images/socialmedia/Real_Estate_1.jpeg"` and existing `alt` + `class="service-img"`.

   - Keep `loading="lazy"` attributes as before.

3. Verify behavior:

   - On a desktop-width viewport:
     - Confirm that the desktop images (`Real_Estate_*.jpeg`) are used.
   - On a mobile-width viewport (e.g. < 768px):
     - Confirm that the mobile images (`Real_Estate_*_Mobile.jpeg`) are used, via dev tools network panel or by visible composition differences.

---

### Milestone 8 – Codex configuration alignment

1. Re-open `.codex/config.toml` and back it up (e.g. by copying its contents into this ExecPlan’s `Surprises & Discoveries` or a separate note).

2. Update configuration to align with Codex docs:

   - Set the default model and reasoning effort at the top level:

     - `model = "gpt-5.1-codex-max"`
     - `model_reasoning_effort = "xhigh"`

   - Ensure web search and view-image tools are explicitly enabled using the recommended schema from the example config, e.g.:

     - Add or update a `[features]` table:

       - `[features]`
         - `view_image_tool = true`
         - `web_search_request = true`

   - Remove or refactor any obsolete top-level flags if they conflict, preserving equivalent behavior.

3. Validate configuration:

   - Ensure the TOML syntax is valid (no duplicate conflicting keys).
   - Where possible, trigger a Codex run that reports:
     - The active model (`gpt-5.1-codex-max`).
     - The reasoning effort (`xhigh`) for this project.
     - Availability of web search and view-image tools.

4. Document decisions in `Decision Log`.

---

## Testing & Verification

For each milestone, perform the following checks:

1. **General preview setup**

   - From the repo root, run a simple static server (commands may vary by environment):

     - Example using Python:
       - `python -m http.server 8000`
     - Example using `serve` (Node):
       - `npx serve .`

   - Open:
     - `http://localhost:8000/index.html`
     - `http://localhost:8000/services.html`
     - `http://localhost:8000/niches/estate-agents.html`
     - `http://localhost:8000/about.html`
     - `http://localhost:8000/contact.html`
     - `http://localhost:8000/book.html`

2. **Cookie banner tests**

   - Clear localStorage and cookies for the test domain.
   - Load each page in turn, confirming:
     - Banner appears once.
     - Accept/Decline hides it and prevents reappearance across page navigations.

3. **Layout / spacing tests (Estate Agents)**

   - Scroll the Estate Agents page on desktop:
     - Confirm there are no large, awkward gaps between sections.
   - Repeat on mobile-width.

4. **Card background tests**

   - Visually compare all Estate Agents cards across the named sections.
   - Confirm background opacity and style follows the chosen convention.

5. **Nav and Services overlay tests**

   - Desktop:
     - Confirm the Services nav button aligns with other items.
   - Mobile:
     - Open the nav, then the Services overlay.
     - Confirm all service pills, including Services, share consistent styling.

6. **Parallax and background behavior**

   - On mobile-width screens:
     - Scroll through parallax sections on:
       - `index.html`
       - `services.html`
       - `niches/estate-agents.html`
     - Confirm backgrounds appear stable and visually pleasing.

7. **Stats / counters**

   - On Estate Agents page:
     - Confirm stats display `68%`, `42%`, etc. without animation.
   - On home page:
     - Confirm counters animate appropriately when scrolled into view.

8. **Responsive Estate Agents imagery**

   - In dev tools, simulate desktop and mobile widths:
     - Confirm desktop vs mobile Real_Estate images are used as intended.

9. **Codex configuration**

   - Validate `.codex/config.toml` against Codex docs.
   - Confirm Codex runs for this repo use:
     - `gpt-5.1-codex-max`.
     - `model_reasoning_effort = "xhigh"`.
     - Internet/web-search and image tools enabled.

---

## Risks & Mitigations

- **Risk: Global CSS changes affecting other pages**
  - Mitigation: Scope new rules with `body.page-estate-agents` or more specific selectors.

- **Risk: Cookie banner duplication or missing banner**
  - Mitigation: Ensure exactly one banner per page; use unique IDs and consistent markup.

- **Risk: Parallax behavior regressions**
  - Mitigation: Make minimal, well-commented changes; test on multiple pages and viewports.

- **Risk: Config misconfiguration in `.codex/config.toml`**
  - Mitigation: Follow the official example config format; run a syntax check if possible; keep changes simple and documented.

- **Risk: Counter script accidentally disabled everywhere**
  - Mitigation: Use `data-counter="off"` only on the intended `.stats` container; avoid broad JS changes that alter all stats.

---

## Progress

Use a timestamped checklist as work proceeds. Example entries:

- [ ] (YYYY-MM-DD HH:MMZ) Completed Milestone 0 – Orientation and config inspection.
- [ ] (YYYY-MM-DD HH:MMZ) Completed Milestone 1 – Cookie-consent banner fixes.
- [ ] (YYYY-MM-DD HH:MMZ) Completed Milestone 2 – Estate Agents spacing adjustments.
- [ ] (YYYY-MM-DD HH:MMZ) Completed Milestone 3 – Card background opacity consistency.
- [ ] (YYYY-MM-DD HH:MMZ) Completed Milestone 4 – Nav alignment and Services pill styling.
- [ ] (YYYY-MM-DD HH:MMZ) Completed Milestone 5 – Parallax and background imagery.
- [ ] (YYYY-MM-DD HH:MMZ) Completed Milestone 6 – Stats counter disabled + percent signs.
- [ ] (YYYY-MM-DD HH:MMZ) Completed Milestone 7 – Desktop vs mobile Real_Estate imagery.
- [ ] (YYYY-MM-DD HH:MMZ) Completed Milestone 8 – `.codex/config.toml` alignment.

Update this section as you make progress.

---

## Surprises & Discoveries

Record unexpected findings here, such as:

- Differences between HTML structures on similar pages.
- Browser-specific behavior (e.g. Safari vs Chrome on mobile for parallax).
- Out-of-date or duplicate CSS or JS blocks.
- Any deviations from the initial context described above.

Each entry should include:

- Date/time.
- Brief description.
- A reference to the files/sections involved.

---

## Decision Log

Record key design and implementation decisions, including:

- Choice of whether stats cards should be dark or light.
- Exact scoping strategy for CSS changes.
- Specific approach for disabling counters and adding `%`.
- Final structure of `.codex/config.toml`.

Each entry should include:

- Date/time.
- Decision summary.
- Rationale.

---

## Outcomes & Retrospective

At the end of the ExecPlan’s lifecycle, summarize:

- Which goals were fully achieved and in which files.
- Any partial or deferred work and why.
- Lessons learned about the codebase (e.g. patterns for future ExecPlans).
- Suggestions for additional documentation (e.g. more granular AGENTS files or design notes).
