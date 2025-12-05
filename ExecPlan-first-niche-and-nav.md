# Services dropdown + first niche page (estate agents)

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture
Enable visitors to open a stable, premium Services dropdown that respects the shrinking header while navigating to a new niche landing page for estate/real estate agents. Visitors should be able to access the niche page from the dropdown, read tailored copy, and book a 30-minute automation audit using familiar CTA patterns.

## Progress
- [x] (2025-12-04 22:05Z) Initial codebase orientation and design reference notes.
- [x] (2025-12-04 22:06Z) First implementation of navigation dropdown.
- [x] (2025-12-04 22:06Z) First implementation of Estate Agents landing page.
- [x] (2025-12-04 22:07Z) Refinement pass on navigation and niche page after visual QA.
- [x] (2025-12-04 22:08Z) Final verification on all affected pages.

## Surprises & Discoveries
- Research via DuckDuckGo surfaced estate agent pain points: inconsistent lead follow-up, manual paperwork/compliance, slow response to portal leads (Rightmove/Zoopla), staying top-of-mind with landlords and buyers; automation tools target missed-call capture, lead qualification bots, follow-ups, onboarding workflows, review capture (RealOffice360, HousingWire, Biz4Group summaries). Boutique inspiration searches yielded limited snippets; will lean on existing site patterns for premium feel.
- Header minimising behaviour is driven by `assets/js/script.js` (header indicator bar, auto-hide, mobile overlay) with `header-hidden` class and nav menu overlay on mobile; dropdown interactions must avoid triggering auto-hide while open.
- Core stylesheet is largely minified into a single line; added dropdown styles as an appended readable block to avoid disrupting existing rules.

## Decision Log
- Decision: Use “Estate Agents” as the human-facing label for the Real Estate niche from the service master list; slug `estate-agents`.
  Rationale: CSV lists Real Estate services targeting estate workflows (missed calls, viewings, landlord onboarding). Aligns with instruction preference for estate agents.
  Date/Author: 2025-12-04 / Assistant
- Decision: Re-use existing nav markup and extend CSS/JS minimally rather than new stylesheet; add dropdown inside current `nav ul` structure with arrow indicator following existing typography.
  Rationale: Maintain consistency with shared header and minimise risk to shrinking header.
  Date/Author: 2025-12-04 / Assistant
- Decision: Prevent header auto-hide while the Services dropdown is open by guarding `hideHeader` and auto-hide scheduling with dropdown state.
  Rationale: Keeps the “Services” label visible during hover/tap interactions and avoids flicker while moving between trigger and menu.
  Date/Author: 2025-12-04 / Assistant

## Outcomes & Retrospective
(To be completed after implementation and QA.)

## Context and Orientation
- Key pages: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html` share the same header (`header.site-header`), hero shader canvas, parallax sections, CTA banners, and footer. Cookie banner exists globally.
- Header/nav: Fixed header with logo, nav links, hamburger `.nav-toggle`, and `nav ul`. JavaScript in `assets/js/script.js` auto-hides the header using `header-hidden` class and shows a `#header-indicator` bar. Mobile menu uses `nav ul.open` overlay; body scroll is frozen when open. Links close menu on mobile.
- Design patterns to re-use:
  - Cards: neon cards on `index.html` (features/services) and `services.html` (service rows) with strong padding and contrast.
  - Icon bullet lists: `services.html` and `book.html` use `<ul>` with Font Awesome icons for every bullet.
  - CTA banners: centered neon CTA cards on `index.html`, `about.html`, `services.html` with consistent buttons.
  - Images: `services.html` innovation gallery + social images; `about.html` team imagery; ensure images sit within cards or aligned grids.
  - Backgrounds: parallax sections (`section bg-lines/bg-circuit animate parallax-section`) used on services/book; marquees and innovation gallery sit on same background.
- Niche source: `Silverstone_Service_Master_List.csv` lists Real Estate services (missed-call text-back, lead qual bot, follow-up, landlord onboarding) suitable for estate agents.

## Plan of Work
1. Navigation dropdown
   - Update header nav markup across shared pages (index, about, services, book, contact, new niche) to wrap “Services” in dropdown trigger with arrow indicator and submenu containing “General” (services.html) and “Estate Agents” (niche page). Maintain word visibility in minimized header.
   - Extend CSS (likely `assets/css/styles.css` and `assets/css/mobile.css` if needed) to style dropdown, align with existing nav typography, ensure z-index above content, and adjust hover/focus behaviours. Add data attribute/class to signal dropdown open for header auto-hide guard if necessary.
   - Update JS (`assets/js/script.js`) to integrate dropdown interactions with header auto-hide: pause hide while dropdown open, support hover/focus desktop and tap mobile within existing menu overlay.

2. Niche landing page (`niches/estate-agents.html`)
   - Base structure mirroring core pages: header, hero with shader (`data-variant` unique), parallax sections, CTA banner, footer, cookie banner.
   - Sections: hero with CTA; pains/problems using card/list pattern; productised pack using services from CSV; proof/benchmarks using neon proof cards; pricing placeholder section with id; process/FAQs reuse existing list styles; image placements (at least three) from existing assets.
   - Add link back to `services.html` and ensure nav dropdown links here.

3. Refinement pass
   - Review spacing, typography, icon consistency, image integration; adjust CSS/HTML for dropdown stability with header shrink and mobile overlay. Align CTA banner and bullet styles to canonical references.

4. Validation
   - Manual QA across `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, and `niches/estate-agents.html`: header auto-hide vs dropdown open, mobile overlay interaction, bullet icons per list, CTA consistency, parallax backgrounds intact, gallery/marquees unchanged, cookie banner visible, images properly framed.

## Concrete Steps
- Use `live-server` or browser preview to verify pages after edits (open HTML files locally).
- Run `npm run build-css` if needed (current setup uses static CSS; no build expected).
- Validate by opening pages in browser and interacting with nav/dropdown and sections; check console for JS errors.

## Validation and Acceptance
- Desktop: scroll to trigger header minimising; hover/click Services dropdown—ensure header stays visible while dropdown open and links hoverable; move cursor between trigger and menu without flicker.
- Mobile: open hamburger; tap Services to expand submenu; ensure body scroll frozen, dropdown stable until selection/tap away; closing restores auto-hide.
- Check CTA banners on all pages match existing styles; icon bullets present for all bullet lists; innovation gallery and marquees remain on same background with no new wrappers; cookie banner and footer unchanged.
- Niche page: hero text legible over shader; at least three relevant images well integrated; pricing placeholder present with semantic section id; link back to services; pack uses CSV-listed services only; proof benchmarks labelled as industry benchmarks.

## Idempotence and Recovery
- HTML edits are additive and can be repeated; if dropdown breaks header, revert to previous nav markup and remove dropdown-specific classes.
- JS changes isolated within `assets/js/script.js`; wrap new logic in guards to avoid affecting other pages. If issues arise, revert file and reapply commits.
- CSS additions appended near nav styles; safe to reapply.

## Artifacts and Notes
- Capture snippets of dropdown markup and CSS selectors in comments if helpful.
- Note images used for estate agents niche from `assets/images/socialmedia/`.

## Interfaces and Dependencies
- Potential new CSS class/data attribute to signal dropdown open (e.g., `data-nav-open="services-dropdown"`) consumed by header auto-hide logic.
- Dropdown markup inside existing `nav ul`; ensure mobile overlay styles respect submenu.
