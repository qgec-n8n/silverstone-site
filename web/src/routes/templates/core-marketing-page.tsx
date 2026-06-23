import type { MigratedContentRecord } from "~/content/migrated";
import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";

type CoreMarketingPageProps = {
  content?: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

function resolveEyebrow(route: FutureRouteRecord): string {
  if (route.path === "/pricing") {
    return "Scoping";
  }
  if (route.path === "/blog") {
    return "Insights";
  }
  if (route.path === "/industries") {
    return "Industries";
  }
  if (route.path === "/how-we-work") {
    return "How we work";
  }
  if (route.path === "/book" || route.path === "/contact") {
    return "Conversion";
  }
  if (route.path === "/about") {
    return "About";
  }
  if (route.path === "/") {
    return "Digital systems for UK businesses";
  }
  return route.routeGroup.replace("-", " ");
}

export function CoreMarketingPage({ content = null, route }: CoreMarketingPageProps) {
  return (
    <RoutePageFrame
      content={content}
      eyebrow={resolveEyebrow(route)}
      route={route}
    />
  );
}
