import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  ShouldRevalidateFunction,
} from "react-router";
import { useLoaderData } from "react-router";

import { loadMigratedContent, type MigratedContentRecord } from "~/content/migrated";
import { getApprovedServiceContent } from "~/content/services/approved-services";
import { getFutureRouteByPath, type FutureRouteRecord } from "~/data/future-routes";
import { preloadRouteComposition } from "~/data/route-compositions";
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

/**
 * Waits for the destination composition chunk as well as the route data — see
 * `createRouteClientLoader` in `~/routes/shared/route-data` for why. Hand-rolled
 * rather than shared because the path is dynamic: it comes off the request
 * rather than being fixed per route.
 *
 * The requested path is the right key to await. `getFutureRouteByPath` is a Map
 * keyed BY `route.path`, so the record the loader resolves always carries the
 * path it was looked up under — awaiting `data.route.path` afterwards could only
 * ever repeat this call, serialised behind the data.
 */
export async function clientLoader({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs): Promise<ServiceDetailLoaderData> {
  const requestPath = normalizeRouteRequestPath(new URL(request.url).pathname);
  const [data] = await Promise.all([
    serverLoader<ServiceDetailLoaderData>(),
    preloadRouteComposition(requestPath),
  ]);

  return data;
}

clientLoader.hydrate = false as const;

/**
 * Restores the params-only revalidation default that exporting a `clientLoader`
 * turns off — see `neverRevalidate` in `~/routes/shared/route-data`. Unlike the
 * paramless routes this one must still reload when the slug changes: one route
 * id serves every service and industry page, so without this a slug-to-slug
 * navigation would keep the previous page's data and skip its composition await.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => currentParams.slug !== nextParams.slug;

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
