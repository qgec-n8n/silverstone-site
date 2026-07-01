---
name: Approved-copy service markdown bullet formats
description: The docs/approved-copy/services/*.md sources use TWO bullet syntaxes; the generator must match the right one per section or arrays come out empty.
---

# Approved-copy service markdown uses two bullet formats

The source files `docs/approved-copy/services/0[1-7]_*.md` feed
`web/scripts/generate-approved-service-content.mjs`, which writes
`web/src/content/services/generated/approved-services.json` (static, committed;
consumed by `ApprovedServicePageVisuals`). Inside "## 6. Complete component
microcopy" the bullets come in **two different syntaxes**:

- **Em-dash format** — `- **Label** — body` — used for `### Feature cards` and
  `### Outcome cards` (and the numbered `### Process steps`).
- **Colon-inside-bold format** — `- **Label:** body` — used for benchmark
  metrics, CTA blocks, callout/comparison/labels (parsed by `bulletValue`,
  `extractBenchmarks`).

**Why:** `markdownBullets()` originally only matched the colon format, so
`featureCards`/`outcomeCards` silently generated as empty arrays → the two card
sections rendered header-only (no visible bug, no error). `processSteps`
populated fine because `numberedItems()` already used the em-dash separator.
This was the real "PR248 copy not showing the way codex intended" — not the
loader/hydration gating (that was a separate, earlier fix).

**How to apply:** If a service page section renders empty, first diff the source
markdown bullet syntax against the extractor regex for that section. Keep
`markdownBullets` tolerant of both separators
(`/^- \*\*(.+?):?\*\*\s+(?:—\s+)?(.+)$/gm`). After editing the generator or the
source markdown, **re-run** `node scripts/generate-approved-service-content.mjs`
from `web/` and re-commit the JSON. Note the generator also rewrites
`docs/approved-copy/services/SOURCE_SHA256_MANIFEST.md` +
`COPY_FIDELITY_REPORT.md` as a side effect; under `/web` scope restore any
unrelated docs churn (via `git show HEAD:<path> > <path>`, since git restore is
blocked).
