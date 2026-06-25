import { useEffect, useState } from "react";

import "~/styles/core-spin-loader.css";

/*
  Branded first-load overlay. Rendered server-side with the overlay active, then
  dismissed on the client after a short hold. The dismissal decision lives only
  in effects (post-hydration), so the server and the initial client render are
  always identical — no hydration mismatch. CSS keeps the overlay hidden until
  `html[data-js="on"]`, so no-JS visitors never get stuck behind it.
*/

const STORAGE_KEY = "ss-loader-seen";
const FIRST_VISIT_MS = 1900;
const REPEAT_MS = 650;
const MAX_MS = 4200;
const EXIT_MS = 600;

type Phase = "active" | "exiting" | "done";

export function CoreSpinLoader() {
  const [phase, setPhase] = useState<Phase>("active");

  useEffect(() => {
    let repeat = false;
    try {
      repeat = window.sessionStorage.getItem(STORAGE_KEY) === "1";
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      repeat = false;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = repeat ? REPEAT_MS : FIRST_VISIT_MS;
    const delay = reduce ? Math.min(hold, 500) : hold;

    const beginExit = () => {
      setPhase((current) => (current === "active" ? "exiting" : current));
    };

    const holdTimer = window.setTimeout(beginExit, delay);
    const escapeTimer = window.setTimeout(beginExit, MAX_MS);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(escapeTimer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "exiting") {
      return undefined;
    }
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
    }, EXIT_MS);
    return () => {
      window.clearTimeout(doneTimer);
    };
  }, [phase]);

  if (phase === "done") {
    return null;
  }

  return (
    <div className="ss-loader" data-phase={phase} role="status" aria-live="polite">
      <div className="ss-loader__stage" aria-hidden="true">
        <span className="ss-loader__core" />
        <span className="ss-loader__ring" />
        <span className="ss-loader__ring ss-loader__ring--inner" />
        <img
          className="ss-loader__emblem"
          src="/brand/silverstone-ai-emblem-dark.png"
          alt=""
          width={84}
          height={84}
          decoding="async"
        />
      </div>
      <p className="ss-loader__label">Engineering the next advantage.</p>
    </div>
  );
}

export default CoreSpinLoader;
