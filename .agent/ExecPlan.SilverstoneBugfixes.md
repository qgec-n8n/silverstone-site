<!-- FILE: .agent/ExecPlan.SilverstoneBugfixes.md -->

# ExecPlan: Silverstone Frontend Bugfixes (Post‑Refactor QA)

**Goal:** Starting from the refactored Silverstone site (HTML + modular CSS + vanilla JS), fix a specific set of **14 UI/UX bugs** while **preserving the current architecture** and the behavior defined in `Output_1.md` and `Output_2.md`.

This plan assumes:

- CSS is now sourced from `src/css/**` and bundled into `assets/css/styles.css`.
- JS is sourced from `src/js/**` and bundled into `assets/js/app.js`.
- All changes should be made in `src/**` and `.html` files, then rebuilt via the existing scripts.

---

## 1. Key files & structure (reference)

### 1.1 HTML entry points

- `index.html`  
  - Hero, “Streamline. Optimize. Succeed.” cards, “Our Services” pricing/services cards, base layout.

- `about.html`  
  - “Our Values” cards, “Our Story” & “Our Mission” cards.

- `niches/estate-agents.html`  
  - Services pills, hero sections for estate agents, “Where deals leak away”, “Never Miss a Viewing pack”, “Less firefighting, more instructions”, “Plug, personalise, launch”, “Safe, compliant, and fully supported”.
  - “Show the numbers, not just promises” stats section.
  - `Real_Estate_*` images.

- `book.html`  
  - Discovery call / Calendly section (`.discovery-call-section`).
  - Text card next to Calendly (`.discovery-call-content .info`).

- `contact.html`  
  - Contact form + Google Maps layout (`.contact-grid`, `.contact-map-card`).

### 1.2 Relevant CSS modules

- Base & layout:
  - `src/css/base/layout.css`  – section scaffolding (`.section`, `bg-*`), overlays.
  - `src/css/base/typography.css` – typography, mobile layout overrides (including `.features`, `.values`, `.packages-grid`, nav overlay).

- Components:
  - `src/css/components/cards.css` – `neon-card`, `feature-card`, `value-card`, `service-row`, `dark-card`, shared card layouts.
  - `src/css/components/header.css` – desktop & mobile navigation, `.services-toggle`, mobile overlay pills.
  - `src/css/components/stats.css` – `.stats` layout & typography.

- Features:
  - `src/css/features/parallax.css` – parallax backgrounds (`.parallax-section` + `data-parallax-theme`).

- Page‑specific:
  - `src/css/pages/home.css`         – home/index sections, `.packages-grid`, neon layering for pricing.
  - `src/css/pages/about.css`        – about page sections (`.section.bg-circuit`, “Our Story/Mission” rows).
  - `src/css/pages/estate-agents.css` – estate agents sections, `.dark-card`, hero/feature layout.
  - `src/css/pages/book.css`         – discovery call section, Calendly card layout.
  - `src/css/pages/contact.css`      – contact form + map grid.

### 1.3 Relevant JS modules

- `src/js/app.js`       – main bootstrap: initialises header nav, parallax, stats, etc.
- `src/js/parallax.js`  – parallax behavior on `.parallax-section`.
- `src/js/stats.js`     – counter behavior for `.stats` sections.

---

## 2. Global design rules for this bugfix run

1. **`neon-card` is the canonical card style**

   - Defined in `src/css/components/cards.css`.
   - Used by “Transparent, Affordable Pricing” cards.
   - All card‑style blocks listed in the bug sheet should visually align with these cards:
     - Same background opacity (semi‑transparent dark).
     - Same neon border and subtle glow.

2. **Card wrappers (`.feature-card`, `.value-card`, `.dark-card`, `.discovery-call-content .info`)**:

   - Should primarily control **layout and content flow**, not background/border.
   - Wherever these wrappers currently override background or border, they should be updated to **defer to `.neon-card`**.

3. **Layout rules**:

   - Desktop:
     - “Streamline. Optimize. Succeed.” cards: single horizontal row, with gaps, wrapping gracefully only on narrow viewports.
     - “Our Services” section: 2×2 grid (4 cards) on standard desktop widths.
     - “Our Values” (About) and “Plug / Safe” (Estate Agents) cards: single horizontal row with even spacing.
     - Contact form and map: two columns, equal visual weight.
   - Mobile:
     - All cards stack vertically with generous spacing.
     - No horizontal scrolling or clipping introduced by bugfixes.

