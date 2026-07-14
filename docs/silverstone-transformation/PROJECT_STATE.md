# Silverstone Project State

**Last updated:** 2026-07-14
**Current phase:** `/web` is the production React Router/Vite site; canonical prerendering, Netlify hostname routing, sitemap generation, URL-variant rejection, and service schema/H1 alignment were verified locally.
**Branch:** `main`.
**Remote:** `origin https://github.com/qgec-n8n/silverstone-site.git`.  
**Worktree at 2026-07-14 task start:** clean.

## Current Architecture

- Legacy root application remains operational and frozen as migration evidence.
- Active rebuild target is `/web`, a React Router/Vite app with TypeScript, React 19, Tailwind CSS 4, shadcn/ui configuration, GSAP for exceptional choreography, Motion 12.40.0 as the primary React animation platform, Three/WebGL/shader assets, local integration icons, route manifests, generated migrated content, tests, and staging-safety scripts.
- Production Netlify builds with `npm --prefix web ci && npm --prefix web run build:production` and publishes `web/build/client`.
- Ignored local generated residue exists on disk: `web/node_modules/`, `web/build/`, `web/.react-router/`, `web/test-results/`, and several `.DS_Store`/log files. None are tracked and none are staged.

## 2026-07-14 Production Routing, Sitemap, And Service Schema Pass

- Reduced `netlify.toml` to the single permanent `www` → apex hostname redirect, disabled Pretty URLs, removed every legacy/alias redirect and the catch-all SPA rewrite, and retained only the canonical slashless CSP header target.
- Added a narrowly matched Netlify edge guard that returns `404` for non-root trailing-slash, repeated-slash, and `.html` variants without invoking on canonical routes or normal static assets.
- Made the React Router prerender list derive from the approved route overrides/additions plus published blog records; duplicate prompt, industry, and hub aliases are no longer prerendered or resolved by application route data.
- Removed the generic SPA fallback from production output and hardened sitemap generation against wrong-host, query, fragment, trailing-slash, and `.html` URLs.
- Regenerated the approved services manifest from its Markdown sources after aligning AI Voice Agents and AI Receptionists H1 values with rendered `copy.ts` wording; built JSON-LD `Service.name` now matches the visible H1 for all seven service routes.
- Fresh production build emitted 46 self-canonical sitemap URLs: 7 service details, 9 industry details, 21 articles, and the approved hubs/core pages. Every sitemap URL mapped to a direct local `200`; removed aliases and unknown paths returned `404` in the production-routing simulation.

## 2026-07-14 Blog Slug Canonicalisation Pass

- Replaced all 21 published article slugs with unique, descriptive 3–5-word
  canonicals measuring 21–36 characters.
- Updated every active internal article URL and renamed every matching blog hero
  asset; no retired slug remains in the application source or asset filenames.
- Added unit policy coverage for slug shape, word count, character count,
  repeated tokens, uniqueness, and slug-matched hero assets, plus production
  preview coverage for direct `200` article and asset responses.
- Added no blog aliases or redirects. Retired and unknown article paths remain
  absent and return the hosting layer's genuine `404`.

## 2026-07-02 Industries-v2 Rebuild

- **Canonical industry routing moved to `/industry`** on owner instruction: hub at `/industry`, detail pages at `/industry/<slug>`; services remain at `/services` + `/services/<service>`. The temporary app aliases recorded during this pass were removed by the superseding 2026-07-14 production URL decision.

