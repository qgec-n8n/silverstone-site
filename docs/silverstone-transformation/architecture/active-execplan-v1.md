# ExecPlan: Transformation Governance And Foundation

## Objective

Establish the ownership, handoff, and instruction controls required before implementation work begins on the approved `/web` rebuild.

## Authority

This ExecPlan is subordinate to the following authoritative architecture files:

- `/docs/silverstone-transformation/architecture/rebuild-decision-v1.md`
- `/docs/silverstone-transformation/architecture/execution-blueprint-v1/MANIFEST.md`
- `/docs/silverstone-transformation/architecture/execution-blueprint-v1/branch-and-ownership-model-v1.md`
- `/docs/silverstone-transformation/architecture/execution-blueprint-v1/handoff-contracts-v1.md`
- `/docs/silverstone-transformation/architecture/execution-blueprint-v1/quality-gates-v1.md`
- `/docs/silverstone-transformation/architecture/execution-blueprint-v1/rollback-checkpoint-plan-v1.md`

## Observed baseline

- `transformation/audit` was clean at `c38aa61a21fa0a1c3772a31c761db1f3981d43db` before the foundation branch was created.
- The required audit, blueprint, and research artifacts were present and matched their manifests.
- The repository did not yet contain a `/web` instruction file, a root `replit.md`, a governance ownership register, or a handoff template.
- The repo remains the legacy-root Silverstone site, so governance files must not mutate production content or controls.

## Scope

- Create the repository instruction files required to govern the transformation.
- Define file ownership and handoff boundaries before any implementation work.
- Keep all non-governance application, legacy-site, Netlify, and integration files unchanged.

## Checkpoint names

The checkpoint names are fixed and match the rollback plan:

| Checkpoint | Name |
|---|---|
| CP0 | Audit and decision authority |
| CP1 | `/web` foundation and SSG proof |
| CP2 | Route/content contracts and shared shell |
| CP3 | Main and legal route parity |
| CP4 | Services parity |
| CP5 | Blog parity |
| CP6 | Integrations mocked and sandboxed |
| CP7 | Motion enhancement |
| CP8 | Staging candidate |
| CP9 | Future cutover boundary |

## Acceptance criteria

- `/web/AGENTS.override.md` explicitly permits the approved rebuild only inside `/web`.
- `/replit.md` exists at the repository root and states that Replit is non-production staging with explicit owned directories and Preview requirements.
- `/docs/silverstone-transformation/architecture/file-ownership-register-v1.csv` defines Codex-owned, Replit-owned, frozen, and handoff-only paths.
- `/docs/silverstone-transformation/handoffs/HANDOFF_TEMPLATE.md` contains the mandatory handoff schema.
- No application, legacy-site, Netlify, or integration files are changed by this governance commit.
- The new instructions are loadable from a fresh context rooted at `/web`.

## Verification plan

1. Confirm the audit branch SHA and the new foundation branch SHA.
2. Validate the manifests and instruction files with targeted reads.
3. Confirm `git status` shows only the approved governance paths.
4. Commit the governance files with a documentation-only message.

## Rollback

- Revert the governance commit if any instruction file is malformed or if an unapproved path changes.
- Do not touch `main`.

## CP2 execution record — route/content migration framework

The route/content contract workstream was executed on `transformation/foundation` from start commit `d48cebd4`.

- 50 A-01 canonical routes are represented in the future route manifest.
- 133 A-01 SEO/redirect records have exactly one typed disposition.
- Route groups, content extraction, SEO generation, redirect validation, internal-link validation, route templates, lazy route modules, prerendering and route-parity tests are implemented.
- One former self-loop route remains explicitly draft and unresolved; no content decision was invented.
- Replit-owned paths, the legacy root and production `netlify.toml` remain unchanged.
- Implementation evidence and rollback instructions are recorded in `route-migration-implementation-v1.md`.

## CP3–CP5 execution record — retained content baseline

The retained-content workstream was executed on `transformation/foundation` from start commit `6c2953c`.

Observed before implementation:

- G-01 defined 49 retained routes and one draft route.
- The retained legacy sources contained 4,189 broad extraction blocks, including navigation and footer content that could not be used as page-body records without further filtering.
- Retained page content referenced 35 primary approved or refactor-approved image files; one article derivative was missing while its source image remained available.
- Production forms, Calendly and analytics could not be activated in the transformation workspace.

