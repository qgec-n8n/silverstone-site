/**
 * /pricing — what shapes the investment.
 *
 * Two instruments sit beside the cost drivers: a budget-allocation band
 * (15/60/15/10) and a milestone rail (30/50/20). Both animate from CSS off the
 * `data-panel-shown` flag `PanelReveal` already writes, so the fills and nodes
 * inherit the global reveal scheduler's ordering and its deep-link bypass for
 * free — no second animation system, no per-frame JS, and the bars move on
 * `transform: scaleX` rather than width so nothing re-lays-out mid-entrance.
 */
import { Clock, Gauge, Layers, Target } from "~/components/icons/lucide";
import { PanelReveal, Reveal } from "~/features/services-v2/components/primitives";

import {
  BREAKDOWN_INSTRUMENTS,
  COST_DRIVERS,
  HOURLY_RATE_NOTE,
  IMPLEMENTATION_PHASES,
  PAYMENT_MILESTONES,
  type PricingCssVars,
} from "./pricing-content";

const DRIVER_ICONS = [Layers, Gauge, Target, Clock] as const;

export function ImplementationBreakdown() {
  return (
    <div className="ss-pri-breakdown">
      <div className="ss-pri-breakdown__grid">
        <div className="ss-pri-drivers">
          <Reveal kind="section">
            <h3 className="ss-pri-subhead">What determines implementation cost?</h3>
          </Reveal>
          {/* `Reveal` renders a div, so the implicit list semantics between the
              ol and its items are restored explicitly. */}
          <ol className="ss-pri-drivers__list" role="list">
            {COST_DRIVERS.map((driver, index) => {
              const Icon = DRIVER_ICONS[index] ?? Layers;
              return (
                <Reveal key={driver.title} kind="card" delayMs={index * 110}>
                  <li className="ss-pri-driver" role="listitem">
                    <span className="ss-pri-driver__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="ss-pri-driver__index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="ss-pri-driver__copy">
                      <h4>{driver.title}</h4>
                      <p>{driver.body}</p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>

        <div className="ss-pri-breakdown__instruments">
          <PanelReveal className="ss-pri-panel ss-pri-alloc">
            <div className="ss-pri-panel__head">
              <h3 className="ss-pri-panel__title">Implementation phases</h3>
              <span className="ss-pri-panel__tag">Budget allocation</span>
            </div>

            <div
              className="ss-pri-alloc__band"
              role="img"
              aria-label="Budget allocation: discovery and planning 15 per cent, development and integration 60 per cent, testing and deployment 15 per cent, training and handover 10 per cent."
            >
              {IMPLEMENTATION_PHASES.map((phase, index) => (
                <span
                  className="ss-pri-alloc__segment"
                  key={phase.title}
                  style={
                    { "--pri-share": phase.share, "--pri-i": index } as PricingCssVars
                  }
                >
                  <span className="ss-pri-alloc__fill" />
                </span>
              ))}
            </div>

            <ul className="ss-pri-alloc__legend">
              {IMPLEMENTATION_PHASES.map((phase, index) => (
                <li key={phase.title} style={{ "--pri-i": index } as PricingCssVars}>
                  <span className="ss-pri-alloc__swatch" aria-hidden="true" />
                  <span className="ss-pri-alloc__name">{phase.title}</span>
                  <span className="ss-pri-alloc__share">{phase.share}% of budget</span>
                </li>
              ))}
            </ul>
          </PanelReveal>

          <PanelReveal className="ss-pri-panel ss-pri-milestones" delayMs={120}>
            <div className="ss-pri-panel__head">
              <h3 className="ss-pri-panel__title">Payment structure</h3>
              <span className="ss-pri-panel__tag">Staged</span>
            </div>

            <ol className="ss-pri-milestones__rail">
              {PAYMENT_MILESTONES.map((milestone, index) => (
                <li
                  key={milestone.title}
                  style={{ "--pri-i": index } as PricingCssVars}
                >
                  <span className="ss-pri-milestones__node" aria-hidden="true" />
                  <span className="ss-pri-milestones__name">{milestone.title}</span>
                  <span className="ss-pri-milestones__share">{milestone.share}%</span>
                </li>
              ))}
            </ol>
          </PanelReveal>
        </div>
      </div>

      <div className="ss-pri-instruments">
        {BREAKDOWN_INSTRUMENTS.map((instrument, index) => (
          <Reveal
            className="ss-pri-instrument"
            delayMs={index * 120}
            key={instrument.value}
            kind="metric"
          >
            <span className="ss-pri-instrument__value">{instrument.value}</span>
            <span className="ss-pri-instrument__label">{instrument.label}</span>
            <span className="ss-pri-instrument__note">{instrument.note}</span>
          </Reveal>
        ))}
      </div>

      <Reveal kind="section" delayMs={140}>
        <p className="ss-pri-footnote">{HOURLY_RATE_NOTE}</p>
      </Reveal>
    </div>
  );
}
