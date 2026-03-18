(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;

  function initScrollReveal() {
    if (initialized) return;
    initialized = true;

    const animatedEls = document.querySelectorAll('.animate');
    animatedEls.forEach((el) => {
      el.classList.add('visible');
      el.classList.remove('animate');
    });

    document.querySelectorAll('.gallery-grid .neon-card').forEach((el) =>
      el.classList.add('visible'),
    );

    const premiumTargets = Array.from(
      document.querySelectorAll(
        [
          '.page-pricing .neon-card',
          '.page-pricing .ss-pricing__card',
          '.page-pricing .commercial-pathway__step',
          '.page-niche .service-row',
          '.page-niche .stats .stat',
          '.page-niche .faq-item',
          '.page-niche .cta-card',
        ].join(','),
      ),
    );

    if (!premiumTargets.length) return;

    premiumTargets.forEach((el, index) => {
      el.classList.add('premium-reveal');
      el.style.setProperty('--reveal-index', String(index % 4));
    });

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      premiumTargets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    premiumTargets.forEach((el) => observer.observe(el));
  }

  window.Silverstone.initScrollReveal = initScrollReveal;
})();