Implemented:

- 49 typed, route-lazy content modules with source file, SHA-256, metadata, headings, schema, links, assets, disabled interactions and source-to-destination provenance.
- Distinct content kinds for 2 company pages, 1 service page, 9 industry pages, 3 conversion pages, 1 legal page, the blog index and 32 retained articles.
- Source-faithful rendering through the existing core, service, industry and article templates.
- Deterministic claims-proof, duplicate/thin/contradiction and exception review artifacts under `docs/silverstone-transformation/content/`.
- Static and rendered validation for source hashes, links, assets, headings, metadata, schema, route coverage, noindex staging behavior and inactive integrations.

After verification:

- 49/49 retained routes are accounted for with 2,316 page-body blocks, 553 validated links, 35 copied images and 90 valid source schema records.
- 375 claims require proof/editorial review; 27 duplicate, thin or overlap findings require editorial review.
- One missing article derivative uses the retained source image as an explicitly documented fallback.
- Desktop and mobile route parity, route crawl, lint, types, unit tests, build, staging safety and bundle budget pass.
- Replit-owned files, legacy visual files, production `netlify.toml`, production analytics, Resend and Calendly remain unchanged.

Tradeoff:

- This checkpoint preserves source copy and provenance inside the approved `/web` design primitives. It does not reproduce the frozen legacy visual treatment or perform final marketing rewrites.

## Unified baseline preparation record

Observed before integration on 2026-06-23:

- `main` started at `1e445c305c30cae93d5f6427135a238be8d58c14`.
- `transformation/audit` started at `6d7d8f884c269d3ed87bbe7cbe75dd5887a43e44`.
- Local `transformation/foundation` started at `5ad4e20ed9e10f1374d01c297e2e9be500a0c123`.
- The shared `main` merge base for `main`, `transformation/audit`, and `transformation/foundation` was `1e445c305c30cae93d5f6427135a238be8d58c14`; the audit/foundation merge base was `c38aa61a21fa0a1c3772a31c761db1f3981d43db`.

Changed:

- Merged `transformation/foundation` into `transformation/audit` with a normal non-fast-forward merge commit `d5f17939e7d40d5b376d5e0d2858f16b7838b0d9`.
- Resolved only `.DS_Store` conflicts by removing machine-local metadata.
- Removed tracked dependency, build, framework-cache, npm-cache, test-output, and `.DS_Store` files from the index.
- Moved the durable F-01 bundle baseline from `web/build/bundle-report.json` to `/docs/silverstone-transformation/design/brand-motion-design-system-v1/f01-bundle-report-v1.json` and updated its documentation references.
- Restored `.codex/config.toml` to the useful `main` version after audit/foundation were found to contain an empty file.
- Revised root and `/web` instructions so `/web` is the active application and the legacy root website remains frozen migration evidence.
- Superseded obsolete active transformation-branch execution instructions in the ownership register and branch model while preserving historical branch references in completed records.

Verification:

- Passed fresh `/web` install from lockfile, lint, typecheck, unit tests, production-mode build, migrated-content validation, route parity, redirect validation, bundle budget, staging safety, Playwright desktop/mobile smoke tests, a11y-tagged browser tests, Replit run-command smoke test, tracked-file audit, and high-confidence secret scan.
- Confirmed 190 tracked `/web/src`, `/web/public`, and `/web/tests` files remain present.
- Confirmed 93 tracked audit/architecture/content/research/handoff documentation files remain present.
- Confirmed all 9 visual-direction specification files are present and non-empty.
- Confirmed no production analytics, production email delivery, production deployment, Netlify, or root legacy implementation files were changed by the preparation work.

Pre-existing validation failures:

- `npm run format:check` fails on 10 `/web` files. The same command fails with the same file list on a detached `transformation/foundation` checkout after fresh `npm ci`.
- `node scripts/migration/crawl-routes.mjs http://127.0.0.1:4173` fails after fresh build/preview. The same failure pattern is present on a detached `transformation/foundation` checkout. The failing crawler is stricter than the configured Playwright route-parity tests and does not include the later `/how-we-work`, `/industries`, and service-detail navigation routes in its 50-route manifest.

