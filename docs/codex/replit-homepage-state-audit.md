# Replit Homepage State Audit

Generated for the Codex preparation task on 2026-06-25. This audit documents the current Replit V2 homepage implementation without changing homepage behavior.

## Executive summary

The active homepage is the React Router `/` route under `/web`, not the frozen legacy root implementation. The current V2 surface is a dark cinematic luxury-technology homepage built from the `/web/src/visual/home-v2/**` stack and routed through `home.tsx` to `home-v2.tsx`.

Replit preserved the migrated content and route shell, then replaced the homepage presentation layer with a staged intro loader, locked hero reveal, Aether-inspired canvas hero field, `particles.js` body layer, Lenis/GSAP scroll orchestration, Framer Motion shared-layout CTA, and a multi-row integration marquee. The strongest reusable work is the route integration, the content data modules, the local SVG integration assets, the motion-policy hooks, and the staged shell that isolates the V2 homepage from the rest of the site.

The highest-risk areas for a future correction thread are scroll ownership, intro/body state transitions, the shared-layout CTA reverse/cancel path, canvas particle performance, `particles.js` teardown scope, image-loading strategy, and missing dedicated tests for the homepage interaction contract.

## Current architecture

- `/web/src/app/root.tsx` owns the HTML shell and pre-hydration flags.
- `/web/src/app/experience/app-experience.tsx` owns app-level experience state: loader active, homepage hero lock, header visibility, and scroll lock.
- `/web/src/styles/experience-gate.css` maps experience flags to body scroll lock and header visibility behavior.
- `/web/src/routes/company/home.tsx` is the public `/` route module and delegates page rendering to `home-v2.tsx`.
- `/web/src/routes/company/home-v2.tsx` composes the homepage sections and imports the V2 styles.
- `/web/src/visual/home-v2/**` owns the visual homepage system.
- `/web/src/data/home-v2/**` owns V2 homepage content and integration data.
- `/web/public/home-v2/**`, `/web/public/integrations/**`, and `/web/public/brand/**` provide local visual assets.
- `/web/tests/e2e/**` supplies broad route, console, SEO/staging, and accessibility smoke coverage.

## Relevant file map

| Area | Files |
| --- | --- |
| Route entry | `/web/src/routes/company/home.tsx`, `/web/src/routes/company/home-v2.tsx` |
| App shell | `/web/src/app/root.tsx`, `/web/src/app/experience/app-experience.tsx`, `/web/src/app/experience/use-capability-tier.ts` |
| Experience CSS | `/web/src/styles/experience-gate.css`, `/web/src/styles/visual/home-v2.css` |
| Scroll owner | `/web/src/visual/home-v2/scroll-provider.tsx`, `/web/src/visual/home-v2/lenis-handle.ts` |
| Intro loader | `/web/src/components/vendor/silverstone/core-spin-loader.tsx` |
| Hero | `/web/src/visual/home-v2/hero.tsx`, `/web/src/visual/home-v2/hero-aether-field.tsx`, `/web/src/visual/home-v2/explore-system-button.tsx` |
| Body backdrop | `/web/src/visual/home-v2/body-particles.tsx` |
| Sections | `/web/src/visual/home-v2/strategy-grid.tsx`, `impact-rail.tsx`, `architecture-process.tsx`, `ventures.tsx`, `integrations-strip.tsx`, `final-cta.tsx` |
| Header/footer | `/web/src/components/site-header.tsx`, `/web/src/components/site-footer.tsx` |
| Data | `/web/src/data/home-v2/home.ts`, `/web/src/data/home-v2/integrations.ts` |
| Assets | `/web/public/home-v2/**`, `/web/public/integrations/**`, `/web/public/brand/**` |
| Tests | `/web/tests/e2e/foundation.spec.ts`, `/web/tests/e2e/route-parity.spec.ts` |
| Vendor guidance | `/docs/vendor/21st-dev/**`, `/docs/vendor/aceternity/**` |
| V2 specs | `/docs/silverstone-redesign/**` |

## Current homepage state flow

1. `root.tsx` pre-hydration script sets body attributes for loader, hero lock, header hidden, and scroll lock on the homepage.
2. `AppExperienceProvider` initializes `loaderActive`, `homepageHeroLocked`, and `headerHidden` for `/`.
3. `CoreSpinLoader` shows for a fixed delay and then calls `setLoaderActive(false)`.
4. After loader completion, the hero remains locked and scroll remains disabled until the hero CTA reveal completes.
5. `ExploreSystemButton` runs the shared-layout expansion, then calls `unlockHomepageHero()` and scrolls to `#system` using the Lenis handle when available.
6. Header visibility is restored after hero unlock.
7. `ScrollProvider` owns Lenis and GSAP ScrollTrigger while the page is active, and tears them down on unmount.

## Current animation ownership

