import { useEffect, useRef } from "react";

/*
  Primary-hero background, ported faithfully from the supplied Aether Flow Hero
  21st.dev component. The motion sequence and particle behaviour are preserved;
  only the colours (Silverstone palette) and a few production guards are changed:

    - SSR-guarded: all canvas work runs inside an effect, never at module scope.
    - DPR capped at 1 (backing store sized to CSS pixels) for a stable cost.
    - Particle count reduced on small viewports and hard-capped.
    - The O(n²) link pass is paused while the hero is scrolled out of view.
    - prefers-reduced-motion renders a single static frame (no RAF, no drift).

  The static poster gradient sits underneath so there is always a calm field,
  even before the canvas paints or when motion is suppressed.
*/

const VOID = "#05070d";

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
    // Locals with non-null types so the closures below (class methods, RAF) do
    // not need repeated narrowing.
    const view = canvas;
    const ctx = context;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    let animationFrameId = 0;
    let running = false;
    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: 200,
    };

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

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

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x > view.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > view.height || this.y < 0) {
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
        this.draw();
      }
    }

    let particles: Particle[] = [];

    const init = () => {
      particles = [];
      const divisor = mobile ? 18000 : 11000;
      const cap = mobile ? 70 : 150;
      const count = Math.min(
        Math.floor((view.height * view.width) / divisor),
        cap,
      );
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (view.width - size * 4) + size * 2;
        const y = Math.random() * (view.height - size * 4) + size * 2;
        const directionX = Math.random() * 0.4 - 0.2;
        const directionY = Math.random() * 0.4 - 0.2;
        // Cool platinum motes, recoloured from the source's purple.
        const color = "rgba(196, 212, 238, 0.75)";
        particles.push(
          new Particle(x, y, directionX, directionY, size, color),
        );
      }
    };

    const connect = () => {
      const threshold = (view.width / 7) * (view.height / 7);
      for (let a = 0; a < particles.length; a++) {
        const pa = particles[a];
        if (!pa) {
          continue;
        }
        for (let b = a; b < particles.length; b++) {
          const pb = particles[b];
          if (!pb) {
            continue;
          }
          const distance =
            (pa.x - pb.x) * (pa.x - pb.x) + (pa.y - pb.y) * (pa.y - pb.y);

          if (distance < threshold) {
            const opacity = (1 - distance / 20000).toFixed(3);

            const dxMouseA = pa.x - (mouse.x ?? 0);
            const dyMouseA = pa.y - (mouse.y ?? 0);
            const distanceMouseA = Math.sqrt(
              dxMouseA * dxMouseA + dyMouseA * dyMouseA,
            );

            if (mouse.x !== null && distanceMouseA < mouse.radius) {
              // Threads near the pointer flare to ice-white.
              ctx.strokeStyle = `rgba(244, 250, 255, ${opacity})`;
            } else {
              // Resting links read as Silverstone steel-blue.
              ctx.strokeStyle = `rgba(120, 168, 220, ${opacity})`;
            }

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
      }
    };

    const paint = (advance: boolean) => {
      ctx.fillStyle = VOID;
      ctx.fillRect(0, 0, view.width, view.height);
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
      paint(true);
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
      view.width = window.innerWidth;
      view.height = window.innerHeight;
      init();
      if (reduceMotion) {
        paint(false);
      }
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

    // Pause the link pass while the hero is off-screen to spare the main thread.
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
        observer.observe(view);
      }
      start();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
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
