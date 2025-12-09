<!-- ESTATE-AGENTS-NOTES.md -->

# ESTATE-AGENTS-NOTES – Page-specific brief

This file summarizes the current issues and desired outcomes for `niches/estate-agents.html`.

---

## 1. Role of the Estate Agents page

- Niche landing page for Estate Agents.
- Must clearly communicate:
  - Pain points (where deals leak away).
  - Benefits and proof (stats, “Show the numbers, not just promises”).
  - Implementation and support (“The branch experience after launch”, “Plug, personalise, launch”, “The ‘Never Miss a Viewing’ pack”, “Safe, compliant, and fully supported”).
  - Pricing and FAQs.
  - Clear CTAs (Book/Contact).

Any breakage on this page directly affects conversions for this audience.

---

## 2. Known issues (summary)

1. **Cookie banner behaviour**
   - On Estate Agents, the cookie consent banner:
     - May not appear on page load when it should.
     - Can appear and disappear on scroll (flicker).
     - May not permanently disappear after Accept/Decline.
   - Desired: show exactly once until decision; then never reappear on any page.

2. **Extra vertical spacing**
   - Noticeable extra gaps between:
     - “The branch experience after launch” and “Plug, personalise, launch”.
     - “Pricing” and “FAQs”.
     - “The ‘Never Miss a Viewing’ pack” and “Show the numbers, not just promises”.
   - Desired: spacing equal to or close to the gap between “Show the numbers, not just promises” and “The branch experience after launch”.

3. **Card background opacity**
   - Cards in “Show the numbers, not just promises” are darker/more opaque than:
     - “Where deals leak away” card.
     - “Answer instantly. Confirm automatically. Keep the chain warm.” card.
     - “Plug, personalise, launch” cards.
     - “Safe, compliant, and fully supported” cards.
   - Desired: all Estate cards share the same dark, readable background.

4. **Services nav alignment (desktop)**
   - The Services dropdown menu button sits slightly lower than other nav items.
   - Desired: visually aligned nav bar; Services sits on the same baseline.

5. **Services pill styling (mobile)**
   - In the mobile overlay, the Services pill:
     - Uses different font/size/color/alignment from other pills.
   - Desired: Services pill visually identical to other pills, except for necessary iconography.

6. **Missing mobile hero background**
   - Estate Agents mobile version lacks a background image.
   - Desired: Estate mobile hero uses the book hero mobile image (`book-hero-calendly-mobile-2025@*x.webp`) or an equivalent, integrated into the existing parallax system.

---

## 3. Constraints

- No global visual changes for other pages unless:
  - They are required to fix the issues above, and
  - They are covered by tests and documented in ExecPlan.
- Estate Agents fixes should be implemented via:
  - Page‑scoped CSS and minimal HTML tweaks.
  - JS refinements that do not alter nav or banner semantics beyond bug fixes.

---

## 4. Success criteria

- Visiting `niches/estate-agents.html`:
  - Cookie banner behaves exactly as specified.
  - Card backgrounds and section spacing look visually coherent and consistent.
  - Nav alignment (desktop) and Services pill styling (mobile) look clean.
  - Mobile hero background is present and aesthetically matches other pages.
- All V*, F*, and D* tests that touch Estate Agents are green.
