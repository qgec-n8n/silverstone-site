/**
 * /pricing — ongoing support retainers.
 *
 * Same card family as the implementation packages, deliberately quieter: no
 * radial wash, a smaller price step and a mono response-time spec block, so the
 * section reads as the companion to the primary pricing row rather than a
 * second bid for attention.
 *
 * The commitments instrument at the foot keeps the reference design's compact
 * four-tile shape but publishes contractual commitments instead of uptime,
 * retention and satisfaction percentages — this repository holds no evidence
 * for those figures, so they are not presented as Silverstone results.
 */
import {
  Check,
  Gauge,
  Users,
  Wrench,
  type LucideIcon,
} from "~/components/icons/lucide";
import {
  BorderBeam,
  PanelReveal,
  RevealGroup,
} from "~/features/services-v2/components/primitives";

import {
  SUPPORT_COMMITMENTS,
  SUPPORT_PRINCIPLES,
  SUPPORT_TIERS,
  type PricingCssVars,
} from "./pricing-content";

/** One metaphor per principle, in SUPPORT_PRINCIPLES order. */
const PRINCIPLE_ICONS: readonly LucideIcon[] = [Gauge, Wrench, Users];

/**
 * A spectral accent per principle — the same cyan→violet arc the rest of
 * /pricing cycles through — so each retainer benefit's marker and title carry
 * their own on-brand colour and the card reads as fast-to-skim rather than a
 * flat grey list.
 */
const PRINCIPLE_ACCENTS: readonly string[] = [
  "var(--ss-v2-aqua)",
  "var(--ss-v2-sky)",
  "var(--ss-v2-orchid)",
];

/**
 * Service-commitment accents — a four-step spectral run so the guarantee tiles
 * read as a spectrum of assurances rather than four identical chrome values.
 */
const COMMITMENT_ACCENTS: readonly string[] = [
  "var(--ss-v2-aqua)",
  "var(--ss-v2-azure)",
  "var(--ss-v2-indigo)",
  "var(--ss-v2-orchid)",
];

export function SupportRetainerGrid() {
  return (
    <>
      <RevealGroup className="ss-pri-support">
        {SUPPORT_TIERS.map((tier, index) => (
          <PanelReveal
            className={`ss-pri-retainer${tier.featured ? " ss-srv2-beam-border" : ""}`}
            delayMs={index * 120}
            key={tier.id}
          >
            {tier.badge ? (
              <span className="ss-pri-tier__badge" data-tone="soft">
                {tier.badge}
              </span>
            ) : null}

            <h3 className="ss-pri-retainer__title">{tier.title}</h3>

            <p className="ss-pri-retainer__price">
              <span className="ss-pri-retainer__figure">{tier.price}</span>
              <span className="ss-pri-retainer__qualifier">{tier.priceNote}</span>
            </p>

            <h4 className="ss-pri-tier__label">Included services</h4>
            <ul className="ss-pri-tier__list" data-size="compact">
              {tier.included.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h4 className="ss-pri-tier__label">Response times</h4>
            <dl className="ss-pri-retainer__spec">
              {tier.responses.map((response) => (
                <div key={response.level}>
                  <dt>{response.level}</dt>
                  <dd>{response.time}</dd>
                </div>
              ))}
            </dl>

            {tier.featured ? <BorderBeam /> : null}
          </PanelReveal>
        ))}
      </RevealGroup>

      <PanelReveal className="ss-pri-benefits" delayMs={120}>
        <div className="ss-pri-benefits__copy">
          <h3 className="ss-pri-subhead">Why choose a support retainer?</h3>
          <ul className="ss-pri-benefits__list">
            {SUPPORT_PRINCIPLES.map((principle, index) => {
              const Icon = PRINCIPLE_ICONS[index] ?? Gauge;
              return (
                <li
                  key={principle.title}
                  style={
                    {
                      "--pri-accent": PRINCIPLE_ACCENTS[index] ?? PRINCIPLE_ACCENTS[0],
                    } as PricingCssVars
                  }
                >
                  <span className="ss-pri-benefits__marker" aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <h4>{principle.title}</h4>
                    <p>{principle.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="ss-pri-benefits__panel">
          <span className="ss-pri-panel__tag">Service commitments</span>
          <ul className="ss-pri-commitments">
            {SUPPORT_COMMITMENTS.map((commitment, index) => (
              <li
                key={commitment.value}
                style={
                  {
                    "--pri-accent": COMMITMENT_ACCENTS[index] ?? COMMITMENT_ACCENTS[0],
                  } as PricingCssVars
                }
              >
                <span className="ss-pri-commitments__value">{commitment.value}</span>
                <span className="ss-pri-commitments__label">{commitment.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </PanelReveal>
    </>
  );
}
