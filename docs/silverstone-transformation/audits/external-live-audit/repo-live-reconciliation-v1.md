# Silverstone AI repository-to-live reconciliation v1

Completed: 2026-06-22  
Authority status: reconciliation companion to Prompt A-01; it does not supersede the pinned repository audit.

This independent external audit **accompanies rather than replaces** the Prompt A-01 repository/live audit. Prompt A-01 remains the repository baseline. This package adds a current, conversion-led and standards-led reading of the public site. **C-01 and H-01 are downstream consumers** of these findings.

## Evidence labels

- **Verified observation** — directly observed on the current live website during this audit.
- **Repository evidence** — directly supported by the uploaded Prompt A-01 pack.
- **Inference** — an analytical conclusion drawn from cited observations; it is not a measured outcome.
- **Recommendation** — a proposed change; it is not presented as a current fact.
- **Creative proposal** — an optional concept requiring validation before adoption.

## Authority model

**Repository evidence:** Prompt A-01 is pinned to repository source `1e445c305c30cae93d5f6427135a238be8d58c14` and documents its own production-safety boundary, inventories and evidence set. [A01-MANIFEST; A01-AUDIT]

**Recommendation:** Use A-01 for repository facts and this package for current live content, conversion, standards and reconciliation decisions.

## Material differences since A-01

### Former redirect loop now resolves

**Repository evidence:** A-01 observed a forced self-redirect loop on `/blog/ai-lead-capture-trades-uk-2026`. [A01-MANIFEST; A01-AUDIT; A01-DIFF; A01-SEO]

**Verified observation:** The route now loads as a live article. [B-LEAD-A]

**Inference:** Production routing changed after the A-01 observation or a different edge rule now takes precedence. [B-LEAD-A; A01-DIFF]

**Recommendation:** Record the exact corrective change in the repository/hosting source of truth and add a permanent loop regression test.

### Resolved route still uses a legacy page shell

**Verified observation:** The restored article uses “Niches” navigation wording and does not expose the pricing navigation item used by the standard current page shell. [B-LEAD-A; L-HOME; L-SERVICES; L-PRICING]

**Inference:** Route availability is fixed, but template parity is not. [B-LEAD-A; L-HOME]

**Recommendation:** Migrate the article into the governed shared shell while preserving its URL until the content-overlap decision is complete.

### Content-overlap risk remains

**Repository evidence:** A-01 flagged a five-route trades lead/quote intent-overlap group as unresolved. [A01-AUDIT; A01-ROUTES]

**Verified observation:** The two reviewed trades lead-capture URLs remain live with closely overlapping titles, publication timing and subject matter. [B-LEAD-A; B-LEAD-B]

**Inference:** The editorial issue remains unresolved even though the technical loop is no longer blocking one route. [B-LEAD-A; B-LEAD-B; A01-AUDIT]

**Recommendation:** Decide consolidation or differentiation before migrating copy into a new content model.

## Findings confirmed by current live inspection

| A-01 finding | Current reconciliation |
|---|---|
| Broad primary and nine-industry architecture [A01-AUDIT; A01-ROUTES] | confirmed in current navigation and inspected routes [L-HOME; L-SERVICES; L-DENTISTS; L-ECOMMERCE; L-ESTATE; L-FITNESS; L-GYMS; L-HOSPITALITY; L-PHYSIO; L-SALONS; L-TRADES] |
| Unsupported quantified proof on commercial pages [A01-AUDIT] | confirmed across home and all nine industry pages [L-HOME; L-DENTISTS; L-ECOMMERCE; L-ESTATE; L-FITNESS; L-GYMS; L-HOSPITALITY; L-PHYSIO; L-SALONS; L-TRADES] |
| Consent statement conflicts with analytics load order [A01-AUDIT] | privacy statement remains live; repository conflict remains actionable [L-PRIVACY; A01-AUDIT] |
| Shared template repetition [A01-AUDIT] | confirmed through highly consistent industry-page section sequences [L-DENTISTS; L-ECOMMERCE; L-ESTATE; L-FITNESS; L-GYMS; L-HOSPITALITY; L-PHYSIO; L-SALONS; L-TRADES] |
| Footer year `2025` across the site [A01-AUDIT] | still visible on inspected current pages in June 2026 [L-HOME; L-ABOUT; L-SERVICES; L-PRICING; L-BLOG; L-BOOK; L-CONTACT] |
| Strong booking/contact intent [A01-AUDIT] | confirmed; booking page retains no-pressure explanation and contact fallback [L-BOOK; L-CONTACT] |
| Large blog inventory with low-inlink pages [A01-AUDIT; A01-ROUTES] | long archive confirmed; row-level low-inlink counts remain repository evidence [L-BLOG; A01-ROUTES] |