4. **Parallax & backgrounds**:

   - Book page’s discovery call section should **mirror the parallax behavior and dark overlay** of index parallax sections, using the same background image source.
   - Estate Agents page must show a meaningful background image on mobile, using `book-hero-calendly-mobile-2025@*x.webp` as specified.
   - Changes must **not break** existing parallax behaviors across pages.

5. **Stats behavior**:

   - Counter effect is **disabled** for the “Show the numbers, not just promises” section.
   - Values **68** and **42** must display with a `%` suffix (`68%`, `42%`) in all viewports.
   - Other stats sections keep their counter behavior.

---

## 3. Bug map: locations & ownership

Each bug here is mapped to concrete files and selectors/components.

1. **Index – “Streamline. Optimize. Succeed.” cards**

   - HTML:
     - `index.html` → section with `class="section bg-lines animate parallax-section"` containing `<div class="features">` and `.feature-card neon-card` cards.
   - CSS:
     - `src/css/components/cards.css` → `.feature-card`.
     - `src/css/base/typography.css` → mobile overrides for `.features`.
     - `src/css/pages/home.css` → home‑specific layout (will receive a desktop `.features` layout rule).

2. **Index – “Our Services” cards**

   - HTML:
     - `index.html` → section titled “Our Services” with `<div class="packages-grid">` and four `.feature-card neon-card` cards.
   - CSS:
     - `src/css/pages/home.css` → `.packages-grid` (desktop grid).
     - `src/css/base/typography.css` → mobile overrides for `.packages-grid`.
     - `src/css/components/cards.css` → `.feature-card`.

3. **About – “Our Values” cards**

   - HTML:
     - `about.html` → `<div class="values">` with multiple `.value-card neon-card` cards.
   - CSS:
     - `src/css/components/cards.css` → `.value-card`.
     - `src/css/base/typography.css` → mobile overrides for `.values`.
     - New global `.values` desktop layout will be added (likely in `cards.css`).

4. **About – “Our Story” & “Our Mission” cards**

   - HTML:
     - `about.html` → `.service-row` blocks with `.service-image neon-card` and `.service-content neon-card` for each story/mission pair.
   - CSS:
     - `src/css/components/cards.css` → `.neon-card`, `.service-row`, `.service-content`.
     - `src/css/pages/about.css` → `.section.bg-circuit` and z‑index layering to ensure overlays don’t darken cards excessively.

5. **Estate Agents – “Where deals leak away.”, “Never Miss a Viewing pack”, “Less firefighting, more instructions”**

   - HTML:
     - `niches/estate-agents.html` → `.service-row` blocks where content cards use `class="service-content neon-card dark-card"`.
   - CSS:
     - `src/css/pages/estate-agents.css` → `.dark-card` overrides.

6. **Estate Agents – “Plug, personalise, launch” & “Safe, compliant, and fully supported”**

   - HTML:
     - `niches/estate-agents.html` → `<div class="values">` with `.value-card neon-card dark-card`.
   - CSS:
     - `src/css/components/cards.css` → `.value-card`, new `.values` desktop layout.
     - `src/css/base/typography.css` → mobile `.values` override.
     - `src/css/pages/estate-agents.css` → `.dark-card`.

7. **Book – missing parallax background**

   - HTML:
     - `book.html` → discovery call section:
       - `<section class="discovery-call-section parallax-section" data-parallax-theme="book" id="discovery-call-section">`.
   - CSS:
     - `src/css/features/parallax.css` → `[data-parallax-theme="book"]` theme.
     - `src/css/base/layout.css` → `.section.bg-lines` and overlay rules.
   - JS:
     - `src/js/parallax.js`, `src/js/app.js` → ensure parallax is initialised on the book page.

8. **Book – text card next to Calendly**

   - HTML:
     - `book.html` → inside discovery call section:
       - `<div class="discovery-call-content">`
         - `<div class="info">` (text card to be aligned with neon card pattern).
   - CSS:
     - `src/css/pages/book.css` → `.discovery-call-content .info`.

9. **Contact – map + text sizing/layout**

   - HTML:
     - `contact.html` → contact section with:
       - `<div class="contact-grid">`
         - `<div class="contact-form-card neon-card">`
         - `<div class="contact-map-card neon-card">` containing `.map-container` (iframe) and `.map-address`.
   - CSS:
     - `src/css/pages/contact.css` → `.contact-grid`, `.contact-form-card`, `.contact-map-card`, `.map-container`, `.map-address`.

