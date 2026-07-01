/**
 * AI Voice Agents signature — "Conversation Signal Intelligence". A live
 * waveform above a four-state call-routing timeline (Answered → Understood →
 * Action Taken → Escalated), closing with an abstract live-transcript panel.
 * Distinct animation language: a continuous amplitude pulse (audio-visualiser
 * feel) rather than a single travelling dot. The transcript uses abstract
 * skeleton bars, never invented dialogue — consistent with the reserved
 * demo-surface rule elsewhere on this page.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "./signature-chrome";

const routeStates = [
  { label: "Answered", x: 70 },
  { label: "Understood", x: 220 },
  { label: "Action taken", x: 380 },
  { label: "Escalated", x: 530 },
];

const barCount = 40;

const transcriptLines = [420, 340, 460, 260];

export function SignalWaveform({
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
      aria-label="Diagram: a live call waveform above a routing timeline showing a call being answered, understood, acted on, and escalated when needed, with an abstract live-transcript panel beneath."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 600" className="ss-srv2-signature__svg">
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
                    height: [
                      baseHeight,
                      baseHeight * 1.6,
                      baseHeight * 0.5,
                      baseHeight,
                    ],
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

          {/* Live transcript — abstract skeleton lines, never invented dialogue */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.6,
              delay: reducedMotion ? 0 : 1.2,
            }}
          >
            <text
              x="40"
              y="336"
              fill="var(--srv2-ink-faint)"
              fontSize="11"
              fontFamily="var(--ss-font-mono)"
              letterSpacing="0.06em"
            >
              LIVE TRANSCRIPT
            </text>
            <rect
              x="40"
              y="356"
              width="520"
              height="200"
              rx="14"
              fill="rgba(255,255,255,0.03)"
              stroke="var(--srv2-hairline)"
            />
            {transcriptLines.map((width, index) => (
              <m.rect
                key={index}
                x="66"
                y={392 + index * 38}
                width={width}
                height="10"
                rx="5"
                fill="var(--srv2-ink-faint)"
                initial={reducedMotion ? false : { opacity: 0 }}
                whileInView={{ opacity: [0, 1, 0.55] }}
                viewport={{ once: true }}
                transition={{
                  duration: reducedMotion ? 0.01 : 0.9,
                  delay: reducedMotion ? 0 : 1.6 + index * 0.32,
                  times: [0, 0.5, 1],
                }}
              />
            ))}
            {!reducedMotion ? (
              <m.rect
                x={66 + (transcriptLines[transcriptLines.length - 1] ?? 0) + 14}
                y={392 + (transcriptLines.length - 1) * 38}
                width="3"
                height="10"
                fill="var(--srv2-accent)"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
              />
            ) : null}
          </m.g>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
