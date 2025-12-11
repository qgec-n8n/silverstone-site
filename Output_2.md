## 1. High‑level overview

After this refactor, the codebase should look like this:

* **CSS**

  * Source files under `src/css/`:

    * `src/css/base/…` – global variables, typography, layout.
    * `src/css/components/…` – header, footer, hero, cards, buttons, stats, FAQ, etc.
    * `src/css/features/…` – parallax, gallery, marquee, lightbox.
    * `src/css/pages/…` – home, services, about, book, contact, estate-agents (page‑specific tweaks).
  * Built into a **single main CSS bundle** (e.g. `assets/css/styles.css`) that replaces the current scattered CSS (`styles.css`, `custom.css`, `mobile.css`, `custom-styles.css`, `services.css`, `hero-base.css`, `parallax-fix.css`, `premium-gallery.css`, `marquee-*.css`, `icons.css`, etc.).

* **JS**

  * Source files under `src/js/`:

    * `header-nav.js`, `scroll-reveal.js`, `stats.js`, `parallax.js`, `hero-shader.js`, `magnetic-buttons.js`, `marquee.js`, `gallery.js`, `cookie-consent.js`, plus a small module for the contact form.
  * Built into a **single main JS bundle** (e.g. `assets/js/app.js`) that replaces `assets/js/script.js`, `hero-shader.js`, `cookie-consent.js`, `magnetic-buttons.js`, `marquee-single.js`, `marquee-double.js`, `premium-gallery.js`, `neural-grid.js` and the inline contact form script.

* **HTML**

  * All pages reference **only the new CSS and JS entrypoints** (the new `styles.css` and `app.js`, plus external fonts/Calendly).
  * All markup (classes, IDs, data attributes) is aligned with the consolidated CSS and JS modules.
  * All legacy/unused selectors and files identified in **6.1**, **6.2**, **6.3** are removed.

The refactor will be executed in **one continuous run by Codex in Codex Cloud**. Codex works in a containerized environment with the repo checked out, and can read/edit files and run commands such as test harnesses, linters, type checkers, and build scripts. ([OpenAI Developers][1])

During this single run, Codex will:

* Perform **automated, environment‑feasible checks** (commands, linters, greps, etc.) at defined checkpoints and in a final validation phase.
* Leave **HUMAN validation and regression checks** (browser testing, visual QA, UX review) **until after** all code changes and Codex’s automated checks are complete.

---

## 2. Pre‑refactor preparation

All instructions here are for Codex (or any automated agent) to execute step‑by‑step.

### 2.1 Working branch & snapshot

1. **Conceptual branch**

   * Treat the working directory as a **single “refactor” branch** (even if Codex Cloud replays changes as a diff):

     * Ensure the repo is clean (`git status` shows no uncommitted changes).
     * Record the current commit SHA for rollback if needed.

2. **Initial listing**

   * List the key files to confirm assumptions from the earlier analysis:

     * HTML: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`, `niches/estate-agents.html`.
     * CSS (current): `assets/css/styles.css`, `custom.css`, `custom-styles.css`, `mobile.css`, `services.css`, `hero-base.css`, `parallax-fix.css`, `premium-gallery.css`, `marquee-single.css`, `marquee-double.css`, `icons.css`, plus files from **6.1** (`neural-grid.css`, `home-services-fix.css`, `footer.css`).
     * JS (current): `assets/js/script.js`, `hero-shader.js`, `cookie-consent.js`, `magnetic-buttons.js`, `marquee-single.js`, `marquee-double.js`, `premium-gallery.js`, `neural-grid.js`, etc.

3. **Snapshot current CSS/JS usage**

   * For each CSS file, run a search for its **filename** across HTML and JS:

     * e.g. `grep -R "marquee-single.css" .` or equivalent.
   * For each JS file, similarly search the repo.
   * This confirms which files are actually referenced by `<link>`/`<script>` tags or imported by JS.

4. **Backup selectors / JS hooks lists**

   * For each HTML file, export:

     * All `class` attributes (e.g. via regex or a small script).
     * All `id` attributes.
     * All `data-` attributes.
   * For JS files, export any selectors used in `querySelector`/`querySelectorAll`/`getElementById` and any string constants that look like class names.
   * These lists will be used to double‑check the **unused selectors** from **6.2** and ensure no accidentally used selector is removed.

### 2.2 Capability scan in Codex Cloud

Codex Cloud can run arbitrary commands inside a sandboxed environment with the repo checked out. ([OpenAI Developers][1])

1. **Detect package manager & scripts**

   * Look for `package.json`; if present:

     * Record available scripts like `build`, `test`, `lint`, `format`, `serve`, etc.
   * If there is any README/ docs indicating build/test commands, record those.

2. **Check for common tools**

   * Test availability of typical commands:

     * `npm`, `pnpm`, or `yarn`.
     * `eslint`, `stylelint`, `prettier` (either directly or via `npx`).
     * `git` (for final diff inspection).
   * Record which of these succeed; these will be candidate **automated validation commands**.

3. **Decide validation commands**

   * Based on what exists:

     * If a **test** script is present (`npm test`, `npm run test`), mark it as a **final validation** command.
     * If a **build** script exists, mark it for final validation.
     * If **lint** or **format** scripts exist, mark them for:

       * mid‑refactor checks after major CSS and JS moves, and
       * final checks.
   * Even if no formal scripts exist, Codex can still:

     * Run **search/grep** commands (e.g. `grep`, `rg`, `git grep`) for consistency checks.
     * Use simple static checks (e.g. `node build-css.js` if present).
   * Record this “validation toolset” mentally for later steps.

### 2.3 Re‑align with 6.1 / 6.2 / 6.3

1. **Load the lists from earlier:**

   * **6.1 Unused CSS files**: `assets/css/neural-grid.css`, `home-services-fix.css`, `footer.css`.
   * **6.2 Unused selectors**: lists per file (e.g. `.about-hero`, `.contact-hero`, `.bg-city`, `.check-icon`, `.menu-toggle`, etc.).
   * **6.3 Duplicate/overlapping selectors**: `.site-footer*` in `styles.css` vs `footer.css`, `.btn*` across multiple CSS, `.premium-lightbox` duplication between `marquee-single.css` and `marquee-double.css`, `.service-row` spreads, etc.

2. **Verify via search**

   * For each **selector** flagged as unused in **6.2**, run:

     * A search in all HTML, JS, and CSS (to ensure no dynamic or nested usage).
   * For each **duplicated selector** in **6.3**, confirm:

     * All definitions and where they live (line ranges) in the current CSS files.
   * If any selector appears to be used dynamically in JS (e.g., class added via `element.classList.add('some-class')`), mark it as **not safe to delete** and adjust plans accordingly.

3. **Record final “trusted” lists**

   * Codex should keep updated lists (in its working memory) of:

     * CSS files to delete.
     * Selector names that are safe to drop.
     * Selector groups that must be consolidated.

---

## 3. CSS refactor plan

### 3.1 Mapping from current CSS files to new structure (from 7.3)

Create the new directory structure:

* `src/css/base/`
* `src/css/components/`
* `src/css/features/`
* `src/css/pages/`

Then create the following **new CSS modules**, mapping content from existing files:

---

#### 3.1.1 `src/css/base/variables.css`

* **Purpose**: Color palette, spacing scale, typography scale, shadows, z‑indices, global CSS custom properties and any root‑level resets.
* **Source content**:

  * Variable and root blocks from `assets/css/styles.css` and `assets/css/custom.css`.
  * Any global `:root { --... }` and helpful `html, body` base rules.
* **Selectors/components here**:

  * `:root` variables (colors, font families, font sizes, radii, spacings).
  * `html`, `body` base (but only the pure reset/box‑sizing/scroll-behavior bits; layout goes to `layout.css`).
* **Process**:

  1. Copy variables and base resets from `styles.css` and `custom.css` into `variables.css`.
  2. Remove these blocks from the original files after migration.

---

#### 3.1.2 `src/css/base/typography.css`

* **Purpose**: Global typography and icon font definitions.
* **Source content**:

  * Headings, paragraphs, text utilities from `styles.css`.
  * Icon font and icon classes from `assets/css/icons.css`.
* **Selectors/components**:

  * `h1`–`h6`, `p`, `a`, `ul`, `ol`, `li`, `small`, `strong`.
  * Any `.heading-*` or `.text-*` classes.
  * Icon classes used in HTML (not the unused ones noted in 6.2).
* **Process**:

  1. Move typography rules from `styles.css` and `icons.css`.
  2. For icons, only move classes actually used in HTML/JS (e.g. Font Awesome base, `.icon-list` if used; skip unused icon selectors from 6.2).
  3. Remove them from the legacy files.

---

#### 3.1.3 `src/css/base/layout.css`

* **Purpose**: Sitewide layout primitives and section spacing.
* **Source content**:

  * `.container`, `.section`, `.section.bg-*`, generic grid/flex utilities from `styles.css`, `custom.css`, `mobile.css`, `parallax-fix.css`.
* **Selectors/components**:

  * `.container`, `.section`, `.section::before`, `.section::after`.
  * `.bg-lines`, `.bg-mesh`, `.bg-waves`, `.bg-circuit`, `.brand-gradient`, `.bg-book` etc.
  * Basic layout helpers like `.grid`, `.flex-center` if present.
* **Process**:

  1. Move common layout rules into `layout.css`, including mobile overrides (put responsive `@media` directly in same file for each layout rule).
  2. Ensure background theme styles for parallax sections are present here (actual parallax motion goes to `features/parallax.css`).
  3. Remove these blocks from original CSS.

---

#### 3.1.4 `src/css/components/header.css`

* **Purpose**: Header, nav, services dropdown panel, services overlay, header indicator bar.
* **Source content**:

  * Header & nav from `styles.css`, `custom.css`, `mobile.css`.
  * Services overlay from `styles.css`.
  * Header indicator bar styles that were inline in `<style>` or injected by JS.
* **Selectors/components**:

  * `.site-header`, `.header-inner`, `.logo`, `.site-logo`.
  * `nav ul`, `nav li`, `.nav-dropdown`, `.services-menu`, `.services-toggle`, `.services-label`, `.chevron`.
  * `.services-overlay`, `.services-overlay__panel`, `.services-overlay__header`, `.services-overlay__back`, `.services-overlay__grid`, `.service-pill`.
  * `#header-indicator`, `.indicator-copy`.
