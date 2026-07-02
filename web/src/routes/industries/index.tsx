import { lazy, Suspense } from "react";
import { useLoaderData } from "react-router";

import { createRouteLoader, createRouteMeta } from "~/routes/shared/route-data";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";

// Code-splits the hub body like every services/industries composition;
// static prerendering resolves the boundary before HTML is written.
const LazyIndustriesHub = lazy(() =>
  import("~/features/hubs-v2/industries-hub").then((module) => ({
    default: module.IndustriesHubExperience,
  })),
);

export const loader = createRouteLoader({
  exactPath: "/industry",
  routeGroup: "industries",
  withMigratedContent: false,
});
export const meta = createRouteMeta<typeof loader>();

export default function IndustriesIndexRoute() {
  const { route } = useLoaderData<typeof loader>();

  return (
    <RoutePageFrame
      content={null}
      eyebrow="Industries"
      route={route}
      showHeader={false}
      showRelated={false}
    >
      <Suspense
        fallback={
          <div className="ss-srv2-loading">
            <h1 className="ss-srv2-hero__title">{route.h1}</h1>
          </div>
        }
      >
        <LazyIndustriesHub />
      </Suspense>
    </RoutePageFrame>
  );
}
