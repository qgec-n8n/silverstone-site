import { useEffect, useRef } from "react";

import { cn } from "~/lib/utils";

/*
  Local Canvas-2D particle field — a dependency-free TypeScript reimplementation
  of the component pack's "Aether Flow" interactive layer and the legacy
  particles.js background (no CDN, no runtime fetch). Drifting luminous points,
  optional pointer repulsion and optional distance-linked threads, all tinted
  with the Silverstone spectral palette.

  Constraints honoured: SSR-safe (all DOM work in an effect; the element is just
  a <canvas>), DPR capped, rAF paused on hidden tab / offscreen stage, particle
  count derived from area and hard-capped, full teardown on unmount, and a calm
  single static frame under `prefers-reduced-motion`.
*/

export type ParticleFieldProps = {
  className?: string;
  /** Hex colours particles are tinted with (cycled per particle). */
  colors?: string[];
  /** Particle target per 1,000,000 CSS px², before the hard cap. */
  density?: number;
  /** Absolute particle ceiling regardless of viewport size. */
  maxParticles?: number;
  /** Base drift speed multiplier (CSS px per frame). */
  speed?: number;
  /** Distance (CSS px) under which two particles link. 0 disables threads. */
  linkDistance?: number;
  /** Pointer repulsion driven by the cursor over the canvas bounds. */
  interactive?: boolean;
  /** Pointer influence radius in CSS px. */
  pointerRadius?: number;
  /** Soft glow radius (canvas shadowBlur) in CSS px. */
  glow?: number;
  /** Device-pixel-ratio ceiling. */
  dprCap?: number;
  /** Base alpha for dots (0–1). */
  opacity?: number;
};

const DEFAULT_COLORS = ["#5ec5d0", "#7aa2ff", "#a97bd6", "#e06cc4", "#f06aa6"];
const FALLBACK_COLOR = "#7aa2ff";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
};

export function ParticleField({
  className,
  colors = DEFAULT_COLORS,
  density = 70,
  maxParticles = 90,
  speed = 1,
  linkDistance = 0,
  interactive = false,
  pointerRadius = 130,
  glow = 12,
  dprCap = 1.5,
  opacity = 0.7,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return undefined;
    }

    const palette = colors.length > 0 ? colors : DEFAULT_COLORS;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cssW = canvas.clientWidth || 1;
    let cssH = canvas.clientHeight || 1;
    let particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const build = () => {
      const target = Math.min(
        maxParticles,
        Math.max(8, Math.round((cssW * cssH * density) / 1_000_000)),
      );
      const next: Particle[] = [];
      for (let i = 0; i < target; i += 1) {
        const angle = rand(0, Math.PI * 2);
        const v = rand(0.15, 0.5) * speed;
        next.push({
          x: rand(0, cssW),
          y: rand(0, cssH),
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          r: rand(0.8, 2.2),
          color: palette[i % palette.length] ?? FALLBACK_COLOR,
        });
      }
      particles = next;
    };

    const resize = () => {
      cssW = canvas.clientWidth || 1;
      cssH = canvas.clientHeight || 1;
      const dpr = Math.min(Math.max(1, window.devicePixelRatio || 1), dprCap);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const drawDots = (animated: boolean) => {
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        if (animated) {
          p.x += p.vx;
          p.y += p.vy;

          if (interactive && pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const distSq = dx * dx + dy * dy;
            const radSq = pointerRadius * pointerRadius;
            if (distSq < radSq && distSq > 0.01) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / pointerRadius) * 0.7;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }

          if (p.x < -12) {
            p.x = cssW + 12;
          } else if (p.x > cssW + 12) {
            p.x = -12;
          }
          if (p.y < -12) {
            p.y = cssH + 12;
          } else if (p.y > cssH + 12) {
            p.y = -12;
          }
        }

        ctx.globalAlpha = opacity;
        ctx.shadowBlur = glow;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      if (linkDistance > 0) {
        const maxSq = linkDistance * linkDistance;
        for (let i = 0; i < particles.length; i += 1) {
          for (let j = i + 1; j < particles.length; j += 1) {
            const a = particles[i];
            const b = particles[j];
            if (!a || !b) {
              continue;
            }
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxSq) {
              const t = 1 - distSq / maxSq;
              ctx.globalAlpha = t * 0.18 * opacity;
              ctx.strokeStyle = a.color;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    let running = false;
    let tabVisible = !document.hidden;
    let onScreen = true;

    const loop = () => {
      if (!running) {
        return;
      }
      drawDots(true);
      raf = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce) {
        return;
      }
      running = true;
      raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
      raf = 0;
    };

    const sync = () => {
      if (tabVisible && onScreen) {
        start();
      } else {
        stop();
      }
    };

    resize();
    if (reduce) {
      drawDots(false);
    }

    const onVisibility = () => {
      tabVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeObserver: ResizeObserver | null = null;
    let resizeRaf = 0;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        if (resizeRaf) {
          window.cancelAnimationFrame(resizeRaf);
        }
        resizeRaf = window.requestAnimationFrame(() => {
          resize();
          if (reduce) {
            drawDots(false);
          }
        });
      });
      resizeObserver.observe(canvas);
    }

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) {
            onScreen = entry.isIntersecting;
            sync();
          }
        },
        { threshold: 0.01 },
      );
      intersectionObserver.observe(canvas);
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.x = x;
      pointer.y = y;
      pointer.active =
        x >= -pointerRadius &&
        x <= cssW + pointerRadius &&
        y >= -pointerRadius &&
        y <= cssH + pointerRadius;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    if (interactive && !reduce) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerout", onPointerLeave, { passive: true });
    }

    if (!reduce) {
      sync();
    }

    return () => {
      stop();
      if (resizeRaf) {
        window.cancelAnimationFrame(resizeRaf);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      if (interactive && !reduce) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerout", onPointerLeave);
      }
    };
  }, [
    colors,
    density,
    maxParticles,
    speed,
    linkDistance,
    interactive,
    pointerRadius,
    glow,
    dprCap,
    opacity,
  ]);

  return <canvas ref={canvasRef} className={cn(className)} aria-hidden="true" />;
}

export default ParticleField;
