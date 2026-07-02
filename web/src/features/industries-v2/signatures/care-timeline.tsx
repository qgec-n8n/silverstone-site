/**
 * Physios & Chiropractors signature — "Care-Plan Continuity Timeline". A
 * course of sessions runs left to right; administrative arcs (reminders,
 * rebooking, forms) curve beneath the timeline keeping continuity, while the
 * clinical boundary sits as a solid horizon line above it — everything over
 * the line belongs to the clinician and is never crossed by the arcs.
 * Distinct language: a treatment-course timeline with a visible ceiling.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

const TIMELINE_Y = 250;
const BOUNDARY_Y = 120;
const SESSIONS = [
  { label: "Assess", x: 110, state: "done" },
  { label: "Week 2", x: 205, state: "done" },
  { label: "Week 4", x: 300, state: "done" },
  { label: "Week 6", x: 395, state: "due" },
  { label: "Review", x: 490, state: "future" },
];
const ARCS = [
  { from: 110, to: 205, label: "reminder" },
  { from: 205, to: 300, label: "forms" },
  { from: 300, to: 395, label: "rebooking" },
];

export function CareTimeline({ label, metrics }: { label: string; metrics: string[] }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: a course of physiotherapy sessions on a timeline, with administrative reminder, form and rebooking arcs keeping continuity beneath it — and a solid clinical boundary line above that the automation never crosses."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 600" className="ss-srv2-signature__svg">
          {/* Clinical boundary horizon */}
          <line
            x1="60"
            y1={BOUNDARY_Y}
            x2="540"
            y2={BOUNDARY_Y}
            stroke="var(--srv2-accent-2)"
            strokeWidth="2.2"
          />
          <text
            x="60"
            y={BOUNDARY_Y - 34}
            fill="var(--ss-v2-chrome)"
            fontSize="13"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.07em"
          >
            CLINICAL DOMAIN — diagnosis · urgency · treatment
          </text>
          <text
            x="60"
            y={BOUNDARY_Y - 14}
            fill="var(--srv2-ink-faint)"
            fontSize="12"
            fontFamily="var(--ss-font-mono)"
          >
            registered professionals only; automation stops here
          </text>
          {/* Escalation arrow crossing UP through boundary */}
          <m.path
            d={`M 470 ${String(TIMELINE_Y - 12)} C 500 190, 500 160, 500 ${String(BOUNDARY_Y + 6)}`}
            fill="none"
            stroke="var(--srv2-accent-2)"
            strokeWidth="1.8"
            strokeDasharray="6 6"
            initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.9 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: reducedMotion ? 0 : 1.2 }}
          />
          <m.path
            d={`M 494 ${String(BOUNDARY_Y + 16)} L 500 ${String(BOUNDARY_Y + 4)} L 506 ${String(BOUNDARY_Y + 16)}`}
            fill="none"
            stroke="var(--srv2-accent-2)"
            strokeWidth="1.8"
            initial={reducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: reducedMotion ? 0 : 2.2 }}
          />
          <text
            x="516"
            y={TIMELINE_Y - 60}
            fill="var(--srv2-ink-faint)"
            fontSize="12"
            fontFamily="var(--ss-font-mono)"
            transform={`rotate(-90 516 ${String(TIMELINE_Y - 60)})`}
          >
            symptoms → clinician
          </text>

          {/* Timeline spine */}
          <m.line
            x1="80"
            y1={TIMELINE_Y}
            x2="520"
            y2={TIMELINE_Y}
            stroke="var(--srv2-hairline)"
            strokeWidth="2"
            initial={reducedMotion ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1 }}
          />

          {/* Sessions */}
          {SESSIONS.map((session, index) => (
            <m.g
              key={session.label}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: reducedMotion ? 0 : 0.25 + index * 0.14,
              }}
            >
              <circle
                cx={session.x}
                cy={TIMELINE_Y}
                r={session.state === "due" ? 13 : 10}
                fill={
                  session.state === "done"
                    ? "color-mix(in srgb, var(--srv2-accent) 30%, var(--ss-v2-void-black))"
                    : "var(--ss-v2-void-black)"
                }
                stroke={
                  session.state === "future"
                    ? "var(--srv2-hairline)"
                    : "var(--srv2-accent)"
                }
                strokeWidth="2"
                strokeDasharray={session.state === "future" ? "4 4" : "0"}
              />
              {session.state === "done" ? (
                <path
                  d={`M ${String(session.x - 4)} ${String(TIMELINE_Y)} l 3 3 l 6 -6`}
                  fill="none"
                  stroke="var(--srv2-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : null}
              {session.state === "due" && !reducedMotion ? (
                <m.circle
                  cx={session.x}
                  cy={TIMELINE_Y}
                  r="13"
                  fill="none"
                  stroke="var(--srv2-accent)"
                  strokeWidth="1.6"
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: [0.8, 0], scale: [1, 1.9] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  style={{
                    transformOrigin: `${String(session.x)}px ${String(TIMELINE_Y)}px`,
                  }}
                />
              ) : null}
              <text
                x={session.x}
                y={TIMELINE_Y - 26}
                textAnchor="middle"
                fill="var(--srv2-ink-soft)"
                fontSize="12.5"
                fontFamily="var(--ss-font-mono)"
              >
                {session.label}
              </text>
            </m.g>
          ))}

          {/* Administrative continuity arcs below the line */}
          {ARCS.map((arc, index) => {
            const midX = (arc.from + arc.to) / 2;
            return (
              <m.g key={arc.label}>
                <m.path
                  d={`M ${String(arc.from)} ${String(TIMELINE_Y + 14)} Q ${String(midX)} ${String(TIMELINE_Y + 96)} ${String(arc.to)} ${String(TIMELINE_Y + 14)}`}
                  fill="none"
                  stroke="var(--srv2-accent)"
                  strokeWidth="1.7"
                  initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.85 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.9,
                    delay: reducedMotion ? 0 : 0.7 + index * 0.3,
                  }}
                />
                <m.text
                  x={midX}
                  y={TIMELINE_Y + 72}
                  textAnchor="middle"
                  fill="var(--srv2-ink-faint)"
                  fontSize="12"
                  fontFamily="var(--ss-font-mono)"
                  initial={reducedMotion ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.5,
                    delay: reducedMotion ? 0 : 1 + index * 0.3,
                  }}
                >
                  {arc.label}
                </m.text>
              </m.g>
            );
          })}

          {/* Docks connect to the sessions they support */}
          <path
            d={`M 195 418 C 175 380, 130 320, 110 ${String(TIMELINE_Y + 16)}`}
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
            strokeDasharray="5 6"
            opacity="0.7"
          />
          <path
            d={`M 405 418 C 400 380, 396 330, 395 ${String(TIMELINE_Y + 18)}`}
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.4"
            strokeDasharray="5 6"
            opacity="0.7"
          />

          {/* Intake dock */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.5 }}
          >
            <rect
              x="105"
              y="420"
              width="180"
              height="52"
              rx="12"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent)"
              strokeWidth="1.7"
            />
            <text
              x="195"
              y="443"
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
            >
              Intake complete ✓
            </text>
            <text
              x="195"
              y="461"
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="12"
              fontFamily="var(--ss-font-mono)"
            >
              minimum necessary data
            </text>
            <rect
              x="315"
              y="420"
              width="180"
              height="52"
              rx="12"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-hairline)"
              strokeWidth="1.5"
            />
            <text
              x="405"
              y="443"
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="13"
              fontFamily="var(--ss-font-mono)"
            >
              Clinician prepared
            </text>
            <text
              x="405"
              y="461"
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="12"
              fontFamily="var(--ss-font-mono)"
            >
              right person, right context
            </text>
          </m.g>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
