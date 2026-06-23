import { useLoaderData } from "react-router";

import { createRouteLoader, createRouteMeta } from "~/routes/shared/route-data";
import { ArticlePage } from "~/routes/templates/article-page";

export const loader = createRouteLoader({
  routeGroup: "blog",
});
export const meta = createRouteMeta<typeof loader>();

export default function ArticleRoute() {
  const { content, route } = useLoaderData<typeof loader>();

  return <ArticlePage content={content} route={route} />;
}
