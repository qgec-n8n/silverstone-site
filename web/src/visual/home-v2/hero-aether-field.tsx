import { useEffect, useRef } from "react";

const VOID = "#05070d";
export const AETHER_PARTICLE_COLOR = "#66E8F0";
export const AETHER_NETWORK_DEFAULT = "#66E8F0";
export const AETHER_NETWORK_PROXIMITY = "#F3F7FF";
export const AETHER_POINTER_RADIUS = 200;
const MAX_DPR = 1.5;

/**
 * Below the desktop shader breakpoint the hero canvas is physically small, so
 * the area-proportional particle count and connection reach used at ≥1024px
 * leave the field looking sparse on a phone. Under this width we raise density,
 * connection reach and pixel density so a mobile hero reads as rich as the
 * desktop constellation. At/above 1024px every value below resolves to its
 * original desktop expression, so the desktop field is byte-for-byte unchanged.
 */
const COMPACT_MAX_WIDTH = 1024;
/** Denser area divisor for compact canvases (desktop keeps 9000). */
const COMPACT_AREA_DIVISOR = 3400;
/** Hard particle ceiling on compact canvases to bound the O(n²) link pass. */
const COMPACT_PARTICLE_CAP = 132;
/** Fixed squared-distance link threshold on compact canvases — ~138px reach,
 * matching the ~141px point where desktop link opacity fades to zero. */
const COMPACT_CONNECTION_THRESHOLD = 19000;
/** Compact canvases render at up to 2x for crisper dots/lines; desktop 1.5x. */
const COMPACT_MAX_DPR = 2;

export type AetherPalette = {
  particle: string;
  network: string;
  proximity: string;
};

/**
 * The Industries route family renders the same Aether field — identical
 * displacement, line-breaking and reforming behaviour — in a violet palette,
 * signalling a different page family against the same dark background.
 */
export const AETHER_INDUSTRIES_PALETTE: AetherPalette = {
  particle: "#A78BFA",
  network: "#8B7CF6",
  proximity: "#F4F0FF",
};

/**
 * The standalone core pages each carry their own two-colour Aether scheme —
 * one colour for the resting dots + lines, one for pointer proximity — so
 * arriving on Home, How we work, Insights, About, Pricing, Contact or Book
 * reads as entering a distinct main page rather than another Services or
 * Industries route. Every base is tuned for contrast against the #05070d void,
 * and every proximity value shifts hue *and* lifts toward light so the field
 * visibly re-colours the instant the pointer approaches. Home carries the
 * signature cyan→ultraviolet signal; How we work inverts it (ultraviolet
 * resting → ice-cyan proximity). /book is gate-free today (no Aether intro),
 * but its scheme is registered so the palette holds if that ever changes.
 */
export const AETHER_ROUTE_PALETTES: Record<string, AetherPalette> = {
  "/": { particle: "#28D7EC", network: "#28D7EC", proximity: "#C9B8FF" },
  "/how-we-work": { particle: "#7C5CFF", network: "#7C5CFF", proximity: "#9BF0FF" },
  "/blog": { particle: "#E7BD66", network: "#E7BD66", proximity: "#FFF3D9" },
  "/about": { particle: "#C3CEDC", network: "#C3CEDC", proximity: "#7DE9F6" },
  "/pricing": { particle: "#5FE3B2", network: "#5FE3B2", proximity: "#ECFFF7" },
  "/contact": { particle: "#7FA9FF", network: "#7FA9FF", proximity: "#EAF2FF" },
  "/book": { particle: "#8CEFA9", network: "#8CEFA9", proximity: "#F0FFF4" },
};

/**
 * The seven Services routes share one cinematic "signal spectrum" thread —
 * every resting base sits in the cyan / azure / aqua region and every
 * proximity flare resolves toward the violet / indigo / orchid end — so the
 * family reads as one system while each page still owns a distinct hue pairing
 * (matched to that route's copy accent in services-v2 route-art). The
 * /services hub carries the leading cyan-azure of the family.
 */
export const AETHER_SERVICE_PALETTES: Record<string, AetherPalette> = {
  "/services": { particle: "#3AC7EE", network: "#3AC7EE", proximity: "#D6F5FF" },
  "/services/web-design-development": {
    particle: "#34D5E8",
    network: "#34D5E8",
    proximity: "#E4C7F5",
  },
  "/services/app-development": {
    particle: "#38BDF8",
    network: "#38BDF8",
    proximity: "#C3C8FF",
  },
  "/services/ai-voice-agents": {
    particle: "#7FE9F0",
    network: "#7FE9F0",
    proximity: "#DFFCFF",
  },
  "/services/ai-receptionists": {
    particle: "#59A6E6",
    network: "#59A6E6",
    proximity: "#CFF1FB",
  },
  "/services/content-creation": {
    particle: "#C47BD6",
    network: "#C47BD6",
    proximity: "#C6F1F5",
  },
  "/services/ai-automation": {
    particle: "#8B72FF",
    network: "#8B72FF",
    proximity: "#B6F2FB",
  },
  "/services/ai-consulting": {
    particle: "#6E74F4",
    network: "#6E74F4",
    proximity: "#CDFAFD",
  },
};

