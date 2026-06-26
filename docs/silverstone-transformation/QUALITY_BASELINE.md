# Silverstone Quality Baseline

**Status:** Reproducible baseline observations before further presentation-layer work.  
**Last updated:** 2026-06-26.  
**Primary sources:** A-01 repository/live audit, A-02 external live audit priority findings, Replit visual validation matrices, active ExecPlan records, current repository inspection.

## Current Validation Surface

### Root legacy app

- Root `package.json` scripts include `build`, `generate:sitemaps`, `seo:audit`, and `indexnow:submit`.
- `npm test` is a placeholder that exits with failure.
- `netlify.toml` root build command is `npm run build && npm run generate:sitemaps`; publish directory is `.`.
- Legacy root validation is primarily script/audit based, not unit-test based.

### `/web` app

- `/web/package.json` requires Node `>=20.19.0`; repository `.nvmrc` contains `22`.
- Main scripts: `dev`, `build`, `preview`, `typecheck`, `lint`, `format:check`, `test`, `test:e2e`, `test:a11y`, `bundle:report`, `migration:validate`, `staging:safety`, `verify`.
- `npm run verify` includes full `format:check`, which has known prior failures outside this documentation pass.
- Ignored generated local residue currently exists in `/web`, but it is not tracked.

## Reproducible Defects And Risks

| ID     | Area                    | Evidence                                                     | Current observation                                                                                                         | Required future proof                                                            |
| ------ | ----------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| QB-001 | Consent/privacy         | `privacy-policy.html`, legacy head scripts, A-01, F-002      | GA `G-7GT6DQKTT5` loads before consent while policy says non-essential cookies load only after consent                      | Browser network test before/after consent; policy text matches behaviour         |
| QB-002 | Contact form            | `assets/js/app.js`, `netlify/functions/send-email.js`, F-012 | Presence-only validation, client-only honeypot, no live region, raw provider detail can be returned                         | Unit/contract tests for validation and safe errors; accessible status test       |
| QB-003 | Calendly                | `book.html`, integration safety docs                         | Production event URL is embedded; provider account settings unverified                                                      | Staging placeholder/test event and fallback verified without real booking        |
| QB-004 | Route loop/discrepancy  | A-01, A-02, route manifest                                   | `/blog/ai-lead-capture-trades-uk-2026` has conflicting evidence: self-loop then legacy-shell load                           | Fresh route/redirect crawl and owner route decision                              |
| QB-005 | Gyms alias              | rebuild decision and route plan                              | `/services/gyms-fitness-studios` canonical; `/services/gyms` unresolved                                                     | Fresh crawl and redirect decision before release                                 |
| QB-006 | Claims/proof            | A-02 F-001, content reports                                  | Home and industry pages include unsupported exact/absolute outcome claims                                                   | Claim ledger with source, owner, date, method, approved wording                  |
| QB-007 | Accessibility landmarks | A-02 F-005                                                   | Legacy templates lacked main landmark and skip link                                                                         | `/web` route tests for skip link and main landmark                               |
| QB-008 | Mobile nav              | A-02 F-006                                                   | Legacy mobile menu trigger was a focusable div with click-only behaviour                                                    | Native button, state, keyboard, focus management browser test                    |
| QB-009 | Image dimensions        | A-02 F-013                                                   | A-01 recorded 206 legacy images without explicit intrinsic dimensions                                                       | Width/height or aspect-ratio proof; CLS/layout stability checks                  |
| QB-010 | Sitemap drift           | A-02 F-019; 2026-06-26 root `npm run seo:audit`              | Legacy root `sitemap.xml` generated content is stale; root artifacts were not regenerated because the legacy root is frozen | Generated sitemap equals route source and terminal/indexable checks pass         |
| QB-011 | Asset pipeline          | A-01, F-022                                                  | Generated image derivative drift, missing derivatives for `blog_40`/`blog_41`, basename collision for `blog_1`              | Deterministic asset source IDs and collision-safe derivatives                    |
| QB-012 | Pricing no-JS           | A-02 F-011                                                   | Legacy pricing widget was client-rendered React island                                                                      | Pricing essentials available in initial HTML; enhancement-only interactivity     |
| QB-013 | Footer freshness        | A-02 F-021                                                   | Legacy inspected pages displayed footer year 2025 in June 2026                                                              | Governed content/current-year rule before production release                     |
| QB-014 | Performance budgets     | active ExecPlan, Replit handoff, 2026-06-26 verification     | `/web` bundle report passes the 300 KB hard ceiling at `294.75 KB gzip` but remains above the 220 KB target                 | Bundle budget, Lighthouse/tracing, FPS/long-task checks on representative routes |
| QB-015 | Format baseline         | active ExecPlan, 2026-06-26 verification                     | Full `/web` `npm run format:check` now passes                                                                               | Keep full formatting check passing without repo-wide unrelated churn             |
| QB-016 | Transient Vite artifact | Replit unresolved issues                                     | One-time invalid hook/hydration warning can appear after build/restart and clear on reload                                  | Reproduce and fix only in a tooling task if still present                        |

## Positive Baseline To Preserve

- Legacy root renders 50 canonical pages in repository evidence, with unique titles, canonical URLs, meta descriptions, and one repository H1 per page.
- `/web` now has a verified passing foundation command set: format, lint, typecheck, unit tests, build, migrated-content validation, route parity, redirects, staging safety, full e2e and a11y.
- Booking page copy is a positive contract: it explains the 30-minute call, reduces pressure, and provides contact fallback.
- Desktop and mobile parallax are active and must not be disabled to hide defects.
- `/web` has prior records of passing lint, typecheck, unit tests, build, staging safety, Playwright desktop/mobile smoke, and a11y-tagged tests during earlier implementation records.
- Replit visual prototypes captured no horizontal overflow across the recorded matrices after prototype fixes.

## Validation Required Before Future Cutover

- Fresh 50-route local and deployment-equivalent crawl.
- Redirect termination and loop checks for every retained redirect.
- Sitemap and robots/header parity checks.
- No-JS content checks for indexable routes.
- Browser tests across desktop, 390px mobile, reduced motion, and constrained/no-WebGL conditions.
- Accessibility checks for landmarks, skip links, focus, keyboard nav, form status, modals/drawers, and zoom/reflow.
- Integration tests using mocks/sandbox only.
- Secret scan and production-boundary scan.
