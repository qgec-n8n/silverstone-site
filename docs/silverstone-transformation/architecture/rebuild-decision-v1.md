# Silverstone rebuild decision v1

Silverstone should be rebuilt as a new React/Vite application in parallel with the existing production site, not incrementally converted in place.

**Document status:** Architecture decision record  
**Date:** 22 June 2026  
**Repository destination:** `/docs/silverstone-transformation/architecture/rebuild-decision-v1.md`  
**Immediate consumer:** **D-01**  
**Production boundary:** Production Netlify remains unchanged by this decision and by this task.

## 1. Decision

**Decision:** Build a new React/Vite application on an isolated transformation branch or worktree, using the existing site as the behavioural, content, route, SEO and integration baseline. Do not evolve the production-facing vanilla HTML/CSS/JavaScript implementation into React route by route.

This is an **implementation rebuild and controlled replatform**, not a greenfield replacement of Silverstone’s public presence. Existing canonical URLs, approved content, brand assets, observable visual behaviours and integration outcomes remain migration inputs. The new application must earn cutover through parity and acceptance evidence; production remains untouched until a separately approved release process.

**Decision boundary:** This record selects the rebuild strategy. It does not authorise implementation, repository mutation, deployment, DNS changes, Netlify changes, environment-variable changes, form submissions, email sends or Calendly bookings.

## 2. Decision status and confidence

| Field | Value |
|---|---|
| Decision status | **Recommended for owner approval** |
| Confidence | **High** |
| Chosen option | Parallel React/Vite rebuild |
| Rejected option | Incremental in-place conversion of the vanilla site |
| Immediate consumer | **D-01** |
| Required technology constraint | React, Vite, GSAP, Framer Motion, Tailwind CSS and shadcn/ui |
| Hosting constraint | Production Netlify unchanged until an independently approved cutover |
| Staging constraint | Replit is a staging and future-editing surface, not the production source of truth or sole release gate |

**Evidence:** A-01 establishes a 50-route static HTML estate with duplicated templates, generated monolithic CSS/JavaScript, no Vite application, and a separately built React pricing island. It also identifies build drift, duplicated runtime ownership and cross-cutting defects. [A01-AUDIT §§Architecture and build system; Route inventory; Assets; Integrations]

**Inference:** Introducing React, Vite, Tailwind, shadcn/ui, GSAP and Framer Motion into the existing implementation incrementally would create a prolonged dual architecture: vanilla templates plus React components, source CSS plus Tailwind, current animation runtimes plus two new animation libraries, and a standalone React island plus an application runtime.

**Decision:** The cleaner and lower-lifetime-risk path is a parallel rebuild whose outputs are compared against the audited route, SEO, content, integration and visual contracts before release.

Confidence is not “absolute” because authenticated Netlify, Resend, Calendly, analytics, Search Console and environment settings were not available, and A-01/A-02 contain one route-naming discrepancy that requires a fresh route/redirect crawl before implementation acceptance.

## 3. Repository evidence

### 3.1 Current implementation shape

**Evidence:**

- The repository contains **50 indexable HTML documents**: seven main pages, one legal page, nine service/industry pages and 33 blog articles. [A01-MANIFEST; A01-AUDIT §Executive findings]
- Shared markup is repeated across those documents, with structural similarity reaching `0.9992` for a blog-template pair and `0.9974` for a service-template pair. [A01-AUDIT §Duplicate-pattern analysis]
- The project is a static HTML site with 23 source CSS files compiled into one generated stylesheet and 15 source JavaScript files compiled into one generated bundle. [A01-AUDIT §Architecture and build system]
- A separate React 18/Rollup pricing island is built independently and copied into the public asset tree; the repository is not currently a Vite application and has no application-level route runtime. [A01-AUDIT §Architecture and build system]
- Public assets total 1,615 files and more than 700 MB in the repository, including 1,227 generated image derivatives, 155 unresolved unreferenced files and a non-deterministic image pipeline with basename collision risk. [A01-MANIFEST; A01-AUDIT §Assets, fonts, images, shaders, and animation]
- Production/repository parity is sufficiently high to use the repository as a migration baseline: A-01 found 49 healthy canonical pages equal to repository HTML after normalising Netlify runtime monitoring. [A01-DIFF §Canonical parity]
- Cross-cutting defects exist in shared concerns: consent/analytics ownership, mobile navigation semantics, missing landmarks and skip links, image dimensions, contact-form validation, monitoring duplication, sitemap drift and redirect governance. [A01-AUDIT §§Integrations; SEO; UI, accessibility, responsive behavior, and performance]

