import { useEffect, useRef } from "react";

const VOID = "#05070d";
export const AETHER_NETWORK_DEFAULT = "#66E8F0";
export const AETHER_NETWORK_PROXIMITY = "#F3F7FF";
const MAX_PARTICLES = 240;
const MAX_DPR = 1.5;

type MouseState = {
  active: boolean;
  radius: number;
  x: number | null;
  y: number | null;
};

type Bounds = { height: number; width: number };

type DisplacedParticle = {
  drawX: number;
  drawY: number;
  proximity: number;
  size: number;
  source: AetherParticle;
  x: number;
  y: number;
};

export class AetherParticle {
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
  ) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
  }

  draw(ctx: CanvasRenderingContext2D, color: string, x = this.x, y = this.y) {
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
  }

  update(bounds: Bounds) {
    if (this.x > bounds.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > bounds.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    this.x += this.directionX;
    this.y += this.directionY;
  }
}

export function pointerPositionInCanvas(
  event: Pick<PointerEvent, "clientX" | "clientY"> & { pointerType?: string },
  rect: Pick<DOMRectReadOnly, "height" | "left" | "top" | "width">,
): MouseState {
  if (event.pointerType === "touch") {
    return { active: false, radius: 0, x: null, y: null };
  }

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const active = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
  const radius = Math.max(180, Math.min(300, Math.min(rect.width, rect.height) * 0.3));

  return active ? { active, radius, x, y } : { active: false, radius, x: null, y: null };
}

export function displacedParticlePosition(
  particle: AetherParticle,
  mouse: MouseState,
): DisplacedParticle {
  if (!mouse.active || mouse.x === null || mouse.y === null) {
    return {
      source: particle,
      size: particle.size,
      x: particle.x,
      y: particle.y,
      drawX: particle.x,
      drawY: particle.y,
      proximity: 0,
    };
  }

  const dx = particle.x - mouse.x;
  const dy = particle.y - mouse.y;
  const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 0.001);
  const proximity = Math.max(0, 1 - distance / mouse.radius);
  if (proximity <= 0) {
    return {
      source: particle,
      size: particle.size,
      x: particle.x,
      y: particle.y,
      drawX: particle.x,
      drawY: particle.y,
      proximity: 0,
    };
  }

  const ease = proximity * proximity * (3 - 2 * proximity);
  const displacement = ease * mouse.radius * 0.56;
  return {
    source: particle,
    size: particle.size,
    x: particle.x,
    y: particle.y,
    drawX: particle.x + (dx / distance) * displacement,
    drawY: particle.y + (dy / distance) * displacement,
    proximity,
  };
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgba(hex: string, alpha: number) {
  const color = hexToRgb(hex);
  return `rgba(${String(color.r)}, ${String(color.g)}, ${String(color.b)}, ${String(
    Math.max(0, Math.min(1, alpha)),
  )})`;
}

export function HeroAetherField({ enabled = true }: { enabled?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    let animationFrameId = 0;
    let particles: AetherParticle[] = [];
    let bounds: Bounds = { height: 1, width: 1 };
    let dpr = 1;
    let running = false;
    let mouse: MouseState = { active: false, x: null, y: null, radius: 200 };

    function init() {
      particles = [];
      const numberOfParticles = Math.min(
        Math.floor((bounds.height * bounds.width) / 9000),
        MAX_PARTICLES,
      );

      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * Math.max(bounds.width - size * 4, 1) + size * 2;
        const y = Math.random() * Math.max(bounds.height - size * 4, 1) + size * 2;
        const directionX = Math.random() * 0.4 - 0.2;
        const directionY = Math.random() * 0.4 - 0.2;

        particles.push(new AetherParticle(x, y, directionX, directionY, size));
      }
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      bounds = {
        height: Math.max(1, rect.height),
        width: Math.max(1, rect.width),
      };
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(1, Math.floor(bounds.width * dpr));
      canvas.height = Math.max(1, Math.floor(bounds.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    const connect = (displaced: DisplacedParticle[]) => {
      const threshold = Math.min((bounds.width / 7) * (bounds.height / 7), 22000);

      for (let a = 0; a < displaced.length; a++) {
        for (let b = a + 1; b < displaced.length; b++) {
          const particleA = displaced[a];
          const particleB = displaced[b];
          if (!particleA || !particleB) {
            continue;
          }
          const distance =
            (particleA.drawX - particleB.drawX) * (particleA.drawX - particleB.drawX) +
            (particleA.drawY - particleB.drawY) * (particleA.drawY - particleB.drawY);

          if (distance < threshold) {
            const opacityValue = Math.max(0, 1 - distance / threshold);
            const proximity = Math.max(particleA.proximity, particleB.proximity);
            const nearPointer = proximity > 0;

            ctx.strokeStyle = rgba(
              nearPointer ? AETHER_NETWORK_PROXIMITY : AETHER_NETWORK_DEFAULT,
              nearPointer ? opacityValue * (0.18 + proximity * 0.45) : opacityValue * 0.68,
            );

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particleA.drawX, particleA.drawY);
            ctx.lineTo(particleB.drawX, particleB.drawY);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!running) {
        return;
      }
      animationFrameId = window.requestAnimationFrame(animate);

      ctx.fillStyle = VOID;
      ctx.fillRect(0, 0, bounds.width, bounds.height);

      const displaced = particles.map((particle) => {
        particle.update(bounds);
        return displacedParticlePosition(particle, mouse);
      });

      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fillStyle = rgba(AETHER_NETWORK_PROXIMITY, 0.16);
        ctx.fill();
        ctx.strokeStyle = rgba(AETHER_NETWORK_PROXIMITY, 0.58);
        ctx.lineWidth = 1.4;
        ctx.setLineDash([8, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      for (const particle of displaced) {
        const particleColor =
          particle.proximity > 0 ? AETHER_NETWORK_PROXIMITY : AETHER_NETWORK_DEFAULT;
        particle.source.draw(
          ctx,
          rgba(particleColor, particleColor === AETHER_NETWORK_DEFAULT ? 0.8 : 0.96),
          particle.drawX,
          particle.drawY,
        );
      }

      connect(displaced);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = pointerPositionInCanvas(event, rect);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = pointerPositionInCanvas(event, rect);
    };

    const handlePointerLeave = () => {
      mouse = { active: false, x: null, y: null, radius: mouse.radius };
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
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("pointerout", handlePointerLeave);
    window.addEventListener("mouseout", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resizeCanvas();
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerout", handlePointerLeave);
      window.removeEventListener("mouseout", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled]);

  return (
    <div className="ss-hv2-hero__field" data-ss-gsap="hero-field" aria-hidden="true">
      <div className="ss-hv2-hero__poster" />
      <canvas ref={canvasRef} className="ss-hv2-hero__canvas" />
    </div>
  );
}

export default HeroAetherField;
