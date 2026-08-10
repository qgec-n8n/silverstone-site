# Blog automation indexability brief

Paste everything below the line into a new Claude session connected to the n8n
instance. It is written against the two exported workflow JSONs, so it names the
actual nodes and the actual defective lines.

Diagnosis behind it: `memory/project_blog_indexing_410_2026_08_10.md`.

**What was already ruled out.** The unindexed pages have no technical defect:
all are in `sitemap-posts.xml`, all linked from `/blog`, all 200 with
`index, follow`, self-referencing canonicals, unique titles/descriptions,
1,800–2,250 words and Article schema. All 85 sitemap URLs return 200. Google
fetches the sitemap cleanly (85 submitted, 0 errors). Both workflows *already*
read the live sitemap and *already* run near-duplicate detection — do not let
the new session "fix" things that work.

---

You are working on my n8n instance (`silverstoneai.app.n8n.cloud`). Two
workflows publish articles into `qgec-n8n/silverstone-site` at
`web/src/data/blog-posts.ts`:

- **Silverstone Blog SEO Automation** — `RHg8pAuNUo2yNUnk` (52 nodes)
- **Silverstone Search-Led SEO Automation** — `5yoM1RMAif1rNNHx` (82 nodes)

Both are mature: they read the live post sitemap, keep topic registries, run
three escalating quality gates, and publish atomically to GitHub with
compare-and-swap. **Do not restructure them.** There are two specific, verified
defects to fix, and both are in shared helper code that exists in both workflows.

Use the n8n MCP tools. Read each node's current code and show it to me before
editing. Validate with `validate_workflow` and report a per-node diff.

## Defect 1 — `trimTo` ships truncated metadata (both workflows)

**Where:** nodes `Quality Gate 1`, `Quality Gate 2`, `Quality Gate Final` in
*both* workflows. In the search-led export the helper is at lines ~73–94.

```js
const trimTo = (value, limit) => {
  const text = String(value || '').trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (sentenceEnd >= Math.floor(limit * 0.8)) return cut.slice(0, sentenceEnd + 1).trim();
  const wordEnd = cut.lastIndexOf(' ');
  return (wordEnd > 0 ? cut.slice(0, wordEnd) : cut).replace(/[,;:\-–—]$/, '').trim();
};
if (String(pkg.metadata?.metaTitle || '').trim().length > 60) {
  pkg.metadata.metaTitle = trimTo(pkg.metadata.metaTitle, 60);
  contentRepairs.push('trimmed_meta_title');
}
```

**Why it ships broken metadata.** Cutting at a word boundary does not produce a
complete phrase, and the trailing-character strip `[,;:\-–—]` **does not include
the pipe**. The length validation immediately below (`metaTitle.length > 60`)
then passes, because the string is now in-band — the gate repairs the length and
certifies the result. Live consequences, all measured on production:

| Published value | What `trimTo` did |
|---|---|
| `AI Readiness Assessment for UK Small Businesses \|` | pipe survived the strip |
| `Best AI Receptionist Providers for UK Businesses \|` | pipe survived the strip |
| `Best AI Automation Agencies UK in 2026: Costs, Services and` | ended on a trailing conjunction |
| `Best AI Automation Agency in Newcastle (2026) \| Silverstone` | cut "Silverstone AI" in half |
| `…buyer-fit criteria and a practical supplier` | description cut mid-clause |

8 of 59 posts carry one of these, and **7 of those 8 are in the unindexed set.**
Every `best-*` listicle had one.

**Required change.** Stop repairing length by truncation. Instead:

1. Make `trimTo` refuse to return a fragment. After trimming, reject the result
   unless it ends on a complete phrase: strip trailing `|`, `-`, `–`, `—`, `:`,
   `;`, `,` **and** any trailing stop word (`and, or, the, a, an, to, for, with,
   of, in, on, at, by, from, is, are, that, this, plus, vs`). If what remains is
   shorter than the minimum (title ≥ 30, description ≥ 130) or no longer ends on
   a word that can end a phrase, treat it as a **gate failure**, not a repair.
2. On that failure, escalate to the rewrite step that already exists
   (`OpenAI ... Rewrite` / `Final Rewrite`) with an explicit instruction to
   regenerate the field inside budget. The workflows already escalate on other
   gate failures — reuse that path rather than inventing one.
