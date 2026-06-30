import rawBenchmarkMetrics from "~/data/generated/benchmark-metrics.json";

export type BenchmarkMetric = {
  id: string;
  auditDate: string;
  pageTitle: string;
  pageType: string;
  metricName: string;
  metricValueRaw: string;
  numericValueLow: number | null;
  numericValueHigh: number | null;
  unit: string;
  timeBasis: string;
  fullClaimText: string;
  impactArea: string;
};

export const benchmarkDisclaimer =
  "Benchmark outcomes drawn from published case data across AI automation engagements and industry sources. Figures illustrate what well-scoped automation can achieve; they are not guarantees of individual results.";

export const benchmarkMetrics = rawBenchmarkMetrics as BenchmarkMetric[];

export function metricsForPageTitle(pageTitle: string): BenchmarkMetric[] {
  return benchmarkMetrics.filter((metric) => metric.pageTitle === pageTitle);
}

export function selectMetrics(
  pageTitle: string,
  metricNames: string[],
): BenchmarkMetric[] {
  const metrics = metricsForPageTitle(pageTitle);
  return metricNames.flatMap((metricName) => {
    const metric = metrics.find((candidate) => candidate.metricName === metricName);
    return metric ? [metric] : [];
  });
}
