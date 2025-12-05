# Premium Services dropdown navigation overhaul

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Enable visitors to open a premium Services dropdown from the header without being redirected immediately. Desktop users should see a vertical dropdown with a clear chevron indicator and the header should remain maximized while the menu is open. Mobile users should receive a refined overlay showing service pills when tapping Services in the mobile nav.

## Progress

- [x] (2025-12-05 17:30Z) Initial codebase orientation and design reference notes.
- [x] (2025-12-05 17:34Z) First implementation of navigation dropdown.
- [ ] (....) Refinement pass on navigation after visual QA.
- [ ] (....) Final verification on all affected pages.

## Surprises & Discoveries

- Base navigation styles live in a largely minified `assets/css/styles.css`, so new dropdown styling was appended as a formatted
  block near the end for clarity.

## Decision Log

- Decision: Implement dropdown purely with existing HTML/CSS/JS without new pages.
  Rationale: Keeps shared header consistent across pages and avoids new templates.
  Date/Author: 2025-12-05 / Assistant
- Decision: Split desktop dropdown and mobile overlay behaviours while sharing the same link list classes.
  Rationale: Delivers vertical dropdown on large screens and pill overlay on small screens without duplicating logic.
  Date/Author: 2025-12-05 / Assistant

## Outcomes & Retrospective

_To be completed after implementation._

## Context and Orientation

- Core pages use a shared header defined inline in each HTML (e.g., `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`). The nav includes Home, About, Services, Book, and Contact links.
- Navigation behaviour, the minimising header, mobile overlay, and indicator bar are controlled by `assets/js/script.js` with corresponding styles in `assets/css/styles.css`, `assets/css/mobile.css`, and dynamic styles injected by `script.js`.
- The header hides on scroll (especially on mobile) and can be reopened via the hamburger toggle. Nav items live inside `nav ul` with a prepended Back button for the overlay.
- Design reference: hero and CTA styling on `index.html` and `services.html` provide the premium look to match.

## Plan of Work

1. Update header markup in all core pages to convert the Services link into a dropdown trigger with an arrow indicator while keeping the Services label visible. Add desktop dropdown list items for the provided niches.
2. Extend `assets/css/styles.css` (and mobile overrides if needed) to style the Services dropdown: vertical list, premium glassmorphism, hover states, arrow alignment, and animations. Ensure desktop dropdown locks header minimisation while open.
3. Enhance `assets/js/script.js` to manage dropdown interactions: open on click without navigation, toggle arrow state, prevent header auto-hide while open, and close on outside click or when selecting another page. Implement mobile behaviour that opens a secondary overlay/panel with pill buttons for services.
4. Validate across desktop and mobile breakpoints ensuring header minimising behaviour respects the dropdown state and Services remains visibly labeled with the arrow.

## Concrete Steps

- Edit HTML headers (`index.html`, `about.html`, `services.html`, `book.html`, `contact.html`) to wrap Services in a dropdown structure and add the dropdown menu markup.
- Modify `assets/css/styles.css` and, if necessary, `assets/css/mobile.css` to style the dropdown and service pills.
- Update `assets/js/script.js` to manage dropdown state, integrate with existing header hide/show logic, and differentiate desktop vs mobile behaviour.
- Run `npm test` (if available) or manual validation via local preview.

## Validation and Acceptance

- Open each core page in a browser. Scroll to trigger header minimisation, then click Services:
  - Desktop: Services shows a downward arrow, dropdown opens vertically beneath the nav, header stays expanded, and Services click does not navigate. Clicking again or navigating away closes it and restores minimising.
  - Desktop dropdown links navigate to the specified pages. Hover states feel premium.
  - Mobile: tapping Services in the overlay opens a secondary panel with pill-style buttons for all service links; Services label remains visible with arrow; closing overlay or selecting a page restores normal behaviour.
- Confirm other nav items function normally and the hamburger toggle still opens/closes the overlay.
- Verify innovation gallery, marquees, CTA banners, cookie banner, and footer remain unchanged visually.

## Idempotence and Recovery

- Each HTML edit can be re-applied safely; search for the Services nav item to adjust markup if needed.
- CSS additions are additive; removing new classes reverts dropdown styling.
- JS changes are scoped; revert `assets/js/script.js` to previous commit if dropdown behaviour misfires.

## Artifacts and Notes

- Document any new classes such as `.nav-dropdown`, `.services-toggle`, `.services-menu`, and JS data attributes used to track open state.

## Interfaces and Dependencies

- New JS functions/handlers for Services dropdown will interact with existing header show/hide utilities in `assets/js/script.js`.
- CSS depends on existing colour variables (`--color-green`, `--color-blue`, `--glass-bg`) from `assets/css/styles.css`.
- HTML structure assumes `nav ul` remains the parent for nav items and the mobile overlay styling in `script.js` applies to the updated markup.
