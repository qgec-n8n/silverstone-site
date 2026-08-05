/**
 * /services hub — premium service-discovery experience.
 * Visual concept: Service Constellation — seven disciplines orbiting one
 * commercial objective. Each discovery card carries its own service accent
 * (drawn from the services-v2 route art), so the hub previews every page's
 * identity without flattening them into one colour.
 */
import "~/styles/services-v2/services-v2.css";
import "~/styles/industries-v2/industries-v2.css";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { CSSProperties } from "react";

import {
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Workflow,
} from "~/components/icons/lucide";
import { approvedServicesByRoute } from "~/content/services/approved-services";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

import { DemoBay } from "~/features/hubs-v2/demo-bay";
import { Reveal, SectionHead } from "~/features/services-v2/components/primitives";
import { SecondaryHero } from "~/features/services-v2/components/secondary-hero";
import {
  BenchmarkConsole,
  FinalCta,
  RelatedRail,
} from "~/features/services-v2/components/sections";
import {
  SignatureChrome,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";
import { routeArt } from "~/features/services-v2/content/route-art";
import { LinkedText } from "~/features/industries-v2/components/industry-sections";

const HUB_ACCENT: CSSProperties = {
  "--srv2-accent": "#22d3ee",
  "--srv2-accent-2": "#7c5cff",
} as CSSProperties;

/** Verified Silverstone AI figures reused from the approved service registers. */
const HUB_METRICS = [
  "<10 seconds — Enquiry response time (after implementation)",
  "+66% — Increase in phone availability",
  "15 hours — Saved per week",
];

const CONSTELLATION = [
  { angle: -90, label: "Web" },
  { angle: -39, label: "Apps" },
  { angle: 13, label: "Voice" },
  { angle: 64, label: "Reception" },
  { angle: 116, label: "Content" },
  { angle: 167, label: "Automation" },
  { angle: 219, label: "Consulting" },
];

function ServiceConstellation() {
  const reducedMotion = useReducedMotion() ?? false;
  const center = { x: 300, y: 270 };
  const radius = 165;

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: seven Silverstone disciplines — web, apps, voice, reception, content, automation and consulting — orbiting one commercial objective: booked discovery calls."
    >
      <SignatureStatusBar label="Service architecture" />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 600" className="ss-srv2-signature__svg">
          <defs>
            <radialGradient id="svc-ambient-glow" cx="50%" cy="46%" r="60%">
              <stop offset="0%" stopColor="var(--srv2-accent)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--srv2-accent)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="svc-hub-fill" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="var(--srv2-accent-2)" />
              <stop offset="100%" stopColor="var(--srv2-accent)" />
            </radialGradient>
            <filter id="svc-hub-blur" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <circle
            cx={center.x}
            cy={center.y}
            r={radius + 90}
            fill="url(#svc-ambient-glow)"
          />
          {/* Slow counter-rotating outer ring with satellite marks — an
              independent layer of motion beneath the orbiting node ring, so
              the diagram reads as a live system rather than a static graph
              with a single moving accent. */}
          {!reducedMotion ? (
            <m.g
              style={{ transformOrigin: "300px 270px" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx={center.x}
                cy={center.y}
                r={radius + 38}
                fill="none"
                stroke="var(--srv2-hairline)"
                strokeWidth="1"
                strokeDasharray="1 9"
              />
              {[0, 120, 240].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <circle
                    key={deg}
                    cx={center.x + (radius + 38) * Math.cos(rad)}
                    cy={center.y + (radius + 38) * Math.sin(rad)}
                    r="2.5"
                    fill="var(--srv2-accent-2)"
                    opacity="0.6"
                  />
                );
              })}
            </m.g>
          ) : null}
          <circle
            cx={center.x}
            cy={center.y}
            r={radius}
            fill="none"
            stroke="var(--srv2-hairline)"
            strokeWidth="1.3"
            strokeDasharray="4 8"
          />
          {/* Fine bezel ticks just outside the orbit ring — instrument-console
              precision framing the seven discipline nodes. */}
          {Array.from({ length: 48 }).map((_, tick) => {
            const angle = (tick / 48) * Math.PI * 2;
            const major = tick % 4 === 0;
            const innerTickR = radius + 6;
            const outerTickR = major ? radius + 16 : radius + 11;
            return (
              <line
                key={tick}
                x1={center.x + innerTickR * Math.cos(angle)}
                y1={center.y + innerTickR * Math.sin(angle)}
                x2={center.x + outerTickR * Math.cos(angle)}
                y2={center.y + outerTickR * Math.sin(angle)}
                stroke="var(--srv2-ink-faint)"
                strokeWidth={major ? 1.2 : 0.7}
                opacity={major ? 0.45 : 0.22}
              />
            );
          })}
          {CONSTELLATION.map((node, index) => {
            const radians = (node.angle * Math.PI) / 180;
            const x = center.x + radius * Math.cos(radians);
            const y = center.y + radius * Math.sin(radians);
            return (
              <m.g
                key={node.label}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: reducedMotion ? 0 : index * 0.1 }}
              >
                <line
                  x1={center.x}
                  y1={center.y}
                  x2={x}
                  y2={y}
                  stroke="var(--srv2-hairline)"
                  strokeWidth="1"
                  opacity="0.45"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="9"
                  fill="var(--ss-v2-void-black)"
                  stroke="var(--srv2-accent)"
                  strokeWidth="1.8"
                  style={{
                    filter:
                      "drop-shadow(0 0 5px color-mix(in srgb, var(--srv2-accent) 55%, transparent))",
                  }}
                />
                <text
                  x={x}
                  y={y + (y > center.y ? 28 : -18)}
                  textAnchor="middle"
                  fill="var(--srv2-ink-soft)"
                  fontSize="13.5"
                  fontFamily="var(--ss-font-mono)"
                >
                  {node.label}
                </text>
              </m.g>
            );
          })}
          {!reducedMotion ? (
            <m.g
              style={{ transformOrigin: "300px 270px" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx={center.x + radius}
                cy={center.y}
                r="4.5"
                fill="var(--srv2-accent-2)"
                style={{ filter: "drop-shadow(0 0 6px var(--srv2-accent-2))" }}
              />
            </m.g>
          ) : null}
          <circle
            cx={center.x}
            cy={center.y}
            r="52"
            fill="var(--srv2-accent)"
            opacity="0.22"
            filter="url(#svc-hub-blur)"
          />
          {!reducedMotion ? (
            <m.circle
              cx={center.x}
              cy={center.y}
              r="45"
              fill="none"
              stroke="url(#svc-hub-fill)"
              strokeWidth="2.5"
              animate={{ scale: [1, 1.05, 1], opacity: [0.55, 0.95, 0.55] }}
              style={{ transformOrigin: "300px 270px" }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <circle
              cx={center.x}
              cy={center.y}
              r="45"
              fill="none"
              stroke="url(#svc-hub-fill)"
              strokeWidth="2.5"
            />
          )}
          <circle
            cx={center.x}
            cy={center.y}
            r="42"
            fill="var(--ss-v2-void-black)"
            stroke="var(--srv2-accent)"
            strokeWidth="2"
          />
          <text
            x={center.x}
            y={center.y - 2}
            textAnchor="middle"
            fill="var(--ss-v2-chrome)"
            fontSize="12.5"
            fontFamily="var(--ss-font-mono)"
          >
            BOOKED
          </text>
          <text
            x={center.x}
            y={center.y + 15}
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="11.5"
            fontFamily="var(--ss-font-mono)"
          >
            calls
          </text>
        </m.svg>
      </div>
      <SignatureChrome />
    </div>
  );
}

const SERVICE_ORDER = [
  "/services/ai-automation",
  "/services/ai-receptionists",
  "/services/ai-voice-agents",
  "/services/web-design-development",
  "/services/app-development",
  "/services/content-creation",
  "/services/ai-consulting",
] as const;

const SERVICE_BLURB: Record<(typeof SERVICE_ORDER)[number], string> = {
  "/services/ai-automation":
    "Engineer the work between your systems — triggers, decisions, approvals and exceptions.",
  "/services/ai-receptionists":
    "A front desk that answers, qualifies and knows exactly when to hand over.",
  "/services/ai-voice-agents":
    "Voice agents designed for real conversations — and real consequences.",
  "/services/web-design-development":
    "A website engineered to move buyers forward, wired into your operations.",
  "/services/app-development":
    "The smallest app that proves the value, then grows on evidence.",
  "/services/content-creation":
    "Turn expertise into a governed content engine with approval gates.",
  "/services/ai-consulting": "Decide what to automate before you buy the tools.",
};

export function ServicesHubExperience() {
  return (
    <div className="ss-srv2 ss-hub2" data-hub="services" style={HUB_ACCENT}>
      <SecondaryHero
        eyebrow="Silverstone service architecture"
        icon={Workflow}
        title="Services built around *real business workflows*"
        titleId="hub2-lead"
        lead="Seven disciplines, one operating standard: every system is scoped around a costly problem, wired into your source of truth and measured after launch. Choose the entry point — the architecture connects behind it."
        points={[
          "Scoped before anything is built",
          "Human judgement designed in, not bolted on",
          "Measured against your baseline, not our slides",
        ]}
        primaryCtaLabel="Book a discovery call"
        secondaryCtaLabel="Explore the seven services"
        secondaryCtaHref="/services#hub2-services"
        showcase={<ServiceConstellation />}
      />
      <TrustStrip />
      <DemoBay />

      <section className="ss-srv2-section" aria-labelledby="hub2-services">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Choose your entry point"
            icon={Sparkles}
            heading="Seven systems, *one connected architecture*"
            headingId="hub2-services"
            lead="Every service page opens *its own cinematic system* — explore the discipline closest to the problem you can already name."
          />
          <div className="ss-hub2-grid">
            {SERVICE_ORDER.map((route, index) => {
              const art = routeArt[route];
              const content = approvedServicesByRoute[route];
              const Icon = art.icon;
              return (
                <Reveal
                  key={route}
                  kind="card"
                  delayMs={index * 110}
                  className={index === SERVICE_ORDER.length - 1 ? "ss-hub2-span" : ""}
                >
                  <a
                    className="ss-hub2-card"
                    href={route}
                    style={
                      {
                        "--hub2-accent": art.accentFrom,
                        "--hub2-accent-2": art.accentTo,
                      } as CSSProperties
                    }
                  >
                    <span className="ss-hub2-card__head">
                      <span className="ss-hub2-card__icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="ss-hub2-card__arrow" aria-hidden="true">
                        <ArrowUpRight />
                      </span>
                    </span>
                    <h3 className="ss-hub2-card__title">
                      {content.metadata.breadcrumbs.split("→").at(-1)?.trim() ??
                        art.discipline}
                    </h3>
                    <p className="ss-hub2-card__body">{SERVICE_BLURB[route]}</p>
                    <span className="ss-hub2-card__meta">
                      <span className="ss-hub2-card__chip">{art.discipline}</span>
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="hub2-proof">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Verified results"
            icon={TrendingUp}
            heading="Proof before *promises*"
            headingId="hub2-proof"
          />
          <BenchmarkConsole
            metrics={HUB_METRICS}
            caption="Silverstone AI delivery results measured across live client systems — response, reachability and recovered capacity."
            attribution="Verified Silverstone AI performance"
            clarification="Results achieved through Silverstone AI systems. Outcomes vary by starting process, data quality, channel mix and implementation scope."
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="hub2-industries">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Sector systems"
            heading="Built for the way your industry *actually operates*"
            headingId="hub2-industries"
            lead="Ten UK sectors have *their own dedicated operating systems* — estate agency enquiry switchboards, salon diaries, aesthetic-clinic consultations, trades dispatch and more."
          />
          <Reveal kind="cta">
            <p className="ss-srv2-lead">
              <LinkedText text="Explore the [industry operating systems](/industry), or go straight to [how Silverstone designs and delivers](/how-we-work) and [how scope shapes pricing](/pricing)." />
            </p>
          </Reveal>
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading="Name the workflow. We'll map *the system*."
            body={
              <LinkedText text="A 30-minute discovery call examines one real journey through your business — where it leaks, which system should own the truth and what a controlled first release would need." />
            }
            reassurance="No technical preparation required. Scope begins with one journey. A no-fit answer is a perfectly good outcome."
            buttonLabel="Book a discovery call"
          />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container">
          <SectionHead eyebrow="Continue" heading="Where this *connects next*" />
          <RelatedRail
            links={[
              { href: "/industry", label: "Industries", title: "Industry systems" },
              { href: "/how-we-work", label: "Process", title: "How We Work" },
              { href: "/pricing", label: "Commercials", title: "How pricing works" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
