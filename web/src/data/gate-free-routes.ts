/**
 * Routes that skip the CoreSpin loader, Aether Flow intro and expandable-hero
 * gate entirely, rendering their body immediately. The Book page is the only
 * member today: every "Book a discovery call" deep-link across the site must
 * land on a usable, scrollable page with no intro to dismiss first.
 *
 * Read by the pre-hydration boot script in `root.tsx` (inlined verbatim, so
 * keep this list JSON-serialisable), `AppExperienceProvider` and
 * `CoreSpinLoader`, so all three agree on which routes are gate-free.
 */
export const GATE_FREE_ROUTES: readonly string[] = ["/book"];

export function isGateFreeRoute(pathname: string): boolean {
  return GATE_FREE_ROUTES.includes(pathname);
}
