/**
 * Small adapters between the industries content contracts and the shared
 * services-v2 section components.
 */
import type { ApprovedCopyCard } from "~/content/services/approved-services";
import type { FaqItem } from "~/features/services-v2/content/service-content";

import type {
  IndustryCard,
  IndustryFaq,
  IndustryMetric,
  IndustryStage,
} from "../content/types";

/**
 * Formats a verified metric for the benchmark console / signature strips as
 * "value — label (basis)". The value itself is never altered.
 */
export function formatMetrics(metrics: IndustryMetric[]): string[] {
  return metrics.map((metric) => {
    const label = metric.basis ? `${metric.label} (${metric.basis})` : metric.label;
    return `${metric.value} — ${label}`;
  });
}

export function toCards(items: (IndustryCard | IndustryStage)[]): ApprovedCopyCard[] {
  return items.map((item) => ({ label: item.title, body: item.body }));
}

export function toFaqItems(items: IndustryFaq[]): FaqItem[] {
  return items.map((item) => ({
    label: item.q,
    question: item.q,
    answer: [item.a],
  }));
}
