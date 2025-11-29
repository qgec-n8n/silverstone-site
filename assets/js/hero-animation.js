/*! assets/js/hero-animation.js — GSAP + ScrollTrigger Hero Engine & Singularity FSM */
(function () {
  "use strict";

  // --- CONFIGURATION ---
  // The depth effect max value (matches legacy CSS variable --heroDepth)
  const DEPTH_DOWN_MAX = 1.15;
  // Overlay max opacity (matches legacy CSS variable --cineVeil)
  const VEIL_OPACITY_START = 0.45;

  // Session keys
  const SKIP_ANIM_KEY = 'silverstone_skip_hero_anim';
  const ORB_REDIRECT_KEY = 'silverstone_orb_redirect';

  // --- DOM ELEMENTS ---
  function getHeroElements() {
    return {
      hero: document.querySelector('.hero.title-band'),
      content: document.querySelector('.hero.title-band .content'),
      nextSection: document.querySelector('.hero.title-band + section') || document.body.children[2], // fallback
      fxLayer: document.querySelector('.fx-layer'), // Overlay inside hero
      fxBloom: document.querySelector('.fx-bloom'),
      fxAurora: document.querySelector('.fx-aurora'),
      fxVeil: document.querySelector('.fx-veil') // Veil in next section
    };
  }

  // Ensure necessary FX elements exist (ported from legacy script to maintain CSS linkage)
  function ensureFxElements(els) {
    if (!els.hero) return false;

    if (!els.hero.querySelector(".fx-layer")) {
      let l = document.createElement("div"); l.className = "fx-layer"; l.setAttribute("aria-hidden", "true");
      els.hero.insertBefore(l, els.hero.firstChild);
    }
    if (!els.hero.querySelector(".fx-bloom")) {
      let b = document.createElement("div"); b.className = "fx-bloom"; b.setAttribute("aria-hidden", "true");
      els.hero.appendChild(b);
    }
    if (!els.hero.querySelector(".fx-aurora")) {
      let a = document.createElement("div"); a.className = "fx-aurora"; a.setAttribute("aria-hidden", "true");
      els.hero.appendChild(a);
    }

    // Global bars container
    let bars = document.querySelector(".fx-bars");
    if (!bars) {
      bars = document.createElement("div"); bars.className = "fx-bars";
      bars.innerHTML = '<div class="bar top"></div><div class="bar bottom"></div><div class="flare"></div>';
      document.body.appendChild(bars);
    }

    if (els.nextSection && !els.nextSection.querySelector(".fx-veil")) {
      if (getComputedStyle(els.nextSection).position === "static") els.nextSection.style.position = "relative";
      let v = document.createElement("div"); v.className = "fx-veil"; v.setAttribute("aria-hidden", "true");
      els.nextSection.insertBefore(v, els.nextSection.firstChild);
    }

    // Refresh elements after creation
    return getHeroElements();
  }

  // --- STATE MANAGEMENT ---
  function checkSessionState() {
    // Check if we should skip animation (e.g. from Orb or Deep Link)
    const shouldSkip = sessionStorage.getItem(SKIP_ANIM_KEY) === 'true' || !!window.location.hash;
    const isOrbRedirect = sessionStorage.getItem(ORB_REDIRECT_KEY) === 'true';

    return { shouldSkip, isOrbRedirect };
  }

  function applySkippedState(els) {
    // Set CSS variables to final state immediately
    document.documentElement.style.setProperty('--heroProgress', '1');
    document.documentElement.style.setProperty('--heroDepth', DEPTH_DOWN_MAX);
    document.documentElement.style.setProperty('--cineVeil', '0');

    // Add helper class
    document.body.classList.add('hero-anim-skipped');

    // Clean up flags
    sessionStorage.removeItem(SKIP_ANIM_KEY);
  }

  function handleOrbOverlay() {
    // If arriving from Orb, handle the singularity overlay transition
    const overlay = document.querySelector('.singularity-overlay');
    if (overlay) {
      // Ensure it's visible initially if check passed
      overlay.style.opacity = '1';
      overlay.style.display = 'block';

      // Fade out
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          overlay.remove();
        }
      });

      sessionStorage.removeItem(ORB_REDIRECT_KEY);
    }
  }

  // --- ANIMATION LOGIC ---
  function initHeroAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    let els = getHeroElements();
    if (!els.hero) return; // No hero on this page?
    els = ensureFxElements(els);

    const { shouldSkip, isOrbRedirect } = checkSessionState();

    if (shouldSkip) {
      applySkippedState(els);

      if (isOrbRedirect) {
        handleOrbOverlay();
      }

      // REACTIVATION: Watch for user scrolling back to top
      // We observe the hero. If it leaves viewport (it's already above or user is at anchor),
      // and then comes BACK into view, we re-enable.

      // Since we are likely starting scrolled down (anchor), the hero is probably out of view or partially out.
      // We want to detect when we scroll UP to the top.

      let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
             // Hero is back in view (user scrolled up). Reset state and enable animation.
             document.documentElement.style.setProperty('--heroProgress', '0'); // Reset to start? Or let ScrollTrigger take over?
             // Actually, if we just enable ScrollTrigger, it should handle it based on scroll position.
             // But we need to remove the "skipped" static overrides.
             document.body.classList.remove('hero-anim-skipped');

             // Initialize ScrollTrigger if not already
             if (!ScrollTrigger.getById("heroPin")) {
               setupScrollTrigger(els);
             }

             observer.disconnect();
          }
        });
      }, { threshold: [0.1, 0.5] });

      observer.observe(els.hero);

      // Even if skipped, we might need to set the ScrollTrigger if the user is AT the anchor but the hero is still technically "above".
      // But if we pin it, it might jump. The user request says: "If the user scrolls upward ... trigger a re-init".
      // So initially do nothing.

    } else {
      // Normal load: Setup ScrollTrigger
      setupScrollTrigger(els);
    }
  }

  function setupScrollTrigger(els) {
    // Define the animation timeline
    // The hero stays pinned while we scrub through the timeline

    // We want the hero to pin for a certain distance, simulating the "cinematic" feel.
    // The legacy script used a custom delta/duration. We can use a scroll distance, e.g., 100vh or 150vh.

    let tl = gsap.timeline({
      scrollTrigger: {
        id: "heroPin",
        trigger: els.hero,
        start: "top top",
        end: "+=100%", // Pin for 1x viewport height duration
        pin: true,
        scrub: true,
        onUpdate: (self) => {
            // Update CSS variables for complex effects defined in CSS (bloom, aurora, etc)
            // We can map progress 0-1 to the variables
            let p = self.progress;

            // Replicate legacy easing curves if possible, or use linear scrub mapping
            // Legacy had: var depth = depthFrom + (depthTo - depthFrom) * Math.pow(e, dir === "down" ? 0.88 : 1);
            // We'll stick to linear mapping for simplicity and smoothness via scrub.

            document.documentElement.style.setProperty('--heroProgress', p);

            // Depth: 0 -> 1.15
            let depth = p * DEPTH_DOWN_MAX;
            document.documentElement.style.setProperty('--heroDepth', depth);

            // Veil: 0.45 -> 0 (fade out veil on next section? Wait, legacy: veil fades OUT as we go down?
            // "veil = (dir === "down" ? 0.45 * (1 - e) : ...)" -> Yes, starts at 0.45, ends at 0.
            let veil = VEIL_OPACITY_START * (1 - p);
            document.documentElement.style.setProperty('--cineVeil', veil);

            // Extra effects from CSS
            // Aurora, Bloom, Bars - driven by scroll direction/speed in legacy, or just progress.
            // Legacy: "bloom = Math.pow(Math.sin(Math.PI * t), 1.2) * 0.8" -> based on time in transition.
            // Here 'p' is position. We can use p to drive a "flash" if we want, but simple is better.
            // Let's mimic the "flash" in the middle of the scroll.
            let sinP = Math.sin(Math.PI * p);
            document.documentElement.style.setProperty('--cineBloom', Math.pow(sinP, 1.2) * 0.8);
            document.documentElement.style.setProperty('--cineAurora', Math.pow(sinP, 1.15));
            document.documentElement.style.setProperty('--cineBars', Math.sin(Math.PI * p) ** 0.9); // Bars appear during transition
        }
      }
    });

    // We can also animate GSAP properties directly if not relying solely on CSS vars
    // But the CSS vars drive the existing complex CSS animations (gradients, transforms), so updating them in onUpdate is best.
  }

  // Init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroAnimation);
  } else {
    initHeroAnimation();
  }

})();
