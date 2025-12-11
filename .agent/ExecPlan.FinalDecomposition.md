<!-- FILE: .agent/ExecPlan.FinalDecomposition.md -->

# Silverstone CSS/JS final decomposition (phase 2)

This ExecPlan finishes the front‑end refactor started in `ExecPlan.SilverstoneFrontend.md`. It assumes the current repo state matches the “Outcomes & Retrospective” of that plan:

- CSS and JS have been moved under `src/`.
- Bundles are built via `build-css.js` → `assets/css/styles.css` and `scripts/build-js.js` → `assets/js/app.js`.
- HTML pages now reference only the new `styles.css` and `app.js` entrypoints.
- However:
  - `src/css/base/layout.css` and `src/css/components/buttons.css` still contain a large amount of component and page‑specific styling that should be decomposed into their own modules.
  - Several CSS component modules (`header.css`, `footer.css`, `stats.css`, `faq.css`, `cookie-banner.css`) are mostly or completely empty.
  - Some JS modules (`header-nav.js`, `scroll-reveal.js`, `stats.js`, `parallax.js`) are stubs that defer to a large, monolithic `src/js/app.js`.

This phase completes the decomposition defined by the original refactor plan in `Output_2.md` and the HTML/CSS/JS mapping in `Output_1.md`. 

---

## 1. Scope and non‑goals

### 1.1 In scope for this ExecPlan

- **CSS**
  - Move all component, feature, and page‑specific rules **out of** `src/css/base/layout.css` (and any other “catch‑all” files such as `src/css/components/buttons.css`) into:
    - `src/css/base/variables.css` (root variables only).
    - `src/css/components/*.css` (header, footer, hero, cards, buttons, stats, FAQ, cookie banner).
    - `src/css/features/*.css` (parallax, gallery, marquee, lightbox).
    - `src/css/pages/*.css` (home, services, about, book, contact, estate‑agents).
  - Ensure `layout.css` is left with **only true layout primitives and background utilities**, not component or page concerns.
  - Eliminate duplicated selector definitions between modules.

- **JS**
  - Refactor the remaining behaviour inside `src/js/app.js` into proper modules:
    - `src/js/header-nav.js` – header, mobile nav, services overlay, header indicator.
    - `src/js/scroll-reveal.js` – `.animate` / `.visible` reveal logic.
    - `src/js/stats.js` – stats counter animation.
    - `src/js/parallax.js` – parallax/background motion.
  - Leave existing feature modules (hero shader, gallery, marquee, cookie consent, contact form) intact unless a genuinely small change is needed to integrate with initialisers.
  - Turn `src/js/app.js` into a **thin orchestrator** that wires up module initialisers on DOM ready.

- **Validation**
  - Keep the existing asset pipeline (`npm run build:css`, `npm run build:js`, `npm run build`) working.
  - Preserve all current runtime behaviour and visual output.

### 1.2 Explicit non‑goals

- Do **not**:
  - Redesign the visual identity, spacing, or animation feel.
  - Introduce new features or UX flows.
  - Change HTML semantics or structure beyond what is strictly necessary to keep selectors aligned with the existing mapping in `Output_1.md`. :contentReference[oaicite:1]{index=1}
  - Re‑run the entire “phase 1” refactor from scratch; treat the current repo state as the baseline.
  - Re‑introduce any selectors or files that were removed as unused in the previous pass.

---

## 2. Baseline checks (Step 0)

These steps verify the starting point for this ExecPlan. They should be quick and non‑destructive.

1. **Confirm repo cleanliness**

   - Run `git status`.
   - If there are uncommitted changes, either commit or revert them before continuing.

2. **Install dependencies (if needed)**

   - If `node_modules/` is missing and `npm` is available:
     - Run `npm install`.

3. **Sanity‑check build scripts**

   - If `package.json` exists and `npm` is available:
     - Run `npm run build:css --if-present`.
     - Run `npm run build:js --if-present`.
   - Acceptable failures:
     - Scripts are not defined (this is unlikely for this repo).
   - Unacceptable failures:
     - `build:css` or `build:js` fails due to syntax errors or missing files.
       - Investigate and fix before proceeding; this ExecPlan assumes a working baseline.

