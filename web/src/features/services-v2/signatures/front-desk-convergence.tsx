/**
 * AI Receptionists signature — "Front-Desk Convergence". Three channels (call,
 * chat, web intake) converge into one triage point, then diverge to either an
 * automated resolution or a human hand-off. Distinct animation language:
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

import { SignatureChrome } from "./signature-chrome";

const channels = [
  { label: "Call", y: 60, Icon: PhoneCall },
  { label: "Chat", y: 150, Icon: MessageSquare },
  { label: "Web intake", y: 240, Icon: Headset },
];

const outcomes = [
  { label: "Resolved automatically", y: 90 },
  { label: "Handed to your team", y: 210 },
];

export function FrontDeskConvergence() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: calls, chat and web intake converge into a single triage point, which routes each enquiry to an automated resolution or a human handoff."
    >
      <m.svg viewBox="0 0 600 320" className="ss-srv2-signature__svg">
        <defs>
          <linearGradient id="srv2-desk-accent" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--srv2-accent)" />
            <stop offset="100%" stopColor="var(--srv2-accent-2)" />
          </linearGradient>
        </defs>

        {/* Channel inputs converging to the triage node */}
        {channels.map((channel, index) => (
          <g key={channel.label}>
            {reducedMotion ? (
              <path
                d={`M 96 ${String(channel.y)} C 200 ${String(channel.y)}, 220 150, 290 150`}
                fill="none"
                stroke="url(#srv2-desk-accent)"
                strokeWidth="2"
              />
            ) : (
              <m.path
                d={`M 96 ${String(channel.y)} C 200 ${String(channel.y)}, 220 150, 290 150`}
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
                y={channel.y + 44}
                textAnchor="middle"
                fill="var(--srv2-ink-faint)"
                fontSize="11"
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
            y="196"
            textAnchor="middle"
            fill="var(--ss-v2-chrome)"
            fontSize="12"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.04em"
          >
            TRIAGE
          </text>
        </m.g>

        {/* Divergence to outcomes */}
        {outcomes.map((outcome, index) => (
          <g key={outcome.label}>
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
              y={outcome.y + 38}
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="10.5"
              fontFamily="var(--ss-font-mono)"
            >
              {outcome.label}
            </text>
          </g>
        ))}
      </m.svg>
      <SignatureChrome />
    </div>
  );
}
