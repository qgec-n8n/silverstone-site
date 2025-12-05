# Services dropdown and first niche landing page (Real Estate)

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture
Enable visitors to open a stable Services dropdown that cooperates with the shrinking header and reach a new Real Estate niche page. Visitors should see a premium landing experience that mirrors the styling of existing pages while offering niche-specific copy and clear CTAs.

## Progress
- [x] (2025-12-04 22:05Z) Initial codebase orientation and design reference notes.
- [x] (2025-12-04 22:06Z) First implementation of navigation dropdown.
- [x] (2025-12-04 22:06Z) First implementation of Real Estate landing page.
- [x] (2025-12-04 22:07Z) Refinement pass on navigation and niche page after visual QA.
- [x] (2025-12-04 22:08Z) Final verification on all affected pages.

## Surprises & Discoveries
- Header uses `assets/js/script.js` to auto-hide with `header-hidden` class and a custom `#header-indicator` bar; nav overlay freezes scroll on mobile.
- Styles are compact/minified in `assets/css/styles.css`; nav menu uses `.nav-toggle`, `.nav-back-item`, and `.open` class on `nav ul` for mobile overlay.
- Research (web): Wikipedia notes estate agents manage selling/renting properties, need local market insight, handle marketing and valuations. Common pains inferred: missed viewings, slow lead response, manual compliance checks. (source: en.wikipedia.org/wiki/Estate_agent)
- Implemented dropdown styling/JS guardrails in `assets/css/styles.css` and `assets/js/script.js` to keep header visible while submenu is active.

## Decision Log
- Decision: Choose "Real Estate" niche from CSV (estate agents analogue).
  Rationale: Preferred niche aligned with prompt; present at top of CSV with multiple service SKUs.
  Date/Author: 2025-12-04 / Assistant
- Decision: Use button-based Services trigger with CSS/JS dropdown state to keep header visible while the submenu is open.
  Rationale: Prevents accidental navigation on tap, keeps “Services” label visible, and integrates with auto-hide behaviour.
  Date/Author: 2025-12-04 / Assistant

## Outcomes & Retrospective
- Pending after implementation and QA.

## Context and Orientation
- Core pages: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html` share a fixed header (`header.site-header`), hero with shader canvas, parallax sections, CTA cards (`.neon-card`), innovation gallery/marquees on `services.html`, and common footer/cookie banner.
- Header/navigation: markup in each page near top; nav list currently plain links (Home, About, Services, Book, Contact). Mobile uses `.nav-toggle` hamburger and overlay via `nav ul.open`. JS in `assets/js/script.js` manages auto-hide, indicator bar, mobile lock, and event listeners.
- Styles: `assets/css/styles.css` defines header layout, nav link styling, mobile menu animations, parallax backgrounds, CTA gradients, neon cards, proof grids, etc. Additional tweaks in `assets/css/custom-styles.css` for bullets.
- Best design patterns:
  - Cards: `.neon-card` feature and proof cards on `index.html` and `services.html`; service rows with image + copy on `services.html`.
  - Icon bullets: consistent lists in `services.html` feature blocks and proof lists, and book page benefit bullets.
  - CTA banners: brand gradient cards on `index.html`, `services.html`, `book.html` with centered heading, subtitle, primary button.
  - Images: socialmedia assets used in innovation gallery; hero uses canvas shader overlay for polish.
  - Background/parallax: sections use `parallax-section` with data theme; innovation gallery/marquees sit on same background in services page.

## Plan of Work
1. Navigation dropdown
   - Update header nav markup across core pages and new niche page: wrap Services item as dropdown trigger containing arrow indicator and submenu (General -> services.html; Real Estate niche link). Ensure "Services" text visible at all times.
   - Extend CSS in `assets/css/styles.css` minimally to style dropdown (positioning, z-index, hover/focus states, mobile nested list) consistent with existing nav typography; add attribute/class to pause header auto-hide when dropdown active if needed.
   - Update JS in `assets/js/script.js` to accommodate dropdown interaction with header auto-hide and mobile overlay (e.g., keep header shown while dropdown open, support touch toggles without flicker).
2. Niche landing page
   - Create `niches/real-estate.html` using shared header/footer/hero shader structure. Set unique hero `data-variant` and meta title/description including niche.
   - Copy proven patterns: hero CTA buttons, neon cards for pains, proof grid reused from services/about, CTA banner reused from brand gradient, bullet lists with icons, images from existing assets placed alongside sections. Include link back to services and pricing placeholder section.
   - Content tailored to Real Estate using CSV services: missed call saver, qualification bot, follow-up automation, landlord onboarding. Add named pack aligned to CSV (e.g., "Never Miss a Viewing Pack"). Include process steps and brief FAQs.
3. QA and refinement
   - Pass 1: implement dropdown and niche page per plan.
   - Critique: check spacing, contrast, icon consistency, dropdown stability with header auto-hide on scroll and mobile overlay.
   - Pass 2: refine CSS/JS and copy; ensure images integrated and CTA banner consistency. Validate innovation gallery/marquees unaffected on services page.

## Concrete Steps
- Edit/create files: `ExecPlan-first-niche-and-nav.md`, `assets/css/styles.css`, `assets/js/script.js`, `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `niches/real-estate.html`.
- Commands: `npm run build-css` if needed (styles already compiled), `npm test` not applicable; manual browser preview via `live-server` or VSCode Live Preview. Git status to track changes.

## Validation and Acceptance
- Open index, about, services, book, contact, and niches/real-estate pages in browser.
- Scroll to trigger header minimising; open Services dropdown via hover/click on desktop and tap on mobile widths. Verify:
  - Header stays visible/stable while dropdown open; Services label visible in both header states and mobile overlay.
  - Dropdown remains open when moving between trigger and menu; closes on outside click/blur appropriately.
- Check icon bullets appear for every item in niche sections and reused components; no mixed icon/plain lists.
- CTA banner on niche page matches brand gradient style and button styles from core pages.
- Innovation gallery/marquees on services page remain on same background and order unchanged.
- Cookie banner and footer structure intact across pages.
- Images on niche page are clear, not cropped awkwardly, and align with content.

## Idempotence and Recovery
- HTML edits are deterministic; reapplying patches is safe. If dropdown misbehaves, remove new classes/JS and restore previous nav list links (git checkout of files).
- If mobile overlay locks scroll due to script error, ensure `navMenu.classList.remove('open')` and body position reset; can reload page after fixing script.

## Artifacts and Notes
- Research snippet: Wikipedia overview of estate agents (responsible for marketing/selling/renting; need local knowledge).
- Note: nav overlay uses `.open` on `nav ul`; header auto-hide uses `header-hidden` class and `scheduleHeaderAutoHide()`.

## Interfaces and Dependencies
- Header behaviour depends on `header.site-header`, `.nav-toggle`, `nav ul` selectors; any dropdown classes should align with these.
- Potential new state flag (e.g., `data-nav-open="services"` or class on header/nav) may be referenced in JS to pause auto-hide.
- Hero shader initialised via `assets/js/hero-shader.js`; new niche page should include the script and `#hero-shader-canvas` with unique `data-variant`.
