import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";
import { isGateFreeNavigation } from "~/data/gate-free-routes";
import { getRouteExperienceByPath } from "~/data/route-experiences";
import { webpSource } from "~/lib/image-sources";
import { useHydrated } from "~/lib/use-hydrated";

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

/* Total visible lifetime (HOLD_MS + EXIT_MS) is held to ~1.65s. Route-asset
   preloading below runs concurrently and is never awaited before dismissal —
   it keeps warming the cache in the background for whichever assets aren't
   ready yet.

   Trimmed from 1900/600 on 2026-08-10. Measured on a throttled phone, the
   opening chain was: FCP 734ms, route chunk hydrated 3146ms, loader gone
   3734ms, hero lead not fully visible until 4485ms — so the branded beat was
   costing ~1.5s of Largest Contentful Paint on all 24 gated routes, and the
   hero was still fading in three quarters of a second AFTER the overlay had
   already lifted. The beat is still deliberate and still reads as one; it just
   no longer outlasts the content it is covering. */
const HOLD_MS = 1200;
const EXIT_MS = 450;
// WebP directly rather than through `RasterPicture`: the loader CSS positions
// `.ss-loader__emblem` as a child of `.ss-loader__stage`, so introducing a
// <picture> wrapper between them would break the centring the homepage
// interaction spec measures. Every browser this build targets decodes WebP,
// at 860x929 the PNG cost 125 KB on every route against 51 KB here.
const LOADER_EMBLEM_SRC = "/brand/silverstone-ai-emblem-dark-transparent.webp";

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
  // Warm the WebP sibling, which is what `<picture>` actually resolves to for
  // every client that can decode it. Warming the JPEG/PNG original instead
  // downloaded the heavy copy the page then never used — on
  // /industry/salons-barbers that was a redundant 201 KB, and the fallbacks
  // are far larger elsewhere. A client without WebP support simply fails this
  // decode (`preloadImage` swallows the error) and loads its own fallback.
  return Array.from(new Set(assets.map(webpSource)));
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
  const hydrated = useHydrated();
  const { dismissLoader } = useAppExperience();
  /*
   * Prerendered HTML never carries a hash, so the hash half of the gate-free
   * check must wait for hydration — otherwise a `path#section` deep-link
   * landing renders "done" against static "active" markup and React reports
   * a hydration mismatch. During the hidden pre-hydration window the boot
   * script's `data-gate-free` marker keeps the static overlay invisible; the
   * effect below then retires the overlay on the first post-hydration pass.
   */
  const gateFree = isGateFreeNavigation(
    location.pathname,
    hydrated ? location.hash : "",
  );
  const [phase, setPhase] = useState<Phase>(gateFree ? "done" : "active");
  const [ellipsisStep, setEllipsisStep] = useState(3);
  const [activePathname, setActivePathname] = useState(() => location.pathname);
  const experience = getRouteExperienceByPath(activePathname);

  if (activePathname !== location.pathname) {
    setActivePathname(location.pathname);
    // This block only ever runs for a client-side navigation — a full document
    // load mounts fresh, initialising `activePathname` to the current path. The
    // overlay is reserved for those cold entries (see `rearmGate` in
    // app/experience/app-experience.tsx), so moving around the site retires it
    // rather than replaying it.
    setPhase("done");
  }

  // Deep-link hydration hand-off: `phase` initialised to the prerendered
  // "active" state (the hash is invisible until hydration), and `gateFree`
  // flips on the first post-hydration render — reconcile in the render
  // phase, the same derived-state pattern as the pathname block above.
  if (gateFree && phase === "active") {
    setPhase("done");
  }

  useEffect(() => {
    if (gateFree) {
      dismissLoader();
      return undefined;
    }

    let canceled = false;
    const beginExit = () => {
      if (!canceled) {
        setPhase((current) => (current === "active" ? "exiting" : current));
      }
    };

    preloadRouteAssets(activePathname);
    void wait(HOLD_MS).then(beginExit);
    return () => {
      canceled = true;
    };
  }, [activePathname, dismissLoader, gateFree]);

  useEffect(() => {
    // The boot script's synchronous no-flash marker (`data-gate-free`) has
    // done its job once the overlay has actually retired; removing it only
    // then keeps the static overlay hidden for every pre-"done" frame, and
    // frees the marker for later client-side navigations to gated routes.
    if (phase === "done" && typeof document !== "undefined") {
      document.documentElement.removeAttribute("data-gate-free");
    }
  }, [phase]);

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

  const labelWords = experience.loaderText.split(" ");
  const labelTail = labelWords[labelWords.length - 1] ?? "";
  const labelHead = labelWords.slice(0, -1).join(" ");

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
          alt="Silverstone AI emblem"
          width={860}
          height={929}
          decoding="async"
          fetchPriority="high"
          loading="eager"
        />
      </div>
      <p className="ss-loader__label" aria-hidden="true">
        {/* The animated ellipsis is glued to the final word in a no-wrap span
            so a line break can never strand the dots on a line of their own. */}
        {labelHead ? <span>{labelHead} </span> : null}
        <span className="ss-loader__tail">
          {labelTail}
          <span className="ss-loader__ellipsis" aria-hidden="true">
            {".".repeat(ellipsisStep)}
          </span>
        </span>
      </p>
      <span className="sr-only">{experience.loaderText}.</span>
    </div>
  );
}

export default CoreSpinLoader;
