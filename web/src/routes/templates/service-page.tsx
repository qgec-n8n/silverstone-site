import type { MigratedContentRecord } from "~/content/migrated";
import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";

type ServicePageProps = {
  content?: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

export function ServicePage({ content = null, route }: ServicePageProps) {
  return <RoutePageFrame content={content} eyebrow="Services" route={route} />;
}
