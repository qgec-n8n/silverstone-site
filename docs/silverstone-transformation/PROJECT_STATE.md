# Silverstone Project State

**Last updated:** 2026-06-26  
**Current phase:** Ground-truth and operating-contract baseline before further presentation-layer changes.  
**Branch:** `main` tracking `origin/main`.  
**Remote:** `origin https://github.com/qgec-n8n/silverstone-site.git`.  
**Pre-existing uncommitted user change:** `.codex/config.toml` modified before this documentation pass; left untouched.

## Current Architecture

- Legacy root application remains operational and frozen as migration evidence.
- Active rebuild target is `/web`, a React Router/Vite app with TypeScript, React 19, Tailwind CSS 4, shadcn/ui configuration, GSAP, Framer Motion, Three/WebGL/shader assets, local integration icons, route manifests, generated migrated content, tests, and staging-safety scripts.
- Production Netlify root remains configured by `netlify.toml` with root publish and legacy build commands. This pass made no production configuration change.
- Ignored local generated residue exists on disk: `web/node_modules/`, `web/build/`, `web/.react-router/`, `web/test-results/`, and several `.DS_Store`/log files. None are tracked and none are staged.

## Completed Work

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

## Known Defects And Baseline Observations

- Legacy analytics loads before cookie consent while `privacy-policy.html` says non-essential cookies are set only after consent.
- Contact form server validation is presence-only; email syntax, content type, origin, rate limits, server-side honeypot, and safe provider-error handling remain rebuild requirements.
- Contact form status is not an `aria-live` region in the legacy root.
- Legacy images commonly lack intrinsic dimensions; A-01 recorded 206 image elements with no explicit width/height.
- Root route `/blog/ai-lead-capture-trades-uk-2026` is unresolved because historical audit found a self-redirect and later advisory evidence found the route loading with a legacy shell. Fresh crawl required.
- Unsupported quantified or absolute proof claims exist on the home and industry pages and require claim-ledger approval before reuse.
- Current `/web` app has prior records of full `npm run format:check` failures on unrelated files and a later bundle target miss (`282.53 KB gzip` reported in the homepage corrective pass). Those were not introduced here.
- A transient Vite dep re-optimization warning/hydration artifact is documented in Replit visual handoff notes.

## Decisions Made In This Pass

- The 50-route baseline remains the preservation baseline.
- Current `/web` additive routes are documented separately from the 50-route baseline rather than being allowed to overwrite it.
- `/services/gyms-fitness-studios` remains canonical; `/services/gyms` remains unresolved.
- Legal content must be preserved exactly until legal review explicitly changes it.
- Dark logo variants in `/web/public/brand` are the primary dark-background assets. Legacy white-background logos must not be placed directly on dark sections.
- Documentation-only commit is safe if staged paths are limited to `AGENTS.md` and the new `docs/silverstone-transformation/*.md` contract files.

## Files Changed By This Pass

- `AGENTS.md`
- `docs/silverstone-transformation/PROJECT_STATE.md`
- `docs/silverstone-transformation/ROUTE_MANIFEST.md`
- `docs/silverstone-transformation/FUNCTIONAL_CONTRACT.md`
- `docs/silverstone-transformation/ASSET_REUSE_MATRIX.md`
- `docs/silverstone-transformation/QUALITY_BASELINE.md`
- `docs/silverstone-transformation/REDIRECT_REQUIREMENTS.md`
- `docs/silverstone-transformation/DECISION_LOG.md`

## Unresolved Risks And Evidence Gaps

- No authenticated Netlify, DNS, analytics, Search Console, Resend, Calendly, or production environment control-plane access was used.
- No production form submission, email send, Calendly booking, analytics verification, deployment, or DNS verification was performed.
- Fresh live route and redirect crawl still required before any cutover or redirect edit.
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

Proceed with Prompt 2 only after confirming this documentation commit is accepted. The next prompt should target a specific `/web` route or route group, require fresh local `/web` validation, preserve the 50-route baseline, and keep integrations mocked or disabled.

## Can Prompt 2 Proceed?

Yes, conditionally. Prompt 2 can proceed safely for `/web` presentation-layer work if it respects this contract, does not touch production controls, and starts with a fresh branch/worktree/status check plus targeted `/web` validation.
