import type { CSSProperties, ReactNode } from "react";

import { cn } from "~/lib/utils";
import { useSectionReveal } from "~/visual/hooks/use-section-reveal";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger offset applied as a CSS transition-delay. */
  delayMs?: number;
};

/**
 * Wraps content in the shared scroll-reveal treatment. The settle transition is
 * gated behind `html[data-js="on"]` (progressive enhancement) and resolves
 * immediately under reduced motion via `useSectionReveal`.
 */
export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const { ref, revealed } = useSectionReveal();
  const style =
    delayMs > 0
      ? ({ "--ss-hv2-reveal-delay": `${String(delayMs)}ms` } as CSSProperties)
      : undefined;

  return (
    <div
      ref={ref}
      data-revealed={revealed}
      style={style}
      className={cn("ss-hv2-reveal", className)}
    >
      {children}
    </div>
  );
}
