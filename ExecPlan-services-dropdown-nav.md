# Services dropdown refinement for minimising header

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` updated as you work. Maintain it in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Introduce a premium Services dropdown that keeps the word “Services” visible with a downward arrow, opens vertically on desktop without redirecting, and pins the minimising header open while active. On mobile, tapping the Services pill should open a secondary overlay of service pills instead of a horizontal dropdown. Visitors can navigate to each niche page from the dropdown without the header collapsing mid-interaction.

## Progress

- [x] (2025-12-05 17:32Z) Initial codebase orientation and design reference notes.
- [x] (2025-12-05 17:36Z) First implementation of navigation dropdown.
- [ ] (2025-12-05 17:36Z) Refinement pass on navigation after visual QA.
- [ ] (2025-12-05 17:36Z) Final verification on all affected pages.

## Surprises & Discoveries

- None yet.

## Decision Log

- Decision: Use inline arrow icon next to Services label rather than background image for clarity and accessibility.
  Rationale: Ensures text remains visible and arrow can animate to indicate open/closed state while matching existing typography.
  Date/Author: 2025-12-05 / assistant

## Outcomes & Retrospective

Pending implementation.

## Context and Orientation

- Core pages share the header markup around line ~328 in `index.html` with `header.site-header`, logo, hamburger `.nav-toggle`, and `nav ul` links for Home, About, Services, Book, Contact.
- `assets/js/script.js` controls the minimising header, mobile overlay menu, and adds a back button plus header indicator banner. Menu open state uses `nav ul.open`; header hide/show tied to `.header-hidden` class.
- Styles live primarily in `assets/css/styles.css` plus injected CSS within `assets/js/script.js` for nav and indicator behaviour. Mobile overlay styling is also injected at the bottom of the script.
- Existing behaviour: Services link is a standard anchor navigating to `services.html`; header auto-hides after delay and while scrolling on mobile unless the nav menu is open.

## Plan of Work

1. Update header navigation markup across shared pages (starting with `index.html` then replicating to other pages if shared markup exists) to wrap Services in a dropdown trigger containing an arrow icon and a nested list of service links (General + niches). Ensure desktop dropdown opens on click and does not navigate immediately.
2. Extend `assets/css/styles.css` (or suitable stylesheet) with styles for the Services dropdown: inline arrow beside label, vertical dropdown panel with premium styling, hover/focus states, and ensure Services label remains visible. Add mobile-specific overlay pill layout responsive adjustments.
3. Enhance `assets/js/script.js` to handle dropdown toggling: prevent default navigation on Services click, toggle dropdown open state, keep header from minimising while dropdown open (suppress hide schedules), and re-enable minimise when closed or navigating away. Add mobile behaviour to show a secondary overlay/panel with pill buttons for the service links.
4. Validate desktop: dropdown opens vertically, arrow indicates state, header remains expanded while dropdown open, clicking Services toggles open/close without redirect, links navigate correctly. Validate mobile: Services pill opens overlay with pill buttons; closing restores normal nav; header minimising resumes after leaving dropdown. Confirm shrink/indicator behaviours unaffected elsewhere.

## Concrete Steps

- Edit `index.html` header nav structure to include dropdown markup for Services with downward arrow indicator and nested service links.
- Mirror the updated nav markup to other top-level pages (`about.html`, `services.html`, `book.html`, `contact.html`, `book.html`, `privacy-policy.html` if applicable) to keep consistent header.
- Modify `assets/css/styles.css` to style the Services dropdown and mobile overlay pills; adjust existing nav styles if necessary for spacing and layering.
- Update `assets/js/script.js` to manage dropdown toggle state, prevent default navigation on Services trigger, coordinate with header hide/show logic, and implement mobile overlay behaviour.
- Run `npm test` or relevant build if available (none specified); perform manual HTML validation via browser preview where possible.

## Validation and Acceptance

- Desktop: open `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`. Scroll until header minimises, click Services; dropdown opens vertically beneath trigger, arrow rotates, Services text remains visible, header stays expanded. Hovering away or toggling closed allows header to minimise again. Each dropdown link navigates correctly.
- Mobile viewport (<=768px): open same pages, use hamburger to open overlay, tap Services pill; secondary overlay/panel appears with service pills stacked vertically/comfortably spaced. Tapping a pill navigates to its page and closes overlays; tapping Services again or nav back closes overlay and allows header minimising. Ensure body scroll lock still works and indicator bar behaviour unchanged.
- Check innovation gallery and marquees remain on existing parallax backgrounds; CTA banners, cookie banner, and footer untouched.

## Idempotence and Recovery

- Dropdown markup updates can be re-applied safely by re-copying the updated nav block across pages.
- CSS additions are additive; reverting involves removing the new dropdown rules.
- JS changes scoped to dropdown handling; revert by restoring original `assets/js/script.js`.
- If mobile overlay misbehaves, disable dropdown-specific logic to return to existing menu functionality.

## Artifacts and Notes

- Record any premium visual refinements (shadows, gradients) added to dropdown for future reuse.
- Capture notes on arrow animation timing or z-index adjustments if required to avoid overlap issues.

## Interfaces and Dependencies

- New CSS classes: e.g., `.nav-item--services`, `.services-dropdown`, `.services-trigger`, `.services-menu`, `.service-pill`, `.services-mobile-panel` (names to be finalised in implementation).
- JS hooks: data attributes or class checks to manage dropdown open state and to pause header auto-hide while active.