- App-level gating: React state in `AppExperienceProvider`, mirrored to body data attributes.
- Intro: Framer Motion inside `CoreSpinLoader`.
- Hero content and shared-layout CTA: Framer Motion.
- Hero background: custom 2D canvas in `HeroAetherField`.
- Body background: classic `particles.js` bundle injected by `BodyParticles`.
- Scroll smoothing and scroll-linked fills/parallax: Lenis plus GSAP ScrollTrigger in `ScrollProvider`.
- Section reveals: CSS classes and small per-component motion hooks.
- Logo carousel: CSS marquee with duplicated tracks and reduced-motion fallback.

The page currently mixes Framer Motion, GSAP, Lenis, raw canvas, CSS animation, and `particles.js`. That can work, but each future change needs explicit ownership rules to avoid dueling state and scroll timing.

## Asset-loading path

- Hero Aether field is generated on canvas and does not require remote assets.
- Body particles use `particles.js/particles.js?url`, dynamically inject a script tag, then create a global `window.particlesJS` instance.
- Integration logos are local SVGs under `/web/public/integrations/**` and are rendered through the integration data module.
- Section imagery is local under `/web/public/home-v2/**`.
- Images generally use lazy loading and async decoding where rendered through components.
- No dedicated V2 homepage preload manifest or responsive `picture`/`srcset` strategy was found for the homepage-specific imagery.

## Dependency use

- React 19 and React Router 7 provide the app/runtime surface.
- Vite 7 and Tailwind CSS 4 compile the application.
- Framer Motion powers the hero, CTA, and loader.
- GSAP and Lenis own smoothed scrolling and ScrollTrigger integration.
- `particles.js` provides the global body particle layer.
- Three.js, React Three Fiber, Drei, postprocessing, and Paper shaders are installed for future visual work, but are not the primary current V2 homepage rendering path.
- Playwright, axe, Vitest, Testing Library, ESLint, and TypeScript are configured for validation.

## Git history notes

- `f8c2320d` introduced the V2 homepage route, visual stack, data, documentation, and local asset structure.
- `30ead202` added image assets, body backdrop/particles, Lenis handle integration, secondary hero work, and accessibility improvements.
- `f950740c` replaced several earlier visual files with the current Aether hero and integration carousel implementation.
- Earlier migration commits preserved the React Router route and content framework from the pre-V2 application.

## Deviations and risks

- `CoreSpinLoader` uses a fixed roughly 4-second duration instead of a content-ready or asset-ready signal.
- `HeroAetherField` sizes its canvas against `window.innerWidth`/`innerHeight`, not the actual element box, which can drift from layout constraints.
- `HeroAetherField` performs pairwise particle link checks. Counts are capped, but the algorithm remains sensitive to high-DPR and viewport growth.
- Hero magnetic pointer math has a divide-by-distance path that should be guarded before future refinements.
- `BodyParticles` destroys every entry in `window.pJSDom` on unmount instead of only the instance mounted by the homepage.
- `BodyParticles` config enables hover/click interactivity, but the fixed backdrop container has `pointer-events: none`, so pointer behavior is effectively disabled.
- `particles.js` is injected as a classic script and mutates `window`, so it should stay isolated from SSR and route transitions.
- Scroll lock, hero lock, loader active, and header visibility are distributed across React state, body attributes, CSS, and native scroll position.
- The Explore CTA has an explicit Escape/cancel path, but there is no dedicated test covering reverse animation or focus recovery.
- The carousel duplicates logo tracks and hides the animated track from assistive tech, but there is no dedicated test for reduced motion, pause behavior, or logo contrast/blending.
- Image decode/preload coverage is broad but not enough for the homepage-specific hero/body transition contract.

## Missing tests

- Loader completion tied to homepage readiness.
- Hero lock release and body scroll restoration.
- Explore CTA expansion, reverse/cancel, focus handoff, and Lenis fallback.
- Header hidden/restored timing on homepage.
- `BodyParticles` instance creation and scoped cleanup.
- Reduced-motion behavior for particles, marquee, and scroll-triggered effects.
- Responsive logo carousel rendering and contrast.
- Homepage-specific image decoding/preload behavior.
- Visual regression coverage for the hero-to-body transition.

## Reusable work worth preserving

- React Router route wiring and metadata/schema preservation.
- V2 content/data split under `/web/src/data/home-v2/**`.
- Local integration logo asset set and registry.
- Motion capability policy hook.
- App-level experience gate concept.
- Lenis handle abstraction for CTA handoff.
- Reduced-motion fallbacks already present in several components.
- Existing Playwright route and accessibility smoke tests.
- V2 docs, source ledger, claims registry, and asset registry.

## Recommendations for the next thread

1. Start by reading `/docs/codex/skill-mcp-routing.md`, this audit, and `/web/AGENTS.override.md`.
2. Establish one explicit homepage state machine for loader, hero locked, reveal in progress, body active, and header visible.
3. Keep one scroll owner. Lenis plus GSAP should remain centralized in `ScrollProvider`.
4. Preserve the V2 dark premium direction and local-asset policy.
5. Add tests before changing the hero correction path: state transition, scroll lock release, CTA reverse, and console/a11y route smoke.
6. Avoid replacing the whole homepage. Target the smallest correction that fixes the observed failure.
7. If adding Three/R3F/shader work, gate it by capability tier and reduced motion, and validate with browser screenshots and canvas-pixel checks.
