# ExecPlan – Silverstone Niche Landing Pages and Services Hub

## Purpose / Big Picture
Deliver premium, niche-specific landing pages derived from the service master CSV, redesign `services.html` into a general services hub, and convert the Services nav item into a dropdown linking to all niches. Visitors should be able to open `services.html` for a general overview, pick their niche from the dropdown or the hub, and land on tailored pages that use the existing hero shader and parallax patterns. Success is visible by loading any page locally (e.g. `index.html`, `services.html`, or `/niches/<slug>.html`) and seeing the new navigation, hero shaders, parallax content, and CTA flows.

## Progress
- [x] (2025-12-04 17:59Z) Read AGENTS and PLANS guidelines; confirmed ExecPlan needed.
- [x] (2025-12-04 18:05Z) Attempted web research for niche pains/outcomes; external search blocked (403), will rely on industry knowledge and accessible references.
- [x] (2025-12-04 18:10Z) Derived niche list from `Silverstone_Service_Master_List.csv` and drafted slug/variant naming approach.
- [x] (2025-12-05 10:15Z) Implemented Services dropdown markup/styling/JS across core pages; added navigation stylesheet.
- [x] (2025-12-05 10:25Z) Added shared niche styling in `assets/css/niches.css` and introduced hero shader variants.
- [x] (2025-12-05 10:35Z) Redesigned `services.html` as general services hub with parallax sections, niche grid, process, proof, and pricing placeholder `pricing-services-root` while preserving marquee + gallery + CTA ordering.
- [x] (2025-12-05 10:50Z) Created niche landing pages for all CSV niches with hero shaders, parallax structure, pains, packs, proof, process/FAQ, pricing placeholders, and back-to-services links.
- [x] (2025-12-05 11:10Z) Validated pages for dropdown inclusion, parallax usage, pricing placeholders, and duplicate CSS links; fixed duplicate icons CSS link on services hub.
- [x] (2025-12-05 11:25Z) Updated Outcomes/Retrospective and prepared TODO handover notes.

## Surprises & Discoveries
- Web search attempts (DuckDuckGo via curl/Playwright) returned 403 or empty responses, indicating outbound search restrictions. Will leverage industry knowledge and available on-site assets for copy inspiration.
- Social media image library already includes sector-themed assets (real estate, hospitality, salon, trades, dental, fitness, ecommerce), reducing need for new graphics.

## Outcomes & Retrospective
- Delivered navigation dropdown with supporting CSS/JS across all main and niche pages; Services now expands to list General plus every CSV-derived niche.
- Added niche styling and shader variants, built nine niche landing pages with parallax layout, proofs, process, pricing placeholders, and back-to-services links.
- Rebuilt services hub into a general overview with category cards, niche grid, process, proof, CTA, and pricing placeholder while keeping marquee/gallery ordering.
- Remaining: deeper QA in browser for dropdown interactions and mobile behaviour; pricing components to be implemented in next prompt.

## Decision Log
- Decision: Niche slugs will kebab-case the CSV `Niche` values: `real-estate`, `hospitality`, `salons`, `trades`, `ecommerce`, `physios-chiropractors`, `dentists`, `gym-owners`, `fitness-influencers-online-coaches`.
  Rationale: Direct mapping keeps consistency with data source and clarity for URLs.
  Date/Author: 2025-12-04 / GPT-5.1-Codex-Max
- Decision: Hero shader variants will use unique variant names matching each slug (e.g., `data-variant="real-estate"`), mapped to brand-aligned colour themes in `assets/js/hero-shader.js` to ensure predictable styling.
  Rationale: Unique variants satisfy requirement and allow future tuning without affecting other pages.
  Date/Author: 2025-12-04 / GPT-5.1-Codex-Max
- Decision: Services dropdown will list “General” first (services.html) followed by niche pages in CSV order to align navigation with new landing pages.
  Rationale: Keeps hub primary while surfacing niche options consistently.
  Date/Author: 2025-12-04 / GPT-5.1-Codex-Max

## Outcomes & Retrospective
- To be completed after implementation, summarising delivered pages, navigation, and remaining follow-ups.

## Context and Orientation
- Repository root contains main static pages: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `privacy-policy.html`.
- Assets: CSS under `assets/css/` (notably `styles.css`, `custom-styles.css`, `services.css`, `parallax-fix.css`, `mobile.css`, `hero-base.css`, `icons.css`, marquee/premium gallery CSS), images under `assets/images/` including `assets/images/internet/...` for parallax backgrounds and `assets/images/socialmedia/` for thematic images, icons under `assets/icons/`, JS under `assets/js/` including `hero-shader.js`, `script.js`, and marquee/cookie consent assets.
- Hero shader: canvas with id `hero-shader-canvas`; variant controlled by `data-variant` attribute mapping to themes in `assets/js/hero-shader.js`.
- Parallax layout: use `.parallax-section` with `data-parallax-theme="book"` to scroll over the Calendly background (see `book.html` reference). Body sections should sit within parallax containers rather than standalone banners.
- Current nav is a simple list in each page header; Services is a single link and must become a dropdown.
- No existing `/niches/` directory; new pages must be added and linked.
- `Silverstone_Service_Master_List.csv` provides niches under the `Niche` column; unique values include Real Estate, Hospitality, Salons, Trades, eCommerce, Physios/Chiropractors, Dentists, Gym Owners, Fitness Influencers/Online Coaches.

