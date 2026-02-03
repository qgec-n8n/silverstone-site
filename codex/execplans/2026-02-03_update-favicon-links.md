<!-- FILE: codex/execplans/2026-02-03_update-favicon-links.md -->
# ExecPlan: Update favicon link tags across all HTML pages

Owner: Codex (GPT-5.2)
Date: 2026-02-03
Scope: Replace existing favicon / apple-touch / android icon references in HTML heads with the new 4-link snippet only. No other changes.

## Primary outcomes (acceptance criteria)

A) Every HTML file listed below contains exactly the new favicon snippet in its <head>:
   - <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
   - <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
   - <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
   - <link rel="manifest" href="/site.webmanifest">

B) No HTML file contains legacy favicon references (e.g., /favicon.ico or /android-chrome-192x192.png) or duplicate icon/manifest links.

C) No other visual or behavioral changes.

Target files:
- index.html
- about.html
- services.html
- book.html
- contact.html
- privacy-policy.html
- niches/dentists.html
- niches/trades-virtual-office.html
- niches/ecommerce.html
- niches/salons-barbers.html
- niches/estate-agents.html
- niches/fitness-coaches.html
- niches/hospitality.html
- niches/physios-chiropractors.html
- niches/gyms-fitness-studios.html

## Progress checklist

- [x] Baseline: capture existing favicon link references (rg output).
- [x] Implement minimal replacement of favicon/manifest link tags in all target HTML heads.
- [x] Verify: no legacy favicon references remain; new snippet present in all targets.
- [x] Final diff review: only favicon link updates + ExecPlan index update (unrelated pre-existing changes noted).
- [x] Update this ExecPlan with discoveries, decisions, and verification results.

## Baseline & reproduction protocol (before editing)

1) Run:
   - rg -n "favicon.ico|android-chrome|apple-touch-icon|manifest" -g "*.html"

2) Record which files contain the legacy icon block in head.

## Implementation constraints (hard rules)

- Minimal diffs only; no formatting cleanups.
- Only change <head> icon/link tags; do not touch body content.
- Preserve parallax and all other behavior.

## Validation gates (must pass)

Gate 1: Legacy references removed
- rg -n "favicon.ico|android-chrome" -g "*.html" returns no matches.

Gate 2: New snippet present everywhere
- rg -n "favicon-32x32.png" -g "*.html" returns 15 matches (one per file).
- rg -n "favicon-16x16.png" -g "*.html" returns 15 matches.
- rg -n "apple-touch-icon.png" -g "*.html" returns 15 matches.
- rg -n "site.webmanifest" -g "*.html" returns 15 matches.

## Decision log (fill as you go)

- Decision: Replace the existing 4-line icon block in each head with the new 4-line snippet, preserving local indentation.
  - Why: Meets user request with minimal change and avoids duplicate icon/manifest links.
  - Alternatives considered: Keep existing manifest link (rejected: would cause duplicate manifest refs).
- Decision: Apply the same replacement across all 15 HTML files using a single pass to keep the diff consistent.
  - Why: Ensures uniform favicon setup with minimal risk of partial updates.

## Notes / discoveries

- Baseline rg results show all 15 HTML files currently include the same legacy block:
  - /favicon.ico
  - /apple-touch-icon.png (180x180)
  - /android-chrome-192x192.png
  - /site.webmanifest
  Files: index.html, about.html, services.html, book.html, contact.html, privacy-policy.html,
  niches/dentists.html, niches/trades-virtual-office.html, niches/ecommerce.html,
  niches/salons-barbers.html, niches/estate-agents.html, niches/fitness-coaches.html,
  niches/hospitality.html, niches/physios-chiropractors.html, niches/gyms-fitness-studios.html.
- Diff review: git diff --stat shows unrelated modified files (.DS_Store, .codex/config.toml, icon assets, site.webmanifest) already present; left untouched.

## Verification results (fill after changes)

- Legacy references removed:
  - rg -n \"favicon.ico|android-chrome\" -g \"*.html\" returned no matches.
- New snippet present in all targets:
  - rg -n \"favicon-32x32.png\" -g \"*.html\" | wc -l => 15
  - rg -n \"favicon-16x16.png\" -g \"*.html\" | wc -l => 15
  - rg -n \"apple-touch-icon.png\" -g \"*.html\" | wc -l => 15
  - rg -n \"site.webmanifest\" -g \"*.html\" | wc -l => 15
