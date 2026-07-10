import { useInView } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";

import { motionDistances, motionDurations, motionEasings } from "~/motion/tokens";
import { useRevealStart } from "~/motion/use-reveal-start";

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
 * Uses `amount: "some"` rather than a fractional threshold so blocks taller
 * than the viewport — e.g. a full service body — still settle: a fractional
 * `amount` can never be reached when the element is several times the viewport
 * height, which would leave the block stuck at `initial="hidden"` (opacity 0)
 * forever.
 *
 * Start moments go through the global reveal scheduler
 * (`~/motion/reveal-scheduler`) so near-simultaneous triggers still play
 * strictly top-to-bottom, then left-to-right.
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
    <ScheduledRevealSection className={className}>{children}</ScheduledRevealSection>
  );
}

function ScheduledRevealSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: "some",
    margin: "0px 0px -12% 0px",
    once: true,
  });
  const start = useRevealStart(ref, inView, 0);

  return (
    <m.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={start !== null ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: motionDistances.reveal },
        show: { opacity: 1, y: 0 },
      }}
      transition={{
        delay: (start?.delayMs ?? 0) / 1000,
        duration: start?.instant
          ? 0
          : motionDurations.route * (start?.durationScale ?? 1),
        ease: motionEasings.entrance,
      }}
    >
      {children}
    </m.div>
  );
}