* **Process**:

  * Extract all header/nav related rules, unify desktop+mobile into single module (with media queries).
  * Align with JS hooks that will live in `src/js/header-nav.js`.

---

#### 3.1.5 `src/css/components/footer.css`

* **Purpose**: Footer styling.
* **Source content**:

  * Footer rules from `styles.css`.
  * Any useful bits from `assets/css/footer.css` (but we will delete that file per 6.1 after merging).
* **Selectors/components**:

  * `.site-footer`, `.footer-container`, `.footer-brand`, `.footer-logo`, `.footer-links`, `.footer-column`, `.social-icons`, `.footer-bottom`.
* **Process**:

  * Copy from both files, merge into canonical definitions, then delete `footer.css`.

---

#### 3.1.6 `src/css/components/hero.css`

* **Purpose**: Hero/title band layout and layering.
* **Source content**:

  * `.hero`, `.title-band`, `.hero-inner`, `.hero-copy`, `.hero-media`, etc from `styles.css`, `custom.css`, `hero-base.css`, and related inline `<style>` overrides from pages.
* **Selectors/components**:

  * `.hero`, `.title-band`, `.hero-inner`, `.hero-copy`, `.hero-kicker`, `.tagline`, `.hero-actions`, `.hero-subtext`, `.hero-media`, `#hero-shader-canvas`.
* **Process**:

  * Consolidate hero layout and stacking rules, including mobile stacking, into this module.
  * Move hero inline tweaks (e.g. page‑specific hero spacing) to **page modules** (`home.css`, `services.css`, etc.) if they are not global.

---

#### 3.1.7 `src/css/components/cards.css`

* **Purpose**: Shared card styles for all card types.
* **Source content**:

  * `.neon-card` and all card variants from `styles.css`, `custom.css`, `custom-styles.css`, `services.css`, inline `<style>` blocks (values, gallery, etc.).
* **Selectors/components**:

  * `.neon-card`, `.feature-card`, `.value-card`, `.pricing-card`, `.proof-card`, `.cta-card`, `.contact-form-card`, `.contact-details`, `.dark-card`, `.gallery-card`, `.service-image`, `.service-content`, `.stat`, `.faq-item` base.
  * Card‑level spacing and border/glow styles.
* **Process**:

  * Normalize card typography and spacing; keep layout specifics to the page/component modules when necessary.
  * Remove card‑specific rules from general `styles.css` and other CSS.

---

#### 3.1.8 `src/css/components/buttons.css`

* **Purpose**: All button styling.
* **Source content**:

  * `.btn`, `.btn-primary`, `.btn-secondary` from `styles.css`, `custom.css`, `custom-styles.css`, `mobile.css`, `icons.css` (if anything modifies buttons).
* **Selectors/components**:

  * `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline` if present, `.contact-submit`, `.cookie-banner .btn`.
* **Process**:

  * Merge all button definitions into one canonical set.
  * Ensure hover/focus states and responsive sizing live here.
  * Remove duplicates described in 6.3 from old CSS files.

---

#### 3.1.9 `src/css/components/stats.css`

* **Purpose**: Stats grids used on home, about, estate‑agents.
* **Source content**:

  * Stats CSS from inline `<style>` blocks in `index.html`, `about.html`, `niches/estate-agents.html`.
* **Selectors/components**:

  * `.stats`, `.stat`, `.stat-icon`, `.number`, `.label`.
* **Process**:

  * Consolidate all stat layouts and ensure consistent spacing across pages.
  * Delete inline style blocks afterward.

---

#### 3.1.10 `src/css/components/faq.css`

* **Purpose**: FAQ layout and styling.
* **Source content**:

  * `.faq-section`, `.faq-list`, `.faq-item` from `styles.css` and estate‑agents specific FAQ styles.
* **Selectors/components**:

  * `.faq-section`, `.faq-list`, `.faq-item`, `.faq-item summary`, `.faq-body`.
* **Process**:

  * Make sure `<details>` style and static Q&A style both work properly.
  * Remove FAQ rules from original files.

---

#### 3.1.11 `src/css/components/cookie-banner.css`

* **Purpose**: Cookie banner layout.
* **Source content**:

  * `.cookie-banner` etc. from `styles.css` and inline `<style>` overrides.
* **Selectors/components**:

  * `#cookie-banner`, `.cookie-banner`, `.cookie-buttons`, `.cookie-link`.
* **Process**:

  * Move all cookie banner styling here; remove duplicates from other files.

*(We didn’t explicitly name this file in 7.3, but it fits the existing `components` folder and is aligned with that proposal.)*

---

#### 3.1.12 `src/css/features/parallax.css`

