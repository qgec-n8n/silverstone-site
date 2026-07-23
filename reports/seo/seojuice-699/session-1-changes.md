# Session 1 changes

Branch `seo/seojuice-699-session-1`, commit `bfcc95cd` (parent `49c3f617`).
Nothing pushed. Nothing deployed. `main` untouched.

---
## Change 1 — Gate the SEOJuice on-page optimiser (RC-06)

**Files:** `web/src/lib/integrations/seojuice.tsx`, `web/tests/unit/seojuice.test.tsx` (new)

**Why:** `cdn.seojuice.io/suggestions.v1.js` rewrites `<title>` on every page
sampled (3/3), replaces `og:image` with a `seojuiced.b-cdn.net` asset, and
fires `smart.seojuice.io/views` with URL, referrer and user agent with no
consent gate. The rewritten titles are keyword-stuffed, drift from each page's
subject and break brand casing ("Silverstone.ai"). The build already gates
titles for presence and uniqueness, so the prerendered values are the reviewed
source of truth.

**How:** added a `VITE_SEOJUICE_ENABLED !== "true"` early return ahead of the
existing production guard, mirroring the fail-closed `AnalyticsScripts` idiom.
Default off. Re-enabling is one environment variable, documented in the
component with the measured evidence.

- Cards covered: **78** · URL instances: **78**
- UI/UX impact: **none.** No component, style, layout, animation or
  interaction touched. Verified: 0 files in `build/client` reference seojuice.
- Tests added: 3 (default off; production alone insufficient; neither script
  nor pixel emitted while disabled).

## Change 2 — Declare blog `og:image` dimensions

**Files:** `web/src/routes/blog/article.tsx`, `web/tests/unit/blog-posts.test.ts`

**Why:** blog articles were the only routes shipping `og:image` without
`og:image:width`/`height`; every other route gets them from
`buildRouteMetadata`. Without them a social crawler must fetch the image
before laying out the card, and some renderers fall back to a small summary
card instead of the large one `twitter:card` requests.

**How:** all 34 heroes are uniformly 1536×864, exported as
`BLOG_HERO_IMAGE_WIDTH`/`HEIGHT` and emitted as meta tags. A new test parses
the VP8 keyframe header of every hero so the constants cannot silently start
lying if the publishing automation changes output size.

- Cards covered: 0 directly (found during audit, not reported by SEOJuice)
- UI/UX impact: **none** — `<head>` only.
- Tests added: 1 (34 heroes × dimension assertion).

---
## Deliberately NOT done

| Item | Reason |
|---|---|
| FAQPage schema (204 cards) | Google **deprecated FAQ rich results in May 2026**; zero rich-result benefit. |
| Rewriting meta descriptions (389 cards) | All 59 URLs already have unique, well-formed descriptions. |
| Expanding "thin" pages (188 cards) | Minimum live `<main>` text is 2,492 chars; the build floor is 800. |
| Adding Organization/Article schema (244 cards) | Already emitted on 59/59 URLs. |
| Intro-splash h1 fix (RC-04) | Real, but touches a visual component; needs a build + visual diff to prove zero change. Fully specified for Stage 2. |
| Silktide modal h1 (RC-03) | Real but latent — requires the gate to clear, which a crawler never does. Stage 2. |
