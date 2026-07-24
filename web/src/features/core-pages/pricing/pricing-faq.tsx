/**
 * /pricing FAQ.
 *
 * Hand-built rather than reusing the shared Radix `FaqPanel` for one reason:
 * Radix unmounts a closed accordion panel, so the answers never reach the
 * prerendered HTML. These answers carry published prices and the page's
 * FAQPage structured data has to match visible copy exactly, so every answer is
 * always in the document and merely collapsed by CSS
 * (`grid-template-rows: 0fr → 1fr`), with `inert` keeping closed panels out of
 * the accessibility tree and off the tab order.
 *
 * Interaction parity with the Radix implementation elsewhere on the site:
 * real buttons with `aria-expanded`/`aria-controls`, one open item at a time,
 * collapsible, and Arrow/Home/End roving between triggers.
 */
import { useRef, useState, type KeyboardEvent } from "react";

import { ChevronDown } from "~/components/icons/lucide";
import { PRICING_FAQ } from "~/data/pricing-faq";
import { Reveal } from "~/features/services-v2/components/primitives";

export function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTrigger = (index: number) => {
    const target = (index + PRICING_FAQ.length) % PRICING_FAQ.length;
    triggers.current[target]?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusTrigger(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusTrigger(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTrigger(0);
        break;
      case "End":
        event.preventDefault();
        focusTrigger(PRICING_FAQ.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="ss-pri-faq">
      {PRICING_FAQ.map((item, index) => {
        const open = openIndex === index;
        const triggerId = `pricing-faq-trigger-${String(index)}`;
        const panelId = `pricing-faq-panel-${String(index)}`;

        return (
          <Reveal delayMs={index * 80} key={item.question} kind="section">
            <div className="ss-pri-faq__item" data-state={open ? "open" : "closed"}>
              <h3 className="ss-pri-faq__heading">
                <button
                  aria-controls={panelId}
                  aria-expanded={open}
                  className="ss-pri-faq__trigger"
                  id={triggerId}
                  onClick={() => {
                    setOpenIndex(open ? null : index);
                  }}
                  onKeyDown={(event) => {
                    onTriggerKeyDown(event, index);
                  }}
                  ref={(node) => {
                    triggers.current[index] = node;
                  }}
                  type="button"
                >
                  <span>{item.question}</span>
                  <ChevronDown aria-hidden="true" className="ss-pri-faq__chevron" />
                </button>
              </h3>

              <div
                className="ss-pri-faq__panel"
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                inert={!open}
              >
                <div className="ss-pri-faq__panel-inner">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
