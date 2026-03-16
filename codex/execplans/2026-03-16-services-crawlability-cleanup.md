# ExecPlan: Services Crawlability Cleanup

## Observed baseline

- `https://silverstone-ai.com/services` returned `200` on March 16, 2026 with a self-referencing canonical, `meta robots="index, follow"`, and inclusion in the live root sitemap.
- `node scripts/seo-audit.js` failed before edits because:
  - `sitemap.xml` was stale
  - `netlify.toml` lacked redirects for two new blog articles
  - `services.html` was missing those same two article links in its supporting-guides section
- `services.html` was the heaviest core landing page in the repo and still contained a large decorative Innovation Gallery plus a services-only JS-injected double marquee.

## Root cause

- The `/services` page had valid baseline crawl directives, but its page-specific decorative payload added crawl/render cost without strengthening the service-hub intent.
- The supporting internal-link inventory had fallen behind the latest blog content, and `.html` redirect coverage lagged the published canonical URLs.

## Changes made

- Removed the entire Innovation Gallery section from `services.html`, including `#innovation-gallery`, `#neural-grid`, all `.js-gallery-lightbox` tiles, and `#innovation-marquee-slot`.
- Added the two newest blog article links to the services supporting-guides list.
- Updated `src/js/marquee.js` so the services-only double marquee now initializes only when the gallery slot or grid exists, and no longer falls back to appending itself elsewhere on `/services`.
- Added the two missing `.html`-to-clean-URL redirects to `netlify.toml`.
- Regenerated the bundled JS and sitemap artifacts after the source edits.

## Before/after evidence

- Before:
  - `/services` contained a large decorative gallery section and services-only double marquee path
  - SEO audit failed on missing supporting-guide links and missing blog redirects
- After:
  - `/services` keeps its core service, pricing, FAQ, CTA, and parallax content but no longer includes the non-essential gallery/marquee section
  - the missing supporting-guide links and redirects are present
  - sitemap output reflects the updated `/services` lastmod

## Verification

- Run `npm run build:js`.
- Run `npm run generate:sitemaps`.
- Run `node scripts/seo-audit.js`.
- Run `git diff --check`.
- Manual regression checks:
  - confirm `/services` still contains the self-canonical and `meta robots="index, follow"`
  - confirm `/services` no longer contains `#innovation-gallery`, `#neural-grid`, or `#innovation-marquee-slot`
  - confirm the two new blog links appear in the supporting-guides list
  - confirm services-page parallax sections and pricing widgets still render
  - confirm no services-only double marquee appears on desktop or mobile
