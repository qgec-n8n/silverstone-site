---
name: /web home SEO/content parity
description: How the /web homepage preserves JSON-LD and which page copy is contractually preserved vs. replaceable, for the V2 presentation rebuild.
---

# /web home route: JSON-LD + content preservation

The `/` index route lives at `src/routes/company/home.tsx`. Most routes render
through `CoreMarketingPage` → `route-page-frame.tsx`, which emits exactly one
`<script type="application/ld+json">` via `buildRouteSchemaGraph(route)` +
`serializeJsonLd(...)`.

## Rule: a `/` route that bypasses route-page-frame must re-emit JSON-LD itself
When the homepage switched to a bespoke presentation component (HomeV2) it
stopped going through route-page-frame and silently dropped the JSON-LD, so
`tests/e2e/route-parity.spec.ts` failed `script[type="application/ld+json"]`
`toHaveCount(1)` (received 0).

**Why:** route-parity treats exactly-1 JSON-LD on every representative route as
the SEO contract; "preserve SEO" is a hard project mandate.

**How to apply:** in the route module, pull `route` from the loader and render
one JSON-LD script via `serializeJsonLd(buildRouteSchemaGraph(route))` alongside
the presentation component. For `/`, the graph is WebSite + Organization +
WebPage + BreadcrumbList. Keep the count at exactly 1 (no second script).

## Rule: homepage copy is replaceable; other pages' copy is the preserved contract
`route-parity.spec.ts`'s `representativeSourceCopy` pins exact source text for
`/about`, `/services/:slug`, `/blog/:slug` only — the homepage is deliberately
excluded. `foundation.spec.ts` only sanity-checks the home `h1` via a
`homeHeading` constant.

**Why:** the V2 rebuild replaces homepage presentation + copy with new,
claim-vetted marketing copy; the preservation contract intentionally guards the
deeper content pages, not the hero headline.

**How to apply:** when the home hero headline changes, update the `homeHeading`
constant in `foundation.spec.ts` to the new accessible name — do not revert the
hero copy. Never change `representativeSourceCopy` expectations to make a test
pass; those reflect real preserved content.
