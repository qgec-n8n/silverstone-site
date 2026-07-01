/**
 * Content Creation signature — "Editorial Intelligence System". One approved
 * source document passes through a human governance gate, fans out to four
 * distribution channels, then closes with a governed publishing-queue panel
 * showing each channel's next scheduled slot. Distinct animation language: a
 * single fan-out (1 → gate → 4) rather than convergence, divergence, or a
 * timeline — and explicitly no typewriter/text-scramble effect anywhere in
 * this component.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { FileText, Globe, MessageSquare, Share2 } from "~/components/icons/lucide";

import {
  SignatureChrome,
  SignatureMetricStrip,
  SignatureStatusBar,
} from "./signature-chrome";

const channels = [
  { label: "Website", y: 40, Icon: Globe },
  { label: "Insight article", y: 110, Icon: FileText },
  { label: "Email", y: 180, Icon: MessageSquare },
  { label: "Social", y: 250, Icon: Share2 },
];

const queue = [
  { day: "Mon", channel: "Website", Icon: Globe },
  { day: "Wed", channel: "Insight", Icon: FileText },
  { day: "Thu", channel: "Email", Icon: MessageSquare },
  { day: "Fri", channel: "Social", Icon: Share2 },
];

export function EditorialIntelligence({
  label,
  metrics,
}: {
  label: string;
  metrics: string[];
}) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: one approved source passes through a governance gate, then distributes to website, insight article, email and social channels, with a governed publishing queue below showing each channel's next scheduled slot."
    >
      <SignatureStatusBar label={label} />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 580" className="ss-srv2-signature__svg">
          <defs>
            <linearGradient id="srv2-editorial-accent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--srv2-accent)" />
              <stop offset="100%" stopColor="var(--srv2-accent-2)" />
            </linearGradient>
          </defs>

          {/* Source document */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.5 }}
          >
            <rect
              x="30"
              y="118"
              width="64"
              height="64"
              rx="12"
              fill="rgba(255,255,255,0.03)"
              stroke="var(--srv2-hairline)"
            />
            <foreignObject x="46" y="134" width="32" height="32">
              <FileText
                style={{ width: "2rem", height: "2rem", color: "var(--srv2-accent)" }}
              />
            </foreignObject>
            <text
              x="62"
              y="200"
              textAnchor="middle"
              fill="var(--srv2-ink-faint)"
              fontSize="11"
              fontFamily="var(--ss-font-mono)"
            >
              Source
            </text>
          </m.g>

          {/* Path to gate */}
          {reducedMotion ? (
            <path
              d="M94 150 H210"
              stroke="url(#srv2-editorial-accent)"
              strokeWidth="2"
            />
          ) : (
            <m.path
              d="M94 150 H210"
              stroke="url(#srv2-editorial-accent)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
            />
          )}

          {/* Governance gate */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.5,
              delay: reducedMotion ? 0 : 0.4,
            }}
          >
            {!reducedMotion ? (
              <m.circle
                cx="240"
                cy="150"
                r="36"
                fill="url(#srv2-editorial-accent)"
                initial={{ opacity: 0.12 }}
                animate={{ opacity: [0.12, 0.3, 0.12] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : (
              <circle
                cx="240"
                cy="150"
                r="36"
                fill="url(#srv2-editorial-accent)"
                opacity="0.16"
              />
            )}
            <circle
              cx="240"
              cy="150"
              r="22"
              fill="var(--ss-v2-void-black)"
              stroke="var(--srv2-accent)"
              strokeWidth="2"
            />
            <text
              x="240"
              y="196"
              textAnchor="middle"
              fill="var(--ss-v2-chrome)"
              fontSize="11.5"
              fontFamily="var(--ss-font-mono)"
              letterSpacing="0.03em"
            >
              GOVERNANCE GATE
            </text>
          </m.g>

          {/* Fan-out to channels */}
          {channels.map((channel, index) => (
            <g key={channel.label}>
              {reducedMotion ? (
                <path
                  d={`M262 150 C 340 150, 360 ${String(channel.y)}, 440 ${String(channel.y)}`}
                  fill="none"
                  stroke="var(--srv2-hairline)"
                  strokeWidth="2"
                />
              ) : (
                <m.path
                  d={`M262 150 C 340 150, 360 ${String(channel.y)}, 440 ${String(channel.y)}`}
                  fill="none"
                  stroke="var(--srv2-hairline)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6 + index * 0.12,
                    ease: "easeInOut",
                  }}
                />
              )}
              <m.g
                initial={reducedMotion ? false : { opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: reducedMotion ? 0.01 : 0.4,
                  delay: reducedMotion ? 0 : 0.9 + index * 0.12,
                }}
              >
                <circle
                  cx="464"
                  cy={channel.y}
                  r="22"
                  fill="rgba(255,255,255,0.03)"
                  stroke="var(--srv2-hairline)"
                />
                <foreignObject x="452" y={channel.y - 12} width="24" height="24">
                  <channel.Icon
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      color: "var(--srv2-accent-2)",
                    }}
                  />
                </foreignObject>
                <text
                  x="500"
                  y={channel.y + 4}
                  fill="var(--srv2-ink-soft)"
                  fontSize="12"
                  fontFamily="var(--ss-font-body)"
                >
                  {channel.label}
                </text>
              </m.g>
            </g>
          ))}

          {/* Publishing queue — governed, scheduled */}
          <m.g
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.6,
              delay: reducedMotion ? 0 : 1.3,
            }}
          >
            <line
              x1="30"
              y1="320"
              x2="570"
              y2="320"
              stroke="var(--srv2-hairline)"
              strokeWidth="1"
              opacity="0.6"
            />
            <text
              x="30"
              y="348"
              fill="var(--srv2-ink-faint)"
              fontSize="11"
              fontFamily="var(--ss-font-mono)"
              letterSpacing="0.06em"
            >
              PUBLISHING QUEUE — GOVERNED
            </text>
            {queue.map((item, index) => (
              <g
                key={item.day}
                transform={`translate(${String(30 + index * 138)}, 368)`}
              >
                <rect
                  width="122"
                  height="150"
                  rx="12"
                  fill="rgba(255,255,255,0.03)"
                  stroke="var(--srv2-hairline)"
                />
                <circle
                  cx="24"
                  cy="26"
                  r="10"
                  fill="var(--ss-v2-void-black)"
                  stroke="var(--srv2-accent)"
                  strokeWidth="1.5"
                />
                <path
                  d="M19 26 L23 30 L30 21"
                  fill="none"
                  stroke="var(--srv2-accent)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x="42"
                  y="30"
                  fill="var(--ss-v2-chrome)"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="var(--ss-font-display)"
                >
                  {item.day}
                </text>
                <rect
                  x="18"
                  y="56"
                  width="90"
                  height="8"
                  rx="4"
                  fill="var(--srv2-ink-faint)"
                />
                <rect
                  x="18"
                  y="72"
                  width="64"
                  height="8"
                  rx="4"
                  fill="var(--srv2-ink-faint)"
                  opacity="0.55"
                />
                <foreignObject x="18" y="104" width="20" height="20">
                  <item.Icon
                    style={{
                      width: "1.1rem",
                      height: "1.1rem",
                      color: "var(--srv2-accent-2)",
                    }}
                  />
                </foreignObject>
                <text
                  x="44"
                  y="119"
                  fill="var(--srv2-ink-soft)"
                  fontSize="10.5"
                  fontFamily="var(--ss-font-mono)"
                >
                  {item.channel}
                </text>
              </g>
            ))}
          </m.g>
        </m.svg>
      </div>
      <SignatureMetricStrip metrics={metrics} />
      <SignatureChrome />
    </div>
  );
}
