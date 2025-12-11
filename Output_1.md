I’ve gone through the entire repo and mapped how the HTML, CSS, and JS work together. I’ll keep things structured and cross‑referenced so you can follow any visual element back to specific files and selectors.

---

## 1. Repository Overview

### 1.1 HTML pages

* `index.html` – Home / main marketing & pricing page.
* `about.html` – About + values + story.
* `services.html` – Services overview + “Innovation Gallery”.
* `book.html` – Discovery call / Calendly booking.
* `contact.html` – Contact form + details + social.
* `privacy-policy.html` – Legal content.
* `niches/estate-agents.html` – Niche landing page for estate agents.

All pages share:

* Cookie banner (`#cookie-banner`).
* Header (`header.site-header`) + services overlay (`.services-overlay`).
* Hero (`section.hero.title-band`).
* Parallax sections (`.section.bg-… .parallax-section`).
* Footer (`footer.site-footer`).

---

### 1.2 CSS files (role + where used)

**Global / base**

| File                    | Role                                                                                                                                                                                                      | Used on                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `assets/css/styles.css` | Main design system: typography, colors, variables, `.section`, `.container`, `.hero`, `.neon-card`, `.features`, `.pricing-grid`, `.faq-section`, footer, etc.                                            | All pages                                                    |
| `assets/css/custom.css` | Enhances hero & parallax behavior; tweaks `.hero`, `.section`, `.neon-card`, cookie banner, header sizing; respects `prefers-reduced-motion`. Injected via JS as well as linked on `privacy-policy.html`. | Effectively all pages (via `script.js`’s `ensureStylesheet`) |
| `assets/css/mobile.css` | Global responsive overrides (`max-width: 768px`): stacks grids, adjusts header, hero, `.features`, `.packages-grid`, `.pricing-grid`, `.contact-grid`, `.service-row`, etc.                               | All main pages (linked + ensured by JS)                      |
| `assets/css/icons.css`  | Font Awesome base & custom icon list styles (`.icon-list` etc.), minor utility tweaks (including some footer/service overrides).                                                                          | All main pages                                               |

**Hero & parallax**

| File                          | Role                                                                                                                                                                                            | Used on                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `assets/css/hero-base.css`    | Hero layout and layering: `.hero`, `.title-band`, `.hero-media`, `#hero-shader-canvas`, content alignment.                                                                                      | All pages                                                                           |
| `assets/css/parallax-fix.css` | Background/parallax scaffolding: `.parallax-section`, `.parallax-mobile-stage`, `.parallax-mobile-layer`, `.parallax-mobile-active`, `.parallax-ready`, `.webp`, `.animate`/`.visible` support. | Pages with `parallax-section` (home, about, contact, services, book, estate-agents) |

**Home / services specific**

| File                             | Role                                                                                                                                                                          | Used on                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `assets/css/custom-styles.css`   | Home “Our Services” cards and bullets: `.packages-grid .bullet`, `.price-block`, `.price-label`, `.proof-disclaimer`, extra alignment tweaks.                                 | `index.html`, `services.html` |
| `assets/css/services.css`        | Services page layout: `.page-services`, `.service-row`, `.service-image`, `.service-content`, `.brand-gradient` tweaks, some neon variants.                                   | `services.html`               |
| `assets/css/premium-gallery.css` | Innovation gallery mosaic: `#neural-grid` as a multi-column tile layout, `.premium-tile`, `.tile-inner`, `.tile-front`, `.tile-back`, hover tilt, captions, lightbox helpers. | `services.html`               |

**Marquees**

| File                            | Role                                                                                                                                                                              | Used on                                                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `assets/css/marquee-single.css` | Single image marquee & shared lightbox styles: `.single-marquee`, `.marquee-track`, `.marquee-img`, `.premium-lightbox`, `.lightbox-img`, `.lightbox-caption`, `.lightbox-close`. | `index.html`, `about.html`, `contact.html`, `book.html` (not `services`, not `privacy`, not `estate-agents`) |
| `assets/css/marquee-double.css` | Double-row marquee styling (two lanes with opposing scroll) and **another copy** of the lightbox styles.                                                                          | `services.html`                                                                                              |

**Legacy / mostly unused CSS**

| File                               | Role                                                                                                                   | Runtime status                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `assets/css/neural-grid.css`       | Older version of the innovation gallery: `.neural-grid`, `.neural-card`, `.neural-overlay`, glitch keyframe animation. | **Not linked** by any HTML; replaced by `premium-gallery.css`.  |
| `assets/css/home-services-fix.css` | Earlier attempts to fix home services grid & bullets.                                                                  | **Not linked** anywhere now; superseded by `custom-styles.css`. |
| `assets/css/footer.css`            | Standalone footer styling (`.site-footer`, `.footer-container`, `.footer-links`, `.social-icons`).                     | **Not linked**; footer styles live in `styles.css`.             |

> When refactoring, you can treat `neural-grid.css`, `home-services-fix.css`, and `footer.css` as legacy / unused unless your build pipeline injects them elsewhere.

---

### 1.3 JavaScript files (role + where used)

**Core / global**

| File                          | Role                                                                                                                                                                                                                                                                | Used on   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `assets/js/script.js`         | Big monolithic frontend script: header/nav behavior, services dropdown & overlay, header “indicator bar”, scroll reveal (`.animate` → `.visible`), stats counters, parallax backgrounds, dynamic CSS loading (`custom.css` / `mobile.css`), minor gallery handling. | All pages |
| `assets/js/hero-shader.js`    | WebGL canvas shader for the hero (`#hero-shader-canvas`): compiles shaders, animates gradient-like background based on a “theme” (lines, mesh, waves, circuit, book). Falls back if WebGL or motion is disabled.                                                    | All pages |
| `assets/js/cookie-consent.js` | Handles `#cookie-banner` show / hide based on localStorage, manages “Accept all” & “Manage settings” buttons, toggles classes on body.                                                                                                                              | All pages |

**Feature modules**

| File                            | Role                                                                                                                                                                                                                | Used on                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `assets/js/magnetic-buttons.js` | “Magnetic” hover for `.btn` elements: tracks pointer position, sets `transform: translate` on hover, eases back on `mouseleave`. Disabled on touch devices.                                                         | `index.html`, `about.html`, `contact.html`, `services.html` |
| `assets/js/marquee-single.js`   | Builds a **single-row marquee** before the footer for non-services pages; uses `MARQUEE_IMAGES` array of image paths; clones the list for seamless scroll; wires up image clicks to the shared `.premium-lightbox`. | `index.html`, `about.html`, `book.html`, `contact.html`     |
| `assets/js/marquee-double.js`   | Builds a **double marquee** on the services page: two rows with opposing scroll; anchored at `#innovation-marquee-slot`; also ensures the shared `.premium-lightbox` exists and reuses the same image set.          | `services.html`                                             |
| `assets/js/premium-gallery.js`  | Rebuilds the `#neural-grid` container into a mosaic gallery (`.premium-tile` etc.), assigns hover & click handlers, and connects tiles to `.premium-lightbox` for zoomed view + caption.                            | `services.html`                                             |

**Legacy / build / backend**

| File                              | Role                                                                                                                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets/js/neural-grid.js`        | Animated “neural grid” gallery: scroll-based activation, glitch animation, dynamic classes on `.neural-card`. **Not referenced by any page**; effectively unused. |
| `build-css.js`                    | Node script for concatenating/minifying CSS; build‑time only.                                                                                                     |
| `scripts/optimize-images.js`      | Node + Sharp image optimizer to convert images to WebP at build time.                                                                                             |
| `netlify/functions/send-email.js` | Serverless Netlify function used by the contact form (POST JSON, forwards to Resend via HTTPS).                                                                   |

---

## 2. Per-Page Mapping (HTML → CSS/JS)

For brevity, I’ll list local CSS/JS and note dynamic CSS injection. Fonts and Font Awesome CDN links are omitted.

### Page: `index.html` (Home)

**Linked CSS**

* `assets/css/styles.css` – Main layout, cards, typography.
* `assets/css/custom-styles.css` – Home “Our Services” card & bullet alignment, `.price-block`, `.proof-disclaimer`.
* `assets/css/parallax-fix.css` – Parallax background scaffolding.
* `assets/css/mobile.css` – Responsive adjustments.
* `assets/css/icons.css` – Icons + some list/CTA tweaks.
* `assets/css/marquee-single.css` – Single marquee & lightbox styles.
* `assets/css/hero-base.css` – Hero layout.

**JS**

* `assets/js/script.js` – Header, services overlay, scroll reveal, stats, parallax, dynamic CSS.
* `assets/js/cookie-consent.js` – Cookie banner logic.
* `assets/js/hero-shader.js` – Hero WebGL effect.
* `assets/js/magnetic-buttons.js` – Magnetic CTA buttons.
* `assets/js/marquee-single.js` – Single marquee + lightbox.

**Inline styles/scripts**

* `<style>` block 0: hero stacking context, cookie banner tweaks, global section spacing adjustments.
* `<style>` block 1: `#never-miss-hero` / `#stats` / `.packages-grid` / `.stats` local layout & spacing overrides (stats grid, service cards, bullets, pricing grid spacing).
* No inline `<script>` here.

