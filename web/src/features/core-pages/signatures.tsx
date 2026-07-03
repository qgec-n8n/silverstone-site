/**
 * Six distinct hero signatures for the core marketing routes — replaces the
 * single reused hex-diagram ("CoreShowcase") that previously rendered on
 * every core page with only its labels swapped. Each diagram uses its own
 * visual metaphor tied to the page's argument: a gated delivery pipeline, an
 * editorial index, an orbiting discipline ring, an investment ledger, a
 * correspondence route and a 30-minute agenda dial. Same instrument-console
 * chrome language as the services/industries signatures (status bar, corner
 * brackets, scan sweep) so the frame reads as one system, but the diagram
 * inside is never shared between routes.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";

function SignatureShell({
  ariaLabel,
  label,
  metrics,
  children,
}: {
  ariaLabel: string;
  label: string;
  metrics?: string[] | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="ss-srv2-signature ss-core-sig" role="img" aria-label={ariaLabel}>
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 520" className="ss-srv2-signature__svg">
          {children}
        </m.svg>
      </div>
      {metrics ? <SignatureMetricStrip metrics={metrics} /> : null}
      <SignatureChrome />
    </div>
  );
}

/** /how-we-work — a gated delivery pipeline: five stages separated by explicit
 * diamond decision gates, with a pulse travelling the rail only as far as the
 * current gate allows. Distinct from a routing timeline: the diamonds are the
 * point, not the nodes. */
export function DeliveryRouteSignature({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const stages = [
    { x: 60, name: "Diagnose" },
    { x: 195, name: "Scope" },
    { x: 330, name: "Design" },
    { x: 465, name: "Build" },
    { x: 540, name: "Govern" },
  ];
  const gates = [127, 262, 397, 502];

  return (
    <SignatureShell
      ariaLabel="Diagram: five delivery stages — diagnose, scope, design, build, govern — separated by explicit diamond decision gates along a single rail."
      label={label}
      metrics={metrics}
    >
      <defs>
        <linearGradient id="core-route-accent" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--srv2-accent)" />
          <stop offset="100%" stopColor="var(--srv2-accent-2)" />
        </linearGradient>
      </defs>
      <line
        x1="60"
        y1="230"
        x2="540"
        y2="230"
        stroke="var(--srv2-hairline)"
        strokeWidth="2"
      />
      {!reducedMotion ? (
        <m.circle
          cy="230"
          r="5"
          fill="url(#core-route-accent)"
          initial={{ cx: 60, opacity: 0 }}
          animate={{ cx: [60, 540], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: "easeInOut",
          }}
          style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent))" }}
        />
      ) : null}
      {gates.map((x, index) => (
        <m.rect
          key={x}
          x={x - 9}
          y="221"
          width="18"
          height="18"
          transform={`rotate(45 ${String(x)} 230)`}
          fill="var(--ss-v2-void-black)"
          stroke="var(--srv2-accent-2)"
          strokeWidth="2"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: reducedMotion ? 0 : 0.25 + index * 0.12 }}
        />
      ))}
      {stages.map((stage, index) => (
        <m.g
          key={stage.name}
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.1 }}
        >
          <circle
            cx={stage.x}
            cy="230"
            r="9"
            fill="var(--ss-v2-void-black)"
            stroke="var(--srv2-accent)"
            strokeWidth="2.5"
          />
          <text
            x={stage.x}
            y={index % 2 === 0 ? "196" : "276"}
            textAnchor="middle"
            fill="var(--ss-v2-chrome)"
            fontFamily="var(--ss-font-mono)"
            fontSize="14"
          >
            {stage.name}
          </text>
        </m.g>
      ))}
      <text
        x="300"
        y="360"
        textAnchor="middle"
        fill="var(--srv2-ink-faint)"
        fontFamily="var(--ss-font-mono)"
        fontSize="12"
        letterSpacing="0.08em"
      >
        EACH GATE IS A NAMED, HUMAN DECISION
      </text>
    </SignatureShell>
  );
}

/** /blog — an editorial index: five ranked rows of variable-width title bars
 * with category chips, a highlighted lead row, and a slow-scrolling read
 * indicator down the right edge. Distinct from a diagram: it reads as a
 * content system, not a process. */