/**
 * The ten Industries routes each carry their own hue pairing, derived from
 * that sector's copy accent (industries-v2 route-art accentFrom → accentTo):
 * resting base takes the accent's leading colour, proximity lifts toward the
 * trailing colour as a light tint. The /industry hub keeps the shared violet
 * family signature ({@link AETHER_INDUSTRIES_PALETTE}).
 */
export const AETHER_INDUSTRY_PALETTES: Record<string, AetherPalette> = {
  "/industry/estate-agents": {
    particle: "#8B7CF6",
    network: "#8B7CF6",
    proximity: "#B6ECF7",
  },
  "/industry/salons-barbers": {
    particle: "#E879B9",
    network: "#E879B9",
    proximity: "#CDBBFF",
  },
  "/industry/aesthetic-clinics": {
    particle: "#F0ABFC",
    network: "#F0ABFC",
    proximity: "#C8F5EA",
  },
  "/industry/ecommerce": {
    particle: "#38BDF8",
    network: "#38BDF8",
    proximity: "#CFC3FF",
  },
  "/industry/dentists": {
    particle: "#5EEAD4",
    network: "#5EEAD4",
    proximity: "#C7E8FF",
  },
  "/industry/fitness-coaches": {
    particle: "#22D3EE",
    network: "#22D3EE",
    proximity: "#F6C2DC",
  },
  "/industry/hospitality": {
    particle: "#A78BFA",
    network: "#A78BFA",
    proximity: "#F7CFFF",
  },
  "/industry/trades": {
    particle: "#4F7DF9",
    network: "#4F7DF9",
    proximity: "#C2F6FA",
  },
  "/industry/physios-chiropractors": {
    particle: "#6EE7D8",
    network: "#6EE7D8",
    proximity: "#CDBBFF",
  },
  "/industry/gyms-fitness-studios": {
    particle: "#7C5CFF",
    network: "#7C5CFF",
    proximity: "#F6C2DC",
  },
};

const DEFAULT_PALETTE: AetherPalette = {
  particle: AETHER_PARTICLE_COLOR,
  network: AETHER_NETWORK_DEFAULT,
  proximity: AETHER_NETWORK_PROXIMITY,
};

type MouseState = {
  radius: number;
  x: number | null;
  y: number | null;
};

type Bounds = { height: number; width: number };

export class AetherParticle {
  color: string;
  directionX: number;
  directionY: number;
  size: number;
  x: number;
  y: number;

  constructor(
    x: number,
    y: number,
    directionX: number,
    directionY: number,
    size: number,
    color = AETHER_PARTICLE_COLOR,
  ) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(bounds: Bounds, mouse: MouseState) {
    if (this.x > bounds.width || this.x < 0) {
      this.directionX = -this.directionX;
    }

    if (this.y > bounds.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    applyPointerRepulsion(this, mouse);

    this.x += this.directionX;
    this.y += this.directionY;
  }
}

export function pointerPositionInCanvas(
  event: Pick<PointerEvent, "clientX" | "clientY"> & { pointerType?: string },
  rect: Pick<DOMRectReadOnly, "height" | "left" | "top" | "width">,
): MouseState {
  if (event.pointerType === "touch") {
    return { radius: AETHER_POINTER_RADIUS, x: null, y: null };
  }

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

  return inside
    ? { radius: AETHER_POINTER_RADIUS, x, y }
    : { radius: AETHER_POINTER_RADIUS, x: null, y: null };
}

export function applyPointerRepulsion(
  particle: AetherParticle,
  mouse: MouseState,
): boolean {
  if (mouse.x === null || mouse.y === null) {
    return false;
  }

  const deltaX = mouse.x - particle.x;
  const deltaY = mouse.y - particle.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance <= 0 || distance >= mouse.radius + particle.size) {
    return false;
  }

  const forceDirectionX = deltaX / distance;
  const forceDirectionY = deltaY / distance;
  const force = (mouse.radius - distance) / mouse.radius;

  particle.x -= forceDirectionX * force * 5;
  particle.y -= forceDirectionY * force * 5;

  return true;
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    b: Number.parseInt(value.slice(4, 6), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    r: Number.parseInt(value.slice(0, 2), 16),
  };
}

function rgba(hex: string, alpha: number) {
  const color = hexToRgb(hex);
  return `rgba(${String(color.r)}, ${String(color.g)}, ${String(color.b)}, ${String(
    Math.max(0, Math.min(1, alpha)),
  )})`;
}

