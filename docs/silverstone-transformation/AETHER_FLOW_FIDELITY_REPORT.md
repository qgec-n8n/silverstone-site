# Aether Flow Fidelity Report

**Date:** 2026-06-30  
**Component:** `web/src/visual/home-v2/hero-aether-field.tsx`

## Repair Summary

The Aether Flow component was restored to a canonical particle-network interaction model:

- Pointer coordinates are calculated from `canvas.getBoundingClientRect()`.
- Canvas scaling/device-pixel-ratio is applied by scaling the drawing context after resize.
- Particles move slowly by default.
- Pointer movement pushes nearby particles away from the pointer.
- Connections are recalculated from displaced particle positions on every frame.
- The network uses two colours only:
  - default particle/line colour `#66E8F0`
  - pointer/proximity line colour `#F3F7FF`
- The visible magnifier/lens/radius ring was removed; there is no `ctx.arc(mouse.x...)` pointer drawing path.
- RAF pauses when the document is hidden or the canvas is not intersecting.
- Resize, pointer, mouse, visibility, and RAF lifecycle cleanup is handled on unmount.
- Touch/reduced-motion fallback avoids forcing an interactive pointer network.

## Interaction Geometry

The exported helpers now make the geometry testable:

- `pointerPositionInCanvas(event, rect)` returns canvas-relative pointer coordinates or an inactive pointer when outside/touch.
- `applyPointerRepulsion(particle, mouse)` mutates particle coordinates away from the pointer when inside `AETHER_POINTER_RADIUS`.
- `getNetworkRgba(hex, opacity)` preserves the two-colour system without adding palette drift.

## Browser Evidence

Probe route: `http://127.0.0.1:4181/services/web-design-development` from root `npm run replit:preview`.

| State                | Centre active pixels | Centre density | Outer density | Proximity-colour pixels |
| -------------------- | -------------------: | -------------: | ------------: | ----------------------: |
| Before pointer entry |                 1150 |         0.0406 |        0.0230 |                       0 |
| Pointer at centre    |                  899 |         0.0317 |        0.0316 |                     144 |
| After pointer exit   |                  761 |         0.0268 |        0.0306 |                       0 |

Interpretation:

- The center region loses network density while the pointer is centered, showing displacement and connection separation rather than colour-only hover.
- The proximity colour appears only while the pointer is inside the field.
- The proximity response clears after pointer exit.
- The route mounted exactly one Aether canvas.

The only console warnings during this probe were caused by the probe itself calling `getImageData()` repeatedly.

## Automated Coverage

- `web/tests/unit/aether-field.test.ts` covers pointer coordinate mapping, touch/outside fallback, particle repulsion, two-colour constants, and absence of visible magnifier drawing.
- `web/tests/e2e/route-entry.spec.ts` and the custom browser matrix confirmed one Aether canvas on every service route at desktop and mobile widths.
