# Internal Link Report — 2026-07-15

Method: full HTML crawl of the 47-page production build (parser-based, all
`<a href>`).

- Broken internal links: 0.
- Orphan pages (no internal inbound): 0 (every route reachable through
  crawlable `<a href>` markup).
- Noncanonical internal links (legacy /industries/, /niches/,
  /services/<industry>, old blog slugs): 0 in rendered HTML (matches in
  hydration payloads are inert metadata).
- All internal links use slashless canonical destinations.
- Images: 128 total; every content image has descriptive alt; 47 decorative
  brand emblems correctly use alt=""; all images carry loading + width/height
  attributes; no lazy-loaded LCP image (loader emblem is eager +
  fetchPriority=high).

Caveat: the homepage contributes no internal links in initial HTML (intro
gate — see visible-content-recommendations.md); crawl connectivity is carried
by the other 46 pages and both sitemaps.
