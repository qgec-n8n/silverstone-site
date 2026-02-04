(function () {
  'use strict';

  function ensureStylesheet(href) {
    if (document.querySelector(`link[href*="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/${href}`;
    document.head.appendChild(link);
  }

  function loadBaseStyles() {
    ensureStylesheet('assets/css/custom.css');
    ensureStylesheet('assets/css/mobile.css');
  }

  function initUrlbarOverlay() {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const root = document.documentElement;
    const MAX_OVERLAY_PX = 160;
    let overlay = null;
    let rafId = null;
    let viewportCleanup = null;

    const createOverlay = () => {
      if (overlay) return overlay;
      overlay = document.createElement('div');
      overlay.className = 'urlbar-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
      return overlay;
    };

    const removeOverlay = () => {
      if (!overlay) return;
      overlay.remove();
      overlay = null;
      root.style.removeProperty('--urlbar-overlay-height');
    };

    const computeOcclusion = () => {
      const vv = window.visualViewport;
      const rawScreenHeight =
        typeof window.screen !== 'undefined' ? window.screen.height : 0;
      const screenHeight =
        vv && vv.scale ? rawScreenHeight / vv.scale : rawScreenHeight;
      const outerHeight =
        typeof window.outerHeight === 'number' ? window.outerHeight : 0;
      if (vv) {
        const offsetTop = vv.offsetTop || 0;
        const viewportBottom = vv.height + offsetTop;
        const occlusionLayout = Math.max(0, window.innerHeight - viewportBottom);
        const occlusionScreen = screenHeight
          ? Math.max(0, screenHeight - viewportBottom)
          : 0;
        const occlusionOuter = outerHeight
          ? Math.max(0, outerHeight - window.innerHeight)
          : 0;
        const occlusion = Math.max(
          occlusionLayout,
          occlusionScreen,
          occlusionOuter,
        );
        return Math.min(occlusion, MAX_OVERLAY_PX);
      }
      if (!screenHeight && !outerHeight) return null;
      const occlusion = Math.max(
        screenHeight ? screenHeight - window.innerHeight : 0,
        outerHeight ? outerHeight - window.innerHeight : 0,
      );
      return Math.min(Math.max(0, occlusion), MAX_OVERLAY_PX);
    };

    const applyOverlayHeight = () => {
      rafId = null;
      if (!overlay) return;
      const occlusion = computeOcclusion();
      if (occlusion === null) {
        root.style.removeProperty('--urlbar-overlay-height');
        return;
      }
      root.style.setProperty(
        '--urlbar-overlay-height',
        `${Math.round(occlusion)}px`,
      );
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(applyOverlayHeight);
    };

    const bindViewportListeners = () => {
      const vv = window.visualViewport;
      window.addEventListener('resize', scheduleUpdate, { passive: true });
      window.addEventListener('orientationchange', scheduleUpdate, {
        passive: true,
      });
      if (vv && typeof vv.addEventListener === 'function') {
        vv.addEventListener('resize', scheduleUpdate, { passive: true });
        vv.addEventListener('scroll', scheduleUpdate, { passive: true });
      }
      return () => {
        window.removeEventListener('resize', scheduleUpdate);
        window.removeEventListener('orientationchange', scheduleUpdate);
        if (vv && typeof vv.removeEventListener === 'function') {
          vv.removeEventListener('resize', scheduleUpdate);
          vv.removeEventListener('scroll', scheduleUpdate);
        }
      };
    };

    const enable = () => {
      if (overlay) return;
      createOverlay();
      viewportCleanup = bindViewportListeners();
      scheduleUpdate();
    };

    const disable = () => {
      if (viewportCleanup) {
        viewportCleanup();
        viewportCleanup = null;
      }
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      removeOverlay();
    };

    const evaluate = () => {
      if (mobileQuery.matches) {
        enable();
      } else {
        disable();
      }
    };

    evaluate();
    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', evaluate);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(evaluate);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    window.Silverstone = window.Silverstone || {};
    const api = window.Silverstone;

    loadBaseStyles();
    initUrlbarOverlay();

    if (api.initHeaderNav) api.initHeaderNav();
    if (api.initScrollReveal) api.initScrollReveal();
    if (api.initStats) api.initStats();
    if (api.initParallax) api.initParallax();
  });
})();
