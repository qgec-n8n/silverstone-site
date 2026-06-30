import * as m from "motion/react-m";

import { TRUST_SIGNALS } from "~/data/home-v2";

import { Icon } from "../components/icon";

/** Thin reassurance band directly beneath the hero. */
export function TrustStrip() {
  return (
    <div className="ss-hv2-trust-shell">
      <m.ul
        className="ss-hv2-trust"
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.4, once: true }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {TRUST_SIGNALS.map((signal) => (
          <m.li
            key={signal.id}
            className="ss-hv2-trust__item"
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Icon name={signal.icon} className="size-5" />
            {signal.label}
          </m.li>
        ))}
      </m.ul>
    </div>
  );
}
