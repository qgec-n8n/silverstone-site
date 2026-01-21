<!-- FILE: codex/checklists/CHECKLIST.console-404s.md -->
# Checklist: Desktop console 404 elimination

Goal: zero console errors on page load; specifically remove all `404 (Not Found)` errors seen in the provided console log.

## Inputs

- Desktop console log file at: `artifacts/input/desktop-console.log`

## Baseline capture (before changes)

- [ ] Run: bash scripts/codex.audit.console-404s.sh artifacts/input/desktop-console.log
- [ ] Save output to: artifacts/output/console-404s-audit-before.txt
- [ ] Start local server.
- [ ] On desktop Chrome:
  - [ ] Disable cache (DevTools Network)
  - [ ] Hard reload
  - [ ] Capture console output to: artifacts/output/desktop-console-before.txt
  - [ ] Capture 404 network requests (URL + Initiator) to: artifacts/output/desktop-network-404s-before.txt
- [ ] Repeat on one `niches/*.html` page.

## Fix verification (after changes)

- [ ] Re-run: bash scripts/codex.audit.console-404s.sh artifacts/input/desktop-console.log
  - Expected: script should no longer find missing refs OR the repo should now contain those resources OR the ref is removed.
- [ ] Run: bash scripts/codex.audit.missing-asset-refs.sh
  - Expected: no missing `assets/css/*.css` or `assets/js/*.js` references in repo sources.
- [ ] Desktop Chrome:
  - [ ] Hard reload root pages:
    - index.html, about.html, services.html, book.html, contact.html
  - [ ] Hard reload one niches page
  - [ ] Confirm:
    - Console: zero errors
    - Network: zero 404s
- [ ] Save after evidence:
  - artifacts/output/desktop-console-after.txt
  - artifacts/output/desktop-network-404s-after.txt

## Regression guardrails

- [ ] Ensure no new console errors/warnings were introduced by the fix.
- [ ] Ensure the fix does not rely on cache (disable cache + hard reload).
