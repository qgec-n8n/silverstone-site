import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";

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

export function CoreSpinLoader() {
  const location = useLocation();
  const { dismissLoader } = useAppExperience();
  const [phase, setPhase] = useState<Phase>("active");
  // Frozen at mount: the loader only ever runs for the route it loaded with.
  const [message] = useState(() => loaderMessage(location.pathname));

  useEffect(() => {
    const beginExit = () => {
      setPhase((current) => (current === "active" ? "exiting" : current));
    };
    const holdTimer = window.setTimeout(beginExit, HOLD_MS);
    return () => {
      window.clearTimeout(holdTimer);
    };
  }, []);

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
      <p className="ss-loader__label">{message}</p>
    </div>
  );
}

export default CoreSpinLoader;
