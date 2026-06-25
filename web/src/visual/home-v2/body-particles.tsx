import { useEffect, useRef } from "react";

import type { CapabilityTier } from "~/visual/hooks/use-capability-tier";

/*
  Unified body background. The static CSS layers keep the page legible when
  motion is off; this component adds a single local canvas with one RAF owner.
  Pointer tracking is window-based, relative to the canvas, so the fixed layer
  remains pointer-events:none and never intercepts page input.
*/

type BodyParticlesProps = {
  enabled: boolean;
  tier: CapabilityTier;
};

type Particle = {
  color: string;
  radius: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

const PARTICLE_COLORS = [
  "34, 211, 238",
  "56, 189, 248",
  "91, 98, 240",
  "124, 92, 255",
  "211, 107, 203",
  "233, 234, 239",
] as const;

function createParticle(width: number, height: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.08 + Math.random() * 0.12;
  return {
    color:
      PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)] ??
      PARTICLE_COLORS[0],
    radius: 0.9 + Math.random() * 1.9,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    x: Math.random() * width,
    y: Math.random() * height,
  };
}

export function BodyParticles({ enabled, tier }: BodyParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return undefined;
    }

    const ctx = context;
    const pointer = {
      active: false,
      coarse: window.matchMedia("(pointer: coarse)").matches,
      x: 0,
      y: 0,
    };
    let animationFrame = 0;
    let dpr = 1;
    let height = 0;
    let running = false;
    let width = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = window.matchMedia("(max-width: 768px)").matches;
      const targetCount = mobile ? 46 : 86;
      particles = Array.from({ length: targetCount }, () =>
        createParticle(width, height),
      );
    };

    const drawLink = (
      ax: number,
      ay: number,
      bx: number,
      by: number,
      opacity: number,
      color = "125, 233, 240",
    ) => {
      ctx.strokeStyle = `rgba(${color}, ${opacity.toFixed(3)})`;
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color}, 0.72)`;
        ctx.fill();
      }

      for (let a = 0; a < particles.length; a += 1) {
        const pa = particles[a];
        if (!pa) continue;

        for (let b = a + 1; b < particles.length; b += 1) {
          const pb = particles[b];
          if (!pb) continue;
          const dx = pa.x - pb.x;
          const dy = pa.y - pb.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 145) {
            drawLink(pa.x, pa.y, pb.x, pb.y, (1 - distance / 145) * 0.18);
          }
        }

        if (!pointer.coarse && pointer.active) {
          const dx = pa.x - pointer.x;
          const dy = pa.y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 0 && distance < 190) {
            const force = (1 - distance / 190) * 0.012;
            pa.vx += (dx / distance) * force;
            pa.vy += (dy / distance) * force;
            pa.vx *= 0.992;
            pa.vy *= 0.992;
            drawLink(
              pa.x,
              pa.y,
              pointer.x,
              pointer.y,
              (1 - distance / 190) * 0.42,
              "244, 250, 255",
            );
          }
        }
      }
    };

    const tick = () => {
      if (!running) {
        return;
      }
      paint();
      animationFrame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || document.hidden) {
        return;
      }
      running = true;
      animationFrame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (pointer.coarse) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active =
        pointer.x >= 0 &&
        pointer.x <= rect.width &&
        pointer.y >= 0 &&
        pointer.y <= rect.height;
    };

    const clearPointer = () => {
      pointer.active = false;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", clearPointer);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", clearPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      ctx.clearRect(0, 0, width, height);
    };
  }, [enabled]);

  return (
    <div className="ss-hv2-backdrop" data-tier={tier} aria-hidden="true">
      <div className="ss-hv2-backdrop__base" />
      <div className="ss-hv2-backdrop__fields" />
      <div className="ss-hv2-backdrop__grid" />
      <canvas ref={canvasRef} className="ss-hv2-backdrop__particles" />
      <div className="ss-hv2-backdrop__noise" />
    </div>
  );
}

export default BodyParticles;