4. **Verify current structure**

   Confirm the following files/directories exist:

   - CSS:
     - `src/css/base/variables.css`
     - `src/css/base/typography.css`
     - `src/css/base/layout.css`
     - `src/css/components/{buttons,cards,cookie-banner,faq,footer,header,hero,stats}.css`
     - `src/css/features/{gallery,lightbox,marquee,parallax}.css`
     - `src/css/pages/{home,services,about,book,contact,estate-agents}.css`
   - JS:
     - `src/js/{app,header-nav,scroll-reveal,stats,parallax,hero-shader,magnetic-buttons,marquee,gallery,cookie-consent,contact-form}.js`
   - Bundles:
     - `assets/css/styles.css`
     - `assets/js/app.js`
   - Build scripts:
     - `build-css.js`
     - `scripts/build-js.js`

**Exit criteria for Step 0**

- `npm run build:css` and `npm run build:js` succeed (or are not present, which would be unexpected but acceptable only if the bundles are clearly built via another mechanism).
- Directory and file layout matches expectations above.

---

## 3. CSS final decomposition

The goal is to move from “one big layout CSS plus partial modules” to **clean module ownership** that matches the final architecture described in `Output_2.md`. :contentReference[oaicite:2]{index=2}

### 3.1 Ownership map – which selectors belong where

Use this as the canonical mapping when moving rules out of `layout.css` and any other catch‑all files.

> **Key rule:** after this pass, `layout.css` should contain only:
> - `html`, `body`, and global reset/box‑sizing.
> - Container/layout helpers such as `.page`, `.section`, `.container`, `.grid`, `.flex-*`.
> - Background and spacing utilities (e.g. `.bg-lines`, `.bg-mesh`, `.bg-waves`, `.bg-circuit`, `.section--compact`), but **no component‑level styling**.

#### Base

- `src/css/base/variables.css`
  - Owns: `:root { --color-*, --space-*, --font-*, --radius-*, --shadow-* }` and any other global CSS custom properties.
  - Action:
    - Move all variable definitions from `layout.css` into `variables.css`.
    - Merge with any existing variables there.
- `src/css/base/typography.css`
  - Owns: all heading, paragraph, list, link, and icon‑font rules that are **not component‑specific**.
  - Action:
    - If typography rules still live in `layout.css`, move them here.

- `src/css/base/layout.css`
  - Owns:
    - `.page`, `.section`, `.section.bg-*`, `.section--compact`, `.section--flush`.
    - `.container`, `.container-wide`, `.stack`, `.grid`, `.grid-2`, `.grid-3`, `.grid-auto`.
    - Global spacing helpers, alignment utilities, and generic background overlays.
  - Must **not** contain:
    - `.site-header*`, `.site-footer*`, `.hero*`, `.neon-card*`, `.faq-*`, `.stats`, `.cookie-*`, `.premium-*`, `.marquee-*`, or any page‑specific selectors (e.g. `.estate-*`, `.contact-*`, `.book-*`).

#### Components

- `src/css/components/header.css`
  - Owns: header and navigation UI
    - `.site-header`, `.header-inner`, `.logo`, `.nav-toggle`, `.nav-links`, `.nav-link`, `.services-menu`, `.services-overlay`, `.services-overlay__*`, `.service-pill`, `#header-indicator`, `.indicator-copy`, etc.
- `src/css/components/footer.css`
  - Owns: footer UI
    - `.site-footer`, `.footer-container`, `.footer-brand`, `.footer-links`, `.footer-column`, `.social-icons`, `.footer-bottom`, etc.
- `src/css/components/hero.css`
  - Owns:
    - `.hero`, `.hero.title-band`, `.hero-media`, `.hero-inner`, `.hero-copy`, `.hero-kicker`, `.hero-actions`, `.hero-subtext`, `#hero-shader-canvas`, and associated hero layout.
- `src/css/components/cards.css`
  - Owns:
    - `.neon-card`, `.feature-card`, `.value-card`, `.pricing-card`, `.proof-card`, `.cta-card`, `.gallery-card`, `.dark-card`, `.contact-form-card`, `.contact-details`, `.service-image`, `.service-content`, and other shared card styles.
- `src/css/components/buttons.css`
  - Owns:
    - `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-pill`, `.btn-icon`, `.contact-submit`, and other button‑like elements (including shared hover/focus states).
- `src/css/components/stats.css`
  - Owns:
    - `.stats`, `.stat`, `.stat-icon`, `.stat-label`, `.stat-number`, and supporting layout for stats sections.
- `src/css/components/faq.css`
  - Owns:
    - `.faq-section`, `.faq-list`, `.faq-item`, `.faq-item summary`, `.faq-body`, and FAQ‑specific spacing.
- `src/css/components/cookie-banner.css`
  - Owns:
    - `#cookie-banner`, `.cookie-banner`, `.cookie-buttons`, `.cookie-link`, `.cookie-banner-dismiss`.

#### Features

