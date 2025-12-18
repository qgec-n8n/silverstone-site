<!-- FILE: codex/HOMEPAGE_INDEX_SECTIONS_SPEC.md -->

# Homepage Copy + Pricing Embed Spec (index.html only)

## Purpose

Update ONLY two homepage sections in `index.html`:

1) The section currently titled "Our Services"
2) The section currently titled "Transparent, Affordable Pricing"

This spec is the single source of truth for what text and layout changes Codex must implement.

## Hard scope boundary

### In-scope edits
- `index.html`
  - Replace copy (text only) inside the existing Services cards section.
  - Replace the existing homepage pricing markup with the same 2-block pricing widget embed pattern used on `services.html` + `niches/*.html`.
  - Add required pricing widget asset includes (one CSS link in head, one JS script before body close).

- Pricing widget support files ONLY as needed to make `index.html` mounts actually render:
  - Add `index.html` to `scripts/pricing.constants.js` target list
  - Add an `index.html` page block to `PRICING_COPY_MAP.md` (duplicate content from `services.html`)
  - Sync `PRICING_COPY_MAP.md` → `pricing-widget/src/pricing-copy-map.json` using the existing validator script output flag
  - Rebuild widget outputs to `assets/js/pricing-widget.js` and `assets/css/pricing-widget.css`

- Validation/guardrail scripts for this task.

### Out-of-scope (do not do)
- Do not edit any other sections on `index.html` (hero, stats, FAQs, footer, etc.).
- Do not edit any other HTML pages (including `services.html` and `niches/*.html`) except via pricing-widget rebuild outputs if necessary.
- Do not redesign components, change CSS tokens, refactor JS, or rename classes.
- Do not change pricing plan names, prices, or included features (these are source-of-truth in `PRICING_COPY_MAP.md`).

## Repo-grounded anchors (how to find the exact sections)

### Services section anchors in `index.html`
- Look for the comment: `<!-- Grouped services section -->`
- Inside it, look for: `<h2 class="section-title" ...>Our Services</h2>`
- The cards are in: `<div class="packages-grid">` with 4 `.package-card` children:
  - `.card-ai-consulting`
  - `.card-marketing`
  - `.card-workflow`
  - `.card-systems`

### Pricing section anchors in `index.html`
- Look for the comment: `<!-- Pricing integrated into the same section -->`
- This block currently contains:
  - The heading "Transparent, Affordable Pricing"
  - A `.pricing-grid`
  - A "Popular Solutions" sub-section

This entire pricing block must be replaced.

## Required copy: Services section (ready-to-paste strings)

### Section heading + subtitle
- Replace section title text:
  - From: `Our Services`
  - To: `What we automate`

- Replace section subtitle paragraph text to exactly:
  - `Four practical ways we help UK small businesses save time, respond faster, and keep customers moving - without ripping out the tools you already use.`

### Card 1: `.package-card.card-ai-consulting`
- h3:
  - `AI Consulting & Readiness`
- tagline:
  - `Get clear on what to automate first - and what to leave alone.`
- bullets (replace only the text inside the final <span> of each bullet line):
  1) `Find the highest-ROI quick wins`
  2) `Choose the right tools (and avoid expensive detours)`
  3) `Leave with a simple, prioritised roadmap`
- CTA button label:
  - `Book the audit`
- Keep the existing CTA href unchanged.

### Card 2: `.package-card.card-marketing`
- h3:
  - `Automated Lead Follow-Up`
- tagline:
  - `Stop enquiries going cold with fast, personal follow-up.`
- bullets:
  1) `Instant replies across forms, email and messaging`
  2) `Qualification questions that route leads correctly`
  3) `Follow-ups that turn interest into booked calls`
- CTA label:
  - `Automate follow-up`
- Keep the existing CTA href unchanged.

### Card 3: `.package-card.card-workflow`
- h3:
  - `Workflow Automation & Reporting`
- tagline:
  - `Remove manual admin and get visibility across your ops.`
- bullets:
  1) `Automate repetitive tasks and handoffs`
  2) `Live dashboards from your existing data`
  3) `Reduce errors with consistent processes`
- CTA label:
  - `Remove busywork`
- Keep the existing CTA href unchanged.

