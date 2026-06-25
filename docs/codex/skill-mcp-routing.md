# Skill and MCP Routing Protocol

Generated for the Codex preparation task on 2026-06-25. This document is the detailed capability-routing reference for future `/web` work.

## Required action record

For each meaningful future subtask, record:

```text
Task or action:
Task classification:
Skills loaded:
MCP servers queried:
Evidence retrieved:
Decision:
Implementation:
Verification:
```

Do not call irrelevant skills or MCP servers to inflate capability usage. Select tools because they materially improve the task.

## Routing matrix

| Task classification | Skills to load | MCP servers to query | Notes |
| --- | --- | --- | --- |
| Repository archaeology | `coding-standards`, `fix`, `homepage-audit`, `audit-website`, `markdown-surgical-edits` | GitHub when remote context helps | Use `rg`, Git history, and local docs first. |
| Dependency management | `context7-mcp`, `nodejs-backend-patterns` when relevant, package-manager docs through Context7 | Context7 | Query current docs before version or CLI decisions. |
| React Router architecture | `react`, `build-web-apps:react-best-practices`, `nextjs-best-practices` only if Next appears | Context7 | Use React Router docs for loaders, route modules, and builds. |
| Explicit state machines | `frontend-patterns`, `interaction-design`, `fix`, `frontend-testing` | Context7 for library APIs | Prefer clear enumerated states over distributed booleans when correcting homepage state flow. |
| Framer Motion shared-layout transitions | `motion-framer`, `interaction-design`, `frontend-testing` | Context7 | Verify current Framer Motion APIs before editing animation code. |
| Motion library usage | `motion-framer`, `frontend-design` | Context7 | Distinguish installed `framer-motion` from any separate `motion` package or docs. |
| GSAP choreography | `gsap`, `gsap-scrolltrigger`, `fixing-motion-performance` | Context7 | Keep GSAP/ScrollTrigger ownership centralized. |
| Lenis integration | `locomotive-scroll`, `frontend-testing`, `fix` | Context7 | Use one scroll owner and verify cleanup. |
| Three.js visual work | `threejs-fundamentals`, `threejs-webgl`, `threejs-animation`, `threejs-materials`, `threejs-postprocessing`, `lightweight-3d-effects` | Context7, Playwright | Validate canvas pixels and performance across breakpoints. |
| React Three Fiber | `react-three-fiber`, `threejs-*` as relevant | Context7, Playwright | Gate by capability tier and reduced motion. |
| Shaders | `threejs-shaders`, `threejs-postprocessing`, `web3d-integration-patterns` | Context7, Playwright | Avoid shader work without browser verification. |
| Particles | `lightweight-3d-effects`, `threejs-animation` when WebGL, `frontend-testing` | Context7, Playwright | Keep classic `particles.js` isolated and cleanup scoped. |
| Image preloading and decoding | `frontend-testing`, `responsive-design`, `performance`-oriented frontend skills | Context7, Playwright | Verify local assets, decode timing, and responsive behavior. |
| Performance | `fixing-motion-performance`, `frontend-testing`, `audit-website`, `responsive-design` | Playwright, Context7 | Measure before and after. Avoid cosmetic refactors. |
| Accessibility | `frontend-testing`, `responsive-design`, `ui-ux-pro-max`, `audit-website` | Playwright, axe through tests | Use automated checks plus keyboard/focus inspection. |
| Responsive design | `responsive-design`, `frontend-design`, `ui-ux-pro-max` | Playwright | Inspect mobile and desktop; avoid viewport-scaled fonts. |
| Browser testing | `frontend-testing`, `browser-use`, `fix` | Playwright MCP | Use screenshots, console logs, and interaction traces. |
| Visual QA | `frontend-design`, `web-design-guidelines`, `modern-web-design`, `ui-ux-pro-max` | Playwright, TypeUI, Aceternity, Magic UI | Compare against V2 direction and avoid unrelated visual drift. |
| SEO/indexability | `seo-audit`, `ai-seo`, `schema`, `homepage-audit` | Context7 for platform docs when needed | Preserve staging noindex unless the task explicitly changes indexability. |
| Copy and conversion | `copywriting`, `cro`, `product-marketing`, `positioning-basics` | TypeUI for section patterns when useful | Keep premium, precise, and conversion-focused. |
| Code review | `coding-standards`, `fix`, `frontend-testing` | GitHub if reviewing PR/remote state | Findings first, with file and line references. |

## Component and UI MCP routing

- TypeUI: primary source for design-system direction, luxury visual language, layout guidance, and design tokens.
- Untitled UI React: accessible conventional React components, forms, navigation, dashboards, and React Aria foundations.
- Aceternity UI: high-impact animated sections, cinematic backgrounds, and premium marketing motion.
- Magic UI: component inspiration and alternate animated UI implementations.
- 21st.dev Magic: generated UI variants, component exploration, and icon/logo search when `API_KEY_21ST` is available.
- shadcn: project-compatible registry retrieval and conventional component scaffolding. Use after MCP restart so the `/web` cwd configuration is active.
- Context7: required before library, framework, SDK, API, CLI, or cloud-service decisions.
- Playwright MCP: browser inspection, screenshots, interaction checks, console errors, and visual regression evidence.
- GitHub: repository archaeology, issues, pull requests, and remote refs when local history is insufficient.

## Homepage-specific shortlist

Read the complete `SKILL.md` for these skills before substantial homepage correction work:

- `frontend-design`
- `ui-ux-pro-max`
- `modern-web-design`
- `web-design-guidelines`
- `responsive-design`
- `interaction-design`
- `homepage-audit`
- `frontend-testing`
- `browser-use`
- `react`
- `build-web-apps:react-best-practices`
- `motion-framer`
- `gsap`
- `gsap-scrolltrigger`
- `react-three-fiber`
- `threejs-animation`
- `threejs-webgl`
- `threejs-shaders`
- `threejs-postprocessing`
- `lightweight-3d-effects`
- `tailwind-css`
- `shadcn-ui`
- `aceternity-ui`
- `magic-ui`
- `seo-audit`
- `copywriting`
- `cro`
- `coding-standards`
- `fix`

## Combination rules

- Combine architecture, motion, testing, and browser-inspection skills for stateful homepage behavior.
- Combine TypeUI with Aceternity or Magic UI only when they provide distinct value: TypeUI for direction and structure, Aceternity/Magic for specific animated sections.
- Combine Context7 with implementation work whenever APIs, CLI commands, library compatibility, or configuration details matter.
- Combine Playwright MCP with automated tests for visual, scroll, animation, canvas, and responsive verification.
- Avoid introducing a new animation system when an existing owner can satisfy the correction.
- Keep `/web` as the active application and the root legacy site as migration reference unless a future prompt explicitly changes scope.

## Verification expectations

- Reproduce or baseline before editing behavior.
- Prefer targeted unit/e2e tests for state and interaction changes.
- Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and relevant Playwright checks from `/web`.
- Use Playwright screenshots and console capture for homepage visual work.
- Preserve V2 direction: ultra-futuristic, high-tech, premium, luxurious, and conversion-focused.
