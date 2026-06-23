import type { MigratedContentRecord } from "~/content/migrated";
import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";

type ArticlePageProps = {
  content?: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

export function ArticlePage({ content = null, route }: ArticlePageProps) {
  return <RoutePageFrame content={content} eyebrow="Guide" route={route} />;
}