## Main repair integration record -- 2026-06-23

Observed before repair:

- `origin/main` was `96f293ab6baa611a0b4df016541319ee7b7f6a3a`.
- `origin/transformation/audit` was `c7d64185141f4f1415e7fed22e9da36e6085ad78`.
- `origin/transformation/foundation` was `decb8c88fb2bfd8d0b731bc3dbc4aee5062875f4`.
- The shared merge base for `origin/main`, `origin/transformation/audit`, and `origin/transformation/foundation` was `1e445c305c30cae93d5f6427135a238be8d58c14`.
- `origin/main` had four commits not in `origin/transformation/audit`; `origin/transformation/audit` had 26 commits not in `origin/main`.
- `origin/transformation/foundation` had nine commits not in the initial integration result and was not an ancestor of `origin/transformation/audit`.
- Current `main` contained the legacy root website plus tracked generated material, including root `node_modules/`, `/web/node_modules/`, `.npm-cache/`, `/web/build/`, `/web/.react-router/`, `/web/test-results/`, `.DS_Store` files, and a pasted prompt attachment.

Changed:

- Created and verified remote safety branch `backup/main-before-react-integration-20260623-1808` at the exact pre-repair `origin/main` SHA.
- Created local integration branch `integration/react-main-repair-20260623-1808` from `origin/main`.
- Merged `origin/transformation/audit` with a normal non-fast-forward merge commit `631b74fade1cf1efe5dfcb01654f04b3ae357916`.
- Resolved `.replit` to the audit branch version so Replit starts `/web`.
- Removed tracked dependency directories, npm cache, React Router generated files, build output, test output, `.DS_Store` files, and the pasted prompt attachment from the merge result.
- Preserved legitimate `main`-only agent tooling, including `.agents/skills/**`.
- Merged `origin/transformation/foundation` with a normal non-fast-forward merge commit `dae97ffca828fb01750bfb5d9092aa9b25968b01` to preserve the foundation branch history. The visual-direction files were already byte-identical before that merge.
- Left the legacy root HTML, CSS, JavaScript, assets, package files, and Netlify configuration unchanged, apart from `.DS_Store` cleanup.

Verification:

- `npm ci` in `/web` passed from the committed lockfile with 408 packages installed and 0 vulnerabilities.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run test` passed: 16 files, 33 tests.
- `npm run migration:validate` passed: 49 routes, 553 links, 35 assets, 90 schema records.
- `npm run build` passed and prerendered the staging route set.
- `npm run bundle:report` passed: 154.01 KB gzip, target-pass.
- `npm run staging:safety` passed.
- `npm run test:e2e` passed: 32 desktop/mobile Chromium tests.
- `npm run test:a11y` passed: 2 desktop/mobile Chromium tests.
- `.replit` smoke test passed with `PORT=3173`; the command started the React Router app from `/web`, bound to `0.0.0.0`, returned React Router/Vite HTML, and emitted staging `noindex` headers.
- Tracked-file audit found no tracked dependency directories, build output, framework caches, browser reports, test results, `.DS_Store`, or pasted prompt attachments.
- Introduced-file secret scan found no credentials. Matches were asset filenames and migration risk identifiers in documentation.
- Root legacy source comparison against pre-repair `origin/main` found no non-`.DS_Store` changes under the legacy HTML, asset, script, root package, or Netlify paths.

Non-blocking pre-existing validation:

- `npm run format:check` still fails on the same 10 `/web` files documented in the unified baseline preparation record. Those files are byte-identical to `origin/transformation/audit` in this integration, so the failure was not introduced by the main repair.

Rollback:

- Reset `main` back to remote branch `backup/main-before-react-integration-20260623-1808` if this integration must be reverted. Do not delete that safety branch until the rollback window is closed.

## Homepage intro/body correction record -- 2026-06-25

Observed before implementation:

- Browser baseline on `http://127.0.0.1:5173/` showed the locked post-loader homepage still had the full body mounted: desktop document height 12,170px and mobile document height 17,329px while `data-scroll-lock="on"` and `data-hero-locked="on"`.
- Header, footer, `#system`, and the body particle layer were present during the supposed isolated intro state.
- The Explore button owned the unlock and performed Lenis/`scrollIntoView` navigation to `#system`, which prevented a clean reversible transition.
- The body particle layer loaded `particles.js` locally, but its own hover interactivity was disabled by `pointer-events:none`.
- CTA/footer logo references still pointed at `silverstone-logo-dark-new.png`; the supplied `silverstone-ai-logo-dark-v2.png` edge sampled to `#0a1434`.

