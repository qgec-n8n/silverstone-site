/**
 * The five intro-splash strings for each approved service route, and nothing
 * else.
 *
 * `approved-services.ts` carries the complete approved record — copy,
 * headings, component microcopy, demo config and build provenance — and is
 * ~162 KB of JSON (~42 KB gzipped). The route experience registry
 * (`~/data/route-experiences`) is imported by the app shell, so anything it
 * touches ships to every visitor on every route, including `/` and `/blog`
 * where no service copy is ever rendered. It needs only `routeEntry`, so it
 * reads this projection instead and the heavy record stays behind the service
 * detail route's own chunk.
 *
 * Both files come from the same generator in one pass
 * (`scripts/generate-approved-service-content.mjs`), so they cannot drift.
 */
import routeEntriesJson from "~/content/services/generated/approved-service-route-entries.json";

import type {
  ApprovedServiceContent,
  ApprovedServiceRoute,
} from "~/content/services/approved-services";

export type ApprovedServiceRouteEntry = ApprovedServiceContent["routeEntry"];

const approvedServiceRouteEntries = routeEntriesJson as Record<
  ApprovedServiceRoute,
  ApprovedServiceRouteEntry
>;

export function getApprovedServiceRouteEntry(
  route: string,
): ApprovedServiceRouteEntry | undefined {
  return Object.hasOwn(approvedServiceRouteEntries, route)
    ? approvedServiceRouteEntries[route as ApprovedServiceRoute]
    : undefined;
}