export function EditorialIndexSignature({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const rows = [
    { tag: "STRATEGY", width: 340, lead: true },
    { tag: "GOVERNANCE", width: 260, lead: false },
    { tag: "COMMERCIAL", width: 300, lead: false },
    { tag: "AUTOMATION", width: 220, lead: false },
    { tag: "INDUSTRY", width: 270, lead: false },
  ];

  return (
    <SignatureShell
      ariaLabel="Diagram: an editorial index of five ranked articles grouped by topic tag, with a highlighted lead article and a reading progress indicator."
      label={label}
      metrics={metrics}
    >
      <text
        x="60"
        y="86"
        fill="var(--srv2-ink-faint)"
        fontFamily="var(--ss-font-mono)"
        fontSize="12"
        letterSpacing="0.1em"
      >
        INDEX / SORTED BY DECISION
      </text>
      {rows.map((row, index) => {
        const y = 130 + index * 66;
        return (
          <m.g
            key={row.tag}
            initial={reducedMotion ? false : { opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.1 }}
          >
            <rect
              x="52"
              y={y - 26}
              width="496"
              height="48"
              rx="10"
              fill={row.lead ? "rgba(255,255,255,0.045)" : "transparent"}
              stroke={row.lead ? "var(--srv2-accent)" : "var(--srv2-hairline)"}
              strokeWidth={row.lead ? 1.5 : 1}
            />
            <rect
              x="70"
              y={y - 9}
              width="86"
              height="18"
              rx="9"
              fill="none"
              stroke="var(--srv2-accent-2)"
              strokeWidth="1.2"
            />
            <text
              x="113"
              y={y + 4}
              textAnchor="middle"
              fill="var(--srv2-accent-2)"
              fontFamily="var(--ss-font-mono)"
              fontSize="10"
              letterSpacing="0.05em"
            >
              {row.tag}
            </text>
            <rect
              x="176"
              y={y - 6}
              width={row.width}
              height="12"
              rx="6"
              fill={row.lead ? "url(#core-index-accent)" : "var(--srv2-ink-faint)"}
              opacity={row.lead ? 1 : 0.55}
            />
          </m.g>
        );
      })}
      <defs>
        <linearGradient id="core-index-accent" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--srv2-accent)" />
          <stop offset="100%" stopColor="var(--srv2-accent-2)" />
        </linearGradient>
      </defs>
      <rect
        x="562"
        y="120"
        width="4"
        height="336"
        rx="2"
        fill="rgba(255,255,255,0.06)"
      />
      {!reducedMotion ? (
        <m.rect
          x="562"
          width="4"
          height="86"
          rx="2"
          fill="url(#core-index-accent)"
          initial={{ y: 120 }}
          animate={{ y: [120, 370, 120] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
    </SignatureShell>
  );
}

/** /about — six disciplines orbiting a fixed centre mark, joined by faint
 * radii and enclosed by a slow-rotating ring. Distinct from a hex diagram: a
 * true circular orbit with the ring — not the connectors — carrying the
 * motion. */
export function StudioOrbitSignature({
  label,
  metrics,
}: {
  label: string;
  metrics?: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const disciplines = ["Strategy", "Copy", "Design", "Engineering", "AI", "Automation"];
  const cx = 300;
  const cy = 250;
  const r = 168;

  return (
    <SignatureShell
      ariaLabel="Diagram: six disciplines — strategy, copy, design, engineering, AI, automation — arranged on an orbit ring around a fixed Silverstone centre mark."
      label={label}
      metrics={metrics}
    >
      <defs>
        <linearGradient id="core-orbit-accent" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--srv2-accent)" />
          <stop offset="100%" stopColor="var(--srv2-accent-2)" />
        </linearGradient>
        <radialGradient id="core-orbit-glow" cx="50%" cy="46%" r="60%">
          <stop offset="0%" stopColor="var(--srv2-accent)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--srv2-accent)" stopOpacity="0" />
        </radialGradient>
        <filter id="core-orbit-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + 90} fill="url(#core-orbit-glow)" />
      {/* Slow counter-rotating satellite ring, independent of the main orbit
          below — a second layer of live motion at a different radius and
          speed, matching the treatment used on the Book and Services Hub
          signatures. */}
      {!reducedMotion ? (
        <m.g
          style={{ transformOrigin: `${String(cx)}px ${String(cy)}px` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={r + 40}
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1"
            strokeDasharray="1 9"
          />
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle
                key={deg}
                cx={cx + (r + 40) * Math.cos(rad)}
                cy={cy + (r + 40) * Math.sin(rad)}
                r="2.5"
                fill="var(--srv2-accent-2)"
                opacity="0.6"
              />
            );
          })}
        </m.g>
      ) : null}
      {/* Fine bezel ticks just inside the main orbit ring. */}
      {Array.from({ length: 54 }).map((_, tick) => {
        const angle = (tick / 54) * Math.PI * 2;
        const major = tick % 3 === 0;
        const outerTickR = r - 8;
        const innerTickR = major ? r - 18 : r - 13;
        return (
          <line
            key={tick}
            x1={cx + innerTickR * Math.cos(angle)}
            y1={cy + innerTickR * Math.sin(angle)}
            x2={cx + outerTickR * Math.cos(angle)}
            y2={cy + outerTickR * Math.sin(angle)}
            stroke="var(--srv2-ink-faint)"
            strokeWidth={major ? 1.2 : 0.7}
            opacity={major ? 0.4 : 0.2}
          />
        );
      })}
      {!reducedMotion ? (
        <m.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#core-orbit-accent)"
          strokeWidth="1.4"
          strokeDasharray="3 11"
          opacity="0.65"
          animate={{ rotate: 360 }}
          style={{ transformOrigin: `${String(cx)}px ${String(cy)}px` }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--srv2-accent)"
          strokeWidth="1.4"
          strokeDasharray="3 11"
          opacity="0.65"
        />
      )}
      {disciplines.map((name, index) => {
        const angle = (index / disciplines.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return (
          <m.g
            key={name}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.09 }}
          >
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="var(--srv2-hairline)"
              strokeWidth="1"
            />
            <rect
              x={x - 46}
              y={y - 18}
              width="92"
              height="36"
              rx="12"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent)"
              strokeWidth="1.4"
            />
            <text
              x={x}
              y={y + 5}
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontFamily="var(--ss-font-mono)"
              fontSize="13"
            >
              {name}
            </text>
          </m.g>
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r="62"
        fill="var(--srv2-accent)"
        opacity="0.2"
        filter="url(#core-orbit-blur)"
      />
      {!reducedMotion ? (
        <m.circle
          cx={cx}
          cy={cy}
          r="55"
          fill="none"
          stroke="url(#core-orbit-accent)"
          strokeWidth="2.5"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.9, 0.5] }}
          style={{ transformOrigin: `${String(cx)}px ${String(cy)}px` }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <circle
          cx={cx}
          cy={cy}
          r="55"
          fill="none"
          stroke="url(#core-orbit-accent)"
          strokeWidth="2.5"
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r="52"
        fill="var(--ss-v2-void-black)"
        stroke="var(--srv2-accent-2)"
        strokeWidth="2"
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fill="var(--ss-v2-chrome)"
        fontFamily="var(--ss-font-mono)"
        fontSize="13"
      >
        SILVERSTONE
      </text>
      <text
        x={cx}
        y={cy + 15}
        textAnchor="middle"
        fill="var(--srv2-ink-faint)"
        fontFamily="var(--ss-font-mono)"
        fontSize="11"
      >
        one standard
      </text>
    </SignatureShell>
  );
}

/** /pricing — an investment ledger: four proportioned bars for the components
 * that make up a scope, closing on a summed total. Distinct from a diagram:
 * this is a data visualisation, not a process map. */
export function ScopeLedgerSignature({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const rows = [
    { name: "Commercial definition", width: 150 },
    { name: "Experience & system design", width: 300 },
    { name: "Implementation & assurance", width: 420 },
    { name: "Ownership & evolution", width: 210 },
  ];
  const maxWidth = 420;

  return (
    <SignatureShell
      ariaLabel="Diagram: an investment ledger with four proportioned bars — commercial definition, experience and system design, implementation and assurance, ownership and evolution — summing to one scoped total."
      label={label}
      metrics={metrics}
    >
      <defs>
        <linearGradient id="core-ledger-accent" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--srv2-accent)" />
          <stop offset="100%" stopColor="var(--srv2-accent-2)" />
        </linearGradient>
      </defs>
      <text
        x="60"
        y="82"
        fill="var(--srv2-ink-faint)"
        fontFamily="var(--ss-font-mono)"
        fontSize="12"
        letterSpacing="0.08em"
      >
        SCOPE LEDGER / PRICED AFTER DISCOVERY
      </text>
      {rows.map((row, index) => {
        const y = 128 + index * 72;
        return (
          <m.g
            key={row.name}
            initial={reducedMotion ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.1 }}
          >
            <text
              x="60"
              y={y - 12}
              fill="var(--ss-v2-chrome)"
              fontFamily="var(--ss-font-mono)"
              fontSize="13"
            >
              {row.name}
            </text>
            <rect
              x="60"
              y={y}
              width={maxWidth}
              height="16"
              rx="8"
              fill="rgba(255,255,255,0.05)"
            />
            <m.rect
              x="60"
              y={y}
              height="16"
              rx="8"
              fill="url(#core-ledger-accent)"
              initial={reducedMotion ? { width: row.width } : { width: 0 }}
              whileInView={{ width: row.width }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.8,
                delay: reducedMotion ? 0 : 0.15 + index * 0.1,
              }}
            />
          </m.g>
        );
      })}
      <line
        x1="60"
        y1="420"
        x2="480"
        y2="420"
        stroke="var(--srv2-hairline)"
        strokeWidth="1"
      />
      <text
        x="60"
        y="450"
        fill="var(--srv2-ink-faint)"
        fontFamily="var(--ss-font-mono)"
        fontSize="12"
      >
        ONE WRITTEN PROPOSAL, NO PUBLIC RATE CARD
      </text>
    </SignatureShell>
  );
}

/** /contact — a correspondence route: a written message travelling from a
 * form node to a reviewed inbox across three checkpoints. Distinct from the
 * voice-agent call-routing timeline elsewhere in the system: framed as
 * asynchronous written correspondence, not a live call. */
export function SignalRouteSignature({
  label,
  metrics,
}: {
  label: string;
  metrics?: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const checkpoints = [
    { x: 150, name: "Received" },
    { x: 300, name: "Reviewed" },
    { x: 450, name: "Routed" },
  ];

  return (
    <SignatureShell
      ariaLabel="Diagram: a written enquiry travelling from a form node through received, reviewed and routed checkpoints to a monitored inbox."
      label={label}
      metrics={metrics}
    >
      <defs>
        <linearGradient id="core-signal-accent" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--srv2-accent)" />
          <stop offset="100%" stopColor="var(--srv2-accent-2)" />
        </linearGradient>
        <radialGradient id="core-signal-glow" cx="50%" cy="44%" r="60%">
          <stop offset="0%" stopColor="var(--srv2-accent)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--srv2-accent)" stopOpacity="0" />
        </radialGradient>
        <filter id="core-signal-blur" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect x="10" y="120" width="580" height="220" fill="url(#core-signal-glow)" />
      {/* Fine measured-path ticks along the route — the same instrument-console
          precision used on the Book and Services Hub signatures, here reading
          as a monitored, always-on channel rather than a plain connector. */}
      {Array.from({ length: 17 }).map((_, tick) => {
        const x = 150 + tick * 19.5;
        return (
          <line
            key={tick}
            x1={x}
            y1="222"
            x2={x}
            y2="238"
            stroke="var(--srv2-ink-faint)"
            strokeWidth="1"
            opacity={tick % 4 === 0 ? 0.4 : 0.18}
          />
        );
      })}
      <rect
        x="46"
        y="200"
        width="92"
        height="60"
        rx="14"
        fill="var(--ss-v2-void-black)"
        stroke="var(--srv2-accent)"
        strokeWidth="2"
        style={{
          filter:
            "drop-shadow(0 0 8px color-mix(in srgb, var(--srv2-accent) 45%, transparent))",
        }}
      />
      <text
        x="92"
        y="235"
        textAnchor="middle"
        fill="var(--ss-v2-chrome)"
        fontFamily="var(--ss-font-mono)"
        fontSize="13"
      >
        FORM
      </text>
      <rect
        x="462"
        y="200"
        width="92"
        height="60"
        rx="14"
        fill="var(--ss-v2-void-black)"
        stroke="var(--srv2-accent-2)"
        strokeWidth="2"
        style={{
          filter:
            "drop-shadow(0 0 8px color-mix(in srgb, var(--srv2-accent-2) 45%, transparent))",
        }}
      />
      <text
        x="508"
        y="235"
        textAnchor="middle"
        fill="var(--ss-v2-chrome)"
        fontFamily="var(--ss-font-mono)"
        fontSize="13"
      >
        INBOX
      </text>
      <line
        x1="138"
        y1="230"
        x2="462"
        y2="230"
        stroke="var(--srv2-hairline)"
        strokeWidth="2"
      />
      {!reducedMotion ? (
        <>
          <m.circle
            cy="230"
            r="11"
            fill="var(--srv2-accent)"
            opacity="0.28"
            filter="url(#core-signal-blur)"
            initial={{ cx: 138, opacity: 0 }}
            animate={{ cx: [138, 462], opacity: [0, 0.28, 0.28, 0] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              repeatDelay: 0.7,
              ease: "easeInOut",
            }}
          />
          <m.circle
            cy="230"
            r="5"
            fill="url(#core-signal-accent)"
            initial={{ cx: 138, opacity: 0 }}
            animate={{ cx: [138, 462], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              repeatDelay: 0.7,
              ease: "easeInOut",
            }}
            style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent))" }}
          />
        </>
      ) : null}
      {checkpoints.map((point, index) => (
        <m.g
          key={point.name}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: reducedMotion ? 0 : 0.2 + index * 0.12 }}
        >
          {!reducedMotion ? (
            <m.circle
              cx={point.x}
              cy="230"
              r="7"
              fill="none"
              stroke="var(--srv2-accent)"
              strokeWidth="1.5"
              animate={{ scale: [1, 1.5, 1], opacity: [0.55, 0, 0.55] }}
              style={{ transformOrigin: `${String(point.x)}px 230px` }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeOut",
                delay: index * 0.4,
              }}
            />
          ) : null}
          <circle
            cx={point.x}
            cy="230"
            r="7"
            fill="var(--ss-v2-void-black)"
            stroke="var(--srv2-accent)"
            strokeWidth="2"
          />
          <text
            x={point.x}
            y="268"
            textAnchor="middle"
            fill="var(--srv2-ink-soft)"
            fontFamily="var(--ss-font-mono)"
            fontSize="13"
          >
            {point.name}
          </text>
        </m.g>
      ))}
      <text
        x="300"
        y="360"
        textAnchor="middle"
        fill="var(--srv2-ink-faint)"
        fontFamily="var(--ss-font-mono)"
        fontSize="12"
        letterSpacing="0.06em"
      >
        WRITTEN CONTEXT, READ BEFORE ANY REPLY
      </text>
    </SignatureShell>
  );
}

