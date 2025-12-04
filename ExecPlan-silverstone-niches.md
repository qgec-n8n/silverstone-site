# ExecPlan: Silverstone Niches and Services Hub

## 1. Context and Orientation
- Task: build premium niche landing pages derived from service master CSV, overhaul services.html into a general services hub, and implement a Services dropdown across the site.
- Affected areas: navigation header on all pages, new /niches/*.html pages, services.html structure, shared CSS/JS for dropdown tweaks.
- Constraints: reuse existing design system (heroes with shader, neon/frosted cards, icon bullets, CTA banners, innovation gallery order), keep footer/cookie banner intact, no new niche-specific stylesheet, derive niches strictly from CSV.

## 2. Big Picture / Outcomes
- Visitors can browse a General services hub and quickly jump into niche-specific packs via dropdown and on-page cards.
- Each niche page feels as premium as core pages, with niche pains, productised pack, proof cues, process, FAQs, CTA, and pricing placeholder.
- Services dropdown is clear, stable on hover/tap, and lists General plus all CSV niches.

## 3. Progress
- Mostly done: niches derived, pages generated, services hub rewritten, nav dropdown wired; QA and final review pending.

## 4. Visual & UX Baseline
- Canonical pages reviewed: index.html, about.html, services.html, book.html, contact.html; styles: assets/css/custom-styles.css, assets/css/services.css, assets/css/premium-gallery.css.
- Non-negotiables: reuse neon/frosted card families (.neon-card, .service-row, .service-card), consistent icon bullets, keep hero shader canvas, CTA sections with .brand-gradient and .cta-card, preserve innovation gallery + marquees order/background, maintain footer/cookie banner, avoid plain white boxes, ensure dropdown keeps “Services” visible with arrow and stable header.

## 5. Plan of Work
- Parse service master CSV to derive niche list and slugs; confirm scope.
- Copy an existing premium page skeleton (likely about.html) to create new niche pages under /niches/, adjusting hero, sections, bullets, CTA, pricing placeholders, and links back to services hub.
- Rework services.html into a general hub: adjust hero, add general categories, niche card grid linking to new pages, how-it-works, pricing placeholder, retain innovation gallery + marquees + CTA/footer.
- Implement Services nav dropdown across pages: markup updates, CSS for dropdown/arrow, JS if needed to pause header minimisation; include General + niches.
- Update CTA and navigation consistency, ensure containers for pricing mounts.
- Run QA: check dropdown interactions, card styles, bullet icons, CTA presence, links.

## 6. Concrete Steps
- [x] Derive niche list and slugs from CSV.
- [x] Draft niche page template and create pages for each niche with required sections and CTA/footer.
- [x] Update services.html to act as general hub with niche grid and pricing placeholder while preserving gallery/marquees.
- [x] Update nav across pages to dropdown listing General + niches; add CSS/JS support as needed.
- [x] Add pricing root containers as required and ensure CTA consistency across new pages.
- [ ] Perform QA and update ExecPlan sections, prepare TODO handover.

## 7. Surprises & Discoveries
- Nav CSS in styles.css is minified, so dropdown styling was added to custom-styles.css for clarity.
- Services page required careful replacement to keep the innovation gallery and marquee slot intact while restructuring.

## 8. Decision Log
- Generated niche pages via Python template to keep structure consistent across nine industries using existing neon card patterns.
- Chose root-relative dropdown population in JS with path prefix detection to keep links working from /niches/ pages.

## 9. Outcomes & Retrospective
- (To update after implementation.)

## 10. TODO / Handover
- Track remaining tasks for future prompts (pricing integration, etc.).

## 11. Validation & Acceptance
- Validate dropdown usability on desktop/mobile, presence of CTA and footer/cookie on all pages, adherence to card/bullet patterns, links to all niche pages from dropdown and services hub.

## 12. Idempotence and Recovery
- Changes should be re-applicable; niche generation manual HTML creation is deterministic; dropdown additions should avoid duplicating entries when reapplied.

## 13. Artifacts and Notes
- Niches derived from CSV: Real Estate, Hospitality, Physios/Chiropractors, Trades, eCommerce, Dentists, Gym Owners, Salons, Fitness Influencers/Online Coaches.

## 14. Research and Inspiration
- Use domain knowledge of automation pains/outcomes per niche and premium boutique agency patterns; adjust copy to Silverstone tone.
