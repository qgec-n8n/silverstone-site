<!-- FILE: codex/PRICING_COPY_PARSER_SPEC.md -->

# Pricing Copy Parser Specification (Deterministic)

## Purpose
Define a deterministic, no-guess parsing and validation contract for `PRICING_COPY_MAP.md` so the React widget can render correct per-page pricing content.

## Page keys (source of truth)
A page section starts with:
- `## services.html`
- `## niches/<slug>.html`

These headings define the page key string used by:
- `data-ss-pricing-page="..."`
- `pricing-copy.json` object keys
- widget runtime selection

## Required pages (must exist)
Exactly these 10 keys must be present:
1) `services.html`
2) `niches/estate-agents.html`
3) `niches/hospitality.html`
4) `niches/salons-barbers.html`
5) `niches/trades-virtual-office.html`
6) `niches/ecommerce.html`
7) `niches/physios-chiropractors.html`
8) `niches/dentists.html`
9) `niches/gyms-fitness-studios.html`
10) `niches/fitness-coaches.html`

If any are missing: validator MUST fail in `--strict`.

## Section grammar per page
Within each page heading, the parser MUST extract:

### Row 1 title block
- `### Row 1 title`
- Next non-empty line(s) contain:
  - A bold title line: `**...**`
  - Optional subtitle line starting with `_Subtitle: ..._`

### Row 1 plans
Row 1 begins after:
- `### Row 1 (highlighted)`

Each plan is a markdown bullet starting with:
- `* **Plan name:** <text>`

Then must include these fields (in any whitespace layout, but same labels):
- `**Setup fee:** <text>`
- `**Monthly retainer:** <text>`
- `**Best for:** <text>`
- `**What’s included:**`
  - followed by one or more `- <text>` items
- Optional:
  - `**Badge:** Most popular`

Row 1 must contain EXACTLY 3 plans.

### Row 2 title block
- `### Row 2 title`
- same title/subtitle extraction rules as Row 1 title.

### Row 2 groups
Row 2 begins after:
- `### Row 2 (other options summaries)`

Each group is a markdown bullet starting with:
- `* **Plan group label:** <text>`

Then must include:
- `**Plans included:**`
  - followed by one or more lines (may include sub-bullets like `- **Category:** ...`)
  - extraction rule: capture all raw text between `**Plans included:**` and `**One-liner:**`
- `**One-liner:** <text>`

Row 2 must contain EXACTLY 3 groups.

## Cross-page validation rules (strict)
Validator MUST enforce:
- Row 1 plan count == 3
- Row 2 group count == 3
- Row 1 plan #2 has badge == “Most popular”
- No other Row 1 plan has a badge field
- Setup fee and Monthly retainer fields are non-empty strings that include a currency symbol (do not normalize values)
- Includes list has at least 3 bullet items for each Row 1 plan
- Plans included raw block is non-empty for each Row 2 group

## Output schema (pricing-copy.json)
The generator MUST output:
- `codex/_generated/pricing-copy.json`
- Stable key ordering (sorted by page key)
- Stable field ordering (as shown below)

Shape:
- pages[pageKey] = {
  row1: { title, subtitle, plans: [{ name, setupFee, monthlyRetainer, bestFor, includes[], badge? }] },
  row2: { title, subtitle, groups: [{ label, plansIncludedRaw, oneLiner }] }
}

Failure policy:
- In strict mode, any parse or validation failure must exit with non-zero code.
