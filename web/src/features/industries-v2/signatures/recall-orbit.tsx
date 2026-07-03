/**
 * Dental Practices signature — "Patient-Admin Recall Orbit". Patients orbit
 * the practice on two rings (routine admin inner, recall-due outer). Each
 * cycle one due patient is drawn off the orbit into the "Booked" dock; the
 * clinical-stop shield at the centre never rotates — clinical judgement is
 * the fixed point of the system. Distinct language: orbital mechanics, not
 * lanes or belts.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

const CENTER = { x: 300, y: 240 };
const INNER_R = 88;
const OUTER_R = 158;
const DOCK = { x: 460, y: 430 };

function orbitDots(count: number, radius: number, phase = 0) {
  return Array.from({ length: count }, (_, index) => {
    const angle = phase + (index / count) * Math.PI * 2;
    return {
      x: CENTER.x + radius * Math.cos(angle),
      y: CENTER.y + radius * Math.sin(angle),
    };
  });
}

export function RecallOrbit({ label, metrics }: { label: string; metrics: string[] }) {
  const reducedMotion = useReducedMotion() ?? false;
  const innerDots = orbitDots(6, INNER_R, 0.5);
  const outerDots = orbitDots(8, OUTER_R);

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: patients orbit the practice on routine-admin and recall-due rings; due patients are drawn into a booked dock while the clinical-judgement shield remains fixed at the centre."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        {/* Tight viewBox around the drawn content (not the legacy 600×600
            canvas) so the diagram — and every label — renders ~15% larger
            for the same stage size. */}
        <m.svg viewBox="30 40 540 430" className="ss-srv2-signature__svg">
          <defs>
            <radialGradient id="ind2-orbit-glow">
              <stop offset="0%" stopColor="var(--srv2-accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--srv2-accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbit rings */}
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r={INNER_R}
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
          />
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r={OUTER_R}
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
            strokeDasharray="4 7"
          />
          <text
            x={CENTER.x}
            y={CENTER.y - OUTER_R - 14}
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="15"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.08em"
          >
            RECALL DUE
          </text>
          <text
            x={CENTER.x}
            y={CENTER.y - INNER_R - 12}
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="15"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.08em"
          >
            ROUTINE ADMIN
          </text>

          {/* Rotating orbit groups */}
          <m.g
            style={{ transformOrigin: "300px 240px" }}
            animate={reducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
          >
            {outerDots.map((dot, index) => (
              <circle
                key={`outer-${String(index)}`}
                cx={dot.x}
                cy={dot.y}
                r={index === 0 ? 8 : 5.5}
                fill={
                  index === 0
                    ? "var(--srv2-accent)"
                    : "color-mix(in srgb, var(--srv2-accent) 45%, var(--ss-v2-void-black))"
                }
                stroke="var(--srv2-accent)"
                strokeWidth="1.2"
              />
            ))}
          </m.g>
          <m.g
            style={{ transformOrigin: "300px 240px" }}
            animate={reducedMotion ? {} : { rotate: -360 }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          >
            {innerDots.map((dot, index) => (
              <circle
                key={`inner-${String(index)}`}
                cx={dot.x}
                cy={dot.y}
                r="5"
                fill="color-mix(in srgb, var(--srv2-accent-2) 45%, var(--ss-v2-void-black))"
                stroke="var(--srv2-accent-2)"
                strokeWidth="1.2"
              />
            ))}
          </m.g>

          {/* Clinical shield — fixed centre */}
          <circle cx={CENTER.x} cy={CENTER.y} r="52" fill="url(#ind2-orbit-glow)" />
          <m.g
            initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.3 }}
          >
            <path
              d={`M ${String(CENTER.x)} ${String(CENTER.y - 30)} l 24 10 v 18 c 0 16 -10 26 -24 32 c -14 -6 -24 -16 -24 -32 v -18 Z`}
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent)"
              strokeWidth="2"
            />
            <path
              d={`M ${String(CENTER.x - 9)} ${String(CENTER.y + 2)} l 7 7 l 13 -14`}
              fill="none"
              stroke="var(--srv2-accent)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x={CENTER.x}
              y={CENTER.y + 58}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="15"
              fontFamily="var(--ss-font-mono)"
              letterSpacing="0.06em"
            >
              CLINICAL JUDGEMENT
            </text>
            <text
              x={CENTER.x}
              y={CENTER.y + 78}
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="13.5"
              fontFamily="var(--ss-font-mono)"
            >
              never automated
            </text>
          </m.g>

          {/* Recall capture: due patient drawn into the booked dock */}
          {!reducedMotion ? (
            <m.circle
              r="7"
              fill="var(--srv2-accent)"
              style={{ filter: "drop-shadow(0 0 8px var(--srv2-accent))" }}
              initial={{
                cx: CENTER.x + OUTER_R,
                cy: CENTER.y,
                opacity: 0,
              }}
              animate={{
                cx: [CENTER.x + OUTER_R, 420, DOCK.x],
                cy: [CENTER.y, 340, DOCK.y - 24],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatDelay: 3.2,
                ease: "easeInOut",
              }}
            />
          ) : null}

          {/* Static guides: orbit → booked dock, shield → escalation */}
          <path
            d={`M ${String(CENTER.x + OUTER_R - 6)} ${String(CENTER.y + 24)} C 440 330, ${String(DOCK.x - 20)} 360, ${String(DOCK.x)} ${String(DOCK.y - 26)}`}
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
            strokeDasharray="5 6"
            opacity="0.7"
          />
          <path
            d={`M ${String(CENTER.x - 34)} ${String(CENTER.y + 34)} C 200 330, 160 360, 140 ${String(DOCK.y - 26)}`}
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
            strokeDasharray="5 6"
            opacity="0.7"
          />

          {/* Booked dock */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.45 }}
          >
            <rect
              x={DOCK.x - 100}
              y={DOCK.y - 26}
              width="200"
              height="56"
              rx="12"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent)"
              strokeWidth="1.8"
              style={{
                filter:
                  "drop-shadow(0 0 10px color-mix(in srgb, var(--srv2-accent) 30%, transparent))",
              }}
            />
            <text
              x={DOCK.x}
              y={DOCK.y - 2}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="16"
              fontFamily="var(--ss-font-mono)"
            >
              Recall booked
            </text>
            <text
              x={DOCK.x}
              y={DOCK.y + 18}
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="13.5"
              fontFamily="var(--ss-font-mono)"
            >
              owner assigned · logged
            </text>
          </m.g>

          {/* Escalation note */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.55 }}
          >
            <rect
              x="40"
              y={DOCK.y - 26}
              width="200"
              height="56"
              rx="12"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent-2)"
              strokeWidth="1.8"
              style={{
                filter:
                  "drop-shadow(0 0 10px color-mix(in srgb, var(--srv2-accent-2) 26%, transparent))",
              }}
            />
            <text
              x="140"
              y={DOCK.y - 2}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="16"
              fontFamily="var(--ss-font-mono)"
            >
              Clinical language
            </text>
            <text
              x="140"
              y={DOCK.y + 18}
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="13.5"
              fontFamily="var(--ss-font-mono)"
            >
              → escalated to practice
            </text>
          </m.g>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
