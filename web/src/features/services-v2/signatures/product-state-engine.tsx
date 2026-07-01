/**
 * App Development signature — "Product State Engine". Four connected layers
 * (User → Interface → API → Data) with a signal travelling top-to-bottom, and
 * a state chip cycling Loading → Success → Retry to dramatise the resilience
 * a disciplined first release is built around. Distinct animation language
 * from Web Design's horizontal assemble: vertical depth stagger + a looping
 * state-cycle rather than a one-shot path draw.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

const layers = [
  { y: 48, label: "User", detail: "Taps confirm" },
  { y: 148, label: "Interface", detail: "Optimistic update" },
  { y: 248, label: "API", detail: "Validates request" },
  { y: 348, label: "Data", detail: "Commits state" },
];

const states = [
  { label: "Loading", color: "var(--srv2-accent)" },
  { label: "Success", color: "#6ee7b7" },
  { label: "Retry", color: "#fbbf7d" },
];

export function ProductStateEngine() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: an action flows from the user through the interface, API and data layers, with the system cycling through loading, success and retry states."
    >
      <m.svg viewBox="0 0 600 460" className="ss-srv2-signature__svg">
        <defs>
          <linearGradient id="srv2-state-accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--srv2-accent)" />
            <stop offset="100%" stopColor="var(--srv2-accent-2)" />
          </linearGradient>
        </defs>

        {/* Connector spine */}
        <line
          x1="150"
          y1="48"
          x2="150"
          y2="348"
          stroke="var(--srv2-hairline)"
          strokeWidth="2"
        />
        {!reducedMotion ? (
          <m.circle
            cx="150"
            r="5"
            fill="var(--srv2-accent)"
            initial={{ cy: 48, opacity: 0 }}
            animate={{ cy: [48, 148, 248, 348], opacity: [0, 1, 1, 1, 0] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: "easeInOut",
            }}
            style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent))" }}
          />
        ) : null}

        {/* Layers — staggered depth reveal (distinct from Web Design's assemble) */}
        {layers.map((layer, index) => (
          <m.g
            key={layer.label}
            initial={reducedMotion ? false : { opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.6,
              delay: reducedMotion ? 0 : index * 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <rect
              x="60"
              y={layer.y - 28}
              width="340"
              height="56"
              rx="12"
              fill="rgba(255,255,255,0.03)"
              stroke="var(--srv2-hairline)"
            />
            <circle cx="90" cy={layer.y} r="6" fill="url(#srv2-state-accent)" />
            <text
              x="112"
              y={layer.y - 4}
              fill="var(--ss-v2-chrome)"
              fontSize="15"
              fontWeight="600"
              fontFamily="var(--ss-font-display)"
            >
              {layer.label}
            </text>
            <text
              x="112"
              y={layer.y + 16}
              fill="var(--srv2-ink-faint)"
              fontSize="12"
              fontFamily="var(--ss-font-mono)"
            >
              {layer.detail}
            </text>
          </m.g>
        ))}

        {/* State cycle chip */}
        <g transform="translate(430, 48)">
          <text
            x="0"
            y="-14"
            fill="var(--srv2-ink-faint)"
            fontSize="11"
            fontFamily="var(--ss-font-mono)"
            letterSpacing="0.06em"
          >
            SYSTEM STATE
          </text>
          <rect
            width="130"
            height="300"
            rx="16"
            fill="rgba(255,255,255,0.03)"
            stroke="var(--srv2-hairline)"
          />
          {states.map((state, index) => (
            <g
              key={state.label}
              transform={`translate(16, ${String(44 + index * 92)})`}
            >
              {!reducedMotion ? (
                <m.circle
                  r="7"
                  fill={state.color}
                  initial={{ opacity: 0.25 }}
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    delay: index * 1.05,
                    ease: "easeInOut",
                  }}
                />
              ) : (
                <circle r="7" fill={state.color} opacity={index === 1 ? 1 : 0.4} />
              )}
              <text
                x="20"
                y="5"
                fill="var(--ss-v2-chrome)"
                fontSize="14"
                fontFamily="var(--ss-font-body)"
              >
                {state.label}
              </text>
            </g>
          ))}
        </g>
      </m.svg>
    </div>
  );
}