### 3.2 Architectural implication

**Inference:** The existing site has valuable content and route equity but little architectural value in preserving 50 duplicated HTML documents as the long-term authoring model. Nearly every route would need intervention to adopt the required React/Vite/Tailwind/shadcn stack and to correct shared accessibility, SEO and integration ownership.

**Inference:** A clean application boundary allows shared concerns to be governed once. Incremental conversion would preserve old ownership while introducing new ownership, making the transition state harder to reason about than either the current or target state.

**Decision:** Reuse audited public contracts and approved assets; do not reuse the duplicated page-document architecture as the target foundation.

## 4. Live-site and commercial evidence

**Evidence:**

- The current site has a coherent acquisition path from industry/service education to pricing or a free 30-minute audit, with contact as the fallback. [A02-CONVERSION §Conversion paths]
- The booking page is a positive contract: it explains the call, reduces pressure and retains a contact fallback. [A02-CONVERSION §§Conversion paths; Route-by-route conversion matrix]
- The site has enough route breadth to support an industry-led acquisition strategy, but the parent proposition is broad and the proof hierarchy is weak. [A02-CONVERSION §§Scope and method; Positioning and first-screen comprehension]
- Exact outcome figures appear across the home page and all nine industry pages without visible claim-level attribution. [A02-CLAIMS §§Executive finding; Current high-risk claim surfaces]
- The about and commercial surfaces provide limited verifiable accountability, case evidence and independent proof for a high-consideration technical service. [A02-CONVERSION §Proof, trust and risk reversal]
- The blog and industry estate is commercially useful but has repetitive templates, uneven internal-link support, weak buying-stage navigation and unresolved search-intent overlap. [A02-CONVERSION §Copy density and decision support; A02-SEO §§Navigation and internal links; Topic clusters]
- Essential pricing, proof and CTA content should be available in the initial document rather than depend on client execution or animation. [A02-SEO §Rendering and client-side dependencies; A02-A11Y §Client-rendered counters and pricing]

**Inference:** Commercially, the correct transformation is not to discard the site’s market coverage. It is to preserve route equity and strong conversion intent while rebuilding the presentation, proof governance and shared decision architecture.

**Decision:** The rebuild must be route- and contract-preserving, but it may rewrite commercial copy where A-01/A-02 classify claims, hierarchy or trust evidence as unsafe or inadequate.

## 5. Alternatives considered

| Alternative | Assessment | Decision |
|---|---|---|
| **A. New React/Vite application built in parallel** | Creates one target architecture; protects production; supports governed routes/content/components; permits parity testing before cutover; cleanly incorporates the required stack. | **Selected** |
| **B. Incremental in-place conversion of existing pages** | Reduces the size of each early change but creates a long-lived hybrid of duplicated HTML, vanilla runtimes, React islands, Tailwind/shadcn and multiple animation systems. | **Rejected** |
| **C. Preserve static HTML and add only selected React islands** | Lowest immediate disruption, but does not satisfy the required full React/Vite transformation and leaves duplicated templates, build drift and shared-governance defects substantially intact. | **Rejected** |
| **D. Full greenfield redesign with new routes and content** | Maximises creative freedom but unnecessarily risks 50 canonical URLs, metadata, internal links, redirect history, article equity and established integration behaviour. | **Rejected** |
| **E. Immediate production replacement** | Conflicts with the production-safety constraint and lacks authenticated integration, analytics and hosting evidence. | **Rejected** |

