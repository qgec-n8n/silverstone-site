# ExecPlan – silverstone-niches

## Purpose / Big Picture
Deliver niche-specific landing pages and a reworked general services hub so visitors immediately see tailored automation offers per industry. After the change, opening `services.html` should show a general overview plus links to every niche page, and the “Services” nav item should expose a dropdown listing General + all niches. Each niche page should mirror the site’s hero/parallax aesthetic, include a unique shader variant, and surface niche-tailored packs and CTAs.

## Progress
- [x] (2025-12-04 18:20Z) Reviewed repository guidance in `AGENTS.md` and `.agent/PLANS.md`; identified need for an ExecPlan.
- [x] (2025-12-04 18:25Z) Parsed `Silverstone_Service_Master_List.csv` to extract niches (Dentists; Fitness Influencers/Online Coaches; Gym Owners; Hospitality; Physios/Chiropractors; Real Estate; Salons; Trades; eCommerce).
- [x] (2025-12-04 18:35Z) Audited current navigation markup in `index.html` and header behaviour in `assets/js/script.js` to understand constraints for dropdown integration.
- [x] Derive research-backed pains/outcomes per niche and fold into copy decisions (leaned on CSV service intents and widely reported industry benchmarks; web search attempts were limited by captchas).
- [x] Design and implement niche landing pages under `/niches/` with hero shader variants, parallax layout, proof, process, FAQs, and pricing placeholders.
- [x] Overhaul `services.html` into the general services hub with parallax structure, niche chooser, and pricing placeholder.
- [x] Implement Services dropdown across pages (desktop hover/tap, mobile tap) while preserving header hide/show behaviour.
- [x] Final consistency sweep, update ExecPlan sections, and prepare TODO handover.

## Surprises & Discoveries
- Initial web searches via Google/DuckDuckGo triggered bot checks; relied on text-only proxies (e.g., Wikipedia) and widely cited industry benchmarks to inform pain points without overstating promises.
- Navigation script (`assets/js/script.js`) manages a mobile overlay and auto-hide header; dropdown interactions must avoid triggering the auto-hide while open.

## Decision Log
- **Decision:** Use `/niches/<slug>.html` naming derived from CSV Niche values in kebab case (e.g., `real-estate.html`, `physios-chiropractors.html`). Rationale: predictable linking from dropdown and services hub. Date/Author: 2025-12-04 / Codex.
- **Decision:** Add a dedicated stylesheet `assets/css/niches.css` to scope layout tweaks for niche pages without disturbing existing pages. Date/Author: 2025-12-04 / Codex.
- **Decision:** Move Services dropdown styling into `assets/css/custom.css` and implement a button-driven dropdown so header auto-hide stays paused while open. Date/Author: 2025-12-04 / Codex.
- **Decision:** Use the `book` parallax theme for the redesigned `services.html` body so all new sections scroll over the Calendly background consistently with niche pages. Date/Author: 2025-12-04 / Codex.

## Outcomes & Retrospective
- Built nine niche landing pages with unique shader variants, parallax layout, proof, process, FAQs, and pricing placeholders (`pricing-<slug>-root`).
- Redesigned `services.html` into a general hub with cross-niche categories, niche chooser grid, how-it-works steps, proof, and `pricing-services-root`, keeping innovation gallery + marquee intact.
- Implemented a Services dropdown across all pages with JS to pause header auto-hide while open; dropdown styling consolidated into `assets/css/custom.css`.
- Remaining: final QA sweep and future integration of React-based pricing components.

## Context and Orientation
- Key files: `index.html` (baseline header/hero), `services.html` (current services layout to be redesigned), `book.html` (reference parallax sections over Calendly background), `assets/js/script.js` (header/nav logic), `assets/css/styles.css` and `assets/css/custom.css` (global styling), `assets/images/socialmedia/` (available imagery), `Silverstone_Service_Master_List.csv` (niche and service inventory).
- Navigation: header contains a basic `<nav><ul>` list; `assets/js/script.js` adds mobile overlay, header indicator, and auto-hide/show behaviour. Dropdown must integrate without breaking overlay behaviour.
- Visual system: uses hero shader canvas (`hero-shader.js`), parallax sections, neon cards. New content should respect existing colour palette/typography and use Calendly parallax background like `book.html`.

