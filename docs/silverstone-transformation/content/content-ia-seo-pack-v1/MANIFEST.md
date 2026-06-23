# MANIFEST — Silverstone Content, IA and SEO Pack v1

## Package identity

- **Package:** `silverstone-content-ia-seo-pack-v1`
- **Version date:** 2026-06-23
- **Repository destination:** `/docs/silverstone-transformation/content/content-ia-seo-pack-v1/`
- **Relationship to source content:** **Accompanies migrated source content; does not replace it**
- **Publication status:** **Requires human approval before publication**
- **Explicit downstream consumer:** **H-04 — Assurance Implementation**
- **Primary conversion:** Qualified discovery-call bookings from non-technical business decision-makers

## Authority and evidence

### Reviewed inputs

- A-01 repository/live audit evidence, including the 50-route inventory, duplicate-pattern findings, redirect baseline and claim risks.
- A-02 independent live-audit findings as carried into the transformation decision and reconciliation documents.
- Current Silverstone home and blog surfaces.
- Current official Google Search Central guidance listed below.

### Required reconciliation before use

The connected repository and File Library did not expose the exact G-02 files named in the prompt during this run. Therefore:

1. This pack **must** be reconciled against G-02 `content-provenance-v1.csv`, claims review, duplicate review and migration exceptions.
2. G-02 remains authoritative for migrated-source provenance and approved exceptions.
3. No source sentence, asset, claim or deletion recommendation should be implemented solely from this pack where G-02 records a different disposition.
4. The checklist makes this a blocking human approval step.

This access limitation does not change the 50-route coverage or the recommendation to quarantine unsupported proof.

## Labelling system

- **Sourced fact:** An observation supported by audit evidence or an external source.
- **Recommendation:** An editorial, IA, SEO or migration decision proposed for approval.
- **Proposed marketing language:** Draft public-facing copy.
- **Proof required:** Content that must not be published as fact until evidence and permission are approved.

## File inventory

| File | Type | Purpose | SHA-256 |
|---|---|---|---|
| `human-review-checklist-v1.md` | Markdown specification/copy | Publication, legal, SEO and release sign-off | `9b394a95c411dde42470a6ca673b31c85d8dba105d1d5ee6bd0c0f88a3cc0c17` |
| `industries/industry-dentists-copy-v1.md` | Markdown specification/copy | Individual industry-page copy | `3f285128cb24742c5bcb696d00b53d6eb6265f8df2b54ebb929c2363d89bb809` |
| `industries/industry-ecommerce-copy-v1.md` | Markdown specification/copy | Individual industry-page copy | `768526f1abc6e2877d90d693f0ac63f64bf9a77f4f2d98e8e208eef3589d8ae8` |
| `industries/industry-estate-agents-copy-v1.md` | Markdown specification/copy | Individual industry-page copy | `f0a127e4366a8d7496a64eeb66fddc025b36bf7cc918c0d696fb44491715b90b` |
| `industries/industry-fitness-coaches-copy-v1.md` | Markdown specification/copy | Individual industry-page copy | `b93c340194b2ffc6737704642be1434e60fedb7c973713339a7d26b7d863abec` |
| `industries/industry-gyms-fitness-studios-copy-v1.md` | Markdown specification/copy | Individual industry-page copy | `e33fb0d3faaa254006608759e3c766292673279af853b74224eb2083817c63a5` |
| `industries/industry-hospitality-copy-v1.md` | Markdown specification/copy | Individual industry-page copy | `a0c36fdd8ce308b30f10b68cfc01ac7ae11f042fa32366c527120c9908c5c397` |
| `industries/industry-physios-chiropractors-copy-v1.md` | Markdown specification/copy | Individual industry-page copy | `5c8d7614dd27493cbf6675d1d3151839b2612b265773bb9ebaea5496673ce5d3` |
| `industries/industry-salons-barbers-copy-v1.md` | Markdown specification/copy | Individual industry-page copy | `ab5f8e72c1319c4073e42edbc7b1371256abda537fa0337c75d39b6e90347402` |
| `industries/industry-trades-copy-v1.md` | Markdown specification/copy | Individual industry-page copy | `4e3d1bbfa6b96cd1c47643a6b653efbb42b8cab3ed954ae0197e119e254538a1` |
| `metadata-schema-map-v1.csv` | CSV map/register | Titles, descriptions, H1s, breadcrumbs, canonicals and schema | `9505d268fde09542e79dd72762163ee5f70eed636589d5ac6997668c14bd62c3` |
| `navigation-internal-link-map-v1.csv` | CSV map/register | Navigation and contextual internal-link specification | `94599ad950e392f592984164ed2e0def33e558cd51069a1c772a196f3ad07e24` |
| `proof-placeholder-register-v1.csv` | CSV map/register | Claim, proof and approval register | `c4ea36567c9dbff4c8a4520d47c91d29cd917dbd9b1e6b0d7cada7c34500ed87` |
| `recommended-information-architecture-v1.md` | Markdown specification/copy | Recommended IA, navigation, route and migration model | `573242b83ef94aa87f5f389f6fb3d7864c798e354938b629134cb2c212a60f04` |
| `redirect-consolidation-recommendations-v1.csv` | CSV map/register | Current-route disposition and staged redirects | `4146ab46824cc022349b30593365f2b4004b8fce515631b39af395a35b7ec198` |
| `service-naming-map-v1.csv` | CSV map/register | Required-family, public-name and source-content mapping | `4dbab62181da8dcdc559263e92cfe4521071fee376f17e54974fb6502059cfa0` |
| `services/service-ai-automation-copy-v1.md` | Markdown specification/copy | Individual service-page copy | `812b2ba1333ace6bed0f00bb9f74c6bec118548bcd6b1f0cc65a0ebbae30c98e` |
| `services/service-ai-receptionists-copy-v1.md` | Markdown specification/copy | Individual service-page copy | `52992c6437e25a877f022f93a66c2c44db25a6de442cdd17554d30c291f049e1` |
| `services/service-ai-voice-agents-copy-v1.md` | Markdown specification/copy | Individual service-page copy | `20eafb9b0499a508146ff390a1cb4405f84dfd3c5130fa30209465f16bf5c677` |
| `services/service-app-development-copy-v1.md` | Markdown specification/copy | Individual service-page copy | `70f016d62ba460c08df1a0645e97fc5f703fa78e47bc87d5db2d99e8df07ad77` |
| `services/service-content-creation-copy-v1.md` | Markdown specification/copy | Individual service-page copy | `88da0f0e34e4a1872437c3d14324fb62c9e6719503ccd72ec09176e2f67fc0ed` |
| `services/service-web-design-development-copy-v1.md` | Markdown specification/copy | Individual service-page copy | `516e998a34cf5363c15ff228fddc1d1b48c043d574dbe1b706c31aee84bd142b` |
| `sitewide-copy-v1.md` | Markdown specification/copy | Core page, CTA, objection and microcopy | `77b6f896b1bc451b52ba7c1ab88cccca2ee2185b4cba617f82ec43f032395e2a` |
| `topic-cluster-map-v1.md` | Markdown specification/copy | UK/London service and industry topic clusters | `8c87b8153fedbd612c73f6ebdcabb789a88fb2c11f83de1980ba8bafdef60d6b` |

