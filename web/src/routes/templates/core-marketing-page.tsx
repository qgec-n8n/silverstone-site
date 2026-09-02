import { useLocation } from "react-router";

import type { MigratedContentRecord } from "~/content/migrated";
import { isGateFreeNavigation } from "~/data/gate-free-routes";
import type { FutureRouteRecord } from "~/data/route-schema";
import { CorePageExperience } from "~/features/core-pages/core-page-experience";
import { useHydrated } from "~/lib/use-hydrated";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";

type CoreMarketingPageProps = {
  content?: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

function resolveEyebrow(route: FutureRouteRecord): string {
  if (route.path === "/pricing") {
    return "Scoping";
  }
  if (route.path === "/blog") {
    return "Insights";
  }
  if (route.path === "/industries") {
    return "Industries";
  }
  if (route.path === "/how-we-work") {
    return "How we work";
  }
  if (route.path === "/book" || route.path === "/contact") {
    return "Conversion";
  }
  if (route.path === "/about") {
    return "About";
  }
  if (route.path === "/") {
    return "Digital systems for US and UK businesses";
  }
  return route.routeGroup.replace("-", " ");
}

export function CoreMarketingPage({ content = null, route }: CoreMarketingPageProps) {
  const location = useLocation();
  const hydrated = useHydrated();
  const bespokeCoreRoutes = new Set([
    "/how-we-work",
    "/blog",
    "/about",
    "/pricing",
    "/contact",
    "/book",
  ]);

  if (bespokeCoreRoutes.has(route.path)) {
    return (
      <RoutePageFrame
        content={null}
        eyebrow={resolveEyebrow(route)}
        route={route}
        showHeader={false}
        showBreadcrumbs={false}
        showRelated={false}
        /* Hash-gated skipping must wait for hydration: static HTML is built
           hashless, so a deep-link landing (e.g. /book#booking-calendar)
           first replays the prerendered intro-present markup, then drops the
           intro on the immediate post-hydration render. */
        skipIntro={isGateFreeNavigation(
          location.pathname,
          hydrated ? location.hash : "",
        )}
      >
        <CorePageExperience route={route} />
      </RoutePageFrame>
    );
  }

  return (
    <RoutePageFrame content={content} eyebrow={resolveEyebrow(route)} route={route} />
  );
}
