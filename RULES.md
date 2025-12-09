<!-- RULES.md -->

# RULES – CSS & JS Rules of Engagement for `silverstone-site-main`

These rules apply whenever Codex or a human modifies CSS or JS in this repo, especially for the Estate Agents page and main flows.

---

## 1. Global CSS rules

- **No new `!important`**  
  - Do not add new `!important` declarations unless:
    - There is no safer alternative, _and_
    - The ExecPlan explicitly documents the rationale in the Decision Log.
- **Preserve base components early**  
  - Do not change global `.neon-card` base styles or global `section` spacing in slices 0–3.
  - Prefer page‑scoped or component‑scoped overrides.
- **Use page‑scoped wrappers**  
  - For Estate Agents, use a wrapper class such as `.page-estate-agents` on the body or a root container and scope overrides under it (e.g., `.page-estate-agents .neon-card`).
- **Avoid tag‑only overrides**  
  - Avoid broad tag selectors (e.g., `h2`, `p`, `a`) for refactor changes; prefer class‑scoped rules to reduce global impact.

---

## 2. Estate Agents CSS rules

These rules apply to `niches/estate-agents.html` and its associated styles.

- **Card backgrounds**
  - All Estate cards must visually match the dark, opaque background used in the “Show the numbers, not just promises” section.
  - Implement this via page‑scoped selectors such as `.page-estate-agents .neon-card` or more specific section classes.
  - Do not change the base `.neon-card` definition for other pages during slices 1–3.
- **Spacing**
  - Fix vertical gaps between specific Estate sections using:
    - Section IDs (e.g., `#pricing`, `#faqs`) or section‑specific classes.
    - Page‑scoped selectors to avoid altering spacing globally.
- **Inline styles**
  - Inline CSS within `niches/estate-agents.html` is allowed only as a temporary measure.
  - Long‑term goal (Slice 7) is to move Estate‑specific inline styles into a shared CSS file or a dedicated Estate CSS file.
- **Modifiers**
  - Use meaningful modifiers for Estate‑specific variants where needed:
    - Example: `.neon-card.neon-card--estate`, `.section.section--estate-pricing`.
  - Keep naming consistent and documented.

---

## 3. Header/nav & Services overlay CSS rules

- **Alignment before aesthetics**
  - Focus first on fixing vertical/horizontal alignment and legibility of:
    - `.site-header`
    - `.nav-links`, `.nav-item`
    - `.services-toggle`
    - `.services-menu` / `.services-overlay`
    - `.service-pill` / mobile nav pills
- **Scoped changes**
  - Adjust only the selectors that directly affect Services and nav alignment.
  - Do not introduce sweeping changes to base nav link styling unless tests and manual checks confirm no regressions.
- **Accessibility**
  - Preserve existing ARIA attributes and roles on nav and overlays.
  - If you adjust markup, ensure ARIA attributes are still correct and update tests accordingly.

---

## 4. Mobile & parallax CSS rules

- **Respect existing patterns**
  - Reuse patterns in:
    - `assets/css/hero-base.css`
    - `assets/css/mobile.css`
    - `assets/css/parallax-fix.css`
  - Do not create ad‑hoc hero background rules that ignore the existing parallax system.
- **Estate mobile hero**
  - Estate mobile hero should use the same mobile background image assets as the book hero, or a clearly defined counterpart, with the same responsive/parallax behaviour.
- **Breakpoints**
  - Respect existing breakpoints (e.g., `max-width: 768px`) when adding new rules.
  - Document any new breakpoints in `TESTS_PLAN.md` or ExecPlan if truly needed.

---

## 5. Global JS rules

- **Do not silently change DOM contracts**
  - IDs, classes, and `data-*` attributes used by JS must not change without:
    - Updating all references.
    - Updating tests that depend on them.
- **Keep concerns separated**
  - In `assets/js/script.js`, keep areas grouped:
    - Nav & Services overlay.
    - Stats counters.
    - Parallax helpers.
  - Avoid mixing new logic into unrelated sections.
- **Helper functions over duplication**
  - If the same logic appears in many places, factor out small helper functions rather than copying.

---

## 6. Cookie banner JS rules

- **Semantics**
  - Accept and Decline must:
    - Store a persistent decision (e.g., in localStorage or cookies).
    - Prevent the banner from re‑appearing on any page, including Estate Agents.
- **Behaviour**
  - The banner:
    - Appears only when no decision is stored.
    - Does not flicker or re‑create itself on scroll.
    - Is styled consistently across pages.
- **Implementation**
  - Keep storage keys and selection logic as stable as possible.
  - If keys must change, thoroughly document the change in ExecPlan and update D1–D3 tests.

---

## 7. Header/nav & overlay JS rules

- **Nav toggle**
  - Desktop and mobile nav toggle behaviour should remain as currently implemented unless ExecPlan explicitly instructs a change.
- **Services overlay**
  - Services overlay should:
    - Open and close via predictable triggers (e.g., clicking Services, close icons).
    - Maintain focus and ARIA state appropriately.
- **Constraints**
  - Do not introduce heavy new dependencies.
  - Avoid adding multiple competing event listeners for the same behaviour; consolidate where possible.

---

## 8. Stats counters & scroll behaviour

- **One‑time animations**
  - Stats counters should animate once per page view when scrolled into view, not on every scroll event.
- **Performance**
  - Throttle or debounce scroll listeners if adjustments are needed.
  - Avoid per‑frame DOM reads/writes that could cause jank.

---

## 9. Contact form & Netlify function rules

- **API contract**
  - `netlify/functions/send-email.js` defines the backend behaviour; do not change its interface without updating both JS and Netlify configuration.
- **User feedback**
  - Maintain clear success/failure messages for contact form submissions.
  - Do not remove validation or error handling; improve it if necessary.

---

## 10. Testing & validation rules

- Every non‑trivial change to CSS/JS must be validated via:
  - At least the relevant DOM tests (D*),
  - E2E flows (F*), and
  - Visual tests (V*) if they cover the affected sections.
- If a test is flaky or mis‑specified, fix the test and document the change in ExecPlan rather than disabling it.
