# Silverstone AI live accessibility and performance risk audit v1

Completed: 2026-06-22  
Authority status: independent observable-risk review; not a conformance certification or laboratory performance test.

This independent external audit **accompanies rather than replaces** the Prompt A-01 repository/live audit. Prompt A-01 remains the repository baseline. This package adds a current, conversion-led and standards-led reading of the public site. **C-01 and H-01 are downstream consumers** of these findings.

## Evidence labels

- **Verified observation** — directly observed on the current live website during this audit.
- **Repository evidence** — directly supported by the uploaded Prompt A-01 pack.
- **Inference** — an analytical conclusion drawn from cited observations; it is not a measured outcome.
- **Recommendation** — a proposed change; it is not presented as a current fact.
- **Creative proposal** — an optional concept requiring validation before adoption.

## Accessibility risk summary

### Landmarks and bypass navigation

**Repository evidence:** A-01 found no `<main>` landmark and no skip link across the 50-page repository inventory. [A01-AUDIT; A01-ROUTES]

**Inference:** Repeated navigation cannot be bypassed efficiently by keyboard and assistive-technology users when equivalent bypass mechanisms are absent. [A01-AUDIT; W-BYPASS]

**Recommendation:** Add one programmatically identifiable main region and an early visible-on-focus skip link on every template.

### Mobile navigation keyboard operation

**Repository evidence:** A-01 found that the mobile navigation trigger was a focusable `<div>` with a click handler but no button role or keyboard handler. [A01-AUDIT]

**Inference:** The control may not be operable or announced correctly for keyboard and assistive-technology users. [A01-AUDIT; W-KEYBOARD]

**Recommendation:** Use a native button with accessible name, expanded state, controlled-menu relationship, keyboard activation, focus management and Escape-to-close behaviour.

### Focus visibility

**Repository evidence:** A-01 found that FAQ summaries removed the browser outline without an equivalent focus style. [A01-AUDIT]

**Inference:** Keyboard users may lose track of focus within repeated FAQ controls. [A01-AUDIT; W-FOCUS]

**Recommendation:** Provide a high-contrast focus indicator that is not obscured and remains visible across all interactive states.

### Form semantics and status messages

**Verified observation:** The contact form requests name, email and message and provides a submission pathway. [L-CONTACT]

**Repository evidence:** A-01 found no autocomplete tokens on visible fields and no live-region or status role for dynamic submission feedback. [A01-AUDIT]

**Inference:** Users may receive less efficient input assistance and may not hear non-focus success or error updates. [A01-AUDIT; W-INPUT; W-STATUS]

**Recommendation:** Add correct input purpose/autocomplete, programmatically associated instructions and errors, and an announced status region. Preserve entered data after recoverable errors.

### Map and embedded content

**Repository evidence:** A-01 found that the contact-page map iframe had no title. [A01-AUDIT]

**Inference:** The frame’s purpose may not be identifiable to assistive technology. [A01-AUDIT; W-QUICKREF]

**Recommendation:** Add a concise descriptive title and a direct text link to the location as a non-embedded alternative.

**Verified observation:** The booking page uses a third-party scheduling embed and provides a contact fallback. [L-BOOK]

**Inference:** The fallback is a resilience strength, while the embed can add keyboard, privacy, loading and layout risks outside Silverstone’s direct control. [L-BOOK; V-EMBED]

**Recommendation:** Load the embed only when needed or near viewport, reserve its dimensions, retain a direct accessible fallback and test the full keyboard path.

### Motion and visual effects

**Repository evidence:** A-01 recorded parallax, shader, reveal and statistic runtimes, with reduced-motion checks present in several implementations. [A01-AUDIT; A01-ASSETS]

**Inference:** Reduced-motion support is a positive control, but visual parity testing must include keyboard focus, content readability and no-motion operation. [A01-AUDIT; W-QUICKREF]

**Recommendation:** Treat reduced-motion behaviour as a release criterion and ensure no content or action depends on animation completion.

### Cookie banner

**Repository evidence:** A-01 observed that the cookie banner occupied substantial mobile viewport space on first visit. [A01-AUDIT; A01-DIFF]

**Verified observation:** Cookie controls appear before main page content in the current page reading order. [L-HOME; L-ABOUT; L-SERVICES]

**Inference:** The consent layer can obstruct content and increase interaction cost on small screens. [L-HOME; A01-AUDIT]

**Recommendation:** Minimise its footprint, preserve readable controls, avoid focus traps, support rejection as easily as acceptance and return focus logically after a choice.

