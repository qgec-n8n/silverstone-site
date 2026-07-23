# Session 2 changes — Stage 2, heading semantics and document outline

Branch `seo/seojuice-699-session-1`, parent `6175883e`. Nothing pushed, nothing
deployed, no production setting touched. `main` and `origin/main` remain at
`49c3f617`.

Stage 2 covers **235 cards / 238 URL instances** whose root causes are RC-03
(consent-modal h1), RC-04 (second h1 from the route intro splash, plus the
related footer/heading-skip contributors) and RC-08 (contrast).

**Headline result:** every route now renders **exactly one `h1` in the hydrated
DOM**, in every gate state, at both viewports — measured 32/32 states, up from
2 h1s on 30 of those 32. See `session-2-validation.md`.

---

## 2.1 — Intro splash `h1` → `div` (RC-04)

**File:** `web/src/visual/components/route-experience-intro.tsx`

**Why.** The route intro splash rendered its teaser title as `<m.h1>`. The route's
real `h1` is the body hero, and it is the one in the prerendered HTML — so every
gated non-home route shipped 1 prerendered h1 and hydrated to 2. The build's
one-h1 gate (`generate-seo-artifacts.mjs:392-397`) counts prerendered headings
only and could never see it.

**How.** The tag changed; both class names stayed. The `<section>` already carries
`aria-label="<title> intro"`, so the region keeps its accessible name without a
heading. `.ss-hv2-display` and `.ss-service-intro__title` between them already set
every property the `h1` base rule contributed (`utilities.css:147-153`), which is
why the swap is inert — **proved**, not assumed: the intro screenshots for all 12
affected route × viewport states are **byte-identical PNGs**, and the element's
computed box and typography are unchanged to the last property.

- Cards touched: RC-04 appears on 232 of the 235 Stage-2 cards.
- UI/UX impact: **none** (12/12 byte-identical captures).

## 2.2 — Footer column labels `h2` → `span` (RC-04)

**File:** `web/src/components/layout/shell/site-footer.tsx`

**Why.** Three `<h2>`s on every route, at the same outline level as the page's own
section headings, for columns that are already `<nav aria-label="…">` landmarks.

**How.** `<span className="ss-eyebrow text-titanium block font-display
max-w-[var(--ss-type-measure-heading)]">`. `.ss-eyebrow` (in `@layer utilities`)
already outranked the `h2` base rule for size, weight, tracking, leading and
casing; the three added utilities reproduce the only two things the `h2` rule
still contributed here — the display font family and the 18ch measure.

Measured before and after on `/about` at 1440×900, all three columns:
`display: block`, Sora, 12px/650/1.44px/15.6px, `max-width: 145.899px`,
`width: 145.891px`, box `145.89 × 15.59`, and a `31.59px` gap to the link list —
identical in every value. The footer element screenshot is byte-identical.

- UI/UX impact: **none.**
- Test updated: `homepage-interaction.spec.ts` addressed the label by `h2`; it now
  addresses it by position (`firstElementChild`), which is tag-agnostic.

## 2.3 — Silktide consent modal: `h1` → `h2` + dialog semantics (RC-03)

**File:** `web/src/components/layout/shell/cookie-consent-manager.tsx`

**Why.** Silktide v2.0.1 builds the preferences modal as `<header><h1>…`, and
`init()` calls `createModal()` unconditionally while `createWrapper()` inserts the
wrapper as `document.body.firstChild`. So from the moment consent initialised,
that `h1` was **the first h1 in document order**, ahead of the page's own title,
even though the modal is `display: none`. The audit recorded this as *latent*;
Session 2 measurement shows it is **live** — the modal h1 was present in 18 of 18
states where the gate had cleared, including `/book` and blog articles, which
clear it with no interaction at all.

**How.** The vendor script is loaded from a pinned, SRI-checked jsDelivr URL and
cannot be edited, so the tag is corrected in place immediately after `init()`
(which builds the widget synchronously). The same pass adds `role="dialog"`,
`aria-modal="true"` and `aria-labelledby`, none of which the vendor ships — the
modal previously had no accessible name at all. Silktide's stylesheet only targets
`#stcm-modal h1`, so the existing override block now mirrors that rule for `h2`.

