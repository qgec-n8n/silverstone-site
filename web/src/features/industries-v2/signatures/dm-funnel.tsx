/**
 * Fitness Coaches signature — "DM-to-Consultation Funnel". Scattered message
 * bubbles drift into the funnel mouth; transparent fit-questions narrow the
 * stream; a consultation slot crystallises at the throat; and the coach-brief
 * card assembles line by line beside it. A sensitive-disclosure bubble
 * visibly bypasses the funnel straight to the coach. Distinct language:
 * gravity and filtration, not routing or orbits.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

const FUNNEL_TOP = 120;
const FUNNEL_MID = 250;
const FUNNEL_THROAT = 330;
const BUBBLES = [
  { x: 150, delay: 0 },
  { x: 240, delay: 0.9 },
  { x: 330, delay: 1.7 },
  { x: 415, delay: 2.6 },
];
const BRIEF_LINES = ["Goal · strength", "Format · online", "Slot · Thu 18:00"];

export function DmFunnel({ label, metrics }: { label: string; metrics: string[] }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: scattered direct messages fall into a qualification funnel with transparent fit questions; a consultation is booked at the throat and a concise coach brief assembles, while sensitive disclosures bypass the funnel straight to the coach."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        {/* Tight viewBox around the drawn content so the funnel and its labels
            render larger for the same stage size. */}
        <m.svg viewBox="36 10 536 522" className="ss-srv2-signature__svg">
          <defs>
            <linearGradient id="ind2-funnel-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--srv2-accent)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--srv2-accent-2)" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          {/* Funnel walls */}
          <path
            d={`M 130 ${String(FUNNEL_TOP)} L 470 ${String(FUNNEL_TOP)} L 340 ${String(FUNNEL_MID)} L 340 ${String(FUNNEL_THROAT)} L 260 ${String(FUNNEL_THROAT)} L 260 ${String(FUNNEL_MID)} Z`}
            fill="url(#ind2-funnel-accent)"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.6"
          />
          {/* Fit-question sieve lines */}
          {[168, 205].map((y, index) => (
            <g key={y}>
              <line
                x1={130 + (y - FUNNEL_TOP) * 2.6}
                y1={y}
                x2={470 - (y - FUNNEL_TOP) * 2.6}
                y2={y}
                stroke="var(--srv2-accent)"
                strokeWidth="1.3"
                strokeDasharray="6 6"
                opacity="0.7"
              />
              {/* Anchored just left of the funnel wall — the old x=486 spot
                  ran the longer label past the drawable edge and into the
                  bypass curve. */}
              <text
                x={130 + (y - FUNNEL_TOP) - 12}
                y={y + 4}
                textAnchor="end"
                fill="var(--srv2-ink-faint)"
                fontSize="13.5"
                fontFamily="var(--ss-font-mono)"
              >
                {index === 0 ? "Goal + format" : "Readiness + timing"}
              </text>
            </g>
          ))}

          {/* Falling DM bubbles */}
          {!reducedMotion
            ? BUBBLES.map((bubble) => (
                <m.g
                  key={bubble.x}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [40, 90, 150, 215],
                    x: [0, 0, (300 - bubble.x) * 0.35, (300 - bubble.x) * 0.75],
                  }}
                  transition={{
                    duration: 3.4,
                    delay: bubble.delay,
                    repeat: Infinity,
                    repeatDelay: 2.2,
                    ease: "easeIn",
                  }}
                >
                  <rect
                    x={bubble.x - 26}
                    y="18"
                    width="52"
                    height="26"
                    rx="12"
                    fill="var(--ss-v2-void-black)"
                    stroke="var(--srv2-accent-2)"
                    strokeWidth="1.4"
                  />
                  <circle
                    cx={bubble.x - 10}
                    cy="31"
                    r="2"
                    fill="var(--srv2-ink-faint)"
                  />
                  <circle cx={bubble.x} cy="31" r="2" fill="var(--srv2-ink-faint)" />
                  <circle
                    cx={bubble.x + 10}
                    cy="31"
                    r="2"
                    fill="var(--srv2-ink-faint)"
                  />
                </m.g>
              ))
            : null}

          {/* Sensitive-disclosure bypass */}
          <m.path
            d="M 520 60 C 560 180, 560 320, 480 430"
            fill="none"
            stroke="var(--srv2-accent-2)"
            strokeWidth="2"
            strokeDasharray="7 7"
            initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.85 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.6, delay: reducedMotion ? 0 : 0.6 }}
          />
          <text
            x="560"
            y="44"
            textAnchor="end"
            fill="var(--srv2-ink-faint)"
            fontSize="13"
            fontFamily="var(--ss-font-mono)"
          >
            health disclosure
          </text>
          <text
            x="560"
            y="62"
            textAnchor="end"
            fill="var(--srv2-ink-faint)"
            fontSize="13"
            fontFamily="var(--ss-font-mono)"
          >
            → coach, directly
          </text>

          {/* Consultation slot at the throat */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: reducedMotion ? 0 : 0.5 }}
          >
            <rect
              x="200"
              y={FUNNEL_THROAT + 26}
              width="200"
              height="56"
              rx="12"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent)"
              strokeWidth="2"
            />
            {!reducedMotion ? (
              <m.rect
                x="200"
                y={FUNNEL_THROAT + 26}
                width="200"
                height="56"
                rx="12"
                fill="none"
                stroke="var(--srv2-accent)"
                strokeWidth="2"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.12, 0.5] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ filter: "blur(4px)" }}
              />
            ) : null}
            <text
              x="300"
              y={FUNNEL_THROAT + 50}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="15.5"
              fontFamily="var(--ss-font-mono)"
            >
              Consultation booked
            </text>
            <text
              x="300"
              y={FUNNEL_THROAT + 70}
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
            >
              real calendar slots only
            </text>
          </m.g>

          {/* Brief feeds the consultation slot */}
          <line
            x1="196"
            y1={FUNNEL_THROAT + 56}
            x2="200"
            y2={FUNNEL_THROAT + 54}
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
            strokeDasharray="4 5"
            opacity="0.8"
          />

          {/* Coach brief assembling */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.6 }}
          >
            <rect
              x="40"
              y={FUNNEL_THROAT + 8}
              width="156"
              height="100"
              rx="12"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-hairline)"
              strokeWidth="1.5"
            />
            <text
              x="118"
              y={FUNNEL_THROAT + 32}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="14"
              fontFamily="var(--ss-font-mono)"
              letterSpacing="0.06em"
            >
              COACH BRIEF
            </text>
            {BRIEF_LINES.map((line, index) => (
              <m.text
                key={line}
                x="54"
                y={FUNNEL_THROAT + 56 + index * 20}
                fill="var(--srv2-ink-soft)"
                fontSize="13"
                fontFamily="var(--ss-font-mono)"
                initial={reducedMotion ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.4,
                  delay: reducedMotion ? 0 : 0.9 + index * 0.25,
                }}
              >
                {line}
              </m.text>
            ))}
          </m.g>

          <text
            x="300"
            y="520"
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="13.5"
            fontFamily="var(--ss-font-mono)"
          >
            Transparent questions · easy human route · the coach decides
          </text>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
