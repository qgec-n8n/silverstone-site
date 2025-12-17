<!-- FILE: codex/PRICING_COPY_MAP_SPEC.md -->
# Pricing Copy Map Spec (Machine-Actionable)

This repo’s pricing content is authored in `PRICING_COPY_MAP.md` and must be mapped **exactly** into **two** React pricing section instances per target page.

This doc exists to make the mapping deterministic and auditable.

## Canonical target pages

The canonical list of page keys is:

- `services.html`
- `niches/dentists.html`
- `niches/ecommerce.html`
- `niches/estate-agents.html`
- `niches/fitness-coaches.html`
- `niches/gyms-fitness-studios.html`
- `niches/hospitality.html`
- `niches/physios-chiropractors.html`
- `niches/salons-barbers.html`
- `niches/trades-virtual-office.html`

These values must match:

1. Actual repo HTML paths
2. `##` page headings inside `PRICING_COPY_MAP.md`
3. `data-ss-pricing-page` attributes on the HTML mount nodes

The canonical list is also enforced by `scripts/pricing.constants.js`.

## Required structure per page

Each page block in `PRICING_COPY_MAP.md` must contain:

### Section 1

- Title (bold line): `**...**`
- Subtitle (italic line): `_Subtitle: ..._`
- Exactly 3 plan cards (in order), each containing:

  - Plan name: `* **Plan name:** ...`
  - Setup fee: `**Setup fee:** £...`
  - Monthly retainer: `**Monthly retainer:** £...`
  - Best for: `**Best for:** ...`
  - What’s included header: `**What’s included:**`
  - A bullet list under “What’s included” (at least 1 bullet)
  - Optional badge: `**Badge:** ...`

### Section 2

- Title (bold line): `**...**`
- Subtitle (italic line): `_Subtitle: ..._`
- Exactly 3 group cards (in order), each containing:

  - Group label: `* **Plan group label:** ...`
  - One-liner: `**One-liner:** ...`
  - Plans list: `**Plans:**` followed by either:
    - a multi-line bullet list, and/or
    - an inline comma-separated list on the same line as the marker

The “Plans” list may contain “category” lines like `**Real Estate:**` as well as normal plan lines.

## Machine-actionable parsed schema

Codex must treat `PRICING_COPY_MAP.md` as source-of-truth and map it into a deterministic structure keyed by page + section.

Recommended (normalized) structure:

- pages: Record<pageKey, PagePricing>
- PagePricing:
  - section1:
    - title: string
    - subtitle: string
    - plans: Array<PlanCard> (length 3)
  - section2:
    - title: string
    - subtitle: string
    - groups: Array<GroupCard> (length 3)
- PlanCard:
  - name: string
  - setupFee: number (GBP integer)
  - monthlyRetainer: number (GBP integer)
  - bestFor: string
  - includes: string[]
  - badge?: string | null
- GroupCard:
  - groupLabel: string
  - oneLiner: string
  - plans: Array<{ kind: "category" | "item", text: string }>

## Deterministic validation (must pass)

Use the provided validator:

- `node scripts/validate-pricing-copy-map.js`

This script asserts:

- All canonical pages exist in the copy map
- Each page has both sections
- Section 1 has exactly 3 plan cards with required fields
- Section 2 has exactly 3 group cards with required fields

Optional tool outputs:

- Print parsed JSON for inspection:

  node scripts/validate-pricing-copy-map.js --print-json

- Write parsed JSON to a file:

  node scripts/validate-pricing-copy-map.js --json-out pricing-widget/src/pricing-copy-map.json

## Mapping rules into HTML mounts

Each pricing mount node must specify:

- `data-ss-pricing-page="<pageKey>"`
- `data-ss-pricing-section="1"` or `"2"`

This is required so the widget can render the correct content for the current page and section with no ambiguity.

## Text exactness rules

- Copy text must be identical to `PRICING_COPY_MAP.md` (after stripping only the markdown emphasis markers like `**` and `_` around labels).
- Do not auto-capitalize, rewrite punctuation, or alter spacing within sentences.
- Preserve hyphenation and capitalization in plan names exactly.