---

### Page: `about.html`

**Linked CSS**

* `assets/css/styles.css`
* `assets/css/parallax-fix.css`
* `assets/css/mobile.css`
* `assets/css/icons.css`
* `assets/css/hero-base.css`
* `assets/css/marquee-single.css`

**JS**

* `assets/js/script.js`
* `assets/js/cookie-consent.js`
* `assets/js/hero-shader.js`
* `assets/js/magnetic-buttons.js`
* `assets/js/marquee-single.js`

**Inline styles**

* Single `<style>` block:

  * `.section.bg-mesh` spacing.
  * `.service-row`, `.service-image`, `.service-content` layout for “Our Mission”.
  * `.values` + `.value-card` grid.
  * `.stats` / `.stat` local layout (similar to home, but tuned).
  * `.what-drives-us`, `.drives-grid`, `.gallery-card` “collage” layout.

---

### Page: `services.html`

**Linked CSS**

* `assets/css/styles.css`
* `assets/css/custom-styles.css`
* `assets/css/services.css`
* `assets/css/parallax-fix.css`
* `assets/css/mobile.css`
* `assets/css/icons.css` (linked twice, but harmless)
* `assets/css/premium-gallery.css`
* `assets/css/marquee-double.css`
* `assets/css/hero-base.css`

**JS**

* `assets/js/script.js`
* `assets/js/cookie-consent.js`
* `assets/js/hero-shader.js`
* `assets/js/magnetic-buttons.js`
* `assets/js/premium-gallery.js`
* `assets/js/marquee-double.js`

**Inline styles**

* One `<style>` block for:

  * `.services-section` spacing.
  * `.service-row`, `.service-image`, `.service-content` fine-tuning.
  * `#innovation-gallery` heading + copy alignment.

---

### Page: `book.html`

**Linked CSS**

* `assets/css/styles.css`
* `assets/css/parallax-fix.css`
* `assets/css/mobile.css`
* `assets/css/icons.css`
* (Calendly’s own CSS via `https://assets.calendly.com/assets/external/widget.css`)
* `assets/css/marquee-single.css`
* `assets/css/hero-base.css`

**JS**

* `assets/js/script.js`
* `assets/js/cookie-consent.js`
* `assets/js/hero-shader.js`
* `assets/js/marquee-single.js`
* External: `https://assets.calendly.com/assets/external/widget.js` (Calendly inline widget).

**Inline styles**

* `<style>` block 0: `section.discovery-call-section` layout, `.discovery-call-content`, `.widget`, `.info`, responsive stacking, spacing between bullets & CTA.
* `<style>` block 1: minor adjustments for hero spacing and text widths.

---

### Page: `contact.html`

**Linked CSS**

* `assets/css/styles.css`
* `assets/css/parallax-fix.css`
* `assets/css/mobile.css`
* `assets/css/icons.css`
* `assets/css/hero-base.css`
* `assets/css/marquee-single.css`

**JS**

* `assets/js/script.js`
* `assets/js/cookie-consent.js`
* `assets/js/hero-shader.js`
* `assets/js/magnetic-buttons.js`
* `assets/js/marquee-single.js`

**Inline styles**

* `<style>` block 0:

  * `.section.bg-waves` spacing.
  * `.contact-grid`, `.contact-form-card`, `.contact-details` layout.
  * Form input styling, validation error/success text.
* `<style>` block 1:

  * `.contact-social-callout`, `.contact-social-links`, `.contact-social-link`, handles social link card at bottom.

**Inline script**

Handles the form:

* Hooks `#contact-form`, `#contact-status`.
* On submit:

  * `preventDefault`, sets status text to “Sending…”.
  * `fetch('/.netlify/functions/send-email')` with JSON `{ name, email, message }`.
  * On success: show a “Thanks” message, reset form.
  * On error: show friendly error.

---

### Page: `privacy-policy.html`

**Linked CSS**

* `assets/css/styles.css`
* `assets/css/custom.css`
* `assets/css/mobile.css`
* `assets/css/icons.css`
* `assets/css/hero-base.css`

**JS**

* `assets/js/script.js`
* `assets/js/cookie-consent.js`
* `assets/js/hero-shader.js`

**Inline styles**

* One `<style>` block:

  * `.section.bg-mesh` and `.neon-card` typography, line-width improvements for long legal text.

---

### Page: `niches/estate-agents.html`

**Linked CSS**

* `../assets/css/styles.css`
* `../assets/css/parallax-fix.css`
* `../assets/css/mobile.css`
* `../assets/css/icons.css`
* `../assets/css/hero-base.css`

**JS**

* `../assets/js/script.js`
* `../assets/js/cookie-consent.js`
* `../assets/js/hero-shader.js`
* `../assets/js/magnetic-buttons.js`

**Inline styles**

* One `<style>` block:

  * Estate-agent specific layout: `.compact-section`, `.dark-card`, `.pricing` card, local stats grid, etc.

---

## 3. Visual Elements & Features by Page

I’ll first describe **global components** (shared across pages) and then page‑specific sections.

### 3.1 Global components (visible on most pages)

#### Element – Cookie banner

* **Where it appears**: Small fixed bar at bottom: “We use cookies…” with Accept/Manage buttons.
* **HTML hooks**:

  * `div#cookie-banner.cookie-banner`
  * `.cookie-buttons`, `.cookie-link`, `.btn.btn-primary`, `.btn.btn-secondary`.

**CSS**

| Aspect           | File(s)                    | Selector(s)                         | What it does                                                                                                                    |
| ---------------- | -------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Layout & spacing | `styles.css`, `custom.css` | `.cookie-banner`, `.cookie-buttons` | Fixed to bottom, full-width, padding around text & CTA group, multi-column layout on desktop, stacked on mobile.                |
| Visual style     | `styles.css`               | `.cookie-banner`, `.cookie-link`    | Dark glassmorphism background, border radius, subtle border; link color matches accent blue; button styling reused from `.btn`. |
| Responsive       | `mobile.css`               | `.cookie-banner`                    | Reduces padding, stacks text over buttons on small screens.                                                                     |

**JS**

| File(s)             | Functions / listeners                                                                      | Behavior                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cookie-consent.js` | On DOMContentLoaded: checks `localStorage.cookieConsent`; click handlers on Accept/Manage. | Shows banner until consent stored; hides and persists choice; toggles `cookie-consent-accepted` class on `<body>` for more advanced tracking if needed. |

---

#### Element – Header & Services navigation

* **Where**: Top bar with logo, main nav links, “Services” dropdown and mobile hamburger. Also a slim gradient bar (#header-indicator) that appears on scroll.

* **HTML hooks**:

  * `header.site-header`
  * `.header-inner`, `.logo .site-logo`
  * `nav > ul > li`, `li.nav-dropdown`
  * `button.services-toggle`, `.services-menu`, `.service-link`
  * `div.nav-toggle` (hamburger)
  * `div.services-overlay` and descendants:

    * `.services-overlay__header`, `.services-overlay__back`
    * `.services-overlay__grid`, `.service-pill`, `.service-link`

**CSS**

| Aspect               | File(s)                                    | Selector(s)                                                                  | What it does                                                                                                |
| -------------------- | ------------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Layout & spacing     | `styles.css`                               | `.site-header`, `.header-inner`, `nav ul`, `.nav-dropdown`, `.services-menu` | Header fixed at top, horizontal flex; spacing between logo, nav, CTA; dropdown positioned below “Services”. |
| Mobile nav           | `mobile.css`                               | `.site-header`, `.nav-toggle`, `nav ul`                                      | Hides desktop nav, shows hamburger; makes nav a slide‑down panel; adjusts spacing for touch.                |
| Services overlay     | `styles.css`                               | `.services-overlay`, `.services-overlay__panel`, `.service-pill`             | Full-screen overlay grid of service categories; center alignment; card-like pills.                          |
| Header indicator bar | Inline `<style>` injected from `script.js` | `#header-indicator`, `#header-indicator .indicator-copy`                     | Slim gradient bar that sticks to top when header hides; hover/tap expansion, copy text styling.             |

**JS**