3. Only accept a title that is ≤ 60 chars **as generated**. Titles carrying the
   ` | Silverstone AI` suffix must have it added only when the base title leaves
   room; otherwise omit the suffix entirely rather than cutting it in half.
4. Keep `contentRepairs` telemetry, but a repair must never be able to turn an
   invalid value into a passing one by shortening it.

## Defect 2 — slugs are built as truncated title subsequences (both workflows)

**Where:**
- Search-led: `Build Search-Led Context` line ~397
  `const slugify = (value) => normalise(value).split(/\s+/).filter(Boolean).slice(0, 6).join('-');`
  plus `Validate Candidate Plan` `slugReasons()` (rule `slug_not_in_title_order`).
- Blog: `Validate Topic Decision` `orderedSlugReasons()` — same in-title-order
  rule, 3–6 words, 20–60 chars.

**Why it produces bad URLs.** `.slice(0, 6)` takes the first six words of the
title seed, and `slug_not_in_title_order` *requires* the slug's words to appear
in the title in order — so the slug is structurally a truncated subsequence of a
sentence, not a keyword phrase. That is how these shipped:

`handle-quote-requests-without-wasting` · `salon-automation-salons-barbers-first-should` ·
`how-dental-practices-should-run` · `one-sme-review-round` · `build-a-prototype-instead` ·
`valuation-request-go-straight-branch-manager` · `cross-location-workflows-standardise-first`

The guard that should have caught these is incomplete: the blog workflow has
**no `SLUG_TAIL_STOP_WORDS` list at all**, and the search-led list holds only 22
function words (`a, an, and, are, as, at, be, by, for, from, in, into, is, it,
of, on, or, the, to, with, you, your`) — so `should`, `first`, `instead`,
`wasting` and `run` all pass.

**Required change.**

1. Derive the slug from the **primary query** (the keyword the article targets),
   not from the title. Replace `slug_not_in_title_order` /
   `orderedSlugReasons`'s ordering rule with: the slug must contain the head
   terms of `primaryQuery`. Keep the character-set, length, uniqueness and
   repeated-word rules — those are fine.
2. Drop `.slice(0, 6)` word truncation. Build from the primary query and stop at
   a word boundary that leaves a readable noun phrase; if it cannot, fail the
   candidate rather than emit a fragment.
3. Add a shared `SLUG_TAIL_STOP_WORDS` to **both** workflows and extend it with
   verbs/adverbs that cannot end a URL: `should, first, instead, without,
   wasting, run, go, straight, not, more, less, before, after, using, doing,
   make, get`.
4. Reject any slug that reads as a sentence fragment: if the last word is a
   verb-form or the slug contains a leading interrogative (`how`, `what`, `why`)
   without a complete object phrase, fail it.

## Do not re-slug published posts

Slug churn is what created the current mess: 32 legacy URLs still hold Google's
index while their replacements sit unindexed. **A published `slug` is
immutable.** If a slug ever must change, the same commit must add the old → new
pair to `LEGACY_REDIRECTS` in `netlify/edge-functions/lib/url-migration.mts`.
Never let a previously-live URL end up 404 or 410 while a replacement exists —
that is precisely the failure that suppressed 21 of these pages.

## Two things already working — leave them alone

- `Read Live Post Sitemap` + `Build Run Context` / `Build Search-Led Context`
  already reconcile against live slugs. Good.
- Near-duplicate detection already exists (`topic_near_duplicate`,
  `similarity >= 0.72`, `trivial_annual_rewrite`). **Tighten rather than
  rebuild**: the threshold is letting through topical overlap that Google treats
  as redundant (5 AI-receptionist posts, 5 dental, 4 consulting, 3
  app-development). Lower it toward ~0.60 and compare on *primary query and
  search intent*, not title similarity — then route the near-miss to an UPDATE of
  the owning post instead of a new article.

## Cadence

Both workflows publish on a daily `Production Schedule`. On this domain (DR 0.7,
migrated July 2026) that volume is counter-productive: Google is already
declining to crawl half the library. Move both to **at most 2 genuinely new
articles per week** and spend the remaining slots on UPDATE decisions against
existing posts — the `UPDATE` path already exists in both topic validators.

## Deliverable

Report: the current code you found per node, the edits you made, the
`validate_workflow` results, and a list of existing posts your tightened
duplicate threshold says should be consolidated rather than left competing.
