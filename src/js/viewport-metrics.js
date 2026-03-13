(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  const root = document.documentElement;
  const orientationState = new Map();
  let cleanup = null;

  function getOrientationKey() {
    if (
      window.matchMedia &&
      window.matchMedia('(orientation: landscape)').matches
    ) {
      return 'landscape';
    }
    return 'portrait';
  }

  function getScreenHeightCssPx() {
    const vv = window.visualViewport;
    const rawHeight =
      typeof window.screen !== 'undefined' ? window.screen.height || 0 : 0;
    if (!rawHeight) return 0;
    if (vv && vv.scale) return rawHeight / vv.scale;
    return rawHeight;
  }

  function measureCssViewportHeight() {
    if (!document.body) return 0;
    const probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
      'position:fixed;top:0;left:0;width:1px;height:100vh;height:100lvh;pointer-events:none;visibility:hidden;';
    document.body.appendChild(probe);
    const height = probe.getBoundingClientRect().height || 0;
    probe.remove();
    return height;
  }

  function computeStableViewportHeight() {
    const vv = window.visualViewport;
    const innerHeight =
      typeof window.innerHeight === 'number' ? window.innerHeight : 0;
    const visualHeight = vv ? vv.height || 0 : 0;
    const screenHeight = getScreenHeightCssPx();
    const cssViewportHeight = measureCssViewportHeight();
    return Math.max(innerHeight, visualHeight, screenHeight, cssViewportHeight);
  }

  function applyStableViewportHeight(forceReset) {
    const orientation = getOrientationKey();
    const nextHeight = Math.round(computeStableViewportHeight());
    const previousHeight = forceReset ? 0 : orientationState.get(orientation) || 0;
    const stableHeight = Math.max(previousHeight, nextHeight);
    orientationState.set(orientation, stableHeight);
    root.style.setProperty('--mobile-stable-vh', `${stableHeight}px`);
  }

  function bindViewportMetrics() {
    if (cleanup) return;

    let orientation = getOrientationKey();
    const handleViewportResize = () => {
      const nextOrientation = getOrientationKey();
      const orientationChanged = nextOrientation !== orientation;
      orientation = nextOrientation;
      applyStableViewportHeight(orientationChanged);
    };

    const handlePageShow = () => {
      orientationState.delete(getOrientationKey());
      applyStableViewportHeight(true);
    };

    applyStableViewportHeight(true);
    window.addEventListener('resize', handleViewportResize, { passive: true });
    window.addEventListener('orientationchange', handleViewportResize, {
      passive: true,
    });
    window.addEventListener('pageshow', handlePageShow, { passive: true });

    const vv = window.visualViewport;
    if (vv && typeof vv.addEventListener === 'function') {
      vv.addEventListener('resize', handleViewportResize, { passive: true });
    }

    cleanup = () => {
      window.removeEventListener('resize', handleViewportResize);
      window.removeEventListener('orientationchange', handleViewportResize);
      window.removeEventListener('pageshow', handlePageShow);
      if (vv && typeof vv.removeEventListener === 'function') {
        vv.removeEventListener('resize', handleViewportResize);
      }
      cleanup = null;
    };
  }

  function initViewportMetrics() {
    bindViewportMetrics();
  }

  window.Silverstone.initViewportMetrics = initViewportMetrics;
  initViewportMetrics();
})();
