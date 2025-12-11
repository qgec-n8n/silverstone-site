(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;

  function initStats() {
    if (initialized) return;
    initialized = true;

    const statsSections = Array.from(document.querySelectorAll('.stats')).filter(
      (section) => section.dataset.counter !== 'off',
    );
    if (!statsSections.length) return;

    const prefersReducedMotionCount = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const animateSection = (section) => {
      const numbers = section.querySelectorAll('.number');
      numbers.forEach((number) => {
        const target = parseInt(number.dataset.target, 10) || 0;
        const plus = number.getAttribute('data-plus') || '';
        if (prefersReducedMotionCount) {
          number.textContent = target.toLocaleString() + plus;
          return;
        }
        const duration = 1500;
        const startTime = performance.now();
        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(progress * target);
          number.textContent =
            current.toLocaleString() + (progress === 1 ? plus : '');
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    };

    statsSections.forEach((section) => {
      let hasAnimated = false;
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              hasAnimated = true;
              animateSection(section);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 },
      );
      observer.observe(section);
    });
  }

  window.Silverstone.initStats = initStats;
})();
