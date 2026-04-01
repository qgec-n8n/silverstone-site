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

    const premiumTargets = collectPremiumTargets();

    if (!premiumTargets.length) return;

    premiumTargets.forEach((el) => {
      el.classList.add('premium-reveal');
      if (el.dataset.revealText === '1') {
        el.classList.add('premium-reveal--text');
      }
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

    const addGroup = (items, options) => {
      const unique = items.filter((item) => item && !seen.has(item));
      if (!unique.length) return;
      unique.forEach((item, index) => {
        seen.add(item);
        if (options && options.text) {
          item.dataset.revealText = '1';
        } else {
          delete item.dataset.revealText;
        }
        item.style.setProperty('--reveal-index', String(index));
        groups.push(item);
      });
    };

    const directChildren = (container, selector) =>
      Array.from(container.querySelectorAll(selector));

    const addHeadingPairBefore = (target) => {
      if (!target) return;

      let title = null;
      let subtitle = null;
      let node = target.previousElementSibling;

      while (node) {
        if (!subtitle && node.matches('.section-subtitle')) {
          subtitle = node;
          node = node.previousElementSibling;
          continue;
        }

        if (node.matches('.section-title')) {
          title = node;
          break;
        }

        node = node.previousElementSibling;
      }

      addGroup([title, subtitle].filter(Boolean), { text: true });
    };

    if (body.classList.contains('page-home')) {
      addGroup(Array.from(document.querySelectorAll('.page-home .features .feature-card')));
      addGroup(Array.from(document.querySelectorAll('.page-home .primary-site-links-grid .primary-site-link')));
      addGroup(Array.from(document.querySelectorAll('.page-home #primary-site-links .primary-site-links-card')));
      addGroup(Array.from(document.querySelectorAll('.page-home #industry-service-directory .industry-directory-shell')));
      addGroup(Array.from(document.querySelectorAll('.page-home #industry-service-directory .industry-directory-card')));
      addGroup(Array.from(document.querySelectorAll('.page-home #pricing .primary-site-links-card')));
      addGroup(Array.from(document.querySelectorAll('.page-home #what-we-automate .service-tile')));
      addGroup(Array.from(document.querySelectorAll('.page-home .proof-grid .proof-card')));
      addGroup(Array.from(document.querySelectorAll('.page-home .faq-list .faq-item')));
      addGroup(Array.from(document.querySelectorAll('.page-home .section.brand-gradient .cta-card')));

      document.querySelectorAll('.page-home .features').forEach(addHeadingPairBefore);
      document.querySelectorAll('.page-home .packages-grid').forEach(addHeadingPairBefore);
      document.querySelectorAll('.page-home .proof-grid').forEach(addHeadingPairBefore);
      document.querySelectorAll('.page-home .faq-list').forEach(addHeadingPairBefore);
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
        addHeadingPairBefore(container);
        addGroup(directChildren(container, ':scope > .value-card'));
      });
      document.querySelectorAll('.page-about .drives-grid').forEach((container) => {
        addHeadingPairBefore(container);
        addGroup(directChildren(container, ':scope > .neon-card, :scope > .service-image, :scope > .gallery-card'));
      });
      addGroup(Array.from(document.querySelectorAll('.page-about .section.brand-gradient .cta-card')));
    }

    if (body.classList.contains('page-services')) {
      document.querySelectorAll('.page-services .service-row').forEach((container) => {
        addHeadingPairBefore(container);
        addGroup(
          directChildren(
            container,
            ':scope > .service-image, :scope > .service-content',
          ),
        );
      });
      addGroup(Array.from(document.querySelectorAll('.page-services .commercial-pathway')));
      addGroup(Array.from(document.querySelectorAll('#service-page-clusters .industry-directory-shell')));
      addGroup(Array.from(document.querySelectorAll('#service-page-clusters .industry-directory-card')));
      document.querySelectorAll('.page-services .values').forEach((container) => {
        addHeadingPairBefore(container);
        addGroup(directChildren(container, ':scope > .value-card'));
      });
      document.querySelectorAll('.page-services .faq-list').forEach((container) => {
        addHeadingPairBefore(container);
        addGroup(directChildren(container, ':scope > .faq-item'));
      });
      addGroup(Array.from(document.querySelectorAll('#pricing .cta-card')));
      addGroup(Array.from(document.querySelectorAll('#service-supporting-guides .services-resource-shell')));
      addGroup(Array.from(document.querySelectorAll('.page-services .section.brand-gradient .cta-card')));
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

    if (body.classList.contains('page-pricing')) {
      addGroup(Array.from(document.querySelectorAll('.page-pricing .faq-list .faq-item')));
      addGroup(Array.from(document.querySelectorAll('.page-pricing .section.brand-gradient .cta-card')));
    }

    if (body.classList.contains('page-blog')) {
      addGroup(Array.from(document.querySelectorAll('.page-blog #blog-industry-directory')));
      addGroup(Array.from(document.querySelectorAll('.page-blog #blog-industry-directory .industry-directory-card')));
      addGroup(Array.from(document.querySelectorAll('.page-blog .section.brand-gradient .cta-card')));
    }

    if (body.classList.contains('page-book')) {
      addGroup(Array.from(document.querySelectorAll('.page-book .section.brand-gradient .cta-card')));
    }

    return groups;
  }

  window.Silverstone.initScrollReveal = initScrollReveal;
})();
