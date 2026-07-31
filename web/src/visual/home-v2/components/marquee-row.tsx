import type { CSSProperties } from "react";

import type { IntegrationMark } from "~/data/home-v2";

type MarqueeRowProps = {
  marks: readonly IntegrationMark[];
  enabled: boolean;
  direction?: "normal" | "reverse";
  durationSeconds?: number;
  /** Accessible label for the row region (keyboard-focusable). */
  label: string;
};

/**
 * One counter-scrolling row of coloured, icon-only integration marks. Marks are
 * duplicated so the CSS keyframe loop is seamless; when `enabled` is false the
 * track is static (reduced motion / minimal tier). The track is decorative
 * (`aria-hidden`) — the names are surfaced once via a visually-hidden list in
 * the parent — and the row pauses on hover and on keyboard focus.
 */
export function MarqueeRow({
  marks,
  enabled,
  direction = "normal",
  durationSeconds = 42,
  label,
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
      tabIndex={0}
      role="group"
      aria-label={label}
    >
      <div className="ss-hv2-marquee__track" aria-hidden="true">
        {loop.map((mark, index) => (
          <span
            key={`${mark.id}-${String(index)}`}
            className="ss-hv2-logo"
            style={
              {
                "--ss-hv2-logo-accent": mark.accent,
              } as CSSProperties
            }
          >
            {/* The track is aria-hidden and each mark appears twice for the
                seamless loop, so this alt never reaches a screen reader — the
                names are announced once from the parent's visually-hidden
                list. It names the brand anyway because image crawlers do not
                honour aria-hidden, and 141 alt-less marks were the largest
                accessibility finding in the 2026-07-31 Ahrefs crawl. */}
            <img
              src={mark.file}
              alt={`${mark.name} logo`}
              width={88}
              height={88}
              loading="lazy"
              decoding="async"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
