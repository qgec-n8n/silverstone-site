/**
 * Trades signature — "Job-Intake Dispatch Board". Four board columns
 * (Intake → Qualified → Callback → Scheduled) with a job card advancing one
 * column per beat; the postcode gate sits at the board's entry and rejects an
 * out-of-area card, and the commitment line under the final column marks
 * where humans confirm price and attendance. Distinct language: a physical
 * job board being worked, not a network diagram.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

const COLUMNS = [
  { label: "Intake", x: 116 },
  { label: "Qualified", x: 244 },
  { label: "Callback", x: 372 },
  { label: "Scheduled", x: 500 },
];
const BOARD_TOP = 96;
const BOARD_BOTTOM = 356;
const CARD_Y = 150;
/*
 * The gates sit far enough below the commitment line (BOARD_BOTTOM + 16, its
 * label at + 36) that their boxes never crowd or cover it — they used to sit
 * only ~6px under the label, reading as "too high"/glued to the board rather
 * than a clearly separated footer beat. The viewBox height below is extended
 * to match, so the extra clearance never clips.
 */
const GATE = { x: 116, y: 452 };
const FIRST_COLUMN = COLUMNS[0] ?? { label: "Intake", x: 116 };
const CALLBACK_COLUMN = COLUMNS[2] ?? { label: "Callback", x: 372 };
const FINAL_COLUMN = COLUMNS[3] ?? { label: "Scheduled", x: 500 };

