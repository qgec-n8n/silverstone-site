/**
 * Web Design & Development portfolio showcase — two live client websites,
 * presented one project at a time on a control-driven rail.
 *
 * Every breakpoint shares one scene grammar: the project copy sits ABOVE the
 * devices, a console row (project switcher · device focus toggle · live link)
 * sits between the copy and the stage, and the stage composes the two device
 * previews. On desktop and tablet the stage holds a dominant live browser
 * window and a phone; a two-state Desktop/Mobile control decides which device
 * owns the foreground, and switching it orbits the devices around one another
 * — they arc in opposite directions while their depth order crosses mid-
 * flight (reduced motion: an instant depth swap with a short opacity fade).
 * The background device is inert: it can never intercept input meant for the
 * foreground preview.
 *
 * The browser window is the interactive embed (activation click → live
 * iframe, exactly as before). The phone is the guided walkthrough: on
 * desktop/tablet, activating it never navigates away — it auto-scrolls the
 * real site page by page (see `showcase-walkthrough.ts`; the page list and
 * heights are generated from the demo sites' own sitemaps/navigation). On
 * mobile (<48rem) no iframe ever mounts and the phone is a plain link that
 * opens the live site in a new tab.
 *
 * One demo may be live at a time across both surfaces; a demo stands down on
 * Escape, on its standby control, after sustained inactivity (window embed),
 * when its tour completes (phone), when the project or device focus changes,
 * and whenever the section effectively leaves the viewport
 * (`showcase-presence.ts`) — returning never auto-resumes.
 *
 * The embed always receives a fixed logical viewport for its device class
 * (desktop 1440 / tablet 834 / walkthrough phone 390) scaled onto its frame
 * with a CSS transform, so the embedded site renders its intended breakpoint
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
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionStyle,
  type MotionValue,
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
  Play,
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
import {
  pageLabel,
  useShowcaseWalkthrough,
  walkthroughSite,
  WALKTHROUGH_VIEWPORT,
  type WalkthroughSite,
} from "./showcase-walkthrough";
import showcaseSitesJson from "./showcase-sites.json";
import {
  EMBED_VIEWPORT_WIDTH,
  initialShowcaseState,
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
 * the same source the walkthrough generator script reads. */
function siteConfig(id: ShowcaseSiteId): ShowcaseSiteConfig {
  const config = showcaseSitesJson.sites.find((entry) => entry.id === id);
  if (!config) {
    throw new Error(`showcase-sites.json is missing the "${id}" demo site`);
  }
  return { ...config, id };
}

const sites: ShowcaseSite[] = [
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
    tint: "#d0685a",
    tintSecondary: "#c9a25e",
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
    tint: "#9db284",
    tintSecondary: "#d8a08b",
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
];