* **Purpose**: Pure parallax behavior (motion), distinct from static backgrounds in `layout.css`.
* **Source content**:

  * Motion‑specific parallax rules from `parallax-fix.css`, `custom.css`, `styles.css`.
* **Selectors/components**:

  * `.parallax-section` motion rules, `.parallax-mobile-stage`, `.parallax-mobile-layer`, `.parallax-mobile-active`, `.parallax-ready`, `.webp`.
* **Process**:

  * Keep parallax themed backgrounds in `layout.css`, movement/transform/hardware acceleration hints here.

---

#### 3.1.13 `src/css/features/gallery.css`

* **Purpose**: Innovation gallery mosaic.
* **Source content**:

  * `premium-gallery.css`, plus any fallback `.neural-grid` definitions in `styles.css`.
* **Selectors/components**:

  * `#neural-grid`, `.premium-tile`, `.tile-inner`, `.tile-front`, `.tile-back`, `.tile-caption`, and sanitized `.neural-grid` fallback.
* **Process**:

  * Move all relevant gallery rules here.
  * Drop obsolete `.neural-card` animations if they aren’t used by the new premium gallery (and are marked unused in 6.2).

---

#### 3.1.14 `src/css/features/marquee.css`

* **Purpose**: Both single and double marquee tracks.
* **Source content**:

  * `marquee-single.css` and `marquee-double.css` (including duplicated lightbox styles).
* **Selectors/components**:

  * `.single-marquee`, `.double-marquee`, `.marquee-track`, `.marquee-img`, row types (`.row-1`, `.row-2`), speed/direction classes, and marquee keyframes.
* **Process**:

  * Harmonize the two CSS files into one canonical module.
  * Move shared lightbox styles into `features/lightbox.css` (below).

---

#### 3.1.15 `src/css/features/lightbox.css`

* **Purpose**: Shared lightbox for gallery and marquees.
* **Source content**:

  * `.premium-lightbox`, `.lightbox-img`, `.lightbox-caption`, `.lightbox-close` from both marquee CSS files and any relevant bits in `premium-gallery.css`.
* **Selectors/components**:

  * `.premium-lightbox`, `.lightbox-backdrop`, `.lightbox-content`, `.lightbox-img`, `.lightbox-caption`, `.lightbox-close`.
* **Process**:

  * Ensure all lightbox rules are here; remove duplicates from `marquee-single.css`, `marquee-double.css`, `premium-gallery.css`.

---

#### 3.1.16 Page‑specific modules `src/css/pages/*.css`

These correspond to the page‑level differences described in your previous analysis.

* `src/css/pages/home.css`

  * Purpose: home‑only adjustments (services packages grid, proof section, home FAQ variations, CTA band spacing).
  * Source: home inline `<style>` blocks and any `.packages-grid`, `.proof-grid`, `.home-only` rules from `custom-styles.css` and `styles.css` that are only used on the home page.

* `src/css/pages/services.css`

  * Purpose: services rows layout, innovation gallery heading, services‑specific CTA spacing.
  * Source: `services.css` + services inline `<style>` block.

* `src/css/pages/about.css`

  * Purpose: about “Our mission” row, values cards grid, “What drives us” collage layout.
  * Source: about inline `<style>` block.

* `src/css/pages/book.css`

  * Purpose: discovery call layout around Calendly and supporting copy.
  * Source: book inline `<style>` blocks.

* `src/css/pages/contact.css`

  * Purpose: contact grid and social callout specifics.
  * Source: contact inline `<style>` blocks.

* `src/css/pages/estate-agents.css`

  * Purpose: estate‑agents specific sections: `.compact-section`, `.dark-card` tweaks, estate stats difference, estate FAQ variant.
  * Source: estate‑agents inline `<style>` block.

*(Privacy page uses standard `.section` and `.neon-card` patterns; any privacy‑only tweaks can live in `layout.css` as generic “legal text” rules if needed.)*

---

### 3.2 Removing unused CSS files (Section 6.1)

Recall from **6.1** the files considered unused:

* `assets/css/neural-grid.css`
* `assets/css/home-services-fix.css`
* `assets/css/footer.css`

**Procedure for Codex:**

1. **Double‑check usage**

   * For each of the above files, run a repo‑wide search for their filenames:

     * `grep -R "neural-grid.css" .` etc.
   * Confirm they are **not** referenced by any HTML or JS.

2. **Check for migrated content**

   * Before deleting, ensure all *useful* rules from these files have been:

     * Either moved into new `src/css` modules (footer rules from `footer.css` into `components/footer.css`, any still‑relevant bullet fixes from `home-services-fix.css` into `pages/home.css` or `components/cards.css`), or
     * Confirmed truly redundant.

3. **Delete legacy files**

   * Remove the three CSS files from `assets/css/`.

4. **Run a quick automated check**

   * If a build script exists (e.g. `npm run build`), run it to ensure no build process references these files.
   * If not, at minimum:

     * Grep for `home-services-fix.css`, `neural-grid.css`, `footer.css` to confirm they no longer appear anywhere.

5. **Condition to proceed**

   * No references to these files in the repo.
   * Any build/lint commands still succeed.

---

### 3.3 Cleaning unused selectors within active CSS files (Section 6.2)

The goal is: **unused selectors from 6.2 do not appear in the new `src/css` modules**.

General **repeatable procedure** per active CSS module:

1. **For each selector flagged in 6.2**:

   * Confirm with search:

     * Search for `.about-hero`, `.bg-city`, `.check-icon`, `.menu-toggle`, `.no-card`, `.services-hero`, etc. in **all HTML and JS**, plus any new `src/css` modules.
   * If it appears only in CSS, and not dynamically added in JS, it’s safe to drop.

2. **While migrating from old CSS to new modules**:

   * **Skip** copying any rule whose selector is in the 6.2 “unused” list.
   * If you already copied it inadvertently, delete it from the new module.

3. **Be careful about dynamic selectors**

   * For each candidate unused selector:

     * Search JS for it (class names in string literals, e.g. `"services-hero"`).
     * If present in JS, rethink: perhaps it’s used dynamically and should be retained.
   * Only remove selectors that are not referenced anywhere outside CSS.

4. **After cleaning each module**:

   * Run a quick CSS lint/parse check if possible, e.g. `npx stylelint "src/css/**/*.css"` or an equivalent tool, if present in the environment, to catch syntax errors introduced by deletions.

5. **Modules with heavy unused selectors from 6.2**:

   * `styles.css` (original): ensure these are **not** moved:

     * `.about-hero`, `.contact-hero`, `.home-hero`, `.services-hero`, `.booking-hero`, `.booking-bg`, `.bg-city`, `.calendly-inline-iframe`, `.calendly-mask`, `.check-icon`, `.google-map`, `.map-col`, `.menu-toggle`, `.no-card`, `.services-section`, `.text-center`, `.values-gallery`, `.what-drives-us` (obsolete naming), and stray ID selectors like `#FFFFFF`, `#calendar-visual`.
   * `mobile.css`: skip `.bg-city` and stray ID-like selectors (`#a855f7` etc.).
   * `icons.css`: skip any unused icon classes from 6.2.
   * `parallax-fix.css`: skip `.parallax-layer` if not referenced.
   * `services.css`: skip unused `.contact-map`, `.contact-row`, `.gallery-img`, `.neon1`–`.neon8`.

6. **Final check after all CSS migrations**

   * Run a global search for each selector listed in 6.2:

     * Expect **zero** results for all confirmed‑unused ones.
   * If any remain, investigate whether they’re accidentally kept or are indeed used.

