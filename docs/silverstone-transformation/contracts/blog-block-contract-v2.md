# Blog block contract v2

Status: authoritative hand-off contract for automation-written Silverstone AI blog posts.

Renderer source: `web/src/routes/templates/article-page.tsx`
Type source: `web/src/data/blog-posts.ts`
Inline formatter: `web/src/features/services-v2/components/primitives.tsx`

This contract is additive. Every v2 field is optional. Omitting every v2 field and marker preserves the existing article render path. The automation must not emit `null` for optional fields; omit the field instead.

## 1. Complete post shape

```ts
type SilverstoneBlogPost = {
  articleBody: SilverstoneBlogSection[];
  categoryId: string;
  categoryKey: string;
  categoryLabel: string;
  categoryOrder: number;
  ctaPrimary: { href: string; label: string };
  ctaSecondary: { href: string; label: string };
  displayDate: string;
  faqs: { answer: string; question: string }[];
  heroImage: string;
  heroImageAlt: string;
  imagePrompt: string;
  internalLinks: { href: string; label: string }[];
  metaDescription: string;
  metaTitle: string;
  presentation?: {
    ctaPlacement?: string;
    family?: string;
    fingerprint?: string;
  };
  primaryKeyword: string;
  publishedIsoDate: string;
  readTime: string;
  researchSources: SilverstoneBlogSource[];
  secondaryKeywords: string[];
  slug: string;
  status: "draft" | "published";
  subtitle: string;
  summary: string[];
  title: string;
  updatedIsoDate: string;
};
```

All top-level fields remain required except `presentation` and its children. The template does not truncate top-level strings or arrays.

Visible or metadata use:

- `title`, `subtitle`, `heroImage`, `categoryLabel`, `displayDate`, `readTime`, `primaryKeyword`, `summary`, `ctaPrimary`, `ctaSecondary`, `articleBody`, and `internalLinks` render on the page.
- `title`, `metaDescription`, `heroImage`, `publishedIsoDate`, and `updatedIsoDate` also feed BlogPosting JSON-LD. Route-level metadata uses the SEO and hero fields separately.
- `presentation.family` becomes the article's `data-family` styling hook. `presentation.ctaPlacement` and `presentation.fingerprint` are retained but ignored by this renderer.
- `imagePrompt`, `secondaryKeywords`, `faqs`, and `researchSources` are retained data but are not rendered by `ArticlePage`.
- The closing CTA card is fixed renderer copy; it does not use `presentation.ctaPlacement`.
- `internalLinks` are assumed to be trusted internal routes and render with React Router. Keep their `href` values site-relative.

Research source shape, retained for provenance:

```ts
type SilverstoneBlogSource = {
  title: string;
  url: string;
  date?: string;
  domain?: string;
  matchedTerms?: string[];
  publishedDate?: string;
  relevance?: string;
  summary?: string;
  verifiedAt?: string;
  organisationName?: string;
  pricingVisibility?: string;
  providerType?: string;
  registryProvider?: boolean;
  smeFit?: string;
  verifiedCapabilities?: string;
};
```

## 2. Inline copy syntax

The formatter is deliberately smaller than Markdown. Tokens cannot nest. Unsupported or malformed tokens render literally.

| Purpose                               | Exact syntax                 | Output                                          |
| ------------------------------------- | ---------------------------- | ----------------------------------------------- | ---------------------------- |
| Strong                                | `**important**`              | `<strong>`                                      |
| Italic / established heading emphasis | `*phrase*`                   | `<em>`                                          |
| Inline code                           | `` `field_name` ``           | `<code>`                                        |
| Highlight                             | `==evidence==`               | semantic `<mark>` with amber evidence treatment |
| Underline                             | `{{underline:exact phrase}}` | semantic `<u>` with cyan underline              |
| Accent keyword                        | `{{accent:conversion path}}` | semantic accent `<span>`                        |
| Icon chip                             | `{{chip:proof                | Verified}}`                                     | compact icon-and-label badge |

