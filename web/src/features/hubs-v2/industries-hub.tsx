/**
 * /industries hub — premium sector-discovery experience.
 * Visual concept: Sector Signal Grid — nine industries as live channels on
 * one operating board. Each discovery card carries its industry's own accent
 * and trust language, with verified cross-sector figures anchoring the proof
 * band. The Aether intro for this route renders in the Industries palette.
 */
import "~/styles/services-v2/services-v2.css";
import "~/styles/industries-v2/industries-v2.css";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { CSSProperties } from "react";

import { ArrowUpRight, Layers, TrendingUp } from "~/components/icons/lucide";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

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
import { industryCopyByRoute, industryRoutes } from "~/features/industries-v2/content";
import { industryArt } from "~/features/industries-v2/content/route-art";
import { LinkedText } from "~/features/industries-v2/components/industry-sections";

const HUB_ACCENT: CSSProperties = {
  "--srv2-accent": "#a78bfa",
  "--srv2-accent-2": "#22d3ee",
} as CSSProperties;

/** Verified Silverstone AI figures from the approved industry registers. */
const HUB_METRICS = [
  "2.4x — Viewings increase (estate agents)",
  "-75% — Reduction in no-shows (salons & barbers)",
  "167% — Growth in patient leads (clinics, 3 months)",
];

/**
 * SVG text never wraps on its own, so a fixed-width card with a long sector
 * label (e.g. "Physios & chiropractors") renders as one line that runs past
 * the card's edge instead of stopping at it. Balancing the label across two
 * short lines — split at whichever word boundary leaves the two halves
 * closest in length — keeps every label safely inside the card at every
 * width instead of overflowing it.
 */
function wrapSectorLabel(label: string): string[] {
  if (label.length <= 15) {
    return [label];
  }
  const words = label.split(" ");
  if (words.length < 2) {
    return [label];
  }
  let bestSplit = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i += 1) {
    const line1 = words.slice(0, i).join(" ");
    const line2 = words.slice(i).join(" ");
    const diff = Math.abs(line1.length - line2.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestSplit = i;
    }
  }
  return [words.slice(0, bestSplit).join(" "), words.slice(bestSplit).join(" ")];
}

function SectorSignalGrid() {
  const reducedMotion = useReducedMotion() ?? false;
  const cells = industryRoutes.map((route, index) => ({
    route,
    x: 105 + (index % 3) * 165,
    y: 118 + Math.floor(index / 3) * 140,
  }));

  return (
    <div
      className="ss-srv2-signature"
      role="img"
      aria-label="Diagram: nine industry channels — estate agents, salons, ecommerce, dentists, coaches, hospitality, trades, clinics and gyms — live on one Silverstone operating board."
    >
      <SignatureStatusBar label="Sector operating board" />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 600" className="ss-srv2-signature__svg">
          {cells.map((cell, index) => {
            const art = industryArt[cell.route];
            const copy = industryCopyByRoute[cell.route];
            const labelLines = wrapSectorLabel(copy.sector);
            const labelLineHeight = 15;
            const labelStartY =
              cell.y + (labelLines.length === 1 ? 2 : 2 - labelLineHeight / 2);
            const liveSystemY =
              labelStartY + (labelLines.length - 1) * labelLineHeight + 22;
            return (
              <m.g
                key={cell.route}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.09 }}
              >
                <rect
                  x={cell.x - 72}
                  y={cell.y - 48}
                  width="144"
                  height="96"
                  rx="13"
                  fill="var(--ss-v2-void-black)"
                  stroke={art.accentFrom}
                  strokeWidth="1.5"
                />
                {!reducedMotion ? (
                  <m.circle
                    cx={cell.x - 56}
                    cy={cell.y - 32}
                    r="4"
                    fill={art.accentFrom}
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: index * 0.35,
                      ease: "easeInOut",
                    }}
                  />
                ) : (
                  <circle
                    cx={cell.x - 56}
                    cy={cell.y - 32}
                    r="4"
                    fill={art.accentFrom}
                  />
                )}
                <text
                  x={cell.x}
                  y={labelStartY}
                  textAnchor="middle"
                  fill="var(--ss-v2-chrome)"
                  fontSize="12.5"
                  fontFamily="var(--ss-font-mono)"
                >
                  {labelLines.map((line, lineIndex) => (
                    <tspan
                      key={line}
                      x={cell.x}
                      dy={lineIndex === 0 ? 0 : labelLineHeight}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
                <text
                  x={cell.x}
                  y={liveSystemY}
                  textAnchor="middle"
                  fill="var(--srv2-ink-faint)"
                  fontSize="10.5"
                  fontFamily="var(--ss-font-mono)"
                >
                  LIVE SYSTEM
                </text>
              </m.g>
            );
          })}
          <text
            x="300"
            y="520"
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontSize="12.5"
            fontFamily="var(--ss-font-mono)"
          >
            Nine sectors · one operating standard · human judgement kept
          </text>
        </m.svg>
      </div>
      <SignatureChrome />
    </div>
  );
}

