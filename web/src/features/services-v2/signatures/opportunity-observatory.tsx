/**
 * AI Consulting signature — "Strategic Opportunity Observatory". A value ×
 * readiness quadrant chart, adapted from the classic 21st.dev quadrant-chart
 * pattern but rebuilt in our own tokenised, accessible, Motion-driven system,
 * closing with a priority-ranking readout that resolves the same four
 * opportunities into a single ordered decision list. Distinct animation
 * language: points settle into place with a small spring overshoot, rather
 * than a path draw, fan-out or lattice.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "./signature-chrome";

const opportunities = [
  {
    x: 430,
    y: 90,
    label: "Build now",
    decision: "High value · High readiness",
    color: "var(--srv2-accent)",
  },
  {
    x: 200,
    y: 90,
    label: "Prepare",
    decision: "High value · Low readiness",
    color: "var(--srv2-accent-2)",
  },
  {
    x: 430,
    y: 230,
    label: "Quick win",
    decision: "Low value · High readiness",
    color: "#a7f3d0",
  },
  {
    x: 200,
    y: 230,
    label: "Defer",
    decision: "Low value · Low readiness",
    color: "#94a3b8",
  },
];

const ranking = [
  { rank: 1, label: "Build now", color: "var(--srv2-accent)", score: 0.93 },
  { rank: 2, label: "Quick win", color: "#a7f3d0", score: 0.76 },
  { rank: 3, label: "Prepare", color: "var(--srv2-accent-2)", score: 0.54 },
  { rank: 4, label: "Defer", color: "#94a3b8", score: 0.24 },
];

export function OpportunityObservatory({
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
      aria-label="Diagram: a value versus readiness quadrant chart plotting four opportunities, mapped to build now, prepare, quick win and defer decisions, resolved below into a single ordered priority ranking."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 580" className="ss-srv2-signature__svg">
          {/* Axes */}
          <line
            x1="60"
            y1="160"
            x2="570"
            y2="160"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.5"
          />
          <line
            x1="315"
            y1="20"
            x2="315"
            y2="300"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.5"
          />

          {/* Quadrant fills */}
          <rect
            x="315"
            y="20"
            width="255"
            height="140"
            fill="color-mix(in srgb, var(--srv2-accent) 5%, transparent)"
          />
          <rect
            x="60"
            y="20"
            width="255"
            height="140"
            fill="color-mix(in srgb, var(--srv2-accent-2) 4%, transparent)"
          />

          {/* Axis labels */}
          <text
            x="315"
            y="14"
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="11"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.06em"
          >
            HIGH VALUE
          </text>
          <text
            x="315"
            y="315"
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="11"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.06em"
          >
            LOW VALUE
          </text>
          <text
            x="66"
            y="164"
            textAnchor="start"
            fill="var(--srv2-ink-faint)"
            fontSize="11"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.04em"
          >
            LOW READINESS
          </text>
          <text
            x="564"
            y="164"
            textAnchor="end"
            fill="var(--srv2-ink-faint)"
            fontSize="11"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.04em"
          >
            HIGH READINESS
          </text>

          {/* Plotted opportunities */}
          {opportunities.map((point, index) =>
            reducedMotion ? (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  fill={point.color}
                  opacity="0.9"
                />
                <text
                  x={point.x}
                  y={point.y - 22}
                  textAnchor="middle"
                  fill="var(--ss-v2-chrome)"
                  fontSize="13"
                  fontWeight="600"
                  fontFamily="var(--ss-font-display)"
                >
                  {point.label}
                </text>
                <text
                  x={point.x}
                  y={point.y + 32}
                  textAnchor="middle"
                  fill="var(--srv2-ink-faint)"
                  fontSize="10.5"
                  fontFamily="var(--ss-font-mono)"
                >
                  {point.decision}
                </text>
              </g>
            ) : (
              <m.g
                key={point.label}
                initial={{ opacity: 0, scale: 0.3 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 14,
                  delay: index * 0.15,
                }}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  fill={point.color}
                  opacity="0.9"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  fill="none"
                  stroke={point.color}
                  strokeWidth="1.5"
                  opacity="0.4"
                >
                  <animate
                    attributeName="r"
                    values="12;22;12"
                    dur="2.8s"
                    repeatCount="indefinite"
                    begin={`${String(index * 0.4)}s`}
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0;0.4"
                    dur="2.8s"
                    repeatCount="indefinite"
                    begin={`${String(index * 0.4)}s`}
                  />
                </circle>
                <text
                  x={point.x}
                  y={point.y - 22}
                  textAnchor="middle"
                  fill="var(--ss-v2-chrome)"
                  fontSize="13"
                  fontWeight="600"
                  fontFamily="var(--ss-font-display)"
                >
                  {point.label}
                </text>
                <text
                  x={point.x}
                  y={point.y + 32}
                  textAnchor="middle"
                  fill="var(--srv2-ink-faint)"
                  fontSize="10.5"
                  fontFamily="var(--ss-font-mono)"
                >
                  {point.decision}
                </text>
              </m.g>
            ),
          )}

          {/* Priority ranking — the same four opportunities, resolved to one order */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.6,
              delay: reducedMotion ? 0 : 1.3,
            }}
          >
            <line
              x1="60"
              y1="340"
              x2="570"
              y2="340"
              stroke="var(--srv2-hairline)"
              strokeWidth="1"
              opacity="0.6"
            />
            <text
              x="60"
              y="368"
              fill="var(--srv2-ink-faint)"
              fontSize="11"
              fontFamily="var(--ss-font-mono)"
              letterSpacing="0.06em"
            >
              PRIORITY RANKING
            </text>
            {ranking.map((item, index) => {
              const trackWidth = 340;
              const fillWidth = trackWidth * item.score;
              const y = 400 + index * 42;
              return (
                <g key={item.label}>
                  <circle
                    cx="76"
                    cy={y - 4}
                    r="12"
                    fill="var(--ss-v2-void-black)"
                    stroke={item.color}
                    strokeWidth="1.5"
                  />
                  <text
                    x="76"
                    y={y}
                    textAnchor="middle"
                    fill="var(--ss-v2-chrome)"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="var(--ss-font-display)"
                  >
                    {item.rank}
                  </text>
                  <text
                    x="100"
                    y={y}
                    fill="var(--srv2-ink-soft)"
                    fontSize="12.5"
                    fontFamily="var(--ss-font-body)"
                  >
                    {item.label}
                  </text>
                  <rect
                    x="230"
                    y={y - 10}
                    width={trackWidth}
                    height="8"
                    rx="4"
                    fill="var(--srv2-hairline)"
                  />
                  {!reducedMotion ? (
                    <m.rect
                      x="230"
                      y={y - 10}
                      height="8"
                      rx="4"
                      fill={item.color}
                      initial={{ width: 0 }}
                      whileInView={{ width: fillWidth }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.1,
                        delay: 1.6 + index * 0.15,
                        ease: "easeOut",
                      }}
                    />
                  ) : (
                    <rect
                      x="230"
                      y={y - 10}
                      width={fillWidth}
                      height="8"
                      rx="4"
                      fill={item.color}
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