## Performance risk summary

### Image dimensions and layout stability

**Repository evidence:** A-01 found 206 HTML images and no explicit `width` and `height` attributes on any of them. [A01-AUDIT; A01-ASSETS]

**Inference:** Missing intrinsic dimensions increase layout-shift risk unless equivalent aspect-ratio space is reserved by CSS. [A01-AUDIT; V-CLS]

**Recommendation:** Emit intrinsic dimensions or an explicit aspect ratio for every image and validate layout stability at common responsive widths.

### Image pipeline and payload governance

**Repository evidence:** A-01 inventoried 1,615 public assets totalling more than 700 MB, including 1,227 generated derivatives, 155 unresolved unreferenced files and image-build drift. [A01-MANIFEST; A01-AUDIT; A01-ASSETS]

**Inference:** Repository volume is not equal to per-page transfer size, but the inventory signals governance, cache and build-determinism risk. [A01-AUDIT; A01-ASSETS]

**Recommendation:** Define one canonical source per image, collision-safe derivative names, deterministic generation, page-level responsive image sets and an owner-approved retention policy.

### Caching and security-related response headers

**Repository evidence:** A-01 sampled HTML, CSS and image responses with `public,max-age=0,must-revalidate`; HSTS was present, while explicit CSP, Referrer-Policy, Permissions-Policy and X-Content-Type-Options were not observed in the sampled responses. [A01-AUDIT; A01-DIFF]

**Inference:** Revalidation-heavy caching can reduce repeat-visit efficiency, and absent sampled headers leave defence-in-depth opportunities; this does not prove every response lacks them. [A01-AUDIT; A01-DIFF]

**Recommendation:** Establish asset-specific immutable caching for fingerprinted files, appropriate HTML revalidation and a tested security-header policy compatible with required third parties.

### Third-party scripts and embeds

**Repository evidence:** A-01 found hosting-injected monitoring, duplicate monitoring scripts on two routes, analytics, a scheduling embed, a map embed and a separate pricing runtime. [A01-AUDIT; A01-DIFF; A01-ASSETS]

**Inference:** Multiple third parties can affect loading, main-thread work, privacy and resilience even when no single observed route visibly fails. [A01-AUDIT; V-EMBED]

**Recommendation:** Create a third-party budget, load non-critical integrations conditionally, remove duplicate ownership and capture fallback behaviour for every dependency.

### Client-rendered counters and pricing

**Verified observation:** Home-page statistic labels can be encountered with zero-valued initial text before the intended values are supplied by runtime behaviour. [L-HOME]

**Repository evidence:** A-01 recorded scripted statistics and a client-rendered pricing widget. [A01-AUDIT; A01-ASSETS]

**Inference:** Essential proof and commercial details should not rely on animation or client execution. [L-HOME; L-PRICING; A01-AUDIT]

**Recommendation:** Put final meaningful text in the initial document, then animate or filter it only as an enhancement.

## Observable positives to retain

**Verified observation:** The booking page includes a non-embed contact fallback. [L-BOOK]

**Repository evidence:** A-01 observed no horizontal overflow and no broken rendered images on successfully loaded desktop routes, and no horizontal overflow on the audited mobile home viewport. [A01-AUDIT; A01-DIFF]

**Repository evidence:** Reduced-motion checks existed in multiple animation runtimes. [A01-AUDIT; A01-ASSETS]

**Recommendation:** Preserve these behaviours as explicit regression tests rather than assuming they survive a rebuild.

## Validation requirements for downstream work

**Recommendation:** C-01 and H-01 should require:

- keyboard-only completion of navigation, accordions, pricing controls, cookie controls, contact and booking fallback;
- visible focus at every interactive element;
- one main landmark and working skip link on every template;
- accessible names, states and relationships for menu, form, map and embeds;
- status/error announcements without forced focus movement;
- reduced-motion parity;
- reserved image/embed space and no avoidable layout shifts;
- initial-document availability of essential proof, pricing and CTA content;
- page-level transfer, request and third-party budgets;
- mobile testing at narrow and zoomed layouts.

## Limitations

**Verified observation:** No automated accessibility scanner, assistive-technology session, Lighthouse run or field-performance dataset was used in this external audit. [L-HOME]

**Inference:** The findings identify observable and repository-supported risks; they do not certify WCAG conformance or measured Core Web Vitals. [W-QUICKREF; V-CLS]

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
