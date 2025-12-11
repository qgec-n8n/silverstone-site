(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;

  function initScrollReveal() {
    if (initialized) return;
    initialized = true;

    const MOBILE_BREAKPOINT = 768;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const animatedEls = document.querySelectorAll('.animate');
    const mobileViewportForAnimations = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT}px)`,
    ).matches;

    if (animatedEls.length) {
      if (prefersReducedMotion || mobileViewportForAnimations) {
        animatedEls.forEach((el) => el.classList.add('visible'));
      } else {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              }
            });
          },
          { threshold: 0.15 },
        );
        animatedEls.forEach((el) => obs.observe(el));
      }
    }

    // Always reveal neon cards in the gallery grid on page load.
    document.querySelectorAll('.gallery-grid .neon-card').forEach((el) => {
      el.classList.add('visible');
    });
  }

  window.Silverstone.initScrollReveal = initScrollReveal;
})();