Changed:

- Added a homepage state machine (`loading`, `intro`, `opening`, `body`, `closing`) in `AppExperienceProvider`, mirrored to `<html data-homepage-state>`.
- Locked scroll at the document level during loading/intro/opening/closing, restored prior inline overflow styles on body entry, and reset programmatic scroll attempts while the intro is locked.
- Changed the app shell so the homepage header/footer and header padding are absent until `homepageState === "body"`; other routes retain the existing loader-hidden header behavior.
- Split `HomeV2` into mutually exclusive intro/transition/body render trees. Body sections, Lenis/GSAP `ScrollProvider`, body particles, header, and footer mount only in body state.
- Refactored the Hero Button Expendable mechanic into controlled Motion shared-layout primitives with a stable `layoutId`, forward opening overlay, reverse return-to-intro control, Escape return from body, and focus restoration to the Explore button.
- Removed anchor/scroll navigation from the opener; the body now starts at `#system` under the mounted header.
- Replaced the `particles.js` body layer with a single local canvas RAF owner, reduced particle count/speed, canvas-relative pointer math, coarse-pointer magnetic disablement, visibility pause/resume, and explicit cleanup.
- Updated the hero Aether canvas pointer math, zero-distance guard, and mote palette to cyan/blue/violet/pink/platinum; adjusted intro reveal timing to the requested lower/smaller/transparent stagger.
- Updated the loader to hold for at least four seconds and wait for current-route fonts/local image/SVG preload resolution or failure, with a max asset timeout.
- Added the supplied dark v2 logo asset, switched CTA/footer lockups to it, and updated `--silverstone-dark-logo-edge` to `#0a1434`.
- Added required social, Microsoft, and Google integration marks as local SVGs, retained the broader ecosystem in the same three-row carousel, and removed any visible exhaustive integration sentence.
- Corrected the first body heading to `The Silverstone System`, inserted the Scroll indicator immediately before the trust strip, and changed trust signals to the required six-item sequence.
- Added focused unit and Playwright regression tests for local carousel assets and the homepage intro/body state machine.

Verification:

- Manual Playwright desktop: intro document height equalled viewport height, header/footer/body particles/`#system` were absent; opening state remained viewport-height and body-free; body state mounted header/footer/body particles/`#system` with heading `The Silverstone System`; reverse transition returned to intro at scrollY 0 with Explore focused.
- Manual Playwright mobile 390x844: intro document height 844px; body opened to scrollable state with header/footer/body particles and `#system` at the header offset.
- Manual Playwright console check: 0 runtime errors; only a development preload warning for an existing brand emblem resource.
- Canvas pixel checks confirmed the hero Aether canvas and body particle canvas were nonblank when mounted.
- Header surface check confirmed `rgb(255, 255, 255)` at top and after scrolling.
- Integration carousel check confirmed required local SVGs decode when in view and the hidden accessible list contains the new required Social/Microsoft/Google sets.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run test` passed: 17 files, 35 tests.
- `npm run build` passed.
- `npm run test:e2e -- tests/e2e/homepage-interaction.spec.ts` passed in desktop and mobile Chromium.
- `npm run test:e2e` passed: 34 desktop/mobile Chromium tests.
- `npm run staging:safety` passed.
- Changed-file Prettier check passed for all files touched by this work.

Non-blocking validation notes:

- Full `npm run format:check` still fails on 32 unrelated files outside this task's diff; the changed-file Prettier check passed.
- `npm run bundle:report` exited successfully but reported `Foundation JavaScript: 282.53 KB gzip (target-miss)`.

Tradeoff:

- Microsoft and LinkedIn logo assets use local coloured SVG fallback marks where `simple-icons` does not provide the current brand mark. The carousel remains local, icon-only, and accessible through the hidden list.

## Homepage corrective pass record -- 2026-06-25

Observed before implementation:

- Browser baseline on `http://127.0.0.1:5173/` confirmed the intro isolation from the previous pass still held, but the body background no longer used the actual local `particles.js` runtime: `window.pJSDom` was absent and the body used a custom `.ss-hv2-backdrop__particles` canvas.
- The Silverstone System section still depended on the secondary image slot and overflowed the viewport on desktop (`#system` bottom was about 23px below a 1366x768 viewport).
- The trust strip was constrained to the content container instead of spanning the viewport.
- CTA and footer lockups still referenced the v2 logo asset.
- The supplied v3 logo perimeter sampled to top `#111423`, edge `#0f1222`, and bottom `#0f1221`.

