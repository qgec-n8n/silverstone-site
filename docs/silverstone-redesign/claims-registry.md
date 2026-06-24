# Claims Registry — V2 Homepage Metrics

Every figure shown on the homepage is a **benchmark / industry outcome**, not a
guaranteed Silverstone result. Source = the published service-page performance
audit (`attached_assets/silverstone_ai_agency_performance_metrics_*.csv`,
audit date 2026-06-23). The on-page disclaimer is mandatory:

> _Benchmark outcomes drawn from published case data across AI automation
> engagements and industry sources. Figures illustrate what well-scoped
> automation can achieve — they are not guarantees of individual results._

## Headline counters

| Display | Label | Impact area | Audit source page |
| --- | --- | --- | --- |
| 15 hrs | Saved every week | Time saved | AI Agents & Automation Workflows |
| <10s | First response time | Response time | AI Voice Agents |
| 850% | Conversion uplift | Conversion | Web Development |
| 65% | Lower processing cost | Cost efficiency | AI Agents & Automation Workflows |

## Secondary band

| Display | Label | Impact area | Audit source page |
| --- | --- | --- | --- |
| 167% | Patient & lead growth | Lead generation | Physios and Chiropractors |
| 24/7 | Always answering | Availability | AI Receptionists |
| 1,200% | Peak reported ROI | ROI | AI Agents & Automation Workflows |
| £100k → £300k | Revenue trajectory | Revenue | AI Automation for Dentists |

## Framing rules

1. Section heading and counter context label these as **benchmarks / industry
   outcomes**, never "our results" or "guaranteed".
2. The disclaimer string is owned by `BENCHMARK_DISCLAIMER` in
   `web/src/data/home-v2/benchmarks.ts` and must render with the counters.
3. The highest figure (1,200% ROI) is explicitly framed as a **peak/upper-end**
   reported value, not a typical outcome.
4. The revenue figure is labelled **illustrative** trajectory over 24 months.
5. No client names, logos or fabricated testimonials are used as proof.

## Data provenance

- Audit covers 129 metric rows across 13 service/industry pages.
- The homepage surfaces a curated 8-figure subset spanning Time saved, Response
  time, Conversion, Cost efficiency, Lead generation, Availability, ROI and
  Revenue — chosen for credibility and breadth, not maximum headline numbers.
