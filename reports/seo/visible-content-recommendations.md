# Visible-Content Recommendations (NOT implemented — require design/UX decisions)

These findings would improve SEO but require changes to visible design, copy, or
user journeys, which were out of scope for the 2026-07-15 technical migration.
None of them block indexing of the rest of the site.

## 1. Homepage prerenders no body content (highest impact)

**Evidence:** `web/build/client/index.html` contains ~83 visible characters
(the intro loader strapline and skip link). The full homepage body
(`SecondaryHero`, `ServicesUniverse`, `BenchmarkMetrics`, industry links, CTAs)
mounts client-side only after the user activates the "Explore" control
(`web/src/routes/company/home-v2.tsx`, `bodyVisible` gate), and the `<h1>`
("The operating system for businesses that refuse to miss.") lives inside the
intro `Hero` that is also client-gated.

**Consequence:** Google and AI crawlers see a homepage with correct metadata
and Organization JSON-LD but almost no body text, no H1, and no internal links
in the initial HTML. Crawlers do not click "Explore", so the homepage's
content and its internal-link equity are invisible to them. Discovery
currently relies on the sitemap and cross-links from the other 45 pages.

**Options (pick one, requires UX signoff):**
- Prerender the body sections in the initial HTML and keep the intro/loader as
  a visual overlay (content present in DOM, gated visually) — preserves the
  journey but needs careful reveal-scheduler/gate testing.
- Add a crawlable server-rendered summary section (visible to users too, e.g.
  below the intro) with the H1 and primary internal links.
- Accept the trade-off (homepage ranks on brand + metadata; category pages do
  the organic work) — the current documented state.

## 2. Blog articles have no human author byline

Articles attribute authorship to the Organization ("Silverstone AI") in
`BlogPosting` JSON-LD and visible bylines. E-E-A-T for competitive queries
increasingly favours named human authors with credentials and profile pages.
Adding a real author (name, role, short bio, profile page) would require new
visible content and a data-model change — recommend for the content roadmap.

## 3. Legacy deleted articles with topical successors

All 45 removed legacy blog URLs now return 410. A few had loose topical
overlap with current articles (e.g. `/blog/ai-receptionist-small-business-2026`
vs `/blog/ai-receptionist-small-business-guide`). They were NOT redirected
because the content is not substantially equivalent (different articles,
different era). If you would rather consolidate any specific pair, convert the
410 to a 301 in `netlify/edge-functions/lib/url-migration.mts` (move the path
from `GONE_PATHS` into `LEGACY_REDIRECTS`).

## 4. Named-entity depth on /about

/about describes the company approach but names no founders/team, addresses,
registrations, or verifiable third-party profiles. Adding verified entity
facts (company number, founder profile, LinkedIn organisation page) would
strengthen entity/knowledge-panel signals. Requires real, verified facts from
the owner — do not fabricate.

## 5. sameAs profiles in Organization schema

No official social/profile URLs exist anywhere in the repository (footer, nav,
or data files), so no `sameAs` array was added — adding unverified profiles
would be worse than none. When official profiles exist (LinkedIn, Crunchbase,
etc.), add them to `buildOrganizationSchema` usage.
