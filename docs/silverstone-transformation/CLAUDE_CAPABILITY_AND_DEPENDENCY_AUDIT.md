# Claude Capability & Dependency Audit — Services Rebuild (Prompt 5)

- **Date:** 2026-07-01
- **Scope:** Complete rebuild of the seven `/services/*` pages in the active `/web` React application.
- **Author:** Claude Code (Opus 4.8)
- **Status:** Phase 0 (capability + dependency audit) complete. This document gates the rebuild.

---

## 1. Repository architecture

- **Dual-application repository.**
  - **Legacy root site** (vanilla HTML/CSS/JS at repo root): frozen production/migration evidence. **Read-only.** Not touched by this work.
  - **Active application:** `/web` — React Router 7 (framework mode), Vite, TypeScript, Tailwind CSS v4.
- **Governance:** `AGENTS.md`, `/web/AGENTS.override.md`, `replit.md`, `.agents/SKILL_REVIEW_POLICY.md`, and `/docs/silverstone-transformation/**` are authoritative. Route/asset/claims contracts live under `docs/silverstone-transformation/` and `docs/codex/image-assets/`.
- **Rendering model:** `react-router.config.ts` sets **`ssr: false`** → the site is **statically prerendered** at build time (each route emits `build/client/<route>/index.html`). Essential copy must exist in prerendered HTML (not gated behind the Aether entry interaction).
- **Homepage baseline (design reference):** V2 dark cinematic system under `web/src/visual/home-v2/**`, `web/src/data/home-v2/**`, `web/src/styles/visual/home-v2.css` (namespace `.ss-hv2`), tokens in `web/src/styles/tokens/cinematic.css`. **This is the design baseline for the services rebuild** (per the explicit instruction to use the current homepage as the baseline).

## 2. Active app, package manager, commands

- **Working directory:** `/web`. **Package manager:** npm (`package-lock.json`). **Node:** `>=20.19.0`.
- **Commands (run from `/web`):**
  - `npm run dev` → `react-router dev --mode staging --host 0.0.0.0` (Vite dev, **localhost:5173**).
  - `npm run build` → `react-router build --mode staging` (static prerender to `build/`).
  - `npm run preview` → serves the build on **:4173** (Playwright baseURL).
  - `npm run typecheck` → `react-router typegen && tsc --noEmit`.
  - `npm run lint` → `eslint … --max-warnings=0` (zero-warning gate; strict + stylistic type-checked).
  - `npm run test` → Vitest (`tests/unit/**`). `npm run test:e2e` → Playwright (`tests/e2e/**`). `npm run test:a11y` → `--grep @a11y` (axe).
  - `npm run staging:safety` → asserts prerendered HTML is noindex, analytics-free, has per-route `data-content-id`.
  - `npm run verify` → format:check → lint → typecheck → test → build → bundle:report → staging:safety → e2e.

## 3. Dependency audit

Ran `npm ls --depth=0` and targeted `npm ls` for the visual/motion stack. `node_modules` present (295 top-level packages).

**Installed and healthy (relevant to this task):**

| Package | Version | Role |
| --- | --- | --- |
| `react` / `react-dom` | 19.2.7 | UI runtime |
| `react-router` + `@react-router/dev`/`node` | 7.18.0 | routing, prerender, typegen |
| `motion` | 12.40.0 | **primary animation library** (`motion/react`, `motion/react-m`) |
| `gsap` + `@gsap/react` | 3.15.0 / 2.1.2 | scroll choreography (centralised owner) |
| `three` / `@react-three/fiber` / `drei` / `postprocessing` | 0.184 / 9.6.1 / 10.7.7 / 3.0.4 | optional WebGL, capability-gated |
| `@paper-design/shaders-react` | 0.0.76 | shader adapters |
| `lenis` | 1.3.23 | single scroll owner |
| `lucide-react` | 0.468.0 | **approved icon system** |
| `simple-icons` | 16.24.0 | brand marks |
| `radix-ui` | 1.6.0 | accessible primitives (accordion, etc.) |
| `tailwindcss` + `@tailwindcss/vite` | 4.3.1 | styling (v4 `@theme`) |
| `particles.js` | 2.0.0 | shared Particles BG (vendored) |
| Testing: `vitest` 4.1.9, `@playwright/test` 1.61, `@axe-core/playwright` 4.11.3, `@testing-library/*`, `jsdom` | — | unit/e2e/a11y |

**Integrity findings / actions:**

