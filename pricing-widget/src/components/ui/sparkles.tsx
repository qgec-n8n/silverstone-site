import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import * as React from "react";
import { cn } from "@/lib/utils";

type SparklesProps = {
  density?: number;
  speed?: number;
  color?: string;
  className?: string;
};

export function Sparkles({
  density = 120,
  speed = 1,
  color = "#FFFFFF",
  className,
}: SparklesProps) {
  const id = React.useMemo(
    () => `sparkles-${Math.random().toString(36).slice(2, 7)}`,
    [],
  );

  const init = React.useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const options = React.useMemo(
    () => ({
      background: { color: { value: "transparent" } },
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: density, density: { enable: true, value_area: 800 } },
        color: { value: color },
        opacity: {
          value: 0.35,
          random: { enable: true, minimumValue: 0.1 },
          animation: { enable: true, speed: 1.2, minimumValue: 0.1, sync: false },
        },
        size: {
          value: { min: 0.8, max: 2.4 },
          animation: { enable: true, speed: 3, minimumValue: 0.4, sync: false },
        },
        move: {
          enable: true,
          speed,
          direction: "none" as const,
          outModes: { default: "out" as const },
        },
        links: { enable: false },
        shape: { type: "circle" as const },
      },
    }),
    [color, density, speed],
  );

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <Particles id={id} init={init} options={options as any} />
    </div>
  );
}
