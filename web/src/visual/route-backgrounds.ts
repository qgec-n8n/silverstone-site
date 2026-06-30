export type IntroBackgroundMode = "aether";
export type BodyBackgroundMode = "particles";

export type RouteVisualBackgroundMode = {
  body: BodyBackgroundMode;
  intro: IntroBackgroundMode;
};

export const DEFAULT_ROUTE_BACKGROUND_MODE = {
  body: "particles",
  intro: "aether",
} as const satisfies RouteVisualBackgroundMode;

const INDUSTRY_ROUTE_PREFIX = "/industries";

export function normalizeVisualRoutePath(pathname: string): string {
  const [pathOnly = "/"] = pathname.split(/[?#]/);
  const normalized = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;

  if (normalized !== "/" && normalized.endsWith("/")) {
    return normalized.replace(/\/+$/, "");
  }

  return normalized;
}

export function isIndustryBackgroundRoute(pathname: string): boolean {
  const normalized = normalizeVisualRoutePath(pathname);

  return (
    normalized === INDUSTRY_ROUTE_PREFIX ||
    normalized.startsWith(`${INDUSTRY_ROUTE_PREFIX}/`)
  );
}

export function getRouteVisualBackgroundMode(
  pathname?: string,
): RouteVisualBackgroundMode {
  void pathname;
  return DEFAULT_ROUTE_BACKGROUND_MODE;
}
