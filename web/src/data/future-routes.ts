import rawFutureRouteManifest from "~/data/generated/future-route-manifest.json";
import {
  validateFutureRouteManifest,
  type FutureRouteRecord,
} from "~/data/route-schema";

const validationIssues = validateFutureRouteManifest(rawFutureRouteManifest);
if (validationIssues.length > 0) {
  throw new Error(`Invalid future route manifest:\n${validationIssues.join("\n")}`);
}

export const futureRouteManifest =
  rawFutureRouteManifest as unknown as FutureRouteRecord[];

const futureRouteByPath = new Map(
  futureRouteManifest.map((route) => [route.path, route]),
);

export function getFutureRouteByPath(path: string): FutureRouteRecord | undefined {
  const normalizedPath =
    path !== "/" && path.endsWith("/") ? path.replace(/\/+$/, "") : path;
  return futureRouteByPath.get(normalizedPath);
}

export { validateFutureRouteManifest };
export type { FutureRouteRecord };
