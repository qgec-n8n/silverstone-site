# Silverstone React/Vite Foundation Implementation v1

> **For agentic workers:** Execute this plan inline on `transformation/foundation`. Keep one final foundation commit and do not edit Replit-owned visual paths.

**Goal:** Establish a production-quality, staging-only React/Vite/TypeScript foundation under `/web` without migrating legacy page content.

**Architecture:** React Router framework mode provides route modules, static prerendering, route error boundaries, and pending navigation state. The staging build is static (`ssr: false`) and emits meaningful HTML for the foundation route; future route migration will extend the same prerender registry. External integrations are consumed through typed adapters that fail closed to disabled or deterministic mock implementations.

**Tech stack:** React 19, React Router 7, Vite 7, TypeScript 5.9, Tailwind CSS 4, shadcn/ui, GSAP, Motion, Vitest, Testing Library, Playwright, axe-core, ESLint, and Prettier.

## Authority and ownership

- Branch: `transformation/foundation`
- Start commit: `24ac55440837e2fb40ad0196604c920760720351`
- Codex lease: `/web/package*.json`, `/web/vite.config.*`, `/web/tsconfig*`, `/web/src/app/**`, `/web/src/lib/**`, `/web/src/routes/**`, `/web/src/contracts/**`, `/web/src/seo/**`, `/web/tests/**`, `/web/scripts/**`, `/web/public/**`, and `/web` configuration files.
- Documentation exception: this file.
- Excluded: `/web/src/visual/**`, `/web/src/styles/visual/**`, legacy root application files, `.replit`, Netlify, DNS, production environment variables, `main`, analytics providers, Resend, and Calendly booking actions.
- Replit overlap check: no active lease, worktree changes, or existing files were found in the Codex-owned edit set before implementation.

## Implementation plan

### 1. Toolchain and static rendering

- [x] Add npm package metadata, pinned compatible dependency ranges, strict TypeScript, ESLint, Prettier, Vite, React Router, Vitest, and Playwright configuration.
- [x] Configure React Router with `ssr: false` and static prerendering for the foundation route.
- [x] Bind development and preview servers to `0.0.0.0` and preserve the existing Replit start command.
- [x] Add automated bundle measurement against the 220 KB gzip target and 300 KB hard ceiling.

### 2. Application shell

- [x] Add a semantic shell with skip link, header, navigation, main landmark, and footer.
- [x] Add root route error handling, hydration fallback, Suspense fallback, and route-navigation pending state.
- [x] Add a content-light foundation route that clearly states staging status without migrating production content.
- [x] Add a component test route only when `NODE_ENV !== "production"`.

### 3. Contracts and safety defaults

- [x] Add validated public environment parsing that fails closed.
- [x] Add typed analytics, contact, booking, and IndexNow interfaces.
- [x] Default analytics and IndexNow to disabled, contact to deterministic mock, and booking to a non-interactive placeholder.
- [x] Add canonical, metadata, robots, and JSON-LD builders.
- [x] Add generic lazy boundaries for WebGL and heavy visual modules without creating a visual implementation.

### 4. Component and motion foundations

- [x] Initialize shadcn/ui through the current CLI-compatible React Router setup.
- [x] Add only the Button and Skeleton primitives needed by the internal component route and loading states.
- [x] Install GSAP and Framer Motion without invoking either runtime in the foundation shell.
- [x] Record animation ownership: CSS for simple state styling, Framer Motion for local component transitions, GSAP for coordinated/scroll timelines, and lazy visual adapters for WebGL.

### 5. Test-first acceptance

- [x] Write unit tests for environment fail-closed behavior, integration defaults, SEO output, and lazy visual boundaries; verify they fail before implementation.
- [x] Add component tests for the semantic shell and loading/lazy boundaries.
- [x] Add Playwright smoke coverage for desktop and 390×844 mobile.
- [x] Add axe checks with zero critical or serious violations.
- [x] Verify the internal component route is available in development and absent from the production build.

### 6. Final gates

