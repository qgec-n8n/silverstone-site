/**
 * Shared industries-v2 section components, layered on the services-v2
 * primitives so both families share one premium design language. Everything
 * here renders structured approved copy — no raw markdown blocks, no
 * authoring labels.
 */
import { useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useId, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router";

import {
  Check,
  Landmark,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
  UserCheck,
  type LucideIcon,
} from "~/components/icons/lucide";
import { CurrencyToggle } from "~/components/ui/currency-toggle";
import { hasWebpSibling, webpSource } from "~/lib/image-sources";
import { useRevealStart } from "~/motion/use-reveal-start";

import {
  BorderBeam,
  PanelReveal,
  Reveal,
  RichText,
} from "~/features/services-v2/components/primitives";
import {
  ATLAS_COMPACT,
  ATLAS_WIDE,
  LONDON,
  US_METROS,
  US_TIME_ZONES,
  type AtlasNode,
  type AtlasPlate,
} from "../content/atlas";
import type {
  IndustryCompliance,
  IndustryComplianceIcon,
  IndustryMarketLane,
  IndustryMarkets,
  IndustryCard,
  IndustryCaseStudy,
  IndustryStage,
} from "../content/types";
import type { IndustryImage } from "../content/route-art";

const entranceEase = [0.22, 1, 0.36, 1] as const;

/**
 * Inline rich text with crawlable internal links: supports `[label](/path)`
 * markdown links plus the `**bold**`/`*italic*` subset handled by RichText.
 *
 * Internal targets render as a router `Link` so an inline cross-link is a
 * client transition (~100ms) rather than a full document reload that replays
 * the loader and route intro on the destination. `Link` still emits a real
 * `href`, so these ~30 service/industry cross-links stay crawlable. Anything
 * that is not a site-absolute path (external URLs, `mailto:`, bare `#hash`)
 * keeps a plain anchor, since the router cannot own those destinations.
 */
export function LinkedText({ text }: { text: string }): ReactNode {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<RichText key={key++} text={text.slice(lastIndex, match.index)} />);
    }
    const href = match[2] ?? "";
    const label = match[1];
    nodes.push(
      href.startsWith("/") ? (
        <Link key={key++} className="ss-srv2-textlink" prefetch="intent" to={href}>
          {label}
        </Link>
      ) : (
        <a
          key={key++}
          className="ss-srv2-textlink"
          href={href}
          rel="noopener noreferrer"
        >
          {label}
        </a>
      ),
    );
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(<RichText key={key++} text={text.slice(lastIndex)} />);
  }
  return nodes;
}

/**
 * Paragraphs with inline links, for the service-architecture sections. Each
 * paragraph reads as one connected node on a small system rail — the same
 * connector language as `JourneyRail` — rather than a plain stacked block of
 * prose, so "what plugs into what" reads at a glance.
 */
