# ExecPlan: Page Title Metadata Refresh

## Observed baseline

- The requested pages still used the previous title set in their `<title>`, `og:title`, and `twitter:title` tags.
- The actual niche files in this repo are:
  - `niches/salons-barbers.html`
  - `niches/fitness-coaches.html`
- `scripts/seo-audit.js` enforced the previous brand convention by requiring titles to end with ` - Silverstone AI`, which conflicts with the new requested pipe-separated titles and the brand-first homepage title.
- `sitemap.xml` was stale relative to the generator, so the SEO audit was already failing until the sitemap was refreshed.

## Root cause

- The page-head title metadata had not been updated to the new naming convention.
- The SEO validator still encoded the previous title-format policy instead of a brand-presence rule.

## Changes made

- Updated the requested pages so `<title>`, `meta[property="og:title"]`, and `meta[name="twitter:title"]` all match the new requested titles.
- Mapped the user’s requested niche filenames to the actual repo files:
  - `niches/salon-barbers.html` -> `niches/salons-barbers.html`
  - `niches/fitness-coaches` -> `niches/fitness-coaches.html`
- Updated `scripts/seo-audit.js` so indexable non-blog pages must include `Silverstone AI` in the title rather than ending with one exact suffix string.
- Regenerated `sitemap.xml` with `npm run generate:sitemaps`.

## Verification results

- Grep verification confirmed the updated `<title>`, `og:title`, and `twitter:title` values across all requested files.
- `npm run generate:sitemaps` passed and regenerated `sitemap.xml`.
- `node scripts/seo-audit.js` passed:
  - `SEO audit passed for 32 blog pages, 17 static indexable pages, redirects, robots.txt, site.webmanifest, IndexNow, favicons, and the flat root sitemap`

## Tradeoffs / follow-up

- The validator now enforces brand presence instead of one exact separator/order, which matches the new requested title policy and avoids false failures for future brand-first or pipe-separated titles.
