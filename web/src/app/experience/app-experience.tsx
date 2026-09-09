import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router";

import { getCanonicalRouteExperienceByPath } from "~/data/route-experiences";
import { isGateFreeNavigation } from "~/data/gate-free-routes";
import { useHydrated } from "~/lib/use-hydrated";

/**
 * AppExperience coordinates the opening sequence shared by every route:
 *
 *   loader gate -> route intro -> Explore morph -> body
 *                                                  ^              |
 *                                                  |____ close ___|
 *
 * Two pieces of logical state drive everything:
 *   - `loaderActive`        — the Core Spin Loader overlay is up (true on every
 *                              full load / reload, cleared by the loader itself).
 *   - `homepageState`       — the homepage interaction state. Body content and
 *                              site chrome only exist once this reaches "body".
 *
 * The header is hidden and scrolling is locked while either is true. The logical
 * state is mirrored onto <html> data-attributes so the gate CSS can react, and
 * the inline boot script in `root.tsx` sets the same attributes synchronously
 * before first paint — so there is no flash and no hydration mismatch.
 */

export type HomepageState = "loading" | "intro" | "opening" | "body" | "closing";
export type RouteExperienceState = "loading" | "intro" | "opening" | "body" | "closing";
export type ServiceExperienceState = RouteExperienceState;

type AppExperienceValue = {
  loaderActive: boolean;
  homepageState: HomepageState;
  routeExperienceState: RouteExperienceState;
  serviceExperienceState: ServiceExperienceState;
  homepageHeroLocked: boolean;
  homepageBodyActive: boolean;
  routeExperienceActive: boolean;
  routeIntroLocked: boolean;
  routeBodyActive: boolean;
  serviceRouteActive: boolean;
  serviceIntroLocked: boolean;
  serviceBodyActive: boolean;
  headerHidden: boolean;
  scrollLocked: boolean;
  dismissLoader: () => void;
  lockHomepageHero: () => void;
  unlockHomepageHero: () => void;
  openHomepageBody: () => void;
  completeHomepageOpening: () => void;
  closeHomepageBody: () => void;
  completeHomepageClosing: () => void;
  openRouteBody: () => void;
  completeRouteOpening: () => void;
  closeRouteBody: () => void;
  completeRouteClosing: () => void;
  openServiceBody: () => void;
  completeServiceOpening: () => void;
  closeServiceBody: () => void;
  completeServiceClosing: () => void;
};

const AppExperienceContext = createContext<AppExperienceValue | null>(null);

function setRootFlag(name: string, on: boolean): void {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  if (on) {
    root.setAttribute(name, "on");
  } else {
    root.removeAttribute(name);
  }
}

function setRootAttribute(name: string, value: string | null): void {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  if (value === null) {
    root.removeAttribute(name);
  } else {
    root.setAttribute(name, value);
  }
}

/**
 * A close is requested from wherever the visitor has scrolled to, but the
 * intro it returns to lives at the top of the document, so the window is
 * reset before the closing state commits. The Explore morph
 * (`ExploreSystemTransition`) collapses the body back into its pill from the
 * part of the page that was actually on screen, so the offset is recorded on
 * the root first, where the morph can read it back.
 */
function rememberBodyScrollForClose(): void {
  if (typeof window === "undefined") {
    return;
  }
  document.documentElement.setAttribute(
    "data-explore-close-scroll",
    String(Math.round(window.scrollY)),
  );
  window.scrollTo({ left: 0, top: 0, behavior: "auto" });
}

