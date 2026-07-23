# Count reconciliation — does the export really contain 699 issues?

**Yes — exactly 699 issue cards.** The advertised number is accurate at card
level. It is *not* the number of distinct problems.

## Method

Cards begin with a bare category token on its own line, followed by a title
line. Detecting that pattern yields 699 starts with **0 missed** and **0
false starts** (every occurrence of a category token in the file is a genuine
card start).

| Category token | Cards |
|---|---:|
| `Content` | 455 |
| `Seo` | 241 |
| `AccessibilityWarning` | 1 |
| `ContentWarning` | 1 |
| `Performance` | 1 |
| **Total** | **699** |

## Card level vs page-instance level

| Measure | Count |
|---|---:|
| Issue cards | 699 |
| Affected-page instances (card × URL) | **701** |
| Distinct URLs referenced | **59** |
| Cards carrying no URL | 10 (site-wide advisories) |

The two totals are near-identical because **almost every card names exactly
one URL**. This is the single most important structural fact about the
report: it is not 699 problems across a site, it is roughly **12 cards
generated per page across 59 pages**.

| Page family | Instances |
|---|---:|
| Blog articles (34 URLs) | 403 |
| Industry pages (9 + hub) | 118 |
| Service pages (7 + hub) | 103 |
| Homepage | 14 |
| `/blog` hub | 13 |
| `/about`, `/book`, `/how-we-work`, `/pricing` | 49 |
| `/privacy-policy` | 1 |

## Duplication

| Kind | Cards |
|---|---:|
| Exact duplicates (byte-identical card text) | **10** — cards 491–500 repeat verbatim as 501–510, a contiguous block duplicated by the exporter |
| Distinct normalised titles | 622 of 699 |
| Semantic duplication | **pervasive** — see below |

Semantic duplication is the dominant characteristic. Counting how many of the
699 cards raise each recommendation theme (multi-label):

| Theme | Cards raising it | % |
|---|---:|---:|
| Add/rewrite meta description | **389** | 56% |
| Heading / H1 | 343 | 49% |
| Schema / JSON-LD | 244 | 35% |
| FAQ section or FAQPage schema | 204 | 29% |
| Thin content / expand word count | 188 | 27% |
| Value proposition / first-N-words | 142 | 20% |
| External citations | 105 | 15% |
| Cookie-banner heading | 103 | 15% |
| Publication dates | 85 | 12% |
| Title tag alignment | 81 | 12% |
| Readability | 61 | 9% |
| Comparison tables | 52 | 7% |
| TL;DR / answer box | 30 | 4% |
| Internal linking | 10 | 1% |
| Contrast (WCAG) | 3 | 0.4% |
| Performance | 3 | 0.4% |
| Image alt text | 3 | 0.4% |

**699 cards collapse to 8 root-cause groups** (`root-cause-groups.md`).

## Disposition after verification

| Status | Cards | % |
|---|---:|---:|
| `confirmed-runtime` — real, but only in the hydrated DOM, and not for the reason given | 229 | 32.8% |
| `obsolete-advice` — recommends a feature Google has deprecated | 152 | 21.7% |
| `recommendation-only` — editorial opinion, not a defect | 144 | 20.6% |
| `refuted-live` — measurably false against live production | 80 | 11.4% |
| `confirmed-3p-mutation` — real, and caused by SEOJuice's own script | 78 | 11.2% |
| `exact-duplicate` | 10 | 1.4% |
| `unverified` — needs a check this session could not complete | 6 | 0.9% |

**0 cards describe a defect in the prerendered HTML that the repository was
actually shipping.**
