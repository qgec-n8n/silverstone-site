# Search visibility baseline — 2026-09-04

The measurement baseline for the dual-market (US + UK) SEO programme. Re-measure
monthly against this file. Position is the leading indicator; clicks lag it by
months, so do not judge the programme on clicks before ~90 days.

Full analysis: the "Page Five Problem" audit (artifact, 2026-09-04).

## Data window

- **Period:** 2026-06-06 → 2026-09-04 (90 days)
- **Source:** Google Search Console, property `sc-domain:silverstone-ai.com`
- **Retrieved via:** Windsor.ai MCP, connector `searchconsole`
- **Caveat:** this window straddles the URL migration (cutover 2026-07-07,
  redirect deploy 2026-07-15). Legacy `/services/{industry}` paths still appear
  and still out-rank their `/industry/{slug}` destinations. That is expected
  consolidation behaviour at this age, not a defect. The next baseline will be
  the first clean post-migration window.

## Sitewide

| Metric | Value |
| --- | --- |
| Impressions | 9,751 |
| Clicks | 61 |
| CTR | 0.63% |
| Non-branded clicks | 52 |
| Branded clicks (`silverstone ai`) | 9 |

## By market

| Market | Impressions | Share | Clicks | CTR | Avg position |
| --- | ---: | ---: | ---: | ---: | ---: |
| United Kingdom | 7,668 | 79% | 35 | 0.46% | 46.0 |
| United States | 936 | 10% | 6 | 0.64% | 20.1 |
| Rest of world | 1,147 | 11% | 20 | 1.74% | — |

The US ranks more than twice as well as the UK on a tenth of the impressions.
Track the two markets separately at every re-measurement or the US signal stays
buried under UK volume.

## Commercial clusters

Impression-weighted average position. These five carry 54% of all demand.

| Cluster | Impressions | Weighted avg position |
| --- | ---: | ---: |
| AI consulting (firms / companies / consultants) | 2,738 | 50.4 |
| AI automation agency / workflow | 1,280 | 57.7 |
| AI voice agents | 437 | 59.4 |
| Estate agents / real estate | 422 | 56.7 |
| AI receptionist | 340 | 63.5 |

## Pages worth watching

| Page | Impressions | Clicks | Avg position |
| --- | ---: | ---: | ---: |
| `/blog/best-ai-consulting-firms-for-uk` | 2,548 | 0 | 46.8 |
| `/services/ai-automation` | 1,372 | 2 | 58.7 |
| `/` (homepage) | 840 | 31 | 6.6 |
| `/services/ai-consulting` | 491 | 0 | 60.4 |
| `/services/ai-voice-agents` | 404 | 2 | 72.0 |
| `/services/ai-receptionists` | 401 | 0 | 58.6 |
| `/blog/dental-recall-automation-uk-2026` | 313 | 0 | 8.1 |
| `/about` | 290 | 4 | 9.6 |

`/blog/best-ai-consulting-firms-for-uk` alone is 26% of all site impressions at
zero clicks. It is a Search-Led stream article
(`presentation.family: "Ranked Shortlist"`), so it is fixed through the
automation, not by hand.

## Question-shaped queries — the GEO signal

These already rank on page one on this domain, while head terms sit at 50–64.
The gap between them is the content strategy.

| Query | Position |
| --- | ---: |
| how can dental practices recover missed calls faster? | 8.0 |
| what automated patient reminders and recall management … | 9.2 |
| what is the most affordable conversational ai application … | 10.0 |
| what are the best ai booking tools for hvac, plumbing … | 10.0 |
| what is the process for developing a bespoke mobile app … | 10.8 |

## Content state at baseline

| Signal | Value |
| --- | ---: |
| Published blog articles | 81 |
| Slugs mentioning US | 0 |
| Headings mentioning US | 0 |
| Headings mentioning UK / British / London | 347 |
| Articles with a named author | 0 |
| `Person` schema on the site | absent |
| `ItemList` schema on ranked shortlists | absent |

Crawlable word counts (production HTML, scripts and styles stripped):

| Page | Words |
| --- | ---: |
| `/` | 1,887 |
| `/pricing` | 2,274 |
| `/blog/best-ai-consulting-firms-for-uk` | 2,235 |
| `/services/ai-consulting` | 949 |
| `/services/ai-automation` | 904 |
| `/services` | 725 |

## How to re-measure

Reproduce exactly, or the comparison is not like-for-like.

**Sitewide and by market**

```
connector: searchconsole
fields:    ["countryname", "impressions", "clicks", "position"]
window:    last_3m   (or an explicit 90-day date_from/date_to)
```

**Query level** — the 3-impression floor keeps the long tail from distorting
cluster averages, and is how the cluster figures above were built.

```
connector: searchconsole
fields:    ["query", "countryname", "impressions", "clicks", "position"]
filters:   [["impressions", "gte", 3]]
```

**Page level**

```
connector: searchconsole
fields:    ["pagepath", "impressions", "clicks", "position"]
filters:   [["impressions", "gte", 5]]
```

Cluster membership is by substring on the query, assigned to exactly one
cluster in the order listed above so no query is double-counted:

- **AI consulting** — `consult`, `consultan`, `consultanc`
- **AI automation agency / workflow** — `automation agency`, `automation
  service`, `workflow automation`, `ai automation` (not already in consulting)
- **AI voice agents** — `voice agent`, `voice ai`
- **Estate agents / real estate** — `estate agent`, `real estate`, `property`,
  `letting`
- **AI receptionist** — `receptionist`, `reception`, `answering service`

## Known gaps at baseline

- **Domain authority.** Ahrefs last reported DR 0.7. Could not be re-checked —
  the Ahrefs API returns `Insufficient plan` on every endpoint, including the
  free DR lookup. No third-party keyword volume or backlink data is available
  through the current tooling.
- **LinkedIn absent from `sameAs`** in `web/src/seo/schema.ts`. Every other
  profile is listed. A LinkedIn company page is a standard entity signal for
  both Google and AI answer engines.
- **Directory presence unverified.** Crunchbase, G2, DesignRush, Sortlist and
  GoodFirms all return 403 to automated requests; presence must be checked by
  hand.

## Google Business Profile — verified 2026-09-04

Checked directly on Google Maps via the `place_id` in `sameAs`
(`ChIJGZi5bknv7EcRx2wli22KRtI`). **The listing is correct**, and an earlier note
claiming it was pinned in Northern Ontario is out of date.

| Field | Value | Matches site |
| --- | --- | --- |
| Address | 4 Deacon St, London SE17 1GD, United Kingdom | yes |
| Plus code | FWV2+2Q London | — |
| Phone | +44 7438 524862 | yes (as of this session's change) |
| Hours | Open 24 hours | yes |
| Category | Automation company | — |
| Rating | 5.0 from 2 reviews | — |

Remaining local weakness is **review volume, not configuration**: two reviews is
too few to compete in a London local pack. Review count and recency are among
the strongest local ranking factors, and reviews feed AI citation and conversion
at the same time.
