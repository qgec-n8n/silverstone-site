import { useEffect, useRef } from "react";

const VOID = "#05070d";
export const AETHER_PARTICLE_COLOR = "#66E8F0";
export const AETHER_NETWORK_DEFAULT = "#66E8F0";
export const AETHER_NETWORK_PROXIMITY = "#F3F7FF";
export const AETHER_POINTER_RADIUS = 200;
const MAX_DPR = 1.5;

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
 * arriving on Insights, About, Pricing, Contact or Book reads as entering a
 * distinct main page rather than another Services (cyan) or Industries
 * (violet) route. All bases sit in the Silverstone signal family and are
 * tuned for contrast against the #05070d void. /how-we-work intentionally
 * keeps the default cyan; /book is gate-free today (no Aether intro), but
 * its scheme is registered so the palette holds if that ever changes.
 */
export const AETHER_ROUTE_PALETTES: Record<string, AetherPalette> = {
  "/blog": { particle: "#E7BD66", network: "#E7BD66", proximity: "#FFF3D9" },
  "/about": { particle: "#C3CEDC", network: "#C3CEDC", proximity: "#7DE9F6" },
  "/pricing": { particle: "#5FE3B2", network: "#5FE3B2", proximity: "#ECFFF7" },
  "/contact": { particle: "#7FA9FF", network: "#7FA9FF", proximity: "#EAF2FF" },
  "/book": { particle: "#8CEFA9", network: "#8CEFA9", proximity: "#F0FFF4" },
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

      const numberOfParticles = (bounds.height * bounds.width) / 9000;

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
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      bounds = {
        height: Math.max(1, rect.height),
        width: Math.max(1, rect.width),
      };
      canvas.width = Math.max(1, Math.floor(bounds.width * dpr));
      canvas.height = Math.max(1, Math.floor(bounds.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      initialiseParticles();
    };

    const connectParticles = () => {
      const connectionThreshold = (bounds.width / 7) * (bounds.height / 7);

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
