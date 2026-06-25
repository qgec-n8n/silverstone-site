import { useEffect, useRef } from "react";

import type { CapabilityTier } from "~/visual/hooks/use-capability-tier";

// Local bundled particles.js (v2.0.0). Imported as a URL so it can be injected
// as a classic <script> (sloppy mode) — the library uses `arguments.callee`
// internally, which throws under ES-module strict mode. No CDN involved; Vite
// serves/emits the file from the local dependency.
import particlesScriptUrl from "particles.js/particles.js?url";

/*
  Unified body background, ported from the supplied Particles Background
  (particles.js) component. A single fixed canvas sits behind the secondary hero
  and every body section, replacing the former multi-engine backdrop. The base
  gradient, spectral fields and technical grid remain pure CSS so the page reads
  as a calm static surface under no-JS / reduced motion.

  Adaptations from the supplied component:
    - particles.js is bundled locally and loaded as a classic script (no CDN).
    - SSR-guarded: initialisation runs only inside an effect.
    - `retina_detect` is disabled to cap the backing store at CSS pixels (DPR cap).
    - The particle count is reduced on small viewports.
    - The animation pauses while the tab is hidden and is destroyed on unmount.
    - The container is pointer-events:none so it never intercepts page input;
      the supplied interactivity config is preserved but simply never fires.
*/

const MOUNT_ID = "ss-body-particles";
const SCRIPT_ID = "ss-particles-js-vendor";

let scriptPromise: Promise<void> | null = null;

function ensureParticlesLoaded(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("particles.js requires a browser"));
  }
  if (window.particlesJS) {
    return Promise.resolve();
  }
  if (scriptPromise) {
    return scriptPromise;
  }
  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (existing) {
      if (window.particlesJS) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("particles.js failed to load")),
      );
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = particlesScriptUrl;
    script.async = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () =>
      reject(new Error("particles.js failed to load")),
    );
    document.head.appendChild(script);
  });
  return scriptPromise;
}

type BodyParticlesProps = {
  enabled: boolean;
  tier: CapabilityTier;
};

export function BodyParticles({ enabled, tier }: BodyParticlesProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let cancelled = false;

    const destroy = () => {
      const dom = window.pJSDom;
      if (dom && dom.length > 0) {
        for (const entry of dom) {
          try {
            entry.pJS.fn.vendors.destroypJS();
          } catch {
            // ignore teardown races
          }
        }
        window.pJSDom = [];
      }
      const canvas = mount.querySelector("canvas");
      if (canvas) {
        canvas.remove();
      }
    };

    const pauseOnHidden = () => {
      const instance = window.pJSDom?.[0]?.pJS;
      if (!instance) {
        return;
      }
      if (document.hidden) {
        if (instance.drawAnimFrame !== undefined) {
          window.cancelAnimationFrame(instance.drawAnimFrame);
        }
      } else {
        instance.fn.vendors.draw();
      }
    };

    ensureParticlesLoaded()
      .then(() => {
        if (cancelled || !window.particlesJS) {
          return;
        }
        destroy();

        const mobile = window.matchMedia("(max-width: 768px)").matches;

        // Silverstone recolour of the supplied dark config; numbers preserved.
        window.particlesJS(MOUNT_ID, {
          particles: {
            number: {
              value: mobile ? 70 : 140,
              density: { enable: true, value_area: 800 },
            },
            color: { value: "#9fb8e6" },
            shape: { type: "circle", stroke: { width: 0.5, color: "#7aa2ff" } },
            opacity: {
              value: 0.7,
              random: true,
              anim: { enable: true, speed: 1, opacity_min: 0.3 },
            },
            size: {
              value: 3,
              random: true,
              anim: { enable: true, speed: 2, size_min: 1 },
            },
            line_linked: {
              enable: true,
              distance: 160,
              color: "#5e7fb0",
              opacity: 0.4,
              width: 1.2,
            },
            move: { enable: true, speed: 2, random: true, out_mode: "bounce" },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "grab" },
              onclick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              grab: { distance: 220, line_linked: { opacity: 0.8 } },
              push: { particles_nb: 4 },
              repulse: { distance: 180, duration: 0.4 },
            },
          },
          retina_detect: false,
        });

        document.addEventListener("visibilitychange", pauseOnHidden);
      })
      .catch(() => {
        // particles.js failed to load — the static CSS base remains as a
        // graceful fallback, so swallow the error rather than surface it.
      });

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", pauseOnHidden);
      destroy();
    };
  }, [enabled]);

  return (
    <div className="ss-hv2-backdrop" data-tier={tier} aria-hidden="true">
      <div className="ss-hv2-backdrop__base" />
      <div className="ss-hv2-backdrop__fields" />
      <div className="ss-hv2-backdrop__grid" />
      <div
        ref={mountRef}
        id={MOUNT_ID}
        className="ss-hv2-backdrop__particles"
      />
      <div className="ss-hv2-backdrop__noise" />
    </div>
  );
}

export default BodyParticles;
