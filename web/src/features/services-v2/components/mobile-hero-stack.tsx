/**
 * The phone-only beats of BOTH secondary heroes — the shared services-v2 one
 * (`./secondary-hero.tsx`, 25 routes) and the homepage's own
 * (`~/visual/home-v2/sections/secondary-hero.tsx`).
 *
 * On a phone the hero is one screen and has to read at a glance, so the deck,
 * the full lead and the long capability sentences all step aside for two much
 * shorter beats sourced from `MobileHeroCopy`:
 *
 *   tagline   one accent-tinted line under the H1, in place of deck + lead
 *   manifest  three chip-sized signals in one glass instrument panel
 *
 * Both live in the DOM on every viewport; CSS decides which composition shows
 * (`.ss-mhero__*` is `display: none` outside `max-width: 40rem`). That is the
 * site's established pattern for viewport copy — see
 * `.ss-hv2-hero__lead-full` / `-short` — and it is why the desktop deck, lead
 * and capability list stay in the markup rather than being swapped out: the
 * phone rendering is the indexed rendering, so nothing that carries the page's
 * argument may exist only on one side of the breakpoint. What the phone hides
 * (deck, lead, long capability lines) is restated in the body copy below the
 * fold on 24 of the 25 shared-hero routes; what it shows is a compression of
 * the same claims, not a new one.
 *
 * The one exception, measured rather than assumed: on `/about` five content
 * terms from the hero lead — builds, receptionists, voice, websites,
 * businesses — appear nowhere else in the phone-rendered page, which is also
 * the site's thinnest at ~2.8k rendered characters (every other route runs
 * 10-15k, and their lead terms all recur below the fold). The text is still in
 * the document, so it is discounted rather than lost, but the fix belongs in
 * /about's body copy, not in the hero: re-showing that lead on phones would
 * spend stage height the fold contract has no margin for at 320x568.
 *
 * The two heroes keep their own CTA pills (`ServiceButton` reads the route's
 * `--srv2-accent`, which does not exist on the homepage) and their own
 * heading level — only these beats and their rhythm are shared.
 */
import { createElement, type CSSProperties } from "react";

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

import type { MobileHeroCopy } from "../content/mobile-hero";
import { Reveal } from "./reveal";
import { RichText } from "./rich-text";

const FALLBACK_POINT_ICONS = [Target, Workflow, ShieldCheck] as const;

/**
 * Substitution order when two rows of the same manifest infer the same glyph.
 * The fallback trio leads (it is the vocabulary a point with no keyword match
 * already gets), then the rest of the icon set, so a substitution still reads
 * as diagnostic/process/governance before it reaches the specific glyphs.
 */
const POINT_ICON_DEDUPE_POOL = [
  Target,
  Workflow,
  ShieldCheck,
  Layers,
  Zap,
  Plug,
  Database,
  TrendingUp,
  UserCheck,
  Unlock,
] as const;

/**
 * Service and industry copy is sourced as plain strings. Give those signals
 * the same icon-chip language as core pages without rewriting generated copy
 * contracts: the visible text selects a stable, semantically matched icon,
 * with a varied diagnostic/process/governance fallback.
 *
 * Lives here rather than in `secondary-hero.tsx` because both the phone
 * manifest and the desktop capability list need it, and the dependency has to
 * run one way (hero → stack) to stay free of an import cycle.
 */
