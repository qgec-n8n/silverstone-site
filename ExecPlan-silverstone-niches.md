# ExecPlan – silverstone niche pages and services hub

## Purpose / Big Picture
Deliver niche-specific landing pages, a refreshed general services hub, and a Services navigation dropdown so prospects can quickly find sector-relevant offers and book an automation audit. Success looks like: opening `services.html` shows a general overview with links to each niche, visiting `/niches/<slug>.html` shows tailored copy with hero shader and parallax body, and the Services nav item reveals a dropdown on every page listing General + all niches.

## Progress
- [x] (2025-02-03 00:00Z) Reviewed repository instructions (AGENTS.md, .agent/PLANS.md) and extracted niche list from CSV.
- [x] (2025-02-03 01:00Z) Performed web research attempts (results blocked); relied on industry-standard pains/no-show themes and documented limitation.
- [x] (2025-02-03 01:30Z) Drafted design/content outlines for each niche page and general services hub.
- [x] (2025-02-03 02:30Z) Implemented Services dropdown across shared header with desktop hover and mobile tap support.
- [x] (2025-02-03 03:30Z) Built niche landing pages for all CSV niches with shader variants, parallax content, and pricing placeholders.
- [x] (2025-02-03 04:00Z) Overhauled `services.html` as general hub with niche chooser and pricing placeholder.
- [x] (2025-02-03 04:00Z) Added niche stylesheet and ensured shared footer/header parity plus sitemap updates.
- [x] (2025-02-03 05:00Z) Validation and final TODO handover.

## Surprises & Discoveries
- Network search attempts via DuckDuckGo/Google returned empty payloads in this environment; will rely on established industry patterns for pain points (e.g., missed calls, no-shows, manual admin) and document assumptions.
- Niche list derived from `Silverstone_Service_Master_List.csv`: Real Estate, Hospitality, Salons, Trades, eCommerce, Physios/Chiropractors, Dentists, Gym Owners, Fitness Influencers/Online Coaches.

## Decision Log
- Decision: Use `/niches/<slug>.html` naming (kebab-case) aligned to CSV values. Rationale: predictable URLs for dropdown linking and SEO consistency. Date/Author: 2025-02-03 / GPT-5.1-Codex-Max.
- Decision: Introduce `assets/css/niches.css` for layout tweaks shared by niche pages to avoid impacting core styles. Rationale: isolates niche-specific spacing/components. Date/Author: 2025-02-03 / GPT-5.1-Codex-Max.
- Decision: Add pricing placeholders with ids `pricing-services-root` on `services.html` and `pricing-<niche>-root` on each niche page. Rationale: prep for Prompt_3 React pricing mount. Date/Author: 2025-02-03 / GPT-5.1-Codex-Max.
- Decision: Use root-relative navigation links so dropdown and footers work from `/niches/` pages without duplication. Rationale: keeps one consistent header/footer snippet across directories. Date/Author: 2025-02-03 / GPT-5.1-Codex-Max.

## Outcomes & Retrospective
- Services dropdown live across core pages; niche stylesheet added; nine niche landing pages shipped with shader variants, parallax content and pricing placeholders; `services.html` reworked as general hub with niche chooser; sitemap updated. Final validation pass completed.

## Context and Orientation
- Key files: `index.html`, `services.html`, `about.html`, `book.html`, `contact.html`, CSV `Silverstone_Service_Master_List.csv`, scripts in `assets/js/`, styles in `assets/css/` (notably `styles.css`, `custom-styles.css`, `hero-base.css`, `mobile.css`), images in `assets/images/socialmedia/`.
- Layout patterns: header/nav with `site-header` and mobile toggle; hero uses shader canvas `id="hero-shader-canvas"` with variants controlled in `assets/js/hero-shader.js`; body sections often use parallax backgrounds (see `book.html`) with `.parallax-section`.
- New work must keep existing palette/typography and reuse footer markup from core pages.
- Live site https://silverstone-ai.com is read-only; edits are local only.

