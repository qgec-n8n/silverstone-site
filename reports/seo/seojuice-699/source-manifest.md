# Source manifest — SEOJuice "All 699 Issues"

| Item | Value |
|---|---|
| Desktop source file | `/Users/quentingeczy/Desktop/SEOJuice - All 699 Issues.rtf` |
| Format | Rich Text Format v1, ANSI, code page 1252 (**not** `.txt` as described) |
| Size | 3,257,114 bytes |
| Modified | 2026-07-23 14:24 |
| Conversion | `textutil -convert txt` → 1,283,952 bytes, 17,985 lines |
| Converted copy | scratchpad only — **not** committed (1.2 MB of duplicated report text) |
| Original | not modified |

Conversion validated: no dropped headings, URLs or issue boundaries. Card
boundaries were detected structurally (category token followed by a title
line) and reconcile exactly to 699 with **zero** missed and **zero**
over-detected records, so nothing was lost in the RTF→TXT step.

## Repository under audit

| Item | Value |
|---|---|
| Root | `/Users/quentingeczy/Desktop/silverstone-site` |
| Remote | `https://github.com/qgec-n8n/silverstone-site.git` |
| Branch at start | `main` |
| HEAD at start | `49c3f6170a864118bed6241f08181a022de3a8c9` |
| `origin/main` | identical (`0 0` ahead/behind) — the tree audited **is** the deployed tree |
| Working tree at start | clean except untracked `claude-seo/` (unrelated plugin dir, left alone) |
| Node | 22 (`.nvmrc`, `netlify.toml`) · npm |

## Tooling actually used

| Tool | Status |
|---|---|
| Playwright MCP | **used** — hydrated-DOM measurement against live production |
| `curl` / Python | **used** — raw HTML probe of all 59 affected URLs |
| WebFetch (Google Search Central) | **used** — FAQ deprecation + JS rendering guidance |
| Repository build (`build:production`) | **used** — SEO artifact gates |
| **SEOJuice MCP** | **NOT connected.** No `seojuice` MCP server is present in `.mcp.json`; the `seojuice:*` entries are *skills*, not a live API. No issue could be re-queried, re-crawled or marked resolved through SEOJuice. Post-fix confirmation therefore requires a deploy + recrawl (see handover). |
