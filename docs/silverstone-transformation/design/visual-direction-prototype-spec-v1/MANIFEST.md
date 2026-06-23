# Silverstone visual direction prototype specification v1 — manifest

**Created:** 23 June 2026 (Europe/London)  
**Archive:** `silverstone-visual-direction-prototype-spec-v1.zip`  
**Repository destination:** `/docs/silverstone-transformation/design/visual-direction-prototype-spec-v1/`  
**Status:** Validated design specification; no implementation code.

## Authority and inputs

- **B-02 supplied benchmark/component research:** component risk, Agentive benchmark limits, demo opportunities.
- **F-02 supplied brand and motion design-system pack:** tokens, typography, motion ownership, responsive and performance constraints.
- **H-01 supplied content and IA pack:** route model, service/industry content and conversion architecture.
- **Repository observation:** `transformation/foundation` resolved to the same current commit as `main` during this task; the attached packs supplied the authoritative requested design/content inputs.

## Additional primary-source recheck

Only four referenced component pages were rechecked because B-02 recorded incomplete dynamic/source evidence:
1. 21st.dev Animated Shader Hero.
2. 21st.dev Hero Button Expendable.
3. 21st.dev Backgrounds collection.
4. 21st.dev Scroll Area collection.

No other web source was needed. Component observations and proposals are separated in `shader-component-decision-v1.md`.

## Decision summary

- Adopt the original **Precision Luminescence** art direction and static branded background.
- Prototype the specified 21st.dev shader on home only; licence/source/runtime remain unresolved and block adoption.
- Adapt the existing Silverstone shader only after source, licence, performance and fallback review, for selected lower-traffic routes.
- Reject Hero Button Expendable and reject custom scroll areas as defaults.
- Adopt native scrolling, conventional conversion controls and the original Connector Constellation tools rail.
- Remove the existing lower-page carousel from all routes.
- Include the original background image-generation prompt because no evidence-complete 21st.dev candidate met the gates.

## Deliverables

| File | Purpose | Bytes | SHA-256 |
|---|---|---:|---|
| `image-generation-prompt-v1.txt` | Original branded static background/poster generation brief. | 3018 | `a856d735aaa8bd9a773b7522c47b3c5e17d32a56a85c226d90a1f2fd1e13786e` |
| `motion-storyboards-v1.md` | Motion ownership, timings, route storyboards and lifecycle. | 5786 | `29cd5cc56bc9548ee3784fade70d9db594e8173fbc8035f237e74df2ed043eda` |
| `page-visual-concepts-v1.md` | Route coverage, distinct page concepts and wireframe descriptions. | 16199 | `324aa0609afe6377468597ae1a3235b5e9c1998ff6641d4f1042b3df15bc3a4a` |
| `prototype-acceptance-v1.csv` | Machine-readable prototype acceptance criteria. | 9992 | `b02db783cedd6bbde062c8e00be21e8f8ed90beedc5f9e9024d5d3d40bdb68b9` |
| `responsive-reduced-motion-v1.md` | Responsive, keyboard, contrast, low-power and integration fallbacks. | 6235 | `b04aa658c4a03898e7429cdd2781b6bf59be4534790c9ff9dbc56b221d3385bb` |
| `shader-component-decision-v1.md` | Third-party dispositions and shader acceptance gates. | 6843 | `cbc546de340fb907ed04b45412c213f67355c78a51c067cf503c00f1f6b6a6f8` |
| `sitewide-art-direction-v1.md` | Sitewide visual language, navigation, footer, imagery, icons and budgets. | 11279 | `f3728fb48964fc486383114b319423b5af1349120a6fcd24be3a5a90923fa0f5` |
| `tools-carousel-demo-system-v1.md` | Existing-tools rail and original service/industry demo framework. | 5342 | `5efbaaf78758919e5827c3da423c92e88d1aa2d21c24a93702a07d18f7f159f0` |

## Route coverage validation

PASS — 27 route/template states are explicitly covered in the route register and acceptance CSV:
- home and services directory;
- six service pages;
- industries directory and all nine industry variants;
- how-we-work, booking, contact, about, blog index, article template, pricing and privacy;
- global 404/error state.

## Component decision validation

PASS — each required third-party candidate has an explicit disposition using the required vocabulary: **adopt**, **adapt after source review**, **prototype only**, **reject**, or **unresolved licence review**.

## Performance validation

PASS — budgets are consistent with F-02 throughout:
- baseline 111.83 KB gzip;
- initial-route target 220 KB gzip;
- hard ceiling 300 KB gzip;
- no animation-caused task above 50ms;
- representative sustained desktop animation at least 45 FPS;
- shader deferred and route local.

These are prototype acceptance budgets, not measured implementation results.

## Originality validation

PASS — all named concepts, layouts, diagrams, demos, icon language and background prompt are original proposals. No Agentive Labs copy, third-party source code, proprietary component payload or copied asset is included.

## Manifest consistency validation

PASS — all required files are present; the CSV parses; hashes and byte counts were generated from the final files before archive creation; ZIP paths are flat under the requested destination directory.

## Stop condition

Specification creation and validation are complete. Implementation is intentionally out of scope.