10. **Desktop navigation – Services dropdown alignment**

    - HTML:
      - All top‑level pages share the same `<header class="site-header">` markup with a nav list containing a `li.nav-dropdown` and `<button class="services-toggle">`.
    - CSS:
      - `src/css/components/header.css` → nav layout (`nav`, `nav ul`, `nav a`, `.nav-dropdown`, `.services-toggle`).

11. **Mobile navigation – Services pill styling**

    - HTML:
      - Same header/nav as above, but in mobile layout the nav becomes an overlay.
    - CSS:
      - `src/css/base/typography.css` → mobile nav overlay “pill” styling for `.site-header nav ul > li a` and related selectors.
      - `src/css/components/header.css` → `.services-toggle` baseline styles.

12. **Mobile Estate Agents – missing background image**

    - HTML:
      - `niches/estate-agents.html` → `<body class="page-estate-agents">` and parallax sections with `data-parallax-theme="book"`.
    - CSS:
      - `src/css/features/parallax.css` → defines image sources per `data-parallax-theme`.
      - `src/css/pages/estate-agents.css` → will receive mobile‑specific background for `body.page-estate-agents`.

13. **Estate Agents stats – counter & percentages**

    - HTML:
      - `niches/estate-agents.html` → “Show the numbers, not just promises” section:
        - `<div class="stats">` containing `.stat` cards with `<div class="number" data-target="…">0</div>`.
    - CSS:
      - `src/css/components/stats.css` – layout only, likely no change needed.
    - JS:
      - `src/js/stats.js` – controls counter animation.

14. **Responsive `Real_Estate_*` images**

    - HTML:
      - `niches/estate-agents.html` → three `<img>` tags using:
        - `../assets/images/socialmedia/Real_Estate_1.jpeg`
        - `../assets/images/socialmedia/Real_Estate_2.jpeg`
        - `../assets/images/socialmedia/Real_Estate_3.jpeg`
    - Assets:
      - Desktop: `assets/images/socialmedia/Real_Estate_*.jpeg`
      - Mobile:  `assets/images/socialmedia/Real_Estate_*_Mobile.jpeg`

---

## 4. Phased execution plan

To minimise regressions, handle bugs in the following phases.

### Phase 1 – Card styling & neon consistency (bugs 1–6, 8)

**Goals**

- All cards listed in bugs 1–6 and 8 share:
  - The same background opacity as the “Transparent, Affordable Pricing” cards.
  - The same neon border and glow (via `.neon-card`).
- Layout of card groups on desktop is as specified (rows or 2×2 grids).

**Steps**

1. **Unify `.feature-card` and `.value-card` styling**

   - File: `src/css/components/cards.css`.
   - For `.feature-card` and `.value-card`:
     - Remove or neutralise any `background-color`, `backdrop-filter`, and `border` properties that override `.neon-card`.
     - Keep layout‑related properties:
       - `flex`, `max-width`, `padding`, text alignment, etc.
     - Result: visual appearance (background + border) comes from `.neon-card`; wrappers only control spacing/layout.

2. **Define desktop `.features` layout (bug 1)**

   - File: `src/css/pages/home.css`.
   - Add a desktop layout rule for `.features`:

     - `display: flex;`
     - `flex-wrap: wrap;`
     - `gap` around 1.5–2rem.
     - `justify-content: center;`
     - `.features .feature-card` with `flex: 1 1 ~260–320px` and an appropriate `max-width`.

   - Ensure mobile override in `src/css/base/typography.css` still stacks cards vertically:
     - `@media (max-width: 768px) { .features { flex-direction: column; } }`.

3. **Adjust “Our Services” grid for 2×2 layout (bug 2)**

   - File: `src/css/pages/home.css`.
   - Update `.packages-grid`:

     - Desktop/default:
       - `display: grid;`
       - `grid-template-columns: repeat(2, minmax(0, 1fr));`
       - `gap` 1.5–2rem.
       - `max-width` and `margin: 0 auto;` as already used.
     - Keep or refine the mobile override:
       - Either in `home.css` or in `src/css/base/typography.css`, ensure:
         - `@media (max-width: 768px) { .packages-grid { grid-template-columns: 1fr; gap: 1.5rem; } }`.

   - Confirm on desktop that four cards form a 2×2 grid and remain readable on narrow screens.