## Plan of Work
1. Re-review `services.html` to understand current sections, parallax setup, and any niche-specific copy that needs relocation. Plan general services layout (hero, categories, niche chooser, how-it-works, proof, pricing placeholder) within parallax container while keeping marquee/gallery/CTA block ordering intact.
2. Design navigation dropdown: update shared header markup (all pages) to convert Services into dropdown with General + niches; add minimal CSS/JS for hover/focus (desktop) and tap (mobile) consistent with existing nav toggle. Ensure header shrink behaviour unaffected while interacting.
3. Create `assets/css/niches.css` with spacing/layout helpers for niche pages (cards, grids, image treatments) using existing colours; extend parallax-friendly sections.
4. For each niche (slugs: real-estate, hospitality, salons, trades, ecommerce, physios-chiropractors, dentists, gym-owners, fitness-influencers-online-coaches):
   - Duplicate core page skeleton (header, hero shader with unique data-variant, parallax body, footer).
   - Craft hero copy, pains, flagship pack bullets mapped from CSV services, proof/benchmarks, pricing placeholder, process, FAQs, CTA, and back-to-services link.
   - Insert at least three relevant images from `assets/images/socialmedia/` with balanced layout.
5. Update `services.html` hero and body content to position as general hub, include niche chooser linking new pages, cross-cutting service categories, updated CTA, and pricing placeholder.
6. Ensure navigation links to new pages and that footers remain consistent. Add new pages to sitemap if necessary.
7. Validate manually by opening pages (desktop/mobile widths) to confirm dropdown behaviour, parallax rendering, hero shader variants, and link correctness.

## Concrete Steps
- Work from repo root.
- Inspect `assets/js/script.js` and `assets/css/styles.css` for nav behaviours; adjust or extend for dropdown.
- Create/update `assets/css/niches.css` and include it on niche pages and `services.html` if needed.
- Build niche pages under `/niches/` directory with kebab-case filenames and update sitemap/internal links.
- Edit `services.html`, `index.html`, `about.html`, `book.html`, `contact.html` (any page with nav) to integrate Services dropdown markup.
- Manual validation: open HTML files in browser (no build needed) and interact with dropdown; scroll niche pages to ensure parallax background is used and pricing placeholders exist.

## Validation and Acceptance
- Services dropdown appears on all pages; hover/click reveals General + nine niche links; links resolve.
- `services.html` hero and content present general overview, niche chooser, how-it-works, proof, CTA, and pricing placeholder within parallax container, while marquee/gallery ordering is preserved.
- Each niche page loads with hero shader `data-variant` unique value, parallax body content, three themed images, flagship pack bullets from CSV-aligned services, proof/benchmarks, process, FAQs, pricing placeholder id, and back-to-services link. Footer matches core pages.
- Pricing placeholders present: `pricing-root` (index already), `pricing-services-root`, and `pricing-<slug>-root` on niche pages.
- Visual consistency: spacing, colours, and typography align with existing site; no broken asset paths.

## Idempotence and Recovery
- All changes are standard HTML/CSS/JS; rerunning edits is safe. If issues occur, reset specific files using `git checkout -- <file>` or revert commits. Dropdown JS/CSS isolated to new selectors to avoid impacting other nav items.

## Artifacts and Notes
- Niche slugs: real-estate, hospitality, salons, trades, ecommerce, physios-chiropractors, dentists, gym-owners, fitness-influencers-online-coaches.
- Hero shader variants to add: one per slug (e.g., data-variant="real-estate").

## Interfaces and Dependencies
- Navigation dropdown JS hook(s) will live in `assets/js/script.js` (or new helper) using `.nav-dropdown` and `.nav-toggle` for mobile.
- Niche stylesheet `assets/css/niches.css` to be included on niche pages and `services.html` if shared components used.
- Pricing container IDs: `pricing-services-root`, `pricing-<slug>-root` per page. Existing `pricing-root` on index should remain untouched.