- Replaced the light-mode industry prototype (`INDUSTRY_DATA` registry, `IndustryPageVisuals`, `IndustryInstrument`, `DemoShell`, `ToolsCarousel`, `ServicesDecisionMatrix`, `IndustriesAtlas`, `visual-smoke` fixture and all `.ss-visual-root` prototype CSS) with `web/src/features/industries-v2/**`: a typed per-route content registry rewritten from the approved industries copy & SEO pack (2026-06-30), per-route art direction, nine bespoke lazy compositions with unique signature systems, and shared industry section components layered on the services-v2 foundation.
- `industry-page.tsx` now mirrors the ServicePage experience shell exactly (CoreSpin → Aether intro → expandable hero button → Particles body → reverse return); the Aether field gained an optional palette prop and the Industries family renders a violet palette with behaviour unchanged.
- `/services` and `/industry` hubs use bespoke discovery experiences (`web/src/features/hubs-v2/**`); migrated legacy copy no longer loads for hub or industry routes.
- Industry SEO metadata (titles, descriptions, H1s, primary intent) updated in `approvedRouteOverrides` from the pack; route-entry copy (CoreSpin/pill/title/subtitle/button) supplied per route from the industries content registry.
- Benchmark figures render from the approved register with exact values/units/time bases, attributed as verified Silverstone AI performance; `AnimatedMetricValue` now prerenders the true value (previously prerendered "0").
- New imagery: approved industry pairs staged into `web/public/approved-images/`; three ecommerce images generated via gpt-image-2 (the zip had none). Portrait ecommerce variants and a third physio image could not be generated — the OpenAI account hit its billing hard limit mid-session.

## 2026-06-30 Route Entry Experience Pass

- Generalized the protected homepage CoreSpin/Aether/button/body/reverse-X sequence into a route-entry framework for non-home `/web` routes.
- Added route-specific loader, pill, subtitle, and button copy through `web/src/data/route-experiences.ts`, with unit coverage requiring registry coverage for every governed `futureRouteManifest` path.
- Kept the homepage-only button label `Explore the system`; non-home routes use route-specific labels.
- Added narrow app-layer compatibility aliases for the prompt-named `/services/website-design-development` and `/services/ai-agents-automation`, while preserving governed canonicals `/services/web-design-development` and `/services/ai-automation` for metadata, internal links, sitemap sources, and route governance.
- Extracted selected exact-filename images from `/Users/quentingeczy/Downloads/Images-Approved.zip` into `web/public/approved-images/` and recorded active usage in `web/src/data/service-image-manifest.ts`.
- Converted the approved benchmark CSV at `attached_assets/silverstone_ai_agency_performance_metrics_23_6_2026_1782315909364.csv` into `web/src/data/generated/benchmark-metrics.json` and service metric selectors with a visible benchmark disclaimer.
- Added reserved, non-live demo placeholders for website preview, ElevenLabs call, AI chat, and illustrative transcript surfaces without credentials, live IDs, live calls, appointments, or fabricated outcomes.
- Added route-entry browser coverage for direct entry, loader replay, intro isolation, body reveal, reverse return, reload replay, client navigation replay, desktop/mobile representatives, and prompt alias resolution.

## 2026-06-30 Pre-Prompt-5 Homepage Recovery

