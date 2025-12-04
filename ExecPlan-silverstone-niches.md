# ExecPlan: Silverstone niche landing pages and services hub

## 1. Context and Orientation
- Build premium niche landing pages derived from `Silverstone_Service_Master_List.csv` niches and refactor `services.html` into a general services hub.
- Implement Services nav dropdown linking to general hub and all niches; ensure consistent header/CTA/footer patterns across pages.
- Files expected: `services.html`, new `niches/*.html`, shared header markup in core pages, `assets/css/custom-styles.css` and related styles if minor tweaks are needed.
- Must respect existing design system (hero shader, neon cards, bullet icons, CTA banners, innovation gallery/marquees) and preserve cookie banner/footer.

## 2. Big Picture / Outcomes
- Visitors can explore a polished general services hub plus dedicated niche pages that mirror the premium look of core pages.
- Services dropdown exposes General + all CSV niches; works on desktop hover and mobile tap without collapsing the header.
- Each niche page presents pains, a productised pack using CSV services, proof/benchmarks, process/FAQs, CTA, and pricing placeholders for future React mounts.

## 3. Progress
- Mostly done: niche pages generated, services hub rebuilt, Services dropdown styled and wired; QA + TODO handover pending.

## 4. Visual & UX Baseline (silverstone-site specific)
- Canonical pages/styles: `index.html`, `about.html`, `services.html`, `book.html`, `contact.html`, `assets/css/custom-styles.css`, `assets/css/services.css`, `assets/css/premium-gallery.css`.
- Must reuse hero shader, `.neon-card`/`.service-row`/`.service-card`/`.packages-grid` patterns, icon bullets on every list item, consistent CTA banner (`.section.brand-gradient` + `.neon-card.cta-card`), innovation gallery + double marquee order intact, cookie banner/footer untouched.
- Avoid flat white boxes; ensure images are full and well framed using existing layouts. Preserve nav readability with "Services" + arrow visible.

## 5. Plan of Work
- Parse master CSV to confirm niches; define slugs and friendly names for dropdown and pages.
- Review `services.html` structure and core layouts to clone for niche pages while keeping parallax background and CTA/footer intact.
- Implement Services dropdown across pages (desktop hover/mobile tap) with general + niche links; ensure header shrink logic remains usable.
- Rebuild `services.html` as general hub: hero, general service categories, niche chooser grid linking to niche pages, process/how-it-works, proof, pricing placeholder, retain innovation gallery/marquees/CTA.
- Create niche pages in `/niches/` using About/Services skeleton: hero, pains, flagship pack built from CSV services, proof/benchmarks, pricing placeholder, process/FAQs, CTA, footer; include back-to-services link and consistent shader/CTA.
- Add minimal CSS/JS enhancements if required for dropdown or layout reuse without new visual systems.
- QA across pages for bullets, cards, CTA presence, gallery order, nav behaviour; update TODO handover.

- [x] Derive niche list/slugs/friendly labels from CSV.
- [x] Audit `services.html` current layout and identify reusable sections.
- [x] Implement Services dropdown in header markup + supporting CSS/JS if needed.
- [x] Redesign `services.html` into general hub with niche chooser and pricing placeholder.
- [x] Build niche pages for all CSV niches with required sections and links.
- [x] Ensure CTA banners and footers are present on all niche pages; add pricing placeholders.
- [ ] Run basic QA (nav dropdown interaction, gallery order, bullets/icons/CTA consistency) and prepare TODO handover.

## 7. Surprises & Discoveries
- Header auto-hide logic in `assets/js/script.js` needed explicit guards so the new Services dropdown stays visible during hover/tap.

## 8. Decision Log
- Generated all niche pages directly from the CSV niches with shared premium layout and per-niche copy; added pricing placeholders for future React mounts.
- Rebuilt `services.html` as a general hub with category cards and a niche chooser grid before the existing innovation gallery/CTA block.
- Implemented a Services dropdown (desktop hover + mobile tap) using minimal new CSS/JS, keeping the header visible while the menu is open.

## 9. Outcomes & Retrospective
- Pending.

## 10. TODO / Handover
- Placeholder until implementation reveals follow-ups.

## 11. Validation & Acceptance
- Manual checks: navigate dropdown on desktop/mobile, ensure header stays while dropdown active; verify innovation gallery + marquees order on `services.html`; confirm CTA/banner/footer present on hub and niche pages; check bullets have icons and cards use neon/frosted styles.
- Automated: basic HTML/CSS checks via browser preview not available; rely on visual/code review.

## 12. Idempotence and Recovery
- Keep dropdown markup consistent across pages to avoid divergence; use shared CSS selectors. Re-running plan should not duplicate niches; ensure unique filenames.

## 13. Artifacts and Notes
- Niche pages to live under `niches/<slug>.html`; pricing placeholders `id="pricing-<slug>-root"`.

## 14. Research and Inspiration
- Will draw on general industry knowledge and any quick research as time allows to inform pains/outcomes for each niche; adapt copy to Silverstone tone without copying sources.
