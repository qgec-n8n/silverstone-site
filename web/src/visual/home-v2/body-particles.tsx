import { useEffect, useId, useMemo } from "react";

import type { CapabilityTier } from "~/visual/hooks/use-capability-tier";

/*
  Unified body background. The static CSS layers keep the page legible when
  motion is off; this component adds the required local particles.js package as
  a classic script because the v2 bundle depends on sloppy-mode globals.
*/

type BodyParticlesProps = {
  enabled: boolean;
  onReady?: (status: "fallback" | "ready") => void;
  tier: CapabilityTier;
};

type WindowListener = {
  listener: EventListenerOrEventListenerObject;
  options: AddEventListenerOptions | boolean | undefined;
  type: string;
};

let particlesScriptReady: Promise<void> | undefined;
const particlesScriptUrl = "/vendor/particles.js";

function ensureParticlesScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (window.particlesJS) {
    return Promise.resolve();
  }
  if (particlesScriptReady) {
    return particlesScriptReady;
  }

  particlesScriptReady = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-silverstone-particles="local"]',
    );
    const script = existing ?? document.createElement("script");

    const handleLoad = () => resolve();
    const handleError = () => reject(new Error("Unable to load local particles.js"));

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existing) {
      script.async = true;
      script.dataset.silverstoneParticles = "local";
      script.dataset.silverstoneParticlesPackage = "particles.js";
      script.src = particlesScriptUrl;
      document.head.appendChild(script);
    }

    if (window.particlesJS) {
      resolve();
    }
  });

  return particlesScriptReady;
}

function sanitizeReactId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "");
}

function particleInstances(): NonNullable<Window["pJSDom"]> {
  return Array.isArray(window.pJSDom) ? window.pJSDom : [];
}

function isMountInstance(
  entry: NonNullable<Window["pJSDom"]>[number],
  mount: HTMLElement,
): boolean {
  const canvas = entry.pJS.canvas?.el;
  return Boolean(canvas && mount.contains(canvas));
}

function findMountInstance(mount: HTMLElement) {
  return particleInstances().find((entry) => isMountInstance(entry, mount));
}

function destroyMountInstances(mount: HTMLElement) {
  const entries = particleInstances();
  const remaining = entries.filter((entry) => !isMountInstance(entry, mount));

  for (const entry of entries) {
    if (!isMountInstance(entry, mount)) {
      continue;
    }
    try {
      entry.pJS.fn.vendors.destroypJS();
    } catch {
      // particles.js can throw if React Strict Mode already removed the canvas.
    }
  }

  mount.querySelectorAll("canvas.particles-js-canvas-el").forEach((canvas) => {
    canvas.remove();
  });
  window.pJSDom = remaining;
}

