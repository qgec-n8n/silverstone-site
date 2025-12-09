<!-- ESTATE-AGENTS-NOTES.md -->
# ESTATE-AGENTS-NOTES – Problem statement & desired outcomes

This file summarizes the known issues and desired outcomes for `niches/estate-agents.html`.

---

## Current Issues

1. **Cookie consent behaviour**
   - On Estate Agents:
     - Banner sometimes doesn’t appear on first load.
     - Flickers / appears / disappears while scrolling.
     - May still appear after Accept when scrolling or navigating.
   - Desired:
     - Banner appears on load only if consent not recorded.
     - Remains visible until Accept or Decline.
     - Once accepted/declined (on any page), it never reappears on any page.

2. **Extra vertical space between sections**
   - Problem pairs:
     1. “The branch experience after launch” → “Plug, personalise, launch”.
     2. “Pricing” → “FAQs”.
     3. “The ‘Never Miss a Viewing’ pack” → “Show the numbers, not just promises”.
   - Desired:
     - Reduce those gaps so they match the spacing between “Show the numbers…” and “The branch experience after launch”.
     - Only for relevant sections and breakpoints; avoid side‑effects on other sections/pages.

3. **Card background opacity inconsistency**
   - On Estate Agents:
     - “Show the numbers, not just promises” cards have a darker/more opaque background than:
       - “Where deals leak away”.
       - “Answer instantly. Confirm automatically. Keep the chain warm.”
       - “Plug, personalise, launch” cards.
       - “Safe, compliant, and fully supported” cards.
   - Desired:
     - All Estate cards use the darker/more opaque background, implemented in a DRY, page‑scoped way.

4. **Services dropdown button alignment (desktop)**
   - Services button sits slightly lower than other nav items.
   - Desired:
     - All nav items aligned vertically and visually in line.

5. **Services pill styling (mobile menu)**
   - In the mobile overlay, the Services pill:
     - Does not share the same font family, colour, size, or centering as other pills.
   - Desired:
     - Exactly the same font, colour, size, and central alignment as other mobile menu pills.

6. **Missing background image on mobile Estate Agents page**
   - Mobile Estate hero lacks the expected background image.
   - Desired:
     - Mobile Estate hero uses `book-hero-calendly-mobile-2025@*x.webp` as background (consistent with related pages).
     - Any parallax effect remains correct on both mobile and desktop.

---

## Non‑Goals

- No redesign of content or copy.
- No changes to flow structure (Estate → Book/Contact).
- No global theme changes beyond what’s required to fix the above issues.

---

## Priority Order

1. Cookie banner correctness.
2. Card backgrounds consistency.
3. Section spacing normalization.
4. Nav alignment & Services pill styling.
5. Mobile hero background.

---

Refer to this file whenever implementing or reviewing changes to the Estate Agents page.
