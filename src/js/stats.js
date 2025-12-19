(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  // SS_STATS_SPEC: COUNTER_ANIMATION_ABOUT_INDEX_ONLY
  let initialized = false;

  function initStats() {
    if (initialized) return;
    initialized = true;

    const statsSections = Array.from(
      document.querySelectorAll('.stats[data-counter="on"]'),
    );
    if (!statsSections.length) return;

    const reduceMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const setNumberValue = (number, value) => {
      const plus = number.getAttribute('data-plus') || '';
      number.textContent = value.toLocaleString() + plus;
    };

    const setSectionFinalValues = (section) => {
      const numbers = section.querySelectorAll('.number[data-target]');
      numbers.forEach((number) => {
        const target = parseInt(number.dataset.target, 10) || 0;
        setNumberValue(number, target);
      });
    };

    const animateNumber = (number) => {
      if (number.dataset.ssCounterDone === '1') return;
      number.dataset.ssCounterDone = '1';

      const target = parseInt(number.dataset.target, 10) || 0;
      if (target <= 0) {
        setNumberValue(number, 0);
        return;
      }

      const durationMs = 2600; // SS_STATS_SPEC: COUNTER_DURATION_SLOWDOWN_2600MS
      const startValue = 0;
      let startTime = null;

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        if (startTime === null) startTime = now;
        const progress = Math.min((now - startTime) / durationMs, 1);
        const eased = easeOutCubic(progress);
        const value = Math.round(startValue + (target - startValue) * eased);
        setNumberValue(number, value);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setNumberValue(number, target);
        }
      };

      window.requestAnimationFrame(step);
    };

    if (reduceMotionQuery.matches) {
      statsSections.forEach(setSectionFinalValues);
      return;
    }

    const startSectionAnimation = (section) => {
      if (section.dataset.ssCountersStarted === '1') return;
      section.dataset.ssCountersStarted = '1';
      const numbers = section.querySelectorAll('.number[data-target]');
      numbers.forEach(animateNumber);
    };

    if (typeof IntersectionObserver === 'undefined') {
      statsSections.forEach(startSectionAnimation);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          startSectionAnimation(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25 },
    );

    statsSections.forEach((section) => observer.observe(section));
  }

  window.Silverstone.initStats = initStats;
})();
