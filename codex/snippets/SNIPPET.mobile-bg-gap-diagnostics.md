<!-- FILE: codex/snippets/SNIPPET.mobile-bg-gap-diagnostics.md -->
# Mobile background gap diagnostics snippet

Purpose: Paste this into the DevTools console on a mobile viewport to capture viewport + parallax stage metrics.

Copy/paste:

  (() => {
    const vv = window.visualViewport || null;
    const stage = document.querySelector('.parallax-mobile-stage');
    const activeLayer = document.querySelector('.parallax-mobile-layer.is-active');
    const stageRect = stage ? stage.getBoundingClientRect() : null;
    const layerRect = activeLayer ? activeLayer.getBoundingClientRect() : null;

    const sampleY = Math.max(0, Math.floor(window.innerHeight - 1));
    const stack = (document.elementsFromPoint(Math.floor(window.innerWidth / 2), sampleY) || []).slice(0, 8);

    const fmtBg = (el) => {
      if (!el) return null;
      const bg = getComputedStyle(el).backgroundImage || '';
      return bg.length > 120 ? (bg.slice(0, 120) + '…') : bg;
    };

    const data = {
      locationPath: window.location.pathname,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      visualViewportWidth: vv ? vv.width : null,
      visualViewportHeight: vv ? vv.height : null,
      visualViewportOffsetTop: vv ? vv.offsetTop : null,
      visualViewportOffsetLeft: vv ? vv.offsetLeft : null,

      stageExists: !!stage,
      stageTop: stageRect ? stageRect.top : null,
      stageBottom: stageRect ? stageRect.bottom : null,
      stageHeight: stageRect ? stageRect.height : null,
      stageBg: fmtBg(stage),

      activeLayerExists: !!activeLayer,
      activeLayerTop: layerRect ? layerRect.top : null,
      activeLayerBottom: layerRect ? layerRect.bottom : null,
      activeLayerHeight: layerRect ? layerRect.height : null,
      activeLayerBg: fmtBg(activeLayer),

      bodyScrollHeight: document.body.scrollHeight,
      docClientHeight: document.documentElement.clientHeight,
    };

    console.table(data);

    console.log('Top elements at bottom-of-viewport sample point:', stack.map(el => {
      const cls = (el && el.className) ? String(el.className) : '';
      const label = cls ? `.${cls}` : el.tagName;
      return label;
    }));

    if (stageRect) {
      const gap = Math.round((window.innerHeight) - stageRect.height);
      console.log('Approx gap (innerHeight - stageHeight) in px:', gap);
    }
  })();
