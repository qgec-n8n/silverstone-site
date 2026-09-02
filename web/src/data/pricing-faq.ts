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
 * Answers are plain prose apart from currency pairs (`[[£3,000|$3,900]]`,
 * see `~/data/currency`). Google requires the structured data to match the
 * visible answer, so the schema builder reduces each pair to the same
 * "£3,000 / $3,900" text a crawler reads from the rendered accordion.
 */
import { money, perCurrency } from "~/data/currency";

export type PricingFaqItem = {
  question: string;
  answer: string;
};

export const PRICING_FAQ: readonly PricingFaqItem[] = [
  {
    question: "How much does AI automation cost for a small business?",
    answer: `Most sensible projects start with a focused pilot from ${money("£3,000")} plus ${perCurrency("VAT", "applicable sales tax")}. Wider implementations typically sit between ${money("£10,000")} and ${money("£25,000")}, depending on integrations, data quality, testing, training and support needs. US and UK clients pay the same published bands; USD figures are fixed pairs reviewed quarterly.`,
  },
  {
    question: "What changes the quote?",
    answer:
      "The biggest cost drivers are the number of systems involved, whether the tools have clean APIs, how much data clean-up is needed, how sensitive the workflow is, and how much testing, documentation and training your team requires.",
  },
  {
    question: "Are there any long-term contracts?",
    answer:
      "Standard support retainers run on monthly rolling agreements and can be canceled with 30 days’ notice. Custom enterprise SLAs or fixed-term programs are agreed separately in writing.",
  },
  {
    question: "What’s included in the monthly retainer?",
    answer:
      "Monitoring, maintenance, priority support and regular optimization reviews. Relevant plans can also include employee training, reporting, enhancement work and defined response times.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes. Larger projects can be divided into milestone-based payments spread across the implementation timeline.",
  },
  {
    question: "Do you work with US businesses, and can you invoice in dollars?",
    answer:
      "Yes. Silverstone AI works with clients in the United States and the United Kingdom from its London studio, with US-based team members covering US business hours. Proposals are quoted and invoiced in GBP or USD, whichever is agreed at proposal, and Stripe card payments settle in either currency.",
  },
  {
    question: "What happens after the project is delivered?",
    answer:
      "You receive the agreed documentation, training and handover materials. You can then manage the system internally, select ongoing Silverstone AI support or agree a separate enhancement roadmap.",
  },
  {
    question: "Are there any hidden costs?",
    answer:
      "No. We provide written quotes with clear deliverables, assumptions and exclusions. Any third-party software, API, telephony, hosting or usage costs are discussed upfront.",
  },
];
