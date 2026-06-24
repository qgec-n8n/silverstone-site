import type { MigratedContentRecord } from "~/content/migrated";
import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";
import { IndustryPageVisuals } from "~/visual/data/page-modules";

type IndustryPageProps = {
  content?: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

export function IndustryPage({ content = null, route }: IndustryPageProps) {
  return (
    <RoutePageFrame content={content} eyebrow="Industry" route={route}>
      <IndustryPageVisuals route={route} />
    </RoutePageFrame>
  );
}
