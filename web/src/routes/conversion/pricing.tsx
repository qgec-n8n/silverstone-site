import { useLoaderData } from "react-router";

import {
  createRouteClientLoader,
  createRouteLoader,
  createRouteMeta,
  neverRevalidate,
} from "~/routes/shared/route-data";
import { CoreMarketingPage } from "~/routes/templates/core-marketing-page";

export const loader = createRouteLoader({
  exactPath: "/pricing",
  routeGroup: "conversion",
  withMigratedContent: false,
});
export const meta = createRouteMeta<typeof loader>();

// Holds the outgoing page on screen until this route's composition chunk
// has landed, so the navigation never flashes the Suspense fallback below.
export const clientLoader = createRouteClientLoader({ exactPath: "/pricing" });
// Restores the params-only revalidation default that exporting a
// `clientLoader` turns off; see `neverRevalidate`.
export const shouldRevalidate = neverRevalidate;

export default function PricingRoute() {
  const { content, route } = useLoaderData<typeof loader>();

  return <CoreMarketingPage content={content} route={route} />;
}
