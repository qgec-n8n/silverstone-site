<!-- FILE: codex/PRICING_COPY_MAP_SPEC.md -->
# PRICING_COPY_MAP.md parsing & mapping specification (deterministic)

This spec exists to prevent “guessing” when mapping pricing copy to UI.

## 1) Canonical page id keys
A “page copy block” begins at a level-2 heading whose first token ends with `.html`.

Examples of valid headings:
- `## services.html (...)`
- `## niches/dentists.html`

**Parsing rule:**
- For any line matching: `^##\s+(\S+\.html)\b`
  - `pageId = match[1]` (first whitespace-delimited token ending in `.html`)
  - That exact `pageId` string is the lookup key.

## 2) Required structure per page
Each page block must contain:

### Row 1
- `#### Row 1 Title`
  - `- Title: ...` (required)
  - `- Subtitle: ...` (required)
- Three plans:
  - `#### Plan 1 — <PlanName>`
  - `#### Plan 2 — <PlanName>`
  - `#### Plan 3 — <PlanName>`

Each plan must contain:
- `Setup Fee (one-time): £<amount>` (required)
- `Monthly Retainer: £<amount>/mo` (required)
- `Best for: <text>` (required)
- `What’s included:` followed by a bullet list (>= 1 item required)
- Optional: `Badge: Most Popular`

### Row 2
- `#### Row 2 Title`
  - `- Title: ...` (required)
  - `- Subtitle: ...` (required)
- Three cards:
  - `#### Card 1 — <Label>`
  - `#### Card 2 — <Label>`
  - `#### Card 3 — <Label>`

Each Row 2 card must contain:
- `Plans included:` followed by a bullet list (>= 1 item required)
- `One-liner: <text>` (required)

## 3) Currency parsing rules (GBP)
### 3.1 Setup Fee and Monthly Retainer numeric extraction
Amounts must be extracted as integers from these formats:
- `£995`
- `£1,995`
- `£450/mo`

**Rule:**
- Find the first `£` sign on the line.
- Parse contiguous digits and commas after it.
- Remove commas.
- Convert to number.
- Reject NaN.

### 3.2 Display rules
- Always display `£` as the currency symbol.
- Monthly state:
  - display the monthly retainer amount
  - display suffix `/month`
- Setup state:
  - display the setup fee amount
  - display suffix `/setup`

## 4) Normalized data model (what the parser must output)
For each `pageId`, produce:

- `row1.title` (string)
- `row1.subtitle` (string)
- `row1.plans` (array length 3), each:
  - `name` (string)
  - `badge` (optional string; expected value: `Most Popular`)
  - `setupFee` (number)
  - `monthlyRetainer` (number)
  - `bestFor` (string)
  - `includes` (string[])

- `row2.title` (string)
- `row2.subtitle` (string)
- `row2.cards` (array length 3), each:
  - `label` (string)
  - `plansIncluded` (string[])
  - `oneLiner` (string)

## 5) Special formatting rule for Row 2 “Plans included” items
Some Row 2 bullets intentionally include category labels in markdown-style bold, for example:
- `**Real Estate:** ...`
- `**Trades:** ...`

**Allowed formatting behavior in UI:**
- Detect list items that start with `**` and contain `:**`.
- Render the category label (text between the leading `**` and the first `:**`) as emphasized text.
- Render the remainder as normal text.
- Do NOT run a general markdown renderer.

## 6) Validation rules
The validator must hard-fail if:
- Any target page id is missing from the parsed map
- Any page is missing Row 1 or Row 2 titles
- Row 1 plan count != 3 or Row 2 card count != 3
- Any required field is missing
- Any currency value fails numeric parsing