Changed:

- Copied the supplied v3 logo unchanged to `/web/public/brand/silverstone-ai-logo-dark-v3.png` and switched CTA/footer image references to it.
- Added sampled v3 logo-field tokens and removed CTA/footer image cropping, recolouring, and masking from the logo image itself.
- Replaced the custom body particle canvas with a classic-script load of the installed local `particles.js` package, preserving `window.pJSDom`, native `canvas.particles-js-canvas-el`, hover grab on fine pointers, visibility pause/resume, and scoped cleanup on return to intro.
- Added a pointer bridge so native particles.js canvas hover responds while the canvas remains behind body content.
- Updated the intro Aether field to read actual `[data-aether-reveal]` boxes, repel particles from those boxes, and skip particle links crossing active reveal zones.
- Reworked the Silverstone System section into a one-viewport body opener with no image, four headline benchmark metrics, four secondary approved metrics, compact short-mobile treatment, and an in-section scroll cue.
- Made the trust strip full viewport width and preserved the six required trust signals.
- Updated the loader logo to v3 and changed the visible loader copy to a stable phrase plus animated ellipsis.
- Added Playwright assertions for local particles.js runtime proof, reverse cleanup, v3 logo references, no system image, full-width trust strip, and the exact viewport matrix: 1366x768, 1440x900, 1920x1080, 390x844, 375x667, and 768x1024.

Verification:

- Built-preview Aether proof at 1366x768: canvas bitmap 1366x768, four reveal zones detected, nonblank canvas (`wholeBrightRatio 0.0218`), and title reveal bright-line density lower than the surrounding ring (`0.0004` vs `0.0018`, protected=true).
- Built-preview body proof: `window.particlesJS` function, `window.pJSDom.length === 1`, one native particles.js canvas, script `/assets/particles-CDlok4Gc.js`, package marker `particles.js`, no particle CDN script, no old custom body canvas, no `#system img`, four metrics, four rows, `#system` bottom delta 0, trust width 1366, hover status `mousemove`, CTA/footer v3 logo references.
- Built-preview reverse proof: returning to intro removed the backdrop and native canvas and reset `window.pJSDom.length` to 0.
- Manual viewport sweep after the mobile row fix passed with zero bottom overflow and trust strip starting at the next pixel row for 1366x768, 1440x900, 1920x1080, 390x844, 375x667, and 768x1024.
- `npx prettier --check` on all changed files passed.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run test` passed: 17 files, 35 tests.
- `npm run build` passed and emitted the local particles asset into the staging build.
- `npm run test:e2e -- tests/e2e/homepage-interaction.spec.ts` passed: 8 passed, 6 duplicate mobile-project viewport cases skipped.
- `npm run test:e2e` passed: 40 passed, 6 duplicate mobile-project viewport cases skipped.
- `npm run staging:safety` passed.
- `npm run bundle:report` exited successfully and reported `Foundation JavaScript: 293.13 KB gzip (target-miss)`.

Tradeoff:

- The viewport matrix runs once in the desktop Chromium project while setting the exact requested viewport sizes explicitly; the mobile Chromium project still runs the intro/body state-machine interaction test, but skips duplicate viewport matrix cases.

## Homepage footer/interaction corrective pass record -- 2026-06-26

Observed before implementation:

- Local browser baseline on `http://localhost:5173/` showed the intro Aether canvas still read `[data-aether-reveal]` element boxes, repelled particles from copy bounds, and skipped links crossing reveal zones instead of behaving like the continuous 21st.dev Aether Flow particle web.
- The hero reveal still used blur, scale, perspective and z-depth transforms rather than a sequential fade-up.
- The body `particles.js` config was local and correctly scoped, but still used a multi-colour particle/link palette instead of a single Neural Violet field.
- The secondary benchmark row still rendered the unapproved `£100k → £300k` revenue trajectory and the integration carousel still rendered the hidden sentence beginning `Silverstone integrates with`.
- The CTA still rendered the full logo lockup above the headline, and the footer CTA still lived inside the brand column instead of a far-right footer region.
- Footer logo edge sampling of `silverstone-ai-logo-dark-v3.png` confirmed an edge median around `#0f1222`, but the footer surface/wrapper did not use a footer-specific derivative with an identical boundary field.

