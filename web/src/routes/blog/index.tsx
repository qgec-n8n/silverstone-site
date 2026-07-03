import { useLoaderData } from "react-router";

import { createRouteLoader, createRouteMeta } from "~/routes/shared/route-data";
import { CoreMarketingPage } from "~/routes/templates/core-marketing-page";

export const loader = createRouteLoader({
  exactPath: "/blog",
  routeGroup: "blog",
  withMigratedContent: false,
});
export const meta = createRouteMeta<typeof loader>();

export default function BlogIndexRoute() {
  const { content, route } = useLoaderData<typeof loader>();

  return <CoreMarketingPage content={content} route={route} />;
}
