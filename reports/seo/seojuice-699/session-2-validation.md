# Session 2 validation

Everything below was measured against a **production build** (`npm run
build:production`) served by `scripts/preview.mjs`, captured before the Stage 2
edits and again after, on the same machine and the same server generation.

Raw artefacts:
`reports/seo/seojuice-699/evidence/stage-2-dom-parity.csv` (32 states) and
`stage-2-computed-style-deltas.csv` (every changed property).

> **Method note.** The preview server (`sirv`) builds its file map at startup, so
> a rebuild while it is running makes every hashed asset 404 and the page never
> hydrates. Both captures were taken against a server started *after* its build.
> The first "after" run hit exactly this and was discarded.

---

## 1. Capture matrix

8 routes × 2 viewports × 2 gate states = **32 states**.

| | |
|---|---|
| Routes | `/`, `/services/ai-receptionists`, `/services/ai-voice-agents`, `/about`, `/blog`, `/blog/ai-receptionist-setup-guide`, `/book`, `/industry/dentists` |
| Viewports | desktop 1440×900, mobile 390×844 (DPR 2, touch) |
| Gate states | intro (no interaction) and body (after Explore) |
| Per state | viewport screenshot, element screenshots of every touched region, full heading outline, computed styles + boxes for 17 selectors |

---

## 2. Result — exactly one `h1`, everywhere

| Gate state | h1 before | h1 after |
|---|---|---|
| Gated non-home route, intro | **2** (intro splash + body hero) | **1** |
| Any route, body | **2** (consent modal + page) | **1** |
| Homepage, intro | 1 | 1 |

**32 of 32 states now report exactly one `h1`.** Before: 30 of 32 reported two.

Prerendered HTML was already correct and stays correct — 1 `<h1>` inside `<main>`
on every sampled page, and 1 in the whole document.

Heading-tag changes, all as intended and nowhere else:

| Element | Before | After | States |
|---|---|---|---|
| `.ss-service-intro__title` | `H1` | `DIV` | 12 |
| `.ss-footer__col` first child | `H2 H2 H2` | `SPAN SPAN SPAN` | 32 |
| `.ss-blog-article__grid-item` heading | `H4` ×7 | `H3` ×7 | 4 |
| `.ss-lvd__empty-title` | `H4` | `H3` | 8 |
| `#stcm-modal h1` / `h2` | `1 / 0` | `0 / 1` | 18 |

Consent modal, in all 18 states where the widget exists: `role="dialog"`,
`aria-modal="true"`, `aria-labelledby="stcm-modal-title"` — all three absent
before.

Measured outline change on `/services/ai-receptionists`:
`h2 → h4 → h3` became `h2 → h3 → h3`.

---

## 3. Proof of UI/UX invariance

### 3.1 Computed styles — 4,264 property comparisons

24 properties (font family/size/weight/style, line-height, letter-spacing, colour,
`-webkit-text-fill-color`, background image and clip, all four margins, padding,
max-width, width, text-wrap, text-align, opacity, visibility, display) plus the
element's box, across 17 selectors × 32 states.

**100 differences. Every one is either `tag` or `color`. Nothing else moved —
no geometry, no typography, no paint property.**

- `tag`: 24 comparisons — the three intended re-taggings. In each the element's
  **box is identical to the hundredth of a pixel**.
- `color`: 76 comparisons — `rgba(0, 0, 0, 0)` → a real colour on gradient-clipped
  text. `-webkit-text-fill-color` computes to `rgba(0, 0, 0, 0)` **both before and
  after** (it defaults to `color`, which was `transparent`), so the painted result
  is identical by construction.

### 3.2 Screenshots — 134 comparisons

120 of 134 are **byte-identical PNGs**. Including:

- **12 of 14 intro screens byte-identical — every one where `h1 → div` happened.**
  The two that differ are the homepage, which has no intro splash title.
- The footer element screenshot, at both viewports, in every state.

The 14 that differ were re-tested against a **noise floor**: a second capture of
the *same* build (`after` vs `after2`). Ten reproduce at the same magnitude and in
the same region, so they are animation phase, not change:

| File | before→after | after→after2 (noise) |
|---|---|---|
| `desktop/home/intro--viewport` | 9.137% | 9.203% |
| `mobile/home/intro--viewport` | 34.252% | 33.838% |
| `desktop/industry-dentists/body--viewport` | 1.188% | 1.188% |
| `desktop/article/body--viewport` | 8.859% | 8.872% |
| `mobile/svc-receptionists/body--viewport` | 1.044% | 1.044% |
| … | | |