---

### 3.4 Consolidating duplicate / overlapping selectors (Section 6.3)

Use the new structure as the **canonical home** for shared concerns:

* Buttons → `src/css/components/buttons.css`
* Footer → `src/css/components/footer.css`
* Lightbox & marquee → `src/css/features/lightbox.css` and `src/css/features/marquee.css`
* Animation utilities → `src/css/features/parallax.css` and possibly a small shared area in `layout.css`
* Service rows → `src/css/pages/services.css` + `src/css/components/cards.css`

**General consolidation procedure:**

1. **Pick canonical file & selector**

   * In the new structure, decide where each duplicated selector lives:

     * `.btn*` → `buttons.css`
     * `.site-footer*` → `footer.css`
     * `.premium-lightbox*` → `lightbox.css`
     * `.marquee-track`, `.marquee-img` → `marquee.css`
     * `.animate`, `.visible` → a central location (e.g. `layout.css` or a small `animations` section in `parallax.css`).

2. **Merge properties**

   * Compare all duplicate definitions (copied from existing CSS files).
   * Merge them into a **single rule** per selector in the chosen file:

     * Preserve the most up‑to‑date values (those that reflect the current site behavior).
     * Add comments (if helpful) when merging conflicting values, but comments are optional.

3. **Drop redundant definitions**

   * Delete secondary/overlapping definitions of those selectors from other new modules.
   * When removing from old assets, ensure that no “special-case override” is required; if needed, convert it into a more specific selector in the canonical file.

4. **Update HTML if needed**

   * Some overlapping styles may correspond to different class names that are essentially variants of the same thing.
   * Example: if both `.btn-primary` and `.btn-main` are defined but only one is truly used, update HTML to use the canonical one.
   * This is done later during the HTML refactor (Section 5), but keep track of these necessary renames now.

5. **Consistency checks**

   * After consolidation of a concern, run:

     * A global search for old class names (e.g. `.btn-primary` duplicates in other files, `.site-footer` definitions in `footer.css`) to ensure they appear only in the canonical files.
   * If linters are available, run them again to catch any syntax slips.

---

### 3.5 Component‑level extraction

This step takes large, mixed legacy styles and carves out clean component CSS.

For each component:

#### 3.5.1 Buttons

* **Target file**: `src/css/components/buttons.css`
* **Selectors**:

  * `.btn`, `.btn-primary`, `.btn-secondary`, other `.btn-*` variants.
* **Steps**:

  1. Locate all button rules in `styles.css`, `custom.css`, `mobile.css`, `custom-styles.css`.
  2. Move them into `buttons.css`, merging via 3.4.
  3. Ensure any page‑specific button overrides (e.g. special CTA) are moved into the relevant `pages/*.css` instead.
  4. Search the repo to confirm:

     * No remaining button style blocks in the old CSS files.
     * All `.btn` selectors are now in one place.

#### 3.5.2 Cards

* **Target file**: `src/css/components/cards.css`
* **Selectors**:

  * `.neon-card`, `.feature-card`, `.pricing-card`, `.value-card`, `.proof-card`, `.cta-card`, `.service-image`, `.service-content`, `.contact-form-card`, `.contact-details`, `.dark-card`, `.gallery-card`, etc.
* **Steps**:

  1. Move base card styles from `styles.css`, `custom.css`, `custom-styles.css`, `services.css`, inline styles.
  2. Keep **layout‑specific** rules (e.g. service row alignment) in `pages/services.css`.
  3. Normalize card naming where 6.3 indicates duplication (e.g. if different classes share identical rules).
  4. Search to ensure there are no stray card rules in other modules.

#### 3.5.3 Header & nav

* **Target file**: `src/css/components/header.css`
* **Selectors**: as in 3.1.4.
* **Steps**:

  1. Extract header/nav related rules from `styles.css`, `custom.css`, `mobile.css`.
  2. Keep all states (scrolled, overlay, dropdown) in this file.
  3. Ensure the CSS matches the structure used by `src/js/header-nav.js` (see JS plan).

#### 3.5.4 Footer

* **Target file**: `src/css/components/footer.css`
* **Selectors**: as in 3.1.5.
* **Steps**:

  1. Merge all `.site-footer*` rules from `styles.css` and `footer.css`.
  2. Remove the duplicate file per 6.1.

#### 3.5.5 Stats

* **Target file**: `src/css/components/stats.css`
* **Selectors**: `.stats`, `.stat`, `.stat-icon`, `.number`, `.label`.
* **Steps**:

  1. Move all stats styling from inline CSS into this file.
  2. Delete the inlined `<style>` rules from HTML once integrated.

#### 3.5.6 FAQ

* **Target file**: `src/css/components/faq.css`
* **Selectors**: `.faq-section`, `.faq-list`, `.faq-item`, `.faq-body`.
* **Steps**:

  1. Move FAQ styles from `styles.css` and estate‑agents inline CSS into this file.
  2. Ensure both `<details>` and static Q&A markup look correct.

#### 3.5.7 Parallax, gallery, marquee, lightbox

* **Targets**:

  * `src/css/features/parallax.css`
  * `src/css/features/gallery.css`
  * `src/css/features/marquee.css`
  * `src/css/features/lightbox.css`
* **Steps**:

  1. Extract all movement/animation and gallery/marquee/lightbox rules into these files.
  2. Ensure backgrounds (colors/gradients) remain in `layout.css`.
  3. Deduplicate lightbox styles as described in 6.3.

#### 3.5.8 Page‑specific layouts

* **Targets**: each `src/css/pages/*.css`
* **Steps**:

  1. For each page, move inline `<style>` content into the correct `pages/*.css` file.
  2. Remove inline `<style>` once verified.
  3. Keep per‑page variations here (e.g. `compact-section` on estate‑agents, special hero spacing on book page).

---

## 4. JS refactor plan

### 4.1 Mapping from current JS files to new structure (from 7.3)

Create `src/js/` with the following modules:

* `src/js/header-nav.js`
* `src/js/scroll-reveal.js`
* `src/js/stats.js`
* `src/js/parallax.js`
* `src/js/hero-shader.js`
* `src/js/magnetic-buttons.js`
* `src/js/marquee.js`
* `src/js/gallery.js`
* `src/js/cookie-consent.js`
* `src/js/contact-form.js` (for the contact page inline script)
* `src/js/app.js` (entrypoint that wires everything together)

**Mapping:**

1. **From `assets/js/script.js` →**

   * Nav & services overlay → `header-nav.js`
   * Header indicator logic → `header-nav.js`
   * Scroll reveal (`.animate` → `.visible`) → `scroll-reveal.js`
   * Stats counters → `stats.js`
   * Parallax setup (`.parallax-section` handling, `parallax-mobile-stage`) → `parallax.js`
   * Dynamic CSS loader (`ensureStylesheet`) → either `app.js` (or a small utility inside it).

2. **From `assets/js/hero-shader.js` →**

   * All WebGL hero shader logic → `hero-shader.js`.

3. **From `assets/js/magnetic-buttons.js` →**

   * Magnetic hover on `.btn` → `magnetic-buttons.js`.

4. **From `assets/js/marquee-single.js` and `assets/js/marquee-double.js` →**

   * Shared data & logic for both marquee types → `marquee.js`.

5. **From `assets/js/premium-gallery.js` →**

   * Premium innovation gallery and shared lightbox integration → `gallery.js`.

6. **From `assets/js/cookie-consent.js` →**

   * Cookie banner behavior → `cookie-consent.js`.

