<!-- FILE: codex/MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist — Requested Edits 1–7

Prereqs:
- Run `bash scripts/codex.requested-edits.sh`
- Serve repo root: `python3 -m http.server 8000`

## A) Pricing visuals (Edits 1–3)

Pages:
- `/index.html`
- `/services.html`
- `/niches/estate-agents.html`
- one additional `/niches/*.html`

Checks:
- Pricing section background is slightly more vibrant (blue/pink reads more clearly) but still premium light mode.
- Sparkles are clearly visible (not barely perceptible) and still subtle (not noisy).
- If a widget shows the monthly/setup toggle, confirm the toggle track background is white (not grey).
- On a niche page, in the first pricing section, the “Most popular” card is unmistakably highlighted and looks premium.

## B) Home “What we automate” cards + spacing (Edits 4–6)

On `/index.html`:
- In “What we automate” section:
  - The four service titles are blue.
  - The four taglines are grey.
- In the “Systems & Data Integration” card:
  - No blank line between “Connect your tools so data flows without copy-paste.” and “Link CRM, booking, email and payments”.

## C) Services mobile bug fix (Edit 7)

Viewport: 390×844
- Open `/services.html`.
- For each of these three rows:
  - “Where revenue (and time) quietly leaks away.”
  - “Start small. Ship fast. Expand when it is working”
  - “General Service Lines:”
  confirm:
  - Image is outside the text card (stacked above), not “inside” the card border/background.
  - Text card contains only text/bullets (no embedded images).
- Confirm the first two headings render blue on mobile.

Repeat at 375×667.

## D) Regression sanity

- On `/niches/estate-agents.html` mobile:
  - Service row layout remains correct (image outside, text-only card).
- On at least one non-index/services/niche page (if any contain pricing widgets):
  - Pricing widget styling remains unchanged.
