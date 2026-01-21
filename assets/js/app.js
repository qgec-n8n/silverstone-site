(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;

  function initHeaderNav() {
    if (initialized) return;
    initialized = true;

    const MOBILE_BREAKPOINT = 768;
    const body = document.body;
    const MINIMIZE_REENABLE_DELAY_MS = 2000; // SPEC: MOBILE_NAV_TIMINGS_TUNED
    const MOBILE_NAV_PANEL_SLIDE_MS = 1250;
    const MOBILE_NAV_ITEM_STAGGER_MS = 280;
    const MOBILE_NAV_ITEM_REVEAL_MS = 450;

    const rootStyle = document.documentElement.style;
    rootStyle.setProperty(
      '--mobile-nav-panel-slide-ms',
      `${MOBILE_NAV_PANEL_SLIDE_MS}ms`,
    );
    rootStyle.setProperty(
      '--mobile-nav-item-stagger-ms',
      `${MOBILE_NAV_ITEM_STAGGER_MS}ms`,
    );
    rootStyle.setProperty(
      '--mobile-nav-item-reveal-ms',
      `${MOBILE_NAV_ITEM_REVEAL_MS}ms`,
    );

    // Cache references to header, nav toggle and nav menu.
    const header = document.querySelector('header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');

    const servicesDropdown = document.querySelector('.nav-dropdown');
    const servicesToggle = document.querySelector('.services-toggle');
    const servicesMenu = document.querySelector('.services-menu');
    const servicesOverlay = document.querySelector('.services-overlay');
    const servicesOverlayBack = servicesOverlay
      ? servicesOverlay.querySelector('.services-overlay__back')
      : null;
    const serviceLinks = document.querySelectorAll('.service-link');

    let servicesDropdownOpen = false;
    let servicesHoverCloseTimeoutId;
    let pointerInHeader = false;

    let navBackButton;
    if (navMenu && !navMenu.querySelector('.nav-back-item')) {
      const navBackItem = document.createElement('li');
      navBackItem.className = 'nav-back-item';

      navBackButton = document.createElement('button');
      navBackButton.type = 'button';
      navBackButton.className = 'nav-back-btn';
      navBackButton.setAttribute(
        'aria-label',
        'Close menu and return to the page',
      );
      navBackButton.innerHTML = `
      <span class="nav-back-icon" aria-hidden="true"></span>
      <span class="nav-back-label">Back to page</span>
    `;

      navBackItem.appendChild(navBackButton);
      navMenu.prepend(navBackItem);
    }

    const headerIndicator = document.createElement('div');
    headerIndicator.id = 'header-indicator';
    headerIndicator.setAttribute(
      'aria-label',
      'Silverstone navigation menu. Hover or tap to expand.',
    );
    headerIndicator.innerHTML = `
    <div class="indicator-copy">
      <span>Menu</span>
    </div>
  `.trim();
    document.body.appendChild(headerIndicator);

    const mobileNav = buildMobileNav();
    const mobileRootList = mobileNav.querySelector('.mobile-nav-list--root');
    const mobileServicesList = mobileNav.querySelector(
      '.mobile-nav-list--services',
    );
    const mobileBackdrop = mobileNav.querySelector('.mobile-nav-backdrop');
    const mobileTopBackButton = mobileNav.querySelector('.mobile-nav-back-top');
    let isMobileNavOpen = false;

    let previousScrollY = 0;
    let headerAutoHideTimeoutId;

    const isMobileViewport = () =>
      window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

    function setStagger(item, index) {
      item.style.setProperty('--item-index', index);
    }

    function hydrateMobileNav() {
      if (!mobileRootList || !mobileServicesList) return;

      mobileRootList.innerHTML = '';
      mobileServicesList.innerHTML = '';

      let rootIndex = 0;
      const navItems = navMenu ? Array.from(navMenu.children) : [];
      navItems.forEach((item) => {
        if (item.classList.contains('nav-back-item')) return;
        if (item.classList.contains('nav-dropdown')) {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'mobile-nav-link mobile-nav-link--drill';
          btn.textContent = '← Services';
          btn.addEventListener('click', () => {
            openMobileNav();
            openServicesPanel();
          });
          li.appendChild(btn);
          setStagger(li, rootIndex++);
          mobileRootList.appendChild(li);
          return;
        }
        const anchor = item.querySelector('a');
        if (!anchor) return;
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'mobile-nav-link';
        link.href = anchor.getAttribute('href');
        link.textContent = anchor.textContent.trim();
        link.addEventListener('click', () => {
          closeMobileNav();
        });
        li.appendChild(link);
        setStagger(li, rootIndex++);
        mobileRootList.appendChild(li);
      });

      const serviceAnchors = servicesMenu
        ? Array.from(servicesMenu.querySelectorAll('.service-link'))
        : [];
      serviceAnchors.forEach((anchor, idx) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'mobile-nav-link';
        link.href = anchor.getAttribute('href');
        link.textContent = anchor.textContent.trim();
        link.addEventListener('click', () => {
          closeMobileNav();
          closeServicesPanel();
        });
        li.appendChild(link);
        setStagger(li, idx);
        mobileServicesList.appendChild(li);
      });
    }

    function openMobileNav() {
      if (isMobileNavOpen) return;
      hydrateMobileNav();
      closeServicesPanel();
      closeServicesDropdown();
      closeServicesOverlay();
      clearTimeout(headerAutoHideTimeoutId);
      previousScrollY =
        window.pageYOffset || document.documentElement.scrollTop || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${previousScrollY}px`;
      document.body.classList.add('mobile-nav-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      mobileNav.classList.add('is-open', 'panel-root-active');
      mobileNav.classList.remove('panel-services-active');
      isMobileNavOpen = true;
      if (navToggle) navToggle.classList.add('active');
      showHeader();
    }

    function closeMobileNav() {
      if (!isMobileNavOpen) return;
      mobileNav.classList.remove('is-open', 'panel-services-active');
      mobileNav.classList.add('panel-root-active');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('mobile-nav-open');
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, previousScrollY);
      isMobileNavOpen = false;
      if (navToggle) navToggle.classList.remove('active');
      showHeader();
      scheduleHeaderAutoHide(MOBILE_NAV_PANEL_SLIDE_MS);
    }

    function openServicesPanel() {
      mobileNav.classList.add('panel-services-active');
      mobileNav.classList.remove('panel-root-active');
    }

    function closeServicesPanel() {
      mobileNav.classList.add('panel-root-active');
      mobileNav.classList.remove('panel-services-active');
    }

    function showHeader() {
      if (header) header.classList.remove('header-hidden');
      headerIndicator.classList.remove('active');
    }
    function hideHeader() {
      if (isMobileNavOpen) return;
      if (
        servicesDropdownOpen ||
        (servicesOverlay && servicesOverlay.classList.contains('active'))
      )
        return;
      if (header) header.classList.add('header-hidden');
      headerIndicator.classList.add('active');
    }
    function scheduleHeaderAutoHide(delay = 1200) {
      clearTimeout(headerAutoHideTimeoutId);
      if (isMobileNavOpen) return;
      headerAutoHideTimeoutId = window.setTimeout(() => {
        if (pointerInHeader) return;
        if (navMenu && navMenu.classList.contains('open')) return;
        if (
          servicesDropdownOpen ||
          (servicesOverlay && servicesOverlay.classList.contains('active'))
        )
          return;
        hideHeader();
      }, delay);
    }

    const isServicesOverlayActive = () =>
      servicesOverlay && servicesOverlay.classList.contains('active');

    function openServicesDropdown() {
      if (!servicesDropdown || !servicesMenu || isMobileViewport()) return;
      clearTimeout(headerAutoHideTimeoutId);
      servicesDropdown.classList.add('open');
      servicesMenu.setAttribute('aria-hidden', 'false');
      if (servicesToggle) servicesToggle.setAttribute('aria-expanded', 'true');
      servicesDropdownOpen = true;
      body.classList.add('services-dropdown-open');
      showHeader();
    }

    function closeServicesDropdown(options = {}) {
      if (!servicesDropdown || !servicesMenu) return;
      clearTimeout(servicesHoverCloseTimeoutId);
      servicesDropdown.classList.remove('open');
      servicesMenu.setAttribute('aria-hidden', 'true');
      if (servicesToggle) servicesToggle.setAttribute('aria-expanded', 'false');
      servicesDropdownOpen = false;
      body.classList.remove('services-dropdown-open');
      if (
        !isServicesOverlayActive() &&
        !(navMenu && navMenu.classList.contains('open'))
      ) {
        const minimizeDelayMs =
          typeof options.minimizeDelayMs === 'number'
            ? options.minimizeDelayMs
            : undefined;
        scheduleHeaderAutoHide(minimizeDelayMs ?? 1200);
      }
    }

    function openServicesOverlay() {
      if (!servicesOverlay || !isMobileViewport()) return;
      clearTimeout(headerAutoHideTimeoutId);
      servicesOverlay.classList.add('active');
      servicesOverlay.setAttribute('aria-hidden', 'false');
      body.classList.add('services-overlay-active');
      showHeader();
    }

    function closeServicesOverlay() {
      if (!servicesOverlay) return;
      servicesOverlay.classList.remove('active');
      servicesOverlay.setAttribute('aria-hidden', 'true');
      body.classList.remove('services-overlay-active');
      if (!(navMenu && navMenu.classList.contains('open'))) {
        scheduleHeaderAutoHide();
      }
    }

    function openNavMenu() {
      if (!navMenu || !navToggle) return;
      closeServicesDropdown();
      clearTimeout(headerAutoHideTimeoutId);
      previousScrollY =
        window.pageYOffset || document.documentElement.scrollTop || 0;
      navMenu.classList.add('open');
      navMenu.scrollTop = 0;
      navToggle.classList.add('active');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${previousScrollY}px`;
      showHeader();
    }
    function closeNavMenu() {
      closeServicesOverlay();
      closeServicesDropdown();
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
      if (navToggle && navToggle.classList.contains('active')) {
        navToggle.classList.remove('active');
      }
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, previousScrollY);
      scheduleHeaderAutoHide();
    }

    if (navToggle) {
      navToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        if (isMobileViewport()) {
          if (isMobileNavOpen) return;
          openMobileNav();
          return;
        }
        closeServicesDropdown();
        closeServicesOverlay();
        if (navMenu && navMenu.classList.contains('open')) {
          closeNavMenu();
        } else if (navMenu) {
          openNavMenu();
        }
      });
    }
    if (navMenu) {
      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', (event) => {
          event.stopPropagation();
          if (isMobileViewport() && navMenu.classList.contains('open')) {
            closeNavMenu();
          }
        });
      });
    }

    if (navBackButton) {
      navBackButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeServicesOverlay();
        closeServicesDropdown();
        closeNavMenu();
        if (navToggle) {
          navToggle.focus();
        }
      });
    }

    if (servicesToggle) {
      servicesToggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isMobileViewport()) {
          if (!isMobileNavOpen) {
            openMobileNav();
          }
          openServicesPanel();
        } else {
          if (servicesDropdownOpen) {
            closeServicesDropdown();
          } else {
            openServicesDropdown();
          }
        }
      });
    }

    const canDesktopHover = () =>
      !!window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !isMobileViewport();

    if (servicesDropdown) {
      servicesDropdown.addEventListener('mouseenter', () => {
        if (!canDesktopHover()) return;
        clearTimeout(servicesHoverCloseTimeoutId);
        openServicesDropdown();
      });

      servicesDropdown.addEventListener('mouseleave', () => {
        if (!canDesktopHover()) return;
        clearTimeout(servicesHoverCloseTimeoutId);
        servicesHoverCloseTimeoutId = window.setTimeout(() => {
          closeServicesDropdown({ minimizeDelayMs: 1000 });
        }, 80);
      });
    }

    if (servicesOverlayBack) {
      servicesOverlayBack.addEventListener('click', (event) => {
        event.preventDefault();
        closeServicesOverlay();
      });
    }

    if (serviceLinks.length) {
      serviceLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closeServicesDropdown();
          closeServicesOverlay();
          if (isMobileViewport() && isMobileNavOpen) {
            closeMobileNav();
            return;
          }
          if (
            isMobileViewport() &&
            navMenu &&
            navMenu.classList.contains('open')
          ) {
            closeNavMenu();
          }
        });
      });
    }

    if (mobileTopBackButton) {
      mobileTopBackButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (mobileNav.classList.contains('panel-services-active')) {
          closeServicesPanel();
          return;
        }
        closeMobileNav();
      });
    }

    document.addEventListener('click', (event) => {
      if (
        servicesDropdownOpen &&
        servicesDropdown &&
        !servicesDropdown.contains(event.target)
      ) {
        closeServicesDropdown();
      }
      if (
        isServicesOverlayActive() &&
        servicesOverlay &&
        event.target === servicesOverlay
      ) {
        closeServicesOverlay();
      }
    });

    // SPEC: MOBILE_MENU_BANNER_TWO_STEP_2025_12
    headerIndicator.addEventListener('click', (event) => {
      event.stopPropagation();
      closeServicesDropdown();
      closeServicesOverlay();
      if (isMobileViewport()) {
        showHeader();
        clearTimeout(headerAutoHideTimeoutId);
        scheduleHeaderAutoHide(MINIMIZE_REENABLE_DELAY_MS);
        return;
      }
      showHeader();
      clearTimeout(headerAutoHideTimeoutId);
      scheduleHeaderAutoHide();
    });

    headerIndicator.addEventListener('mouseenter', showHeader);
    if (header) {
      header.addEventListener('mouseenter', () => {
        pointerInHeader = true;
        clearTimeout(headerAutoHideTimeoutId);
        showHeader();
      });
      header.addEventListener('mouseleave', () => {
        pointerInHeader = false;
        hideHeader();
      });
      header.addEventListener('click', () => {
        if (!isMobileViewport()) return;
        if (isMobileNavOpen) return;
        if (navMenu && navMenu.classList.contains('open')) return;
        scheduleHeaderAutoHide();
      });
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!isMobileViewport()) return;
        if (isMobileNavOpen) return;
        if (navMenu && navMenu.classList.contains('open')) return;
        if (servicesDropdownOpen || isServicesOverlayActive()) return;
        clearTimeout(headerAutoHideTimeoutId);
        hideHeader();
      },
      { passive: true },
    );

    scheduleHeaderAutoHide();

    function buildMobileNav() {
      const shell = document.createElement('div');
      shell.className = 'mobile-nav-shell';
      shell.setAttribute('aria-hidden', 'true');
      shell.innerHTML = `
        <div class="mobile-nav-backdrop"></div>
        <div class="mobile-nav-panel" role="dialog" aria-modal="true">
          <div class="mobile-nav-header">
            <span class="mobile-nav-title">Explore</span>
            <button class="mobile-nav-back-top" type="button" aria-label="Back">
              <span class="mobile-back-label">Back →</span>
            </button>
          </div>
          <div class="mobile-nav-track">
            <div class="mobile-nav-view mobile-nav-view--root" aria-label="Main navigation">
              <ul class="mobile-nav-list mobile-nav-list--root"></ul>
            </div>
            <div class="mobile-nav-view mobile-nav-view--services" aria-label="Services navigation">
              <div class="mobile-nav-subhead">
                <p class="mobile-nav-kicker">Services</p>
              </div>
              <ul class="mobile-nav-list mobile-nav-list--services"></ul>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(shell);
      return shell;
    }
  }

  window.Silverstone.initHeaderNav = initHeaderNav;
})();


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
  }

  window.Silverstone.initScrollReveal = initScrollReveal;
})();


(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  // SS_STATS_SPEC: COUNTER_ANIMATION_ABOUT_INDEX_ONLY
  let initialized = false;

  function initStats() {
    if (initialized) return;
    initialized = true;

    const statsSections = Array.from(
      document.querySelectorAll('.stats[data-counter="on"]'),
    );
    if (!statsSections.length) return;

    const reduceMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const setNumberValue = (number, value) => {
      const plus = number.getAttribute('data-plus') || '';
      number.textContent = value.toLocaleString() + plus;
    };

    const setSectionFinalValues = (section) => {
      const numbers = section.querySelectorAll('.number[data-target]');
      numbers.forEach((number) => {
        const target = parseInt(number.dataset.target, 10) || 0;
        setNumberValue(number, target);
      });
    };

    const animateNumber = (number) => {
      if (number.dataset.ssCounterDone === '1') return;
      number.dataset.ssCounterDone = '1';

      const target = parseInt(number.dataset.target, 10) || 0;
      if (target <= 0) {
        setNumberValue(number, 0);
        return;
      }

      const durationMs = 2600; // SS_STATS_SPEC: COUNTER_DURATION_SLOWDOWN_2600MS
      const startValue = 0;
      let startTime = null;

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        if (startTime === null) startTime = now;
        const progress = Math.min((now - startTime) / durationMs, 1);
        const eased = easeOutCubic(progress);
        const value = Math.round(startValue + (target - startValue) * eased);
        setNumberValue(number, value);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setNumberValue(number, target);
        }
      };

      window.requestAnimationFrame(step);
    };

    if (reduceMotionQuery.matches) {
      statsSections.forEach(setSectionFinalValues);
      return;
    }

    const startSectionAnimation = (section) => {
      if (section.dataset.ssCountersStarted === '1') return;
      section.dataset.ssCountersStarted = '1';
      const numbers = section.querySelectorAll('.number[data-target]');
      numbers.forEach(animateNumber);
    };

    if (typeof IntersectionObserver === 'undefined') {
      statsSections.forEach(startSectionAnimation);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          startSectionAnimation(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25 },
    );

    statsSections.forEach((section) => observer.observe(section));
  }

  window.Silverstone.initStats = initStats;
})();


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
      observer: null,
      layers: [],
      viewportCleanup: null,
    };

    const setActiveLayer = (section) => {
      state.current = section;
      const theme = section.dataset.parallaxTheme;
      const config = PARALLAX_MAP[theme] || DEFAULT_CONFIG;
      if (!config || !state.layers.length) return;
      const match = state.layers.find((entry) => entry.section === section);
      if (!match) return;
      state.layers.forEach((entry) => entry.layer.classList.remove('is-active'));
      match.layer.classList.add('is-active');
      const layerColor = match.config.backgroundColor || '#050B18';
      state.stage.style.backgroundColor = layerColor;
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

    const getViewportSize = () => {
      const vv = window.visualViewport;
      return {
        width: vv ? vv.width : window.innerWidth,
        height: vv ? vv.height : window.innerHeight,
      };
    };

    const syncStageSize = () => {
      if (!state.stage) return;
      const { width, height } = getViewportSize();
      const ua = navigator.userAgent || '';
      const isIos = /iPad|iPhone|iPod/.test(ua);
      const isIosSafari =
        isIos && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
      let overscan = 0;
      if (isIosSafari && typeof window.screen !== 'undefined') {
        const screenHeight = window.screen.height || 0;
        overscan = Math.max(0, screenHeight - height);
        overscan = Math.min(overscan, 160);
      }
      state.stage.style.width = `${Math.ceil(width)}px`;
      state.stage.style.height = `${Math.ceil(height + overscan)}px`;
    };

    const bindViewportListeners = () => {
      const handler = () => syncStageSize();
      const cleanups = [];
      window.addEventListener('resize', handler, { passive: true });
      cleanups.push(() => window.removeEventListener('resize', handler));
      if (window.visualViewport && typeof window.visualViewport.addEventListener === 'function') {
        window.visualViewport.addEventListener('resize', handler, { passive: true });
        window.visualViewport.addEventListener('scroll', handler, { passive: true });
        cleanups.push(() =>
          window.visualViewport.removeEventListener('resize', handler),
        );
        cleanups.push(() =>
          window.visualViewport.removeEventListener('scroll', handler),
        );
      }
      return () => cleanups.forEach((cleanup) => cleanup());
    };

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
      syncStageSize();
      state.viewportCleanup = bindViewportListeners();

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
      if (state.viewportCleanup) {
        state.viewportCleanup();
        state.viewportCleanup = null;
      }
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


// assets/js/hero-shader.js
(function () {
  'use strict';

  // --- CONFIGURATION ---
  const THEMES = { // SPEC: REQ1_HERO_SHADER_COLORS_PER_PAGE_2025_12_30
    // Original (Purple)
    default: {
      line: [0.4, 0.2, 0.8, 1.0],
      bg1: [0.1, 0.1, 0.3, 1.0],
      bg2: [0.3, 0.1, 0.5, 1.0]
    },
    // Services (Cyan/Blue) - Matching #00AEEF
    blue: {
      line: [0.0, 0.68, 0.94, 1.0],
      bg1: [0.0, 0.05, 0.2, 1.0],
      bg2: [0.0, 0.2, 0.4, 1.0]
    },
    // About (Green) - Matching #00FF9D
    green: {
      line: [0.0, 1.0, 0.62, 1.0],
      bg1: [0.0, 0.2, 0.1, 1.0],
      bg2: [0.0, 0.4, 0.2, 1.0]
    },
    // About (Neon Yellow)
    'neon-yellow': {
      line: [1.0, 0.95, 0.2, 1.0],
      bg1: [0.14, 0.12, 0.0, 1.0],
      bg2: [0.3, 0.26, 0.0, 1.0]
    },
    // Book (Neon Pink)
    'neon-pink': {
      line: [1.0, 0.05, 0.7, 1.0],
      bg1: [0.12, 0.0, 0.1, 1.0],
      bg2: [0.35, 0.0, 0.2, 1.0]
    },
    // Contact (Fire Orange)
    'fire-orange': {
      line: [1.0, 0.4, 0.0, 1.0],
      bg1: [0.16, 0.04, 0.0, 1.0],
      bg2: [0.36, 0.12, 0.0, 1.0]
    },
    // Book (Deep Amber/Orange - "Gold")
    // Adjusted to ensure contrast with white text is acceptable
    // Using a dark base with gold highlights
    amber: {
      line: [1.0, 0.65, 0.0, 1.0],
      bg1: [0.15, 0.05, 0.0, 1.0],
      bg2: [0.3, 0.1, 0.0, 1.0]
    }
  };

  // Vertex shader source
  const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  // Fragment shader source
  // Replaced const colors with uniforms: uLineColor, uBgColor1, uBgColor2
  const fsSource = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    // Theme colors passed as uniforms
    uniform vec4 uLineColor;
    uniform vec4 uBgColor1;
    uniform vec4 uBgColor2;

    const float overallSpeed = 0.2;
    const float gridSmoothWidth = 0.015;
    const float axisWidth = 0.05;
    const float majorLineWidth = 0.025;
    const float minorLineWidth = 0.0125;
    const float majorLineFrequency = 5.0;
    const float minorLineFrequency = 1.0;

    // gridColor stays neutral as in the original implementation
    const vec4 gridColor = vec4(0.5);

    const float scale = 5.0;
    // Removed fixed lineColor

    const float minLineWidth = 0.01;
    const float maxLineWidth = 0.2;
    const float lineSpeed = 1.0 * overallSpeed;
    const float lineAmplitude = 1.0;
    const float lineFrequency = 0.2;
    const float warpSpeed = 0.2 * overallSpeed;
    const float warpFrequency = 0.5;
    const float warpAmplitude = 1.0;
    const float offsetFrequency = 0.5;
    const float offsetSpeed = 1.33 * overallSpeed;
    const float minOffsetSpread = 0.6;
    const float maxOffsetSpread = 2.0;
    const int linesPerGroup = 16;

    #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
    #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
    #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
    #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

    float drawGridLines(float axis) {
      return drawCrispLine(0.0, axisWidth, axis)
            + drawPeriodicLine(majorLineFrequency, majorLineWidth, axis)
            + drawPeriodicLine(minorLineFrequency, minorLineWidth, axis);
    }

    float drawGrid(vec2 space) {
      return min(1.0, drawGridLines(space.x) + drawGridLines(space.y));
    }

    float random(float t) {
      return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
    }

    float getPlasmaY(float x, float horizontalFade, float offset) {
      return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec4 fragColor;
      vec2 uv = fragCoord.xy / iResolution.xy;
      vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

      float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
      float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

      space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
      space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

      vec4 lines = vec4(0.0);

      // Use uniforms instead of constants
      vec4 bgColor1 = uBgColor1;
      vec4 bgColor2 = uBgColor2;

      for(int l = 0; l < linesPerGroup; l++) {
        float normalizedLineIndex = float(l) / float(linesPerGroup);
        float offsetTime = iTime * offsetSpeed;
        float offsetPosition = float(l) + space.x * offsetFrequency;
        float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
        float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
        float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
        float linePosition = getPlasmaY(space.x, horizontalFade, offset);
        float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

        float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
        vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
        float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

        line = line + circle;

        // Use uniform lineColor
        lines += line * uLineColor * rand;
      }

      fragColor = mix(bgColor1, bgColor2, uv.x);
      fragColor *= verticalFade;
      fragColor.a = 1.0;
      fragColor += lines;

      gl_FragColor = fragColor;
    }
  `;

  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return null;

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Shader program link error:', gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  function initHeroShader() {
    const canvas = document.getElementById('hero-shader-canvas');
    if (!canvas) return;

    // Determine variant
    const variant = canvas.dataset.variant || 'default';
    const theme = THEMES[variant] || THEMES['default'];

    // Respect prefers-reduced-motion
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Leave fallback image visible; do not animate
      return;
    }

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported for hero shader.');
      return;
    }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const attribLocations = {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    };
    const uniformLocations = {
      resolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
      time: gl.getUniformLocation(shaderProgram, 'iTime'),
      uLineColor: gl.getUniformLocation(shaderProgram, 'uLineColor'),
      uBgColor1: gl.getUniformLocation(shaderProgram, 'uBgColor1'),
      uBgColor2: gl.getUniformLocation(shaderProgram, 'uBgColor2')
    };

    function resizeCanvas() {
      const hero = document.querySelector('.hero.title-band');
      const rect = hero ? hero.getBoundingClientRect() : canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let startTime = Date.now();
    let animationFrameId = null;

    function render() {
      const currentTime = (Date.now() - startTime) / 1000;

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(shaderProgram);

      gl.uniform2f(uniformLocations.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniformLocations.time, currentTime);

      // Pass theme uniforms
      gl.uniform4fv(uniformLocations.uLineColor, theme.line);
      gl.uniform4fv(uniformLocations.uBgColor1, theme.bg1);
      gl.uniform4fv(uniformLocations.uBgColor2, theme.bg2);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(
        attribLocations.vertexPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(attribLocations.vertexPosition);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('beforeunload', function handleBeforeUnload() {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroShader);
  } else {
    initHeroShader();
  }
})();


/**
 * Magnetic Buttons - Micro-interaction
 * Adds a subtle magnetic pull effect to buttons on hover.
 */

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic strength
            const strength = 10;

            btn.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            // Add a transition for smooth return, but remove it on mouseenter so it feels responsive
            btn.style.transition = 'transform 0.3s ease-out';
            setTimeout(() => {
                btn.style.transition = '';
            }, 300);
        });
    });
});


