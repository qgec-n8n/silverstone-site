/**
 * Shared industries-v2 section components, layered on the services-v2
 * primitives so both families share one premium design language. Everything
 * here renders structured approved copy — no raw markdown blocks, no
 * authoring labels.
 */
import { useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Fragment, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router";

import {
  Check,
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
import type {
  IndustryCompliance,
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
 * ---- Atlantic Bridge -------------------------------------------------------
 *
 * The plate is a real graticule, not texture: latitude and longitude map to
 * viewBox units by a straight line, so London (51.5°N, 0.1°W) and New York
 * (40.7°N, 74.0°W) land exactly where the printed ticks say they should, and a
 * reader who checks the chart against the ticks finds it honest.
 *
 * Every coordinate below is DERIVED from those two scales — the arc, the
 * parked pulse and the labels' percentage positions all come out of the same
 * two city points — because four things have to agree on this geometry: the
 * SVG paths, the CSS `offset-path` that carries the pulse along the arc, the
 * HTML labels' positions, and the unit test that pins the stylesheet's two
 * path strings back to these constants. Hand-copying a path into the
 * stylesheet is exactly how the compact pulse ended up travelling a line that
 * was not the arc drawn beside it.
 */
type BridgePoint = { x: number; y: number };

type BridgeScale = {
  w: number;
  /**
   * The viewBox WINDOW, not the graticule's extent: the scales below run wider
   * than the plate shows, and cropping to the band the two cities actually
   * occupy is what pays for the readout strip above without the chart band
   * growing. Percentage label positions are resolved against this window.
   */
  viewY: number;
  h: number;
  /** Degrees north → viewBox y. */
  latToY: (deg: number) => number;
  /** Degrees east, negative west → viewBox x. */
  lonToX: (deg: number) => number;
  latLines: number[];
  lonLines: number[];
  /** The gridlines that carry a printed tick label; the rest stay hairlines. */
  latTicks: number[];
  lonTicks: number[];
  /**
   * Control point of the quadratic, lifted north of the chord so a
   * flat-projection line still reads as a great circle.
   */
  ctrl: BridgePoint;
  nodeR: number;
  /** Inset of the graticule from the plate edge, in viewBox units. */
  inset: number;
};

const CITY = {
  ldn: { name: "London", lat: 51.51, lon: -0.13, coord: "51.5°N" },
  nyc: { name: "New York", lat: 40.71, lon: -74.01, coord: "40.7°N" },
} as const;

/**
 * London ⇄ New York on the great circle. Checked against the haversine of the
 * two coordinates above (R = 6371.0088 km): 5570.2 km / 3461.2 mi.
 */
const BRIDGE_DISTANCE = { km: "5,570 km", mi: "3,461 mi" } as const;

/** One decimal — the resolution the plate is drawn at. More is noise in a path. */
const round1 = (n: number) => Math.round(n * 10) / 10;
const asPct = (value: number, span: number) =>
  `${String(round1((value / span) * 100))}%`;

/** The quadratic at t, used for the parked pulse. */
function quadAt(from: BridgePoint, ctrl: BridgePoint, to: BridgePoint, t: number) {
  const u = 1 - t;
  return {
    x: round1(u * u * from.x + 2 * u * t * ctrl.x + t * t * to.x),
    y: round1(u * u * from.y + 2 * u * t * ctrl.y + t * t * to.y),
  };
}

function buildBridge(scale: BridgeScale) {
  const place = (city: keyof typeof CITY): BridgePoint => ({
    x: round1(scale.lonToX(CITY[city].lon)),
    y: round1(scale.latToY(CITY[city].lat)),
  });
  const nyc = place("nyc");
  const ldn = place("ldn");
  const top = scale.viewY;

  return {
    ...scale,
    viewBox: `0 ${String(top)} ${String(scale.w)} ${String(scale.h)}`,
    nyc,
    ldn,
    arc: `M ${String(nyc.x)} ${String(nyc.y)} Q ${String(scale.ctrl.x)} ${String(scale.ctrl.y)} ${String(ldn.x)} ${String(ldn.y)}`,
    /**
     * The arc at t = 0.62: where the parked circle sits for a reader on
     * reduced motion or a browser without `offset-path` — mid-flight, so the
     * chart still reads as in transit rather than as a dead line.
     */
    park: quadAt(nyc, scale.ctrl, ldn, 0.62),
    at: {
      nyc: { x: asPct(nyc.x, scale.w), y: asPct(nyc.y - top, scale.h) },
      ldn: { x: asPct(ldn.x, scale.w), y: asPct(ldn.y - top, scale.h) },
    },
    latRules: scale.latLines.map((deg) => ({ deg, y: round1(scale.latToY(deg)) })),
    lonRules: scale.lonLines.map((deg) => ({ deg, x: round1(scale.lonToX(deg)) })),
    latLabels: scale.latTicks.map((deg) => ({
      deg,
      top: asPct(scale.latToY(deg) - top, scale.h),
    })),
    lonLabels: scale.lonTicks.map((deg) => ({
      deg,
      left: asPct(scale.lonToX(deg), scale.w),
    })),
  };
}

/** Wide plate (≥52rem): 90°W–0° across, 70°N–30°N down. */
export const BRIDGE_WIDE = buildBridge({
  w: 1200,
  viewY: 16,
  h: 184,
  latToY: (deg) => 310 - 4 * deg,
  lonToX: (deg) => 1092 + 12 * deg,
  latLines: [70, 60, 50, 40, 30],
  lonLines: [-90, -80, -70, -60, -50, -40, -30, -20, -10, 0],
  latTicks: [60, 50, 40, 30],
  lonTicks: [-80, -60, -40, -20, 0],
  ctrl: { x: 647, y: 4 },
  nodeR: 5.5,
  inset: 24,
});

/**
 * Compact ladder (<52rem): the same two cities on a zoomed 40°N–55°N scale,
 * which is what turns a 5.5:1 letterboxed smear into a diagonal a phone can
 * read. New York stays lower-left and London upper-right, so the ladder, the
 * wide plate and the ledger's fixed US → UK column order all agree.
 */
export const BRIDGE_COMPACT = buildBridge({
  w: 320,
  viewY: 6,
  h: 128,
  latToY: (deg) => 350 - 6 * deg,
  lonToX: (deg) => 284 + 3 * deg,
  latLines: [55, 50, 45, 40],
  lonLines: [-90, -75, -60, -45, -30, -15, 0],
  latTicks: [50, 45],
  lonTicks: [],
  ctrl: { x: 170, y: 44 },
  nodeR: 4.5,
  inset: 10,
});

type Bridge = ReturnType<typeof buildBridge>;

const latLabel = (deg: number) => `${String(deg)}°N`;
const lonLabel = (deg: number) => (deg === 0 ? "0°" : `${String(Math.abs(deg))}°W`);

/** Hairlines fade toward the edges of the chart, so the plate reads as depth. */
function meridianOpacity(x: number, width: number) {
  return Number((0.62 - (Math.abs(x - width / 2) / width) * 0.9).toFixed(3));
}

function BridgeNode({
  node,
  point,
  r,
  bloomId,
}: {
  node: "nyc" | "ldn";
  point: BridgePoint;
  r: number;
  bloomId: string;
}) {
  return (
    <g className="ss-ind2-bridge__node" data-node={node}>
      {/* The bloom is what makes the lit node read as a light source rather
          than as a filled dot; it is a gradient, so it costs no filter. */}
      <circle
        className="ss-ind2-bridge__bloom"
        cx={point.x}
        cy={point.y}
        fill={`url(#${bloomId})`}
        r={r * 7.4}
      />
      <circle className="ss-ind2-bridge__halo" cx={point.x} cy={point.y} r={r * 3.4} />
      <circle className="ss-ind2-bridge__ring" cx={point.x} cy={point.y} r={r * 2.2} />
      <circle className="ss-ind2-bridge__dot" cx={point.x} cy={point.y} r={r} />
    </g>
  );
}

/**
 * One plate. Two are rendered — a wide chart and a compact ladder — and only
 * ever one is displayed; a `display: none` element runs no animation, so the
 * looping budget stays at one pulse plus one node breathe.
 *
 * The arc carries TWO gradients and CSS picks between them, because SVG paint
 * servers cannot be flipped from a stylesheet: the bright end of the arc is
 * always the reader's own market.
 */
function BridgePlate({
  bridge,
  variant,
}: {
  bridge: Bridge;
  variant: "wide" | "compact";
}) {
  const toLdn = `ind2-bridge-arc-ldn-${variant}`;
  const toNyc = `ind2-bridge-arc-nyc-${variant}`;
  const bloom = `ind2-bridge-bloom-${variant}`;

  return (
    <svg
      aria-hidden="true"
      className={`ss-ind2-bridge__svg ss-ind2-bridge__svg--${variant}`}
      focusable="false"
      viewBox={bridge.viewBox}
    >
      <defs>
        {/* The middle stop is lifted toward platinum so the arc still reads as
            a gradient on the routes whose accent pair is two shades of one
            hue — trades is blue → blue, and a flat monochrome line there would
            make the chart quietly less interesting than it is elsewhere. */}
        <linearGradient id={toLdn} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--srv2-accent-2)" />
          <stop offset="52%" stopColor="var(--ss-ind2-arc-mid)" />
          <stop offset="100%" stopColor="var(--srv2-accent)" />
        </linearGradient>
        <linearGradient id={toNyc} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--srv2-accent)" />
          <stop offset="52%" stopColor="var(--ss-ind2-arc-mid)" />
          <stop offset="100%" stopColor="var(--srv2-accent-2)" />
        </linearGradient>
        <radialGradient id={bloom}>
          <stop offset="0%" stopColor="var(--srv2-accent)" stopOpacity="0.9" />
          <stop offset="55%" stopColor="var(--srv2-accent)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--srv2-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {bridge.latRules.map((rule) => (
        <line
          className="ss-ind2-bridge__lat"
          key={rule.deg}
          x1={bridge.inset}
          x2={bridge.w - bridge.inset}
          y1={rule.y}
          y2={rule.y}
        />
      ))}
      {bridge.lonRules.map((rule) => (
        <line
          className="ss-ind2-bridge__meridian"
          key={rule.deg}
          opacity={meridianOpacity(rule.x, bridge.w)}
          x1={rule.x}
          x2={rule.x}
          y1={bridge.viewY + 4}
          y2={bridge.viewY + bridge.h - 4}
        />
      ))}

      {/* The straight chord under the bowed arc: what makes a flat-projection
          line read as a great circle rather than as decoration. */}
      <line
        className="ss-ind2-bridge__chord"
        x1={bridge.nyc.x}
        x2={bridge.ldn.x}
        y1={bridge.nyc.y}
        y2={bridge.ldn.y}
      />
      {/* Two stacked wide strokes instead of a blur filter: the same bloom, at
          no filter cost, and predictable in user units at every plate size. */}
      <path className="ss-ind2-bridge__arc-bloom" d={bridge.arc} />
      <path className="ss-ind2-bridge__arc-glow" d={bridge.arc} />
      <path className="ss-ind2-bridge__arc" d={bridge.arc} stroke={`url(#${toLdn})`} />
      <path
        className="ss-ind2-bridge__arc ss-ind2-bridge__arc--usd"
        d={bridge.arc}
        stroke={`url(#${toNyc})`}
      />

      <BridgeNode bloomId={bloom} node="nyc" point={bridge.nyc} r={bridge.nodeR} />
      <BridgeNode bloomId={bloom} node="ldn" point={bridge.ldn} r={bridge.nodeR} />

      {/* cx/cy stay at the origin: `offset-path` translates the pulse. */}
      <circle
        className={`ss-ind2-bridge__pulse ss-ind2-bridge__pulse--${variant}`}
        cx="0"
        cy="0"
        r={bridge.nodeR * 0.9}
      />
      <circle
        className="ss-ind2-bridge__pulse-park"
        cx={bridge.park.x}
        cy={bridge.park.y}
        r={bridge.nodeR * 0.9}
      />
    </svg>
  );
}

