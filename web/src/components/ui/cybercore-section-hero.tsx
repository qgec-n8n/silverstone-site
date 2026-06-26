import "~/styles/industry-backgrounds.css";

import { useEffect, useState, type CSSProperties, type FC } from "react";

import { useReducedMotion } from "~/components/accessibility/use-reduced-motion";
import { cn } from "~/lib/utils";

export type CybercoreBackgroundProps = {
  /** Number of animated light beams */
  beamCount?: number;
  className?: string;
  decorative?: boolean;
};

const DEFAULT_BEAM_COUNT = 70;

type CybercoreBeam = {
  id: number;
  style: CSSProperties;
  type: "primary" | "secondary";
};

function generateBeams(beamCount: number): CybercoreBeam[] {
  return Array.from({ length: beamCount }).map((_, i) => {
    const riseDur = Math.random() * 3 + 5;
    const fadeDur = riseDur;
    const type = Math.random() < 0.15 ? "secondary" : "primary";

    return {
      id: i,
      type,
      style: {
        left: `${String(Math.random() * 100)}%`,
        width: `${String(Math.floor(Math.random() * 2) + 1)}px`,
        animationDelay: `${String(Math.random() * 6)}s`,
        animationDuration: `${String(riseDur)}s, ${String(fadeDur)}s`,
      },
    };
  });
}

const CybercoreBackground: FC<CybercoreBackgroundProps> = ({
  beamCount = DEFAULT_BEAM_COUNT,
  className,
  decorative = true,
}) => {
  const { reducedMotion } = useReducedMotion();
  const [beams, setBeams] = useState<CybercoreBeam[]>([]);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) {
        return;
      }

      setBeams(reducedMotion ? [] : generateBeams(beamCount));
    });

    return () => {
      active = false;
    };
  }, [beamCount, reducedMotion]);

  const accessibilityProps = decorative
    ? ({ "aria-hidden": true } as const)
    : ({
        "aria-label": "Animated cybercore grid background",
        role: "img",
      } as const);

  return (
    <div
      className={cn("scene ss-cybercore-scene", className)}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      data-ss-background="cybercore"
      {...accessibilityProps}
    >
      <div className="floor" />
      <div className="main-column" />

      <div className="light-stream-container">
        {beams.map((beam) => (
          <div key={beam.id} className={`light-beam ${beam.type}`} style={beam.style} />
        ))}
      </div>
    </div>
  );
};

export default CybercoreBackground;
