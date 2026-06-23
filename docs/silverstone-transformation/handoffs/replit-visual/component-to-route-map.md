# Component-to-Route Map — Page Features v1

How the reusable React primitives (`web/src/visual/**`, exported from `index.ts`) map onto
the static prototype pages (`web/public/prototypes/**`) and the production routes the owner
should mount them into. The static prototype is the acceptance surface; the React primitive
is the liftable unit. **Nothing here is route-wired yet** — this is the integration guide.

## Shared primitives (mount on every page in the group)

| Primitive | Prototype behaviour | Mount where |
| --- | --- | --- |
| `useSectionReveal` | `reveal.js` IntersectionObserver section reveal | any route with `data-reveal` blocks (all non-home pages) |
| `usePageTransition` | `reveal.js` page-entry transition | top-level route shell for the page |
| `NavVisualStates` (home handoff) | `chrome.js`-injected nav states | site chrome / layout |

`chrome.js` (nav + footer injection) and `prototype.js` (nav compaction/disclosure) are
prototype-only plumbing; production already owns its real nav/footer/layout, so there is no
React primitive to lift for them — only the visual states.

## Services

| Prototype page | Production route | Primitives to mount |
| --- | --- | --- |
| `services/index.html` | `/services` | `ServicesDecisionMatrix` |
| `services/web-design-development/` | `/services/web-design-development` | `ConversionPathLens` + `DemoShell` (scenario `web-conversion`) + `ToolsCarousel` |
| `services/app-development/` | `/services/app-development` | `ProductStateStack` + `DemoShell` (`app-state`) + `ToolsCarousel` |
| `services/ai-voice-agents/` | `/services/ai-voice-agents` | `CallFlowOscilloscope` + `DemoShell` (`voice-callflow`, temporal) + `ToolsCarousel` |
| `services/ai-receptionists/` | `/services/ai-receptionists` | `FrontDeskConvergence` + `DemoShell` (`reception-console`) + `ToolsCarousel` |
| `services/content-creation/` | `/services/content-creation` | `EditorialLoom` + `DemoShell` (`content-loom`) + `ToolsCarousel` |
| `services/ai-automation/` | `/services/ai-automation` | `ProcessLattice` + `DemoShell` (`automation-lattice`) + `ToolsCarousel` |

## Industries

| Prototype page | Production route | Primitives to mount |
| --- | --- | --- |
| `industries/index.html` | `/industries` | `IndustriesAtlas` |
| `industries/estate-agents/` | `/industries/estate-agents` | `IndustryInstrument` (`industry-estate-agents`) + `DemoShell` + `ToolsCarousel` |
| `industries/hospitality/` | `/industries/hospitality` | `IndustryInstrument` (`industry-hospitality`) + `DemoShell` + `ToolsCarousel` |
| `industries/salons-barbers/` | `/industries/salons-barbers` | `IndustryInstrument` (`industry-salons-barbers`) + `DemoShell` + `ToolsCarousel` |
| `industries/trades/` | `/industries/trades` | `IndustryInstrument` (`industry-trades`) + `DemoShell` + `ToolsCarousel` |
| `industries/ecommerce/` | `/industries/ecommerce` | `IndustryInstrument` (`industry-ecommerce`) + `DemoShell` + `ToolsCarousel` |
| `industries/physios-chiropractors/` | `/industries/physios-chiropractors` | `IndustryInstrument` (`industry-physios-chiropractors`) + `DemoShell` + `ToolsCarousel` |
| `industries/dentists/` | `/industries/dentists` | `IndustryInstrument` (`industry-dentists`) + `DemoShell` + `ToolsCarousel` |
| `industries/gyms-fitness-studios/` | `/industries/gyms-fitness-studios` | `IndustryInstrument` (`industry-gyms-fitness-studios`) + `DemoShell` + `ToolsCarousel` |
| `industries/fitness-coaches/` | `/industries/fitness-coaches` | `IndustryInstrument` (`industry-fitness-coaches`) + `DemoShell` + `ToolsCarousel` |

Each `IndustryInstrument` is fed a sector-specific `InstrumentStep[]` (intake → triage →
human-handoff) and a human-in-control boundary note; the `ToolsCarousel` gets a
sector-relevant `ToolEntry[]`.

## Supporting pages

| Prototype page | Production route | Primitives to mount |
| --- | --- | --- |
| `how-we-work/` | `/how-we-work` | `useSectionReveal` + `usePageTransition` (process sequence/boundary are CSS modules in `pages.css`, no dedicated primitive) |
| `book/` | `/book` | reveal/transition only — booking form is CSS (`ss-booking`/`ss-form`); prototype is non-functional |
| `contact/` | `/contact` | reveal/transition only — contact form is CSS; non-functional |
| `about/` | `/about` | reveal/transition only — `ss-prose` narrative |
| `blog/` | `/blog` | reveal/transition only — `ss-featured-article` + `ss-article-grid` (CSS) |
| `blog-article/` | `/blog/<slug>` | reveal/transition only — `ss-article` + `ss-toc` + `ss-readmeter` (CSS) |
| `pricing/` | `/pricing` | reveal/transition only — `ss-pricing-grid`/`ss-tier` (CSS); figures labelled illustrative |
| `privacy-policy/` | `/privacy-policy` | reveal/transition only — `ss-legal` prose (placeholder) |
| `404/` | catch-all route | reveal/transition only — `ss-error` with real links |
| `tools/` | showcase / demo surface | `ToolsCarousel` (all categories) + `DemoShell` directory linking every scenario; this is a demonstration surface, not necessarily a 1:1 production route |

## Notes
- Demo scenarios in the React handoff are described by `DemoScenario`/`DemoStep` types;
  the prototype scenario `demo.js` files are the reference data shape to port.
- Some supporting pages intentionally have no dedicated primitive — their composition is
  plain semantic markup + `pages.css`, so production rebuilds them in its own components and
  only reuses the reveal/transition hooks for motion parity.