Changed:

- Replaced `HeroAetherField` with a continuous canvas particle web using the requested density formula, Electric Cyan particles/links, Platinum Silver pointer-near links, pointer radius `200`, edge bounce, and no DOM reveal-zone measurement or link masking.
- Simplified the hero reveal to a delayed, sequential opacity/y fade-up and removed the `data-aether-*` reveal attributes.
- Retuned body `particles.js` to one `#A97CC0` particle/link/grab colour while preserving the local package script, one scoped instance, cleanup, and visibility handling.
- Replaced the revenue trajectory benchmark with the approved `65% lower` processing-cost benchmark, retitled the section to `The Business Impact of Better Automation`, and removed the rendered integration sentence.
- Removed the CTA logo lockup and rebalanced the final CTA around the eyebrow, headline, copy and actions.
- Added `web/public/brand/silverstone-ai-logo-footer.png`, a footer lockup derivative whose boundary-connected background pixels are normalized to `#0f1222`; switched the shared footer to that asset and a five-region footer grid with the CTA in the far-right desktop column and before link groups on mobile.
- Re-centered the core loader by absolutely centering `.ss-loader__stage` at the viewport midpoint and positioning the label below the rings.
- Added Playwright regression coverage for loader centering, no Aether reveal attributes, single-violet local particles.js config, removed forbidden homepage text, no CTA logo, footer logo asset, footer desktop CTA placement, and mobile footer order.

Verification:

- Manual Playwright evidence saved to `artifacts/home-footer-after/`: loader/intro/body/footer screenshots for desktop 1366, mobile 390 and mobile 375 plus refreshed `after-results.json`.
- Manual runtime matrix across `320x568`, `375x667`, `390x844`, `430x932`, `768x1024`, `1024x768`, `1280x720`, `1366x768`, `1440x900`, and `1920x1080`: loader stage center deltas `0`, label gap range `24px`-`32.390625px`, Aether bitmap matched the rendered hero with no reveal attributes, `metricValuesFit` passed, live-signal `::before` was `none`, and document/footer horizontal overflow stayed `0`.
- Body runtime proof: `window.pJSDom.length === 1`, one native `particles.js` canvas, local `particles-CDlok4Gc.js` script, particle/line colour `#A97CC0` with grab lines inheriting the linked-line colour, no revenue/integration forbidden text, CTA logo count `0`, exact benchmark heading visible, footer logo `/brand/silverstone-ai-logo-footer.png`, footer brandmark background `rgb(15, 18, 34)`, desktop CTA far-right order and mobile CTA-before-links order passed.
- `npx prettier --check` on changed source/test files passed; full `npm run format:check` still reports pre-existing unrelated formatting issues outside this change scope.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed and emitted the local `particles-CDlok4Gc.js` asset.
- `PORT=4183 npm run test:e2e -- tests/e2e/homepage-interaction.spec.ts` passed: 12 passed, 10 expected duplicate viewport skips.
- `npm run test` passed: 17 files, 35 tests.
- `npm run staging:safety` passed.
- `PORT=4183 npm run test:e2e` passed: 44 passed, 10 expected duplicate viewport skips.
- `npm run bundle:report` exited successfully and reported `Foundation JavaScript: 291.81 KB gzip (target-miss)`.

Tradeoff:

- The archival claims registry still contains the removed revenue trajectory as a source record, but the active homepage data, rendered text, and regression tests no longer expose it.

## Final homepage corrective pass record -- 2026-06-26

Observed before implementation:

