<!-- TESTS_PLAN.md -->
# TESTS_PLAN – High-value scenarios for `silverstone-site-main`

This file documents the key tests we care about. The Playwright setup referenced below is **not present in this branch** (no `playwright.config.ts`, `tests/**`, or `tsconfig.json`). Use these scenarios for manual QA and as a blueprint if/when the automated suite returns.

Expected structure (for future automation):

- `playwright.config.ts` with projects:
  - `dom`, `e2e`, `visual-desktop`, `visual-mobile`, `accessibility`
- `tests/**`:
  - `tests/dom/*.spec.ts`
  - `tests/e2e/flows.spec.ts`
  - `tests/visual/visual.spec.ts`
  - `tests/accessibility/accessibility.spec.ts`
- `tsconfig.json` for TypeScript support

Because Codex Web sandbox cannot reliably run `npm install` (403 from npm registry due to security/network policy) and the scripts are currently absent, these scenarios are:

- **Manual inside Codex** – validate flows by inspection or browser previews; do not attempt to run missing npm test scripts.
- **Runnable locally/CI once the suite is restored** – install devDependencies and implement the specs using the IDs below.

### Current automation status

- `package.json` only includes build scripts (`build`, `build:css`) and `sharp` as a devDependency; there are no `test:*` scripts.
- No Playwright config or spec files are present; treat the V*/F*/D* sections as requirements rather than runnable tests.

---

## Visual Baseline Scenarios (V*)

Target implementation (when automated): `tests/visual/visual.spec.ts`
Projects: `visual-desktop`, `visual-mobile`

- **V1 – Estate Agents hero (desktop)**  
  - Page: `/niches/estate-agents.html` @ desktop (~1440×900).  
  - Selector: first `.hero`.  
  - Checks:
    - Hero background visible & aligned.
    - Cookie banner (if present) not overlapping hero content.

- **V2 – Estate Agents cards & stats (desktop & mobile)**  
  - Page: `/niches/estate-agents.html`.  
  - Selector: `.stats` section (first).  
  - Checks:
    - Card backgrounds consistent across Estate cards.
    - Layout intact at desktop and mobile breakpoints.

- **V3 – Estate Agents Pricing + FAQs gap (desktop)**  
  - Page: `/niches/estate-agents.html`.  
  - Selector: pricing/FAQ area (section around “Pricing”).  
  - Checks:
    - Vertical gap between “Pricing” and “FAQs” matches desired spacing.

- **V4 – Estate Agents hero (mobile)**  
  - Page: `/niches/estate-agents.html` @ mobile (~375×812).  
  - Selector: first `.hero`.  
  - Checks:
    - Correct mobile hero background (`book-hero-calendly-mobile-2025@*x.webp` pattern).
    - No large empty band or misalignment.

- **V5 – Home hero + header/nav (desktop & mobile)**  
  - Page: `/index.html`.  
  - Selector: first `.hero`.  
  - Checks:
    - Header/nav visible and aligned.
    - Hero content as expected.

- **V6 – Home key sections below hero (desktop)**  
  - Page: `/index.html`.  
  - Selector: `section` directly below hero.  
  - Checks:
    - No unexpected spacing changes from global CSS refactors.

- **V7 – Services hero + overlay (desktop & mobile)**  
  - Page: `/services.html`.  
  - Steps:
    - Open Services overlay.  
  - Selector: `.services-overlay`.  
  - Checks:
    - Overlay layout intact; Services pills rendered correctly.

- **V8 – Book Calendly section (desktop)**  
  - Page: `/book.html` @ desktop.  
  - Selector: `.calendly-inline-widget` or main content.  
  - Checks:
    - Calendly embed visible, no clipping.

- **V9 – Book Calendly section (mobile)**  
  - Page: `/book.html` @ mobile.  
  - Selector: `.calendly-inline-widget` or body if fallback.  
  - Checks:
    - Embed usable without horizontal scroll.

- **V10 – Contact form layout (desktop & mobile)**  
  - Page: `/contact.html`.  
  - Selector: `#contact` or central form container.  
  - Checks:
    - Form and surrounding content are visible & properly spaced.

---

## E2E Flow Scenarios (F*)

Target implementation (when automated): `tests/e2e/flows.spec.ts`
Project: `e2e`

