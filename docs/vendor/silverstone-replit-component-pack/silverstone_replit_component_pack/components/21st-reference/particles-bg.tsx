"use client";

import { useCallback, useEffect, useId } from "react";

declare global {
  interface Window {
    particlesJS?: (id: string, config: unknown) => void;
    pJSDom?: Array<{ pJS: { fn: { vendors: { destroypJS: () => void } } } }>;
  }
}

export default function ParticlesComponent() {
  const reactId = useId();
  const id = `particles-${reactId.replace(/:/g, "")}`;

  const initParticles = useCallback(
    (isDark: boolean) => {
      const host = document.getElementById(id);
      host?.querySelector("canvas")?.remove();

      if (window.pJSDom?.length) {
        window.pJSDom.forEach((entry) => entry.pJS.fn.vendors.destroypJS());
        window.pJSDom = [];
      }

      const colors = isDark
        ? { particles: "#00f5ff", lines: "#00d9ff", accent: "#0096c7" }
        : { particles: "#0277bd", lines: "#0288d1", accent: "#039be5" };

      window.particlesJS?.(id, {
        particles: {
          number: { value: 140, density: { enable: true, value_area: 800 } },
          color: { value: colors.particles },
          shape: { type: "circle", stroke: { width: 0.5, color: colors.accent } },
          opacity: { value: 0.7, random: true, anim: { enable: true, speed: 1, opacity_min: 0.3 } },
          size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 1 } },
          line_linked: { enable: true, distance: 160, color: colors.lines, opacity: 0.4, width: 1.2 },
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
        retina_detect: true,
      });
    },
    [id],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const html = document.documentElement;
    const detectDark = () =>
      html.classList.contains("dark") || html.getAttribute("data-theme") === "dark";

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-silverstone-particles="true"]',
    );

    let script = existing;
    let removeScript = false;
    if (!script) {
      script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      script.async = true;
      script.dataset.silverstoneParticles = "true";
      document.body.appendChild(script);
      removeScript = true;
    }

    const start = () => initParticles(detectDark());
    if (window.particlesJS) start();
    else script.addEventListener("load", start, { once: true });

    const observer = new MutationObserver(start);
    observer.observe(html, { attributes: true, attributeFilter: ["class", "data-theme"] });

    return () => {
      observer.disconnect();
      script?.removeEventListener("load", start);
      document.getElementById(id)?.querySelector("canvas")?.remove();
      if (removeScript && script?.parentNode) script.parentNode.removeChild(script);
    };
  }, [id, initParticles]);

  return (
    <div
      id={id}
      className="absolute inset-0 h-full w-full bg-gradient-to-tr from-[#e3f2fd] via-[#90caf9] to-[#64b5f6] transition-colors duration-500 dark:from-[#000814] dark:via-[#003566] dark:to-[#0077b6]"
    />
  );
}
