# Root-cause groups — 699 cards collapse to 8

Evidence base: raw-HTML probe of **all 59 affected URLs** on live production;
hydrated-DOM measurement via Playwright on live production; the production
build's own SEO gates; source audit of `/web`.

---
## RC-01 — Stale crawl of the pre-gate-fix site (meta description + thin content)
**Cards: ~389 meta-description + 188 thin-content · Verdict: refuted-live · Confidence: high**

SEOJuice reports the homepage as **481 chars** and service pages as 530–543,
and asserts meta descriptions are "(missing)".

Measured on live production, all 59 URLs:

| Check | Result |
|---|---|
| HTTP 200 | 59/59 |
| Meta description present | **59/59** (0 missing) |
| `<main>` text | min **2,492** · median **10,189** · max 16,244 chars |
| Duplicate titles / descriptions | 0 / 0 |

Reproduction of SEOJuice's number: deleting the gated body subtree from the
homepage leaves **502 chars** — a 4% match to the reported 481. The three
reported figures all sit in a 480–550 band regardless of how much copy each
page ships, the signature of measuring only the intro splash.

The card for `/services/ai-voice-agents` quotes the page body as
`Now: "Live and ready to talk..."` — that string is the ElevenLabs voice-widget
label, proving the crawler captured only the gated shell.

**Cause:** the crawl predates commit `49c3f617` (2026-07-23 14:15), which made
the body always-mounted. The export was saved at 14:24. Nothing to fix.

---
## RC-02 — Schema and dates already implemented
**Cards: ~244 schema + 85 dates · Verdict: refuted-live · Confidence: high**

SEOJuice asks for Organization schema on the homepage and Article schema on
blog posts. Both already ship:

- `/` → `WebSite`, `Organization` (logo, sameAs, PostalAddress), `WebPage`, `BreadcrumbList`
- 7 service + 9 industry pages → `Service` (serviceType, areaServed, audience, provider), `BreadcrumbList`
- 34 articles → `BlogPosting` with headline, description, image, datePublished, dateModified, mainEntityOfPage, author, publisher+logo, plus `BreadcrumbList`
- **59/59 URLs carry JSON-LD.**

Dates are real n8n generation timestamps, monotonic 07-07 → 07-23, none
future-dated. Nothing to fix. (Two genuine sub-defects survive into Stage 3:
`dateModified` equals `datePublished` on 33/34 posts, and
`gym-membership-freeze-automation-myths` has a displayDate/ISO off-by-one.)

---
## RC-03 — Silktide consent modal injects an h1 (latent)
**Cards: ~103 · Verdict: confirmed-latent · Confidence: high**

`cookie-consent-manager.tsx` loads **Silktide Consent Manager v2.0.1**. Its
`getModalContent()` emits the only heading tag in the 53 KB script:
`<header><h1>${preferencesTitle}</h1>…`, text supplied here at
`cookie-consent-manager.tsx:118` ("Customize your cookie preferences").

`init()` calls `createModal()` **unconditionally**, and `createWrapper()` does
`document.body.insertBefore(wrapper, document.body.firstChild)` — so once it
initialises, that h1 is **the first h1 in document order**, ahead of the page
title. It is hidden by `#stcm-modal{display:none}` but present in the DOM.

**Why it is latent, not live:** injection is gated behind the experience gate
clearing (`cookie-consent-manager.tsx:219-235`). A crawler that never clicks
Explore never triggers it — confirmed by direct measurement (0 consent nodes,
0 consent h1 in the hydrated DOM before interaction). Prerendered HTML: 0
`stcm` references.

Also: neither banner nor modal has `role="dialog"`, `aria-modal`, or an
accessible name; `inert` appears 0× in the script, so the page behind the
modal stays keyboard-reachable.

---
## RC-04 — Second h1 from the route intro splash (real, rendering-only)
**Cards: ~232 · Verdict: confirmed-runtime · Confidence: high**

`visual/components/route-experience-intro.tsx:96` renders the intro splash
title as `<m.h1 className="…ss-service-intro__title">`, inside `<main>`,
alongside the real hero h1 (`secondary-hero.tsx:228`).

Measured on live `/services/ai-receptionists`:

| Source | h1 count |
|---|---|
| Prerendered HTML | **1** — `ss-srv2-hero__title` |
| Hydrated DOM, no interaction | **2** — `ss-service-intro__title` **then** `ss-srv2-hero__title` |

