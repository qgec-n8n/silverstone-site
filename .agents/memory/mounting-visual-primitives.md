---
name: Mounting /web visual primitives into routes
description: Non-obvious constraints when lifting web/src/visual/** primitives into live React Router pages.
---

# Mounting visual primitives into routes

When mounting `web/src/visual/**` primitives (DemoShell, signatures, ToolsCarousel,
IndustryInstrument, ServicesDecisionMatrix, IndustriesAtlas) into live route templates:

- **All visual CSS is scoped under `.ss-visual-root`.** A primitive rendered without
  an `.ss-visual-root` ancestor mounts unstyled. Wrap mounted visuals in
  `<div className="ss-visual-root">…</div>`.
  **Why:** `visual.css` rules are all written as `.ss-visual-root .ss-…`.
  **How to apply:** any route-level mount must provide that wrapper.

- **The demo "stage" tile classes (`ss-tile`, `ss-tile__label`, `ss-tile__value`,
  `ss-demo__synthetic`) are NOT in `visual.css`.** The prototypes (`public/prototypes/**`)
  render them via innerHTML with inline styles; the React `visual.css` never defined them.
  If a ported DemoShell scenario renders these classes, add the rules to `visual.css` or the
  stage looks like plain unstyled text.

- **Industry detail pages live at `/services/<slug>`, not `/industries/<slug>`.**
  `IndustriesAtlas` defaults `basePath="/industries"`, which would 404. Pass
  `basePath="/services"` on the `/industries` index so atlas cards link to real pages.
  `ServicesDecisionMatrix` default `basePath="/services"` is already correct.

- **Lint trap (strictTypeChecked):** `@typescript-eslint/restrict-template-expressions`
  is configured with `allowNumber:false` in `/web`. Any `${someNumber}` in a template
  literal fails `npm run lint --max-warnings=0`. Wrap with `String(...)`.
