import { TRUST_SIGNALS } from "~/data/home-v2";
import { useSectionReveal } from "~/visual/hooks/use-section-reveal";

import { Icon } from "../components/icon";

/** Thin reassurance band directly beneath the hero. */
export function TrustStrip() {
  const { ref, revealed } = useSectionReveal();

  return (
    <div className="ss-hv2-trust-shell">
      <ul className="ss-hv2-trust" data-revealed={revealed} ref={ref}>
        {TRUST_SIGNALS.map((signal) => (
          <li key={signal.id} className="ss-hv2-trust__item">
            <Icon name={signal.icon} className="size-5" />
            {signal.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
