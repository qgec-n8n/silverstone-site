import {
  BENCHMARK_DISCLAIMER,
  HEADLINE_BENCHMARKS,
  SECONDARY_BENCHMARKS,
} from "~/data/home-v2";

import { MetricCounter } from "../components/metric-counter";
import { Reveal } from "../components/reveal";
import { SectionShell } from "../components/section-shell";

type BenchmarkMetricsProps = {
  countersEnabled: boolean;
};

/** Benchmark counters - clearly framed as industry outcomes, not guarantees. */
export function BenchmarkMetrics({ countersEnabled }: BenchmarkMetricsProps) {
  return (
    <SectionShell
      eyebrow="Benchmarks"
      title={
        <>
          The Business Impact of Better{" "}
          <span className="ss-signal-text" data-sig="sky">
            Automation
          </span>
        </>
      }
      lead="Selected automation-performance benchmarks from published case data and industry sources, showing the operational improvements well-designed systems can target. Not guaranteed individual outcomes."
      containerSize="wide"
    >
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HEADLINE_BENCHMARKS.map((metric, index) => (
          <MetricCounter
            key={metric.id}
            metric={metric}
            countersEnabled={countersEnabled}
            delayMs={index * 55}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECONDARY_BENCHMARKS.map((metric, index) => (
          <MetricCounter
            key={metric.id}
            metric={metric}
            countersEnabled={countersEnabled}
            delayMs={240 + index * 55}
          />
        ))}
      </div>
      <Reveal kind="footer">
        <details className="ss-hv2-benchmark-note mt-8 max-w-(--ss-type-measure-body)">
          <summary className="cursor-pointer text-xs font-medium text-[color:var(--ss-v2-titanium)] underline-offset-4 transition-colors hover:text-[color:var(--ss-v2-pearl)]">
            Sources &amp; methodology
          </summary>
          <p className="mt-2 text-xs text-[color:var(--ss-v2-titanium)]">
            {BENCHMARK_DISCLAIMER}
          </p>
        </details>
      </Reveal>
    </SectionShell>
  );
}