## External page review register

**Pages reviewed:** 9  
**Maximum allowed by brief:** 25

| Publisher | Page | URL | Use |
|---|---|---|---|
| Google Search Central | SEO Starter Guide | https://developers.google.com/search/docs/fundamentals/seo-starter-guide | Logical architecture, URLs, unique content, links and titles |
| Google Search Central | Influencing title links | https://developers.google.com/search/docs/appearance/title-link | Distinct, concise and descriptive titles |
| Google Search Central | Control snippets | https://developers.google.com/search/docs/appearance/snippet | Page content and useful meta descriptions |
| Google Search Central | Breadcrumb structured data | https://developers.google.com/search/docs/appearance/structured-data/breadcrumb | Visible hierarchy and validated BreadcrumbList |
| Google Search Central | Site moves and migrations | https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes | URL maps, direct redirects, testing and monitoring |
| Silverstone AI | Current home page | https://silverstone-ai.com/ | Current positioning, service language, CTA and unsupported claim review |
| Silverstone AI | Current blog hub | https://silverstone-ai.com/blog | Current article estate and topic overlap |
| TechRadar | Quo review | https://www.techradar.com/pro/phone-communications/quo-review | Current category language around AI voice agents and virtual reception |
| TechRadar | Zoom AI virtual agent coverage | https://www.techradar.com/pro/zooms-new-ai-agent-might-mean-you-never-need-a-human-receptionist-ever-again | Current category language; not used for Silverstone claims |

No quantitative market-size, ranking-volume or competitor-performance claim has been imported into the proposed marketing copy.

## Validation summary

| Check | Result |
|---|---|
| Required payload files | PASS — 24 payload files plus this manifest = 25 total |
| Service-page files | PASS — 6 |
| Industry-page files | PASS — 9 |
| Current route coverage | PASS — 50 of 50 current canonical routes represented in metadata and disposition maps |
| Required service families | PASS — all six mapped to consistent public names |
| Metadata lengths | PASS — all titles ≤70 characters and descriptions ≤165 characters |
| CSV parsing | PASS — 5 CSV files parsed with headers and data rows |
| Service copy length | PASS — range 639–684 words |
| Industry copy length | PASS — range 630–696 words |
| Industry differentiation | PASS — industry-specific sections maximum pairwise token Jaccard similarity 0.455 (ecommerce / gyms-fitness-studios); shared page scaffolding excluded |
| Claim-safety scan | PASS — no unqualified guarantee, superiority or result language detected in proposed copy |
| Redirect safety | PASS — no immediate deletion of a current canonical; industry moves are staged |
| Manifest completeness | PASS — every payload file exists and is hashed |

## Implementation boundaries

- Do not publish this pack directly.
- Do not modify live routes, redirects, claims, pricing or schema without the approval gates.
- Preserve current canonicals until the approved route map authorises a move.
- H-04 must remove unsupported assurance or guarantee language and apply the approved assurance directive.
- H-03 remains the authority for public pricing treatment.
- This package contains no secrets, production credentials or repository code changes.

## Final acceptance statement

The pack is complete for editorial handoff. It accompanies migrated source content and requires human approval, G-02 reconciliation, claim approval and release validation before publication.
