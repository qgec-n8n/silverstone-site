/**
 * Live client-website showcase — presented in one stable scene whose copy
 * morphs while the demo visuals rail between projects.
 *
 * Two callers, one component. /services/web-design-development mounts the full
 * catalogue as a portfolio rail. An industry page passes `only=<site id>` to
 * mount a single build as sector proof; that drops the project switcher and
 * the "01 / 02" counter, and everything below about railing between projects
 * simply never happens. Each route's CSP `frame-src` allow-list (root
 * netlify.toml) must name exactly the origins that route can mount.
 *
 * Every breakpoint shares one scene grammar: the project copy sits ABOVE the
 * devices, a console row (project switcher · device focus toggle · live link)
 * sits between the copy and the stage, and the stage composes the two device
 * previews. The section keeps its position and dimensions while the
 * per-project copy layers (copy, chips, index numerals and metadata)
 * cross-morph in place while each complete browser-and-phone composition
 * travels on one horizontal rail. The domain therefore remains attached to
 * the browser chrome it identifies. The client tint
 * variables (`--demo-tint`/`--demo-tint-2`) are colour-interpolated per frame,
 * so every derived accent — chips, dots, buttons, glows, beams — transforms
 * with them. Both projects' copy and visual captures stay in the prerendered
 * HTML, which pins the scene's height and makes both rail directions
 * deterministic. Reduced motion swaps every layer and rail instantly.
 *
 * On desktop and tablet the stage holds a dominant live browser window and a
 * phone; a two-state Desktop/Mobile control decides which device owns the
 * foreground. Switching it plays a turntable orbit: the devices sit on
 * opposite ends of one spinning circle, so the phone arcs around the window's
 * right edge while the window eases back and to the left — both always facing
 * forward, passing on opposite sides, never through one another (see the
 * device-orbit section for the solid-object guarantee). The background device
 * is inert: it can never intercept input meant for the foreground preview.
 *
 * BOTH devices are interactive embeds with identical rules. The browser
 * window activates into a live iframe at a fixed desktop/tablet logical
 * viewport; the phone activates into the same site at a fixed 390px phone
 * logical viewport, scaled to sit exactly inside the phone screen — the real
 * mobile build, browsable in place. On mobile (<48rem) no iframe ever mounts
 * and the phone is a plain link that opens the live site in a new tab.
 *
 * One demo may be live at a time across both surfaces; a demo stands down on
 * Escape, on its standby control, after sustained inactivity, when the
 * project or device focus changes, and whenever the section effectively
 * leaves the viewport (`showcase-presence.ts`) — returning never
 * auto-resumes.
 *
 * The embed always receives a fixed logical viewport for its device class
 * (desktop 1440 / tablet 834 / phone surface 390) scaled onto its frame with
 * a CSS transform, so the embedded site renders its intended breakpoint
 * regardless of host width. Posters are locally hosted captures; nothing is
 * requested from the demo origins before an explicit activation. The
 * route-scoped CSP `frame-src` allow-list (root netlify.toml) holds the two
 * demo origins plus Calendly; both demo sites serve `frame-ancestors 'self'
 * https://silverstone-ai.com https://www.silverstone-ai.com`, so live windows
 * only activate on the production domain — elsewhere the posters and
 * open-in-new-tab links still work.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionStyle,
  type MotionValue,
  type TargetAndTransition,
} from "motion/react";
import * as m from "motion/react-m";

import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  Globe,
  HeartPulse,
  Layers,
  Monitor,
  Power,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  Workflow,
  type LucideIcon,
} from "~/components/icons/lucide";

import { BorderBeam, Reveal } from "../components/primitives";
import { useShowcaseIdleTimeout } from "./showcase-idle";
import { useShowcasePresence } from "./showcase-presence";
import showcaseSitesJson from "./showcase-sites.json";
import {
  EMBED_VIEWPORT_WIDTH,
  fitEmbedViewport,
  initialShowcaseState,
  PHONE_EMBED_VIEWPORT_WIDTH,
  showcaseReducer,
  type ShowcaseDeviceClass,
  type ShowcaseSiteId,
  type ShowcaseSurface,
} from "./showcase-state";

type PosterSource = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
};

type ShowcaseSiteConfig = {
  id: ShowcaseSiteId;
  /** Approved manifest slot this window activates. */
  configSlot: string;
  url: string;
  origin: string;
  domain: string;
  /** Delegates the Payment Request API to the embedded site (booking deposits). */
  allowPayment: boolean;
};

type ShowcaseSite = ShowcaseSiteConfig & {
  name: string;
  sector: string;
  /** Distinctive scene headline (h3 under the section heading). */
  headline: string;
  /** One concise supporting sentence. */
  line: string;
  /** Verifiable capability chips shown in the scene intro. */
  chips: { icon: LucideIcon; label: string }[];
  /** Client-brand light: LIVE dot, beam ring and glows inside this scene only. */
  tint: string;
  tintSecondary: string;
  desktopPoster: PosterSource;
  mobilePoster: PosterSource;
};

/** Embed/link targets come from the shared config (`showcase-sites.json`) —
 * the single source of truth for the demo origins. */
function siteConfig(id: ShowcaseSiteId): ShowcaseSiteConfig {
  const config = showcaseSitesJson.sites.find((entry) => entry.id === id);
  if (!config) {
    throw new Error(`showcase-sites.json is missing the "${id}" demo site`);
  }
  return { ...config, id };
}

