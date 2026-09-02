/**
 * Skin & Aesthetic Clinics signature — "Consultation Ladder".
 *
 * An inquiry enters from one of four channels, then climbs a ladder of rungs
 * — replied, qualified, deposit held, consultation confirmed — with a
 * compliance filter sitting *on* the ladder rather than beside it: a public
 * reply drafted with a prescription-only brand name is visibly rewritten to
 * approved category language before it can leave. The prescriber gate caps the
 * ladder; nothing clinical passes it.
 *
 * Distinct language from its siblings: a vertical climb with an inline filter,
 * not a diary grid (salons), an orbit (dentists) or a switchboard (estate
 * agents).
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

const CHANNELS = ["DM", "Form", "Call", "WhatsApp"];
const CHANNEL_X = [104, 216, 328, 448];
const CHANNEL_Y = 470;

/** Ladder rungs, bottom-up. `y` is the rung's center line. */
const RUNGS = [
  { label: "Replied in seconds", y: 380 },
  { label: "Qualified to your rules", y: 300 },
  { label: "Deposit held", y: 220 },
  { label: "Consultation confirmed", y: 140 },
];
const RAIL_LEFT = 150;
const RAIL_RIGHT = 450;
const FILTER_Y = 340;

type Phase = "arriving" | "filtering" | "climbing" | "confirmed";

export function ConsultLadder({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>("arriving");

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }
    const timers = [
      window.setTimeout(() => setPhase("filtering"), 1800),
      window.setTimeout(() => setPhase("climbing"), 3600),
      window.setTimeout(() => setPhase("confirmed"), 6000),
      window.setTimeout(() => setPhase("arriving"), 9200),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [phase, reducedMotion]);

  const filtered = phase === "climbing" || phase === "confirmed";
  /** How many rungs are lit at this phase. */
  const litRungs = phase === "confirmed" ? RUNGS.length : phase === "climbing" ? 2 : 1;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: an aesthetic clinic inquiry arriving by DM, form, call or WhatsApp climbs a ladder — replied, qualified, deposit held, consultation confirmed — passing a filter that rewrites prescription-only brand names into approved treatment language, with a prescriber gate above."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        {/* Tight viewBox around the drawn content so the ladder and its labels
            render larger for the same stage size. */}
        <m.svg viewBox="20 44 560 486" className="ss-srv2-signature__svg">
          {/* Ladder rails */}
          {[RAIL_LEFT, RAIL_RIGHT].map((x) => (
            <line
              key={x}
              x1={x}
              y1="112"
              x2={x}
              y2="430"
              stroke="var(--srv2-hairline)"
              strokeWidth="1.5"
            />
          ))}

          {/* Channel intake */}
          {CHANNEL_X.map((x, index) => (
            <m.g
              key={CHANNELS[index]}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.08 }}
            >
              <rect
                x={x - 46}
                y={CHANNEL_Y - 19}
                width="92"
                height="38"
                rx="10"
                fill="var(--ss-v2-void-black)"
                stroke="var(--srv2-hairline)"
                strokeWidth="1.4"
              />
              <text
                x={x}
                y={CHANNEL_Y + 6}
                textAnchor="middle"
                fill="var(--srv2-ink-soft)"
                fontSize="14.5"
                fontFamily="var(--ss-font-mono)"
              >
                {CHANNELS[index]}
              </text>
              <line
                x1={x}
                y1={CHANNEL_Y - 19}
                x2="300"
                y2="418"
                stroke="var(--srv2-hairline)"
                strokeWidth="1"
                opacity="0.55"
              />
            </m.g>
          ))}

          {/* The climbing inquiry */}
          {!reducedMotion ? (
            <m.circle
              r="7"
              fill="var(--srv2-accent)"
              initial={{ cx: 300, cy: 418, opacity: 0 }}
              animate={{
                cx: 300,
                cy:
                  phase === "arriving"
                    ? 418
                    : phase === "filtering"
                      ? FILTER_Y
                      : phase === "climbing"
                        ? (RUNGS[2]?.y ?? 220)
                        : (RUNGS[3]?.y ?? 140),
                opacity: 1,
              }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 0 8px var(--srv2-accent))" }}
            />
          ) : null}

          {/* Compliance filter, sitting on the ladder between reply and qualify */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.5 }}
          >
            <rect
              x="128"
              y={FILTER_Y - 24}
              width="344"
              height="48"
              rx="12"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent-2)"
              strokeWidth="1.8"
              strokeDasharray={filtered ? "0" : "6 5"}
            />
            <text
              x="300"
              y={FILTER_Y + 6}
              textAnchor="middle"
              fill="var(--srv2-ink-soft)"
              fontSize="14.5"
              fontFamily="var(--ss-font-mono)"
            >
              {filtered ? "“anti-wrinkle treatment” ✓" : "POM brand name — blocked"}
            </text>
          </m.g>

          {/* Rungs */}
          {RUNGS.map((rung, index) => {
            const lit = index < litRungs;
            return (
              <m.g
                key={rung.label}
                initial={reducedMotion ? false : { opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: reducedMotion ? 0 : 0.2 + index * 0.1,
                }}
              >
                <m.rect
                  x={RAIL_LEFT}
                  y={rung.y - 21}
                  width={RAIL_RIGHT - RAIL_LEFT}
                  height="42"
                  rx="10"
                  fill={
                    lit
                      ? "color-mix(in srgb, var(--srv2-accent) 18%, transparent)"
                      : "transparent"
                  }
                  stroke={lit ? "var(--srv2-accent)" : "var(--srv2-hairline)"}
                  strokeWidth={lit ? 1.8 : 1.2}
                  animate={reducedMotion ? {} : { opacity: lit ? 1 : 0.55 }}
                  transition={{ duration: 0.5 }}
                />
                <text
                  x="300"
                  y={rung.y + 6}
                  textAnchor="middle"
                  fill={lit ? "var(--srv2-ink)" : "var(--srv2-ink-faint)"}
                  fontSize="15"
                  fontFamily="var(--ss-font-mono)"
                >
                  {rung.label}
                </text>
              </m.g>
            );
          })}

          {/* Prescriber gate caps the ladder */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.7 }}
          >
            <rect
              x="112"
              y="52"
              width="376"
              height="48"
              rx="12"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent-2)"
              strokeWidth="1.8"
            />
            <text
              x="300"
              y="82"
              textAnchor="middle"
              fill="var(--srv2-ink-soft)"
              fontSize="15"
              fontFamily="var(--ss-font-mono)"
            >
              Prescriber gate — clinical judgment
            </text>
          </m.g>

          <text
            x="300"
            y="516"
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="14"
            fontFamily="var(--ss-font-mono)"
          >
            Every channel, one diary, one set of rules
          </text>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
