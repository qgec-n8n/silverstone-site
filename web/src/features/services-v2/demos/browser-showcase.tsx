/**
 * Web Design & Development demo — two live client websites presented as
 * full-width interactive browser windows, stacked vertically.
 *
 * Desktop (≥64rem, hover-capable fine pointer): the production site loads in
 * an iframe only after an explicit activation click — nothing is requested
 * from the demo origins on initial page load; the idle window shows a locally
 * hosted screenshot poster. After activation the window is fully interactive.
 * Moving the pointer out of the screen re-arms a transparent shield so the
 * embedded site can never capture page scrolling by accident; one click
 * resumes browsing. A permanent "open in new tab" control sits in the chrome
 * bar.
 *
 * Mobile and coarse-pointer viewports: no iframe is ever mounted. Each demo
 * renders as an optimised local mobile screenshot inside a device frame that
 * links to the live site in a new tab, plus an explicit open button.
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
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import {
  ArrowUpRight,
  Globe,
  MousePointerClick,
  Power,
  RotateCcw,
} from "~/components/icons/lucide";

import { BorderBeam, Reveal } from "../components/primitives";

type PosterSource = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
};

type ShowcaseSite = {
  id: string;
  /** Approved manifest slot this window activates. */
  configSlot: string;
  name: string;
  sector: string;
  line: string;
  url: string;
  origin: string;
  domain: string;
  /** Delegates the Payment Request API to the embedded site (booking deposits). */
  allowPayment?: boolean;
  /** Client-brand light: LIVE dot, beam ring and glows inside this window only. */
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
    line: "A calm, trust-led platform for shared owners, partners and governance.",
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
    line: "A serene clinic journey, from treatment discovery to a booked consultation.",
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

type Phase = "idle" | "connecting" | "live";

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

