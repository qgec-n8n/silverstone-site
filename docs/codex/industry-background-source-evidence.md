# Industry Background Source Evidence

This file records the source evidence available for the industry-only background
preparation work.

## Cybercore Section Hero

Source target:

- `https://21st.dev/community/components/dhiluxui/cybercore-section-hero/default`
- registry/install target:
  `https://21st.dev/r/dhileepkumargm/cybercore-section-hero`

Additional source evidence supplied by the user on 2026-06-26:

- 21st.dev "Any AI IDE Prompt" for `cybercore-section-hero.tsx`
- 21st.dev copy-pasteable `cybercore-section-hero.tsx`
- 21st.dev `demo.tsx` showing `CybercoreBackground beamCount={70}` mounted
  before a separate `.content-wrapper`
- 21st.dev Tailwind 4 CSS excerpt containing root colour variables and these
  keyframes: `rise`, `fade`, `floorGlow`, `mainGlow`, `moveGrid`

The supplied TSX source contains:

- `CybercoreBackgroundProps`;
- `beamCount?: number`;
- `DEFAULT_BEAM_COUNT = 70`;
- `useState` for generated beams;
- `useEffect` generation based on `Math.random()`;
- beam fields `id`, `type`, and inline `style`;
- structural classes `scene`, `floor`, `main-column`,
  `light-stream-container`, `light-beam primary`, and
  `light-beam secondary`;
- `role="img"` and `aria-label="Animated cybercore grid background"`.

The supplied demo source confirms:

- `CybercoreBackground` is mounted as a standalone sibling before page content;
- demo-only wrapper/content classes are `.content-wrapper`, `.main-header`,
  `.logo`, `.hero-section`, and `.cta-button`;
- demo-only copy includes `CYBERCORE`, `Enter the Grid`, and
  `Explore the Network`.

Those demo classes and copy are not part of the reusable background component
and must not be carried into Silverstone industry pages.

The supplied CSS excerpt contains variables and animation keyframes only. It
does not include the structural declarations for:

- `.scene`;
- `.floor`;
- `.main-column`;
- `.light-stream-container`;
- `.light-beam`;
- `.light-beam.primary`;
- `.light-beam.secondary`.

Magic/21st.dev MCP searches for `cybercore section hero` returned unrelated
component results in this environment. The shadcn registry/install endpoint
required authentication and did not return the complete stylesheet.

Implementation status:

- The React component in
  `web/src/components/ui/cybercore-section-hero.tsx` preserves the supplied
  component structure and beam-generation behaviour with project-compatible
  adaptations for lint rules, reduced motion, decorative-background semantics,
  and class isolation.
- The keyframes in `web/src/styles/industry-backgrounds.css` preserve the names
  and timing shape supplied by 21st.dev.
- The structural selector declarations in
  `web/src/styles/industry-backgrounds.css` are Silverstone-scoped adaptations,
  not retrieved upstream canonical CSS.

Before shipping a live industry redesign, retrieve the complete upstream
structural stylesheet if 21st.dev exposes it, or accept the Silverstone-scoped
CSS as a deliberate local implementation decision in a new task record.

## Background Gradient Snippet

Source target:

- `https://21st.dev/community/components/reapollo/background-gradient-snippet/default`
- registry/install target:
  `https://21st.dev/r/larsen66/background-gradient-snippet`

The supplied structure is a fixed dark background with:

- one centered radial cyan field;
- one low-opacity technical grid;
- no canvas;
- no particles;
- no pointer interaction.

Implementation status:

- `web/src/components/ui/background-gradient-snippet.tsx` preserves that
  structure with Silverstone colour adaptation and an optional `className`.
