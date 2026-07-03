import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";
import { getRouteExperienceByPath } from "~/data/route-experiences";

import "~/styles/core-spin-loader.css";

/*
  Branded full-screen overlay shown on every page entry: full load, browser
  reload, back/forward and client-side route changes. It holds for a fixed
  duration, then fades out and hands off to the AppExperience coordinator
  (`dismissLoader`) which reveals the page-specific intro.

  Rendered server-side with the overlay active, dismissed only in effects
  (post-hydration), so the server and the initial client render are identical —
  no hydration mismatch. CSS keeps the overlay hidden until `html[data-js="on"]`,
  so no-JS visitors never get stuck behind it.
*/

/* Total visible lifetime (HOLD_MS + EXIT_MS) is held to ~2.5s. Route-asset
   preloading below runs concurrently and is never awaited before dismissal —
   it keeps warming the cache in the background for whichever assets aren't
   ready yet. */
const HOLD_MS = 1900;
const EXIT_MS = 600;
const LOADER_EMBLEM_SRC = "/brand/silverstone-ai-emblem-dark-transparent.png";

const HOME_IMAGE_ASSETS = [
  LOADER_EMBLEM_SRC,
  "/brand/silverstone-ai-logo-footer.png",
  "/home-v2/hero-poster.png",
  "/home-v2/hero-poster-portrait.png",
  "/home-v2/silverstone-system-visual.png",
] as const;
const HOME_FETCH_ASSETS = ["/vendor/particles.js"] as const;

type Phase = "active" | "exiting" | "done";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      void image
        .decode()
        .catch(() => undefined)
        .finally(resolve);
    };
    image.onerror = () => resolve();
    image.src = src;
  });
}

function preloadFetchAsset(src: string): Promise<void> {
  return fetch(src, { cache: "force-cache" })
    .then(() => undefined)
    .catch(() => undefined);
}

function routeAssets(pathname: string): string[] {
  const experience = getRouteExperienceByPath(pathname);
  const assets = [LOADER_EMBLEM_SRC];
  if (pathname === "/") {
    assets.push(...HOME_IMAGE_ASSETS);
  }
  if (experience.preloadAssets) {
    assets.push(...experience.preloadAssets);
  }
  return Array.from(new Set(assets));
}

/** Fire-and-forget: warms the image/font/asset cache in the background.
 * Never awaited before dismissal, so slow assets can't extend the loader
 * past its fixed HOLD_MS budget. */
function preloadRouteAssets(pathname: string): void {
  const fontReady =
    "fonts" in document
      ? document.fonts.ready.then(() => undefined)
      : Promise.resolve();
  void Promise.allSettled([
    fontReady,
    ...routeAssets(pathname).map((src) => preloadImage(src)),
    ...(pathname === "/" ? HOME_FETCH_ASSETS.map((src) => preloadFetchAsset(src)) : []),
  ]);
}

export function CoreSpinLoader() {
  const location = useLocation();
  const { dismissLoader } = useAppExperience();
  const [phase, setPhase] = useState<Phase>("active");
  const [ellipsisStep, setEllipsisStep] = useState(3);
  const [activePathname, setActivePathname] = useState(() => location.pathname);
  const experience = getRouteExperienceByPath(activePathname);

  if (activePathname !== location.pathname) {
    setActivePathname(location.pathname);
    setPhase("active");
  }

  useEffect(() => {
    let cancelled = false;
    const beginExit = () => {
      if (!cancelled) {
        setPhase((current) => (current === "active" ? "exiting" : current));
      }
    };

    preloadRouteAssets(activePathname);
    void wait(HOLD_MS).then(beginExit);
    return () => {
      cancelled = true;
    };
  }, [activePathname]);

  useEffect(() => {
    if (phase !== "exiting") {
      return undefined;
    }
    // Hand the viewport back as the overlay fades: header reveals and scrolling
    // unlocks for non-homepage routes (the homepage stays locked behind the
    // primary hero until the Explore morph completes).
    dismissLoader();
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
    }, EXIT_MS);
    return () => {
      window.clearTimeout(doneTimer);
    };
  }, [phase, dismissLoader]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return undefined;
    }
    const interval = window.setInterval(() => {
      setEllipsisStep((current) => (current >= 3 ? 1 : current + 1));
    }, 420);
    return () => {
      window.clearInterval(interval);
    };
  }, []);

  if (phase === "done") {
    return null;
  }

  return (
    <div className="ss-loader" data-phase={phase} role="status" aria-live="polite">
      <div className="ss-loader__stage" aria-hidden="true">
        <div className="ss-loader__core-spin">
          <div className="ss-loader__base-glow" />
          <div className="ss-loader__outer-ring" />
          <div className="ss-loader__main-arc" />
          <div className="ss-loader__reverse-arc" />
          <div className="ss-loader__inner-arc" />
          <div className="ss-loader__orbital">
            <div className="ss-loader__orbital-dot" />
          </div>
        </div>
        <img
          className="ss-loader__emblem ss-loader__center-core"
          src={LOADER_EMBLEM_SRC}
          alt=""
          width={860}
          height={929}
          decoding="async"
          fetchPriority="high"
          loading="eager"
        />
      </div>
      <p className="ss-loader__label" aria-hidden="true">
        <span>{experience.loaderText}</span>
        <span className="ss-loader__ellipsis" aria-hidden="true">
          {".".repeat(ellipsisStep)}
        </span>
      </p>
      <span className="sr-only">{experience.loaderText}.</span>
    </div>
  );
}

export default CoreSpinLoader;