7. **From `assets/js/neural-grid.js` →**

   * This is legacy/unused and will eventually be deleted as per 4.3; any useful logic should be considered superseded by `gallery.js`.

8. **From inline script in `contact.html` →**

   * Contact form submission (Netlify function call, status updates) → `contact-form.js`.

9. **`src/js/app.js`**

   * The new main entrypoint:

     * Imports or otherwise composes the above modules.
     * On DOMContentLoaded:

       * Initializes header/nav behavior.
       * Initializes scroll reveal.
       * Initializes stats.
       * Initializes parallax.
       * Initializes hero shader on pages that have the hero canvas.
       * Initializes magnetic buttons.
       * Initializes marquee/galleries based on body/page classes.
       * Initializes cookie consent.
       * Initializes contact form handler on contact page.

The build system (or simple concatenation) will output a **single `assets/js/app.js`** referenced by all HTML pages.

---

### 4.2 Extracting and isolating component behavior

#### 4.2.1 Header & nav behavior → `src/js/header-nav.js`

* **Responsibilities**:

  * Mobile nav open/close.
  * Services dropdown and overlay open/close.
  * Header show/hide on scroll.
  * Header indicator bar logic.
* **Steps**:

  1. From `assets/js/script.js`, locate functions that:

     * Manipulate `.nav-toggle`, `.site-header`, `.services-overlay`, `.services-menu`, and `#header-indicator`.
  2. Extract these into named functions, e.g.:

     * `initHeaderNav()`
     * `openNavMenu()`, `closeNavMenu()`
     * `openServicesDropdown()`, `closeServicesDropdown()`
     * `openServicesOverlay()`, `closeServicesOverlay()`
     * `initHeaderIndicator()`
  3. Ensure they use **selectors consistent with the consolidated CSS** (`header.css`).
  4. Expose a single exported `initHeader()` (or similar) for `app.js` to call on DOMContentLoaded.

#### 4.2.2 Scroll reveal → `src/js/scroll-reveal.js`

* **Responsibilities**:

  * Observing `.animate` elements; adding `.visible` class on intersection or immediately when motion is reduced.
* **Steps**:

  1. Extract IntersectionObserver setup from `script.js`.
  2. Encapsulate into `initScrollReveal()`.
  3. Ensure it uses `window.matchMedia` for `prefers-reduced-motion` and mobile conditions.
  4. Called once from `app.js`.

#### 4.2.3 Stats counters → `src/js/stats.js`

* **Responsibilities**:

  * Observing `.stats` containers and animating `.number[data-target]` within.
* **Steps**:

  1. Extract stats logic from `script.js`.
  2. Turn into `initStatsCounters()`.
  3. Ensure robust check: if no `.stats` elements exist, function is a no‑op.
  4. Called once from `app.js`.

#### 4.2.4 Parallax → `src/js/parallax.js`

* **Responsibilities**:

  * Using `data-parallax-theme` and `.parallax-section` to create background motion.
  * Handling desktop vs mobile vs reduced motion.
* **Steps**:

  1. Extract parallax code from `script.js`.
  2. Encapsulate into `initParallax()`.
  3. Use configuration consistent with `src/css/features/parallax.css` and `layout.css`.
  4. Called once from `app.js`.

#### 4.2.5 Hero shader → `src/js/hero-shader.js`

* **Responsibilities**:

  * Setting up WebGL hero background.
* **Steps**:

  1. Copy code from `assets/js/hero-shader.js` into `src/js/hero-shader.js`.
  2. Wrap it into `initHeroShader()` that:

     * Only runs if `#hero-shader-canvas` exists.
     * Respects `prefers-reduced-motion`.
  3. Remove DOMContentLoaded handling from this module; `app.js` will call it explicitly.

#### 4.2.6 Magnetic buttons → `src/js/magnetic-buttons.js`

* **Responsibilities**:

  * Magnetic hover for `.btn` elements.
* **Steps**:

  1. Move logic into `initMagneticButtons()` which:

     * Selects `.btn` elements and attaches `mousemove`/`mouseleave`.
     * Skips on touch devices or `hover: none`.
  2. Ensure it works with the consolidated `.btn` styling.

#### 4.2.7 Marquees → `src/js/marquee.js`

* **Responsibilities**:

  * Single marquee for non-services pages.
  * Double marquee for services page.
  * Shared lightbox integration.
* **Steps**:

  1. Pull logic from `marquee-single.js` and `marquee-double.js`.
  2. Create functions:

     * `initSingleMarquee()` – builds marquee before footer if `body` does **not** have `page-services`.
     * `initDoubleMarquee()` – builds double marquee inside `#innovation-marquee-slot` if `body.page-services`.
     * `ensureMarqueeLightbox()` – ensures `.premium-lightbox` DOM exists (shared with gallery).
  3. Ensure both functions reuse the same `MARQUEE_IMAGES` list and share lightbox behavior.
  4. Export `initMarquees()` that:

     * Calls `ensureMarqueeLightbox()`.
     * Calls the appropriate initializer based on the page.

#### 4.2.8 Gallery → `src/js/gallery.js`

* **Responsibilities**:

  * Innovation gallery layout and tile interactions.
  * Lightbox integration shared with marquee.
* **Steps**:

  1. Move logic from `premium-gallery.js` into `src/js/gallery.js`.
  2. Create:

     * `initPremiumGallery()` – finds `#neural-grid`, rebuilds it using `GALLERY_ITEMS`.
  3. Use the same `.premium-lightbox` as `marquee.js`, ensuring compatibility.

#### 4.2.9 Cookie banner → `src/js/cookie-consent.js`

* **Responsibilities**:

  * `#cookie-banner` show/hide, localStorage, body class toggling.
* **Steps**:

  1. Move logic from `cookie-consent.js` into `initCookieConsent()`.
  2. Ensure must run once; no DOMContentLoaded wrapper inside this module.

#### 4.2.10 Contact form → `src/js/contact-form.js`

* **Responsibilities**:

  * Handling `#contact-form` submission and updating `#contact-status`.
* **Steps**:

  1. Copy inline script from `contact.html`.
  2. Wrap into `initContactForm()` that:

     * Binds `submit` only when `#contact-form` exists.
     * Performs `fetch('/.netlify/functions/send-email')` same as current script.
  3. Remove the inline `<script>` from HTML once integrated.

#### 4.2.11 App entrypoint → `src/js/app.js`

* **Responsibilities**:

  * Orchestration.
* **Steps**:

  1. Build a simple entrypoint that, on DOMContentLoaded, does:

     * `initHeaderNav()`
     * `initScrollReveal()`
     * `initStatsCounters()`
     * `initParallax()`
     * `initHeroShader()`
     * `initMagneticButtons()`
     * `initMarquees()`
     * `initPremiumGallery()`
     * `initCookieConsent()`
     * `initContactForm()` (only on contact page)
  2. Ensure `app.js` is the only script tag used across HTML pages (except Calendly external script).

**Post‑extraction checks:**

* After each major component extraction, Codex should:

  * Grep for inline event handlers (`onclick`, etc.) in HTML to ensure none are left (except acceptable ones, if any).
  * Run any available JS lint or tests.

---

### 4.3 Removing legacy / unused JS

Once all behaviors are moved and wired through `src/js` and built into `assets/js/app.js`:

1. **Verify no references to old JS files remain**

   * Search in HTML for:

     * `script.js`, `hero-shader.js`, `cookie-consent.js`, `magnetic-buttons.js`, `marquee-single.js`, `marquee-double.js`, `premium-gallery.js`, `neural-grid.js`.
   * Ensure all `<script>` tags now point to `assets/js/app.js` (plus external Calendly, if any).

2. **Delete legacy JS files**

   * Remove the old files from `assets/js/` except:

     * Any build scripts or Node utilities (e.g., `build-css.js`) that are part of the toolchain.

3. **Remove inline scripts**

   * Delete the contact form inline script (now handled by `contact-form.js`).
   * Confirm there are no other inline scripts performing core logic; if you find any, either migrate them into `app.js` or remove if obsolete.

4. **Run automated checks**

   * Run any test/build commands discovered in Section 2.
   * At minimum:

     * Ensure `app.js` parses correctly (e.g. using a linter or `node -c` style check if applicable).

5. **Mark remaining JS**

   * Any leftover JS not accounted for (like experimental files) should be investigated:

     * If truly unused, remove them.
     * If used, migrate them similarly into `src/js` and `app.js`.

---

## 5. HTML / template refactor plan

The goal is to:

* Point all HTML pages to the new **single CSS** and **single JS** entrypoints.
* Align markup with the consolidated selectors and modules.

### 5.1 Update `<link>` tags

1. **Determine final CSS entrypoints**

   * After CSS migration, there should be a **single built CSS** (e.g. `assets/css/styles.css`) containing:

     * Base, components, features, pages, and responsive rules.
   * If icon fonts or external resources still require separate CSS from CDNs, keep those `<link>`s.

2. **For each HTML page:**

   * Remove `<link>` tags referencing:

     * `assets/css/custom.css`
     * `custom-styles.css`
     * `mobile.css`
     * `services.css`
     * `hero-base.css`
     * `parallax-fix.css`
     * `premium-gallery.css`
     * `marquee-single.css`
     * `marquee-double.css`
     * `icons.css` (if its content has been merged into `styles.css`).
   * Add or keep a single `<link rel="stylesheet" href="assets/css/styles.css">` (path adjusted for nested pages like `niches/estate-agents.html`).

3. **Automated check**

   * After updating, search across the repo for any `<link>` referencing old CSS filenames and ensure zero results.

### 5.2 Update `<script>` tags

1. **Decide final JS entrypoints**

   * There should be one local JS bundle: `assets/js/app.js`.
   * External scripts like Calendly remain as separate `<script>` tags.

2. **For each HTML page:**

   * Remove `<script>` tags for:

     * `assets/js/script.js`
     * `hero-shader.js`
     * `cookie-consent.js`
     * `magnetic-buttons.js`
     * `marquee-single.js`
     * `marquee-double.js`
     * `premium-gallery.js`
     * `neural-grid.js`
   * Insert `<script src="assets/js/app.js" defer></script>` at the end of the `<body>` (path adjusted for nested pages).
   * Keep `Calendly`’s external `<script>` on `book.html`.

3. **Automated check**

   * Search for old JS filenames; ensure they are not referenced anywhere in HTML.

### 5.3 Update class names / IDs / data attributes

Consolidation from 6.3 may require class renames or removals:

1. **Buttons**

   * If multiple button variants existed but you’ve consolidated in `buttons.css`:

     * For example, if `.btn-main` was consolidated into `.btn-primary`, replace HTML `class="btn btn-main"` with `class="btn btn-primary"`.
   * Use systematic search/replace for any such mapping.

2. **Footer**

   * Ensure footer markup uses canonical classes (`.site-footer`, `.footer-container`, `.footer-brand`, `.footer-links`, `.footer-column`, `.social-icons`).
   * Remove any leftover classes tied to `footer.css` if they were different.

3. **Neural gallery / premium gallery**

   * Ensure the gallery container uses IDs/classes expected by `gallery.js` and `gallery.css`:

     * `id="neural-grid"`, consistent tile classes (`.premium-tile` etc.).
   * Remove older `.neural-card` markup or update to the new structure expected by the JS module.

4. **Marquees**

   * Single/double marquee DOM is now JS‑injected, so HTML shouldn’t contain old hardcoded `<section class="single-marquee">` or `<section class="double-marquee">`.
   * Search and remove any leftover markup of that type, leaving only the target slot containers (`#innovation-marquee-slot`).

5. **Parallax**

   * Ensure all sections that need parallax have:

     * `.parallax-section` + appropriate `data-parallax-theme` values (`lines`, `mesh`, `waves`, `circuit`, `book`).
   * Remove any old/unused parallax-related classes from HTML that are no longer referenced in CSS/JS.

6. **FAQ, stats, cards**

   * Confirm class naming:

     * Stats use `.stats` and `.stat`.
     * FAQ uses `.faq-section`, `.faq-list`, `.faq-item`.
     * Cards adhere to `.neon-card` plus type modifiers.

7. **Inline styles**

   * Remove `<style>` tags in HTML once their contents are migrated to `src/css/pages/*.css`.
   * Ensure no inline `style=""` attributes remain for layout/spacing if those concerns are now in CSS modules (only allow them if absolutely necessary).

8. **Automated check**

   * After updates, run global search for:

     * Old unused selector names from 6.2.
     * Old CSS/JS filenames.
   * The search should return zero results.

---

## 6. Migration sequencing & rollout strategy (single full‑run refactor)

Below is the **linear sequence** Codex should follow, step by step, in one continuous session.

### Step 1 – Environment & capability scan

* Do Section 2:

  * Confirm repo clean.
  * Snapshot file list.
  * Discover tests/build/lint commands.
  * Confirm list of unused files/selectors (6.1–6.3).

### Step 2 – Create new `src/css` and `src/js` structure

* Create directories:

  * `src/css/base`, `src/css/components`, `src/css/features`, `src/css/pages`.
  * `src/js`.
* Create empty files:

  * All modules listed in Sections 3.1 and 4.1.

**Condition to proceed**: directory tree exists and is committed to memory, no naming typos.

### Step 3 – Migrate base CSS (variables, typography, layout)

* Populate:

  * `variables.css`, `typography.css`, `layout.css` as per 3.1.1–3.1.3.
* During migration:

  * Do **not** copy unused selectors from 6.2.
* Run optional CSS lint if available.

**Condition**: base styles fully moved; old files still exist but missing just the migrated blocks.

### Step 4 – Migrate components CSS

* For each component module:

  * `header.css`, `footer.css`, `hero.css`, `cards.css`, `buttons.css`, `stats.css`, `faq.css`, `cookie-banner.css`:

    * Move rules from `styles.css`, `custom.css`, `custom-styles.css`, `services.css`, `mobile.css`, inline styles, etc.
* Respect 3.4:

  * Consolidate duplicates into canonical modules.
* After each component:

  * Run a quick search to ensure no stray definitions for that concern remain in old CSS.

**Condition**: All component styling is present in `src/css/components`; duplicates are removed or scheduled for removal.

### Step 5 – Migrate features CSS (parallax, gallery, marquee, lightbox)

* Populate:

  * `parallax.css`, `gallery.css`, `marquee.css`, `lightbox.css`.
* Move relevant rules from `parallax-fix.css`, `premium-gallery.css`, `marquee-single.css`, `marquee-double.css`.
* Deduplicate lightbox CSS as per 3.4.

**Condition**: parallax & gallery & marquee behaviors are fully represented in new modules.

### Step 6 – Migrate page‑specific CSS

* For each page (`home`, `services`, `about`, `book`, `contact`, `estate-agents`):

  * Move inline `<style>` content into corresponding `pages/*.css` file.
  * Adjust selectors to integrate with component styles (e.g. use `.section` wrappers appropriately).
