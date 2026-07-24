import { describe, expect, it } from "vitest";

import { getFutureRouteByPath } from "~/data/future-routes";
import { PRICING_FAQ } from "~/data/pricing-faq";
import {
  BREAKDOWN_INSTRUMENTS,
  HOSTING_OPTIONS,
  IMPLEMENTATION_PHASES,
  IMPLEMENTATION_TIERS,
  MAINTENANCE_PLANS,
  PAYMENT_MILESTONES,
  ROI_MODEL,
  SUPPORT_TIERS,
  VERIFIED_METRICS,
  WEBSITE_TIERS,
} from "~/features/core-pages/pricing/pricing-content";
import { buildRouteSchemaGraph } from "~/seo/schema";

/**
 * /pricing is the only route that publishes prices, so every published figure
 * is pinned here. A commercial change should have to update this file
 * deliberately, not slip through a refactor.
 */
describe("pricing figures", () => {
  it("publishes the approved implementation bands", () => {
    expect(IMPLEMENTATION_TIERS.map((tier) => tier.price)).toEqual([
      "£2,000–£10,000",
      "£10,000–£50,000",
      "£50,000+",
    ]);
    expect(IMPLEMENTATION_TIERS.filter((tier) => tier.featured)).toHaveLength(1);
    expect(IMPLEMENTATION_TIERS).toHaveLength(3);
  });

  it("publishes the approved support retainer prices", () => {
    expect(SUPPORT_TIERS.map((tier) => `${tier.price} ${tier.priceNote}`)).toEqual([
      "From £350 per month",
      "From £1,250 per month",
      "£10,000+ per month",
    ]);
  });

  it("publishes the approved website build tiers, bands and maintenance pairings", () => {
    expect(WEBSITE_TIERS.map((tier) => tier.price)).toEqual([
      "£1,500",
      "£2,750",
      "£4,750",
      "From £7,500",
    ]);
    expect(WEBSITE_TIERS.map((tier) => tier.band)).toEqual([
      "1–10 pages",
      "11–25 pages",
      "26–50 pages",
      "51–100+ pages",
    ]);
    expect(WEBSITE_TIERS.map((tier) => tier.maintenance.price)).toEqual([
      "£65/month",
      "£125/month",
      "£225/month",
      "Custom quote",
    ]);
    expect(MAINTENANCE_PLANS.map((plan) => plan.price)).toEqual([
      "£65/month",
      "£125/month",
      "£225/month",
      "Custom quote",
    ]);
  });

  it("publishes the approved hosting and handover prices", () => {
    expect(HOSTING_OPTIONS.map((option) => option.price)).toEqual([
      "£15/month",
      "£25/month",
      "£350 one-off",
    ]);
  });

  it("publishes the senior engineer rate and delivery duration", () => {
    expect(BREAKDOWN_INSTRUMENTS.map((instrument) => instrument.value)).toEqual([
      "£500",
      "12 weeks",
      "Measured",
    ]);
  });

  it("keeps the verified benchmark figures unchanged", () => {
    expect([...VERIFIED_METRICS]).toEqual([
      "£16,800.00 — Annual direct cost savings",
      "3.84x — Return on investment",
      "-77% — Reduction in admin time",
      "10+ hours — Saved per person per month",
      "15 hours/week — Time saved",
    ]);
  });
});

