<!-- FILE: codex/execplans/2026-02-05_seo-indexability-and-sitemap.md -->
# ExecPlan: SEO Indexability + Sitemap Compliance

Owner: Codex (GPT-5)
Date: 2026-02-05
Scope: Ensure all public HTML pages are indexable and `sitemap.xml` meets Google Search Console requirements.

## Primary outcomes (acceptance criteria)

A) All public HTML pages are indexable (no unintended `noindex`).
B) Canonical URLs are absolute and match sitemap entries.
C) `sitemap.xml` is derived from canonical URLs and uses `lastmod` in `YYYY-MM-DD`.
D) `robots.txt` advertises the sitemap and favicon/manifest references resolve.
E) `node scripts/seo-audit.js` passes with zero errors.

## Baseline & reproduction protocol (before editing)

1) Inventory HTML pages:
   - `rg --files -g "*.html"`

2) Compare canonical URLs vs sitemap:
   - `node -e "const fs=require('fs');const s=fs.readFileSync('sitemap.xml','utf8');const urls=[...s.matchAll(/<loc>([^<]+)<\\/loc>/g)].map(m=>m[1]);console.log('sitemap',urls.length);"`

3) Confirm no `noindex` tags are present:
   - `node -e "const fs=require('fs');const files=require('child_process').execSync('rg --files -g \\\"*.html\\\"').toString().trim().split(/\\n+/);let found=0;for(const f of files){const t=fs.readFileSync(f,'utf8');if(/noindex/i.test(t)) found++;}console.log('noindex',found);"`

Baseline observations:
- 15 HTML pages found; sitemap contains 15 URLs.
- No `noindex` meta tags found.
- HTML file modification dates are `2026-02-03`; sitemap `lastmod` values were older (2025-11-26/2025-12-12), indicating stale metadata.

## Implementation constraints (hard rules)

- No visual or behavioral changes beyond SEO/indexability fixes.
- Do not add `noindex` or block crawling unless explicitly required.
- Derive sitemap URLs from each page's canonical link.
- Include only indexable pages in the sitemap.
- `lastmod` must be a W3C date (`YYYY-MM-DD`) derived from file modification time.
- Keep diffs minimal and localized.

## Stepwise execution (must follow)

1) Add/update SEO audit + sitemap generation script (`scripts/seo-audit.js`).
2) Update governance docs to enforce SEO/indexability checks.
3) Regenerate sitemap: `node scripts/seo-audit.js --write-sitemap`.
4) Verify: `node scripts/seo-audit.js` passes.

## Validation gates (must pass)

Gate 1: SEO audit passes
- `node scripts/seo-audit.js`

Gate 2: Sitemap freshness
- `sitemap.xml` `lastmod` values are `YYYY-MM-DD` and reflect HTML file mtimes.

Gate 3: Robots + favicon/manifest
- `robots.txt` includes `Sitemap: https://silverstone-ai.com/sitemap.xml`
- HTML head includes the favicon/manifest snippet per `codex/execplans/2026-02-03_update-favicon-links.md`.

## Decision log

- Decision: Use canonical URLs as the sitemap source of truth.
  - Why: Prevents mismatch between public URLs and sitemap entries.
- Decision: Set `lastmod` from HTML file modification time in `YYYY-MM-DD`.
  - Why: Matches Google-supported W3C date format and keeps timestamps accurate without manual edits.

## Notes / discoveries

- Canonical links already exist on all HTML pages; sitemap coverage matches, but lastmod metadata was stale.

## Verification results (2026-02-05)

- `node scripts/seo-audit.js --write-sitemap` updated `sitemap.xml` from canonical URLs.
- `node scripts/seo-audit.js` passed with 15 indexable URLs.
- `sitemap.xml` `lastmod` values now align to HTML mtimes (`2026-02-03`) in `YYYY-MM-DD`.