/**
 * The chart band: an instrument readout, a graticule plate with two city nodes
 * and one great-circle arc, and the market focus control.
 *
 * Both SVGs are decorative — the wrapper carries the description, the SVGs are
 * aria-hidden — but the readout, the node names and their coordinates are real
 * HTML text, so they are in the prerendered document and legible at every
 * width instead of scaling with a viewBox the way SVG <text> would.
 */
function AtlanticBridge() {
  const ref = useRef<HTMLDivElement>(null);
  /*
   * `once: false`: the two loops stop again when the instrument leaves the
   * viewport. This panel sits ~1600px below the fold on a phone, and a pulse
   * nobody can see still costs a frame — `offset-distance` and an SVG
   * transform are the page's only continuous layout source. The gate is
   * `html[data-js="on"] .ss-ind2-bridge:not([data-chart-live])` in CSS, so with
   * JavaScript off (and in the prerendered document) nothing is ever paused.
   */
  /*
   * The chart owns the radio ids so its two city nodes can be real
   * `<label for>` elements for the market switch. Tapping NEW YORK moves the
   * ledger to the US: no JavaScript, no second source of truth, and the only
   * gesture the instrument used to answer was a 128px pill in its corner.
   */
  const controlId = useId();
  const viewport = { amount: 0.2, margin: "0px 0px -8% 0px" } as const;
  const inView = useInView(ref, viewport);
  // A second observer rather than a latch in an effect: `once` keeps the
  // power-on sweep to one play without a setState cascade on every scroll.
  const seen = useInView(ref, { ...viewport, once: true });

  return (
    <div
      className="ss-ind2-bridge"
      data-chart-live={inView ? "true" : undefined}
      data-chart-shown={seen ? "true" : undefined}
      ref={ref}
    >
      <p className="ss-ind2-bridge__readout">
        <span className="ss-ind2-bridge__readout-leg">
          {CITY.ldn.name}
          <span aria-hidden="true"> &#8646; </span>
          {CITY.nyc.name}
        </span>
        <span className="ss-ind2-bridge__readout-fig">{BRIDGE_DISTANCE.km}</span>
        <span className="ss-ind2-bridge__readout-fig">{BRIDGE_DISTANCE.mi}</span>
        <span className="ss-ind2-bridge__readout-tag">One system, two markets</span>
      </p>

      <div
        className="ss-ind2-bridge__chart"
        role="img"
        aria-label="Chart: one working link between London and New York. The market you are reading in is the lit node."
      >
        {/* The plate box is exactly the SVG's box, so a label's percentage
            position IS its viewBox coordinate. */}
        <div className="ss-ind2-bridge__plate">
          <BridgePlate bridge={BRIDGE_WIDE} variant="wide" />
          <BridgePlate bridge={BRIDGE_COMPACT} variant="compact" />

          {/* Graticule tick labels — decorative, and the two sets are swapped
              by the same media query that swaps the plates. */}
          {BRIDGE_WIDE.latLabels.map((tick) => (
            <span
              aria-hidden="true"
              className="ss-ind2-bridge__tick"
              data-axis="lat"
              data-plate="wide"
              key={`w-lat-${String(tick.deg)}`}
              style={{ top: tick.top }}
            >
              {latLabel(tick.deg)}
            </span>
          ))}
          {BRIDGE_WIDE.lonLabels.map((tick) => (
            <span
              aria-hidden="true"
              className="ss-ind2-bridge__tick"
              data-axis="lon"
              data-plate="wide"
              key={`w-lon-${String(tick.deg)}`}
              style={{ left: tick.left }}
            >
              {lonLabel(tick.deg)}
            </span>
          ))}
          {BRIDGE_COMPACT.latLabels.map((tick) => (
            <span
              aria-hidden="true"
              className="ss-ind2-bridge__tick"
              data-axis="lat"
              data-plate="compact"
              key={`c-lat-${String(tick.deg)}`}
              style={{ top: tick.top }}
            >
              {latLabel(tick.deg)}
            </span>
          ))}

          {/* Real HTML labels over the plate at the node coordinates. On the
              compact ladder they move to the two free corners instead, which
              is the only way a callout clears both the node halo and the
              chord — see the stylesheet. */}
          <label
            className="ss-ind2-bridge__node-label"
            data-node="ldn"
            htmlFor={`${controlId}-gbp`}
            style={
              {
                "--mk-node-x": BRIDGE_WIDE.at.ldn.x,
                "--mk-node-y": BRIDGE_WIDE.at.ldn.y,
              } as CSSProperties
            }
          >
            <span className="ss-ind2-bridge__node-name">{CITY.ldn.name}</span>
            <span className="ss-ind2-bridge__node-coord">{CITY.ldn.coord}</span>
          </label>
          <label
            className="ss-ind2-bridge__node-label"
            data-node="nyc"
            htmlFor={`${controlId}-usd`}
            style={
              {
                "--mk-node-x": BRIDGE_WIDE.at.nyc.x,
                "--mk-node-y": BRIDGE_WIDE.at.nyc.y,
              } as CSSProperties
            }
          >
            <span className="ss-ind2-bridge__node-name">{CITY.nyc.name}</span>
            <span className="ss-ind2-bridge__node-coord">{CITY.nyc.coord}</span>
          </label>
        </div>
      </div>

      {/*
        The market focus control IS the display-currency control: one reader
        choice, persisted, driving both the ledger's emphasis and every price
        on the site. A separate switch would be a second source of truth.

        It sits after the chart in the DOM — where a phone reader meets it — and
        CSS lifts it into the readout band beside the distance figures at
        ≥52rem, so on a desktop it is seated in the instrument's own header
        strip rather than dropped onto the plate.
      */}
      <div className="ss-ind2-bridge__control">
        <span aria-hidden="true" className="ss-ind2-bridge__control-label">
          Market focus
        </span>
        <CurrencyToggle context="markets" idPrefix={controlId} tone="dark" />
      </div>
    </div>
  );
}