4. **Define shared `.values` layout (bugs 3 & 6)**

   - File: `src/css/components/cards.css`.
   - Introduce a shared desktop layout for `.values`:

     - `.values`:
       - `display: flex;`
       - `flex-wrap: wrap;`
       - `gap` around 1.5–2rem;
       - `justify-content: center;`
       - `align-items: stretch;`.
     - `.values .value-card`:
       - `flex: 1 1 ~240–320px;`
       - `max-width` to keep cards at a pleasant width.

   - Mobile override (already present in `src/css/base/typography.css`) should:
     - Set `flex-direction: column;`
     - Let cards grow to full width.

5. **Align `.dark-card` with neon style (bugs 5 & 6)**

   - File: `src/css/pages/estate-agents.css`.
   - Update `.dark-card` to stop negating the neon look:

     - Remove or neutralise any dark `background` and low‑contrast `border` overrides.
     - Optionally leave `.dark-card` as a semantic marker with no visual styles, or with minor adjustments that do **not** override `.neon-card`.

   - Ensure hero/feature cards (“Where deals leak away.”, etc.) and the “Plug / Safe” cards now show the same neon border and opacity as pricing cards.

6. **Verify “Our Values” and “Our Story/Mission” (bugs 3 & 4)**

   - Files:
     - `about.html`
     - `src/css/components/cards.css`
     - `src/css/pages/about.css`
   - “Our Values”:
     - Confirm that `.values` and `.value-card` now:
       - Lay out in a row on desktop using the new `.values` rules.
       - Stack on mobile via the mobile override.
   - “Our Story” & “Our Mission”:
     - Confirm both cards use `class="service-content neon-card"` in `about.html`.
     - Ensure there are **no** extra background or border overrides in `cards.css` or `about.css` that make these cards darker than the pricing cards.
     - If necessary, trim any such overrides so they rely fully on `.neon-card`.

7. **Book page text card styling (bug 8)**

   - Files:
     - `book.html`
     - `src/css/pages/book.css`
   - Markup:
     - Change the text card wrapper from:
       - `<div class="info">` to `<div class="info neon-card">`.
   - CSS:
     - In `.discovery-call-content .info`:
       - Remove any `background-color`, `border`, and `border-radius` that conflict with `.neon-card`.
       - Keep layout properties (max width, padding, margin, text alignment).
   - Result: the booking text card uses the same neon card style as pricing cards.

8. **Rebuild & sanity‑check Phase 1**

   - Run:
     - `npm run build:css`
     - `npm run build:js`
   - Check layout (by reasoning over CSS/HTML):
     - Index: “Streamline. Optimize. Succeed.” row and 2×2 “Our Services” grid.
     - About: “Our Values” row and “Our Story/Mission” cards with neon styling.
     - Estate Agents: hero cards and “Plug / Safe” cards use neon background/border.
     - Book: discovery call text card uses neon border and appropriate opacity.

---

### Phase 2 – Parallax & background behavior (bugs 7, 12, 14)

**Goals**

- Book page discovery call section visually matches index parallax sections (background image + dark overlay + parallax).
- Estate Agents page on mobile shows the specified background image.
- Real estate imagery uses mobile vs desktop assets appropriately.

**Steps**

9. **Book page parallax alignment (bug 7)**

   - Files:
     - `book.html`
     - `src/css/features/parallax.css`
     - `src/js/app.js` (verification only)
   - Markup adjustments in `book.html`:
     - For the discovery call section, ensure the `<section>` element has **all** of:
       - `class="section bg-lines animate parallax-section discovery-call-section"`
       - `data-parallax-theme="book"`
       - `id="discovery-call-section"`.
     - This mirrors index parallax sections (`.section bg-lines animate parallax-section`) while preserving the page‑specific theme (`book`).
   - CSS verification:
     - In `parallax.css`, confirm `[data-parallax-theme="book"]`:
       - Uses the same base image as the index background (currently `book-hero-calendly-mobile-2025.webp` variants).
       - Applies a comparable dark overlay (via gradient or `--parallax-overlay`).
   - JS verification:
     - In `src/js/app.js`, confirm `initParallax()` is called unconditionally or for all pages.
     - Ensure `assets/js/app.js` will be rebuilt after changes (via `npm run build:js`).

