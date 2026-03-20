(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  // SS_PARALLAX_SPEC: NICHE_MOBILE_BG_PARITY
  let initialized = false;

  function initParallax() {
    if (initialized) return;

    const parallaxSections = Array.from(
      document.querySelectorAll('.parallax-section[data-parallax-theme]'),
    );
    if (!parallaxSections.length) return;
    initialized = true;

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const reduceMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const supportsImageSet =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports(
        'background-image',
        "image-set(url('data:image/gif;base64,R0lGODlhAQABAAAAACw=') 1x)",
      );
    const supportsWebkitImageSet =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports(
        'background-image',
        "-webkit-image-set(url('data:image/gif;base64,R0lGODlhAQABAAAAACw=') 1x)",
      );

    const resolveBundleBase = () => {
      if (typeof document === 'undefined') return '';
      const currentScript = document.currentScript;
      if (currentScript && currentScript.src) return currentScript.src;
      const scripts = Array.from(document.scripts || []);
      const appScript = scripts
        .map((script) => script.src)
        .filter(Boolean)
        .find((src) => /\/assets\/js\/app\.js$|assets\/js\/app\.js$/.test(src));
      if (appScript) return appScript;
      return scripts.length ? scripts[scripts.length - 1].src || '' : '';
    };

    const BASE_IMAGE = new URL(
      '../images/' +
        'body_section_parallax/' +
        'body-section-background-2025.webp',
      resolveBundleBase() || window.location.href,
    ).toString();
    const OVERLAY_GRADIENT =
      'linear-gradient(180deg, rgba(0, 0, 0, var(--body-section-overlay-opacity)) 0%, rgba(0, 0, 0, var(--body-section-overlay-opacity)) 100%)';

    const createConfig = () => ({
      backgroundColor: '#050B18',
      overlay: OVERLAY_GRADIENT,
      mobileImages: {
        fallback: `url('${BASE_IMAGE}')`,
        standard: `image-set(url('${BASE_IMAGE}') 1x)`,
        webkit: `-webkit-image-set(url('${BASE_IMAGE}') 1x)`,
      },
    });

    const themes = ['lines', 'circuit', 'mesh', 'waves', 'book'];
    const PARALLAX_MAP = themes.reduce((acc, theme) => {
      acc[theme] = createConfig();
      return acc;
    }, {});
    const DEFAULT_CONFIG = createConfig();

    const state = {
      active: false,
      stage: null,
      current: null,
      activeSignature: null,
      observer: null,
      layers: [],
    };

    const setActiveLayer = (section) => {
      state.current = section;
      const theme = section.dataset.parallaxTheme;
      const config = PARALLAX_MAP[theme] || DEFAULT_CONFIG;
      if (!config || !state.layers.length) return;
      const match = state.layers.find((entry) => entry.section === section);
      if (!match) return;
      const nextSignature = [
        config.backgroundColor || '',
        config.overlay || '',
        getImageValue(config.mobileImages),
      ].join('|');
      if (state.activeSignature === nextSignature) return;
      state.layers.forEach((entry) => entry.layer.classList.remove('is-active'));
      match.layer.classList.add('is-active');
      const layerColor = match.config.backgroundColor || '#050B18';
      state.stage.style.backgroundColor = layerColor;
      state.activeSignature = nextSignature;
    };

    const createStage = () => {
      const stage = document.createElement('div');
      stage.className = 'parallax-mobile-stage';
      stage.setAttribute('aria-hidden', 'true');
      return stage;
    };

    const createObserver = () =>
      new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length) {
            setActiveLayer(visible[0].target);
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
      );

    const getImageValue = (images) => {
      if (!images) return '';
      if (supportsImageSet && images.standard) return images.standard;
      if (supportsWebkitImageSet && images.webkit) return images.webkit;
      return images.fallback || '';
    };

    const ensureMediaListener = (query, callback) => {
      if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', callback);
        return () => query.removeEventListener('change', callback);
      }
      if (typeof query.addListener === 'function') {
        query.addListener(callback);
        return () => query.removeListener(callback);
      }
      return () => {};
    };

    const enableMobile = () => {
      if (state.active) return;
      const stage = createStage();
      const observer = createObserver();
      document.body.insertBefore(stage, document.body.firstChild);
      const layers = parallaxSections
        .map((section) => {
          const theme = section.getAttribute('data-parallax-theme');
          const config = PARALLAX_MAP[theme] || DEFAULT_CONFIG;
          if (!config) return null;
          const layer = document.createElement('div');
          layer.className = 'parallax-mobile-layer';
          layer.dataset.theme = theme;
          layer.setAttribute('aria-hidden', 'true');
          const imageValue = getImageValue(config.mobileImages);
          const baseImage = imageValue || 'none';
          layer.style.backgroundImage = config.overlay
            ? `${config.overlay}, ${baseImage}`
            : baseImage;
          if (config.backgroundColor) {
            layer.style.backgroundColor = config.backgroundColor;
          }
          stage.appendChild(layer);
          observer.observe(section);
          section.classList.add('parallax-ready', 'parallax-mobile-active');
          return { section, layer, config };
        })
        .filter(Boolean);
      if (!layers.length) {
        observer.disconnect();
        if (stage.parentNode) {
          stage.parentNode.removeChild(stage);
        }
        return;
      }
      state.layers = layers;
      state.stage = stage;
      state.observer = observer;
      state.active = true;
      document.body.classList.add('parallax-stage-active');

      const initial = layers
        .slice()
        .sort(
          (a, b) =>
            a.section.getBoundingClientRect().top -
            b.section.getBoundingClientRect().top,
        )
        .find((entry) => entry.section.getBoundingClientRect().bottom > 0);
      if (initial) {
        setActiveLayer(initial.section);
      } else {
        setActiveLayer(layers[0].section);
      }
    };

    const disableMobile = () => {
      if (!state.active) return;
      if (state.observer) {
        state.observer.disconnect();
        state.observer = null;
      }
      state.layers.forEach((entry) => {
        entry.section.classList.remove(
          'parallax-ready',
          'parallax-mobile-active',
        );
        entry.layer.classList.remove('is-active');
      });
      state.layers = [];
      state.current = null;
      if (state.stage && state.stage.parentNode) {
        state.stage.parentNode.removeChild(state.stage);
      }
      state.stage = null;
      state.active = false;
      state.activeSignature = null;
      document.body.classList.remove('parallax-stage-active');
    };

    const evaluate = () => {
      if (reduceMotionQuery.matches) {
        disableMobile();
        return;
      }
      if (mobileQuery.matches) {
        enableMobile();
      } else {
        disableMobile();
      }
    };

    evaluate();
    ensureMediaListener(mobileQuery, evaluate);
    ensureMediaListener(reduceMotionQuery, evaluate);
  }

  window.Silverstone.initParallax = initParallax;
})();