export function HeroAetherField({
  enabled = true,
  palette,
}: {
  enabled?: boolean;
  palette?: AetherPalette | undefined;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activePalette = palette ?? DEFAULT_PALETTE;

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") {
      return undefined;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return undefined;
    }

    let animationFrameId = 0;
    let particles: AetherParticle[] = [];
    let bounds: Bounds = { height: 1, width: 1 };
    let running = false;
    let mouse: MouseState = {
      radius: AETHER_POINTER_RADIUS,
      x: null,
      y: null,
    };

    const initialiseParticles = () => {
      particles = [];

      const compact = bounds.width < COMPACT_MAX_WIDTH;
      const numberOfParticles = compact
        ? Math.min(
            Math.round((bounds.height * bounds.width) / COMPACT_AREA_DIVISOR),
            COMPACT_PARTICLE_CAP,
          )
        : (bounds.height * bounds.width) / 9000;

      for (let index = 0; index < numberOfParticles; index += 1) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * Math.max(bounds.width - size * 4, 1) + size * 2;
        const y = Math.random() * Math.max(bounds.height - size * 4, 1) + size * 2;
        const directionX = Math.random() * 0.4 - 0.2;
        const directionY = Math.random() * 0.4 - 0.2;

        particles.push(
          new AetherParticle(
            x,
            y,
            directionX,
            directionY,
            size,
            activePalette.particle,
          ),
        );
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        rect.width < COMPACT_MAX_WIDTH ? COMPACT_MAX_DPR : MAX_DPR,
      );
      const nextBounds: Bounds = {
        height: Math.max(1, rect.height),
        width: Math.max(1, rect.width),
      };

      // iOS/Android toolbar collapse fires a resize mid-scroll with only a
      // small height delta — regenerating every particle on that reads as
      // the whole field visibly resetting. Only regenerate on first mount or
      // a resize that's actually meaningful (width change, or a height swing
      // too large to be toolbar chrome), mirroring ScrollTrigger's own
      // `ignoreMobileResize` threshold used elsewhere in the hero.
      const isFirstRun = particles.length === 0;
      const widthChanged = nextBounds.width !== bounds.width;
      const heightChangedSignificantly =
        Math.abs(nextBounds.height - bounds.height) > bounds.height * 0.25;

      bounds = nextBounds;
      canvas.width = Math.max(1, Math.floor(bounds.width * dpr));
      canvas.height = Math.max(1, Math.floor(bounds.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (isFirstRun || widthChanged || heightChangedSignificantly) {
        initialiseParticles();
      }
    };

    const connectParticles = () => {
      const connectionThreshold =
        bounds.width < COMPACT_MAX_WIDTH
          ? COMPACT_CONNECTION_THRESHOLD
          : (bounds.width / 7) * (bounds.height / 7);

      for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
        for (
          let secondIndex = firstIndex;
          secondIndex < particles.length;
          secondIndex += 1
        ) {
          const firstParticle = particles[firstIndex];
          const secondParticle = particles[secondIndex];

          if (!firstParticle || !secondParticle) {
            continue;
          }

          const distanceSquared =
            (firstParticle.x - secondParticle.x) *
              (firstParticle.x - secondParticle.x) +
            (firstParticle.y - secondParticle.y) * (firstParticle.y - secondParticle.y);

          if (distanceSquared < connectionThreshold) {
            const opacity = 1 - distanceSquared / 20000;
            let isNearPointer = false;

            if (mouse.x !== null && mouse.y !== null) {
              const pointerDeltaX = firstParticle.x - mouse.x;
              const pointerDeltaY = firstParticle.y - mouse.y;
              const pointerDistance = Math.sqrt(
                pointerDeltaX * pointerDeltaX + pointerDeltaY * pointerDeltaY,
              );

              isNearPointer = pointerDistance < mouse.radius;
            }

            context.strokeStyle = rgba(
              isNearPointer ? activePalette.proximity : activePalette.network,
              opacity,
            );
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(firstParticle.x, firstParticle.y);
            context.lineTo(secondParticle.x, secondParticle.y);
            context.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!running) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(animate);

      context.fillStyle = VOID;
      context.fillRect(0, 0, bounds.width, bounds.height);

      particles.forEach((particle) => {
        particle.update(bounds, mouse);
        particle.draw(context);
      });

      connectParticles();
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouse = pointerPositionInCanvas(event, canvas.getBoundingClientRect());
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse = pointerPositionInCanvas(event, canvas.getBoundingClientRect());
    };

    const clearPointer = () => {
      mouse = {
        radius: AETHER_POINTER_RADIUS,
        x: null,
        y: null,
      };
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    const start = () => {
      if (running || document.visibilityState === "hidden") {
        return;
      }
      running = true;
      animate();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stop();
        return;
      }
      start();
    };

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("pointerout", clearPointer);
    window.addEventListener("mouseout", clearPointer);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resizeCanvas();
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerout", clearPointer);
      window.removeEventListener("mouseout", clearPointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activePalette, enabled]);

  return (
    <div className="ss-hv2-hero__field" data-ss-gsap="hero-field" aria-hidden="true">
      <div className="ss-hv2-hero__poster" />
      <canvas ref={canvasRef} className="ss-hv2-hero__canvas" />
    </div>
  );
}

export default HeroAetherField;