**Evidence:** B-01 assigns architecture to ChatGPT-led decision work, repository implementation to Codex, and Replit to selective visual/staging work; it also requires a dedicated branch/preview release candidate and warns that Replit Preview does not prove published parity. [B01-FINDINGS §§Executive finding; Staging and production behaviour; B01-ALLOCATION rows “architecture” and “staging”]

## 6. Why the rejected option was rejected

The rejected option is **incremental in-place conversion**.

**Evidence:** The current estate already contains two implementation worlds: a static multi-document site and a separately built React pricing island. It also has generated CSS/JavaScript ownership, route-level duplicated markup and multiple page-wide visual runtimes. [A01-AUDIT §§Architecture and build system; Duplicate-pattern analysis; Parallax and shader contract]

**Inference:** Incrementally adding the required target stack would introduce the following transition costs:

1. **Dual component ownership:** old document templates and new React components would coexist.
2. **Dual styling ownership:** existing source CSS and generated CSS would coexist with Tailwind and shadcn/ui conventions.
3. **Competing animation ownership:** current parallax, shader, reveal and statistic runtimes would coexist with GSAP and Framer Motion unless deliberately replaced.
4. **Fragmented routing and SEO:** some routes would be authored as HTML documents and others through the application route model.
5. **Repeated regression exposure:** shared header, footer, consent, schema, breadcrumbs, metadata and navigation would be migrated multiple times or maintained in parallel.
6. **Longer production coupling:** the transformation would repeatedly touch the same production-oriented files instead of developing behind an isolated boundary.
7. **Unclear deletion point:** generated bundles, duplicated templates and the pricing island could not be retired until the last route moved, extending maintenance debt.

**Decision:** These costs outweigh the smaller apparent size of individual incremental changes. Migration and validation may occur in controlled route groups, but the **target implementation must be one new application**, not a sequence of permanent hybrid states.

## 7. Retain/refactor/rewrite/discard matrix

“Discard” means eligible for exclusion only after replacement behaviour and ownership are proven. It is not deletion authority.

| Surface | Retain | Refactor | Rewrite | Discard only after proof |
|---|---|---|---|---|
| Public URLs | All approved canonical paths and legitimate legacy entry points | Centralise route ownership in one governed route model | Broken, duplicated or self-referential redirect rules | No canonical URL by default; only owner-approved consolidations |
| Page content | Differentiated article substance, approved service intent, booking reassurance, contact intent | Move approved content into governed templates/content records | Unsupported claims, repetitive home H1, weak trust/proof copy, qualified pricing language | Superseded duplicate copy after editorial approval |
| Shared shell | Current information architecture and required navigation destinations | Recompose header, footer, navigation, breadcrumbs and layout as accessible React components | Mobile-menu semantics, skip-link/main-landmark absence, stale footer ownership | Duplicated HTML shells |
| Styling | Approved visual identity, typography intent and responsive outcomes | Express through Tailwind tokens, shadcn/ui primitives and governed custom styles | Conflicting or inaccessible interaction states | Obsolete generated stylesheet after parity |
| Motion and graphics | Observable desktop/mobile parallax, shader intent and reduced-motion behaviour | Give GSAP, Framer Motion and custom shader code explicit, non-overlapping ownership | Any effect whose implementation cannot meet accessibility/performance gates | Replaced vanilla motion runtimes after regression proof |
| Pricing | Package intent, controls, CTAs and commercial structure | Integrate pricing into the application and route/content model | Initial-document availability, evidence qualification and accessibility | Standalone pricing-widget build and copied bundles |
| Contact/Resend | Business outcome, visible field intent, public form route and compatible submission endpoint | Preserve compatibility while moving UI into the application | Server validation, abuse controls, error exposure, status semantics and supported Resend parameter use | Redundant browser-only validation and obsolete payload fields |
| Calendly | Event URL, inline-booking outcome, embed settings currently visible and `/contact` fallback | Rebuild the wrapper with reserved space, accessible fallback and controlled loading | Only if owner-verified account settings require a contract change | Old wrapper after behavioural parity |
| Analytics/consent | Measurement continuity where owner-approved | Centralise third-party ownership and loading rules | Consent gating and policy alignment | Duplicate/stale monitoring ownership |
| SEO metadata/schema | Unique route-level titles, descriptions, canonicals and useful structured content | Generate metadata, visible breadcrumbs, JSON-LD and sitemap from shared route/content truth | Invalid, mismatched or unsupported structured claims | Stale generated sitemap and duplicate metadata ownership |
| Assets | Approved source images, logos, fonts and brand media | Create deterministic source ownership and responsive derivatives | Collision-prone image naming/build rules | Redundant generated derivatives, duplicates and vendor copies after owner review |
| Hosting rules | Production behaviour until cutover and legitimate redirect history | Define future build/output/header ownership for the target app | Defective redirects, duplicate monitoring and unsafe cache/header configuration | Obsolete build rules only after deployment-equivalent validation |
| Blog architecture | Approved articles and their current URLs pending SEO decisions | Govern clusters, cards, internal links and article templates centrally | High-risk examples and overlapping copy where consolidation is approved | Consolidated article implementation only after redirect and content approval |
| Unreferenced assets | Preserve pending ownership review | Classify by source, generated output, archive or active use | Not applicable | Only items explicitly approved as redundant |

