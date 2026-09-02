/**
 * services-v2 entry point. Renders the dark cinematic service body for an
 * approved service route via its fully custom composition.
 *
 * Each composition is dynamically imported so its code (and its Motion-heavy
 * signature/demo components) code-splits into its own chunk rather than being
 * bundled into `page-modules.tsx`, which is shared, eagerly-loaded foundation
 * code used by every route family (home, industries, services index). Without
 * this, every visitor — regardless of which page they're on — would download
 * all seven services' code. React Router's static prerendering resolves the
 * Suspense boundary before writing each route's HTML, so prerendered output
 * still contains full content, never a loading fallback.
 *
 * This replaces the removed `ApprovedServicePageVisuals` prototype. The shared
 * route template continues to own the CoreSpin loader, Aether intro, Particles
 * background, expandable-hero transition, reverse-return control and JSON-LD.
 */
import "~/styles/services-v2/services-v2.css";

import { Suspense, type ReactNode } from "react";

import type { ApprovedServiceContent } from "~/content/services/approved-services";
import { serviceCompositionByRoute } from "~/data/route-compositions";

import { routeArt } from "./content/route-art";

/**
 * Loading state for the brief window while a composition chunk downloads on
 * client-side navigation (prerendered HTML never shows this — the static
 * build resolves the Suspense boundary before writing the file — and a nav
 * that preloaded the chunk via `preloadRouteComposition` never reaches it).
 * Never blank: shows the route's own H1 immediately so content is never
 * invisible.
 */
function ServiceLoadingFallback({ content }: { content: ApprovedServiceContent }) {
  return (
    <div className="ss-srv2-loading">
      <div className="ss-srv2__container">
        <h1 className="ss-srv2-hero__title">{content.metadata.h1}</h1>
      </div>
    </div>
  );
}

export function ServiceExperienceV2({
  content,
}: {
  content: ApprovedServiceContent;
}): ReactNode {
  const art = routeArt[content.route];
  const Composition = serviceCompositionByRoute[content.route];

  return (
    <Suspense fallback={<ServiceLoadingFallback content={content} />}>
      <Composition content={content} art={art} />
    </Suspense>
  );
}
