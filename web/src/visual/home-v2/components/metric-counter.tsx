import { useState } from "react";

import type { BenchmarkMetric } from "~/data/home-v2";

import { useCountUp } from "../hooks/use-count-up";
import { Reveal } from "./reveal";

type MetricCounterProps = {
  countersEnabled: boolean;
  delayMs?: number;
  metric: BenchmarkMetric;
};

function formatNumber(value: number, decimals: number): string {
  return value.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * A single benchmark figure. Numeric metrics count up once in view; metrics with
 * a fixed `display` string (e.g. "<10s", "24/7", ranges) render statically. The
 * count-up is fully disabled under the minimal tier / reduced motion.
 */
export function MetricCounter({
  countersEnabled,
  delayMs = 0,
  metric,
}: MetricCounterProps) {
  const [revealed, setRevealed] = useState(false);
  const hasFixedDisplay = metric.display !== undefined;
  const decimals = metric.decimals ?? 0;

  const animated = useCountUp({
    value: metric.value,
    from: metric.fromValue ?? 0,
    enabled: countersEnabled && !hasFixedDisplay,
    active: revealed,
    decimals,
  });

  const composed = hasFixedDisplay
    ? metric.display
    : `${metric.prefix ?? ""}${formatNumber(animated, decimals)}${metric.suffix ?? ""}`;

  return (
    <Reveal delayMs={delayMs} kind="metric" onReveal={() => setRevealed(true)}>
      <article data-tier={metric.tier} className="ss-hv2-metric">
        <p className="ss-hv2-metric__value text-[color:var(--ss-v2-platinum)]">
          {composed}
        </p>
        <p className="ss-hv2-metric__label">{metric.label}</p>
        <p className="ss-hv2-metric__context">{metric.context}</p>
        <p className="ss-hv2-metric__source">Benchmark · {metric.source}</p>
      </article>
    </Reveal>
  );
}