## Plan of Work
1. **Research pains/benchmarks**: Use text-friendly sources to capture common issues/outcomes for the nine niches (missed calls/viewings, no-shows, cart abandonment, patient reminders, class reactivations, etc.). Summarise findings for copy tone.
2. **Define niche slugs & metadata**: Map CSV niches to kebab-case filenames, set page titles/meta descriptions, and choose unique `data-variant` values for hero shader.
3. **Niche page template**: Base on existing page skeleton (header + hero shader + parallax body + footer) with sections: hero CTA, pains, productised pack bullets drawn from CSV services, proof/benchmarks, pricing placeholder (`pricing-<slug>-root`), process/FAQs, link back to general services. Use parallax background and at least three on-brand images from `assets/images/socialmedia/` per page.
4. **Styles**: Create `assets/css/niches.css` for layout tweaks (parallax spacing, image grids, cards) using existing colour tokens; minimal changes, no new fonts/colours.
5. **General services hub**: Redesign `services.html` to focus on broad services, cross-niche categories, a niche chooser linking to each landing page, how-it-works steps, proof, and pricing placeholder (`pricing-services-root`). Keep double marquee and innovation gallery contiguous with final CTA/footer; ensure all new body content sits inside parallax container over Calendly background.
6. **Navigation dropdown**: Convert Services nav item into dropdown listing General + all niches; add arrow indicator and accessible hover/focus/tap behaviour. Update JS/CSS as needed so dropdown works on desktop hover and mobile tap within existing overlay, and header does not auto-hide while dropdown open.
7. **Consistency & links**: Ensure every niche page linked from dropdown and services hub; add “Back to all services” links on niche pages; verify footer matches core pages.
8. **Validation**: Manual checks across key pages for dropdown behaviour (desktop/mobile), hero shader variants, parallax layout, image presence, CTA links, and placeholder pricing containers.

## Concrete Steps
- Use `python` to confirm niche list from `Silverstone_Service_Master_List.csv` and derive slugs.
- Create `assets/css/niches.css` with scoped styles for niche sections, image rows, and dropdown adjustments if needed.
- Build niche pages in `niches/` by copying a core page skeleton (header/hero/parallax/footer) and adjusting content per niche.
- Rewrite `services.html` sections inside the parallax container to serve as the general hub, adding niche chooser grid and pricing placeholder.
- Update nav markup across shared header (all pages touched) to introduce dropdown, and extend `assets/js/script.js` to handle dropdown open/close alongside existing overlay logic.
- Run `npm test` if available (none expected); otherwise, manual browser preview of key pages.

## Validation and Acceptance
- Open `index.html`, `services.html`, and each `niches/<slug>.html` in a browser:
  - Services nav shows dropdown with General + nine niche links; desktop hover/focus opens dropdown; mobile tap works within overlay; header does not auto-hide while dropdown active.
  - Each niche page: unique hero shader `data-variant`, H1/meta mention niche, at least three relevant images, pains/pack/proof/process/FAQ sections within parallax background; contains `pricing-<slug>-root` placeholder and link back to services.
  - `services.html`: hero positions as general overview; general service categories; niche chooser grid with links; how-it-works; proof/CTA; pricing placeholder `pricing-services-root`; parallax over Calendly background; double marquee + innovation gallery remain adjacent before final CTA/footer.

## Idempotence and Recovery
- All edits are manual; if an error occurs, reset with `git checkout -- <file>` for specific files or `git reset --hard` for full rollback before recommitting.
- Stylesheet addition is independent; removing `assets/css/niches.css` references reverts niche-specific styling.
- Navigation changes can be reverted by restoring header/nav snippets from previous commit.

## Artifacts and Notes
- Use consistent icon treatment within rows/lists (no mixed icon/plain bullets). Reuse `.neon-card` and parallax sections for premium feel.
- Ensure hero shader canvas includes unique `data-variant` per niche; update `hero-shader.js` only if new variants need mapping.

## Interfaces and Dependencies
- Niche filenames: `niches/<kebab-niche>.html` derived from CSV Niche values listed above.
- Pricing placeholders: `pricing-root` (index), `pricing-services-root` (services hub), `pricing-<niche-slug>-root` (each niche page).
- Dropdown hooks: nav `<li>` for Services will host dropdown; JS must coordinate with `.nav-toggle` overlay and header auto-hide logic.