- `src/css/features/parallax.css`
  - Owns:
    - `.parallax-section`, `.parallax-mobile-stage`, `.parallax-mobile-layer`, `.parallax-ready`, and any motion‑specific transforms/animations.
- `src/css/features/gallery.css`
  - Owns:
    - `#neural-grid`, `.premium-tile`, `.tile-inner`, `.tile-front`, `.tile-back`, `.tile-caption`, `.tile-badge`, etc.
- `src/css/features/marquee.css`
  - Owns:
    - `.single-marquee`, `.double-marquee`, `.marquee-track`, `.marquee-row`, `.marquee-img`, `.marquee-tagline`, `.marquee-meta`, and marquee keyframes.
- `src/css/features/lightbox.css`
  - Owns:
    - `.premium-lightbox`, `.lightbox-backdrop`, `.lightbox-content`, `.lightbox-img`, `.lightbox-caption`, `.lightbox-close`.

#### Pages

- `src/css/pages/home.css`
  - Owns:
    - Home‑specific tweaks – e.g. `.packages-grid`, `.proof-grid`, `.home-hero-*`, `.home-only-*`.
- `src/css/pages/services.css`
  - Owns:
    - `.service-row`, `.service-grid`, services‑only marquee placement, innovation gallery spacing.
- `src/css/pages/about.css`
  - Owns:
    - About‑page layouts such as values grid and “what drives us” collage.
- `src/css/pages/book.css`
  - Owns:
    - Discovery call layout, `.booking-*` sections, Calendly embed spacing.
- `src/css/pages/contact.css`
  - Owns:
    - Contact grid, `.contact-grid`, `.contact-column`, `.contact-map` if still used, and per‑page tweaks.
- `src/css/pages/estate-agents.css`
  - Owns:
    - Estate‑agents sections such as `.compact-section`, `.estate-*` stats/FAQ variants.

### 3.2 Mechanical procedure for CSS decomposition

Repeat this procedure until `layout.css` and the other catch‑all files contain only what they should.

1. **Snapshot current usage**

   - For each component concern (e.g. header, cards, FAQ, stats, cookie banner, footer):
     - Run `rg` or `grep` across `src/css` to see where selectors currently live.
     - Expect many of them to appear inside `base/layout.css` and `components/buttons.css`.

2. **Move variables out of `layout.css`**

   - In `layout.css`, locate all `:root { ... }` blocks and any variable definitions.
   - Cut them from `layout.css` and append them to `base/variables.css`, preserving comments where they aid understanding.
   - Run `npm run build:css` and fix any syntax issues.

3. **For each component area:**

   For example, header → `components/header.css`:

   1. Identify all selectors in `layout.css` (or other files) whose names clearly belong to that component, using the ownership map in 3.1.
   2. Cut those blocks and paste them into the corresponding component file.
   3. If the component file is currently empty (e.g. `header.css`, `footer.css`, `stats.css`, `faq.css`, `cookie-banner.css`), create a short comment header explaining its purpose and then insert the rules.
   4. Preserve media queries:
      - If a rule has mobile/desktop variants in `layout.css`, carry those media query blocks over with the selectors.
   5. Run `npm run build:css` to ensure the bundle still builds; fix any syntax errors immediately.

   Repeat this for:

   - Header → `components/header.css`
   - Footer → `components/footer.css`
   - Stats → `components/stats.css`
   - FAQ → `components/faq.css`
   - Cookie banner → `components/cookie-banner.css`
   - Cards → `components/cards.css` (especially `.neon-card*` rules still in `layout.css`)
   - Any remaining button styles that belong in `components/buttons.css` (while moving non‑button code *out* of `buttons.css` if it was used as a dumping ground).

4. **Clean up `components/buttons.css`**

   - If `buttons.css` currently contains unrelated concerns (such as hero or cookie‑banner styles), move those rules to their proper component/page files.
   - After this, `buttons.css` should contain **only** `.btn*` and directly related rules.

5. **Move page‑specific tweaks**

   - For any selectors that clearly belong only on a single page (e.g. `.booking-*` on book page, `.estate-*` on estate‑agents), move them into the matching `pages/*.css` file.
   - Use `Output_1.md` and `Output_2.md` as cross‑references when in doubt. 

6. **Deduplicate and unify**

   - Once rules are in their canonical file, search for duplicate selector definitions across `src/css`.
   - Where duplicates exist:
     - Choose a single canonical declaration and remove redundant copies.
     - If different copies are providing different behaviours (e.g. one for mobile, one for desktop), fold them into a single selector with appropriate media queries.

### 3.3 CSS exit criteria

