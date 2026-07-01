/**
 * AI Voice Agents signature — "Conversation Signal Intelligence". A live
 * waveform above a four-state call-routing timeline (Answered → Understood →
 * Action Taken → Escalated). Distinct animation language: a continuous
 * amplitude pulse (audio-visualiser feel) rather than a single travelling dot.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { SignatureChrome } from "./signature-chrome";

const routeStates = [
  { label: "Answered", x: 70 },
  { label: "Understood", x: 220 },
  { label: "Action taken", x: 380 },
  { label: "Escalated", x: 530 },
];

const barCount = 40;

export function SignalWaveform() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: a live call waveform above a routing timeline showing a call being answered, understood, acted on, and escalated when needed."
    >
      <m.svg viewBox="0 0 600 380" className="ss-srv2-signature__svg">
        <defs>
          <linearGradient id="srv2-wave-accent" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--srv2-accent)" />
            <stop offset="100%" stopColor="var(--srv2-accent-2)" />
          </linearGradient>
        </defs>

        {/* Waveform */}
        <g transform="translate(40, 60)">
          {Array.from({ length: barCount }).map((_, i) => {
            const seed = Math.sin(i * 1.7) * 0.5 + 0.5;
            const baseHeight = 14 + seed * 60;
            return reducedMotion ? (
              <rect
                key={i}
                x={i * 13}
                y={70 - baseHeight / 2}
                width="6"
                height={baseHeight}
                rx="3"
                fill="url(#srv2-wave-accent)"
                opacity={0.5 + seed * 0.4}
              />
            ) : (
              <m.rect
                key={i}
                x={i * 13}
                width="6"
                rx="3"
                fill="url(#srv2-wave-accent)"
                initial={{ height: baseHeight, y: 70 - baseHeight / 2 }}
                animate={{
                  height: [baseHeight, baseHeight * 1.6, baseHeight * 0.5, baseHeight],
                  y: [
                    70 - baseHeight / 2,
                    70 - (baseHeight * 1.6) / 2,
                    70 - (baseHeight * 0.5) / 2,
                    70 - baseHeight / 2,
                  ],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.045,
                }}
              />
            );
          })}
        </g>

        {/* Routing timeline */}
        <line
          x1="70"
          y1="240"
          x2="530"
          y2="240"
          stroke="var(--srv2-hairline)"
          strokeWidth="2"
        />
        {!reducedMotion ? (
          <m.circle
            cy="240"
            r="5"
            fill="var(--srv2-accent)"
            initial={{ cx: 70, opacity: 0 }}
            animate={{ cx: [70, 220, 380, 530], opacity: [0, 1, 1, 1, 0] }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              repeatDelay: 0.6,
              ease: "easeInOut",
            }}
            style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent))" }}
          />
        ) : null}
        {routeStates.map((state, index) => (
          <m.g
            key={state.label}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.5,
              delay: reducedMotion ? 0 : 0.15 + index * 0.1,
            }}
          >
            <circle
              cx={state.x}
              cy="240"
              r="8"
              fill="var(--ss-v2-void-black)"
              stroke={
                index === routeStates.length - 1 ? "#f0789a" : "var(--srv2-accent)"
              }
              strokeWidth="2"
            />
            <text
              x={state.x}
              y="272"
              textAnchor="middle"
              fill="var(--srv2-ink-soft)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
            >
              {state.label}
            </text>
          </m.g>
        ))}

        <text
          x="40"
          y="330"
          fill="var(--srv2-ink-faint)"
          fontSize="12"
          fontFamily="var(--ss-font-mono)"
        >
          Live signal · illustrative call flow
        </text>
      </m.svg>
      <SignatureChrome />
    </div>
  );
}
