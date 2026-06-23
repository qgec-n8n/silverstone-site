# Silverstone shader and component decision v1

**Status:** Authoritative prototype disposition.  
**Retrieval date:** 23 June 2026 (Europe/London).

## 1. Observed component evidence

- **[OBS-B02]** The supplied B-02 pack could not inspect the implementation, dependency and licence payload for the 21st.dev Animated Shader Hero.
- **[WEB-21A]** The rechecked component page identifies a React/WebGL hero and exposes an install/usage surface, but the preview and source remained unavailable in the retrieved representation: `https://21st.dev/community/components/ravikatiyar/animated-shader-hero/default`.
- **[WEB-21B]** The rechecked Hero Button Expendable page exposes dependencies including Motion, Lucide and Paper Shaders, while B-02’s source review found modal, scroll-lock, focus, reduced-motion and fallback problems: `https://21st.dev/community/components/shadway/hero-button-expendable/default`.
- **[WEB-21C]** The Backgrounds collection remained a dynamic collection rather than an auditable exact candidate; its visible counts were internally inconsistent in retrieval: `https://21st.dev/community/components/s/background`.
- **[WEB-21D]** The Scroll Area collection likewise did not expose an exact candidate/source in retrieval: `https://21st.dev/community/components/s/scroll-area`.

These are observations. They do not grant permission to copy or install.

## 2. Decision matrix

| Candidate | Status | Pages | Rationale and gate |
|---|---|---|---|
| Original Silverstone static branded background | **adopt** | all route families as appropriate | No runtime dependency; authored from brand tokens and content hierarchy. |
| Existing Silverstone hero shader | **adapt after source review** | web service, how-we-work, about and selected lower-traffic editorial routes | Audit source, licence, bundle, cleanup, contrast and poster fallback; defer and disable below `md`. |
| 21st.dev Animated Shader Hero | **prototype only** + **unresolved licence review** | home only; one services-directory comparison prototype at most | Do not install into production. Obtain exact registry source/licence/dependency tree and measure before any adoption decision. |
| 21st.dev Background collection item | **unresolved licence review** | none until exact item selected | Collection evidence is insufficient. Select one exact item only if it materially outperforms the original background. |
| Hero Button Expendable | **reject** | none | Primary conversion must remain a conventional link/button. Source risks outweigh spectacle. |
| Original inline scope-preview disclosure | **adopt** | optional on home/services | Semantic button + in-flow panel, no modal, no scroll lock, no shader dependency. |
| 21st.dev Scroll Area item | **reject** as default; exact candidate may be **prototype only** after review | none by default | Native overflow and document scrolling satisfy current needs with lower risk. |
| Native tools rail with CSS snap | **adopt** | home and relevant service/industry routes | User controlled, zero carousel dependency, wrapped-grid fallback. |
| Framer Motion | **adapt after source review** | disclosures, status panels, reordering | Use only where already approved by foundation; LazyMotion/code split and one-owner rule. |
| GSAP | **adapt after source review** | bounded hero/demo timelines | Route local, explicit cleanup, no native-scroll replacement. |
| Lucide icons | **adapt after source review** for utility icons only | controls/status | Confirm licence/version; brand/service icons remain original Machined Signal assets. |
| Sora/Inter fonts | **unresolved licence review** until self-host rights confirmed | sitewide | Limit to subset WOFF2 and two preloads after verification. |

## 3. High-visibility route rule

Only `/` may ship a continuously animated shader candidate, and only after all gates pass. `/services` may contain a non-production comparison prototype but should default to static topology. No shader is permitted on booking, contact, article, privacy or error routes.

## 4. Shader acceptance gates

All must pass:
1. exact source and dependency tree archived;
2. explicit component and dependency licences recorded;
3. React/Vite compatibility verified without Next-only assumptions;
4. static poster renders before JavaScript and on context failure;
5. text/CTA contrast is stable in every frame;
6. reduced motion removes continuous movement;
7. module deferred and absent from initial-route target;
8. route-local shader payload target ≤45 KB gzip, hard ceiling 65 KB;
9. representative sustained desktop motion ≥45 FPS;
10. no animation-caused long task >50ms;
11. render resolution capped and off-screen/hidden pause proven;
12. mobile below 768px uses static fallback; 768–1023 uses static by default;
13. cleanup and route remount tested for leaked contexts/listeners;
14. originality review confirms no copied composition or parameter set.

Failure of licence, fallback, contrast or reduced-motion gates is an automatic rejection. Performance failure returns the route to the original static background.

## 5. Existing shader evaluation protocol

Prototype the existing Silverstone shader on one lower-traffic route with:
- a fixed static poster baseline;
- identical content/layout in shader and no-shader variants;
- measured JS delta and GPU trace;
- screenshot comparison at 320, 390, 768, 1024 and 1440;
- reduced-motion, forced-colours and low-power states;
- visual test for brand restraint and text legibility.

Disposition after test: **adopt**, **adapt**, or **reject**. “Looks premium” is not sufficient evidence.

## 6. Expandable hero button conclusion

The third-party candidate is rejected. It combines too many responsibilities at the most important conversion point. Silverstone’s primary hero action remains a normal link to `/book`. Where useful, a separate “See what to bring” button may expand a short in-flow checklist. The panel:
- follows the button in DOM;
- uses `aria-expanded`/`aria-controls`;
- does not capture focus or lock scrolling;
- closes only through the same control or explicit close button;
- uses 320ms height/opacity, instant in reduced motion.

## 7. Scroll-area conclusion

Use native document scrolling. For horizontal rails:
- semantic labelled region;
- native overflow-x;
- visible previous/next buttons when content overflows;
- keyboard reachable cards/links;
- no hidden scrollbar as the only affordance;
- optional CSS snap;
- wrapped grid for reduced motion and print.

## 8. Original-background decision

No evidence-complete 21st.dev background currently satisfies brand, licence and budget gates. Therefore `image-generation-prompt-v1.txt` is required and is the authoritative brief for a superior original static background/poster. It may also serve as the no-WebGL fallback for the home hero.
