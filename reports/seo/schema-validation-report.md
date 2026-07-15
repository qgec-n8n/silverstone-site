# Structured Data Validation Report — 2026-07-15

Source: claude-seo `seo-schema` specialist over all 47 built pages,
re-verified after fixes.

Per-page-type coverage: home = WebSite + Organization + WebPage +
BreadcrumbList; about = AboutPage; contact = ContactPage; hubs =
CollectionPage; 7 service + 9 industry pages = Service + BreadcrumbList;
21 articles = BlogPosting; pricing/book/privacy = WebPage + BreadcrumbList.
100% JSON-LD (no microdata/RDFa), all blocks parse, all URLs absolute apex,
ISO-8601 dates, breadcrumb positions sequential and resolvable, no deprecated
(HowTo) or restricted (FAQPage) types, no fabricated reviews/ratings/awards.

Fixed in this pass:
- `Service.areaServed` narrowed from London/UK/Europe/US to United Kingdom
  (visible copy is UK-only).
- `Service.name`/`serviceType` reconciled with the live approved H1 on the 7
  drifted industry pages (repo contract: visible heading == Service.name).
- Organization (homepage graph) enriched with repo-evidenced facts: logo
  (`/brand/silverstone-logo.png`), `sameAs` (official Instagram + Facebook
  profiles from the legacy site's own schema), and the visible London studio
  PostalAddress. Email/phone intentionally withheld (not visible on the site).
- BlogPosting publisher now carries a logo; author/publisher `url` aligned to
  the canonical origin form.

Deliberately not added: FAQPage (no visible FAQ text in rendered HTML;
Google restricts FAQ rich results to gov/health anyway), `@id` graph linking
(optional enhancement), blog BreadcrumbList (no visible breadcrumb UI on
articles).