(function () {
  'use strict';

  const ASSET_PATH = '/assets/images/socialmedia/';
  const MARQUEE_IMAGES = [
  '1-1_business_chart-icon-and-flow_scale-beyond-human-limits.webp',
  '2-3_accounting_man-with-holographic-call_tax-season-calls-never-missed.webp',
  '3-2_business_hand-holding-phone-with-voice-display_ai-that-speaks-your-language.webp',
  'Dentists_1.webp',
  '1-1_business_monitor-graphs_10k-lost-overnight.webp',
  '2-3_accounting_office-with-swirling-invoices_tax-season-calls-never-missed.webp',
  '3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.webp',
  'Dentists_2.webp',
  '1-1_ecommerce_laptop-and-customer-hub_dms-calls-whatsapps-answered.webp',
  '2-3_ai_phone-processing_connect-automate-grow 2.webp',
  '3-2_business_laptop-with-chat-bubbles_hours-lost-leads-unqualified.webp',
  'Dentists_3.webp',
  '1-1_legal_desk-phone-with-scales_stop-losing-good-cases-to-voicemail.webp',
  '2-3_ai_phone-processing_connect-automate-grow.webp',
  '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep 2.webp',
  'eComm_1.webp',
  '1-1_marketing_boardroom-messages_your-prospects-can-tell.webp',
  '2-3_ai_smartphone-call-completed_automate-what-matters.webp',
  '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep.webp',
  'eComm_2.webp',
  '1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.webp',
  '2-3_analytics_dashboard_ai-clarity-for-human-performance.webp',
  '3-2_childcare_tablet-in-playroom_let-ai-handle-the-parent-phone-rush.webp',
  'eComm_3.webp',
  '1-1_voiceagents_digital-dashboard_scale-beyond-human-limits.webp',
  '2-3_auto_mechanic-with-phone_while-you-fix-cars.webp',
  '3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.webp',
  'General_Services_1.webp',
  '2-3_automation_charts-scale_scale-your-output-with-ai.webp',
  '3-2_logistics_laptop-with-truck_ai-optimises-logistics-delivery.webp',
  'General_Services_2A.webp',
  '2-3_charity_call-centre-triage_every-caller-feels-heard.webp',
  '3-2_restaurant_phone-and-reservation-list_never-miss-a-booking-again.webp',
  'General_Services_2B.webp',
  '2-3_cleaning_phone-with-booked-job_turn-every-missed-ring.webp',
  '3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.webp',
  'General_Services_3.webp',
  '2-3_cleaning_phone-with-weekly-job_turn-every-missed-ring-into-regular-client.webp',
  '3-2_tutoring_tutor-with-laptop_more-focused-1-1-lessons.webp',
  'Gyms_1.webp',
  '2-3_dental_black-phone-appointments_never-miss-toothache.webp',
  'Gyms_2.webp',
  '2-3_dental_phone-with-schedule_every-patient-call-answered.webp',
  'Gyms_3.webp',
  '2-3_fitness_phone-with-schedule_ai-powers-your-fitness-journey.webp',
  'Hospitality_1.webp',
  '2-3_gym_phone-trial-ring_ai-calls-every-new-lead.webp',
  'Hospitality_2.webp',
  '2-3_healthcare_call-queue_end-the-8am-phone-chaos.webp',
  'Hospitality_3.webp',
  '2-3_healthcare_dark-call-queue_end-the-8am-phone-chaos.webp',
  'Online_Coach_1.webp',
  '2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.webp',
  'Online_Coach_2.webp',
  '2-3_hospitality_holographic-receptionist_your-front-desk-always-open.webp',
  'Online_Coach_3.webp',
  '2-3_kitchen_modern-kitchen-with-floorplan_capture-every-dream-kitchen-enquiry.webp',
  'Physio_1.webp',
  '2-3_realestate_phone-map_never-miss-a-viewing.webp',
  'Physio_2.webp',
  '2-3_realestate_phone-map-at-night_never-miss-a-viewing-again.webp',
  'Physio_3.webp',
  '2-3_realestate_phone-with-house-icon_focus-on-the-viewing.webp',
  'Real_Estate_1.webp',
  '2-3_realestate_phone-with-property-card_ai-qualifies-your-property-leads.webp',
  'Real_Estate_2.webp',
  '2-3_salon_dark-chair-with-calendar_stay-fully-booked-stay-present.webp',
  'Real_Estate_3.webp',
  '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.webp',
  'Salon_1.webp',
  '2-3_tradesman_van-at-night_never-miss-an-emergency-job.webp',
  'Salon_2.webp',
  '2-3_veterinary_vet-with-tablet_never-miss-a-worried-pet-parent.webp',
  'Salon_3.webp',
  '2-3_voicebot_globe-and-tablet_100k-conversations-zero-burnout.webp',
  'Trades_1.webp',
  'Trades_2.webp',
  'Trades_3.webp',
];

  const MOBILE_PRELOAD_QUERY = '(max-width: 768px)';
  const MOBILE_PRELOAD_TIMEOUT_MS = 1400;

  let singleInitialized = false;
  let doubleInitialized = false;
  let mobilePreloadPromise = null;

  function isMobileViewport() {
    return !!window.matchMedia && window.matchMedia(MOBILE_PRELOAD_QUERY).matches;
  }

  function preloadMarqueeImagesOnce() {
    if (!isMobileViewport()) return Promise.resolve();
    if (mobilePreloadPromise) return mobilePreloadPromise;

    const urls = MARQUEE_IMAGES.map((filename) => ASSET_PATH + filename);
    mobilePreloadPromise = preloadUrls(urls, MOBILE_PRELOAD_TIMEOUT_MS);
    return mobilePreloadPromise;
  }

  function preloadUrls(urls, timeoutMs) {
    return new Promise((resolve) => {
      if (!urls.length) {
        resolve({ timedOut: false, completed: 0, total: 0 });
        return;
      }

      let done = false;
      let completed = 0;
      const total = urls.length;

      const timer = window.setTimeout(() => finish(true), timeoutMs);

      function finish(timedOut) {
        if (done) return;
        done = true;
        window.clearTimeout(timer);
        resolve({ timedOut, completed, total });
      }

      urls.forEach((url) => {
        const img = new Image();
        const onComplete = () => {
          if (done) return;
          completed += 1;
          if (completed >= total) finish(false);
        };
        img.onload = onComplete;
        img.onerror = onComplete;
        img.src = url;
      });
    });
  }

  function initSingleMarquee() {
    if (singleInitialized) return;
    if (document.body.classList.contains('page-services')) return;
    singleInitialized = true;

    cleanupLegacyMarquees();
    ensureLightbox();

    const footer = document.querySelector('footer.site-footer');
    if (!footer || !footer.parentNode) return;

    preloadMarqueeImagesOnce().finally(() => {
      const marquee = buildSingleRow();
      footer.parentNode.insertBefore(marquee, footer);
    });
  }

  function initDoubleMarquee() {
    if (!document.body.classList.contains('page-services')) return;
    if (doubleInitialized) return;
    doubleInitialized = true;

    cleanupLegacyMarquees();
    ensureLightbox();

    preloadMarqueeImagesOnce().finally(() => {
      const container = buildDoubleDeck();
      const slot = document.getElementById('innovation-marquee-slot');
      const galleryGrid = document.getElementById('neural-grid');

      if (slot) {
        slot.replaceWith(container);
      } else if (galleryGrid && galleryGrid.parentNode) {
        galleryGrid.insertAdjacentElement('afterend', container);
      } else {
        document.body.appendChild(container);
      }

      alignInnovationAnchor();
    });
  }

  function cleanupLegacyMarquees() {
    document.querySelectorAll('.premium-marquee-container, .logo-slider, .single-marquee, .double-marquee').forEach((el) => el.remove());
  }

  function buildSingleRow() {
    const container = document.createElement('div');
    container.className = 'single-marquee';

    const track = document.createElement('div');
    track.className = 'marquee-track';

    track.appendChild(createImagesFragment(MARQUEE_IMAGES));
    track.appendChild(createImagesFragment(MARQUEE_IMAGES));

    container.appendChild(track);
    return container;
  }

  function buildDoubleDeck() {
    const wrapper = document.createElement('div');
    wrapper.className = 'double-marquee';

    const topRow = createMarqueeRow(MARQUEE_IMAGES, 'scroll-right fast');
    const bottomRow = createMarqueeRow([...MARQUEE_IMAGES].reverse(), 'scroll-left slow');

    wrapper.appendChild(topRow);
    wrapper.appendChild(bottomRow);
    return wrapper;
  }

  function createMarqueeRow(images, animationClasses) {
    const track = document.createElement('div');
    track.className = `marquee-track ${animationClasses}`;

    track.appendChild(createImagesFragment(images));
    track.appendChild(createImagesFragment(images));

    return track;
  }

  function createImagesFragment(images) {
    const fragment = document.createDocumentFragment();

    images.forEach((filename) => {
      const img = document.createElement('img');
      img.src = ASSET_PATH + filename;
      img.className = 'marquee-img';
      img.alt = 'Silverstone Client Success';
      img.loading = 'eager'; // SPEC: MARQUEE_NO_TOUCH_REQUIRED

      img.onerror = () => {
        img.style.display = 'none';
      };

      img.addEventListener('click', () => openLightbox(img.src));
      fragment.appendChild(img);
    });

    return fragment;
  }

  function ensureLightbox() {
    if (document.getElementById('premium-lightbox')) return;

    const lightbox = document.createElement('div');
    lightbox.id = 'premium-lightbox';
    lightbox.className = 'premium-lightbox';

    const content = document.createElement('div');
    content.className = 'lightbox-content';

    const img = document.createElement('img');
    img.id = 'lightbox-img';
    img.className = 'lightbox-img';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.ariaLabel = 'Close Lightbox';
    closeBtn.addEventListener('click', closeLightbox);

    content.appendChild(img);
    content.appendChild(closeBtn);
    lightbox.appendChild(content);

    document.body.appendChild(lightbox);
  }

  function openLightbox(src) {
    const lightbox = document.getElementById('premium-lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lightbox || !img) return;

    img.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = document.getElementById('premium-lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function alignInnovationAnchor() {
    const hash = window.location.hash;
    if (!hash || (hash !== '#innovation-gallery' && hash !== '#neural-grid')) return;

    const target = document.getElementById('innovation-gallery') || document.getElementById('neural-grid');
    if (!target) return;

    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;

    window.setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
      window.scrollTo({ top, behavior: 'auto' });
    }, 120);
  }

  function bindServiceTileLightbox() {
    const triggers = document.querySelectorAll('.js-premium-lightbox');
    if (!triggers.length) return;

    ensureLightbox();

    triggers.forEach((trigger) => {
      if (trigger.dataset.ssLightboxBound === '1') return;
      trigger.dataset.ssLightboxBound = '1';

      trigger.addEventListener('click', () => {
        const img = trigger.querySelector('img');
        const src = img ? img.currentSrc || img.src : '';
        if (!src) return;
        openLightbox(src);
      });
    });
  } // SPEC: INDEX_SERVICES_IMAGE_LIGHTBOX_2025_12

  function init() {
    initSingleMarquee();
    initDoubleMarquee();
    bindServiceTileLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/**
 * PREMIUM GALLERY: PRECISION-GAP MOSAIC & CINEMATIC LIGHTBOX
 * 
 * Logic:
 * 1. Clears existing #neural-grid content.
 * 2. Injects curated subset of images (15 images selected for perfect 3-column balance).
 * 3. Applies masonry-like classes (landscape/portrait/square).
 * 4. Handles 3D Flip on hover.
 * 5. Handles Lightbox open/close (Strict 'X' button close).
 */

(function () {
    'use strict';

    // --- CONFIGURATION ---
    const GALLERY_TARGET_ID = 'neural-grid';
    const ASSET_PATH = 'assets/images/socialmedia/';

    // Curated Image List
    // Strategy: 3 Columns. Target Height = 6.0 units.
    // Heights: Square=1.0, Portrait=1.5, Landscape=0.666(approx) -> 3 Landscapes = 2.0
    // Col 1: 4 Portraits (6.0)
    // Col 2: 2 Portraits + 3 Squares (6.0)
    // Col 3: 2 Portraits + 3 Landscapes + 1 Square (6.0)
    // Total: 8 Portraits, 4 Squares, 3 Landscapes = 15 Images.

    const CURATED_IMAGES = [
        // SPEC: SERVICES_NEURAL_GRID_REPLACE_SQUARE_LANDSCAPE_2025_12_30
        // SPEC: SERVICES_NEURAL_GRID_REPLACE_PORTRAIT_2025_12_30
        // --- COLUMN 1 (4 Portraits) ---
        { file: 'General_Services_2B_Mobile.jpeg', type: 'portrait', title: 'Automation Modules', backCopy: 'Expanded modules across your systems.' },
        { file: 'eComm_3_Mobile.jpeg', type: 'portrait', title: 'eCommerce Momentum', backCopy: 'Keep orders, carts, and follow-ups moving.' },
        { file: 'Trades_2_Mobile.jpeg', type: 'portrait', title: 'Trades Dispatch', backCopy: 'Route jobs fast with clean, live updates.' },
        { file: 'Gyms_1_Mobile.jpeg', type: 'portrait', title: 'Gym Member Flow', backCopy: 'Lead-to-member journeys handled smoothly.' },

        // --- COLUMN 2 (2 Portraits + 3 Squares) ---
        { file: 'Hospitality_1_Mobile.jpeg', type: 'portrait', title: 'Hospitality Flow', backCopy: 'Bookings, reminders, and guest comms aligned.' },
        { file: '2-3_realestate_phone-with-house-icon_focus-on-the-viewing.webp', type: 'portrait', title: 'Viewing Focus', backCopy: 'Prioritise viewings with instant responses.' },
        { file: 'services_consulting_mobile.jpg', type: 'square', title: 'Consulting Sprint', backCopy: 'Clarity on tools, roadmap, and next steps.' },
        { file: 'services_data_integration_mobile.jpg', type: 'square', title: 'Data Integration', backCopy: 'Connect apps so data flows cleanly.' },
        { file: 'services_workflow_automation_mobile.jpg', type: 'square', title: 'Workflow Automation', backCopy: 'Remove bottlenecks with smart workflows.' },

        // --- COLUMN 3 (2 Portraits + 3 Landscapes + 1 Square) ---
        { file: '2-3_voicebot_globe-and-tablet_100k-conversations-zero-burnout.webp', type: 'portrait', title: 'Voicebot Coverage', backCopy: 'Always-on conversations without burnout.' },
        { file: '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.webp', type: 'portrait', title: 'Salon Bookings', backCopy: 'Confirmed bookings with fewer gaps.' },
        { file: '3-2_tutoring_tutor-with-laptop_more-focused-1-1-lessons.webp', type: 'landscape', title: 'Focused Tutoring', backCopy: '1:1 sessions stay organised and on time.' },
        { file: '3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.webp', type: 'landscape', title: 'Sales Dashboards', backCopy: 'Track calls, replies, and conversion lift.' },
        { file: '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep.webp', type: 'landscape', title: 'Always-On Sales', backCopy: 'Sales keep moving after hours.' },
        { file: '1-1_Trades_Grid.jpg', type: 'square', title: 'Trades Grid', backCopy: 'Jobs, updates, and schedules in one grid.' }
    ];

    // --- INITIALIZATION ---
    function initPremiumGallery() {
        const gridContainer = document.getElementById(GALLERY_TARGET_ID);
        if (!gridContainer) return; // Not on services page or container missing

        // 1. Clean Slate Protocol
        gridContainer.innerHTML = '';
        while (gridContainer.firstChild) {
            gridContainer.removeChild(gridContainer.firstChild);
        }

        // 2. Build Mosaic
        const fragment = document.createDocumentFragment();

        CURATED_IMAGES.forEach(imgData => {
            const tile = createTile(imgData);
            fragment.appendChild(tile);
        });

        gridContainer.appendChild(fragment);

        // 3. Inject Lightbox DOM
        injectLightbox();
    }

    // --- TILE CREATION ---
    function createTile(data) {
        const tile = document.createElement('div');
        tile.className = `premium-tile ${data.type}`;

        // Inner Container for 3D Flip
        const inner = document.createElement('div');
        inner.className = 'tile-inner';

        // Front Face (Image)
        const front = document.createElement('div');
        front.className = 'tile-front';
        const img = document.createElement('img');
        img.src = ASSET_PATH + data.file;
        img.alt = data.title;
        img.loading = 'eager';
        img.decoding = 'async';
        img.fetchPriority = 'high';

        // Error handling
        img.onerror = function () {
            this.style.display = 'none';
            console.warn(`Image not found: ${data.file}`);
        };
        front.appendChild(img);

        // Back Face (Metadata)
        const back = document.createElement('div');
        back.className = 'tile-back';
        const title = document.createElement('h4');
        title.textContent = data.title;
        const subtitle = document.createElement('p');
        subtitle.textContent = data.backCopy || 'Click to expand';
        back.appendChild(title);
        back.appendChild(subtitle);

        inner.appendChild(front);
        inner.appendChild(back);
        tile.appendChild(inner);

        // Click Event -> Open Lightbox
        tile.addEventListener('click', () => openLightbox(img.src));

        return tile;
    }

    // --- LIGHTBOX LOGIC ---
    function injectLightbox() {
        if (document.getElementById('premium-lightbox')) return;

        const lightbox = document.createElement('div');
        lightbox.id = 'premium-lightbox';
        lightbox.className = 'premium-lightbox';

        const content = document.createElement('div');
        content.className = 'lightbox-content';

        const img = document.createElement('img');
        img.id = 'lightbox-img';
        img.className = 'lightbox-img';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.ariaLabel = 'Close Lightbox';

        // Strict Closing Logic: ONLY the 'X' button closes it
        closeBtn.addEventListener('click', closeLightbox);

        content.appendChild(img);
        content.appendChild(closeBtn);
        lightbox.appendChild(content);

        document.body.appendChild(lightbox);
    }

    function openLightbox(src) {
        const lightbox = document.getElementById('premium-lightbox');
        const img = document.getElementById('lightbox-img');
        if (!lightbox || !img) return;

        img.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
    }

    function closeLightbox() {
        const lightbox = document.getElementById('premium-lightbox');
        if (!lightbox) return;

        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
    }

    // Run Initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPremiumGallery);
    } else {
        initPremiumGallery();
    }

})();


/*
 * cookie-consent.js
 *
 * This script displays a cookie consent banner until the user grants
 * permission. Once accepted, a persistent cookie is stored so the banner
 * does not appear again. The banner links to the site's privacy policy.
 */

document.addEventListener('DOMContentLoaded', function () {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const declineBtn = document.getElementById('cookie-decline-btn');
  if (!banner || !acceptBtn || !declineBtn) return;

  const STORAGE_KEY = 'cookieConsentChoice';

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  const storedChoice = localStorage.getItem(STORAGE_KEY);
  const cookieChoice = getCookie('cookieConsent');

  if (storedChoice || cookieChoice) {
    banner.style.display = 'none';
    return;
  }

  function storeChoice(value) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (err) {
      // If storage is blocked, continue without failing.
    }

    try {
      document.cookie =
        'cookieConsent=' +
        encodeURIComponent(value) +
        '; expires=' +
        expiryDate.toUTCString() +
        '; path=/; SameSite=Lax';
    } catch (err) {
      // Ignore cookie write issues to avoid breaking the page.
    }

    banner.style.display = 'none';
    banner.setAttribute('data-consent-dismissed', 'true');
  }

  banner.style.display = 'flex';

  acceptBtn.addEventListener('click', function () {
    storeChoice('accepted');
  });

  declineBtn.addEventListener('click', function () {
    storeChoice('declined');
  });
});


(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('contact-status');
  function setStatus(msg, ok) {
    if (!status) return;
    status.style.display = 'block';
    status.style.color = ok ? 'var(--color-success, #6ee7b7)' : 'var(--color-warning, #fca5a5)';
    status.textContent = msg;
  }
  function sanitize(str) {
    return String(str || '').replace(/[<>]/g, '');
  }
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = new FormData(form);
    if ((data.get('company') || '').length > 0) {
      return;
    }
    const name = sanitize(data.get('name'));
    const email = sanitize(data.get('email'));
    const message = sanitize(data.get('message'));
    if (!name || !email || !message) {
      setStatus('Please complete all fields.', false);
      return;
    }
    setStatus('Sending…', true);
    try {
      const res = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('Thanks! Your message has been sent.', true);
        form.reset();
      } else {
        setStatus(body.error || 'Sorry, something went wrong. Please try again later.', false);
      }
    } catch (err) {
      setStatus('Network error. Please try again.', false);
    }
  });
})();


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

  document.addEventListener('DOMContentLoaded', function () {
    window.Silverstone = window.Silverstone || {};
    const api = window.Silverstone;

    loadBaseStyles();

    if (api.initHeaderNav) api.initHeaderNav();
    if (api.initScrollReveal) api.initScrollReveal();
    if (api.initStats) api.initStats();
    if (api.initParallax) api.initParallax();
  });
})();
