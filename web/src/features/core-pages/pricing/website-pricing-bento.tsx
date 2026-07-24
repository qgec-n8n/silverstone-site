/**
 * /pricing — website design and development, laid out as a mosaic.
 *
 * The bento is CSS `grid-template-areas`, not span utilities: hierarchy
 * (Professional as the tall core tile, Enterprise and hosting as full-width
 * rails) is legible in the stylesheet, and the responsive fallback is simply
 * dropping the areas block so the tiles return to source order — which is
 * already the commercial reading order Foundation → Professional → Growth →
 * Enterprise → hosting.
 *
 * Each build tile carries a page-band meter: a linear 1–100 page scale with the
 * tier's own band lit. It earns its place as information rather than
 * decoration, since page count is exactly what moves a client between tiers.
 */
import { Globe, Monitor, Wrench } from "~/components/icons/lucide";
import { PanelReveal, Reveal } from "~/features/services-v2/components/primitives";

import {
  HOSTING_NOTE,
  HOSTING_OPTIONS,
  MAINTENANCE_NOTE,
  MAINTENANCE_PLANS,
  WEBSITE_DISCLOSURE,
  WEBSITE_TIERS,
  type PricingCssVars,
} from "./pricing-content";

/** Upper bound of the shared page scale every band meter is drawn against. */
const PAGE_SCALE_MAX = 100;

export function WebsitePricingBento() {
  return (
    <div className="ss-pri-web">
      <div className="ss-pri-web__bento">
        {WEBSITE_TIERS.map((tier, index) => (
          <PanelReveal className="ss-pri-webtile" delayMs={index * 120} key={tier.id}>
            <div className="ss-pri-webtile__top">
              <h3 className="ss-pri-webtile__title">{tier.title}</h3>
              <span className="ss-pri-webtile__band">{tier.band}</span>
            </div>

            <div
              className="ss-pri-meter"
              style={
                {
                  "--pri-lo": (tier.bandRange[0] / PAGE_SCALE_MAX) * 100,
                  "--pri-hi": (tier.bandRange[1] / PAGE_SCALE_MAX) * 100,
                } as PricingCssVars
              }
            >
              <span className="ss-pri-meter__track" aria-hidden="true">
                <span className="ss-pri-meter__fill" />
              </span>
              <span className="ss-pri-meter__scale" aria-hidden="true">
                <span>1</span>
                <span>100+ pages</span>
              </span>
            </div>

            <p className="ss-pri-webtile__price">
              <span className="ss-pri-webtile__figure">{tier.price}</span>
              <span className="ss-pri-tier__qualifier">{tier.priceNote}</span>
            </p>

            <p className="ss-pri-webtile__desc">{tier.description}</p>

            <dl className="ss-pri-webtile__meta">
              <div>
                <dt>Payment</dt>
                <dd>{tier.payment}</dd>
              </div>
              <div className="ss-pri-webtile__maint">
                <dt>Optional maintenance</dt>
                <dd>
                  <span className="ss-pri-webtile__maint-name">
                    {tier.maintenance.name}
                  </span>
                  <span className="ss-pri-webtile__maint-price">
                    {tier.maintenance.price}
                  </span>
                </dd>
              </div>
            </dl>
          </PanelReveal>
        ))}

        <PanelReveal className="ss-pri-hosting" delayMs={200}>
          <div className="ss-pri-panel__head">
            <h3 className="ss-pri-panel__title">
              <span className="ss-pri-hosting__icon" aria-hidden="true">
                <Globe />
              </span>
              Hosting and ownership
            </h3>
            <span className="ss-pri-panel__tag">Optional</span>
          </div>

          <ul className="ss-pri-hosting__list">
            {HOSTING_OPTIONS.map((option) => (
              <li key={option.title}>
                <span className="ss-pri-hosting__marker" aria-hidden="true">
                  {option.title.startsWith("Self-hosting") ? <Wrench /> : <Monitor />}
                </span>
                <h4>{option.title}</h4>
                <p className="ss-pri-hosting__price">{option.price}</p>
                <p className="ss-pri-hosting__body">{option.body}</p>
              </li>
            ))}
          </ul>

          <p className="ss-pri-footnote" data-align="tight">
            {HOSTING_NOTE}
          </p>
        </PanelReveal>
      </div>

      <Reveal kind="section" delayMs={120}>
        <p className="ss-pri-footnote">{MAINTENANCE_NOTE}</p>
      </Reveal>

      {/* Roles restored explicitly: `Reveal` renders a div between the list
          and its items. */}
      <ul className="ss-pri-maint" role="list">
        {MAINTENANCE_PLANS.map((plan, index) => (
          <Reveal key={plan.name} kind="card" delayMs={index * 100}>
            <li className="ss-pri-maint__item" role="listitem">
              <h4>{plan.name}</h4>
              <p className="ss-pri-maint__price">{plan.price}</p>
              <p className="ss-pri-maint__body">{plan.body}</p>
            </li>
          </Reveal>
        ))}
      </ul>

      <Reveal kind="section" delayMs={140}>
        <p className="ss-pri-notes__line" data-standalone="true">
          <span className="ss-pri-notes__key">Website pricing disclosure</span>
          {WEBSITE_DISCLOSURE}
        </p>
      </Reveal>
    </div>
  );
}
