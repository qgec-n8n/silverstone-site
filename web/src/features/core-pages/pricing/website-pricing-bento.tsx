/**
 * /pricing — website design and development.
 *
 * Replaces the static four-tile bento with an interactive tier explorer: a
 * segmented control drives one large premium spec card that crossfades between
 * Foundation → Professional → Growth → Enterprise. Every tier's full detail
 * (price, band, payment terms, maintenance pairing) is rendered for all four
 * panels at once and merely crossfaded, never conditionally mounted — the
 * page's published figures must survive in the prerendered HTML for the crawler
 * and the served-figures test, exactly like the FAQ accordion below it.
 *
 * The explorer is wrapped in a single `PanelReveal` so the page-band meters
 * inherit the shared `data-panel-shown` fill (and its reduced-motion settle)
 * without each panel needing its own reveal.
 *
 * Hosting, the maintenance ladder and the pricing disclosure follow as their
 * own quieter blocks — the disclosure collapsed into a native `<details>` so it
 * reads as fine print a reader can open, not a wall of grey.
 */
import { useRef, useState, type KeyboardEvent } from "react";

import {
  ChevronDown,
  Globe,
  InfoIcon,
  Monitor,
  Wrench,
} from "~/components/icons/lucide";
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
import { Money } from "~/components/ui/money";

/** Upper bound of the shared page scale every band meter is drawn against. */
const PAGE_SCALE_MAX = 100;

/** One spectral hue per build tier, ascending cool → violet. */
const TIER_ACCENTS = [
  "var(--ss-v2-aqua)",
  "var(--ss-v2-signal-cyan)",
  "var(--ss-v2-azure)",
  "var(--ss-v2-orchid)",
] as const;

export function WebsitePricingBento() {
  // Foundation is the server-rendered default; all four panels ship regardless.
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = WEBSITE_TIERS.length;
    let next = index;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (index + 1) % count;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (index - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="ss-pri-web">
      <PanelReveal className="ss-pri-tierx">
        <div
          className="ss-pri-tierx__seg"
          role="tablist"
          aria-label="Website build tiers"
        >
          {WEBSITE_TIERS.map((tier, index) => (
            <button
              aria-controls={`webtier-panel-${tier.id}`}
              aria-selected={active === index}
              className="ss-pri-tierx__seg-btn"
              data-active={active === index ? "true" : undefined}
              id={`webtier-tab-${tier.id}`}
              key={tier.id}
              onClick={() => {
                setActive(index);
              }}
              onKeyDown={(event) => {
                onTabKeyDown(event, index);
              }}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              role="tab"
              style={{ "--pri-accent": TIER_ACCENTS[index] } as PricingCssVars}
              tabIndex={active === index ? 0 : -1}
              type="button"
            >
              <span className="ss-pri-tierx__seg-name">{tier.title}</span>
              <span className="ss-pri-tierx__seg-band">{tier.band}</span>
            </button>
          ))}
        </div>

        <div className="ss-pri-tierx__stage">
          {WEBSITE_TIERS.map((tier, index) => (
            <article
              aria-hidden={active === index ? undefined : "true"}
              aria-labelledby={`webtier-tab-${tier.id}`}
              className="ss-pri-tierx__panel"
              data-active={active === index ? "true" : undefined}
              id={`webtier-panel-${tier.id}`}
              key={tier.id}
              role="tabpanel"
              style={{ "--pri-accent": TIER_ACCENTS[index] } as PricingCssVars}
              tabIndex={active === index ? 0 : -1}
            >
              <div className="ss-pri-tierx__panel-head">
                <div>
                  <span className="ss-pri-tierx__panel-eyebrow">
                    {tier.band} · website
                  </span>
                  <h3 className="ss-pri-tierx__panel-title">{tier.title}</h3>
                </div>
                <p className="ss-pri-tierx__price">
                  <span className="ss-pri-tierx__price-value">
                    <Money text={tier.price} />
                  </span>
                  <span className="ss-pri-tierx__price-note">{tier.priceNote}</span>
                </p>
              </div>

              <p className="ss-pri-tierx__desc">{tier.description}</p>

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
                  <span>1 page</span>
                  <span>100+ pages</span>
                </span>
              </div>

              <dl className="ss-pri-tierx__meta">
                <div>
                  <dt>Payment</dt>
                  <dd>
                    <Money text={tier.payment} />
                  </dd>
                </div>
                <div className="ss-pri-tierx__maint">
                  <dt>Optional maintenance</dt>
                  <dd>
                    <span className="ss-pri-tierx__maint-name">
                      {tier.maintenance.name}
                    </span>
                    <span className="ss-pri-tierx__maint-price">
                      <Money text={tier.maintenance.price} />
                    </span>
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </PanelReveal>

      <PanelReveal className="ss-pri-hosting" delayMs={120}>
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
          {HOSTING_OPTIONS.map((option, index) => (
            <li key={option.title} style={{ "--pri-i": index } as PricingCssVars}>
              <span className="ss-pri-hosting__marker" aria-hidden="true">
                {option.title.startsWith("Self-hosting") ? <Wrench /> : <Monitor />}
              </span>
              <h4>{option.title}</h4>
              <p className="ss-pri-hosting__price">
                <Money text={option.price} />
              </p>
              <p className="ss-pri-hosting__body">{option.body}</p>
            </li>
          ))}
        </ul>

        <p className="ss-pri-footnote" data-align="tight">
          {HOSTING_NOTE}
        </p>
      </PanelReveal>

      <Reveal kind="section" delayMs={120}>
        <p className="ss-pri-maint__intro">{MAINTENANCE_NOTE}</p>
      </Reveal>

      {/* Roles restored explicitly: `Reveal` renders a div between the list
          and its items. */}
      <ul className="ss-pri-maint" role="list">
        {MAINTENANCE_PLANS.map((plan, index) => (
          <Reveal key={plan.name} kind="card" delayMs={index * 90}>
            <li
              className="ss-pri-maint__item"
              role="listitem"
              style={{ "--pri-i": index } as PricingCssVars}
            >
              <p className="ss-pri-maint__price">
                <Money text={plan.price} />
              </p>
              <h4>{plan.name}</h4>
              <p className="ss-pri-maint__body">{plan.body}</p>
            </li>
          </Reveal>
        ))}
      </ul>

      <Reveal kind="section" delayMs={140}>
        <details className="ss-pri-disclosure" data-standalone="true">
          <summary className="ss-pri-disclosure__summary">
            <InfoIcon aria-hidden="true" className="ss-pri-disclosure__icon" />
            <span className="ss-pri-disclosure__label">Website pricing disclosure</span>
            <span className="ss-pri-disclosure__hint">Read the fine print</span>
            <ChevronDown aria-hidden="true" className="ss-pri-disclosure__chevron" />
          </summary>
          <p className="ss-pri-disclosure__body">
            <Money text={WEBSITE_DISCLOSURE} />
          </p>
        </details>
      </Reveal>
    </div>
  );
}
