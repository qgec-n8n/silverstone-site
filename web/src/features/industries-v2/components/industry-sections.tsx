/**
 * Shared industries-v2 section components, layered on the services-v2
 * primitives so both families share one premium design language. Everything
 * here renders structured approved copy — no raw markdown blocks, no
 * authoring labels.
 */
import {
  AnimatePresence,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router";

import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Landmark,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
  type LucideIcon,
} from "~/components/icons/lucide";
import { ExpandableImage } from "~/components/media/expandable-image";
import { CurrencyToggle } from "~/components/ui/currency-toggle";
import { hasWebpSibling, webpSource } from "~/lib/image-sources";
import { useRevealStart } from "~/motion/use-reveal-start";

import {
  BorderBeam,
  PanelReveal,
  Reveal,
  RichText,
  ServiceButton,
} from "~/features/services-v2/components/primitives";
import {
  ATLAS_COMPACT,
  ATLAS_WIDE,
  LINKED_METROS,
  LONDON,
  US_METROS,
  US_TIME_ZONES,
  type AtlasAura,
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
 * London and twelve US metros on a dotted world plate: the instrument that
 * opens the two-market section. All geometry comes from `../content/atlas` —
 * the plates, the node positions, every route, each country's glow — so the
 * static dot layers, the SVG and the HTML labels agree by construction rather
 * than by hand-copying numbers between them.
 *
 * The plate is decorative (aria-hidden SVGs under a described wrapper); the
 * city names, the time-zone count and the market switch are real HTML text,
 * in the prerendered document, legible at every width.
 */

/** Node and stroke sizes in viewBox units, per plate: the wide plate shows
 * ~0.46px per unit at 1100 wide, the compact one ~0.32px at 340. `quiet` is
 * a third-tier metro — plotted, never linked — and `ripple` the radius the
 * lit country's rings start from. */
const ATLAS_SIZE: Record<
  AtlasPlate["name"],
  { city: number; quiet: number; hub: number; ripple: { us: number; uk: number } }
> = {
  wide: { city: 9, quiet: 6, hub: 14, ripple: { us: 70, uk: 22 } },
  compact: { city: 11, quiet: 7, hub: 17, ripple: { us: 44, uk: 20 } },
};

const spell = (n: number) =>
  [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
  ][n] ?? String(n);

const ATLAS_ARIA = `Map: London and ${spell(US_METROS.length)} US metros — ${US_METROS.map(
  (city) => city.name,
).join(
  ", ",
)}. Routes drawn from London to ${LINKED_METROS.map((city) => city.name).join(", ")}. The market you are reading in is the lit side.`;

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
    <g
      className="ss-ind2-atlas__node"
      data-city={node.id}
      data-linked={node.linked ? "true" : "false"}
      data-side={side}
    >
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
 * One country's radiance: three rings that expand out of its centre while it
 * is the reader's market (the wash under its dots is drawn separately, below
 * the land layers). Plain geometry — no filter, no blur — so the glow costs
 * the compositor one layer, not a per-frame re-rasterisation.
 */
function AtlasRipples({
  aura,
  ripple,
  side,
}: {
  aura: AtlasAura;
  ripple: number;
  side: "us" | "uk";
}) {
  return (
    <g className="ss-ind2-atlas__aura" data-side={side}>
      {[0, 1, 2].map((index) => (
        <circle
          className="ss-ind2-atlas__ripple"
          cx={aura.cx}
          cy={aura.cy}
          key={index}
          r={ripple}
          style={{ "--ripple-i": index } as CSSProperties}
        />
      ))}
    </g>
  );
}

/**
 * One plate. Two are rendered — wide and compact — and only ever one is
 * displayed; a `display: none` element runs no animation, so the looping
 * budget is one plate's halos and rings, never both.
 *
 * Each route carries TWO strokes and CSS crossfades them, because an SVG
 * paint server cannot be flipped from a stylesheet: the bright end of every
 * route is always the reader's own market.
 */
