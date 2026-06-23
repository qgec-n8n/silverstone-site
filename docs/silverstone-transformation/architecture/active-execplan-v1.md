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
