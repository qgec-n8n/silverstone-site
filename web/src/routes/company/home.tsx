import { useLoaderData } from "react-router";

import { createRouteLoader, createRouteMeta } from "~/routes/shared/route-data";
import { CoreMarketingPage } from "~/routes/templates/core-marketing-page";

export const loader = createRouteLoader({
  exactPath: "/",
  routeGroup: "company",
});
export const meta = createRouteMeta<typeof loader>();

export default function HomeRoute() {
  return <CoreMarketingPage route={useLoaderData<typeof loader>()} />;
}
