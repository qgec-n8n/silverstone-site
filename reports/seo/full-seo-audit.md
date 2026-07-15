# Full SEO Audit — Silverstone AI (silverstone-ai.com)

**Date:** 2026-07-15 · **Audited state:** local production build at the migration
tree (pre-deploy) + live production (outdated deploy) + git history.
**Systems used:** Agentic-SEO-Skill (`seo`, Bhanunamikaze — orchestrator +
bundled scripts; localhost scripts were SSRF-blocked so equivalent
deterministic checks ran directly, and its script suite re-runs against the
live domain post-deploy) and claude-seo v2.2.0 (AgriciDaniel — five specialist
subagents: seo-technical, seo-schema, seo-sitemap, seo-content, seo-geo).
All findings verified/deduplicated before implementation; see
`consolidated-seo-findings.csv` for the full evidence table and dispositions.
This file is the combined FULL-AUDIT-REPORT; `gsc-action-guide.md` +
the consolidated CSV serve as the ACTION-PLAN.

## Headline scores (claude-seo specialists)

| Area | Score | Notes |
| --- | --- | --- |
| Technical SEO | 90/100 | No critical defects in the migrated tree; strong build-time gates |
| Sitemap architecture | pass (2 low findings, both fixed) | index + pages + posts, accurate lastmod |
| Structured data | pass after fixes | 47/47 pages valid JSON-LD; Service/Organization corrected |
| Content / E-E-A-T | ~47/100 composite | strong trust + differentiation; weak authorship/citations (visible-copy scope) |
| GEO / AI-search | 51/100 | strong article prerendering; homepage gate + unrendered FAQ/sources cap it |

## Critical path (what was broken, now fixed locally)

1. **Deploys failing** — Edge Function `HEAD` method rejected by Netlify's
   manifest validator. Fixed to `method: ["GET"]`; verified with the real
   Netlify bundler locally; regression test added.
2. **Soft 404s in production** — live site returns 200 shells for any unknown
   URL. Fixed tree: SPA fallback removed, all 47 routes prerendered, branded
   `404.html` served with genuine 404, edge guard 404s unknown variants.
3. **URL migration was destructive** — the undeployed pass deleted every
   legacy redirect and hard-404'd all variants. Rebuilt as a full migration:
   53 one-hop 301s (21 blog renames, 9 niches, 9 industries, 10
   services-industry aliases + trades consolidation, 2 service aliases,
   /industries hub, /index) and 45 × 410 for deleted legacy articles.
4. **Sitemap** — split into index + pages (25) + posts (21), accurate
   `<lastmod>` from content dates (never the build clock), build fails on any
   sitemap/prerender/canonical/robots inconsistency, daily blog automation
   flows into `sitemap-posts.xml` with zero extra steps.

## Per-area detail

- Technical: `technical-seo-report.md`
- Sitemaps: `sitemap-validation-report.md`
- Structured data: `schema-validation-report.md`
- Internal links: `internal-link-report.md`
- Blog automation: `blog-indexing-report.md`
- Live verification (post-deploy): `production-url-matrix.csv`
- Visual/functional safety: `visual-regression-report.md`
- Out-of-scope visible-content items: `visible-content-recommendations.md`

## NOT_APPLICABLE checks (both systems, recorded per instruction)

- E-commerce/product SEO (no products), hreflang/multilingual (single en-GB
  locale), multi-location local SEO (one London studio; address is marked up
  and visible on /contact), RSS/Atom feed updates (no feed exists — creating
  one was not required), FAQ rich-result schema (no visible FAQ text in
  rendered HTML; Google restricts FAQ rich results regardless), llms.txt
  (no confirmed engine support as of 2026-07 — deliberately not added),
  IndexNow submission (explicitly out of authorization; key file already
  deployed), seo-drift baseline (none existed), paid-API skills
  (ahrefs/dataforseo/GSC/CrUX — no credentials in this environment).