- Baseline evidence saved under `artifacts/homepage-corrective-pass/baseline/` showed the loader stage centered but the emblem offset by about `42.8px` at mobile/desktop and the label intersecting the ring/glow (`labelGapFromRing` negative on the sampled viewports).
- The integration carousel first logo still entered with opacity `0`, translate `0 14px`, and a reveal gate on the marquee row.
- The secondary Live Signal lower strip rendered four rows, including a duplicate processing-cost benchmark, and used wrapping rules that split words in the compact telemetry cells.
- The footer CTA lived outside the Company link column, the desktop brand logo top-aligned with the Services heading, and the London line sat about `50px-62px` below the All services row in the prior footer proof.
- The required `npx shadcn@latest add https://21st.dev/r/m.kumailalirajpoot/core-spin-loader` command and a pinned `npx shadcn@4.10.0 add ...` retry both returned 403 `Authentication required`; the 21st.dev Magic MCP source for `Orbital Loader` was used as the registry-backed fallback.

Changed:

- Added `OrbitalLoader` from the 21st.dev Magic MCP source, preserving the three Framer Motion rings, inset structure, and `1s` / `1.5s` / `0.8s` linear infinite rotations while adapting imports to this React Router app.
- Replaced the old bespoke core-spin markup with the Orbital Loader, centered the logo emblem independently, moved the loader label below the full spin/glow area, kept the four-second loader hold/asset wait, and added a static reduced-motion visual fallback.
- Removed the carousel reveal gate so logos are visible immediately while preserving desktop marquee motion, hover/focus pause, and reduced-motion static behavior.
- Reduced the Live Signal support strip to three approved rows, removed the duplicate lower processing-cost item, and rebuilt the strip as a three-column telemetry band without `anywhere` word splitting.
- Moved the booking CTA into the Company footer column after the Company links, removed the duplicate Company menu CTA, adjusted the four-column desktop footer grid, and resized the footer logo so the London line aligns close to the All services row.
- Updated Playwright coverage for loader ring/emblem centering, three-row signal telemetry, footer CTA-in-Company behavior, homepage lifecycle waits, and foundation/a11y waits after the intentionally isolated homepage intro.

Verification:

- Final evidence saved under `artifacts/homepage-corrective-pass/final/` includes loader, body, and footer screenshots for `320x568`, `375x667`, `390x844`, `430x932`, `768x1024`, `1024x768`, `1280x800`, `1366x768`, `1440x900`, and `1920x1080`, plus `final-geometry.json`.
- Final matrix: loader stage center delta max `0px`; Orbital Loader spin center delta max `0.0078125px`; emblem center delta max `0.0078277587890625px`; minimum label gap from the spin ring `25.59375px`; minimum label gap from glow `64.61441040039062px`.
- Final body/footer matrix: `#system` bottom delta `0px` on all ten viewports, horizontal overflow `0px`, console errors `0`, Live Signal rows `3`, all row labels fit, desktop carousel logos opacity `1` / translate `none`, and hover pause changed marquee play state from `running` to `paused`.
- Reduced-motion proof: loader ring transform stayed `none`, visible loader copy stayed static as `Engineering the next advantage...`, body particles did not attach, and carousel animation name was `none`.
- Changed-file Prettier check passed; full `npm run format:check` still fails on 31 unrelated pre-existing files outside this change scope.
- `npm run typecheck`, `npm run lint`, `npm run test` passed (`17` files, `35` tests), `npm run build` passed, `npm run staging:safety` passed, and `PORT=4185 npm run test:a11y` passed (`2` tests).
- `PORT=4183 npm run test:e2e -- tests/e2e/homepage-interaction.spec.ts` passed (`12` passed, `10` expected duplicate viewport skips); `PORT=4186 npm run test:e2e` passed (`44` passed, `10` expected duplicate viewport skips).
- `npm run bundle:report` exited successfully and reported `Foundation JavaScript: 292.15 KB gzip (target-miss)`.

Tradeoffs:

- The shadcn registry install could not be completed without authenticated 21st.dev access, so the implementation records the failed command and uses the available Magic MCP source with local app import adaptations.
- The full repo formatting backlog remains intentionally untouched to preserve the minimal-diff constraint.
