/**
 * industries-v2 entry point. Renders the dark cinematic industry body for a
 * canonical industry route via its fully bespoke composition.
 *
 * Mirrors services-v2: each composition is dynamically imported so its code
 * (signature diagrams, Motion choreography) code-splits into its own chunk.
 * React Router's static prerendering resolves the Suspense boundary before
 * writing each route's HTML, so prerendered output always contains the full
 * public copy, never a loading fallback.
 *
 * The shared route template continues to own the CoreSpin loader, Aether
 * intro, Particles background, expandable-hero transition, reverse-return
 * control and JSON-LD.
 */
import "~/styles/services-v2/services-v2.css";
import "~/styles/industries-v2/industries-v2.css";

import { Suspense, type ReactNode } from "react";

import { industryCompositionByRoute } from "~/data/route-compositions";

import { industryArt } from "./content/route-art";
import { getIndustryCopy, type IndustryCopy } from "./content";

/**
 * Loading state for the brief window while a composition chunk downloads on
 * client-side navigation (prerendered HTML never shows this, and a nav that
 * preloaded the chunk via `preloadRouteComposition` never reaches it).
 */
function IndustryLoadingFallback({ copy }: { copy: IndustryCopy }) {
  return (
    <div className="ss-srv2-loading">
      <div className="ss-srv2__container">
        <h1 className="ss-srv2-hero__title">{copy.h1}</h1>
      </div>
    </div>
  );
}

export function IndustryExperienceV2({ route }: { route: string }): ReactNode {
  const copy = getIndustryCopy(route);
  if (!copy) {
    return null;
  }
  const art = industryArt[copy.route];
  const Composition = industryCompositionByRoute[copy.route];

  return (
    <Suspense fallback={<IndustryLoadingFallback copy={copy} />}>
      <Composition copy={copy} art={art} />
    </Suspense>
  );
}