Treat this checklist as non‑negotiable before moving on to JS:

- `src/css/base/variables.css` contains all `:root` variables; `layout.css` contains **no** `:root` blocks.
- `src/css/base/layout.css`:
  - Contains only layout primitives and background utilities.
  - Contains **no** selectors that start with `.site-header`, `.site-footer`, `.hero`, `.neon-card`, `.faq-`, `.stats`, `.cookie-`, `.premium-`, `.marquee-`, or obviously page‑specific prefixes.
- `src/css/components/header.css`, `footer.css`, `stats.css`, `faq.css`, `cookie-banner.css`:
  - Are non‑empty and contain the selectors listed for them in 3.1.
- Duplicate definitions of key selectors (`.site-header`, `.site-footer`, `.neon-card`, `.btn`, `.stats`, `.faq-item`, `.cookie-banner`, `.premium-lightbox`, `.marquee-track`) exist in **only one** file each.
- `npm run build:css` succeeds.
- Visual behaviour (to the extent it can be inferred from CSS alone) remains consistent with the mapping in `Output_1.md`. :contentReference[oaicite:4]{index=4}

---

## 4. JS final decomposition

This phase turns `src/js/app.js` into a thin orchestrator and fills out the stub modules.

### 4.1 Module ownership

Use `Output_2.md` and the current `app.js` comments to identify which block of behaviour belongs to which module. :contentReference[oaicite:5]{index=5}

- `src/js/header-nav.js`
  - Owns:
    - Mobile nav open/close.
    - Services dropdown and overlay.
    - Header show/hide on scroll.
    - Header indicator bar logic.
- `src/js/scroll-reveal.js`
  - Owns:
    - IntersectionObserver for `.animate` → `.visible`.
    - Any fallbacks for reduced motion.
- `src/js/stats.js`
  - Owns:
    - Stats counter intersection logic and number animation.
- `src/js/parallax.js`
  - Owns:
    - Parallax/background motion for `.parallax-section` sections.

Other modules (`hero-shader.js`, `magnetic-buttons.js`, `marquee.js`, `gallery.js`, `cookie-consent.js`, `contact-form.js`) are already non‑trivial and should generally be left as they are, except for small adjustments needed to fit the initialiser pattern below.

### 4.2 Initialiser pattern

To keep things simple and compatible with the current concatenation build (`scripts/build-js.js`), use a global `window.Silverstone` namespace and module‑local initialiser functions:

- In each module file (`header-nav.js`, `scroll-reveal.js`, etc.):

  1. Start with:

     ```js
     (function () {
       'use strict';

       window.Silverstone = window.Silverstone || {};
     ```

  2. Define an `init*` function, e.g.:

     ```js
       function initHeaderNav() {
         // existing header/nav logic from app.js
       }
     ```

  3. Export the initialiser by attaching it to `window.Silverstone`:

     ```js
       window.Silverstone.initHeaderNav = initHeaderNav;
     })();
     ```

- In `src/js/app.js`:

  - Replace the large bodies of behaviour with a single DOMContentLoaded handler that calls the initialisers, for example:

    ```js
    document.addEventListener('DOMContentLoaded', function () {
      const api = window.Silverstone || {};

      if (api.initHeaderNav) api.initHeaderNav();
      if (api.initScrollReveal) api.initScrollReveal();
      if (api.initStats) api.initStats();
      if (api.initParallax) api.initParallax();
      // Existing modules:
      if (api.initMagneticButtons) api.initMagneticButtons();
      if (api.initMarquee) api.initMarquee();
      if (api.initGallery) api.initGallery();
      if (api.initCookieConsent) api.initCookieConsent();
      if (api.initContactForm) api.initContactForm();
      if (api.initHeroShader) api.initHeroShader();
    });
    ```

  - Adapt the exact set of calls to match the modules that actually export initialisers (some modules may already self‑initialise and not need this pattern).

### 4.3 Mechanical procedure for JS decomposition

For each of the four stub modules:

1. **Locate the relevant block in `app.js`**

   - Use the descriptive comments and the selector usage to find the block of code implementing that concern (e.g. “Enhanced Navigation and Header Control for Silverstone” for header/nav).
   - Confirm that moving it will not break unrelated features.

2. **Copy behaviour into the module file**

   - Open the module file (e.g. `src/js/header-nav.js`) which currently just contains a stub comment.
   - Wrap the behaviour inside the IIFE/initialiser pattern described in 4.2.
   - Replace any direct `DOMContentLoaded` handlers inside this block with logic executed by the exported `init*` function instead.

