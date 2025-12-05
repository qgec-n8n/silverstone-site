# Services dropdown behaviour across desktop and mobile navigation

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Enable visitors to access a dedicated Services dropdown from the site header. On desktop, hovering “Services” reveals a vertical dropdown with niche links and keeps the header visible while navigating the menu. On mobile, tapping “Services” inside the overlay should open a full-screen submenu panel instead of a hover dropdown. The Services label remains visible alongside a downward arrow indicator.

## Progress

- [x] (2025-12-05 16:20Z) Initial codebase orientation and design reference notes.
- [x] (2025-12-05 16:45Z) Implement Services dropdown structure and desktop hover behaviour.
- [x] (2025-12-05 16:45Z) Implement mobile Services submenu overlay behaviour.
- [x] (2025-12-05 16:55Z) Refinement pass after visual QA across key pages.
- [x] (2025-12-05 17:00Z) Final verification on all affected pages.

## Surprises & Discoveries

- The navigation/header behaviour is centralised in `assets/js/script.js`, which handles header auto-hide, overlay nav, and injected CSS. Mobile overlay already adds a back button via JS.
- Header hide/show relies on `header` mouseenter/mouseleave plus auto-hide timers; hiding while interacting with an external dropdown will require a lock or guard.

## Decision Log

- Decision: Reuse existing nav `<ul>` across all pages and add a Services dropdown list within the header markup to avoid duplicating structures elsewhere.
  Rationale: Ensures consistent styling and allows shared JS to manage hover and mobile behaviours.
  Date/Author: 2025-12-05 / Assistant

## Outcomes & Retrospective

_To be filled after implementation and QA._

## Context and Orientation

- Key pages with the shared header: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`, `robots.txt` not relevant, but the header repeats across main HTML pages. Navigation currently lists Home, About, Services, Book, Contact.
- Stylesheets: global styling in `assets/css/styles.css`; responsive tweaks in `assets/css/mobile.css`; additional overrides in `assets/css/custom-styles.css` and other assets. Navigation overlay styles are also injected via `assets/js/script.js`.
- JavaScript: `assets/js/script.js` controls header auto-hide, hamburger overlay, indicator bar, and inserts a mobile nav back button.
- Behaviour: Header auto-hides after a delay and on mobile scroll; hovering header shows it again. Mobile nav uses full-screen overlay triggered by hamburger; nav links close the overlay on click.

## Plan of Work

1. Update header markup across all main pages to wrap the Services item in a dropdown trigger with a downward arrow and nested list of niche links. Ensure semantic structure supports hover and mobile JS hooks.
2. Add CSS in `assets/css/styles.css` (and `assets/css/mobile.css` if needed) for desktop dropdown: vertical panel, hover-open, arrow alignment, and prevent header from shrinking while interacting.
3. Extend `assets/js/script.js` to:
   - Manage header hide/show lock while hovering the dropdown on desktop.
   - Handle Services click on mobile to open a full-screen submenu overlay (using a class on the nav menu) and provide a back control to return to main nav.
   - Keep Services text visible with an inline arrow icon.
4. Perform refinement/QA across `index.html`, `about.html`, `services.html`, `book.html`, and `contact.html` to ensure dropdown hover works, header remains visible during dropdown navigation, and mobile submenu opens full screen then closes properly.

## Concrete Steps

- Edit HTML: update nav markup in each main page header (`index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`) to include Services dropdown structure with arrow indicator and submenu links.
- Edit CSS: add dropdown styling to `assets/css/styles.css`; add mobile overlay styles or adjustments to `assets/css/mobile.css` if required.
- Edit JS: adjust header auto-hide logic and add Services-specific hover/mobile overlay handling in `assets/js/script.js`.
- Validation commands: open local HTML previews (e.g., with `npx http-server` or similar if needed) and run `npm test` if present (likely none). Manual QA in browser: desktop hover behaviour, header stays visible when moving into dropdown, mobile overlay toggles into services submenu.

## Validation and Acceptance

- Desktop: Hover “Services” and confirm arrow remains beside text, dropdown appears vertically with provided niche links, and header does not minimize while pointer moves between nav bar and dropdown. Moving away should allow header to auto-hide normally.
- Desktop pages: Confirm dropdown available on `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, and privacy page; header/minimize behaviour unchanged elsewhere.
- Mobile: Open hamburger menu, tap “Services” to see a full-screen overlay submenu with the niche links; include a back control to return to main nav without closing overlay entirely. Ensure body scroll lock persists while submenu is open.
- Ensure dropdown closes or hides appropriately when overlay closes or when user taps another nav item.
- No disruption to cookie banner, marquees, CTA banners, or parallax sections.

## Idempotence and Recovery

- HTML edits are additive; reapplying patches is safe as long as markup remains consistent. If conflicts arise, reinsert the dropdown `<li class="nav-services">` structure in each page’s nav list.
- CSS additions are scoped to new classes; safe to re-run without side effects. Remove or comment out new selectors to revert.
- JS changes guarded by feature classes; remove the services-specific handlers and class toggles to roll back.

## Artifacts and Notes

- After implementation, capture notes on hover-lock logic and mobile submenu class names for future maintainers.
- Document any screenshots or console logs used for validation.

## Interfaces and Dependencies

- New CSS classes: `.nav-services`, `.nav-arrow`, `.services-dropdown`, `.services-overlay-open`, `.services-submenu-panel`, `.services-submenu-back` (final names TBD during implementation).
- JS hooks: event listeners on `.nav-services > a` for desktop hover lock and mobile submenu activation; header auto-hide guard using a hover lock flag.
