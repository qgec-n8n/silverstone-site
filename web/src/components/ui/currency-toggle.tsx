/**
 * Display-currency toggle — a two-position instrument, not a settings control.
 *
 * Real form semantics: a fieldset with a legend and two radio inputs sharing
 * one name, so arrow keys move between GBP and USD and every assistive
 * technology announces it as a choice. Each instance on a page owns its own
 * radio name (`ss-currency-<context>`): two controlled React groups sharing
 * one native name fight over the checked state, whereas two independent
 * groups both follow the store and always agree.
 *
 * With JavaScript, `change` writes `<html data-currency>` plus storage (see
 * ~/lib/currency) and every MoneyPair on the page follows through CSS. Without
 * JavaScript the same CSS reads the checked radio directly, so the toggle
 * still switches every price on the current page.
 *
 * Motion is a single lozenge sliding under the checked label (CSS `translate`,
 * compositor only) and a short blur-settle on the figures that change; both
 * stop under prefers-reduced-motion.
 */
import { useId, useState } from "react";

import { CURRENCIES, CURRENCY_LABELS, type Currency } from "~/data/currency";
import { useCurrency } from "~/lib/currency";

/**
 * The market each currency stands for on the industry pages' Atlantic Bridge,
 * where the reader is choosing a market and the display currency follows.
 *
 * Rendered here rather than generated from CSS `content`, because WCAG 2.5.3
 * (Label in Name) requires the words a sighted reader sees to appear in the
 * control's accessible name — and a `::after` string can never reach the
 * accessibility tree. Visible text and accessible name now come from one place,
 * so "click UK" reaches the sterling segment.
 */
const MARKET_LABELS: Record<Currency, string> = { gbp: "UK", usd: "US" };

type CurrencyToggleProps = {
  /**
   * Where the toggle sits; the header build collapses to symbols on phones.
   * "markets" is the industry pages' Atlantic Bridge control — same store, same
   * radio semantics, but labelled by market ("US · $" / "UK · £") in
   * styles/currency.css, because on those pages the reader is choosing a market
   * to read in and the currency follows from it. "ledger" is the same control
   * a second time on those pages, compact, in the head of the two-market
   * ledger on phones (where the ledger shows one market at a time): same
   * market labels, its own radio name, its own size in styles/currency.css.
   */
  context?: "header" | "drawer" | "pricing" | "pricing-inline" | "markets" | "ledger";
  size?: "default" | "compact" | "instrument" | "grand";
  tone?: "light" | "dark";
  /** Show the small mono "Currency" label beside the capsule. */
  labeled?: boolean;
  /**
   * Own the radios' element ids, so something OUTSIDE this component can be a
   * real `<label for>` for one of them. The Atlantic Bridge uses it to make its
   * two city nodes switch the market: a plain HTML association, so it works in
   * the prerendered document and with JavaScript off, and there is still only
   * one radio group and one store. Defaults to this instance's own `useId`.
   */
  idPrefix?: string;
  className?: string;
};

export function CurrencyToggle({
  context = "header",
  size = "default",
  tone = "light",
  labeled = false,
  idPrefix,
  className,
}: CurrencyToggleProps) {
  const [currency, setCurrency] = useCurrency();
  const [announcement, setAnnouncement] = useState("");
  const generatedId = useId();
  const id = idPrefix ?? generatedId;
  const isMarkets = context === "markets" || context === "ledger";

  const onChange = (next: Currency) => {
    if (next === currency) {
      return;
    }
    // Marks the client as interactive so the digit-settle transition only
    // runs for a change the reader made, never on load.
    document.documentElement.setAttribute("data-currency-live", "");
    setCurrency(next);
    setAnnouncement(
      isMarkets
        ? `Market focus set to ${MARKET_LABELS[next]}. Prices shown in ${CURRENCY_LABELS[next].name}.`
        : `Prices shown in ${CURRENCY_LABELS[next].name}.`,
    );
  };

  return (
    <fieldset
      className={["ss-cur", className].filter(Boolean).join(" ")}
      data-context={context}
      data-size={size === "default" ? undefined : size}
      data-tone={tone === "dark" ? "dark" : undefined}
    >
      <legend className="ss-cur__legend">
        {isMarkets ? "Market focus" : "Display currency"}
      </legend>
      {labeled ? (
        <span aria-hidden="true" className="ss-cur__label">
          Currency
        </span>
      ) : null}
      <span className="ss-cur__track">
        <span aria-hidden="true" className="ss-cur__lozenge" />
        {CURRENCIES.map((option) => {
          const label = CURRENCY_LABELS[option];
          const inputId = `${id}-${option}`;
          return (
            <label
              className="ss-cur__option"
              htmlFor={inputId}
              key={option}
              onMouseDown={(event) => {
                /* A press on an option lands on its invisible radio, and a
                   pressed form control takes focus — which the browser then
                   scrolls into view (WebKit nudged the page on every tap of
                   the market switch; iOS may pan or zoom to it as well).
                   Cancelling the press keeps the focus from happening while
                   the click that follows still checks the radio, so a tap
                   only ever switches the currency. `mousedown`, not
                   `pointerdown`: WebKit drops the click of a touch whose
                   pointerdown was cancelled, but honours a cancelled
                   synthesised mousedown. Keyboard users are untouched: Tab
                   and the arrow keys never press. */
                event.preventDefault();
              }}
            >
              <input
                aria-label={
                  isMarkets
                    ? `${MARKET_LABELS[option]}, ${label.code}, ${label.name}`
                    : `${label.code}, ${label.name}`
                }
                checked={currency === option}
                id={inputId}
                name={`ss-currency-${context}`}
                onChange={() => {
                  onChange(option);
                }}
                type="radio"
                value={option}
              />
              <span aria-hidden="true" className="ss-cur__symbol">
                {label.symbol}
              </span>
              <span aria-hidden="true" className="ss-cur__code">
                {label.code}
              </span>
              {isMarkets ? (
                <span aria-hidden="true" className="ss-cur__market">
                  {MARKET_LABELS[option]}
                </span>
              ) : null}
            </label>
          );
        })}
      </span>
      {/* aria-live alone, deliberately no role="status": a status role here
          would add a second live landmark to every page, and page-level
          queries for the one status region (the blog filter's, for example)
          would then resolve to two elements. The announcement behaviour is
          identical. */}
      <span aria-live="polite" className="ss-cur__status">
        {announcement}
      </span>
    </fieldset>
  );
}
