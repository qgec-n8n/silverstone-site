# Source manifest

## Requested 21st.dev references

1. Core Spin Loader
   - Page: https://21st.dev/community/components/m.kumailalirajpoot/core-spin-loader/default
   - Registry command: `npx shadcn@latest add https://21st.dev/r/m.kumailalirajpoot/core-spin-loader`
   - Local file: `components/21st-reference/core-spin-loader.tsx`
   - Note: local file is a self-contained drop-in implementation based on the supplied registry reference because the MCP is unavailable.

2. Aether Flow Hero
   - Page: https://21st.dev/community/components/dhiluxui/aether-flow-hero/default
   - Local file: `components/21st-reference/aether-flow-hero.tsx`

3. Particles Background
   - Page: https://21st.dev/community/components/UmairXD/particles-bg/default
   - Local file: `components/21st-reference/particles-bg.tsx`

4. Integration Hero
   - Page: https://21st.dev/community/components/ruixenui/integration-hero/default
   - Local file: `components/21st-reference/integration-hero.tsx`

5. Hero Button Expendable
   - Page: https://21st.dev/community/components/shadway/hero-button-expendable/default
   - Local file: `components/21st-reference/hero-button-expendable.tsx`

6. Display Cards
   - Page: https://21st.dev/community/components/Codehagen/display-cards/default
   - Local file: `components/21st-reference/display-cards.tsx`

## Supporting files

- `button.tsx`
- `utils.ts`
- demos under `/demos`
- integration animation CSS
- raw hero-button theme reference CSS

## Dependencies used by source references

- React
- Tailwind CSS
- `lucide-react`
- `framer-motion` or adapted `motion/react`
- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `@paper-design/shaders-react`

The wider Silverstone animation stack may also use GSAP, `@gsap/react`, Lenis, Three.js, React Three Fiber, Drei, postprocessing and maath as already requested.