## Plan of Work
1. Perform targeted web research on pains/outcomes and boutique automation site patterns to inform copy. Summarise findings here and in Surprises & Discoveries; adapt content without verbatim copying.
2. Define niche slugs and human-readable labels based on CSV niches; assign unique hero shader `data-variant` values (reusing existing colour themes or adding variants if needed) and select existing images from `assets/images/socialmedia/` or other available assets.
3. Implement Services dropdown: update header nav markup and any supporting CSS/JS to provide accessible hover/tap dropdown listing General (services.html) plus all niche pages. Ensure it works on desktop and mobile and prevents header auto-collapse while interacting.
4. Redesign `services.html` as the general services hub: rewrite hero to present overview/CTA, add parallax-contained sections for general service categories, niche link grid, process, proof, CTA, and pricing placeholder (`pricing-services-root`). Remove outdated niche-specific long copy, ensure double marquee + gallery remain just above final CTA/footer, and include parallax background usage.
5. Create dedicated niche stylesheet `assets/css/niches.css` to style niche layouts (cards, grids, images, spacing) consistent with existing aesthetic without new fonts/colours.
6. Build niche landing pages in `/niches/<slug>.html` using core page skeleton (header, hero with shader, parallax body, footer). Each page includes: hero with CTA and unique variant; pains/problems section; productised pack based on CSV services; proof/benchmarks; pricing placeholder (`pricing-<slug>-root`); process/FAQs; link back to general services; at least three relevant images. Ensure parallax theme `book` used for body content and footer matches core pages.
7. Update cross-page links: Services dropdown and services hub should link to each niche page; ensure CTA/back-to-services links added to niche pages.
8. Validate layouts and assets: confirm referenced images exist; ensure footer consistency; verify hero text legibility over shader; check pricing placeholders present; ensure nav dropdown works on mobile/desktop.
9. Update ExecPlan sections (Progress, Surprises & Discoveries, Decision Log, Outcomes) as work advances.

## Concrete Steps
- Work in repo root `/workspace/silverstone-site`.
- Attempt web searches for each niche’s pain points and automation outcomes; capture summaries in this plan.
- Create/update `ExecPlan-silverstone-niches.md` as progress occurs.
- Add `assets/css/niches.css` for niche-specific layout tweaks.
- Implement nav dropdown markup and supporting JS/CSS (likely editing shared header markup in each page or factoring common snippets if present) plus any dropdown styles in existing CSS or new small block.
- Redesign `services.html` content within parallax structure, ensuring marquee/gallery/CTA ordering preserved; add pricing placeholder.
- Create `/niches/` directory and add one HTML per niche using copy of base page structure from existing pages (reuse header/footer and parallax patterns). Update meta titles/descriptions.
- Update hero shader variants list in `assets/js/hero-shader.js` if adding new variants for niches.
- Verify assets in `assets/images/socialmedia/` and other folders; choose at least three per niche and integrate with new sections.
- Run `npm test` not applicable; manual validation by opening HTML files in browser (file:// or simple server) to check nav dropdown, hero, parallax, links, and image loading.

## Validation and Acceptance
- Open `services.html` locally: hero presents general services overview, includes CTA; general service category cards and “Choose your niche” grid appear within parallax sections; pricing placeholder with id `pricing-services-root` exists; marquee + gallery remain before final CTA/footer.
- Open each `/niches/<slug>.html`: hero with shader and CTA for that niche; pains, pack, proof/benchmarks, process/FAQs, pricing placeholder `pricing-<slug>-root`, and back-to-services link present; at least three relevant images visible; body content uses parallax theme `book`; footer matches core pages.
- On any page header, hover/tap Services to reveal dropdown listing “General” + all niches; links work on desktop and mobile (via nav toggle); header remains stable during dropdown interaction.
- Check hero shader canvas `data-variant` unique per niche and renders legibly; ensure shader JS recognises variants (new or existing mapping).
- Confirm all new asset paths resolve and images load.

## Idempotence and Recovery
- All changes tracked in git; if something breaks, use `git checkout -- <file>` to restore specific files or `git reset --hard` to revert entire working tree.
- New files added via standard copy; rerunning edits is safe because HTML/CSS are static. Dropdown JS/CSS changes are additive/minor; can be reverted via git.
- Pricing placeholders are semantic containers only; they can be reinserted if removed by reapplying diff.

## Artifacts and Notes
- Will document niche slug mapping, image selections, and shader variants here as decisions are made.

## Interfaces and Dependencies
- Niche filenames: `/niches/<slug>.html` where slug is kebab-case of CSV `Niche` value (e.g., `real-estate.html`).
- Pricing placeholders: `id="pricing-root"` (existing home), `id="pricing-services-root"` (general services), `id="pricing-<slug>-root"` (each niche page).
- Hero shader variants: set `data-variant` on `#hero-shader-canvas`; extend `THEMES` in `assets/js/hero-shader.js` if adding new named variants beyond `default`, `blue`, `green`, `amber`, `silver`.
- Navigation dropdown: needs shared classes/selectors to hook JS/CSS; ensure compatibility with existing `nav-toggle` mobile behaviour in `assets/js/script.js`.