export function inferPointIcon(text: string, index: number): LucideIcon {
  const normalized = text.toLowerCase();
  if (/human|judgment|oversight|people|team|clinician/.test(normalized)) {
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
 * The manifest's three glyphs, resolved together.
 *
 * `inferPointIcon` matches one string at a time, so two points that trip the
 * same keyword class come back with the same glyph — /book's "A quick fit
 * check" and "Choose a verified time" both match the diagnostic class and both
 * returned Target, which reads in the panel as a repeated stamp rather than as
 * three distinct signals. Resolving the set lets a repeat fall through to the
 * next unused glyph. Order is preserved: the FIRST occurrence keeps the
 * semantically matched icon and only the later collision is substituted.
 *
 * Phone-only, deliberately: the desktop capability list calls `inferPointIcon`
 * directly and keeps its per-point result, because ≥40rem is pixel-frozen for
 * this work.
 */
export function resolvePointIcons(points: readonly string[]): LucideIcon[] {
  const used = new Set<LucideIcon>();
  return points.map((point, index) => {
    const inferred = inferPointIcon(point, index);
    const icon = used.has(inferred)
      ? (POINT_ICON_DEDUPE_POOL.find((candidate) => !used.has(candidate)) ?? inferred)
      : inferred;
    used.add(icon);
    return icon;
  });
}

/**
 * The shared hero's ladder, which the homepage's phone stack also rides so the
 * two compositions arrive with the same rhythm. Both are re-stated here rather
 * than imported so this module has no dependency back on either hero.
 *
 * crumbs 500 → eyebrow 560 → H1 700 → tagline 840 → panel 900 →
 * rows 980 / 1080 / 1180 → CTAs 1310. Nothing new lands after 1400ms.
 */
export const MOBILE_HERO_TAGLINE_DELAY_MS = 840;
export const MOBILE_HERO_MANIFEST_DELAY_MS = 900;
/** Each row follows its panel by this much, then 100ms apart. */
const ROW_OFFSET_MS = 80;
const ROW_STAGGER_MS = 100;

function ManifestRow({
  text,
  icon: Icon,
  delayMs,
}: {
  text: string;
  icon: LucideIcon;
  delayMs: number;
}) {
  return (
    <li
      className="ss-mhero__row"
      /*
       * The entrance is CSS (`ss-mhero-row-in`, styles/visual/home-v2.css)
       * with only its delay handed in, exactly like the panel above. It used
       * to be a `m.li` with a Motion `initial`, which Motion serialises into
       * the prerendered HTML as an inline `opacity: 0` — the pattern the CWV
       * work identified as an LCP hazard (Chrome will not treat a
       * zero-opacity element as an LCP candidate, so the page is scored on
       * the animation rather than on the paint) and, on a cold gated entry,
       * the reason the stagger never played at all. The keyframe keeps the
       * slide-from-left choreography; it lives beside the panel's own rather
       * than in the shared `.ss-mount-reveal` vocabulary, which mirrors
       * `revealVariants` one-for-one and has no horizontal member.
       */
      style={{ "--mhero-row-delay": `${String(delayMs)}ms` } as CSSProperties}
    >
      <span className="ss-mhero__row-icon" aria-hidden="true">
        {createElement(Icon, { "aria-hidden": "true" })}
      </span>
      <span className="ss-mhero__row-text">{text}</span>
    </li>
  );
}

/**
 * The manifest's accessible name. It used to be the route's eyebrow, which a
 * screen reader had just announced as the visible label one line above — on
 * /industry/estate-agents that echo was 53 characters. A name that says what
 * the list IS carries information the echo does not, and it is the same on
 * every route because the list plays the same part on every route.
 */
const MANIFEST_LABEL = "What this covers";

export function MobileHeroStack({
  copy,
  taglineDelayMs = MOBILE_HERO_TAGLINE_DELAY_MS,
  manifestDelayMs = MOBILE_HERO_MANIFEST_DELAY_MS,
}: {
  copy: MobileHeroCopy;
  /** Slot in the host hero's reveal ladder; defaults to the shared hero's. */
  taglineDelayMs?: number;
  /** The panel's CSS entrance; its rows follow at +80ms, then 100ms apart. */
  manifestDelayMs?: number;
}) {
  const icons = resolvePointIcons(copy.points);

  return (
    <>
      {copy.tagline ? (
        <Reveal
          className="ss-mhero__beat"
          kind="section"
          delayMs={taglineDelayMs}
          trigger="mount"
        >
          <p className="ss-mhero__tagline">
            <RichText text={copy.tagline} />
          </p>
        </Reveal>
      ) : null}
      <ul
        className="ss-mhero__manifest"
        /* Safari drops list semantics — and with them the name — from a <ul>
           whose computed `list-style-type` is `none`, which this panel's own
           rule sets. `role="list"` restores both; the codebase already applies
           it for the same reason in pricing-value-model.tsx and four others. */
        role="list"
        aria-label={MANIFEST_LABEL}
        /*
         * The panel is a bare <ul> with no component-level Reveal (wrapping it
         * would add a box to the desktop composition too), so its entrance is
         * a CSS animation whose delay is handed in here — that is what lets
         * the homepage run the same panel on its own, earlier ladder.
         */
        style={
          { "--mhero-panel-delay": `${String(manifestDelayMs)}ms` } as CSSProperties
        }
      >
        {copy.points.map((point, index) => (
          <ManifestRow
            key={point}
            text={point}
            icon={icons[index] ?? ShieldCheck}
            delayMs={manifestDelayMs + ROW_OFFSET_MS + index * ROW_STAGGER_MS}
          />
        ))}
      </ul>
    </>
  );
}