Applies to every gated non-home route (services, industries, hubs, core
marketing, blog articles) — not `/`, whose hero h1 is the only one.

This is the site's own code, **not** SEOJuice, and disabling SEOJuice does not
fix it. It is invisible to the build gate because the gate counts prerendered
h1s (`generate-seo-artifacts.mjs:392-397`) and the splash is client-only.

Google states multiple h1s are acceptable, so SEO urgency is **low**; the
document-outline/accessibility argument is the real one. Related contributors:
3 × footer `<h2>` on every route (`site-footer.tsx:160`) and an h2→h4 skip on
31 articles (`article-page.tsx:246`) + 2 service pages.

---
## RC-05 — FAQ advice is obsolete
**Cards: ~151 · Verdict: obsolete-advice · Confidence: high**

204 cards ask for FAQ sections and FAQPage schema. Per Google Search Central:
FAQ rich results were restricted to authoritative government/health sites in
**September 2023**, and the feature was **fully deprecated in May 2026** — "no
longer shown in Google Search results", documentation removed June 2026.

Implementing FAQPage schema would produce **no Google rich-result benefit**.
This is the clearest example of the report recommending a dead feature.

Note: all 34 posts and 10 content records *do* carry unrendered `faqs` data.
Surfacing it as **visible content** may still have user and answer-engine
value — but as content, not as schema, and that is a Stage 3 editorial call.

---
## RC-06 — SEOJuice's own script mutates live metadata (FIXED, Session 1)
**Cards: ~78 · Verdict: confirmed-3p-mutation · Confidence: high**

`cdn.seojuice.io/suggestions.v1.js`, added in `736ea18c` (2026-07-23 11:54),
rewrites `document.title` on **3 of 3** pages sampled on live production:

| Route | Prerendered title | Rewritten to |
|---|---|---|
| `/` | Silverstone AI \| Websites, Apps & AI Workflows for UK Businesses | AI Voice Systems for UK Teams \| Automation \| **Silverstone.ai** |
| `/services/ai-receptionists` | AI Receptionist Services UK \| Silverstone AI | Live Transcription Front Desk Automation Demo Now |
| `/about` | About Silverstone AI \| Practical Digital Systems | Discipline Framework: Strategy Definition & AI/Automation |

It also replaces `og:image` with an asset on `seojuiced.b-cdn.net`, and fires
`smart.seojuice.io/views` carrying URL, referrer and full user agent on every
page view **with no consent gate** — while the site's own GA4 sits behind
Consent Mode v2 denied-by-default.

The rewrites are keyword-stuffed, drift from each page's subject and break
brand casing; the report then bills the resulting title/content mismatch back
as issues to fix. **Fixed in Session 1** — see `session-1-changes.md`.

---
## RC-07 — Editorial recommendations, not defects
**Cards: ~142 · Verdict: recommendation-only · Confidence: high**

Citations, comparison tables, readability, TL;DR boxes, value-proposition
placement, internal linking, image alt. These are opinions about copy, not
verifiable defects. Several are already satisfied: **31 of 34 articles already
contain a real `<table>`** with `<th scope>` and an overflow wrapper
(`article-page.tsx:258-317`), yet 52 cards ask for comparison tables.

Genuine sub-items worth Stage 3: article hero is a CSS background with no
`<img>`, so `heroImageAlt` never reaches the DOM; `researchSources` exists on
all 34 posts but is never rendered.

---
## RC-08 — Contrast: scanner-visible, not human-visible
**Cards: 3 · Verdict: confirmed-scanner (contrast) / unverified (perf) · Confidence: high / medium**

SEOJuice flags `/` and `/services/ai-receptionists`. A full automated sweep of
the token layer found **zero** body-copy pairs below 4.5:1 — the muted token
`--ss-v2-titanium #a0a4ab` is 8.06:1 on void black.

The likely trigger is `color: transparent` gradient-clipped text, which
checkers score as 1:1: `.ss-chrome-text` (`cinematic.css:232-238`, used in the
homepage h1 and the brand lockup on every page) and
`.ss-srv2-hero__title em` (`services-v2.css:4846-4857`, dense on
ai-receptionists). The *rendered* gradients are 6.94:1 and 10.05:1 — a real
scanner failure, not a real readability failure. Exactly the two flagged pages.

Genuinely sub-AA pairs do exist but are decorative/icon-level:
`--ss-v2-signal-blue #597fad` at 4.38/4.09, `--ss-v2-indigo` at 3.85/3.59,
breadcrumb separator at 3.28:1.