- ⚠️ **`motion@12.40.0` installed vs `^12.42.1` declared** → `npm ls` exits `ELSPROBLEMS` ("invalid"). All APIs this rebuild uses (`motion/react`, `motion/react-m`, `useReducedMotion`, `LayoutGroup`, `whileInView`, variants, springs) are present in 12.40.0, so it is *functionally* fine, but the integrity gate fails until reconciled. **Action:** reconcile during the build (either `npm install` to pull ≥12.42.1, or align the declared range) and re-run `npm ls`. Documented so the mismatch is not silently shipped.
- A single nested `three@0.170.0` appears deep under an R3F peer alongside the primary `three@0.184.0` (mostly deduped). Not a blocker; noted.
- **No new dependencies are required** for this rebuild. The installed stack (Motion + GSAP + Three/R3F + Tailwind + Radix + Lucide) covers every visual, animation, and accessibility need. New dependencies will only be added if a specific need cannot be met cleanly, with documented justification (none anticipated).

## 4. Claude Code skills, plugins, MCP servers, tooling

**Skills** — canonical store `.agents/skills/` (≈140 skills, mirrored to `.claude/skills/`). Skill review is mandatory per `.agents/SKILL_REVIEW_POLICY.md`. Shortlist loaded/consulted for this task:

- Design/visual: `frontend-design`, `web-design-guidelines`, `modern-web-design`, `ui-ux-pro-max`, `responsive-design`, `interaction-design`, `landing-page-design`.
- Motion: `motion-framer`, `gsap`, `gsap-scrolltrigger`, `fixing-motion-performance`, `scroll-reveal-libraries`.
- 3D/visual (optional, capability-gated): `react-three-fiber`, `threejs-*`, `lightweight-3d-effects`, `web3d-integration-patterns`.
- Content/conversion/SEO: `copywriting`, `cro`, `positioning-basics`, `seo-audit`, `schema`, `ai-seo`.
- Quality: `frontend-testing`, `coding-standards`, `fix`, `audit-website`, `homepage-audit`.
- Component libraries: `shadcn-ui`, `aceternity-ui`, `magic-ui`.
- Capability routing reference: `web/AGENTS.override.md` → `docs/codex/skill-mcp-routing.md`.

**MCP servers** configured (`.mcp.json`) — all **available** this session unless noted:

| Server | Status | Use |
| --- | --- | --- |
| `playwright` | ✅ verified (used for before-shots) | browser automation, screenshots, a11y traces |
| `chrome-devtools` | ✅ available | perf/LCP/console inspection |
| `Context7` (docs) | ✅ available | current library/API docs before code decisions |
| `shadcn` | ✅ available (cwd=`/web`) | project-compatible component retrieval |
| `aceternityui` | ✅ available | animated marketing sections/backgrounds |
| `magicui` | ✅ available | animated component inspiration |
| `typeui` / `untitledui` | configured (remote) | design-system direction / accessible app components |
| `magic_21st` | needs `API_KEY_21ST` | generated UI variants / icon search (skip if key absent) |

**Browser / screenshot / responsive / a11y tooling:** Playwright MCP (verified), chrome-devtools MCP, project Playwright config (desktop-chromium + mobile-chromium 390×844), `@axe-core/playwright`. All required verification tooling is available.

## 5. Image-generation capability (Phase 0.5) — **AVAILABLE (added 2026-07-01)**

