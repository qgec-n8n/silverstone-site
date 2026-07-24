/**
 * /pricing — the commercial value section.
 *
 * The reference design's ROI arithmetic did not reconcile, so the numbers here
 * are a corrected, internally consistent worked example (see `ROI_MODEL` for
 * the check) and are labelled "Illustrative model" in the frame itself rather
 * than in a footnote a reader can miss. The figures are static text on purpose:
 * a count-up on a four-step calculation makes it harder, not easier, to verify.
 */
import {
  Clock,
  ClipboardCheck,
  ShieldCheck,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "~/components/icons/lucide";
import {
  PanelReveal,
  Reveal,
  RevealGroup,
} from "~/features/services-v2/components/primitives";

/** One metaphor per value, in the order VALUE_BEYOND_SAVINGS declares them. */
const BEYOND_ICONS: readonly LucideIcon[] = [Zap, TrendingUp, Smile, ShieldCheck];

/** One spectral hue per value, so the four benefits read as distinct. */
const BEYOND_ACCENTS = [
  "var(--ss-v2-signal-cyan)",
  "var(--ss-v2-azure)",
  "var(--ss-v2-orchid)",
  "var(--ss-v2-rose)",
] as const;

/** Break-even, tracking, pilot proof, human review. */
const PROOF_ICONS: readonly LucideIcon[] = [Clock, Target, Sparkles, ClipboardCheck];

const PROOF_ACCENTS = [
  "var(--ss-v2-aqua)",
  "var(--ss-v2-sky)",
  "var(--ss-v2-ultraviolet)",
  "var(--ss-v2-orchid)",
] as const;

import {
  ROI_MODEL,
  ROI_MODEL_NOTE,
  VALUE_BEYOND_SAVINGS,
  VALUE_PROOF_CARDS,
  type PricingCssVars,
} from "./pricing-content";

export function PricingValueModel() {
  return (
    <div className="ss-pri-value">
      <div className="ss-pri-value__grid">
        <PanelReveal className="ss-pri-panel ss-pri-roi">
          <div className="ss-pri-panel__head">
            <h3 className="ss-pri-panel__title">ROI calculation example</h3>
            <span className="ss-pri-panel__tag" data-tone="warn">
              Illustrative model
            </span>
          </div>

          <ol className="ss-pri-roi__steps">
            {ROI_MODEL.map((step, index) => (
              <li
                data-emphasis={step.emphasis ? "true" : undefined}
                key={step.title}
                style={{ "--pri-i": index } as PricingCssVars}
              >
                <span className="ss-pri-roi__step-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4>{step.title}</h4>
                <p className="ss-pri-roi__figure">
                  <span className="ss-pri-roi__figure-value">{step.figure}</span>
                  <span className="ss-pri-roi__figure-unit">{step.unit}</span>
                </p>
                <p className="ss-pri-roi__note">{step.body}</p>
              </li>
            ))}
          </ol>

          <p className="ss-pri-footnote" data-align="tight">
            {ROI_MODEL_NOTE}
          </p>
        </PanelReveal>

        <div className="ss-pri-value__beyond">
          <Reveal kind="section">
            <h3 className="ss-pri-subhead">Value beyond cost savings</h3>
          </Reveal>
          {/* A RevealGroup rendered AS the `ul`, so all four benefits arrive
              together once in view; roles restored explicitly since `Reveal`
              renders a div between the list and its items. */}
          <RevealGroup as="ul" className="ss-pri-beyond__list" role="list">
            {VALUE_BEYOND_SAVINGS.map((item, index) => {
              const Icon = BEYOND_ICONS[index] ?? TrendingUp;
              return (
                <Reveal key={item.title} kind="card" delayMs={index * 90}>
                  <li
                    className="ss-pri-beyond__item"
                    role="listitem"
                    style={{ "--pri-accent": BEYOND_ACCENTS[index] } as PricingCssVars}
                  >
                    <span className="ss-pri-beyond__marker" aria-hidden="true">
                      <Icon />
                    </span>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.body}</p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </RevealGroup>
        </div>
      </div>

      <RevealGroup className="ss-pri-value__cards">
        {VALUE_PROOF_CARDS.map((card, index) => {
          const Icon = PROOF_ICONS[index] ?? Sparkles;
          return (
            <Reveal
              className="ss-pri-proofcard"
              delayMs={index * 90}
              key={card.value}
              kind="metric"
            >
              <span
                className="ss-pri-proofcard__icon"
                aria-hidden="true"
                style={{ "--pri-accent": PROOF_ACCENTS[index] } as PricingCssVars}
              >
                <Icon />
              </span>
              <span
                className="ss-pri-proofcard__value"
                style={{ "--pri-accent": PROOF_ACCENTS[index] } as PricingCssVars}
              >
                {card.value}
              </span>
              <span className="ss-pri-proofcard__label">{card.label}</span>
            </Reveal>
          );
        })}
      </RevealGroup>
    </div>
  );
}
