# Silverstone AI live content and claims audit v1

Completed: 2026-06-22  
Authority status: independent external editorial and evidence-risk review.

This independent external audit **accompanies rather than replaces** the Prompt A-01 repository/live audit. Prompt A-01 remains the repository baseline. This package adds a current, conversion-led and standards-led reading of the public site. **C-01 and H-01 are downstream consumers** of these findings.

## Evidence labels

- **Verified observation** — directly observed on the current live website during this audit.
- **Repository evidence** — directly supported by the uploaded Prompt A-01 pack.
- **Inference** — an analytical conclusion drawn from cited observations; it is not a measured outcome.
- **Recommendation** — a proposed change; it is not presented as a current fact.
- **Creative proposal** — an optional concept requiring validation before adoption.

## Executive finding

**Verified observation:** The live site uses precise numerical, financial, conversion, time-saving and operational outcome claims across the home page and all nine industry pages, but visible claim-level attribution is absent beside those figures. [L-HOME; L-DENTISTS; L-ECOMMERCE; L-ESTATE; L-FITNESS; L-GYMS; L-HOSPITALITY; L-PHYSIO; L-SALONS; L-TRADES]

**Inference:** The principal content risk is not that every claim is necessarily false; it is that a visitor cannot distinguish measured Silverstone results, third-party benchmarks, modelled scenarios and illustrative examples. [L-HOME; L-SERVICES; L-DENTISTS; L-ESTATE; L-TRADES]

**Recommendation:** Freeze reuse of exact outcome numbers until each has an evidence classification and approved wording.

## Claim taxonomy required

**Recommendation:** Assign every material claim one of the following statuses:

| Status | Required evidence and wording |
|---|---|
| Measured client result | named or anonymised case record, baseline, intervention, period, sample, calculation and permission |
| Third-party benchmark | primary or reputable source, publication date, geography, population and applicability note |
| Modelled scenario | stated assumptions, formula, range and explicit “illustrative” label |
| Product capability | current technical specification and limitations |
| Process commitment | documented service standard or contractual term |
| Aspirational benefit | non-quantified and non-guaranteed language |
| Unsupported | remove, qualify or hold from publication |

## Current high-risk claim surfaces

### Home

**Verified observation:** The home page combines broad benefit statements with exact-looking counters and operational outcome language, including weekly hours and no-show reduction framing. [L-HOME]

**Repository evidence:** Prompt A-01 recorded final home-page counter values and classified them as unsupported on-page. [A01-AUDIT; A01-ROUTES]

**Inference:** When counters initialise at zero in text extraction and final values appear only after scripting, the proof is both editorially risky and potentially inaccessible to non-scripted consumers. [L-HOME; A01-AUDIT]

**Recommendation:** Replace counters with either sourced case facts or an illustrative calculator whose assumptions are visible before the result.

### Services parent page

**Verified observation:** The services page states “No invented guarantees” and also promotes outcome-oriented packs and proof language. [L-SERVICES]

**Inference:** The wording creates a higher evidence expectation than the site currently meets. [L-SERVICES; L-HOME; L-DENTISTS; L-ESTATE]

**Recommendation:** Retain the anti-hype position only after all site-wide proof is governed by the claim taxonomy.

### Industry pages

| Route | Verified claim pattern | Evidence assessment |
|---|---|---|
| Dentists [L-DENTISTS] | percentage, chair-time and conversion metrics | no visible claim-level attribution |
| Ecommerce [L-ECOMMERCE] | support-volume, conversion and response metrics | no visible claim-level attribution |
| Estate agents [L-ESTATE] | response, conversion and “zero missed” outcome framing | no visible claim-level attribution |
| Fitness coaches [L-FITNESS] | response-time, conversion and lead-volume metrics | no visible claim-level attribution |
| Gyms [L-GYMS] | conversion, response and retention metrics | no visible claim-level attribution |
| Hospitality [L-HOSPITALITY] | booking value, response and no-show metrics | no visible claim-level attribution |
| Physios/chiropractors [L-PHYSIO] | no-show, session and conversion metrics | no visible claim-level attribution |
| Salons/barbers [L-SALONS] | booking value, response and no-show metrics | no visible claim-level attribution |
| Trades [L-TRADES] | response, job-value and payback metrics | no visible claim-level attribution |

**Inference:** Repeating quantified proof in the same template across industries makes the pages appear systematic, but also magnifies any substantiation failure. [L-DENTISTS; L-ECOMMERCE; L-ESTATE; L-FITNESS; L-GYMS; L-HOSPITALITY; L-PHYSIO; L-SALONS; L-TRADES]

**Recommendation:** Replace generic metric blocks with one of three valid modules: sourced benchmark, verified case study, or transparent scenario calculator.

### Pricing

**Verified observation:** The pricing page says most focused systems go live within one to two weeks and uses payback and ROI language. [L-PRICING]

**Inference:** Delivery time and return depend on scope, data quality, integrations, approval speed, traffic and baseline performance, none of which is visible in the claim. [L-PRICING]

**Recommendation:** Use a qualified range and list the dependencies that can extend delivery or prevent a return.

### Blog

