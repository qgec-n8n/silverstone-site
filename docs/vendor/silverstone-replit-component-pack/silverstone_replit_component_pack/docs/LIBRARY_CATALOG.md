# Curated component-library catalogue

Replit may inspect these repositories and documentation directly. Copy only selected compatible source, preserve notices and record the exact source path and licence.

## Structural and enterprise UI

### Untitled UI React
- Repository: https://github.com/untitleduico/react
- Open-source React/Tailwind/React Aria components.
- Use for navigation, menus, forms, tables, accordions, tabs, overlays, pagination and polished enterprise interaction foundations.
- The open-source repository is MIT licensed; do not assume PRO assets share that licence.

### shadcn/ui
- Repository: https://github.com/shadcn-ui/ui
- Use accessible primitives and open code as a behavior foundation, then completely restyle.
- MIT licensed.

### coss UI / legacy Origin UI
- Repository: https://github.com/cosscom/coss
- Use only source whose licence is confirmed for the intended project. The repository is mixed-license; `apps/ui` and `apps/origin` are described as MIT while other areas default to AGPL.
- Useful for refined inputs, menus, selectors, data-display and application-grade controls.

## Animated and marketing UI

### Magic UI
- Repository: https://github.com/magicuidesign/magicui
- Animated React/Tailwind/shadcn-style effects and marketing components.
- MIT licensed.

### Motion Primitives
- Repository: https://github.com/ibelick/motion-primitives
- Motion/Tailwind primitives for text effects, transitions, dialogs, carousels and component-state animation.
- MIT licensed; repository states it is beta, so inspect APIs before adoption.

### React Bits
- Repository: https://github.com/DavidHDev/react-bits
- Large collection of animated text, backgrounds and interaction components with TypeScript/Tailwind variants.
- Licence is MIT plus Commons Clause; use in the website but do not redistribute or sell it as a competing component library.

### Paper Shaders
- Repository: https://github.com/paper-design/shaders
- React/vanilla canvas shaders for backgrounds and masked visual effects.
- Pin the installed version because the project warns about breaking changes under 0.0.x.
- PolyForm Shield licence and required notice apply.

## Selection rules

- Research at least three suitable candidates before building a major component family when the decision is material.
- Prefer accessible structural primitives from Untitled UI, shadcn or coss and visual effects from Magic UI, Motion Primitives, React Bits or Paper Shaders.
- Do not import an entire library merely to use one component.
- Do not clone a full repository into tracked project source.
- Use a temporary checkout or direct source inspection, then copy/adapt only selected files.
- Record source URL, file path, commit/tag, licence, dependencies and modifications in the Silverstone component ledger.
- The final interface must look authored for Silverstone, not like a catalogue collage.