const sites: ShowcaseSite[] = [
  {
    ...siteConfig("aesthetics-by-clouds"),
    name: "Aesthetics by Clouds",
    sector: "Aesthetic clinic · Abingdon",
    headline: "A serene clinic journey that closes with a deposit",
    line: "Thirty-eight treatments across four categories, moving each visitor from discovery to a deposit-secured consultation.",
    chips: [
      { icon: HeartPulse, label: "38-treatment catalogue" },
      { icon: CalendarCheck, label: "Deposit-secured booking" },
      { icon: Sparkles, label: "Free consultation funnel" },
      { icon: Workflow, label: "Nested booking portal" },
    ],
    // Source site theme green plus its lighter in-site green accent.
    tint: "#536035",
    tintSecondary: "#7cb69c",
    desktopPoster: {
      src: "/demos/web-design/clouds-desktop-1440.webp",
      srcSet:
        "/demos/web-design/clouds-desktop-1440.webp 1440w, /demos/web-design/clouds-desktop-2880.webp 2880w",
      width: 2880,
      height: 1800,
      alt: "Aesthetics by Clouds homepage — “Redefining confidence through advanced aesthetics.”",
    },
    mobilePoster: {
      src: "/demos/web-design/clouds-mobile-390.webp",
      srcSet:
        "/demos/web-design/clouds-mobile-390.webp 390w, /demos/web-design/clouds-mobile-780.webp 780w",
      width: 780,
      height: 1688,
      alt: "The Aesthetics by Clouds homepage on a phone.",
    },
  },
  {
    ...siteConfig("ownly-housing"),
    name: "Ownly Housing",
    sector: "Shared-ownership housing",
    headline: "Calm authority for a specialist housing launch",
    line: "Three audiences — shared owners, housing associations, developers — carried through one trust-led, policy-aware journey.",
    chips: [
      { icon: Building2, label: "Three audience journeys" },
      { icon: UserCheck, label: "Shared-owner support hub" },
      { icon: ShieldCheck, label: "Policy-led content system" },
      { icon: Layers, label: "Portal-ready architecture" },
    ],
    // Source site theme tokens: #5e0000 oxblood and #c8a84a gold.
    tint: "#5e0000",
    tintSecondary: "#c8a84a",
    desktopPoster: {
      src: "/demos/web-design/ownly-desktop-1440.webp",
      srcSet:
        "/demos/web-design/ownly-desktop-1440.webp 1440w, /demos/web-design/ownly-desktop-2880.webp 2880w",
      width: 2880,
      height: 1800,
      alt: "Ownly Housing homepage — “Managing shared ownership. Protecting what matters most.”",
    },
    mobilePoster: {
      src: "/demos/web-design/ownly-mobile-390.webp",
      srcSet:
        "/demos/web-design/ownly-mobile-390.webp 390w, /demos/web-design/ownly-mobile-780.webp 780w",
      width: 780,
      height: 1688,
      alt: "The Ownly Housing homepage on a phone.",
    },
  },
];

/* ---- Device class ------------------------------------------------------ */

const DESKTOP_MEDIA = "(min-width: 64rem) and (hover: hover) and (pointer: fine)";
const MOBILE_MEDIA = "(max-width: 47.9375rem)";

function subscribeDeviceClass(onChange: () => void): () => void {
  const desktop = window.matchMedia(DESKTOP_MEDIA);
  const mobile = window.matchMedia(MOBILE_MEDIA);
  desktop.addEventListener("change", onChange);
  mobile.addEventListener("change", onChange);
  return () => {
    desktop.removeEventListener("change", onChange);
    mobile.removeEventListener("change", onChange);
  };
}

function readDeviceClass(): ShowcaseDeviceClass {
  if (window.matchMedia(MOBILE_MEDIA).matches) {
    return "mobile";
  }
  return window.matchMedia(DESKTOP_MEDIA).matches ? "desktop" : "tablet";
}

const serverDeviceClass = (): ShowcaseDeviceClass => "desktop";

/** Mirrors the stylesheet's three presentation families; "desktop" during
 * prerender/hydration (behaviour-only — presentation is media-query CSS). */
function useDeviceClass(): ShowcaseDeviceClass {
  return useSyncExternalStore(subscribeDeviceClass, readDeviceClass, serverDeviceClass);
}

/* ---- Embed scaling ------------------------------------------------------ */

/**
 * Measures the screen's untransformed layout box and derives the local
 * transform that maps the fixed logical embed viewport onto it. The device
 * itself can then orbit/scale without that ancestor transform being counted
 * twice. Pointer coordinates, focus and touch all pass through both CSS
 * transforms correctly, and the embed stays sharp at device resolution.
 */
function useEmbedScale(
  screenRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  logicalWidth: number,
): CSSProperties | null {
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (!enabled || !screen) {
      setBox(null);
      return undefined;
    }
    // ResizeObserver always delivers an initial notification on observe(),
    // so it covers the first measurement as well as later resizes and zoom.
    const observer = new ResizeObserver(() => {
      // clientWidth/clientHeight deliberately ignore ancestor transforms.
      // getBoundingClientRect() would include the phone's foreground scale,
      // then that same scale would be applied to the iframe a second time.
      const width = screen.clientWidth;
      const height = screen.clientHeight;
      setBox((current) =>
        current !== null && current.width === width && current.height === height
          ? current
          : { width, height },
      );
    });
    observer.observe(screen);
    return () => observer.disconnect();
  }, [enabled, screenRef]);

  if (!enabled || !box || box.width <= 0) {
    return null;
  }
  const viewport = fitEmbedViewport(box.width, box.height, logicalWidth);
  if (!viewport) {
    return null;
  }
  return {
    width: `${String(viewport.logicalWidth)}px`,
    height: `${String(viewport.logicalHeight)}px`,
    maxWidth: "none",
    transform: `scale(${String(viewport.scale)})`,
  };
}

/** One-shot preconnect so activation resolves the demo origin instantly. */
function preconnect(origin: string) {
  if (typeof document === "undefined") {
    return;
  }
  if (document.head.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
    return;
  }
  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = origin;
  document.head.appendChild(link);
}

/* ---- Project visual rail ----------------------------------------------- */

