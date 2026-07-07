import { DEMO_REGISTRY } from "~/data/demo-registry";

/**
 * Routes that skip the CoreSpin loader, Aether Flow intro and expandable-hero
 * gate entirely, rendering their body immediately. Book and Contact are the
 * two members: every "Book a discovery call" and "Contact instead" deep-link
 * across the site must land on a usable, scrollable page with no intro to
 * dismiss first — straight to the scheduler or the enquiry form.
 *
 * Read by the pre-hydration boot script in `root.tsx` (inlined verbatim, so
 * keep this list JSON-serialisable), `AppExperienceProvider` and
 * `CoreSpinLoader`, so all three agree on which routes are gate-free.
 */
export const GATE_FREE_ROUTES: readonly string[] = ["/book", "/contact"];

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
  return GATE_FREE_ROUTES.includes(pathname);
}

export function isGateFreeDeepLink(pathname: string, hash: string): boolean {
  return GATE_FREE_DEEP_LINKS.includes(`${pathname}${hash}`);
}

export function isGateFreeNavigation(pathname: string, hash: string): boolean {
  return isGateFreeRoute(pathname) || isGateFreeDeepLink(pathname, hash);
}
