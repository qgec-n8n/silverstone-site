import { useLoaderData } from "react-router";

import { createRouteLoader, createRouteMeta } from "~/routes/shared/route-data";
import { ServicePage } from "~/routes/templates/service-page";

export const loader = createRouteLoader({
  exactPath: "/services",
  routeGroup: "services",
});
export const meta = createRouteMeta<typeof loader>();

export default function ServicesRoute() {
  return <ServicePage route={useLoaderData<typeof loader>()} />;
}
