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

    const premiumTargets = collectPremiumTargets();

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

  function collectPremiumTargets() {
    const groups = [];
    const seen = new Set();
    const body = document.body;

    const sortByVisualFlow = (items) =>
      items
        .slice()
        .sort((a, b) => {
          const rectA = a.getBoundingClientRect();
          const rectB = b.getBoundingClientRect();
          if (Math.abs(rectA.top - rectB.top) > 24) {
            return rectA.top - rectB.top;
          }
          return rectA.left - rectB.left;
        });

    const addGroup = (items) => {
      const unique = sortByVisualFlow(
        items.filter((item) => item && !seen.has(item)),
      );
      if (!unique.length) return;
      unique.forEach((item) => seen.add(item));
      groups.push(...unique);
    };

    const directChildren = (container, selector) =>
      Array.from(container.querySelectorAll(selector));

    if (body.classList.contains('page-home')) {
      document.querySelectorAll('.page-home .packages-grid').forEach((container) => {
        addGroup(directChildren(container, ':scope > .neon-card'));
      });
      document.querySelectorAll('.page-home .proof-grid').forEach((container) => {
        addGroup(directChildren(container, ':scope > .proof-card'));
      });
      document.querySelectorAll('.page-home .faq-list').forEach((container) => {
        addGroup(directChildren(container, ':scope > .faq-item'));
      });
    }

    if (body.classList.contains('page-about')) {
      document.querySelectorAll('.page-about .service-row').forEach((container) => {
        addGroup(
          directChildren(
            container,
            ':scope > .service-image, :scope > .service-content',
          ),
        );
      });
      document.querySelectorAll('.page-about .values').forEach((container) => {
        addGroup(directChildren(container, ':scope > .value-card'));
      });
      document.querySelectorAll('.page-about .drives-grid').forEach((container) => {
        addGroup(directChildren(container, ':scope > .neon-card, :scope > .service-image'));
      });
      document.querySelectorAll('.page-about .section.brand-gradient .cta-card').forEach((card) => {
        addGroup([card]);
      });
    }

    if (body.classList.contains('page-services')) {
      document.querySelectorAll('.page-services .service-row').forEach((container) => {
        addGroup(
          directChildren(
            container,
            ':scope > .service-image, :scope > .service-content',
          ),
        );
      });
      document.querySelectorAll('.page-services .proof-grid').forEach((container) => {
        addGroup(directChildren(container, ':scope > .proof-card'));
      });
      document.querySelectorAll('.page-services .faq-list').forEach((container) => {
        addGroup(directChildren(container, ':scope > .faq-item'));
      });
    }

    if (body.classList.contains('page-niche')) {
      document.querySelectorAll('.page-niche .service-row').forEach((container) => {
        addGroup(
          directChildren(
            container,
            ':scope > .service-image, :scope > .service-content',
          ),
        );
      });
      document.querySelectorAll('.page-niche .values').forEach((container) => {
        addGroup(directChildren(container, ':scope > .value-card'));
      });
      document.querySelectorAll('.page-niche .faq-list').forEach((container) => {
        addGroup(directChildren(container, ':scope > .faq-item'));
      });
      document.querySelectorAll('.page-niche .section.brand-gradient .cta-card').forEach((card) => {
        addGroup([card]);
      });
    }

    return groups;
  }

  window.Silverstone.initScrollReveal = initScrollReveal;
})();
