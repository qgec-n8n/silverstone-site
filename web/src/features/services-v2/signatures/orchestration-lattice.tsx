/**
 * AI Automation signature — "Operational Orchestration Lattice". Nine nodes in
 * a three-row grid (Trigger/Condition/Agent over API/Database/Approval over
 * Customer notified/Record updated/Team alerted) with row and column
 * connectors, plus a central observability hub radiating faint spokes to
 * every node — deliberately not a single linear nodes-and-arrows chain. The
 * third row extends the lattice into genuine downstream outcomes, not just
 * padding. Distinct animation language: a lattice of simultaneous
 * relationships rather than one path, one waveform, or one fan-out.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "./signature-chrome";

const TIER_COLUMNS = [90, 300, 510];

/**
 * A fresh random column at each of the 3 tiers, so the signal threads a
 * different set of nodes every cycle — "orchestration" reads as genuinely
 * flexible routing (any trigger can reach any outcome) rather than one
 * column locked top-to-bottom forever.
 */
function randomTierPath(): [number, number, number] {
  const pick = () =>
    TIER_COLUMNS[Math.floor(Math.random() * TIER_COLUMNS.length)] ?? 90;
  return [pick(), pick(), pick()];
}

const topRow = [
  { label: "Trigger", x: 90 },
  { label: "Condition", x: 300 },
  { label: "Agent judgment", x: 510 },
];
const middleRow = [
  { label: "API", x: 90 },
  { label: "Database", x: 300 },
  { label: "Human approval", x: 510 },
];
const outcomeRow = [
  { label: "Customer notified", x: 90 },
  { label: "Record updated", x: 300 },
  { label: "Team alerted", x: 510 },
];

const TOP_Y = 70;
const MIDDLE_Y = 230;
const OUTCOME_Y = 460;
const HUB = { x: 300, y: 150 };

export function OrchestrationLattice({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const allNodes = [
    ...topRow.map((n) => ({ ...n, y: TOP_Y })),
    ...middleRow.map((n) => ({ ...n, y: MIDDLE_Y })),
    ...outcomeRow.map((n) => ({ ...n, y: OUTCOME_Y })),
  ];
  const [tierPath, setTierPath] = useState<[number, number, number]>(randomTierPath);
  const [routeCycle, setRouteCycle] = useState(0);

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: a three-tier lattice running from trigger, condition and agent judgment, through API, database and human approval, down to customer notified, record updated and team alerted — all monitored by a central observability hub with connections to every node."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 600" className="ss-srv2-signature__svg">
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
              opacity="0.35"
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
            y1={MIDDLE_Y}
            x2="510"
            y2={MIDDLE_Y}
            stroke="var(--srv2-hairline)"
            strokeWidth="2"
          />
          <line
            x1="90"
            y1={OUTCOME_Y}
            x2="510"
            y2={OUTCOME_Y}
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
              y2={OUTCOME_Y}
              stroke="var(--srv2-hairline)"
              strokeWidth="2"
            />
          ))}

          {/* Travelling signal: happy path down through all three tiers */}
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
                  repeatDelay: 1.6,
                  ease: "easeInOut",
                }}
                style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent))" }}
              />
              <m.circle
                key={routeCycle}
                r="5"
                fill="var(--srv2-accent-2)"
                initial={{ cx: tierPath[0], cy: TOP_Y, opacity: 0 }}
                animate={{
                  cx: tierPath,
                  cy: [TOP_Y, MIDDLE_Y, OUTCOME_Y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.8,
                  delay: routeCycle === 0 ? 2.2 : 0,
                  ease: "easeInOut",
                }}
                onAnimationComplete={() => {
                  window.setTimeout(() => {
                    setTierPath(randomTierPath());
                    setRouteCycle((cycle) => cycle + 1);
                  }, 2400);
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
              y={HUB.y + 46}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="14"
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
              viewport={{ once: true, amount: 0.4 }}
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
                stroke={
                  node.y === OUTCOME_Y ? "var(--srv2-accent)" : "var(--srv2-accent-2)"
                }
                strokeWidth="2"
              />
              <text
                x={node.x}
                y={node.y === TOP_Y ? node.y - 22 : node.y + 34}
                textAnchor="middle"
                fill="var(--srv2-ink-soft)"
                fontSize="15"
                fontFamily="var(--ss-font-mono)"
              >
                {node.label}
              </text>
            </m.g>
          ))}

          {/* Tier labels */}
          <text
            x="40"
            y={TOP_Y - 40}
            fill="var(--srv2-ink-faint)"
            fontSize="14"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.08em"
          >
            DECISION
          </text>
          <text
            x="40"
            y={OUTCOME_Y - 40}
            fill="var(--srv2-ink-faint)"
            fontSize="14"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.08em"
          >
            OUTCOME
          </text>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
