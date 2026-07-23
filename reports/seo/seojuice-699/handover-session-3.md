# Handover — Session 3

## State

| Item | Value |
|---|---|
| Repo | `/Users/quentingeczy/Desktop/silverstone-site` (`github.com/qgec-n8n/silverstone-site`) |
| Branch | `seo/seojuice-699-session-1` |
| Parent | `6175883e` — *docs(seo): full audit of the SEOJuice 699-issue export* |
| `main` / `origin/main` | `49c3f617` — untouched |
| Working tree | untracked `claude-seo/` (unrelated plugin dir — leave it) |
| Pushed / deployed | **No.** Nothing pushed, nothing deployed, no production setting changed. |

## Read first

`count-reconciliation.md` → `root-cause-groups.md` → `staged-remediation-plan.md`
→ `session-1-changes.md` → `session-2-changes.md` → `session-2-validation.md`.
Then `issue-cards.csv` (699 rows; now carries `resolution` and
`resolution_evidence`) and `issue-instances.csv`.

Source export: `/Users/quentingeczy/Desktop/SEOJuice - All 699 Issues.rtf` — do
not modify. Convert a copy with `textutil -convert txt`.

## Settled — do not re-investigate

Everything in `handover-session-2.md` §Settled still holds, plus:

1. **Stage 2 is complete.** Every route now renders **exactly one `h1` in the
   hydrated DOM** — measured across 8 routes × 2 viewports × 2 gate states
   (32/32; it was 2 on 30 of those 32).
2. **RC-03 was live, not latent.** The Silktide modal `h1` was present in 18 of
   18 states where the gate had cleared. It is now an `h2` with
   `role="dialog"` / `aria-modal` / `aria-labelledby`.
3. **UI/UX invariance is proved, not assumed**: 4,264 computed-property
   comparisons produced 100 differences, all of them `tag` or `color`; 120 of 134
   screenshots are byte-identical, including 12 of 14 intro screens — every one
   where the `h1 → div` swap happened. The 14 that differ were re-tested against a
   same-build noise floor and inspected. See `session-2-validation.md`.
4. **`color: transparent` on gradient-clipped text is gone site-wide** (12 rules).
   `-webkit-text-fill-color: transparent` does the hiding; `color` carries a solid
   stop, 7.70–18.80:1 on void black. Do not reintroduce the old idiom — three
   specs now assert against it.
5. **The header is not prerendered** (`<header>` appears 0× in
   `build/client/**/index.html`). Header-related SSR concerns are moot.
6. `crawlable-content.spec.ts` now covers **all 59 URLs** for the served-bytes
   contract and asserts hydrated `document.title` equals the prerendered
   `<title>` — the check that would have caught RC-06 automatically.

## Stage 3 scope (386 cards / 385 instances)

From `staged-remediation-plan.md` §Stage 3, in rough value order:

1. **Article content that exists but never renders.** All 34 posts carry
   `researchSources` (never rendered) and `heroImageAlt` (the hero is a CSS
   background, so no `<img>` and no alt ever reaches the DOM). Both are real
   omissions, not opinions.
2. **`post.faqs` as visible content** — an editorial call, not schema. Google
   deprecated FAQ rich results in May 2026; **do not add FAQPage schema.**
3. **Dates.** `dateModified` equals `datePublished` on 33/34 posts (a no-op);
   `gym-membership-freeze-automation-myths` has a displayDate/ISO off-by-one.
4. **Meta descriptions**: trim 5 to ≤165 characters. All 59 are present and
   unique — this is length only.
5. **Schema polish**: `author` as a `Person` for E-E-A-T; add `inLanguage`,
   `wordCount`, `articleSection`. Emit or delete the `schemaTypes` manifest field,
   which declares `Organization`/`ItemList` that are never emitted.
6. **Dead modules**: `routes/home.tsx`, `routes/industries/industry.tsx`,
   `visual/components/home-hero.tsx`, and the test-only `seo/sitemap.ts` /
   `seo/robots.ts` parallel implementation.
7. **Redeploy, then request a SEOJuice recrawl and reconcile the score.**

## Carried forward from Stage 2 — flagged, not fixed

| Item | Why it was left | Where |
|---|---|---|
| No focus trap behind the consent modal | Silktide never sets `inert` (0 occurrences in the 53 KB script). Fixing it means intervening in vendor focus handling — out of scope for a heading-semantics stage, and it needs a keyboard-behaviour test of its own. | `cookie-consent-manager.tsx` |
| Consent **banner** has no `role`/accessible name | Same vendor-behaviour risk; the banner is not modal and its buttons carry accessible labels. | same |
| Decorative colours below AA | `--ss-v2-signal-blue` 4.38/4.09, `--ss-v2-indigo` 3.85/3.59, breadcrumb separator 3.28:1. Icon/decorative level, so not a WCAG text failure, but a scanner may still report them. | `tokens/cinematic.css` |
| A second `createModal()` would restore the vendor `h1` | Only reachable if `this.preferences` is null, which `init()` makes impossible. A vendor upgrade could change that; a `MutationObserver` would harden it. | `cookie-consent-manager.tsx` |

## Risks / constraints

- Design and interaction are **fixed constraints**. Prove invariance; do not
  assume it. The harness that did it for Stage 2 is worth rebuilding: production
  build → start the preview server **after** the build → capture → change →
  rebuild → **restart the server** → capture → diff, with a same-build second
  capture as the animation noise floor.
- **`sirv` caches its file map at startup.** Rebuilding under a running
  `scripts/preview.mjs` makes every hashed asset 404 and the page never hydrates.
  This silently produced one bad capture run in Session 2.
- Do not push or deploy without explicit instruction.
- `npm run format:check` fails on `src/data/blog-posts.ts` **at every commit on
  this branch** — pre-existing, n8n-generated, not yours.
- Playwright exits **0 even with failures** when its output is piped. Read the
  summary line, never the exit code.
- `route-entry.spec.ts` passed cleanly in Session 2; the consent-banner z-index
  failure signature recorded in the Session 2 handover did not reproduce.

## First commands

```bash
cd /Users/quentingeczy/Desktop/silverstone-site
git status --short && git log --oneline -4
git rev-parse --abbrev-ref HEAD          # expect seo/seojuice-699-session-1
cd web && npm run test                   # expect 41 files / 211 tests green
```

## Exit criteria for Session 3

1. Stage 3 items implemented or explicitly deferred with a reason.
2. `npm run test`, `typecheck`, `lint`, `build:production` green; `test:e2e` and
   `test:a11y` run, with pre-existing failures identified as such.
3. `issue-cards.csv` `resolution` / `resolution_evidence` updated for Stage 3 rows.
4. `session-3-changes.md` + `session-3-validation.md` written.
5. A deploy + recrawl plan for the user to approve — nothing deployed without it.
