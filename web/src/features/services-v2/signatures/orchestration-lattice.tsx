/**
 * AI Automation signature — "Operational Orchestration Lattice". Six nodes in
 * a two-row grid (Trigger/Condition/Agent over API/Database/Approval) with row
 * and column connectors, plus a central observability hub radiating faint
 * spokes to every node — deliberately not a single linear nodes-and-arrows
 * chain. Distinct animation language: a lattice of simultaneous relationships
 * rather than one path, one waveform, or one fan-out.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

const topRow = [
  { label: "Trigger", x: 90 },
  { label: "Condition", x: 300 },
  { label: "Agent judgement", x: 510 },
];
const bottomRow = [
  { label: "API", x: 90 },
  { label: "Database", x: 300 },
  { label: "Human approval", x: 510 },
];

const TOP_Y = 70;
const BOTTOM_Y = 230;
const HUB = { x: 300, y: 150 };

export function OrchestrationLattice() {
  const reducedMotion = useReducedMotion() ?? false;
  const allNodes = [
    ...topRow.map((n) => ({ ...n, y: TOP_Y })),
    ...bottomRow.map((n) => ({ ...n, y: BOTTOM_Y })),
  ];

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: a lattice of trigger, condition, agent judgement, API, database and human approval nodes, monitored by a central observability hub with connections to every node."
    >
      <m.svg viewBox="0 0 600 320" className="ss-srv2-signature__svg">
        <defs>
          <linearGradient id="srv2-lattice-accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--srv2-accent)" />
            <stop offset="100%" stopColor="var(--srv2-accent-2)" />
          </linearGradient>
        </defs>

        {/* Observability spokes — faint, radiating from the hub to every node */}
        {allNodes.map((node) => (
          <line
            key={`spoke-${node.label}`}
            x1={HUB.x}
            y1={HUB.y}
            x2={node.x}
            y2={node.y}
            stroke="var(--srv2-hairline)"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}

        {/* Row connectors */}
        <line
          x1="90"
          y1={TOP_Y}
          x2="510"
          y2={TOP_Y}
          stroke="var(--srv2-hairline)"
          strokeWidth="2"
        />
        <line
          x1="90"
          y1={BOTTOM_Y}
          x2="510"
          y2={BOTTOM_Y}
          stroke="var(--srv2-hairline)"
          strokeWidth="2"
        />
        {/* Column connectors */}
        {[90, 300, 510].map((x) => (
          <line
            key={`col-${String(x)}`}
            x1={x}
            y1={TOP_Y}
            x2={x}
            y2={BOTTOM_Y}
            stroke="var(--srv2-hairline)"
            strokeWidth="2"
          />
        ))}

        {/* Travelling signal: happy path across the top row, down to approval */}
        {!reducedMotion ? (
          <>
            <m.circle
              cy={TOP_Y}
              r="5"
              fill="var(--srv2-accent)"
              initial={{ cx: 90, opacity: 0 }}
              animate={{ cx: [90, 300, 510], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatDelay: 0.5,
                ease: "easeInOut",
              }}
              style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent))" }}
            />
            <m.circle
              cx="510"
              r="5"
              fill="var(--srv2-accent-2)"
              initial={{ cy: TOP_Y, opacity: 0 }}
              animate={{ cy: [TOP_Y, BOTTOM_Y], opacity: [0, 1, 0] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                repeatDelay: 2,
                delay: 2.2,
                ease: "easeInOut",
              }}
              style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent-2))" }}
            />
          </>
        ) : null}

        {/* Observability hub */}
        <m.g
          initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: reducedMotion ? 0.01 : 0.5,
            delay: reducedMotion ? 0 : 0.5,
          }}
        >
          {!reducedMotion ? (
            <m.circle
              cx={HUB.x}
              cy={HUB.y}
              r="30"
              fill="url(#srv2-lattice-accent)"
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.26, 0.1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <circle
              cx={HUB.x}
              cy={HUB.y}
              r="30"
              fill="url(#srv2-lattice-accent)"
              opacity="0.14"
            />
          )}
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r="18"
            fill="var(--ss-v2-void-black)"
            stroke="var(--srv2-accent)"
            strokeWidth="2"
          />
          <text
            x={HUB.x}
            y={HUB.y + 44}
            textAnchor="middle"
            fill="var(--ss-v2-chrome)"
            fontSize="11"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.04em"
          >
            OBSERVABILITY
          </text>
        </m.g>

        {/* Nodes */}
        {allNodes.map((node, index) => (
          <m.g
            key={node.label}
            initial={
              reducedMotion ? false : { opacity: 0, y: node.y === TOP_Y ? -10 : 10 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.5,
              delay: reducedMotion ? 0 : index * 0.08,
            }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="10"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent-2)"
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y === TOP_Y ? node.y - 20 : node.y + 32}
              textAnchor="middle"
              fill="var(--srv2-ink-soft)"
              fontSize="12"
              fontFamily="var(--ss-font-mono)"
            >
              {node.label}
            </text>
          </m.g>
        ))}
      </m.svg>
    </div>
  );
}
