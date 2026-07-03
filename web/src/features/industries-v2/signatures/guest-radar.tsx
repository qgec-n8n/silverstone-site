/**
 * Hospitality signature — "Guest Service Radar". A front-desk radar sweep
 * classifies incoming guest requests as they appear: routine (answered from
 * approved information), commercial (routed to the events owner) and safety
 * (an unmissable straight line to staff). The reservation source-of-truth
 * ring anchors the sweep. Distinct language: a calm radar watch, not a
 * funnel, belt or orbit of records.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

const CENTER = { x: 300, y: 230 };
const RADII = [60, 110, 160];
const BLIPS = [
  { angle: -35, r: 135, label: "Parking?", kind: "routine", delay: 0.6 },
  { angle: 205, r: 112, label: "Group of 40", kind: "commercial", delay: 2.2 },
  { angle: 120, r: 145, label: "Allergen", kind: "safety", delay: 3.8 },
];
const STAFF = { x: 300, y: 470 };

function polar(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: CENTER.x + radius * Math.cos(radians),
    y: CENTER.y + radius * Math.sin(radians),
  };
}

export function GuestRadar({ label, metrics }: { label: string; metrics: string[] }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: a service radar sweeps guest requests as they appear — routine questions are answered from approved information, group enquiries route to the events owner, and safety matters draw a direct line to the staff desk anchored by the reservation source of truth."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        {/* Tight viewBox around the drawn content so the radar and its labels
            render larger for the same stage size. */}
        <m.svg viewBox="116 50 364 456" className="ss-srv2-signature__svg">
          <defs>
            <linearGradient id="ind2-radar-sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--srv2-accent)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--srv2-accent)" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Radar rings */}
          {RADII.map((radius) => (
            <circle
              key={radius}
              cx={CENTER.x}
              cy={CENTER.y}
              r={radius}
              fill="none"
              stroke="var(--srv2-hairline)"
              strokeWidth="1.2"
            />
          ))}
          <line
            x1={CENTER.x - 172}
            y1={CENTER.y}
            x2={CENTER.x + 172}
            y2={CENTER.y}
            stroke="var(--srv2-hairline)"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <line
            x1={CENTER.x}
            y1={CENTER.y - 172}
            x2={CENTER.x}
            y2={CENTER.y + 172}
            stroke="var(--srv2-hairline)"
            strokeWidth="0.8"
            opacity="0.5"
          />

          {/* Sweep */}
          {!reducedMotion ? (
            <m.g
              style={{ transformOrigin: "300px 230px" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              <path
                d={`M ${String(CENTER.x)} ${String(CENTER.y)} L ${String(CENTER.x + 160)} ${String(CENTER.y)} A 160 160 0 0 0 ${String(CENTER.x + 160 * Math.cos(-0.55))} ${String(CENTER.y + 160 * Math.sin(-0.55))} Z`}
                fill="url(#ind2-radar-sweep)"
              />
              <line
                x1={CENTER.x}
                y1={CENTER.y}
                x2={CENTER.x + 160}
                y2={CENTER.y}
                stroke="var(--srv2-accent)"
                strokeWidth="1.6"
              />
            </m.g>
          ) : null}

          {/* Reservation source-of-truth core — sized so both lines actually
              fit inside the dial (the old r=34 clipped them). */}
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r="48"
            fill="var(--ss-v2-void-black)"
            stroke="var(--srv2-accent)"
            strokeWidth="2"
            style={{
              filter:
                "drop-shadow(0 0 12px color-mix(in srgb, var(--srv2-accent) 28%, transparent))",
            }}
          />
          <text
            x={CENTER.x}
            y={CENTER.y - 2}
            textAnchor="middle"
            fill="var(--ss-v2-chrome)"
            fontSize="13"
            fontFamily="var(--ss-font-mono)"
          >
            RESERVATION
          </text>
          <text
            x={CENTER.x}
            y={CENTER.y + 14}
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="11.5"
            fontFamily="var(--ss-font-mono)"
          >
            source of truth
          </text>

          {/* Blips */}
          {BLIPS.map((blip) => {
            const position = polar(blip.angle, blip.r);
            const isSafety = blip.kind === "safety";
            const stroke = isSafety
              ? "var(--srv2-accent-2)"
              : blip.kind === "commercial"
                ? "var(--srv2-accent)"
                : "var(--srv2-hairline)";
            return (
              <m.g
                key={blip.label}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.6,
                  delay: reducedMotion ? 0 : blip.delay * 0.4,
                }}
              >
                {!reducedMotion ? (
                  <m.circle
                    cx={position.x}
                    cy={position.y}
                    r="14"
                    fill="none"
                    stroke={stroke}
                    strokeWidth="1.4"
                    initial={{ opacity: 0.7, scale: 0.6 }}
                    animate={{ opacity: [0.7, 0], scale: [0.6, 1.8] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: blip.delay,
                      ease: "easeOut",
                    }}
                    style={{
                      transformOrigin: `${String(position.x)}px ${String(position.y)}px`,
                    }}
                  />
                ) : null}
                <circle cx={position.x} cy={position.y} r="6" fill={stroke} />
                <rect
                  x={position.x - 50}
                  y={position.y + 12}
                  width="100"
                  height="26"
                  rx="7"
                  fill="var(--ss-v2-void-black)"
                  stroke={stroke}
                  strokeWidth="1.2"
                />
                <text
                  x={position.x}
                  y={position.y + 30}
                  textAnchor="middle"
                  fill="var(--srv2-ink-soft)"
                  fontSize="13"
                  fontFamily="var(--ss-font-mono)"
                >
                  {blip.label}
                </text>
              </m.g>
            );
          })}

          {/* Routine + commercial blips resolve through the reservation core */}
          <line
            x1={polar(-35, 135).x - 10}
            y1={polar(-35, 135).y + 4}
            x2={CENTER.x + 36}
            y2={CENTER.y - 6}
            stroke="var(--srv2-hairline)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.6"
          />
          <line
            x1={polar(205, 112).x + 8}
            y1={polar(205, 112).y + 6}
            x2={CENTER.x - 34}
            y2={CENTER.y + 4}
            stroke="var(--srv2-hairline)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.6"
          />

          {/* Safety line to staff */}
          <m.path
            d={`M ${String(polar(120, 145).x)} ${String(polar(120, 145).y + 36)} L ${String(STAFF.x - 60)} ${String(STAFF.y - 26)}`}
            fill="none"
            stroke="var(--srv2-accent-2)"
            strokeWidth="2.2"
            initial={reducedMotion ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: reducedMotion ? 0 : 1.4 }}
            style={{ filter: "drop-shadow(0 0 5px var(--srv2-accent-2))" }}
          />

          {/* Staff desk */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.5 }}
          >
            <rect
              x={STAFF.x - 140}
              y={STAFF.y - 27}
              width="280"
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
              x={STAFF.x}
              y={STAFF.y - 3}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="15"
              fontFamily="var(--ss-font-mono)"
            >
              Duty manager, immediately
            </text>
            <text
              x={STAFF.x}
              y={STAFF.y + 17}
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="12.5"
              fontFamily="var(--ss-font-mono)"
            >
              allergens · complaints · emergencies
            </text>
          </m.g>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
