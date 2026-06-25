import { useEffect, useState } from "react";

import {
  createLazyVisual,
  LazyVisualBoundary,
} from "~/lib/visuals/lazy-visual-boundary";
import type { CapabilityTier } from "~/visual/hooks/use-capability-tier";

/*
  Continuous animated backdrop behind the whole V2 homepage. The base gradient,
  spectral light fields and technical grid are pure CSS (so they render under
  no-JS / reduced motion as a calm static surface). The ambient particle canvas
  is code-split and mounted only on idle when motion is permitted. Readability is
  preserved because every layer stays low-opacity behind the isolated content.
*/

const BodyParticleLayer = createLazyVisual(() => import("./body-particle-layer"));

type IdleWindow = {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type BodyBackdropProps = {
  enabled: boolean;
  tier: CapabilityTier;
};

export function BodyBackdrop({ enabled, tier }: BodyBackdropProps) {
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
        { timeout: 2000 },
      );
      return () => {
        cancel(handle);
      };
    }

    const timer = window.setTimeout(() => {
      setIdle(true);
    }, 800);
    return () => {
      window.clearTimeout(timer);
    };
  }, [enabled]);

  return (
    <div className="ss-hv2-backdrop" data-tier={tier} aria-hidden="true">
      <div className="ss-hv2-backdrop__base" />
      <div className="ss-hv2-backdrop__fields" />
      <div className="ss-hv2-backdrop__grid" />
      <LazyVisualBoundary
        enabled={enabled && idle}
        fallback={null}
        visual={BodyParticleLayer}
      />
      <div className="ss-hv2-backdrop__noise" />
    </div>
  );
}