**Evidence base:** [A01-AUDIT §Disposition summary; A01-ROUTES; A01-ASSETS; A02-PRIORITIES; A02-CLAIMS; A02-A11Y]

## 8. Integration-preservation requirements

### 8.1 Resend/contact

**Retain:**

- `/contact` as the public contact route.
- Visible field intent: name, email and message.
- Honeypot/abuse-prevention intent.
- A compatible submission contract at `/.netlify/functions/send-email`, unless a separately approved compatibility redirect or adapter is documented.
- Sender, recipient and reply-to business semantics after environment-owner verification.
- Noindex behaviour for the function endpoint where applicable.

**Rewrite before release:**

- Server-side schema and content validation.
- Email syntax and length limits.
- Content-type, origin and abuse/rate controls appropriate to the chosen hosting boundary.
- Error handling so provider/internal details are not returned to the browser.
- Accessible pending, success and failure states.
- Resend parameter usage against the supported contract.
- Delivery tests in a non-production or explicitly authorised environment.

[A01-AUDIT §Contact form and Resend; A01-DIFF §Contact form]

### 8.2 Calendly

**Retain:**

- `https://calendly.com/silverstone-ai/30min`.
- Inline booking outcome.
- Existing visible embed customisation unless owner-approved otherwise.
- `/contact` fallback.
- Booking-page reassurance and no-pressure explanation.

**Validate before release:**

- Embed loading, dimensions, keyboard path and fallback.
- Account slug/event slug.
- Provider-side availability, buffers, notifications, timezone and calendar ownership through authorised access.

[A01-AUDIT §Calendly; A01-DIFF §Calendly; A02-CONVERSION §Conversion paths]

### 8.3 Analytics, monitoring, map, pricing and IndexNow

- Preserve measurement continuity only after consent behaviour and policy wording are aligned.
- One system must own each monitoring script; no committed-plus-host-injected duplication.
- Preserve the map’s business purpose with an accessible title and direct location fallback.
- Preserve pricing information even when JavaScript fails; interaction is enhancement.
- Preserve IndexNow intent and canonical submission behaviour, but generate submitted URLs from the approved route source of truth.
- Do not copy deploy tokens, secrets or environment values into the application or this decision record.

[A01-AUDIT §§Analytics and consent; Other contracts; A01-DIFF §Known difference matrix; A02-A11Y §§Map and embedded content; Third-party scripts and embeds]

### 8.4 Environment and staging boundary

- Production Netlify configuration, DNS and environment variables remain unchanged in this task.
- Replit may host development/staging and future editing, but Git remains the source of truth.
- Replit Preview cannot be the sole evidence of production parity.
- Codex and Replit Agent must not edit the same branch concurrently.
- D-01 must define an authorised integration test environment before any end-to-end email or booking validation.

[B01-FINDINGS §§Repository-native execution; Staging and production behaviour; B01-LIMITATIONS §§Preview and staging; Transformation-specific guardrails]

## 9. SEO and route-preservation requirements

