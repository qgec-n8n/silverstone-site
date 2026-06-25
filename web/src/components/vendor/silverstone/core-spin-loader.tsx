import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";
import { ALL_INTEGRATIONS } from "~/data/home-v2";

import "~/styles/core-spin-loader.css";

/*
  Branded full-screen overlay shown on every full page load and browser reload
  (not on client-side route changes — it is mounted once in the root Layout and
  resolves to null). It holds for a fixed duration, then fades out and hands off
  to the AppExperience coordinator (`dismissLoader`) which reveals the header and
  releases the scroll lock for non-homepage routes.

  Rendered server-side with the overlay active, dismissed only in effects
  (post-hydration), so the server and the initial client render are identical —
  no hydration mismatch. CSS keeps the overlay hidden until `html[data-js="on"]`,
  so no-JS visitors never get stuck behind it.
*/

const HOLD_MS = 4000;
const EXIT_MS = 600;
const MAX_ASSET_WAIT_MS = 6500;

const HOME_IMAGE_ASSETS = [
  "/brand/silverstone-ai-emblem-dark.png",
  "/brand/silverstone-ai-logo-dark-v3.png",
  "/home-v2/hero-poster.png",
  "/home-v2/hero-poster-portrait.png",
  "/home-v2/story-operating-surface.png",
  "/home-v2/story-voice-signal.png",
  "/home-v2/story-human-loop.png",
  "/home-v2/standard-chrome.png",
  "/home-v2/service-lead-followup.webp",
  "/home-v2/service-workflow-automation.webp",
  "/home-v2/service-data-integration.webp",
  "/home-v2/service-consulting.webp",
] as const;

type Phase = "active" | "exiting" | "done";

function loaderMessage(pathname: string): string {
  if (pathname === "/") {
    return "Engineering the next advantage.";
  }
  if (pathname.startsWith("/services")) {
    return "Mapping the service architecture.";
  }
  if (pathname.startsWith("/industries")) {
    return "Tuning systems to your sector.";
  }
  if (pathname.startsWith("/how-we-work")) {
    return "Calibrating the delivery method.";
  }
  if (pathname.startsWith("/pricing")) {
    return "Costing the advantage.";
  }
  if (pathname.startsWith("/about")) {
    return "Meeting the team behind the systems.";
  }
  if (pathname.startsWith("/book")) {
    return "Opening the audit desk.";
  }
  if (pathname.startsWith("/contact")) {
    return "Connecting you to the studio.";
  }
  if (pathname.startsWith("/blog")) {
    return "Loading the latest field notes.";
  }
  if (pathname.startsWith("/privacy-policy")) {
    return "Reviewing the fine print.";
  }
  return "Engineering the next advantage.";
}

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

function routeAssets(pathname: string): string[] {
  const assets = ["/brand/silverstone-ai-emblem-dark.png"];
  if (pathname === "/") {
    assets.push(...HOME_IMAGE_ASSETS);
    assets.push(...ALL_INTEGRATIONS.map((mark) => mark.file));
  }
  return Array.from(new Set(assets));
}

function preloadRouteAssets(pathname: string): Promise<void> {
  const fontReady =
    "fonts" in document
      ? document.fonts.ready.then(() => undefined)
      : Promise.resolve();
  const assetsReady = Promise.allSettled([
    fontReady,
    ...routeAssets(pathname).map((src) => preloadImage(src)),
  ]).then(() => undefined);
  return Promise.race([assetsReady, wait(MAX_ASSET_WAIT_MS)]);
}

export function CoreSpinLoader() {
  const location = useLocation();
  const { dismissLoader } = useAppExperience();
  const [phase, setPhase] = useState<Phase>("active");
  // Frozen at mount: the loader only ever runs for the route it loaded with.
  const [initialPathname] = useState(() => location.pathname);
  const [message] = useState(() => loaderMessage(initialPathname));
  const visibleMessage = message.replace(/\.$/, "");

  useEffect(() => {
    let cancelled = false;
    const beginExit = () => {
      if (!cancelled) {
        setPhase((current) => (current === "active" ? "exiting" : current));
      }
    };

    void Promise.all([wait(HOLD_MS), preloadRouteAssets(initialPathname)]).then(
      beginExit,
    );
    return () => {
      cancelled = true;
    };
  }, [initialPathname]);

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

  if (phase === "done") {
    return null;
  }

  return (
    <div className="ss-loader" data-phase={phase} role="status" aria-live="polite">
      <div className="ss-loader__stage" aria-hidden="true">
        <span className="ss-loader__halo" />
        <span className="ss-loader__core" />
        <span className="ss-loader__ring" />
        <span className="ss-loader__ring ss-loader__ring--inner" />
        <img
          className="ss-loader__emblem"
          src="/brand/silverstone-ai-emblem-dark.png"
          alt=""
          width={150}
          height={150}
          decoding="async"
        />
      </div>
      <p className="ss-loader__label" aria-hidden="true">
        <span>{visibleMessage}</span>
        <span className="ss-loader__ellipsis">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
      <span className="sr-only">{message}</span>
    </div>
  );
}

export default CoreSpinLoader;
