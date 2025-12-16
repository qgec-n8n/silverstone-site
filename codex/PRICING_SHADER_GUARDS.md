<!-- FILE: codex/PRICING_SHADER_GUARDS.md -->

# Hero Shader Guards (Do Not Break)

## Shader runtime contract
Hero shader initialization is handled by:
- `src/js/hero-shader.js` (bundled into `assets/js/app.js`)

The shader:
- selects the canvas by id: `hero-shader-canvas`
- sizes itself based on a hero container matching: `.hero.title-band`

## Do-not-touch markup invariants (all pages)
Each target page must retain:
- a hero section with classes including: `hero` and `title-band`
- a canvas element:
  - `<canvas id="hero-shader-canvas" ...></canvas>`

## Do-not-touch CSS invariants
Avoid edits that change:
- z-index stacking of hero media/canvas
- positioning rules for hero container and canvas
- overflow rules that would clip the canvas unexpectedly

## Pricing embed placement rule
Pricing mounts must be placed only in the existing pricing placeholder location.
Do not move or restructure the hero section.

## Verification
Strict validator `scripts/validate-pricing-embed-markup.js --strict` must check:
- `#hero-shader-canvas` exists in every target HTML file
- a `.hero.title-band` section exists in every target HTML file
