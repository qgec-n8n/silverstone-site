# ExecPlan: Services Hub Indexing Cleanup

## Observed baseline

- `services.html` was still modelled as a single-service sales page in schema rather than a directory page for the nine child service URLs.
- The service hub lacked visible HTML breadcrumbs, while the blog hub already expressed its collection structure more clearly.
- Each `/services/*` page linked mainly to the root site and did not consistently expose a strong parent signal back to `/services`.
- Visible site taxonomy still mixed `Niches` and `Industries`, and the trades page still used the stale `/services/trades-virtual-office` slug in routes, pricing anchors, and supporting output.
- The homepage and blog hub did not provide a strong in-body cluster of direct links to all nine service pages.
- Before the cleanup pass, `sitemap.xml` still listed `/services/trades-virtual-office`.

## Root cause

- Google was being asked to infer a parent-child services directory from signals that were incomplete and sometimes contradictory:
  - the hub page schema behaved like a generic service page instead of a collection page
  - child pages lacked visible breadcrumb navigation and explicit `rel="up"`/schema links to the hub
  - taxonomy language was inconsistent across navigation, page copy, and pricing UI
  - the trades entity had mismatched slug, label, and breadcrumb intent
- Internal discovery paths were also weaker than they should have been because the strongest body-link clusters lived in navigation and blog content rather than in dedicated homepage/blog-hub directory sections.

## Changes made

- Converted `services.html` into a directory-first hub:
  - schema now uses `CollectionPage`, `ItemList`, and `BreadcrumbList`
  - visible breadcrumb rail added near the hero
  - hero copy, CTA text, and supporting labels now frame the page as a browse-by-industry directory
  - added a compact nine-card industry directory near the top of the page
- Strengthened all service detail pages:
  - added visible hero breadcrumbs `Home > Services > <Industry>`
  - added `<link rel="up" href="https://silverstone-ai.com/services">`
  - updated `WebPage.isPartOf` to point to the services hub
  - added `mainEntityOfPage` on the `Service` entity where needed
  - tightened hero copy with short industry-specific context lines
  - updated companion guide links to the strongest matching articles
- Completed the taxonomy and slug migration:
  - changed visible `Niches` UI copy to `Industries` across navigation, overlays, homepage, blog hub, pricing, service pages, and article references where the term was being used as site taxonomy
  - renamed the canonical trades page to `services/trades.html`
  - added permanent redirects from legacy `/services/trades-virtual-office*` and `/niches/trades-virtual-office*` routes to `/services/trades`
  - aligned pricing anchors, deep links, widget data, and visible labels to `Trades`
- Improved discovery with minimal visual change:
  - added a homepage “Browse services by industry” section using the existing premium card language
  - added a matching industry cluster near the top of `blog.html`
  - added targeted direct service links in relevant blog articles, including the appointment reminders article
- Updated SEO validation logic:
  - `scripts/seo-inventory.js` now expects `CollectionPage + ItemList + BreadcrumbList` for the services hub
  - `scripts/seo-audit.js` now checks visible breadcrumbs, `rel="up"`, hub `ItemList` order, homepage/blog directory clusters, and trades legacy redirects
- Updated pricing widget source-of-truth files as well as the checked-in bundle so a future widget rebuild does not restore the old slug or taxonomy copy.

## Before/after evidence

- Before:
  - `/services` looked and validated more like a generic service landing page than a directory hub
  - service detail pages did not expose strong visible parent-child navigation
  - `Niches` remained in visible taxonomy UI
  - `/services/trades-virtual-office` still appeared in canonical output paths such as the sitemap and pricing data
- After:
  - `/services` presents a visible directory structure with breadcrumb navigation and an ordered `ItemList`
  - every `/services/*` page visibly and semantically points back to `/services`
  - visible taxonomy now uses `Industries`
  - trades canonicals, pricing anchors, redirects, and supporting output align to `/services/trades`
  - homepage and blog hub now provide direct body links to all nine service pages

## Verification

- Run `npm run build:css`.
- Run `npm run build:js`.
- Run `(cd pricing-widget && npm run build)`.
- Run `npm run generate:sitemaps`.
- Run `node scripts/seo-audit.js`.
- Run `git diff --check`.
- Manual checks:
  - `/` shows the in-body nine-link industry directory section
  - `/services` shows the breadcrumb near the hero and reads as a directory page first
  - `/services/trades` shows the breadcrumb, `rel="up"` relationship, and updated trades copy
  - overlay navigation, sticky CTA, pricing deeplinks, reveal animation, and parallax still behave on desktop and mobile
  - legacy trades routes redirect permanently to `/services/trades`
