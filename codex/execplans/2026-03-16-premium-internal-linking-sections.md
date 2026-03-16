# ExecPlan: Premium Internal-Linking Section Redesign

## Observed baseline

- `services.html` already contained the full niche-page and blog-guide link inventory, but both groups lived inside one combined section placed below the FAQ instead of between pricing and FAQ.
- `index.html` already contained the required main-page links in the correct order inside `#primary-site-links`, but the presentation was a single generic CTA card with limited hierarchy and weak visual distinction.
- `scripts/seo-audit.js` enforced the old `services.html` structure by looking for one combined resources section, so splitting the block into two sections would fail the audit without a corresponding validator update.
- Baseline verification before edits:
  - `npm run seo:audit` failed before any code changes with `sitemap.xml: generated sitemap content is stale; run npm run generate:sitemaps`.

## Root cause

- The services-page internal-linking work had been added as one catch-all block rather than two hierarchy-specific sections, so the page was not reinforcing the intended relationship of:
  - `/services` as the parent hub
  - `/niches/*` as supporting service descendants
  - `/blog` and `/blog/*` as the supporting educational branch
- The homepage main-pages section met the raw linking requirement but not the requested premium, editorial, mobile-resilient treatment.
- The SEO audit still encoded the previous one-section assumption, which would produce a false negative once the HTML was split as requested.

## Changes made

- Updated `services.html` to:
  - move the internal-linking area to immediately below the two pricing widgets
  - split the previous combined block into:
    - `#service-page-clusters`
    - `#service-supporting-guides`
  - keep the full existing `/niches/*` and `/blog/*` destination set intact
  - rewrite headings and supporting copy to clarify parent/child hierarchy between services, niches, and blog guides
- Updated `index.html` to redesign `#primary-site-links` in place as a premium five-card navigation grid while preserving the required links and order:
  - `/about`
  - `/services`
  - `/blog`
  - `/book`
  - `/contact`
- Updated page-level CSS in `src/css/pages/services.css` and `src/css/pages/home.css` with localized styling only.
- Updated `scripts/seo-audit.js` so it now validates two ordered services resources sections instead of one combined block.

## Before/after evidence

- Before:
  - one combined services resources section below FAQ
  - homepage internal links presented as a basic CTA-button row
  - SEO audit expected the old single-section services structure
- After:
  - niche resource section appears below pricing and above the blog guides section
  - blog guides section appears below the niche section and above FAQ
  - homepage main-page links are presented as premium descriptive cards while preserving the same crawlable href targets
  - SEO audit checks the new two-section services structure and the existing homepage link order

## Verification

- Rebuild CSS bundles with `npm run build:css`.
- Run `npm run seo:audit`.
- If the sitemap stays stale after HTML edits, run `npm run generate:sitemaps` and rerun `npm run seo:audit`.
- Run `git diff --check`.
- Manual regression checks:
  - confirm both pricing widgets on `services.html` remain unchanged
  - confirm `#service-page-clusters` appears before `#service-supporting-guides`
  - confirm both appear before the FAQ block
  - confirm all current niche and blog links remain visible and crawlable
  - confirm `#primary-site-links` on `index.html` still contains only the five required core links in the same order
  - confirm mobile and desktop layouts preserve parallax sections and do not introduce unexpected visual shifts

## Notes

- This task follows Google Search Central guidance for crawlable internal links, clear site structure, and mobile-first parity:
  - https://developers.google.com/search/docs/crawling-indexing/links-crawlable
  - https://developers.google.com/search/docs/crawling-indexing/site-structure
  - https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
