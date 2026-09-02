/**
 * /pricing secondary-hero instrument — replaces the ScopeLedgerSignature bar
 * chart that argued the page's old "no public price" position.
 *
 * Deliberately built from real DOM rather than the SVG diagram every other
 * core-page signature uses: these are the page's headline prices, so they have
 * to be selectable text a crawler and a screen reader both read as prices, not
 * `<text>` nodes inside a `role="img"` container. The surrounding console
 * chrome (status bar, corner brackets, scan sweep, instrument grid, metric
 * strip) is the shared signature language, so the panel still reads as part of
 * the same system as the other six routes.
 *
 * Motion: rows resolve on mount (the hero is sized to one viewport, so
 * `whileInView` would be the wrong trigger — see `Reveal`'s `trigger` prop),
 * and a single calibration marker travels pilot → implementation → support and
 * back on a slow CSS ping-pong. Both stop under reduced motion; the marker is a
 * transform on one small element, so the loop stays on the compositor.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

import { CurrencyToggle } from "~/components/ui/currency-toggle";
import { plainCurrencyText } from "~/data/currency";
import { RichText } from "~/features/services-v2/components/primitives";

import {
  PRICING_MODEL_BEST_STEP,
  PRICING_MODEL_PROOF,
  PRICING_MODEL_ROWS,
} from "./pricing-content";

/** Clears the hero's own showcase reveal (560ms base + 220ms + settle). */
const ROW_BASE_DELAY = 1000;

const ROW_ARIA_LABEL = plainCurrencyText(
  `Pricing model overview. ${PRICING_MODEL_ROWS.map((row) => `${row.title}: ${row.prefix ? `${row.prefix} ` : ""}${row.value}${row.suffix ? ` ${row.suffix}` : ""}.`).join(" ")} Best first step: one workflow pilot.`,
);

export function PricingModelOverviewSignature() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="ss-srv2-signature ss-core-sig ss-pri-model"
      role="group"
      aria-label={ROW_ARIA_LABEL}
    >
      <SignatureStatusBar label="Pricing model overview" />

      <div className="ss-pri-model__stage">
        <p className="ss-pri-model__caption">Scope band / indicative investment</p>

        <div className="ss-pri-model__rows">
          {reducedMotion ? null : (
            <span className="ss-pri-model__marker" aria-hidden="true" />
          )}
          <dl className="ss-pri-model__list">
            {PRICING_MODEL_ROWS.map((row, index) => {
              const content = (
                <>
                  <dt className="ss-pri-model__name">{row.title}</dt>
                  <dd className="ss-pri-model__figure">
                    {row.prefix ? (
                      <span className="ss-pri-model__prefix">{row.prefix}</span>
                    ) : null}
                    <span className="ss-pri-model__value">
                      <RichText text={row.value} />
                    </span>
                    {row.suffix ? (
                      <span className="ss-pri-model__suffix">{row.suffix}</span>
                    ) : null}
                  </dd>
                </>
              );

              if (reducedMotion) {
                return (
                  <div className="ss-pri-model__row" key={row.title}>
                    {content}
                  </div>
                );
              }

              return (
                <m.div
                  className="ss-pri-model__row"
                  key={row.title}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: (ROW_BASE_DELAY + index * 130) / 1000,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {content}
                </m.div>
              );
            })}
          </dl>
        </div>

        <div className="ss-pri-model__best">
          <span className="ss-pri-model__best-label">
            {PRICING_MODEL_BEST_STEP.label}
          </span>
          <strong className="ss-pri-model__best-value">
            {PRICING_MODEL_BEST_STEP.value}
          </strong>
        </div>

        <div className="ss-pri-model__currency">
          <CurrencyToggle context="pricing" labeled size="instrument" tone="dark" />
          <p className="ss-pri-model__note">
            USD at fixed pairs, reviewed quarterly. Quoted and invoiced in the currency
            agreed.
          </p>
        </div>

        <p className="ss-pri-model__note">
          24/7 cover applies on Premium and Enterprise retainers.
        </p>
      </div>

      <SignatureMetricStrip metrics={[...PRICING_MODEL_PROOF]} />
      <SignatureChrome />
    </div>
  );
}
