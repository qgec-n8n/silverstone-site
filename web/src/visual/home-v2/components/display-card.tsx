import { Link } from "react-router";

import type { ServiceUniverseCard } from "~/data/home-v2";

import { Icon } from "./icon";

type DisplayCardProps = {
  card: ServiceUniverseCard;
};

/**
 * A single service in the "operating system" universe. The card surface, accent
 * glow and hover lift are CSS-driven (conflict-free with the scroll owner); the
 * whole card is a single navigable link.
 */
export function DisplayCard({ card }: DisplayCardProps) {
  return (
    <Link
      to={card.href}
      className="ss-hv2-card ss-focus-ring"
      data-accent={card.accent}
    >
      <div className="flex items-center justify-between">
        <span className="ss-hv2-card__icon">
          <Icon name={card.icon} className="size-6" />
        </span>
        <span className="ss-hv2-card__index">{card.index}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="ss-hv2-card__title">{card.title}</h3>
        <p className="text-sm font-semibold text-[color:var(--ss-v2-signal-cyan-soft)]">
          {card.tagline}
        </p>
      </div>

      <p className="text-sm leading-relaxed ss-hv2-copy">{card.description}</p>

      <ul className="flex flex-col gap-2">
        {card.highlights.map((highlight) => (
          <li key={highlight} className="ss-hv2-card__highlight">
            <Icon name="Check" className="size-4" />
            {highlight}
          </li>
        ))}
      </ul>

      <span className="ss-hv2-card__cta">
        Explore
        <Icon name="ArrowUpRight" className="size-4" />
      </span>
    </Link>
  );
}
