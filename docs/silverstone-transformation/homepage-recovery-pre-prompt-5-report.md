# Pre-Prompt-5 Homepage Recovery Report

**Date:** 2026-06-30  
**Scope:** `/web` homepage only. No service-page implementation work was performed.

## Internal Bug Log

1. Recent homepage edits changed the approved intro into a hybrid marketing hero with a booking CTA, capability chips, and different headline copy.
2. The intro mounted Aether plus prohibited hybrid grid/column layers, visually muting the Aether Flow network and adding prohibited hybrid contamination.
3. Protected benchmark metrics and the Live Signal Benchmarks card were removed from the homepage surface even though repository history retained the approved content.
4. Motion was installed and configured, but most homepage surfaces used generic CSS reveal timing or static rendering rather than deliberate Motion choreography.
5. The local Particles body background did not enable click-push and was not coordinated with the intro-to-body transition readiness.
6. The reverse X control could be visually present but blocked by lower-page stacking contexts near the footer.
7. The footer root could remain opacity `0` if a viewport callback was missed, making footer animation brittle.

## Root Causes

- The breakage came from state/structure drift, not a missing Motion dependency: `motion/react` and `motion/react-m` were available.
- Homepage copy and body structure drifted away from the approved history in `afbe5914`.
- Background ownership was mixed: intro Aether, prohibited hybrid layers, and body particles overlapped responsibilities.
- Animation ownership was inconsistent: Motion was not the primary system for body and footer reveals.
- Browser verification found a real stacking-context bug in the reverse X flow that code inspection alone did not expose.

## Final Homepage Contract

- State model: `loading`, `intro`, `opening`, `body`, `closing`.
- `loading`, `intro`, `opening`, and `closing` lock scroll, hide the scrollbar, do not mount the long body in normal layout flow, do not mount the footer in normal layout flow, and do not show the white site header.
- `intro` visibly contains only the pill, title, subtitle, and one button labelled exactly `Explore the system`.
- `body` mounts the scrollable page, reveals the white header and footer, enables scrolling, and exposes the reverse X.
- Reverse X is portal-mounted to `document.body` so it remains topmost and animates back to intro with focus restored to `Explore the system`.

## Backgrounds

- Intro Aether Flow: one full-screen canvas, one RAF loop, ResizeObserver sizing, pointer displacement, cleanup on unmount, no grid floor, no beams, no main column, no prohibited background residue.
- Final Aether visible network colours:
  - Default: `#66E8F0`
  - Proximity/hover response: `#F3F7FF`
- Body Particles BG: local `/vendor/particles.js`, one stable host/canvas, no CDN, scoped destroy, duplicate-canvas prevention, hover-grab, click-push, bounce, retina support, and mobile density reduction.

## Motion System

- Homepage React animation uses public Motion APIs only.
- No final application import uses `framer-motion`.
- Shared families now cover intro reveal, shared-layout route transition, body section reveal, card entrance, metric emphasis, CTA/image reveal, footer reveal, hover/focus states, marquee motion, reduced-motion fallbacks, and route re-entry replay.
- Reloading the route and navigating away/back both return to the intro sequence.

## Content Recovery

- Restored approved pill, title, and subtitle from repository history.
- Restored protected benchmark metrics and the Live Signal Benchmarks card.
- Removed the simplistic Silverstone System diagram.
- Added a separate generated bitmap Silverstone System visual at `web/public/home-v2/silverstone-system-visual.png` with `1672x941` intrinsic dimensions.

## Eradication

- Deleted prohibited hybrid background components, registry artifacts, related docs, and obsolete unit tests.
- Updated route background ownership so routes use shared Aether intro and local Particles body unless a future prompt explicitly authorizes another background system.
- Final scoped searches returned no matches for the prohibited hybrid-background terms.

## Browser Verification

- Custom Playwright QA covered desktop `1440x900`, mobile `390x844`, short viewport `390x620`, and reduced-motion mobile.
- Verified cold intro, opening transition, body state, reverse X, reload replay, navigate-away/back replay, footer visibility, metrics/Live Signal restoration, generated system image, Particles readiness, no extra intro CTA, no prohibited background residue, and no per-logo reveal choreography.
- Corrected DOM sanity check verified one `.ss-hv2-hero__canvas` in intro and one `[data-particles-host="body"] canvas` in body.
- Targeted homepage e2e passed: `npm run test:e2e -- tests/e2e/homepage-interaction.spec.ts --project=desktop-chromium` with 11 passing tests.

## Validation

Passed from `/web`:

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run staging:safety`
- `npm run test:e2e -- tests/e2e/homepage-interaction.spec.ts --project=desktop-chromium`

Known validation gap:

- `npm run bundle:report` fails at `Foundation JavaScript: 301.23 KB gzip (hard-ceiling-fail)`. The homepage behavior is verified, but the foundation bundle needs a follow-up performance pass.

## Commits

- Pre-change checkpoint: `54b7614e checkpoint: before homepage recovery repair`.
