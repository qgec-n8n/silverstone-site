import { useLoaderData } from "react-router";

import { HomeV2 } from "~/routes/company/home-v2";
import { createRouteLoader, createRouteMeta } from "~/routes/shared/route-data";
import { buildRouteSchemaGraph, serializeJsonLd } from "~/seo/schema";

export const loader = createRouteLoader({
  exactPath: "/",
  routeGroup: "company",
});
export const meta = createRouteMeta<typeof loader>();

export default function HomeRoute() {
  const { route } = useLoaderData<typeof loader>();
  const schema = buildRouteSchemaGraph(route);

  return (
    <>
      <HomeV2 contentId={route.contentId} />
      <script
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        type="application/ld+json"
      />
    </>
  );
}
