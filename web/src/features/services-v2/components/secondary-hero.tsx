/**
 * services-v2 secondary hero — the substantial body-opener beneath the Aether
 * intro, mirroring the homepage's secondary-hero language: kicker, large display
 * title, lead, capability points, dual CTAs and a showcase panel, followed by
 * the animated scroll cue. The reusable homepage TrustStrip renders beneath it
 * (composed in each page), so the reassurance band matches the homepage exactly.
 */
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { createElement, type ReactNode } from "react";
import { Link, useLocation } from "react-router";

import {
  Database,
  Layers,
  Plug,
  ShieldCheck,
  Target,
  TrendingUp,
  Unlock,
  UserCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from "~/components/icons/lucide";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { getBreadcrumbTrail } from "~/components/layout/shell/breadcrumb-trail";

import { Eyebrow, Reveal, RichText, ServiceButton } from "./primitives";

/**
 * The route intro overlay (see `route-experience-frame.tsx`) fades out over
 * 500ms starting the instant the body becomes visible — the same instant this
 * hero's `whileInView` reveals fire, since the body goes from `display: none`
 * to laid-out in that same moment. Without an offsetting base delay, every
 * reveal below would start (and mostly finish) while still hidden behind that
 * fading overlay, so the user never sees the motion, only the settled result.
 * 560ms clears the overlay with a small safety margin before the first reveal
 * (the eyebrow) begins, so the full sequence plays in the open.
 */
const HERO_REVEAL_BASE_DELAY = 560;

/** Animated scroll cue, identical to the homepage body cue. */
export function ScrollCue() {
  return (
    <div className="ss-srv2-hero__scrollcue">
      <div className="ss-hv2-body-scrollcue" aria-hidden="true">
        <span className="ss-eyebrow font-mono text-[10px]">Scroll</span>
        <span className="ss-hv2-scrollcue__rail" />
      </div>
    </div>
  );
}

/** Route-derived breadcrumb trail, top-anchored above the pill. Home renders
 * no trail (root page), so callers should skip rendering when it's empty. */
function HeroBreadcrumbs({ trail }: { trail: ReturnType<typeof getBreadcrumbTrail> }) {
  return (
    <Breadcrumb className="ss-srv2-hero__crumbs">
      <BreadcrumbList>
        {trail.flatMap((crumb, index) => {
          const current = index === trail.length - 1;
          return [
            ...(index > 0 ? [<BreadcrumbSeparator key={`${crumb.href}-sep`} />] : []),
            <BreadcrumbItem key={crumb.href}>
              {current ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>,
          ];
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Hero capability point: a plain string renders with the gradient dot;
 * `{ icon, text }` renders a bordered icon chip instead (core pages). */
export type SecondaryHeroPoint = string | { icon: LucideIcon; text: string };

const FALLBACK_POINT_ICONS = [Target, Workflow, ShieldCheck] as const;

/**
 * Service and industry copy is sourced as plain strings. Give those signals
 * the same icon-chip language as core pages without rewriting generated copy
 * contracts: the visible text selects a stable, semantically matched icon,
 * with a varied diagnostic/process/governance fallback.
 */
function inferPointIcon(text: string, index: number): LucideIcon {
  const normalized = text.toLowerCase();
  if (/human|judgment|oversight|people|team/.test(normalized)) {
    return UserCheck;
  }
  if (/source of truth|crm|record|data|diary|reservation|patient/.test(normalized)) {
    return Database;
  }
  if (/measure|result|proof|impact|performance|kpi|outcome/.test(normalized)) {
    return TrendingUp;
  }
  if (/sector|discipline|architecture|connected|industry/.test(normalized)) {
    return Layers;
  }
  if (/integrat|tool|platform|stack/.test(normalized)) {
    return Plug;
  }
  if (/lock-in|commit/.test(normalized)) {
    return Unlock;
  }
  if (/second|week|fast|live|always|immediate/.test(normalized)) {
    return Zap;
  }
  if (/scope|diagnos|problem|fit|choose|priority/.test(normalized)) {
    return Target;
  }
  if (/govern|safe|secure|compliance|control|guardrail/.test(normalized)) {
    return ShieldCheck;
  }
  if (/workflow|system|process|route|handoff|automation/.test(normalized)) {
    return Workflow;
  }
  return FALLBACK_POINT_ICONS[index % FALLBACK_POINT_ICONS.length] ?? ShieldCheck;
}

/**
 * How tightly the primary CTA's label has to be fitted on a phone.
 *
 * On short screens the two hero actions share one row (see the
 * `max-height: 43.75rem` tier in services-v2.css), which leaves each button
 * roughly 120px of inner width — narrow enough that a 21-character label wraps
 * onto a second line inside the pill. The label is content, so the CSS cannot
 * see how long it is; this hands it the one fact it needs, exactly like the
 * `data-long` markers on the title and lead below, and the tier answers with a
 * step down in type. Buckets, not a continuous scale, so the same label always
 * renders at the same size on every route that uses it.
 *
 * The tier's sizing holds a label of up to ~25 characters on one line at
 * 320px; past that, prefer shorter CTA copy over another step down.
 */
function primaryCtaLengthBucket(label: string): "long" | "xl" | undefined {
  const length = label.replace(/[*`]/g, "").trim().length;
  if (length > 21) {
    return "xl";
  }
  if (length > 18) {
    return "long";
  }
  return undefined;
}

function CapabilityPoint({
  point,
  index,
}: {
  point: SecondaryHeroPoint;
  index: number;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const text = typeof point === "string" ? point : point.text;
  const Icon = typeof point === "string" ? inferPointIcon(text, index) : point.icon;
  const content = (
    <>
      <span className="ss-srv2-hero__cap-icon" aria-hidden="true">
        {createElement(Icon, { "aria-hidden": "true" })}
      </span>
      <span>{text}</span>
    </>
  );
  if (reducedMotion) {
    return <li className="ss-srv2-hero__cap">{content}</li>;
  }
  return (
    <m.li
      className="ss-srv2-hero__cap"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: (HERO_REVEAL_BASE_DELAY + 420 + index * 100) / 1000,
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {content}
    </m.li>
  );
}

export function SecondaryHero({
  eyebrow,
  icon,
  title,
  titleId,
  deck,
  lead,
  points,
  primaryCtaLabel,
  primaryCtaHref = "/book#booking-calendar",
  secondaryCtaLabel,
  secondaryCtaHref,
  showcase,
}: {
  eyebrow: string;
  icon?: LucideIcon | undefined;
  title: string;
  titleId?: string | undefined;
  /**
   * Optional short line directly beneath the H1.
   *
   * Exists because several H1s were rewritten to front-load their exact target
   * term, which displaced a creative line worth keeping (e.g. "Automate none of
   * the care."). The deck holds that line, or the second market term where the
   * H1 could only carry one. It sits between the H1 and the lead, and is
   * deliberately compact: the hero is budgeted to one phone screen, so this is
   * the smallest element that can carry a sentence.
   */
  deck?: string | undefined;
  lead: string;
  points: SecondaryHeroPoint[];
  primaryCtaLabel: string;
  /** Defaults to the booking deep link; conversion pages point it at their
   * own in-page target (e.g. the contact form) instead. */
  primaryCtaHref?: string;
  /** Optional second CTA. Only rendered when both label and href are given —
   * each page decides whether it has a section worth deep-linking to. */
  secondaryCtaLabel?: string | undefined;
  secondaryCtaHref?: string | undefined;
  showcase: ReactNode;
}) {
  const location = useLocation();
  const breadcrumbTrail = getBreadcrumbTrail(location.pathname);

  return (
    <section className="ss-srv2-section ss-srv2-hero" aria-labelledby={titleId}>
      <div className="ss-srv2__container">
        <div className="ss-srv2-hero__grid">
          <div className="ss-srv2-hero__intro">
            <div className="ss-srv2-hero__top">
              {breadcrumbTrail.length > 0 ? (
                <Reveal
                  kind="section"
                  delayMs={HERO_REVEAL_BASE_DELAY - 60}
                  trigger="mount"
                >
                  <HeroBreadcrumbs trail={breadcrumbTrail} />
                </Reveal>
              ) : null}
              <Reveal kind="pill" delayMs={HERO_REVEAL_BASE_DELAY} trigger="mount">
                <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
              </Reveal>
              <Reveal
                kind="section"
                delayMs={HERO_REVEAL_BASE_DELAY + 140}
                trigger="mount"
              >
                {/* data-long lets CSS size the longest H1s (~68 chars on some
                    service pages) a step smaller, holding the 3-line budget the
                    shorter industry titles meet at full size. */}
                <h1
                  className="ss-srv2-hero__title"
                  id={titleId}
                  data-long={
                    title.replace(/[*`]/g, "").length > 64 ? "true" : undefined
                  }
                >
                  <RichText text={title} />
                </h1>
              </Reveal>
              {deck ? (
                <Reveal
                  kind="section"
                  delayMs={HERO_REVEAL_BASE_DELAY + 210}
                  trigger="mount"
                >
                  <p className="ss-srv2-hero__deck">
                    <RichText text={deck} />
                  </p>
                </Reveal>
              ) : null}
              <Reveal
                kind="section"
                delayMs={HERO_REVEAL_BASE_DELAY + 280}
                trigger="mount"
              >
                {/* Same idea as the H1's data-long, for the lead: one route's
                    hero lead runs to ~218 characters where every other sits
                    between 88 and 165, and on a phone that single outlier
                    wraps two lines past the copy budget — enough to push the
                    CTAs down under the floating demo and consent controls.
                    The threshold sits above every current lead but that one. */}
                <p
                  className="ss-srv2-hero__lead"
                  data-long={
                    lead.replace(/[*`]/g, "").length > 175 ? "true" : undefined
                  }
                >
                  <RichText text={lead} />
                </p>
              </Reveal>
              <ul className="ss-srv2-hero__caps">
                {points.map((point, index) => (
                  <CapabilityPoint
                    key={typeof point === "string" ? point : point.text}
                    point={point}
                    index={index}
                  />
                ))}
              </ul>
            </div>
            <Reveal
              className="ss-srv2-hero__actions-reveal"
              kind="cta"
              delayMs={HERO_REVEAL_BASE_DELAY + 750}
              trigger="mount"
            >
              <div
                className="ss-srv2-hero__actions"
                data-primary-cta-length={primaryCtaLengthBucket(primaryCtaLabel)}
              >
                <ServiceButton href={primaryCtaHref} variant="primary">
                  {primaryCtaLabel}
                </ServiceButton>
                {secondaryCtaLabel && secondaryCtaHref ? (
                  <ServiceButton
                    href={secondaryCtaHref}
                    variant="ghost"
                    withArrow={false}
                  >
                    {secondaryCtaLabel}
                  </ServiceButton>
                ) : null}
              </div>
            </Reveal>
          </div>

          <div className="ss-srv2-hero__showcase">
            <Reveal kind="image" delayMs={HERO_REVEAL_BASE_DELAY + 220} trigger="mount">
              {showcase}
            </Reveal>
          </div>
        </div>
        <ScrollCue />
      </div>
    </section>
  );
}
