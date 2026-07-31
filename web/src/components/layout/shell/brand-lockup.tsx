import type { CSSProperties } from "react";
import { Link } from "react-router";

import { cn } from "~/lib/utils";
import { RasterPicture } from "~/components/ui/raster-picture";

type BrandTone = "onDark" | "onLight";

type BrandLockupProps = {
  className?: string;
  emblemClassName?: string;
  emblemSize?: number;
  to?: string;
  tone?: BrandTone;
};

/**
 * Silverstone brand lockup — chrome emblem + styled wordmark.
 *
 * `onDark` (default) uses the transparent chrome emblem on the dark shell; the
 * source wordmark is dark slate (invisible on dark), so "Silverstone AI" is
 * rendered as styled text rather than a baked image.
 *
 * `onLight` is for the white/platinum global header: it uses the
 * white-background emblem source so the emblem blends seamlessly into the white
 * surface (no dark plate, no visible square), with graphite wordmark text. Pass
 * `emblemClassName` for responsive sizing (the white padding around the mark is
 * invisible on the white header, so the box can run larger than the mark).
 */
export function BrandLockup({
  className,
  emblemClassName,
  emblemSize = 32,
  to = "/",
  tone = "onDark",
}: BrandLockupProps) {
  const isLight = tone === "onLight";
  const src = isLight
    ? "/brand/silverstone-emblem-source.png"
    : "/brand/silverstone-emblem.png";
  const style: CSSProperties | undefined = emblemClassName
    ? undefined
    : { width: emblemSize, height: emblemSize };

  return (
    <Link
      className={cn(
        "ss-focus-ring inline-flex items-center gap-2.5 rounded-[var(--ss-radius-sm)] no-underline",
        className,
      )}
      to={to}
    >
      <RasterPicture
        alt=""
        aria-hidden
        className={cn("select-none", emblemClassName)}
        decoding="async"
        height={emblemSize}
        loading="eager"
        src={src}
        style={style}
        width={emblemSize}
      />
      <span
        className={cn(
          "font-display leading-none font-semibold whitespace-nowrap tracking-[var(--ss-type-track-heading)]",
          isLight ? "text-xl lg:text-2xl" : "text-lg",
        )}
      >
        {isLight ? (
          <>
            <span className="text-[color:var(--ss-v2-header-text-strong)]">
              Silverstone
            </span>{" "}
            <span className="text-[color:var(--ss-v2-header-accent)]">AI</span>
          </>
        ) : (
          <>
            <span className="ss-chrome-text">Silverstone</span>{" "}
            <span className="ss-signal-text">AI</span>
          </>
        )}
      </span>
      <span className="sr-only">Silverstone AI — home</span>
    </Link>
  );
}
