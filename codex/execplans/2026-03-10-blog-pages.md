# ExecPlan: Blog Pages and Shared Navigation Update

## Observed baseline

- `npm run seo:audit` passed before edits for 14 indexable pages and the existing sitemap.
- There were no `blog.html`, `../blog.html`, or `blog/*.html` links anywhere in the standard page templates.
- The requested image path `assets/images/blog/blog_1.jpeg` was missing, while the source image existed at `assets/images/blog_1.jpeg`.
- The site uses duplicated static templates rather than shared header/footer partials, so the nav/footer change had to be applied per template.
- The shared hero shader comes from `src/js/hero-shader.js`; the body parallax background comes from `assets/images/body_section_parallax/body-section-background-2025.webp`; the gallery/carousel pattern is the `#neural-grid` plus marquee block.

## Root cause

- The blog surface did not exist yet, and the shared Blog navigation/footer entry was absent because each page carries its own copy of the header/footer markup.
- The requested red blog hero was not available because the shader theme map had no red variant.
- The requested image path was not available because the source asset had not been copied into the nested blog image directory.

## Changes made

- Added a scoped blog page stylesheet in `src/css/pages/blog.css` and included it in the CSS build order.
- Added a red hero-shader variant in `src/js/hero-shader.js`.
- Created `blog.html` as the blog index page.
- Created `blog/ai-receptionist-small-business-2026.html` as the article page sourced from `blog_1.pdf`.
- Copied the blog card image to `assets/images/blog/blog_1.jpeg`.
- Added Blog nav/footer links across all standard root pages and niche pages.
- Added the new blog index/article canonicals to `scripts/seo-audit.js` and `sitemap.xml`, and updated sitemap `lastmod` values for the changed indexable pages.

## Verification

- Baseline evidence captured before edits: SEO audit pass, zero blog links in templates, and missing nested blog image path.
- Post-edit verification to run:
  - `npm run build:css`
  - `npm run build:js`
  - `npm run seo:audit`
  - Link/path checks for `blog.html`, `blog/ai-receptionist-small-business-2026.html`, `assets/images/blog/blog_1.jpeg`, nav/footer links, and sitemap entries

## Assumptions and tradeoffs

- The source image provided by the user existed at `assets/images/blog_1.jpeg`, so it was copied into the requested nested path rather than moved.
- No single niche page was clearly the best secondary CTA destination for this article, so the secondary CTA links use `services.html` per the task instruction fallback.
- The repo had no active ExecPlan file for this task, so this plan was created under `codex/execplans/`.

## Follow-up refinement

- Reduced the blog index card size on `blog.html` by shrinking the card width, media ratio, typography, and spacing in `src/css/pages/blog.css`.
- Simplified `blog/ai-receptionist-small-business-2026.html` to the shared shell plus article copy only by removing the visible image, the gallery section, the related-links block, and the CTA block.
- Replaced unsupported blog-article list icon classes with existing site-supported Font Awesome glyphs so every unordered article list item renders with a visible icon bullet across `blog/*.html`.

## 2026-03-12 sitemap priority update

- Observed before edit: `sitemap.xml` omitted `<priority>` values for the homepage, about, services, blog, book, contact, and all `/niches/*` URLs; `npm run seo:audit` also failed because `scripts/seo-audit.js` had not been updated for seven already-published blog articles that were present in the sitemap.
- Root cause: the sitemap priorities for these URLs had never been set, and the audit allowlist had drifted behind the current set of canonical blog article pages.
- Changes made: added `<priority>1.0</priority>` to `https://silverstone-ai.com`, `/about`, `/services`, `/blog`, `/book`, and `/contact`; added `<priority>0.8</priority>` to every current `/niches/*` sitemap entry; updated `scripts/seo-audit.js` so its indexable-page list matches the canonical blog articles already shipped in the repo.
- Verification target: rerun `npm run seo:audit` and inspect the affected sitemap entries to confirm the requested priority values are present and the sitemap now matches the audit's indexable canonicals.

## 2026-03-12 blog article hero background update

- Observed before edit: every `blog/*.html` article page still rendered the red `#hero-shader-canvas` in its hero, while `blog.html` already used the intended red shader and each article already had a dedicated card image on the blog index.
- Root cause: the article templates reused the generic red shader hero media block instead of swapping to per-article imagery when the newer card assets were added.
- Changes made: replaced the hero canvas on each current article page with a `hero-media` background image using that article's existing card asset, plus a light darkening gradient to preserve text contrast; left `blog.html` unchanged so it continues to use the red shader hero.
- Verification target: confirm `blog.html` still contains `#hero-shader-canvas`, confirm `blog/*.html` no longer contain it, and inspect the article hero media blocks to ensure the background image path matches the corresponding card image on the blog index.

## 2026-03-12 trades article hero background update

- Observed before edit: `blog/ai-lead-capture-uk-trades-2026.html` still rendered the red `#hero-shader-canvas` even though its blog index card already used `assets/images/blog/blog_13.png`.
- Root cause: this newer trades article was not included in the earlier article-hero image swap and was still using the older shared hero markup.
- Changes made: replaced the trades article hero canvas with a `hero-media` background image using `../assets/images/blog/blog_13.png` plus the same darkening gradient used on the other article heroes.
- Verification target: confirm `blog/ai-lead-capture-uk-trades-2026.html` no longer contains `#hero-shader-canvas`, confirm its hero media now references `blog_13.png`, and ensure `blog.html` still owns the red shader hero.

## 2026-03-12 blog article hero visibility fix

