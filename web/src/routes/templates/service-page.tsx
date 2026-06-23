import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";

export function ServicePage({ route }: { route: FutureRouteRecord }) {
  return <RoutePageFrame eyebrow="Services" route={route} />;
}