- **F1 – Home → Services → Estate → Book**  
  - Steps:
    1. Visit `/index.html`.
    2. Accept cookies if banner appears.
    3. Open Services and navigate to Estate Agents.
    4. From Estate Agents, click “Book” nav/CTA to `/book.html`.
  - Checks:
    - Navigation works; hero visible on each page.
    - Calendly embed visible on Book.

- **F2 – Home → Estate → Contact**  
  - Steps:
    1. `/index.html` → Services → Estate Agents.
    2. From Estate Agents, go to Contact.  
  - Checks:
    - Estate page visuals OK.
    - Contact page loads with visible form.

- **F3 – Estate → Book with cookie Accept**  
  - Steps:
    1. Go directly to `/niches/estate-agents.html`.
    2. Accept cookie banner.
    3. Navigate to Book and back.  
  - Checks:
    - Banner hides after Accept and stays hidden on Estate/Book.

- **F4 – Home → Book via nav**  
  - Steps:
    1. `/index.html` → Book link.  
  - Checks:
    - Book page loads; Calendly visible.

- **F5 – Home → Contact via nav**  
  - Steps:
    1. `/index.html` → Contact link.  
  - Checks:
    - Contact form visible, header/footer present.

- **F6 – Cookie persistence across pages**  
  - Steps:
    1. Accept cookies on Home.
    2. Navigate to Estate and Book.  
  - Checks:
    - Cookie banner remains hidden across all pages.

---

## DOM Interaction Scenarios (D*)

Target implementation (when automated): `tests/dom/*.spec.ts`
Project: `dom`

- **D1 – Cookie banner initial visibility** (`cookie-banner.spec.ts`)  
  - Setup: clear cookies/localStorage.  
  - Page: `/index.html` or `/niches/estate-agents.html`.  
  - Checks:
    - `#cookie-banner` visible on first load.

- **D2 – Cookie Accept/Decline persistence** (`cookie-banner.spec.ts`)  
  - Steps:
    1. Accept on one page.
    2. Reload and navigate to another page.  
  - Checks:
    - Banner hidden after Accept across reloads and pages.

- **D3 – Cookie scroll stability** (`cookie-banner.spec.ts`)  
  - Steps:
    1. With banner visible, scroll mid‑page.  
  - Checks:
    - Banner stays visible (no flicker/hide).

- **D4 – Desktop Services dropdown behaviour** (`nav-and-overlay.spec.ts`)  
  - Page: `/index.html` @ desktop.  
  - Checks:
    - Services toggle ARIA `aria-expanded` changes correctly.
    - `.services-menu` visibility toggles.

- **D5 – Mobile Services overlay pill styling** (`nav-and-overlay.spec.ts`)  
  - Page: `/index.html` @ mobile.  
  - Checks:
    - `.services-overlay` active state.
    - `.service-pill` typography consistent across pills.

- **D6 – Stats counters** (`stats-counters.spec.ts`)  
  - Page: `/niches/estate-agents.html`.  
  - Checks:
    - `.stats .number` values change from 0 to target once, then remain stable.

- **D7 – Contact form behaviour** (`contact-form.spec.ts`)  
  - Page: `/contact.html`.  
  - Checks:
    - Success message shown on simulated 200 response.
    - Error message shown on simulated 500 response.

---

## Accessibility Smoke Tests

Target implementation (when automated): `tests/accessibility/accessibility.spec.ts`
Project: `accessibility`

- Simple axe‑based smoke check on Home page:
  - Inject `axe-core` and run `axe.run`.
  - Confirm violations array exists; detailed results can be interpreted manually/CI‑side.

---

## How Tests Tie Into Slices

- **Slice 0:** Keep this file and tests aligned; no mandatory test runs inside Codex.
- **Slice 1–3 (Estate visuals):** V1–V4, F2–F3, D6 (where applicable).
- **Slice 4 (Cookie banner):** D1–D3, F1, F3, F6.
- **Slice 5 (Nav/Services):** D4–D5, V4/V5/V7, F1–F2, F5.
- **Slice 6 (Book/Contact):** V5–V6, F3–F6, D7.
- **Slice 7–8 (consolidation & global cleanup):** Re‑run full test set where available.

Inside Codex, tests are **best‑effort**; outside Codex (local/CI) they should be part of your normal validation workflow.
