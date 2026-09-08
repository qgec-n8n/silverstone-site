import { useLoaderData } from "react-router";

import {
  createRouteClientLoader,
  createRouteLoader,
  createRouteMeta,
  neverRevalidate,
} from "~/routes/shared/route-data";
import { ServicePage } from "~/routes/templates/service-page";

export const loader = createRouteLoader({
  exactPath: "/services",
  routeGroup: "services",
  withMigratedContent: false,
});
export const meta = createRouteMeta<typeof loader>();

// Holds the outgoing page on screen until this route's composition chunk
// has landed, so the navigation never flashes the Suspense fallback below.
export const clientLoader = createRouteClientLoader({ exactPath: "/services" });
// Restores the params-only revalidation default that exporting a
// `clientLoader` turns off; see `neverRevalidate`.
export const shouldRevalidate = neverRevalidate;

export default function ServicesRoute() {
  const { content, route } = useLoaderData<typeof loader>();

  return <ServicePage content={content} route={route} />;
}
