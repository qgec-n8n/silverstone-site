import type { ReactNode } from "react";

import { usePageTransition } from "~/visual/hooks/use-page-transition";

type PageEntryProps = {
  children: ReactNode;
  enabled?: boolean;
};

/**
 * Wraps a route's main content in the one-shot page-entry transition, mirroring
 * the prototype's page-entry settle. When disabled (e.g. the home route, which
 * owns its own hero motion) it renders children untouched. The hidden initial
 * state is gated in CSS behind `html[data-js="on"]` and reduced-motion, so
 * content is always present without JS or under reduced motion.
 */
export function PageEntry({ children, enabled = true }: PageEntryProps) {
  const { className } = usePageTransition();

  if (!enabled) {
    return <>{children}</>;
  }

  return <div className={className}>{children}</div>;
}
