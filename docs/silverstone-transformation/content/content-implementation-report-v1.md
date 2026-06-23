# Content Implementation Report V1

Date: 23 June 2026
Branch: `transformation/foundation`
Requested commit message: `feat(web): implement approved content and offer architecture`

## Scope

Implemented the approved H-01 content architecture and the inserted H-02 pricing / H-03 assurance decisions inside `/web` without editing `/web/src/visual/**`.

Primary outcomes:

- Separated capability-led service navigation from industry navigation.
- Added approved route coverage for `/industries`, `/how-we-work`, and six capability-led service pages.
- Rewrote core, service, and industry copy to approved-safe public language.
- Removed or quarantined unsupported claims, public pricing figures, guarantee language, and article bodies still under review.
- Updated metadata, schema, breadcrumbs, sitemap behavior, and internal linking for the approved route set.

## Capabilities Used

- Repo instructions and ownership review from `AGENTS.md`, `/web/AGENTS.override.md`, branch ownership docs, and the H-01 manifest pack.
- Skill discovery: `find-skills`
- Content implementation: `copywriting`
- SEO validation framing: `seo-audit`
- Test / runtime debugging: `build-web-apps:frontend-testing-debugging`
- Browser verification framing: `browser-use`
- Local verification tooling: `eslint`, `tsc`, `vitest`, `playwright`, prerender build, staging safety, migrated-content validation, bundle report

## Preconditions And Control Checks

- H-01 manifest completeness verified by reading `MANIFEST.md` and every listed file in the pack.
- Pricing research and assurance research attachments read before editing.
- Replit concurrency check completed:
  - `git status` was clean before work began.
  - `ps aux | rg -i 'replit|worktree/content|transformation/react-vite'` found no conflicting process.
  - `git worktree list` showed only the current worktree.

## Files Changed

Content and route implementation:

- `web/src/content/migrated/approved/registry.ts`
- `web/src/data/approved-routes.ts`
- `web/src/data/future-routes.ts`
- `web/src/data/route-schema.ts`
- `web/src/content/migrated/generated-index.ts`
- `web/src/app/routes.ts`
- `web/src/routes/company/how-we-work.tsx`
- `web/src/routes/industries/index.tsx`
- `web/src/routes/services/detail.tsx`
- `web/src/components/layout/app-shell.tsx`
- `web/src/routes/templates/core-marketing-page.tsx`
- `web/src/routes/templates/article-page.tsx`
- `web/src/seo/metadata.ts`
- `web/src/seo/schema.ts`
- `web/src/seo/sitemap.ts`
- `web/react-router.config.ts`
- `web/src/app/root.tsx`

Tests:

- `web/tests/unit/app-shell.test.tsx`
- `web/tests/unit/migrated-content-renderer.test.tsx`
- `web/tests/unit/migrated-content.test.ts`
- `web/tests/unit/route-manifest.test.ts`
- `web/tests/unit/route-seo.test.ts`
- `web/tests/e2e/foundation.spec.ts`
- `web/tests/e2e/route-parity.spec.ts`

## Implementation Summary

### 1. Approved content overlay

Added an approved content registry layered over the generated migrated corpus so Codex-owned content could be replaced without broad refactors.

Implemented approved-safe copy for:

- Core routes: `/`, `/about`, `/services`, `/pricing`, `/blog`, `/book`, `/contact`
- New hubs: `/industries`, `/how-we-work`
- New services:
  - `/services/web-design-development`
  - `/services/app-development`
  - `/services/ai-voice-agents`
  - `/services/ai-receptionists`
  - `/services/content-creation`
  - `/services/ai-automation`
- Industry pages:
  - `/services/estate-agents`
  - `/services/hospitality`
  - `/services/salons-barbers`
  - `/services/trades`
  - `/services/ecommerce`
  - `/services/physios-chiropractors`
  - `/services/dentists`
  - `/services/gyms-fitness-studios`
  - `/services/fitness-coaches`

### 2. Navigation and IA

- Replaced the old placeholder shell navigation.
- Added explicit top-level separation between `Services` and `Industries`.
- Added persistent links to `How we work`, `Insights`, `About`, and `Book a discovery call`.
- Added related-route and breadcrumb coverage for the approved architecture.

### 3. SEO and schema

- Merged the approved route overlay into the runtime future route manifest.
- Added schema/breadcrumb support for `AboutPage`, `CollectionPage`, `Service`, `WebSite`, `Organization`, and route-specific page graphs.
- Excluded under-review article routes from the production sitemap.
- Forced staging-safe robots behavior without duplicate robots tags in prerendered HTML.
- Extended prerender coverage to the new approved routes.

### 4. Claim safety and proof controls

- Introduced proof placeholders that read as placeholders, not as real proof.
- Gated unsupported article bodies behind an editorial-review page state plus `noindex`.
- Removed public-facing unsupported proof patterns from rewritten copy.

