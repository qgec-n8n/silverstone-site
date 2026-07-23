# Staged remediation plan

| Stage | Cards | Instances | Theme | Risk |
|---|---:|---:|---|---|
| **1 — done** | 78 | 78 | Stop third-party mutation of live metadata | low |
| **2 — next** | 235 | 238 | Document outline & heading semantics | low–medium |
| **3 — later** | 386 | 385 | Editorial depth, obsolete advice, closure | low |

---
## Stage 1 — Shared technical root cause (COMPLETE)
**RC-06.** Disable the SEOJuice on-page optimiser; add blog `og:image`
dimensions. See `session-1-changes.md`. Exit criteria met: 0 seojuice
references in `build/client`, 211/211 unit tests, build green.

## Stage 2 — Heading semantics and document outline (RC-03, RC-04, RC-08)
All are rendering-only defects invisible to the build gate. None requires a
visual redesign; each is a tag or attribute change behind existing classes.

| # | Fix | File:line | Visual risk |
|---|---|---|---|
| 2.1 | Intro splash `h1` → `p`/`div`, keeping `ss-service-intro__title` | `visual/components/route-experience-intro.tsx:96` | none if Tailwind preflight normalises h1 — **verify** |
| 2.2 | Footer column `h2` → `span`/`p` (the `<nav aria-label>` already labels each column) | `components/layout/shell/site-footer.tsx:160` | none |
| 2.3 | Re-tag the Silktide modal `h1` → `h2` post-init and wire `aria-labelledby` so the modal gains an accessible name | `components/layout/shell/cookie-consent-manager.tsx` (after `init`) | none |
| 2.4 | `ArticleGrid` `h4` → level-aware (`h3` at section level) — fixes h2→h4 skip on 31 articles | `routes/templates/article-page.tsx:246,544` | none |
| 2.5 | Same skip on 2 service pages | `features/services-v2/demos/live-voice-session.tsx:512`, `live-voice-chrome.tsx:155` | none |
| 2.6 | Gradient text: add a solid `color` under a `@supports` guard so computed contrast is measurable | `tokens/cinematic.css:232-245`, `services-v2/services-v2.css:4846-4857`, `core-pages.css:6714-6724` | none if `-webkit-text-fill-color` still wins |
| 2.7 | `site-header.tsx:660` — apply `inert` in the same frame as `aria-hidden` (240 ms `aria-hidden-focus` window) | `components/layout/shell/site-header.tsx:641-660` | none |
| 2.8 | Latent double-h1: pass `showHeader={false}` explicitly | `routes/templates/service-page.tsx:131-138` | none |

**Also in Stage 2 — strengthen the guard that missed all of this:** extend
`crawlable-content.spec.ts` to assert on `page.request.get()` raw HTML, scope
counts to `<main>`, assert exactly one h1 **in the hydrated DOM**, and add a
test that `document.title` after hydration equals the prerendered `<title>`
(this would have caught RC-06 automatically).

## Stage 3 — Editorial and closure (RC-01, RC-02, RC-05, RC-07)
- Trim 5 meta descriptions to ≤165 chars.
- Render `post.faqs` as **visible content** on articles (not FAQPage schema — deprecated).
- Render `post.researchSources` as citations; add an `<img>` for the article hero so `heroImageAlt` reaches the DOM.
- `dateModified` is a no-op on 33/34 posts; fix the `gym-membership-freeze-automation-myths` displayDate/ISO off-by-one.
- Consider `author` as a `Person` for E-E-A-T; add `inLanguage`/`wordCount`/`articleSection`.
- Emit or delete the `schemaTypes` manifest field, which has drifted (declares Organization/ItemList that are never emitted).
- Remove dead modules: `routes/home.tsx`, `routes/industries/industry.tsx`, `visual/components/home-hero.tsx`, and the test-only `seo/sitemap.ts` / `seo/robots.ts` parallel implementation.
- Redeploy, then request a SEOJuice recrawl and reconcile the score.
