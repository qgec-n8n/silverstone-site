/**
 * Salons & Barbers signature — "Chair-and-Calendar Loom". A week of chair
 * columns woven with booked slots; one slot cancels (flashes out) and a
 * waitlist thread visibly weaves across the loom to refill it, while the
 * deposit lock and practitioner gate sit beneath. Distinct language: a woven
 * schedule fabric being repaired in real time, not a routing diagram.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

const DAYS = ["Tue", "Wed", "Thu", "Fri", "Sat"];
const COLS = [120, 210, 300, 390, 480];
const ROWS = [120, 185, 250, 315];
/** Which cells start booked (col,row indices). */
const BOOKED = new Set(["0-0", "0-2", "1-1", "1-3", "2-0", "2-3", "3-0", "3-1", "4-2"]);
/** The slot that cancels and refills each cycle. */
const CANCEL = { col: 2, row: 1 };
const WAITLIST = { x: 60, y: 430 };

export function DiaryLoom({ label, metrics }: { label: string; metrics: string[] }) {
  const reducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"booked" | "canceled" | "refilled">("booked");

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }
    const timers = [
      window.setTimeout(() => setPhase("canceled"), 2200),
      window.setTimeout(() => setPhase("refilled"), 4600),
      window.setTimeout(() => setPhase("booked"), 8200),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [phase, reducedMotion]);

  const cancelX = COLS[CANCEL.col] ?? 300;
  const cancelY = ROWS[CANCEL.row] ?? 185;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: a woven week of salon chair slots; a canceled appointment is offered to the waitlist and refilled while deposits and practitioner suitability gates stay in place."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        {/* Tight viewBox around the drawn content so the loom and its labels
            render larger for the same stage size. */}
        <m.svg viewBox="16 58 568 472" className="ss-srv2-signature__svg">
          {/* Loom warp/weft grid */}
          {COLS.map((x, index) => (
            <g key={x}>
              <line
                x1={x}
                y1="95"
                x2={x}
                y2="345"
                stroke="var(--srv2-hairline)"
                strokeWidth="1.5"
              />
              <text
                x={x}
                y="80"
                textAnchor="middle"
                fill="var(--srv2-ink-faint)"
                fontSize="15"
                fontFamily="var(--ss-font-mono)"
              >
                {DAYS[index]}
              </text>
            </g>
          ))}
          {ROWS.map((y) => (
            <line
              key={y}
              x1="95"
              y1={y}
              x2="505"
              y2={y}
              stroke="var(--srv2-hairline)"
              strokeWidth="1"
              opacity="0.6"
            />
          ))}

          {/* Booked slot weave */}
          {COLS.flatMap((x, colIndex) =>
            ROWS.map((y, rowIndex) => {
              const key = `${String(colIndex)}-${String(rowIndex)}`;
              const isCancelCell = colIndex === CANCEL.col && rowIndex === CANCEL.row;
              const booked = BOOKED.has(key);
              if (!booked && !isCancelCell) {
                return (
                  <circle
                    key={key}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--srv2-hairline)"
                    opacity="0.5"
                  />
                );
              }
              if (isCancelCell) {
                const filled = phase !== "canceled";
                return (
                  <m.rect
                    key={key}
                    x={x - 28}
                    y={y - 15}
                    width="56"
                    height="30"
                    rx="8"
                    fill={
                      filled
                        ? "color-mix(in srgb, var(--srv2-accent) 20%, transparent)"
                        : "transparent"
                    }
                    stroke={filled ? "var(--srv2-accent)" : "var(--srv2-hairline)"}
                    strokeWidth="1.6"
                    strokeDasharray={filled ? "0" : "5 5"}
                    animate={
                      reducedMotion
                        ? {}
                        : { opacity: phase === "canceled" ? [1, 0.35, 1] : 1 }
                    }
                    transition={{
                      duration: 1.1,
                      repeat: phase === "canceled" ? 2 : 0,
                    }}
                  />
                );
              }
              return (
                <m.rect
                  key={key}
                  x={x - 28}
                  y={y - 15}
                  width="56"
                  height="30"
                  rx="8"
                  fill="color-mix(in srgb, var(--srv2-accent-2) 16%, transparent)"
                  stroke="var(--srv2-accent-2)"
                  strokeWidth="1.3"
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.5,
                    delay: reducedMotion ? 0 : (colIndex + rowIndex) * 0.08,
                  }}
                />
              );
            }),
          )}

          {/* Waitlist thread weaving up to the released slot */}
          {!reducedMotion && phase !== "booked" ? (
            <m.path
              d={`M ${String(WAITLIST.x + 40)} ${String(WAITLIST.y)} C 180 ${String(WAITLIST.y - 40)}, ${String(cancelX - 90)} ${String(cancelY + 90)}, ${String(cancelX)} ${String(cancelY + 16)}`}
              fill="none"
              stroke="var(--srv2-accent)"
              strokeWidth="2.4"
              strokeDasharray="8 7"
              style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent))" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: phase === "refilled" ? 1 : 0.35,
                opacity: 1,
              }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          ) : null}

          {/* Waitlist + gates row */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.4 }}
          >
            <rect
              x={WAITLIST.x - 34}
              y={WAITLIST.y - 22}
              width="150"
              height="44"
              rx="10"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent)"
              strokeWidth="1.6"
            />
            <text
              x={WAITLIST.x + 41}
              y={WAITLIST.y + 5}
              textAnchor="middle"
              fill="var(--srv2-ink-soft)"
              fontSize="14.5"
              fontFamily="var(--ss-font-mono)"
            >
              {phase === "refilled" ? "Slot refilled ✓" : "Waitlist offer"}
            </text>

            <rect
              x="240"
              y={WAITLIST.y - 22}
              width="140"
              height="44"
              rx="10"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-hairline)"
              strokeWidth="1.4"
            />
            <text
              x="310"
              y={WAITLIST.y + 5}
              textAnchor="middle"
              fill="var(--srv2-ink-soft)"
              fontSize="14.5"
              fontFamily="var(--ss-font-mono)"
            >
              Deposit rules
            </text>

            <rect
              x="404"
              y={WAITLIST.y - 22}
              width="172"
              height="44"
              rx="10"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent-2)"
              strokeWidth="1.6"
            />
            <text
              x="490"
              y={WAITLIST.y + 5}
              textAnchor="middle"
              fill="var(--srv2-ink-soft)"
              fontSize="14.5"
              fontFamily="var(--ss-font-mono)"
            >
              Practitioner gate
            </text>
          </m.g>

          <text
            x="300"
            y="516"
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="14"
            fontFamily="var(--ss-font-mono)"
          >
            Released time re-offered while it still has value
          </text>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
