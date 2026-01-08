<!-- FILE: codex/MANUAL_QA_WHATSAPP_FOOTER.md -->
# Manual QA — WhatsApp Sticky Icon + Footer Mobile Number

## Setup

- Serve locally using any static server.
- Test at:
  - Desktop width (>= 1200px)
  - Mobile width (<= 390px)

Test pages (minimum):
- `index.html`
- `contact.html`
- `niches/fitness-coaches.html` (or any niche page)

## A) WhatsApp sticky icon

On each test page:

1) Confirm a WhatsApp icon/button is visible at the bottom-right.
2) Scroll the page:
   - Icon remains fixed in place.
3) Click/tap:
   - A WhatsApp chat flow opens for the configured number.
4) Keyboard:
   - Tab to the icon.
   - Press Enter/Space triggers the same behavior.
5) Visual sanity:
   - The icon does not overlap critical UI elements in a way that makes the page unusable.

## B) Footer phone number

On each test page:

1) Scroll to footer.
2) In “Contact Us” block:
   - Address is present
   - Email is present
   - Phone number `+447418329232` is present
3) Consistency:
   - Placement looks consistent across root and niche pages (same block, same ordering)

## Pass/Fail

- PASS only if both A and B pass on all 3 pages above, on desktop + mobile.
