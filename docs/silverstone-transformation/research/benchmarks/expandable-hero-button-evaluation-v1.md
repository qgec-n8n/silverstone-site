# Expandable Hero Button Evaluation v1

**Required resource:** https://21st.dev/community/components/shadway/hero-button-expendable/default  
**Registry payload inspected:** https://21st.dev/r/moazamtrade/hero-button-expendable  
**Decision:** **Reject as-is. Rebuild the conversion interaction as an original accessible component if D-01 retains the concept.**

## Inspection result

- **Verified:** The component page provides a shadcn-style install command and lists `lucide-react`, `framer-motion` and `@paper-design/shaders-react` as dependencies. [R4]
- **Verified:** The registry payload exposes one React/TypeScript component file and declares the same three dependencies. [R4a]
- **Verified:** The component imports state/effect hooks, multiple Lucide icons, Motion animation primitives, and two Paper shader components. [R4a]
- **Verified:** The interaction expands from a hero CTA into a full-screen overlay containing marketing content and a lead form. [R4a]
- **Verified:** Submission is a timed simulation rather than a network-backed production form. [R4a]
- **Verified:** The page reports creation and last update on 12 December 2025. [R4]
- **Verified limitation:** The live preview remained in a loading state in the retrievable representation, so visual polish and responsive execution were not dynamically operated. [R4]

## Visual fit

**Technical inference:** The expand-to-form transition can create a polished “single journey” feeling, and the shaders align superficially with Silverstone's technology positioning. However, placing a large multi-field form inside a dramatic overlay can conceal the commitment level of the CTA, interrupt browsing, and make the hero responsible for too many tasks.

**Original alternative:** Use a clear primary CTA that routes to a dedicated booking/diagnostic flow, or open a compact, accessible dialog only when the task genuinely benefits from staying in context.

## React/Vite compatibility

- **Verified:** The registry item is a React TypeScript component and uses package imports compatible with a client-side React environment. [R4a]
- **Verified:** shadcn/ui supports Vite installation and registry items can declare dependencies and files. [T1–T2]
- **Technical inference:** The component is likely adaptable to React/Vite, but it assumes Tailwind utility classes, project CSS variables/theme tokens, browser globals and a client-rendered environment. It should not be installed before reviewing styling collisions and dependency versions.

## Dependencies

| Dependency | Verified role | Licence/status |
|---|---|---|
| `lucide-react` | Icons | Lucide uses ISC for its main software, with some inherited Feather icons under MIT terms. [T9–T10] |
| `framer-motion` | Overlay and transition animation | The upstream Motion project is MIT-licensed. [T5–T7] |
| `@paper-design/shaders-react` | Animated God Rays and mesh-gradient canvases | Paper Shaders uses the PolyForm Shield licence, permits commercial/non-commercial use subject to a non-compete restriction, and requests a notice/link. [T8] |

**Licence warning:** The 21st.dev component page and registry payload contain no component-level licence field or statement in the retrievable content. [R4–R4a] Dependency licences do not automatically license the community author's composition and source.

**Paper Shaders risk:** The licence is not a standard permissive licence. Silverstone should retain the required notice, confirm the intended use is outside the prohibited competitive category and obtain legal review if the product scope could overlap a design tool or shader library. This report is not legal advice. [T8]

## Source availability

**Verified:** The registry payload makes the component source available for inspection. [R4a]  
**Control:** This pack does not reproduce that source. Availability improves auditability but does not establish originality, licence clearance, maintainability or safety.

## Accessibility audit

### Modal semantics and focus

The inspected payload contains no occurrences of:

- `role=`;
- `aria-` attributes;
- `Escape` handling;
- `onKeyDown`;
- `autoFocus`;
- `tabIndex`.

This is a **Verified source observation** from the fetched registry payload. [R4a]

The WAI modal pattern expects focus to move into the dialog, remain within it during Tab/Shift+Tab navigation, close with Escape, and return to the invoking element; it also defines dialog naming and modal semantics. [T3] The inspected component does not implement these requirements at its own level. **Verified mismatch.** [R4a; T3]

### Keyboard behaviour

- Native form controls and buttons may remain individually keyboard-focusable. **Technical inference.**
- The overlay does not implement focus containment or Escape dismissal in the inspected source. **Verified.** [R4a]
- Keyboard focus may therefore move to obscured background content, and closing may not restore focus to the trigger. **Technical inference supported by source absence and WAI requirements.** [R4a; T3]

### Accessible names and status

The registry source includes a visual close control and form state transitions, but the retrieved payload exposes no ARIA attributes. **Verified.** [R4a] The close icon's accessible name and the submission/success announcement therefore require remediation.

