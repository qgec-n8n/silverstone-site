# Silverstone Redirect Requirements

**Status:** Redirect preservation and cutover contract.  
**Last updated:** 2026-06-26.  
**Sources:** `netlify.toml`, `docs/silverstone-transformation/audits/seo-redirect-baseline-v1.csv`, `web/src/data/generated/legacy-route-manifest.json`, `docs/silverstone-transformation/architecture/execution-blueprint-v1/route-content-migration-plan-v1.md`.

## Contract

- Redirects are deployment-layer behaviour, not client-router-only behaviour.
- Existing redirect sources must be preserved until a later owner-approved redirect diff changes them.
- Redirects must terminate in one hop where approved and must not self-redirect or loop.
- Canonical routes must return terminal success responses, not route-shell 200s for missing pages.
- Unknown routes must return a genuine 404 in deployment-equivalent staging.
- No redirect can be removed because its source is old, ugly, or inconvenient.

## Current Inventory

- `web/src/data/generated/legacy-route-manifest.json` contains 133 records: 50 canonical and 83 redirect records.
- `docs/silverstone-transformation/audits/seo-redirect-baseline-v1.csv` is the authoritative audit CSV for canonical and redirect evidence.
- `netlify.toml` contains current production redirect definitions for legacy `.html`, `/niches/*`, service aliases, article `.html`, and long-form article slugs.

## Redirect Classes To Preserve

| Class                       | Examples                                                                                                                                                                                                                                                                                                      | Requirement                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Root HTML to clean URL      | `/index.html` -> `/`, `/about.html` -> `/about`                                                                                                                                                                                                                                                               | Preserve one-hop 301                                                                      |
| Main page HTML to clean URL | `/services.html`, `/pricing.html`, `/blog.html`, `/book.html`, `/contact.html`, `/privacy-policy.html`                                                                                                                                                                                                        | Preserve one-hop 301                                                                      |
| Legacy niche pages          | `/niches/dentists(.html)`, `/niches/ecommerce(.html)`, `/niches/estate-agents(.html)`, `/niches/fitness-coaches(.html)`, `/niches/gyms-fitness-studios(.html)`, `/niches/hospitality(.html)`, `/niches/physios-chiropractors(.html)`, `/niches/salons-barbers(.html)`, `/niches/trades-virtual-office(.html)` | Preserve to matching `/services/*` canonical                                              |
| Service HTML aliases        | `/services/dentists.html`, `/services/ecommerce.html`, `/services/estate-agents.html`, `/services/fitness-coaches.html`, `/services/gyms-fitness-studios.html`, `/services/hospitality.html`, `/services/physios-chiropractors.html`, `/services/salons-barbers.html`, `/services/trades.html`                | Preserve one-hop 301                                                                      |
| Trades legacy alias         | `/services/trades-virtual-office(.html)`                                                                                                                                                                                                                                                                      | Preserve to `/services/trades`                                                            |
| Blog HTML aliases           | every retained `/blog/*.html` source in the baseline                                                                                                                                                                                                                                                          | Preserve to matching clean article route                                                  |
| Long-form article slugs     | historical "how-..." paths in `netlify.toml` and redirect CSV                                                                                                                                                                                                                                                 | Preserve to current article canonical                                                     |
| Duplicate definitions       | `/blog/ai-returns-triage-ecommerce-uk.html`, `/blog/ai-lead-capture-trades-uk-2026.html`                                                                                                                                                                                                                      | Consolidate only through approved redirect diff; verify no duplicate behavioural conflict |

## Explicit Blocker

`/blog/ai-lead-capture-trades-uk-2026` is unresolved. A-01 recorded a forced self-redirect/loop, while later advisory evidence found it loading with a legacy shell. Before any cutover or redirect work:

1. Freshly crawl `/blog/ai-lead-capture-trades-uk-2026`.
2. Freshly crawl `/blog/ai-lead-capture-trades-uk-2026.html`.
3. Verify terminal status, final URL, canonical, shell, sitemap membership, and internal links.
4. Decide retain, differentiate, consolidate, or redirect through an owner-approved SEO/content decision.

## Future Additive Route Redirects

The current `/web` app includes additive routes such as `/industries`, `/how-we-work`, and seven service-offer routes. They do not automatically receive production redirects. Redirect sources for these routes require evidence of existing public entry points or an approved launch plan.

## Verification Procedure

- Generate redirect expectations from `web/src/data/generated/legacy-route-manifest.json` and `docs/silverstone-transformation/audits/seo-redirect-baseline-v1.csv`.
- Run deployment-equivalent redirect tests, not only local client navigation.
- Fail on status mismatch, self-loop, multi-hop chain without approval, wrong final canonical, unexpected 200 shell, or missing 404.
- Compare sitemap entries to terminal indexable canonicals.
