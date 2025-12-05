# Services dropdown hover navigation and mobile overlay

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture
Add a Services dropdown to the main navigation that opens on hover for desktop while keeping the shrinking header stable. Ensure the Services label remains visible alongside a downward arrow. On mobile, tapping Services should present the service options in a full-screen overlay menu rather than the desktop hover dropdown. The dropdown items should stack vertically and not cause the header to minimize while in use.

## Progress
- [x] (2025-12-05 16:16Z) Initial codebase orientation and design reference notes.
- [x] (2025-12-05 16:21Z) First implementation of navigation dropdown.
- [x] (2025-12-05 16:22Z) Refinement pass on navigation after visual QA.
- [x] (2025-12-05 16:23Z) Final verification on all affected pages.

## Surprises & Discoveries
- None yet.

## Decision Log
- Decision: Use existing nav markup across all pages and enhance it with a Services dropdown list plus arrow indicator.
  Rationale: Keeps navigation consistent site-wide and aligns with shared header styles.
  Date/Author: 2025-12-05 / ChatGPT

## Outcomes & Retrospective
- Pending.

## Context and Orientation
- Key pages with shared header: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`, `sitemap.html` equivalents.
- Header structure: located near top of each HTML file, uses `<header class="site-header">` containing logo, `.nav-toggle`, and `<nav><ul>...</ul></nav>`.
- Styling: primary navigation styles live in `assets/css/styles.css`; mobile-specific overrides in `assets/css/mobile.css`. Header hide/show and nav overlay behaviour implemented in `assets/js/script.js`.
- Header behaviour: JavaScript auto-hides header, shows indicator bar, and controls mobile overlay. Hamburger `.nav-toggle` toggles full-screen overlay on mobile.
- Visual canon: follow typography and card styling seen on `index.html` and `services.html`.

## Plan of Work
1. Update nav markup on all main pages to wrap Services in a dropdown trigger with arrow indicator and vertical submenu list of provided service categories.
2. Extend CSS in `assets/css/styles.css` (desktop) and `assets/css/mobile.css` (mobile) to style dropdown, arrow alignment, hover behaviour, and prevent header minimization while hovered.
3. Enhance `assets/js/script.js` to keep header visible while interacting with the dropdown and route mobile Services taps to a full-screen overlay submenu without disrupting existing overlay behaviour.
4. Verify dropdown opens on hover, aligns vertically, arrow visible, header stays expanded during interaction, and mobile Services link opens submenu overlay.

## Concrete Steps
- Edit HTML nav sections in each primary page to add dropdown structure and submenu links.
- Add desktop dropdown styles, arrow indicator, and hover behaviour to `assets/css/styles.css`.
- Add mobile submenu overlay styling to `assets/css/mobile.css` if needed for full-screen service list.
- Update `assets/js/script.js` to manage header visibility during dropdown hover and to present the Services submenu overlay on mobile.
- Run `npm test` or available checks if present; otherwise verify with manual inspection.

## Validation and Acceptance
- Desktop: Hover Services on each page. Dropdown appears vertically beneath Services, header remains visible (no minimization), arrow stays next to Services text, and submenu links are navigable. Moving cursor between header and dropdown should not hide header until leaving dropdown area.
- Desktop: Scroll to trigger minimized header; hover indicator then Services to ensure dropdown still accessible and header stays open during use.
- Mobile (responsive emulator): Open hamburger. Tap Services; expect full-screen overlay or submenu view listing service options vertically. Navigation bar should not auto-hide while submenu open. Back navigation or closing returns to main menu/page.
- Regression: Verify marquee backgrounds, CTA banners, innovation gallery, cookie banner, and footer remain unchanged. Confirm bullet lists still use correct icons and no new parallax layers added.

## Idempotence and Recovery
- HTML edits are additive and repeatable; reapply the same snippet across pages to resync navs.
- CSS additions append new classes; re-running steps is safe because selectors are scoped.
- JS updates are confined to dropdown/mobile logic; reverting file restores prior behaviour. If overlay misbehaves, remove new event handlers and classes.

## Artifacts and Notes
- Record any key CSS selectors, JS functions, or HTML snippets used for the dropdown and mobile overlay once implemented.

## Interfaces and Dependencies
- New dropdown classes (e.g., `.nav-item-dropdown`, `.services-dropdown`, `.dropdown-arrow`) and JS hooks for tracking dropdown hover state.
- Mobile submenu overlay may use a dedicated container/class toggled by JS when Services tapped within mobile overlay.
