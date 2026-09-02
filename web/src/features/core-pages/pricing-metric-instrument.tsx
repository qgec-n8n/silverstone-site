/**
 * Custom verified-results instrument for /pricing — the one page where
 * benchmark figures may run to two rows. Explicitly laid out as three cells
 * above and two centered below (not a generic auto-fit grid), with every
 * value's font size resolved against its own cell width via a container
 * query, so no figure can ever overflow or wrap internally regardless of how
 * long the string is ("£16,800.00" vs "15 hours/week").
 */
import { ShieldCheck } from "~/components/icons/lucide";
import {
  AnimatedMetricValue,
  BorderBeam,
  PanelReveal,
  Reveal,
  splitMetric,
} from "~/features/services-v2/components/primitives";

export function PricingMetricInstrument({
  metrics,
  caption,
  clarification,
}: {
  metrics: string[];
  caption: string;
  clarification: string;
}) {
  return (
    <PanelReveal className="ss-core-metric-instrument ss-srv2-beam-border">
      <Reveal kind="pill">
        <span className="ss-srv2-bench__tag">
          <ShieldCheck aria-hidden="true" />
          Verified Silverstone AI performance
        </span>
      </Reveal>
      <div className="ss-core-metric-instrument__grid">
        {metrics.map((metric, index) => {
          const { value, label } = splitMetric(metric);
          return (
            <Reveal
              key={metric}
              kind="metric"
              delayMs={150 + index * 110}
              className="ss-core-metric-instrument__cell"
            >
              <div
                className="ss-core-metric-instrument__value-stage"
                data-long={value.replace(/[£$,.]/g, "").length > 5 ? "true" : undefined}
              >
                <span className="ss-core-metric-instrument__value">
                  <AnimatedMetricValue value={value} />
                </span>
              </div>
              {label ? (
                <span className="ss-core-metric-instrument__label">{label}</span>
              ) : null}
            </Reveal>
          );
        })}
      </div>
      <Reveal kind="section" delayMs={150 + metrics.length * 110 + 100}>
        <p className="ss-srv2-bench__caption">{caption}</p>
      </Reveal>
      <Reveal kind="section" delayMs={150 + metrics.length * 110 + 200}>
        <p className="ss-srv2-bench__disclaimer">{clarification}</p>
      </Reveal>
      <BorderBeam />
    </PanelReveal>
  );
}
