import type { FutureRouteRecord } from "~/data/route-schema";

export function validateInternalLinks(routes: readonly FutureRouteRecord[]): string[] {
  const issues: string[] = [];
  const routeIds = new Set(routes.map((route) => route.id));
  const routePaths = new Set(routes.map((route) => route.path));

  for (const route of routes) {
    for (const breadcrumb of route.breadcrumbs) {
      if (!routePaths.has(breadcrumb.path)) {
        issues.push(`${route.path}: unresolved breadcrumb ${breadcrumb.path}`);
      }
    }
    for (const relatedRouteId of route.relatedRouteIds) {
      if (!routeIds.has(relatedRouteId)) {
        issues.push(`${route.path}: unresolved related route ${relatedRouteId}`);
      }
    }
    if (route.parentRouteId !== null && !routeIds.has(route.parentRouteId)) {
      issues.push(`${route.path}: unresolved parent route ${route.parentRouteId}`);
    }
  }

  return issues;
}
