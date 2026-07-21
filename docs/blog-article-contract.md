# Blog Article Output Contract

The contract every published article in `web/src/data/blog-posts.ts` must
satisfy before it can ship. It binds human editors and the external
publishing automation equally.

Enforcement layers:

- **Deploy gate** — `web/scripts/generate-seo-artifacts.mjs`
  (`validateBlogData` plus the prerender/canonical/sitemap gates in `main`).
  A violation fails the production build with a message naming the article
  and the field. Invalid articles are never silently omitted.
- **Test gate** — `web/tests/unit/blog-posts.test.ts` (slug policy, hero
  asset existence, metadata uniqueness, date ordering).

## Identity and URL

1. `slug`: unique, stable, lowercase `a–z0–9` with single hyphens; 3–6
   words, 20–60 characters, no repeated words. The slug must read as
   natural English in the order written (no word-order scrambles, no
   truncated grammar). Once published, a slug is permanent — renames
   require a 301 entry in `netlify/edge-functions/lib/url-migration.mts`.
2. Canonical URL: `https://silverstone-ai.com/blog/{slug}` — absolute,
   HTTPS, apex host, no trailing slash. The article page emits it as a
   self-referencing `<link rel="canonical">`.
3. `status`: `"published"` only when every other requirement holds.

## Required metadata (all non-empty)

4. `title` — unique across all posts; used as the H1 and schema headline.
5. `metaTitle` — unique; rendered verbatim as the `<title>`; ≤ 60
   characters preferred; British English; no keyword stuffing.
6. `metaDescription` — unique; rendered verbatim as the meta description;
   ~150–160 characters preferred; describes this article specifically.
7. `subtitle` / `summary` — present; used on the hub cards and hero.
8. `categoryId` + `categoryLabel` — a real category from
   `web/src/features/core-pages/insights-data.ts`.
9. `publishedIsoDate` — valid ISO date, not in the future.
   `updatedIsoDate` — valid ISO date, never earlier than
   `publishedIsoDate`. `displayDate` must agree with `publishedIsoDate`.
10. `heroImage` — exactly `/assets/images/blog/{slug}-hero.webp`, and the
    file must exist in `web/public`. `heroImageAlt` — descriptive, non-empty.

## Content

11. Exactly one H1 (the title); sections use H2, subsections H3 — no level
    skips.
12. People-first, useful body content. No fabricated statistics, awards,
    client names, rankings or benchmark numbers without a verifiable
    source in the repository.
13. No near-duplicate of an existing article's topic or target query.
    Before generating, the automation must check existing slugs/titles and
    either choose a distinct angle or update the existing article.
14. Body copy links naturally to at least one relevant `/services/{slug}`
    or `/industry/{slug}` page using descriptive anchors. Only current
    canonical paths (never `/services/<industry>`, `/industries/…`,
    `/niches/…`, old blog slugs, or absolute URLs with `www`).
15. Clean UTF-8 punctuation (no mojibake), no unrendered Markdown/HTML
    artefacts, no leaked prompt or research text in rendered fields.
16. Internal working fields (`researchSources`, `imagePrompt`) are
    tolerated in the data file but must never render on the page.

## Integration (owned by the website, verified per build)

17. Route: served at `/blog/{slug}` via `routes/blog/article.tsx`;
    prerendered at build time with meaningful page-specific HTML.
18. Blog hub: listed with a crawlable link on `/blog`
    (`BLOG_CARD_ARTICLES` → insights board).
19. Sitemap: exactly one entry in `sitemap-posts.xml` with `lastmod` from
    the content dates.
20. Robots: `index, follow` in production; never `noindex`; no
    `X-Robots-Tag` block.
21. Breadcrumbs: visible Home → Blog → article trail and matching
    `BreadcrumbList` JSON-LD; `BlogPosting` JSON-LD with truthful dates,
    absolute image URL and Organization author/publisher.

## Definition of done for one article

The production build (`npm --prefix web run build:production`) and the unit
suite (`npm --prefix web run test`) both pass with the article present, and
the article renders at `/blog/{slug}` with the metadata above.
