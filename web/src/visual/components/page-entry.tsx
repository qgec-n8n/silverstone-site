import type { ReactNode } from "react";
import * as m from "motion/react-m";

import { routeTransitionVariants } from "~/motion";

type PageEntryProps = {
  children: ReactNode;
  enabled?: boolean;
};

/**
 * Marks route content that participates in the global app-shell route
 * transition. The actual entrance/exit choreography is owned by AppShell so
 * there is one route-transition system instead of nested page timers.
 */
export function PageEntry({ children, enabled = true }: PageEntryProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <m.div
      animate="enter"
      data-page-entry=""
      initial="initial"
      variants={routeTransitionVariants}
    >
      {children}
    </m.div>
  );
}
