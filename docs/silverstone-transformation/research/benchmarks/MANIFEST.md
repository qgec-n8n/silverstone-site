# Silverstone Benchmark Component Research v1 — Manifest

**Created:** 22 June 2026 (Europe/London)  
**Archive:** `silverstone-benchmark-component-research-v1.zip`  
**Extraction destination:** `/docs/silverstone-transformation/research/benchmarks/`  
**Project role:** This research accompanies the existing Silverstone transformation artifacts and is consumed by **D-01** and **I-01**.  
**Implementation status:** Research only. No application or repository code has been implemented.

## Deliverables

| File | Purpose | SHA-256 |
|---|---|---|
| `21st-background-evaluation-v1.md` | Collection-level risk and suitability assessment for the Backgrounds resource. | `bdddd0433f573a606746dddad6748dcb0023cee0c2e1bfe8628923be216de623` |
| `agentive-labs-observation-audit-v1.md` | Evidence-led benchmark of positioning, structure, conversion, service explanation, integrations and inspection limits. | `7a3aef3676b75a6d5931e8327b08dd5194add400ddc5b265ee5cceca0ead9cf7` |
| `animated-shader-hero-evaluation-v1.md` | Evidence and risk assessment for Animated Shader Hero. | `29b36a55c2d83b5b8270bb9b4072365e119dd41cd3a3a3e1de68cbe48c9a6fe3` |
| `component-risk-scorecard-v1.csv` | Comparable risk scores and disposition for the four 21st.dev resources. | `34cabb640096de66d8bc27572c68916c2f24fbdbf199c462a4fcc40b80046f91` |
| `expandable-hero-button-evaluation-v1.md` | Source-informed accessibility, licence, performance and maintainability review. | `490930b30ef22cffa013c00dcb19abd4f0a98e5d99e2bb864c4f4d6d42c59ec2` |
| `original-demo-system-opportunities-v1.md` | Original demonstration concepts and acceptance criteria for D-01/I-01. | `92a9a4c038521b2c1880de96cab14daac8db63c547de740283a74452650ad952` |
| `scroll-area-evaluation-v1.md` | Collection-level assessment and native-scroll recommendation. | `6071c9c07c061d6d288ba4d0aa841a49f8e73874ccb86471252b7872501e8e48` |

## Decision summary

- **Agentive Labs:** Use as a strategic benchmark for vertical positioning, problem-led service explanation, existing-tool reassurance and low-friction consultation routing. Do not copy its wording, visual system, section composition or interactions.
- **21st.dev Backgrounds collection:** Discovery input only; select and audit an exact item.
- **Animated Shader Hero:** Do not install from current evidence; source, dependencies, licence, reduced motion and fallback remain unresolved.
- **Hero Button Expendable:** Reject as-is. Registry source reveals material modal-accessibility, scroll-lock, motion, shader-licence, mobile and coupling risks.
- **21st.dev Scroll Area collection:** Discovery input only; prefer native document/overflow behaviour unless a specific content need justifies a custom component.

## Risk score method

`overall_risk_score_0_100` is a research triage score, not a security certification. It combines evidence uncertainty with accessibility, licence, performance, mobile and maintainability risk. Higher is riskier. Collection pages score poorly because item-level evidence is unavailable; an exact component may score better or worse after inspection.

## Source and retrieval ledger

### Required URLs
- **[R1/A1] Agentive Labs homepage:** https://www.agentivelabs.co.uk/
- **[R2] 21st.dev Backgrounds collection:** https://21st.dev/community/components/s/background
- **[R3] 21st.dev Animated Shader Hero:** https://21st.dev/community/components/ravikatiyar/animated-shader-hero/default
- **[R4] 21st.dev Hero Button Expendable:** https://21st.dev/community/components/shadway/hero-button-expendable/default
- **[R5] 21st.dev Scroll Area collection:** https://21st.dev/community/components/s/scroll-area

### Additional Agentive first-party pages
- **[A2] Agentive Labs AI enquiry assistant:** https://www.agentivelabs.co.uk/services/chatbots
- **[A3] Agentive Labs website builds:** https://www.agentivelabs.co.uk/services/website-builds
- **[A4] Agentive Labs contact:** https://www.agentivelabs.co.uk/contact

### Supplementary primary/official technical sources (12)
- **[T1] shadcn/ui Vite installation:** https://ui.shadcn.com/docs/installation/vite
- **[T2] shadcn/ui registry item schema:** https://ui.shadcn.com/docs/registry/registry-item-json
- **[T3] WAI-ARIA modal dialog pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- **[T4] W3C WCAG 2.2 Quick Reference:** https://www.w3.org/WAI/WCAG22/quickref/
- **[T5] Motion accessibility guidance:** https://motion.dev/docs/react-accessibility
- **[T6] Motion LazyMotion guidance:** https://motion.dev/docs/react-lazy-motion
- **[T7] Motion licence:** https://github.com/motiondivision/motion/blob/main/LICENSE.md
- **[T8] Paper Shaders source and licence:** https://github.com/paper-design/shaders
- **[T9] Lucide React guide:** https://lucide.dev/guide/react
- **[T10] Lucide licence:** https://github.com/lucide-icons/lucide/blob/main/LICENSE
- **[T11] MDN prefers-reduced-motion:** https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion
- **[T12] MDN WebGL best practices:** https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

## Retrieval limitations

- The Agentive homepage and internal pages did not expose a line-level DOM representation in the available extractor. Findings use directly retrievable page metadata and search-indexed first-party excerpts. Dynamic visuals and interactions were not operated.
- Both 21st.dev collection pages exposed collection metadata but not their dynamically rendered item inventories.
- The Animated Shader Hero page exposed its usage API and install command, but the implementation registry payload was not retrievable.
- The Hero Button Expendable registry payload was retrievable and inspected. Its source is analysed but not reproduced.
- No Lighthouse run, browser devtools trace, mobile-device test, dependency installation, build measurement or legal opinion was performed.

## Originality and rights validation

**Validated:** This archive contains original analysis and original recommendations. It does not include proprietary implementation code, copied component source, copied layouts, copied assets, or reproduced marketing passages. Product and component names, package names, short interface identifiers and factual metadata are used only as necessary references.

Licence conclusions are limited to statements visible in the cited first-party sources. Absence of a licence statement in retrievable content is treated as uncertainty, not permission.

## Validation checks

- Required seven research files plus `MANIFEST.md` are present.
- CSV parses with four data rows and a consistent header.
- ZIP paths resolve under `docs/silverstone-transformation/research/benchmarks/`.
- No executable source files are included.
- No copied third-party component code is included.
- All implementation conclusions are labelled **Verified** or **Technical inference**, or clearly marked as an evidence gap.
- The pack stops at research and does not implement code.