Allowed chip kinds are exactly `action`, `idea`, `proof`, and `warning`. The text after `|` is the visible label. Examples:

```text
{{chip:action|Next step}}
{{chip:idea|Working idea}}
{{chip:proof|Verified}}
{{chip:warning|Constraint}}
```

The new marker prefixes are intentionally distinct from the body list grammar. A line beginning `==`, `{{underline:`, `{{accent:`, or `{{chip:` remains a paragraph. It cannot be parsed as either of these list forms:

```text
- bullet
* bullet
• bullet
‣ bullet
▪ bullet
◦ bullet
1. ordered item
1) ordered item
```

Inline formatting applies to fields described as **rich** below. Plain-label and verbatim fields do not parse it.

### Inline links

Rich body fields accept either exact form:

```text
[Visible label](https://example.com/path)
<a href="https://example.com/path">Visible label</a>
```

The HTML-like form must use a double-quoted `href` and no extra attributes. The label may contain inline-formatting tokens. Link syntax is not parsed in headings, plain labels, prompt text, or other fields explicitly marked plain/verbatim below.

## 3. Link and nofollow rules

The renderer classifies every rich-text link, ranked-card `website`, entity `url`, and quote-card `url` before rendering:

1. A site-relative path beginning with exactly one `/` is internal and renders as a React Router `<Link>`.
2. An absolute `https://` URL on `silverstone-ai.com` or any `*.silverstone-ai.com` host is internal. The renderer rewrites it to `pathname + search + hash` and renders a `<Link>`.
3. Any other absolute `https://` URL is external. It renders as `<a target="_blank" rel="noopener noreferrer nofollow">` with an external glyph and a visually distinct amber/dotted treatment.
4. `javascript:`, `data:`, `http:`, `mailto:`, every other non-HTTPS scheme, protocol-relative `//host/path`, malformed URLs, and slash-backslash paths are rejected.
5. A rejected inline link keeps its visible label as plain rich text. A rejected button URL omits the button.

SEO rule: third-party links always receive `nofollow`; relative and Silverstone-owned links never receive `nofollow` and never open a new tab.

## 4. Section shape and render order

```ts
type SilverstoneBlogSection = {
  heading: string;
  body: string[];
  bullets?: SilverstoneBlogBullet[];
  callout?: SilverstoneBlogCallout;
  checklist?: SilverstoneBlogChecklist;
  comparisonTable?: SilverstoneBlogTable;
  definitions?: SilverstoneBlogDefinitionList;
  entityLinks?: SilverstoneBlogEntityLink[];
  grid?: SilverstoneBlogGridItem[];
  keyTakeaways?: SilverstoneBlogKeyTakeaways;
  leadStyle?: "drop-cap" | "lead";
  lede?: string;
  metricPanel?: SilverstoneBlogMetricPanel;
  promptBlocks?: SilverstoneBlogPromptBlock[];
  pullQuote?: string;
  quoteCard?: SilverstoneBlogQuoteCard;
  rankedCards?: SilverstoneBlogRankedCard[];
  scorecard?: SilverstoneBlogScorecard;
  sectionNumber?: string;
  statBand?: SilverstoneBlogStatBand;
  steps?: SilverstoneBlogStep[];
  subsections?: SilverstoneBlogSection[];
  timeline?: SilverstoneBlogTimeline;
  variant?: "operator" | "signal" | "system";
  versusCard?: SilverstoneBlogVersusCard;
};
```

`heading` is required and inline-rich. `body` is required, even if it is an empty array. Empty/whitespace-only body entries are removed after splitting on newlines.

Render order within a top-level section card is:

1. optional `sectionNumber` plus `heading`
2. optional `lede`
3. `callout` when `tone === "answer"`
4. parsed `body`
5. `keyTakeaways`
6. `metricPanel`
7. `pullQuote`
8. `quoteCard`
9. `bullets`
10. `rankedCards`
11. `promptBlocks`
12. `steps`
13. `timeline`
14. `versusCard`
15. `definitions`
16. `grid`
17. `checklist`
18. non-answer `callout`
19. `entityLinks`
20. subsections, each using the same enhancement order

