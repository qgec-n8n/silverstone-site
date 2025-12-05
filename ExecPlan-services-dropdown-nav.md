# Add Services dropdown that keeps header expanded on hover

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Create a hoverable Services dropdown within the minimizing site header so desktop visitors can discover key service verticals without collapsing the header while they explore the dropdown. On mobile, tapping Services should open a full-screen services menu instead of a small dropdown, maintaining the premium overlay experience.

## Progress

 - [x] (2025-05-17 13:00Z) Initial codebase orientation and design reference notes.
 - [x] (2025-05-17 14:15Z) Implemented Services dropdown markup and desktop hover behaviour.
 - [x] (2025-05-17 14:40Z) Added mobile services overlay flow with navigation/back handling.
 - [x] (2025-05-17 15:05Z) Refinement pass on spacing, hover states, and header hide logic after visual QA.
 - [x] (2025-05-17 15:10Z) Final verification on all affected pages.

## Surprises & Discoveries

- The global stylesheet `assets/css/styles.css` is minified onto a single line; need to add structured CSS carefully to avoid breaking formatting.
- Header hide/show logic lives in `assets/js/script.js` with auto-hide timers tied to hover events on the header and indicator bar.

## Decision Log

- Decision: Implement desktop dropdown via CSS hover with supporting JS hover tracking to keep the header visible while the dropdown is hovered.
  Rationale: Minimizes JS complexity while satisfying requirement that the bar stays maximized over dropdown interactions.
  Date/Author: 2025-05-17 / Assistant

## Outcomes & Retrospective

- Desktop header now keeps Services visible with a hover-driven dropdown while respecting the minimize logic.
- Mobile Services tap opens a dedicated full-screen overlay of service links with a back control that returns to the main menu.

## Context and Orientation

- Shared navigation and header markup appears at the top of `index.html`, `about.html`, `services.html`, `book.html`, and `contact.html` with the same structure (logo, hamburger `.nav-toggle`, nav list).
- Header behaviour (auto-hide, indicator bar, mobile overlay) is implemented in `assets/js/script.js`, which also injects mobile navigation styles. The header minimizes by adding `.header-hidden` and uses `#header-indicator` to reveal it.
- Core styling, including header height and navigation layout, is defined in the minified `assets/css/styles.css`; responsive tweaks live in `assets/css/mobile.css`.
- Existing navigation links are plain list items; there is no dropdown styling yet.

## Plan of Work

1. Update navigation markup on all main pages to wrap the Services item in a dropdown trigger with arrow indicator and vertical submenu containing the provided service links. Ensure Services text remains visible alongside the arrow.
2. Add desktop CSS (in `assets/css/styles.css` or a suitable override file) to style the dropdown: vertical panel under the header, hover/focus states, arrow alignment, and z-index so it overlays content. Include transitions consistent with existing palette.
3. Extend JS (`assets/js/script.js`) to track pointer hover over the dropdown area so the header does not auto-hide while the user is over the dropdown or header. Ensure timers respect the new hover area.
4. Implement mobile-specific behaviour: tapping Services in the mobile overlay opens a full-screen services submenu with back control; reuse styles and animations consistent with the existing mobile nav overlay and ensure body scroll remains controlled.
5. Validate across `index.html`, `about.html`, `services.html`, `book.html`, and `contact.html` on desktop (hover) and mobile viewport widths, confirming header stays expanded during dropdown hover and auto-hides otherwise.

## Concrete Steps

- Edit HTML files with consistent navigation (`index.html`, `about.html`, `services.html`, `book.html`, `contact.html`) to introduce dropdown markup.
- Update `assets/css/styles.css` (and `assets/css/mobile.css` if needed) with dropdown layout and mobile overlay styles.
- Modify `assets/js/script.js` to manage hover tracking and mobile services submenu open/close.
- Run `npm test` or relevant checks if available; otherwise, manually reload pages in a browser to confirm layout and behaviour.

## Validation and Acceptance

- Desktop: load each main page, hover over Services to reveal vertical dropdown; moving cursor between the header and dropdown should keep the header maximized; moving away should allow auto-hide. Arrow indicator remains beside “Services”; submenu links are vertical.
- Mobile (<=768px): open hamburger menu, tap Services; observe transition to full-screen services menu with provided options; back/close returns to main nav; header auto-hide resumes when overlay closed.
- Confirm other nav links continue working, innovation gallery and marquees remain unchanged, and cookie banner/footer unaffected.

## Idempotence and Recovery

- HTML and CSS edits are additive; reapplying patches is safe if conflicts are resolved. If JS changes misbehave, revert `assets/js/script.js` to the previous version via git and reapply adjustments.
- Mobile overlay scripts only attach when nav elements exist; reload page after errors to restore baseline behaviour.

## Artifacts and Notes

- Capture hover state screenshots if visual tweaks are significant.
- Note any spacing or z-index adjustments applied to align with existing neon/glass aesthetic.

## Interfaces and Dependencies

- New dropdown uses classes like `.nav-item.dropdown`, `.dropdown-toggle`, `.dropdown-menu`, and `.services-overlay` referenced in CSS/JS.
- JS will rely on data attributes or class hooks on the Services trigger to open the mobile overlay and manage hover state; ensure selectors remain stable across pages.
