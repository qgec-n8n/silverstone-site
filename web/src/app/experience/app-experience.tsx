import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router";

/**
 * AppExperience coordinates the opening sequence shared by every route:
 *
 *   loader gate ──▶ (homepage) locked primary hero ──▶ Explore morph ──▶ body
 *
 * Two pieces of logical state drive everything:
 *   - `loaderActive`        — the Core Spin Loader overlay is up (true on every
 *                              full load / reload, cleared by the loader itself).
 *   - `homepageHeroLocked`  — the homepage primary hero still owns the viewport
 *                              (route-driven: locked whenever the path is "/",
 *                              released only once the Explore morph completes).
 *
 * The header is hidden and scrolling is locked while either is true. The logical
 * state is mirrored onto <html> data-attributes so the gate CSS can react, and
 * the inline boot script in `root.tsx` sets the same attributes synchronously
 * before first paint — so there is no flash and no hydration mismatch.
 */

type AppExperienceValue = {
  loaderActive: boolean;
  homepageHeroLocked: boolean;
  headerHidden: boolean;
  scrollLocked: boolean;
  dismissLoader: () => void;
  lockHomepageHero: () => void;
  unlockHomepageHero: () => void;
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

export function AppExperienceProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";

  const [loaderActive, setLoaderActive] = useState(true);
  // Initialised from the route so SSR, the boot script and the first client
  // render all agree (the homepage opens locked; every other route does not).
  const [homepageHeroLocked, setHomepageHeroLocked] = useState(isHomeRoute);
  const [lastIsHome, setLastIsHome] = useState(isHomeRoute);

  // Re-arm the lock on navigation by adjusting state during render (React's
  // recommended pattern — no effect, no cascading render): entering "/" re-locks,
  // leaving it releases. The Explore morph clears the lock without a path change,
  // so on the homepage it stays open.
  if (isHomeRoute !== lastIsHome) {
    setLastIsHome(isHomeRoute);
    setHomepageHeroLocked(isHomeRoute);
  }

  const dismissLoader = useCallback(() => setLoaderActive(false), []);
  const lockHomepageHero = useCallback(() => setHomepageHeroLocked(true), []);
  const unlockHomepageHero = useCallback(() => setHomepageHeroLocked(false), []);

  const headerHidden = loaderActive || homepageHeroLocked;
  const scrollLocked = loaderActive || homepageHeroLocked;

  useEffect(() => {
    setRootFlag("data-loader-active", loaderActive);
  }, [loaderActive]);

  useEffect(() => {
    setRootFlag("data-hero-locked", homepageHeroLocked);
  }, [homepageHeroLocked]);

  useEffect(() => {
    setRootFlag("data-scroll-lock", scrollLocked);
    return () => setRootFlag("data-scroll-lock", false);
  }, [scrollLocked]);

  const value = useMemo<AppExperienceValue>(
    () => ({
      loaderActive,
      homepageHeroLocked,
      headerHidden,
      scrollLocked,
      dismissLoader,
      lockHomepageHero,
      unlockHomepageHero,
    }),
    [
      loaderActive,
      homepageHeroLocked,
      headerHidden,
      scrollLocked,
      dismissLoader,
      lockHomepageHero,
      unlockHomepageHero,
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
    throw new Error(
      "useAppExperience must be used within an AppExperienceProvider",
    );
  }
  return context;
}
