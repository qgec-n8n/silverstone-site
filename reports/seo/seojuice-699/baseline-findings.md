# Baseline findings — state of the site before Session 1 changes

Captured at `49c3f617`, which is identical to `origin/main`, so the audited
tree **is** the deployed tree.

## Live production, all 59 affected URLs (raw HTML)

| Check | Result |
|---|---|
| HTTP 200 | 59/59 |
| Meta description present | 59/59 |
| Exactly one `<h1>` | 59/59 |
| Self-referencing canonical | 59/59 |
| JSON-LD present | 59/59 |
| `noindex` | 1 (`/privacy-policy`, intentional) |
| `<main>` text < 1,500 chars | 0/59 |
| Duplicate titles / meta descriptions | 0 / 0 |
| `<main>` text min / median / max | 2,492 / 10,189 / 16,244 |
| Meta description length min / median / max | 105 / 145 / 173 |

Only raw-HTML nit: 5 meta descriptions exceed 165 chars (`/industry/dentists`
170, `/industry/estate-agents` 171, `/industry/hospitality` 173,
`/services/app-development` 167, `/services/web-design-development` 169).

## Build-level gates already enforced

`web/scripts/generate-seo-artifacts.mjs` fails the deploy on: missing/extra
prerendered docs, non-self-canonical docs, **fewer than 800 visible chars**,
**more than one prerendered `<h1>`**, duplicate sitemap URLs, blog slug/title/
description uniqueness, and future-dated posts. Redirect/410 integrity is
cross-checked against `url-migration.mts`.

This is why the thin-content and multiple-h1 families are structurally
impossible in shipped HTML — the build would have refused to produce it.

## Hydrated DOM, no interaction (live)

| Route | `<main>` innerText | internal links | h1 |
|---|---:|---:|---:|
| `/` | 9,851 | 17 | 1 |
| `/services/ai-receptionists` | 6,854 | — | **2** |
| `/about` | — | — | **2** |

Deep body content is present in the hydrated DOM with **no click**: `<main>`
is not `inert`, not `aria-hidden`, `display:block`, `visibility:visible`. The
inner body wrapper carries `inert` until the gate opens, which suppresses
interaction and the a11y tree but not text extraction or indexing.

## Test suite baseline

`vitest run` → **41 files, 211 tests, all passing** at `49c3f617`.
`crawlable-content.spec.ts` → 28/28 passing.

Pre-existing, **not** caused by this session: `npm run format:check` fails on
`web/src/data/blog-posts.ts` (n8n-generated, untouched here).

## Known weaknesses in the existing crawlability test

`web/tests/e2e/crawlable-content.spec.ts` locks the right direction but is a
weak instrument:
1. Asserts on `document.body.innerText`, **never on the served HTML** — the
   exact regression class `49c3f617` fixed would pass.
2. Not scoped to `<main>`; footer alone contributes 638 chars.
3. `expect(links).toBeGreaterThan(10)` is a tautology — the footer ships ~24
   internal links by itself.
4. `ariaHiddenBodies` selector misses `.ss-hv2__body` and `footer.ss-footer`.
5. Only checks `display:none`/`visibility:hidden`; ignores
   `content-visibility`, `opacity:0`, `clip-path`, `text-indent`.
6. No `<h1>` count assertion — would have caught RC-04.
7. 20s `expect.poll` window is far longer than a realistic render budget.
8. All 34 blog articles are absent from `gatedRoutes`.