export function LinkedProse({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="ss-ind2-linkrail">
      {paragraphs.map((paragraph, index) => (
        <Reveal
          key={index}
          kind="section"
          delayMs={index * 140}
          className="ss-ind2-linkrail__row"
        >
          <span className="ss-ind2-linkrail__node" aria-hidden="true" />
          <p className="ss-ind2-linkrail__text">
            <LinkedText text={paragraph} />
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * The industry journey rail: numbered stages on a drawn connector spine.
 * Each stage lands as its own beat — the connector segment draws in first,
 * then the node ignites and the copy settles beside it.
 */
export function JourneyRail({ stages }: { stages: IndustryStage[] }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <ol className="ss-ind2-rail">
      {stages.map((stage, index) => {
        const content = (
          <>
            <span aria-hidden="true" className="ss-ind2-rail__line" />
            <span className="ss-ind2-rail__node" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="ss-ind2-rail__body">
              <h3 className="ss-ind2-rail__title">{stage.title}</h3>
              <p className="ss-ind2-rail__text">
                <RichText text={stage.body} />
              </p>
            </div>
          </>
        );
        if (reducedMotion) {
          return (
            <li className="ss-ind2-rail__stage" key={stage.title}>
              {content}
            </li>
          );
        }
        return (
          <JourneyRailStage key={stage.title} index={index}>
            {content}
          </JourneyRailStage>
        );
      })}
    </ol>
  );
}

function JourneyRailStage({ children, index }: { children: ReactNode; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, {
    amount: 0.5,
    margin: "0px 0px -12% 0px",
    once: true,
  });
  const start = useRevealStart(ref, inView, index * 160);
  const hidden = { opacity: 0, x: index % 2 === 0 ? -26 : 26 };

  return (
    <m.li
      ref={ref}
      className="ss-ind2-rail__stage"
      data-motion-reveal="true"
      data-motion-reveal-kind="section"
      initial={hidden}
      animate={start !== null ? { opacity: 1, x: 0 } : hidden}
      transition={{
        delay: (start?.delayMs ?? 0) / 1000,
        duration: start?.instant ? 0 : 0.9 * (start?.durationScale ?? 1),
        ease: entranceEase,
      }}
    >
      {children}
    </m.li>
  );
}

/**
 * The human-judgment boundary: a two-tone console splitting what the system
 * prepares from what stays with people, with per-line staggered reveals.
 */
export function BoundaryPanel({
  body,
  keeps,
  keepsLabel = "Decided by your people, always",
}: {
  body: string;
  keeps: string[];
  keepsLabel?: string;
}) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <PanelReveal className="ss-ind2-boundary ss-srv2-beam-border">
      <Reveal kind="section" className="ss-ind2-boundary__col">
        <p className="ss-ind2-boundary__body">
          <RichText text={body} />
        </p>
      </Reveal>
      <div className="ss-ind2-boundary__col ss-ind2-boundary__col--keeps">
        <Reveal kind="pill">
          <span className="ss-ind2-boundary__tag">
            <UserCheck aria-hidden="true" />
            {keepsLabel}
          </span>
        </Reveal>
        <div className="ss-ind2-boundary__list" role="list" aria-label={keepsLabel}>
          {keeps.map((item, index) =>
            reducedMotion ? (
              <div className="ss-ind2-boundary__item" role="listitem" key={item}>
                <ShieldCheck aria-hidden="true" />
                <span>{item}</span>
              </div>
            ) : (
              <BoundaryKeepItem key={item} item={item} index={index} />
            ),
          )}
        </div>
      </div>
      <BorderBeam />
    </PanelReveal>
  );
}

function BoundaryKeepItem({ item, index }: { item: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.6,
    margin: "0px 0px -10% 0px",
    once: true,
  });
  const start = useRevealStart(ref, inView, 120 + index * 130);

  return (
    <m.div
      ref={ref}
      className="ss-ind2-boundary__item"
      data-motion-reveal="true"
      data-motion-reveal-kind="section"
      role="listitem"
      initial={{ opacity: 0, y: 18 }}
      animate={start !== null ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{
        delay: (start?.delayMs ?? 0) / 1000,
        duration: start?.instant ? 0 : 0.7 * (start?.durationScale ?? 1),
        ease: entranceEase,
      }}
    >
      <ShieldCheck aria-hidden="true" />
      <span>{item}</span>
    </m.div>
  );
}

/**
 * Live-client proof intro: the copy that sits immediately above an embedded
 * `BrowserShowcase` for a named Silverstone build in this page's own sector.
 * It carries no CTA of its own — the demo underneath IS the call to action, so
 * a button here would only compete with it.
 */
export function CaseStudyPanel({ caseStudy }: { caseStudy: IndustryCaseStudy }) {
  return (
    <PanelReveal className="ss-ind2-boundary ss-ind2-case ss-srv2-beam-border">
      <Reveal kind="section" className="ss-ind2-boundary__col">
        <p className="ss-ind2-boundary__body">
          <RichText text={caseStudy.lead} />
        </p>
        <Reveal kind="section" delayMs={240}>
          <p className="ss-ind2-case__note">{caseStudy.note}</p>
        </Reveal>
      </Reveal>
      <div className="ss-ind2-boundary__col ss-ind2-boundary__col--keeps">
        <Reveal kind="pill">
          <span className="ss-ind2-boundary__tag">
            <Sparkles aria-hidden="true" />
            {caseStudy.eyebrow}
          </span>
        </Reveal>
        <div
          className="ss-ind2-boundary__list"
          role="list"
          aria-label={caseStudy.eyebrow}
        >
          {caseStudy.points.map((point) => (
            <div className="ss-ind2-boundary__item" role="listitem" key={point}>
              <Check aria-hidden="true" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
      <BorderBeam />
    </PanelReveal>
  );
}

/** Right-fit panel: strong-fit signals plus an honest caution line. */
export function FitPanel({ right, caution }: { right: string[]; caution: string }) {
  return (
    <div className="ss-ind2-fit">
      <ul className="ss-ind2-fit__list">
        {right.map((item, index) => (
          <Reveal
            key={item}
            kind="card"
            delayMs={index * 110}
            className="ss-ind2-fit__item"
          >
            <Check aria-hidden="true" />
            <span>{item}</span>
          </Reveal>
        ))}
      </ul>
      <Reveal kind="section" delayMs={right.length * 110 + 120}>
        <p className="ss-ind2-fit__caution">
          <RichText text={caution} />
        </p>
      </Reveal>
    </div>
  );
}

/*
 * ---- Atlantic atlas ---------------------------------------------------------
 *
 * London linked to twelve US metros on a dotted world plate: the instrument
 * that opens the two-market section. All geometry comes from
 * `../content/atlas` — the plates, the node positions, every arc — so the
 * static dot layers, the SVG, the HTML labels and the pulses' `offset-path`
 * agree by construction rather than by hand-copying numbers between them.
 *
 * The plate is decorative (aria-hidden SVGs under a described wrapper); the
 * city names, the time-zone count and the market switch are real HTML text,
 * in the prerendered document, legible at every width.
 */

/** Node and stroke sizes in viewBox units, per plate: the wide plate shows
 * ~0.46px per unit at 1100 wide, the compact one ~0.32px at 340. */
const ATLAS_SIZE: Record<
  AtlasPlate["name"],
  { city: number; hub: number; pulse: number }
> = {
  wide: { city: 7, hub: 11, pulse: 6 },
  compact: { city: 9, hub: 14, pulse: 8 },
};

const ATLAS_ARIA = `Map: London linked to ${US_METROS.length === 12 ? "twelve" : String(US_METROS.length)} US metros — ${US_METROS.map(
  (city) => city.name,
).join(", ")}. The market you are reading in is the lit side.`;

function AtlasNodeMark({
  bloomId,
  node,
  r,
  side,
}: {
  bloomId: string;
  node: AtlasNode;
  r: number;
  side: "us" | "uk";
}) {
  const { x, y } = node.point;
  return (
    <g className="ss-ind2-atlas__node" data-city={node.id} data-side={side}>
      {/* The bloom is what makes a lit node read as a light source rather
          than as a filled dot; it is a gradient, so it costs no filter. */}
      <circle
        className="ss-ind2-atlas__bloom"
        cx={x}
        cy={y}
        fill={`url(#${bloomId})`}
        r={r * 6}
      />
      <circle className="ss-ind2-atlas__halo" cx={x} cy={y} r={r * 2.6} />
      <circle className="ss-ind2-atlas__ring" cx={x} cy={y} r={r * 1.7} />
      <circle className="ss-ind2-atlas__dot" cx={x} cy={y} r={r} />
    </g>
  );
}

/**
 * One plate. Two are rendered — wide and compact — and only ever one is
 * displayed; a `display: none` element runs no animation, so the looping
 * budget is one plate's pulses and halos, never both.
 *
 * Each arc carries TWO strokes and CSS crossfades them, because an SVG paint
 * server cannot be flipped from a stylesheet: the bright end of every arc is
 * always the reader's own market.
 */
function AtlasPlateSvg({ plate }: { plate: AtlasPlate }) {
  const id = `ind2-atlas-${plate.name}`;
  const size = ATLAS_SIZE[plate.name];
  const west = Math.min(...plate.cities.map((city) => city.point.x));
  const east = plate.hub.point.x;

  return (
    <svg
      aria-hidden="true"
      className={`ss-ind2-atlas__svg ss-ind2-atlas__svg--${plate.name}`}
      focusable="false"
      viewBox={plate.viewBox}
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={`${id}-uk`}
          x1={west}
          x2={east}
          y1="0"
          y2="0"
        >
          <stop offset="0%" stopColor="var(--srv2-accent-2)" stopOpacity="0.22" />
          <stop offset="58%" stopColor="var(--ss-ind2-arc-mid)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--srv2-accent)" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={`${id}-us`}
          x1={west}
          x2={east}
          y1="0"
          y2="0"
        >
          <stop offset="0%" stopColor="var(--srv2-accent-2)" />
          <stop offset="42%" stopColor="var(--ss-ind2-arc-mid)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--srv2-accent)" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={`${id}-bloom-uk`}>
          <stop offset="0%" stopColor="var(--srv2-accent)" stopOpacity="0.85" />
          <stop offset="45%" stopColor="var(--srv2-accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--srv2-accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-bloom-us`}>
          <stop offset="0%" stopColor="var(--srv2-accent-2)" stopOpacity="0.85" />
          <stop offset="45%" stopColor="var(--srv2-accent-2)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--srv2-accent-2)" stopOpacity="0" />
        </radialGradient>
        {/* The plate's edges fade into the panel ground, so the dots read as a
            field of light seen through the frame, not as a pasted image. */}
        <radialGradient cx="50%" cy="46%" id={`${id}-fade`} r="64%">
          <stop offset="0%" stopColor="var(--ss-ind2-atlas-ground)" stopOpacity="0" />
          <stop offset="70%" stopColor="var(--ss-ind2-atlas-ground)" stopOpacity="0" />
          <stop
            offset="100%"
            stopColor="var(--ss-ind2-atlas-ground)"
            stopOpacity="0.92"
          />
        </radialGradient>
      </defs>

      <image
        className="ss-ind2-atlas__land ss-ind2-atlas__land--world"
        height={plate.h}
        href={plate.layers.world}
        width={plate.w}
      />
      <image
        className="ss-ind2-atlas__land ss-ind2-atlas__land--us"
        height={plate.h}
        href={plate.layers.us}
        width={plate.w}
      />
      <image
        className="ss-ind2-atlas__land ss-ind2-atlas__land--uk"
        height={plate.h}
        href={plate.layers.uk}
        width={plate.w}
      />
      <rect
        className="ss-ind2-atlas__fade"
        fill={`url(#${id}-fade)`}
        height={plate.h}
        width={plate.w}
      />

      {plate.links.map((link, index) => (
        <g
          className="ss-ind2-atlas__link"
          data-city={link.city.id}
          key={link.city.id}
          style={{ "--atlas-i": index } as CSSProperties}
        >
          <path className="ss-ind2-atlas__arc-glow" d={link.path} pathLength={1} />
          <path
            className="ss-ind2-atlas__arc ss-ind2-atlas__arc--uk"
            d={link.path}
            pathLength={1}
            stroke={`url(#${id}-uk)`}
          />
          <path
            className="ss-ind2-atlas__arc ss-ind2-atlas__arc--us"
            d={link.path}
            pathLength={1}
            stroke={`url(#${id}-us)`}
          />
          {/* cx/cy stay at the origin: `offset-path` carries the pulse. */}
          <circle
            className="ss-ind2-atlas__pulse"
            cx="0"
            cy="0"
            r={size.pulse}
            style={{ offsetPath: `path("${link.path}")` }}
          />
          <circle
            className="ss-ind2-atlas__pulse-park"
            cx={link.park.x}
            cy={link.park.y}
            r={size.pulse}
          />
        </g>
      ))}

      {plate.cities.map((city) => (
        <AtlasNodeMark
          bloomId={`${id}-bloom-us`}
          key={city.id}
          node={city}
          r={size.city}
          side="us"
        />
      ))}
      <AtlasNodeMark
        bloomId={`${id}-bloom-uk`}
        node={plate.hub}
        r={size.hub}
        side="uk"
      />
    </svg>
  );
}

/**
 * The HTML labels over the plate: one per city, carrying BOTH plates'
 * positions and anchors as custom properties, so the same real text is placed
 * by whichever plate the stylesheet is showing. They are `<label for>`s on the
 * market switch's radios — tapping Chicago moves the ledger to the US, tapping
 * London to the UK — with no second source of truth.
 */
function AtlasLabels({ controlId }: { controlId: string }) {
  const pairs = [
    { wide: ATLAS_WIDE.hub, compact: ATLAS_COMPACT.hub, side: "uk" as const },
    ...ATLAS_WIDE.cities.map((wide, index) => ({
      wide,
      compact: ATLAS_COMPACT.cities[index] ?? wide,
      side: "us" as const,
    })),
  ];
  return pairs.map(({ wide, compact, side }) => (
    <label
      className="ss-ind2-atlas__label"
      data-anchor-compact={compact.side}
      data-anchor-wide={wide.side}
      data-side={side}
      data-tier={wide.tier}
      htmlFor={`${controlId}-${side === "uk" ? "gbp" : "usd"}`}
      key={wide.id}
      style={
        {
          "--at-wx": wide.at.x,
          "--at-wy": wide.at.y,
          "--at-cx": compact.at.x,
          "--at-cy": compact.at.y,
        } as CSSProperties
      }
    >
      <span className="ss-ind2-atlas__label-name">{wide.name}</span>
    </label>
  ));
}

/**
 * The atlas panel: readout strip, the plate with its labels, the metro strip
 * and the market focus control, in its own frame above the ledger.
 *
 * `data-chart-live` (`once: false`) stops the pulses and halos when the plate
 * leaves the viewport — twelve looping animations nobody can see still cost
 * frames on a phone — and `data-chart-shown` fires the one-time arc draw
 * through the global reveal scheduler, so the links power on just after the
 * frame itself has materialised.
 */
function AtlanticAtlas({ controlId }: { controlId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const viewport = { amount: 0.2, margin: "0px 0px -8% 0px" } as const;
  const inView = useInView(ref, viewport);
  const seen = useInView(ref, { ...viewport, once: true });
  const start = useRevealStart(ref, seen, 380);
  const shown = start !== null;
  const delay = start === null || start.instant ? 0 : start.delayMs;

  return (
    <PanelReveal className="ss-ind2-atlas ss-srv2-beam-border">
      <Reveal className="ss-ind2-atlas__readout" kind="section">
        <p className="ss-ind2-atlas__readout-line">
          <span className="ss-ind2-atlas__readout-leg">
            {LONDON.name}
            <span aria-hidden="true"> &#8646; </span>
            {US_METROS.length} US metros
          </span>
          <span className="ss-ind2-atlas__readout-fig">{US_TIME_ZONES} time zones</span>
          <span className="ss-ind2-atlas__readout-tag">One system, two markets</span>
        </p>
      </Reveal>

      <Reveal className="ss-ind2-atlas__chart-reveal" delayMs={100} kind="card">
        <div
          aria-label={ATLAS_ARIA}
          className="ss-ind2-atlas__chart"
          data-chart-live={inView ? "true" : undefined}
          data-chart-shown={shown ? "true" : undefined}
          ref={ref}
          role="img"
          style={{ "--atlas-delay": `${String(delay)}ms` } as CSSProperties}
        >
          {/* The plate box is exactly the SVG's box, so a label's percentage
              position IS its viewBox coordinate. */}
          <div className="ss-ind2-atlas__plate">
            <AtlasPlateSvg plate={ATLAS_WIDE} />
            <AtlasPlateSvg plate={ATLAS_COMPACT} />
            <AtlasLabels controlId={controlId} />
          </div>
        </div>
      </Reveal>

      {/*
        The market focus control IS the display-currency control: one reader
        choice, persisted, driving the plate, the ledger's emphasis and every
        price on the site. It sits after the chart in the DOM — where a phone
        reader meets it — and CSS seats it in the readout band at ≥52rem.
      */}
      <Reveal className="ss-ind2-atlas__control" delayMs={200} kind="pill">
        <span aria-hidden="true" className="ss-ind2-atlas__control-label">
          Market focus
        </span>
        <CurrencyToggle context="markets" idPrefix={controlId} tone="dark" />
      </Reveal>

      {/* Every metro by name at every width: the compact plate labels only a
          handful, and a city name is something a reader may search for. */}
      <Reveal className="ss-ind2-atlas__strip" delayMs={280} kind="section">
        <p className="ss-ind2-atlas__strip-line">
          <span className="ss-ind2-atlas__strip-label">
            {US_METROS.length} US metros
          </span>
          {US_METROS.map((city) => (
            <span
              className="ss-ind2-atlas__strip-city"
              data-zone={city.zone}
              key={city.id}
            >
              {city.name}
            </span>
          ))}
        </p>
      </Reveal>
      <BorderBeam />
    </PanelReveal>
  );
}

/*
 * ---- Two-market ledger ---------------------------------------------------
 */

const MARKET_ROWS = [
  { fact: "operators", label: "Who runs it" },
  { fact: "tooling", label: "Plugs into" },
  { fact: "vocabulary", label: "Your words" },
  { fact: "keeps", label: "Stays with people" },
] as const;

/**
 * The optional fifth ledger row: the named laws and platform rules the system
 * is configured around in each market.
 *
 * It is all-or-nothing on purpose. The ledger's subgrid pins row *n* of one
 * market against row *n* of the other, so a rulebook printed on one lane with
 * an empty cell opposite would read as "this market has no rules" — the exact
 * opposite of the point. Sectors whose rulebook is not established simply omit
 * the field and stay at four rows.
 */
const MARKET_RULEBOOK_ROW = { fact: "rulebook", label: "Plays by" } as const;

type MarketRow = (typeof MARKET_ROWS)[number] | typeof MARKET_RULEBOOK_ROW;

function ledgerValue(lane: IndustryMarketLane, fact: MarketRow["fact"]): ReactNode {
  switch (fact) {
    case "operators":
      return lane.operators;
    case "vocabulary":
      return lane.vocabulary;
    case "keeps":
      return lane.keepsHuman;
    case "rulebook":
      return lane.rulebook;
    case "tooling":
      return (
        <ul className="ss-ind2-market__tools">
          {lane.tooling.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      );
  }
}

/**
 * One ledger row, with its own scheduled entrance. A local `m.div` rather
 * than the shared `Reveal`, because the row's stylesheet keys on `data-fact`,
 * `data-keeps` and `data-market`, which the primitive cannot carry — the same
 * pattern as `JourneyRailStage` and `BoundaryKeepItem`.
 */
function LedgerRow({
  delayMs,
  lane,
  row,
}: {
  delayMs: number;
  lane: IndustryMarketLane;
  row: MarketRow;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.5,
    margin: "0px 0px -10% 0px",
    once: true,
  });
  const start = useRevealStart(ref, inView, delayMs);
  const attrs = {
    className: "ss-ind2-market__row",
    "data-fact": row.fact,
    "data-keeps": row.fact === "keeps" ? "true" : undefined,
    "data-market": lane.market,
  };
  const content = (
    <>
      <dt>{row.label}</dt>
      <dd>{ledgerValue(lane, row.fact)}</dd>
    </>
  );

  if (reducedMotion) {
    return <div {...attrs}>{content}</div>;
  }
  const hidden = { opacity: 0, y: 18 };
  return (
    <m.div
      {...attrs}
      animate={start !== null ? { opacity: 1, y: 0 } : hidden}
      data-motion-reveal="true"
      data-motion-reveal-kind="section"
      initial={hidden}
      ref={ref}
      transition={{
        delay: (start?.delayMs ?? 0) / 1000,
        duration: start?.instant ? 0 : 0.75 * (start?.durationScale ?? 1),
        ease: entranceEase,
      }}
    >
      {content}
    </m.div>
  );
}

/**
 * The two-market section: the atlas in its own frame, a lit stem, then the
 * ledger.
 *
 * Deliberately not a glossary and not a tabbed toggle. Both lanes are always
 * in the DOM and always readable, so a US reader sees their tooling named
 * beside the UK equivalent (and vice versa) and a crawler reads both
 * vocabularies on one canonical page. What the market switch changes is
 * *emphasis*, never presence: the reader's market becomes the near lane
 * (raised surface, filled tool chips, lit landmass and nodes on the plate)
 * and the far lane quietens by surface, never by dropping its text contrast.
 *
 * Emphasis is CSS keyed off `<html data-currency>`, which the boot script in
 * root.tsx sets before first paint — so there is no flash, no hydration
 * dependency, and the whole instrument is correct in prerendered HTML.
 *
 * The lanes are a ledger: `grid-template-rows: subgrid` chained down
 * lanes → lane (a `Reveal`, which renders AS the lane) → inner → `<dl>`
 * aligns "Who runs it" in one market with "Who runs it" in the other, so the
 * comparison is read across rather than by scrolling between two cards. DOM
 * order stays US, UK, and the columns never swap.
 */
export function MarketLanes({ markets }: { markets: IndustryMarkets }) {
  // Both lanes or neither — see MARKET_RULEBOOK_ROW. The count is stamped on
  // the container because `repeat()` takes an integer literal, not a calc(),
  // so the subgrid track count has to be selected in CSS rather than computed.
  const rows: readonly MarketRow[] = markets.lanes.every((lane) => lane.rulebook)
    ? [...MARKET_ROWS, MARKET_RULEBOOK_ROW]
    : MARKET_ROWS;
  // The atlas owns the radio ids so its city labels can be real `<label for>`
  // elements for the switch that lives beside the plate.
  const controlId = useId();

  return (
    <div className="ss-ind2-twin">
      <AtlanticAtlas controlId={controlId} />
      <span aria-hidden="true" className="ss-ind2-twin__stem" />
      {/* "some": the phone ledger runs to ~1,700px, taller than any phone
          viewport, so a fractional threshold could never fire. */}
      <PanelReveal
        amount="some"
        className="ss-ind2-markets ss-srv2-beam-border"
        delayMs={120}
      >
        <div className="ss-ind2-markets__lanes" data-rows={String(rows.length)}>
          {markets.lanes.map((lane, laneIndex) => (
            <Reveal
              className={`ss-ind2-market ss-ind2-market--${lane.market.toLowerCase()}`}
              delayMs={laneIndex * 120}
              key={lane.market}
              kind="card"
            >
              <div className="ss-ind2-market__inner" data-market={lane.market}>
                <p className="ss-ind2-market__head">
                  <span className="ss-ind2-market__code" aria-hidden="true">
                    {lane.market}
                  </span>
                  <span className="ss-ind2-market__label">{lane.label}</span>
                </p>
                <dl className="ss-ind2-market__rows">
                  {rows.map((row, rowIndex) => (
                    <LedgerRow
                      delayMs={220 + rowIndex * 90 + laneIndex * 70}
                      key={row.fact}
                      lane={lane}
                      row={row}
                    />
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
        <SharedSpine items={markets.shared} />
        <BorderBeam />
      </PanelReveal>
    </div>
  );
}

/**
 * The shared rail as a lit spine. The spine draw and the item stagger are CSS
 * gated on `data-spine-shown`, which this component sets through the global
 * reveal scheduler (the same `useRevealStart` path every other entrance on the
 * site takes) rather than at mount — the panel is below the fold, so a
 * mount-timed CSS animation would play unseen.
 *
 * The pre-state lives under `html[data-js="on"]`, so nothing here is hidden in
 * the prerendered document or for a reader without JavaScript, and the
 * keyframes fill `backwards` so the settled state is the stylesheet's.
 */
function SharedSpine({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.2,
    margin: "0px 0px -12% 0px",
    once: true,
  });
  const start = useRevealStart(ref, inView, 260);
  const spineDelay = start === null || start.instant ? 0 : start.delayMs;

  return (
    <div
      className="ss-ind2-markets__shared"
      data-spine-shown={start !== null ? "true" : undefined}
      ref={ref}
      style={{ "--spine-delay": `${String(spineDelay)}ms` } as CSSProperties}
    >
      <span aria-hidden="true" className="ss-ind2-markets__spine" />
      <span className="ss-ind2-markets__shared-label">Identical in both</span>
      <ol className="ss-ind2-markets__shared-list">
        {items.map((item) => (
          <li key={item}>
            <RichText text={item} />
          </li>
        ))}
      </ol>
    </div>
  );
}

/*
 * ---- Compliance panel ------------------------------------------------------
 *
 * A sector's named rulebook — the laws and platform rules the built systems
 * are configured around — rendered as a sibling instrument to the ledger it
 * sits beneath: the same glass panel, the same beam border, the same market
 * chips, so crossing from "here is your market" to "here are your market's
 * rules" never feels like leaving the object.
 *
 * Generic by design. Any sector can adopt it by adding a `compliance` block to
 * its copy; the composition guards on that block's presence, so sectors
 * without an established rulebook render nothing rather than a vague panel.
 *
 * Each card is one claim and three rules, not a paragraph: a rulebook that is
 * scanned is a rulebook that is read. The note is deliberately NOT fine print —
 * it carries the division of responsibility that makes every claim above it
 * honest, so it renders at body weight under the cards, at full contrast.
 */

const COMPLIANCE_ICONS: Record<IndustryComplianceIcon, LucideIcon> = {
  scale: Scale,
  layers: Layers,
  landmark: Landmark,
  "user-check": UserCheck,
};

function GlancePill({ claim, index }: { claim: string; index: number }) {
  const reducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { amount: 0.8, once: true });
  const start = useRevealStart(ref, inView, index * 90);
  const content = (
    <>
      <ShieldCheck aria-hidden="true" />
      <span>{claim}</span>
    </>
  );

  if (reducedMotion) {
    return <li className="ss-ind2-compliance__glance-item">{content}</li>;
  }
  const hidden = { opacity: 0, y: 14, scale: 0.88 };
  return (
    <m.li
      animate={start !== null ? { opacity: 1, y: 0, scale: 1 } : hidden}
      className="ss-ind2-compliance__glance-item"
      data-motion-reveal="true"
      data-motion-reveal-kind="pill"
      initial={hidden}
      ref={ref}
      transition={
        start?.instant
          ? { delay: 0, duration: 0 }
          : {
              delay: (start?.delayMs ?? 0) / 1000,
              type: "spring",
              stiffness: 150,
              damping: 19,
              mass: 0.85,
            }
      }
    >
      {content}
    </m.li>
  );
}

export function CompliancePanel({ compliance }: { compliance: IndustryCompliance }) {
  const cardCount = compliance.points.length;

  return (
    /* "some": four rule cards stack to ~2,800px on a 390 phone; a quarter of
       that is never in an 844px viewport at once, and with the default
       threshold the frame stayed at opacity 0 forever. */
    <PanelReveal amount="some" className="ss-ind2-compliance ss-srv2-beam-border">
      {/* The whole boundary in three seconds, above the detail. Each chip is a
          summary of a card underneath — never a claim the cards do not make. */}
      {compliance.glance ? (
        <ul className="ss-ind2-compliance__glance" aria-label="At a glance">
          {compliance.glance.map((claim, index) => (
            <GlancePill claim={claim} index={index} key={claim} />
          ))}
        </ul>
      ) : null}
      <div className="ss-ind2-compliance__grid">
        {compliance.points.map((point, index) => {
          const Icon = COMPLIANCE_ICONS[point.icon];
          return (
            <Reveal
              className="ss-ind2-compliance__card"
              delayMs={180 + index * 110}
              key={point.title}
              kind="card"
            >
              <div className="ss-ind2-compliance__head" data-market={point.market}>
                <span aria-hidden="true" className="ss-ind2-compliance__icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="ss-ind2-compliance__titles">
                  {/* Real text, not aria-hidden: nothing else in this card
                      names the market its rule applies to. */}
                  <span className="ss-ind2-compliance__chip">{point.market}</span>
                  <h3 className="ss-ind2-compliance__title">{point.title}</h3>
                </span>
              </div>
              <p className="ss-ind2-compliance__claim">{point.claim}</p>
              <ul className="ss-ind2-compliance__rules">
                {point.rules.map((rule) => (
                  <li key={rule}>
                    <Check aria-hidden="true" />
                    <span>
                      <RichText text={rule} />
                    </span>
                  </li>
                ))}
              </ul>
              {point.source ? (
                /* One chip per citation, so a statute never breaks across
                   lines as "NAR / SoP 10-3", and a long reference simply
                   takes a chip of its own width. Not links: RichText renders
                   no anchors, and a live link out of a compliance claim
                   invites the reader to check a source that may move. */
                <ul aria-label="Sources" className="ss-ind2-compliance__sources">
                  {point.source.split(" · ").map((citation) => (
                    <li className="ss-ind2-compliance__cite" key={citation}>
                      {citation}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          );
        })}
      </div>
      <Reveal
        className="ss-ind2-compliance__note-band"
        delayMs={180 + cardCount * 110 + 60}
        kind="section"
      >
        <p className="ss-ind2-compliance__note">
          <ShieldCheck aria-hidden="true" />
          <span>
            <RichText text={compliance.note} />
          </span>
        </p>
      </Reveal>
      <BorderBeam />
    </PanelReveal>
  );
}

/** Per-page trust tokens rendered directly beneath the secondary hero. */
export function TrustTokens({ tokens }: { tokens: string[] }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div className="ss-ind2-tokens" aria-label="Operating principles">
      {tokens.map((token, index) =>
        reducedMotion ? (
          <span className="ss-ind2-tokens__item" key={token}>
            {token}
          </span>
        ) : (
          <TrustTokenItem key={token} token={token} index={index} />
        ),
      )}
    </div>
  );
}

function TrustTokenItem({ token, index }: { token: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.8, once: true });
  const start = useRevealStart(ref, inView, index * 110);

  return (
    <m.span
      ref={ref}
      className="ss-ind2-tokens__item"
      data-motion-reveal="true"
      data-motion-reveal-kind="section"
      initial={{ opacity: 0, y: 12 }}
      animate={start !== null ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{
        delay: (start?.delayMs ?? 0) / 1000,
        duration: start?.instant ? 0 : 0.7 * (start?.durationScale ?? 1),
        ease: entranceEase,
      }}
    >
      {token}
    </m.span>
  );
}

/** Responsive approved-image figure (desktop/mobile pair). */
export function IndustryFigure({
  image,
  loading = "lazy",
}: {
  image: IndustryImage;
  loading?: "lazy" | "eager";
}) {
  const optimizedDesktop = hasWebpSibling(image.desktop)
    ? webpSource(image.desktop)
    : image.desktop;

  return (
    <figure className="ss-srv2-figure">
      <picture>
        {image.mobile !== image.desktop ? (
          <>
            {hasWebpSibling(image.mobile) ? (
              <source
                media="(max-width: 767px)"
                srcSet={webpSource(image.mobile)}
                type="image/webp"
              />
            ) : null}
            <source media="(max-width: 767px)" srcSet={image.mobile} />
          </>
        ) : null}
        {hasWebpSibling(image.desktop) ? (
          <>
            <source srcSet={optimizedDesktop} type="image/webp" />
            <source srcSet={image.desktop} />
          </>
        ) : null}
        <img
          src={optimizedDesktop}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={loading}
          decoding="async"
        />
      </picture>
    </figure>
  );
}

/** A pair of gallery figures with alternating clip reveals. */
export function ImageDuo({ images }: { images: IndustryImage[] }) {
  return (
    <div className="ss-ind2-duo" data-count={images.length}>
      {images.map((img, index) => (
        <Reveal key={img.desktop} kind="image" delayMs={index * 200}>
          <IndustryFigure image={img} />
        </Reveal>
      ))}
    </div>
  );
}

/** Workflow cards with per-card icon and hover lift, 2-column rhythm. */
export function WorkflowCards({
  items,
  icons,
}: {
  items: IndustryCard[];
  icons: LucideIcon[];
}) {
  return (
    <div className="ss-ind2-workflows">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];
        return (
          <Reveal
            key={item.title}
            kind="card"
            delayMs={index * 130}
            className="ss-ind2-workflow"
          >
            <span className="ss-srv2-card__icon">
              {Icon ? <Icon aria-hidden="true" /> : null}
            </span>
            <h3 className="ss-srv2-card__title">{item.title}</h3>
            <p className="ss-srv2-card__body">
              <RichText text={item.body} />
            </p>
          </Reveal>
        );
      })}
    </div>
  );
}
