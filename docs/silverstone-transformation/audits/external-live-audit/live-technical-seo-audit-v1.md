# Silverstone AI live technical SEO audit v1

Completed: 2026-06-22  
Authority status: independent external technical-SEO advisory audit.

This independent external audit **accompanies rather than replaces** the Prompt A-01 repository/live audit. Prompt A-01 remains the repository baseline. This package adds a current, conversion-led and standards-led reading of the public site. **C-01 and H-01 are downstream consumers** of these findings.

## Evidence labels

- **Verified observation** — directly observed on the current live website during this audit.
- **Repository evidence** — directly supported by the uploaded Prompt A-01 pack.
- **Inference** — an analytical conclusion drawn from cited observations; it is not a measured outcome.
- **Recommendation** — a proposed change; it is not presented as a current fact.
- **Creative proposal** — an optional concept requiring validation before adoption.

## Coverage

**Verified observation:** Current read-only inspection covered all seven primary routes, the privacy route, all nine industry routes and eight representative articles. [L-HOME; L-ABOUT; L-SERVICES; L-PRICING; L-BLOG; L-BOOK; L-CONTACT; L-PRIVACY; L-DENTISTS; L-ECOMMERCE; L-ESTATE; L-FITNESS; L-GYMS; L-HOSPITALITY; L-PHYSIO; L-SALONS; L-TRADES; B-ROI; B-GDPR; B-HOSP; B-LEAD-A; B-DENTAL; B-ECOM; B-FAIL; B-LEAD-B]

**Repository evidence:** A-01 reconciled 50 canonical URLs across filesystem discovery, SEO inventory and sitemap membership. [A01-MANIFEST; A01-AUDIT; A01-ROUTES]

## Indexation and route integrity

**Repository evidence:** At the A-01 observation point, 49 canonical routes returned `200` and `/blog/ai-lead-capture-trades-uk-2026` entered a forced self-redirect loop. [A01-MANIFEST; A01-AUDIT; A01-DIFF; A01-SEO]

**Verified observation:** The formerly looping article route now loads as a live article. [B-LEAD-A]

**Inference:** The redirect defect has changed since A-01, so the current edge configuration is not identical to the A-01 production observation. [B-LEAD-A; A01-DIFF]

**Recommendation:** Re-crawl the complete redirect inventory after every deployment and fail release validation on self-redirects, multi-hop chains, loops or canonical targets that do not return a terminal success response.

**Verified observation:** The formerly looping article uses older navigation language and omits the pricing item that appears in the current standard navigation. [B-LEAD-A; L-HOME; L-SERVICES; L-PRICING]

**Inference:** The route is live but remains outside the current page-template governance. [B-LEAD-A; L-HOME]

**Recommendation:** Bring the route under the shared navigation, metadata, consent, footer and structured-data components without changing its retained canonical path unless an approved consolidation requires a redirect.

## Canonicals, duplicates and intent ownership

**Repository evidence:** A-01 recorded a unique canonical, title, meta description and H1 for all 50 repository pages. [A01-AUDIT; A01-ROUTES]

**Verified observation:** Two trades lead-capture articles remain separately accessible and target substantially overlapping search intent. [B-LEAD-A; B-LEAD-B]

**Inference:** Unique metadata does not by itself resolve near-duplicate intent. [B-LEAD-A; B-LEAD-B; G-CANON]

**Recommendation:** Select a primary URL for each intent. Consolidate genuinely redundant pages with a server-side permanent redirect and self-referencing canonical on the retained page; retain both only when each has a demonstrably distinct purpose.

## Navigation and internal links

**Verified observation:** The standard navigation exposes the primary routes and all nine industries. [L-HOME; L-SERVICES]

**Verified observation:** The services and blog surfaces link into industry pages and supporting articles. [L-SERVICES; L-BLOG; L-DENTISTS; L-TRADES]

**Repository evidence:** A-01 found no broken repository-internal route targets, but several newer blog pages received only two internal links. [A01-AUDIT; A01-ROUTES]

**Inference:** Crawlability is broadly supported, while authority distribution and topical ownership are uneven. [A01-AUDIT; A01-ROUTES; G-LINKS]

**Recommendation:** Add contextual links from the relevant industry hub, service page and at least one established article to every retained low-inlink article; use anchors that describe the destination.

## Sitemap and robots

**Repository evidence:** A-01 found correct 50-URL sitemap membership, stale committed `lastmod` values and current generated production dates; `robots.txt` allowed crawling and declared the sitemap. [A01-MANIFEST; A01-AUDIT; A01-DIFF]

**Inference:** Sitemap generation is functionally present but repository/build parity is not deterministic enough for a migration baseline. [A01-AUDIT; A01-DIFF; G-SITEMAP]

