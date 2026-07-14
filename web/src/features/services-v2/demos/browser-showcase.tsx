/**
 * Web Design & Development portfolio journey — two live client websites
 * presented as one horizontal showcase rail.
 *
 * Desktop (≥64rem, hover-capable fine pointer): the section pins for a short
 * scroll run and normal vertical scrolling drives the rail horizontally
 * between the two projects — a scroll-linked sticky track, never wheel
 * interception, so the page releases naturally at both boundaries, reverses
 * cleanly, and can never trap scrolling. Each scene composes a dominant live
 * browser window with an art-directed phone capture. Explicit prev/next and
 * per-project controls mirror the scroll journey.
 *
 * Tablet (≥48rem otherwise): the same scenes become a native scroll-snap
 * rail — swipe, arrows or project pips, no wheel mapping — with a
 * Desktop/Mobile focus toggle per project. Mobile (<48rem): phone-first snap
 * cards; no iframe ever mounts there.
 *
 * The production site loads in an iframe only after an explicit activation
 * click — nothing is requested from the demo origins on initial page load;
 * idle windows show locally hosted posters. The embed always receives a
 * fixed logical viewport for the host's device class (1440 on desktop, 834
 * on tablet — see `showcase-state.ts`), scaled with a CSS transform to fit
 * its frame, so the embedded site renders its intended breakpoint with no
 * internal horizontal scrolling regardless of host width. After activation
 * the frame is directly interactive: the first click on any link or field
 * reaches it — there is no interception shield. Only one demo can be live at
 * a time, and a live demo returns to standby after sustained inactivity
 * (`SHOWCASE_IDLE_TIMEOUT_MS`), on Escape, on the standby control, or when
 * the journey moves to the other project.
 *
 * Posters were captured from the live sites with Playwright (desktop
 * 1440×900 @2x, mobile 390×844 @2x, consent banner pre-dismissed) and
 * optimised to responsive WebP under `public/demos/web-design/`.
 *
 * The route-scoped CSP `frame-src` allow-list (root netlify.toml) holds the
 * two demo origins used here plus the Calendly origin used by the site-wide
 * scheduler warm-up. The Aesthetics by Clouds frame carries
 * `allow="payment"` for its booking deposit flow, and neither frame is
 * sandboxed, so navigation, forms and the nested booking portal behave
 * exactly as they do on the live site. Both demo sites serve
 * `frame-ancestors 'self' https://silverstone-ai.com
 * https://www.silverstone-ai.com`, so the live windows only activate on the
 * production domain; everywhere else the posters and open-in-new-tab links
 * still work.
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
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import * as m from "motion/react-m";

import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
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
import {
  EMBED_VIEWPORT_WIDTH,
  initialShowcaseState,
  showcaseReducer,
  type ShowcaseDeviceClass,
  type ShowcaseSiteId,
} from "./showcase-state";

type PosterSource = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
};

type ShowcaseSite = {
  id: ShowcaseSiteId;
  /** Approved manifest slot this window activates. */
  configSlot: string;
  name: string;
  sector: string;
  /** Distinctive scene headline (h3 under the section heading). */
  headline: string;
  /** One concise supporting sentence. */
  line: string;
  /** Verifiable capability chips shown in the scene intro. */
  chips: { icon: LucideIcon; label: string }[];
  url: string;
  origin: string;
  domain: string;
  /** Delegates the Payment Request API to the embedded site (booking deposits). */
  allowPayment?: boolean;
  /** Client-brand light: LIVE dot, beam ring and glows inside this scene only. */
  tint: string;
  tintSecondary: string;
  desktopPoster: PosterSource;
  mobilePoster: PosterSource;
};