- Observed before edit: the article hero assets were present in the markup, but the full-hero darkening gradient layered into each article page made the card artwork read almost black, so the images were not visibly functioning as the hero background treatment.
- Root cause: the article pages were using `background-image` layers on `.hero-media` with a full-bleed gradient overlay, even though the hero copy already sits in its own panel; that extra overlay was masking the card art.
- Changes made: replaced the article hero `background-image` styles with actual `<img class="hero-fallback-image">` elements inside `.hero-media`, removed the full-hero darkening gradients, and set the hero images to eager/high-priority loading so the artwork is visible immediately.
- Verification target: confirm each `blog/*.html` article now contains a `hero-fallback-image` element with its mapped card asset, confirm no article still uses the gradient background-image pattern, confirm `blog.html` still contains the red shader canvas, and rerun `npm run seo:audit`.

## 2026-03-12 blog article hero panel opacity tune

- Observed before edit: once the article hero images were visible, the shared desktop hero panel style on `.hero.title-band .content` still looked too opaque/frosted on `blog/*.html`, obscuring too much of the hero artwork beneath it.
- Root cause: the shared hero component uses the same desktop glass treatment for every page (`rgba(7, 12, 20, 0.65)` with `blur(8px)`), which is heavier than needed on image-led blog article heroes.
- Changes made: added a blog-article-only desktop override in `src/css/pages/blog.css` that reduces the panel background opacity, slightly lowers the blur, and keeps the border/shadow strong enough for text legibility. This override does not apply to `blog.html` or any non-blog hero.
- Verification target: rebuild `assets/css/styles.css`, confirm the compiled CSS contains the new `.page-blog-article .hero.title-band .content` override, and ensure `npm run seo:audit` still passes.

## 2026-03-12 blog index gallery removal

- Observed before edit: `blog.html` still included the "Automation ideas in action" section containing the `#neural-grid` mosaic gallery and `#innovation-marquee-slot`.
- Root cause: the gallery block remained on the blog index even though it was no longer desired content for that page.
- Changes made: removed the entire gallery section from `blog.html`; no JS change was required because the premium gallery initializer already exits when `#neural-grid` is absent.
- Verification target: confirm `blog.html` no longer contains "Automation ideas in action", `#innovation-gallery`, `#neural-grid`, or `#innovation-marquee-slot`, and rerun `npm run seo:audit`.

## 2026-03-13 blog indexability normalization

- Observed before edit:
  - The canonical production host already served `https://silverstone-ai.com/robots.txt` and `https://silverstone-ai.com/sitemap.xml` with `200`, so the indexing issue was not a missing robots file on the primary host.
  - All 20 `blog/*.html` articles already had extensionless canonical tags and were already listed in `sitemap.xml`, but both `/blog/slug` and `/blog/slug.html` resolved with `200`, leaving duplicate crawlable URL shapes live.
  - There were 34 internal links still pointing at `.html` blog URLs, 5 pages had a copied `og:url` pointing at `ai-receptionist-small-business-2026`, 12 blog pages had no article JSON-LD at all, and the existing SEO audit allowlist omitted 11 live blog posts.
- Root cause:
  - Google was being given mixed canonical signals for the same articles: duplicate `.html` URLs stayed live, internal links still referenced those duplicates, and some social metadata pointed at the wrong article URL entirely.
  - The repo’s SEO audit was too stale to catch that drift, so new blog posts could ship without matching sitemap, metadata, and structured-data checks.
- Changes made:
  - Added explicit Netlify `301` redirects in `netlify.toml` for every current `/blog/*.html` article URL to its extensionless canonical.
  - Replaced the remaining `.html` blog links in `blog.html` and article cross-links with extensionless canonical URLs.
  - Corrected the 5 incorrect `og:url` tags and standardized all 20 blog pages on `BlogPosting` JSON-LD.
  - Rewrote `scripts/seo-audit.js` to discover `blog/*.html` automatically and fail on missing sitemap coverage, bad `og:url`, missing `BlogPosting` JSON-LD, or non-canonical `.html` blog links.
  - Updated `sitemap.xml` `lastmod` values for the touched blog hub and article URLs.
- Before/after evidence:
  - Before: `node scripts/seo-audit.js` failed with 11 unexpected sitemap blog URLs because the allowlist lagged behind the live sitemap.
  - Before: a repo-wide scan found 34 `href="...blog/...html"` links and 5 `og:url` mismatches across blog articles.
  - After: `npm run seo:audit` passes for 20 blog pages, 15 static indexable pages, `robots.txt`, and `sitemap.xml`.
  - After: a local Netlify runtime verification loop confirmed all 20 canonical article URLs return `200` and all 20 `.html` article URLs return a single `301` to the extensionless canonical.
  - After: sampled production checks still show `https://silverstone-ai.com/robots.txt`, `https://silverstone-ai.com/sitemap.xml`, and canonical blog URLs returning `200` with no `X-Robots-Tag: noindex` header present.
- Reproducible verification loop:
  - Run `npm run seo:audit`.
  - Start `npx --yes netlify-cli dev --port 8899`.
  - For each `blog/*.html` file, verify `http://localhost:8899/blog/slug` returns `200` and `http://localhost:8899/blog/slug.html` returns `301` to the extensionless URL.
  - Confirm production host availability with `curl -I https://silverstone-ai.com/robots.txt` and `curl -I https://silverstone-ai.com/sitemap.xml`.
  - After deployment, use Google Search Console to inspect `robots.txt`, resubmit `sitemap.xml`, and request recrawls for representative previously affected blog URLs.
