# Failed Service-Page Prototype Audit (Phase 1)

- **Date:** 2026-07-01
- **Scope:** Prove and document the current failed `/services/*` body implementation before removal.
- **Method:** Full code trace (three parallel investigations) + live browser capture on `localhost:5173`.

---

## 1. Active rendering chain (with file:line)

1. `web/src/app/routes.ts:8` — `route("services/:slug", "../routes/services/detail.tsx")`.
2. `web/src/routes/services/detail.tsx:17-59` — loader resolves the route from `future-route-manifest.json`, attaches `getApprovedServiceContent(path)`, renders `<ServicePage>`.
3. `web/src/routes/templates/service-page.tsx:52-204` — **PRESERVE.** Wires Aether intro (`RouteExperienceIntro`), `ExploreSystemTransition` (expandable hero), `BodyParticles`, reverse-return (`.ss-hv2-return`), `useAppExperience` state machine, JSON-LD. Renders the body via `<ServicePageVisuals route={route} />` at lines 134 and 188. **This is the only injection point that needs to change.**
4. `web/src/visual/data/page-modules.tsx:578-591` — `ServicePageVisuals` dispatcher: for approved routes calls `getApprovedServiceContent()` and renders `<ApprovedServicePageVisuals>`. **REWIRE** to the new `services-v2` renderer.
5. `web/src/visual/components/approved-service-page.tsx:534-595` — `ApprovedServicePageVisuals`, root `<div class="ss-visual-root ss-approved-service" data-service-variant=…>`. **REMOVE.**

## 2. Prototype components (to remove)

- `ApprovedServicePageVisuals` and its internal parts — `MarkdownContent`/`parseMarkdown` (approved-service-page.tsx:189-302), `CardsSection` (331-372), `BenchmarkPanel` (374-411), `ProcessRail` (413-437), `DemoSurface` (439-504), `ServicePicture` (304-329), `OpportunityMatrix` (506-532).
- Six signature components (each imports `visual.css`), used **only** here:
  - `signatures/conversion-path-lens.tsx` (web) — the prompt explicitly forbids the magnifying-glass "ConversionPathLens" unless fully redesigned.
  - `signatures/product-state-stack.tsx` (app), `signatures/call-flow-oscilloscope.tsx` (voice), `signatures/front-desk-convergence.tsx` (reception), `signatures/editorial-loom.tsx` (content), `signatures/process-lattice.tsx` (automation).

## 3. Prototype styles (to remove)

- `web/src/styles/visual/visual.css` — the `.ss-approved-service*` block, **≈ lines 724–1159** (`.ss-visual-root.ss-approved-service`, `__overview/__brief/__image/__copy/__cards/__card/__signature/__benchmarks/__metric/__process/__demo/__reserved-frame/__deterministic-panel`). Removed with any now-orphaned variables. `visual.css` is shared by other components, so **only the service block is removed**, not the file.
- **The light surface:** `.ss-visual-root` uses `background: var(--vx-platinum)` (`#e9eaef`). This is the "light platinum prototype surface" — a jarring light block inside the dark Particles environment. The new system uses the dark `--ss-v2-*` tokens instead.

## 4. Leaked internal/authoring copy rendered as public text

Confirmed rendered (visible eyebrows/titles), from `approved-service-page.tsx`:

| Leaked string | file:line | Rendered as |
| --- | --- | --- |
| `Component microcopy` | :347 | feature-cards eyebrow |
| `Outcome framing` | :347 | outcome-cards eyebrow |
| `Published benchmark evidence` | :381 | benchmark eyebrow |
| `Process steps` | :417 | process eyebrow |
| `Demonstration` | :447 | demo eyebrow |
| `Approved capability cards` | :577 | feature section title |
| `Approved outcome cards` | :587 | outcome section title |

Additionally, `demo.rawMarkdown` is dumped verbatim (approved-service-page.tsx:454-456), exposing authoring scaffolding to visitors: **`Section introduction`**, **`Browser-window placeholder one/two`**, **`Label:`**, **`Heading:`**, **`Status:`**, **`Configuration slot:`**, and `Reserved live website showcase · 01/02`. All confirmed on-screen (see §8).

## 5. Visual mismatches

- **Light platinum body** inside the dark cinematic Particles environment — breaks the Precision Luminescence language of the homepage baseline.
- **One long centred Markdown column** for the entire public copy (approved-service-page.tsx:569-573) — reads as a documentation page, not an editorial experience.
- **Generic repeated card grids** ("Approved capability cards" / "Approved outcome cards") reused identically across all seven routes.
- **Prototype section titles** = raw authoring labels (see §4).
- **Insufficient page-specific identity** — a single signature visual per route bolted onto an otherwise identical template; the two "reserved" web-design frames render as raw markdown text, not premium browser surfaces.

## 6. Duplicated content / route-specific failures

- All seven routes share one renderer and one CSS block; the only per-route variation is accent colours and a single signature visual. Every route repeats the same light card scaffolding, the same leaked eyebrows, and (for web) a raw-markdown "Reserved integration surfaces" dump. No route has a genuinely bespoke composition, component family, or animation choreography.

## 7. Files — remove vs retain

**Remove / fully replace:**
- `web/src/visual/components/approved-service-page.tsx`
- `web/src/visual/components/signatures/{conversion-path-lens,product-state-stack,call-flow-oscilloscope,front-desk-convergence,editorial-loom,process-lattice}.tsx`
- `.ss-approved-service*` block in `web/src/styles/visual/visual.css`
- The `approved` branch of `ServicePageVisuals` (`page-modules.tsx`) → rewired to `services-v2`.
- Obsolete prototype assertions in tests (`services-rendering.spec.ts` forbidden list is updated/expanded).

**Retain (preserve):**
- `service-page.tsx` template; `RouteExperienceIntro`, `HeroAetherField` (Aether intro); `BodyParticles` (Particles BG); `ExploreSystemTransition` (expandable hero); reverse-return control; CoreSpin loader; `useAppExperience` state machine.
- `approved-services.json` + `approved-services.ts` (authoritative copy, SHA provenance, benchmarks, disclaimer, metadata, distinctive phrases); route aliases (`/services/website-design-development`, `/services/ai-agents-automation`); `web/public/approved-images/**`; SEO metadata/schema pipeline; the `--ss-v2-*` cinematic tokens.

## 8. Pre-change screenshots (evidence)

Captured on `localhost:5173` at 1440×900 (`docs/silverstone-transformation/evidence/before-services/`):

- `before-web-design-01-intro-desktop.png` — the Aether intro (preserved infrastructure): pill "Bespoke digital experience", H1 "Make the website earn its place", Explore button. Correct.
- `before-web-design-02-body-fullpage-desktop.png` — the failed body after clicking Explore. Confirms: (1) light platinum surface, (2) long single-column markdown, (3) leaked headings "Approved capability cards", "Approved outcome cards", "Reserved integration surfaces", (4) raw demo scaffolding at the foot ("Section introduction", "Browser-window placeholder", "Label:", "Heading:", "Configuration slot:").

**Conclusion:** the failure is a body-renderer + CSS problem, cleanly isolatable. Removing `ApprovedServicePageVisuals` + the six signatures + the `.ss-approved-service*` CSS, and rewiring `ServicePageVisuals` to a new dark-cinematic `services-v2` renderer built on preserved data and shared primitives, resolves every listed defect without touching the homepage or the intro/particle/return systems.
