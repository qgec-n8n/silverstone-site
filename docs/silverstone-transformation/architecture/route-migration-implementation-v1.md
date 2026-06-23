# Route migration implementation v1

**Branch:** `transformation/foundation`
**Start commit:** `d48cebd4`
**Checkpoint:** CP2 — route/content contracts and migration framework
**Production boundary:** legacy root, Replit-owned paths, `netlify.toml`, production integrations and analytics remain unchanged.

## Outcome

The `/web` application now has a typed, source-backed migration framework for all A-01 canonical routes and all A-01 SEO/redirect baseline records. This checkpoint establishes route parity infrastructure and reusable templates; it does not complete the marketing-copy rewrite.

## Authority and ownership

Read before implementation:

- `AGENTS.md`
- `web/AGENTS.override.md`
- `architecture/active-execplan-v1.md`
- `architecture/file-ownership-register-v1.csv`
- the complete `architecture/execution-blueprint-v1/` package
- `audits/route-inventory-v1.csv`
- `audits/seo-redirect-baseline-v1.csv`

Lease-equivalent scope:

```yaml
lease_id: D02-route-content-001
branch: transformation/foundation
owner: Codex
paths:
  - web/src/routes/**
  - web/src/content/**
  - web/src/data/**
  - web/src/seo/**
  - web/scripts/migration/**
  - web/tests/**
  - web/react-router.config.ts
  - web/scripts/assert-staging-safety.mjs
  - docs/silverstone-transformation/architecture/route-migration-implementation-v1.md
  - docs/silverstone-transformation/seo/future-route-map-v1.csv
start_commit: d48cebd4
purpose: establish typed route, content, SEO and parity infrastructure
expires: commit and handoff
```

Replit-owned `/replit.md` retained SHA-256 `bb3c221d9ea9d37c920c6862a93879f90ada1f812346627e2ef26ef0a480cc9d`. Frozen production `netlify.toml` retained SHA-256 `0ca94089fd6e8c688d9347eb681feab96b087aa170c77b5a7bee218a65ef8861`.

## Capabilities used

- Repository instruction, ExecPlan and ownership evaluation
- React Router 7 framework-mode route modules, prerendering and automatic route code splitting
- React/TypeScript strict-schema implementation
- Technical SEO canonical, metadata, robots, sitemap, breadcrumb and JSON-LD generation
- Test-driven development for route manifests, content schemas, SEO, loader normalization and template hydration
- Systematic debugging for prerender `.data` requests, invalid breadcrumb nesting and stale preview-server file metadata
- In-app browser verification plus repository Playwright desktop/mobile tests
- Verification-before-completion checks

No dependency, production deployment, external integration or production analytics capability was used.

## Generated contracts

`web/scripts/migration/generate-manifests.mjs` reads the frozen A-01 CSVs and legacy HTML files, then deterministically generates:

- `web/src/data/generated/future-route-manifest.json`
- `web/src/data/generated/legacy-route-manifest.json`
- `web/src/content/generated/source-content-manifest.json`
- `docs/silverstone-transformation/seo/future-route-map-v1.csv`

The content manifest preserves each legacy source path, SHA-256 digest, title, description, H1, editorial dates where present, risk notes and 4,189 extracted semantic copy blocks. Copy is extracted, not rewritten.

## Route totals

| Contract | Count |
|---|---:|
| Future canonical routes | 50 |
| Future production-indexable routes | 49 |
| Future sitemap routes | 49 |
| Draft routes | 1 |
| Legacy URL records | 133 |
| Active redirect rules | 82 |
| Source content records | 50 |

Future route groups:

| Group | Count |
|---|---:|
| Blog | 34 |
| Industries | 9 |
| Conversion | 3 |
| Company | 2 |
| Services | 1 |
| Legal | 1 |

Legacy dispositions:

| Disposition | Count | Future handling |
|---|---:|---|
| Retained | 49 | Canonical route |
| Redirected | 80 | Active one-hop redirect contract |
| Consolidated | 2 | Duplicate legacy definitions represented as one active rule |
| Draft | 1 | Route retained for staging parity but excluded from future indexing/sitemap |
| Removed | 1 | Unsafe forced self-redirect omitted from active rules |

## Runtime architecture

- Route modules are grouped under `company`, `services`, `industries`, `blog`, `conversion` and `legal`.
- React Router route modules provide route-level lazy chunks.
- The prerender list comes from the generated future manifest and emits 50 route-specific HTML documents.
- Core marketing, service, industry and article templates use existing design primitives.
- Unknown direct requests return a static-server 404; client-side unknown routes render the not-found route.
- Every route renders one source H1, description, visible breadcrumbs, related internal links and JSON-LD.
- Staging robots policy remains fail-closed in the root HTML and response header.

## SEO and redirect behavior

- Canonicals remain production-origin URLs from A-01.
- Staging emits `noindex,nofollow,noarchive`, blocks all crawling in `robots.txt`, omits `sitemap.xml` and contains no production analytics.
- Production robots and sitemap builders are implemented but cannot overwrite `build/client` through the migration script.
- Redirect validation runs entirely against the generated contract; `netlify.toml` is not read as implementation authority and is not changed.
- Active redirects have no self-redirects, duplicate sources or cycles, and every target resolves to a future route.

## Unresolved content

`/blog/ai-lead-capture-trades-uk-2026` remains explicitly `draft` because A-01 records a live forced self-redirect loop and search-intent overlap. The route:

- remains present for route parity;
- self-canonicalizes in staging;
- is excluded from the future production sitemap;
- is excluded from future production indexability;
- retains the source copy and risk notes;
- requires a named content/SEO owner decision before release.

Content statuses remain source-derived: 35 `refactor`, 11 `rewrite`, 3 `retain`, and 1 `unresolved`. No unresolved copy or claim was invented.

## Verification commands

```sh
cd web
node scripts/migration/generate-manifests.mjs
npm run verify
node scripts/migration/validate-route-parity.mjs
node scripts/migration/validate-redirects.mjs
node scripts/migration/generate-seo-artifacts.mjs --environment=staging --out=build/client
npm run preview -- --port 4173
node scripts/migration/crawl-routes.mjs http://127.0.0.1:4173
```

Expected evidence:

- 14 unit test files and 26 unit tests pass.
- 22 desktop/mobile Playwright tests pass.
- 50 canonical routes prerender.
- 50 HTTP routes crawl with no metadata, canonical, H1, JSON-LD, staging-robots, internal-link or analytics failures.
- Unknown route returns HTTP 404.
- 127.84 KB gzip JavaScript, below the 220 KB target.
- Staging safety, route parity and redirect validation pass.

## Rollback

Before merge, discard only the paths listed in this document. After commit, use:

```sh
git revert <route-migration-commit>
```

The untouched legacy root remains the operational rollback baseline. Do not copy `/web/build` into the legacy root.