## Claim Removals And Quarantines

Removed from public copy:

- Public numerical pricing
- ROI, payback, savings, and delivery-time claims that lacked explicit approval metadata
- Blanket guarantees and contractual assurance promises
- Invented case studies, client names, logos, testimonials, rankings, awards, performance metrics, and team-scale claims

Quarantined instead of publishing:

- Legacy article bodies whose `claimsStatus` did not pass the safe-copy gate
- Any future portfolio / demonstration references unless clearly labelled as illustrative
- Assurance wording beyond process-controlled delivery statements

## Pricing Handling

Applied the pricing recommendation exactly in public content terms:

- `/pricing` is now a scoping / fit / proposal-process page.
- No public numerical prices, ROI figures, or package numbers are published.
- Proposal-specific commercial detail is deferred to written scoping and approval.

## Assurance Handling

Applied the assurance recommendation in draft-safe form:

- Public wording uses `Silverstone Delivery Assurance`.
- Public scope is limited to controllable delivery items such as written scope, milestone approvals, defined revision rounds, defect correction, and change control.
- Contractual remedies, commercial guarantees, and formal assurance terms remain legal-review items before production publication.

## Human Review Gates

Human-review gates now exist in route/content metadata through:

- `contentStatus`
- `claimsStatus`
- `riskNotes`
- `unresolvedNotes`

Draft / legal-review flags retained where required:

- Pricing: public numerical proposals remain unapproved and unpublished.
- Assurance: formal contractual language remains draft-only and legal-review dependent.
- Articles: under-review article routes are withheld and excluded from production indexing.

## Before / After Copy-Length Comparison

Method:

- `before` = text extracted from the pre-overlay generated migrated content for the overlapping legacy routes.
- `after` = text extracted from the approved overlay content for the implemented routes.
- Comparison excludes `/privacy-policy` because it was not re-authored as part of this content architecture pass.

Totals:

- Updated overlapping routes: `105,012` chars before -> `32,828` chars after (`-72,184`)
- New routes added by the approved architecture: `12,701` chars

Per-route comparison:

| Route | Status | Before | After | Delta |
| --- | --- | ---: | ---: | ---: |
| `/` | updated | 7105 | 2233 | -4872 |
| `/about` | updated | 2555 | 1368 | -1187 |
| `/services` | updated | 10883 | 1558 | -9325 |
| `/pricing` | updated | 2079 | 2003 | -76 |
| `/blog` | updated | 28031 | 1148 | -26883 |
| `/book` | updated | 1857 | 704 | -1153 |
| `/contact` | updated | 747 | 727 | -20 |
| `/services/dentists` | updated | 5598 | 2603 | -2995 |
| `/services/ecommerce` | updated | 5858 | 2551 | -3307 |
| `/services/estate-agents` | updated | 5740 | 2661 | -3079 |
| `/services/fitness-coaches` | updated | 5592 | 2533 | -3059 |
| `/services/gyms-fitness-studios` | updated | 5667 | 2515 | -3152 |
| `/services/hospitality` | updated | 6303 | 2519 | -3784 |
| `/services/physios-chiropractors` | updated | 5771 | 2621 | -3150 |
| `/services/salons-barbers` | updated | 5747 | 2528 | -3219 |
| `/services/trades` | updated | 5479 | 2556 | -2923 |
| `/industries` | new | 0 | 937 | 937 |
| `/how-we-work` | new | 0 | 1658 | 1658 |
| `/services/web-design-development` | new | 0 | 1847 | 1847 |
| `/services/app-development` | new | 0 | 1720 | 1720 |
| `/services/ai-voice-agents` | new | 0 | 1621 | 1621 |
| `/services/ai-receptionists` | new | 0 | 1608 | 1608 |
| `/services/content-creation` | new | 0 | 1677 | 1677 |
| `/services/ai-automation` | new | 0 | 1633 | 1633 |

## Verification Commands

Executed:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run migration:validate`
- `npm run bundle:report`
- `npm run staging:safety`
- `npm run test:e2e`

Observed results:

- `typecheck`: passed
- `lint`: passed
- `unit tests`: 33/33 passed
- `build`: passed
- `migrated content validation`: passed
- `bundle report`: `154.01 KB gzip (target-pass)`
- `staging safety`: passed
- `Playwright e2e`: 32/32 passed across desktop and mobile

## Regression Notes

- `/web/src/visual/**` was not edited.
- Staging pages remain `noindex,nofollow,noarchive` in built output, while production sitemap logic remains route-aware.
- Internal-link validation and route uniqueness checks passed via unit coverage.

## Rollback

If rollback is required after the requested commit is created:

1. Revert the commit created for this task with `git revert <commit-hash>`.
2. Re-run:
   - `npm run test`
   - `npm run build`
   - `npm run staging:safety`

## Commit

Commit message used for this task:

`feat(web): implement approved content and offer architecture`
