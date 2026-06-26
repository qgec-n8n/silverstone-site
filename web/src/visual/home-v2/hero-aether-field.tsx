import { useEffect, useRef } from "react";

const VOID = "#05070d";
const ELECTRIC_CYAN = "#5EC5D0";
const PLATINUM_SILVER = "#E9EAEF";
const POINTER_RADIUS = 200;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function finite(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    b: Number.parseInt(value.slice(4, 6), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    r: Number.parseInt(value.slice(0, 2), 16),
  };
}

function rgba(hex: string, opacity: number) {
  const { b, g, r } = hexToRgb(hex);
  return `rgba(${String(r)}, ${String(g)}, ${String(b)}, ${opacity.toFixed(3)})`;
}

export function HeroAetherField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") {
      return undefined;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return undefined;
    }

    const ctx = context;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId = 0;
    let height = 1;
    let running = false;
    let width = 1;
    const mouse: { radius: number; x: number | null; y: number | null } = {
      radius: POINTER_RADIUS,
      x: null,
      y: null,
    };

    class Particle {
      directionX: number;
      directionY: number;
      size: number;
      x: number;
      y: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.directionX = Math.random() * 0.4 - 0.2;
        this.directionY = Math.random() * 0.4 - 0.2;
        this.size = Math.random() * 2 + 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = ELECTRIC_CYAN;
        ctx.fill();
      }

      contain() {
        if (!Number.isFinite(this.x) || !Number.isFinite(this.y)) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        }
        if (this.x > width || this.x < 0) {
          this.directionX *= -1;
        }
        if (this.y > height || this.y < 0) {
          this.directionY *= -1;
        }
        this.x = clamp(this.x, this.size, Math.max(this.size, width - this.size));
        this.y = clamp(this.y, this.size, Math.max(this.size, height - this.size));
      }

      applyPointerForce() {
        if (mouse.x === null || mouse.y === null) {
          return;
        }

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 0.001);
        if (distance >= mouse.radius + this.size) {
          return;
        }

        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= forceDirectionX * force * 5;
        this.y -= forceDirectionY * force * 5;
      }

      update() {
        this.contain();
        this.applyPointerForce();
        this.x = finite(this.x + this.directionX, width / 2);
        this.y = finite(this.y + this.directionY, height / 2);
        this.contain();
        this.draw();
      }
    }

    let particles: Particle[] = [];

    const init = () => {
      particles = [];
      const particleCount = Math.max(
        1,
        Math.floor((canvas.height * canvas.width) / 9000),
      );
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connect = () => {
      const threshold = Math.max(1, (canvas.width / 7) * (canvas.height / 7));

      for (let a = 0; a < particles.length; a++) {
        const particleA = particles[a];
        if (!particleA) {
          continue;
        }

        for (let b = a + 1; b < particles.length; b++) {
          const particleB = particles[b];
          if (!particleB) {
            continue;
          }

          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = dx * dx + dy * dy;

          if (distance >= threshold) {
            continue;
          }

          const opacity = 1 - distance / threshold;
          const nearPointer =
            mouse.x !== null &&
            mouse.y !== null &&
            Math.hypot(particleA.x - mouse.x, particleA.y - mouse.y) < mouse.radius;

          ctx.strokeStyle = rgba(
            nearPointer ? PLATINUM_SILVER : ELECTRIC_CYAN,
            nearPointer ? opacity * 0.72 : opacity * 0.42,
          );
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particleA.x, particleA.y);
          ctx.lineTo(particleB.x, particleB.y);
          ctx.stroke();
        }
      }
    };

    const paint = (advance: boolean) => {
      ctx.fillStyle = VOID;
      ctx.fillRect(0, 0, width, height);
      for (const particle of particles) {
        if (advance) {
          particle.update();
        } else {
          particle.draw();
        }
      }
      connect();
    };

    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);
      if (running) {
        paint(true);
      }
    };

    const start = () => {
      if (running || reduceMotion) {
        return;
      }
      running = true;
      animate();
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(animationFrameId);
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width || window.innerWidth));
      height = Math.max(1, Math.floor(rect.height || window.innerHeight));
      canvas.width = width;
      canvas.height = height;
      init();
      paint(false);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;
      mouse.x = nextX >= 0 && nextX <= rect.width ? nextX : null;
      mouse.y = nextY >= 0 && nextY <= rect.height ? nextY : null;
    };

    const handlePointerLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    resizeCanvas();

    let observer: IntersectionObserver | undefined;
    if (!reduceMotion) {
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver((entries) => {
          const visible = entries.some((entry) => entry.isIntersecting);
          if (visible) {
            start();
          } else {
            stop();
          }
        });
        observer.observe(canvas);
      }
      start();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      observer?.disconnect();
      stop();
    };
  }, []);

  return (
    <div className="ss-hv2-hero__field" data-ss-gsap="hero-field" aria-hidden="true">
      <div className="ss-hv2-hero__poster" />
      <canvas ref={canvasRef} className="ss-hv2-hero__canvas" />
    </div>
  );
}

export default HeroAetherField;
