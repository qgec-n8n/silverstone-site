/**
 * Estate Agents signature — "Property Enquiry Switchboard". Three demand
 * channels (portal, phone, web) converge into a central switch, which routes
 * a travelling pulse to one of three branch lanes (sales, lettings,
 * management) — a different lane each cycle, so routing reads as genuinely
 * rule-driven. Beneath the lanes, a viewing-diary strip fills slot by slot,
 * and an escalation node holds valuation judgement with people.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

const CHANNELS = [
  { label: "Portal lead", y: 90 },
  { label: "Missed call", y: 190 },
  { label: "Web enquiry", y: 290 },
];
const LANES = [
  { label: "Sales", y: 90 },
  { label: "Lettings", y: 190 },
  { label: "Management", y: 290 },
];
const SWITCH = { x: 300, y: 190 };
const CHANNEL_X = 92;
const LANE_X = 508;
const DIARY_Y = 420;
const DIARY_SLOTS = [150, 225, 300, 375, 450];

export function EnquirySwitchboard({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const [lane, setLane] = useState(0);
  const [cycle, setCycle] = useState(0);
  const target = LANES[lane] ?? { label: "Sales", y: 90 };

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: portal, phone and web enquiries converge into a routing switch, which assigns each one to the sales, lettings or management lane, fills the viewing diary and holds valuation judgement with the branch."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 600" className="ss-srv2-signature__svg">
          <defs>
            <linearGradient id="ind2-switch-accent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--srv2-accent)" />
              <stop offset="100%" stopColor="var(--srv2-accent-2)" />
            </linearGradient>
          </defs>

          {/* Channel → switch curves */}
          {CHANNELS.map((channel) => (
            <path
              key={channel.label}
              d={`M ${String(CHANNEL_X + 14)} ${String(channel.y)} C 200 ${String(channel.y)}, 230 ${String(SWITCH.y)}, ${String(SWITCH.x - 26)} ${String(SWITCH.y)}`}
              fill="none"
              stroke="var(--srv2-hairline)"
              strokeWidth="2"
            />
          ))}
          {/* Switch → lane curves */}
          {LANES.map((laneDef) => (
            <path
              key={laneDef.label}
              d={`M ${String(SWITCH.x + 26)} ${String(SWITCH.y)} C 380 ${String(SWITCH.y)}, 400 ${String(laneDef.y)}, ${String(LANE_X - 14)} ${String(laneDef.y)}`}
              fill="none"
              stroke="var(--srv2-hairline)"
              strokeWidth="2"
            />
          ))}

          {/* Travelling enquiry pulse: channel → switch → chosen lane */}
          {!reducedMotion ? (
            <m.circle
              key={cycle}
              r="5.5"
              fill="var(--srv2-accent)"
              style={{ filter: "drop-shadow(0 0 7px var(--srv2-accent))" }}
              initial={{
                cx: CHANNEL_X + 14,
                cy: CHANNELS[cycle % 3]?.y ?? 190,
                opacity: 0,
              }}
              animate={{
                cx: [CHANNEL_X + 14, SWITCH.x, LANE_X - 14],
                cy: [CHANNELS[cycle % 3]?.y ?? 190, SWITCH.y, target.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
              onAnimationComplete={() => {
                window.setTimeout(() => {
                  setLane(Math.floor(Math.random() * LANES.length));
                  setCycle((current) => current + 1);
                }, 1400);
              }}
            />
          ) : null}

          {/* Channels */}
          {CHANNELS.map((channel, index) => (
            <m.g
              key={channel.label}
              initial={reducedMotion ? false : { opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: reducedMotion ? 0 : index * 0.12 }}
            >
              <rect
                x={CHANNEL_X - 62}
                y={channel.y - 20}
                width="90"
                height="40"
                rx="10"
                fill="var(--ss-v2-void-black)"
                stroke="var(--srv2-accent-2)"
                strokeWidth="1.5"
              />
              <text
                x={CHANNEL_X - 17}
                y={channel.y + 5}
                textAnchor="middle"
                fill="var(--srv2-ink-soft)"
                fontSize="13"
                fontFamily="var(--ss-font-mono)"
              >
                {channel.label}
              </text>
            </m.g>
          ))}

          {/* Routing switch */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.35 }}
          >
            {!reducedMotion ? (
              <m.circle
                cx={SWITCH.x}
                cy={SWITCH.y}
                r="34"
                fill="url(#ind2-switch-accent)"
                initial={{ opacity: 0.1 }}
                animate={{ opacity: [0.1, 0.26, 0.1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : (
              <circle
                cx={SWITCH.x}
                cy={SWITCH.y}
                r="34"
                fill="url(#ind2-switch-accent)"
                opacity="0.14"
              />
            )}
            <circle
              cx={SWITCH.x}
              cy={SWITCH.y}
              r="20"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent)"
              strokeWidth="2"
            />
            <text
              x={SWITCH.x}
              y={SWITCH.y - 44}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
              letterSpacing="0.08em"
            >
              INTENT + OWNER
            </text>
          </m.g>

          {/* Branch lanes */}
          {LANES.map((laneDef, index) => (
            <m.g
              key={laneDef.label}
              initial={reducedMotion ? false : { opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: reducedMotion ? 0 : 0.2 + index * 0.12,
              }}
            >
              <rect
                x={LANE_X - 14}
                y={laneDef.y - 20}
                width="96"
                height="40"
                rx="10"
                fill="var(--ss-v2-void-black)"
                stroke={lane === index ? "var(--srv2-accent)" : "var(--srv2-hairline)"}
                strokeWidth="1.5"
              />
              <text
                x={LANE_X + 34}
                y={laneDef.y + 5}
                textAnchor="middle"
                fill="var(--srv2-ink-soft)"
                fontSize="13"
                fontFamily="var(--ss-font-mono)"
              >
                {laneDef.label}
              </text>
            </m.g>
          ))}

          {/* Viewing diary strip */}
          <text
            x="92"
            y={DIARY_Y - 26}
            fill="var(--srv2-ink-faint)"
            fontSize="13"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.08em"
          >
            VIEWING DIARY
          </text>
          <line
            x1="92"
            y1={DIARY_Y - 14}
            x2="508"
            y2={DIARY_Y - 14}
            stroke="var(--srv2-hairline)"
            strokeWidth="1"
          />
          {DIARY_SLOTS.map((x, index) => (
            <m.rect
              key={x}
              x={x - 26}
              y={DIARY_Y}
              width="52"
              height="34"
              rx="8"
              fill={
                index < 3
                  ? "color-mix(in srgb, var(--srv2-accent) 18%, transparent)"
                  : "var(--ss-v2-void-black)"
              }
              stroke={index < 3 ? "var(--srv2-accent)" : "var(--srv2-hairline)"}
              strokeWidth="1.4"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                delay: reducedMotion ? 0 : 0.4 + index * 0.1,
              }}
            />
          ))}
          <text
            x="300"
            y={DIARY_Y + 66}
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="12.5"
            fontFamily="var(--ss-font-mono)"
          >
            Permitted slots only — valuation stays with the branch
          </text>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