After the entire section card closes, full-width blocks render in this order: the section `scorecard`, `comparisonTable`, and `statBand`, then the same three blocks for each immediate subsection in subsection order. These blocks are deliberately hoisted so their 70rem breakout resolves against the full-width article column. Do not move them inside `.ss-blog-article__section`.

Only one subsection level renders. A `subsections` field nested inside a subsection is ignored. A subsection's `lede` is also currently ignored. Do not emit either until the renderer contract changes.

Presentation fields:

- `sectionNumber` is plain text displayed before the heading. Prefer two digits such as `"02"`; the renderer does not generate or truncate it.
- `lede` is rich text and receives the larger lead type scale.
- `leadStyle: "lead"` opts a subsection's first body paragraph into the lead scale. Top-level sections already style the first body paragraph as a lead when no `lede` exists.
- `leadStyle: "drop-cap"` applies the same lead treatment plus a drop cap to the `lede`, or to the first body paragraph when no `lede` exists.
- A heading equal to `Introduction` case-insensitively retains the established introduction treatment and automatic drop cap even without `leadStyle`.
- `variant` changes the card surface. If omitted, top-level section indexes `0, 3, 6…` receive the `signal` surface; other sections use the base surface. Subsection variants are not applied because subsections do not render a section-card wrapper.

## 5. Existing blocks

### Body paragraphs and lists

```ts
body: string[] // required, rich
```

Each array entry is split on newlines. Consecutive bullet lines merge into one `<ul>`; consecutive numbered lines merge into one `<ol>`. List numbering displayed by the renderer is sequential from `01`; authored numeric prefixes do not control the displayed number. Everything else becomes a paragraph. No item cap or text truncation is applied.

### Bullets

```ts
type SilverstoneBlogBullet = {
  label: string; // required, rich
  body: string;  // required, rich
  icon?: string; // optional, ignored
};

bullets?: SilverstoneBlogBullet[];
```

Items with a blank `label` or `body` are removed. At most 6 valid items render. The renderer assigns icons by position; `icon` is retained for data compatibility but ignored.

### Grid

```ts
type SilverstoneBlogGridItem = {
  title: string;  // required, rich
  body: string;   // required, rich
  label?: string; // optional, plain
};

grid?: SilverstoneBlogGridItem[];
```

Blank-title/body items are removed; at most 6 render. Missing/blank labels become `Signal 01`, `Signal 02`, and so on.

### Comparison table

```ts
type SilverstoneBlogTable = {
  columns: string[]; // rich
  rowHeader?: string; // plain; defaults to "Decision point"
  rows: {
    label: string; // rich
    cells: string[]; // rich
  }[];
};

comparisonTable?: SilverstoneBlogTable;
```

At least 2 nonblank columns and 1 valid row are required. A row is valid only when `label` is nonblank, it has at least one cell per surviving column, and each required cell is nonblank. Extra cells are ignored. Rows and columns are not capped. The block is wide and renders outside the section card.

### Pull quote

```ts
pullQuote?: string; // rich
```

A blank quote is omitted. There is no attribution field and no truncation; use `quoteCard` when attribution is available.

### Callout

```ts
type SilverstoneBlogCallout = {
  body: string[]; // required, rich
  label?: string; // optional, plain
  title?: string; // optional, rich
  tone: "answer" | "assumption" | "caution" | "evidence" | "recommendation";
};

callout?: SilverstoneBlogCallout;
```

Blank body entries are removed. If none remain, the block is omitted. Body entries are not capped. `answer` leads the body; every other tone follows all other in-card blocks except entity links.

### Metric panel

```ts
type SilverstoneBlogMetricPanel = {
  title?: string; // optional, plain
  items: {
    label: string; // required, plain
    value: string; // required, rich
    note?: string; // optional, plain
  }[];
};

metricPanel?: SilverstoneBlogMetricPanel;
```