1. Treat A-01’s **50 canonical URLs** and the SEO/redirect CSVs as the binding migration baseline until a later owner-approved content decision changes them.
2. Preserve each retained canonical path exactly at first release.
3. Preserve `.html`, historical niche/service and article redirect sources from the audited redirect register; redirects remain an edge/hosting concern independent of the client router.
4. Require one terminal success response for every retained canonical and no self-redirect, loop or unexplained chain.
5. Produce meaningful initial HTML for every indexable route. The target must not rely on a client-only SPA shell for core copy, pricing, headings, canonical tags, metadata, links or structured content.
6. Preserve or deliberately improve each route’s unique title, meta description, canonical and single descriptive H1.
7. Generate visible breadcrumbs and BreadcrumbList data from the same route hierarchy.
8. Generate the sitemap from the approved canonical source of truth and use meaningful modification dates.
9. Preserve crawlable internal links and assign every retained article a cluster, intent owner and contextual inlink role.
10. Keep content consolidation separate from the rebuild decision. The trades lead-capture overlap group remains unresolved until an SEO/content owner approves consolidation or differentiation.
11. Re-run the complete canonical and redirect inventory at the implementation baseline and before release.
12. Resolve the route-register discrepancy: A-01 identifies `/services/gyms-fitness-studios` as canonical, while A-02 source registers use `/services/gyms`. Until a fresh crawl proves the relationship, A-01 remains the repository authority and `/services/gyms` must be treated as an unverified alias or audit-label discrepancy, not a replacement canonical.

[A01-MANIFEST; A01-AUDIT §SEO, indexability, redirects, schema, and internal links; A01-SEO; A02-SEO §§Indexation and route integrity; Redirect, canonical and release acceptance criteria; A02-RECONCILIATION §Material differences since A-01]

## 10. Principal risks and mitigations

| Risk | Why it matters | Mitigation required before approval to cut over |
|---|---|---|
| SEO loss from a rebuild | Fifty canonical routes, redirect history and article equity are exposed at once | Route manifest, static/initial HTML, metadata diff, one-hop redirect tests, sitemap parity and crawl acceptance |
| Big-bang visual regression | Parallax, shader, mobile stage behaviour and responsive layout are migration contracts | Route-group visual baselines, desktop/mobile screenshots, reduced-motion checks and explicit acceptance evidence |
| Dual-stack drift during transition | Old production and new staging can diverge | Production freeze boundary, one Git source of truth, isolated branch/worktree and dated parity snapshots |
| Integration breakage | Resend and Calendly provider settings were not authenticated | Contract inventory, authorised staging tests, compatibility endpoint, fallbacks and owner sign-off |
| Rebuild scope becoming redesign scope | Combining architecture, content, proof and visual change can obscure regressions | Separate parity requirements from approved improvements; every deliberate deviation recorded |
| SEO/content consolidation hidden inside migration | Overlapping articles could be removed without sufficient evidence | No deletion or redirect without named intent owner and approved content decision |
| Asset loss or bloat | 155 unreferenced items are unresolved; image generation is non-deterministic | Owner-reviewed asset register, canonical source IDs, collision-safe derivatives and clean-build comparison |
| Animation performance and accessibility | GSAP, Framer Motion, shader and parallax can duplicate work or block content | Explicit library ownership, reduced-motion parity, no content dependency on animation, mobile/performance budgets |
| Styling-system conflict | Tailwind/shadcn may coexist poorly with legacy CSS if copied wholesale | Token mapping, bounded compatibility layer and planned retirement of legacy styles after parity |
| Client-only commercial content | Pricing/proof may be incomplete when scripts fail | Essential copy and CTAs in initial HTML; interaction only enhances |
| Consent/privacy inconsistency | Current policy and load order conflict | Coordinated consent implementation and policy approval; network test before and after choice |
| Staging false confidence | Replit Preview can differ from published/deployment behaviour | Clean-build preview deployment plus Netlify-equivalent route, header, cache and integration tests |
| Agent/platform merge conflict | Codex and Replit can reason from stale concurrent states | One branch owner at a time; worktrees for independent tasks; reviewed integration |
| Unsupported claims survive migration | Replatforming can make risky claims look more authoritative | Claim ledger; freeze unsupported exact numbers; editorial approval gate |

