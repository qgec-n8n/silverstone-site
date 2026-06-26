import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router";

import { getFutureRouteByPath } from "~/data/future-routes";

/**
 * AppExperience coordinates the opening sequence shared by every route:
 *
 *   loader gate -> (homepage) isolated intro -> Explore morph -> body
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
export type ServiceExperienceState = "intro" | "opening" | "body" | "closing";

type AppExperienceValue = {
  loaderActive: boolean;
  homepageState: HomepageState;
  serviceExperienceState: ServiceExperienceState;
  homepageHeroLocked: boolean;
  homepageBodyActive: boolean;
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

function normalizePathname(pathname: string): string {
  const [pathOnly = "/"] = pathname.split(/[?#]/);
  const normalized = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;

  return normalized !== "/" && normalized.endsWith("/")
    ? normalized.replace(/\/+$/, "")
    : normalized;
}

function isServiceExperienceRoute(pathname: string): boolean {
  const route = getFutureRouteByPath(normalizePathname(pathname));

  return route?.routeGroup === "services" && route.template === "service";
}

export function AppExperienceProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";
  const isServiceRoute = isServiceExperienceRoute(location.pathname);

  const [loaderActive, setLoaderActive] = useState(true);
  const [homepageState, setHomepageState] = useState<HomepageState>(
    isHomeRoute ? "loading" : "body",
  );
  const [serviceExperienceState, setServiceExperienceState] =
    useState<ServiceExperienceState>(isServiceRoute ? "intro" : "body");
  const [lastIsHome, setLastIsHome] = useState(isHomeRoute);
  const [lastServicePath, setLastServicePath] = useState(
    isServiceRoute ? normalizePathname(location.pathname) : null,
  );
  const previousScrollStylesRef = useRef<{
    bodyOverflow: string;
    bodyOverscroll: string;
    htmlOverflow: string;
    htmlOverscroll: string;
  } | null>(null);

  // Re-arm the homepage interaction on navigation by adjusting state during
  // render (React's recommended pattern - no effect, no cascading render).
  if (isHomeRoute !== lastIsHome) {
    setLastIsHome(isHomeRoute);
    setHomepageState(isHomeRoute ? (loaderActive ? "loading" : "intro") : "body");
  }

  const servicePath = isServiceRoute ? normalizePathname(location.pathname) : null;
  if (servicePath !== lastServicePath) {
    setLastServicePath(servicePath);
    setServiceExperienceState(servicePath ? "intro" : "body");
  }

  const dismissLoader = useCallback(() => {
    setLoaderActive(false);
    setHomepageState((current) => (current === "loading" ? "intro" : current));
  }, []);

  const lockHomepageHero = useCallback(() => {
    setHomepageState("intro");
  }, []);

  const unlockHomepageHero = useCallback(() => {
    setHomepageState("body");
  }, []);

  const openHomepageBody = useCallback(() => {
    setHomepageState((current) => (current === "intro" ? "opening" : current));
  }, []);

  const completeHomepageOpening = useCallback(() => {
    setHomepageState((current) => (current === "opening" ? "body" : current));
  }, []);

  const closeHomepageBody = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ left: 0, top: 0, behavior: "auto" });
    }
    setHomepageState((current) => (current === "body" ? "closing" : current));
  }, []);

  const completeHomepageClosing = useCallback(() => {
    setHomepageState((current) => (current === "closing" ? "intro" : current));
  }, []);

  const openServiceBody = useCallback(() => {
    setServiceExperienceState((current) => (current === "intro" ? "opening" : current));
  }, []);

  const completeServiceOpening = useCallback(() => {
    setServiceExperienceState((current) => (current === "opening" ? "body" : current));
  }, []);

  const closeServiceBody = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ left: 0, top: 0, behavior: "auto" });
    }
    setServiceExperienceState((current) => (current === "body" ? "closing" : current));
  }, []);

  const completeServiceClosing = useCallback(() => {
    setServiceExperienceState((current) => (current === "closing" ? "intro" : current));
  }, []);

  const homepageHeroLocked = isHomeRoute && homepageState !== "body";
  const homepageBodyActive = isHomeRoute && homepageState === "body";
  const serviceIntroLocked = isServiceRoute && serviceExperienceState !== "body";
  const serviceBodyActive = isServiceRoute && serviceExperienceState === "body";
  const headerHidden = loaderActive || homepageHeroLocked || serviceIntroLocked;
  const scrollLocked = loaderActive || homepageHeroLocked || serviceIntroLocked;

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
      "data-service-experience-state",
      isServiceRoute ? serviceExperienceState : null,
    );
  }, [isServiceRoute, serviceExperienceState]);

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
    const introLocked = (isHomeRoute && homepageState !== "body") || serviceIntroLocked;

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
  }, [homepageState, isHomeRoute, serviceIntroLocked]);

  const value = useMemo<AppExperienceValue>(
    () => ({
      loaderActive,
      homepageState,
      serviceExperienceState,
      homepageHeroLocked,
      homepageBodyActive,
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
      openServiceBody,
      completeServiceOpening,
      closeServiceBody,
      completeServiceClosing,
    }),
    [
      loaderActive,
      homepageState,
      serviceExperienceState,
      homepageHeroLocked,
      homepageBodyActive,
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
      openServiceBody,
      completeServiceOpening,
      closeServiceBody,
      completeServiceClosing,
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
