import { useEffect } from "react";

import { preloadRouteComposition } from "~/data/route-compositions";

/**
 * Warms a destination's route-body chunk the moment a visitor shows intent to
 * go there — pointer over a link, keyboard focus on one, or the pointer-down
 * that precedes a tap.
 *
 * Without this, a client-side navigation is two sequential loads: React Router
 * fetches the route module, commits it, and only THEN does the route's own
 * `lazy()` composition boundary start downloading. It suspends, commits its
 * bare-hero fallback, and react-dom holds that fallback for a minimum of 300ms
 * (`FALLBACK_THROTTLE_MS`) before swapping in the real page — so a single click
 * reads as a page that loads, then loads again. Resolving the chunk during the
 * hover means the composition renders synchronously on the first commit and no
 * fallback is ever entered. React Router's own `prefetch="intent"` on the nav
 * links covers the route module and its data on the same gesture.
 *
 * One delegated listener rather than per-link props: every internal link on
 * the site benefits (header, footer, in-body CTAs, the demos launcher), and no
 * component has to remember to opt in.
 */
function pathFromEventTarget(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) {
    return null;
  }
  const anchor = target.closest("a");
  const href = anchor?.getAttribute("href");
  // Same-document, same-origin paths only. Anything absolute, external,
  // `mailto:`/`tel:`, or a bare hash is not a route navigation.
  if (!href?.startsWith("/") || href.startsWith("//")) {
    return null;
  }
  return href.split(/[?#]/)[0] ?? null;
}

export function useRoutePreload(): void {
  useEffect(() => {
    const onIntent = (event: Event) => {
      const path = pathFromEventTarget(event.target);
      if (path) {
        preloadRouteComposition(path);
      }
    };

    // `pointerover` and `focusin` bubble (unlike pointerenter/focus), so one
    // document-level listener covers every link. `pointerdown` is the touch
    // path: there is no hover, but it still lands ~100ms before the click.
    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("pointerdown", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onIntent);
      document.removeEventListener("pointerdown", onIntent);
      document.removeEventListener("focusin", onIntent);
    };
  }, []);
}

/** Mounted once at the app root so every route benefits without wiring per page. */
export function RoutePreloadHandler(): null {
  useRoutePreload();
  return null;
}
