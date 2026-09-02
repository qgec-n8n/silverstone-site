/**
 * Display currencies and the fixed GBP→USD rate table.
 *
 * Silverstone AI quotes and invoices in the currency agreed at proposal. The
 * site shows every published price in both sterling and US dollars so a reader
 * in Dallas and a reader in Manchester see the same page, and so both figures
 * exist in the prerendered HTML that non-rendering crawlers store. The USD
 * figures are NOT live conversions: they are the fixed, rounded pairs set by
 * the studio and reviewed quarterly. Change them here and nowhere else.
 *
 * Two things never convert:
 *   · results and case-study figures recorded in sterling (£16,800, £6,400,
 *     £0.49 CPC …) stay in sterling in both modes — a measured outcome is a
 *     fact, not a price;
 *   · anything not listed in `CURRENCY_PAIRS` — `money()` throws at module
 *     load rather than inventing a conversion.
 *
 * Authoring: prose and price fields carry a currency pair as one inline token,
 * `[[£3,000|$3,900]]`, rendered by `RichText` / `Money` and reduced to
 * "£3,000 / $3,900" for structured data and text-only readers. The same token
 * also carries currency-conditional wording, e.g. `[[VAT|sales tax]]`.
 */

export type Currency = "gbp" | "usd";

export const CURRENCIES: readonly Currency[] = ["gbp", "usd"];
export const DEFAULT_CURRENCY: Currency = "gbp";

/** `<html data-currency>` value, localStorage key and cookie name. */
export const CURRENCY_ATTRIBUTE = "data-currency";
export const CURRENCY_STORAGE_KEY = "ss.currency";
export const CURRENCY_COOKIE_NAME = "ss_currency";

export const CURRENCY_LABELS: Record<
  Currency,
  { symbol: string; code: string; name: string }
> = {
  gbp: { symbol: "£", code: "GBP", name: "British pounds" },
  usd: { symbol: "$", code: "USD", name: "US dollars" },
};

/**
 * Fixed rate table — reviewed quarterly. Keys are the exact sterling strings
 * used on the site; values are the published US-dollar strings.
 */
export const CURRENCY_PAIRS: Readonly<Record<string, string>> = {
  // Website build tiers
  "£1,500": "$1,950",
  "£2,750": "$3,500",
  "£4,750": "$5,950",
  "£7,500+": "$9,500+",
  "£7,500": "$9,500",
  // Implementation bands and pilots
  "£2,000": "$2,500",
  "£3,000": "$3,900",
  "£10,000–£25,000": "$12,500–$32,500",
  "£10,000–£50,000": "$12,500–$65,000",
  "£50,000+": "$65,000+",
  "£2,000–£10,000": "$2,500–$12,500",
  "£10,000": "$12,500",
  "£25,000": "$32,500",
  // Support retainers and hourly
  "£350/mo": "$450/mo",
  "£350": "$450",
  "£1,250/mo": "$1,600/mo",
  "£1,250": "$1,600",
  "£10,000+/mo": "$12,500+/mo",
  "£10,000+": "$12,500+",
  "£150/hr": "$195/hr",
  "£150": "$195",
  // Website maintenance
  "£65/mo": "$85/mo",
  "£65/month": "$85/month",
  "£125/mo": "$160/mo",
  "£125/month": "$160/month",
  "£225/mo": "$290/mo",
  "£225/month": "$290/month",
  // Hosting and handover
  "£15/mo": "$19/mo",
  "£15/month": "$19/month",
  "£25/mo": "$32/mo",
  "£25/month": "$32/month",
  "£350 one-off": "$450 one-off",
  // Aesthetic-clinic sprint — £1,500 split £750 + £750 (proportional halves)
  "£750": "$975",
  // Website payment splits
  "£750 before MVP and £750 after MVP review":
    "$975 before MVP and $975 after MVP review",
  // Contact and booking budget bands — proportional, rounded to the band
  "Under £1k": "Under $1,250",
  "£1k–£3k": "$1,250–$4,000",
  "£3k–£10k": "$4,000–$12,500",
  "£10k+": "$12,500+",
  // Illustrative ROI model — proportional at the table's rate. The support
  // line is twelve months of the published retainer in each currency
  // (12 × £350 = £4,200; 12 × $450 = $5,400), so the model reconciles in both.
  "£50,000": "$65,000",
  "£19,200": "$24,900",
  "£15,000": "$19,500",
  "£4,200": "$5,400",
  "£37,500": "$48,750",
  "£18,300": "$23,850",
};

/**
 * Budget bands for the contact form and booking qualifier, per currency. The
 * last option is currency-neutral. Submitted values are the visible strings, so
 * the mail and Calendly functions must accept every string in both lists.
 */
export const BUDGET_BANDS: Record<Currency, readonly string[]> = {
  gbp: ["Under £1k", "£1k–£3k", "£3k–£10k", "£10k+", "Not sure yet"],
  usd: ["Under $1,250", "$1,250–$4,000", "$4,000–$12,500", "$12,500+", "Not sure yet"],
};

export const ALL_BUDGET_BANDS: readonly string[] = [
  ...BUDGET_BANDS.gbp,
  ...BUDGET_BANDS.usd.filter((band) => !BUDGET_BANDS.gbp.includes(band)),
];

const TOKEN_PATTERN = /\[\[([^[\]|]+)\|([^[\]|]+)\]\]/g;

/** Builds the inline pair token for a listed sterling figure. */
export function money(gbp: string): string {
  const usd = CURRENCY_PAIRS[gbp];
  if (usd === undefined) {
    throw new Error(
      `No USD pair for "${gbp}" — add it to CURRENCY_PAIRS in src/data/currency.ts`,
    );
  }
  return `[[${gbp}|${usd}]]`;
}

/** Builds a currency-conditional wording token. */
export function perCurrency(gbp: string, usd: string): string {
  return `[[${gbp}|${usd}]]`;
}

export function hasCurrencyTokens(text: string): boolean {
  TOKEN_PATTERN.lastIndex = 0;
  return TOKEN_PATTERN.test(text);
}

/** Splits text into plain runs and currency pairs, in order. */
export function splitCurrencyTokens(
  text: string,
): (string | { gbp: string; usd: string })[] {
  const parts: (string | { gbp: string; usd: string })[] = [];
  let lastIndex = 0;
  TOKEN_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push({ gbp: match[1] ?? "", usd: match[2] ?? "" });
    lastIndex = TOKEN_PATTERN.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

/**
 * The text-only reading of a token string. `"both"` (the default) is what a
 * crawler, a screen reader with CSS off, and the FAQPage structured data see:
 * "£3,000 / $3,900". A single currency returns just that side.
 */
export function plainCurrencyText(
  text: string,
  mode: Currency | "both" = "both",
): string {
  return splitCurrencyTokens(text)
    .map((part) =>
      typeof part === "string"
        ? part
        : mode === "both"
          ? `${part.gbp} / ${part.usd}`
          : part[mode],
    )
    .join("");
}

export function isCurrency(value: unknown): value is Currency {
  return value === "gbp" || value === "usd";
}
