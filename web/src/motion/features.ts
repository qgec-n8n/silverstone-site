import type { FeatureBundle } from "motion/react";

export function loadDomMaxFeatures(): Promise<FeatureBundle> {
  return import("./dom-max").then((module) => module.default);
}
