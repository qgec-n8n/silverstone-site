<!-- TESTS_PLAN.md -->

# TESTS_PLAN – V/F/D scenarios for `silverstone-site-main`

This file defines the **Visual (V\*)**, **E2E (F\*)**, and **DOM (D\*)** tests referenced in ExecPlan and PLANS.

---

## Visual regression tests (V1–V10)

Each visual test corresponds to a screenshot comparison at a specific route and breakpoint.

| ID  | Page / Section                            | Breakpoint(s)     | Description & what to watch for                                                |
|-----|-------------------------------------------|-------------------|---------------------------------------------------------------------------------|
| V1  | Estate Agents – Hero                      | Desktop (≥769px)  | Hero background, headline, CTAs, nav visible; no layout jumps.                 |
| V2  | Estate Agents – Cards & stats             | Desktop & mobile  | All cards share dark background; stats layout correct; no odd spacing.         |
| V3  | Estate Agents – Pricing + FAQs gap        | Desktop           | Vertical gap between Pricing and FAQs matches baseline sections.               |
| V4  | Estate Agents – Hero                      | Mobile (≤768px)   | Uses correct mobile hero background image; parallax scroll works as expected.  |
| V5  | Home – Hero + header/nav                  | Desktop & mobile  | Nav alignment (Services item), hero layout, CTA visibility.                    |
| V6  | Home – Key sections (1–2 below hero)      | Desktop           | Check that any global CSS changes don’t disturb baseline card/section layout.  |
| V7  | Services – Hero + Services overlay        | Desktop & mobile  | Services button alignment; overlay layout; pill styles consistent.             |
| V8  | Book – Calendly section                   | Desktop           | Calendly embed visible; no clipping or overflow issues.                         |
| V9  | Book – Calendly section                   | Mobile            | Calendly embed usable on common mobile width; no horizontal scroll.            |
| V10 | Contact – Form section                    | Desktop & mobile  | Form layout, button styles, status messages spacing, no distortion.            |

Implementation notes (for Codex later):

- Use Playwright (or similar) to:
  - Navigate to each page.
  - Set viewport to target breakpoint.
  - Wait for fonts/CSS to settle.
  - Capture screenshots of whole viewport or specific sections (via locators).
  - Compare against stored baseline images.

---

## E2E flows (F1–F6)

Each flow describes a user journey through one or more pages.

| ID  | Flow description                                       | Path & key assertions                                                                              |
|-----|--------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| F1  | Home → Services → Estate → Book                        | Nav links work; Services overlay behaves; Estate & Book load; cookie banner behaves correctly.    |
| F2  | Home → Estate (via nav or CTA) → Contact               | Estate hero and cards visible; Contact form page loads, nav still correct.                        |
| F3  | Estate (direct) → Book, with cookie Accept             | Cookie banner appears once, Accept hides it and it does not reappear on Book or back on Estate.   |
| F4  | Home → Book (nav)                                      | Book page loads; Calendly embed visible; no JS errors.                                             |
| F5  | Home → Contact (nav)                                   | Contact page loads; form displayed; nav and footer intact.                                        |
| F6  | Cookie persistence across multiple pages               | Accept/Decline on one page persists to others; banner never flickers or reappears incorrectly.    |

Implementation notes:

- Use Playwright to drive navigation and assertions:
  - Check URLs, presence of key elements (nav, hero, buttons), and cookie banner state.
  - Log console errors and fail tests if any unhandled JS errors are detected.

---

## DOM interaction tests (D1–D7)

These are quicker behavioural tests that can run in jsdom or a headless browser.

| ID  | Behaviour                          | Setup & actions                                                                 | Expected outcome                                                                |
|-----|------------------------------------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| D1  | Cookie banner – initial display    | Clear localStorage/cookies; load any page (e.g., Home or Estate).              | Banner is visible on first load.                                                |
| D2  | Cookie banner – Accept persistence | With D1 setup, click “Accept”, reload page.                                     | Banner is hidden after reload and remains hidden on other pages.                |
| D3  | Cookie banner – scroll stability   | With D1 setup, scroll up/down before Accept/Decline.                            | Banner remains visible and stable; no flicker or re‑creation on scroll.         |
| D4  | Nav – Services dropdown (desktop)  | Set desktop viewport; click Services nav item; open/close overlay.              | Overlay opens and closes; Services item aligned; ARIA attributes remain valid.  |
| D5  | Nav – Mobile overlay & pills       | Set mobile viewport; open mobile menu; inspect Services pill.                   | Services pill styling matches other pills (font, color, alignment).             |
| D6  | Stats counters                     | Load page with stats (Estate); scroll so stats enter view once.                 | Counters animate from 0 to target once; do not rerun on repeated scrolls.       |
| D7  | Contact form behaviour             | Load Contact; fill fields; simulate submission (mock Netlify function).         | JS sends request, shows success on 2xx, error on failure; no JS exceptions.     |

Implementation notes:

- Use a DOM test suite (Vitest/Jest + jsdom or browser environment).
- For D7, mock the network call to ensure deterministic tests.

---

## Accessibility & performance checks (high level)

These are not numbered like V/F/D but support overall quality:

- Run Lighthouse or similar on:
  - Home, Services, Estate, Book, Contact.
- Check:
  - Heading structure is logical.
  - Contrast is adequate for text on dark backgrounds (especially cards).
  - Keyboard focus works for nav, Services overlay, and cookie banner.
  - No major performance regressions (e.g., wildly increased First Contentful Paint).

You may later wrap these checks in `npm run test:accessibility` and mention them explicitly in ExecPlan and PLANS.
