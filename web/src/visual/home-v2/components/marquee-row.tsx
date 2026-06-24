import type { CSSProperties } from "react";

import type { IntegrationMark } from "~/data/home-v2";

type MarqueeRowProps = {
  marks: readonly IntegrationMark[];
  enabled: boolean;
  direction?: "normal" | "reverse";
  durationSeconds?: number;
};

/**
 * One counter-scrolling row of integration marks. Marks are duplicated so the
 * CSS keyframe loop is seamless; when `enabled` is false the track is static
 * (reduced motion / minimal tier). Hovering pauses the row.
 */
export function MarqueeRow({
  marks,
  enabled,
  direction = "normal",
  durationSeconds = 42,
}: MarqueeRowProps) {
  const loop = [...marks, ...marks];
  const style = {
    "--ss-hv2-marquee-duration": `${String(durationSeconds)}s`,
  } as CSSProperties;

  return (
    <div
      className="ss-hv2-marquee"
      data-animated={enabled}
      data-direction={direction}
      style={style}
    >
      <div className="ss-hv2-marquee__track">
        {loop.map((mark, index) => (
          <span key={`${mark.id}-${String(index)}`} className="ss-hv2-chip">
            <img
              src={mark.file}
              alt=""
              width={22}
              height={22}
              loading="lazy"
              decoding="async"
            />
            {mark.name}
          </span>
        ))}
      </div>
    </div>
  );
}
