/**
 * Web Design & Development signature — "Conversion Architecture / Living
 * Interface". A desktop interface assembles from planes, a phone frame shows the
 * responsive reflow, a conversion path (Discover → Experience → Convert →
 * Optimise) carries a travelling signal, and a performance-signal row of three
 * animated rings closes out the panel. No magnifying glass; unrelated to the
 * removed ConversionPathLens prototype. Reduced-motion renders the completed
 * state with no looping animation.
 */
import { useReducedMotion, type Variants } from "motion/react";
import * as m from "motion/react-m";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "./signature-chrome";

const stages = [
  { x: 96, label: "Discover" },
  { x: 236, label: "Experience" },
  { x: 380, label: "Convert" },
  { x: 516, label: "Optimise" },
];

const RING_RADIUS = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const signals = [
  { x: 150, fill: 0.94, label: "Speed" },
  { x: 300, fill: 0.97, label: "SEO" },
  { x: 450, fill: 0.91, label: "Access." },
];

const assemble: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const plane: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function ConversionArchitecture({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const animateProps = reducedMotion
    ? { initial: "show" as const }
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, amount: 0.4 },
      };

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: a website interface assembles across desktop and mobile, feeding a conversion path from discover to experience to convert to optimise, closing with speed, SEO and accessibility signal rings."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        <m.svg
          viewBox="0 0 600 600"
          className="ss-srv2-signature__svg"
          variants={assemble}
          {...animateProps}
        >
          <defs>
            <linearGradient id="srv2-conv-accent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--srv2-accent)" />
              <stop offset="100%" stopColor="var(--srv2-accent-2)" />
            </linearGradient>
            <radialGradient id="srv2-conv-glow" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="var(--srv2-accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--srv2-accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="600" height="600" fill="url(#srv2-conv-glow)" />

          {/* Desktop frame */}
          <m.g variants={plane}>
            <rect
              x="40"
              y="42"
              width="372"
              height="236"
              rx="16"
              fill="rgba(12,18,26,0.72)"
              stroke="var(--srv2-hairline)"
            />
            <line x1="40" y1="76" x2="412" y2="76" stroke="var(--srv2-hairline)" />
            <circle cx="62" cy="59" r="4" fill="var(--srv2-accent)" opacity="0.8" />
            <circle cx="78" cy="59" r="4" fill="var(--srv2-ink-faint)" opacity="0.5" />
            <circle cx="94" cy="59" r="4" fill="var(--srv2-ink-faint)" opacity="0.5" />
          </m.g>

          {/* Desktop content planes */}
          <m.g variants={plane}>
            <rect
              x="64"
              y="98"
              width="150"
              height="14"
              rx="7"
              fill="var(--srv2-ink)"
              opacity="0.85"
            />
            <rect
              x="64"
              y="122"
              width="230"
              height="8"
              rx="4"
              fill="var(--srv2-ink-faint)"
            />
            <rect
              x="64"
              y="138"
              width="200"
              height="8"
              rx="4"
              fill="var(--srv2-ink-faint)"
            />
          </m.g>
          <m.g variants={plane}>
            <rect
              x="64"
              y="168"
              width="150"
              height="86"
              rx="10"
              fill="rgba(255,255,255,0.03)"
              stroke="var(--srv2-hairline)"
            />
            <rect
              x="230"
              y="168"
              width="164"
              height="86"
              rx="10"
              fill="rgba(255,255,255,0.03)"
              stroke="var(--srv2-hairline)"
            />
          </m.g>
          <m.g variants={plane}>
            <rect
              x="64"
              y="214"
              width="92"
              height="26"
              rx="13"
              fill="url(#srv2-conv-accent)"
            />
          </m.g>

          {/* Phone frame — responsive reflow */}
          <m.g variants={plane}>
            <rect
              x="446"
              y="120"
              width="118"
              height="204"
              rx="20"
              fill="rgba(12,18,26,0.82)"
              stroke="var(--srv2-hairline)"
            />
            <rect
              x="488"
              y="132"
              width="34"
              height="5"
              rx="2.5"
              fill="var(--srv2-ink-faint)"
            />
            <rect
              x="462"
              y="156"
              width="86"
              height="10"
              rx="5"
              fill="var(--srv2-ink)"
              opacity="0.85"
            />
            <rect
              x="462"
              y="176"
              width="72"
              height="6"
              rx="3"
              fill="var(--srv2-ink-faint)"
            />
            <rect
              x="462"
              y="196"
              width="86"
              height="46"
              rx="8"
              fill="rgba(255,255,255,0.03)"
              stroke="var(--srv2-hairline)"
            />
            <rect
              x="462"
              y="256"
              width="86"
              height="46"
              rx="8"
              fill="rgba(255,255,255,0.03)"
              stroke="var(--srv2-hairline)"
            />
            <rect
              x="462"
              y="300"
              width="60"
              height="18"
              rx="9"
              fill="url(#srv2-conv-accent)"
            />
          </m.g>

          {/* Conversion path */}
          <m.g variants={plane}>
            <line
              x1="96"
              y1="360"
              x2="516"
              y2="360"
              stroke="var(--srv2-hairline)"
              strokeWidth="2"
            />
            {!reducedMotion ? (
              <m.line
                x1="96"
                y1="360"
                x2="516"
                y2="360"
                stroke="url(#srv2-conv-accent)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: "easeInOut", delay: 0.5 }}
              />
            ) : (
              <line
                x1="96"
                y1="360"
                x2="516"
                y2="360"
                stroke="url(#srv2-conv-accent)"
                strokeWidth="2"
              />
            )}
            {stages.map((stage) => (
              <g key={stage.label}>
                <circle
                  cx={stage.x}
                  cy={360}
                  r="7"
                  fill="var(--ss-v2-void-black)"
                  stroke="var(--srv2-accent)"
                  strokeWidth="2"
                />
                <text
                  x={stage.x}
                  y={394}
                  textAnchor="middle"
                  fill="var(--srv2-ink-soft)"
                  fontSize="17"
                  fontFamily="var(--ss-font-mono)"
                >
                  {stage.label}
                </text>
              </g>
            ))}
            {!reducedMotion ? (
              <m.circle
                cy={360}
                r="5"
                fill="var(--srv2-accent)"
                initial={{ cx: 96, opacity: 0 }}
                animate={{
                  cx: [96, 236, 380, 516],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.6,
                  delay: 1.4,
                }}
                style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent))" }}
              />
            ) : null}
          </m.g>

          {/* Performance signals — three animated progress rings */}
          <m.g variants={plane}>
            <line
              x1="40"
              y1="450"
              x2="564"
              y2="450"
              stroke="var(--srv2-hairline)"
              strokeWidth="1"
              opacity="0.6"
            />
            <text
              x="40"
              y="480"
              fill="var(--srv2-ink-faint)"
              fontSize="14"
              fontFamily="var(--ss-font-mono)"
              letterSpacing="0.06em"
            >
              PERFORMANCE SIGNALS
            </text>
            {signals.map((signal, index) => {
              const offset = RING_CIRCUMFERENCE * (1 - signal.fill);
              return (
                <g key={signal.label} transform={`translate(${String(signal.x)}, 552)`}>
                  <circle
                    r={RING_RADIUS}
                    fill="none"
                    stroke="var(--srv2-hairline)"
                    strokeWidth="6"
                  />
                  {!reducedMotion ? (
                    <m.circle
                      r={RING_RADIUS}
                      fill="none"
                      stroke="url(#srv2-conv-accent)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      transform="rotate(-90)"
                      style={{ filter: "drop-shadow(0 0 5px var(--srv2-accent))" }}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: signal.fill }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.3,
                        delay: 1.7 + index * 0.15,
                        ease: "easeOut",
                      }}
                    />
                  ) : (
                    <circle
                      r={RING_RADIUS}
                      fill="none"
                      stroke="url(#srv2-conv-accent)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      transform="rotate(-90)"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={offset}
                    />
                  )}
                  <text
                    textAnchor="middle"
                    y={RING_RADIUS + 27}
                    fill="var(--srv2-ink-faint)"
                    fontSize="15"
                    fontFamily="var(--ss-font-mono)"
                    letterSpacing="0.02em"
                  >
                    {signal.label}
                  </text>
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
