# ExecPlan – Silverstone Niches and Services Hub

## 1. Context and Orientation
Working on Prompt_2: build premium niche landing pages derived from the service master CSV, overhaul `services.html` into a general services hub, and convert the “Services” nav item into a dropdown listing General plus all niches. Touchpoints: navigation across core pages, new `/niches/*.html` pages, `services.html`, shared CSS/JS if needed, and the ExecPlan/TODO handover. Must preserve premium aesthetic from core pages and existing card/CTA patterns.

## 2. Big Picture / Outcomes
- Visitors can explore a General services hub that routes into niche packs while keeping innovation gallery/marquees intact.
- Each CSV niche has a premium landing page with hero, pains, productised pack, proof, process/FAQs, pricing placeholder, CTA, and footer.
- Navigation exposes a Services dropdown with General + all niches, stable on desktop/mobile and compatible with header shrink logic.
- Future pricing mounts have stable containers on services and niche pages.

## 3. Progress
Mostly done – niche list confirmed; services hub and dropdown implemented; nine niche pages generated; external web search blocked (403) so copy relies on domain knowledge and anonymised benchmarks.

## 4. Visual & UX Baseline (silverstone-site specific)
Canonical references: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`; styles in `assets/css/custom-styles.css`, `assets/css/services.css`, `assets/css/premium-gallery.css`. Use hero shader, neon/frosted cards (`.neon-card`, `.service-row`, `.service-card`, `.service-card-inner`, `.packages-grid`), icon bullets (`.bullet` with `.bullet-icon` and `.bullet-text` or `<li><i …></i>`), CTA banners (`.section.brand-gradient` + `.neon-card.cta-card`), innovation gallery and marquees, cookie banner, and shared footer. Constraints: no plain white boxes; consistent icon bullets; existing assets only; CTA banner on all pages; keep innovation gallery + double marquee order/background on services; nav must remain legible with Services text + arrow.

## 5. Plan of Work
- Derive niche list from CSV (Real Estate, Hospitality, Physios/Chiropractors, Dentists, Salons, Trades, eCommerce, Gym Owners, Fitness Influencers/Online Coaches).
- Choose base layout (likely `about.html`/`services.html`) for niche pages, maintaining hero shader, parallax structure, CTA, footer; add pricing placeholders.
- Redesign `services.html` to act as General hub: hero repositioning, general service categories with icon bullets, niche directory section linking to niche pages, how-it-works, proof/CTA retention, pricing root; keep innovation gallery and marquees placement.
- Implement Services dropdown in nav across pages (HTML + supporting CSS/JS) with arrow indicator and hover/tap support; ensure header shrink logic doesn’t hide dropdown.
- Minor CSS additions in existing stylesheets only if necessary for dropdown/niche cards.
- Update ExecPlan as progress occurs; prepare TODO handover.

## 6. Concrete Steps
- [x] Confirm niche set from CSV and derive slugs/labels.
- [x] Draft dropdown markup/behavior; update header across pages; add minimal CSS/JS for stability.
- [x] Rework `services.html` into General hub with new sections and pricing placeholder while preserving innovation gallery/marquees/CTA/footer order.
- [x] Create niche pages under `niches/` using premium layout, tailored copy per niche, pricing placeholders, CTA, footer, and link back to services.
- [x] Wire Services dropdown and services hub to niche pages; add niche cards/links.
- [ ] Validate visuals/structure (cards, bullets, CTAs, galleries, nav, cookie banner) and update TODO handover.

## 7. Surprises & Discoveries
- Niche list from CSV: Real Estate, Hospitality, Physios/Chiropractors, Dentists, Salons, Trades, eCommerce, Gym Owners, Fitness Influencers/Online Coaches.
- External web search attempts (e.g. DuckDuckGo) returned 403 in this environment; will base pain points on domain knowledge and anonymised industry patterns.

## 8. Decision Log
- Use `about.html`/`services.html` structural patterns for niche pages to maintain premium shader + parallax layout.
- Implement a simple CSS/JS dropdown integrated into existing nav markup to avoid header shrink conflicts.
- Pricing placeholders: use `pricing-<slug>-root` within natural layout sections.

## 9. Outcomes & Retrospective
- Built a General services hub with refreshed hero, core capability cards, niche directory, process overview, and pricing placeholder while keeping the innovation gallery, marquees, CTA, and footer order intact.
- Implemented Services dropdown (HTML/CSS/JS) across all pages with hover/tap support that pauses header auto-hide logic.
- Generated nine niche landing pages with premium layout, niche-specific hero/pain/pack sections, proof grid, process/FAQs, CTA banner, and pricing placeholders linking back to the hub.
- Added styling for dropdowns, grids, and inline CTAs using existing neon card patterns; no new standalone stylesheet.

## 10. TODO / Handover
- Run visual QA across desktop/mobile for dropdown interactions, new services layout, and each niche page.
- Prepare pricing components to mount into `pricing-services-root` and `pricing-<slug>-root` containers in next prompt.
- Consider richer niche-specific imagery if new assets become available; currently reusing existing library.

## 11. Validation & Acceptance
- Ensure Services dropdown remains visible/usable on hover/tap; header does not collapse during interaction.
- Each niche page follows premium layout with CTA/footer and pricing placeholder; bullets carry icons; no plain white cards.
- `services.html` retains innovation gallery + marquees order and includes niche directory + general categories; CTA present.
- Navigation links resolve to correct pages; footer/cookie banner intact.

## 12. Idempotence and Recovery
- Changes rely on shared header/footer copies per HTML file; ensure consistent updates to avoid drift. Dropdown JS/CSS should be resilient if applied across pages. Re-running work should not duplicate niche cards if templates reused carefully.

## 13. Artifacts and Notes
- Niche slugs (planned): real-estate, hospitality, physios-chiropractors, dentists, salons, trades, ecommerce, gym-owners, fitness-influencers-online-coaches.

## 14. Research and Inspiration
- Will use web search as needed for niche pains and premium automation site inspiration; summarise findings in Surprises & Discoveries when applied.
