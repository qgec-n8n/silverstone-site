import { useLoaderData } from "react-router";

import { createRouteLoader, createRouteMeta } from "~/routes/shared/route-data";
import { CoreMarketingPage } from "~/routes/templates/core-marketing-page";

export const loader = createRouteLoader({
  exactPath: "/contact",
  routeGroup: "conversion",
});
export const meta = createRouteMeta<typeof loader>();

export default function ContactRoute() {
  return <CoreMarketingPage route={useLoaderData<typeof loader>()} />;
}