function AtlasPlateSvg({ plate }: { plate: AtlasPlate }) {
  const id = `ind2-atlas-${plate.name}`;
  const size = ATLAS_SIZE[plate.name];
  const west = Math.min(...plate.cities.map((city) => city.point.x));
  const east = plate.hub.point.x;
  /* The UK ripples leave London itself; the US rings leave the country's
     centre, so they cross the whole landmass rather than one metro. */
  const ukAura = { ...plate.aura.uk, cx: plate.hub.point.x, cy: plate.hub.point.y };

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
        {/* The country washes: the same hue as the market's nodes, so a lit
            landmass and its lit cities read as one light. */}
        <radialGradient id={`${id}-aura-uk`}>
          <stop offset="0%" stopColor="var(--srv2-accent)" stopOpacity="0.7" />
          <stop offset="55%" stopColor="var(--srv2-accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--srv2-accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-aura-us`}>
          <stop offset="0%" stopColor="var(--srv2-accent-2)" stopOpacity="0.55" />
          <stop offset="60%" stopColor="var(--srv2-accent-2)" stopOpacity="0.18" />
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

      {/* The washes sit under the dots, so a lit country is lit from beneath
          and its dots stand on the light rather than floating over it. */}
      <ellipse
        className="ss-ind2-atlas__aura-wash"
        cx={plate.aura.us.cx}
        cy={plate.aura.us.cy}
        data-side="us"
        fill={`url(#${id}-aura-us)`}
        rx={plate.aura.us.rx}
        ry={plate.aura.us.ry}
      />
      <ellipse
        className="ss-ind2-atlas__aura-wash"
        cx={plate.aura.uk.cx}
        cy={plate.aura.uk.cy}
        data-side="uk"
        fill={`url(#${id}-aura-uk)`}
        rx={plate.aura.uk.rx}
        ry={plate.aura.uk.ry}
      />
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

      {/* The rings sit over the dots and under the routes: light leaving the
          lit country across its own landmass. */}
      <AtlasRipples aura={plate.aura.us} ripple={size.ripple.us} side="us" />
      <AtlasRipples aura={ukAura} ripple={size.ripple.uk} side="uk" />

      {plate.links.map((link) => (
        <g
          className="ss-ind2-atlas__link"
          data-city={link.city.id}
          key={link.city.id}
          style={{ "--atlas-i": link.rank } as CSSProperties}
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
        </g>
      ))}

      {plate.cities.map((city) => (
        <AtlasNodeMark
          bloomId={`${id}-bloom-us`}
          key={city.id}
          node={city}
          r={city.linked ? size.city : size.quiet}
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
 * The HTML labels over the plate: one per named city, carrying BOTH plates'
 * positions and anchors as custom properties, so the same real text is placed
 * by whichever plate the stylesheet is showing. They are `<label for>`s on the
 * market switch's radios — tapping Chicago moves the ledger to the US, tapping
 * London to the UK — with no second source of truth.
 *
 * Only the first two tiers are printed here (the stylesheet drops the second
 * on the compact plate); the quiet third tier is named by the strip below.
 */
function AtlasLabels({ controlId }: { controlId: string }) {
  const pairs = [
    { wide: ATLAS_WIDE.hub, compact: ATLAS_COMPACT.hub, side: "uk" as const },
    ...ATLAS_WIDE.cities
      .map((wide, index) => ({
        wide,
        compact: ATLAS_COMPACT.cities[index] ?? wide,
        side: "us" as const,
      }))
      .filter(({ wide }) => wide.labelled),
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
 * `data-chart-live` (`once: false`) stops the halos and rings when the plate
 * leaves the viewport — looping animations nobody can see still cost frames
 * on a phone — and `data-chart-shown` fires the one-time route draw through
 * the global reveal scheduler. The plate opens as an aperture (the `image`
 * reveal), and the routes leave London ~0.9s later, once the plate is most of
 * the way open; the threshold is 0.4 so that draw happens on screen rather
 * than below the fold.
 */
function AtlanticAtlas({ controlId }: { controlId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const stripId = useId();
  const [metrosOpen, setMetrosOpen] = useState(false);
  const viewport = { amount: 0.4, margin: "0px 0px -8% 0px" } as const;
  const inView = useInView(ref, viewport);
  const seen = useInView(ref, { ...viewport, once: true });
  const start = useRevealStart(ref, seen, 900);
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

      <Reveal className="ss-ind2-atlas__chart-reveal" delayMs={100} kind="image">
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

      {/* Every metro by name at every width, behind a disclosure: the plates
          label seven at most, and a city name is something a reader may
          search for, so the twelve stay in the prerendered document (folded
          with grid rows + `inert`, never unmounted) under a row that reads as
          one line whether it is open or shut. */}
      <Reveal className="ss-ind2-atlas__strip" delayMs={280} kind="section">
        <button
          aria-controls={stripId}
          aria-expanded={metrosOpen}
          className="ss-ind2-atlas__strip-toggle"
          data-state={metrosOpen ? "open" : "closed"}
          onClick={() => {
            setMetrosOpen((state) => !state);
          }}
          type="button"
        >
          <span className="ss-ind2-atlas__strip-label">
            US metros Silverstone AI currently serves
          </span>
          <span aria-hidden="true" className="ss-ind2-atlas__strip-count">
            {US_METROS.length}
          </span>
          <span className="ss-ind2-atlas__strip-hint">
            {metrosOpen ? "Hide cities" : "Show cities"}
          </span>
          <ChevronDown aria-hidden="true" className="ss-ind2-atlas__strip-chevron" />
        </button>
        <div
          className="ss-ind2-atlas__strip-fold"
          data-state={metrosOpen ? "open" : "closed"}
          id={stripId}
          inert={!metrosOpen}
        >
          <p className="ss-ind2-atlas__strip-line">
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
        </div>
      </Reveal>

      {/* The frontier: a reader whose metro is not on the plate is the one
          the map should turn into an enquiry, so the offer sits outside the
          fold, always visible, and the CTA is the shared conversion button
          so it lands on the contact console client-side. */}
      <Reveal className="ss-ind2-atlas__frontier-reveal" delayMs={360} kind="cta">
        <div className="ss-ind2-atlas__frontier">
          <div className="ss-ind2-atlas__frontier-copy">
            <span className="ss-ind2-atlas__frontier-badge">
              <Sparkles aria-hidden="true" />
              New frontier · First-in-city offer
            </span>
            <p className="ss-ind2-atlas__frontier-title">
              Can’t find your city? Put it on the map.
            </p>
            <p className="ss-ind2-atlas__frontier-body">
              Be the first business in your metro to run a Silverstone AI system and
              take <strong>10% off your build</strong>. Enter the new frontier — and be
              ready for what’s next before anyone else in town is.
            </p>
          </div>
          {/* The offer column: the figure as a title, the qualifier as its
              subtitle, the CTA beneath — one stacked unit at the band's end.
              The figure is decorative (the body copy above states the offer),
              so it stays out of the accessibility tree. */}
          <div className="ss-ind2-atlas__frontier-offer">
            <p aria-hidden="true" className="ss-ind2-atlas__frontier-figure">
              <span className="ss-ind2-atlas__frontier-figure-value">10% OFF</span>
              <span className="ss-ind2-atlas__frontier-figure-label">
                First in your city
              </span>
            </p>
            <ServiceButton
              className="ss-ind2-atlas__frontier-cta"
              href="/contact"
              withArrow={false}
            >
              Claim your city
              <ArrowUpRight aria-hidden="true" />
            </ServiceButton>
          </div>
        </div>
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
 * Each card opens compact — icon, market chip, title and the one-line claim —
 * and a reader who wants the rules opens the card (or all of them at once).
 * The rules and citations are always in the document, merely collapsed by
 * CSS (`grid-template-rows: 0fr → 1fr`) with `inert` keeping a closed card's
 * detail out of the tab order: the same contract as the FAQ, so the legal
 * copy stays in the prerendered HTML for a crawler and for the panel's own
 * test. On a pointer device a closed card tilts a few degrees toward the
 * cursor — a card you can pick up — and stops the moment it is opened, since
 * nobody reads a rulebook that is moving.
 *
 * The note is deliberately NOT fine print — it carries the division of
 * responsibility that makes every claim above it honest, so it renders at body
 * weight under the cards, at full contrast.
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

type CompliancePoint = IndustryCompliance["points"][number];

/** How far a closed card leans toward the cursor, in degrees. */
const TILT_DEGREES = 5;
const tiltSpring = { stiffness: 260, damping: 22, mass: 0.6 } as const;
/* The card's own radius, handed to Motion as a value so the morph between a
   grid card and its lightbox scale-corrects the corners instead of stretching
   them with the box. Matches `.ss-ind2-compliance__card` in the stylesheet. */
const CARD_RADIUS = 18;
const focusMorph = { type: "spring", stiffness: 300, damping: 34, mass: 0.9 } as const;

function complianceCitations(point: CompliancePoint) {
  return point.source ? point.source.split(" · ") : [];
}

/* The head and the body are shared between a card in the grid and its
   lightbox, so the two can never drift apart in copy or structure. The title
   element differs (a button in the grid, the dialog's own title in focus) and
   is passed in. */
function ComplianceHead({
  point,
  title,
}: {
  point: CompliancePoint;
  title: ReactNode;
}) {
  const Icon = COMPLIANCE_ICONS[point.icon];
  return (
    <div className="ss-ind2-compliance__head" data-market={point.market}>
      <span aria-hidden="true" className="ss-ind2-compliance__icon">
        <Icon aria-hidden="true" />
      </span>
      <span className="ss-ind2-compliance__titles">
        {/* Real text, not aria-hidden: nothing else in this card names
            the market its rule applies to. */}
        <span className="ss-ind2-compliance__chip">{point.market}</span>
        {title}
      </span>
    </div>
  );
}

function ComplianceBody({ point }: { point: CompliancePoint }) {
  const citations = complianceCitations(point);
  return (
    <div className="ss-ind2-compliance__details-inner">
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
      {citations.length > 0 ? (
        /* One chip per citation, so a statute never breaks across
           lines as "NAR / SoP 10-3", and a long reference simply
           takes a chip of its own width. Not links: RichText renders
           no anchors, and a live link out of a compliance claim
           invites the reader to check a source that may move. */
        <ul aria-label="Sources" className="ss-ind2-compliance__sources">
          {citations.map((citation) => (
            <li className="ss-ind2-compliance__cite" key={citation}>
              {citation}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ComplianceCard({
  focused,
  index,
  layoutId,
  onFocus,
  onKeyDown,
  open,
  point,
  registerTrigger,
}: {
  focused: boolean;
  index: number;
  /** Shared with the lightbox; undefined when motion is reduced. */
  layoutId: string | undefined;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  open: boolean;
  point: CompliancePoint;
  registerTrigger: (node: HTMLButtonElement | null) => void;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const id = useId();
  const triggerId = `${id}-trigger`;
  const detailId = `${id}-detail`;
  const citations = complianceCitations(point);

  /* The tilt: cursor offset from the card's centre → a few degrees of
     rotation, through a spring so the card settles rather than snaps. Both
     values park at zero while the card is open, focused, or motion is
     reduced — a parked card is also a flat one for the morph to measure. */
  const cardRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(pointerY, [-180, 180], [TILT_DEGREES, -TILT_DEGREES]),
    tiltSpring,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-240, 240], [-TILT_DEGREES, TILT_DEGREES]),
    tiltSpring,
  );
  const tilts = !reducedMotion && !open && !focused;

  useEffect(() => {
    if (!tilts) {
      pointerX.set(0);
      pointerY.set(0);
    }
  }, [tilts, pointerX, pointerY]);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!tilts || event.pointerType !== "mouse" || !cardRef.current) {
      return;
    }
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    pointerX.set(event.clientX - left - width / 2);
    pointerY.set(event.clientY - top - height / 2);
  };
  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <Reveal
      className="ss-ind2-compliance__cell"
      delayMs={180 + index * 110}
      kind="card"
    >
      {/* The whole card is a hit area for a pointer; the button in the title
          is the control itself — keyboard, screen reader, `aria-expanded`.
          Either brings the card forward into the lightbox. */}
      <m.article
        className="ss-ind2-compliance__card"
        data-focus-origin={focused ? "true" : undefined}
        data-state={open ? "open" : "closed"}
        onClick={() => {
          // A reader selecting a sentence to copy it is not asking to open.
          if (window.getSelection()?.toString()) {
            return;
          }
          onFocus();
        }}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        ref={cardRef}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
      >
        {/* The morph's socket. Motion's shared layout hides whichever element
            with this id is not the lead; giving the id to this empty,
            absolutely-positioned ghost instead of the card keeps the card
            itself on the page while its lightbox is open, so the grid never
            shows a hole. The lightbox grows out of this box and returns to it.
            The ghost keeps Motion's default crossfade: when it is promoted
            back on close, that is what projects the leaving lightbox onto
            this box and fades it out over the second half of the return. */}
        {layoutId ? (
          <m.div
            aria-hidden="true"
            className="ss-ind2-compliance__ghost"
            layoutDependency={focused}
            layoutId={layoutId}
            style={{ borderRadius: CARD_RADIUS }}
            transition={focusMorph}
          />
        ) : null}
        <ComplianceHead
          point={point}
          title={
            <h3 className="ss-ind2-compliance__title">
              <button
                aria-expanded={focused}
                aria-haspopup="dialog"
                className="ss-ind2-compliance__trigger"
                id={triggerId}
                onClick={(event) => {
                  event.stopPropagation();
                  onFocus();
                }}
                onKeyDown={onKeyDown}
                ref={registerTrigger}
                type="button"
              >
                <span>{point.title}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="ss-ind2-compliance__chevron"
                />
              </button>
            </h3>
          }
        />
        <p className="ss-ind2-compliance__claim">{point.claim}</p>
        {/* The rules stay in the page — prerendered, crawlable — and unfold
            in place under "Expand all"; a single card's click reads them in
            the lightbox instead. `inert` keeps a folded region out of the
            tab order. */}
        <div
          aria-labelledby={triggerId}
          className="ss-ind2-compliance__details"
          id={detailId}
          inert={!open}
          role="region"
        >
          <ComplianceBody point={point} />
        </div>
        {/* What the card is holding, so a closed card is not a mystery. */}
        <span aria-hidden="true" className="ss-ind2-compliance__meta">
          {`${String(point.rules.length)} rules${
            citations.length > 0 ? ` · ${String(citations.length)} sources` : ""
          } · read`}
        </span>
      </m.article>
    </Reveal>
  );
}

/* One card brought forward. A Radix dialog for the semantics — focus trap,
   Escape, scroll lock, focus return (a click on the scrim is deliberately
   ignored; see `onInteractOutside`) — portalled to the body
   because the panel's backdrop-filter would otherwise pin a fixed lightbox
   inside its own frame. The portal leaves the `.ss-srv2` scope behind, so the
   wrapper re-opens it and carries the route's two accents across. */
function ComplianceFocus({
  accent,
  layoutId,
  onCloseAutoFocus,
  point,
}: {
  accent: CSSProperties;
  layoutId: string | undefined;
  onCloseAutoFocus: () => void;
  point: CompliancePoint;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <DialogPrimitive.Portal forceMount>
      <div className="ss-srv2 ss-ind2 ss-ind2-compliance-focus" style={accent}>
        <DialogPrimitive.Overlay asChild forceMount>
          <m.div
            animate={{ opacity: 1 }}
            className="ss-ind2-compliance-focus__scrim"
            exit={{ opacity: 0, transition: { duration: 0.22, ease: "easeIn" } }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          />
        </DialogPrimitive.Overlay>
        {/* The stage centres the card and lets pointer events fall through
            to the scrim; the dialog ignores that click (below), so resting
            the pointer beside the card never dismisses it. */}
        <div className="ss-ind2-compliance-focus__stage">
          <DialogPrimitive.Content
            asChild
            forceMount
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              onCloseAutoFocus();
            }}
            /* The close button (and Escape) are the only ways back: a click
               on the scrim beside the card is a reader resting the pointer,
               not a request to dismiss three rules mid-read. */
            onInteractOutside={(event) => {
              event.preventDefault();
            }}
            onOpenAutoFocus={(event) => {
              // Land on the card itself, not its close button: the first
              // Tab then reaches the close, and a pointer reader sees no ring.
              event.preventDefault();
              articleRef.current?.focus({ preventScroll: true });
            }}
          >
            <m.article
              className="ss-ind2-compliance__card ss-ind2-compliance__card--focus"
              data-state="open"
              ref={articleRef}
              style={{ borderRadius: CARD_RADIUS }}
              tabIndex={-1}
              transition={focusMorph}
              {...(layoutId
                ? {
                    layoutId,
                    /* Shared-layout elements crossfade by default: the lead
                       would fade up from nothing over the whole morph, showing
                       the blurred scrim through itself before going solid —
                       the "faded, then dark" the reader saw. Off, the card is
                       opaque from its first frame and simply grows out of its
                       socket. The way back is the ghost's (see the card): it
                       shrinks onto the compact card solid, and fades only over
                       the second half of the return. */
                    layoutCrossfade: false,
                  }
                : {
                    animate: { opacity: 1 },
                    exit: { opacity: 0, transition: { duration: 0.2 } },
                    initial: { opacity: 0 },
                  })}
            >
              <DialogPrimitive.Close asChild>
                <button
                  aria-label="Close"
                  className="ss-ind2-compliance-focus__close"
                  type="button"
                >
                  <X aria-hidden="true" />
                </button>
              </DialogPrimitive.Close>
              {/* The content rides the morph undistorted: a child with its
                  own `layout` is counter-scaled against the card's changing
                  box, so text slides into place instead of stretching. */}
              <m.div className="ss-ind2-compliance-focus__body" layout="position">
                <ComplianceHead
                  point={point}
                  title={
                    <DialogPrimitive.Title asChild>
                      <h3 className="ss-ind2-compliance__title">
                        <span className="ss-ind2-compliance__trigger">
                          <span>{point.title}</span>
                        </span>
                      </h3>
                    </DialogPrimitive.Title>
                  }
                />
                <DialogPrimitive.Description asChild>
                  <p className="ss-ind2-compliance__claim">{point.claim}</p>
                </DialogPrimitive.Description>
                {/* The rules are the one thing the compact card did not show,
                    so they arrive a beat after the card has landed — a rise
                    into place rather than a wall of text present from frame
                    one. Motion counter-scales it against the morph like the
                    rest of the body. */}
                <m.div
                  animate={{ opacity: 1, y: 0 }}
                  className="ss-ind2-compliance__details"
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { delay: 0.16, duration: 0.46, ease: entranceEase }
                  }
                >
                  <ComplianceBody point={point} />
                </m.div>
              </m.div>
            </m.article>
          </DialogPrimitive.Content>
        </div>
      </div>
    </DialogPrimitive.Portal>
  );
}

export function CompliancePanel({ compliance }: { compliance: IndustryCompliance }) {
  const reducedMotion = useReducedMotion() ?? false;
  const panelId = useId();
  const cardCount = compliance.points.length;
  const [openTitles, setOpenTitles] = useState<readonly string[]>([]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [accent, setAccent] = useState<CSSProperties>({});
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  /* The card to hand focus back to once the lightbox has finished leaving;
     by then `focusIndex` is already null. */
  const lastFocus = useRef<number | null>(null);
  const allOpen = openTitles.length === cardCount;
  const focusPoint = focusIndex === null ? undefined : compliance.points[focusIndex];

  const layoutIdFor = (index: number) =>
    reducedMotion ? undefined : `${panelId}-compliance-${String(index)}`;

  const focusCard = (index: number) => {
    const grid = gridRef.current;
    if (grid) {
      const style = getComputedStyle(grid);
      setAccent({
        "--srv2-accent": style.getPropertyValue("--srv2-accent"),
        "--srv2-accent-2": style.getPropertyValue("--srv2-accent-2"),
      } as CSSProperties);
    }
    lastFocus.current = index;
    setFocusIndex(index);
  };

  /* Arrow/Home/End roving between the card triggers, as on the FAQ. */
  const focusTrigger = (index: number) => {
    triggers.current[(index + cardCount) % cardCount]?.focus();
  };
  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusTrigger(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusTrigger(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTrigger(0);
        break;
      case "End":
        event.preventDefault();
        focusTrigger(cardCount - 1);
        break;
      default:
        break;
    }
  };

  return (
    /* "some": the cards stack tall on a 390 phone even closed; a quarter of
       the frame is not reliably in an 844px viewport at once, and with the
       default threshold the frame could stay at opacity 0 forever. */
    <PanelReveal amount="some" className="ss-ind2-compliance ss-srv2-beam-border">
      <div className="ss-ind2-compliance__bar">
        {/* The whole boundary in three seconds, above the detail. Each chip
            is a summary of a card underneath — never a claim the cards do not
            make. */}
        {compliance.glance ? (
          <ul className="ss-ind2-compliance__glance" aria-label="At a glance">
            {compliance.glance.map((claim, index) => (
              <GlancePill claim={claim} index={index} key={claim} />
            ))}
          </ul>
        ) : null}
        <Reveal className="ss-ind2-compliance__all-reveal" delayMs={140} kind="pill">
          {/* Its visible label changes with state, so it is a plain button,
              not a pressed toggle: the name says what pressing it does. This
              is the one control that unfolds the rules in the page itself;
              the cards' own clicks bring a single card forward instead. */}
          <button
            className="ss-ind2-compliance__all"
            data-state={allOpen ? "open" : "closed"}
            onClick={() => {
              setOpenTitles(
                allOpen ? [] : compliance.points.map((point) => point.title),
              );
            }}
            type="button"
          >
            <ChevronDown aria-hidden="true" />
            {allOpen ? "Collapse all" : "Expand all rules"}
          </button>
        </Reveal>
      </div>
      {/* `data-focus` while a card is forward: the others step back. */}
      <div
        className="ss-ind2-compliance__grid"
        data-focus={focusIndex === null ? undefined : "true"}
        ref={gridRef}
      >
        {compliance.points.map((point, index) => (
          <ComplianceCard
            focused={focusIndex === index}
            index={index}
            key={point.title}
            layoutId={layoutIdFor(index)}
            onFocus={() => {
              focusCard(index);
            }}
            onKeyDown={(event) => {
              onTriggerKeyDown(event, index);
            }}
            open={openTitles.includes(point.title)}
            point={point}
            registerTrigger={(node) => {
              triggers.current[index] = node;
            }}
          />
        ))}
      </div>
      {/* The dialog root is always mounted (it renders no DOM of its own);
          the portal is conditional inside AnimatePresence, and `forceMount`
          on it keeps Radix from unmounting the overlay and content before
          their exit animations have run. */}
      <DialogPrimitive.Root
        onOpenChange={(open) => {
          if (!open) {
            setFocusIndex(null);
          }
        }}
        open={focusIndex !== null}
      >
        <AnimatePresence>
          {focusPoint && focusIndex !== null ? (
            <ComplianceFocus
              accent={accent}
              key="compliance-focus"
              layoutId={layoutIdFor(focusIndex)}
              onCloseAutoFocus={() => {
                if (lastFocus.current !== null) {
                  triggers.current[lastFocus.current]?.focus({ preventScroll: true });
                }
              }}
              point={focusPoint}
            />
          ) : null}
        </AnimatePresence>
      </DialogPrimitive.Root>
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
      <ExpandableImage
        alt={image.alt}
        height={image.height}
        src={optimizedDesktop}
        width={image.width}
      >
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
      </ExpandableImage>
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
