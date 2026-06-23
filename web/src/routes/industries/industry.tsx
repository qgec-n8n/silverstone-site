import { useLoaderData } from "react-router";

import { createRouteLoader, createRouteMeta } from "~/routes/shared/route-data";
import { IndustryPage } from "~/routes/templates/industry-page";

export const loader = createRouteLoader({
  routeGroup: "industries",
});
export const meta = createRouteMeta<typeof loader>();

export default function IndustryRoute() {
  return <IndustryPage route={useLoaderData<typeof loader>()} />;
}