Blank-label/value items are removed; at most 6 render. Values are not altered. Their character count only selects layout/type-fitting tiers: `standard` through 18 characters, `wide` at 19–36, and `full` above 36.

### Ranked cards

```ts
type SilverstoneBlogRankedCard = {
  name: string; // required, rich
  rank: number; // required
  summary: string; // required, rich
  bestFor?: string; // optional, rich
  limitations?: string; // optional, rich
  score?: string; // optional, plain
  strengths?: string[]; // optional, rich
  website?: string; // optional; link rules apply
};

rankedCards?: SilverstoneBlogRankedCard[];
```

Blank-name/summary cards are removed. The first 10 valid input cards are kept, then sorted ascending by `rank`. At most 5 nonblank strengths render per card. `website` creates a prominent `Visit {hostname}` button for an external URL or `Visit site` for a Silverstone URL. An invalid URL omits the button. The first sorted card receives the lead treatment.

### Scorecard

```ts
type SilverstoneBlogScorecard = {
  options: string[]; // rich
  rows: {
    criterion: string; // required, rich
    cells: string[]; // rich
    weight?: string; // optional, plain
  }[];
  totals?: string[]; // plain
};

scorecard?: SilverstoneBlogScorecard;
```

At least 2 nonblank options and 1 valid row are required. A row needs a nonblank criterion and one nonblank cell per option. Extra cells are ignored. The weight column appears if any valid row has a nonblank weight; blank row weights then display `—`. Totals appear only when `totals.length >= options.length`; extra totals are ignored. No row/option cap applies. The block is wide and renders outside the section card.

### Prompt blocks

```ts
type SilverstoneBlogPromptBlock = {
  label: string; // required, plain
  prompt: string; // required, verbatim
  explanation?: string; // optional, rich
  tone?: "improved" | "weak"; // defaults to "improved"
};

promptBlocks?: SilverstoneBlogPromptBlock[];
```

Blank-label/prompt blocks are removed; at most 4 render. `prompt` is trimmed at both ends but is otherwise verbatim: inline markers and links are intentionally not parsed so copied prompts stay exact.

### Checklist

```ts
type SilverstoneBlogChecklist = {
  title?: string; // optional, plain; defaults to "Checklist"
  ordered?: boolean; // optional; defaults to false
  items: {
    label: string; // required, rich
    detail?: string; // optional, rich
  }[];
};

checklist?: SilverstoneBlogChecklist;
```

Blank-label items are removed; at most 12 render. `ordered: true` uses an ordered list with displayed `01`, `02` markers.

### Steps

```ts
type SilverstoneBlogStep = {
  title: string; // required, rich
  body: string; // required, rich
  label?: string; // optional, plain
};

steps?: SilverstoneBlogStep[];
```

Blank-title/body steps are removed; at most 8 render. Use this for an ordered procedure or diagnostic sequence. Use `timeline` when a date, week, phase, or milestone label carries meaning.

## 6. New v2 blocks

### Key takeaways

```ts
type SilverstoneBlogKeyTakeaways = {
  title?: string; // optional, plain; defaults to "Key takeaways"
  items: string[]; // rich
};

keyTakeaways?: SilverstoneBlogKeyTakeaways;
```

Blank items are removed; at most 7 render. Use one box to recap a long or decision-heavy section, not as a second copy of the article-level summary.

### Big-number stat band

```ts
type SilverstoneBlogStatBand = {
  title?: string; // optional, plain
  items: {
    value: string; // required, rich; rendered verbatim
    label: string; // required, plain
    detail?: string; // optional, rich
    tone?: "benchmark" | "cost" | "growth" | "time"; // default "benchmark"
  }[];
};

statBand?: SilverstoneBlogStatBand;
```

Blank-label/value items are removed; at most 4 render. Tone controls semantic colour: benchmark/blue, cost/amber, growth/aqua, time/violet. No numeric animation, coercion, or truncation occurs. This is a 70rem wide block and is hoisted outside the section card.

### Versus card

