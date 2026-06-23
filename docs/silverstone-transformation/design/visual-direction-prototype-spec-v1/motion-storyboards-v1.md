# Silverstone motion storyboards v1

**Status:** Authoritative motion choreography.  
**Non-negotiable:** Motion clarifies hierarchy, causality or state. It never delays access to content.

## 1. Global ownership

| Effect | Owner | Maximum |
|---|---|---:|
| Hover/focus/press | CSS | 140–220ms, 2–4px |
| Disclosure/panel/layout | Framer Motion | 320ms |
| Hero/section/demo timeline | GSAP | 480–800ms |
| Scroll, sticky, snap | Native browser | no hijacking |
| Visibility/measurement | IntersectionObserver/ResizeObserver | event driven |
| Shader | isolated deferred adapter | bounded, pausable |

Every animated property has one owner and a static initial/failure state.

## 2. Route entry storyboard

**0ms:** HTML content and primary CTA visible.  
**0–120ms:** fonts settle or system fallback remains; no hidden text.  
**120–600ms:** optional hero elements reveal in reading order, ≤48px travel.  
**600–800ms:** one signal line/node sequence completes.  
**After 800ms:** no required content is still arriving. Deferred background may initialise only after idle and capability checks.

Reduced motion: all elements visible at 0ms; no transform or line drawing.

## 3. Home hero

1. Graphite control ring appears by opacity/scale 0.98→1, 320ms.
2. Six capability nodes reveal in two batches, 55ms stagger, maximum six.
3. Three connection paths draw once, 480ms.
4. Primary CTA remains stationary throughout.
5. Shader, when approved, drifts at low amplitude and pauses when hidden/off-screen.

No looping node orbit, particle rain or pointer chase.

## 4. Services decision matrix

User activates a problem category. Framer reorders service modules over 320ms with separate wrappers from CSS hover nodes. Focus remains on the active control. A text status announces the changed ordering. Reduced motion swaps instantly.

## 5. Web service storyboard

A synthetic page hierarchy starts misaligned. On explicit Start:
- 0–240ms: navigation labels group;
- 240–520ms: proof and CTA align to the selected journey;
- 520–800ms: a path line connects entry to conversion;
- final: text summary lists the design decisions.

## 6. App service storyboard

Explicit Start advances a request through Discover → Prototype → Validate → Release. Each state change is 220ms; no simulated loading longer than 300ms. A role badge shows who owns the next decision. Reduced motion uses instant state replacement.

## 7. Voice agent storyboard

Playback begins only after Start. Transcript lines appear in synchrony with a deterministic SVG waveform. Business-rule decisions use labels and borders, not confidence colours alone. Pause, resume and reset are keyboard accessible. Reduced motion displays one transcript step at a time without waveform travel.

## 8. Receptionist storyboard

Three channel tokens enter the intake queue sequentially, then one selected scenario branches to answer, booking, message or staff. Maximum total timeline 2.4s, user controlled. An event log is visible throughout.

## 9. Content storyboard

An approved source expands into four channel cards. An approval gate interrupts before publish. The sequence uses 480ms unfolding plus two 220ms state changes. No text is typed character by character.

## 10. Automation storyboard

A workflow runs stepwise. At an exception, travel stops and the human approval node gains a 2px emphasis ring. The user selects Approve or Return; no automatic resolution. Total continuous travel under 2s and never loops.

## 11. Industry storyboard template

Each industry page has one 3–5 step workflow. It reveals once when 40% visible on wide screens; below 768px it is static. A safeguard branch is always visible before animation. No pinned scene on mobile.

## 12. Tools carousel

Native horizontal movement only. Previous/next buttons call one-card or one-group scroll. CSS snap is optional. No autoplay. On keyboard activation, focus remains on the control unless the user explicitly enters a card. Reduced motion converts the rail to a wrapped grid.

## 13. Booking and contact

Only CSS feedback and Framer status-panel presence. Calendly loading skeleton is static under reduced motion. Submit state uses text plus spinner for no longer than the real request; no artificial delay.

## 14. Blog

Article cards receive ≤2px hover lift on fine pointers. Topic filtering uses 220ms opacity only. Article reading progress is CSS-only and nonessential. No reveal animation within body copy.

## 15. Navigation

Desktop disclosure: 220ms opacity/clip, Escape close, focus-leave close. Mobile panel: 320ms, 16px travel; reduced motion 80ms opacity or instant. Compact-on-scroll header uses CSS size transition once and never hides completely.

## 16. Background lifecycle

1. Render static poster.
2. Confirm no reduced-motion request.
3. Confirm viewport ≥1024px for shader routes.
4. Defer module until idle after LCP-critical content.
5. Cap device pixel ratio/render scale.
6. Pause on document hidden or stage off-screen.
7. Handle WebGL context loss by restoring poster.
8. Dispose buffers/listeners on route unmount.

## 17. Low-power fallback

Fallback triggers include reduced motion, save-data where available, coarse/low-width route policy, failed capability test, missed frame budget or context loss. The fallback is immediate and silent; content and controls do not move.

## 18. QA trace

For home and the heaviest service route capture:
- route load to idle;
- hero motion;
- demo start/reset;
- tools rail keyboard use;
- hidden-tab pause;
- resize from 1440 to 768;
- reduced-motion reload;
- context-loss/fallback simulation.

Fail if animation causes a reproducible >50ms long task, if representative sustained desktop motion falls below 45 FPS, or if focus becomes obscured.