/** /book — a 30-minute agenda dial: four sectors of a circular clock face,
 * one for each discussion topic, with a sweeping hand. Distinct from the
 * other five diagrams: the only one built as a clock. */
export function AgendaDialSignature({
  label,
  metrics,
}: {
  label: string;
  metrics?: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const cx = 300;
  const cy = 250;
  const r = 150;
  const topics = [
    "Current reality",
    "Commercial\nconsequence",
    "Decision\nboundary",
    "Next step",
  ];

  return (
    <SignatureShell
      ariaLabel="Diagram: a 30-minute agenda dial divided into four sectors — current reality, commercial consequence, decision boundary, next step — with a sweeping hand."
      label={label}
      metrics={metrics}
    >
      <defs>
        <linearGradient id="core-dial-accent" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--srv2-accent)" />
          <stop offset="100%" stopColor="var(--srv2-accent-2)" />
        </linearGradient>
        <radialGradient id="core-dial-hub" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="var(--srv2-accent-2)" />
          <stop offset="100%" stopColor="var(--srv2-accent)" />
        </radialGradient>
        <filter id="core-dial-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {/* Slow counter-rotating satellite ring — a second, independent layer of
          motion so the dial reads as a live instrument rather than a static
          clock face with one moving hand. */}
      {!reducedMotion ? (
        <m.g
          animate={{ rotate: -360 }}
          style={{ transformOrigin: `${String(cx)}px ${String(cy)}px` }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={r + 34}
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1"
            strokeDasharray="1 7"
          />
          {[0, 90, 180, 270].map((deg) => {
            const angle = (deg * Math.PI) / 180;
            const x = cx + (r + 34) * Math.cos(angle);
            const y = cy + (r + 34) * Math.sin(angle);
            return (
              <circle
                key={deg}
                cx={x}
                cy={y}
                r="2.5"
                fill="var(--srv2-accent)"
                opacity="0.65"
              />
            );
          })}
        </m.g>
      ) : null}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--srv2-hairline)"
        strokeWidth="1.5"
      />
      {/* Fine minute-tick bezel: 60 ticks, every fifth slightly longer —
          instrument-console precision framing the four bold sector dividers. */}
      {Array.from({ length: 60 }).map((_, tick) => {
        const angle = (tick / 60) * Math.PI * 2 - Math.PI / 2;
        const major = tick % 5 === 0;
        const innerTickR = r + 8;
        const outerTickR = major ? r + 20 : r + 13;
        const x1 = cx + innerTickR * Math.cos(angle);
        const y1 = cy + innerTickR * Math.sin(angle);
        const x2 = cx + outerTickR * Math.cos(angle);
        const y2 = cy + outerTickR * Math.sin(angle);
        return (
          <line
            key={tick}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--srv2-ink-faint)"
            strokeWidth={major ? 1.4 : 0.8}
            opacity={major ? 0.55 : 0.28}
          />
        );
      })}
      {topics.map((_, index) => {
        const angle = (index / topics.length) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + (r - 6) * Math.cos(angle);
        const y1 = cy + (r - 6) * Math.sin(angle);
        const x2 = cx + (r + 6) * Math.cos(angle);
        const y2 = cy + (r + 6) * Math.sin(angle);
        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--srv2-accent)"
            strokeWidth="2"
          />
        );
      })}
      {!reducedMotion ? (
        <m.g
          animate={{ rotate: 360 }}
          style={{ transformOrigin: `${String(cx)}px ${String(cy)}px` }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - r + 20}
            stroke="url(#core-dial-accent)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Glowing tip travels with the hand — a soft trailing light rather
              than a sharp, static needle. */}
          <circle
            cx={cx}
            cy={cy - r + 20}
            r="9"
            fill="var(--srv2-accent)"
            opacity="0.3"
            filter="url(#core-dial-blur)"
          />
          <circle cx={cx} cy={cy - r + 20} r="3" fill="var(--srv2-accent-2)" />
        </m.g>
      ) : (
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy - r + 20}
          stroke="var(--srv2-accent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      <circle cx={cx} cy={cy} r="9" fill="url(#core-dial-hub)" />
      <circle
        cx={cx}
        cy={cy}
        r="9"
        fill="none"
        stroke="var(--ss-v2-void-black)"
        strokeWidth="1.5"
      />
      {topics.map((label2, index) => {
        const angle = (index / topics.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / 4;
        const x = cx + (r + 46) * Math.cos(angle);
        const y = cy + (r + 46) * Math.sin(angle);
        const lines = label2.split("\n");
        return (
          <m.g
            key={label2}
            initial={reducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.1 }}
          >
            {lines.map((line, lineIndex) => (
              <text
                key={line}
                x={x}
                y={y + lineIndex * 16 - (lines.length - 1) * 8}
                textAnchor="middle"
                fill="var(--srv2-ink-soft)"
                fontFamily="var(--ss-font-mono)"
                fontSize="12"
              >
                {line}
              </text>
            ))}
          </m.g>
        );
      })}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fill="var(--ss-v2-chrome)"
        fontFamily="var(--ss-font-display)"
        fontWeight="600"
        fontSize="30"
      >
        30
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fill="var(--srv2-ink-faint)"
        fontFamily="var(--ss-font-mono)"
        fontSize="12"
        letterSpacing="0.08em"
      >
        MINUTES
      </text>
    </SignatureShell>
  );
}
