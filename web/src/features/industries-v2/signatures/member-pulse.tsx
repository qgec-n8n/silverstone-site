/**
 * Gyms & Fitness Studios signature — "Member Pulse Grid". Attendance heat
 * rows for member cohorts pulse week by week; the at-risk row dims, gets
 * flagged, receives a follow-up pulse and re-ignites — while the
 * trial-to-member conversion dial fills on the right and the duty-of-care
 * stop sits beneath. Distinct language: a living attendance heat-map, not a
 * board, radar or timeline.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

const WEEKS = 8;
/* 112, not the old 90: the longest row label ("New joiners") is right-anchored
   at GRID_X - 12 and was starting past the drawable left edge. */
const GRID_X = 112;
const GRID_Y = 120;
const CELL_W = 42;
const CELL_H = 34;
const ROWS = [
  { label: "Active", heat: [1, 1, 0.8, 1, 0.9, 1, 1, 0.9] },
  { label: "New joiners", heat: [0, 0, 0.6, 0.8, 0.9, 1, 0.9, 1] },
  { label: "At risk", heat: [0.9, 0.8, 0.6, 0.4, 0.2, 0.1, 0, 0] },
  { label: "Trials", heat: [0.5, 0.6, 0.5, 0.7, 0.6, 0.8, 0.7, 0.9] },
];
const DIAL = { x: 505, y: 190, r: 44 };

export function MemberPulse({ label, metrics }: { label: string; metrics: string[] }) {
  const reducedMotion = useReducedMotion() ?? false;
  const [rescued, setRescued] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }
    const timer = window.setTimeout(() => setRescued((current) => !current), 3600);
    return () => window.clearTimeout(timer);
  }, [rescued, reducedMotion]);

  const atRiskY = GRID_Y + 2 * (CELL_H + 10);

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: an attendance heat grid for member cohorts across eight weeks; the at-risk cohort is flagged and receives a human follow-up that re-ignites attendance, while the trial-to-membership dial fills and duty-of-care decisions stay with staff."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        {/* Tight viewBox around the drawn content so the heat grid and its
            labels render larger for the same stage size. */}
        <m.svg viewBox="4 76 578 398" className="ss-srv2-signature__svg">
          <defs>
            <linearGradient id="ind2-pulse-dial" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--srv2-accent)" />
              <stop offset="100%" stopColor="var(--srv2-accent-2)" />
            </linearGradient>
          </defs>

          <text
            x={GRID_X}
            y={GRID_Y - 30}
            fill="var(--srv2-ink-faint)"
            fontSize="14"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.08em"
          >
            ATTENDANCE · 8 WEEKS
          </text>

          {/* Heat rows */}
          {ROWS.map((row, rowIndex) => {
            const y = GRID_Y + rowIndex * (CELL_H + 10);
            const isAtRisk = row.label === "At risk";
            return (
              <g key={row.label}>
                <text
                  x={GRID_X - 12}
                  y={y + CELL_H / 2 + 4}
                  textAnchor="end"
                  fill={isAtRisk ? "var(--srv2-accent-2)" : "var(--srv2-ink-soft)"}
                  fontSize="13.5"
                  fontFamily="var(--ss-font-mono)"
                >
                  {row.label}
                </text>
                {Array.from({ length: WEEKS }, (_, week) => {
                  let heat = row.heat[week] ?? 0;
                  if (isAtRisk && rescued && week >= 6) {
                    heat = week === 6 ? 0.5 : 0.8;
                  }
                  return (
                    <m.rect
                      key={`${row.label}-${String(week)}`}
                      x={GRID_X + week * CELL_W}
                      y={y}
                      width={CELL_W - 6}
                      height={CELL_H}
                      rx="6"
                      fill={`color-mix(in srgb, var(--srv2-accent) ${String(Math.round(heat * 55))}%, var(--ss-v2-void-black))`}
                      stroke={
                        heat > 0.05 ? "var(--srv2-hairline)" : "var(--ss-v2-hairline)"
                      }
                      strokeWidth="1"
                      initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        duration: 0.45,
                        delay: reducedMotion ? 0 : (rowIndex * WEEKS + week) * 0.03,
                      }}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* At-risk flag + follow-up pulse */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: reducedMotion ? 0 : 1 }}
          >
            <rect
              x={GRID_X + WEEKS * CELL_W + 6}
              y={atRiskY - 4}
              width={124}
              height={CELL_H + 8}
              rx="8"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent-2)"
              strokeWidth="1.5"
            />
            <text
              x={GRID_X + WEEKS * CELL_W + 68}
              y={atRiskY + CELL_H / 2 + 4}
              textAnchor="middle"
              fill="var(--srv2-ink-soft)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
            >
              {rescued ? "Check-in sent ✓" : "Flagged → staff"}
            </text>
          </m.g>

          {/* Flagged cohort flows into tracked follow-up */}
          <path
            d="M 516 252 C 512 290, 508 320, 505 352"
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
            strokeDasharray="5 6"
            opacity="0.7"
          />
          <path
            d="M 277 292 C 277 320, 277 350, 277 388"
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
            strokeDasharray="5 6"
            opacity="0.7"
          />

          {/* Trial-to-member dial */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.6 }}
          >
            <circle
              cx={DIAL.x}
              cy={DIAL.y + 210}
              r={DIAL.r}
              fill="none"
              stroke="var(--ss-v2-hairline)"
              strokeWidth="7"
            />
            <m.circle
              cx={DIAL.x}
              cy={DIAL.y + 210}
              r={DIAL.r}
              fill="none"
              stroke="url(#ind2-pulse-dial)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={String(2 * Math.PI * DIAL.r)}
              initial={
                reducedMotion
                  ? { strokeDashoffset: 2 * Math.PI * DIAL.r * 0.35 }
                  : { strokeDashoffset: 2 * Math.PI * DIAL.r }
              }
              whileInView={{ strokeDashoffset: 2 * Math.PI * DIAL.r * 0.35 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.6, delay: reducedMotion ? 0 : 0.8 }}
              transform={`rotate(-90 ${String(DIAL.x)} ${String(DIAL.y + 210)})`}
            />
            <text
              x={DIAL.x}
              y={DIAL.y + 205}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="14"
              fontFamily="var(--ss-font-mono)"
            >
              Trial →
            </text>
            <text
              x={DIAL.x}
              y={DIAL.y + 224}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="14"
              fontFamily="var(--ss-font-mono)"
            >
              member
            </text>
            <text
              x={DIAL.x}
              y={DIAL.y + 274}
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
            >
              tracked, owned
            </text>
          </m.g>

          {/* Duty-of-care stop */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.7 }}
          >
            <rect
              x="112"
              y="392"
              width="330"
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
              x="277"
              y="416"
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="14.5"
              fontFamily="var(--ss-font-mono)"
            >
              Injuries · disputes · cancellations
            </text>
            <text
              x="277"
              y="436"
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
            >
              duty of care — people decide, always
            </text>
          </m.g>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
