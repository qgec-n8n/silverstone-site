# ExecPlan – Silverstone niche landing pages and services hub

## Purpose / Big Picture
Create niche-specific landing pages and a redesigned general services hub that translate Silverstone’s automation offers into clear, productised journeys for each industry. Visitors should be able to open `services.html` to understand the overall offer, pick their niche from the Services dropdown, and view a dedicated page with tailored hero, pains, productised pack, proof, pricing placeholder, and CTA to book an automation audit.

## Progress
- [x] (2025-12-04 18:05Z) Read repository AGENTS instructions and CSV niche list.
- [x] (2025-12-04 18:07Z) Attempted web research for niche pain points and automation outcomes (limited snippets returned due to search restrictions).
- [x] (2025-12-04 18:20Z) Derived niches from CSV with slugs: real-estate, hospitality, salons, trades, ecommerce, physios-chiropractors, dentists, gym-owners, fitness-influencers-online-coaches.
- [x] (2025-12-04 18:55Z) Designed template and built niche landing pages for Real Estate, Hospitality, Salons, Trades, eCommerce, Physios/Chiropractors, Dentists, Gym Owners, and Fitness Influencers/Online Coaches.
- [x] (2025-12-04 19:15Z) Redesigned `services.html` as a general services hub with niche links and pricing placeholder.
- [x] (2025-12-04 19:25Z) Converted Services nav into dropdown listing General + all niches across pages and added supporting CSS/JS.
- [ ] Validate layout across pages and update Outcomes & Retrospective.

## Surprises & Discoveries
- Web search results via Playwright returned minimal snippets (likely search restrictions). Will rely on domain knowledge and generic industry benchmarks rather than direct quotes.

## Decision Log
- Decision: Use `/niches/<slug>.html` naming pattern derived from CSV Niche values (kebab-case) and add pricing placeholders with `pricing-<slug>-root`. Rationale: scalable and aligns with prompt for consistent React mounts. Date/Author: 2025-12-04 / Codex.
- Decision: Reuse existing parallax structure from `book.html` for all new body sections and include hero shader canvas with unique `data-variant` per niche. Rationale: maintain visual consistency and meet prompt constraints. Date/Author: 2025-12-04 / Codex.
- Decision: Slug map set from CSV niches (Real Estate, Hospitality, Salons, Trades, eCommerce, Physios/Chiropractors, Dentists, Gym Owners, Fitness Influencers/Online Coaches) to kebab-case for nav labels. Rationale: ensures consistent URLs and dropdown labels. Date/Author: 2025-12-04 / Codex.

## Outcomes & Retrospective
- Niche landing pages, Services dropdown, and general services hub implemented; final validation and QA handoff pending. Need final sweep for layout issues, mobile nav behaviour, and shader variants before sign-off.

## Context and Orientation
- Key files: `index.html`, `services.html`, `about.html`, `book.html`, `contact.html`, `assets/css/styles.css`, `assets/css/custom-styles.css`, `assets/css/services.css`, `assets/css/hero-cinematic.css`, `assets/js/hero-shader.js`, `assets/images/socialmedia/` for image assets, `Silverstone_Service_Master_List.csv` for niche/service data.
- Navigation is replicated per HTML file; Services currently a single link. Parallax scrolling and Calendly background pattern used in `book.html` should be followed for new sections.
- Hero shader uses a `<canvas id="hero-shader-canvas" data-variant="...">` setup driven by `assets/js/hero-shader.js` with variants controlling colour.
- Pricing mounts: `index.html` already has `pricing-root`; need consistent containers for services hub and niches.
- Work must stay within static site; no changes to live site.

## Plan of Work
1. Parse `Silverstone_Service_Master_List.csv` to list unique niches and define slugs/labels. Map to readable names for nav and page metadata.
2. Draft layout/copy patterns for niche pages: hero with unique shader variant, pain section, productised pack tied to CSV services, proof/benchmarks, pricing placeholder, process/FAQs, CTA/back-to-services link. Choose 3+ relevant images per page from `assets/images/socialmedia/` or existing assets.
3. Create `assets/css/niches.css` to extend spacing/typography for niche pages without altering global palette; include image grids, cards, proof rows.
4. For each niche, create `/niches/<slug>.html` by copying an existing skeleton (likely `book.html` for parallax) and integrating hero shader, parallax sections, content, pricing placeholder, and footer reuse.
5. Redesign `services.html` as general hub: hero repositioning, general service category cards, niche selector linking to new pages, process steps, proof grid, pricing placeholder `pricing-services-root`. Ensure content lives inside parallax container and preserves existing marquee/gallery block order.
6. Implement Services dropdown in header nav across all pages: dropdown toggle with arrow, listing General + niches; ensure mobile nav toggle works and header doesn’t collapse while interacting. Add minimal JS/CSS if needed.
7. Validate pages locally (open HTML) for consistent nav, parallax background, footer, links. Update plan sections accordingly.

## Concrete Steps
- Work from repo root `/workspace/silverstone-site`.
- Use `python` to derive niche slugs and labels; note them in nav and plan.
- Create `ExecPlan-silverstone-niches.md` (this file) and keep updated after each major step.
- Edit/create files: `assets/css/niches.css`, multiple `/niches/*.html`, update `services.html`, update shared header/nav in `index.html`, `about.html`, `book.html`, `contact.html`, `services.html` (and any other pages with nav) plus JS/CSS for dropdown (likely `assets/js/main.js` or new small script if needed).
- Use `rg` to find nav markup across files; apply consistent dropdown markup and ensure mobile menu compatibility.
- After edits, run `npm test` not applicable; instead manually open HTML via browser if possible. Use `npm run build:css` if CSS build needed (likely not required as using static CSS files).

## Validation and Acceptance
- Open `services.html` and confirm hero positions page as general services overview, includes niche cards linking to each niche page, and contains `id="pricing-services-root"` placeholder within parallax sections. Ensure marquee/gallery remain directly above final CTA/footer.
- Open each `/niches/<slug>.html` to verify hero shader with unique variant, parallax body with pains, pack, proof, pricing placeholder, process/FAQs, CTA, and link back to services. Confirm at least three relevant images per page.
- Check header nav on desktop and mobile: Services dropdown shows General + all niches; hover/focus/tap reveals menu; links work; header doesn’t auto-collapse when interacting.
- Confirm footers match core pages and new CSS/JS load correctly without console errors.

## Idempotence and Recovery
- All changes tracked in git; if an edit misbehaves, restore file via `git checkout -- <file>` or reset specific hunks.
- Dropdown JS/CSS kept minimal and scoped to avoid breaking existing styles; removing dropdown involves reverting nav markup and associated styles/scripts.
- Niche pages are standalone HTML; deleting a page simply removes corresponding link references.

## Artifacts and Notes
- Maintain consistent pricing placeholder IDs (`pricing-<slug>-root`, `pricing-services-root`).
- Image selection should respect existing assets under `assets/images/socialmedia/`; avoid broken links.
- Document research limitations (search restrictions) in Surprises & Discoveries.

## Interfaces and Dependencies
- Naming scheme for niches: slugs derived from CSV `Niche` values (e.g., Real Estate -> `real-estate`, Physios/Chiropractors -> `physios-chiropractors`).
- Services dropdown markup/classes should integrate with existing nav structure (`<header class="site-header"> ... <nav><ul>...</ul></nav>`). Add JS hooks as needed for toggle/hover.
- Hero shader uses `assets/js/hero-shader.js`; each new page must include canvas with unique `data-variant` and ensure corresponding CSS not conflicting.