- [x] Run `npm audit`.
- [x] Run formatting check, lint, strict typecheck, unit tests, Playwright smoke, and axe.
- [x] Run a production-mode staging build, bundle report, and staging-safety script.
- [x] Inspect desktop and mobile screenshots and browser console output.
- [x] Confirm the path diff excludes Replit-owned visual paths and legacy production files.
- [x] Commit as `feat(web): establish React Vite staging foundation`.

## Dependency rationale

React Router 7.18.0 is intentionally selected over the newly released React Router 8 baseline because it supports the required framework/prerender architecture while retaining Node 20 compatibility for Replit and CI environments. Vite 7.3.5 is paired with it for the same compatibility reason. Tailwind 4.3.1 uses its first-party Vite plugin, and shadcn/ui 4.11.0 generated copied, reviewable primitives rather than adding a runtime component service.

No state library, data-fetching library, schema library, animation wrapper, WebGL renderer, analytics SDK, email SDK, or Calendly SDK is introduced at foundation stage.

The latest Vite 7 release permits esbuild `^0.27.0`, while npm audit identifies esbuild versions through 0.28.0 as affected by a low-severity Windows development-server file-read advisory. The lockfile therefore uses an npm override for patched esbuild 0.28.1; the full build and browser suites pass with that override.

Key installed versions:

- React and React DOM 19.2.7
- React Router, React Router dev tooling, and Node adapter 7.18.0
- Vite 7.3.5 and TypeScript 5.9.3
- Tailwind CSS and `@tailwindcss/vite` 4.3.1
- GSAP 3.15.0 and Framer Motion 12.40.0
- Vitest 4.1.9 and Testing Library React 16.3.2
- Playwright 1.61.0 and `@axe-core/playwright` 4.11.3
- ESLint 9.39.4 and Prettier 3.8.4

## Animation ownership

| Surface | Owner | Foundation status |
|---|---|---|
| Focus, hover, simple opacity/transform | CSS | Available |
| Local enter/exit and component layout transitions | Framer Motion | Installed, not active |
| Coordinated timelines and future scroll-linked sequences | GSAP | Installed, not active |
| WebGL and shader effects | Lazy visual adapter | Boundary only; no implementation |
| Scrolling and sticky behavior | Browser | Native; no scroll hijacking |

GSAP and Framer Motion must never animate the same property on the same element. Motion remains enhancement-only, and reduced-motion handling is required before either runtime is activated.

## Verification record

Capabilities used:

- architecture brainstorming and implementation planning;
- React performance and bundle-boundary review;
- Vite and React Router framework/prerender configuration;
- current Tailwind and shadcn/ui CLI guidance;
- Vitest and Testing Library test-first implementation;
- in-app Browser desktop/mobile inspection;
- Playwright smoke testing and axe accessibility analysis;
- verification-before-completion diff and command review.

Fresh passing commands:

```text
npm audit --audit-level=low
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run bundle:report
npm run staging:safety
npm run test:e2e
```

Results:

- dependency audit: 0 vulnerabilities;
- unit/component tests: 5 files, 9 tests passed;
- Playwright: 6 tests passed across desktop Chromium and 390×844 mobile Chromium;
- axe: zero serious or critical violations on both projects;
- production-mode staging build: prerendered `/index.html` plus blocked SPA fallback;
- development component route: HTTP 200 at `/__components` with `X-Robots-Tag`;
- production component route: HTTP 404 and no component-lab content;
- initial production JavaScript: 111.83 KB gzip, below the 220 KB target and 300 KB hard ceiling;
- staging safety: page metadata, `robots.txt`, generated HTML, analytics patterns, preview hosts, environment values, meaningful initial HTML, and development-route leakage all passed;
- desktop and mobile browser inspection: one main landmark, no horizontal overflow, correct canonical/noindex metadata, and stable responsive layout;
- screenshots: `/tmp/silverstone-foundation-desktop.png` and `/tmp/silverstone-foundation-mobile.png` (verification artifacts, intentionally not committed);
- no production email, booking, analytics, IndexNow, Netlify, DNS, or deployment action occurred;
- no files under `/web/src/visual/**` or `/web/src/styles/visual/**` were created or changed;
- legacy root application and `.replit` remained unchanged.

Rollback after commit:

```text
git revert <foundation-commit-sha>
```
