# Animated Shader Hero Evaluation v1

**Required resource:** https://21st.dev/community/components/ravikatiyar/animated-shader-hero/default  
**Decision:** **Do not install from the available evidence. Treat only as a visual-direction reference pending source, licence and runtime review.**

## Inspection result

- **Verified:** The component page identifies a React hero with animated WebGL shader backgrounds and customizable content. [R3]
- **Verified:** The page exposes a shadcn-style install command and a usage example with a trust marker, two-line headline, supporting text, two CTA callbacks and an optional class name. [R3]
- **Verified:** The page reports creation and last update on 16 August 2025. [R3]
- **Verified limitation:** The retrieved page remained at a loading-preview state, so the animation, layout, mobile behaviour and interactive states could not be operated. [R3]
- **Verified limitation:** The component implementation payload and dependency declaration were not retrievable through the available channel. Only the usage example was inspectable. [R3]

## Visual fit

**Technical inference:** A luminous shader hero could fit Silverstone's premium technology identity and create a strong first impression. It also risks repeating a common “AI gradient hero” convention and may make Silverstone look component-led rather than operationally credible.

**Design direction:** Retain only the idea of atmospheric computational depth. Rebuild the composition, shader parameters, content hierarchy and interaction from Silverstone's own design system. Never reuse the demo copy or visual arrangement.

## React/Vite compatibility

- **Verified:** The page calls the component React-based. [R3]
- **Verified:** shadcn/ui supports Vite projects and registry items can declare package dependencies and files. [T1–T2]
- **Technical inference:** It may be compatible with React/Vite, but compatibility is not verified until the exact source is checked for Next.js-only imports, client directives, alias assumptions, CSS variables and Tailwind version expectations.

## Dependencies and source availability

| Criterion | Finding |
|---|---|
| Usage API | **Verified** at page level. [R3] |
| Component source | **Not inspected** |
| Declared dependencies | **Not inspected** |
| Transitive dependencies | **Unknown** |
| Version constraints | **Unknown** |
| Source-copy controls | “Copy code”/“View code” labels are visible, but implementation content was not retrievable. **Verified.** [R3] |

The presence of an install command does not demonstrate that the component is safe, maintained, licensed for the intended use, accessible or performant.

## Licensing

- **Verified:** No licence statement appeared in the retrievable component page text. [R3]
- **Unknown:** The component author's terms and the licences of its uninspected dependencies.
- **Decision gate:** Do not copy or install until the exact source is obtained and a component-level licence is recorded.

## Accessibility

No implementation-level conclusion is possible. The following must be verified in source and runtime:

- semantic heading order and real buttons/links;
- focus visibility against every shader frame;
- contrast under colour movement;
- pause/stop control where animation runs automatically beyond five seconds; [T4]
- reduced-motion path that removes continuous motion rather than merely slowing it; [T5, T11]
- no essential information embedded only in the canvas.

## Keyboard behaviour

The usage sample provides click callbacks but does not expose rendered element semantics. **Verified evidence gap.** [R3] Keyboard support must be tested after source retrieval; click handlers alone do not prove keyboard operability.

## Reduced motion

**Not verified.** No retrievable implementation showed a motion preference check or static mode. A production candidate must default to a static or near-static visual when reduced motion is requested. [T5, T11]

## Mobile behaviour

**Not inspectable.** Full-screen shaders require specific tests for:

- viewport changes and mobile browser chrome;
- high device-pixel ratios;
- thermal throttling and low-power mode;
- text wrapping and CTA stacking;
- touch hit areas;
- loading failure before the canvas is ready.

## WebGL fallback

**Not verified.** The page's own description establishes WebGL usage, making a fallback mandatory for a resilient Silverstone hero. [R3] Use a static gradient/SVG/image that preserves text and conversion actions if the shader cannot initialize or is disabled. WebGL resource limits and rendering resolution should be explicitly budgeted. [T12]

## Bundle and rendering cost

**High but unquantified risk.** The exact library and payload are unknown. Continuous full-viewport WebGL adds GPU work, and any animation framework adds JavaScript/runtime cost. The component must be measured inside the production Vite build rather than evaluated from marketing descriptions.

Required metrics:

- incremental JS/CSS size;
- shader/library chunks;
- time to first stable hero;
- long-task and frame-time profile;
- GPU memory proxy via canvas resolution/count;
- mobile battery/thermal behaviour;
- off-screen pause behaviour.

## Maintainability

**Medium–high uncertainty:** Source, dependency versions, fallback and licence are unresolved. A shader hero is also sensitive to browser/GPU differences and can require specialist debugging.

## Page suitability

| Page type | Suitability | Decision |
|---|---|---|
| Home | **Conditional** | Only location worth further investigation; use one original, progressively enhanced hero. |
| Service | **Low** | Prefer lighter visual framing and stronger service proof. |
| Industry | **Low** | Industry context should dominate generic spectacle. |
| Booking/contact | **Reject** | Conversion task should load quickly and remain visually stable. |
| Lower-traffic/legal | **Reject** | Cost and complexity are unjustified. |

## Recommendation

Do not install the referenced package in I-01 from the current evidence. D-01 may record “controlled shader atmosphere” as a visual hypothesis, then commission an original implementation with a static-first architecture, explicit reduced-motion behaviour, WebGL failure fallback and a hard mobile performance budget.

## Sources

- **[R3]** 21st.dev Animated Shader Hero: https://21st.dev/community/components/ravikatiyar/animated-shader-hero/default
- **[T1]** shadcn/ui Vite installation: https://ui.shadcn.com/docs/installation/vite
- **[T2]** shadcn/ui registry item schema: https://ui.shadcn.com/docs/registry/registry-item-json
- **[T4]** W3C WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- **[T5]** Motion accessibility guidance: https://motion.dev/docs/react-accessibility
- **[T11]** MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion
- **[T12]** MDN WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