- **Server:** `gpt-image-2-mcp` (github.com/Borys520/gpt-image-2-mcp), cloned to `~/.claude-mcp-servers/gpt-image-2-mcp` (outside the git repo — not published to npm) and built (`pnpm install && pnpm run build`).
- **Wiring:** `.mcp.json` → `gpt-image-2` entry runs `.codex/bin/gpt-image-2-mcp.sh`, which sources `OPENAI_API_KEY` from a **local, gitignored** `.env.gpt-image-2-mcp` file (permissions `600`) — never from the committed `.mcp.json`, matching this repo's existing secret convention (`.codex/bin/21st-magic-mcp.sh`). `node .agents/sync-skills.mjs` propagated the entry into `.codex/config.toml`.
- **Session limitation (honest):** `.mcp.json` is read once at session start; this server was added mid-session, so its tools (`generate_image`, `edit_image`, `start_edit_session`, `continue_edit_session`, `end_edit_session`, `list_edit_sessions`) are **not yet registered in this running session** — a fresh session/reconnect is required for the harness to pick it up.
- **Verified working anyway:** spoke the MCP stdio JSON-RPC protocol directly (bypassing harness registration) to prove the pipeline end-to-end. A real `generate_image` call against gpt-image-2 succeeded, returned genuine OpenAI image data (C2PA content-authenticity metadata present, confirming it's not a stub), and saved a 1536×1024 PNG to `~/.claude-mcp-servers/gpt-image-2-output/`. The output visually matches the approved baseline template (`general-services-*`, `gyms-*`, `dentist-*`): photorealistic premium commercial interior, tablet on a counter, translucent glass holographic panel, bold short headline + one subtitle line, soft cyan/violet/pink gradient workflow pills, no garbled text, no logos, no people.
- **Provenance record — promoted to production (2026-07-01):** the AI Receptionists route previously duplicated Web Design's `general-services-1.png` (flagged in Phase 1 audit). Replaced with a bespoke generated image at the exact approved dimensions.
  - Prompt: warm marble reception counter, oak-slat panelling, plant, tablet with light beam, translucent glass holographic panel, headline "Never Miss a Call" / subtitle "Every enquiry answered, routed and logged.", three connected pastel-gradient pills ("Call Answered" → "Booking Confirmed" → "Escalated to Team"), cinematic studio lighting, no logos/people/watermarks.
  - Model `gpt-image-2`; size 2528×1696 (matches the approved asset convention exactly); quality `high`; cost ≈ $0.291.
  - Desktop: `web/public/approved-images/receptionists-hero.png` (2528×1696). Mobile: `receptionists-hero-mobile.png` — a native-resolution centre crop (1138×1696, no upscaling, no padding) via `sips`; the third pill clips slightly at the edge, an accepted minor cosmetic trade-off.
  - Wired into `route-art.ts` for `/services/ai-receptionists` with updated alt text. An earlier 1536×1024 test render (`image-20260701-104506-4db050-ai-receptionists-hero-test.png`) remains in `~/.claude-mcp-servers/gpt-image-2-output/` as a superseded draft, not used in the app.
- **Consequence:** image generation is now a real option for routes where the approved asset is thin (e.g., routes currently reusing `general-services-1.png`). Any image used in the live site will still be inspected before use and given a provenance note, per Phase 6.

## 6. Missing capabilities & resolutions

| Capability | Status | Resolution |
| --- | --- | --- |
| Image generation | ❌ unavailable | Use approved imagery + CSS/WebGL compositions; document gaps. |
| `motion` version integrity | ⚠️ mismatch | Reconcile in build; re-run `npm ls`. |
| Authenticated MCPs (figma, etc.) | ❌ not authorised | Not required; skipped. |
| Everything else (search, edit, bash, git, browser, screenshots, responsive, a11y, test, build) | ✅ available | — |

## 7. Final implementation approach (gate to Phase 2+)

The audit shows the failure is **narrow and surgical**, not architectural:

- The service **template** (`web/src/routes/templates/service-page.tsx`) is shared, correct, and **preserved** — it already wires the Aether intro, `ExploreSystemTransition` (expandable hero), `BodyParticles`, the reverse-return control, the `useAppExperience` state machine, and JSON-LD. The homepage is untouched by it.
- The **only** failure is the body renderer: `ServicePageVisuals` → `ApprovedServicePageVisuals` (root `.ss-visual-root .ss-approved-service`, light `--vx-platinum #e9eaef` surface) in `web/src/visual/components/approved-service-page.tsx`, plus the six `signatures/*` components and the `.ss-approved-service*` block in `web/src/styles/visual/visual.css`.
- The **authoritative copy is already parsed and preserved** in `web/src/content/services/generated/approved-services.json` (+ typed `approved-services.ts`), SHA-stamped from `web/docs/approved-copy/services/*.md`, generated by `web/scripts/generate-approved-service-content.mjs`. One gap: FAQ **answers** live only in `publicCopy` markdown (`faqLabels` are just the accordion titles) → the copy pipeline will be extended to emit structured `faqs: {question, answer}[]`.

**Plan:** replace only the body renderer with a new **`services-v2`** feature under a clean namespace (`web/src/features/services-v2/**`, `web/src/styles/services-v2/services-v2.css`, root class `.ss-srv2`) that (a) imports the `--ss-v2-*` cinematic tokens (never `.ss-hv2`/`.ss-visual-root`), (b) reuses shared primitives, (c) renders each route with a bespoke dark-cinematic composition from the preserved structured data, and (d) makes it impossible for the platinum prototype CSS to leak. Remove the prototype renderer, six signatures, and `.ss-approved-service*` CSS. Preserve intro/particles/return/schema/data/tokens/aliases.

**Verification** is via Playwright screenshots across the six required viewports, axe a11y, the existing `services-rendering.spec.ts` (extended with forbidden-string + required-phrase gates), reduced-motion checks, `typecheck`/`lint`/`test`/`build`/`staging:safety`, and an adversarial visual review — before any completion claim.
