# Industry Background System

This document defines the prepared background contract for future industry-page
work. The implementation is intentionally isolated so this preparation task does
not redesign live routes.

## Canonical Components

- Cybercore intro background:
  `web/src/components/ui/cybercore-section-hero.tsx`
- Background gradient body:
  `web/src/components/ui/background-gradient-snippet.tsx`
- Shared route mapping:
  `web/src/visual/route-backgrounds.ts`
- Isolated preview/contract renderer:
  `web/src/visual/route-background-layer.tsx`
- CSS:
  `web/src/styles/industry-backgrounds.css`
- Source evidence:
  `docs/codex/industry-background-source-evidence.md`

## Source Provenance

Cybercore source target:

- `https://21st.dev/community/components/dhiluxui/cybercore-section-hero/default`
- Registry/install target:
  `https://21st.dev/r/dhileepkumargm/cybercore-section-hero`

Background gradient source target:

- `https://21st.dev/community/components/reapollo/background-gradient-snippet/default`
- Registry/install target:
  `https://21st.dev/r/larsen66/background-gradient-snippet`

Magic/21st.dev retrieval reached the Cybercore React source structure and the
public component metadata. The user later supplied the official 21st.dev AI IDE
prompt and copy-pasteable Cybercore TSX/keyframe excerpt. That source evidence
is preserved in `docs/codex/industry-background-source-evidence.md`.

The supplied 21st.dev CSS excerpt contains root colour variables and keyframes,
but not the structural selector declarations for `.scene`, `.floor`,
`.main-column`, `.light-stream-container`, `.light-beam`,
`.light-beam.primary`, or `.light-beam.secondary`. The registry and shadcn
install endpoint required authentication and did not return the complete
stylesheet in this environment. The prepared Cybercore structural CSS therefore
stays isolated and documented as a Silverstone-scoped adaptation; before shipping
a live industry redesign, retrieve and compare the complete upstream stylesheet
if 21st.dev exposes it.

The background-gradient snippet uses the supplied canonical structure: fixed dark
background, centered radial cyan field, and static fine grid.

## Route Mapping

The reserved mapping is:

- `/industries`: intro `cybercore`, body `industry-gradient`
- `/industries/*`: intro `cybercore`, body `industry-gradient`
- every other route: intro `aether`, body `particles`

Do not scatter route checks through page components. Use the shared mapping in
`web/src/visual/route-backgrounds.ts`.

Current approved industry detail URLs still live under `/services/*` in the
migrated route manifest. Those routes remain non-industry background routes
until a future migration explicitly moves them under `/industries/*`.

## Colour Adaptations

Cybercore uses Silverstone-compatible tokens:

- background: deep graphite/blue-black;
- primary light: Electric Cyan `#5EC5D0`;
- secondary glow: Digital Blue `#597FAD`;
- highlight: Electric Pink `#C884C3`;
- silver highlight: `#E9EAEF`.

No multicolour rainbow treatment is allowed.

## Beam Count

- Capable desktop default: `beamCount={70}`.
- Mobile may use a lower count only after browser testing proves the need.
- Reduced motion renders the structural Cybercore layers without animated beams.

## Z-Index And Isolation

- Cybercore is a decorative background layer and must sit behind intro content.
- Background Gradient is fixed, non-interactive, and uses `pointer-events: none`.
- The implementation scopes generic upstream class names under
  `.ss-cybercore-scene` to avoid global collisions with `.scene`, `.floor`, or
  `.light-beam` elsewhere.
- Only one major route background may be mounted at a time.

## Lifecycle Rules

Industry intro state:

- CoreSpin Loader first;
- Cybercore mounts after the loader;
- existing pill/title/subtitle reveal remains;
- existing Expendable Hero Button remains;
- no Aether canvas;
- no `particles.js` canvas.

Industry body state:

- Background Gradient mounts;
- existing white header remains;
- existing body shell remains;
- existing X reverse control remains;
- no Aether canvas;
- no `particles.js`;
- Cybercore unmounts when intro closes.

Non-industry routes:

- unchanged Aether intro;
- unchanged native local `particles.js` body.

CoreSpin Loader and Expendable Hero Button remain canonical shared components.

## Reduced Motion

Cybercore must keep a usable static depth surface under
`prefers-reduced-motion: reduce`. The prepared component suppresses beam
generation and CSS animation while preserving the floor, central column, and
dark depth field.

The gradient body background is static and needs no special reduced-motion
variant.

## Testing Requirements

Before shipping live industry background integration:

- verify Cybercore structural layers render;
- verify complete stylesheet selectors exist;
- verify 70 beams generate by default;
- verify reduced-motion fallback;
- verify cleanup on unmount;
- verify `/industries` and `/industries/*` map to Cybercore and Gradient;
- verify homepage, company, service, conversion, legal, blog, and error routes
  map to Aether and `particles.js`;
- verify no duplicate major background mounts;
- run format, lint, typecheck, component tests, build, and staging safety from
  `/web`.

## Non-Industry Non-Regression

Do not change the homepage, services, consulting, demos, company pages, booking,
contact, Insights, legal, or error routes to the new backgrounds. Any future
thread that needs to change this invariant must update `web/AGENTS.override.md`,
this document, and the route-background tests in the same change.