3. **Wire the initialiser from `app.js`**

   - In `src/js/app.js`:
     - Remove the original block of code you just moved.
     - Ensure the central DOMContentLoaded handler calls the new initialiser in the right order.

4. **Build and check**

   - Run `npm run build:js`.
   - Fix any syntax errors immediately.
   - Repeat for the remaining modules: `scroll-reveal.js`, `stats.js`, `parallax.js`.

5. **Avoid duplicating logic**

   - Ensure the logic for each concern lives in **exactly one place**:
     - If a module already self‑initialises via its own DOMContentLoaded handler, either:
       - Keep that behaviour and *do not* call it again from `app.js`, or
       - Convert it to the `window.Silverstone.init*` pattern and remove its DOMContentLoaded handler.
   - Do **not** leave “dead” copies of the logic in `app.js` once it has been moved.

### 4.4 JS exit criteria

Before this ExecPlan is considered complete:

- `src/js/header-nav.js`, `scroll-reveal.js`, `stats.js`, and `parallax.js`:
  - Are non‑empty and contain real logic, not stub comments.
  - Expose initialiser functions on `window.Silverstone`.
- `src/js/app.js`:
  - Contains **only** orchestration logic (typically a single DOMContentLoaded handler plus any minimal shared helpers).
  - Does not contain full implementations of header/nav, scroll‑reveal, stats, or parallax.
- The string `Module logic consolidated in app.js` does **not** appear anywhere in `src/js`.
- `npm run build:js` succeeds.
- `npm run build` succeeds (including any image optimisation step).
- There are no references to deleted function names or modules.

---

## 5. Validation and wrap‑up

### 5.1 Automated validation

After both CSS and JS decomposition steps are complete:

1. Run:

   - `npm run build:css`
   - `npm run build:js`
   - `npm run build` (if not too heavy; use it at least once at the end of the run to check the full pipeline).

2. Grep for leftover patterns that indicate incomplete decomposition:

   - In CSS:
     - Search `src/css/base/layout.css` for `site-header`, `site-footer`, `neon-card`, `faq-`, `stats`, `cookie-banner`, `premium-`, `marquee-`.
     - Expect **zero** matches.
   - In JS:
     - Search `src/js` for `Module logic consolidated in app.js`.
     - Search `src/js/app.js` for repeated implementations of the same concern (e.g. multiple `IntersectionObserver` setups for `.animate`).

3. If any issues are found:
   - Fix them and re‑run the commands until clean.

### 5.2 Updating ExecPlans

At the end of this work:

- Optionally add a brief note to `ExecPlan.SilverstoneFrontend.md` in the “Outcomes & Retrospective” section stating that the phase‑2 ExecPlan has completed the CSS/JS decomposition.
- Update this file’s (phase‑2) progress checklist (below) with timestamps.

### 5.3 Progress checklist for this ExecPlan

Use this as a structured TODO list during the run:

- [ ] Step 0 – Baseline checks (`npm install` if needed; `npm run build:css` and `npm run build:js` succeed; structure confirmed).
- [ ] Step 1 – Move all `:root` variables from `layout.css` into `base/variables.css`.
- [ ] Step 2 – Fill out `components/header.css`, `components/footer.css`, `components/stats.css`, `components/faq.css`, `components/cookie-banner.css` with the correct selectors.
- [ ] Step 3 – Move remaining component rules (cards, buttons, hero, etc.) out of `layout.css` and any other catch‑all files into their canonical component modules.
- [ ] Step 4 – Move page‑specific rules into `pages/*.css` where appropriate.
- [ ] Step 5 – Deduplicate CSS selectors; ensure each key selector lives in exactly one module.
- [ ] Step 6 – Confirm CSS exit criteria and `npm run build:css` success.
- [ ] Step 7 – Move header/nav logic from `app.js` into `header-nav.js` and wire `initHeaderNav`.
- [ ] Step 8 – Move scroll‑reveal logic from `app.js` into `scroll-reveal.js` and wire `initScrollReveal`.
- [ ] Step 9 – Move stats logic from `app.js` into `stats.js` and wire `initStats`.
- [ ] Step 10 – Move parallax logic from `app.js` into `parallax.js` and wire `initParallax`.
- [ ] Step 11 – Simplify `app.js` into a thin orchestrator and remove stub comments.
- [ ] Step 12 – Confirm JS exit criteria and `npm run build:js` / `npm run build` success.
- [ ] Step 13 – Summarise changes (per file) and update this checklist with timestamps.

When all boxes are checked and automated validation passes, the CSS and JS decomposition defined in the original refactor plan is complete. :contentReference[oaicite:6]{index=6}
