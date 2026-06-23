# Silverstone motion system v1

**Status:** Authoritative proposal constrained by D-01  
**Non-negotiables:** one effect/one owner; native scrolling; no virtual scroll; reduced-motion comprehension; cleanup on unmount; no off-screen continuous loop.

## 1. Ownership matrix

| Responsibility | Owner | Allowed | Prohibited overlap |
|---|---|---|---|
| hover, focus, press, colour, simple opacity/transform | CSS | buttons, links, card micro-lift, skeleton | JS recreation of same effect |
| component presence and layout state | Framer Motion | mobile nav, accordion, status panels, modal, card reorder | GSAP on same element/property |
| coordinated timeline and scroll orchestration | GSAP | hero sequence, multi-element section story, explicit-start demo | Framer layout/transform on controlled nodes |
| visibility and measurement | Native APIs | IntersectionObserver, ResizeObserver, visibilityState, matchMedia | polling layout every frame |
| scrolling and sticky behaviour | Native browser | anchors, scroll, sticky, scroll-snap | hijacking, forced smooth/virtual scrolling |

## 2. Property lease

Every animated node receives an implementation comment or registry record:

```text
motion-id: hero-primary-v1
owner: gsap
properties: opacity, transform
trigger: route-ready + fonts-ready timeout
cleanup: gsap.context().revert()
reduced: static-visible
```

A property lease is exclusive. Parent GSAP transforms and child Framer transforms require separate wrapper elements. CSS may still own colour/focus on a GSAP wrapper only when GSAP never writes those properties.

## 3. Duration and easing

- 80–140ms: press, toggle feedback, tooltips.
- 220ms: default component state.
- 320ms: panels and accordion.
- 480ms: route-local reveals.
- 800ms maximum: deliberate hero choreography.
- Ambient loops use 1200ms+ and pause off-screen/backgrounded.

Use `enter` for reveal, `exit` for removal, `standard` for state change, linear for progress/scrub. The overshooting `emphasis` easing is limited to scale ≤1.03 or translation ≤4px.

## 4. Stagger

**Proposal:** 35ms dense, 55ms default, 85ms sparse; maximum eight independently staggered items. Longer collections reveal in batches so the final item is not delayed excessively. Reduced motion sets stagger to zero.

## 5. Motion recipes

| Recipe | Owner | Properties | Trigger | Full motion | Reduced motion |
|---|---|---|---|---|---|
| nav disclosure | Framer | opacity, clip/height | user action | 220ms | 80ms opacity or instant |
| mobile nav | Framer | opacity, transform | user action | 320ms, 16px | 80ms opacity |
| button interaction | CSS | colour, shadow, transform | hover/focus/press | 140ms, ≤2px | colour/focus only |
| card hover | CSS | transform, shadow | fine pointer hover | 220ms, ≤4px | shadow/outline only |
| accordion | Framer | height, opacity | user action | 320ms | instant/80ms fade |
| hero entrance | GSAP | opacity, transform | route ready | 480–800ms, ≤48px | static visible |
| section reveal | GSAP | opacity, transform | intersection | 480ms, ≤32px | static visible |
| demo timeline | GSAP | declared per demo | explicit start | bounded timeline | step changes, no travel |
| layout reorder | Framer | layout transform | state change | 320ms | instant |
| skeleton | CSS | opacity/background-position | data pending | 1200ms loop | static neutral block |
| logo rail | Native/CSS | scroll position | user input | scroll-snap | wrapped grid/static |
| shader | isolated adapter | WebGL uniforms | idle/deferred | low-power bounded | static image |

## 6. Scroll-linked rules

GSAP ScrollTrigger or equivalent may read native scroll progress but may not replace scrolling. Pinning is exceptional and prohibited on primary content at mobile widths. Scroll-linked progress must not be the only method of revealing content. Anchor links, browser history, keyboard page movement and find-in-page remain intact.

## 7. Visibility and measurement

IntersectionObserver is the default for entering/leaving viewport work because it asynchronously reports intersection changes. [S10] ResizeObserver reports element box-size changes and is used for component measurement rather than window-only assumptions. [S11] `visibilityState`/`visibilitychange` pauses continuous work when the page is hidden. [S12]

Rules:
- one observer can serve multiple targets with the same thresholds;
- disconnect observers and cancel RAF/timelines on unmount;
- never call layout reads and writes in alternating loops;
- cache stable measurements and invalidate through ResizeObserver;
- pause shaders, ambient loops and non-essential timers while hidden.

## 8. Reduced motion

The browser media feature reports a user's reduced-motion preference. [S9]

**Proposal:** a shared policy layer combines `matchMedia('(prefers-reduced-motion: reduce)')` with any future explicit site control. In reduced mode:
- reveal content is immediately visible;
- parallax, scroll scrubbing, large translation, continuous shader movement and autoplay are disabled;
- state changes use instant replacement or ≤80ms opacity;
- no information, sequence, focus, or action is removed;
- progress remains textual or determinate without travelling effects.

## 9. Performance gates

Inherited D-01 gates:
- no animation-caused long task over 50ms;
- sustained desktop animation ≥45 FPS in representative profiling;
- no off-screen continuous animation;
- shader code deferred and excluded from initial-route target;
- initial-route JavaScript target ≤220 KB gzip, hard ceiling ≤300 KB.

F-01 available bundle baseline: 111.83 KB gzip, leaving 108.17 KB to the target and 188.17 KB to the ceiling before route/design additions. This is budget headroom, not an allocation to spend.

## 10. QA evidence

For the heaviest route capture: performance trace, long-task list, FPS sample, reduced-motion screenshot at 390×844, keyboard walkthrough during motion, route-transition cleanup, hidden-tab pause, resize response, and horizontal-overflow check.

## Sources
- **[S9]** [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- **[S10]** [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- **[S11]** [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- **[S12]** [MDN Document.visibilityState](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)