[A01-AUDIT; A01-DIFF; A02-PRIORITIES; A02-A11Y; B01-LIMITATIONS; B01-ALLOCATION]

## 11. Access limitations

1. No authenticated Netlify dashboard, DNS, environment-variable, analytics, Search Console, Resend or Calendly control plane was accessed. [A01-MANIFEST §Limitations and blockers]
2. No contact form POST was submitted, no production email was sent and no Calendly booking was created. [A01-AUDIT §§Contact form and Resend; Calendly]
3. A-01 was pinned to repository SHA `1e445c305c30cae93d5f6427135a238be8d58c14`; its original local audit could not authenticate a fresh remote fetch. The branch contents reviewed for this decision are available through the connected GitHub repository, but the production control plane remains a separate authority. [A01-MANIFEST; A01-AUDIT §Repository and Git baseline]
4. A-02 is a read-only public-site audit, not a traffic, ranking, conversion-rate, accessibility-conformance, penetration-test or Core Web Vitals field study. [A02-MANIFEST §Limitations]
5. Replit Preview is not evidence of final production equivalence. [B01-FINDINGS §Staging and production behaviour]
6. Provider-side settings, secrets and delivery behaviour remain assumptions until authorised validation.
7. A-01 and A-02 disagree on the gyms route label. This record does not guess which alternate path currently redirects; it requires a fresh route and redirect crawl before D-01 fixes the route model.
8. The live route that A-01 found in a self-redirect loop was later observed by A-02 as loading with a legacy shell. This confirms that production routing can change independently and must be revalidated at implementation start and release. [A02-RECONCILIATION §§Former redirect loop now resolves; Resolved route still uses a legacy page shell]

## 12. Conditions that would reopen the decision

Reopen the rebuild-versus-conversion decision only if one or more of the following is established with new evidence:

1. The required stack changes materially and a full React/Vite application is no longer required.
2. A repository prototype proves that a bounded incremental conversion can eliminate duplicated templates, legacy CSS/JS ownership, the separate pricing build and route-level SEO duplication without a prolonged hybrid state.
3. A target hosting constraint prevents safe initial HTML generation or exact route preservation from the proposed React/Vite application.
4. Authenticated Netlify or integration evidence reveals a production-only dependency that cannot be preserved through a parallel application.
5. The owner changes the objective from transformation to minimal maintenance.
6. The approved content strategy removes most current routes, materially reducing the migration estate before implementation begins.
7. D-01 demonstrates, through a written feasibility review and parity harness, that the selected rebuild creates materially greater SEO, integration or operational risk than a bounded alternative.
8. A fresh canonical/redirect crawl shows that A-01’s route baseline is no longer a reliable starting point and the live estate requires a new authoritative inventory.

A preference for smaller commits, phased migration work or route-group validation does **not** reopen the decision. Those are delivery controls compatible with a parallel rebuild.

## 13. Source artifact register

### Prompt A-01 — authoritative repository/live baseline

| ID | Artifact | Use in this decision |
|---|---|---|
| A01-MANIFEST | `/docs/silverstone-transformation/audits/MANIFEST.md` | Audit authority, counts, hashes, validation, production boundary and limitations |
| A01-AUDIT | `/docs/silverstone-transformation/audits/repository-live-audit-v1.md` | Primary repository, architecture, integration, SEO, content, visual and disposition evidence |
| A01-ROUTES | `/docs/silverstone-transformation/audits/route-inventory-v1.csv` | Binding row-level canonical, metadata, implementation and content baseline |
| A01-ASSETS | `/docs/silverstone-transformation/audits/asset-integration-inventory-v1.csv` | Binding row-level asset and integration baseline |
| A01-DIFF | `/docs/silverstone-transformation/audits/repo-live-diff-v1.md` | Repository/live parity, Netlify injection, sitemap, redirect and runtime differences |
| A01-SEO | `/docs/silverstone-transformation/audits/seo-redirect-baseline-v1.csv` | Binding canonical and legacy redirect register |
| A01-EVIDENCE | `/docs/silverstone-transformation/audits/evidence/` | Machine-readable scans, build comparisons, logs and screenshots indexed by A01-MANIFEST |

