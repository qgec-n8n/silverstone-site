import { useEffect, useState } from "react";

import {
  createLazyVisual,
  LazyVisualBoundary,
} from "~/lib/visuals/lazy-visual-boundary";

const HeroFieldCanvas = createLazyVisual(() => import("./hero-field-canvas"));
const HeroParticleLayer = createLazyVisual(() => import("./hero-particle-layer"));

/**
 * Optional idle-scheduling surface. `requestIdleCallback` is required by the DOM
 * lib types but absent in some engines, so we treat it as optional and fall back
 * to a timeout.
 */
type IdleWindow = {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type HeroFieldBackgroundProps = {
  enabled: boolean;
  particlesEnabled?: boolean;
};

/**
 * Dark hero stage background. The static poster is always the base layer; the
 * deferred WebGL shader mounts on top only when `enabled` (full tier + WebGL)
 * AND the browser has gone idle, so the shader chunk never competes with first
 * paint. The interactive Canvas-2D particle layer mounts on the lighter
 * `particlesEnabled` gate (any motion-enabled tier). Until idle, or on any
 * failure, the poster remains the source of truth.
 */
export function HeroFieldBackground({
  enabled,
  particlesEnabled = false,
}: HeroFieldBackgroundProps) {
  const [idle, setIdle] = useState(false);
  const active = enabled || particlesEnabled;

  useEffect(() => {
    if (!active || typeof window === "undefined") {
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
  }, [active]);

  return (
    <div className="ss-hv2-hero__field" data-ss-gsap="hero-field" aria-hidden="true">
      <div className="ss-hv2-hero__poster" />
      <LazyVisualBoundary
        enabled={enabled && idle}
        fallback={null}
        visual={HeroFieldCanvas}
      />
      <LazyVisualBoundary
        enabled={particlesEnabled && idle}
        fallback={null}
        visual={HeroParticleLayer}
      />
    </div>
  );
}
