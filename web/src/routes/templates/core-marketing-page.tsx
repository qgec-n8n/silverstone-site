import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";

export function CoreMarketingPage({ route }: { route: FutureRouteRecord }) {
  return <RoutePageFrame eyebrow={route.routeGroup.replace("-", " ")} route={route} />;
}