Measured: `#stcm-modal h1` 1 → **0**, `#stcm-modal h2` 0 → **1**, with
`role=dialog` / `aria-modal=true` / `aria-labelledby=stcm-modal-title` present, in
all 18 states.

- UI/UX impact: **none** — the modal's type is unchanged by the mirrored rule.
- **Left open and flagged:** Silktide still does not make the page behind the
  modal `inert` (`inert` appears 0× in the 53 KB script), so focus is not trapped.
  Fixing that means intervening in vendor focus handling and is deferred.

## 2.4 — `ArticleGrid` heading level follows its caller (RC-04)

**Files:** `web/src/routes/templates/article-page.tsx`,
`web/src/styles/core-pages/core-pages.css`

**Why.** The grid hard-coded `<h4>`. It renders at two depths — under a section's
`h2` and under a subsection's `h3` — so at section level it skipped a level, on 31
of 34 articles.

**How.** `ArticleGrid` takes a `headingLevel: 3 | 4`, threaded through
`ArticleSectionEnhancements`; the section call site passes `3`, the subsection call
site `4`. The CSS selector widened from `.ss-blog-article__grid-item h4` to
`.ss-blog-article__grid-item :is(h3, h4)` — identical specificity (0,1,1), so no
cascade change. The `h3` and `h4` base rules differ only in `font-size`, which this
rule overrides anyway.

Measured on `/blog/ai-receptionist-setup-guide`: 7 grid headings, `H4` → `H3`, with
every computed property and the element box unchanged.

- UI/UX impact: **none.**

## 2.5 — Live-voice demo `h4` → `h3` (RC-04)

**Files:** `web/src/features/services-v2/demos/live-voice-session.tsx`,
`web/src/features/services-v2/demos/live-voice-chrome.tsx`

**Why.** `ConsoleFrame` renders `.ss-lvd__empty-title` in the body and
`.ss-lvd__foot-heading` (an `h3`) in the foot. The console sits under a section
`h2`, so the measured outline read `h2 → h4 → h3` on `/services/ai-receptionists`
and `/services/ai-voice-agents`.

**How.** Both copies of `.ss-lvd__empty-title` became `h3`, matching the foot
heading. `.ss-lvd__empty-title` already sets font-family, size, weight and colour;
the `h3` and `h4` base rules agree on tracking and leading, so nothing moves.

- UI/UX impact: **none** (computed box and type identical).

## 2.6 — Gradient text gets a real `color` (RC-08)

**Files:** `web/src/styles/tokens/cinematic.css`,
`web/src/styles/services-v2/services-v2.css`,
`web/src/styles/core-pages/core-pages.css`

**Why.** Gradient-clipped text was written as `background-clip: text` +
`color: transparent`. A contrast checker reads `color`, so it scores that text
**1:1** — a guaranteed failure regardless of what is actually painted. The audit
measured the rendered gradients at 6.94:1 and 10.05:1 and identified this as the
trigger for the two contrast findings, on `/` and `/services/ai-receptionists`.

**How.** `color` now carries a solid stop from each gradient and
`-webkit-text-fill-color: transparent` does the hiding. The fill property wins over
`color` wherever `background-clip: text` is supported — which is everywhere these
rules are used — so painting is unchanged; and if an engine ever dropped the fill
property, the fallback is legible solid text rather than invisible text. The
pattern was already in the codebase at `.ss-blog-article__hero h1 em`.

Computed contrast of the newly declared colours on void black `#05070a`:

| Rule | Declared `color` | Ratio |
|---|---|---:|
| `.ss-chrome-text` | `--ss-v2-chrome` `#f5f7fb` | 18.80:1 |
| `.ss-signal-text` | `--ss-v2-signal-cyan` `#22d3ee` | 11.16:1 |
| `.ss-srv2-*  em` | `--srv2-accent` (per route) | 7.70 – 14.23:1 |
| booking rules | `--booking-accent-soft` `#5ec5d0` | 9.96:1 |

**Scope note — this went beyond the three rules the plan named.** The plan listed
`cinematic.css:232-245`, `services-v2.css:4846-4857` and `core-pages.css:6714-6724`,
which cover the two flagged pages. The same `color: transparent` idiom appeared in
**nine more** rules (five on `/book`, the featured-insights heading and article
`em`s on `/blog` and articles, the article drop cap, and the folio scene headline).
Fixing three of twelve would have left `/book` and every article scoring 1:1 and
generating the same finding on the next crawl, so all twelve were converted. Each
is one declaration, and each is covered by the invariance evidence.

