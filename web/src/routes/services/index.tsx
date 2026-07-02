import { useLoaderData } from "react-router";

import { createRouteLoader, createRouteMeta } from "~/routes/shared/route-data";
import { ServicePage } from "~/routes/templates/service-page";

export const loader = createRouteLoader({
  exactPath: "/services",
  routeGroup: "services",
  withMigratedContent: false,
});
export const meta = createRouteMeta<typeof loader>();

export default function ServicesRoute() {
  const { content, route } = useLoaderData<typeof loader>();

  return <ServicePage content={content} route={route} />;
}