```ts
type SilverstoneBlogVersusSide = {
  title: string; // required, rich
  body: string; // required, rich
  label?: string; // optional, plain
  points?: string[]; // optional, rich
};

type SilverstoneBlogVersusCard = {
  eyebrow?: string; // optional, plain
  left: SilverstoneBlogVersusSide; // required
  right: SilverstoneBlogVersusSide; // required
  verdict?: string; // optional, rich
};

versusCard?: SilverstoneBlogVersusCard;
```

Both sides need nonblank titles and bodies or the whole block is omitted. At most 4 nonblank points render per side. The two positions stack on narrow screens. Use the left/right structure for genuine contrast; colour encodes the two positions.

### Definition list

```ts
type SilverstoneBlogDefinitionList = {
  title?: string; // optional, plain
  items: {
    term: string; // required, rich
    definition: string; // required, rich
    note?: string; // optional, rich caption
  }[];
};

definitions?: SilverstoneBlogDefinitionList;
```

Blank-term/definition items are removed; at most 8 render. The output is a semantic `<dl>` and becomes one-column on narrow screens.

### Timeline

```ts
type SilverstoneBlogTimeline = {
  title?: string; // optional, plain
  items: {
    title: string; // required, rich
    body: string; // required, rich
    label?: string; // optional, plain date/week/phase
  }[];
};

timeline?: SilverstoneBlogTimeline;
```

Blank-title/body items are removed; at most 8 render. Array order is the timeline order. The renderer generates visible `01`, `02` nodes; `label` carries the authored time or phase.

### Attributed quote card

```ts
type SilverstoneBlogQuoteCard = {
  quote: string; // required, rich
  attribution: string; // required, plain
  role?: string; // optional, plain caption
  url?: string; // optional; link rules apply
};

quoteCard?: SilverstoneBlogQuoteCard;
```

A blank quote or attribution omits the whole block. A valid URL links the attribution; an invalid URL leaves the attribution as plain text. No length cap applies.

### Entity action buttons

```ts
type SilverstoneBlogEntityLink = {
  name: string; // required, plain button label
  url: string; // required; link rules apply
  kind?: "agency" | "platform" | "silverstone" | "source" | "tool";
};

entityLinks?: SilverstoneBlogEntityLink[];
```

Attach `entityLinks` to the section where the named entities are discussed. The renderer does not scan, guess, or replace names in body copy. It renders a labelled action row after the section's other in-card blocks.

Resolution rules:

- Invalid URLs and blank names are ignored.
- At most 4 buttons render per section.
- A case-insensitive entity `name` can render at most twice across the whole article, including subsections.
- Repeating the same case-insensitive name within one section renders once.
- Resolution walks top-level sections and their subsections in source order, so earlier declarations consume the allowance first.
- `kind` is a visible compact category label. It does not change link security behavior.
- Silverstone URLs render internally without `nofollow`; all third-party HTTPS entity buttons render externally with `nofollow`.

Do not emit entity links globally or rely on the renderer to find mentions. Declare them only on the one or two sections where the action is most useful.

## 7. Caps, truncation, and ignored fields

No renderer truncates strings. The only string transformations are surrounding whitespace removal, internal absolute URL rewriting, and generated labels described above.

| Field/block                                                              | Renderer behavior                                           |
| ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `bullets`                                                                | first 6 valid items                                         |
| `grid`                                                                   | first 6 valid items                                         |
| `metricPanel.items`                                                      | first 6 valid items                                         |
| `rankedCards`                                                            | first 10 valid input cards, then sort by `rank`             |
| `rankedCards[].strengths`                                                | first 5 nonblank entries                                    |
| `promptBlocks`                                                           | first 4 valid blocks                                        |
| `checklist.items`                                                        | first 12 valid items                                        |
| `steps`                                                                  | first 8 valid steps                                         |
| `keyTakeaways.items`                                                     | first 7 nonblank items                                      |
| `statBand.items`                                                         | first 4 valid items                                         |
| `versusCard.*.points`                                                    | first 4 nonblank points per side                            |
| `definitions.items`                                                      | first 8 valid items                                         |
| `timeline.items`                                                         | first 8 valid items                                         |
| `entityLinks`                                                            | first 4 resolvable per section; same name max 2 per article |
| `comparisonTable`, `scorecard`, `body`, `callout.body`, top-level arrays | no renderer cap                                             |
| `bullets[].icon`                                                         | ignored; icon is position-assigned                          |
| subsection `lede`                                                        | ignored                                                     |
| nested subsection `subsections`                                          | ignored beyond one rendered level                           |
| `presentation.ctaPlacement`, `presentation.fingerprint`                  | ignored by renderer                                         |
| `imagePrompt`, `secondaryKeywords`, `faqs`, `researchSources`            | retained, not visibly rendered by `ArticlePage`             |

