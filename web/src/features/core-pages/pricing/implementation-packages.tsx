/**
 * /pricing — the three primary implementation packages.
 *
 * Each card is a `PanelReveal` root, so the frame itself materialises with the
 * system's existing edge-light ignition and single diagonal sheen rather than a
 * bespoke entrance; the featured card adds the resident `BorderBeam` so exactly
 * one card in the row carries continuous perimeter energy. Everything else —
 * price hierarchy, inclusion lists, hover lift — is CSS, so nothing here
 * animates layout.
 */
import { Check, ChevronDown, InfoIcon, Layers } from "~/components/icons/lucide";
import {
  BorderBeam,
  PanelReveal,
  Reveal,
} from "~/features/services-v2/components/primitives";

import {
  BAND_LADDER,
  IMPLEMENTATION_SCOPE_CHIPS,
  IMPLEMENTATION_TIERS,
  PAGE_PRICING_DISCLOSURE,
  type PricingCssVars,
} from "./pricing-content";

export function ImplementationPackages() {
  return (
    <>
      <Reveal kind="section" className="ss-pri-chips-reveal">
        <ul
          className="ss-pri-chips"
          aria-label="Services these implementation bands cover"
        >
          {IMPLEMENTATION_SCOPE_CHIPS.map((chip) => (
            <li className="ss-pri-chip" key={chip}>
              <Layers aria-hidden="true" />
              {chip}
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="ss-pri-tiers">
        {IMPLEMENTATION_TIERS.map((tier, index) => (
          <PanelReveal
            className={`ss-pri-tier${tier.featured ? " ss-srv2-beam-border" : ""}`}
            delayMs={index * 140}
            key={tier.id}
          >
            {tier.badge ? (
              <span className="ss-pri-tier__badge">{tier.badge}</span>
            ) : null}

            <div className="ss-pri-tier__head">
              <h3 className="ss-pri-tier__title">{tier.title}</h3>
              <p className="ss-pri-tier__desc">{tier.description}</p>
            </div>

            <p className="ss-pri-tier__price">
              <span className="ss-pri-tier__figure">{tier.price}</span>
              <span className="ss-pri-tier__qualifier">{tier.priceNote}</span>
            </p>

            <div className="ss-pri-tier__block">
              <h4 className="ss-pri-tier__label">{tier.includedLabel}</h4>
              <ul className="ss-pri-tier__list">
                {tier.included.map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ss-pri-tier__block ss-pri-tier__block--ideal">
              <h4 className="ss-pri-tier__label">{tier.idealLabel}</h4>
              <ul className="ss-pri-tier__list" data-tone="muted">
                {tier.idealFor.map((item) => (
                  <li key={item}>
                    <span className="ss-pri-tier__dot" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {tier.featured ? <BorderBeam /> : null}
          </PanelReveal>
        ))}
      </div>

      <Reveal kind="section" delayMs={160}>
        <div className="ss-pri-reconcile">
          <div className="ss-pri-reconcile__head">
            <span className="ss-pri-reconcile__eyebrow">Where the bands meet</span>
            <p className="ss-pri-reconcile__lead">
              The tiers overlap on purpose. Here is where most projects actually land.
            </p>
          </div>

          <ol className="ss-pri-ladder">
            {BAND_LADDER.map((stop, index) => (
              <li
                className="ss-pri-ladder__stop"
                data-emphasis={stop.emphasis ? "true" : undefined}
                key={stop.point}
                style={{ "--pri-i": index } as PricingCssVars}
              >
                <span className="ss-pri-ladder__node" aria-hidden="true" />
                <span className="ss-pri-ladder__point">{stop.point}</span>
                <span className="ss-pri-ladder__label">{stop.label}</span>
                {stop.emphasis ? (
                  <span className="ss-pri-ladder__flag">Most SMEs land here</span>
                ) : null}
              </li>
            ))}
          </ol>

          <details className="ss-pri-disclosure">
            <summary className="ss-pri-disclosure__summary">
              <InfoIcon aria-hidden="true" className="ss-pri-disclosure__icon" />
              <span className="ss-pri-disclosure__label">Pricing disclosure</span>
              <span className="ss-pri-disclosure__hint">Read the fine print</span>
              <ChevronDown aria-hidden="true" className="ss-pri-disclosure__chevron" />
            </summary>
            <p className="ss-pri-disclosure__body">{PAGE_PRICING_DISCLOSURE}</p>
          </details>
        </div>
      </Reveal>
    </>
  );
}