function LiveDemoWindow({ site, index }: { site: ShowcaseSite; index: number }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [engaged, setEngaged] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const screenRef = useRef<HTMLDivElement>(null);

  const activate = useCallback(() => {
    preconnect(site.origin);
    setPhase((current) => (current === "idle" ? "connecting" : current));
    setEngaged(true);
  }, [site.origin]);

  const disengage = useCallback(() => setEngaged(false), []);
  const engage = useCallback(() => setEngaged(true), []);

  const restart = useCallback(() => {
    setFrameKey((key) => key + 1);
    setPhase("connecting");
  }, []);

  // Belt-and-braces shield re-arm: pointer events never fire while the cursor
  // is inside the cross-origin iframe, so any move we do observe outside the
  // screen means the visitor has left the demo — re-arm the shield even if
  // the pointerleave on the screen itself was swallowed.
  useEffect(() => {
    if (!engaged) {
      return;
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!screenRef.current?.contains(event.target as Node)) {
        setEngaged(false);
      }
    };
    document.addEventListener("pointermove", onPointerMove, true);
    return () => document.removeEventListener("pointermove", onPointerMove, true);
  }, [engaged]);

  const onScreenKeyDown = useCallback((event: ReactKeyboardEvent) => {
    if (event.key === "Escape") {
      setEngaged(false);
    }
  }, []);

  const status =
    phase === "live" ? "Live" : phase === "connecting" ? "Connecting" : "Standby";

  const tintStyle = {
    "--demo-tint": site.tint,
    "--demo-tint-2": site.tintSecondary,
  } as CSSProperties;

  return (
    <article
      className="ss-webdemo"
      data-demo={site.id}
      data-config-slot={site.configSlot}
      data-phase={phase}
      style={tintStyle}
      aria-label={`${site.name} — live website demo`}
    >
      <Reveal kind="section">
        <header className="ss-webdemo__meta">
          <p className="ss-webdemo__client">
            <span className="ss-webdemo__client-dot" aria-hidden="true" />
            <strong>{site.name}</strong>
            <span className="ss-webdemo__sector">{site.sector}</span>
          </p>
          <p className="ss-webdemo__line">{site.line}</p>
        </header>
      </Reveal>

      <Reveal kind="card" delayMs={index * 120}>
        <div
          className="ss-webdemo__window ss-srv2-beam-border"
          onPointerEnter={() => preconnect(site.origin)}
        >
          {/* Desktop: interactive browser window */}
          <div className="ss-webdemo__browser">
            <div className="ss-webdemo__bar">
              <span className="ss-webdemo__dots" aria-hidden="true">
                <i /> <i /> <i />
              </span>
              <span className="ss-webdemo__addr">
                <Globe aria-hidden="true" />
                <span className="ss-webdemo__addr-domain">{site.domain}</span>
              </span>
              <span className="ss-webdemo__status" data-status={phase}>
                <i aria-hidden="true" />
                {status}
              </span>
              {phase !== "idle" ? (
                <button
                  type="button"
                  className="ss-focus-ring ss-webdemo__bar-btn"
                  onClick={restart}
                  aria-label={`Restart the ${site.name} demo`}
                  title="Restart demo"
                >
                  <RotateCcw aria-hidden="true" />
                </button>
              ) : null}
              <a
                className="ss-focus-ring ss-webdemo__open"
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
              ref={screenRef}
              className="ss-webdemo__screen"
              data-engaged={engaged || undefined}
              onPointerLeave={phase === "live" ? disengage : undefined}
              onKeyDown={onScreenKeyDown}
            >
              <img
                className="ss-webdemo__poster"
                src={site.desktopPoster.src}
                srcSet={site.desktopPoster.srcSet}
                sizes="(min-width: 80rem) 70rem, 92vw"
                width={site.desktopPoster.width}
                height={site.desktopPoster.height}
                alt={site.desktopPoster.alt}
                loading="lazy"
                decoding="async"
              />

              {phase !== "idle" ? (
                <iframe
                  key={frameKey}
                  className="ss-webdemo__frame"
                  src={site.url}
                  title={`${site.name} — live website`}
                  allow={site.allowPayment ? "payment" : undefined}
                  data-live={phase === "live" || undefined}
                  onLoad={() => setPhase("live")}
                />
              ) : null}

              {phase === "idle" ? (
                <button
                  type="button"
                  className="ss-webdemo__activate"
                  onClick={activate}
                >
                  <span className="ss-webdemo__activate-ring" aria-hidden="true">
                    <Power />
                  </span>
                  <span className="ss-webdemo__activate-label">Activate live demo</span>
                  <span className="ss-webdemo__activate-sub">
                    Browse the real website right here
                  </span>
                </button>
              ) : null}

              {phase === "connecting" ? (
                <span className="ss-webdemo__connecting" role="status">
                  <span className="ss-webdemo__connecting-ring" aria-hidden="true" />
                  Connecting to {site.domain}
                </span>
              ) : null}

              {phase === "live" && !engaged ? (
                <button
                  type="button"
                  className="ss-webdemo__shield"
                  onClick={engage}
                  aria-label={`Resume browsing the ${site.name} demo`}
                >
                  <span className="ss-webdemo__shield-pill">
                    <MousePointerClick aria-hidden="true" />
                    Click to browse
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          {/* Mobile / coarse pointer: device presentation, no iframe */}
          <div className="ss-webdemo__handset">
            <a
              className="ss-focus-ring ss-webdemo__device"
              href={site.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open the ${site.name} website in a new tab`}
            >
              <span className="ss-webdemo__device-island" aria-hidden="true" />
              <img
                className="ss-webdemo__device-shot"
                src={site.mobilePoster.src}
                srcSet={site.mobilePoster.srcSet}
                sizes="17rem"
                width={site.mobilePoster.width}
                height={site.mobilePoster.height}
                alt={site.mobilePoster.alt}
                loading="lazy"
                decoding="async"
              />
              <span className="ss-webdemo__device-hint" aria-hidden="true">
                <ArrowUpRight />
                Tap to open
              </span>
            </a>
            <a
              className="ss-focus-ring ss-webdemo__handset-open"
              href={site.url}
              target="_blank"
              rel="noreferrer"
            >
              Open live site
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>

          <BorderBeam />
        </div>
      </Reveal>
    </article>
  );
}

export function BrowserShowcase() {
  return (
    <div className="ss-webdemo-stack">
      {sites.map((site, index) => (
        <LiveDemoWindow key={site.id} site={site} index={index} />
      ))}
    </div>
  );
}
