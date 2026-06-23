import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from "react";

import type { LazyVisualImporter } from "~/contracts/visuals";

type LazyVisualBoundaryProps = {
  enabled: boolean;
  fallback: ReactNode;
  visual: LazyExoticComponent<ComponentType>;
};

export function createLazyVisual(importer: LazyVisualImporter) {
  return lazy(importer);
}

export function LazyVisualBoundary({
  enabled,
  fallback,
  visual: LazyVisual,
}: LazyVisualBoundaryProps) {
  if (!enabled) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <LazyVisual />
    </Suspense>
  );
}
