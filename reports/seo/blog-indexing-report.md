# Blog Indexing & Automation Report — 2026-07-15

Initial HTML of every article (verified on the built output): full body
(~1.4–2.2k words), exactly one H1, unique title + meta description,
self-canonical, `index, follow`, publication metadata
(`article:published_time` / `article:modified_time` — added this pass),
absolute og:image + twitter card parity (added this pass), BlogPosting
JSON-LD (headline, absolute image, dates, author/publisher Organization with
logo, mainEntityOfPage == canonical). No spinner/Suspense/client-fetch
dependency for article text.

Publish pipeline (n8n appends to `web/src/data/blog-posts.ts` between the
N8N_BLOG_POSTS markers): on deploy the article is prerendered
(react-router.config.ts derives paths from PUBLISHED_BLOG_POSTS), enters
`sitemap-posts.xml` + the edge-function canonical set (both generated from
the same source at build time), and appears on the /blog hub cards — one
commit, one atomic deploy, no manual steps.

Build fails on: duplicate slug, invalid slug shape, missing title/description,
missing/invalid/future publication date, missing prerender, sitemap/route
mismatch, deleted article resurfacing (GONE overlap gate), redirect-source
collision. Renames require an explicit mapping in url-migration.mts (all 21
historical renames mapped + regression-tested); deletions require moving the
slug to GONE_PATHS (410).

Historical URLs: 21 pre-rename slugs → one-hop 301 to the renamed articles;
45 deleted legacy article URLs (33 cutover + 12 long-form aliases) → 410;
never a blanket redirect to /blog.
