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