10. **Mobile Estate Agents background image (bug 12)**

    - Files:
      - `src/css/pages/estate-agents.css`
      - `src/css/features/parallax.css`
    - CSS changes:
      - In `parallax.css`, confirm `[data-parallax-theme="book"]` already uses:
        - `../images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp` (or image‑set) as the mobile background.
      - Add a mobile‑specific background for the page body:
        - In `src/css/pages/estate-agents.css`, under `@media (max-width: 768px)`:
          - Add a rule for `body.page-estate-agents` that:
            - Sets `background-image` to the same mobile hero asset.
            - Uses `background-size: cover;` and `background-position: center top;`.
            - Does **not** interfere with parallax sections (`.parallax-section`).
    - Goal: on mobile, the estate agents page feels visually anchored with the specified hero background while parallax sections continue to function.

11. **Responsive `Real_Estate_*` images (bug 14)**

    - Files:
      - `niches/estate-agents.html`
    - For each of the three hero/service images:
      - Replace a simple `<img>` element such as:

        - `src="../assets/images/socialmedia/Real_Estate_1.jpeg"`

        with a `<picture>` structure, e.g.:

        - `<picture>`
          - `<source srcset="../assets/images/socialmedia/Real_Estate_1_Mobile.jpeg" media="(max-width: 768px)">`
          - `<source srcset="../assets/images/socialmedia/Real_Estate_1.jpeg" media="(min-width: 769px)">`
          - `<img src="../assets/images/socialmedia/Real_Estate_1.jpeg" class="service-img" loading="lazy" alt="..." />`
        - `</picture>`

      - Keep the `class="service-img"` on the `<img>` so existing CSS (`.service-image.neon-card img`) continues to work.
      - Repeat for `Real_Estate_2` and `Real_Estate_3` with their respective `_Mobile` variants.

12. **Rebuild & sanity‑check Phase 2**

    - Run:
      - `npm run build:css`
      - `npm run build:js`
    - Confirm by reasoning:
      - Book discovery call section uses the parallax background with an appropriate overlay.
      - On mobile, `body.page-estate-agents` shows the specified hero image.
      - The real estate images switch between desktop and mobile variants via the `<picture>` sources.

---

### Phase 3 – Navigation & layout polish (bugs 9, 10, 11)

**Goals**

- Contact page map + text look balanced and professional.
- The “Services” dropdown button aligns vertically with other nav items on desktop.
- In the mobile nav overlay, the Services pill uses the same font, color, size, and alignment as other menu pills.

**Steps**

13. **Contact page map layout (bug 9)**

    - Files:
      - `contact.html`
      - `src/css/pages/contact.css`
    - Layout adjustments:
      - Ensure `.contact-grid`:
        - Uses two columns on desktop (`grid-template-columns: repeat(2, minmax(0, 1fr));` or equivalent).
        - Stacks to a single column on mobile (`@media (max-width: 768px)` → `grid-template-columns: 1fr;`).
      - Update `.contact-map-card` to use flex to balance map and text:
        - `display: flex;`
        - `flex-direction: column;`
        - `justify-content: space-between;`
      - For `.map-container`:
        - Keep or enforce an aspect ratio (e.g. padding‑top or `aspect-ratio`) so the iframe fills a visually pleasing area.
      - For `.map-address`:
        - Add padding/margins as needed.
        - Ensure text is aligned and legible.
    - Goal: On desktop, map + form feel like equal halves; on mobile, the stack is clear and aesthetically balanced.

14. **Desktop nav Services alignment (bug 10)**

    - Files:
      - `src/css/components/header.css`
      - `src/css/base/typography.css` (verify nav overrides)
    - Adjust nav styling so that `button.services-toggle` aligns with other nav items:

      - Ensure that, for desktop (`@media (min-width: 769px)`):
        - `nav ul` uses `align-items: center;`.
        - `nav a` and `button.services-toggle` share:
          - Similar font size and line height.
          - Similar vertical padding (`padding-top` / `padding-bottom`).
          - Similar display type (e.g. `display: inline-flex; align-items: center;`).

      - Do **not** change navigation behavior:
        - Keep existing hover/focus states and dropdown logic intact.
        - Avoid altering JS in `header-nav.js` unless strictly necessary.

15. **Mobile nav Services pill styling (bug 11)**

    - Files:
      - `src/css/base/typography.css`
      - `src/css/components/header.css`
    - In the mobile nav overlay section of `typography.css`:

      - Wherever selectors currently style `.site-header nav ul > li a` to look like a full‑width pill (font family, color, size, alignment, padding), extend those rules to also target:
        - `.site-header nav ul > li.nav-dropdown > .services-toggle`

      - Example conceptual adjustment:
        - If you see a rule like:
          - `.site-header nav ul > li a { /* pill styles */ }`
        - Add `.site-header nav ul > li.nav-dropdown > .services-toggle` to the selector list so that the Services button inherits the same appearance.

    - Check that:
      - On mobile, the Services nav entry looks indistinguishable (font, color, size, alignment) from other menu pills.
      - Interaction behavior (opening services overlay) remains unchanged.

