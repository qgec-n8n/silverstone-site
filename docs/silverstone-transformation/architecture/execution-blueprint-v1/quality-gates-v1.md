# Silverstone quality gates v1

## Gate G0 — authority and clean baseline

- current commit recorded;
- branch and worktree conform;
- legacy root hash/status recorded and unchanged;
- architecture blueprint present;
- no production credentials;
- fresh route/redirect crawl scheduled.

## Gate G1 — foundation

- clean install, typecheck, lint, unit test and production build pass;
- `/web` is self-contained;
- 50-route registry imports and validates;
- SSG/pre-render proof emits meaningful HTML;
- initial route bundle measurement is automated;
- non-indexable staging policy is testable.

## Gate G2 — shared system

- semantic shell, skip link, landmarks, keyboard navigation and visible focus;
- tokens and shadcn primitives approved;
- no legacy CSS wholesale import;
- error boundaries and no-JS baseline;
- reduced-motion policy implemented before decorative motion.

## Gate G3 — route-group parity

For each route group:

- route count and paths match;
- metadata/canonical/schema tests pass;
- initial content present;
- visual review at desktop and 390×844;
- no critical accessibility violations;
- bundle budget passes;
- claims/deviation ledger complete.

## Gate G4 — integrations

- mock/sandbox adapters only;
- production-send guard tests pass;
- consent network behaviour passes;
- Calendly fallback passes without live booking;
- accessible status states pass;
- secrets scan passes.

## Gate G5 — motion and performance

- JavaScript target and hard ceiling pass;
- LCP, CLS and INP lab targets pass on representative routes;
- no animation-caused long task >50 ms;
- desktop sustained animation >=45 FPS;
- reduced-motion equivalent is understandable;
- shader remains deferred and has fallback;
- no scroll hijacking.

## Gate G6 — staging acceptance

- clean checkout build from `transformation/staging`;
- deployment-equivalent route and header behaviour;
- `X-Robots-Tag` plus page robots block indexing;
- sitemap excludes staging host;
- genuine 404;
- redirects terminate in one hop where approved;
- no production email, booking or analytics;
- full 50-route smoke and representative deep tests;
- rollback rehearsal succeeds.

## Gate G7 — release readiness

This blueprint does not authorise production release. G7 produces an evidence pack and recommendation only. Required sign-offs: architecture, content/SEO, accessibility, performance, integrations and owner.

## Testing pyramid

| Layer | Target | Scope |
|---|---:|---|
| static/type/lint | every change | contracts, imports, config |
| unit | largest count | content validators, SEO builders, adapters, components |
| component/accessibility | high | interactive primitives and sections |
| integration | moderate | route composition and adapter contracts |
| browser E2E | selective | navigation, contact mock, consent, pricing, book fallback |
| visual regression | representative + changed routes | desktop/mobile/reduced motion |
| deployment parity | one candidate | headers, status, redirects, assets, caching |
| manual exploratory | risk-based | assistive tech, motion, mobile, copy/proof |

## Defect severity

- P0: production-boundary breach, secret exposure, indexing-enabled staging, production send/booking.
- P1: missing canonical route, client-only essential content, broken integration fallback, critical accessibility failure, hard performance ceiling breach.
- P2: visual/content parity defect, non-critical accessibility issue, budget target miss below hard ceiling.
- P3: polish, documentation or low-risk inconsistency.

P0/P1 block merge and staging acceptance.

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

