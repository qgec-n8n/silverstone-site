/**
 * Low-level primitives shared across the six bespoke core-page compositions
 * (how-we-work, insights, about, pricing, contact, book). Each composition
 * owns its own section architecture and copy — these are only the small
 * reusable building blocks (a linked card, a numbered rail item), the same
 * relationship ServiceCards/ProcessTrack/RelatedRail have to the services-v2
 * compositions.
 */
import { ArrowUpRight, Check, type LucideIcon } from "~/components/icons/lucide";
import { Reveal, RichText } from "~/features/services-v2/components/primitives";

export type CoreCard = {
  body: string;
  href?: string;
  icon?: LucideIcon;
  label?: string;
  title: string;
};

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
              <a className="ss-srv2-card ss-core-card" href={card.href}>
                {body}
              </a>
            ) : (
              <article className="ss-srv2-card ss-core-card">{body}</article>
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
          <li className="ss-core-rail__item">
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