- A pre-change checkpoint commit was created before repair: `54b7614e checkpoint: before homepage recovery repair`.
- The `/web` homepage is restored to the explicit two-state application model: `loading`, `intro`, `opening`, `body`, and `closing`.
- Intro state now visibly contains only the pill, approved title, approved subtitle, and the single `Explore the system` button. The white site header, footer, body content, booking CTA, capability chips, and body scroll are absent until `body`.
- The canonical shared-layout Explore transition is restored with one stable layout id, preload-aware body background readiness, rapid-click state guards, focus restoration, and a portal-mounted reverse X control that returns fully to intro.
- Aether Flow is the intro-only background: one full-screen canvas, one RAF loop, pointer-reactive displacement, cleanup on unmount, no prohibited hybrid grid/beam/column contamination, and two visible network colours only: default `#66E8F0`, proximity `#F3F7FF`.
- Body state uses the local `/vendor/particles.js` implementation with one stable body host/canvas, local script loading, lifecycle cleanup, hover-grab, click-push, bounce, retina support, and mobile density reduction.
- Motion is now applied across the homepage content system through shared reveal, section, card, metric, CTA, image, footer, hover/focus, transition, and reduced-motion families. Route reload and navigate-away/back replay return to the intro sequence.
- The approved benchmark metrics and Live Signal Benchmarks card are restored from repository history. The simplistic Silverstone System diagram remains removed.
- A separate premium generated bitmap visual for the Silverstone System was created at `web/public/home-v2/silverstone-system-visual.png` and integrated in a dedicated homepage section with intrinsic dimensions.
- prohibited hybrid background implementations/instructions were removed from the scoped repository surface; final searches for the prohibited terms returned no matches.
- Browser verification covered cold intro, opening, body, reverse X, reload replay, navigate-away/back replay, desktop, mobile, short viewport, reduced motion, footer, metrics, Particles readiness, marquee-only integration logos, and prohibited background absence.
- Validation passed from `/web`: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run staging:safety`, and `npm run test:e2e -- tests/e2e/homepage-interaction.spec.ts --project=desktop-chromium`.
- `/web npm run bundle:report` currently fails the foundation hard ceiling at `301.23 KB gzip`; this is documented as the remaining validation gap for a follow-up performance pass.

## Completed Work

- Repaired the active `/web` foundation verification baseline: full formatting backlog resolved, Vite hard bundle ceiling restored, local browser validation stabilized, and production-boundary checks rerun.
- Replaced direct `/web` `framer-motion` usage with the public `motion` package entry points, added a central typed Motion provider/token/variant/primitives layer under `web/src/motion/**`, and wrapped the React Router app root with `MotionConfig reducedMotion="user"` plus strict `LazyMotion` async `domMax` loading.
- Migrated active Motion-controlled components to lightweight `motion/react-m` element exports inside the strict `LazyMotion` subtree and kept `AnimatePresence`, `LayoutGroup`, `useReducedMotion`, and Motion types on `motion/react`.
- Added focused Motion provider tests covering immediate visible content, `motion/react-m` rendering, async `domMax` feature loading, and reduced-motion visibility.
- Implemented the premium global shell interaction pass: the header now uses Motion for dropdown presence, active navigation shared-layout indicators, button/menu press states, scroll-elevation state via motion values, compact hidden state, and mobile-menu overlay/panel exits with focus and body-scroll restoration.
- Replaced route and section reveal CSS timers with central Motion variants for route content entrances and in-view reveals while keeping essential content present in initial HTML.
- Added reusable premium system components under `web/src/components/premium/**`: page hero shell, section shell, conversion panel, service card, industry card, FAQ, integration presentation, and form feedback/live-region presentation.
- Added `usePageInView` under `web/src/motion/**` to expose page visibility state for pausing document-hidden ambient Motion work.
- Added focused tests for mobile-menu body-scroll/focus restoration, premium component semantics, FAQ ARIA disclosure, integration presentation, and form feedback live-region behaviour.
- Kept Motion+ excluded. No Motion+ package, private component, or API was installed or imported.
- Moved the homepage body `particles.js` runtime out of the Vite application bundle by serving the installed package from `/web/public/vendor/particles.js`; the homepage still uses the local package script and no CDN.
- Added a local Lucide SVG helper module for the icons actually used by the app and repointed runtime imports away from the full `lucide-react` package entry.
- Reduced homepage loader preloads to first-transition assets so the loader is no longer blocked by downstream body/media assets.
- Bounded Playwright to two workers and marked the heavy homepage interaction matrix serial, preserving assertions while removing preview-runner contention.
- Updated route parity coverage to assert the actual `h1` element for the animated homepage initial HTML contract.
- Inspected current Git state, remotes, ignored generated files, root legacy app, `/web`, package scripts, Netlify functions, route manifests, redirects, SEO assets, content packs, design/handoff records, and quality/audit records.
- Reconfirmed the approved strategic direction: parallel React/Vite rebuild under `/web`; legacy root untouched until a separately approved cutover.
- Created the authoritative operating docs required by this prompt.
- Updated root `AGENTS.md` to make `/web` isolation, production protection, route preservation, evidence-grounded content, validation, and state-file updates permanent.

## Commands That Passed Or Produced Evidence

- `git branch --show-current`: `main`.
- `git status --short --branch`: `## main...origin/main`, pre-existing `M .codex/config.toml`.
- `git remote -v`: origin GitHub remote present.
- `git status --short --ignored`: confirmed ignored generated residue and the pre-existing `.codex/config.toml` modification.
- `git ls-files web/node_modules web/build web/.react-router web/test-results`: no tracked files returned.
- `node` manifest inspections: `web/src/data/generated/future-route-manifest.json` contains 50 baseline routes; `web/src/data/generated/legacy-route-manifest.json` contains 50 canonical records and 83 redirect records.
- `sips` image inspections: confirmed dimensions for legacy logos, attached logo variants, `/web/public/brand` logos, and `/web/public/home-v2` imagery.
- `git diff --check -- AGENTS.md docs/silverstone-transformation/{PROJECT_STATE,ROUTE_MANIFEST,FUNCTIONAL_CONTRACT,ASSET_REUSE_MATRIX,QUALITY_BASELINE,REDIRECT_REQUIREMENTS,DECISION_LOG}.md`: passed with no whitespace errors.
- `npx prettier --check AGENTS.md docs/silverstone-transformation/{PROJECT_STATE,ROUTE_MANIFEST,FUNCTIONAL_CONTRACT,ASSET_REUSE_MATRIX,QUALITY_BASELINE,REDIRECT_REQUIREMENTS,DECISION_LOG}.md`: passed after formatting only the targeted documentation files.
- Route/document consistency check: passed with 50 future baseline routes, 50 legacy canonical records, 83 legacy redirect records, no missing baseline route cells, and no missing additive `/web` route cells.
- `/web npm install`: up to date, 0 vulnerabilities.
- `/web npm install motion@12.40.0`: added Motion 12.40.0, 0 vulnerabilities.
- `/web npm uninstall framer-motion`: removed the direct application dependency, 0 vulnerabilities.
- `/web npm ls motion framer-motion`: `motion@12.40.0` installed; `framer-motion@12.40.0` remains only as Motion's declared transitive dependency.
- `/web npm run format:check`: passed.
- `/web npm run lint`: passed.
- `/web npm run typecheck`: passed.
- `/web npm run test -- tests/unit/motion-provider.test.tsx`: passed, 1 file and 4 tests.
- `/web npm run test`: passed, 20 files and 54 tests.
- `/web npm run build`: passed and prerendered the governed staging route surface.
- `/web npm run bundle:report`: passed hard ceiling with `Foundation JavaScript: 298.67 KB gzip (target-miss)`.
- `/web npm run bundle:report`: passed hard ceiling after the shell pass with `Foundation JavaScript: 299.08 KB gzip (target-miss)`.
- `/web npm run migration:validate`: passed, 49 routes, 553 links, 35 assets, 90 schema records.
- `/web node scripts/migration/validate-route-parity.mjs`: passed, 50 canonical routes, 133 legacy URL dispositions, 49 sitemap routes.
- `/web node scripts/migration/validate-redirects.mjs`: passed, 82 active rules, no cycles, no duplicate sources.
- `/web node scripts/migration/generate-seo-artifacts.mjs --environment=staging --out=build/client`: passed, crawl blocked and sitemap omitted for staging.
- `/web npm run staging:safety`: passed.
- `/web npm run test:e2e`: passed, 44 tests and 10 expected skips.
- `/web npm run test:a11y`: passed, 2 tests.
- `/web` targeted browser inspection on preview `http://127.0.0.1:4173/about`: passed at 1440x900, 1024x768, 768x1024, 390x844, 390x620, and reduced-motion 390x620 with no horizontal overflow, one main landmark, visible header/footer, no console warnings/errors, desktop Services dropdown open/escape behaviour, mobile menu body-scroll lock/restoration, Escape close, and synthetic page-visibility hidden/restored attribute toggling.
- `/web` dev-server smoke on `http://127.0.0.1:5177`: passed for `/` and `/services/web-design-development` with `X-Robots-Tag`; browser smoke on `/services/web-design-development` found one main landmark, expected H1, and no console warnings/errors.
- Root `npm run seo:audit`: failed because `sitemap.xml` generated content is stale; root legacy files were left untouched under the frozen-root contract.

## Known Defects And Baseline Observations

- Legacy analytics loads before cookie consent while `privacy-policy.html` says non-essential cookies are set only after consent.
- Contact form server validation is presence-only; email syntax, content type, origin, rate limits, server-side honeypot, and safe provider-error handling remain rebuild requirements.
- Contact form status is not an `aria-live` region in the legacy root.
- Legacy images commonly lack intrinsic dimensions; A-01 recorded 206 image elements with no explicit width/height.
- Root route `/blog/ai-lead-capture-trades-uk-2026` is unresolved because historical audit found a self-redirect and later advisory evidence found the route loading with a legacy shell. Fresh crawl required.
- Unsupported quantified or absolute proof claims exist on the home and industry pages and require claim-ledger approval before reuse.
- Current `/web` app now passes full `npm run format:check`.
- Current `/web` app passes the bundle hard ceiling but still misses the 220 KB target: `299.08 KB gzip`.
- The Motion package currently declares `framer-motion` as a transitive dependency. No application code imports `framer-motion`; the remaining lockfile entry is package-manager-resolved transitive implementation detail for `motion@12.40.0`.
- A transient Vite dep re-optimization warning/hydration artifact is documented in Replit visual handoff notes.

## Decisions Made In This Pass

- The 50-route baseline remains the preservation baseline.
- Current `/web` additive routes are documented separately from the 50-route baseline rather than being allowed to overwrite it.
- `/services/gyms-fitness-studios` remains canonical; `/services/gyms` remains unresolved.
- Legal content must be preserved exactly until legal review explicitly changes it.
- Dark logo variants in `/web/public/brand` are the primary dark-background assets. Legacy white-background logos must not be placed directly on dark sections.
- Documentation-only commit is safe if staged paths are limited to `AGENTS.md` and the new `docs/silverstone-transformation/*.md` contract files.
- The local `particles.js` body background is served as `/vendor/particles.js` to preserve the runtime contract without counting the package inside the Vite application bundle.
- Runtime Lucide icons are generated into a local SVG helper so the app does not import the full icon package entry for the foundation shell.
- Playwright browser validation is capped at two workers because the homepage visual matrix, route parity and axe checks contend for the local preview process at higher worker counts.
- Motion is the primary React animation platform for `/web`. Use `motion/react` for provider/hooks/coordination APIs, `motion/react-m` for lightweight DOM elements inside the strict `LazyMotion` subtree, and reserve GSAP for documented exceptional hero, shader, WebGL, or scroll sequences.
- The global header is the primary Motion-owned shell interaction surface. The footer keeps its static premium layout and CSS-only decorative line sweep to preserve the 300 KB hard bundle ceiling; this CSS motion is non-essential, reduced-motion gated, and does not create a second React animation system.

## Files Changed By This Pass

- `AGENTS.md`
- `docs/silverstone-transformation/PROJECT_STATE.md`
- `docs/silverstone-transformation/ROUTE_MANIFEST.md`
- `docs/silverstone-transformation/FUNCTIONAL_CONTRACT.md`
- `docs/silverstone-transformation/ASSET_REUSE_MATRIX.md`
- `docs/silverstone-transformation/QUALITY_BASELINE.md`
- `docs/silverstone-transformation/REDIRECT_REQUIREMENTS.md`
- `docs/silverstone-transformation/DECISION_LOG.md`
- `web/playwright.config.ts`
- `web/public/vendor/particles.js`
- `web/src/components/icons/lucide.tsx`
- `web/src/components/ui/core-spin-loader.tsx`
- `web/src/visual/home-v2/body-particles.tsx`
- `web/tests/e2e/homepage-interaction.spec.ts`
- `web/tests/e2e/route-parity.spec.ts`
- `web/package.json`
- `web/package-lock.json`
- `web/vite.config.ts`
- `web/src/app/root.tsx`
- `web/src/motion/**`
- `web/src/components/ui/orbital-loader.tsx`
- `web/src/routes/company/home-v2.tsx`
- `web/src/routes/templates/service-page.tsx`
- `web/src/visual/home-v2/explore-system-button.tsx`
- `web/src/visual/home-v2/hero.tsx`
- `web/tests/unit/motion-provider.test.tsx`
- `web/src/components/layout/app-shell.tsx`
- `web/src/components/layout/shell/site-footer.tsx`
- `web/src/components/layout/shell/site-header.tsx`
- `web/src/components/premium/**`
- `web/src/motion/use-page-in-view.ts`
- `web/src/motion/index.ts`
- `web/src/motion/variants.ts`
- `web/src/styles/shell-header.css`
- `web/src/styles/tokens/cinematic.css`
- `web/src/visual/components/page-entry.tsx`
- `web/src/visual/components/reveal-section.tsx`
- `web/tests/setup.ts`
- `web/tests/unit/app-shell.test.tsx`
- `web/tests/unit/premium-system.test.tsx`
- Targeted `/web/src/**` files reformatted by Prettier to clear the previous format backlog.

## 2026-06-30 Homepage V2 Conversion Pass

- Superseded by the Pre-Prompt-5 Homepage Recovery above. This section is retained only as historical evidence of the intermediate state that was repaired.
- The intermediate `/web` homepage first view positioned Silverstone AI as a premium AI systems studio with visible booking and system-exploration conversion paths.
- The intermediate homepage body opened with the qualitative Silverstone System: strategy, design, AI agents, software, integrations, and optimisation. The recovery restored protected benchmark counters and the Live Signal Benchmarks card from repository history.
- Trust and service copy were softened to preserve business intent without unsupported timing, revenue, usage, or guarantee-like claims.
- The homepage now includes qualitative outcome patterns and industry relevance links for estate agents, hospitality, trades, gyms and studios, clinics and practices, and e-commerce.
- Hero Aether rendering is reduced-motion aware; the animated field effect does not initialise when motion is disabled.
- Mobile first-body layout hides the duplicate secondary CTA row below 640px so the system reveal remains non-overlapping. The primary mobile booking CTA remains in the hero.
- Browser QA covered 1440x900, 1280x800, 1024x768, 768x1024, 430x932, 390x844, and 390x667, plus reduced motion, keyboard focus, reload/direct entry, blocked-font resilience, loader completion, and image/network response checks.
- Validation passed from `/web`: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run bundle:report`, `npm run staging:safety`, `npm run test:a11y`, and `npm run test:e2e -- tests/e2e/homepage-interaction.spec.ts --project=desktop-chromium`.
- Bundle report remains a target miss at `299.04 KB gzip`, but it passes the 300 KB hard ceiling.

## 2026-06-30 Approved Services Recovery

- Rebuilt the seven canonical `/web` service routes from the approved services copy and SEO pack copied to `docs/approved-copy/services/`.
- Added source SHA-256, copy-fidelity, image-use, design-brief, and visual/content completion records under `docs/approved-copy/services/`.
- Replaced rendered service-route body experiences with governed typed approved content, route-specific visual systems, approved images, benchmark evidence, required demo placeholders, and route-specific Motion treatments.
- Repaired the shared Aether Flow pointer interaction so pointer coordinates are canvas-relative, particles displace from the pointer, connections recalculate from displaced positions, the visible interaction radius follows the pointer, and the RAF/listeners clean up on inactivity or unmount.
- Preserved canonical routes and documented aliases: `/services/website-design-development` resolves to `/services/web-design-development`; `/services/ai-agents-automation` resolves to `/services/ai-automation`.
- Validation passed from `/web`: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, `npm run staging:safety`, `npm run test:e2e -- route-entry.spec.ts`, and a custom Playwright browser sweep across all seven service routes at desktop and mobile widths.

## 2026-06-30 Prompt 5.5 Runtime Forensics

- Root Replit/dev/preview commands now delegate to the active `/web` React Router/Vite app instead of leaving root `npm start` pointed at the frozen static root.
- `.replit` now runs `npm run replit:dev`; root `start`, `build`, `preview`, `test`, `replit:dev`, and `replit:preview` delegate to `/web`. Explicit legacy commands remain available as `legacy:start` and `legacy:build`.
- Removed obsolete `/web/public/prototypes/services/**` static service prototypes and removed the old React service fallback from `web/src/visual/data/page-modules.tsx`.
- Removed the seven canonical service pages from the migrated-content registry so approved service routes render only from `web/src/content/services/approved-services.ts` and `web/src/visual/components/approved-service-page.tsx`.
- Fixed approved service route loading in `web/src/routes/services/detail.tsx` so retained migrated content is not requested for approved service routes.
- Restored Aether Flow to pointer-displaced particle-network behavior without a visible lens/circle/orb/magnifier.
- Added runtime/source guardrails:
  - `web/tests/unit/replit-runtime.test.ts`
  - `web/tests/e2e/services-rendering.spec.ts`
  - updated migrated-content, service-asset, approved-service, and Aether unit tests.
- Added forensic records:
  - `docs/silverstone-transformation/REPLIT_RUNTIME_AUDIT.md`
  - `docs/silverstone-transformation/PROTOTYPE_REMOVAL_REPORT.md`
  - `docs/silverstone-transformation/SERVICE_RENDER_SOURCE_MAP.md`
  - `docs/silverstone-transformation/AETHER_FLOW_FIDELITY_REPORT.md`
- Validation passed:
  - `/web npm run test`: 26 files, 70 tests.
  - `/web npm run lint`: passed.
  - `/web npm run typecheck`: passed.
  - `/web npm run build`: passed; all seven canonical service routes and both aliases prerendered.
  - `/web npm run staging:safety`: passed.
  - `/web npm run test:e2e -- services-rendering.spec.ts route-entry.spec.ts`: 26 browser tests passed across desktop and mobile.
  - Root `PORT=4182 npm run replit:dev` service-route fetch returned approved H1/body phrase and no prototype/legacy-root title.
  - Root `PORT=4181 npm run replit:preview` served the production preview used for Aether and route-matrix browser probes.
  - Custom desktop/mobile route matrix across all seven service routes returned `200`, matching titles, canonical links, visible approved body after entry, one Aether canvas, and no console errors.
  - Aether browser probe showed center network density changing under pointer presence and proximity-colour pixels appearing only while the pointer was inside the field.

## Unresolved Risks And Evidence Gaps

- No authenticated Netlify, DNS, analytics, Search Console, Resend, Calendly, or production environment control-plane access was used.
- No production form submission, email send, Calendly booking, analytics verification, deployment, or DNS verification was performed.
- Fresh live route and redirect crawl still required before any cutover or redirect edit.
- Root legacy `npm run seo:audit` currently fails on stale generated sitemap content; this pass did not regenerate root artifacts because the legacy root is frozen.
- `/web` foundation JavaScript remains above the 220 KB target despite passing the 300 KB hard ceiling.
- Provider-side Calendly availability, buffers, notifications, timezone, and calendar ownership remain unverified.
- Production Resend sender/domain/recipient settings remain unverified beyond env variable names and legacy function defaults.
- Current ranking, traffic, conversion rate, Core Web Vitals field data, and Search Console coverage were not accessed.

## Non-Regression Contracts

- Legacy root remains untouched and operational.
- `/web` remains isolated until a separately approved cutover.
- No production service, analytics, booking, email, Netlify, DNS, IndexNow, or env mutation.
- No route removal without approved route and redirect decision.
- No invented claims, proof, clients, testimonials, metrics, awards, or integrations.
- All staging and local validation must remain non-indexable and non-production-mutating.

## Next Recommended Prompt

Reduce the `/web` foundation JavaScript from the current `298.67 KB gzip` target miss toward the 220 KB target without changing route/content contracts, Motion ownership, or production controls.

## Can Prompt 2 Proceed?

Yes, conditionally. Prompt 2 can proceed safely for `/web` presentation-layer work if it respects this contract, does not touch production controls, and starts with a fresh branch/worktree/status check plus targeted `/web` validation.
