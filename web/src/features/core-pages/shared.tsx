/**
 * Low-level primitives shared across the six custom core-page compositions
 * (how-we-work, insights, about, pricing, contact, book). Each composition
 * owns its own section architecture and copy — these are only the small
 * reusable building blocks (a linked card, a numbered rail item), the same
 * relationship ServiceCards/ProcessTrack/RelatedRail have to the services-v2
 * compositions.
 */
import type { CSSProperties } from "react";
import { Link } from "react-router";

import { ArrowUpRight, Check, type LucideIcon } from "~/components/icons/lucide";
import { Reveal, RichText } from "~/features/services-v2/components/primitives";

export type CoreCard = {
  body: string;
  href?: string;
  icon?: LucideIcon;
  label?: string;
  title: string;
};

type AccentCssVars = CSSProperties & {
  "--srv2-accent"?: string;
  "--srv2-accent-2"?: string;
};

/**
 * Section-level spectral walk for the core pages. Each `<section>` takes one
 * accent *pair* (base + gradient partner) so its eyebrow, heading gradient,
 * lead emphasis and accent chrome all shift hue as the reader moves down the
 * page — the same "the whole spectrum, one page" logic /pricing uses, applied
 * at section granularity. Cards/rails inside a section still cycle their own
 * finer spectrum on top of this.
 */
const CORE_SECTION_THEMES: readonly { accent: string; accent2: string }[] = [
  { accent: "var(--ss-v2-signal-cyan)", accent2: "var(--ss-v2-azure)" },
  { accent: "var(--ss-v2-aqua)", accent2: "var(--ss-v2-indigo)" },
  { accent: "var(--ss-v2-ultraviolet)", accent2: "var(--ss-v2-orchid)" },
  { accent: "var(--ss-v2-orchid)", accent2: "var(--ss-v2-rose)" },
  { accent: "var(--ss-v2-azure)", accent2: "var(--ss-v2-aqua)" },
  { accent: "var(--ss-v2-indigo)", accent2: "var(--ss-v2-ultraviolet)" },
];

/** Inline style setting the spectral accent pair for the section at `index`. */
export function coreSectionStyle(index: number): AccentCssVars {
  const theme = CORE_SECTION_THEMES[index % CORE_SECTION_THEMES.length];
  return {
    "--srv2-accent": theme?.accent ?? "var(--ss-v2-signal-cyan)",
    "--srv2-accent-2": theme?.accent2 ?? "var(--ss-v2-signal-violet)",
  };
}

/**
 * The core pages take the whole Silverstone signal spectrum — a cyan→violet→rose
 * arc of brand accents — and cycle it across a section's cards and rail items,
 * so the copy reads as "all brand colors" (the /pricing treatment) rather than
 * one flat cyan. Each item's icon, index badge, marker border, hover arrow and
 * inline emphasis inherit its assigned hue through `--srv2-accent`.
 */
export const CORE_SPECTRUM: readonly string[] = [
  "var(--ss-v2-aqua)",
  "var(--ss-v2-azure)",
  "var(--ss-v2-indigo)",
  "var(--ss-v2-ultraviolet)",
  "var(--ss-v2-orchid)",
  "var(--ss-v2-rose)",
];

/** The assigned spectral accent for the card/item at `index`, wrapping. */
export function coreAccentStyle(index: number): AccentCssVars {
  return {
    "--srv2-accent": CORE_SPECTRUM[index % CORE_SPECTRUM.length] ?? "var(--ss-v2-aqua)",
  };
}

/** Linked or static card with an optional icon, pill label and arrow — used
 * where a section's cards route to other pages (Insights topic links) as
 * well as where they're purely informative (How We Work's stage cards). */
export function CoreCardGrid({ cards }: { cards: CoreCard[] }) {
  return (
    <div className="ss-core-cards" data-count={cards.length}>
      {cards.map((card, index) => {
        const Icon = card.icon ?? Check;
        const body = (
          <>
            <span className="ss-srv2-card__icon">
              <Icon aria-hidden="true" />
            </span>
            {card.label ? (
              <span className="ss-core-card__label">{card.label}</span>
            ) : null}
            <h3 className="ss-srv2-card__title">{card.title}</h3>
            <p className="ss-srv2-card__body">
              <RichText text={card.body} />
            </p>
            {card.href ? (
              <span className="ss-core-card__arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            ) : null}
          </>
        );

        return (
          <Reveal key={card.title} kind="card" delayMs={index * 110}>
            {card.href ? (
              <Link
                className="ss-srv2-card ss-core-card"
                style={coreAccentStyle(index)}
                to={card.href}
              >
                {body}
              </Link>
            ) : (
              <article
                className="ss-srv2-card ss-core-card"
                style={coreAccentStyle(index)}
              >
                {body}
              </article>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

/** Numbered two-column rail — for enumerated points that aren't a strict
 * left-to-right sequence (risks, engagement shapes), unlike ProcessTrack's
 * single-row step track. */
export function NumberedRail({ items }: { items: { body: string; title: string }[] }) {
  return (
    <ol className="ss-core-rail">
      {items.map((item, index) => (
        <Reveal key={item.title} kind="card" delayMs={index * 130}>
          <li className="ss-core-rail__item" style={coreAccentStyle(index)}>
            <span className="ss-core-rail__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>
                <RichText text={item.body} />
              </p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