### Prompt A-02 — independent external live advisory package

| ID | Artifact | Use in this decision |
|---|---|---|
| A02-MANIFEST | `/docs/silverstone-transformation/audits/external-live-audit/MANIFEST.md` | Package authority, scope, validation and limitations |
| A02-CONVERSION | `live-conversion-audit-v1.md` | Commercial hierarchy, conversion paths, trust and route roles |
| A02-CLAIMS | `live-content-and-claims-audit-v1.md` | Claim governance, overlap, content retention and rewrite requirements |
| A02-SEO | `live-technical-seo-audit-v1.md` | Canonical, internal-link, initial-HTML, schema, sitemap and release requirements |
| A02-A11Y | `live-accessibility-performance-risk-audit-v1.md` | Shared accessibility, motion, asset, embed and performance requirements |
| A02-RECONCILIATION | `repo-live-reconciliation-v1.md` | Current-live differences from A-01 and downstream handoff |
| A02-PRIORITIES | `priority-findings-v1.csv` | Prioritised P0/P1/P2 and retain findings |

All A-02 files are under `/docs/silverstone-transformation/audits/external-live-audit/`.

### Prompt B-01 — platform and model routing research

| ID | Artifact | Use in this decision |
|---|---|---|
| B01-MANIFEST | `/docs/silverstone-transformation/research/platforms/MANIFEST.md` | Package purpose, consumers and boundaries |
| B01-FINDINGS | `official-platform-findings-v1.md` | Three-layer workflow, Git source of truth and staging limitations |
| B01-ROUTING | `model-effort-routing-v1.md` | Architecture/repository/visual role separation and escalation controls |
| B01-ALLOCATION | `workstream-allocation-v1.csv` | Architecture, coding, refactoring, staging and QA allocation |
| B01-USAGE | `usage-efficiency-guidance-v1.md` | Separate decisions from editing; constrain branches, context and Replit usage |
| B01-LIMITATIONS | `capability-limitations-v1.md` | Replit Preview, worktree, concurrency and production-approval guardrails |

All B-01 files are under `/docs/silverstone-transformation/research/platforms/`.

### Additional direct live clarification

A direct read-only retrieval on 22 June 2026 confirmed that `/services/gyms-fitness-studios` served the gyms page. The A-02 register’s `/services/gyms` label was not independently confirmed as a canonical or redirect during this task. This clarification does not replace the required fresh full route/redirect crawl.

## 14. Approval block

| Approval field | Entry |
|---|---|
| Decision | Parallel React/Vite rebuild; no incremental in-place conversion |
| Decision owner | Quentin Geczy / Silverstone AI |
| Status | Awaiting owner approval |
| Immediate consumer after approval | **D-01** |
| Intended repository path | `/docs/silverstone-transformation/architecture/rebuild-decision-v1.md` |
| Production change authorised | **No** |
| Implementation authorised | **No** |
| Approval name |  |
| Approval date |  |
| Approval notes |  |

### Validation record

- **PASS — Decision precedes architecture implications:** the rebuild decision is the first sentence and is stated before alternatives or delivery implications.
- **PASS — Traceability:** every material conclusion is tied to A-01, A-02, B-01 or the explicitly identified direct live clarification.
- **PASS — Production safety:** no production, Netlify, DNS, environment, analytics, integration or repository change was made or authorised.
- **PASS — No implementation code:** this record contains decision requirements only.
- **PASS — Exact filename:** `rebuild-decision-v1.md`.
- **PASS — Exact repository destination:** `/docs/silverstone-transformation/architecture/rebuild-decision-v1.md`.
- **PASS — Required sections:** all fourteen requested sections are present.
- **PASS — Consumer:** D-01 is identified as the immediate consumer.
- **PASS — Contradiction review:** the rebuild is distinguished from greenfield replacement; phased validation is distinguished from incremental in-place conversion; A-01/A-02 route differences are exposed rather than silently reconciled.
