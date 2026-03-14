# ExecPlan: Brand SERP And Sitemap Restructure

## Observed baseline

- The repo had a single hand-maintained `sitemap.xml`, while production was serving a different XML shape, so sitemap source-of-truth had drifted.
- The sitemap still used `priority` and `changefreq` hints even though Google no longer uses those fields for ranking or sitelink selection.
- The homepage already had the six desired core pages in nav/footer order, but sitewide boilerplate niche linking was overwhelming that hierarchy:
  - Before edit: `/niches/*` links appeared 688 times sitewide.
  - Before edit: `/about` and `/blog` each appeared 72 times sitewide.
- The homepage `WebSite` structured data still used `alternateName: "Silverstone"` and the `ProfessionalService` node was also carrying the organization identity, which weakened the preferred brand/site-name signal.

## Root cause

- Sitemap management relied on manually edited XML plus a separate SEO audit allowlist, so the sitemap, audit, and IndexNow logic could drift independently.
- The repeated niches dropdown and mobile niches overlay were duplicated into every non-service core page and every blog article, making supporting niche URLs appear more globally prominent than intended for a branded sitelink hierarchy.
- Home-page brand schema mixed site, organization, and service identity too loosely for the specific `Silverstone AI` brand-query outcome.

## Changes made

- Added `scripts/seo-inventory.js` as the single source of truth for canonical indexable pages, sitemap groups, and computed `lastmod` values.
- Added `scripts/generate-sitemaps.js` and `npm run generate:sitemaps` to generate and commit:
  - `sitemap.xml` as a sitemap index
  - `sitemap-main.xml`
  - `sitemap-blog.xml`
  - `sitemap-niches.xml`
  - `sitemap-legal.xml`
- Removed all sitemap `priority` and `changefreq` fields and generated `lastmod` values from git commit timestamps with filesystem fallback.
- Updated `scripts/indexnow-submit.js` to read canonical page URLs from the shared inventory rather than parsing the root sitemap file, so a sitemap index at `/sitemap.xml` does not break IndexNow submissions.
- Updated `scripts/seo-audit.js` to validate:
  - the sitemap index and each child sitemap
  - exact URL membership per sitemap group
  - no `priority` or `changefreq` fields
  - home-page `Organization` JSON-LD and corrected site-name signals
  - removal of the boilerplate niches dropdown/overlay on non-service core pages and blog articles
- Updated `index.html` to:
  - change `WebSite.alternateName` to `silverstone-ai.com`
  - add a dedicated `Organization` entity
  - make `ProfessionalService` reference that organization
  - add a compact top-of-page primary-links section pointing to `/about`, `/services`, `/blog`, `/book`, and `/contact` in that exact order
- Replaced the repeated niches dropdown and niches overlay on `about.html`, `blog.html`, `book.html`, `contact.html`, and all `blog/*.html` articles with a single `Niches` link to `/services#automation-packs`.

## Before/after evidence

- Before: one hand-maintained root sitemap, production drift, and deprecated sitemap hints.
- After: generated sitemap index plus four generated child sitemaps, all validated from one shared inventory module.
- Before: 688 boilerplate `/niches/*` links sitewide.
- After: 256 `/niches/*` links sitewide, with contextual niche CTAs retained.
- Before: homepage schema exposed `alternateName: "Silverstone"`.
- After: homepage schema exposes `alternateName: "silverstone-ai.com"` plus separate `Organization` and `ProfessionalService` nodes.
- After: `npm run seo:audit` passes for 20 blog pages, 16 static indexable pages, redirects, robots, manifest, IndexNow, favicons, and the sitemap index set.

## Verification

- Ran `npm run generate:sitemaps`.
- Ran `npm run seo:audit`.
- Spot-checked generated files:
  - `sitemap.xml` contains only the four child sitemap locations.
  - `sitemap-main.xml` contains only `/`, `/about`, `/services`, `/blog`, `/book`, and `/contact`.
  - `sitemap-blog.xml` contains only canonical `/blog/*` URLs.
  - `sitemap-niches.xml` contains only canonical `/niches/*` URLs.
  - `sitemap-legal.xml` contains only `/privacy-policy`.
- Verified `about.html`, `blog.html`, `book.html`, `contact.html`, and all `blog/*.html` files no longer contain the boilerplate `.nav-dropdown` or `.services-overlay` niche blocks.

## Deployment follow-up

- After deploy, verify production with:
  - `curl -L https://silverstone-ai.com/sitemap.xml`
  - `curl -L https://silverstone-ai.com/sitemap-main.xml`
  - `curl -L https://silverstone-ai.com/sitemap-blog.xml`
  - `curl -L https://silverstone-ai.com/sitemap-niches.xml`
  - `curl -L https://silverstone-ai.com/sitemap-legal.xml`
- In Google Search Console:
  - resubmit `https://silverstone-ai.com/sitemap.xml`
  - request indexing for `/`, `/about`, `/services`, `/blog`, `/book`, `/contact`, one representative blog URL, and one representative niche URL
- Expect branded sitelink changes to lag deployment; this work improves the signals but does not let us directly force Google’s sitelink choices.
