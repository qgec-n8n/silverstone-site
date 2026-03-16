# ExecPlan: Brand SERP And Sitemap Restructure

## Observed baseline

- The repo originally had a hand-maintained `sitemap.xml`, while production had drifted to a different shape.
- The homepage already had the six desired core pages in nav/footer order, but sitewide boilerplate niche linking was overwhelming that hierarchy:
  - Before edit: `/niches/*` links appeared 688 times sitewide.
  - Before edit: `/about` and `/blog` each appeared 72 times sitewide.
- The homepage `WebSite` structured data still used `alternateName: "Silverstone"` and the `ProfessionalService` node was also carrying the organization identity, which weakened the preferred brand/site-name signal.
- After the first sitemap rollout, live production returned `200` for `https://silverstone-ai.com/sitemap.xml` and each child sitemap, but the root file was a sitemap index with only 4 child references:
  - `sitemap-main.xml`
  - `sitemap-blog.xml`
  - `sitemap-niches.xml`
  - `sitemap-legal.xml`
- Google Search Console then reported `0` discovered pages for the newly re-submitted root sitemap, while Bing Webmaster Tools reported `4`. For this exact implementation, Bing’s count matched the 4 child sitemap references in the root index.

## Root cause

- Sitemap management originally relied on manually edited XML plus a separate SEO audit allowlist, so the sitemap, audit, and IndexNow logic could drift independently.
- The repeated niches dropdown and mobile niches overlay were duplicated into every non-service core page and every blog article, making supporting niche URLs appear more globally prominent than intended for a branded sitelink hierarchy.
- Home-page brand schema mixed site, organization, and service identity too loosely for the specific `Silverstone AI` brand-query outcome.
- The live sitemap issue was not a fetch or syntax failure. The root cause of the reported `0`/`4` split was the root sitemap shape:
  - the site only has 36 canonical URLs, so a sitemap index was unnecessary
  - Bing surfaced the 4 child sitemap references at the root
  - Google’s own Search Console documentation says a sitemap index should show the count of all child URLs, so a fresh `0` after re-submission points to child processing lag or non-aggregation in the UI, not a broken `200` response
- For this site size, a single flat root sitemap is the lower-risk and lower-ambiguity implementation.

## Changes made

- Added `scripts/seo-inventory.js` as the single source of truth for canonical indexable pages, sitemap ordering, and computed `lastmod` values.
- Added `scripts/generate-sitemaps.js` and `npm run generate:sitemaps`.
- Removed all sitemap `priority` and `changefreq` fields and generated `lastmod` values from git commit timestamps with filesystem fallback.
- Updated `scripts/indexnow-submit.js` to read canonical page URLs from the shared inventory rather than parsing the root sitemap file, and narrowed the sitemap sitewide trigger pattern to `sitemap.xml`.
- Updated `scripts/seo-audit.js` to validate:
  - one flat root `sitemap.xml`
  - exact canonical URL membership and ordering
  - no `priority` or `changefreq` fields
  - home-page `Organization` JSON-LD and corrected site-name signals
  - removal of the boilerplate niches dropdown/overlay on non-service core pages and blog articles
- Updated `index.html` to:
  - change `WebSite.alternateName` to `silverstone-ai.com`
  - add a dedicated `Organization` entity
  - make `ProfessionalService` reference that organization
  - add a compact top-of-page primary-links section pointing to `/about`, `/services`, `/blog`, `/book`, and `/contact` in that exact order
- Replaced the repeated niches dropdown and niches overlay on `about.html`, `blog.html`, `book.html`, `contact.html`, and all `blog/*.html` articles with a single `Niches` link to `/services#automation-packs`.
- Replaced the root sitemap index with a single flat `sitemap.xml` containing all 36 canonical URLs in this order:
  - `/`
  - `/about`
  - `/services`
  - `/blog`
  - `/book`
  - `/contact`
  - `/blog/*`
  - `/niches/*`
  - `/privacy-policy`
- Removed the child sitemap files so there is no stale parallel sitemap structure left for search engines or tools to interpret differently.

## Before/after evidence

- Before: one hand-maintained root sitemap, production drift, and deprecated sitemap hints.
- After: one generated root sitemap, validated from one shared inventory module.
- Before: root sitemap in production was a sitemap index with 4 child references.
- After: root sitemap in the repo is a flat `urlset` with 36 canonical URLs and accurate per-page `lastmod` values.
- Before: 688 boilerplate `/niches/*` links sitewide.
- After: 256 `/niches/*` links sitewide, with contextual niche CTAs retained.
- Before: homepage schema exposed `alternateName: "Silverstone"`.
- After: homepage schema exposes `alternateName: "silverstone-ai.com"` plus separate `Organization` and `ProfessionalService` nodes.
- After: `npm run seo:audit` passes for 20 blog pages, 16 static indexable pages, redirects, robots, manifest, IndexNow, favicons, and the flat root sitemap.

## Verification

- Ran `npm run generate:sitemaps`.
- Ran `npm run seo:audit`.
- Ran `git diff --check`.
- Spot-checked generated `sitemap.xml`:
  - file uses `<urlset>`
  - file lists 36 canonical URLs
  - the first 6 URLs are `/`, `/about`, `/services`, `/blog`, `/book`, `/contact`
  - the file contains no `.html` canonicals
  - the file contains no `priority` or `changefreq` tags
- Verified `about.html`, `blog.html`, `book.html`, `contact.html`, and all `blog/*.html` files no longer contain the boilerplate `.nav-dropdown` or `.services-overlay` niche blocks.
- Live production checks performed before the flat-sitemap change:
  - `curl -I https://silverstone-ai.com/sitemap.xml` returned `200` with `content-type: application/xml`
  - `curl -I https://silverstone-ai.com/sitemap-main.xml` returned `200`
  - `curl -I https://silverstone-ai.com/robots.txt` returned `200`

## Deployment follow-up

- After deploy, verify production with:
  - `curl -L https://silverstone-ai.com/sitemap.xml`
  - confirm the root file is now a flat `urlset`, not a `sitemapindex`
  - confirm the first 6 URLs are the six desired core pages
- In Google Search Console:
  - remove the old sitemap-index submission if it persists in history
  - submit `https://silverstone-ai.com/sitemap.xml`
  - expect discovered URL counts to lag the re-submission by hours to several days
  - request indexing for `/`, `/about`, `/services`, `/blog`, `/book`, `/contact`, one representative blog URL, and one representative niche URL
- In Bing Webmaster Tools:
  - resubmit `https://silverstone-ai.com/sitemap.xml`
  - expect the root sitemap to show page URL discovery rather than 4 child-sitemap references after the new file is fetched
- Expect branded sitelink changes to lag deployment; this work improves the signals but does not let us directly force Google’s sitelink choices.

## 2026-03-16 Yandex verification addendum

- Reviewed Yandex Webmaster official verification guidance for HTML meta-tag verification.
- Observed root cause: the repo had no `yandex-verification` meta tag on the homepage or any other indexable HTML page, so Yandex ownership verification via meta tag could not succeed.
- Clarified scope from Yandex docs: the tag is required for site ownership verification on the main page; it is not the mechanism that makes all pages indexable.
- Applied the requested tag `<meta name="yandex-verification" content="fb2b6f788d990108" />` to all 36 indexable HTML pages so the homepage satisfies Yandex verification requirements and the rest of the canonical page set stays consistent.
- Verification after edit:
  - confirmed 36 HTML files contain the Yandex verification tag
  - confirmed representative main, niche, and blog pages include the tag in `<head>`
  - reran `npm run seo:audit`
  - reran `git diff --check`