* After each page:

  * Remove its now‑redundant inline `<style>` block(s).

**Condition**: all inline page styles gone; all page styles exist in `pages/*.css`.

### Step 7 – Build/concatenate CSS into new `assets/css/styles.css`

* Decide build route:

  * If a CSS build tool or script exists (e.g. a Node script like `build-css.js`), update it so that it concatenates or processes:

    * `src/css/base/*.css`
    * `src/css/components/*.css`
    * `src/css/features/*.css`
    * `src/css/pages/*.css`
  * If no tool exists, create a simple build step (or manually concatenate in an ordered manner) to produce `assets/css/styles.css`.
* Ensure:

  * All CSS from new modules is included.
  * Old CSS files (`custom.css`, `custom-styles.css`, `mobile.css`, `services.css`, `hero-base.css`, `parallax-fix.css`, `premium-gallery.css`, `marquee-single.css`, `marquee-double.css`, `icons.css`) are no longer referenced or required.

**Condition**: new built `assets/css/styles.css` exists and contains all expected rules.

### Step 8 – Remove unused CSS files (6.1) and legacy CSS assets

* Verify (via search) that the unused CSS files from 6.1 and any now‑obsolete CSS assets are not referenced.
* Delete:

  * `assets/css/neural-grid.css`
  * `assets/css/home-services-fix.css`
  * `assets/css/footer.css`
  * Any of the legacy style assets superseded by the new bundle (except possibly build scripts).
* Run CSS lint/build command if available.

**Condition**: Only the new `assets/css/styles.css` (plus any necessary external/third‑party CSS files) remain as local CSS entrypoints.

### Step 9 – Migrate JS to `src/js/*`

* Create new modules per 4.1.
* Extract behaviors from `assets/js/script.js`, `hero-shader.js`, `magnetic-buttons.js`, `marquee-single.js`, `marquee-double.js`, `premium-gallery.js`, `cookie-consent.js`, inline scripts, into appropriate `src/js` modules.
* Implement `src/js/app.js` to orchestrate initialization as per 4.2.11.

**Condition**: All features formerly handled by scattered scripts are present in `src/js` modules and wired through `app.js`.

### Step 10 – Build/concatenate JS into `assets/js/app.js`

* If build tooling exists (e.g. bundler or simple concatenation):

  * Use it to build a single `assets/js/app.js` from the new `src/js` modules.
* Ensure:

  * `app.js` includes all needed functionality (hero shader, cookie consent, nav, parallax, marquee, gallery, stats, scroll reveal, contact form).
* Run JS lint/tests if available.

**Condition**: `assets/js/app.js` exists and appears syntactically valid.

### Step 11 – Update HTML to use new CSS/JS

* For each HTML file:

  * Update `<link>` tags to reference only `assets/css/styles.css` plus external CSS (fonts/Calendly).
  * Update `<script>` tags to use only `assets/js/app.js` (plus Calendly on `book.html`).
  * Remove inline `<style>` tags that were migrated.
  * Remove inline scripts, replaced by `contact-form.js` logic within `app.js`.
* Apply class/ID/data attribute updates according to Section 5.3.

**Condition**: HTML points only to new entrypoints and has no references to legacy CSS/JS names.

### Step 12 – Remove legacy JS files

* Verify no HTML/JS references remain to old JS filenames.
* Delete:

  * `assets/js/script.js`
  * `assets/js/hero-shader.js`
  * `assets/js/cookie-consent.js`
  * `assets/js/magnetic-buttons.js`
  * `assets/js/marquee-single.js`
  * `assets/js/marquee-double.js`
  * `assets/js/premium-gallery.js`
  * `assets/js/neural-grid.js` (unused).
* Keep build-related Node scripts as needed.

**Condition**: Only `assets/js/app.js` (and non-local external scripts) remain as the app’s JS.

### Step 13 – Automated validation checks

* Run all applicable commands discovered in Section 2:

  * **Build** (if defined).
  * **Tests** (if defined).
  * **Linters/formatters** (if defined).
* Perform repo‑wide searches for:

  * Old CSS filenames.
  * Old JS filenames.
  * Unused selector names from 6.2.
* Fix any breakages discovered by these checks.

**Condition**: All automated checks pass; searches for legacy names return zero hits.

### Step 14 – Hand off to human validation

* Provide a summary (implicitly via diff) suitable for human review.
* Human reviewers then:

  * Run browser tests, check key flows, animations, and visual layouts.
  * Confirm parity with previous behavior.

---

## 7. Validation & regression‑checking

### 7.1 Automated validation by Codex

Codex can run commands, tests, linters, and static analysis within its cloud environment. ([OpenAI][2])

#### Final validation phase

After all refactor steps (up to Step 13) are complete:

1. **Run test/build commands**

   * If `npm test` / `npm run test` exists, run it and ensure it passes.
   * If `npm run build` or similar exists, run it and ensure it completes successfully.
   * If there is a static site generator or bundler, ensure its build passes.

2. **Run linters/formatters**

   * If available:

     * Run JS linter (e.g. `npm run lint`, `eslint`) on `src/js` and `assets/js`.
     * Run CSS linter (e.g. `stylelint`) on `src/css` and `assets/css/styles.css`.
     * Run HTML linter if any is configured (optional).

3. **Search for legacy references**

   * Use search tool (`grep`, `rg`, `git grep`) to verify:

     * No references to deleted CSS files (`neural-grid.css`, `home-services-fix.css`, `footer.css`, old asset CSS names) remain.
     * No references to deleted JS files remain.
     * No references to unused selectors from 6.2 remain.
   * Confirm all `<link>` tags reference only:

     * New `assets/css/styles.css` and external CSS.
   * Confirm all `<script>` tags reference only:

     * New `assets/js/app.js` and external scripts like Calendly.

4. **Structural code inspection**

   * Programmatically check that:

     * Each HTML page includes `<header class="site-header">`, hero section, main `.section` blocks, and `footer.site-footer` as expected.
     * All `.parallax-section` sections have a valid `data-parallax-theme` attribute.
     * The innovation gallery page contains `#neural-grid`.
     * The contact page has `#contact-form` and `#contact-status`.
     * The cookie banner has `#cookie-banner`.
   * These checks are done via text/DOM inspection (parsing HTML) rather than rendering in a browser.

5. **JS/CSS compilation sanity**

   * If no bundler exists, run simple syntax checks:

     * For JS: run a Node syntax check or linter.
     * For CSS: run a CSS parser or linter.

#### Intermediate validation checkpoints

At key phases:

* After CSS migration (Step 8):

  * Run CSS lint/build.
  * Search for references to removed CSS files.

* After JS migration (Step 10):

  * Run JS lint/tests.
  * Search for references to removed JS files.

* After HTML updates (Step 11):

  * Search for old filenames and removed selectors.

### 7.2 Human validation (post‑refactor)

Only after Codex’s refactor and automated checks are complete, **humans** should:

1. **Visual inspection**

   * Open each page (`index`, `about`, `services`, `book`, `contact`, `estate-agents`, `privacy-policy`) in browsers (desktop + mobile/responsive).
   * Confirm:

     * Hero background, parallax, and text look correct.
     * Header/nav, services overlay, and header indicator behave correctly at all viewport sizes.
     * Stats, FAQ, cards, pricing, and CTAs render and animate as before.
     * Innovation gallery and marquee(s) function correctly and lightbox works.
     * Cookie banner appears and behaves correctly.
     * Calendly booking section works and is styled correctly.
     * Contact form sends successfully (or at least fails gracefully in a controlled environment).

