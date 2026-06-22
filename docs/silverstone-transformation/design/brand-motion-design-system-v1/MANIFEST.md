# Silverstone brand and motion design system v1 — manifest

**Created:** 2026-06-23 (Europe/London)  
**Archive:** `silverstone-brand-motion-design-system-v1.zip`  
**Repository destination:** `/docs/silverstone-transformation/design/brand-motion-design-system-v1/`  
**Consumers:** F-03 and I-series prompts  
**Implementation status:** specification only; no repository code, branch, deployment, integration, or production system was changed.

## Authority

This package is the authoritative proposed Silverstone React brand-system, component-system, responsive-system and motion specification once uploaded unchanged to the destination above. “Proposal” labels distinguish design decisions from standards facts and repository evidence.

## Repository inputs

- D-01: `docs/silverstone-transformation/architecture/execution-blueprint-v1/` on `transformation/audit`.
- D-01 application boundary: `/web`; legacy root untouched.
- D-01 motion boundary: CSS for simple transitions, Framer Motion for component/layout state, GSAP for complex/scroll orchestration, native browser for scroll/visibility/measurement, no duplicated ownership, no scroll hijacking.
- D-01 performance: 220 KB gzip initial-route JavaScript target; 300 KB hard ceiling; no animation-caused task over 50ms; ≥45 FPS representative sustained desktop animation.
- Available F-01 foundation bundle baseline: `web/build/bundle-report.json`, generated 2026-06-22, 111.83 KB gzip, target-pass.
- Available built foundation CSS: Tailwind theme/base/utilities and semantic variables (`--background`, `--foreground`, `--primary`, `--border`, `--ring`).

### Evidence limitation

The repository connector did not expose a commit for the requested `transformation/foundation` ref, and no separately named F-01 implementation-report file was discoverable. The measured foundation bundle/build evidence was available on `transformation/audit`. This package records that limitation and does not invent report content, dependencies, or implementation completion.

## Contents

| File | Purpose | Bytes | SHA-256 |
|---|---|---:|---|
| `accessibility-contrast-matrix-v1.csv` | Computed light/dark colour-pair ratios and restrictions. | 6436 | `abe7f34c90ea66ad7c150db9bd13b4c97800f0da06dc54764c4cb2c0a50202e5` |
| `brand-token-spec-v1.json` | Machine-readable primitive, semantic, typography, layout, chart and motion tokens. | 52697 | `de497685ed3a05cd5e81c3f7ec0a6dfd41e15dc4dcfd4bc8e70edc9a5911d82e` |
| `component-specifications-v1.md` | Required component anatomy, states, accessibility and motion ownership. | 8451 | `0b3a038d55164387a09ddfdb5abae6dbb223e399ffbc1ced265978caafd63664` |
| `implementation-acceptance-v1.csv` | Measurable F-03/I-series acceptance gates and validation status. | 5114 | `3484ff14c6a15a0cb43ea16810895a8f7f3af0bc07b16ca9c244faabd04b842b` |
| `motion-system-v1.md` | CSS/Framer/GSAP/native responsibilities, recipes, lifecycle and reduced motion. | 6503 | `167cec7757bc8c65774b2e57a08920c986a961455e63c05d8cd534ebd53b0013` |
| `responsive-behaviour-v1.md` | Breakpoint, intrinsic layout, zoom, input and component behaviour. | 3936 | `320af415081f168f1a92ff630d20996975cdef39c786be7606d405abe44f98d6` |
| `semantic-token-map-v1.md` | Theme mappings, contrast policy, naming and usage restrictions. | 6873 | `c10479c49f2829688bd6dcef06a11c391e60026e7ed4c772497d440fa8ef0047` |
| `typography-layout-spec-v1.md` | Type scale, spacing, grid, containers, reflow and target sizing. | 5160 | `d449c67f72f082ae44c94c3d5f3c95ff2f14c4d9eb5d99fe0be79bc7d535d501` |


## Source register (12-page maximum respected)

- **[S1]** [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- **[S2]** [Understanding SC 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- **[S3]** [Understanding SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- **[S4]** [Understanding SC 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- **[S5]** [Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- **[S6]** [Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- **[S7]** [WAI-ARIA APG Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- **[S8]** [WAI-ARIA APG Disclosure Navigation Example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
- **[S9]** [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- **[S10]** [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- **[S11]** [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- **[S12]** [MDN Document.visibilityState](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)

## Validation record

- PASS — all nine required filenames are present, including this manifest.
- PASS — JSON parses; mandatory palette names and values are exact.
- PASS — required token domains are present and all token aliases resolve without cycles.
- PASS — token keys use consistent lower-kebab-case naming.
- PASS — every required contrast pair meets its threshold; sub-threshold primitive pairings are explicitly `RESTRICTED`, not silently approved.
- PASS — component coverage includes every family named in the request.
- PASS — each motion recipe has exactly one owner and an explicit reduced-motion result.
- PASS — native scrolling remains authoritative; no scroll hijacking is specified.
- PASS — source register contains exactly 12 official W3C/WAI/MDN pages.
- PASS — implementation acceptance CSV parses with 40 unique IDs and no non-PASS status.
- PASS — every manifest hash matches the packaged file.
- PASS — ZIP CRC test and exact root-folder inventory pass.

## Upload instruction

Extract the root folder `brand-motion-design-system-v1/` unchanged to `/docs/silverstone-transformation/design/brand-motion-design-system-v1/`. Preserve filenames. F-03 and I-series prompts must treat `brand-token-spec-v1.json` as the machine-readable source of truth and the Markdown/CSV files as its governance and acceptance layer.