export function DispatchBoard({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const [cycle, setCycle] = useState(0);

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: a dispatch board moves each job from intake through qualification and callback to scheduled, with a postcode gate rejecting out-of-area work and price and attendance committed only by the office."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        {/* Tight viewBox around the drawn content so the board and its labels
            render larger for the same stage size. Height extended to clear
            the gates' new lower position (see GATE above) with margin. */}
        <m.svg viewBox="24 84 548 412" className="ss-srv2-signature__svg">
          {/* Board columns */}
          {COLUMNS.map((column, index) => (
            <m.g
              key={column.label}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.1 }}
            >
              <rect
                x={column.x - 56}
                y={BOARD_TOP}
                width="112"
                height={BOARD_BOTTOM - BOARD_TOP}
                rx="14"
                fill="color-mix(in srgb, var(--ss-v2-graphite-raised) 55%, transparent)"
                stroke="var(--srv2-hairline)"
                strokeWidth="1.4"
              />
              <text
                x={column.x}
                y={BOARD_TOP + 26}
                textAnchor="middle"
                fill="var(--srv2-ink-faint)"
                fontSize="14.5"
                fontFamily="var(--ss-font-mono)"
                letterSpacing="0.07em"
              >
                {column.label.toUpperCase()}
              </text>
              {/* Static resident cards for depth */}
              {index !== 1 ? (
                <rect
                  x={column.x - 42}
                  y={250}
                  width="84"
                  height="40"
                  rx="8"
                  fill="var(--ss-v2-void-black)"
                  stroke="var(--srv2-hairline)"
                  strokeWidth="1.1"
                  opacity="0.75"
                />
              ) : null}
            </m.g>
          ))}

          {/* Advancing job card */}
          {!reducedMotion ? (
            <m.g
              key={cycle}
              initial={{ x: FIRST_COLUMN.x - 48, opacity: 0 }}
              animate={{
                x: COLUMNS.map((column) => column.x - 48),
                opacity: [0, 1, 1, 1],
              }}
              transition={{
                duration: 4.4,
                times: [0, 0.3, 0.65, 1],
                ease: "easeInOut",
              }}
              onAnimationComplete={() => {
                window.setTimeout(() => setCycle((current) => current + 1), 1800);
              }}
            >
              <rect
                y={CARD_Y}
                width="96"
                height="58"
                rx="8"
                fill="color-mix(in srgb, var(--srv2-accent) 16%, var(--ss-v2-void-black))"
                stroke="var(--srv2-accent)"
                strokeWidth="1.6"
                style={{
                  filter:
                    "drop-shadow(0 0 8px color-mix(in srgb, var(--srv2-accent) 55%, transparent))",
                }}
              />
              <text
                x="48"
                y={CARD_Y + 22}
                textAnchor="middle"
                fill="var(--ss-v2-chrome)"
                fontSize="13"
                fontFamily="var(--ss-font-mono)"
              >
                Leak · SW9
              </text>
              <text
                x="48"
                y={CARD_Y + 40}
                textAnchor="middle"
                fill="var(--srv2-ink-faint)"
                fontSize="13"
                fontFamily="var(--ss-font-mono)"
              >
                photos ✓
              </text>
            </m.g>
          ) : (
            <g>
              <rect
                x={CALLBACK_COLUMN.x - 48}
                y={CARD_Y}
                width="96"
                height="58"
                rx="8"
                fill="color-mix(in srgb, var(--srv2-accent) 16%, var(--ss-v2-void-black))"
                stroke="var(--srv2-accent)"
                strokeWidth="1.6"
              />
              <text
                x={CALLBACK_COLUMN.x}
                y={CARD_Y + 22}
                textAnchor="middle"
                fill="var(--ss-v2-chrome)"
                fontSize="13"
                fontFamily="var(--ss-font-mono)"
              >
                Leak · SW9
              </text>
            </g>
          )}

          {/* Commitment line beneath the final column */}
          <line
            x1={FINAL_COLUMN.x - 56}
            y1={BOARD_BOTTOM + 16}
            x2={FINAL_COLUMN.x + 56}
            y2={BOARD_BOTTOM + 16}
            stroke="var(--srv2-accent-2)"
            strokeWidth="2"
          />
          <text
            x={FINAL_COLUMN.x + 56}
            y={BOARD_BOTTOM + 36}
            textAnchor="end"
            fill="var(--srv2-ink-faint)"
            fontSize="13.5"
            fontFamily="var(--ss-font-mono)"
          >
            price + attendance: office only
          </text>

          {/* Gates connect to the board they guard */}
          <line
            x1={GATE.x}
            y1={GATE.y - 26}
            x2={FIRST_COLUMN.x}
            y2={BOARD_BOTTOM + 2}
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
            strokeDasharray="5 6"
            opacity="0.7"
          />
          <line
            x1="456"
            y1={GATE.y - 26}
            x2={CALLBACK_COLUMN.x + 40}
            y2={BOARD_BOTTOM + 2}
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
            strokeDasharray="5 6"
            opacity="0.7"
          />

          {/* Postcode gate with rejected card */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.4 }}
          >
            <rect
              x={GATE.x - 84}
              y={GATE.y - 26}
              width="168"
              height="54"
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
              x={GATE.x}
              y={GATE.y - 3}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="15"
              fontFamily="var(--ss-font-mono)"
            >
              Postcode gate
            </text>
            <text
              x={GATE.x}
              y={GATE.y + 17}
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
            >
              service-area rules
            </text>
          </m.g>

          {/* Rejected out-of-area card sliding away */}
          {!reducedMotion ? (
            <m.g
              initial={{ opacity: 0, x: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [0, 40, 90, 130],
                rotate: [0, 4, 7, 9],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 3.4,
                ease: "easeInOut",
              }}
            >
              <rect
                x={GATE.x + 96}
                y={GATE.y - 22}
                width="132"
                height="44"
                rx="9"
                fill="var(--ss-v2-void-black)"
                stroke="var(--srv2-hairline)"
                strokeWidth="1.2"
                strokeDasharray="5 5"
              />
              <text
                x={GATE.x + 162}
                y={GATE.y - 3}
                textAnchor="middle"
                fill="var(--srv2-ink-faint)"
                fontSize="13"
                fontFamily="var(--ss-font-mono)"
              >
                Out of area
              </text>
              <text
                x={GATE.x + 162}
                y={GATE.y + 14}
                textAnchor="middle"
                fill="var(--srv2-ink-faint)"
                fontSize="13"
                fontFamily="var(--ss-font-mono)"
              >
                closed politely
              </text>
            </m.g>
          ) : null}

          {/* Emergency flag */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.55 }}
          >
            <rect
              x="356"
              y={GATE.y - 26}
              width="200"
              height="54"
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
              x="456"
              y={GATE.y - 3}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="15"
              fontFamily="var(--ss-font-mono)"
            >
              Emergency language
            </text>
            <text
              x="456"
              y={GATE.y + 17}
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
            >
              → approved human reply
            </text>
          </m.g>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