export function IndustriesHubExperience() {
  return (
    <div className="ss-srv2 ss-hub2" data-hub="industries" style={HUB_ACCENT}>
      <SecondaryHero
        eyebrow="Industry operating systems"
        icon={Layers}
        title="Technology shaped around your *operating reality*"
        titleId="hub2-lead"
        lead="Generic automation fails at the edges of a real trade. Silverstone builds sector-specific systems around your diary, CRM, reservation book or patient records — with the judgement calls your industry demands kept firmly human."
        points={[
          "Nine UK sectors, each with a purpose-built system",
          "Grounded in your source of truth, not a script",
          "Verified Silverstone AI results on every page",
        ]}
        primaryCtaLabel="Book a discovery call"
        showcase={<SectorSignalGrid />}
      />
      <TrustStrip />

      <section className="ss-srv2-section" aria-labelledby="hub2-sectors">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Find your sector"
            icon={Layers}
            heading="Nine industries, nine *purpose-built systems*"
            headingId="hub2-sectors"
            lead="Each page opens a complete operating experience: the sector's costly problem, the journey that fixes it, verified results and the boundaries that keep judgement with your people."
          />
          <div className="ss-hub2-grid">
            {industryRoutes.map((route, index) => {
              const art = industryArt[route];
              const copy = industryCopyByRoute[route];
              const Icon = art.icon;
              return (
                <Reveal key={route} kind="card" delayMs={index * 100}>
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
                    <h3 className="ss-hub2-card__title">{copy.sector}</h3>
                    <p className="ss-hub2-card__body">{copy.routeEntry.subtitle}</p>
                    <span className="ss-hub2-card__meta">
                      {copy.trustTokens.slice(0, 2).map((token) => (
                        <span className="ss-hub2-card__chip" key={token}>
                          {token}
                        </span>
                      ))}
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
            heading="Measured where your sector *feels it*"
            headingId="hub2-proof"
          />
          <BenchmarkConsole
            metrics={HUB_METRICS}
            caption="Silverstone AI delivery results across sector systems — each industry page carries its own verified figures with their exact values and time bases."
            attribution="Verified Silverstone AI performance"
            clarification="Results achieved through Silverstone AI systems. Outcomes vary by starting process, data quality, channel mix and implementation scope."
          />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="hub2-services">
        <div className="ss-srv2__container ss-hub2-disciplines" data-width="narrow">
          <SectionHead
            eyebrow="The disciplines behind the systems"
            heading="Every sector system draws on the *same architecture*"
            headingId="hub2-services"
            lead="AI reception, voice, automation, web, apps, content and consulting — combined per sector, never sold as a fixed stack."
          />
          <Reveal kind="cta" className="ss-hub2-disciplines__next">
            <p className="ss-srv2-lead">
              <LinkedText text="Browse the [service architecture](/services), see [how Silverstone designs and delivers](/how-we-work), or review [how scope shapes pricing](/pricing)." />
            </p>
          </Reveal>
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading="Start with the journey your sector *loses money on*"
            body={
              <LinkedText text="Bring one real enquiry, booking, recall or quote that went wrong. A 30-minute discovery call maps the system around it — and tells you honestly whether automation belongs there." />
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
              { href: "/services", label: "Services", title: "Service architecture" },
              { href: "/how-we-work", label: "Process", title: "How We Work" },
              {
                href: "/book#booking-calendar",
                label: "Next step",
                title: "Book a discovery call",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
