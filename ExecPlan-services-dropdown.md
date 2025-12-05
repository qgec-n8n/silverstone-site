# Services dropdown and mobile overlay menu

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture
Create a Services dropdown in the global navigation that opens on hover, reveals a vertical list of niche links with a downward arrow indicator, and keeps the minimised header expanded while users move through the dropdown. On mobile, tapping Services should open a full-screen overlay menu instead of a hover dropdown, preserving the existing mobile overlay behaviour while exposing the Services sublinks in a dedicated view.

## Progress
- [x] (2025-05-06 00:15Z) Initial codebase orientation and design reference notes.
- [x] (2025-05-06 01:00Z) First implementation of navigation dropdown.
- [x] (2025-05-06 01:20Z) Refinement pass on navigation after visual QA (keyboard focus, resize handling, mobile panel polish).
- [x] (2025-05-06 01:30Z) Final verification on all affected pages.

## Surprises & Discoveries
- Existing mobile nav adds a back button via JS; added a dedicated Services back CTA so the dropdown overlay can use its own panel without conflicting with the injected control.

## Decision Log
- Decision: Use a dedicated mobile Services panel (within the nav overlay) triggered by tapping Services, hiding other nav items while showing the sublinks full-screen.
  Rationale: Meets the requirement for a full-screen overlay experience on mobile while keeping the minimised header steady and preventing accidental nav closure.
  Date/Author: 2025-05-06 / GPT-5.1-Codex-Max.

## Outcomes & Retrospective
- To be completed after implementation.

## Context and Orientation
- Shared pages use a fixed header with logo, nav links, and hamburger toggle inside `header.site-header` (e.g., `index.html` lines ~328+).
- Primary styles live in `assets/css/styles.css` (minified). Header sizing uses the `--headerH` variable; `.header-hidden` toggles slide-up behaviour.
- Navigation behaviour (header auto-hide, mobile overlay, indicator bar, menu toggle) is handled in `assets/js/script.js`. The script injects mobile nav styles and manages `nav ul.open`, `.nav-toggle` states, and a header indicator bar.
- Each page includes the same header markup and links (`Home`, `About`, `Services`, `Book`, `Contact`) without dropdowns.

## Plan of Work
1. Update navigation markup in the shared HTML headers (start with `index.html`, replicate to other pages) to wrap Services in a dropdown trigger element with a down arrow icon and nested submenu list of niche links.
2. Extend `assets/css/styles.css` with styles for the dropdown: positioning under the Services item, vertical layout, hover/focus behaviour, arrow styling, and preventing header minimisation while hovered.
3. Enhance `assets/js/script.js` to support desktop hover dropdown visibility (e.g., toggling a class on header/nav when hovering Services or submenu) and to keep the header visible while the dropdown is active. Add mobile logic so clicking Services within the mobile nav opens a full-screen submenu view (using existing overlay structure or a new panel) instead of hover interaction.
4. Validate on desktop (hover keeps header visible, dropdown vertical, indicator arrow present, Services label visible) and on mobile (Services tap opens overlay submenu page; links navigate; back/close works).

## Concrete Steps
- Edit HTML header nav lists in key pages (`index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`, `robots.txt` not applicable, etc.) to introduce dropdown structure for Services with arrow and submenu items.
- Modify `assets/css/styles.css` to add dropdown styling and interaction states, ensuring compatibility with existing header heights and hover states.
- Update `assets/js/script.js` to handle dropdown hover visibility, header locking while active, and mobile submenu toggle/overlay navigation.
- Run `npm test` if available or manual checks; open pages in browser for hover/tap verification.

## Validation and Acceptance
- On desktop, open pages and hover Services: arrow remains beside text, dropdown opens vertically beneath Services, links are clickable, and header does not minimise while pointer is over the Services item or dropdown.
- Move between header and dropdown; confirm header remains visible and does not auto-hide until pointer leaves dropdown region.
- On mobile viewport, tap hamburger, then tap Services: a full-screen overlay submenu appears showing niche links; header remains accessible; tapping a link closes overlay and navigates; back button returns to main nav if implemented.
- Ensure other nav links, header indicator, hero sections, marquees, galleries, and footer remain unchanged.

## Idempotence and Recovery
- HTML/CSS/JS edits are idempotent; reapplying patches is safe. If a change breaks layout, revert the specific file via `git checkout -- <file>` and reapply steps.

## Artifacts and Notes
- Capture snippets of dropdown CSS/JS in this plan after implementation if needed for future reference.

## Interfaces and Dependencies
- New CSS classes/selectors for dropdown trigger and menu will be defined in `assets/css/styles.css` and relied on by `assets/js/script.js` for hover/mobile logic.
- JS will likely add/remove a class (e.g., `services-dropdown-open` or similar) on `header` or `nav` to coordinate styling and header visibility.
