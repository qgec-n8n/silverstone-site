# Sitemap Validation Report — 2026-07-15

Source: claude-seo `seo-sitemap` specialist + build-time gates in
`web/scripts/generate-seo-artifacts.mjs`.

Architecture: `sitemap.xml` (index) → `sitemap-pages.xml` (25 URLs) +
`sitemap-posts.xml` (21 URLs). All XML parses; namespaces correct; all 46
`<loc>` absolute https apex, lowercase, slashless; every URL has a
self-canonical, indexable, substantial prerendered document; `/privacy-policy`
(noindex) correctly excluded; zero redirect sources, gone paths, aliases,
drafts, duplicates, queries, fragments or `.html` entries.

lastmod policy: pages from `web/src/data/page-content-dates.json`
(git-evidenced content dates; omitted when unknown), `/blog` hub = newest
article date, posts = max(published, updated). No build-clock stamps; unit
tests pin stability across rebuilds. Index lastmod is per-child (fixed from
pooled max during audit).

Build-time rejection gates (all exercised): missing/extra prerendered docs,
non-self-canonical page, noindex page in sitemap, <800 visible chars
(homepage documented exception), duplicate URLs, malformed URLs, future-dated
or duplicate-slug published posts, redirect source shadowing a document, 410
path with a document, redirect target without a document.

Blog automation: an article published via the existing n8n flow (append to
`BLOG_POSTS`, status "published") is automatically prerendered, gated, added
to `sitemap-posts.xml` with its own lastmod, listed on the crawlable /blog hub
(plain `<a href>` cards), and shipped atomically with the deploy. A deleted
article leaves the sitemap on the next build; a renamed slug fails closed
(404) unless a mapping is added to
`netlify/edge-functions/lib/url-migration.mts` — enforced convention
documented there and regression-fixed for all 21 historical slugs.