### Card 4: `.package-card.card-systems`
- h3:
  - `Systems & Data Integration`
- tagline:
  - `Connect your tools so data flows without copy-paste.`
- bullets:
  1) `Link CRM, booking, email and payments`
  2) `Create a single source of truth across systems`
  3) `Keep data clean for better decisions`
- CTA label:
  - `Connect your stack`
- Keep the existing CTA href unchanged.

## Required layout + copy: Pricing section (index.html)

### 1) Replace the existing pricing markup with the pricing widget mounts

Replace everything from the comment:
  `<!-- Pricing integrated into the same section -->`
through the end of the "Popular Solutions" block
with the following structure (indentation can match surrounding HTML, but keep semantics):

    <section id="pricing">
      <h2 class="section-title" style="margin-top: 4rem;">Transparent pricing, built as packs</h2>
      <p class="section-subtitle">
        Clear setup + monthly support. Start with a flagship system, or pick a smaller module if you're fixing one leak first.
      </p>

      <div class="ss-pricing" data-ss-pricing-page="index.html" data-ss-pricing-section="1"></div>
      <div class="ss-pricing" data-ss-pricing-page="index.html" data-ss-pricing-section="2"></div>
    </section>

Notes:
- This `section#pricing` may be nested within an existing section/container on the homepage; that is acceptable.
- Do not include the old `.pricing-grid` or the old "Popular Solutions" HTML after this change.

### 2) Add the pricing widget CSS include in `index.html` head

Add:
  `<link rel="stylesheet" href="assets/css/pricing-widget.css">`

Placement:
- In the `<head>`, after the existing main site stylesheet:
  `<link rel="stylesheet" href="assets/css/styles.css" />`

### 3) Add the pricing widget JS include near the end of `index.html`

Add:
  `<script src="assets/js/pricing-widget.js"></script>`

Placement:
- Near the bottom of `<body>`, after:
  `<script src="assets/js/app.js"></script>`

## Pricing data requirements (so the index mounts render)

Because the embed uses `data-ss-pricing-page="index.html"`, the widget copy map MUST contain an `index.html` key.

Implement exactly:

1) Update `scripts/pricing.constants.js`
- Add `index.html` to `TARGET_PAGES` so validators treat it as a required pricing page.

2) Update `PRICING_COPY_MAP.md`
- Add a new page block for `## index.html`.
- The fastest + safest path: copy the entire `## services.html` block and paste it as `## index.html` (no edits inside the block).
- Place it directly above the existing `## services.html` block to keep it easy to compare.

3) Sync pricing-widget JSON from the markdown source-of-truth
- Run:
  `node scripts/validate-pricing-copy-map.js --json-out pricing-widget/src/pricing-copy-map.json`

4) Rebuild pricing widget outputs
- Run:
  `(cd pricing-widget && npm install && npm run build)`

## Acceptance criteria (must all be true)

### A) Services section copy
- The services section title reads exactly: `What we automate`
- The services section subtitle matches exactly (including hyphen usage).
- All four card titles, taglines, bullet texts, and CTA labels match the strings above.
- No additional cards are added/removed; icons and structure remain intact.

### B) Pricing widget embed
- `index.html` contains exactly two `.ss-pricing` mounts inside a `section#pricing`.
- Both mounts use `data-ss-pricing-page="index.html"` and sections `"1"` and `"2"`.
- `index.html` includes `assets/css/pricing-widget.css` and `assets/js/pricing-widget.js` using root-relative paths (no `../`).

### C) Pricing data + build
- `PRICING_COPY_MAP.md` includes `## index.html` and it is an exact duplicate of the `## services.html` block.
- `pricing-widget/src/pricing-copy-map.json` contains an `"index.html"` key.
- Widget assets are regenerated and present:
  - `assets/js/pricing-widget.js`
  - `assets/css/pricing-widget.css`

### D) Validation pass
All must pass:
- `node scripts/validate-homepage-index-sections.js`
- `node scripts/validate-pricing-copy-map.js`
- `node scripts/validate-pricing-mounts.js`

Recommended regression checks (should also pass):
- `node scripts/validate-core-pages.js`
- `node scripts/validate-services-page.js --strict`
- `node scripts/validate-niche-pages.js --strict`
