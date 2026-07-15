# Adversarial Verification Verdict — Silverstone AI SEO + URL-Migration + Deploy
Verifier: independent adversarial audit. Deployed commit: `6fab6f75` (HEAD of main, pushed 0/0 vs origin/main). Live host: https://silverstone-ai.com

## Bottom line
**No unresolved critical or high-priority defects.** Every claimed critical/high fix was independently confirmed on the live production site and in the repo. Only three LOW/cosmetic nits found (documentation wording/staleness + untracked scratch files). The migration is sound.

## Defects table
| severity | area | claim vs reality | evidence |
|---|---|---|---|
| low (nit) | visual-regression-report.md | Report states "No component markup, CSS, animation, or route destination changed", but `web/src/routes/blog/article.tsx` (+19) and `web/src/routes/templates/article-page.tsx` (+8) — route components — did change. Reality: only their `<head>`/meta emission changed (og:image, article dates, twitter, publisher.logo), not visible body markup; the report's own byte-level body diff (46/47 identical) supports the no-regression conclusion. Wording imprecision, not a functional defect. | `git diff --name-only 2afeb576..HEAD \| grep -E 'features/.*tsx\|components/.*tsx\|\.css'` → empty (no visible-component/CSS files changed); article.tsx/article-page.tsx changes are meta-only |
| low (nit) | url-migration.mts header comment | Comment says "current 21-post blog" / "21 pre-rename blog slugs"; there are now **22** published posts (newest automation article added after the comment was written). Code, tests, `_redirects`, and sitemap are all internally consistent at 22 — only the prose comment is stale. | `node` count → PUBLISHED_BLOG_POSTS=22; sitemap-posts.xml=22; LEGACY_REDIRECTS still maps the original 21 renames (correct — the 22nd was never renamed) |
| low (info) | untracked files | `claude-seo/` and `reports/seo/production-url-matrix.csv` are untracked in the working tree. Not part of publish dir, not referenced by build — zero deploy impact. | `git status --short` |

Note: rows 24/25/26/32 in consolidated-seo-findings.csv (homepage body prerender, blog FAQ/sources rendering, service-accordion FAQ, human author bylines) remain **NOT IMPLEMENTED** — but each is **honestly disclosed** as a documented exception in the CSV and visible-content-recommendations.md, never falsely claimed FIXED. No misrepresentation.

## Confirmed passes (all independently verified)
1. **Build/deploy health** — HEAD `6fab6f75` pushed (0 ahead/0 behind origin/main). Live sitemap-index architecture proves edge bundling passed. `netlify.toml` has exactly **1** `[[redirects]]` (www→apex, force=true). `grep -c '^\[\[redirects\]\]'` = 1.
2. **Edge method validity** — `reject-noncanonical-paths.ts` config `method: ["GET"]` only (line 111). No HEAD/unsupported value. Regression test `edge-function-config.test.ts` enforces the Netlify enum.
3. **Live URL behavior (all curl-confirmed):**
   - `/`, `/about`, `/services/ai-automation`, `/industry/dentists`, `/blog/ai-receptionist-setup-guide` → **200**, self-canonical, `robots index,follow`.
   - `/about/` → 301→`/about` (one hop). `/about.html`→301→`/about`. `/index`→301→`/`. `/index.html`→301→`/`.
   - `/niches/dentists`→301→`/industry/dentists`. `/services/dentists`→301→`/industry/dentists`. `/industries/hospitality`→301→`/industry/hospitality`. `/services/website-design-development`→301→`/services/web-design-development`.
   - Renamed blog `/blog/ai-receptionist-uk-a-practical-guide-for-small-business-owners` → 301→`/blog/ai-receptionist-small-business-guide` (one hop).
   - Deleted blogs `/blog/ai-missed-call-recovery-dentists-uk` and `/blog/dental-recall-automation-uk-2026` → **410**.
   - `/no-such-page-xyz`, `/wp-admin`, `/blog/does-not-exist` → **genuine 404** (404.html, title "Page not found | Silverstone AI", `robots noindex`; homepage-shell grep = 0, NOT a 200 shell).
   - HEAD requests all work (`/`=200, `/about/`=301, `/niches/dentists`=301, deleted blog=410, unknown=404) — no errors.
   - www `https://www.silverstone-ai.com/about?x=1` → final `https://silverstone-ai.com/about?x=1` (query preserved).
4. **Sitemaps** — `sitemap.xml` is a `<sitemapindex>` (200, application/xml) → `sitemap-pages.xml` (25 URLs) + `sitemap-posts.xml` (22 URLs), both 200. All 47 `<loc>` absolute https apex, lowercase, slashless. **Zero** redirect sources, **zero** 410 slugs, **zero** /privacy-policy in sitemap. 5 sampled URLs all 200/self-canonical/index,follow. `robots.txt` 200 text/plain, `Allow: /`, references `sitemap.xml`. Lastmods are real content dates (2026-07-01…07-15 spread), not the build clock.
5. **Blog automation integrity** — PUBLISHED_BLOG_POSTS=22 = sitemap-posts count. Newest article `ai-automation-consulting-smarter-operating-system` in sitemap, 200 live, has BlogPosting JSON-LD + exactly one visible `<h1>` ("AI & Automation Consulting in the UK…"). Cross-check: GONE∩LEGACY=∅, GONE∩PUBLISHED=∅, LEGACY∩PUBLISHED=∅, no legacy→gone or legacy→legacy chains.
6. **Structured data** — `/industry/dentists` Service JSON-LD name == visible h1 ("Recover every patient. Automate none of the care."); `areaServed` = United Kingdom only (no Europe/US). Homepage Organization JSON-LD has logo + sameAs (Instagram/Facebook) + PostalAddress (GB). Article BlogPosting `publisher.logo` ImageObject present; og:image absolute URL.
7. **Metadata parity** — `/about` and `/services/ai-automation`: each exactly 1 canonical, og:url == canonical, 1 `<title>`, 1 meta description, robots index,follow.
8. **Tests** — `npx vitest run` → **34 files / 159 tests, 0 fail**. `edge-function-config.test.ts` (173 lines) and `url-migration.test.ts` (177 lines, 14 tests: slug-migration coverage, gone-not-chained, no hub redirect, publishing gates, lastmod-not-clock, one-rule-per-entry, single hostname redirect, no canonical shadowing) are substantive, not stubs.
9. **Claimed-fix audit** — spot-checked FIXED rows 2,3,4,11,12,13,15,17,18,19,22: all confirmed present live. Row 11 titles genuinely differentiated ("Dental Practice Automation UK | …" vs "Dental Practice Automation: UK Systems Guide | …"). Row 22 `/invoices/*.pdf` returns `x-robots-tag: noindex, nofollow`. Row 12 homepage title = descriptive. No FIXED claim found to be false.
10. **Regression method** — `git diff --stat 2afeb576..HEAD`: 43 files, changes confined to edge-functions, netlify.toml, web/scripts, 410.html, data files, head-meta in article templates, schema builders, tests, config. No CSS/feature/visible-component-body file changed — corroborates the near-zero visual risk claim. `/privacy-policy` reachable (200) but noindex,nofollow and correctly sitemap-excluded.
