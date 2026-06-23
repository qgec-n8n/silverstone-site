import type { MigratedContentRecord } from "~/content/migrated";
import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";

type CoreMarketingPageProps = {
  content?: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

export function CoreMarketingPage({ content = null, route }: CoreMarketingPageProps) {
  return (
    <RoutePageFrame
      content={content}
      eyebrow={route.routeGroup.replace("-", " ")}
      route={route}
    />
  );
}