Four differed while the noise run happened to land on the same animation frame, so
each was inspected as a side-by-side crop:

| File | Cause |
|---|---|
| `desktop/about/body--viewport` | rotating orbit diagram at a different phase; identical layout and type |
| `desktop/book/body--viewport` | animated 30-minute dial sweep at a different phase |
| `mobile/blog/body--viewport` | `BorderBeam` glow at a different position on the card edge |
| `mobile/book/body--viewport` | animated gradient sweep on the "Continue to booking" button |

### 3.3 Direct visual confirmation of every gradient rule

Rendered and inspected after the change: homepage brand lockup and footer wordmark
(`.ss-chrome-text` / `.ss-signal-text`), service hero `em`, booking intro `em`,
article hero `em`, article section `h2 em`, featured-insights sheen, article grid
(now `h3`), folio scene headline. All still paint their gradients.

### 3.4 Contrast a scanner will now read

On void black `#05070a`, every declared colour is far above the 4.5:1 AA floor —
lowest 7.70:1, highest 18.80:1. Before, all of them scored **1:1** against
`transparent`.

### 3.5 `aria-hidden` / `inert` lockstep

993 samples (`MutationObserver` + 8 ms poll) across two full header hide/show
cycles on a desktop article. The header occupies only
`aria-hidden absent / inert false` or `aria-hidden true / inert true`. **Zero**
samples in the contradictory state, against a 240 ms window on every hide before.

The header is not prerendered at all (`<header>` appears **0 times** in
`build/client/**/index.html`), so moving `aria-hidden` out of the render changes no
served byte.

### 3.6 Footer label box

`/about`, 1440×900, all three columns, before (`h2`) vs after (`span`):

| | Before | After |
|---|---|---|
| display | `block` | `block` |
| font | Sora 12px / 650 | Sora 12px / 650 |
| letter-spacing · line-height | 1.44px · 15.6px | 1.44px · 15.6px |
| max-width · width | 145.899px · 145.891px | 145.899px · 145.891px |
| box | 145.89 × 15.59 | 145.89 × 15.59 |
| gap to link list | 31.59px | 31.59px |

---

## 4. Command results

| Command | Result |
|---|---|
| `npm run test` | **41 files / 211 tests passed** (unchanged from baseline) |
| `npm run typecheck` | **pass** |
| `npm run lint` | **pass** (`--max-warnings=0`) |
| `npm run build:production` | **pass** — sitemap index (25 pages + 34 posts), robots, `_redirects` (53 + 45), 404 |
| `npm run build` (staging) | **pass** |
| `npm run format:check` | **fails on `src/data/blog-posts.ts` only** — pre-existing at `6175883e`, n8n-generated, untouched |
| `npm run test:e2e` | **285 passed, 0 failed, 37 skipped** (skips are project-gated, e.g. mobile-only) |
| `npm run test:a11y` | **4 passed, 0 serious/critical axe violations** (foundation + booking, both projects) |

### Tests changed as a consequence of the source change

Three specs asserted on the exact markup Stage 2 corrected. Each was updated to
assert the new contract, not to weaken it:

| Spec | Was | Now |
|---|---|---|
| `route-entry.spec.ts` | intro splash by `getByRole("heading")` | by `.ss-service-intro__title`, plus its text |
| `homepage-interaction.spec.ts` | footer column label via `querySelector("h2")` | via `firstElementChild` (tag-agnostic) |
| `web-showcase.spec.ts` | folio headline `color: rgba(0,0,0,0)` | solid `color` **and** `-webkit-text-fill-color: rgba(0,0,0,0)` |

### Bugs found in the new guard test and fixed

All three were faults in the new assertions, not in the site — a clean e2e run
(285 passed / 0 failed) confirms the fixes:

1. `document.title` is entity-decoded; the served bytes are not. Comparing them
   raw failed on every title containing `&`. The helper now decodes entities.
2. The content poll fell back to `document.body` when `<main>` was absent, so it
   could succeed while the loader was still up and then measure `main a[href]` as
   0. Everything the test reads is now scoped to `<main>`, and it waits for it.
3. The poll read one field and the assertions re-read the page, so the poll could
   settle against the prerendered subtree in the instant before React replaced
   it, and the assertions then measured a half-mounted tree — a flaky
   `mainLinks: 0`. The test now polls and asserts against **one** snapshot.
