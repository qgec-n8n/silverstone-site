<!-- FILE: codex/PAGE_AUDIT_MATRIX.md -->
# Page Audit Matrix — Requested Edits 1–8

Use this grid to ensure you did not accidentally affect other pages or break responsiveness.

Legend:
- D = Desktop check required
- M = Mobile check required
- — = Not applicable

| Page | Edit 1 (Hero desktop container) | Edit 7 (Hero mobile subheading removed) | Edit 2 (About desktop images fill) | Edit 3 (Services desktop HD) | Edit 4 (Services mobile 2:3) | Edits 5–6 (Services Neural Grid) | Edit 8 (Index subtitle grey) |
|---|---:|---:|---:|---:|---:|---:|---:|
| `index.html` | D | M | — | — | — | — | D+M |
| `about.html` | D | M | D | — | — | — | — |
| `services.html` | D | M | — | D | M | D+M | — |
| `contact.html` | D | M | — | — | — | — | — |
| `book.html` | D | M | — | — | — | — | — |
| `niches/*.html` | D | M | — | — | — | — | — |

Minimum niches sample pages for spot-checking:
- `niches/dentists.html`
- `niches/hospitality.html`

Notes:
- Edits 1 and 7 are global hero behavior; validate across at least 2 niche pages + 2 core pages.
- Edits 3–6 are services-specific; validate both desktop and mobile.
- Edit 8 is index-only; ensure no other subtitles change.
