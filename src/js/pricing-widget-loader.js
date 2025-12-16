(function () {
  'use strict';

  const SCRIPT_ID = 'ss-pricing-widget-script';
  const MOUNT_ATTR = 'data-ss-mounted';

  function findAppScript() {
    if (document.currentScript && document.currentScript.src) {
      return document.currentScript;
    }
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    return scripts.find((s) => /assets\/js\/app\.js(\?|$)/.test(s.src));
  }

  function deriveWidgetSrc() {
    const appScript = findAppScript();
    if (!appScript || !appScript.src) return null;
    try {
      const appUrl = new URL(appScript.src, window.location.href);
      return new URL('ss-pricing-widget.iife.js', appUrl).toString();
    } catch (err) {
      console.error('[pricing-widget-loader] Failed to derive widget URL', err);
      return null;
    }
  }

  function loadWidget(onReady) {
    if (window.SS_PRICING_WIDGET) {
      onReady();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', onReady, { once: true });
      return;
    }

    const src = deriveWidgetSrc();
    if (!src) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = src;
    script.async = true;
    script.onload = onReady;
    document.head.appendChild(script);
  }

  function mountAll() {
    const mounts = Array.from(
      document.querySelectorAll('.ss-pricing-mount[data-ss-pricing-page]'),
    );
    if (!mounts.length) return;

    loadWidget(function () {
      if (!window.SS_PRICING_WIDGET || typeof window.SS_PRICING_WIDGET.mount !== 'function') {
        return;
      }

      mounts.forEach(function (el) {
        if (el.getAttribute(MOUNT_ATTR) === '1') return;
        const pageKey = el.getAttribute('data-ss-pricing-page') || '';
        window.SS_PRICING_WIDGET.mount(el, { pageKey: pageKey });
        el.setAttribute(MOUNT_ATTR, '1');
      });
    });
  }

  function init() {
    const mountsPresent = document.querySelector('.ss-pricing-mount[data-ss-pricing-page]');
    if (!mountsPresent) return;
    mountAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
