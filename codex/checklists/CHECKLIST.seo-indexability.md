<!-- FILE: codex/checklists/CHECKLIST.seo-indexability.md -->
# Checklist: SEO Indexability + Sitemap

1. Run `node scripts/seo-audit.js`.
2. If the sitemap is out of sync, run `node scripts/seo-audit.js --write-sitemap`, then re-run the audit.
3. Confirm `sitemap.xml` contains only canonical, indexable URLs and `lastmod` uses `YYYY-MM-DD`.
4. Confirm `robots.txt` includes `Sitemap: https://silverstone-ai.com/sitemap.xml`.
5. Confirm favicon/manifest files referenced in HTML exist at repo root.
6. Confirm sitemap size limits stay under 50,000 URLs and 50MB uncompressed.