/**
 * A group entrance that never makes text transparent.
 *
 * The shared `Reveal` primitive animates opacity from 0, and Motion emits that
 * `initial` as an inline `opacity: 0` into the PRERENDERED document. For most
 * of the site that is an accepted trade, but these two panels carry the
 * page's highest-value differentiating copy — ~3,600 characters of
 * fair-housing, MLS and Equality Act detail that exists precisely to be read
 * and indexed — and starting it invisible makes it depend on an
 * IntersectionObserver firing and excludes it from Chrome's LCP candidacy.
 *
 * So the entrance is `translate` only: this component renders AS the container
 * (no extra wrapper, which matters because the ledger's subgrid chain runs
 * straight through it) and stamps `data-lift` through the same global reveal
 * scheduler every other entrance on the site uses. CSS staggers the children.
 * Nothing here is ever at opacity 0, at any point, in any document.
 */
function LiftGroup({
  children,
  className,
  delayMs = 0,
  ...rest
}: {
  children: ReactNode;
  className: string;
  delayMs?: number;
} & Record<`data-${string}`, string | undefined>) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.2,
    margin: "0px 0px -12% 0px",
    once: true,
  });
  const start = useRevealStart(ref, inView, delayMs);
  const delay = start === null || start.instant ? 0 : start.delayMs;

  return (
    <div
      className={`${className} ss-ind2-lift`}
      data-lift={start === null ? undefined : "shown"}
      ref={ref}
      style={{ "--lift-delay": `${String(delay)}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
}

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

/**
 * The two-market manifest — the "Atlantic Bridge".
 *
 * Deliberately not a glossary and not a tabbed toggle. Both lanes are always
 * in the DOM and always readable, so a US reader sees their tooling named
 * beside the UK equivalent (and vice versa) and a crawler reads both
 * vocabularies on one canonical page. What the market switch changes is
 * *emphasis*, never presence: the reader's market becomes the near lane
 * (raised surface, filled tool chips) and the far lane quietens by surface,
 * never by dropping its text contrast.
 *
 * Emphasis is CSS keyed off `<html data-currency>`, which the boot script in
 * root.tsx sets before first paint — so there is no flash, no hydration
 * dependency, and the whole instrument is correct in prerendered HTML.
 *
 * The lanes are a ledger: `grid-template-rows: subgrid` chained down
 * lanes → lane → inner → `<dl>` aligns "Who runs it" in one market with "Who
 * runs it" in the other, so the comparison is read across rather than by
 * scrolling between two cards. DOM order stays US, UK; only `order` moves.
 */
export function MarketLanes({ markets }: { markets: IndustryMarkets }) {
  // Both lanes or neither — see MARKET_RULEBOOK_ROW. The count is stamped on
  // the container because `repeat()` takes an integer literal, not a calc(),
  // so the subgrid track count has to be selected in CSS rather than computed.
  const rows = markets.lanes.every((lane) => lane.rulebook)
    ? [...MARKET_ROWS, MARKET_RULEBOOK_ROW]
    : MARKET_ROWS;

  return (
    <div className="ss-ind2-markets ss-srv2-beam-border">
      <AtlanticBridge />
      <LiftGroup className="ss-ind2-markets__lanes" data-rows={String(rows.length)}>
        {markets.lanes.map((lane) => (
          <div
            key={lane.market}
            className={`ss-ind2-market ss-ind2-market--${lane.market.toLowerCase()}`}
          >
            <div className="ss-ind2-market__inner" data-market={lane.market}>
              <p className="ss-ind2-market__head">
                <span className="ss-ind2-market__code" aria-hidden="true">
                  {lane.market}
                </span>
                <span className="ss-ind2-market__label">{lane.label}</span>
              </p>
              <dl className="ss-ind2-market__rows">
                {rows.map((row) => (
                  <div
                    className="ss-ind2-market__row"
                    data-fact={row.fact}
                    data-keeps={row.fact === "keeps" ? "true" : undefined}
                    data-market={lane.market}
                    key={row.fact}
                  >
                    <dt>{row.label}</dt>
                    <dd>
                      {row.fact === "operators" ? lane.operators : null}
                      {row.fact === "vocabulary" ? lane.vocabulary : null}
                      {row.fact === "keeps" ? lane.keepsHuman : null}
                      {row.fact === "rulebook" ? lane.rulebook : null}
                      {row.fact === "tooling" ? (
                        <ul className="ss-ind2-market__tools">
                          {lane.tooling.map((tool) => (
                            <li key={tool}>{tool}</li>
                          ))}
                        </ul>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </LiftGroup>
      {/* No wrapper reveal: SharedSpine runs its own translate-only entrance
          off the same scheduler, and a Reveal around it would have put the
          rail back behind an inline opacity: 0. */}
      <SharedSpine items={markets.shared} />
      <BorderBeam />
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
 * The pre-state is `translate` only, never opacity: nothing here disappears
 * from the prerendered HTML or from a crawler's rendering, and the keyframes
 * fill `backwards` so the settled transform is the stylesheet's, leaving later
 * hover transforms alive.
 */
function SharedSpine({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  /*
   * The same viewport options as LiftGroup. They used to be tighter (0.4 with
   * an -18% margin) to stay behind the opacity fade of the `Reveal` that once
   * wrapped this block; with that wrapper gone the tight threshold simply
   * failed to fire on a tall panel — a rail whose whole job is to draw itself
   * was measured at `scale: 0 1`, i.e. invisible, at 1440 and at 390.
   */
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

/**
 * A sector's named rulebook — the laws and platform rules the built systems are
 * configured around — rendered as a sibling instrument to the market ledger it
 * sits beneath: the same glass panel, the same beam border, the same market
 * code chips, so crossing from "here is your market" to "here are your market's
 * rules" never feels like leaving the object.
 *
 * Generic by design. Any sector can adopt it by adding a `compliance` block to
 * its copy; the composition guards on that block's presence, so sectors without
 * an established rulebook render nothing rather than a vague panel.
 *
 * The note is deliberately NOT fine print. It carries the division of
 * responsibility that makes every claim above it honest — the client sets the
 * criteria and owns the decisions — so it renders at body weight directly under
 * the cards, at full contrast, rather than as a shrunken footnote.
 */
/**
 * The longest citation that may be held on one line.
 *
 * A citation reads as one reference, so breaking it mid-way ("NAR / SoP 10-3")
 * stops it reading as a citation at all — which is why the desktop tier sets
 * `white-space: nowrap` on these spans. An unbreakable span also sets its
 * card's min-content width, so that promise can only be made where the
 * citation actually fits.
 *
 * Measured on the built site, the source line's content box is 160.8px at
 * 320, 227.3px at 390, 246.2px at 768 and 342.6px at 1024 — the width at
 * which the panel goes two-up and the nowrap tier starts. At this size
 * (0.66rem mono, 0.04em tracking) the citations run 6.6-6.8px per character,
 * so 44 characters is ~298px: inside the 342.6px floor of the tier that uses
 * it, with room for a longer word. Every citation on the site today is 36
 * characters or fewer except one — "Estate Agents (Undesirable Practices)
 * (No. 2) Order 1991, Sch. 3" at 64, which needs 433.9px and so wraps at a
 * space inside its own card. Without that exemption it ran 53-91px past the
 * card's border at every desktop width.
 *
 * The attribute marks what MAY stay unbroken rather than what must wrap, so a
 * new long citation wraps by default instead of having to be recognised.
 */
const COMPLIANCE_CITE_NOWRAP_MAX_CHARS = 44;

export function CompliancePanel({ compliance }: { compliance: IndustryCompliance }) {
  return (
    <div className="ss-ind2-compliance ss-srv2-beam-border">
      {/* The whole boundary in three seconds, above the detail: a phone reader
          meets ~2,500px of legal prose below this row, and the chips are the
          only part of it that survives a scan. Each one is a summary of a card
          underneath — never a claim the cards do not make. */}
      {compliance.glance ? (
        <ul className="ss-ind2-compliance__glance" aria-label="At a glance">
          {compliance.glance.map((claim) => (
            <li className="ss-ind2-compliance__glance-item" key={claim}>
              <ShieldCheck aria-hidden="true" />
              <span>{claim}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {/* The group ignites on first sight so the reader meets the whole
          rulebook at once — a rule arriving late reads as an afterthought. */}
      <LiftGroup className="ss-ind2-compliance__grid">
        {compliance.points.map((point) => (
          <div className="ss-ind2-compliance__card" key={point.title}>
            <div className="ss-ind2-compliance__head" data-market={point.market}>
              {/* Real text, not aria-hidden: unlike the ledger's lane chips,
                  nothing else in this card names the market it applies to. */}
              <span className="ss-ind2-compliance__chip">{point.market}</span>
              <h3 className="ss-ind2-compliance__title">{point.title}</h3>
            </div>
            {point.lede ? (
              <p className="ss-ind2-compliance__lede">{point.lede}</p>
            ) : null}
            <p className="ss-ind2-compliance__body">
              <RichText text={point.body} />
            </p>
            {point.source ? (
              <p className="ss-ind2-compliance__source">
                {/* One span per citation, so a statute never breaks across
                    lines as "NAR / SoP 10-3" — but only where it fits, which is
                    what `data-fits` says. The separator is a real text node
                    between them, so the rendered text is character-for-character
                    the authored `source`. */}
                {point.source.split(" \u00B7 ").map((citation, cite) => (
                  <Fragment key={citation}>
                    {cite > 0 ? " \u00B7 " : null}
                    <span
                      className="ss-ind2-compliance__cite"
                      data-fits={
                        citation.length <= COMPLIANCE_CITE_NOWRAP_MAX_CHARS
                          ? "true"
                          : undefined
                      }
                    >
                      {citation}
                    </span>
                  </Fragment>
                ))}
              </p>
            ) : null}
          </div>
        ))}
      </LiftGroup>
      <LiftGroup className="ss-ind2-compliance__note-band" delayMs={140}>
        <p className="ss-ind2-compliance__note">
          <ShieldCheck aria-hidden="true" />
          <span>
            <RichText text={compliance.note} />
          </span>
        </p>
      </LiftGroup>
      <BorderBeam />
    </div>
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
