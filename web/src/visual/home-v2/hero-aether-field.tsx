import { useEffect, useRef } from "react";

const VOID = "#05070d";
const AETHER_PARTICLE_COLOR = "rgba(94, 197, 208, 0.8)";
const AETHER_CONNECTION_COLOR = "rgba(94, 197, 208, ";
const AETHER_POINTER_CONNECTION_COLOR = "rgba(233, 234, 239, ";

type MouseState = {
  radius: number;
  x: number | null;
  y: number | null;
};

class AetherParticle {
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
    color: string,
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

  update(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, mouse: MouseState) {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

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
    this.draw(ctx);
  }
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

    const aetherCanvas = canvas;
    let animationFrameId = 0;
    let particles: AetherParticle[] = [];
    const mouse: MouseState = { x: null, y: null, radius: 200 };

    function init() {
      particles = [];
      const numberOfParticles = (aetherCanvas.height * aetherCanvas.width) / 9000;

      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (window.innerWidth - size * 2 - size * 2) + size * 2;
        const y = Math.random() * (window.innerHeight - size * 2 - size * 2) + size * 2;
        const directionX = Math.random() * 0.4 - 0.2;
        const directionY = Math.random() * 0.4 - 0.2;

        particles.push(
          new AetherParticle(x, y, directionX, directionY, size, AETHER_PARTICLE_COLOR),
        );
      }
    }

    const resizeCanvas = () => {
      aetherCanvas.width = window.innerWidth;
      aetherCanvas.height = window.innerHeight;
      init();
    };

    const connect = () => {
      let opacityValue = 1;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const particleA = particles[a];
          const particleB = particles[b];
          if (!particleA || !particleB) {
            continue;
          }
          const distance =
            (particleA.x - particleB.x) * (particleA.x - particleB.x) +
            (particleA.y - particleB.y) * (particleA.y - particleB.y);

          if (distance < (aetherCanvas.width / 7) * (aetherCanvas.height / 7)) {
            opacityValue = 1 - distance / 20000;

            const dxMouseA = particleA.x - (mouse.x ?? 0);
            const dyMouseA = particleA.y - (mouse.y ?? 0);
            const distanceMouseA = Math.sqrt(dxMouseA * dxMouseA + dyMouseA * dyMouseA);

            if (mouse.x && distanceMouseA < mouse.radius) {
              ctx.strokeStyle = `${AETHER_POINTER_CONNECTION_COLOR}${String(
                opacityValue,
              )})`;
            } else {
              ctx.strokeStyle = `${AETHER_CONNECTION_COLOR}${String(opacityValue)})`;
            }

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
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (const particle of particles) {
        particle.update(aetherCanvas, ctx, mouse);
      }

      connect();
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    resizeCanvas();
    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
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
