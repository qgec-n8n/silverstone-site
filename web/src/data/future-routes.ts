import rawFutureRouteManifest from "~/data/generated/future-route-manifest.json";
import {
  approvedAdditionalRoutes,
  approvedRouteOverrides,
} from "~/data/approved-routes";
import {
  validateFutureRouteManifest,
  type FutureRouteRecord,
} from "~/data/route-schema";

const rawRoutes = rawFutureRouteManifest as unknown as FutureRouteRecord[];
const overrideById = new Map(approvedRouteOverrides.map((route) => [route.id, route]));

const mergedRoutes = rawRoutes.map((route) => ({
  ...route,
  ...overrideById.get(route.id),
}));

export const futureRouteManifest = [...mergedRoutes, ...approvedAdditionalRoutes];

const validationIssues = validateFutureRouteManifest(futureRouteManifest);
if (validationIssues.length > 0) {
  throw new Error(`Invalid future route manifest:\n${validationIssues.join("\n")}`);
}

const futureRouteByPath = new Map(
  futureRouteManifest.map((route) => [route.path, route]),
);

export const routePathAliases: Readonly<Record<string, string>> = {
  "/services/ai-agents-automation": "/services/ai-automation",
  "/services/website-design-development": "/services/web-design-development",
};

export function getFutureRouteByPath(path: string): FutureRouteRecord | undefined {
  const normalizedPath =
    path !== "/" && path.endsWith("/") ? path.replace(/\/+$/, "") : path;
  return futureRouteByPath.get(routePathAliases[normalizedPath] ?? normalizedPath);
}

export { validateFutureRouteManifest };
export type { FutureRouteRecord };
