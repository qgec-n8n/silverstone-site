/**
 * eCommerce signature — "Order-State Conveyor". A horizontal state pipeline
 * (Question → Identified → State read → Action) with parcels traveling
 * left-to-right; roughly one in three drops through an exception chute to the
 * human-review dock below, which pulses as it receives the case. Distinct
 * language: a working conveyor with a visible, owned exception path.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

const BELT_Y = 190;
const STATIONS = [
  { label: "Question", x: 95 },
  { label: "Identified", x: 232 },
  { label: "State read", x: 368 },
  { label: "Resolved", x: 505 },
];
const CHUTE_X = 368;
const DOCK = { x: 368, y: 380 };
const SOURCES = ["Storefront", "Orders", "Carrier", "Helpdesk"];

export function OrderConveyor({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const [cycle, setCycle] = useState(0);
  const isException = cycle % 3 === 2;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: customer questions travel a conveyor from identification through authoritative state to resolution, with policy exceptions dropping into an owned human-review dock, fed by storefront, order, carrier and helpdesk data."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        {/* Tight viewBox around the drawn content so the conveyor and its
            labels render larger for the same stage size. */}
        <m.svg viewBox="54 54 492 440" className="ss-srv2-signature__svg">
          <defs>
            <linearGradient id="ind2-belt-accent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--srv2-accent)" />
              <stop offset="100%" stopColor="var(--srv2-accent-2)" />
            </linearGradient>
          </defs>

          {/* Data sources feeding the state station */}
          {SOURCES.map((source, index) => {
            const x = 130 + index * 113;
            return (
              <m.g
                key={source}
                initial={reducedMotion ? false : { opacity: 0, y: -12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.1 }}
              >
                <rect
                  x={x - 48}
                  y="62"
                  width="96"
                  height="34"
                  rx="9"
                  fill="var(--ss-v2-void-black)"
                  stroke="var(--srv2-hairline)"
                  strokeWidth="1.3"
                />
                <text
                  x={x}
                  y="84"
                  textAnchor="middle"
                  fill="var(--srv2-ink-faint)"
                  fontSize="13.5"
                  fontFamily="var(--ss-font-mono)"
                >
                  {source}
                </text>
                <line
                  x1={x}
                  y1="96"
                  x2={CHUTE_X}
                  y2={BELT_Y - 26}
                  stroke="var(--srv2-hairline)"
                  strokeWidth="1"
                  opacity="0.4"
                />
              </m.g>
            );
          })}

          {/* Conveyor belt */}
          <rect
            x="80"
            y={BELT_Y - 4}
            width="440"
            height="8"
            rx="4"
            fill="url(#ind2-belt-accent)"
            opacity="0.25"
          />
          <line
            x1="80"
            y1={BELT_Y}
            x2="520"
            y2={BELT_Y}
            stroke="var(--srv2-hairline)"
            strokeWidth="2"
          />

          {/* Stations */}
          {STATIONS.map((station, index) => (
            <m.g
              key={station.label}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.12 }}
            >
              <circle
                cx={station.x}
                cy={BELT_Y}
                r="11"
                fill="var(--ss-v2-void-black)"
                stroke={
                  index === STATIONS.length - 1
                    ? "var(--srv2-accent)"
                    : "var(--srv2-accent-2)"
                }
                strokeWidth="2"
              />
              <text
                x={station.x}
                y={BELT_Y + 38}
                textAnchor="middle"
                fill="var(--srv2-ink-soft)"
                fontSize="15"
                fontFamily="var(--ss-font-mono)"
              >
                {station.label}
              </text>
            </m.g>
          ))}

          {/* Travelling parcel */}
          {!reducedMotion ? (
            <m.rect
              key={cycle}
              width="26"
              height="26"
              rx="6"
              fill="color-mix(in srgb, var(--srv2-accent) 30%, var(--ss-v2-void-black))"
              stroke="var(--srv2-accent)"
              strokeWidth="1.8"
              style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent))" }}
              initial={{ x: 82, y: BELT_Y - 40, opacity: 0 }}
              animate={
                isException
                  ? {
                      x: [82, 219, CHUTE_X - 13, CHUTE_X - 13],
                      y: [BELT_Y - 40, BELT_Y - 40, BELT_Y - 40, DOCK.y - 46],
                      opacity: [0, 1, 1, 1],
                      rotate: [0, 0, 0, 8],
                    }
                  : {
                      x: [82, 219, 355, 492],
                      y: BELT_Y - 40,
                      opacity: [0, 1, 1, 0],
                    }
              }
              transition={{ duration: isException ? 3.1 : 2.7, ease: "easeInOut" }}
              onAnimationComplete={() => {
                window.setTimeout(
                  () => setCycle((current) => current + 1),
                  isException ? 1800 : 1200,
                );
              }}
            />
          ) : null}

          {/* Exception chute */}
          <line
            x1={CHUTE_X}
            y1={BELT_Y + 12}
            x2={DOCK.x}
            y2={DOCK.y - 34}
            stroke="var(--srv2-accent-2)"
            strokeWidth="1.6"
            strokeDasharray="6 6"
            opacity="0.7"
          />

          {/* Human-review dock */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.4 }}
          >
            <m.rect
              x={DOCK.x - 120}
              y={DOCK.y - 31}
              width="240"
              height="62"
              rx="12"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent-2)"
              strokeWidth="1.8"
              style={{
                filter:
                  "drop-shadow(0 0 10px color-mix(in srgb, var(--srv2-accent-2) 26%, transparent))",
              }}
              animate={reducedMotion || !isException ? {} : { opacity: [1, 0.75, 1] }}
              transition={{ duration: 1.4 }}
            />
            <text
              x={DOCK.x}
              y={DOCK.y - 5}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="15.5"
              fontFamily="var(--ss-font-mono)"
            >
              Human review
            </text>
            <text
              x={DOCK.x}
              y={DOCK.y + 18}
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
            >
              refunds · disputes · goodwill
            </text>
          </m.g>

          {/* Outcome ticker */}
          <text
            x="300"
            y="480"
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="13.5"
            fontFamily="var(--ss-font-mono)"
          >
            Every action permitted by state · every exception owned
          </text>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
