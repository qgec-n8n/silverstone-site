# Google Search Console Action Guide — post-deploy (2026-07-15 migration)

Property: `https://silverstone-ai.com/` (URL-prefix or domain property).

## 1. Sitemaps

- Submit `https://silverstone-ai.com/sitemap.xml` (the index). GSC will fetch
  `sitemap-pages.xml` and `sitemap-posts.xml` through it — you can also submit
  the two children individually to get per-type coverage reporting.
- If an old sitemap URL is still listed from the legacy site (e.g.
  `sitemap-main.xml`, `sitemap-niches.xml`, `sitemap-blog.xml`,
  `sitemap-legal.xml`), delete those entries — they now return 404.
- Do NOT use the deprecated sitemap ping endpoint; submission through GSC (or
  robots.txt discovery) is sufficient. Do not use the Indexing API for blog
  articles — it is not intended for ordinary content.

## 2. Priority URL inspection / reindex requests

`gsc-priority-reindex-urls.txt` (46 URLs). Google finds everything via the
sitemap, but Request Indexing has a daily quota — spend it in this order:

1. `/` (homepage — canonical form changed from trailing-slash serving)
2. `/services`, `/industry`, `/blog` (hubs)
3. The 7 `/services/*` pages, then the 9 `/industry/*` pages
4. The 21 `/blog/*` articles (all live under NEW slugs — Google has only the
   old slugs today)

Treatment notes:
- **Current reused URLs** (e.g. `/about`, `/pricing`): content was fully
  rewritten at the 2026-07-07 cutover; they stay 200 and simply reindex. Do
  not remove or redirect them.
- **New URLs** (renamed blog slugs, `/how-we-work`, `/industry*`): inspect a
  sample, confirm "URL is on Google" transitions after the sitemap processes.

## 3. Redirecting legacy URLs — do nothing

`/niches/*`, `/industries*`, `/services/<industry>`, the two service aliases
and all 21 old blog slugs now 301 in one hop. Leave them alone: no removal
requests (that would suppress the redirect target's consolidation). Expect
them to appear in Page indexing as "Page with redirect" — that is the correct
terminal state.

## 4. Deleted URLs (410)

`gsc-exact-removal-urls.txt` (45 legacy article URLs, all verified 410).
- Expect them to move to "Not found (404)"/"Gone (410)" in Page indexing
  naturally; no action is strictly required.
- If any of them still shows in live search results and you want it hidden
  fast, use Removals → New request → "Remove this URL only" with the exact
  URL. Only bother for URLs that actually appear in `site:` queries.
- They remain crawlable (robots.txt does not block them) so Google can
  observe the 410 — do not add Disallow rules for them.

## 5. Prefix removals — none

See `gsc-safe-prefix-removals.txt`: no prefix qualifies. Never remove
`/blog/`, `/services/`, `/industry/`; `/niches/` and `/industries/` carry
live 301s that must stay visible to Google.

## 6. Soft-404 validation

The previous deploy served 200 shells for unknown URLs, so Page indexing
likely lists "Soft 404" entries. After this deploy those URLs return genuine
404/410/301. In Page indexing → Soft 404, click **Validate fix** once the new
deploy has been live a few days.

## 7. Expected exclusion states (healthy)

- "Page with redirect" — all legacy 301 sources.
- "Not found (404)" / 410 — deleted legacy articles, malformed URLs.
- "Excluded by 'noindex' tag" — `/privacy-policy`, `/404.html` shell,
  `/410.html`, `/invoices/*`.
- "Alternate page with proper canonical tag" — should trend to zero (no
  aliases remain).
- "Duplicate without user-selected canonical" — should not appear; if it
  does, inspect the URL and report.
