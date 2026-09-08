import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  ShouldRevalidateFunction,
} from "react-router";

import { loadMigratedContent, type MigratedContentRecord } from "~/content/migrated";
import { getFutureRouteByPath, type FutureRouteRecord } from "~/data/future-routes";
import { preloadRouteComposition } from "~/data/route-compositions";
import type { RouteGroup } from "~/data/route-schema";
import { buildRouteMetadata } from "~/seo/metadata";

type RouteLoaderOptions = {
  exactPath?: string;
  routeGroup: RouteGroup;
  /**
   * Set false for routes whose body is a fully custom experience (the
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

type RouteClientLoaderOptions = {
  /** The route's own path — the key its composition is registered under. */
  exactPath: string;
};

/**
 * Client-navigation loader that waits for the destination's composition chunk
 * as well as its data.
 *
 * Every route body on this site is a code-split chunk behind a Suspense
 * boundary. Without this, a client navigation commits the destination as soon
 * as its `.data` arrives — and if the composition chunk is even slightly
 * behind (cold edge, slow first byte), the boundary suspends and react-dom
 * pins its bare-hero fallback for a minimum of 300ms. One tap then reads as
 * two loads: a half-built hero, then the real page.
 *
 * React Router keeps the page being LEFT on screen for as long as the next
 * page's loaders are pending, so awaiting the chunk here converts that flash
 * into the behaviour we want: the current page holds (with the header's
 * pending beam), then the destination appears fully formed. The hover /
 * pointer-down preloader in `route-preload.tsx` stays the fast path — it
 * usually has the chunk in flight or resolved already, so this await costs
 * nothing; it is the guarantee, not the mechanism.
 *
 * Two costs, both accepted. Because the route now has a client loader, React
 * Router moves the loader onto `dataRoute.lazy` instead of assigning it
 * eagerly, so on a navigation with NO intent signal (keyboard or programmatic
 * activation, or a tap that outruns the pointer-down prefetch) the `.data`
 * fetch is serialised behind the client-loader chunk import rather than racing
 * it — one extra round trip before the data request starts, not merely one
 * extra request. And each chunkable `clientLoader` adds a `modulepreload` to
 * its prerendered head (+1 on the paramless routes, +2 on the detail routes),
 * which the site's own LCP work flagged as a scarce budget. Both are the
 * median-fast / worst-case-slower side of removing a guaranteed 300ms fallback
 * flash.
 *
 * BUDGET NOTE, because this file is imported by all 24 route modules and so
 * feeds the foundation bundle directly: `npm run bundle:report` targets 220 KB
 * gzip and FAILS THE BUILD above 300 KB, and this branch measures 296.88 KB —
 * 3.12 KB of margin, against 270.72 KB at its merge base. The static
 * `preloadRouteComposition` import below is NOT the cause: `RoutePreloadHandler`
 * in app/root.tsx already imports that registry statically, so it was in the
 * foundation before this loader existed (making it dynamic here was measured at
 * 295.72 KB, i.e. 1.16 KB). Treat any new module-scope import in this file as
 * spending that 3 KB, and re-run `bundle:report` before adding one.
 *
 * `hydrate = false` (the default when a `loader` is also exported, set
 * explicitly so it survives a refactor) keeps the initial prerendered load
 * untouched: cold entries read the embedded loader data and never run this.
 */
export function createRouteClientLoader({ exactPath }: RouteClientLoaderOptions) {
  const clientLoader = async ({
    serverLoader,
  }: ClientLoaderFunctionArgs): Promise<RouteLoaderData> => {
    const [data] = await Promise.all([
      serverLoader<RouteLoaderData>(),
      preloadRouteComposition(exactPath),
    ]);

    return data;
  };

  clientLoader.hydrate = false as const;

  return clientLoader;
}

/**
 * Companion to `createRouteClientLoader` — every route that exports one of
 * those must also export this as `shouldRevalidate`.
 *
 * Under `ssr: false` React Router installs a params-only revalidation default
 * for prerendered routes, but only while the route has no client loader
 * (`getShouldRevalidateFunction`: `!ssr && hasLoader && !hasClientLoader`).
 * Exporting a `clientLoader` sets `hasClientLoader`, skips that branch and
 * drops the route onto RR's generic default, which revalidates whenever the
 * next URL equals the current one. Tapping the nav link for the page you are
 * already on would then refetch `.data` and paint the pending route beam for
 * the round trip. These routes take no params, so the shim's answer was always
 * `false`; this restores it verbatim.
 *
 * It cannot suppress a load that is actually needed: entering a route for the
 * first time, or re-entering one whose loader data was dropped, is forced by
 * `isNewLoader` before `shouldRevalidate` is consulted.
 */
export const neverRevalidate: ShouldRevalidateFunction = () => false;

export function createRouteMeta<Loader>(): MetaFunction<Loader> {
  return ({ loaderData }) =>
    loaderData
      ? buildRouteMetadata((loaderData as unknown as RouteLoaderData).route)
      : [];
}
