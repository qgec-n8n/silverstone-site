import { DEMO_REGISTRY } from "~/data/demo-registry";

/**
 * Routes that skip the CoreSpin loader, Aether Flow intro and expandable-hero
 * gate entirely, rendering their body immediately. Conversion routes must land
 * straight on the scheduler or enquiry form; Insights must open directly from
 * article cards without replaying the route gate.
 *
 * Read by the pre-hydration boot script in `root.tsx` (inlined verbatim, so
 * keep these lists JSON-serialisable), `AppExperienceProvider` and
 * `CoreSpinLoader`, so all three agree on which routes are gate-free.
 */
export const GATE_FREE_ROUTES: readonly string[] = ["/book", "/contact", "/blog"];

export const GATE_FREE_ROUTE_PREFIXES: readonly string[] = ["/blog/"];

/**
 * Exact path+hash deep links that skip the gate for that one navigation only
 * — unlike `GATE_FREE_ROUTES`, the destination route still plays its normal
 * intro on every other visit. Sourced from `DEMO_REGISTRY` so the floating
 * demos launcher always lands directly on the reserved demo frame instead of
 * behind its route's loader/intro/explore gate.
 */
export const GATE_FREE_DEEP_LINKS: readonly string[] = DEMO_REGISTRY.map(
  (demo) => demo.href,
);

export function isGateFreeRoute(pathname: string): boolean {
  return (
    GATE_FREE_ROUTES.includes(pathname) ||
    GATE_FREE_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

export function isGateFreeDeepLink(pathname: string, hash: string): boolean {
  return GATE_FREE_DEEP_LINKS.includes(`${pathname}${hash}`);
}

export function isGateFreeNavigation(pathname: string, hash: string): boolean {
  return isGateFreeRoute(pathname) || isGateFreeDeepLink(pathname, hash);
}
