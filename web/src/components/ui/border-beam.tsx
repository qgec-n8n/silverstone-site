import type { CSSProperties } from "react";
import type { MotionStyle, Transition } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "~/lib/utils";

type BorderBeamProps = {
  borderWidth?: number;
  className?: string;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  duration?: number;
  initialOffset?: number;
  reverse?: boolean;
  size?: number;
  style?: CSSProperties;
  transition?: Transition;
};

/**
 * Magic UI Border Beam, installed from the live registry and adapted to the
 * app's strict LazyMotion setup by using `motion/react-m` elements.
 */
export function BorderBeam({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
      style={
        {
          "--border-beam-width": `${String(borderWidth)}px`,
        } as CSSProperties
      }
    >
      <m.div
        className={cn(
          "absolute aspect-square",
          "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent",
          className,
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${String(size)}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            ...style,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${String(initialOffset)}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${String(100 - initialOffset)}%`, `${String(-initialOffset)}%`]
            : [`${String(initialOffset)}%`, `${String(100 + initialOffset)}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
}
