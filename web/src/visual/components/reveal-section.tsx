import type { ReactNode } from "react";

import { useSectionReveal } from "~/visual/hooks/use-section-reveal";

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
 */
export function RevealSection({
  children,
  className,
  enabled = true,
}: RevealSectionProps) {
  const { ref, revealed } = useSectionReveal();

  if (!enabled) {
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }

  return (
    <div
      className={className}
      data-reveal=""
      data-revealed={revealed ? "true" : undefined}
      ref={ref}
    >
      {children}
    </div>
  );
}
