import type { ReactNode } from "react";
import * as m from "motion/react-m";

import { motionViewport, revealVariants } from "~/motion";

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
};

/**
 * Reveals a content block the first time it scrolls into view, mirroring the
 * prototype's `[data-reveal]` settle. Content is fully present without JS or
 * under reduced motion (both gated in CSS); only the settle transition is
 * deferred. When disabled it renders a plain wrapper with no reveal behaviour.
 *
 * Uses `motionViewport.block` (amount: "some") rather than a fractional
 * threshold so blocks taller than the viewport — e.g. a full service body —
 * still settle: a fractional `amount` can never be reached when the element is
 * several times the viewport height, which would leave the block stuck at
 * `initial="hidden"` (opacity 0) forever.
 */
export function RevealSection({
  children,
  className,
  enabled = true,
}: RevealSectionProps) {
  if (!enabled) {
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }

  return (
    <m.div
      className={className}
      initial="hidden"
      variants={revealVariants}
      viewport={motionViewport.block}
      whileInView="show"
    >
      {children}
    </m.div>
  );
}
