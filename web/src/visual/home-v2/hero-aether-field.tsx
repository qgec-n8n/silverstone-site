import { useEffect, useRef } from "react";

const VOID = "#05070d";
export const AETHER_NETWORK_DEFAULT = "#66E8F0";
export const AETHER_NETWORK_PROXIMITY = "#F3F7FF";
const MAX_PARTICLES = 240;
const MAX_DPR = 1.5;

type MouseState = {
  radius: number;
  x: number | null;
  y: number | null;
};

class AetherParticle {
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

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
  }

  update(bounds: { height: number; width: number }, mouse: MouseState) {
    if (this.x > bounds.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > bounds.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 0.001);

      if (distance < mouse.radius + this.size) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= forceDirectionX * force * 5;
        this.y -= forceDirectionY * force * 5;
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;
  }
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
    let bounds = { height: 1, width: 1 };
    let dpr = 1;
    const mouse: MouseState = { x: null, y: null, radius: 200 };

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

    const connect = () => {
      const threshold = Math.min((bounds.width / 7) * (bounds.height / 7), 22000);

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const particleA = particles[a];
          const particleB = particles[b];
          if (!particleA || !particleB) {
            continue;
          }
          const distance =
            (particleA.x - particleB.x) * (particleA.x - particleB.x) +
            (particleA.y - particleB.y) * (particleA.y - particleB.y);

          if (distance < threshold) {
            const opacityValue = Math.max(0, 1 - distance / threshold);

            const dxMouseA = particleA.x - (mouse.x ?? 0);
            const dyMouseA = particleA.y - (mouse.y ?? 0);
            const distanceMouseA = Math.sqrt(dxMouseA * dxMouseA + dyMouseA * dyMouseA);
            const nearPointer = mouse.x !== null && distanceMouseA < mouse.radius;

            ctx.strokeStyle = rgba(
              nearPointer ? AETHER_NETWORK_PROXIMITY : AETHER_NETWORK_DEFAULT,
              nearPointer ? opacityValue * 0.92 : opacityValue * 0.68,
            );

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);

      ctx.fillStyle = VOID;
      ctx.fillRect(0, 0, bounds.width, bounds.height);

      for (const particle of particles) {
        particle.update(bounds, mouse);
        let particleColor = AETHER_NETWORK_DEFAULT;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          if (Math.sqrt(dx * dx + dy * dy) < mouse.radius) {
            particleColor = AETHER_NETWORK_PROXIMITY;
          }
        }
        particle.draw(
          ctx,
          rgba(particleColor, particleColor === AETHER_NETWORK_DEFAULT ? 0.8 : 0.96),
        );
      }

      connect();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    resizeCanvas();
    animate();

    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      window.cancelAnimationFrame(animationFrameId);
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
