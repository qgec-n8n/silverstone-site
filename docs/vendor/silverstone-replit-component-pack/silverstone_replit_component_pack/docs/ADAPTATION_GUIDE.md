# Required adaptation guide

## Application architecture

The Silverstone app is an existing React Router/Vite/TypeScript/Tailwind application. The source snippets use conventions from multiple ecosystems. Replit must adapt them rather than migrating the app.

- Remove or ignore `"use client"` when it is unnecessary.
- Replace `@/` aliases with the repository's configured alias.
- Convert `style jsx` patterns to Tailwind, CSS modules or the existing global token layer.
- Use one component-state animation package. If the project already uses `motion`, prefer `motion/react` and do not retain a duplicate `framer-motion` installation without evidence.
- Keep GSAP responsible for page/scroll choreography and Motion responsible for component state/layout.

## Core Spin Loader

Use the supplied local implementation as a starting point. Add route-family copy, minimum/maximum timing, session-aware shortening, reduced-motion handling and failure escape. It must never delay navigation merely for spectacle after content is ready.

## Aether Flow Hero

The source canvas algorithm is a reference, not the final flagship experience. Improve it substantially or combine its interaction model with R3F/Three.js/Paper Shaders. Use element dimensions rather than global viewport assumptions, cap DPR, pause off-screen, respect reduced motion and clean up every observer/listener/frame.

## Particles background

The raw pattern loads `particles.js` from a CDN and uses global state. Prefer a locally installed, typed implementation or an original canvas/R3F equivalent. If retained, use unique IDs, one script instance, proper cleanup and strict CSP-compatible delivery. Do not create multiple global `pJSDom` instances across routes.

## Integration Hero

Replace all remote Flaticon PNGs with local official/approved SVG assets. Create meaningful accessible names. Convert the animation CSS into the existing stylesheet/token system. Pause on hover and focus, expose manual controls where useful, and use a static/wrapped reduced-motion state.

## Hero Button Expendable

The supplied source contains placeholder company claims, a fake testimonial and simulated submission. None may appear in Silverstone production copy. Use only the shared-layout expansion, shader and transition ideas. Build a real accessible disclosure, conversion panel or page transition with correct focus handling, Escape behavior, background inertness and no fake form success.

Paper Shaders currently asks consumers to pin versions and uses the PolyForm Shield licence. Keep the required notice and verify the exact installed version and intended use before shipping.

## Display Cards

Use the stacked-card interaction as inspiration. Remove generic blue styling, ensure the visual skew does not reduce text legibility, provide non-hover access on touch devices and create Silverstone-specific service/benefit content.

## Brand assets on white backgrounds

The supplied emblem and full logos have white raster backgrounds. Never place the raw rectangles directly over a dark section.

Use one of these approved treatments:

1. Place the untouched raster inside an intentional Cloud White or Platinum Silver brand plate whose shape, padding and shadow are clearly designed.
2. Create a transparent-background derivative by removing only the contiguous white background while preserving the exact emblem, wordmark, geometry, colours, edges and proportions.
3. Use a light header/footer sub-surface designed around the original white asset.

For transparent derivatives:

- retain the original files unchanged;
- export separate named derivatives;
- inspect at 100%, 200% and on both dark and light test backgrounds;
- remove white halos without clipping metallic highlights;
- do not redraw, recolour or generatively recreate the logo;
- use the 2x file for high-density output.
