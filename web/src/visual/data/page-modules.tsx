import { Suspense, type ReactNode } from "react";

import type { FutureRouteRecord } from "~/data/route-schema";
import { getApprovedServiceContent } from "~/content/services/approved-services";
import { hubCompositionByPath } from "~/data/route-compositions";
import { ServiceExperienceV2 } from "~/features/services-v2/service-experience";

/**
 * The services hub experience code-splits into its own chunk, exactly like
 * the per-service compositions — page-modules is eagerly-loaded foundation
 * code, and static prerendering resolves the Suspense boundary before each
 * route's HTML is written, so prerendered output always contains the full
 * hub content.
 */
const ServicesHub = hubCompositionByPath["/services"];

/** Visuals for `/services` and each approved canonical service route. */
export function ServicePageVisuals({ route }: { route: FutureRouteRecord }): ReactNode {
  if (route.path === "/services") {
    return (
      <Suspense
        fallback={
          <div className="ss-srv2-loading">
            <h1 className="ss-srv2-hero__title">{route.h1}</h1>
          </div>
        }
      >
        <ServicesHub />
      </Suspense>
    );
  }

  const approvedService = getApprovedServiceContent(route.path);
  return approvedService ? <ServiceExperienceV2 content={approvedService} /> : null;
}
