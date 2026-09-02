/**
 * AI Receptionists signature — "Front-Desk Convergence". Three channels (call,
 * chat, web intake) converge into one triage point, then diverge to either an
 * automated resolution or a human hand-off, closing with a routing-mix panel
 * showing each channel's relative share. Distinct animation language:
 * multi-source convergence with a branching decision, rather than a single
 * linear path (Web Design) or a waveform timeline (Voice Agents). Connector
 * paths draw in on reveal; the triage and outcome nodes pulse continuously to
 * suggest live routing.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import {
  Headset,
  MessageSquare,
  PhoneCall,
  UserCheck,
} from "~/components/icons/lucide";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "./signature-chrome";

const channels = [
  { label: "Call", y: 60, Icon: PhoneCall, mix: 0.48 },
  { label: "Chat", y: 150, Icon: MessageSquare, mix: 0.34 },
  { label: "Web intake", y: 240, Icon: Headset, mix: 0.18 },
];

const outcomes = [
  { lines: ["Resolved", "automatically"], y: 90 },
  { lines: ["Handed to", "your team"], y: 210 },
];

export function FrontDeskConvergence({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: calls, chat and web intake converge into a single triage point, which routes each inquiry to an automated resolution or a human handoff, with a routing-mix panel below showing each channel's relative share."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 580" className="ss-srv2-signature__svg">
          <defs>
            <linearGradient id="srv2-desk-accent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--srv2-accent)" />
              <stop offset="100%" stopColor="var(--srv2-accent-2)" />
            </linearGradient>
          </defs>

          {/* Channel inputs converging to the triage node — the curve now runs
              to x=298, a few units past the triage circle's own edge (310-20
              = 290), so every channel visibly overlaps the node it feeds
              into rather than just touching its boundary pixel. */}
          {channels.map((channel, index) => (
            <g key={channel.label}>
              {reducedMotion ? (
                <path
                  d={`M 96 ${String(channel.y)} C 200 ${String(channel.y)}, 220 150, 298 150`}
                  fill="none"
                  stroke="url(#srv2-desk-accent)"
                  strokeWidth="2"
                />
              ) : (
                <m.path
                  d={`M 96 ${String(channel.y)} C 200 ${String(channel.y)}, 220 150, 298 150`}
                  fill="none"
                  stroke="url(#srv2-desk-accent)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.9, delay: index * 0.18, ease: "easeInOut" }}
                />
              )}
              <m.g
                initial={reducedMotion ? false : { opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: reducedMotion ? 0.01 : 0.5,
                  delay: reducedMotion ? 0 : index * 0.1,
                }}
              >
                <circle
                  cx="64"
                  cy={channel.y}
                  r="26"
                  fill="rgba(255,255,255,0.03)"
                  stroke="var(--srv2-hairline)"
                />
                <foreignObject x="50" y={channel.y - 14} width="28" height="28">
                  <channel.Icon
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "var(--srv2-accent)",
                    }}
                  />
                </foreignObject>
                <text
                  x="64"
                  y={channel.y + 46}
                  textAnchor="middle"
                  fill="var(--srv2-ink-faint)"
                  fontSize="14"
                  fontFamily="var(--ss-font-mono)"
                >
                  {channel.label}
                </text>
              </m.g>
            </g>
          ))}

          {/* Triage node — pulses continuously to suggest live routing */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.5,
              delay: reducedMotion ? 0 : 0.35,
            }}
          >
            {!reducedMotion ? (
              <m.circle
                cx="310"
                cy="150"
                r="34"
                fill="url(#srv2-desk-accent)"
                initial={{ opacity: 0.1, scale: 1 }}
                animate={{ opacity: [0.1, 0.28, 0.1], scale: [1, 1.12, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : (
              <circle
                cx="310"
                cy="150"
                r="34"
                fill="url(#srv2-desk-accent)"
                opacity="0.16"
              />
            )}
            <circle
              cx="310"
              cy="150"
              r="20"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent)"
              strokeWidth="2"
            />
            <text
              x="310"
              y="198"
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="15"
              fontFamily="var(--ss-font-mono)"
              letterSpacing="0.04em"
            >
              TRIAGE
            </text>
          </m.g>

          {/* Divergence to outcomes */}
          {outcomes.map((outcome, index) => (
            <g key={outcome.lines.join(" ")}>
              {reducedMotion ? (
                <path
                  d={`M 330 150 C 400 150, 420 ${String(outcome.y)}, 500 ${String(outcome.y)}`}
                  fill="none"
                  stroke="var(--srv2-hairline)"
                  strokeWidth="2"
                />
              ) : (
                <m.path
                  d={`M 330 150 C 400 150, 420 ${String(outcome.y)}, 500 ${String(outcome.y)}`}
                  fill="none"
                  stroke="var(--srv2-hairline)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.6 + index * 0.15,
                    ease: "easeInOut",
                  }}
                />
              )}
              {!reducedMotion ? (
                <m.circle
                  cx="524"
                  cy={outcome.y}
                  r="20"
                  fill={index === 1 ? "#f0789a" : "var(--srv2-accent-2)"}
                  initial={{ opacity: 0.15 }}
                  animate={{ opacity: [0.15, 0.4, 0.15] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: 0.4 + index * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ) : null}
              <circle
                cx="524"
                cy={outcome.y}
                r="20"
                fill="rgba(255,255,255,0.03)"
                stroke="var(--srv2-hairline)"
              />
              <foreignObject x="512" y={outcome.y - 12} width="24" height="24">
                <UserCheck
                  style={{
                    width: "1.2rem",
                    height: "1.2rem",
                    color: index === 1 ? "#f0789a" : "var(--srv2-accent-2)",
                  }}
                />
              </foreignObject>
              <text
                x="524"
                y={outcome.y + 40}
                textAnchor="middle"
                fill="var(--srv2-ink-faint)"
                fontSize="13"
                fontFamily="var(--ss-font-mono)"
              >
                {outcome.lines.map((line, lineIndex) => (
                  <tspan key={line} x="524" dy={lineIndex === 0 ? 0 : 17}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          ))}

          {/* Today's routing mix — relative share per channel */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.6,
              delay: reducedMotion ? 0 : 1.1,
            }}
          >
            <line
              x1="40"
              y1="330"
              x2="564"
              y2="330"
              stroke="var(--srv2-hairline)"
              strokeWidth="1"
              opacity="0.6"
            />
            <text
              x="40"
              y="360"
              fill="var(--srv2-ink-faint)"
              fontSize="14"
              fontFamily="var(--ss-font-mono)"
              letterSpacing="0.06em"
            >
              TODAY&apos;S ROUTING MIX
            </text>
            {channels.map((channel, index) => {
              const trackWidth = 460;
              const fillWidth = trackWidth * channel.mix;
              const y = 388 + index * 44;
              return (
                <g key={channel.label}>
                  <text
                    x="40"
                    y={y - 9}
                    fill="var(--srv2-ink-soft)"
                    fontSize="14"
                    fontFamily="var(--ss-font-body)"
                  >
                    {channel.label}
                  </text>
                  <rect
                    x="40"
                    y={y}
                    width={trackWidth}
                    height="8"
                    rx="4"
                    fill="var(--srv2-hairline)"
                  />
                  {!reducedMotion ? (
                    <m.rect
                      x="40"
                      y={y}
                      height="8"
                      rx="4"
                      fill="url(#srv2-desk-accent)"
                      initial={{ width: 0 }}
                      whileInView={{ width: fillWidth }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.1,
                        delay: 1.4 + index * 0.15,
                        ease: "easeOut",
                      }}
                    />
                  ) : (
                    <rect
                      x="40"
                      y={y}
                      width={fillWidth}
                      height="8"
                      rx="4"
                      fill="url(#srv2-desk-accent)"
                    />
                  )}
                </g>
              );
            })}
          </m.g>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