- UI/UX impact: **none.** Across 4,264 computed-property comparisons the only
  changes are `color`; `-webkit-text-fill-color` computes to `rgba(0, 0, 0, 0)`
  both before and after (it defaults to `color`, which was `transparent`), so the
  painted result is provably identical. Confirmed visually on the homepage brand
  lockup and footer wordmark, the service hero `em`, the article hero `em`, the
  featured-insights sheen, the booking intro `em` and the folio headline.
- Test updated: `web-showcase.spec.ts` asserted `color: rgba(0, 0, 0, 0)` on the
  folio headline — the exact idiom being removed. It now asserts the solid `color`
  **and** `-webkit-text-fill-color: rgba(0, 0, 0, 0)`, which is what actually
  governs painting.

## 2.7 — Header `aria-hidden` and `inert` now move together (RC-04 family)

**File:** `web/src/components/layout/shell/site-header.tsx`

**Why.** `aria-hidden` was a JSX attribute driven by `hidden`, so it flipped in the
same commit as the flag, while `inert` was deferred by `HEADER_HIDE_ANIM_MS`
(240 ms) to avoid dropping a click on a header that is still on-screen. For those
240 ms the header was removed from the accessibility tree **while still
focusable** — the `aria-hidden-focus` violation.

**How.** `aria-hidden` moved into the same effect that owns `inert`, set and
cleared with it. The deferral, and the reason for it, are untouched.

Measured: 993 samples across two full hide/show cycles on a desktop article, via a
`MutationObserver` plus an 8 ms poll. The header occupies only
`aria-hidden=absent / inert=false` or `aria-hidden=true / inert=true`. **Zero**
samples in the contradictory state.

- UI/UX impact: **none.** The header is not prerendered at all (`<header>` appears
  0× in `build/client/**/index.html`), so moving the attribute out of the render
  changes no served byte.

## 2.8 — Latent double-`h1` on the non-experience service branch

**File:** `web/src/routes/templates/service-page.tsx`

`ServicePage`'s fallback branch (taken when a service route stops qualifying for
the experience) left `RoutePageFrame`'s default header on while
`ServicePageVisuals` renders its own hero `h1`. The gated branch already passes
`showHeader={false}`; the fallback now does too. Latent today, silent if it fires.

---

## Guard — `crawlable-content.spec.ts` rewritten

The spec that was supposed to catch all of this asserted on
`document.body.innerText` and a document-wide link count. It could not distinguish
a prerendered page from a client-assembled one, its `>10 links` check was
tautological (the footer alone ships ~24), its `ariaHiddenBodies` selector missed
`.ss-hv2__body` and `footer.ss-footer`, and all 34 articles were absent.

Now:

1. **Served bytes, all 59 URLs** (25 marketing + 34 articles) via
   `request.get()`: 200, a `<main>`, >1,500 characters of tag-stripped `<main>`
   text, exactly one `<h1>` inside `<main>`, and a non-empty `<title>`.
2. **Hydrated DOM**, marketing routes + a representative article: content floor,
   `main a[href] > 3` (scoped, so the footer cannot carry it), zero aria-hidden or
   display-none bodies across the widened selector, **exactly one `h1` in the
   document and in `<main>`**, and `document.title` **equal to the prerendered
   `<title>`** — the assertion that would have caught RC-06 automatically.
3. The existing one-non-scrollable-screen contract, unchanged.

`route-entry.spec.ts` addressed the intro splash by heading role; it now addresses
it by class and asserts its text, since it is deliberately no longer a heading.

---

## Deliberately NOT done

| Item | Reason |
|---|---|
| Focus trap / `inert` behind the consent modal | Needs intervention in vendor focus handling; out of a heading-semantics stage. Flagged above and in the Stage 3 handover. |
| `role="dialog"` on the consent **banner** | Same vendor-behaviour risk; the banner is not modal and its buttons are labelled. |
| Removing the booking stage `h4`s | `h3 → h4` there is a legal step, not a skip (verified in the measured outline). |
| Stage 3 items | Untouched: meta-description trims, visible FAQ copy, `researchSources`, article hero `<img>`, `dateModified`, `schemaTypes` drift, dead modules. |