function normalizePathname(pathname: string): string {
  const [pathOnly = "/"] = pathname.split(/[?#]/);
  const normalized = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;

  return normalized !== "/" && normalized.endsWith("/")
    ? normalized.replace(/\/+$/, "")
    : normalized;
}

function isRouteExperienceRoute(pathname: string, hash: string): boolean {
  const normalizedPath = normalizePathname(pathname);

  return normalizedPath !== "/" && !isGateFreeNavigation(normalizedPath, hash);
}

function isServiceExperienceRoute(pathname: string): boolean {
  const route = getCanonicalRouteExperienceByPath(normalizePathname(pathname));

  return route?.family === "service";
}

type GateState = {
  /** The route-experience path this gate is armed for (null on home and
   * gate-free routes) — the marker `viewGate` checks against the live
   * location. */
  experiencePath: string | null;
  isHomeRoute: boolean;
  loaderActive: boolean;
  homepageState: HomepageState;
  routeExperienceState: RouteExperienceState;
};

/**
 * Re-arm a gate carried over from a previous navigation for the current one.
 *
 * Reaching here always means the location changed *after* the provider mounted
 * — a client-side navigation. A full document load never rearms: the
 * `useState` initialiser below already describes its destination, and the two
 * comparisons in `viewGate` hold on that first render.
 *
 * The opening sequence (loader → Aether Flow intro → Explore morph) is a
 * first-impression device for visitors arriving cold from search or a shared
 * link, so it plays on full document loads only. Replaying its ~5s
 * scroll-locked hold on every header click turned the reveal into a toll on
 * people who had already seen it, so in-app navigation now lands directly on
 * the body. Deep-link landings during the hydration hand-off also pass through
 * here, and they equally must never flash the loader.
 *
 * This is a presentation change only: every route's content is prerendered and
 * always present in the DOM, so crawlers were never gated either way.
 */
function rearmGate(
  current: GateState,
  experiencePath: string | null,
  isHomeRoute: boolean,
): GateState {
  return {
    experiencePath,
    isHomeRoute,
    loaderActive: false,
    homepageState: isHomeRoute === current.isHomeRoute ? current.homepageState : "body",
    routeExperienceState:
      experiencePath === current.experiencePath ? current.routeExperienceState : "body",
  };
}

export function AppExperienceProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const hydrated = useHydrated();
  /*
   * The hash is client-only information: prerendered HTML is always built
   * without one, so any hash-dependent branch (gate-free deep links) must
   * not differ during the hydration render. Until hydration commits, the
   * gate renders exactly the hashless state the static HTML contains; the
   * very next render adopts the real hash and `rearmGate` releases the gate
   * for deep-link landings. The boot script in root.tsx marks those landings
   * with `data-gate-free` so the loader overlay stays hidden throughout.
   */
  const gateHash = hydrated ? location.hash : "";
  const isHomeRoute = location.pathname === "/";
  const routeExperienceActive = isRouteExperienceRoute(location.pathname, gateHash);
  const isServiceRoute = isServiceExperienceRoute(location.pathname);

  const previousScrollStylesRef = useRef<{
    bodyOverflow: string;
    bodyOverscroll: string;
    htmlOverflow: string;
    htmlOverscroll: string;
  } | null>(null);

  const experiencePath = routeExperienceActive
    ? normalizePathname(location.pathname)
    : null;

  /*
   * The whole gate lives in ONE state object. It used to be five separate
   * useState slots re-armed by render-phase setState calls, but inside React
   * Router's navigation transition those sibling updates could be partially
   * lost when the transition render was interrupted (observed on gate-free
   * article -> /blog navigations: the "which navigation is this armed for"
   * marker committed while `routeExperienceState`/`loaderActive` reverted,
   * silently skipping the whole loader/intro gate). A single object updates
   * atomically — it can be dropped, never torn — and every read below goes
   * through `viewGate`, which re-arms a stale object on the fly, so even a
   * dropped update renders correctly and is re-attempted next render.
   */
  const [gate, setGate] = useState<GateState>(() => ({
    experiencePath: routeExperienceActive ? normalizePathname(location.pathname) : null,
    isHomeRoute,
    loaderActive: !isGateFreeNavigation(normalizePathname(location.pathname), gateHash),
    homepageState: isHomeRoute ? "loading" : "body",
    routeExperienceState: routeExperienceActive ? "loading" : "body",
  }));

  const viewGate =
    gate.experiencePath === experiencePath && gate.isHomeRoute === isHomeRoute
      ? gate
      : rearmGate(gate, experiencePath, isHomeRoute);

  // Persist the re-armed gate (adjusting state during render — React's
  // sanctioned "derived state" pattern). If this update is ever dropped by an
  // interrupted transition, the next render simply derives and retries; the
  // UI meanwhile already rendered from `viewGate`, so nothing skips.
  if (viewGate !== gate) {
    setGate(viewGate);
  }

  const { loaderActive, homepageState, routeExperienceState } = viewGate;

  /*
   * Gate transitions. Each maps the stored gate with a functional update on
   * the single atomic object — sibling-state tearing is impossible, and every
   * callback keeps a stable identity so consumers' effects never re-run from
   * identity churn alone.
   */
  const dismissLoader = useCallback(() => {
    setGate((current) => ({
      ...current,
      loaderActive: false,
      homepageState:
        current.homepageState === "loading" ? "intro" : current.homepageState,
      routeExperienceState:
        current.routeExperienceState === "loading"
          ? "intro"
          : current.routeExperienceState,
    }));
  }, [setGate]);

  const lockHomepageHero = useCallback(() => {
    setGate((current) => ({ ...current, homepageState: "intro" }));
  }, [setGate]);

  const unlockHomepageHero = useCallback(() => {
    setGate((current) => ({ ...current, homepageState: "body" }));
  }, [setGate]);

  const openHomepageBody = useCallback(() => {
    setGate((current) => ({
      ...current,
      homepageState:
        current.homepageState === "intro" ? "opening" : current.homepageState,
    }));
  }, [setGate]);

  const completeHomepageOpening = useCallback(() => {
    setGate((current) => ({
      ...current,
      homepageState:
        current.homepageState === "opening" ? "body" : current.homepageState,
    }));
  }, [setGate]);

  const closeHomepageBody = useCallback(() => {
    rememberBodyScrollForClose();
    setGate((current) => ({
      ...current,
      homepageState:
        current.homepageState === "body" ? "closing" : current.homepageState,
    }));
  }, [setGate]);

  const completeHomepageClosing = useCallback(() => {
    setGate((current) => ({
      ...current,
      homepageState:
        current.homepageState === "closing" ? "intro" : current.homepageState,
    }));
  }, [setGate]);

  const openRouteBody = useCallback(() => {
    setGate((current) => ({
      ...current,
      routeExperienceState:
        current.routeExperienceState === "intro"
          ? "opening"
          : current.routeExperienceState,
    }));
  }, [setGate]);

  const completeRouteOpening = useCallback(() => {
    setGate((current) => ({
      ...current,
      routeExperienceState:
        current.routeExperienceState === "opening"
          ? "body"
          : current.routeExperienceState,
    }));
  }, [setGate]);

  const closeRouteBody = useCallback(() => {
    rememberBodyScrollForClose();
    setGate((current) => ({
      ...current,
      routeExperienceState:
        current.routeExperienceState === "body"
          ? "closing"
          : current.routeExperienceState,
    }));
  }, [setGate]);

  const completeRouteClosing = useCallback(() => {
    setGate((current) => ({
      ...current,
      routeExperienceState:
        current.routeExperienceState === "closing"
          ? "intro"
          : current.routeExperienceState,
    }));
  }, [setGate]);

  const homepageHeroLocked = isHomeRoute && homepageState !== "body";
  const homepageBodyActive = isHomeRoute && homepageState === "body";
  const routeIntroLocked = routeExperienceActive && routeExperienceState !== "body";
  const routeBodyActive = routeExperienceActive && routeExperienceState === "body";
  const serviceExperienceState = routeExperienceState;
  const serviceIntroLocked = isServiceRoute && routeIntroLocked;
  const serviceBodyActive = isServiceRoute && routeBodyActive;
  const headerHidden = loaderActive || homepageHeroLocked || routeIntroLocked;
  const scrollLocked = loaderActive || homepageHeroLocked || routeIntroLocked;

  useEffect(() => {
    setRootFlag("data-loader-active", loaderActive);
  }, [loaderActive]);

  useEffect(() => {
    setRootFlag("data-hero-locked", homepageHeroLocked);
  }, [homepageHeroLocked]);

  useEffect(() => {
    setRootAttribute("data-homepage-state", isHomeRoute ? homepageState : null);
  }, [homepageState, isHomeRoute]);

  useEffect(() => {
    setRootAttribute(
      "data-route-experience-state",
      routeExperienceActive ? routeExperienceState : null,
    );
  }, [routeExperienceActive, routeExperienceState]);

  useEffect(() => {
    setRootFlag("data-scroll-lock", scrollLocked);
    return () => setRootFlag("data-scroll-lock", false);
  }, [scrollLocked]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const previous = previousScrollStylesRef.current;
    if (!scrollLocked) {
      if (previous) {
        document.documentElement.style.overflow = previous.htmlOverflow;
        document.documentElement.style.overscrollBehavior = previous.htmlOverscroll;
        document.body.style.overflow = previous.bodyOverflow;
        document.body.style.overscrollBehavior = previous.bodyOverscroll;
        previousScrollStylesRef.current = null;
      }
      return undefined;
    }

    if (!previous) {
      previousScrollStylesRef.current = {
        bodyOverflow: document.body.style.overflow,
        bodyOverscroll: document.body.style.overscrollBehavior,
        htmlOverflow: document.documentElement.style.overflow,
        htmlOverscroll: document.documentElement.style.overscrollBehavior,
      };
    }
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      const stored = previousScrollStylesRef.current;
      if (stored) {
        document.documentElement.style.overflow = stored.htmlOverflow;
        document.documentElement.style.overscrollBehavior = stored.htmlOverscroll;
        document.body.style.overflow = stored.bodyOverflow;
        document.body.style.overscrollBehavior = stored.bodyOverscroll;
        previousScrollStylesRef.current = null;
      }
    };
  }, [scrollLocked]);

  useEffect(() => {
    const introLocked = (isHomeRoute && homepageState !== "body") || routeIntroLocked;

    if (!introLocked || typeof window === "undefined") {
      return undefined;
    }

    let frame = 0;
    const resetScroll = () => {
      if (window.scrollX !== 0 || window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(resetScroll);
    };
    const preventDefault = (event: Event) => {
      event.preventDefault();
    };
    const preventScrollKeys = (event: KeyboardEvent) => {
      if (
        event.key === " " ||
        event.key === "PageDown" ||
        event.key === "PageUp" ||
        event.key === "End" ||
        event.key === "Home" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();
      }
    };

    resetScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", preventDefault, { capture: true, passive: false });
    window.addEventListener("touchmove", preventDefault, {
      capture: true,
      passive: false,
    });
    document.addEventListener("keydown", preventScrollKeys, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", preventDefault, true);
      window.removeEventListener("touchmove", preventDefault, true);
      document.removeEventListener("keydown", preventScrollKeys, true);
    };
  }, [homepageState, isHomeRoute, routeIntroLocked]);

  const value = useMemo<AppExperienceValue>(
    () => ({
      loaderActive,
      homepageState,
      routeExperienceState,
      serviceExperienceState,
      homepageHeroLocked,
      homepageBodyActive,
      routeExperienceActive,
      routeIntroLocked,
      routeBodyActive,
      serviceRouteActive: isServiceRoute,
      serviceIntroLocked,
      serviceBodyActive,
      headerHidden,
      scrollLocked,
      dismissLoader,
      lockHomepageHero,
      unlockHomepageHero,
      openHomepageBody,
      completeHomepageOpening,
      closeHomepageBody,
      completeHomepageClosing,
      openRouteBody,
      completeRouteOpening,
      closeRouteBody,
      completeRouteClosing,
      openServiceBody: openRouteBody,
      completeServiceOpening: completeRouteOpening,
      closeServiceBody: closeRouteBody,
      completeServiceClosing: completeRouteClosing,
    }),
    [
      loaderActive,
      homepageState,
      routeExperienceState,
      serviceExperienceState,
      homepageHeroLocked,
      homepageBodyActive,
      routeExperienceActive,
      routeIntroLocked,
      routeBodyActive,
      isServiceRoute,
      serviceIntroLocked,
      serviceBodyActive,
      headerHidden,
      scrollLocked,
      dismissLoader,
      lockHomepageHero,
      unlockHomepageHero,
      openHomepageBody,
      completeHomepageOpening,
      closeHomepageBody,
      completeHomepageClosing,
      openRouteBody,
      completeRouteOpening,
      closeRouteBody,
      completeRouteClosing,
    ],
  );

  return (
    <AppExperienceContext.Provider value={value}>
      {children}
    </AppExperienceContext.Provider>
  );
}

export function useAppExperience(): AppExperienceValue {
  const context = useContext(AppExperienceContext);
  if (!context) {
    throw new Error("useAppExperience must be used within an AppExperienceProvider");
  }
  return context;
}
