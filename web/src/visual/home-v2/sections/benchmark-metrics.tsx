import {
  BENCHMARK_DISCLAIMER,
  HEADLINE_BENCHMARKS,
  SECONDARY_BENCHMARKS,
} from "~/data/home-v2";

import { MetricCounter } from "../components/metric-counter";
import { SectionShell } from "../components/section-shell";

type BenchmarkMetricsProps = {
  countersEnabled: boolean;
};

/** Benchmark counters — clearly framed as industry outcomes, not guarantees. */
export function BenchmarkMetrics({ countersEnabled }: BenchmarkMetricsProps) {
  return (
    <SectionShell
      eyebrow="Benchmarks"
      title={
        <>
          The numbers good automation <span className="ss-chrome-text">moves</span>.
        </>
      }
      lead="Outcomes observed across well-scoped AI automation engagements and published industry data."
      containerSize="wide"
    >
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HEADLINE_BENCHMARKS.map((metric) => (
          <MetricCounter
            key={metric.id}
            metric={metric}
            countersEnabled={countersEnabled}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECONDARY_BENCHMARKS.map((metric) => (
          <MetricCounter
            key={metric.id}
            metric={metric}
            countersEnabled={countersEnabled}
          />
        ))}
      </div>
      <p className="mt-8 max-w-(--ss-type-measure-body) text-xs text-[color:var(--ss-v2-titanium)]">
        {BENCHMARK_DISCLAIMER}
      </p>
    </SectionShell>
  );
}