## Findings not independently re-measured

**Repository evidence:** A-01 contains route-wide rendered scans, asset counts, HTTP headers, schema counts, image dimensions, structural similarity and build-pipeline comparisons. [A01-MANIFEST; A01-AUDIT; A01-DIFF; A01-ASSETS]

**Inference:** Those remain repository evidence, not newly measured live facts in this external audit. [A01-MANIFEST; A01-AUDIT]

**Recommendation:** Re-run the A-01 machine checks at the implementation baseline and again before release rather than copying old counts into acceptance criteria.

## Route coverage reconciliation

### Primary and legal routes

| Route | Current external inspection | A-01 inventory |
|---|---|---|
| `/` | inspected [L-HOME] | present [A01-ROUTES] |
| `/about` | inspected [L-ABOUT] | present [A01-ROUTES] |
| `/services` | inspected [L-SERVICES] | present [A01-ROUTES] |
| `/pricing` | inspected [L-PRICING] | present [A01-ROUTES] |
| `/blog` | inspected [L-BLOG] | present [A01-ROUTES] |
| `/book` | inspected [L-BOOK] | present [A01-ROUTES] |
| `/contact` | inspected [L-CONTACT] | present [A01-ROUTES] |
| `/privacy-policy` | inspected [L-PRIVACY] | present [A01-ROUTES] |

### Industry routes

| Route | Current external inspection | A-01 inventory |
|---|---|---|
| `/services/dentists` | inspected [L-DENTISTS] | present [A01-ROUTES] |
| `/services/ecommerce` | inspected [L-ECOMMERCE] | present [A01-ROUTES] |
| `/services/estate-agents` | inspected [L-ESTATE] | present [A01-ROUTES] |
| `/services/fitness-coaches` | inspected [L-FITNESS] | present [A01-ROUTES] |
| `/services/gyms` | inspected [L-GYMS] | present [A01-ROUTES] |
| `/services/hospitality` | inspected [L-HOSPITALITY] | present [A01-ROUTES] |
| `/services/physios-chiropractors` | inspected [L-PHYSIO] | present [A01-ROUTES] |
| `/services/salons-barbers` | inspected [L-SALONS] | present [A01-ROUTES] |
| `/services/trades` | inspected [L-TRADES] | present [A01-ROUTES] |

### Representative article routes

| Route | Reason selected |
|---|---|
| `/blog/ai-receptionist-costs-roi-uk-small-business-2026` | commercial intent [B-ROI] |
| `/blog/gdpr-ai-automation-uk-small-business-2026` | compliance [B-GDPR] |
| `/blog/ai-booking-automation-uk-hospitality-2026` | industry example and claims [B-HOSP] |
| `/blog/ai-lead-capture-trades-uk-2026` | former loop and overlap [B-LEAD-A] |
| `/blog/dental-recall-automation-uk-2026` | healthcare cluster [B-DENTAL] |
| `/blog/ai-post-purchase-support-ecommerce-uk-2026` | ecommerce cluster [B-ECOM] |
| `/blog/why-ai-automation-projects-fail-uk-small-business-2026` | risk/objection content [B-FAIL] |
| `/blog/ai-lead-capture-uk-trades-2026` | overlapping intent comparison [B-LEAD-B] |

## Downstream handoff

**Recommendation:** C-01 should consume route ownership, claim governance, conversion hierarchy, topic-cluster and consolidation decisions.

**Recommendation:** H-01 should consume technical acceptance criteria, accessible interaction requirements, progressive enhancement, asset/embed performance controls and release validation.

**Recommendation:** Neither downstream workstream should reinterpret A-01 repository evidence as a current live fact without revalidation where the production state can change.

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