function createParticlesConfig(coarsePointer: boolean, mobile: boolean) {
  return {
    particles: {
      number: {
        value: mobile ? 64 : 128,
        density: {
          enable: true,
          value_area: mobile ? 700 : 900,
        },
      },
      color: {
        value: "#BB8AD4",
      },
      shape: {
        type: "circle",
        stroke: { width: 0, color: "#000000" },
      },
      opacity: {
        value: 0.82,
        random: true,
        anim: {
          enable: true,
          speed: 0.8,
          opacity_min: 0.4,
          sync: false,
        },
      },
      size: {
        value: mobile ? 2.4 : 2.8,
        random: true,
        anim: {
          enable: true,
          speed: 1.4,
          size_min: 0.7,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: mobile ? 144 : 188,
        color: "#BB8AD4",
        opacity: mobile ? 0.42 : 0.56,
        width: 1,
      },
      move: {
        enable: true,
        speed: mobile ? 0.55 : 0.82,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "bounce",
        bounce: true,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: !coarsePointer,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: mobile ? 160 : 230,
          line_linked: {
            opacity: mobile ? 0.72 : 0.9,
          },
        },
        bubble: {
          distance: 220,
          size: 12,
          duration: 1,
          opacity: 0.7,
          speed: 2,
        },
        repulse: {
          distance: 160,
          duration: 0.4,
        },
        push: {
          particles_nb: mobile ? 2 : 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  };
}

function initializeParticles(
  mountId: string,
  config: Record<string, unknown>,
  capturedWindowListeners: WindowListener[],
) {
  const originalAddEventListener = window.addEventListener;
  const trackedAddEventListener = function addEventListener(
    this: Window,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ) {
    if (type === "resize") {
      capturedWindowListeners.push({ listener, options, type });
    }
    return originalAddEventListener.call(this, type, listener, options);
  } as typeof window.addEventListener;

  window.addEventListener = trackedAddEventListener;
  try {
    window.particlesJS?.(mountId, config);
  } finally {
    window.addEventListener = originalAddEventListener;
  }
}

export function BodyParticles({ enabled, onReady, tier }: BodyParticlesProps) {
  const reactId = useId();
  const mountId = useMemo(
    () => `ss-body-particles-${sanitizeReactId(reactId)}`,
    [reactId],
  );

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      onReady?.("fallback");
      return undefined;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onReady?.("fallback");
      return undefined;
    }

    const mount = document.getElementById(mountId);
    if (!mount) {
      return undefined;
    }

    let cancelled = false;
    let pausedForVisibility = false;
    const capturedWindowListeners: WindowListener[] = [];
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    const pauseInstance = () => {
      const instance = findMountInstance(mount);
      const frame = instance?.pJS.fn.drawAnimFrame;
      if (typeof frame === "number") {
        window.cancelAnimationFrame(frame);
      }
      pausedForVisibility = true;
    };

    const resumeInstance = () => {
      const instance = findMountInstance(mount);
      if (!instance || !pausedForVisibility) {
        return;
      }
      pausedForVisibility = false;
      instance.pJS.fn.vendors.draw();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseInstance();
      } else {
        resumeInstance();
      }
    };

    const dispatchCanvasMouseEvent = (
      event: MouseEvent | PointerEvent,
      type: "click" | "mousemove",
    ) => {
      if (coarsePointer) {
        return;
      }
      const canvas = mount.querySelector<HTMLCanvasElement>(
        "canvas.particles-js-canvas-el",
      );
      if (!canvas) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }
      canvas.dispatchEvent(
        new MouseEvent(type, {
          bubbles: false,
          clientX: event.clientX,
          clientY: event.clientY,
        }),
      );
    };

    const handlePointerMove = (event: PointerEvent) => {
      dispatchCanvasMouseEvent(event, "mousemove");
    };

    const handleClick = (event: MouseEvent) => {
      dispatchCanvasMouseEvent(event, "click");
    };

    const handlePointerLeave = () => {
      const canvas = mount.querySelector<HTMLCanvasElement>(
        "canvas.particles-js-canvas-el",
      );
      canvas?.dispatchEvent(new MouseEvent("mouseleave", { bubbles: false }));
    };

    const start = async () => {
      try {
        await ensureParticlesScript();
      } catch {
        if (!cancelled) {
          onReady?.("fallback");
        }
        return;
      }
      if (cancelled) {
        return;
      }
      if (!window.particlesJS) {
        onReady?.("fallback");
        return;
      }
      destroyMountInstances(mount);
      initializeParticles(
        mountId,
        createParticlesConfig(coarsePointer, mobile),
        capturedWindowListeners,
      );
      onReady?.("ready");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    void start();

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("pointerleave", handlePointerLeave);
      for (const { listener, options, type } of capturedWindowListeners) {
        window.removeEventListener(type, listener, options);
      }
      destroyMountInstances(mount);
    };
  }, [enabled, mountId, onReady]);

  return (
    <div
      className="ss-hv2-backdrop"
      data-particles-package="particles.js"
      data-particles-script={particlesScriptUrl}
      data-tier={tier}
      aria-hidden="true"
    >
      <div className="ss-hv2-backdrop__base" />
      <div className="ss-hv2-backdrop__fields" />
      <div className="ss-hv2-backdrop__grid" />
      <div
        id={mountId}
        className="ss-hv2-backdrop__particles"
        data-particles-host="body"
      />
      <div className="ss-hv2-backdrop__noise" />
    </div>
  );
}

export default BodyParticles;
