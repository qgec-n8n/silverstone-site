/**
 * AI Consulting signature — "Strategic Opportunity Observatory". A value ×
 * readiness quadrant chart, adapted from the classic 21st.dev quadrant-chart
 * pattern but rebuilt in our own tokenised, accessible, Motion-driven system.
 * Each plotted opportunity maps directly to a build/configure/defer decision —
 * distinct animation language: points settle into place with a small spring
 * overshoot, rather than a path draw, fan-out or lattice.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { SignatureChrome } from "./signature-chrome";

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

export function OpportunityObservatory() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: a value versus readiness quadrant chart plotting four opportunities, mapped to build now, prepare, quick win and defer decisions."
    >
      <m.svg viewBox="0 0 600 320" className="ss-srv2-signature__svg">
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
      </m.svg>
      <SignatureChrome />
    </div>
  );
}
