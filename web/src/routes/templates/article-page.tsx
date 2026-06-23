import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";

export function ArticlePage({ route }: { route: FutureRouteRecord }) {
  return <RoutePageFrame eyebrow="Guide" route={route} />;
}