**Recommendation:** Generate sitemap entries from the canonical route source of truth, use meaningful modification dates and test that every listed URL is canonical, indexable and terminal.

## Metadata and headings

**Repository evidence:** A-01 recorded unique titles, descriptions, canonicals and one repository H1 per page. [A01-AUDIT; A01-ROUTES]

**Verified observation:** The current home H1 repeats the main brand/audience phrase. [L-HOME]

**Inference:** Technical uniqueness is not the same as editorial quality or concise relevance. [L-HOME; G-SNIPPET]

**Recommendation:** Retain unique route-level metadata while rewriting the home H1 and snippet copy to describe one specific proposition without repetition.

## Structured data

**Repository evidence:** Forty-nine A-01 pages contained parseable JSON-LD; the privacy page did not. Types included WebSite, Organization, ProfessionalService, WebPage, BreadcrumbList and page-specific entities. [A01-AUDIT; A01-ROUTES]

**Repository evidence:** Visible breadcrumb navigation appeared on 16 pages while BreadcrumbList schema appeared on 49. [A01-AUDIT]

**Inference:** Structured breadcrumbs may describe a hierarchy that is not consistently available to users. [A01-AUDIT; G-SCHEMA]

**Recommendation:** Generate structured data from the same route/content model as visible page elements and include only information represented accurately on the page.

## Topic clusters and content architecture

**Verified observation:** The current architecture contains one services hub, nine industry hubs and a 33-article blog inventory. [L-SERVICES; L-BLOG; A01-ROUTES]

**Verified observation:** The blog hub presents articles in a long archive rather than clearly separated problem clusters or buying stages. [L-BLOG]

**Inference:** The site has sufficient content breadth for clusters, but its present information architecture does not make canonical topic ownership obvious. [L-BLOG; A01-ROUTES; G-START]

**Recommendation:** Establish governed clusters for missed-call handling, lead capture/follow-up, booking/no-show reduction, customer support and operational automation; assign one hub and one intent owner to each query family.

## Rendering and client-side dependencies

**Repository evidence:** Prompt A-01 recorded a separate React pricing island and client-rendered pricing controls, plus JavaScript-driven visual effects. [A01-AUDIT; A01-ASSETS]

**Verified observation:** Essential commercial framing appears on the pricing route, while the detailed card experience depends on the interactive pricing surface. [L-PRICING]

**Inference:** If package details are absent from initial HTML, search engines, assistive technology or failed-script users may receive an incomplete commercial page. [L-PRICING; A01-AUDIT]

**Recommendation:** Deliver essential pricing and package content in the initial document and treat interaction as progressive enhancement.

## Redirect, canonical and release acceptance criteria

**Recommendation:** C-01 and H-01 should consume the following release gates:

- every retained canonical route returns one terminal success response;
- no canonical redirects to itself;
- no redirect source is duplicated without an explicit precedence rule;
- every redirected legacy route terminates in one hop where practicable;
- every indexable URL has one canonical, one descriptive H1, unique title and useful description;
- sitemap membership equals the approved canonical inventory;
- structured data validates and matches visible content;
- all retained articles have a defined cluster, intent owner and contextual inlinks.

## Limitations

**Verified observation:** This audit did not access Google Search Console, analytics, server logs or ranking tools. [L-HOME]

**Inference:** Index coverage, impressions, rankings, crawl frequency and organic traffic are not established here. [G-START; G-SITEMAP]

## Live-site source register

All live pages below were inspected read-only on 22 June 2026. A live page is the primary source for its current visible content.

