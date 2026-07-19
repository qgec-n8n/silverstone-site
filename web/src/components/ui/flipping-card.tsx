import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

type FlippingCardProps = {
  className?: string;
  frontContent?: ReactNode;
  backContent?: ReactNode;
};

/**
 * 21st.dev Flipping Card, adapted for the app's material language and central
 * CSS system. The face plane turns about its Y axis while hover (or keyboard
 * focus on a wrapping link) is held; both faces are absolutely positioned and
 * backface-hidden, so the card's footprint never changes mid-turn. Sizing
 * comes from the parent, and reduced motion suppresses the turn entirely
 * (see `.ss-flip-card` in core-pages.css).
 */
export function FlippingCard({
  className,
  frontContent,
  backContent,
}: FlippingCardProps) {
  return (
    <div className={cn("ss-flip-card", className)}>
      <div className="ss-flip-card__plane">
        <div className="ss-flip-card__face ss-flip-card__face--front">
          {frontContent}
        </div>
        <div className="ss-flip-card__face ss-flip-card__face--back">{backContent}</div>
      </div>
    </div>
  );
}
