/*
  Silverstone "Precision Luminescence" prototype behaviour.
  Plain ES module, no build step, no external network. Mirrors the production
  intent: progressive enhancement, capability tiering, and a hard-gated,
  deferred WebGL signal field that always degrades to a static poster.
*/

import { renderConstellation } from "/prototypes/assets/constellation.js";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------- */
/* Capability tiering                                               */
/* ---------------------------------------------------------------- */
function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

/*
  Tier A  -> static poster + deferred shader enhancement (desktop, capable)
  Tier B  -> static poster only, full motion reveal (capable, < 1024px)
  Tier C  -> static end-state, no decorative motion (reduced motion / low power)
*/
function resolveCapabilityTier() {
  if (prefersReducedMotion()) return "C";

  const lowPower =
    (typeof navigator.deviceMemory === "number" && navigator.deviceMemory < 4) ||
    (typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency < 4) ||
    Boolean(navigator.connection && navigator.connection.saveData);

  if (lowPower) return "C";

  const wideEnough = window.matchMedia("(min-width: 1024px)").matches;
  if (wideEnough && detectWebGL()) return "A";

  return "B";
}

/* ---------------------------------------------------------------- */
/* Navigation: sticky compaction                                    */
/* ---------------------------------------------------------------- */
function initStickyNav() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  let compact = false;
  const onScroll = () => {
    const shouldCompact = window.scrollY > 80;
    if (shouldCompact !== compact) {
      compact = shouldCompact;
      nav.setAttribute("data-compact", String(compact));
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------------------------------------------------------- */
/* Navigation: desktop disclosures (one open at a time)             */
/* ---------------------------------------------------------------- */
function initDisclosures() {
  const groups = Array.from(document.querySelectorAll("[data-disclosure]"));
  if (groups.length === 0) return;

  const closeAll = (except) => {
    for (const group of groups) {
      if (group === except) continue;
      const trigger = group.querySelector("[aria-expanded]");
      const panel = group.querySelector("[data-disclosure-panel]");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (panel) panel.setAttribute("data-open", "false");
    }
  };

  for (const group of groups) {
    const trigger = group.querySelector("[aria-expanded]");
    const panel = group.querySelector("[data-disclosure-panel]");
    if (!trigger || !panel) continue;

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const open = trigger.getAttribute("aria-expanded") === "true";
      closeAll(group);
      trigger.setAttribute("aria-expanded", String(!open));
      panel.setAttribute("data-open", String(!open));
    });
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-disclosure]")) closeAll(null);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll(null);
  });
}

/* ---------------------------------------------------------------- */
/* Generic toggle (mobile panel, scope preview)                     */
/* ---------------------------------------------------------------- */
function initToggles() {
  const toggles = Array.from(document.querySelectorAll("[data-toggle]"));
  for (const toggle of toggles) {
    const targetId = toggle.getAttribute("data-toggle");
    const target = document.getElementById(targetId);
    if (!target) continue;

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      target.setAttribute("data-open", String(!open));
    });
  }
}

/* ---------------------------------------------------------------- */
/* Constellation reveal (one-shot, storyboard-driven)               */
/* ---------------------------------------------------------------- */
function initConstellation(tier) {
  const stages = Array.from(document.querySelectorAll("[data-stage]"));
  if (stages.length === 0) return;

  for (const stage of stages) {
    // Inject the single-source-of-truth diagram into its placeholder.
    const host = stage.querySelector("[data-constellation]");
    if (host && !host.hasChildNodes()) renderConstellation(host);

    // Measure each connection path so the line-draw is exact, not guessed.
    const paths = Array.from(stage.querySelectorAll(".ss-link-path"));
    for (const path of paths) {
      const len = Math.ceil(path.getTotalLength());
      path.style.setProperty("--len", String(len));
    }

    if (tier === "C") {
      // Static end-state: everything present, no motion.
      stage.setAttribute("data-motion", "off");
      stage.setAttribute("data-revealed", "true");
      continue;
    }

    // Reveal once when the stage scrolls into view.
    const reveal = () => {
      stage.setAttribute("data-revealed", "true");
      if (tier === "A") {
        window.setTimeout(() => stage.setAttribute("data-idle", "true"), 800);
      }
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              reveal();
              observer.disconnect();
            }
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(stage);
    } else {
      reveal();
    }
  }
}

/* ---------------------------------------------------------------- */
/* Deferred WebGL signal field (Tier A only, hard-gated)            */
/* ---------------------------------------------------------------- */
function initShader(tier) {
  if (tier !== "A") return;

  const canvas = document.querySelector("[data-shader-canvas]");
  if (!canvas) return;

  const stage = canvas.closest("[data-stage]") || canvas.parentElement;
  let field = null;
  let started = false;

  const startWhenIdle = () => {
    const boot = async () => {
      try {
        const module = await import("/prototypes/assets/signal-field-shader.js");
        field = module.createSignalField(canvas);
        if (!field) return;
        // Poster stays underneath; canvas fades in only once drawing.
        canvas.setAttribute("data-active", "true");

        // Pause when the tab is hidden.
        document.addEventListener("visibilitychange", () => {
          if (!field) return;
          if (document.hidden) field.stop();
          else if (isOnscreen) field.start();
        });

        // Restore the static poster on context loss.
        canvas.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            canvas.setAttribute("data-active", "false");
            if (field) field.stop();
          },
          false,
        );

        if (isOnscreen) field.start();
        started = true;
      } catch {
        // Any failure leaves the static poster in place — no error surfaced.
        canvas.setAttribute("data-active", "false");
      }
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(boot, { timeout: 1500 });
    } else {
      window.setTimeout(boot, 600);
    }
  };

  // Only run while the stage is on screen.
  let isOnscreen = false;
  if ("IntersectionObserver" in window && stage) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isOnscreen = entry.isIntersecting;
          if (isOnscreen && !started) startWhenIdle();
          else if (field) {
            if (isOnscreen && !document.hidden) field.start();
            else field.stop();
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(stage);
  } else {
    isOnscreen = true;
    startWhenIdle();
  }
}

/* ---------------------------------------------------------------- */
/* Loading skeleton hand-off (demonstration)                        */
/* ---------------------------------------------------------------- */
function initSkeletons() {
  const hosts = Array.from(document.querySelectorAll("[data-skeleton-host]"));
  for (const host of hosts) {
    const settle = () => host.setAttribute("data-loaded", "true");
    // Simulate content settling after first paint for the loading demo.
    if (prefersReducedMotion()) settle();
    else window.setTimeout(settle, 900);
  }
}

/* ---------------------------------------------------------------- */
/* Boot                                                             */
/* ---------------------------------------------------------------- */
function boot() {
  const tier = resolveCapabilityTier();
  document.documentElement.setAttribute("data-capability", tier);

  initStickyNav();
  initDisclosures();
  initToggles();
  initConstellation(tier);
  initSkeletons();
  initShader(tier);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
