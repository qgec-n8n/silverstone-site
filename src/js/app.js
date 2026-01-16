(function () {
  'use strict';

  function ensureStylesheet(href) {
    if (document.querySelector(`link[href*="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./${href}`;
    document.head.appendChild(link);
  }

  function loadBaseStyles() {
    ensureStylesheet('assets/css/custom.css');
    ensureStylesheet('assets/css/mobile.css');
  }

  function initDesktopScrollSupport() {
    const DESKTOP_MIN_WIDTH = 769;
    if (!window.matchMedia) return;

    const desktopQuery = window.matchMedia(
      `(min-width: ${DESKTOP_MIN_WIDTH}px)`,
    );
    const root = document.documentElement;
    const body = document.body;

    const isDesktop = () => desktopQuery.matches;
    const isPricingScrollTarget = (target) =>
      !!target &&
      typeof target.closest === 'function' &&
      !!target.closest('.ss-pricing__includes-body');

    const isScrollLockActive = () => {
      if (body.classList.contains('mobile-nav-open')) return true;
      if (document.querySelector('.services-overlay.active')) return true;
      if (document.querySelector('.premium-lightbox.active')) return true;
      const navMenu = document.querySelector('nav ul');
      if (navMenu && navMenu.classList.contains('open')) return true;
      return false;
    };

    const isLockedOverflow = (value) => value === 'hidden' || value === 'clip';

    const unlockDesktopScroll = () => {
      if (!isDesktop()) return;
      if (isScrollLockActive()) return;

      if (isLockedOverflow(body.style.overflow)) body.style.overflow = '';
      if (isLockedOverflow(body.style.overflowY)) body.style.overflowY = '';
      if (body.style.position === 'fixed') {
        body.style.position = '';
        body.style.top = '';
      }

      if (isLockedOverflow(root.style.overflow)) root.style.overflow = '';
      if (isLockedOverflow(root.style.overflowY)) root.style.overflowY = '';
      if (root.style.position === 'fixed') {
        root.style.position = '';
        root.style.top = '';
      }

      const bodyOverflowY = getComputedStyle(body).overflowY;
      if (isLockedOverflow(bodyOverflowY) && !body.style.overflowY) {
        body.style.overflowY = 'auto';
      }
      const rootOverflowY = getComputedStyle(root).overflowY;
      if (isLockedOverflow(rootOverflowY) && !root.style.overflowY) {
        root.style.overflowY = 'auto';
      }
    };

    const handleWheel = (event) => {
      if (!isDesktop()) return;
      if (!event.deltaY || event.ctrlKey) return;
      if (isPricingScrollTarget(event.target)) return;
      if (
        event.target &&
        typeof event.target.closest === 'function' &&
        (event.target.closest('.mobile-nav-shell') ||
          event.target.closest('.services-overlay'))
      ) {
        return;
      }
      if (isScrollLockActive()) return;

      unlockDesktopScroll();
      const startY = window.scrollY;
      window.requestAnimationFrame(() => {
        if (window.scrollY !== startY) return;
        window.scrollBy({ top: event.deltaY, left: 0, behavior: 'auto' });
      });
    };

    const observer = new MutationObserver(unlockDesktopScroll);
    observer.observe(body, { attributes: true, attributeFilter: ['style', 'class'] });
    observer.observe(root, { attributes: true, attributeFilter: ['style'] });
    window.addEventListener('resize', unlockDesktopScroll);
    window.addEventListener('load', () =>
      window.setTimeout(unlockDesktopScroll, 0),
    );

    unlockDesktopScroll();
    document.addEventListener('wheel', handleWheel, {
      passive: true,
      capture: true,
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    window.Silverstone = window.Silverstone || {};
    const api = window.Silverstone;

    loadBaseStyles();

    if (api.initHeaderNav) api.initHeaderNav();
    if (api.initScrollReveal) api.initScrollReveal();
    if (api.initStats) api.initStats();
    if (api.initParallax) api.initParallax();
    initDesktopScrollSupport();
  });
})();