const PROJECT_RAIL_DURATION_S = 0.82;
const PROJECT_RAIL_TRANSITION = {
  duration: PROJECT_RAIL_DURATION_S,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

type ProjectVisualRailProps = {
  index: number;
  reducedMotion: boolean;
  className: string;
  children: ReactNode;
};

/**
 * A full-width two-project strip. Its own width stays equal to the visible
 * screen while the 100%-wide children overflow horizontally, so x:-100%
 * always lands the second project exactly on the screen bounds.
 */
function ProjectVisualRail({
  index,
  reducedMotion,
  className,
  children,
}: ProjectVisualRailProps) {
  return (
    <m.div
      className={`ss-folio-visual-rail ${className}`}
      data-rail-index={index}
      initial={false}
      animate={{ x: `${String(-index * 100)}%` }}
      transition={reducedMotion ? { duration: 0 } : PROJECT_RAIL_TRANSITION}
    >
      {children}
    </m.div>
  );
}

/* ---- Device orbit ------------------------------------------------------- */

/*
 * A turntable, not a fly-past. The two devices are solid objects on opposite
 * ends of one spinning circle; toggling the foreground rotates that circle
 * half a turn, so the phone arcs around the window's RIGHT edge while the
 * window eases back and to the LEFT — they pass on opposite sides, both
 * always facing forward (no rotation anywhere on the arc), and never through
 * one another.
 *
 * One eased progress value drives every transform through `useTransform`
 * (0 = window in front, 1 = phone in front): the path is a pure function of
 * that value, so MOBILE→DESKTOP retraces DESKTOP→MOBILE exactly, nothing
 * re-renders per frame, and a mid-flight reversal simply re-targets from
 * wherever the devices currently are.
 *
 * Solid-object guarantee: depth may only swap while the two silhouettes are
 * laterally clear of each other. Depth crosses once, exactly at progress 0.5,
 * so the choreography splits the turn around that moment — the window
 * completes its recede entirely in the first half (`backArc`), the phone's
 * cross-stage travel to its front pose plays entirely in the second half
 * (`frontArc`, i.e. only once it is unambiguously the front plane), and the
 * phone's sideways clearance is MEASURED from the live layout
 * (`measureOrbitOutPx`) so its inner edge always clears the window's receded
 * right edge at the crossover, on every breakpoint. Reversing swaps the roles
 * symmetrically: the phone first retraces across the front to the window's
 * edge, and only after the depth swap does the window come forward again.
 *
 * Reduced motion never uses any of this: no `style` is attached at all, so
 * the stylesheet's static `[data-plane]` poses apply with an opacity-only
 * fade.
 */

/** Symmetric by construction, so the depth crossover at progress 0.5 lands on
 * the arc's midpoint in wall-clock time too, not just in geometry. */
const ORBIT_TRANSITION = {
  duration: 0.95,
  ease: [0.5, 0, 0.5, 1] as [number, number, number, number],
};

/** Settled endpoint poses — the DESKTOP/MOBILE compositions. */
const PHONE_X_FRONT = -105;
const PHONE_SCALE_FRONT = 1.22;
const PHONE_OPACITY_BACK = 1;
const WINDOW_X_BACK = -2;
const WINDOW_Y_BACK = -2.5;
const WINDOW_SCALE_BACK = 0.92;
const WINDOW_OPACITY_BACK = 1;

/* Turntable shaping — every term is zero at BOTH endpoints, so the settled
   compositions above are the only thing that survives the arc. */
/** Tilted-circle read: near-side dip / far-side lift, % of own height. */
const PHONE_BOW = 9;
const WINDOW_BOW = 3;
/** The window's sideways sweep at the quarter-turns, % of its own width —
 * its half of the pass; the phone's half is measured in px per layout. */
const WINDOW_SIDE = 4;
/** Minimum edge-to-edge daylight between the silhouettes at the crossover. */
const ORBIT_CLEARANCE_PX = 28;

/** 0→1→0 across the turn; peaks exactly at the depth crossover. */
const swing = (p: number) => Math.sin(Math.PI * p);
/** 0→1 with zero gradient at both ends: the endpoints settle, never snap. */
const ramp = (p: number) => (1 - Math.cos(Math.PI * p)) / 2;
const smooth = (t: number) => {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped * clamped * (3 - 2 * clamped);
};
/** Plays entirely in the second half of the turn, and only from a beat AFTER
 * the depth crossover — the phone holds its outward station through the flip
 * before drawing across the front. */
const frontArc = (p: number) => smooth((p - 0.55) / 0.45);
/** Completes entirely in the first half of the turn, a beat BEFORE the depth
 * crossover — the window is already parked back-left when depth exchanges. */
const backArc = (p: number) => smooth(p / 0.45);

/** Depth crosses once, at the midpoint, as an integer — never a fractional
 * z-index the browser would drop, and never a per-frame React render. */
const orbitDepth = (progress: number, frontAt: 0 | 1) =>
  (frontAt === 1 ? progress > 0.5 : progress <= 0.5) ? 3 : 1;

/**
 * The phone's sideways clearance, measured from the resting layout (offset*
 * geometry ignores transforms). At the crossover the window has fully receded
 * (backArc = 1, swing = 1) and the phone has not yet begun its cross-stage
 * travel (frontArc = 0) but is halfway through its scale-up — the phone's
 * inner edge must clear the window's receded right edge with daylight to
 * spare at that exact moment, whatever the breakpoint's real dimensions.
 */
function measureOrbitOutPx(windowEl: HTMLElement, phoneEl: HTMLElement): number {
  const phoneWidth = phoneEl.offsetWidth;
  const windowWidth = windowEl.offsetWidth;
  const windowRightAtCross =
    windowEl.offsetLeft +
    windowWidth -
    (windowWidth * (1 - WINDOW_SCALE_BACK)) / 2 +
    (windowWidth * WINDOW_X_BACK) / 100 -
    (windowWidth * WINDOW_SIDE) / 100;
  const phoneScaleAtCross = 1 + (PHONE_SCALE_FRONT - 1) * ramp(0.5);
  const phoneLeftAtCross =
    phoneEl.offsetLeft - (phoneWidth * (phoneScaleAtCross - 1)) / 2;
  return Math.max(
    // Always a visible arc, even in a layout that already clears.
    phoneWidth * 0.18,
    windowRightAtCross + ORBIT_CLEARANCE_PX - phoneLeftAtCross,
  );
}

function usePhoneOrbit(
  progress: MotionValue<number>,
  outPx: RefObject<number>,
): MotionStyle {
  return {
    x: useTransform(
      progress,
      (p) =>
        `calc(${String(PHONE_X_FRONT * frontArc(p))}% + ${String(outPx.current * swing(p))}px)`,
    ),
    y: useTransform(progress, (p) => `${String(PHONE_BOW * swing(p))}%`),
    scale: useTransform(progress, (p) => 1 + (PHONE_SCALE_FRONT - 1) * ramp(p)),
    opacity: useTransform(
      progress,
      (p) => PHONE_OPACITY_BACK + (1 - PHONE_OPACITY_BACK) * ramp(p),
    ),
    zIndex: useTransform(progress, (p) => orbitDepth(p, 1)),
  };
}

function useWindowOrbit(progress: MotionValue<number>): MotionStyle {
  return {
    x: useTransform(
      progress,
      (p) => `${String(WINDOW_X_BACK * backArc(p) - WINDOW_SIDE * swing(p))}%`,
    ),
    y: useTransform(
      progress,
      (p) => `${String(WINDOW_Y_BACK * backArc(p) - WINDOW_BOW * swing(p))}%`,
    ),
    scale: useTransform(progress, (p) => 1 - (1 - WINDOW_SCALE_BACK) * backArc(p)),
    opacity: useTransform(progress, (p) => 1 - (1 - WINDOW_OPACITY_BACK) * ramp(p)),
    zIndex: useTransform(progress, (p) => orbitDepth(p, 0)),
  };
}

/* ---- Phone: interactive mobile embed ------------------------------------- */

type MobileDemoPhoneProps = {
  site: ShowcaseSite;
  interactive: boolean;
  deviceClass: ShowcaseDeviceClass;
  /** connecting/live while THIS site's phone surface owns the demo. */
  phase: "idle" | "connecting" | "live";
  idlePaused: boolean;
  frameNonce: number;
  slowConnect: boolean;
  frameHolderRef: RefObject<HTMLDivElement | null>;
  onActivate: (site: ShowcaseSiteId, surface: ShowcaseSurface) => void;
  onRestart: (site: ShowcaseSiteId) => void;
  onStandby: () => void;
  onLoaded: (site: ShowcaseSiteId) => void;
};

function MobileDemoPhone({
  site,
  interactive,
  deviceClass,
  phase,
  idlePaused,
  frameNonce,
  slowConnect,
  frameHolderRef,
  onActivate,
  onRestart,
  onStandby,
  onLoaded,
}: MobileDemoPhoneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const mountFrame = interactive && phase !== "idle" && deviceClass !== "mobile";
  const scalerStyle = useEmbedScale(
    viewportRef,
    mountFrame,
    PHONE_EMBED_VIEWPORT_WIDTH,
  );

  const poster = (
    <div className="ss-folio-phone__visual">
      <img
        className="ss-folio-phone__shot"
        src={site.mobilePoster.src}
        srcSet={site.mobilePoster.srcSet}
        sizes="(min-width: 48rem) 15rem, 66vw"
        width={site.mobilePoster.width}
        height={site.mobilePoster.height}
        alt={site.mobilePoster.alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  );

  const browserBar = (
    <span className="ss-folio-phone__browser-bar" aria-hidden="true">
      <span className="ss-folio-phone__browser-domain">
        <Globe />
        {site.domain}
      </span>
      <span className="ss-folio-phone__browser-menu">•••</span>
    </span>
  );

  // Mobile (<48rem): the phone is a plain safe external link — tapping a demo
  // opens the configured live site in a new tab; no iframe ever mounts.
  if (deviceClass === "mobile") {
    return (
      <a
        className="ss-focus-ring ss-folio-phone"
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open the ${site.name} website in a new tab`}
      >
        <span className="ss-folio-phone__island" aria-hidden="true" />
        <div className="ss-folio-phone__screen">
          <div className="ss-folio-phone__viewport">{poster}</div>
          {browserBar}
        </div>
        {interactive ? (
          <span className="ss-folio-phone__tag" aria-hidden="true">
            Tap to open live site
            <ArrowUpRight aria-hidden="true" />
          </span>
        ) : null}
      </a>
    );
  }

  const handleLoad = () => {
    const firstLoad = phase === "connecting";
    onLoaded(site.id);
    // Hand focus to the embed once, on the connecting → live transition (the
    // visitor just asked for it); onLoad also refires on every in-embed
    // navigation, which must not re-steal focus.
    if (firstLoad) {
      frameRef.current?.focus({ preventScroll: true });
    }
  };

  const activateDemo = () => {
    onActivate(site.id, "phone");
    // The activation control unmounts in the next commit; keep keyboard focus
    // deterministic by parking it on the standby control (the iframe then
    // takes it on first load, exactly like the window embed).
    window.requestAnimationFrame(() => {
      rootRef.current
        ?.querySelector<HTMLButtonElement>(`[data-phone-standby="${site.id}"]`)
        ?.focus({ preventScroll: true });
    });
  };

  return (
    <div
      ref={rootRef}
      className="ss-folio-phone"
      data-phase={phase}
      data-interactive={interactive || undefined}
      tabIndex={-1}
      onPointerEnter={interactive ? () => preconnect(site.origin) : undefined}
    >
      <span className="ss-folio-phone__island" aria-hidden="true" />
      <div className="ss-folio-phone__screen">
        <div
          ref={(node) => {
            viewportRef.current = node;
            if (mountFrame) {
              frameHolderRef.current = node;
            }
          }}
          className="ss-folio-phone__viewport"
        >
          {poster}

          {mountFrame && scalerStyle ? (
            <iframe
              ref={frameRef}
              key={frameNonce}
              className="ss-folio-phone__frame"
              style={{ ...scalerStyle, touchAction: "pan-y pinch-zoom" }}
              src={site.url}
              title={`${site.name} — live mobile website`}
              allow={site.allowPayment ? "payment" : undefined}
              data-live={phase === "live" || undefined}
              onLoad={handleLoad}
            />
          ) : null}

          {phase === "connecting" ? (
            <span className="ss-folio-phone__veil" role="status">
              <span className="ss-folio-phone__veil-ring" aria-hidden="true" />
              Connecting to {site.domain}
              {slowConnect ? (
                <a
                  className="ss-focus-ring ss-folio-window__connecting-out"
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Taking a while? Open the site directly
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ) : null}
            </span>
          ) : null}

          {interactive && phase === "idle" ? (
            <button
              type="button"
              className="ss-folio-phone__activate"
              data-activate-phone={site.id}
              onClick={activateDemo}
            >
              <span className="ss-folio-phone__activate-ring" aria-hidden="true">
                <Power />
              </span>
              <span className="ss-folio-phone__activate-label">
                Activate mobile demo
              </span>
              <span className="ss-folio-phone__activate-sub">
                {idlePaused
                  ? "Paused after inactivity — pick up where you left off"
                  : "Browse the real mobile site right here"}
              </span>
            </button>
          ) : null}
        </div>
        {browserBar}

        {interactive && phase !== "idle" ? (
          <div className="ss-folio-phone__ctls" data-phone-controls>
            <button
              type="button"
              className="ss-focus-ring ss-folio-window__ctl"
              onClick={() => onRestart(site.id)}
              aria-label={`Restart the ${site.name} mobile demo`}
              title="Restart demo"
            >
              <RotateCcw aria-hidden="true" />
            </button>
            <button
              type="button"
              className="ss-focus-ring ss-folio-window__ctl"
              data-phone-standby={site.id}
              onClick={onStandby}
              aria-label={`Return the ${site.name} demo to standby`}
              title="Return to standby"
            >
              <Power aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>

      {interactive && phase === "idle" ? (
        <span className="ss-folio-phone__tag" aria-hidden="true">
          Mobile · live demo
        </span>
      ) : null}
    </div>
  );
}

/* ---- Window: interactive desktop/tablet embed --------------------------- */

type DesktopDemoWindowProps = {
  site: ShowcaseSite;
  interactive: boolean;
  phase: "idle" | "connecting" | "live";
  idlePaused: boolean;
  frameNonce: number;
  slowConnect: boolean;
  logicalWidth: number;
  frameHolderRef: RefObject<HTMLDivElement | null>;
  onActivate: (site: ShowcaseSiteId, surface: ShowcaseSurface) => void;
  onRestart: (site: ShowcaseSiteId) => void;
  onStandby: () => void;
  onLoaded: (site: ShowcaseSiteId) => void;
};

function DesktopDemoWindow({
  site,
  interactive,
  phase,
  idlePaused,
  frameNonce,
  slowConnect,
  logicalWidth,
  frameHolderRef,
  onActivate,
  onRestart,
  onStandby,
  onLoaded,
}: DesktopDemoWindowProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const mountFrame = interactive && phase !== "idle";
  const frameStyle = useEmbedScale(screenRef, mountFrame, logicalWidth);
  const status =
    phase === "live" ? "Live" : phase === "connecting" ? "Connecting" : "Standby";

  const handleLoad = () => {
    const firstLoad = phase === "connecting";
    onLoaded(site.id);
    if (firstLoad) {
      frameRef.current?.focus({ preventScroll: true });
    }
  };

  return (
    <div
      className="ss-folio-window ss-srv2-beam-border"
      data-phase={phase}
      data-interactive={interactive || undefined}
      tabIndex={interactive ? -1 : undefined}
      onPointerEnter={interactive ? () => preconnect(site.origin) : undefined}
      onKeyDown={(event: ReactKeyboardEvent) => {
        if (interactive && event.key === "Escape" && phase !== "idle") {
          event.preventDefault();
          event.stopPropagation();
          onStandby();
        }
      }}
    >
      <div className="ss-folio-window__bar">
        <span className="ss-folio-window__dots" aria-hidden="true">
          <i /> <i /> <i />
        </span>
        <span className="ss-folio-window__addr">
          <Globe aria-hidden="true" />
          <span className="ss-folio-window__addr-domain">{site.domain}</span>
        </span>
        <span
          className="ss-folio-window__status"
          data-status={phase}
          role={interactive ? "status" : undefined}
        >
          <i aria-hidden="true" />
          {status}
        </span>
        {interactive && phase !== "idle" ? (
          <>
            <button
              type="button"
              className="ss-focus-ring ss-folio-window__ctl"
              onClick={() => onRestart(site.id)}
              aria-label={`Restart the ${site.name} demo`}
              title="Restart demo"
            >
              <RotateCcw aria-hidden="true" />
            </button>
            <button
              type="button"
              className="ss-focus-ring ss-folio-window__ctl"
              onClick={onStandby}
              aria-label={`Return the ${site.name} demo to standby`}
              title="Return to standby"
            >
              <Power aria-hidden="true" />
            </button>
          </>
        ) : null}
        <a
          className="ss-focus-ring ss-folio-window__open"
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the ${site.name} website in a new tab`}
        >
          Open site
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>

      <div
        ref={(node) => {
          screenRef.current = node;
          if (mountFrame) {
            frameHolderRef.current = node;
          }
        }}
        className="ss-folio-window__screen"
      >
        <div className="ss-folio-window__visual">
          <img
            className="ss-folio-window__poster"
            src={site.desktopPoster.src}
            srcSet={site.desktopPoster.srcSet}
            sizes="(min-width: 64rem) 92vw, 94vw"
            width={site.desktopPoster.width}
            height={site.desktopPoster.height}
            alt={site.desktopPoster.alt}
            loading="lazy"
            decoding="async"
          />
        </div>

        {mountFrame && frameStyle ? (
          <iframe
            ref={frameRef}
            key={frameNonce}
            className="ss-folio-window__frame"
            style={frameStyle}
            src={site.url}
            title={`${site.name} — live website`}
            allow={site.allowPayment ? "payment" : undefined}
            data-live={phase === "live" || undefined}
            onLoad={handleLoad}
          />
        ) : null}

        {interactive && phase === "idle" ? (
          <button
            type="button"
            className="ss-folio-window__activate"
            data-activate={site.id}
            onClick={() => onActivate(site.id, "window")}
          >
            <span className="ss-folio-window__activate-ring" aria-hidden="true">
              <Power />
            </span>
            <span className="ss-folio-window__activate-label">Activate live demo</span>
            <span className="ss-folio-window__activate-sub">
              {idlePaused
                ? "Paused after inactivity — pick up where you left off"
                : "Browse the real website right here"}
            </span>
          </button>
        ) : null}

        {interactive && phase === "connecting" ? (
          <span className="ss-folio-window__connecting" role="status">
            <span className="ss-folio-window__connecting-ring" aria-hidden="true" />
            Connecting to {site.domain}
            {slowConnect ? (
              <a
                className="ss-focus-ring ss-folio-window__connecting-out"
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Taking a while? Open the site directly
                <ArrowUpRight aria-hidden="true" />
              </a>
            ) : null}
          </span>
        ) : null}
      </div>

      <BorderBeam />
    </div>
  );
}

/* ---- Scene ------------------------------------------------------------- */

/** Delay before the connecting veil offers the direct link out. */
const SLOW_CONNECT_MS = 10_000;

type SceneProps = {
  site: ShowcaseSite;
  index: number;
  deviceClass: ShowcaseDeviceClass;
  /** Phase of the current site (idle unless it owns the live demo). */
  phase: "idle" | "connecting" | "live";
  /** Surface the live demo runs on (only meaningful while phase ≠ idle). */
  surface: ShowcaseSurface;
  idlePaused: boolean;
  frameNonce: number;
  reducedMotion: boolean;
  frameHolderRef: RefObject<HTMLDivElement | null>;
  onActivate: (site: ShowcaseSiteId, surface: ShowcaseSurface) => void;
  onLoaded: (site: ShowcaseSiteId) => void;
  onRestart: (site: ShowcaseSiteId) => void;
  onStandby: () => void;
  onViewChange: (site: ShowcaseSiteId, focus: ShowcaseSurface) => void;
  onSelectScene: (index: number) => void;
  /**
   * The scenes this instance presents. Usually every site in the catalogue;
   * a single-site instance (the aesthetic-clinics page shows only its own
   * sector's build) passes one, which drops the project switcher and the
   * "01 / 02" counter rather than rendering a one-option control.
   */
  scenes: ShowcaseSite[];
};

function ShowcaseScene({
  site,
  index,
  deviceClass,
  phase,
  surface,
  idlePaused,
  frameNonce,
  reducedMotion,
  frameHolderRef,
  onActivate,
  onLoaded,
  onRestart,
  onStandby,
  onViewChange,
  onSelectScene,
  scenes,
}: SceneProps) {
  const sceneCount = scenes.length;
  const windowDeviceRef = useRef<HTMLDivElement>(null);
  const phoneDeviceRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  // The connect attempt (frame nonce) whose patience timer has elapsed; every
  // activation/restart bumps the nonce, so the hint derives per attempt
  // without an imperative reset.
  const [slowAttempt, setSlowAttempt] = useState(-1);
  const [railMoving, setRailMoving] = useState(false);
  /* The light front sweeps WITH the rail: forward project changes travel
     left→right, backward ones right→left. */
  const [railDirection, setRailDirection] = useState<"forward" | "backward">("forward");
  const previousProjectIndex = useRef(index);

  const windowPhase = surface === "window" ? phase : "idle";
  const phonePhase = surface === "phone" ? phase : "idle";
  const logicalWidth =
    EMBED_VIEWPORT_WIDTH[deviceClass === "tablet" ? "tablet" : "desktop"];

  useEffect(() => {
    if (phase !== "connecting") {
      return undefined;
    }
    const timer = window.setTimeout(() => setSlowAttempt(frameNonce), SLOW_CONNECT_MS);
    return () => window.clearTimeout(timer);
  }, [phase, frameNonce]);
  const slowConnect = phase === "connecting" && slowAttempt === frameNonce;

  useEffect(() => {
    const previous = previousProjectIndex.current;
    const changed = previous !== index;
    previousProjectIndex.current = index;
    if (!changed || reducedMotion) {
      setRailMoving(false);
      return undefined;
    }

    setRailDirection(index > previous ? "forward" : "backward");
    setRailMoving(true);
    const timer = window.setTimeout(
      () => setRailMoving(false),
      PROJECT_RAIL_DURATION_S * 1000 + 80,
    );
    return () => window.clearTimeout(timer);
  }, [index, reducedMotion]);

  const setFocusDevice = (next: "desktop" | "mobile") => {
    if (view !== next) {
      setView(next);
      onViewChange(site.id, next === "desktop" ? "window" : "phone");
    }
  };

  const composed = deviceClass !== "mobile";
  const windowFront = view === "desktop";
  const orbit = composed && !reducedMotion;

  // 0 = window in front, 1 = phone in front. One driver, both devices.
  const orbitProgress = useMotionValue(windowFront ? 0 : 1);
  const orbitOutPx = useRef(0);
  const phoneOrbit = usePhoneOrbit(orbitProgress, orbitOutPx);
  const windowOrbit = useWindowOrbit(orbitProgress);
  // Devices are untouchable mid-flight: a control sliding under the pointer is
  // never a control the visitor aimed at.
  const [orbiting, setOrbiting] = useState(false);
  /** False until the arc has a resting pose to depart FROM. */
  const posed = useRef(false);

  useEffect(() => {
    const target = windowFront ? 0 : 1;
    // Taking up the resting pose is a placement, not an animation — only a
    // genuine toggle travels. Entering/leaving orbit (reduced motion, or the
    // mobile breakpoint dropping the window) re-places rather than flying.
    if (!orbit || !posed.current) {
      posed.current = orbit;
      orbitProgress.set(target);
      setOrbiting(false);
      return undefined;
    }
    const windowEl = windowDeviceRef.current;
    const phoneEl = phoneDeviceRef.current;
    if (windowEl && phoneEl) {
      orbitOutPx.current = measureOrbitOutPx(windowEl, phoneEl);
    }
    setOrbiting(true);
    // Re-targeting from wherever the arc currently is: a mid-flight reversal
    // rejoins the same turntable instead of stacking a second animation.
    const controls = animate(orbitProgress, target, {
      ...ORBIT_TRANSITION,
      onComplete: () => setOrbiting(false),
    });
    return () => controls.stop();
  }, [orbit, windowFront, orbitProgress]);

  // Interpolating the tint variables per frame morphs every derived colour
  // (chips, dots, active pills, glows, beams) between the client palettes in
  // place — one interface transforming into the other, never a slide.
  const tintTarget = {
    "--demo-tint": site.tint,
    "--demo-tint-2": site.tintSecondary,
  } as unknown as TargetAndTransition;

  return (
    <m.article
      className="ss-folio-scene"
      data-demo={site.id}
      data-config-slot={site.configSlot}
      data-phase={phase}
      data-current
      data-view={view}
      initial={false}
      animate={tintTarget}
      transition={
        reducedMotion ? { duration: 0 } : { duration: 0.7, ease: "easeInOut" }
      }
      aria-label={
        sceneCount > 1
          ? `Project ${String(index + 1)} of ${String(sceneCount)}: ${site.name}`
          : `Live client website: ${site.name}`
      }
    >
      <div className="ss-folio-scene__inner">
        <span className="ss-folio-scene__ghost ss-folio-stack" aria-hidden="true">
          {scenes.map((entry, entryIndex) => (
            <span
              key={entry.id}
              className="ss-folio-morph"
              data-active={entry.id === site.id}
            >
              {String(entryIndex + 1).padStart(2, "0")}
            </span>
          ))}
        </span>

        <Reveal kind="section" className="ss-folio-scene__intro ss-folio-stack">
          {scenes.map((entry) => (
            <div
              key={entry.id}
              className="ss-folio-scene__intro-layer ss-folio-morph"
              data-active={entry.id === site.id}
              inert={entry.id !== site.id}
              aria-hidden={entry.id !== site.id}
            >
              <header>
                <p className="ss-folio-scene__eyebrow">
                  <span className="ss-folio-scene__dot" aria-hidden="true" />
                  <strong>{entry.name}</strong>
                  <span className="ss-folio-scene__sector">{entry.sector}</span>
                </p>
                <h3
                  className="ss-folio-scene__headline"
                  data-title-accent={entry.id}
                  style={
                    {
                      "--demo-title-tint": entry.tint,
                      "--demo-title-tint-2": entry.tintSecondary,
                    } as CSSProperties
                  }
                >
                  {entry.headline}
                </h3>
                <p className="ss-folio-scene__line">{entry.line}</p>
              </header>
              <ul className="ss-folio-scene__chips">
                {entry.chips.map((chip) => (
                  <li key={chip.label}>
                    <chip.icon aria-hidden="true" />
                    {chip.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        {/* Console row — between the copy and the demo on every breakpoint:
            project switcher, device focus toggle (composed stage only) and
            the safe external link to the live site. */}
        <Reveal kind="section" delayMs={80} className="ss-folio-console">
          {sceneCount > 1 ? (
            <div
              className="ss-folio-console__switch"
              role="group"
              aria-label="Choose showcased project"
            >
              {scenes.map((entry, entryIndex) => (
                <button
                  key={entry.id}
                  type="button"
                  className="ss-focus-ring"
                  data-scene-switch={entry.id}
                  aria-pressed={entry.id === site.id}
                  onClick={() => onSelectScene(entryIndex)}
                  style={
                    {
                      "--project-tint": entry.tint,
                      "--project-tint-2": entry.tintSecondary,
                    } as CSSProperties
                  }
                >
                  <span aria-hidden="true">
                    {String(entryIndex + 1).padStart(2, "0")}
                  </span>
                  {entry.name}
                </button>
              ))}
            </div>
          ) : null}
          <div
            className="ss-folio__toggle"
            role="group"
            aria-label={`${site.name} foreground device`}
          >
            <button
              type="button"
              className="ss-focus-ring"
              aria-pressed={view === "desktop"}
              onClick={() => setFocusDevice("desktop")}
            >
              <Monitor aria-hidden="true" />
              Desktop
            </button>
            <button
              type="button"
              className="ss-focus-ring"
              aria-pressed={view === "mobile"}
              onClick={() => setFocusDevice("mobile")}
            >
              <Smartphone aria-hidden="true" />
              Mobile
            </button>
          </div>
          <a
            className="ss-focus-ring ss-folio-scene__visit"
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open live site
            <ArrowUpRight aria-hidden="true" />
          </a>
          <p className="ss-folio-scene__meta">
            {sceneCount > 1 ? (
              <>
                <span className="ss-folio-stack">
                  {scenes.map((entry, entryIndex) => (
                    <span
                      key={entry.id}
                      className="ss-folio-morph"
                      data-active={entry.id === site.id}
                    >
                      {String(entryIndex + 1).padStart(2, "0")} /{" "}
                      {String(sceneCount).padStart(2, "0")}
                    </span>
                  ))}
                </span>
                <span aria-hidden="true">·</span>
              </>
            ) : null}
            <span>Live production build</span>
          </p>
        </Reveal>

        <div
          className="ss-folio-scene__stage"
          data-orbiting={orbiting || undefined}
          data-rail-moving={railMoving || undefined}
          data-rail-direction={railDirection}
        >
          <div className="ss-folio-device-viewport">
            <ProjectVisualRail
              index={index}
              reducedMotion={reducedMotion}
              className="ss-folio-device-rail"
            >
              {scenes.map((entry) => {
                const active = entry.id === site.id;
                return (
                  <div
                    key={entry.id}
                    className="ss-folio-device-slide"
                    data-active={active}
                    data-project={entry.id}
                    inert={!active}
                    aria-hidden={!active}
                    style={
                      {
                        "--demo-tint": entry.tint,
                        "--demo-tint-2": entry.tintSecondary,
                      } as CSSProperties
                    }
                  >
                    <m.div
                      ref={active ? windowDeviceRef : undefined}
                      className="ss-folio-device ss-folio-device--window"
                      data-plane={!composed || windowFront ? "front" : "back"}
                      inert={!active || (composed && !windowFront)}
                      initial={false}
                      {...(orbit ? { style: windowOrbit } : {})}
                    >
                      <Reveal
                        kind="card"
                        delayMs={90}
                        className="ss-folio-window-holder"
                      >
                        <DesktopDemoWindow
                          site={entry}
                          interactive={active}
                          phase={active ? windowPhase : "idle"}
                          idlePaused={active && idlePaused && surface === "window"}
                          frameNonce={frameNonce}
                          slowConnect={active && slowConnect && surface === "window"}
                          logicalWidth={logicalWidth}
                          frameHolderRef={frameHolderRef}
                          onActivate={onActivate}
                          onRestart={onRestart}
                          onStandby={onStandby}
                          onLoaded={onLoaded}
                        />
                      </Reveal>
                      <span
                        className="ss-folio-device__depth-shade"
                        aria-hidden="true"
                      />
                    </m.div>

                    <m.div
                      ref={active ? phoneDeviceRef : undefined}
                      className="ss-folio-device ss-folio-device--phone"
                      data-plane={!composed || !windowFront ? "front" : "back"}
                      inert={!active || (composed && windowFront)}
                      initial={false}
                      {...(orbit ? { style: phoneOrbit } : {})}
                      onKeyDown={(event: ReactKeyboardEvent) => {
                        if (active && event.key === "Escape" && phonePhase !== "idle") {
                          event.preventDefault();
                          event.stopPropagation();
                          onStandby();
                        }
                      }}
                    >
                      <Reveal kind="card" delayMs={150}>
                        <MobileDemoPhone
                          site={entry}
                          interactive={active}
                          deviceClass={deviceClass}
                          phase={active ? phonePhase : "idle"}
                          idlePaused={active && idlePaused && surface === "phone"}
                          frameNonce={frameNonce}
                          slowConnect={active && slowConnect && surface === "phone"}
                          frameHolderRef={frameHolderRef}
                          onActivate={onActivate}
                          onRestart={onRestart}
                          onStandby={onStandby}
                          onLoaded={onLoaded}
                        />
                      </Reveal>
                      <span
                        className="ss-folio-device__depth-shade"
                        aria-hidden="true"
                      />
                    </m.div>
                  </div>
                );
              })}
            </ProjectVisualRail>
          </div>
        </div>
      </div>
    </m.article>
  );
}

/* ---- Showcase ------------------------------------------------------------ */

/**
 * `only` restricts the showcase to a single client build. The
 * /services/web-design-development portfolio omits it and presents the whole
 * catalogue; an industry page passes its own sector's build so the section is
 * proof for that sector rather than a portfolio rail — no switcher, no
 * unrelated second project.
 */
export function BrowserShowcase({ only }: { only?: ShowcaseSiteId } = {}): ReactNode {
  const folioRef = useRef<HTMLDivElement>(null);
  const frameHolderRef = useRef<HTMLDivElement>(null);
  const deviceClass = useDeviceClass();
  const reducedMotion = useReducedMotion() ?? false;
  const [state, dispatch] = useReducer(showcaseReducer, initialShowcaseState);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Falls back to the full catalogue rather than rendering nothing if `only`
  // ever names a site that has been removed from showcase-sites.json.
  const scenes = useMemo(() => {
    if (!only) return sites;
    const picked = sites.filter((entry) => entry.id === only);
    return picked.length > 0 ? picked : sites;
  }, [only]);
  const sceneCount = scenes.length;

  const selectScene = useCallback(
    (index: number) => {
      const clamped = Math.min(sceneCount - 1, Math.max(0, index));
      const target = scenes[clamped];
      if (!target) {
        return;
      }
      setCurrentIndex(clamped);
      dispatch({ type: "scene-change", site: target.id });
    },
    [sceneCount, scenes],
  );

  useEffect(() => {
    dispatch({ type: "device-class", deviceClass });
  }, [deviceClass]);

  // A live embed times out after sustained inactivity, whichever device
  // surface it runs on; the frame holder ref always points at the screen
  // that holds the live frame.
  useShowcaseIdleTimeout({
    active: state.activeSite !== null,
    sectionRef: folioRef,
    frameHolderRef,
    onTimeout: useCallback(() => dispatch({ type: "idle-timeout" }), []),
  });

  // Any live demo stands down once the section is no longer meaningfully
  // visible; playback never resumes by itself on return.
  useShowcasePresence({
    active: state.activeSite !== null,
    sectionRef: folioRef,
    onExit: useCallback(() => dispatch({ type: "section-exit" }), []),
  });

  // Scoped to `scenes`, not the whole catalogue: an instance must never warm a
  // connection to an origin it does not present — and cannot frame, since each
  // route's CSP allow-lists only the origins that route mounts.
  const activate = useCallback(
    (site: ShowcaseSiteId, surface: ShowcaseSurface) => {
      const record = scenes.find((entry) => entry.id === site);
      if (record) {
        preconnect(record.origin);
      }
      dispatch({ type: "activate", site, surface });
    },
    [scenes],
  );

  const standby = useCallback(() => {
    const active = state.activeSite;
    const surface = state.surface;
    dispatch({ type: "standby" });
    if (active) {
      // Deterministic focus hand-back: the activation control replaces the
      // live frame in the next commit.
      window.requestAnimationFrame(() => {
        folioRef.current
          ?.querySelector<HTMLButtonElement>(
            surface === "phone"
              ? `[data-activate-phone="${active}"]`
              : `[data-activate="${active}"]`,
          )
          ?.focus({ preventScroll: true });
      });
    }
  }, [state.activeSite, state.surface]);

  const onSectionKeyDown = useCallback(
    (event: ReactKeyboardEvent) => {
      if (event.key === "Escape" && state.activeSite !== null) {
        // See the window-level handler: preventDefault is the consumed-Escape
        // signal for the route experience frame's document-level listener.
        event.preventDefault();
        event.stopPropagation();
        standby();
      }
    },
    [standby, state.activeSite],
  );

  const currentSite = scenes[currentIndex] ?? scenes[0];
  if (!currentSite) {
    return null;
  }

  return (
    <div
      ref={folioRef}
      className="ss-folio"
      data-device={deviceClass}
      onKeyDown={onSectionKeyDown}
    >
      <ShowcaseScene
        site={currentSite}
        index={currentIndex}
        deviceClass={deviceClass}
        phase={state.activeSite === currentSite.id ? state.phase : "idle"}
        surface={state.surface}
        idlePaused={state.idlePaused}
        frameNonce={state.frameNonce}
        reducedMotion={reducedMotion}
        frameHolderRef={frameHolderRef}
        onActivate={activate}
        onLoaded={(id) => dispatch({ type: "loaded", site: id })}
        onRestart={(id) => dispatch({ type: "restart", site: id })}
        onStandby={standby}
        onViewChange={(id, focus) => dispatch({ type: "view-change", site: id, focus })}
        onSelectScene={selectScene}
        scenes={scenes}
      />
    </div>
  );
}
