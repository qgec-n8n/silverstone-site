import { useEffect, useState } from "react";

import { createLazyVisual, LazyVisualBoundary } from "~/lib/visuals/lazy-visual-boundary";
import { LowPowerPoster } from "~/visual/components/low-power-poster";

const SignalFieldCanvas = createLazyVisual(() => import("./signal-field-canvas"));

/**
 * Optional idle-scheduling surface. `requestIdleCallback` is required in the DOM
 * lib types but absent in some engines (e.g. Safari), so we treat it as optional
 * and fall back to a timeout — mirroring the prototype's deferral.
 */
type IdleWindow = {
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type SignalFieldBackgroundProps = {
  enabled: boolean;
};

/**
 * Stage background. The static poster is always present as the base layer; the
 * deferred WebGL canvas is mounted on top only when `enabled` (Tier A) AND the
 * browser has gone idle — mirroring the prototype's `requestIdleCallback` gate so
 * the shader chunk never competes with first paint. Until then, or on any
 * failure, the poster remains the source of truth.
 */
export function SignalFieldBackground({ enabled }: SignalFieldBackgroundProps) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    const idleWindow: IdleWindow = window;
    const request = idleWindow.requestIdleCallback;
    const cancel = idleWindow.cancelIdleCallback;

    if (request && cancel) {
      const handle = request(
        () => {
          setIdle(true);
        },
        { timeout: 1500 },
      );
      return () => {
        cancel(handle);
      };
    }

    const timer = window.setTimeout(() => {
      setIdle(true);
    }, 600);
    return () => {
      window.clearTimeout(timer);
    };
  }, [enabled]);

  return (
    <div className="ss-stage__field" aria-hidden="true">
      <LowPowerPoster />
      <LazyVisualBoundary enabled={enabled && idle} fallback={null} visual={SignalFieldCanvas} />
    </div>
  );
}
