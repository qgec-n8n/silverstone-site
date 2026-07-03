/**
 * core-pages entry point. Renders the bespoke body for one of the six core
 * marketing routes (how-we-work, blog, about, pricing, contact, book) via
 * its own fully bespoke composition — no shared section-architecture loop.
 *
 * Each composition is dynamically imported so its code (and its signature's
 * Motion-heavy SVG) code-splits into its own chunk rather than bundling into
 * shared, eagerly-loaded foundation code — same code-splitting shape as
 * services-v2's `service-experience.tsx`. React Router's static
 * prerendering resolves the Suspense boundary before writing each route's
 * HTML, so prerendered output still contains full content, never a loading
 * fallback.
 *
 * The shared route template continues to own the CoreSpin loader, Aether
 * intro, Particles background, expandable-hero transition, reverse-return
 * control and JSON-LD.
 */
import "~/styles/services-v2/services-v2.css";
import "~/styles/core-pages/core-pages.css";

import { lazy, Suspense, type ComponentType, type ReactNode } from "react";

import type { FutureRouteRecord } from "~/data/route-schema";

type CorePath = "/how-we-work" | "/blog" | "/about" | "/pricing" | "/contact" | "/book";

const compositionByPath: Record<CorePath, () => Promise<{ default: ComponentType }>> = {
  "/how-we-work": () =>
    import("./compositions/how-we-work").then((m) => ({ default: m.HowWeWorkComposition })),
  "/blog": () =>
    import("./compositions/insights").then((m) => ({ default: m.InsightsComposition })),
  "/about": () => import("./compositions/about").then((m) => ({ default: m.AboutComposition })),
  "/pricing": () =>
    import("./compositions/pricing").then((m) => ({ default: m.PricingComposition })),
  "/contact": () =>
    import("./compositions/contact").then((m) => ({ default: m.ContactComposition })),
  "/book": () => import("./compositions/book").then((m) => ({ default: m.BookComposition })),
};

const lazyCompositionByPath = Object.fromEntries(
  Object.entries(compositionByPath).map(([path, importer]) => [path, lazy(importer)]),
) as Record<CorePath, ReturnType<typeof lazy<ComponentType>>>;

function isCorePath(path: string): path is CorePath {
  return path in compositionByPath;
}

/** Loading state for the brief window while a composition chunk downloads on
 * client-side navigation (prerendered HTML never shows this). */
function CoreLoadingFallback({ route }: { route: FutureRouteRecord }) {
  return (
    <div className="ss-srv2-loading">
      <div className="ss-srv2__container">
        <h1 className="ss-srv2-hero__title">{route.h1}</h1>
      </div>
    </div>
  );
}

export function CorePageExperience({ route }: { route: FutureRouteRecord }): ReactNode {
  if (!isCorePath(route.path)) {
    return null;
  }

  const LazyComposition = lazyCompositionByPath[route.path];

  return (
    <Suspense fallback={<CoreLoadingFallback route={route} />}>
      <LazyComposition />
    </Suspense>
  );
}
