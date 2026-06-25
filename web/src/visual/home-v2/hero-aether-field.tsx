import { useEffect, useRef } from "react";

/*
  Primary-hero Aether field. The canvas owns the particle web, while the DOM
  owns the foreground reveal. On each frame we read the actual foreground
  element boxes and use them as disturbance/occlusion fields so the web parts
  around the copy rather than merely fading underneath it.
*/

const VOID = "#05070d";
const MAX_PARTICLE_SPEED = 1.05;
const REVEAL_DELAY_SECONDS = 0.21;
const REVEAL_DURATION_SECONDS = 0.88;
const REVEAL_START_SECONDS = 0.08;
const AETHER_COLORS = [
  "rgba(127, 233, 240, 0.82)",
  "rgba(56, 189, 248, 0.78)",
  "rgba(91, 98, 240, 0.76)",
  "rgba(124, 92, 255, 0.74)",
  "rgba(211, 107, 203, 0.72)",
  "rgba(233, 234, 239, 0.8)",
] as const;

type RevealZone = {
  bottom: number;
  centerX: number;
  centerY: number;
  left: number;
  progress: number;
  right: number;
  strength: number;
  top: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function finite(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - clamp(value, 0, 1), 3);
}

function pointInsideZone(x: number, y: number, zone: RevealZone) {
  return x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom;
}

function segmentsIntersect(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  dx: number,
  dy: number,
) {
  const det = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
  if (Math.abs(det) < 0.0001) {
    return false;
  }
  const lambda = ((dy - cy) * (dx - ax) + (cx - dx) * (dy - ay)) / det;
  const gamma = ((ay - by) * (dx - ax) + (bx - ax) * (dy - ay)) / det;
  return lambda > 0 && lambda < 1 && gamma > 0 && gamma < 1;
}