2. **Console & network checks**

   * Ensure there are no JS errors in browser devtools.
   * Confirm no 404s for CSS/JS assets.

3. **Accessibility & UX spot‑checks**

   * Verify header and services overlay maintain ARIA attributes.
   * Check keyboard navigation and focus states for menus and buttons.

---

## 8. Final checklist

Codex can treat this as the final self‑check; humans can use it as a quick sign‑off list.

### 8.1 Files that should exist in final structure

**CSS source (under `src/css/`)**

* `src/css/base/variables.css`
* `src/css/base/typography.css`
* `src/css/base/layout.css`
* `src/css/components/header.css`
* `src/css/components/footer.css`
* `src/css/components/hero.css`
* `src/css/components/cards.css`
* `src/css/components/buttons.css`
* `src/css/components/stats.css`
* `src/css/components/faq.css`
* `src/css/components/cookie-banner.css`
* `src/css/features/parallax.css`
* `src/css/features/gallery.css`
* `src/css/features/marquee.css`
* `src/css/features/lightbox.css`
* `src/css/pages/home.css`
* `src/css/pages/services.css`
* `src/css/pages/about.css`
* `src/css/pages/book.css`
* `src/css/pages/contact.css`
* `src/css/pages/estate-agents.css`

**CSS built assets**

* `assets/css/styles.css`
  (Main site CSS; any other local CSS assets should be deliberate and minimal.)

**JS source (under `src/js/`)**

* `src/js/header-nav.js`
* `src/js/scroll-reveal.js`
* `src/js/stats.js`
* `src/js/parallax.js`
* `src/js/hero-shader.js`
* `src/js/magnetic-buttons.js`
* `src/js/marquee.js`
* `src/js/gallery.js`
* `src/js/cookie-consent.js`
* `src/js/contact-form.js`
* `src/js/app.js`

**JS built assets**

* `assets/js/app.js`

*(Build scripts, Node helpers like `build-css.js`, and Netlify functions (`netlify/functions/send-email.js`) also remain as part of the toolchain, not front‑end assets.)*

---

### 8.2 Important classes/IDs renamed or consolidated

Group by concern:

* **Buttons**

  * All clickable CTAs use `.btn` plus variants (`.btn-primary`, `.btn-secondary`).
  * Any old duplicate button classes (e.g. `.btn-main`, other synonyms) removed from HTML, CSS, and JS.

* **Footer**

  * Footer uses `.site-footer`, `.footer-container`, `.footer-brand`, `.footer-links`, `.footer-column`, `.social-icons`.
  * Duplicate/legacy footer classes removed.

* **Cards**

  * All cards use `.neon-card` plus a specific modifier: `.feature-card`, `.pricing-card`, `.value-card`, `.proof-card`, `.cta-card`, `.service-image`, `.service-content`, `.contact-form-card`, `.contact-details`, `.dark-card`, `.gallery-card`.
  * No old, unused card variants from 6.2 remain.

* **Parallax**

  * Sections use `.parallax-section` with `data-parallax-theme` set to `lines`, `mesh`, `waves`, `circuit`, or `book`.
  * Old unused parallax classes (like `.parallax-layer` from 6.2) are gone.

* **Gallery / Marquee / Lightbox**

  * Gallery: `#neural-grid`, `.premium-tile`, `.tile-inner`, `.tile-front`, `.tile-back`, `.tile-caption`.
  * Marquee: `.single-marquee`, `.double-marquee`, `.marquee-track`, `.marquee-img`.
  * Lightbox: `.premium-lightbox`, `.lightbox-img`, `.lightbox-caption`, `.lightbox-close`.
  * Duplicated lightbox definitions across CSS files consolidated into `features/lightbox.css`.

* **Stats**

  * `.stats`, `.stat`, `.stat-icon`, `.number`, `.label` consistent across pages.

* **FAQ**

  * `.faq-section`, `.faq-list`, `.faq-item`, `.faq-body`.

* **Header / nav / overlay**

  * `.site-header`, `.header-inner`, `.nav-toggle`, `.services-overlay`, `.services-overlay__panel`, `.services-overlay__header`, `.services-overlay__back`, `.services-overlay__grid`, `.service-pill`, `#header-indicator`.

* **Cookie banner**

  * `#cookie-banner`, `.cookie-banner`, `.cookie-buttons`, `.cookie-link`.

Any selectors listed as unused in **6.2** (e.g. `.about-hero`, `.services-hero`, `.bg-city`, `.menu-toggle`, `.no-card`, `.check-icon`, stray ID‑like color selectors) should no longer exist.

---

### 8.3 Legacy files and patterns that must no longer exist

* **CSS**:

  * `assets/css/neural-grid.css`
  * `assets/css/home-services-fix.css`
  * `assets/css/footer.css`
  * Other pre‑refactor CSS assets that have been merged into `styles.css`:

    * `custom.css`, `custom-styles.css`, `mobile.css`, `services.css`, `hero-base.css`, `parallax-fix.css`, `premium-gallery.css`, `marquee-single.css`, `marquee-double.css`, `icons.css` (unless intentionally left separate with new mapping).

* **JS**:

  * `assets/js/script.js`
  * `assets/js/hero-shader.js`
  * `assets/js/cookie-consent.js`
  * `assets/js/magnetic-buttons.js`
  * `assets/js/marquee-single.js`
  * `assets/js/marquee-double.js`
  * `assets/js/premium-gallery.js`
  * `assets/js/neural-grid.js`
  * Inline contact form script in `contact.html` (and any other legacy inline scripts not explicitly preserved).

* **Selectors**:

  * Unused selectors listed in **6.2** should not appear anywhere in CSS/HTML/JS.

---

### 8.4 Automated checks that Codex should have run

* Capability scan:

  * Identified build/test/lint/format commands.
* After CSS migration:

  * CSS lints/builds, if available.
  * Searches for old CSS filenames and unused selectors.
* After JS migration:

  * JS lints/tests, if available.
  * Searches for old JS filenames.
* After HTML updates:

  * Searches for old CSS/JS filenames.
  * Searches for removed selectors.
* Final phase:

  * All build/test scripts pass.
  * No references remain to deleted CSS/JS files or unused selectors.
  * HTML structure is consistent and classes align with new CSS/JS modules.

---

### 8.5 Human review checklist

For humans to confirm after Codex finishes:

* **Visual & behavioral parity**

  * All pages render correctly.
  * Nav/menus/overlays behave correctly on desktop and mobile.
  * Parallax, hero shader, scroll reveal, stats counters, marquees, galleries, magnetic buttons all behave as expected.
  * Cookie banner and contact form work properly.
  * Calendly embed displays correctly.

* **No console errors**

  * Open devtools on each page, reload, confirm no JS errors or missing asset errors.

* **No broken links**

  * Check all CTAs and internal anchor links.

* **Cross‑device**

  * Spot‑check responsiveness via devtools or actual devices.

If Codex follows this plan step by step, the site will be fully migrated into the structured architecture from **7.3**, all unused/duplicate CSS and legacy JS from **6.1–6.3** will be removed, and the HTML will be cleanly aligned to the new CSS/JS modules, with both automated and human validation covering functionality and visual integrity.

[1]: https://developers.openai.com/codex/cloud/environments/?utm_source=chatgpt.com "Cloud environments"
[2]: https://openai.com/index/introducing-codex/?utm_source=chatgpt.com "Introducing Codex"
