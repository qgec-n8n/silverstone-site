import { describe, expect, it } from "vitest";

import {
  ALL_BUDGET_BANDS,
  BUDGET_BANDS,
  CURRENCY_PAIRS,
  hasCurrencyTokens,
  money,
  perCurrency,
  plainCurrencyText,
  splitCurrencyTokens,
} from "~/data/currency";
import { PRICING_FAQ } from "~/data/pricing-faq";
import {
  BREAKDOWN_INSTRUMENTS,
  HOSTING_OPTIONS,
  IMPLEMENTATION_TIERS,
  MAINTENANCE_PLANS,
  PRICING_MODEL_ROWS,
  ROI_MODEL,
  SUPPORT_TIERS,
  VERIFIED_METRICS,
  WEBSITE_TIERS,
} from "~/features/core-pages/pricing/pricing-content";
import { aestheticClinicsCopy } from "~/features/industries-v2/content/copy/aesthetic-clinics";

/**
 * The fixed GBP→USD table is the single commercial source for every dollar
 * figure on the site. These tests pin the published pairs, make sure every
 * sterling price in the content modules has a dollar side, and keep the two
 * currencies' illustrative arithmetic reconciled.
 */
describe("fixed currency pairs", () => {
  it("publishes the agreed pairs, reviewed quarterly", () => {
    expect(CURRENCY_PAIRS["£1,500"]).toBe("$1,950");
    expect(CURRENCY_PAIRS["£2,750"]).toBe("$3,500");
    expect(CURRENCY_PAIRS["£4,750"]).toBe("$5,950");
    expect(CURRENCY_PAIRS["£7,500+"]).toBe("$9,500+");
    expect(CURRENCY_PAIRS["£2,000"]).toBe("$2,500");
    expect(CURRENCY_PAIRS["£3,000"]).toBe("$3,900");
    expect(CURRENCY_PAIRS["£10,000–£25,000"]).toBe("$12,500–$32,500");
    expect(CURRENCY_PAIRS["£10,000–£50,000"]).toBe("$12,500–$65,000");
    expect(CURRENCY_PAIRS["£50,000+"]).toBe("$65,000+");
    expect(CURRENCY_PAIRS["£350/mo"]).toBe("$450/mo");
    expect(CURRENCY_PAIRS["£1,250/mo"]).toBe("$1,600/mo");
    expect(CURRENCY_PAIRS["£10,000+/mo"]).toBe("$12,500+/mo");
    expect(CURRENCY_PAIRS["£150/hr"]).toBe("$195/hr");
    expect(CURRENCY_PAIRS["£65/mo"]).toBe("$85/mo");
    expect(CURRENCY_PAIRS["£125/mo"]).toBe("$160/mo");
    expect(CURRENCY_PAIRS["£225/mo"]).toBe("$290/mo");
    expect(CURRENCY_PAIRS["£15/mo"]).toBe("$19/mo");
    expect(CURRENCY_PAIRS["£25/mo"]).toBe("$32/mo");
    expect(CURRENCY_PAIRS["£350 one-off"]).toBe("$450 one-off");
  });

  it("refuses to invent a conversion for an unlisted figure", () => {
    expect(() => money("£999")).toThrow(/No USD pair/);
  });

  it("builds tokens and reduces them for text-only readers", () => {
    expect(money("£3,000")).toBe("[[£3,000|$3,900]]");
    expect(perCurrency("VAT", "sales tax")).toBe("[[VAT|sales tax]]");
    const text = `From ${money("£350")} per month, plus ${perCurrency("VAT", "sales tax")}.`;
    expect(hasCurrencyTokens(text)).toBe(true);
    expect(plainCurrencyText(text)).toBe(
      "From £350 / $450 per month, plus VAT / sales tax.",
    );
    expect(plainCurrencyText(text, "gbp")).toBe("From £350 per month, plus VAT.");
    expect(plainCurrencyText(text, "usd")).toBe("From $450 per month, plus sales tax.");
    expect(splitCurrencyTokens("no tokens")).toEqual(["no tokens"]);
  });
});

describe("every published price has both currencies", () => {
  const priceStrings = [
    ...IMPLEMENTATION_TIERS.map((tier) => tier.price),
    ...SUPPORT_TIERS.map((tier) => tier.price),
    ...WEBSITE_TIERS.flatMap((tier) => [
      tier.price,
      tier.maintenance.price,
      tier.payment,
    ]),
    ...MAINTENANCE_PLANS.map((plan) => plan.price),
    ...HOSTING_OPTIONS.map((option) => option.price),
    ...PRICING_MODEL_ROWS.map((row) => row.value),
    ...ROI_MODEL.flatMap((step) => [step.figure, step.body]),
    BREAKDOWN_INSTRUMENTS[0].value,
    aestheticClinicsCopy.sprint?.price ?? "",
    aestheticClinicsCopy.sprint?.priceNote ?? "",
    ...(aestheticClinicsCopy.sprint?.payments.map((payment) => payment.amount) ?? []),
  ];

  it("never leaves a bare sterling price outside a currency pair", () => {
    for (const text of priceStrings) {
      const bare = plainCurrencyText(text, "usd");
      expect(bare, text).not.toMatch(/£/);
    }
  });

  it("keeps recorded results in sterling in both modes", () => {
    // Results are facts, not prices: the verified figures never carry a pair.
    for (const metric of VERIFIED_METRICS) {
      expect(hasCurrencyTokens(metric)).toBe(false);
    }
    expect(VERIFIED_METRICS[0]).toBe("£16,800.00 — Annual direct cost savings");
  });

  it("carries the pilot and implementation bands in the FAQ, in both currencies", () => {
    const first = PRICING_FAQ[0];
    expect(first?.question).toBe(
      "How much does AI automation cost for a small business?",
    );
    expect(plainCurrencyText(first?.answer ?? "", "gbp")).toContain(
      "from £3,000 plus VAT",
    );
    expect(plainCurrencyText(first?.answer ?? "", "usd")).toContain(
      "from $3,900 plus applicable sales tax",
    );
  });
});

describe("illustrative ROI model reconciles in US dollars too", () => {
  it("adds up at the fixed pairs", () => {
    const implementation = 19_500;
    const annualSupport = 12 * 450;
    const baselineCost = 65_000;
    const investment = implementation + annualSupport;
    const annualValue = baselineCost * 0.75;
    const netValue = annualValue - investment;
    expect(investment).toBe(24_900);
    expect(annualValue).toBe(48_750);
    expect(netValue).toBe(23_850);
    expect(Math.ceil(investment / (annualValue / 12))).toBe(7);

    const usd = ROI_MODEL.map((step) => plainCurrencyText(step.body, "usd")).join(" ");
    expect(usd).toContain("$24,900");
    expect(usd).toContain("$48,750");
    expect(usd).toContain("$23,850");
    expect(usd).toContain("$19,500 build plus $5,400 Essential Support");
  });
});

describe("budget bands", () => {
  it("offers a proportional band list per currency and accepts both", () => {
    expect(BUDGET_BANDS.gbp).toEqual([
      "Under £1k",
      "£1k–£3k",
      "£3k–£10k",
      "£10k+",
      "Not sure yet",
    ]);
    expect(BUDGET_BANDS.usd).toEqual([
      "Under $1,250",
      "$1,250–$4,000",
      "$4,000–$12,500",
      "$12,500+",
      "Not sure yet",
    ]);
    expect(ALL_BUDGET_BANDS).toHaveLength(9);
    expect(new Set(ALL_BUDGET_BANDS).size).toBe(9);
  });
});
