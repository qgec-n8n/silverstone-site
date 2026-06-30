# Schema and On-Page SEO Handoff

## Metadata and canonical tags

- Use the preferred title and description in each numbered service file.
- Emit one self-referencing canonical URL using `https://silverstone-ai.com` plus the canonical route.
- Preserve redirects for the two repository aliases; alias URLs must not be indexable duplicates.
- Open Graph metadata should reflect the service proposition, not a generic company boilerplate.

## Heading hierarchy

- Exactly one visible H1 per route.
- H2s should describe buyer questions and decisions, not repeat the keyword phrase.
- H3s belong inside capability, process, FAQ or demo sections.
- Do not render CoreSpin/Aether title text as an additional H1 when the public body H1 is already present.

## Breadcrumbs

Use visible breadcrumbs and `BreadcrumbList`:

1. Home — `/`
2. Services — `/services`
3. Service name — canonical route

Every `ListItem` needs `position`, `name` and an absolute `item` URL.

## Recommended graph

- **Service:** permitted as descriptive schema.org vocabulary for the page’s service entity. Google does not currently offer a dedicated Service rich result.
- **WebPage:** use for the page node and connect `mainEntity` to the Service node where implemented consistently.
- **BreadcrumbList:** eligible and useful for hierarchy.
- **Organization / LocalBusiness:** maintain once on the authoritative home/about/contact entity source. Do not create seven conflicting organisations or duplicate addresses on service pages.
- **FAQPage:** do not implement for rich-result visibility. Google removed the feature in May 2026 and removed the documentation in June 2026. Keep FAQs visible for visitors and retrieval systems.
- Never add Review, AggregateRating, Offer, opening hours, price ranges or awards unless they are factual, visible and approved.

## Image alt guidance

- Describe what the image communicates in context.
- Mark purely decorative interface atmospherics with empty alt text.
- Never describe an illustrative panel as a real client dashboard, live product or measured result.
- Use the route-specific alt guidance in each numbered file and retain repository desktop/mobile pairings.

## Prerender and indexability

- The complete H1, introductory proposition, core capabilities, benchmark context, process, safeguards, FAQs and internal links must exist in server-rendered or prerendered HTML.
- Aether Flow may enhance the route entry but must not gate the only crawlable copy.
- Keep all seven canonical routes indexable and included in the XML sitemap.
- Reserved demo surfaces may remain non-functional, but their truthful explanatory copy should render in HTML.

## Internal links

- Use descriptive, concise anchors.
- Ensure every service route is linked from `/services`, the header/footer system and at least two contextually relevant pages.
- Link industry pages back to their most relevant parent services.
- Do not create city lists or hidden exact-match anchor blocks.

## Validation checklist

- Title and description unique.
- H1 unique.
- Canonical self-referencing.
- Breadcrumb positions valid.
- JSON-LD matches visible content.
- No unsupported schema properties.
- All images have appropriate alt handling.
- Essential content visible without client-side interaction.
- Route included in sitemap and returns HTTP 200.
- Alias redirects resolve in one hop.
