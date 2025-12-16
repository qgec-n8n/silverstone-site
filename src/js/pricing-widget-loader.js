(function () {
  'use strict';

  var SCRIPT_ID = 'ss-pricing-widget-script';
  var BUNDLE_NAME = 'ss-pricing-widget.iife.js';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function findAppScript() {
    var scripts = document.querySelectorAll('script[src]');
    for (var i = 0; i < scripts.length; i += 1) {
      var src = scripts[i].getAttribute('src') || '';
      if (src.indexOf('assets/js/app.js') !== -1) {
        return scripts[i];
      }
    }
    return null;
  }

  function deriveBasePath() {
    var appScript = findAppScript();
    if (!appScript) return '';
    var src = appScript.getAttribute('src') || '';
    var lastSlash = src.lastIndexOf('/');
    if (lastSlash === -1) return '';
    return src.slice(0, lastSlash + 1);
  }

  function loadWidget(bundleUrl, onLoad, onError) {
    var existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      if (onLoad) onLoad();
      return;
    }
    var script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = bundleUrl;
    script.async = true;
    script.onload = onLoad;
    script.onerror = onError;
    document.head.appendChild(script);
  }

  function mountAll() {
    if (!window.SS_PRICING_WIDGET || typeof window.SS_PRICING_WIDGET.mountAll !== 'function') return;
    try {
      window.SS_PRICING_WIDGET.mountAll();
    } catch (err) {
      console.error('[ss-pricing-loader] Mount error', err);
    }
  }

  function init() {
    var containers = document.querySelectorAll('.ss-react-pricing');
    if (!containers || !containers.length) return;

    var basePath = deriveBasePath() || 'assets/js/';
    var bundleUrl = basePath + BUNDLE_NAME;

    loadWidget(
      bundleUrl,
      function () {
        mountAll();
      },
      function (err) {
        console.error('[ss-pricing-loader] Failed to load pricing widget bundle', err);
      },
    );
  }

  ready(init);
})();
