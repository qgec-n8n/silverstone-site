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

type CurrencyToggleProps = {
  /** Where the toggle sits; the header build collapses to symbols on phones. */
  context?: "header" | "drawer" | "pricing";
  size?: "default" | "compact" | "instrument";
  tone?: "light" | "dark";
  /** Show the small mono "Currency" label beside the capsule. */
  labelled?: boolean;
  className?: string;
};

export function CurrencyToggle({
  context = "header",
  size = "default",
  tone = "light",
  labelled = false,
  className,
}: CurrencyToggleProps) {
  const [currency, setCurrency] = useCurrency();
  const [announcement, setAnnouncement] = useState("");
  const id = useId();

  const onChange = (next: Currency) => {
    if (next === currency) {
      return;
    }
    // Marks the client as interactive so the digit-settle transition only
    // runs for a change the reader made, never on load.
    document.documentElement.setAttribute("data-currency-live", "");
    setCurrency(next);
    setAnnouncement(`Prices shown in ${CURRENCY_LABELS[next].name}.`);
  };

  return (
    <fieldset
      className={["ss-cur", className].filter(Boolean).join(" ")}
      data-context={context}
      data-size={size === "default" ? undefined : size}
      data-tone={tone === "dark" ? "dark" : undefined}
    >
      <legend className="ss-cur__legend">Display currency</legend>
      {labelled ? (
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
            <label className="ss-cur__option" htmlFor={inputId} key={option}>
              <input
                aria-label={`${label.code}, ${label.name}`}
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
            </label>
          );
        })}
      </span>
      <span aria-live="polite" className="ss-cur__status" role="status">
        {announcement}
      </span>
    </fieldset>
  );
}
