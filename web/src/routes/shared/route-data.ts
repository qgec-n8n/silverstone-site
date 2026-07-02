import type { LoaderFunctionArgs, MetaFunction } from "react-router";

import { loadMigratedContent, type MigratedContentRecord } from "~/content/migrated";
import { getFutureRouteByPath, type FutureRouteRecord } from "~/data/future-routes";
import type { RouteGroup } from "~/data/route-schema";
import { buildRouteMetadata } from "~/seo/metadata";

type RouteLoaderOptions = {
  exactPath?: string;
  routeGroup: RouteGroup;
  /**
   * Set false for routes whose body is a fully bespoke experience (the
   * services/industries hubs) so legacy migrated copy never reaches the DOM.
   */
  withMigratedContent?: boolean;
};

export type RouteLoaderData = {
  content: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

export function normalizeRouteRequestPath(pathname: string): string {
  return pathname.endsWith(".data") ? pathname.slice(0, -".data".length) : pathname;
}

export function createRouteLoader({
  exactPath,
  routeGroup,
  withMigratedContent = true,
}: RouteLoaderOptions) {
  return async ({ request }: LoaderFunctionArgs): Promise<RouteLoaderData> => {
    const requestPath = normalizeRouteRequestPath(new URL(request.url).pathname);
    const route = getFutureRouteByPath(exactPath ?? requestPath);

    if (route?.routeGroup !== routeGroup) {
      // React Router uses thrown Response objects to preserve HTTP status.
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw new Response("Not Found", {
        status: 404,
        statusText: "Not Found",
      });
    }

    return {
      content:
        withMigratedContent && route.lifecycle === "retained"
          ? await loadMigratedContent(route.contentId)
          : null,
      route,
    };
  };
}

export function createRouteMeta<Loader>(): MetaFunction<Loader> {
  return ({ loaderData }) =>
    loaderData
      ? buildRouteMetadata((loaderData as unknown as RouteLoaderData).route)
      : [];
}