const sites: ShowcaseSite[] = [
  {
    id: "ownly-housing",
    configSlot: "futureWebsitePreviewPrimaryUrl",
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
    url: "https://ownly-housing.netlify.app/",
    origin: "https://ownly-housing.netlify.app",
    domain: "ownly-housing.netlify.app",
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
    id: "aesthetics-by-clouds",
    configSlot: "futureWebsitePreviewSecondaryUrl",
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
    url: "https://aestheticsbyclouds.netlify.app/",
    origin: "https://aestheticsbyclouds.netlify.app",
    domain: "aestheticsbyclouds.netlify.app",
    allowPayment: true,
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

/**
 * Fraction of the pinned run held at each end before/after the horizontal
 * travel: a settle-in dwell on the first project and a release dwell on the
 * last, so the rail never moves the instant the section pins or unpins.
 */
const JOURNEY_DWELL = 0.18;

/** Progress point (0–1 across the pinned run) at which scene `i` is centred. */
function sceneProgress(index: number): number {
  return JOURNEY_DWELL + (index / (SCENE_COUNT - 1)) * (1 - 2 * JOURNEY_DWELL);
}

function progressToIndex(progress: number): number {
  const travel = (progress - JOURNEY_DWELL) / (1 - 2 * JOURNEY_DWELL);
  return Math.min(SCENE_COUNT - 1, Math.max(0, Math.round(travel * (SCENE_COUNT - 1))));
}

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

/* ---- Scene ------------------------------------------------------------- */

/** Delay before the connecting veil offers the direct link out. */
const SLOW_CONNECT_MS = 10_000;

type SceneProps = {
  site: ShowcaseSite;
  index: number;
  current: boolean;
  deviceClass: ShowcaseDeviceClass;
  /** Phase of THIS site (idle unless it owns the live embed). */
  phase: "idle" | "connecting" | "live";
  idlePaused: boolean;
  frameNonce: number;
  journeyProgress: MotionValue<number>;
  reducedMotion: boolean;
  frameHolderRef: RefObject<HTMLDivElement | null>;
  onActivate: (site: ShowcaseSiteId) => void;
  onLoaded: (site: ShowcaseSiteId) => void;
  onRestart: (site: ShowcaseSiteId) => void;
  onStandby: () => void;
  onFocusScene: (index: number) => void;
};

function ShowcaseScene({
  site,
  index,
  current,
  deviceClass,
  phase,
  idlePaused,
  frameNonce,
  journeyProgress,
  reducedMotion,
  frameHolderRef,
  onActivate,
  onLoaded,
  onRestart,
  onStandby,
  onFocusScene,
}: SceneProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  // The connect attempt (frame nonce) whose patience timer has elapsed; every
  // activation/restart bumps the nonce, so the hint derives per attempt
  // without an imperative reset.
  const [slowAttempt, setSlowAttempt] = useState(-1);

  const mountFrame = phase !== "idle" && deviceClass !== "mobile";
  const logicalWidth =
    EMBED_VIEWPORT_WIDTH[deviceClass === "tablet" ? "tablet" : "desktop"];
  const frameStyle = useEmbedScale(screenRef, mountFrame, logicalWidth);

  useEffect(() => {
    if (phase !== "connecting") {
      return undefined;
    }
    const timer = window.setTimeout(() => setSlowAttempt(frameNonce), SLOW_CONNECT_MS);
    return () => window.clearTimeout(timer);
  }, [phase, frameNonce]);
  const slowConnect = phase === "connecting" && slowAttempt === frameNonce;

  // Cinematic settle: the scene entering focus rises to full presence while
  // its neighbour recedes slightly. Purely scroll-linked (1:1, reversible);
  // disabled entirely for reduced motion and non-journey layouts.
  const centre = sceneProgress(index);
  const presence = useTransform(
    journeyProgress,
    [centre - 0.5, centre, centre + 0.5],
    [0.42, 1, 0.42],
  );
  const sceneOpacity = useTransform(presence, [0.42, 1], [0.55, 1]);
  const sceneScale = useTransform(presence, [0.42, 1], [0.965, 1]);
  const phoneDrift = useTransform(journeyProgress, [0, 1], [14, -14]);
  const journeyMotion = deviceClass === "desktop" && !reducedMotion;

  const status =
    phase === "live" ? "Live" : phase === "connecting" ? "Connecting" : "Standby";

  const tintStyle = {
    "--demo-tint": site.tint,
    "--demo-tint-2": site.tintSecondary,
  } as MotionStyle;

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

  return (
    <m.article
      className="ss-folio-scene"
      data-demo={site.id}
      data-config-slot={site.configSlot}
      data-phase={phase}
      data-current={current || undefined}
      data-view={view}
      style={
        journeyMotion
          ? { ...tintStyle, opacity: sceneOpacity, scale: sceneScale }
          : tintStyle
      }
      aria-label={`Project ${String(index + 1)} of ${String(SCENE_COUNT)}: ${site.name}`}
      onFocusCapture={() => {
        if (!current) {
          onFocusScene(index);
        }
      }}
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
          <p className="ss-folio-scene__meta">
            <span>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(SCENE_COUNT).padStart(2, "0")}
            </span>
            <span aria-hidden="true">·</span>
            <span>Live production build</span>
            <span aria-hidden="true">·</span>
            <span>Netlify edge</span>
          </p>
          <div className="ss-folio-scene__actions">
            <div
              className="ss-folio__toggle"
              role="group"
              aria-label={`${site.name} preview device`}
            >
              <button
                type="button"
                className="ss-focus-ring"
                aria-pressed={view === "desktop"}
                onClick={() => setView("desktop")}
              >
                <Monitor aria-hidden="true" />
                Desktop
              </button>
              <button
                type="button"
                className="ss-focus-ring"
                aria-pressed={view === "mobile"}
                onClick={() => setView("mobile")}
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
          </div>
        </Reveal>

        <div className="ss-folio-scene__stage">
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
                  data-status={phase}
                  role="status"
                >
                  <i aria-hidden="true" />
                  {status}
                </span>
                {phase !== "idle" ? (
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
                  sizes="(min-width: 64rem) 58vw, 94vw"
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
                    data-live={phase === "live" || undefined}
                    onLoad={handleLoad}
                  />
                ) : null}

                {phase === "idle" ? (
                  <button
                    type="button"
                    className="ss-folio-window__activate"
                    data-activate={site.id}
                    onClick={() => onActivate(site.id)}
                  >
                    <span className="ss-folio-window__activate-ring" aria-hidden="true">
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

                {phase === "connecting" ? (
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

          <m.a
            className="ss-focus-ring ss-folio-phone"
            {...(journeyMotion ? { style: { y: phoneDrift } } : {})}
            href={site.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open the ${site.name} website in a new tab`}
          >
            <span className="ss-folio-phone__island" aria-hidden="true" />
            <img
              className="ss-folio-phone__shot"
              src={site.mobilePoster.src}
              srcSet={site.mobilePoster.srcSet}
              sizes="(min-width: 64rem) 12.5rem, (min-width: 48rem) 15rem, 66vw"
              width={site.mobilePoster.width}
              height={site.mobilePoster.height}
              alt={site.mobilePoster.alt}
              loading="lazy"
              decoding="async"
            />
            <span className="ss-folio-phone__tag" aria-hidden="true">
              Mobile capture
            </span>
          </m.a>
        </div>
      </div>
    </m.article>
  );
}

/* ---- Rail ---------------------------------------------------------------- */

export function BrowserShowcase(): ReactNode {
  const folioRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const frameHolderRef = useRef<HTMLDivElement>(null);
  const deviceClass = useDeviceClass();
  const reducedMotion = useReducedMotion() ?? false;
  const [state, dispatch] = useReducer(showcaseReducer, initialShowcaseState);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: folioRef,
    offset: ["start start", "end end"],
  });
  const railX = useTransform(scrollYProgress, (progress) => {
    const travel = Math.min(
      1,
      Math.max(0, (progress - JOURNEY_DWELL) / (1 - 2 * JOURNEY_DWELL)),
    );
    return `${String(-travel * (SCENE_COUNT - 1) * 100)}%`;
  });

  const setIndex = useCallback(
    (index: number) => {
      if (currentIndexRef.current === index) {
        return;
      }
      currentIndexRef.current = index;
      setCurrentIndex(index);
      const site = sites[index];
      if (site) {
        dispatch({ type: "scene-change", site: site.id });
      }
    },
    [dispatch],
  );

  // Journey position → current scene (desktop only; the snap rail reports
  // through its own scroll handler below).
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (deviceClass === "desktop") {
      setIndex(progressToIndex(progress));
    }
  });

  const onRailScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail || deviceClass === "desktop" || rail.clientWidth === 0) {
      return;
    }
    setIndex(
      Math.min(
        SCENE_COUNT - 1,
        Math.max(0, Math.round(rail.scrollLeft / rail.clientWidth)),
      ),
    );
  }, [deviceClass, setIndex]);

  useEffect(() => {
    dispatch({ type: "device-class", deviceClass });
  }, [deviceClass]);

  useShowcaseIdleTimeout({
    active: state.activeSite !== null,
    sectionRef: folioRef,
    frameHolderRef,
    onTimeout: useCallback(() => dispatch({ type: "idle-timeout" }), []),
  });

  const goToScene = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const clamped = Math.min(SCENE_COUNT - 1, Math.max(0, index));
      const resolved: ScrollBehavior = behavior ?? (reducedMotion ? "auto" : "smooth");
      if (deviceClass === "desktop") {
        const track = folioRef.current;
        if (!track) {
          return;
        }
        const trackTop = window.scrollY + track.getBoundingClientRect().top;
        const run = track.offsetHeight - window.innerHeight;
        window.scrollTo({
          top: trackTop + sceneProgress(clamped) * Math.max(0, run),
          behavior: resolved,
        });
        return;
      }
      const rail = railRef.current;
      rail?.scrollTo({ left: clamped * rail.clientWidth, behavior: resolved });
    },
    [deviceClass, reducedMotion],
  );

  const activate = useCallback((site: ShowcaseSiteId) => {
    const record = sites.find((entry) => entry.id === site);
    if (record) {
      preconnect(record.origin);
    }
    dispatch({ type: "activate", site });
  }, []);

  const standby = useCallback(() => {
    const active = state.activeSite;
    dispatch({ type: "standby" });
    if (active) {
      // Deterministic focus hand-back: the activation control replaces the
      // frame in the next commit.
      window.requestAnimationFrame(() => {
        folioRef.current
          ?.querySelector<HTMLButtonElement>(`[data-activate="${active}"]`)
          ?.focus({ preventScroll: true });
      });
    }
  }, [state.activeSite]);

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
          key={deviceClass === "desktop" ? "journey" : "snap"}
          ref={railRef}
          className="ss-folio__rail"
          {...(deviceClass === "desktop" ? { style: { x: railX } } : {})}
          onScroll={onRailScroll}
        >
          {sites.map((site, index) => (
            <ShowcaseScene
              key={site.id}
              site={site}
              index={index}
              current={index === currentIndex}
              deviceClass={deviceClass}
              phase={state.activeSite === site.id ? state.phase : "idle"}
              idlePaused={state.idlePaused}
              frameNonce={state.frameNonce}
              journeyProgress={scrollYProgress}
              reducedMotion={reducedMotion}
              frameHolderRef={frameHolderRef}
              onActivate={activate}
              onLoaded={(id) => dispatch({ type: "loaded", site: id })}
              onRestart={(id) => dispatch({ type: "restart", site: id })}
              onStandby={standby}
              onFocusScene={(target) => goToScene(target, "auto")}
            />
          ))}
        </m.div>

        <nav className="ss-folio__nav" aria-label="Showcased projects">
          <button
            type="button"
            className="ss-focus-ring ss-folio__arrow"
            onClick={() => goToScene(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Previous project"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <ol className="ss-folio__pips">
            {sites.map((site, index) => (
              <li key={site.id}>
                <button
                  type="button"
                  className="ss-focus-ring ss-folio__pip"
                  aria-current={index === currentIndex || undefined}
                  aria-label={`Go to project ${String(index + 1)}: ${site.name}`}
                  onClick={() => goToScene(index)}
                >
                  <span className="ss-folio__pip-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="ss-folio__pip-name">{site.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="ss-focus-ring ss-folio__arrow"
            onClick={() => goToScene(currentIndex + 1)}
            disabled={currentIndex === SCENE_COUNT - 1}
            aria-label="Next project"
          >
            <ChevronRight aria-hidden="true" />
          </button>
          <div className="ss-folio__progress" aria-hidden="true">
            <m.span style={{ scaleX: scrollYProgress }} />
          </div>
          <p className="ss-folio__count" aria-live="polite">
            {String(currentIndex + 1).padStart(2, "0")}
            <span> / {String(SCENE_COUNT).padStart(2, "0")}</span>
          </p>
        </nav>
      </div>
    </div>
  );
}
