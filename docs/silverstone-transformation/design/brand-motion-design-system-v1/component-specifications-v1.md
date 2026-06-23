# Silverstone component specifications v1

**Status:** Authoritative proposal  
**Scope:** `/web/src/components`, `/web/src/features`, route composition and integration shells.  
**Rule:** every component consumes semantic tokens, supports keyboard completion, exposes loading/empty/error states, and assigns animation to exactly one owner.

## Global component contract

Each component documents: anatomy, variants, states, responsive behaviour, semantics, motion owner, analytics boundary, and acceptance evidence. Presentational components do not import provider SDKs. Integration shells receive adapters and render accessible fallback UI. Decorative motion never delivers content.

## 1. Navigation

**Anatomy:** skip link, brand link, primary nav list, disclosure triggers, nested link lists, theme control placeholder, primary CTA, mobile trigger, mobile panel.

**Proposal:** use semantic `nav`, lists, links, and disclosure buttons rather than `menu`/`menubar` roles for ordinary site navigation. The WAI example notes that typical site navigation does not need the complex menu-role interaction model. [S8]

States: default, current route (`aria-current="page"`), hover, focus, dropdown open, mobile open, compact-on-scroll, loading-safe. Escape closes open disclosure; focus leaving the navigation closes it; Tab order remains native. [S8]

Responsive: desktop navigation from `lg`; mobile panel below `lg`; no horizontal scrolling nav. Sticky header must not obscure focused content. Motion owner: Framer Motion for mobile panel/disclosure presence; CSS for hover/focus; native browser for sticky and scroll.

## 2. Buttons and links

Variants: primary, secondary, accent, ghost, text, destructive; sizes 44, 48, 56px; icon-only minimum 44×44 preferred. Anatomy: label, optional leading/trailing icon, spinner, status text. Loading preserves width, sets `aria-busy`, and prevents duplicate submission without removing focus. Disabled is reserved for truly unavailable actions; explain why when consequential. CSS owns hover/focus/press transitions.

## 3. Cards

Families: editorial, service, industry, proof, metric, article, demo launcher. A card is not automatically clickable; when the whole card navigates, use one stretched anchor and keep nested actions outside it. Variants: flat, raised, bordered, glass, dark. Motion: CSS lift up to 4px on fine-pointer hover; Framer Motion only for entry/exit or reorder; no GSAP ownership on card internals.

## 4. Service modules

Anatomy: eyebrow, outcome-led heading, summary, capability list, proof placeholder, media/demo, CTA group. Variants: split, compact, featured, dark. Responsive: split at `lg`; copy first below. Required states: evidence-pending badge, demo unavailable fallback, media failure. No quantified claim ships without claim-ledger status.

## 5. Industry modules

Anatomy: industry label, pain pattern, workflow transformation, safeguards, representative outcomes, proof placeholder, CTA. Variants: overview card, route hero, comparison row. Avoid generic icon-only differentiation; headings remain explicit. Motion: section-level GSAP may orchestrate the module container; internal state remains Framer/CSS.

## 6. Hero systems

Variants: narrative split, demo-led, editorial, service, industry, conversion. Anatomy: eyebrow, H1, lead, CTA group, trust/proof placeholder, visual stage, fallback image. The H1 and primary CTA exist in initial HTML. Decorative shader/GSAP loads after static content passes accessibility/performance gates. Text overlay has a solid/controlled contrast surface. Reduced motion uses static composition, no parallax, no auto-cycling.

## 7. Forms

Anatomy: form heading, instructions, labelled fields, hint, required marker text, inline error, summary/status region, privacy/consent, submit, alternate contact. Labels remain visible; placeholders are examples only. Errors identify the field and correction. Pending, success, failure, timeout and offline states are required. Focus moves to error summary only on submit failure, not on every validation event. CSS owns field transitions; Framer may own status-panel presence.

## 8. Calendly shell

Integration adapter boundary only. Anatomy: explanatory copy, reserved embed frame, privacy note, loading skeleton, load action where consent requires, fallback `/contact` link, failure message. Reserve height/aspect space to limit CLS. Do not trap focus inside a decorative wrapper. Staging cannot create production bookings. Motion: CSS skeleton; no GSAP; Framer only for fallback/status replacement.

## 9. Demos

Types: guided workflow, interactive calculator, before/after process, synthetic conversation, dashboard preview. Every demo has a static summary, explicit start/reset, keyboard path, deterministic seed where applicable, and no production data. Autoplay is off by default when comprehension depends on pace. GSAP may own a bounded guided timeline after explicit start; Framer owns controls/state; CSS owns micro-interactions.

## 10. Accordions

Use native button semantics inside appropriate headings; expose `aria-expanded` and `aria-controls`. Enter/Space toggles; Tab/Shift+Tab remain in normal sequence. Optional arrow-key navigation is not required. [S7] Framer Motion owns panel height/opacity; reduced motion switches instantly or uses the reduced 80ms fade; CSS owns header hover/focus.

## 11. Breadcrumbs

Use named `nav`, ordered list, current item text or `aria-current="page"` link. Collapse middle items only when the full hierarchy remains available via an accessible disclosure. No auto-scrolling marquee. CSS only.

## 12. Proof placeholders

Types: client logo slot, testimonial slot, metric slot, certification slot, case-study slot. Until approved evidence exists, render neutral labelled placeholders in non-production review builds or omit the module in public output. Never fabricate logos, numbers, quotes, ratings, or partner marks. No motion beyond CSS hover on linked approved proof.

## 13. Logo carousel

Preferred implementation is a static wrapping grid. Use a carousel only when volume demands it. It must have labelled previous/next controls, pause/stop for any auto movement, keyboard operation, visible focus, and a non-animated reduced-motion presentation. Essential logos have text alternatives; decorative duplicates use empty alt. Native scrolling owns user movement; CSS scroll-snap may assist; no scroll hijacking; GSAP is prohibited.

## 14. Footer

Anatomy: brand statement, primary link groups, contact/legal links, social placeholders, newsletter only if approved, copyright. Use semantic headings/lists and a footer landmark. Mobile groups may become accordions only when the full link set remains discoverable. CSS for hover/focus; Framer only if collapsible mobile groups are adopted.

## 15. Loading, empty and failure states

- **Loading:** reserve geometry, announce only meaningful waits, avoid perpetual shimmer under reduced motion.
- **Empty:** explain why no content exists and provide a next action.
- **Recoverable failure:** identify failure, preserve entered data where safe, provide retry and fallback.
- **Fatal route failure:** retain site shell, meaningful heading, route-safe navigation and contact path.
- **Media failure:** show neutral surface and meaningful alt/caption; never collapse critical copy.
- **Offline:** state that connection is required for integrations; core content stays available.

Status messages that do not move focus use an appropriate live region. Avoid repeated announcements from rapidly changing decorative progress.

## 16. Component acceptance template

For every exported component, F-03/I-series evidence must include:
1. Story or fixture for every variant/state.
2. Keyboard walkthrough and focus screenshot.
3. Light/dark contrast result for consumed tokens.
4. 320px and 400% reflow result.
5. Reduced-motion result.
6. Ownership declaration: `css`, `framer`, `gsap`, or `native` per animated property.
7. Loading/failure fallback where data or provider dependent.
8. Bundle delta and cleanup check.

## Sources
- **[S3]** [Understanding SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- **[S7]** [WAI-ARIA APG Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- **[S8]** [WAI-ARIA APG Disclosure Navigation Example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