function lineCrossesZone(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  zone: RevealZone,
) {
  if (pointInsideZone(ax, ay, zone) || pointInsideZone(bx, by, zone)) {
    return true;
  }
  return (
    segmentsIntersect(ax, ay, bx, by, zone.left, zone.top, zone.right, zone.top) ||
    segmentsIntersect(ax, ay, bx, by, zone.right, zone.top, zone.right, zone.bottom) ||
    segmentsIntersect(
      ax,
      ay,
      bx,
      by,
      zone.right,
      zone.bottom,
      zone.left,
      zone.bottom,
    ) ||
    segmentsIntersect(ax, ay, bx, by, zone.left, zone.bottom, zone.left, zone.top)
  );
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

    const view = canvas;
    const ctx = context;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const hero = view.closest<HTMLElement>(".ss-hv2-hero");

    let animationFrameId = 0;
    let height = 1;
    let revealStartedAt = performance.now();
    let running = false;
    let width = 1;
    const mouse: { x: number | null; y: number | null; radius: number } = {
      x: null,
      y: null,
      radius: mobile ? 125 : 200,
    };

    const getRevealZones = (): RevealZone[] => {
      if (!hero) {
        return [];
      }
      const canvasRect = view.getBoundingClientRect();
      const elapsed = (performance.now() - revealStartedAt) / 1000;
      const elements = Array.from(
        hero.querySelectorAll<HTMLElement>("[data-aether-reveal]"),
      );

      return elements.flatMap((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
          return [];
        }

        const index = Number(element.dataset.aetherIndex ?? "0");
        const strength = Number(element.dataset.aetherStrength ?? "0.7");
        const delay = REVEAL_START_SECONDS + index * REVEAL_DELAY_SECONDS;
        const rawProgress = reduceMotion
          ? 1
          : (elapsed - delay) / REVEAL_DURATION_SECONDS;
        const progress = clamp(rawProgress, 0, 1);
        const padding = 10 + strength * 18;

        return [
          {
            bottom: rect.bottom - canvasRect.top + padding,
            centerX: rect.left - canvasRect.left + rect.width / 2,
            centerY: rect.top - canvasRect.top + rect.height / 2,
            left: rect.left - canvasRect.left - padding,
            progress,
            right: rect.right - canvasRect.left + padding,
            strength,
            top: rect.top - canvasRect.top - padding,
          },
        ];
      });
    };

    class Particle {
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
        this.x = finite(x, width / 2);
        this.y = finite(y, height / 2);
        this.directionX = finite(directionX, 0);
        this.directionY = finite(directionY, 0);
        this.size = finite(size, 1.5);
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      contain() {
        if (!Number.isFinite(this.x) || !Number.isFinite(this.y)) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        }
        if (this.x > width - this.size) {
          this.x = width - this.size;
          this.directionX = -Math.abs(this.directionX);
        } else if (this.x < this.size) {
          this.x = this.size;
          this.directionX = Math.abs(this.directionX);
        }
        if (this.y > height - this.size) {
          this.y = height - this.size;
          this.directionY = -Math.abs(this.directionY);
        } else if (this.y < this.size) {
          this.y = this.size;
          this.directionY = Math.abs(this.directionY);
        }
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
        const force = (mouse.radius - distance) / mouse.radius;
        this.directionX -= (dx / distance) * force * 0.04;
        this.directionY -= (dy / distance) * force * 0.04;
        this.x -= (dx / distance) * force * 3.5;
        this.y -= (dy / distance) * force * 3.5;
      }

      applyRevealForces(zones: RevealZone[]) {
        for (const zone of zones) {
          if (zone.progress <= 0) {
            continue;
          }
          const radius = Math.max(54, Math.min(210, (zone.right - zone.left) * 0.38));
          const nearestX = clamp(this.x, zone.left, zone.right);
          const nearestY = clamp(this.y, zone.top, zone.bottom);
          let dx = this.x - nearestX;
          let dy = this.y - nearestY;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 0.001) {
            dx = this.x - zone.centerX;
            dy = this.y - zone.centerY;
            distance = Math.max(Math.sqrt(dx * dx + dy * dy), 0.001);
          }

          if (distance > radius) {
            continue;
          }

          const wave = Math.sin(zone.progress * Math.PI);
          const force =
            (1 - distance / radius) *
            zone.strength *
            (reduceMotion ? 0.05 : 0.32 + wave * 0.58);
          this.directionX += (dx / distance) * force * 0.13;
          this.directionY += (dy / distance) * force * 0.13;
          this.x += (dx / distance) * force * 3.2;
          this.y += (dy / distance) * force * 3.2;
        }
      }

      limitVelocity() {
        const speed = Math.sqrt(
          this.directionX * this.directionX + this.directionY * this.directionY,
        );
        if (!Number.isFinite(speed) || speed <= MAX_PARTICLE_SPEED) {
          return;
        }
        this.directionX = (this.directionX / speed) * MAX_PARTICLE_SPEED;
        this.directionY = (this.directionY / speed) * MAX_PARTICLE_SPEED;
      }

      update(zones: RevealZone[]) {
        this.contain();
        this.applyPointerForce();
        this.applyRevealForces(zones);
        this.limitVelocity();
        this.x += this.directionX;
        this.y += this.directionY;
        this.contain();
        this.draw();
      }
    }

    let particles: Particle[] = [];

    const init = () => {
      particles = [];
      const divisor = mobile ? 18000 : 11000;
      const cap = mobile ? 70 : 150;
      const count = Math.max(26, Math.min(Math.floor((height * width) / divisor), cap));
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * Math.max(width - size * 4, 1) + size * 2;
        const y = Math.random() * Math.max(height - size * 4, 1) + size * 2;
        const directionX = Math.random() * 0.4 - 0.2;
        const directionY = Math.random() * 0.4 - 0.2;
        const color =
          AETHER_COLORS[Math.floor(Math.random() * AETHER_COLORS.length)] ??
          AETHER_COLORS[0];
        particles.push(new Particle(x, y, directionX, directionY, size, color));
      }
    };

    const connect = (zones: RevealZone[]) => {
      const threshold = Math.min(
        (width / 6.8) * (height / 6.8),
        mobile ? 15000 : 26000,
      );
      for (let a = 0; a < particles.length; a++) {
        const pa = particles[a];
        if (!pa) {
          continue;
        }
        for (let b = a + 1; b < particles.length; b++) {
          const pb = particles[b];
          if (!pb) {
            continue;
          }
          const dx = pa.x - pb.x;
          const dy = pa.y - pb.y;
          const distance = dx * dx + dy * dy;

          if (distance >= threshold) {
            continue;
          }

          if (
            zones.some(
              (zone) =>
                zone.progress > 0.34 && lineCrossesZone(pa.x, pa.y, pb.x, pb.y, zone),
            )
          ) {
            continue;
          }

          const linkStrength = easeOutCubic(1 - distance / threshold);
          const dxMouseA = pa.x - (mouse.x ?? -9999);
          const dyMouseA = pa.y - (mouse.y ?? -9999);
          const distanceMouseA = Math.sqrt(dxMouseA * dxMouseA + dyMouseA * dyMouseA);
          const nearPointer = mouse.x !== null && distanceMouseA < mouse.radius;
          const opacity = nearPointer ? linkStrength * 0.58 : linkStrength * 0.3;

          ctx.strokeStyle = nearPointer
            ? `rgba(244, 250, 255, ${opacity.toFixed(3)})`
            : `rgba(126, 213, 230, ${opacity.toFixed(3)})`;
          ctx.lineWidth = nearPointer ? 1.15 : 0.9;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }
    };

    const paint = (advance: boolean) => {
      const zones = getRevealZones();
      ctx.fillStyle = VOID;
      ctx.fillRect(0, 0, width, height);
      for (const particle of particles) {
        if (advance) {
          particle.update(zones);
        } else {
          particle.draw();
        }
      }
      connect(zones);
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
      const rect = view.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width || window.innerWidth));
      height = Math.max(1, Math.floor(rect.height || window.innerHeight));
      view.width = width;
      view.height = height;
      init();
      revealStartedAt = performance.now();
      paint(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = view.getBoundingClientRect();
      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;
      mouse.x = nextX >= 0 && nextX <= rect.width ? nextX : null;
      mouse.y = nextY >= 0 && nextY <= rect.height ? nextY : null;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
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
