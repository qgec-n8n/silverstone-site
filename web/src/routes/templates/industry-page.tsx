import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";

export function IndustryPage({ route }: { route: FutureRouteRecord }) {
  return <RoutePageFrame eyebrow="Industry" route={route} />;
}
