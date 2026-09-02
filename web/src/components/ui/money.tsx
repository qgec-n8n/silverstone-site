/**
 * One currency pair, rendered so that every reader gets the right figure:
 *
 *   · a browser shows the side matching `<html data-currency>` (CSS in
 *     styles/currency.css); with JavaScript off, the header's radio group
 *     still drives the same rules through `:has()`;
 *   · a screen reader hears only the visible side, because the hidden side is
 *     `display: none` rather than clipped;
 *   · a non-rendering crawler, or a reader with CSS off, sees both sides with
 *     a divider — "£3,000 / $3,900" — which is also the exact string the
 *     FAQPage structured data carries.
 *
 * Authored figures never pass through arithmetic here: both strings come from
 * the fixed table in `~/data/currency`.
 */
import { splitCurrencyTokens } from "~/data/currency";

export function MoneyPair({ gbp, usd }: { gbp: string; usd: string }) {
  return (
    <span className="ss-money" data-gbp={gbp} data-usd={usd}>
      <span className="ss-money__gbp">{gbp}</span>
      <span aria-hidden="true" className="ss-money__sep">
        {" / "}
      </span>
      <span className="ss-money__usd">{usd}</span>
    </span>
  );
}

/** Renders a string that may contain `[[£|$]]` tokens, with no other markup. */
export function Money({ text }: { text: string }) {
  const parts = splitCurrencyTokens(text);
  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          part
        ) : (
          <MoneyPair gbp={part.gbp} key={index} usd={part.usd} />
        ),
      )}
    </>
  );
}
