import { Link } from "react-router";

import { cn } from "~/lib/utils";

type BrandLockupProps = {
  className?: string;
  emblemSize?: number;
  to?: string;
};

/**
 * Silverstone brand lockup — transparent chrome emblem + styled wordmark.
 * The source wordmark is dark slate (invisible on the dark theme), so the
 * "Silverstone AI" wordmark is rendered as styled text rather than a baked
 * image.
 */
export function BrandLockup({
  className,
  emblemSize = 32,
  to = "/",
}: BrandLockupProps) {
  return (
    <Link
      className={cn(
        "ss-focus-ring inline-flex items-center gap-2.5 rounded-[var(--ss-radius-sm)] no-underline",
        className,
      )}
      to={to}
    >
      <img
        alt=""
        aria-hidden
        className="select-none"
        decoding="async"
        height={emblemSize}
        loading="eager"
        src="/brand/silverstone-emblem.png"
        style={{ width: emblemSize, height: emblemSize }}
        width={emblemSize}
      />
      <span className="font-display text-lg leading-none font-semibold tracking-[var(--ss-type-track-heading)]">
        <span className="ss-chrome-text">Silverstone</span>{" "}
        <span className="ss-signal-text">AI</span>
      </span>
      <span className="sr-only">Silverstone AI — home</span>
    </Link>
  );
}
