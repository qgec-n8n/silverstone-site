<!-- FILE: codex/MANUAL_QA_CHECKLIST.md -->
# Manual QA Checklist (Requested Edits 1–8)

Run these checks after `bash scripts/codex.requested-edits.sh` passes.

---

## 1) Stats content + counter animation
Pages:
- `about.html`
- `index.html`

Checks:
1. about.html “Experience by the Numbers”
   - The last card reads as **30 Minute Automation Audit** (number 30 + label “Minute Automation Audit”).
2. index.html new stats section
   - Title: “No hype. Just measurable wins.”
   - Subtitle sentence matches PLANS.md exactly.
   - Cards show:
     - 525,600 Minutes of Always-On Coverage
     - 780 Potential Hours Reclaimed Per Year
     - 100 Times Better Contact Odds in 5 Minutes
     - 80 Callers Lost to Voicemail
3. Counter behavior
   - On load (or as you reach the section), numbers count up from 0 to their targets.
4. Reduced motion
   - With “Reduce motion” enabled in OS/browser, numbers should appear immediately (no animation).

Pass criteria:
- All text matches; counters animate only on about + index.

---

## 2) Mobile niche background parity (Edit 8)
Pages:
- `services.html` (reference page)
- at least 2 pages under `niches/*.html`

Checks (use a mobile viewport <= 768px, e.g. DevTools responsive mode):
1. services.html:
   - Confirm the body-section background image is visible behind the parallax sections, with the expected dark overlay.
2. niches pages:
   - Confirm the **same** background image is visible behind the parallax sections, with the **same** dark overlay.
3. Regression check:
   - Background should not disappear when scrolling between sections.
   - No obvious “solid flat dark background” where the image should be.

Pass criteria:
- niches pages match services/root pages on mobile for the background image + overlay.

---

## 3) No counters on niche pages
Pages:
- Open 2–3 pages under `niches/*.html`

Checks:
- Stats numbers do **not** animate.
- No obvious “counting up” effect.

Pass criteria:
- No niche stats animate.

---

## 4) Marquee speeds
Pages:
- Any non-services page (single marquee)
- `services.html` (double marquee)

Checks:
1. Single marquee is noticeably slower than before (longer continuous loop).
2. Double marquee
   - Top row moves slower than before but still faster than the bottom row.
   - Bottom row is the slowest.

Pass criteria:
- Perceived slower speed; top still faster than bottom.

---

## 5) Index pricing section 2 internal scroll + height match
Page:
- `index.html`

Checks:
1. Section 2 (“other plans”) does not push the page excessively downward.
2. The list area inside each section 2 card scrolls internally when long.
3. Section 2 cards match the height of section 1 cards on desktop/tablet widths.

Pass criteria:
- Internal scroll works; card heights match; layout feels contained.

---

## 6) Pricing toggle price scroll animation (all pages with pricing)
Pages:
- `index.html`
- `services.html`
- at least 1 niche page

Checks:
1. Click Monthly ↔ Setup.
2. Prices change using a vertical scroll/roll animation (digits/value scrolls to the new value).
3. No layout jumps; the cards remain stable.
4. Reduced motion: no animation; instant switch.

Pass criteria:
- Scroll animation present on all tested pages; reduced motion respected.
