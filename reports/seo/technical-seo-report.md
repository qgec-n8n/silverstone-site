# Technical SEO Report — 2026-07-15

Source: claude-seo `seo-technical` specialist over the final production build +
Netlify config, cross-verified by direct checks. Full table in
`consolidated-seo-findings.csv`.

Score: 90/100. No critical defects in the migrated tree.

## Verified pass
- robots.txt: `Allow: /` + `Sitemap: https://silverstone-ai.com/sitemap.xml`.
- 47/47 prerendered pages self-canonical (lowercase, slashless, apex https).
- No duplicate canonicals; no duplicate descriptions; titles unique after the
  dental-article fix.
- Viewport meta on every page; no user-scalable restrictions.
- `_redirects`: 53×301 + 45×410, zero chains, zero loops, zero canonical
  shadowing (independently traced).
- Edge function: valid manifest (GET only), narrow pattern, one-hop 301 for
  recognised variants (now including www variants directly to apex), 410 for
  removed pages, genuine 404 otherwise.
- Pretty URLs disabled; matches slashless canonical policy.
- Structured data valid JSON on all pages; breadcrumb URLs all resolve.
- Hydration scripts `type=module async`; LCP emblem preloaded fetchPriority=high.

## Fixed during this pass
- Edge `HEAD` method (deploy blocker) → `["GET"]` + regression test.
- 404.html now carries `Page not found` title + `noindex` meta (status 404
  served by Netlify automatically).
- Site-wide additive security headers: HSTS, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
  (X-Frame-Options / Permissions-Policy intentionally deferred — iframe
  integrations need a functional review first.)
- `/invoices/*` now served with `X-Robots-Tag: noindex, nofollow`.
- www + noncanonical variant now collapses in ONE hop at the edge.
- 410.html `lang` aligned to `en`.

## Known accepted exceptions
- Homepage prerenders only the intro (documented; see
  visible-content-recommendations.md).
- CWV field data deferred to post-deploy (PSI was rate-limited; live deploy
  was outdated anyway).
