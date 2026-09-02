import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";

import { loadMigratedContent, type MigratedContentRecord } from "~/content/migrated";
import { getApprovedServiceContent } from "~/content/services/approved-services";
import { getFutureRouteByPath, type FutureRouteRecord } from "~/data/future-routes";
import { IndustryPage } from "~/routes/templates/industry-page";
import { ServicePage } from "~/routes/templates/service-page";
import { normalizeRouteRequestPath } from "~/routes/shared/route-data";
import { buildRouteMetadata, type MetadataDescriptor } from "~/seo/metadata";

type ServiceDetailLoaderData = {
  content: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<ServiceDetailLoaderData> {
  const path = normalizeRouteRequestPath(new URL(request.url).pathname);
  const route = getFutureRouteByPath(path);

  if (
    !route ||
    (route.routeGroup !== "services" && route.routeGroup !== "industries")
  ) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const isApprovedService =
    route.routeGroup === "services" &&
    route.template === "service" &&
    Boolean(getApprovedServiceContent(route.path));

  // Industry routes render the custom industries-v2 experience; their legacy
  // migrated copy must never reach the DOM or the prerendered HTML.
  const usesMigratedContent =
    route.lifecycle === "retained" &&
    !isApprovedService &&
    route.template !== "industry";

  return {
    content: usesMigratedContent ? await loadMigratedContent(route.contentId) : null,
    route,
  };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) =>
  loaderData ? buildRouteMetadata(loaderData.route) : ([] as MetadataDescriptor[]);

export default function ServiceDetailRoute() {
  const { content, route } = useLoaderData<typeof loader>();

  return route.template === "industry" ? (
    <IndustryPage content={content} route={route} />
  ) : (
    <ServicePage content={content} route={route} />
  );
}
