import { useSyncExternalStore } from "react";

import { useReducedMotion } from "~/components/accessibility/use-reduced-motion";

/**
 * Hard width gate for the deferred WebGL signal field. Below this the shader
 * never loads — the static poster is the source of truth on small viewports.
 */
export const SHADER_MIN_WIDTH = 1024;

export type CapabilityTier = "full" | "balanced" | "minimal";

export type CapabilitySnapshot = {
  tier: CapabilityTier;
  shaderEligible: boolean;
  reducedMotion: boolean;
  lowPower: boolean;
  viewportWidth: number;
};

type NavigatorWithCapabilities = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

let webglSupportCache: boolean | null = null;

function subscribeViewport(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("resize", onStoreChange, { passive: true });
  return () => window.removeEventListener("resize", onStoreChange);
}

function getViewportWidth() {
  if (typeof window === "undefined") {
    return 0;
  }

  return window.innerWidth;
}

function getServerViewportWidth() {
  return 0;
}

function detectWebgl(): boolean {
  if (webglSupportCache !== null) {
    return webglSupportCache;
  }

  if (typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    webglSupportCache = canvas.getContext("webgl") !== null;
  } catch {
    webglSupportCache = false;
  }

  return webglSupportCache;
}

function detectLowPower(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const nav: NavigatorWithCapabilities = navigator;

  if (nav.connection?.saveData === true) {
    return true;
  }

  if (
    typeof nav.deviceMemory === "number" &&
    nav.deviceMemory > 0 &&
    nav.deviceMemory < 4
  ) {
    return true;
  }

  if (nav.hardwareConcurrency > 0 && nav.hardwareConcurrency < 4) {
    return true;
  }

  return false;
}

function subscribeLowPower() {
  return () => undefined;
}

function getServerLowPowerSnapshot() {
  return false;
}

/**
 * Resolves the render tier for the home visuals from the live viewport,
 * the user's motion preference, and coarse device-capability hints.
 *
 * - `full`     ≥1024px, motion allowed, capable device → shader eligible.
 * - `balanced` narrower viewport, motion allowed → CSS motion only.
 * - `minimal`  reduced-motion or low-power → static, no animation.
 *
 * NOTE: detectLowPower() is wrapped in useSyncExternalStore so the server
 * snapshot always returns false. Node.js 22+ exposes navigator.hardwareConcurrency
 * which would otherwise make the server compute lowPower=true and produce a
 * different tier/motionEnabled value than the browser, causing a structural
 * hydration mismatch (HeroAetherField rendered vs. null).
 */
export function useCapabilityTier(): CapabilitySnapshot {
  const { reducedMotion } = useReducedMotion();
  const viewportWidth = useSyncExternalStore(
    subscribeViewport,
    getViewportWidth,
    getServerViewportWidth,
  );

  const lowPower = useSyncExternalStore(
    subscribeLowPower,
    detectLowPower,
    getServerLowPowerSnapshot,
  );

  let tier: CapabilityTier;
  if (reducedMotion || lowPower) {
    tier = "minimal";
  } else if (viewportWidth < SHADER_MIN_WIDTH) {
    tier = "balanced";
  } else {
    tier = "full";
  }

  const shaderEligible = tier === "full" && detectWebgl();

  return { tier, shaderEligible, reducedMotion, lowPower, viewportWidth };
}
