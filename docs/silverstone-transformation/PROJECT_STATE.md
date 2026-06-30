# Silverstone Project State

**Last updated:** 2026-06-30
**Current phase:** `/web` premium shell and Motion interaction system implemented and verified; legacy root remains frozen.
**Branch:** `main` tracking `origin/main`.  
**Remote:** `origin https://github.com/qgec-n8n/silverstone-site.git`.  
**Pre-existing uncommitted user change:** `.codex/config.toml` modified before this documentation pass; left untouched.

## Current Architecture

- Legacy root application remains operational and frozen as migration evidence.
- Active rebuild target is `/web`, a React Router/Vite app with TypeScript, React 19, Tailwind CSS 4, shadcn/ui configuration, GSAP for exceptional choreography, Motion 12.40.0 as the primary React animation platform, Three/WebGL/shader assets, local integration icons, route manifests, generated migrated content, tests, and staging-safety scripts.
- Production Netlify root remains configured by `netlify.toml` with root publish and legacy build commands. This pass made no production configuration change.
- Ignored local generated residue exists on disk: `web/node_modules/`, `web/build/`, `web/.react-router/`, `web/test-results/`, and several `.DS_Store`/log files. None are tracked and none are staged.

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
