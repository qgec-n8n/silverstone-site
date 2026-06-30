# Silverstone animation responsibility model v1

## 1. Ownership matrix

| Effect category | Owner           | Examples                                                                   | Prohibited overlap                               |
| --------------- | --------------- | -------------------------------------------------------------------------- | ------------------------------------------------ |
| CSS             | browser/CSS     | hover, focus, simple opacity/transform, skeleton pulse                     | no JS for equivalent effect                      |
| Motion          | component owner | menu, accordion, modal, card entry/exit, layout transition                 | GSAP may not animate same element/property       |
| GSAP            | motion owner    | hero orchestration, scroll-linked sequences, coordinated section timelines | Framer layout animation on controlled properties |
| WebGL/shader    | shader owner    | deferred decorative hero background                                        | never essential content or interaction           |
| Native browser  | browser         | scrolling, anchor navigation, sticky positioning                           | no virtual-scroll replacement                    |

## 2. Rules

1. Motion is enhancement, never content delivery.
2. No scroll hijacking.
3. No global animation loop for off-screen content.
4. Intersection observers pause/unmount non-visible expensive effects.
5. Animations use transform and opacity by default.
6. Layout-triggering properties require measured justification.
7. No animation-caused long task over 50 ms.
8. Sustained desktop animation must remain at or above 45 FPS in representative profiling.
9. Reduced-motion mode removes parallax, large translation, continuous shader motion and autoplay while preserving hierarchy.
10. Mobile may use a static or simplified visual even when desktop uses a shader.

## 3. Lifecycle

- Effects initialise only after their owning component mounts.
- Effects clean up listeners, timelines, RAF loops and observers on unmount.
- Route transitions cancel outgoing work.
- GSAP context/revert or equivalent cleanup is mandatory.
- Shader context loss and unsupported devices fall back without console-error loops.
- Hidden tabs and backgrounded pages pause continuous work.

## 4. Shader gate

Shader work begins only after the static hero passes content, SEO, accessibility and performance gates. Shader code is dynamically imported and excluded from the initial-route JavaScript target. It requires:

- verified licence and source;
- static fallback;
- reduced-motion fallback;
- low-power/mobile fallback;
- context-loss handling;
- no user-input blocking;
- separate bundle measurement;
- frame-time trace.

## 5. Acceptance probes

- 390×844 mobile reduced-motion screenshot;
- desktop scroll trace;
- keyboard-only navigation during motion;
- route transition cleanup check;
- long-task trace;
- FPS sample during the heaviest sequence;
- no content flash that changes reading order;
- no horizontal overflow caused by transforms.

## Evidence authority

This blueprint is derived from the following repository authorities on branch `transformation/audit`:

- `../../audits/MANIFEST.md` (`A01-MANIFEST`)
- `../../audits/repository-live-audit-v1.md` (`A01-AUDIT`)
- `../../audits/route-inventory-v1.csv` (`A01-ROUTES`)
- `../../audits/asset-integration-inventory-v1.csv` (`A01-ASSETS`)
- `../../audits/repo-live-diff-v1.md` (`A01-DIFF`)
- `../../audits/seo-redirect-baseline-v1.csv` (`A01-SEO`)
- `../../audits/external-live-audit/` (`A02-*`)
- `../../research/platforms/` (`B01-*`)
- `../../research/benchmarks/` (`B02-*`)
- `../rebuild-decision-v1.md` (`C01-DECISION`)

Where evidence conflicts, the precedence order is: current owner-approved decision record; fresh implementation-baseline crawl; A-01 route/redirect inventories; A-02 advisory findings; platform and benchmark research. No conflict may be silently reconciled.

## 2026-06-30 package naming update

Decision D-016 updates the React component animation owner from direct `framer-motion` imports to the public `motion` package. The ownership model is unchanged: Motion owns ordinary React component animation, while GSAP remains isolated to exceptional choreography and must not animate the same element/property.