16. **Rebuild & sanity‑check Phase 3**

    - Run:
      - `npm run build:css`
      - `npm run build:js`
    - Confirm by reasoning:
      - Contact page shows a polished, balanced layout.
      - Desktop nav items, including Services, are vertically aligned.
      - Mobile nav overlay shows Services with matching pill styling.

---

### Phase 4 – Stats behavior (bug 13)

**Goal**

- Disable the counter animation for the “Show the numbers, not just promises” section on the Estate Agents page.
- Show `68%` and `42%` explicitly.

**Steps**

17. **Disable counter for that section**

    - Files:
      - `niches/estate-agents.html`
      - `src/js/stats.js` (verification)

    - HTML changes:
      - Locate the “Show the numbers, not just promises” section.
      - On its stats container, change:

        - `<div class="stats">` → `<div class="stats" data-counter="off">`

      - For the numbers:
        - 68:
          - Set inner text to `68%` instead of `0` or `68`:
            - `<div class="number" data-target="68">68%</div>`
        - 42:
          - Set inner text to `42%`:
            - `<div class="number" data-target="42">42%</div>`
        - 2:
          - Keep existing behavior, but render as `2x`:
            - `<div class="number" data-target="2" data-plus="x">2x</div>`

    - JS verification:
      - In `src/js/stats.js`, confirm logic respects `data-counter="off"` on the `.stats` container (it already skips such sections).
      - No code change is necessary unless the attribute handling is missing; if missing, explicitly add a check so sections with `data-counter="off"` don’t animate.

18. **Rebuild & sanity‑check Phase 4**

    - Run:
      - `npm run build:css`
      - `npm run build:js`
    - Confirm by reasoning:
      - Other stats sections (index, about) still animate as before.
      - On the Estate Agents page, the “Show the numbers, not just promises” section shows static text `68%`, `42%`, and `2x` with no counting animation.

---

## 5. Validation & completion checklist

At the end of the debugging run, Codex should confirm:

1. **Cards & neon styling**

   - All relevant cards now share the same background opacity and neon border as the “Transparent, Affordable Pricing” cards:
     - Index: “Streamline. Optimize. Succeed.” and “Our Services”.
     - About: “Our Values”, “Our Story”, “Our Mission”.
     - Estate Agents: hero feature cards and “Plug / Safe” cards.
     - Book: discovery call text card next to Calendly.

2. **Layout**

   - Index:
     - “Streamline. Optimize. Succeed.” cards form a horizontal row on desktop.
     - “Our Services” forms a 2×2 grid on desktop.
   - About:
     - “Our Values” cards form a horizontal row on desktop.
   - Estate Agents:
     - “Plug / Safe” cards form a horizontal row on desktop.
   - Contact:
     - Map + text fill their container in a balanced layout on desktop and mobile.
   - Navigation:
     - Services dropdown aligns with other desktop nav items.
     - Mobile Services pill matches other pills.

3. **Parallax & images**

   - Book:
     - Discovery call section uses parallax with the same background and overlay style as the index parallax sections.
   - Estate Agents:
     - Mobile background uses `book-hero-calendly-mobile-2025@*x.webp` as specified.
     - `Real_Estate_*` imagery uses mobile variants via `<picture>` on small screens.

4. **Stats**

   - “Show the numbers, not just promises”:
     - No counter animation.
     - Values are rendered as `68%`, `42%`, and `2x`.

5. **Build status**

   - `npm run build:css` and `npm run build:js` complete successfully.
   - Any issues with `npm test` are clearly documented but not treated as blocking unless the user alters the test script.

---

## 6. Outcomes & retrospective (to be updated by Codex)

After implementing all fixes, Codex should append a short summary here, for example:

- **Completed:**
  - Card theme alignment across index/about/estate/book.
  - Parallax alignment for Book and mobile background for Estate Agents.
  - Navigation alignment and contact layout polish.
  - Stats counter disabled and percentages rendered as requested.
  - Responsive `Real_Estate_*` images in place.

- **Risks / follow‑ups:**
  - Any remaining minor visual differences noted.
  - Any assumptions made due to ambiguous instructions (documented clearly).

This closes the bugfix ExecPlan for the current debugging cycle.
