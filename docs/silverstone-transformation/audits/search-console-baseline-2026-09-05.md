# Search Console Baseline — 2026-09-05

Recorded at the start of the dual-market (US + UK) search visibility overhaul so a
later session can measure the change against a fixed reference rather than against
memory. Source: Google Search Console, first-party, retrieved via Windsor.ai
(`searchconsole` / `sc-domain:silverstone-ai.com`).

**Window:** last 90 days as at 2026-09-05.

## Site totals

| Metric | Value |
| --- | --- |
| Impressions | 9,751 |
| Clicks | 61 |
| CTR | 0.63% |
| Non-branded clicks | 52 |

## By market

| Market | Impressions | Share | Clicks | Avg. position |
| --- | --- | --- | --- | --- |
| United Kingdom | 7,668 | 79% | 35 | 46.0 |
| United States | 936 | 10% | 6 | 20.1 |

The site ranks roughly twice as well in the US as in the UK, on a tenth of the
impressions, using pages that at the time of this baseline never named the US.

## Demand concentration

54% of all demand sits in five clusters at weighted positions 50–64.

## Single largest impression driver

| URL | Impressions | Share of site | Avg. position | Clicks |
| --- | --- | --- | --- | --- |
| `/blog/best-ai-consulting-firms-for-uk` | 2,548 | 26% | 46.8 | 0 |

## Query-shape signal

Conversational, question-shaped queries already rank at positions 8–11 while head
terms sit at 50–64. This gap is the basis of the GEO/answer-engine work.

| Query | Position |
| --- | --- |
| how can dental practices recover missed calls faster? | 8.0 |
| what automated patient reminders and recall management… | 9.2 |
| what is the most affordable conversational ai application… | 10.0 |
| what are the best ai booking tools for hvac, plumbing…? | 10.0 |
| what is the process for developing a bespoke mobile app… | 10.8 |

## State of the site at baseline

Technically sound: `robots.txt`, `llms.txt`, canonicals, the JSON-LD schema graph,
prerendered HTML and the 301 layer were all verified correct. The identified
weaknesses were editorial and targeting, not technical:

1. UK-only targeting statements on every route while US demand converts better.
2. Commercial H1s carrying none of their target terms.
3. Service pages at ~900 crawlable words against page-one competitors at 2,000–4,000.
4. No `ItemList` schema on the ranked-shortlist article format.

---

## Approved constraints for the dual-market overhaul (owner decisions, 2026-09-05)

Recorded because these are claims-safety and consistency rules that are not
derivable from the code, and a later session must not re-derive them differently.

### Regulatory phrasing — binding

- **Never** write "HIPAA compliant", "HIPAA certified" or "BAA compliant" anywhere
  on the site.
- The approved phrasing for the three clinical pages (dentists,
  physios-chiropractors, aesthetic-clinics) is **"HIPAA-conscious, non-clinical
  workflows"**, used identically in `primaryIntent` and in body copy.
- Any pre-existing copy making a stronger claim is a defect to flag to the owner,
  not to quietly soften.

### Entity-description consistency — binding

Where `primaryIntent` feeds `llms.txt`, meta descriptions or schema `description`,
the wording must stay identical across those surfaces so the entity description an
AI assistant reads is the same everywhere.

### URLs

Route URLs are frozen. `primaryIntent` and `h1` may change; `path` may not.

### Publishing automation

- Both n8n workflows (`RHg8pAuNUo2yNUnk` service/industry, `5yoM1RMAif1rNNHx`
  search-led) were **paused** by the owner for this work.
- Both have been switched to emit **US English**, so any back-catalogue spelling
  normalisation is a one-time pass rather than an ongoing reconciliation.

### Article byline

The byline stays **organisational** — `DEFAULT_BLOG_AUTHOR`, "Silverstone AI News &
Media Team", with `BlogPosting.author` pointing at the Organization node. No
`Person` schema is emitted, because the byline does not name a person. This
supersedes the "add Person schema" line in the original brief.
