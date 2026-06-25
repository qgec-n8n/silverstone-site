/**
 * Industry benchmark outcomes surfaced on the V2 homepage metrics section.
 *
 * IMPORTANT FRAMING: every figure here is a *benchmark / industry outcome*
 * drawn from the published Silverstone service-page audit (June 2026) and the
 * automation outcomes reported across engagements — NOT a guaranteed result for
 * any individual client. The UI must present these as benchmarks; the soft
 * framing stays visible alongside the counters, and the precise `disclaimer`
 * below is surfaced through an accessible disclosure (details/summary) so the
 * provenance is always reachable without crowding the section.
 *
 * Source rows live in the audit CSV and are catalogued in
 * `docs/silverstone-redesign/claims-registry.md`.
 */

export type BenchmarkTier = "headline" | "secondary";

export type BenchmarkMetric = {
  id: string;
  /** Numeric target the counter animates toward. */
  value: number;
  /** Lower bound when the metric expresses a range (e.g. revenue trajectory). */
  fromValue?: number;
  prefix?: string;
  suffix?: string;
  /** Overrides the composed counter output for non-numeric figures. */
  display?: string;
  decimals?: number;
  label: string;
  context: string;
  impactArea: string;
  /** Audit source page the figure was observed on. */
  source: string;
  tier: BenchmarkTier;
};

export const BENCHMARK_DISCLAIMER =
  "Benchmark outcomes drawn from published case data across AI automation engagements and industry sources. Figures illustrate what well-scoped automation can achieve — they are not guarantees of individual results.";

export const HEADLINE_BENCHMARKS: readonly BenchmarkMetric[] = [
  {
    id: "time-saved",
    value: 15,
    suffix: " hrs",
    label: "Saved every week",
    context:
      "Typical operational time returned once calls, follow-up and admin are automated.",
    impactArea: "Time saved",
    source: "AI Agents & Automation Workflows",
    tier: "headline",
  },
  {
    id: "response-time",
    value: 10,
    prefix: "<",
    suffix: "s",
    display: "<10s",
    label: "First response time",
    context:
      "Speed an AI front desk answers enquiries, day or night, before a lead cools.",
    impactArea: "Response time",
    source: "AI Voice Agents",
    tier: "headline",
  },
  {
    id: "conversion",
    value: 850,
    suffix: "%",
    label: "Conversion uplift",
    context:
      "Calculated average conversion increase reported after rebuilding the booking journey.",
    impactArea: "Conversion",
    source: "Web Development",
    tier: "headline",
  },
  {
    id: "cost-reduction",
    value: 65,
    suffix: "%",
    label: "Lower processing cost",
    context: "Document and back-office processing cost removed by agentic workflows.",
    impactArea: "Cost efficiency",
    source: "AI Agents & Automation Workflows",
    tier: "headline",
  },
] as const;

export const SECONDARY_BENCHMARKS: readonly BenchmarkMetric[] = [
  {
    id: "lead-growth",
    value: 167,
    suffix: "%",
    label: "Patient & lead growth",
    context: "Enquiry growth seen when capture and follow-up never miss.",
    impactArea: "Lead generation",
    source: "Physios and Chiropractors",
    tier: "secondary",
  },
  {
    id: "availability",
    value: 24,
    display: "24/7",
    label: "Always answering",
    context:
      "Coverage across calls, chat and messaging — no voicemail, no missed window.",
    impactArea: "Availability",
    source: "AI Receptionists",
    tier: "secondary",
  },
  {
    id: "roi-peak",
    value: 1200,
    suffix: "%",
    label: "Peak reported ROI",
    context: "Upper end of return reported across mature automation programmes.",
    impactArea: "ROI",
    source: "AI Agents & Automation Workflows",
    tier: "secondary",
  },
  {
    id: "revenue-trajectory",
    fromValue: 100,
    value: 300,
    prefix: "£",
    suffix: "k",
    display: "£100k → £300k",
    label: "Revenue trajectory",
    context:
      "Illustrative practice revenue path — roughly £100k to £300k, a threefold trajectory over 24 months of compounding automation.",
    impactArea: "Revenue",
    source: "AI Automation for Dentists",
    tier: "secondary",
  },
] as const;

export const ALL_BENCHMARKS: readonly BenchmarkMetric[] = [
  ...HEADLINE_BENCHMARKS,
  ...SECONDARY_BENCHMARKS,
];