describe("pricing instruments", () => {
  it("allocates exactly one budget between the four phases", () => {
    const total = IMPLEMENTATION_PHASES.reduce((sum, phase) => sum + phase.share, 0);
    expect(total).toBe(100);
    expect(IMPLEMENTATION_PHASES.map((phase) => phase.share)).toEqual([15, 60, 15, 10]);
  });

  it("allocates exactly one project fee across the payment milestones", () => {
    const total = PAYMENT_MILESTONES.reduce(
      (sum, milestone) => sum + milestone.share,
      0,
    );
    expect(total).toBe(100);
    expect(PAYMENT_MILESTONES.map((milestone) => milestone.share)).toEqual([
      30, 50, 20,
    ]);
  });

  /**
   * The reference design's worked example did not reconcile. This asserts the
   * corrected one still does, so nobody can edit a single figure in isolation
   * and leave the published sum wrong.
   */
  it("keeps the illustrative ROI arithmetic internally consistent", () => {
    const implementation = 15_000;
    const annualSupport = 4_200;
    const baselineCost = 50_000;
    const removedShare = 0.75;

    const investment = implementation + annualSupport;
    const annualValue = baselineCost * removedShare;
    const netValue = annualValue - investment;
    const breakEvenMonths = investment / (annualValue / 12);

    expect(investment).toBe(19_200);
    expect(annualValue).toBe(37_500);
    expect(netValue).toBe(18_300);
    expect(Math.ceil(breakEvenMonths)).toBe(7);

    const model = ROI_MODEL.map((step) => step.body).join(" ");
    expect(model).toContain("£19,200");
    expect(model).toContain("£37,500");
    expect(model).toContain("£18,300");
    expect(model).toContain("month seven");
    expect(ROI_MODEL.filter((step) => step.emphasis)).toHaveLength(1);
  });
});

describe("pricing copy conventions", () => {
  it("uses en dashes for ranges, never hyphens", () => {
    const ranges = [
      ...IMPLEMENTATION_TIERS.map((tier) => tier.price),
      ...WEBSITE_TIERS.map((tier) => tier.band),
    ];
    for (const range of ranges) {
      expect(range, range).not.toMatch(/\d-\d|\d-£/);
    }
  });

  it("carries no trace of the retired no-rate-card positioning", () => {
    const corpus = JSON.stringify({
      IMPLEMENTATION_TIERS,
      SUPPORT_TIERS,
      WEBSITE_TIERS,
      PRICING_FAQ,
      ROI_MODEL,
    }).toLowerCase();
    for (const phrase of ["rate card", "no public price", "generic packages"]) {
      expect(corpus, phrase).not.toContain(phrase);
    }
  });
});

describe("pricing FAQ structured data", () => {
  it("asks all seven approved questions", () => {
    expect(PRICING_FAQ).toHaveLength(7);
    expect(PRICING_FAQ[0]?.question).toBe(
      "How much does AI automation cost for a UK SME?",
    );
    expect(PRICING_FAQ.at(-1)?.question).toBe("Are there any hidden costs?");
  });

  it("emits a FAQPage built from the same strings the accordion renders", () => {
    const route = getFutureRouteByPath("/pricing");
    expect(route).toBeDefined();
    if (!route) {
      return;
    }

    const graph = buildRouteSchemaGraph(route);
    const types = graph["@graph"].map((entry) => entry["@type"]);
    expect(types).toEqual(["WebPage", "FAQPage", "BreadcrumbList"]);

    const faq = graph["@graph"].find((entry) => entry["@type"] === "FAQPage");
    const questions = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer: { text: string };
    }[];
    expect(questions).toHaveLength(PRICING_FAQ.length);
    for (const [index, question] of questions.entries()) {
      expect(question.name).toBe(PRICING_FAQ[index]?.question);
      expect(question.acceptedAnswer.text).toBe(PRICING_FAQ[index]?.answer);
    }
  });

  it("adds FAQPage to no other route", () => {
    const other = getFutureRouteByPath("/about");
    expect(other).toBeDefined();
    if (!other) {
      return;
    }
    const types = buildRouteSchemaGraph(other)["@graph"].map((entry) => entry["@type"]);
    expect(types).not.toContain("FAQPage");
  });
});

describe("pricing route metadata", () => {
  it("describes the transparent pricing model", () => {
    const route = getFutureRouteByPath("/pricing");
    expect(route?.title).toBe("AI Automation & Website Pricing UK | Silverstone AI");
    expect(route?.h1).toBe("AI automation pricing for UK SMEs");
    expect(route?.headingPlan.h1).toBe(route?.h1);
    expect(route?.canonical).toBe("https://silverstone-ai.com/pricing");
    expect(route?.productionIndexable).toBe(true);
    expect(route?.description).toMatch(/£3,000/);
    expect(route?.description.length).toBeLessThanOrEqual(170);
  });
});