**Verified observation:** The eight reviewed articles include author/reviewer/date information, internal calls to action and external references. [B-ROI; B-GDPR; B-HOSP; B-LEAD-A; B-DENTAL; B-ECOM; B-FAIL; B-LEAD-B]

**Verified observation:** The reviewed articles mix official guidance, commercial vendor sources, broad industry assertions and hypothetical or illustrative examples. [B-ROI; B-GDPR; B-HOSP; B-DENTAL; B-ECOM; B-FAIL]

**Inference:** Citation presence alone does not establish source quality, applicability or independence. [B-ROI; B-GDPR; B-HOSP; B-DENTAL; B-ECOM]

**Recommendation:** Adopt a source hierarchy: legislation/regulator/official statistics first; peer-reviewed or recognised industry data second; vendor evidence only with explicit interest and applicability caveats.

**Verified observation:** The hospitality article presents an unnamed London restaurant example with approximate results rather than an attributable case-study record. [B-HOSP]

**Inference:** Readers may interpret the example as a measured Silverstone result unless it is explicitly marked as hypothetical, composite or anonymised with methodology. [B-HOSP]

**Recommendation:** Add a visible evidence label to every example: verified client case, anonymised case, composite illustration or hypothetical scenario.

## Duplication and editorial differentiation

**Verified observation:** Two live articles target UK trades lead capture with nearly equivalent titles, shared publication date and substantially overlapping problem framing. [B-LEAD-A; B-LEAD-B]

**Repository evidence:** Prompt A-01 independently identified these routes within a five-URL search-intent overlap group and left consolidation unresolved. [A01-AUDIT; A01-ROUTES]

**Inference:** The pair creates editorial redundancy and possible search-intent competition, although this audit does not establish ranking impact. [B-LEAD-A; B-LEAD-B; A01-AUDIT]

**Recommendation:** Choose one primary intent owner. Merge and redirect if the value propositions are not genuinely distinct; otherwise differentiate by audience, funnel stage, keyword intent, examples, internal links and CTA.

**Verified observation:** The blog hub uses a long list of cards whose summaries repeat similar operational-benefit phrasing. [L-BLOG]

**Inference:** Repetitive cards reduce perceived editorial depth and make the 33-article library harder to navigate. [L-BLOG; A01-ROUTES]

**Recommendation:** Give each card one unique problem statement, one distinct takeaway and a visible category/buying-stage label.

## Topic-cluster assessment

**Verified observation:** The site has parent services, nine industry pages and multiple industry-specific blog articles, creating a basic hub-and-spoke structure. [L-SERVICES; L-BLOG; L-DENTISTS; L-ECOMMERCE; L-ESTATE; L-FITNESS; L-GYMS; L-HOSPITALITY; L-PHYSIO; L-SALONS; L-TRADES]

**Repository evidence:** Prompt A-01 found that several newer blog routes had only two internal links. [A01-AUDIT; A01-ROUTES]

**Inference:** The route inventory is broad enough for topical authority, but low-link articles and overlapping topics weaken the clarity of ownership. [A01-AUDIT; A01-ROUTES; L-BLOG]

**Recommendation:** Define one canonical hub per problem/industry intersection, give each supporting article a unique intent, and link from the hub using descriptive anchors.

## Tone and message governance

**Verified observation:** The site repeatedly uses anti-hype, human-handoff, transparent-scope and no-long-contract language. [L-SERVICES; L-DENTISTS; L-ECOMMERCE; L-ESTATE; L-FITNESS; L-GYMS; L-HOSPITALITY; L-PHYSIO; L-SALONS; L-TRADES]

**Inference:** This is a defensible brand position if operational documents and sales behaviour consistently support it. [L-SERVICES; L-BOOK; L-CONTACT]

**Recommendation:** Create a message standard that prohibits absolutes, distinguishes capability from outcome, and requires a source note for every number.

## Content actions by priority

1. **P0:** build the claim ledger and remove unsupported exact results from high-traffic commercial pages.
2. **P1:** create proof formats with baseline, intervention, duration, sample, calculation, limitations and permission.
3. **P1:** resolve the trades lead-capture overlap and the broader five-route overlap set identified by A-01.
4. **P1:** qualify pricing delivery and payback language.
5. **P2:** rewrite blog cards and cluster navigation around distinct intent.
6. **P2:** create named author/reviewer profile pages only where credentials and accountability can be verified.

## Creative proposals

**Creative proposal:** A public “Evidence standard” page that explains what Silverstone counts as a case result, benchmark and scenario.

**Creative proposal:** An interactive savings model that exposes all assumptions and outputs a range rather than a guaranteed result.

**Creative proposal:** Industry “workflow teardown” articles that show current-state steps, failure points, proposed automation, human controls, dependencies and exclusions without promising an outcome.

## Limitations

**Verified observation:** No client records, analytics, sales data or source substantiation files were available in the public website. [L-HOME; L-ABOUT; L-SERVICES]

**Inference:** The audit classifies claims as unsupported on-page, not proven false. [L-HOME; L-SERVICES; L-DENTISTS; L-ESTATE; L-TRADES]

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