| File(s)     | Functions / listeners                                                                                                                          | Behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `script.js` | `openNavMenu`, `closeNavMenu`, `openServicesDropdown`, `closeServicesDropdown`, `openServicesOverlay`, `closeServicesOverlay`, scroll handlers | - Toggles `nav-toggle` active state & adds `nav-open`/`services-dropdown-open`/`services-overlay-active` classes on `<body>`.<br>- Prevents body scroll while mobile nav/overlay is open (sets `body.style.position = 'fixed'` and restores on close).<br>- Syncs dropdown vs overlay so only one is open.<br>- Toggles `aria-expanded` and `aria-hidden` on services dropdown & overlay for accessibility.<br>- Scroll handler hides header after scrolling down and shows the header indicator (#header-indicator); returns header on upward scroll. |

---

#### Element – Hero (all pages)

* **Where**: Top hero band on each page, with headline, subhead, buttons, and WebGL background.

* **HTML hooks**:

  * `section.hero.title-band`
  * `.container.hero-inner`, `.hero-copy`, `.hero-kicker`, `.tagline`, `.hero-actions`, `.hero-subtext`
  * `.hero-media` containing `<canvas id="hero-shader-canvas"></canvas>`
  * Body sometimes has page class: `page-book`, `page-services`.

**CSS**

| Aspect               | File(s)                          | Selector(s)                                                        | What it does                                                                                                                                                                                        |
| -------------------- | -------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout & spacing     | `styles.css`, `hero-base.css`    | `.hero`, `.title-band`, `.hero-inner`, `.hero-copy`, `.hero-media` | Two-column layout on desktop (copy + visual), large vertical padding, central alignment; hero content constrained by `.container`.                                                                  |
| Visual style         | `styles.css`                     | `.hero`, `.hero-kicker`, `.tagline`, `.hero-subtext`               | Bold typography, gradient text, main color palette; baseline hero background color; CTAs via `.btn`.                                                                                                |
| Parallax & transform | `custom.css`, `parallax-fix.css` | `.hero`, `.hero.title-band`, `.parallax-section`                   | Sets `position: relative`, `transform-origin: center top`, `will-change` hints; ensures hero background works with parallax & WebGL; disables `background-attachment: fixed` for mobile/low-motion. |
| Responsive           | `mobile.css`                     | `.hero-inner`, `.hero-copy`, `.hero-media`                         | Stacks hero on narrow screens; reduces font sizes and paddings; ensures canvas fits width.                                                                                                          |

**JS**

| File(s)          | Functions / listeners                         | Behavior                                                                                                                                                                                                                                                                                                                                                             |
| ---------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero-shader.js` | main init function (runs on DOMContentLoaded) | - Gets `#hero-shader-canvas`, sets up WebGL context.<br>- Compiles vertex & fragment shaders to generate animated shader background using time & resolution uniforms.<br>- Chooses theme (lines/mesh/waves/circuit/book) from data attributes or fallback.<br>- Stops animation or falls back to static background if WebGL unsupported or `prefers-reduced-motion`. |
| `script.js`      | Parallax module                               | Treats hero as the first `.parallax-section` for background parallax on scroll.                                                                                                                                                                                                                                                                                      |

---

#### Element – Parallax background sections

* **Where**: Any `section.section` with `class="... parallax-section"` and `data-parallax-theme="lines|mesh|waves|circuit|book"`.

* **HTML hooks**:

  * `.section.bg-lines.animate.parallax-section` / `.bg-mesh` / `.bg-waves` / `.bg-circuit` / `.bg-lines.compact-section` etc.
  * `data-parallax-theme="lines" | "mesh" | "waves" | "circuit" | "book"`.

**CSS**

| Aspect               | File(s)                          | Selector(s)                                                                                      | What it does                                                                                                                 |
| -------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Base section spacing | `styles.css`                     | `.section`, `.section::before`, `.section::after`                                                | Vertical padding (`padding: 4rem 0`), inner overlay layering.                                                                |
| Backgrounds          | `styles.css`, `parallax-fix.css` | `.bg-lines`, `.bg-mesh`, `.bg-waves`, `.bg-circuit`, `.section.parallax-section`                 | Default background images & colors for each theme; ensures background is behind content overlays.                            |
| Mobile parallax      | `parallax-fix.css`               | `.parallax-mobile-stage`, `.parallax-mobile-layer`, `.parallax-mobile-active`, `.parallax-ready` | Adds a fixed-position stage and layer used on mobile to emulate parallax backgrounds without `background-attachment: fixed`. |
| Motion toggling      | `parallax-fix.css`               | `.animate`, `.visible`, `.webp`                                                                  | Extra classes to support scroll reveal and WebP-specific backgrounds.                                                        |

**JS**

| File(s)     | Functions / listeners                                                  | Behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `script.js` | Parallax module: uses `document.querySelectorAll('.parallax-section')` | - For each section, reads `data-parallax-theme` and config (image-set URLs, colors).<br>- On desktop: uses `background-image: image-set(...)` and modifies `background-position` based on scroll.<br>- On mobile: creates `.parallax-mobile-stage` and `.parallax-mobile-layer` elements with computed `backgroundImage` and `backgroundColor`; uses `IntersectionObserver` and `scroll` to move backgrounds more slowly than content.<br>- Uses `matchMedia('(max-width: 768px)')` and `matchMedia('(prefers-reduced-motion: reduce)')` to disable parallax for mobile/low-motion users. |

---

#### Element – Scroll reveal (`.animate` → `.visible`)

* **Where**: Most main sections (`.section.bg-…`) have `animate`. Cards within may also rely on this.

* **HTML hooks**: elements with `class="... animate"` (sections, some rows).

**CSS**

| Aspect           | File(s)                                        | Selector(s)            | What it does                                                                                                                              |
| ---------------- | ---------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Hidden → visible | `styles.css`, `parallax-fix.css`, `mobile.css` | `.animate`, `.visible` | `.animate` default: slightly translated/transparent; `.visible` removes transform & sets opacity to 1 with smooth `transition/transform`. |

**JS**

| File(s)     | Functions / listeners                             | Behavior                                                                                                                                                                                                                                     |
| ----------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `script.js` | Scroll reveal module using `IntersectionObserver` | - Grabs all `.animate` elements.<br>- If `prefers-reduced-motion` or on tight mobile, immediately adds `.visible`.<br>- Otherwise, sets up observer with threshold; on first intersect, toggles `.visible` and stops observing that element. |

---

#### Element – Footer

* **Where**: Bottom section with logo, quick links, services, social icons, copyright.

* **HTML hooks**:

  * `footer.site-footer`
  * `.footer-container`
  * `.footer-brand`, `.footer-logo`, `.tagline`, `.mission`
  * `.footer-links`, `.footer-column`
  * `.social-icons` list of `<a>` icons
  * `.footer-bottom`

**CSS**

| Aspect           | File(s)                   | Selector(s)                                                                             | What it does                                                                                                         |
| ---------------- | ------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Layout & spacing | `styles.css`              | `.site-footer`, `.footer-container`, `.footer-brand`, `.footer-links`, `.footer-column` | Two/three-column layout; brand left, links/list center, social right; generous vertical padding.                     |
| Visual style     | `styles.css`, `icons.css` | `.site-footer`, `.footer-logo`, `.social-icons a`                                       | Dark background, subtle gradients, white text; social icons sized via Font Awesome; hover color/opacity adjustments. |
| Responsive       | `mobile.css`              | `.footer-container`, `.footer-links`                                                    | Stacks columns vertically on small screens; centers footer text.                                                     |

**JS**

* No specific JS; footer is static, apart from marquee integration (single/double marquees are inserted **just above** `<footer>` by the marquee scripts).

---

### 3.2 Page: `index.html` (Home)

#### Element – Hero (Home)

Same base hero as global; copy tuned to “AI Automation for SME operators”.

Additional:

* Buttons: `a.btn.btn-primary` (“Book your 30-min call”), `a.btn.btn-secondary` (“See services”).
* **Magnetic buttons** apply here (see Magnetic Buttons in deep-dive).

CSS & JS: as per hero + magnetic buttons.

---

#### Element – “Streamline. Optimize. Succeed.” feature cards

* **Where**: First section under hero, three cards highlighting outcomes.

* **HTML hooks**:

  * `section.section.bg-lines.animate.parallax-section`
  * `.features`
  * `.feature-card.neon-card`
  * Inside: `<i class="fa-…">`, `<h3>`, `<p>`.

**CSS**

| Aspect           | File(s)                    | Selector(s)                                | What it does                                                                                                                          |
| ---------------- | -------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Layout & spacing | `styles.css`               | `.features`, `.feature-card`               | `.features{display:flex;flex-wrap:wrap;gap:2rem;justify-content:center}`, cards flex 1 with max-width constraint for 3‑column layout. |
| Card base        | `styles.css`, `custom.css` | `.neon-card`                               | Card background gradient, border radius, border, box shadow, padding; subtle glow.                                                    |
| Typography       | `styles.css`               | `.feature-card h3`, `.feature-card p`      | Bold heading; medium body copy.                                                                                                       |
| Responsive       | `mobile.css`               | `.features`, `.feature-card`               | Stacks into single column on narrow screens; updates text size slightly.                                                              |
| Animations       | `styles.css`, `custom.css` | `.animate`, `.visible`, `.neon-card:hover` | Section fades/slides in on scroll; hover lifts card slightly via `transform` and `box-shadow`.                                        |

**JS**

| File(s)     | Functions / listeners                            | Behavior                                                                |
| ----------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| `script.js` | Scroll reveal (`.animate`), parallax backgrounds | Fades section in; moves background using `data-parallax-theme="lines"`. |

---

#### Element – Home stats (“Proof in numbers” style stats block inside main section)

* **Where**: In same `.section.bg-lines` block, a 4‑card stats grid.

* **HTML hooks**:

  * `div.stats`
  * `div.neon-card.stat`
  * Sub-elements: `div.stat-icon`, `div.number[data-target="…"]`, `div.label`.

**CSS**

| Aspect           | File(s)                      | Selector(s)                       | What it does                                                                                       |
| ---------------- | ---------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------- |
| Layout & spacing | Inline `<style>` (index)     | `.stats`, `.stat`                 | Defines CSS grid/flex for stats, gap between cards, min-width so they wrap gracefully.             |
| Icons & numbers  | `styles.css` (base) + inline | `.stat-icon`, `.number`, `.label` | Enlarges stat icon & number, aligns labels. Cards use `.neon-card` base styles for padding & glow. |
| Responsive       | `mobile.css`                 | `.stats`                          | Stacks stats into 2x2 or single column depending on width.                                         |

**JS**

| File(s)     | Functions / listeners | Behavior                                                                                                                                                                                                                                                |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `script.js` | Stats counter module  | Uses `IntersectionObserver` on `.stats` container; on first entry: counts numbers from 0 → `data-target` using `requestAnimationFrame`, with easing; respects `prefers-reduced-motion` by skipping animation and showing the final numbers immediately. |

---

#### Element – “Our Services” packages grid

* **Where**: “Our Services” heading: trio of big cards (“AI Consulting”, “Workflow Automation & Data”, “Content & Email Engine”).

* **HTML hooks**:

  * `.packages-grid`
  * Each card: `.feature-card.neon-card.card-ai-consulting` / `.card-automation` / `.card-systems`
  * Bullets: `<p class="bullet">` with `img src="assets/images/icons/check-green.svg"`.

**CSS**

| Aspect           | File(s)                           | Selector(s)                                            | What it does                                                                                                                                                                                        |
| ---------------- | --------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout & spacing | `styles.css`, `custom-styles.css` | `.packages-grid`, `.packages-grid .feature-card`       | `display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem` on desktop; `custom-styles.css` ensures consistent heights, pushes button to bottom via flex, sets min-height of bullet rows. |
| Bullets          | `custom-styles.css`               | `.packages-grid .bullet`, `.packages-grid .bullet img` | Aligns check icon & text using `display:flex;align-items:flex-start;gap:0.5rem;min-height` for row alignment across cards.                                                                          |
| Button alignment | `custom-styles.css`               | `.feature-card .btn`, `.feature-card .btn-primary`     | Adds `margin-top:auto` to CTA to pin them at bottom of card.                                                                                                                                        |
| Responsive       | `mobile.css`                      | `.packages-grid`, `.feature-card`                      | Collapses to 1 column; reduces gap spacing.                                                                                                                                                         |

**JS**

* No card-specific JS; section uses scroll reveal & parallax like other `.animate` sections.

---

#### Element – “Proof in numbers” (neon proof cards + disclaimer)

* **Where**: Under services grid; set of rectangular neon cards summarising evidence.

* **HTML hooks**:

  * `.proof-grid`
  * `.neon-card.proof-card`
  * `.proof-list` (statements), `.proof-disclaimer`.

**CSS**

| Aspect     | File(s)                           | Selector(s)                       | What it does                                                  |
| ---------- | --------------------------------- | --------------------------------- | ------------------------------------------------------------- |
| Layout     | `styles.css`, `custom-styles.css` | `.proof-grid`, `.proof-card`      | Grid layout with 2–3 cards per row; consistent card height.   |
| Typography | `styles.css`                      | `.proof-card h3`, `.proof-card p` | Titles + descriptive text.                                    |
| Disclaimer | `custom-styles.css`               | `.proof-disclaimer`               | Centers disclaimer under grid; sets max width and top margin. |

**JS**

* None beyond scroll reveal.

---

#### Element – Pricing grids

Two sections: main pricing plans (3 cards) and bolt-on add‑ons.

* **HTML hooks**:

  * `.pricing-grid`
  * `.pricing-card.neon-card`
  * Inside: `.price-block`, `.price-label`, `.price`, `.best-for`, `.price-note`, `<ul>`.

**CSS**

| Aspect        | File(s)                           | Selector(s)                           | What it does                                                                              |
| ------------- | --------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------- |
| Layout        | `styles.css`, `custom-styles.css` | `.pricing-grid`, `.pricing-card`      | `display:grid;gap:2rem`, 3 columns on desktop, etc.; cards use `.neon-card` for base.     |
| Price styling | `styles.css`, `custom-styles.css` | `.price-block`, `.price`, `.best-for` | Large numeric price, taglines, subtle label; color-coded highlight for “best value” plan. |
| Responsive    | `mobile.css`                      | `.pricing-grid`                       | Stacks into single column.                                                                |

**JS**

* None; static content with scroll reveal.

---

#### Element – Home FAQ section

* **Where**: “AI Automation Agency FAQs”.

* **HTML hooks**:

  * `.faq-section`
  * `.faq-list` containing `<details class="faq-item neon-card">` each with `<summary>` and `<div class="faq-body">`.

**CSS**

| Aspect              | File(s)                    | Selector(s)                              | What it does                                                                                                |
| ------------------- | -------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Layout              | `styles.css`               | `.faq-section`, `.faq-list`, `.faq-item` | Vertical stack within container; `.faq-item` inherits `.neon-card` look, but with summary/answer structure. |
| Interaction styling | `styles.css`, `mobile.css` | `.faq-item summary`, `.faq-item[open]`   | Summary row styled like clickable row; open state might change border or accent color.                      |

**JS**

* Fully native `<details>` interaction; no additional JS.

---

#### Element – CTA band (“Ready to streamline your operations?”)

* **Where**: Last `.section.brand-gradient.animate` above footer.

* **HTML hooks**:

  * `.section.brand-gradient.animate`
  * `.cta-card.neon-card`, `.section-title`, `.section-subtitle`, `.btn.btn-primary`.

**CSS**

| Aspect     | File(s)                    | Selector(s)                 | What it does                                         |
| ---------- | -------------------------- | --------------------------- | ---------------------------------------------------- |
| Background | `styles.css`               | `.brand-gradient`           | Bright gradient background; overlays for contrast.   |
| Card       | `styles.css`, `custom.css` | `.cta-card.neon-card`       | Centered card with extra glow and larger text sizes. |
| Responsive | `mobile.css`               | `.brand-gradient .cta-card` | Reduces padding and font sizes for mobile.           |

**JS**

* Scroll reveal + magnetic button on CTA.

---

### 3.3 Page: `about.html`

#### Element – About hero

Same hero structure; copy and CTA adjust.

CSS/JS: as global hero + parallax theme `data-parallax-theme="mesh"`.

---

#### Element – “Our mission” split layout

* **Where**: First content block after hero.

* **HTML hooks**:

  * `section.section.bg-mesh.animate.parallax-section`
  * `.service-row`
  * `.service-image.neon-card` (image/video placeholder card)
  * `.service-content.neon-card`

**CSS**

| Aspect     | File(s)                                | Selector(s)                                          | What it does                                                                     |
| ---------- | -------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| Layout     | Inline `<style>` (about), `styles.css` | `.service-row`, `.service-image`, `.service-content` | Horizontal two‑column layout; image & copy; gap between; cards align vertically. |
| Card style | `styles.css`, `custom.css`             | `.neon-card`, `.service-content`                     | Same neon card base; service copy gets header and bullet styling.                |
| Responsive | `mobile.css`                           | `.service-row`                                       | Stacks image below/above text on small screens.                                  |

**JS**

* Scroll reveal & parallax mesh background.

---

#### Element – “Values” cards

* **Where**: Section with heading “Our values”.

* **HTML hooks**:

  * `.values`
  * `.value-card.neon-card` containing icon, title, and description.

**CSS**

| Aspect       | File(s)                                | Selector(s)              | What it does                                                     |
| ------------ | -------------------------------------- | ------------------------ | ---------------------------------------------------------------- |
| Layout       | Inline `<style>` (about), `styles.css` | `.values`, `.value-card` | Grid/flex of 3–4 cards with consistent width; gap between cards. |
| Visual style | `styles.css`                           | `.value-card`            | Inherits neon card; might slightly tweak icon or heading.        |
| Responsive   | `mobile.css`                           | `.values`                | Moves to 1-2 column layout on smaller screens.                   |

**JS**

* Scroll reveal.

---

#### Element – About stats

Same pattern as home stats: `.stats` / `.stat` with inline CSS and JS counters from `script.js`.

---

#### Element – “What drives us” collage

* **Where**: Last big block on About; collage of smaller cards.

* **HTML hooks**:

  * `.what-drives-us`
  * `.drives-grid.collage`
  * `.gallery-card.neon-card` for each mini-block.

**CSS**

| Aspect       | File(s)                                | Selector(s)                     | What it does                                                |
| ------------ | -------------------------------------- | ------------------------------- | ----------------------------------------------------------- |
| Layout       | Inline `<style>` (about), `styles.css` | `.drives-grid`, `.gallery-card` | CSS grid with varying column spans to create mosaic effect. |
| Visual style | `styles.css`                           | `.gallery-card.neon-card`       | Neon card styling; maybe reduced padding.                   |

**JS**

* Scroll reveal; no gallery JS here (premium gallery script only runs on services page).

---

### 3.4 Page: `services.html` (only the extra bits; many base components reused)

#### Element – Service rows (“Marketing Automation”, “Finance & Reporting”, etc.)

* **Where**: Several repeated rows, each with left/right swap of image + copy.

* **HTML hooks**:

  * In `section.section.bg-circuit.animate.parallax-section.services-section`:

    * `.service-row` (multiple)
    * `.service-image.neon-card` containing `<img class="service-img">`
    * `.service-content.neon-card` containing `<h3>`, `<p>`, `<ul>`, CTA `.btn`.

**CSS**

| Aspect       | File(s)                                        | Selector(s)                                              | What it does                                                                                   |
| ------------ | ---------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Layout       | `styles.css`, `services.css`, inline `<style>` | `.service-row`, `.service-image`, `.service-content`     | Side-by-side layout using flex; optional reversed rows; consistent gap; vertical alignment.    |
| Visual style | `styles.css`, `custom.css`                     | `.service-image.neon-card`, `.service-content.neon-card` | Card backgrounds & shadow; image card emphasises screenshot; text card emphasises bullet list. |
| Responsive   | `mobile.css`, `services.css`                   | `.service-row`                                           | Stacks content with adjusted ordering (image below/above depending on row).                    |

**JS**

* Scroll reveal & parallax; magnetic buttons on CTAs.

---

#### Element – Innovation Gallery

* **Where**: Heading “Innovation Gallery” with text and then a grid of example flows.

* **HTML hooks**:

  * Heading: `<h2 id="innovation-gallery">` and surrounding text.
  * Placeholder container: `<div class="neural-grid" id="neural-grid">` – initially contains static `.neural-card` children.
  * Placeholder for double marquee: `<div id="innovation-marquee-slot" aria-hidden="true"></div>` nearby.

**CSS**

| Aspect        | File(s)                                         | Selector(s)                                                                                  | What it does                                                                                               |
| ------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Base fallback | `styles.css`                                    | `.neural-grid`, `.neural-card`, `.neural-overlay`, `.neural-info` (if present in styles)     | Basic tile look if JS fails.                                                                               |
| Mosaic layout | `premium-gallery.css`                           | `#neural-grid`, `.premium-tile`, `.tile-inner`, `.tile-front`, `.tile-back`, `.tile-caption` | Replaces `neural-grid` with multi-column responsive mosaic; per‑tile hover tilt, front/back text overlays. |
| Lightbox      | `marquee-double.css` (and `marquee-single.css`) | `.premium-lightbox`, `.lightbox-img`, `.lightbox-caption`, `.lightbox-close`                 | Full‑screen overlay with centered image and caption and close button.                                      |

**JS**

| File(s)              | Functions / listeners                              | Behavior                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `premium-gallery.js` | `initPremiumGallery()` (on DOMContentLoaded)       | - Finds `#neural-grid`.<br>- Reads existing `.neural-card` data or uses internal `GALLERY_ITEMS` array.<br>- Clears existing content and repopulates `#neural-grid` with `<figure class="premium-tile">` elements inside `<div class="tile-inner">` wrappers, each with front/back text.<br>- On tile click: opens `.premium-lightbox`, injects full-size image and caption. |
| `marquee-double.js`  | `ensureLightbox()`                                 | Ensures a single `.premium-lightbox` container exists in the DOM shared between gallery and double marquee images.                                                                                                                                                                                                                                                           |
| `script.js`          | `alignInnovationAnchor()` (in `marquee-double.js`) | Adjusts scroll offset so clicking “Innovation Gallery” anchor lines the section nicely under the fixed header (by reading header height and adjusting scroll position).                                                                                                                                                                                                      |

---

#### Element – Double marquee (Services)

* **Where**: Usually placed just below the Innovation Gallery (`#innovation-marquee-slot`).

* **HTML hooks**:

  * Not present in static HTML. JS injects:

    * `<section class="double-marquee">`
    * Two rows with `.marquee-track` holding multiple `.marquee-img` `<img>`.

**CSS**

| Aspect           | File(s)              | Selector(s)                                                                           | What it does                                                                                                                                         |
| ---------------- | -------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout           | `marquee-double.css` | `.double-marquee`, `.double-marquee .row`, `.marquee-track`                           | Two horizontal lanes, each overflow hidden; images displayed inline with `white-space: nowrap` or flex to produce continuous strip.                  |
| Animation        | `marquee-double.css` | `.marquee-track`, `@keyframes marquee-scroll-left`, `@keyframes marquee-scroll-right` | Applies continuous left/right translation animations; some classes like `.fast`, `.slow`, `.scroll-left`, `.scroll-right` adjust duration/direction. |
| Lightbox styling | `marquee-double.css` | `.premium-lightbox`, `.lightbox-img`, `.lightbox-caption`, `.lightbox-close`          | Same as single marquee lightbox; duplicated definitions.                                                                                             |

**JS**

| File(s)             | Functions / listeners | Behavior                                                                                                                                                                                                                                                                           |
| ------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `marquee-double.js` | `initDoubleMarquee()` | - Only runs on `body.page-services`.<br>- Builds a double marquee inside `#innovation-marquee-slot` using `MARQUEE_IMAGES` array.<br>- Clones images to ensure no gap between end and start of scroll.<br>- Sets up click listeners on `.marquee-img` to open `.premium-lightbox`. |
| `marquee-double.js` | `ensureLightbox()`    | Creates shared lightbox DOM once (if missing).                                                                                                                                                                                                                                     |

---

### 3.5 Page: `book.html`

#### Element – Discovery call section

* **Where**: Main `section.discovery-call-section.parallax-section` with text and inline Calendly.

* **HTML hooks**:

  * `section.discovery-call-section.animate.parallax-section` with `data-parallax-theme="book"`.
  * `.discovery-call-content` containing `<ul>` bullet breakdown.
  * `.widget` wrapping `<div class="calendly-inline-widget" data-url="...">`.
  * `.info` section with supporting copy.

**CSS**

| Aspect              | File(s)                          | Selector(s)                                                              | What it does                                                                                        |
| ------------------- | -------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Layout              | Inline `<style>`, `styles.css`   | `.discovery-call-section`, `.discovery-call-content`, `.widget`, `.info` | Two-column layout: text and Calendly side-by-side on desktop; converts to stacked layout on mobile. |
| Calendly sizing     | Inline `<style>`                 | `.calendly-inline-widget`                                                | Sets height and max width, ensures it fills column.                                                 |
| Parallax background | `styles.css`, `parallax-fix.css` | `.bg-lines` or `.bg-book` equivalent via `data-parallax-theme="book"`    | Book hero-specific gradient and background.                                                         |

**JS**

| File(s)         | Functions / listeners      | Behavior                                                 |
| --------------- | -------------------------- | -------------------------------------------------------- |
| Calendly widget | Calendly’s `widget.js`     | Initializes inline scheduler using `data-url` attribute. |
| `script.js`     | Parallax and scroll reveal | Applies book theme parallax background.                  |

---

### 3.6 Page: `contact.html`

#### Element – Contact form & details

* **Where**: `section.section.bg-waves.animate.parallax-section`.

* **HTML hooks**:

  * `.contact-grid`
  * `.contact-form-card.neon-card` containing `<form id="contact-form" class="contact-form">`
  * `.contact-details.neon-card` with email, region, industries, etc.
  * `#contact-status` for submission feedback.

**CSS**

| Aspect       | File(s)                        | Selector(s)                                               | What it does                                                                |
| ------------ | ------------------------------ | --------------------------------------------------------- | --------------------------------------------------------------------------- |
| Layout       | Inline `<style>`, `styles.css` | `.contact-grid`, `.contact-form-card`, `.contact-details` | Two-column grid at desktop; balanced card heights.                          |
| Form styling | `styles.css`, inline           | `.contact-form input`, `textarea`, `.field-group`         | Input and textarea styling; error/success messages; spacing between fields. |
| Responsive   | `mobile.css`                   | `.contact-grid`                                           | Stacks form and details; adjusts padding.                                   |

**JS**

| File(s)       | Functions / listeners                      | Behavior                                                   |
| ------------- | ------------------------------------------ | ---------------------------------------------------------- |
| Inline script | Form submit handler                        | Handles Netlify serverless call, statuses, error handling. |
| `script.js`   | Scroll reveal & parallax (theme `"waves"`) | Section reveal; background.                                |

#### Element – Social callout

* **Where**: Social links card under contact grid.

* **HTML hooks**:

  * `.contact-social-callout.neon-card`
  * `.contact-social-links`, `.contact-social-link` for each platform.

**CSS**

| File(s)          | Selector(s)                                                                | What it does                                                                |
| ---------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Inline `<style>` | `.contact-social-callout`, `.contact-social-links`, `.contact-social-link` | Centered neon card with horizontally aligned icon/handle; stacks on mobile. |
| `styles.css`     | `.neon-card`, `.btn`                                                       | Base neon card styling.                                                     |

---

### 3.7 Page: `niches/estate-agents.html`

There are many sections, but all reuse global card patterns and a few extra classes (`.compact-section`, `.dark-card`).

High-level mapping:

1. **“Cost of a slow response” section**

   * `section.section.bg-lines.animate.parallax-section`
   * `.service-image.neon-card`, `.service-content.neon-card.dark-card`.
   * CSS from `styles.css` + estate‑agents inline `<style>` (for `.dark-card`) and global `.service-row`.
   * JS: scroll reveal & parallax theme `"book"`.

2. **“Never Miss a Viewing pack” section**

   * `section.section.bg-circuit.animate.parallax-section`
   * Same `.service-row` pattern.
   * CSS/JS similar.

3. **Estate agent stats** (grid of three stats)

   * `div.stats` with `.neon-card.stat` etc; same CSS & JS pattern as home stats.

4. **Compact sections**

   * Several `section.section.bg-lines.animate.parallax-section.compact-section` blocks with narrower content.
   * `.dark-card.neon-card` for more intense backgrounds.
   * CSS inline (estate page) defines `.compact-section` smaller padding and `.dark-card` with darker fill.

5. **Estate FAQ**

   * `section.section.bg-lines.animate.parallax-section.compact-section`
   * `.neon-card.faq-item` list; similar to home FAQ but without `<details>`; more static Q&A layout.

6. **Final CTA**

   * `section.section.brand-gradient.animate` with `.cta-card.neon-card` – same CTA pattern as home.

All these use the same **spacing patterns**:

* `.section { padding: 4rem 0; }` from `styles.css`.
* `.neon-card` for cards.
* Extra alignment/responsiveness from `mobile.css`.

---

### 3.8 Page: `privacy-policy.html`

Single content block:

* `section.section.bg-mesh.animate` containing `div.neon-card` with policy content.

CSS & JS: same as general section; inline `<style>` makes typography comfortable for long text.

---

## 4. Feature-Focused Deep Dive

### 4.1 Menu banner / header navigation

**HTML location**

* In every page `<body>`:

  * `header.site-header`
  * `div.nav-toggle`
  * `nav > ul`
  * `li.nav-dropdown > button.services-toggle + div.services-menu`
  * `div.services-overlay` sibling of `header` (global overlay for services grid).

**CSS**

| Aspect                 | File(s)                                    | Selector(s)                                                                                                                                         |
| ---------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base header layout     | `styles.css`                               | `.site-header`, `.header-inner`, `.logo`, `nav ul`, `nav li`, `.nav-dropdown`                                                                       |
| Mobile nav (burger)    | `mobile.css`                               | `.nav-toggle`, `nav ul`, `body.nav-open`                                                                                                            |
| Services dropdown      | `styles.css`                               | `.nav-dropdown`, `.services-menu`, `.service-link`, `.services-label`, `.chevron`                                                                   |
| Full overlay           | `styles.css`                               | `.services-overlay`, `.services-overlay__panel`, `.services-overlay__header`, `.services-overlay__back`, `.services-overlay__grid`, `.service-pill` |
| Header indicator       | Inline `<style>` injected from `script.js` | `#header-indicator`, `.indicator-copy`                                                                                                              |
| Additional adjustments | `custom.css`                               | `.site-header`, `.site-logo`                                                                                                                        |

**JS behavior**

* **Header scroll behavior**

  * In `script.js`: attaches scroll listener; toggles header visibility.
  * When header hides, creates/shows `#header-indicator` bar with text (“Tap to expand” / instructions).
  * Clicking indicator reopens header (handlers attached during init).

* **Services dropdown**

  * `openServicesDropdown`/`closeServicesDropdown`: toggles `.open` on `.services-menu`, `aria-expanded` on `.services-toggle`, adds/removes `services-dropdown-open` class on `<body>`.
  * On mobile, when nav is opened, the dropdown is the first level; the overlay is a second level accessible via “All services” link.

* **Services overlay**

  * `openServicesOverlay`/`closeServicesOverlay`: toggles `.services-overlay-active` on `<body>` and `aria-hidden` in overlay elements.
  * Handles back button `.services-overlay__back` to return to menu; prevents body scroll while open.

* **Mobile nav**

  * `openNavMenu`/`closeNavMenu`: toggles `nav-toggle`’s `.active` class, adds a `nav-open` class and manipulates `body.style.position/top` to lock scroll.

---

### 4.2 Footer

**HTML**

* In each page, `footer.site-footer` with `.footer-container`, `.footer-brand`, `.footer-links`, `.footer-column`, `.social-icons`.

**CSS**

* All real footer styling lives in `styles.css` (and some list styles in `icons.css`).
* `assets/css/footer.css` contains an older version of footer styling but is **never linked**.

**JS**

* None; purely static.

---

### 4.3 Single marquee

**Where**

* Appears on: `index.html`, `about.html`, `contact.html`, `book.html` (never on `services` or `privacy`/`estate-agents`).

**Injection**

* `marquee-single.js` runs on DOMContentLoaded, **skips** body with `class="page-services"`.
* Finds `footer.site-footer`, builds a `<section class="single-marquee">` with inner `.marquee-track` and repeated `<img class="marquee-img">`, inserts it **immediately before** the footer.

**CSS**

| Aspect    | File(s)              | Selector(s)                                                                  |                                                                             |
| --------- | -------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Layout    | `marquee-single.css` | `.single-marquee`, `.marquee-track`, `.marquee-img`                          |                                                                             |
| Animation | `marquee-single.css` | `.marquee-track`, `@keyframes marquee-scroll-left`                           | Horizontal infinitely looping scroll via `transform: translateX` animation. |
| Lightbox  | `marquee-single.css` | `.premium-lightbox`, `.lightbox-img`, `.lightbox-caption`, `.lightbox-close` |                                                                             |

**JS**

| File(s)             | Functions                  | Behavior                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `marquee-single.js` | `initSingleMarquee()`      | - Checks `document.body.classList.contains('page-services')` to skip services.<br>- Removes any legacy `.single-marquee` / `.double-marquee` / `.logo-slider` / `.premium-marquee-container` if present.<br>- Ensures shared `.premium-lightbox` exists (`ensureLightbox()`).<br>- Builds `<section>` and `.marquee-track`, fills with `MARQUEE_IMAGES` list of marketing imagery; clones items to fill track. |
| `marquee-single.js` | `attachLightboxHandlers()` | Adds `click` listeners to `.marquee-img` so clicking opens lightbox with large image and alt‑based caption.                                                                                                                                                                                                                                                                                                    |

---

### 4.4 Double marquee

Covered above in Services mapping; key differences:

* Injected into `#innovation-marquee-slot`.
* Two tracks (`row-1`, `row-2`), one scrolling left, one right, each with its own speed class (`.fast`, `.slow`).
* Shares lightbox styling/logic.

---

### 4.5 Innovation gallery

See 3.4 for structural mapping; core pieces:

**HTML**

* `h2#innovation-gallery`, explanatory `<p>`.
* `<div class="neural-grid" id="neural-grid">` as JS target.
* Fallback `.neural-card` children inside `#neural-grid` (unused once JS runs).

**CSS**

* `premium-gallery.css` now drives the layout:

  * `#neural-grid`: multi-column responsive mosaic using CSS columns or grid.
  * `.premium-tile`, `.tile-inner`, `.tile-front`, `.tile-back`: card flip/tilt styles with `transform` and `transition`.
  * `.tile-caption` for text overlay.

**JS**

* `premium-gallery.js` fully takes over:

  * On load, defines `GALLERY_TARGET_ID = "neural-grid"` and `GALLERY_ITEMS` (image src + title + description).
  * Clears `#neural-grid` and repopulates with `<figure class="premium-tile ...">`.
  * Attaches `mouseenter`/`mouseleave` hover tilt (small transform and shadow).
  * On click: passes item data to `openLightbox(item)` which uses `.premium-lightbox` created by either `premium-gallery.js` or marquee scripts.

---

### 4.6 Hero shaders (WebGL / canvas)

**HTML**

* `<canvas id="hero-shader-canvas"></canvas>` inside `.hero-media`.

**CSS**

* `hero-base.css`: sets `.hero-media` as relative container, canvas absolutely positioned to cover area; ensures z-index behind copy.
* `custom.css`: ensures hero uses `transform-origin` & `backface-visibility: hidden` so hardware acceleration doesn’t blur text; handles `scroll-behavior: auto !important` to avoid weird effects during parallax.

**JS**

* `hero-shader.js`:

  * Finds `#hero-shader-canvas`.
  * Builds vertex and fragment shaders inline (strings within JS).
  * Uses uniform `u_time`, `u_resolution` and others to drive animated gradient / noise field.
  * Chooses variant based on page/hero (e.g. uses “book” variant for `page-book`, “circuit” for services).
  * On WebGL failure or `prefers-reduced-motion`, it removes canvas or leaves static CSS background.

---

### 4.7 Parallax effects

Already covered; recap:

* **HTML**: `.parallax-section` + `data-parallax-theme`.
* **CSS**: `parallax-fix.css` + theme-specific CSS in `styles.css`.
* **JS**: parallax module in `script.js`.

Behavior:

* On desktop: modifies `background-position` relative to scroll.
* On mobile: builds `.parallax-mobile-stage` with `.parallax-mobile-layer`, toggles `.parallax-mobile-active`, uses `IntersectionObserver` and `requestAnimationFrame` for smooth movement.

---

### 4.8 Magnetic buttons

**HTML**

* All CTAs are `a.btn.btn-primary`, `a.btn.btn-secondary`, or `button.btn`.

**CSS**

* `styles.css`: `.btn`, `.btn-primary`, `.btn-secondary` define padding, border-radius, base background, hover transitions.
* `mobile.css`: reduces `font-size` and padding for smaller viewports.

**JS – `magnetic-buttons.js`**

* On DOMContentLoaded:

  * Collects `document.querySelectorAll('.btn')` (skips ones with data attributes if necessary).

  * On `mousemove` over a button:

    * Calculates offset from center (`dx`, `dy`) and applies `transform: translate(dx * factor, dy * factor)` for subtle magnetic pull.

  * On `mouseleave`:

    * Resets transform via `transition`.

  * On touch devices / `hover: none`:

    * Bails out and leaves standard hover.

---

### 4.9 Calendly integration

**HTML**

* On `book.html`:

  * `<link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css">`
  * `<script src="https://assets.calendly.com/assets/external/widget.js" async></script>`
  * `<div class="calendly-inline-widget" data-url="https://calendly.com/...">` inside `.widget`.

**CSS**

* Inline `<style>` in `book.html`:

  * `.calendly-inline-widget` gets height (e.g. 700px) and full width.
  * `.discovery-call-section` sets two-column layout, combo of `.widget` and `.info`.

**JS**

* Calendly’s `widget.js`: auto-initializes inline widget based on `data-url`.
* No custom callbacks beyond layout.

---

### 4.10 Mobile overrides (CSS + JS)

**CSS**

Key breakpoints:

* `mobile.css`:

  * `@media (max-width: 768px)`:

    * Sets `.site-header` to smaller padding.
    * Stacks `.hero-inner`, `.features`, `.packages-grid`, `.pricing-grid`, `.contact-grid`, `.service-row`, `.values`.
    * Tweaks stats grid, FAQ spacing, CTA font sizes.
    * Adjusts `.calendly-inline-widget` width and margin.

  * Additional adjustments for `.page-book`, `.page-services`.

* `custom.css`:

  * `@media (prefers-reduced-motion: no-preference) and (min-width: 769px)` – hero parallax only on desktop.
  * `@media (max-width: 768px)`:

    * Tightens `.neon-card` text, bullet spacing, etc.

**JS**

* `script.js` uses `matchMedia('(max-width: 768px)')`:

  * Disables some animations (immediately adds `.visible`).
  * Chooses mobile parallax path (stage + layer) vs desktop background-attachment.
  * Adapts header nav behavior for mobile.

---

### 4.11 Additional card types & animations

**Card types**

Common across multiple pages:

* **Base card** – `.neon-card`

  * Files: `styles.css`, `custom.css`.
  * Used for: feature cards, service content, stats, proof cards, pricing cards, FAQs, contact cards, value cards, gallery tiles, CTA cards.
  * Spacing: ~2rem padding; card-level margin-bottom; `border-radius` ~1rem; `box-shadow` and border.

* **Feature card** – `.feature-card.neon-card`

  * Files: `styles.css`, `home-services-fix.css` (legacy), `custom-styles.css`.
  * Use: feature trio on home & service packages.

* **Stat card** – `.neon-card.stat`

  * Files: inline styles + `styles.css`.
  * Use: home/about/estate stats; layout done via `.stats` grid.

* **Pricing card** – `.pricing-card.neon-card`

  * Files: `styles.css`, `custom-styles.css`.
  * Use: home pricing & bolt-ons; estate pricing in compact section.

* **Value card** – `.value-card.neon-card`

  * Files: `styles.css`, about inline.
  * Use: About “Values” section.

* **FAQ item** – `.neon-card.faq-item` or `<details class="faq-item neon-card">`

  * Files: `styles.css`, `mobile.css`.
  * Use: home FAQ, estate FAQ.

* **Service cards** – `.service-image.neon-card`, `.service-content.neon-card`

  * Files: `styles.css`, `services.css`, page-specific inline styles.
  * Use: about mission row; services page; estate sections.

* **CTA card** – `.cta-card.neon-card`

  * Files: `styles.css`, `custom.css`.
  * Use: home final CTA, estate final CTA.

**Animation / cinematic behaviors**

* Scroll reveal of sections (`.animate` → `.visible`) – `script.js` + `styles.css`.
* Parallax backgrounds (hero + sections) – `script.js` + `parallax-fix.css`.
* Hero WebGL shader – `hero-shader.js` + `hero-base.css`.
* Stats number counting – `script.js` (stats module).
* Marquee loops – `marquee-single.js`/`marquee-double.js` + respective CSS.
* Gallery hover tilt & lightbox – `premium-gallery.js` + `premium-gallery.css` + `.premium-lightbox` CSS.
* Magnetic button hover – `magnetic-buttons.js` + `.btn` styles.

---

## 5. CSS/JS Architecture & Refactoring Notes

### CSS architecture

* **Global base**: `styles.css` is the main kitchen-sink file. It mixes:

  * Variables, typography, layout.
  * Component styles (hero, sections, cards, footer, services, values, etc.).
  * Some page-specific things (unused `.about-hero`, `.contact-hero`, `.home-hero`, `.services-hero`, `.booking-hero`).

* **Enhancements**:

  * `custom.css`: hero & parallax-specific tweaks, cookie banner, header sizing, neon card fine-tuning.
  * `custom-styles.css`: targeted “Our Services” improvements.
  * `mobile.css`: global responsive overrides.

* **Feature CSS**:

  * `hero-base.css`, `parallax-fix.css`, `premium-gallery.css`, marquee CSS files.

* **Legacy**: `neural-grid.css`, `home-services-fix.css`, `footer.css` are unused at runtime.

**Refactor suggestions**

* Split `styles.css` into smaller component files (even if still concatenated for prod):

  * `base.css` (fonts, resets, variables).
  * `layout.css` (`.section`, `.container`, grid utilities).
  * `header.css`, `footer.css` (actual used footer styles).
  * `cards.css` (`.neon-card`, `.feature-card`, `.pricing-card`, `.value-card`, `.faq-item`, etc.).
  * `pages/home.css`, `pages/services.css`, `pages/niche-estate.css`.

* Merge duplicated lightbox CSS from `marquee-single.css` and `marquee-double.css` into a single `lightbox.css` (imported once).

* Remove or move `neural-grid.css`, `home-services-fix.css`, and `footer.css` to a `/legacy` folder; only keep if you plan to re-enable those layouts.

* Centralize stats CSS (currently repeated via inline `<style>` in multiple pages) into a shared `stats.css` or section in `cards.css`.

---

### JS architecture

* **Monolithic `script.js`** holds:

  * Header/nav/indicator logic.
  * Services dropdown & overlay.
  * Dynamic CSS loader (`ensureStylesheet('assets/css/custom.css')`, `ensureStylesheet('assets/css/mobile.css')`).
  * Scroll reveal.
  * Stats counters.
  * Parallax backgrounds.

* **Feature-specific modules** are reasonably separate:

  * `hero-shader.js`, `magnetic-buttons.js`, `marquee-single.js`, `marquee-double.js`, `premium-gallery.js`.

* **Legacy**:

  * `neural-grid.js` (never loaded).
  * Build / backend scripts (not in frontend pipeline).

**Refactor suggestions**

* Break `script.js` into modules:

  * `header-nav.js` – nav, services dropdown & overlay, header indicator, cookie connections.
  * `scroll-reveal.js` – `.animate` → `.visible`.
  * `stats.js` – stats counters.
  * `parallax.js` – parallax sections.
  * `css-loader.js` – `ensureStylesheet` helper.

* Convert modules to ES modules (`type="module"`), imported per page as needed, instead of one giant script.

* Remove `neural-grid.js` or move to `/legacy`.

---

## 6. Unused & Duplicate CSS Summary

### 6.1 Entire CSS files not used by any page

| File                               | Why considered unused                                                                                                                                                         | Notes / refactor suggestion                                                        |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `assets/css/neural-grid.css`       | Not linked in any HTML; no JS loads it; its selectors (`.neural-grid`, `.neural-card`, etc.) are present in HTML but actual runtime styling comes from `premium-gallery.css`. | Move to `/legacy` or delete once sure you won’t revert to the old gallery.         |
| `assets/css/home-services-fix.css` | Not linked in any HTML; replaced in practice by `custom-styles.css` and newer fixes.                                                                                          | Safe to move to `/legacy`; copy any still-relevant rules into `custom-styles.css`. |
| `assets/css/footer.css`            | Not linked anywhere; footer is styled inside `styles.css`.                                                                                                                    | Move to `/legacy`; or merge any missing improvements into `styles.css` and delete. |

---

### 6.2 Unused selectors inside active CSS files

These are selectors with names that never appear in HTML or JS (even as strings).

> Remove with a bit of caution: some may be placeholders for future features, but most are clearly legacy.

**`assets/css/hero-base.css`**

| Selector               | Type  | Notes                                              |
| ---------------------- | ----- | -------------------------------------------------- |
| `.hero-fallback-image` | class | No matching HTML or JS; leftover fallback styling. |

**`assets/css/home-services-fix.css`** (file already unused)

| Selector      | Type  | Notes                                                |
| ------------- | ----- | ---------------------------------------------------- |
| `.check-icon` | class | No HTML references; bullet checks are plain `<img>`. |
| `.html`       | class | Probably accidental or from old comments.            |

**`assets/css/icons.css`**

| Selector                                       | Type  | Notes                                                                            |
| ---------------------------------------------- | ----- | -------------------------------------------------------------------------------- |
| `.fa-linkedin`, `.icon-list`, `.ttf`, `.woff2` | class | Not used anywhere in HTML/JS. `.icon-list` might be safe to remove or add usage. |

**`assets/css/mobile.css`**

| Selector                                   | Type  | Notes                                                          |
| ------------------------------------------ | ----- | -------------------------------------------------------------- |
| `.bg-city`                                 | class | No section uses `bg-city`; likely removed hero variant.        |
| `#a855f7`, `#ec4899`, `#f472b6`, `#f8fafc` | ID    | Look like color hex placeholders accidentally turned into IDs. |

**`assets/css/parallax-fix.css`**

| Selector          | Type  | Notes                                                                                  |
| ----------------- | ----- | -------------------------------------------------------------------------------------- |
| `.parallax-layer` | class | Not referenced anywhere in HTML or JS; parallax uses `.parallax-mobile-layer` instead. |

**`assets/css/services.css`**

| Selector                                       | Type    | Notes                                                                   |
| ---------------------------------------------- | ------- | ----------------------------------------------------------------------- |
| `.contact-map`, `.contact-row`, `.gallery-img` | classes | Not used in services HTML; leftover from older contact/gallery layouts. |
| `.neon1`–`.neon8`                              | classes | No matching elements; maybe planned theme variants.                     |

**`assets/css/styles.css`**

| Selector                                                                                       | Type    | Notes                                                                              |
| ---------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `.about-hero`, `.contact-hero`, `.home-hero`, `.services-hero`, `.booking-hero`, `.booking-bg` | classes | No hero element uses these; hero uses `.hero.title-band` instead.                  |
| `.bg-city`                                                                                     | class   | Not used; same as in mobile.                                                       |
| `.calendly-inline-iframe`, `.calendly-mask`                                                    | classes | HTML uses `.calendly-inline-widget` but not these names.                           |
| `.check-icon`                                                                                  | class   | Same unused bullet icon as above.                                                  |
| `.google-map`, `.map-col`                                                                      | classes | No map embed currently on any page.                                                |
| `.html`                                                                                        | class   | Probably accidental.                                                               |
| `.mb-1`–`.mb-4`, `.mt-2`, `.mt-4`                                                              | classes | Utility margin classes not used in HTML.                                           |
| `.menu-toggle`                                                                                 | class   | Nav uses `.nav-toggle`, not `.menu-toggle`.                                        |
| `.no-card`                                                                                     | class   | Not present in HTML.                                                               |
| `.services-section`                                                                            | class   | Not used as a class; `services.html` uses `.section` with ID anchors instead.      |
| `.text-center`                                                                                 | class   | No direct `text-center` class usage; center alignment is done via other selectors. |
| `.values-gallery`, `.what-drives-us`, `.what-drives-us-grid`                                   | classes | About page uses `.drives-grid` but not these; probably older naming.               |

**Unused IDs in `styles.css`**

| ID                            | Notes                                                                 |
| ----------------------------- | --------------------------------------------------------------------- |
| `#FFFFFF`, `#calendar-visual` | No matching elements; look like color placeholder and removed figure. |

---

### 6.3 Duplicate / overlapping CSS selectors

These selectors are defined in **multiple CSS files** and may be candidates for consolidation:

| Selector                                                                                                                          | Files                                                                                 | Summary / suggestion                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.site-footer`, `.footer-container`, `.footer-brand`, `.footer-links`, `.footer-column`, `.social-icons`                          | `styles.css`, `footer.css`                                                            | Footer is fully functional with `styles.css`. Merge missing bits and retire `footer.css`.                                                                                                    |
| `.btn`                                                                                                                            | `styles.css`, `custom-styles.css`, `home-services-fix.css`, `mobile.css`, `icons.css` | Base button styling is in `styles.css`; other files add small overrides. Consolidate all button base rules into one place (`buttons.css`) and keep only true overrides in page-specific CSS. |
| `.single-marquee`, `.marquee-track`, `.marquee-img`, `.premium-lightbox`, `.lightbox-img`, `.lightbox-caption`, `.lightbox-close` | `marquee-single.css`, `marquee-double.css`                                            | Lightbox styles and marquee track styles are essentially identical. Extract them into a shared `lightbox-marquee.css` and have both JS modules rely on that.                                 |
| `.bg-lines`, `.bg-mesh`, `.bg-waves`, `.bg-circuit`                                                                               | `styles.css`, `mobile.css`, `home-services-fix.css`                                   | Backgrounds defined multiple times to tune mobile; can be centralised in `parallax.css` with media queries.                                                                                  |
| `.animate`, `.visible`                                                                                                            | `styles.css`, `mobile.css`, `parallax-fix.css`, `services.css`                        | Animation classes scattered; keep definition in one place (`animations.css`) and have other files only adjust context (e.g. parallax’s special cases).                                       |
| `.service-row`, `.service-image`, `.service-content`, `.service-img`                                                              | `styles.css`, `services.css`, `custom.css`, `mobile.css`, `icons.css`                 | Several overrides for the same layout; unify into a dedicated services module and remove redundant definitions.                                                                              |
| `.title-band`                                                                                                                     | `styles.css`, `custom.css`, `hero-base.css`                                           | Hero band styling split; consider collapsing hero layout & hero motion into a single hero module.                                                                                            |

---

## 7. Unminifying & Improving Readability

### 7.1 Files that are dense/hard to read

* `assets/css/styles.css` – long, compact, many rules per line.
* `assets/css/services.css` – appended patches, little vertical whitespace.
* `assets/js/script.js` – large monolithic file with multiple concern areas.
* `assets/js/hero-shader.js` – includes shader source strings.
* `assets/css/marquee-single.css` and `assets/css/marquee-double.css` – contain both marquee and lightbox styles.

### 7.2 How to prettify them

In VS Code (or similar):

1. **Prettify CSS/JS**

   * Open file → `Shift+Alt+F` (Format Document) or via command palette.
   * If needed, install **Prettier** extension and set it as default formatter.

2. **CLI tools**

   * `npx prettier assets/css/styles.css --write`
   * `npx prettier assets/js/script.js --write`

3. **Preserve originals during refactor**

   * Create `src/css` and `src/js` directories.
   * Copy current files there, prettify & split them.
   * Keep `assets/css/styles.css` and `assets/js/script.js` as build outputs from concatenated/minified versions.

### 7.3 Suggested organization for refactor

**CSS**

* `src/css/base/` – `variables.css`, `typography.css`, `layout.css`.
* `src/css/components/` – `hero.css`, `cards.css`, `buttons.css`, `header.css`, `footer.css`, `stats.css`, `faq.css`.
* `src/css/features/` – `parallax.css`, `gallery.css`, `marquee.css`, `lightbox.css`.
* `src/css/pages/` – `home.css`, `services.css`, `about.css`, `book.css`, `contact.css`, `estate-agents.css`.

Then build into a single `styles.css` + a couple of feature bundles (e.g. `features.css`) as needed.

**JS**

* `src/js/header-nav.js`
* `src/js/scroll-reveal.js`
* `src/js/stats.js`
* `src/js/parallax.js`
* `src/js/hero-shader.js` (already separate)
* `src/js/magnetic-buttons.js`
* `src/js/marquee.js` (encapsulate single/double logic with configuration)
* `src/js/gallery.js` (premium gallery + lightbox)

Bundle to `assets/js/app.js` using a bundler (Vite/Rollup/webpack) or just ES module imports.

---

If you want, next step I can help you design a concrete refactor plan (file-by-file) or show how to extract a specific component (e.g. “cards.css” + “cards.js”) out of the current codebase.
