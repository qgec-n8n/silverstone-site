/**
 * /pricing FAQ — the single source for both the visible accordion
 * (`~/features/core-pages/pricing/pricing-faq.tsx`) and the FAQPage entry the
 * route's JSON-LD graph emits (`~/seo/schema.ts`).
 *
 * It lives in `data/` rather than beside the composition on purpose: the
 * schema graph is built by the eagerly-loaded route frame, so importing the
 * lazily-code-split pricing feature module there would drag the whole page's
 * copy into shared foundation code.
 *
 * Answers are deliberately plain prose with no rich-text markers — Google
 * requires the structured data to match the visible answer exactly, and the
 * accordion renders these same strings verbatim.
 */
export type PricingFaqItem = {
  question: string;
  answer: string;
};

export const PRICING_FAQ: readonly PricingFaqItem[] = [
  {
    question: "How much does AI automation cost for a UK SME?",
    answer:
      "Most sensible projects start with a focused pilot from £3,000 plus VAT. Wider implementations typically sit between £10,000 and £25,000 plus VAT, depending on integrations, data quality, testing, training and support needs.",
  },
  {
    question: "What changes the quote?",
    answer:
      "The biggest cost drivers are the number of systems involved, whether the tools have clean APIs, how much data clean-up is needed, how sensitive the workflow is, and how much testing, documentation and training your team requires.",
  },
  {
    question: "Are there any long-term contracts?",
    answer:
      "Standard support retainers run on monthly rolling agreements and can be cancelled with 30 days’ notice. Bespoke enterprise SLAs or fixed-term programmes are agreed separately in writing.",
  },
  {
    question: "What’s included in the monthly retainer?",
    answer:
      "Monitoring, maintenance, priority support and regular optimisation reviews. Relevant plans can also include employee training, reporting, enhancement work and defined response times.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes. Larger projects can be divided into milestone-based payments spread across the implementation timeline.",
  },
  {
    question: "What happens after the project is delivered?",
    answer:
      "You receive the agreed documentation, training and handover materials. You can then manage the system internally, select ongoing Silverstone support or agree a separate enhancement roadmap.",
  },
  {
    question: "Are there any hidden costs?",
    answer:
      "No. We provide written quotes with clear deliverables, assumptions and exclusions. Any third-party software, API, telephony, hosting or usage costs are discussed upfront.",
  },
];
