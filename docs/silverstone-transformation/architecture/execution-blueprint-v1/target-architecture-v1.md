# Silverstone target architecture v1

**Status:** Authoritative execution blueprint after owner upload  
**Date:** 2026-06-22  
**Repository destination:** `/docs/silverstone-transformation/architecture/execution-blueprint-v1/`  
**Decision inherited:** Parallel React/Vite rebuild under `/web`; legacy root remains untouched.  
**Consumers:** D-02 onward, including implementation, content migration, visual implementation, integration hardening, QA, staging and release workstreams.

## 1. Governing decisions

1. The target is a new application rooted at `/web`.
2. No file outside `/web` may be modified by implementation work unless a separately approved architecture change explicitly names the file, reason, owner, rollback and production risk.
3. The legacy root site remains the production baseline and rollback target throughout the rebuild.
4. Git is the source of truth. Replit is a visual/staging workspace, not an independent source of truth.
5. The application must provide meaningful initial HTML for every indexable route. Core headings, body copy, pricing, links, canonical tags, metadata and structured content must not depend on client execution.
6. Route parity precedes redesign freedom. Deliberate copy, proof or visual changes require recorded approval and do not alter canonical-path obligations by default.
7. Production `main`, Netlify, DNS, live environment variables, Resend, analytics and Calendly are immutable until a separate release authorisation.
8. Staging is non-indexable and cannot send production email or create production bookings.
9. One implementation owner controls a file at a time. Codex and Replit may not edit overlapping files concurrently.

## 2. Application boundary

```text
/
├── legacy production application (untouched)
├── docs/
└── web/
    ├── src/
    │   ├── app/
    │   ├── routes/
    │   ├── content/
    │   ├── components/
    │   ├── features/
    │   ├── integrations/
    │   ├── motion/
    │   ├── seo/
    │   ├── styles/
    │   ├── assets/
    │   ├── test/
    │   └── types/
    ├── public/
    ├── scripts/
    ├── tests/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig*.json
    ├── tailwind.config.*
    └── README.md
```

No target build output may be copied into the legacy root during D-02 onward. Preview and release-candidate deployment must point directly at `/web`.

## 3. Runtime architecture

### 3.1 Rendering

**Recommendation:** Use Vite with React and a static pre-render/SSG layer that emits route-specific HTML at build time, followed by selective hydration. A client-only SPA shell is prohibited for indexable routes.

Required properties:

- one emitted HTML document per canonical route;
- route-level title, description, canonical, robots and social metadata in initial HTML;
- route-level JSON-LD in initial HTML;
- crawlable anchor links without JavaScript;
- core content and pricing visible when JavaScript is disabled;
- deterministic sitemap generation from the same route registry;
- client routing may enhance transitions but cannot be the only route-resolution mechanism.

The implementation team may choose an SSG-compatible Vite mechanism after a time-boxed feasibility spike. The selected mechanism must pass a 50-route clean-build proof before route migration begins. Introducing a full framework outside the approved React/Vite constraint requires an architecture-change record.

### 3.2 Application layers

| Layer | Responsibility | Forbidden responsibility |
|---|---|---|
| `app` | providers, error boundaries, shell composition, route bootstrapping | route copy, provider secrets |
| `routes` | route modules and page composition | duplicated global metadata rules |
| `content` | typed content records, claims status, route copy, article bodies | direct DOM or integration calls |
| `components` | reusable accessible primitives and sections | route-specific API credentials |
| `features` | bounded commercial capabilities such as pricing or contact form | global animation loop |
| `integrations` | adapters for Calendly, contact transport, consent, analytics, maps | visual layout ownership |
| `motion` | shared motion policies, GSAP orchestration, reduced-motion handling | content or integration state |
| `seo` | metadata, schema, canonical, breadcrumbs, sitemap and robots generation | visual effects |
| `styles` | tokens, Tailwind setup, narrowly scoped global styles | legacy stylesheet import |
| `test` | fixtures, route manifests, mocks and helpers | production credentials |

### 3.3 Dependency direction

`content/types → components → features/routes → app`

Cross-cutting adapters (`seo`, `motion`, `integrations`) may be consumed by routes/features but may not import route implementations. Circular imports fail the build.

## 4. Content architecture

All public routes are represented in a typed route registry. Each record includes:

```ts
type RouteRecord = {
  id: string
  path: string
  routeGroup: "main" | "legal" | "service" | "blog"
  canonical: string
  sourceFile: string
  status: "retained" | "rewrite-approved" | "decision-pending"
  title: string
  description: string
  h1: string
  indexable: boolean
  breadcrumbs: BreadcrumbItem[]
  schema: SchemaDescriptor[]
  contentId: string
  claimIds: string[]
  relatedRouteIds: string[]
  migrationOwner: string
}
```

Content is separated from presentation:

- `content/site/`: global navigation, footer, organisation details, CTAs;
- `content/pages/`: home, about, services, pricing, book, contact, privacy;
- `content/services/`: nine service/industry records;
- `content/blog/`: 33 article records;
- `content/claims/`: claim ledger with evidence status;
- `content/taxonomy/`: clusters, intents, service relationships and related-content rules.

Unsupported quantified or absolute claims are not copied forward unchanged. Each claim must be `approved`, `qualified`, `removed`, or `evidence-pending`.

## 5. Routing model

The binding first-release baseline is 50 canonical routes:

- 8 main/legal routes;
- 9 service routes;
- 33 blog routes.

`/services/gyms-fitness-studios` remains canonical unless a fresh crawl and owner-approved decision establish otherwise. `/services/gyms` is treated as an unverified alias until resolved.

Historical `.html` and other redirect sources remain edge-hosting concerns and are tested independently of the React router. No redirect is added, removed or changed by D-02 implementation without an approved redirect diff.

Unknown routes must return a genuine 404 response in deployment-equivalent staging, not a `200` shell.

## 6. Styling and component system

- Tailwind owns tokens, layout utilities and responsive composition.
- shadcn/ui supplies copied, reviewable primitives; imported primitives are adapted to Silverstone tokens and accessibility requirements.
- Global CSS is limited to reset/base rules, tokens, typography, focus treatment, third-party containment and effects that cannot be expressed cleanly as utilities.
- Legacy CSS is not imported wholesale.
- Components must support keyboard operation, visible focus, semantic landmarks and zoom/reflow.
- Visual variants are encoded as typed component variants, not route-specific selector chains.

## 7. Animation architecture

- Framer Motion owns local component state transitions, entry/exit, layout transitions and small interaction feedback.
- GSAP owns scroll-linked timelines, coordinated multi-element sequences and any effect requiring explicit timeline control.
- Custom shader/WebGL code is isolated behind a lazy adapter and never controls essential content.
- CSS owns simple hover/focus/opacity transforms where JavaScript is unnecessary.
- One effect has one owner. GSAP and Framer Motion may not animate the same property on the same element.
- Native scrolling remains authoritative. No scroll hijacking, virtual scroll or forced scroll smoothing.
- Reduced motion disables non-essential translation, parallax, shader motion, autoplay and scroll-linked timelines while preserving content order and understanding.

## 8. Integration architecture

Every external dependency is accessed through an adapter with:

- environment-aware configuration;
- runtime schema validation;
- explicit timeout and failure behaviour;
- accessible fallback UI;
- test double;
- no direct provider call from generic components.

Required adapters:

| Adapter | Production contract | Staging rule |
|---|---|---|
| contact | compatible `/.netlify/functions/send-email` outcome | use mock/sandbox endpoint; production recipient and API key prohibited |
| Calendly | approved 30-minute event and `/contact` fallback | placeholder or authorised test event; no production booking |
| analytics | owner-approved measurement with consent | disabled by default or staging-only property; never production property |
| consent | policy-aligned script gating | observable network tests before/after consent |
| map | business location and direct fallback | no sensitive key; lazy load |
| IndexNow | approved canonical submission behaviour | disabled |
| monitoring | single owner per script | staging project only; no production DSN unless explicitly authorised |

## 9. Environment model

| Environment | Branch | Indexing | Email | Booking | Analytics | Authority |
|---|---|---|---|---|---|---|
| local | feature/worktree | blocked | mock | mock | off | developer |
| CI | PR commit | blocked | mock | mock | off | automated |
| Replit preview | visual branch | blocked | mock | placeholder/test | off/staging only | temporary |
| integration staging | `transformation/staging` | blocked at header and meta levels | sandbox/sink | test or disabled | staging property only | release candidate |
| production | `main` | current policy | production | production | production | separate release approval |

Staging requires both `X-Robots-Tag: noindex, nofollow, noarchive` and page-level `robots` metadata. It must not be discoverable through the production sitemap.

## 10. Observability and failure boundaries

- Route-level error boundary preserves shell navigation.
- Integration failure never removes primary explanatory copy or fallback CTAs.
- Shader failure falls back to a static branded visual.
- Analytics failure is silent to the user and cannot block interaction.
- Contact failure presents an accessible status and alternate contact path.
- Build emits a machine-readable route report, asset report and bundle report.

## 11. Architecture invariants

The following are release-blocking:

1. any write outside `/web` without an approved architecture change;
2. any production credential in code, logs, screenshots, fixtures or staging configuration;
3. any indexable route without initial HTML;
4. any canonical route omitted from the route registry;
5. any integration imported directly into a presentational component;
6. any overlapping animation ownership;
7. any staging path capable of sending production email;
8. any Codex/Replit overlapping file edit window;
9. any failure to preserve the legacy root rollback baseline.

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

