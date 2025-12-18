<!-- FILE: codex/MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist (required for A–H)

These checks must be performed after code changes and after rebuilding CSS/JS outputs.

---

## 1) Desktop header + Services dropdown hover behavior (D1)

Environment:
- Desktop browser
- Pointer device (mouse / trackpad)
- Viewport width > 1024px

Steps (repeat each scenario 3+ times):

1. Hover Services
   - Dropdown opens immediately.
   - Banner does not minimize.

2. Move cursor from Services button down into dropdown
   - Move through the “gap” area (between the button and dropdown).
   - Dropdown stays open.
   - Banner does not minimize.

3. Leave dropdown to outside the header/banner area
   - Dropdown closes first.
   - Banner stays expanded briefly.
   - ~1s after dropdown fully disappears, banner may minimize.

4. Leave dropdown directly onto the banner (Home/About/Services/Book/Contact area)
   - Dropdown closes.
   - Banner stays expanded while cursor remains over banner.
   - Banner may minimize only after cursor leaves banner.

5. Reliability stress
   - Open/close the dropdown 10 times via hover.
   - There must be no “only works once” behavior and no flicker/minimize race.

Pass criteria:
- All outcomes match D1 exactly and reliably.

---

## 2) Mobile menu panels (D2)

Environment:
- Mobile viewport (e.g., 375×812)
- Open hamburger menu

Steps:

1. Panel 1 typography
   - “Home”, “About”, “Services”, “Book”, “Contact” appear consistent.

2. Open Services panel
   - Tap Services → panel 2 slides in.

3. “← Services” typography
   - “← Services” font size matches the panel 1 items (no smaller default button text).

4. Fade timing
   - On both panels, menu items begin appearing after the panel is ~50% slid in.
   - Items should not “wait until fully in place” before appearing.

Pass criteria:
- Font sizes match; fade timing matches.

---

## 3) Mobile marquees preload behavior (F)

Environment:
- Mobile viewport
- DevTools network throttling (Slow 3G or similar)

Steps:
1. Hard refresh on a non-services page (single marquee)
2. Scroll to the marquee section
3. Observe:
   - Images should not pop in late.
   - No visible “appearing/disappearing” as images load.

Repeat for services page (double marquee).

Pass criteria:
- Marquee looks stable when first scrolled into view under throttled network.

---

## 4) Mobile hero CTA cutoff fix (H)

Environment:
- Mobile viewport sizes (at least 2):
  - iPhone-like (375×812)
  - Smaller Android-like (360×740)

Pages to check:
- `index.html`
- `services.html`
- one niche page (any under `niches/`)
- `book.html`

Pass criteria:
- Primary + secondary hero CTA buttons are fully visible (not clipped at hero bottom).
- Desktop layout remains unchanged.

---

## 5) Overlay opacity + niche mobile background parity (A4, B)

Environment:
- Desktop + mobile viewport

Checks:
1. Overlay opacity
   - On sections using `body-section-background-2025.webp`, overlay is slightly lighter than before.
   - Text remains readable.

2. Niche mobile background parity
   - On mobile, niche pages do NOT use the book-hero image as the body background.
   - Background application matches the established “section background + overlay” pattern used elsewhere.

Pass criteria:
- Both checks visually satisfied.

---

## 6) Services image/card alternation (C2) + structure (G)

Environment:
- Desktop viewport (≥ 1024px)
- Navigate to services “cards with images” section (the four General_Services images)

Check the four pairs in order:

1. `General_Services_1.jpeg`
   - Image left, card right

2. `General_Services_2A.jpeg`
   - Card left, image right

3. `General_Services_2B.jpeg`
   - Image left, card right

4. `General_Services_3.jpeg`
   - Card left, image right

Also verify on mobile:
- Each pair stacks with image above card (image not nested inside card).

Pass criteria:
- Desktop alternation matches exactly; mobile stacking preserved.