const SCENE_COUNT = sites.length;

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
 * Measures the visible screen box and derives the transform that maps the
 * fixed logical embed viewport onto it. Pointer coordinates, focus and touch
 * all pass through a CSS scale correctly, and the embed stays sharp because
 * the browser rasterises it at device resolution.
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
      const rect = screen.getBoundingClientRect();
      setBox((current) =>
        current !== null &&
        current.width === rect.width &&
        current.height === rect.height
          ? current
          : { width: rect.width, height: rect.height },
      );
    });
    observer.observe(screen);
    return () => observer.disconnect();
  }, [enabled, screenRef]);

  if (!enabled || !box || box.width <= 0) {
    return null;
  }
  const scale = box.width / logicalWidth;
  return {
    width: `${String(logicalWidth)}px`,
    height: `${String(box.height / scale)}px`,
    transform: `scale(${String(scale)})`,
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

/* ---- Device orbit ------------------------------------------------------- */

/**
 * Foreground/background poses for the two devices. `null` first keyframes
 * start each arc from the device's current position, so rapid toggles reverse
 * smoothly instead of teleporting; the devices sweep in opposite lateral
 * directions while `zIndex` tweens across the crossover, which is what makes
 * them read as orbiting around one another. Reduced motion never uses these —
 * the stylesheet's static `[data-plane]` poses apply instead, with an
 * opacity-only fade.
 */
const ORBIT_TRANSITION = {
  duration: 0.85,
  ease: [0.3, 0.75, 0.3, 1] as [number, number, number, number],
  opacity: { duration: 0.5 },
};

const windowPoses = {
  front: {
    x: [null, "1.5%", "0%"],
    y: [null, "0.8%", "0%"],
    scale: [null, 0.975, 1],
    rotateY: [null, -3, 0],
    opacity: 1,
    zIndex: 3,
  },
  back: {
    x: [null, "-0.6%", "-2%"],
    y: [null, "-1.2%", "-2.5%"],
    scale: [null, 0.96, 0.92],
    rotateY: [null, 5, 8],
    opacity: 0.48,
    zIndex: 1,
  },
};

const phonePoses = {
  front: {
    x: [null, "-52%", "-105%"],
    y: [null, "4%", "0%"],
    scale: [null, 1.08, 1.22],
    rotateY: [null, -8, 0],
    opacity: 1,
    zIndex: 3,
  },
  back: {
    x: [null, "-48%", "0%"],
    y: [null, "4.5%", "0%"],
    scale: [null, 1.05, 1],
    rotateY: [null, -8, -12],
    opacity: 0.92,
    zIndex: 1,
  },
};

/* ---- Walkthrough phone --------------------------------------------------- */

type WalkthroughPhoneProps = {
  site: ShowcaseSite;
  tour: WalkthroughSite | null;
  deviceClass: ShowcaseDeviceClass;
  /** connecting/live while THIS site's phone surface owns the demo. */
  phase: "idle" | "connecting" | "live";
  frameNonce: number;
  reducedMotion: boolean;
  onStartTour: (site: ShowcaseSiteId) => void;
  onStopTour: () => void;
  onEnded: () => void;
  onLoaded: (site: ShowcaseSiteId) => void;
};

function WalkthroughPhone({
  site,
  tour,
  deviceClass,
  phase,
  frameNonce,
  reducedMotion,
  onStartTour,
  onStopTour,
  onEnded,
  onLoaded,
}: WalkthroughPhoneProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const touring = phase !== "idle";
  const y = useMotionValue(0);

  const { pageIndex, stage, currentPage, onFrameLoad } = useShowcaseWalkthrough({
    active: touring,
    site: tour,
    reducedMotion,
    y,
    onEnded,
  });

  const scalerStyle = useEmbedScale(screenRef, touring, WALKTHROUGH_VIEWPORT.width);
  const travel = currentPage
    ? Math.max(0, currentPage.height - WALKTHROUGH_VIEWPORT.height)
    : 0;
  const progress: MotionValue<number> = useTransform(y, (value) =>
    travel > 0 ? Math.min(1, -value / travel) : 0,
  );

  const poster = (
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
  );

  // Mobile (<48rem): the phone is a plain safe external link — tapping a demo
  // opens the configured live site in a new tab; no walkthrough, no iframe.
  if (deviceClass === "mobile") {
    return (
      <a
        className="ss-focus-ring ss-folio-phone"
        href={site.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open the ${site.name} website in a new tab`}
      >
        <span className="ss-folio-phone__island" aria-hidden="true" />
        {poster}
        <span className="ss-folio-phone__tag" aria-hidden="true">
          Tap to open live site
          <ArrowUpRight aria-hidden="true" />
        </span>
      </a>
    );
  }

  return (
    <div className="ss-folio-phone" data-tour-phase={phase} tabIndex={-1}>
      <span className="ss-folio-phone__island" aria-hidden="true" />
      <div ref={screenRef} className="ss-folio-phone__screen">
        {poster}

        {touring && scalerStyle && currentPage ? (
          <div className="ss-folio-phone__scaler" style={scalerStyle} aria-hidden="true">
            <m.div className="ss-folio-phone__scroller" style={{ y }}>
              <iframe
                key={`${String(frameNonce)}:${String(pageIndex)}`}
                className="ss-folio-phone__frame"
                style={{
                  width: `${String(WALKTHROUGH_VIEWPORT.width)}px`,
                  height: `${String(currentPage.height)}px`,
                }}
                src={new URL(currentPage.path, tour?.origin ?? site.origin).href}
                title={`${site.name} — guided mobile tour`}
                tabIndex={-1}
                onLoad={() => {
                  onLoaded(site.id);
                  onFrameLoad();
                }}
              />
            </m.div>
          </div>
        ) : null}

        {touring && stage === "loading" ? (
          <span className="ss-folio-phone__veil" role="status">
            <span className="ss-folio-phone__veil-ring" aria-hidden="true" />
            {currentPage ? `Opening ${pageLabel(currentPage)}` : "Connecting"}
          </span>
        ) : null}

        {touring ? (
          <button
            type="button"
            className="ss-folio-phone__stop"
            data-tour-stop={site.id}
            onClick={onStopTour}
            aria-label={`Stop the ${site.name} guided tour`}
          />
        ) : (
          <button
            type="button"
            className="ss-folio-phone__play"
            data-tour={site.id}
            onClick={() => onStartTour(site.id)}
            aria-label={`Play the ${site.name} guided mobile tour`}
          >
            <span className="ss-folio-phone__play-ring" aria-hidden="true">
              <Play />
            </span>
            <span className="ss-folio-phone__play-label">Play site tour</span>
          </button>
        )}
      </div>

      {touring ? (
        <div className="ss-folio-phone__hud" aria-hidden="true">
          <span className="ss-folio-phone__hud-page">
            {String(pageIndex + 1).padStart(2, "0")}
            <i> / {String(tour?.pages.length ?? 0).padStart(2, "0")}</i>
          </span>
          <span className="ss-folio-phone__hud-label">
            {currentPage ? pageLabel(currentPage) : ""}
          </span>
          <span className="ss-folio-phone__hud-track">
            <m.span style={{ scaleX: progress }} />
          </span>
        </div>
      ) : (
        <span className="ss-folio-phone__tag" aria-hidden="true">
          Mobile · guided tour
        </span>
      )}
    </div>
  );
}

/* ---- Scene ------------------------------------------------------------- */

/** Delay before the connecting veil offers the direct link out. */
const SLOW_CONNECT_MS = 10_000;

type SceneProps = {
  site: ShowcaseSite;
  index: number;
  current: boolean;
  deviceClass: ShowcaseDeviceClass;
  /** Phase of THIS site (idle unless it owns the live demo). */
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
};

function ShowcaseScene({
  site,
  index,
  current,
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
}: SceneProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  // The connect attempt (frame nonce) whose patience timer has elapsed; every
  // activation/restart bumps the nonce, so the hint derives per attempt
  // without an imperative reset.
  const [slowAttempt, setSlowAttempt] = useState(-1);

  const windowPhase = surface === "window" ? phase : "idle";
  const phonePhase = surface === "phone" ? phase : "idle";
  const mountFrame = windowPhase !== "idle" && deviceClass !== "mobile";
  const logicalWidth =
    EMBED_VIEWPORT_WIDTH[deviceClass === "tablet" ? "tablet" : "desktop"];
  const frameStyle = useEmbedScale(screenRef, mountFrame, logicalWidth);

  useEffect(() => {
    if (windowPhase !== "connecting") {
      return undefined;
    }
    const timer = window.setTimeout(() => setSlowAttempt(frameNonce), SLOW_CONNECT_MS);
    return () => window.clearTimeout(timer);
  }, [windowPhase, frameNonce]);
  const slowConnect = windowPhase === "connecting" && slowAttempt === frameNonce;

  const status =
    windowPhase === "live"
      ? "Live"
      : windowPhase === "connecting"
        ? "Connecting"
        : "Standby";

  const tintStyle = {
    "--demo-tint": site.tint,
    "--demo-tint-2": site.tintSecondary,
  } as MotionStyle;

  const handleLoad = () => {
    const firstLoad = windowPhase === "connecting";
    onLoaded(site.id);
    // Hand focus to the embed once, on the connecting → live transition (the
    // visitor just asked for it); onLoad also refires on every in-embed
    // navigation, which must not re-steal focus.
    if (firstLoad) {
      frameRef.current?.focus({ preventScroll: true });
    }
  };

  const setFocusDevice = (next: "desktop" | "mobile") => {
    if (view !== next) {
      setView(next);
      onViewChange(site.id, next === "desktop" ? "window" : "phone");
    }
  };

  const startTour = (id: ShowcaseSiteId) => {
    // The tour lives on the phone: bring it to the foreground in the same
    // action so the walkthrough is never playing behind the window.
    setView("mobile");
    onActivate(id, "phone");
    window.requestAnimationFrame(() => {
      screenRef.current
        ?.closest(".ss-folio-scene")
        ?.querySelector<HTMLButtonElement>(`[data-tour-stop="${id}"]`)
        ?.focus({ preventScroll: true });
    });
  };

  const composed = deviceClass !== "mobile";
  const windowFront = view === "desktop";
  const orbit = composed && !reducedMotion;

  return (
    <m.article
      className="ss-folio-scene"
      data-demo={site.id}
      data-config-slot={site.configSlot}
      data-phase={phase}
      data-current={current || undefined}
      data-view={view}
      style={tintStyle}
      inert={!current}
      aria-label={`Project ${String(index + 1)} of ${String(SCENE_COUNT)}: ${site.name}`}
    >
      <div className="ss-folio-scene__inner">
        <span className="ss-folio-scene__ghost" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>

        <Reveal kind="section" className="ss-folio-scene__intro">
          <header>
            <p className="ss-folio-scene__eyebrow">
              <span className="ss-folio-scene__dot" aria-hidden="true" />
              <strong>{site.name}</strong>
              <span className="ss-folio-scene__sector">{site.sector}</span>
            </p>
            <h3 className="ss-folio-scene__headline">{site.headline}</h3>
            <p className="ss-folio-scene__line">{site.line}</p>
          </header>
          <ul className="ss-folio-scene__chips">
            {site.chips.map((chip) => (
              <li key={chip.label}>
                <chip.icon aria-hidden="true" />
                {chip.label}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Console row — between the copy and the demo on every breakpoint:
            project switcher, device focus toggle (composed stage only) and
            the safe external link to the live site. */}
        <Reveal kind="section" delayMs={80} className="ss-folio-console">
          <div
            className="ss-folio-console__switch"
            role="group"
            aria-label="Choose showcased project"
          >
            {sites.map((entry, entryIndex) => (
              <button
                key={entry.id}
                type="button"
                className="ss-focus-ring"
                data-scene-switch={entry.id}
                aria-pressed={entry.id === site.id}
                onClick={() => onSelectScene(entryIndex)}
              >
                <span aria-hidden="true">
                  {String(entryIndex + 1).padStart(2, "0")}
                </span>
                {entry.name}
              </button>
            ))}
          </div>
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
            rel="noreferrer"
          >
            Open live site
            <ArrowUpRight aria-hidden="true" />
          </a>
          <p className="ss-folio-scene__meta">
            <span>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(SCENE_COUNT).padStart(2, "0")}
            </span>
            <span aria-hidden="true">·</span>
            <span>Live production build</span>
          </p>
        </Reveal>

        <div className="ss-folio-scene__stage">
          <m.div
            className="ss-folio-device ss-folio-device--window"
            data-plane={!composed || windowFront ? "front" : "back"}
            inert={composed && !windowFront}
            initial={false}
            {...(orbit
              ? {
                  animate: windowFront ? windowPoses.front : windowPoses.back,
                  transition: ORBIT_TRANSITION,
                }
              : {})}
          >
            <Reveal kind="card" delayMs={90} className="ss-folio-window-holder">
              <div
                className="ss-folio-window ss-srv2-beam-border"
                // Click-focusable (not tabbable) so a click anywhere on the
                // window chrome parks focus here — otherwise focus falls to
                // <body> and Escape reaches only the route frame's document
                // listener (page close-to-intro) instead of demo standby.
                tabIndex={-1}
                onPointerEnter={() => preconnect(site.origin)}
                onKeyDown={(event: ReactKeyboardEvent) => {
                  if (event.key === "Escape" && phase !== "idle") {
                    // preventDefault marks the Escape as consumed for the route
                    // experience frame's document-level close-to-intro listener
                    // (same event target as React's root, so stopPropagation
                    // alone cannot suppress it).
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
                    data-status={windowPhase}
                    role="status"
                  >
                    <i aria-hidden="true" />
                    {status}
                  </span>
                  {windowPhase !== "idle" ? (
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
                    rel="noreferrer"
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

                  {mountFrame && frameStyle ? (
                    <iframe
                      ref={frameRef}
                      key={frameNonce}
                      className="ss-folio-window__frame"
                      style={frameStyle}
                      src={site.url}
                      title={`${site.name} — live website`}
                      allow={site.allowPayment ? "payment" : undefined}
                      data-live={windowPhase === "live" || undefined}
                      onLoad={handleLoad}
                    />
                  ) : null}

                  {windowPhase === "idle" ? (
                    <button
                      type="button"
                      className="ss-folio-window__activate"
                      data-activate={site.id}
                      onClick={() => onActivate(site.id, "window")}
                    >
                      <span
                        className="ss-folio-window__activate-ring"
                        aria-hidden="true"
                      >
                        <Power />
                      </span>
                      <span className="ss-folio-window__activate-label">
                        Activate live demo
                      </span>
                      <span className="ss-folio-window__activate-sub">
                        {idlePaused && current
                          ? "Paused after inactivity — pick up where you left off"
                          : "Browse the real website right here"}
                      </span>
                    </button>
                  ) : null}

                  {windowPhase === "connecting" ? (
                    <span className="ss-folio-window__connecting" role="status">
                      <span
                        className="ss-folio-window__connecting-ring"
                        aria-hidden="true"
                      />
                      Connecting to {site.domain}
                      {slowConnect ? (
                        <a
                          className="ss-focus-ring ss-folio-window__connecting-out"
                          href={site.url}
                          target="_blank"
                          rel="noreferrer"
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
            </Reveal>
          </m.div>

          <m.div
            className="ss-folio-device ss-folio-device--phone"
            data-plane={!composed || !windowFront ? "front" : "back"}
            inert={composed && windowFront}
            initial={false}
            {...(orbit
              ? {
                  animate: windowFront ? phonePoses.back : phonePoses.front,
                  transition: ORBIT_TRANSITION,
                }
              : {})}
            onKeyDown={(event: ReactKeyboardEvent) => {
              if (event.key === "Escape" && phonePhase !== "idle") {
                event.preventDefault();
                event.stopPropagation();
                onStandby();
              }
            }}
          >
            <Reveal kind="card" delayMs={150}>
              <WalkthroughPhone
                site={site}
                tour={walkthroughSite(site.id)}
                deviceClass={deviceClass}
                phase={phonePhase}
                frameNonce={frameNonce}
                reducedMotion={reducedMotion}
                onStartTour={startTour}
                onStopTour={onStandby}
                onEnded={onStandby}
                onLoaded={onLoaded}
              />
            </Reveal>
          </m.div>
        </div>
      </div>
    </m.article>
  );
}

/* ---- Showcase ------------------------------------------------------------ */

export function BrowserShowcase(): ReactNode {
  const folioRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const frameHolderRef = useRef<HTMLDivElement>(null);
  const deviceClass = useDeviceClass();
  const reducedMotion = useReducedMotion() ?? false;
  const [state, dispatch] = useReducer(showcaseReducer, initialShowcaseState);
  const [currentIndex, setCurrentIndex] = useState(0);

  const selectScene = useCallback(
    (index: number) => {
      const clamped = Math.min(SCENE_COUNT - 1, Math.max(0, index));
      const target = sites[clamped];
      if (!target) {
        return;
      }
      // Switching scenes makes the outgoing scene inert, which would silently
      // drop keyboard focus to <body>; carry it to the same control in the
      // incoming scene instead.
      const hadFocus = railRef.current?.contains(document.activeElement) ?? false;
      setCurrentIndex(clamped);
      dispatch({ type: "scene-change", site: target.id });
      if (hadFocus) {
        window.requestAnimationFrame(() => {
          folioRef.current
            ?.querySelector<HTMLButtonElement>(
              `.ss-folio-scene[data-demo="${target.id}"] [data-scene-switch="${target.id}"]`,
            )
            ?.focus({ preventScroll: true });
        });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch({ type: "device-class", deviceClass });
  }, [deviceClass]);

  // The window embed times out after sustained inactivity; the phone
  // walkthrough is excluded — it always terminates itself.
  useShowcaseIdleTimeout({
    active: state.activeSite !== null && state.surface === "window",
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

  const activate = useCallback((site: ShowcaseSiteId, surface: ShowcaseSurface) => {
    const record = sites.find((entry) => entry.id === site);
    if (record) {
      preconnect(record.origin);
    }
    dispatch({ type: "activate", site, surface });
  }, []);

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
              ? `[data-tour="${active}"]`
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

  return (
    <div
      ref={folioRef}
      className="ss-folio"
      data-device={deviceClass}
      onKeyDown={onSectionKeyDown}
    >
      <div className="ss-folio__stage">
        <m.div
          ref={railRef}
          className="ss-folio__rail"
          initial={false}
          animate={{ x: `${String(-currentIndex * 100)}%` }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {sites.map((site, index) => (
            <ShowcaseScene
              key={site.id}
              site={site}
              index={index}
              current={index === currentIndex}
              deviceClass={deviceClass}
              phase={state.activeSite === site.id ? state.phase : "idle"}
              surface={state.surface}
              idlePaused={state.idlePaused}
              frameNonce={state.frameNonce}
              reducedMotion={reducedMotion}
              frameHolderRef={frameHolderRef}
              onActivate={activate}
              onLoaded={(id) => dispatch({ type: "loaded", site: id })}
              onRestart={(id) => dispatch({ type: "restart", site: id })}
              onStandby={standby}
              onViewChange={(id, focus) =>
                dispatch({ type: "view-change", site: id, focus })
              }
              onSelectScene={selectScene}
            />
          ))}
        </m.div>
      </div>
    </div>
  );
}