## 8. Worked section JSON

```json
{
  "heading": "What a reliable automation rollout looks like",
  "sectionNumber": "03",
  "leadStyle": "drop-cap",
  "lede": "A reliable rollout makes the operating model visible before software starts making decisions.",
  "body": [
    "Start with ==one measurable workflow== and name the {{accent:source of truth}}.",
    "{{chip:proof|Verified}} The team should be able to explain the normal path, the exception path and the owner.",
    "- Map the current handoff",
    "- Define failure and recovery",
    "- Test with real edge cases",
    "Read the [ICO guidance](https://ico.org.uk/for-organisations/) and [our AI automation service](/services/ai-automation) before finalising controls."
  ],
  "keyTakeaways": {
    "title": "The operating rule",
    "items": [
      "Automate a bounded decision, not an ambiguous department.",
      "Keep consequential exceptions human-owned.",
      "Measure the baseline before launch."
    ]
  },
  "statBand": {
    "title": "Evidence at a glance",
    "items": [
      {
        "value": "8 hours",
        "label": "Weekly admin recovered",
        "detail": "Measured against the agreed baseline.",
        "tone": "time"
      },
      {
        "value": "24%",
        "label": "Faster response",
        "detail": "Use only when supported by a cited source.",
        "tone": "growth"
      }
    ]
  },
  "versusCard": {
    "eyebrow": "Operating choice",
    "left": {
      "label": "Preferred",
      "title": "Map, then automate",
      "body": "Ownership, inputs and recovery are explicit before build.",
      "points": ["Clear controls", "Testable outcomes"]
    },
    "right": {
      "label": "Avoid",
      "title": "Buy, then discover",
      "body": "The tool inherits undefined handoffs and hidden exceptions.",
      "points": ["Unclear ownership", "Duplicate systems"]
    },
    "verdict": "Choose the smallest workflow that can prove the operating model."
  },
  "definitions": {
    "title": "Terms used here",
    "items": [
      {
        "term": "Source of truth",
        "definition": "The system whose record wins when connected systems disagree.",
        "note": "Name one per business object."
      },
      {
        "term": "Recovery path",
        "definition": "The explicit retry, rollback, review or escalation after failure."
      }
    ]
  },
  "timeline": {
    "title": "Four-week sequence",
    "items": [
      {
        "label": "Week 1",
        "title": "Map",
        "body": "Capture the current path, exceptions and baseline."
      },
      {
        "label": "Week 2",
        "title": "Prototype",
        "body": "Build the smallest controlled path."
      },
      {
        "label": "Weeks 3–4",
        "title": "Test and release",
        "body": "Exercise edge cases, assign ownership and compare outcomes."
      }
    ]
  },
  "quoteCard": {
    "quote": "The workflow should be legible before it is automated.",
    "attribution": "Operations research source",
    "role": "Independent reference",
    "url": "https://example.com/research"
  },
  "entityLinks": [
    {
      "name": "Silverstone AI",
      "url": "https://silverstone-ai.com/services/ai-automation",
      "kind": "silverstone"
    },
    {
      "name": "Referenced platform",
      "url": "https://example.com/platform",
      "kind": "platform"
    }
  ]
}
```

The example's stat band renders after the containing section card because it is a wide block. Its third-party links receive `nofollow`; the Silverstone service link does not.
