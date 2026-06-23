# Silverstone route and content migration plan v1

## 1. Baseline

The first-release migration baseline contains 50 canonical routes: 8 main/legal, 9 service and 33 blog routes. Canonical paths are preserved exactly unless a separately approved content/SEO decision changes a route.

## 2. Migration waves

| Wave | Scope | Entry condition | Exit condition |
|---|---|---|---|
| M0 | route registry and migration harness | foundation builds | all 50 records parse; duplicate path/canonical checks pass |
| M1 | shell, home, about, services index | M0 | initial HTML, metadata, navigation, screenshots and reduced motion pass |
| M2 | pricing, book, contact, privacy | M1 | pricing works without JS; integrations are mocked; privacy/consent review open items recorded |
| M3 | nine service routes | service template approved | nine route diffs pass; claims ledger applied |
| M4 | blog index and representative three articles | article model approved | typography, schema, cards and internal links pass |
| M5 | remaining 30 articles | M4 | all 33 articles emitted and parity report complete |
| M6 | redirect and deployment-equivalent parity | all routes complete | canonical/redirect crawl, 404, sitemap, robots and header tests pass |

## 3. Canonical route groups

### Main and legal

`/`, `/about`, `/services`, `/pricing`, `/blog`, `/book`, `/contact`, `/privacy-policy`

### Services

`/services/dentists`  
`/services/ecommerce`  
`/services/estate-agents`  
`/services/fitness-coaches`  
`/services/gyms-fitness-studios`  
`/services/hospitality`  
`/services/physios-chiropractors`  
`/services/salons-barbers`  
`/services/trades`

### Blog

The route registry must import all 33 canonical blog paths from `A01-ROUTES` without manual retyping as the final source of truth. The implementation baseline script must compare generated records against the CSV and fail on omissions, additions or canonical changes.

## 4. Route parity contract

For every retained canonical route, compare:

- path and terminal HTTP status;
- canonical URL;
- title and meta description;
- one descriptive H1;
- robots/indexability;
- Open Graph/Twitter metadata where applicable;
- JSON-LD types and supported claims;
- visible breadcrumbs and BreadcrumbList;
- primary navigation and footer links;
- internal inlinks/outlinks;
- content sections and CTA intent;
- images, alt text, dimensions and responsive sources;
- reduced-motion rendering;
- no-JavaScript readability;
- mobile and desktop screenshots.

A content rewrite may intentionally differ, but the deviation record must state owner, reason, old contract, new contract and approval.

## 5. Content disposition

| Existing disposition | Migration action |
|---|---|
| retain | migrate faithfully; only structural and accessibility edits without approval |
| refactor | preserve intent and facts; restructure for component/content model |
| rewrite | do not copy unsafe wording blindly; editorial approval required |
| unresolved | preserve route record, block final content acceptance until decision |
| discard | not authorised by this blueprint |

## 6. Special cases

### Gyms route discrepancy

`/services/gyms-fitness-studios` remains canonical. `/services/gyms` is an alias hypothesis only. A fresh crawl must test both before redirect configuration is approved.

### Trades lead-capture overlap

The overlapping trades lead-capture and quote-follow-up articles remain separate during architectural migration. Consolidation, deletion or canonical changes require a named SEO/content decision and redirect plan.

### Former redirect-loop route

`/blog/ai-lead-capture-trades-uk-2026` is retained in the route baseline until fresh crawl evidence and an owner decision determine its terminal behaviour. The target app must not reproduce a self-loop.

## 7. Content model requirements

Every route record links to:

- a route owner;
- content owner;
- content status;
- claims status;
- primary intent;
- CTA intent;
- parent/cluster;
- related routes;
- migration evidence;
- acceptance row IDs.

## 8. SEO rendering strategy

- Static/pre-rendered route HTML.
- One route registry generates route output, canonical metadata, breadcrumbs and sitemap entries.
- Build fails on duplicate title, canonical or path.
- Article `dateModified` uses meaningful editorial dates, not build time.
- Structured data contains only visible and supported facts.
- Staging canonicals must not point to staging URLs if that risks indexing; staging remains blocked and may use production canonicals solely for parity testing.
- Redirect validation occurs at the deployment layer, not only in client navigation.

## 9. Route acceptance evidence

Each route produces a record containing build path, source content ID, HTML byte size, initial text presence, metadata values, schema types, outgoing links, image count, screenshot references and test status.

## Evidence authority

This blueprint is derived from the following repository authorities on branch `transformation/audit`:

- `../../audits/MANIFEST.md` (`A01-MANIFEST`)
- `../../audits/repository-live-audit-v1.md` (`A01-AUDIT`)
- `../../audits/route-inventory-v1.csv` (`A01-ROUTES`)
- `../../audits/asset-integration-inventory-v1.csv` (`A01-ASSETS`)
- `../../audits/repo-live-diff-v1.md` (`A01-DIFF`)
- `../../audits/seo-redirect-baseline-v1.csv` (`A01-SEO`)
- `../../audits/external-live-audit/` (`A02-*`)
- `../../research/platforms/` (`B01-*`)
- `../../research/benchmarks/` (`B02-*`)
- `../rebuild-decision-v1.md` (`C01-DECISION`)

Where evidence conflicts, the precedence order is: current owner-approved decision record; fresh implementation-baseline crawl; A-01 route/redirect inventories; A-02 advisory findings; platform and benchmark research. No conflict may be silently reconciled.

