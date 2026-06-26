import type { ReactNode } from "react";

import "~/styles/visual/visual.css";

type PrimaryCtaProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  onGraphite?: boolean;
};

/**
 * Conversion control for the graphite CTA chamber and hero. 52px tall (within
 * the 48–56px target), token-driven, with the locked focus ring inherited from
 * `:focus-visible` in the visual stylesheet.
 */
export function PrimaryCta({
  children,
  href = "#",
  variant = "primary",
  onGraphite = false,
}: PrimaryCtaProps) {
  const className = [
    "ss-cta",
    `ss-cta--${variant}`,
    onGraphite ? "ss-cta--on-graphite" : null,
  ]
    .filter((token): token is string => token !== null)
    .join(" ");

  return (
    <a className={className} href={href}>
      <span className="ss-cta__label">{children}</span>
    </a>
  );
}