| ID | Route | Scope used |
|---|---|---|
| L-HOME | `https://silverstone-ai.com/` | navigation, hero, CTAs, service positioning, proof panels, footer |
| L-ABOUT | `https://silverstone-ai.com/about` | company narrative, values, trust and proof |
| L-SERVICES | `https://silverstone-ai.com/services` | service architecture, process, packs, objections, industry directory |
| L-PRICING | `https://silverstone-ai.com/pricing` | pricing framing, FAQs, ROI and delivery claims, booking path |
| L-BLOG | `https://silverstone-ai.com/blog` | article inventory, category presentation, card copy and internal links |
| L-BOOK | `https://silverstone-ai.com/book` | audit proposition, booking embed, fallback and objection handling |
| L-CONTACT | `https://silverstone-ai.com/contact` | form fields, response promise and contact pathway |
| L-PRIVACY | `https://silverstone-ai.com/privacy-policy` | cookie, analytics and privacy statements |
| L-DENTISTS | `https://silverstone-ai.com/services/dentists` | industry proposition, claims, CTAs and FAQs |
| L-ECOMMERCE | `https://silverstone-ai.com/services/ecommerce` | industry proposition, claims, CTAs and FAQs |
| L-ESTATE | `https://silverstone-ai.com/services/estate-agents` | industry proposition, claims, CTAs and FAQs |
| L-FITNESS | `https://silverstone-ai.com/services/fitness-coaches` | industry proposition, claims, CTAs and FAQs |
| L-GYMS | `https://silverstone-ai.com/services/gyms` | industry proposition, claims, CTAs and FAQs |
| L-HOSPITALITY | `https://silverstone-ai.com/services/hospitality` | industry proposition, claims, CTAs and FAQs |
| L-PHYSIO | `https://silverstone-ai.com/services/physios-chiropractors` | industry proposition, claims, CTAs and FAQs |
| L-SALONS | `https://silverstone-ai.com/services/salons-barbers` | industry proposition, claims, CTAs and FAQs |
| L-TRADES | `https://silverstone-ai.com/services/trades` | industry proposition, claims, CTAs and FAQs |
| B-ROI | `https://silverstone-ai.com/blog/ai-receptionist-costs-roi-uk-small-business-2026` | commercial-intent article |
| B-GDPR | `https://silverstone-ai.com/blog/gdpr-ai-automation-uk-small-business-2026` | compliance-oriented article |
| B-HOSP | `https://silverstone-ai.com/blog/ai-booking-automation-uk-hospitality-2026` | industry article and example claims |
| B-LEAD-A | `https://silverstone-ai.com/blog/ai-lead-capture-trades-uk-2026` | formerly looping route, template and content overlap |
| B-DENTAL | `https://silverstone-ai.com/blog/dental-recall-automation-uk-2026` | healthcare-industry article |
| B-ECOM | `https://silverstone-ai.com/blog/ai-post-purchase-support-ecommerce-uk-2026` | ecommerce-industry article |
| B-FAIL | `https://silverstone-ai.com/blog/why-ai-automation-projects-fail-uk-small-business-2026` | risk and objection article |
| B-LEAD-B | `https://silverstone-ai.com/blog/ai-lead-capture-uk-trades-2026` | overlapping trades lead-capture article |

## A-01 repository-evidence register

| ID | Uploaded source | Authority in this audit |
|---|---|---|
| A01-MANIFEST | `MANIFEST(2).md` | authoritative inventory and validation record for Prompt A-01 |
| A01-AUDIT | `repository-live-audit-v1(1).md` | authoritative A-01 repository and live-site baseline at pinned source |
| A01-DIFF | `repo-live-diff-v1(2).md` | authoritative A-01 repository-to-live parity baseline |
| A01-ROUTES | `route-inventory-v1(1).csv` | authoritative A-01 row-level route inventory |
| A01-SEO | `seo-redirect-baseline-v1(1).csv` | authoritative A-01 canonical and redirect baseline |
| A01-ASSETS | `asset-integration-inventory-v1(2).csv` | authoritative A-01 asset and integration inventory |

## Official standards source register

No more than fourteen external standards pages were consulted.

| ID | Official source | Use |
|---|---|---|
| G-START | Google Search Central, `https://developers.google.com/search/docs/fundamentals/seo-starter-guide` | search-friendly site structure and content |
| G-CANON | Google Search Central, `https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls` | canonical consolidation |
| G-LINKS | Google Search Central, `https://developers.google.com/search/docs/crawling-indexing/links-crawlable` | crawlable links |
| G-SITEMAP | Google Search Central, `https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview` | sitemap role and maintenance |
| G-SCHEMA | Google Search Central, `https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data` | structured-data eligibility and accuracy |
| G-SNIPPET | Google Search Central, `https://developers.google.com/search/docs/appearance/snippet` | title and description snippets |
| W-QUICKREF | W3C/WAI WCAG 2.2 Quick Reference, `https://www.w3.org/WAI/WCAG22/quickref/` | accessibility conformance framework |
| W-KEYBOARD | W3C/WAI, Understanding SC 2.1.1 Keyboard, `https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html` | keyboard operability |
| W-FOCUS | W3C/WAI, Understanding SC 2.4.7 Focus Visible, `https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html` | visible focus |
| W-BYPASS | W3C/WAI, Understanding SC 2.4.1 Bypass Blocks, `https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html` | skip and landmark navigation |
| W-STATUS | W3C/WAI, Understanding SC 4.1.3 Status Messages, `https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html` | non-focus status announcements |
| W-INPUT | W3C/WAI, Understanding SC 1.3.5 Identify Input Purpose, `https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html` | input purpose and autocomplete |
| V-CLS | web.dev, `https://web.dev/articles/optimize-cls` | layout-shift risk and image dimensions |
| V-EMBED | web.dev, `https://web.dev/articles/embed-best-practices` | third-party embed loading risk |
