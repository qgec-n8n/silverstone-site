# Silverstone responsive, reduced-motion and fallback specification v1

## 1. Responsive principles

Composition changes to protect reading order and conversion, not merely to shrink desktop visuals. Copy precedes decorative media in DOM and on screens below 1024px unless the media is essential to understand the heading.

## 2. Breakpoint coordination

| Range | Grid | Hero | Motion/background |
|---|---|---|---|
| 320–479 | 4 columns, 20px gutter | single column | static only; no shader |
| 480–767 | 4 columns, 24px gutter | single column | static/CSS state only |
| 768–1023 | 8 columns, 32px gutter | copy + optional media below | static default; no pinned scene |
| 1024–1279 | 12 columns, 48px gutter | 5/7 or 6/6 | capability-gated deferred enhancement |
| 1280–1535 | 12 columns, 48px gutter | full composition | bounded full tier |
| 1536+ | 12 columns, 64px gutter, 1440px cap | full composition | bounded full tier |

Use intrinsic grids and container queries before route-specific breakpoints.

## 3. Template reflow

- Navigation becomes mobile disclosure below 1024px.
- Hero CTAs stack full-width below 480px and wrap above.
- Service/industry split modules always place copy first below 1024px.
- Directory grids use one column below 640px, two when 280px minimum cards fit, maximum three.
- Demos maintain reserved aspect ratio, then become vertical control → stage → event log.
- Tools rail becomes wrapped list under reduced motion, 400% zoom or when cards cannot remain at least 240px.
- Forms remain one column until labels and errors fit comfortably in paired rows.
- Footer stacks, then uses two/three/four groups as space permits.

## 4. Required viewport matrix

Manual acceptance at:
- 320×568;
- 360×800;
- 390×844;
- 412×915;
- 768×1024;
- 1024×768;
- 1280×800;
- 1440×900;
- 200% text zoom;
- 400% browser zoom from 1280px;
- portrait/landscape where relevant.

No unintended page-level horizontal overflow. Deliberate tables/rails must be labelled and independently understandable.

## 5. Reduced-motion policy

When `prefers-reduced-motion: reduce`:
- all content visible immediately;
- no shader, parallax, scroll scrubbing, line travel, auto-advancing content or ambient loop;
- reveals become instant or ≤80ms opacity;
- stagger is zero;
- demos use explicit step replacement;
- tools rail becomes static grid/list;
- skeleton is static neutral block;
- focus, status and sequence remain complete.

Reduced motion is a different presentation, not reduced information.

## 6. Low-power policy

Use static fallback when any of the following applies:
- reduced-motion preference;
- viewport below 1024px for shader routes;
- data-saving preference where detectable;
- failed WebGL capability/context;
- frame-budget monitor records repeated misses during prototype profiling;
- document hidden or stage off-screen;
- user activates a future “Reduce visual effects” setting.

Do not fingerprint hardware or create invasive device scoring.

## 7. Keyboard model

- Skip link is first focusable element.
- Navigation uses links and disclosure buttons; Escape closes and restores focus appropriately.
- All CTAs are real links/buttons.
- Cards are not nested interactive surfaces.
- Carousel controls and filters follow normal Tab order.
- Demos provide Start/Reset and retain focus on the activated control unless a documented result focus move is needed.
- Forms move focus to error summary on submit failure only.
- No hover-only action.
- Sticky elements never obscure focus.

## 8. Contrast and forced colours

- Normal text ≥4.5:1; large text and meaningful UI boundaries meet their applicable ≥3:1 thresholds.
- Focus uses F-02’s two-colour 4px total ring.
- Gradients remain decorative; text sits on controlled solid surfaces.
- Status pairs colour with label/icon/border.
- Forced-colours mode preserves outlines, buttons, form boundaries and current state; decorative backgrounds may disappear.
- Shader/poster must never be needed to distinguish a control.

## 9. Touch and pointer

Primary actions 48–56px high; all controls at least 44px preferred. Hover enhancements only under fine-pointer conditions. Tooltips are never the sole source of required content. Dragging is optional; every horizontal rail has buttons/native scrolling.

## 10. Media fallbacks

- Every decorative image has empty alt; meaningful media has concise alt/caption.
- Explicit width/height or aspect ratio prevents layout shift.
- Failed media displays a neutral surface and preserves adjacent copy.
- Shader fallback is the original branded poster.
- Existing imagery crops are content-managed per breakpoint.
- Video, if later approved, requires captions, transcript, poster, controls and no autoplay with sound.

## 11. Integration fallbacks

### Calendly
Reserved frame, loading message, timeout/failure message, privacy note and `/contact` fallback. Core booking explanation remains available without the provider.

### Forms
Pending, success, validation failure, network failure, timeout and offline states. Preserve entered data where safe.

### Tools/integrations
Unknown or unverified connections display “requires assessment”; no broken logo or implied availability.

## 12. Performance validation

Measure separately at cold load, route transition, hero animation, demo run and resize. Record:
- initial-route gzip total;
- route-local chunk delta;
- LCP element and timing;
- CLS;
- INP interaction traces;
- long tasks;
- animation FPS and dropped frames;
- GPU/context lifecycle for shader candidate;
- off-screen and hidden-tab pause.

Performance gates derive from F-02: ≤220 KB target, ≤300 KB hard ceiling, no animation-caused >50ms task, ≥45 FPS representative sustained desktop animation.

## 13. Acceptance failure hierarchy

1. Accessibility/keyboard/contrast failure — block prototype acceptance.
2. Licence/source uncertainty on third-party candidate — block adoption; prototype may remain isolated only where authorised.
3. Performance hard-ceiling/fallback failure — remove enhancement.
4. Brand/originality failure — redesign, do not rationalise.
5. Minor visual inconsistency — record for refinement after all blocking gates pass.