## Scroll locking

- **Verified:** Opening the overlay sets the document body's overflow to hidden. Closing and cleanup set it to `unset`. [R4a]
- **Technical inference:** This does not preserve a pre-existing overflow value and may conflict with other overlays or application scroll-lock logic.
- **Required fix:** Use a shared lock manager or preserve/restore the exact prior inline style; account for scrollbar compensation and iOS behaviour.

## Reduced motion

The inspected payload contains no `useReducedMotion`, `MotionConfig`, `prefers-reduced-motion` or `matchMedia` reference. **Verified.** [R4a]

Motion provides reduced-motion APIs, but its site-wide configuration defaults must be explicitly set to respect the user preference. [T5] The component therefore needs a deliberate policy covering both Motion transitions and Paper shader animation.

## Mobile behaviour

**Technical inference based on source structure:**

- A full-screen overlay with a two-column information/form layout requires careful collapse and overflow handling.
- Body scroll locking can create mobile viewport and keyboard issues.
- A multi-field form inside an animated shader surface may produce input latency or visual instability on constrained devices.
- The inspected source should be tested with small-height screens, zoom, on-screen keyboards, safe areas and orientation changes.

Dynamic mobile behaviour was not operated in the available preview.

## WebGL fallback

- **Verified:** The component directly renders Paper `GodRays` and `MeshGradient` shader components. [R4a]
- **Verified:** No fallback string or component-level WebGL capability check appears in the inspected payload. [R4a]
- **Technical inference:** The shader library may have internal handling, but this component does not provide a conversion-safe static fallback if canvases fail or motion is disabled.

Paper Shaders describes its effects as lightweight canvas/WebGL shaders, but WebGL still requires explicit resource budgeting and lifecycle discipline. [T8, T12]

## Bundle and rendering cost

**Risk: High.** The component combines:

- Motion runtime and animated presence/layout;
- two shader canvases/effects;
- Lucide icons;
- a full hero, overlay and form in one component.

Lucide's static imports are tree-shakable, limiting icon cost to imported icons. [T9] Motion documents `LazyMotion` as a way to reduce initial animation feature payload, but the inspected component does not use it. [T6, R4a]

Exact cost must be measured in Silverstone's Vite build. No byte-size claim is made here.

## Maintainability

**Risk: High.** Concerns include:

- hero presentation, modal, form state, scroll lock and shader rendering coupled in one component;
- simulated submission logic that must be replaced;
- no component-level accessibility architecture;
- non-standard shader licence obligations;
- potential dependency/version drift;
- theme variables and utility classes embedded in the registry item.

## Page suitability

| Page type | As-is suitability | Original rebuilt pattern |
|---|---|---|
| Home | **Reject** | A clear hero CTA plus dedicated diagnostic/booking route; optional small accessible dialog. |
| Service | **Reject** | Inline service-specific consultation panel after evidence and objections. |
| Industry | **Reject** | Contextual assessment form with industry-relevant questions. |
| Booking/contact | **Reject** | The page itself should be the form; avoid another overlay. |
| Lower-traffic/legal | **Reject** | No justification for shader/modal runtime. |

## Recommendation

Do not install or lightly reskin this registry item. D-01 may retain the abstract concept of a CTA that reveals a tailored next step, but I-01 should implement it from first principles with semantic dialog primitives or a dedicated route, full focus management, Escape behaviour, reduced motion, static shader fallback, production form handling and measured bundle/runtime budgets.

## Sources

- **[R4]** 21st.dev Hero Button Expendable page: https://21st.dev/community/components/shadway/hero-button-expendable/default
- **[R4a]** 21st.dev registry payload: https://21st.dev/r/moazamtrade/hero-button-expendable
- **[T1]** shadcn/ui Vite installation: https://ui.shadcn.com/docs/installation/vite
- **[T2]** shadcn/ui registry item schema: https://ui.shadcn.com/docs/registry/registry-item-json
- **[T3]** WAI-ARIA modal dialog pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- **[T5]** Motion accessibility guidance: https://motion.dev/docs/react-accessibility
- **[T6]** Motion `LazyMotion`: https://motion.dev/docs/react-lazy-motion
- **[T7]** Motion licence: https://github.com/motiondivision/motion/blob/main/LICENSE.md
- **[T8]** Paper Shaders source, usage and licence: https://github.com/paper-design/shaders
- **[T9]** Lucide React guide: https://lucide.dev/guide/react
- **[T10]** Lucide licence: https://github.com/lucide-icons/lucide/blob/main/LICENSE
- **[T12]** MDN WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
