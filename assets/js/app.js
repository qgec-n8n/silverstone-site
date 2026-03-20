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
          btn.textContent = '← Niches';
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
            <div class="mobile-nav-view mobile-nav-view--services" aria-label="Niches navigation">
              <div class="mobile-nav-subhead">
                <p class="mobile-nav-kicker">Niches</p>
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
      addGroup(Array.from(document.querySelectorAll('#service-page-clusters .services-resource-shell')));
      addGroup(Array.from(document.querySelectorAll('#service-page-clusters .services-resource-list--niches > li')));
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
      addGroup(Array.from(document.querySelectorAll('.page-blog .section.brand-gradient .cta-card')));
    }

    if (body.classList.contains('page-book')) {
      addGroup(Array.from(document.querySelectorAll('.page-book .section.brand-gradient .cta-card')));
    }

    return groups;
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

    const prepareNumberMarkup = (number) => {
      if (number.dataset.ssNumberPrepared === '1') return;

      const prefix = number.getAttribute('data-prefix') || '';
      const suffix =
        number.getAttribute('data-suffix') || number.getAttribute('data-plus') || '';
      const initial = number.textContent.trim();
      const valueMatch = initial.match(/-?[\d,]+/);
      const valueText = valueMatch ? valueMatch[0].replace(/,/g, '') : '0';

      number.textContent = '';

      if (prefix) {
        const prefixSpan = document.createElement('span');
        prefixSpan.className = 'number__prefix';
        prefixSpan.textContent = prefix;
        number.appendChild(prefixSpan);
      }

      const valueSpan = document.createElement('span');
      valueSpan.className = 'number__value';
      valueSpan.textContent = valueText;
      number.appendChild(valueSpan);

      if (suffix) {
        const suffixSpan = document.createElement('span');
        suffixSpan.className = 'number__suffix';
        suffixSpan.textContent = suffix;
        number.appendChild(suffixSpan);
      }

      number.dataset.ssNumberPrepared = '1';
    };

    const setNumberValue = (number, value) => {
      prepareNumberMarkup(number);
      const valueEl = number.querySelector('.number__value');
      if (valueEl) {
        valueEl.textContent = value.toLocaleString();
        return;
      }
      number.textContent = value.toLocaleString();
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

      prepareNumberMarkup(number);
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

  let initialized = false;
  let activeHighlightedCard = null;

  const NICHE_MAP = {
    '/niches/estate-agents': {
      label: 'Estate agents',
      atlasAnchor: '/pricing#pricing-atlas-real-estate',
      primaryAnchor: '/pricing#pricing-flagship-never-miss-a-viewing',
      packName: 'Never Miss a Viewing Pack',
      nicheHref: '/niches/estate-agents',
      pricingLabel: 'Compare estate pricing',
    },
    '/niches/hospitality': {
      label: 'Hospitality',
      atlasAnchor: '/pricing#pricing-atlas-hospitality',
      primaryAnchor: '/pricing#pricing-flagship-24-7-guest-concierge',
      packName: '24/7 Guest Concierge Bot',
      nicheHref: '/niches/hospitality',
      pricingLabel: 'Compare hospitality pricing',
    },
    '/niches/salons-barbers': {
      label: 'Salons & barbers',
      atlasAnchor: '/pricing#pricing-atlas-salons',
      primaryAnchor: '/pricing#pricing-flagship-rebook-review',
      packName: 'Rebook & Review Pack',
      nicheHref: '/niches/salons-barbers',
      pricingLabel: 'Compare salon pricing',
    },
    '/niches/trades-virtual-office': {
      label: 'Trades & field services',
      atlasAnchor: '/pricing#pricing-atlas-trades',
      primaryAnchor: '/pricing#pricing-flagship-trades-virtual-office',
      packName: 'Trades Virtual Office',
      nicheHref: '/niches/trades-virtual-office',
      pricingLabel: 'Compare trades pricing',
    },
    '/niches/ecommerce': {
      label: 'eCommerce',
      atlasAnchor: '/pricing#pricing-atlas-ecommerce',
      primaryAnchor: '/pricing#pricing-flagship-ecom-growth-engine',
      packName: 'E-com Growth Engine',
      nicheHref: '/niches/ecommerce',
      pricingLabel: 'Compare eCommerce pricing',
    },
    '/niches/physios-chiropractors': {
      label: 'Physios & chiropractors',
      atlasAnchor: '/pricing#pricing-atlas-physios-chiropractors',
      primaryAnchor: '/pricing#pricing-flagship-smart-intake',
      packName: 'Smart Intake Starter Pack',
      nicheHref: '/niches/physios-chiropractors',
      pricingLabel: 'Compare clinic pricing',
    },
    '/niches/dentists': {
      label: 'Dentists',
      atlasAnchor: '/pricing#pricing-atlas-dentists',
      primaryAnchor: '/pricing#pricing-flagship-recall-starter',
      packName: 'Recall Starter Pack',
      nicheHref: '/niches/dentists',
      pricingLabel: 'Compare dental pricing',
    },
    '/niches/gyms-fitness-studios': {
      label: 'Gyms & fitness studios',
      atlasAnchor: '/pricing#pricing-atlas-gym-owners',
      primaryAnchor: '/pricing#pricing-flagship-gym-growth-engine',
      packName: 'Gym Growth Engine',
      nicheHref: '/niches/gyms-fitness-studios',
      pricingLabel: 'Compare gym pricing',
    },
    '/niches/fitness-coaches': {
      label: 'Fitness coaches & creators',
      atlasAnchor: '/pricing#pricing-atlas-fitness-coaches',
      primaryAnchor: '/pricing#pricing-flagship-dm-to-lead',
      packName: 'DM to Lead Starter Pack',
      nicheHref: '/niches/fitness-coaches',
      pricingLabel: 'Compare creator pricing',
    },
  };

  const RECOMMENDER_ORDER = [
    '/niches/estate-agents',
    '/niches/hospitality',
    '/niches/salons-barbers',
    '/niches/trades-virtual-office',
    '/niches/ecommerce',
    '/niches/physios-chiropractors',
    '/niches/dentists',
    '/niches/gyms-fitness-studios',
    '/niches/fitness-coaches',
  ];

  function normalizePathname(pathname) {
    if (!pathname) return '/';
    if (pathname === '/index.html') return '/';
    if (pathname.endsWith('.html')) {
      return pathname.replace(/\.html$/, '');
    }
    return pathname;
  }

  function resolveNicheConfig(pathname) {
    return NICHE_MAP[normalizePathname(pathname)] || null;
  }

  function toHashHref(href) {
    if (!href) return '#pricing-atlas';
    const hashIndex = href.indexOf('#');
    return hashIndex >= 0 ? href.slice(hashIndex) : href;
  }

  function getHeaderOffset() {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const cssOffset = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--header-safe-offset')
    );
    const safeOffset = Number.isFinite(cssOffset) ? cssOffset : 0;
    return Math.max(headerHeight, safeOffset);
  }

  function applyHighlight(target) {
    if (!target || !target.classList) return;
    if (activeHighlightedCard && activeHighlightedCard !== target) {
      activeHighlightedCard.classList.remove('is-highlighted');
    }
    document.querySelectorAll('.ss-pricing__card.is-highlighted').forEach((card) => {
      if (card !== target) {
        card.classList.remove('is-highlighted');
      }
    });
    target.classList.add('is-highlighted');
    activeHighlightedCard = target;
  }

  function dispatchPricingTarget(hash) {
    window.dispatchEvent(
      new window.CustomEvent('silverstone:pricing-target', {
        detail: { hash, reveal: true },
      })
    );
  }

  function scrollToAnchorTarget(target) {
    const stickyApi = window.Silverstone && window.Silverstone.stickyCta;
    if (stickyApi && typeof stickyApi.collapseTemporarilyForAnchorNavigation === 'function') {
      stickyApi.collapseTemporarilyForAnchorNavigation();
    }

    const topOffset = getHeaderOffset() + 20;
    const nextTop = Math.max(0, window.scrollY + target.getBoundingClientRect().top - topOffset);

    window.scrollTo({
      top: nextTop,
      behavior: 'smooth',
    });
  }

  function ensureAnchorTarget(hash) {
    if (!hash) return;

    dispatchPricingTarget(hash);

    let attempts = 0;

    const tryFocus = () => {
      const target = document.querySelector(hash);
      if (target) {
        if (typeof target.focus === 'function') {
          target.focus({ preventScroll: true });
        }
        const finalizeScroll = () => {
          scrollToAnchorTarget(target);
          if (target.classList && target.classList.contains('ss-pricing__card')) {
            applyHighlight(target);
          }
        };
        if (window.innerWidth <= 780) {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(finalizeScroll);
          });
        } else {
          finalizeScroll();
        }
        return;
      }

      attempts += 1;
      if (attempts < 28) {
        window.setTimeout(tryFocus, 100);
      }
    };

    window.setTimeout(tryFocus, 80);
  }

  function injectNicheLinks() {
    const config = resolveNicheConfig(window.location.pathname);
    if (!config) return;
    const isMobile = window.matchMedia('(max-width: 780px)').matches;

    const heroButtons = document.querySelector('.hero .cta-buttons');
    if (heroButtons) {
      const existingAtlasButton = heroButtons.querySelector('[data-pricing-atlas-link]');
      if (isMobile) {
        existingAtlasButton?.remove();
      } else if (!existingAtlasButton) {
        const atlasButton = document.createElement('a');
        atlasButton.href = config.atlasAnchor;
        atlasButton.className = 'btn btn-secondary';
        atlasButton.dataset.pricingAtlasLink = 'true';
        atlasButton.textContent = config.pricingLabel;
        heroButtons.appendChild(atlasButton);
      }
    }

    const ctaLinks = document.querySelector('.cta-link-list');
    if (ctaLinks && !ctaLinks.querySelector('[data-pricing-atlas-chip]')) {
      const atlasChip = document.createElement('a');
      atlasChip.href = config.atlasAnchor;
      atlasChip.dataset.pricingAtlasChip = 'true';
      atlasChip.textContent = `See ${config.label.toLowerCase()} pricing`;
      ctaLinks.insertBefore(atlasChip, ctaLinks.children[1] || null);
    }
  }

  function mountRecommender() {
    const host = document.querySelector('[data-pricing-recommender]');
    if (!host) return;

    let selectedPath = RECOMMENDER_ORDER[0];
    let selectedMode = 'fast';

    const render = () => {
      const config = resolveNicheConfig(selectedPath);
      if (!config) return;

      const fastMode = selectedMode === 'fast';
      const primaryHref = fastMode ? toHashHref(config.primaryAnchor) : toHashHref(config.atlasAnchor);
      const secondaryHref = fastMode ? toHashHref(config.atlasAnchor) : config.nicheHref;
      const primaryLabel = fastMode ? `See ${config.packName}` : `Open ${config.label} atlas`;
      const secondaryLabel = fastMode ? 'Open pricing atlas' : `Open ${config.label} page`;
      const recommendedLabel = fastMode ? config.packName : `${config.label} atlas`;
      const resultCopy = fastMode
        ? `Start with ${config.packName} if you want the fastest payback for ${config.label.toLowerCase()}.`
        : `Open the ${config.label.toLowerCase()} atlas to compare modules, starter packs, and premium builds in one view.`;

      host.innerHTML = `
        <div class="pricing-recommender">
          <div class="pricing-recommender__panel">
            <span class="pricing-recommender__eyebrow">Pricing recommender</span>
            <h3 class="pricing-recommender__title">Point me to the right pricing card.</h3>
            <p class="pricing-recommender__copy">Choose your niche, then pick the fastest starting pack or the full range.</p>
            <div class="pricing-recommender__step">
              <span class="pricing-recommender__step-label">1. Choose your niche</span>
              <div class="pricing-recommender__choices pricing-recommender__choices--niches">
                ${RECOMMENDER_ORDER.map((path) => {
                  const entry = resolveNicheConfig(path);
                  const active = path === selectedPath ? ' is-active' : '';
                  return `<button class="pricing-recommender__choice${active}" type="button" data-niche-path="${path}">${entry.label}</button>`;
                }).join('')}
              </div>
            </div>
            <div class="pricing-recommender__step">
              <span class="pricing-recommender__step-label">2. What do you want to compare?</span>
              <div class="pricing-recommender__choices">
                <button class="pricing-recommender__choice${fastMode ? ' is-active' : ''}" type="button" data-recommender-mode="fast">Fastest starting pack</button>
                <button class="pricing-recommender__choice${!fastMode ? ' is-active' : ''}" type="button" data-recommender-mode="atlas">Compare every pack</button>
              </div>
            </div>
            <div class="pricing-recommender__result">
              <div class="pricing-recommender__result-copy">
                <span class="pricing-recommender__result-label">Best next view</span>
                <strong>${recommendedLabel}</strong>
                <p>${resultCopy}</p>
              </div>
              <div class="pricing-recommender__actions">
                <a class="btn btn-primary" href="${primaryHref}">${primaryLabel}</a>
                <a class="btn btn-secondary" href="${secondaryHref}">${secondaryLabel}</a>
              </div>
            </div>
          </div>
        </div>
      `;

      host.querySelectorAll('[data-niche-path]').forEach((button) => {
        button.addEventListener('click', () => {
          selectedPath = button.getAttribute('data-niche-path') || selectedPath;
          render();
        });
      });

      host.querySelectorAll('[data-recommender-mode]').forEach((button) => {
        button.addEventListener('click', () => {
          selectedMode = button.getAttribute('data-recommender-mode') || selectedMode;
          render();
        });
      });
    };

    render();
  }

  function initPricingDeeplinks() {
    if (initialized) return;
    initialized = true;

    if (document.body.classList.contains('page-pricing')) {
      mountRecommender();
      document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a[href^="#pricing-"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href) return;
        event.preventDefault();
        if (window.location.hash !== href) {
          window.history.pushState(null, '', href);
        }
        ensureAnchorTarget(href);
      });
    }

    if (document.body.classList.contains('page-niche')) {
      injectNicheLinks();
    }

    ensureAnchorTarget(window.location.hash);
    window.addEventListener('hashchange', () => ensureAnchorTarget(window.location.hash));
    window.addEventListener('load', () => ensureAnchorTarget(window.location.hash));
  }

  window.Silverstone.initPricingDeeplinks = initPricingDeeplinks;
})();


(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;
  let temporaryCollapseTimeoutId = null;

  const STORAGE_KEY = 'ss-cta-collapsed';
  const MOBILE_BREAKPOINT = 780;

  const NICHE_CTA_MAP = {
    '/niches/estate-agents': {
      eyebrow: 'Estate agent pricing',
      title: 'Compare estate pricing or book the audit.',
      copy: 'Jump straight to the real-estate pricing atlas, then scope the right branch workflow.',
      secondaryHref: '/pricing#pricing-atlas-real-estate',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Estate pricing',
    },
    '/niches/hospitality': {
      eyebrow: 'Hospitality pricing',
      title: 'Compare hospitality pricing or book the audit.',
      copy: 'Open the hospitality atlas card, then narrow down the guest-concierge or no-show fix.',
      secondaryHref: '/pricing#pricing-atlas-hospitality',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Hospitality pricing',
    },
    '/niches/salons-barbers': {
      eyebrow: 'Salon pricing',
      title: 'Compare salon pricing or book the audit.',
      copy: 'See the salon atlas card first, then scope the no-show or rebooking system that fits.',
      secondaryHref: '/pricing#pricing-atlas-salons',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Salon pricing',
    },
    '/niches/trades-virtual-office': {
      eyebrow: 'Trades pricing',
      title: 'Compare trades pricing or book the audit.',
      copy: 'Open the trades atlas card, then choose the fastest call, quote, or scheduling fix.',
      secondaryHref: '/pricing#pricing-atlas-trades',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Trades pricing',
    },
    '/niches/ecommerce': {
      eyebrow: 'eCommerce pricing',
      title: 'Compare eCommerce pricing or book the audit.',
      copy: 'See the eCommerce atlas card before you choose a cart, support, or LTV workflow.',
      secondaryHref: '/pricing#pricing-atlas-ecommerce',
      secondaryLabel: 'See pricing',
      launcherLabel: 'eCommerce pricing',
    },
    '/niches/physios-chiropractors': {
      eyebrow: 'Clinic pricing',
      title: 'Compare clinic pricing or book the audit.',
      copy: 'Open the clinic atlas card, then scope the intake or rebooking layer that pays back fastest.',
      secondaryHref: '/pricing#pricing-atlas-physios-chiropractors',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Clinic pricing',
    },
    '/niches/dentists': {
      eyebrow: 'Dental pricing',
      title: 'Compare dental pricing or book the audit.',
      copy: 'See the dental atlas card first, then choose the recall or treatment follow-up route.',
      secondaryHref: '/pricing#pricing-atlas-dentists',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Dental pricing',
    },
    '/niches/gyms-fitness-studios': {
      eyebrow: 'Gym pricing',
      title: 'Compare gym pricing or book the audit.',
      copy: 'Open the gym atlas card, then choose the member reactivation or class-fill system.',
      secondaryHref: '/pricing#pricing-atlas-gym-owners',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Gym pricing',
    },
    '/niches/fitness-coaches': {
      eyebrow: 'Creator pricing',
      title: 'Compare creator pricing or book the audit.',
      copy: 'See the creator atlas card before choosing your DM triage or onboarding workflow.',
      secondaryHref: '/pricing#pricing-atlas-fitness-coaches',
      secondaryLabel: 'See pricing',
      launcherLabel: 'Creator pricing',
    },
  };

  function normalizePathname(pathname) {
    if (!pathname) return '/';
    if (pathname === '/index.html') return '/';
    if (pathname.endsWith('.html')) {
      return pathname.replace(/\.html$/, '');
    }
    return pathname;
  }

  function resolveConfig(pathname) {
    const normalizedPath = normalizePathname(pathname);

    if (normalizedPath === '/') {
      return {
        eyebrow: 'Next step',
        title: 'See pricing or book the audit.',
        copy: 'Compare packs first if you are still deciding, or book the audit if you want a scoped recommendation.',
        secondaryHref: '/pricing',
        secondaryLabel: 'See pricing',
        launcherLabel: 'Open pricing',
      };
    }

    if (normalizedPath === '/services') {
      return {
        eyebrow: 'Services to pricing',
        title: 'Compare packs or book the audit.',
        copy: 'Move from the services overview into the pricing atlas without losing your place.',
        secondaryHref: '/pricing#pricing-atlas',
        secondaryLabel: 'Compare pricing',
        launcherLabel: 'See pricing',
      };
    }

    if (normalizedPath === '/pricing') {
      return {
        eyebrow: 'Ready to scope',
        title: 'Book the audit when you know the pricing range.',
        copy: 'Use services if you need more context, then come back to pricing with a narrower shortlist.',
        secondaryHref: '/services',
        secondaryLabel: 'View services',
        launcherLabel: 'Open CTA',
      };
    }

    return NICHE_CTA_MAP[normalizedPath] || null;
  }

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function isHoverLauncherMode() {
    return (
      !isMobileViewport() &&
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  }

  function createStickyShell(config) {
    const shell = document.createElement('aside');
    shell.className = 'sticky-cta-shell';
    shell.setAttribute('aria-label', 'Sticky call to action');
    shell.innerHTML = `
      <div class="sticky-cta" aria-hidden="true">
        <button class="sticky-cta__close" type="button" aria-label="Minimise sticky call to action">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
        <span class="sticky-cta__eyebrow">${config.eyebrow}</span>
        <div class="sticky-cta__title">${config.title}</div>
        <p class="sticky-cta__copy">${config.copy}</p>
        <div class="sticky-cta__actions">
          <a class="btn btn-secondary" href="${config.secondaryHref}">${config.secondaryLabel}</a>
          <a class="btn btn-primary" href="/book">Book audit</a>
        </div>
      </div>
      <button class="sticky-cta__launcher" type="button" aria-label="${config.launcherLabel}">
        <span class="sticky-cta__launcher-icon" aria-hidden="true">
          <i class="fa-solid fa-bolt"></i>
        </span>
        <span class="sticky-cta__launcher-copy">${config.launcherLabel}</span>
      </button>
    `;
    return shell;
  }

  function initStickyCta() {
    if (initialized) return;
    initialized = true;

    const config = resolveConfig(window.location.pathname);
    if (!config) return;

    const footer = document.querySelector('.site-footer');
    const hero = document.querySelector('.hero');
    if (!footer || !hero) return;

    const shell = createStickyShell(config);
    const sticky = shell.querySelector('.sticky-cta');
    const launcher = shell.querySelector('.sticky-cta__launcher');
    const closeButton = shell.querySelector('.sticky-cta__close');

    if (!sticky || !launcher || !closeButton) return;

    document.body.appendChild(shell);
    document.body.classList.add('has-sticky-cta');

    const cookieBanner = document.getElementById('cookie-banner');
    const state = {
      dismissed: window.sessionStorage.getItem(STORAGE_KEY) === '1',
      previewOpen: false,
      suppressPreview: false,
      temporarilyCollapsed: false,
      shouldShow: false,
    };

    function syncAria() {
      const expanded = state.shouldShow && (!state.dismissed || state.previewOpen);
      sticky.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      launcher.setAttribute(
        'aria-label',
        expanded ? 'Sticky call to action is open' : config.launcherLabel
      );
    }

    function persistDismissed(value) {
      if (value) {
        window.sessionStorage.setItem(STORAGE_KEY, '1');
      } else {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    function render() {
      const expanded =
        state.shouldShow &&
        !state.temporarilyCollapsed &&
        (!state.dismissed || state.previewOpen);
      shell.classList.toggle('is-visible', state.shouldShow);
      shell.classList.toggle('is-dismissed', state.dismissed);
      shell.classList.toggle('is-preview-open', state.previewOpen);
      shell.classList.toggle('is-temp-collapsed', state.temporarilyCollapsed);
      shell.classList.toggle('is-mobile', isMobileViewport());
      sticky.classList.toggle('is-visible', expanded);
      launcher.classList.toggle('is-visible', state.shouldShow && !expanded);
      syncAria();
    }

    function setDismissed(nextValue, persist, options) {
      const shouldSuppressPreview =
        !!nextValue && !!options && options.suppressPreview && isHoverLauncherMode();
      state.dismissed = !!nextValue;
      state.previewOpen = false;
      state.suppressPreview = shouldSuppressPreview;
      state.temporarilyCollapsed = false;
      if (!nextValue) {
        state.suppressPreview = false;
      }
      if (persist !== false) {
        persistDismissed(state.dismissed);
      }
      render();
    }

    function openPreview(force) {
      if (!state.dismissed || !state.shouldShow || !isHoverLauncherMode()) return;
      if (state.suppressPreview && !force) return;
      state.previewOpen = true;
      render();
    }

    function closePreview() {
      if (!state.dismissed || !state.previewOpen || !isHoverLauncherMode()) return;
      state.previewOpen = false;
      render();
    }

    const updateBottomOffset = () => {
      const bannerVisible =
        cookieBanner &&
        window.getComputedStyle(cookieBanner).display !== 'none' &&
        cookieBanner.getBoundingClientRect().height > 0;
      const extraBottom = bannerVisible ? cookieBanner.getBoundingClientRect().height + 12 : 16;
      shell.style.bottom = `calc(${extraBottom}px + var(--safe-area-bottom))`;
    };

    const updateVisibility = () => {
      const heroRect = hero.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const passedHero = heroRect.bottom < window.innerHeight * 0.45;
      const footerOverlap = footerRect.top < window.innerHeight - 120;

      state.shouldShow = passedHero && !footerOverlap;
      shell.classList.toggle('is-hidden-by-footer', footerOverlap);
      if (!state.shouldShow) {
        state.previewOpen = false;
        state.temporarilyCollapsed = false;
      }
      updateBottomOffset();
      render();
    };

    closeButton.addEventListener('click', (event) => {
      setDismissed(true, true, { suppressPreview: true });
      if (!isHoverLauncherMode() || event.detail === 0) {
        launcher.focus({ preventScroll: true });
      }
    });

    launcher.addEventListener('click', () => {
      if (isHoverLauncherMode()) {
        openPreview();
        return;
      }
      state.temporarilyCollapsed = false;
      setDismissed(false, true);
    });

    launcher.addEventListener('mouseenter', openPreview);
    launcher.addEventListener('focus', () => {
      if (!state.suppressPreview) {
        openPreview(true);
      }
    });

    const collapseIfLeavingShell = (event) => {
      if (!shell.contains(event.relatedTarget)) {
        closePreview();
      }
    };

    launcher.addEventListener('mouseleave', collapseIfLeavingShell);
    sticky.addEventListener('mouseleave', collapseIfLeavingShell);
    launcher.addEventListener('mouseleave', () => {
      if (state.suppressPreview) {
        state.suppressPreview = false;
      }
    });
    shell.addEventListener('focusout', (event) => {
      if (!shell.contains(event.relatedTarget)) {
        state.suppressPreview = false;
        closePreview();
      }
    });

    sticky.addEventListener('mouseenter', openPreview);

    const api = {
      collapseTemporarilyForAnchorNavigation() {
        if (!state.shouldShow || isHoverLauncherMode()) return 0;
        state.previewOpen = false;
        state.temporarilyCollapsed = true;
        if (temporaryCollapseTimeoutId) {
          window.clearTimeout(temporaryCollapseTimeoutId);
        }
        temporaryCollapseTimeoutId = window.setTimeout(() => {
          state.temporarilyCollapsed = false;
          render();
        }, 1800);
        render();
        return launcher.getBoundingClientRect().height || 0;
      },
      isVisible() {
        return state.shouldShow;
      },
      isDismissed() {
        return state.dismissed;
      },
    };

    window.Silverstone.stickyCta = api;

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
  }

  window.Silverstone.initStickyCta = initStickyCta;
})();


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
    // Blog (Signal Red)
    red: {
      line: [1.0, 0.18, 0.24, 1.0],
      bg1: [0.15, 0.0, 0.03, 1.0],
      bg2: [0.34, 0.04, 0.08, 1.0]
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
    const hero =
      canvas.closest('.hero.title-band') ||
      document.querySelector('.hero.title-band');

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
    let resizeObserver = null;
    let intersectionObserver = null;
    let isInView = true;

    function resizeCanvas() {
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
    if (typeof ResizeObserver === 'function' && hero) {
      resizeObserver = new ResizeObserver(() => resizeCanvas());
      resizeObserver.observe(hero);
    }
    if (typeof IntersectionObserver === 'function' && hero) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const nextVisible = !!entries[0] && entries[0].isIntersecting;
          if (isInView === nextVisible) return;
          isInView = nextVisible;
          if (isInView && !animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
          if (!isInView && animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        },
        { threshold: 0.15 },
      );
      intersectionObserver.observe(hero);
    }
    resizeCanvas();

    let startTime = Date.now();
    let animationFrameId = null;

    function render() {
      if (!isInView) {
        animationFrameId = null;
        return;
      }
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
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
        intersectionObserver = null;
      }
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

  const lightboxImageCache = new Map();
  let lightboxRequestId = 0;
  const ASSET_PATH = '/assets/images/socialmedia/';
  const LIGHTBOX_MOBILE_QUERY = '(max-width: 768px)';
  const MARQUEE_ROOT_MARGIN = '1200px 0px';
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

  let singleInitialized = false;
  let doubleInitialized = false;

  function initSingleMarquee() {
    if (singleInitialized) return;
    if (document.body.classList.contains('page-services')) return;

    cleanupLegacyMarquees();

    const footer = document.querySelector('footer.site-footer');
    observeWhenNearViewport(footer, () => {
      if (singleInitialized || !footer || !footer.parentNode) return;
      singleInitialized = true;
      ensureLightbox();

      const marquee = buildSingleRow();
      footer.parentNode.insertBefore(marquee, footer);
    });
  }

  function initDoubleMarquee() {
    if (!document.body.classList.contains('page-services')) return;
    if (doubleInitialized) return;

    cleanupLegacyMarquees();

    const slot = document.getElementById('innovation-marquee-slot');
    const galleryGrid = document.getElementById('neural-grid');
    if (!slot && !galleryGrid) return;

    const target = galleryGrid || slot;

    observeWhenNearViewport(target, () => {
      if (doubleInitialized) return;
      doubleInitialized = true;
      ensureLightbox();

      const container = buildDoubleDeck();
      const currentSlot = document.getElementById('innovation-marquee-slot');
      const currentGrid = document.getElementById('neural-grid');

      if (currentSlot) {
        currentSlot.replaceWith(container);
      } else if (currentGrid && currentGrid.parentNode) {
        currentGrid.insertAdjacentElement('afterend', container);
      }

      alignInnovationAnchor();
    });
  }

  function cleanupLegacyMarquees() {
    document.querySelectorAll('.premium-marquee-container, .logo-slider, .single-marquee, .double-marquee').forEach((el) => el.remove());
  }

  function observeWhenNearViewport(target, callback) {
    if (!target) return;

    if (!('IntersectionObserver' in window)) {
      callback();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        callback();
      },
      {
        rootMargin: MARQUEE_ROOT_MARGIN,
      },
    );

    observer.observe(target);
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
      img.loading = 'lazy';
      img.decoding = 'async';

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

  function preloadLightboxImage(src) {
    if (!src) return Promise.resolve('');

    const cached = lightboxImageCache.get(src);
    if (cached) return cached;

    const preloadPromise = new Promise((resolve, reject) => {
      const preload = new Image();
      preload.decoding = 'async';
      preload.onload = () => resolve(src);
      preload.onerror = reject;
      preload.src = src;
    }).catch(() => {
      lightboxImageCache.delete(src);
      return '';
    });

    lightboxImageCache.set(src, preloadPromise);
    return preloadPromise;
  }

  function setLightboxImage(img, src) {
    if (!img || !src) return;

    const currentAttr = img.getAttribute('src');
    if (currentAttr === src || img.currentSrc === src) return;
    img.src = src;
  }

  function resolveLightboxPreviewSrc(trigger) {
    if (!trigger) return '';

    const img = trigger.querySelector('img');
    return img ? img.currentSrc || img.src : '';
  }

  function openLightbox(trigger) {
    const lightbox = document.getElementById('premium-lightbox');
    const img = document.getElementById('lightbox-img');
    const targetSrc = resolveLightboxSrc(trigger);
    const previewSrc = resolveLightboxPreviewSrc(trigger) || targetSrc;
    if (!lightbox || !img || !previewSrc) return;

    const requestId = String(++lightboxRequestId);
    lightbox.dataset.requestId = requestId;
    setLightboxImage(img, previewSrc);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (!targetSrc || targetSrc === previewSrc) return;

    preloadLightboxImage(targetSrc).then((loadedSrc) => {
      if (!loadedSrc) return;
      if (!lightbox.classList.contains('active')) return;
      if (lightbox.dataset.requestId !== requestId) return;
      setLightboxImage(img, loadedSrc);
    });
  }

  function closeLightbox() {
    const lightbox = document.getElementById('premium-lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    lightbox.dataset.requestId = '';
    document.body.style.overflow = '';
    var img = document.getElementById('lightbox-img');
    if (img) img.removeAttribute('src');
  }

  function resolveLightboxSrc(trigger) {
    if (!trigger) return '';

    const mobileSrc = trigger.dataset.lightboxMobileSrc;
    const desktopSrc = trigger.dataset.lightboxSrc;
    const isMobile = !!window.matchMedia && window.matchMedia(LIGHTBOX_MOBILE_QUERY).matches;

    if (isMobile && mobileSrc) return mobileSrc;
    if (desktopSrc) return desktopSrc;

    const img = trigger.querySelector('img');
    return img ? img.currentSrc || img.src : '';
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

      const warmLightbox = () => {
        const targetSrc = resolveLightboxSrc(trigger);
        const previewSrc = resolveLightboxPreviewSrc(trigger);
        if (!targetSrc || targetSrc === previewSrc) return;
        preloadLightboxImage(targetSrc);
      };

      trigger.addEventListener('pointerenter', warmLightbox, { passive: true });
      trigger.addEventListener('touchstart', warmLightbox, { passive: true });
      trigger.addEventListener('focus', warmLightbox);

      trigger.addEventListener('click', () => {
        openLightbox(trigger);
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
 * PREMIUM GALLERY LIGHTBOX BINDER
 *
 * The services gallery markup is rendered directly in HTML so the browser can
 * discover and schedule the images during initial parse. This script only
 * wires up lightbox behavior for those static tiles.
 */

(function () {
  'use strict';

  const lightboxImageCache = new Map();
  let lightboxRequestId = 0;

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

  function preloadLightboxImage(src) {
    if (!src) return Promise.resolve('');

    const cached = lightboxImageCache.get(src);
    if (cached) return cached;

    const preloadPromise = new Promise((resolve, reject) => {
      const preload = new Image();
      preload.decoding = 'async';
      preload.onload = () => resolve(src);
      preload.onerror = reject;
      preload.src = src;
    }).catch(() => {
      lightboxImageCache.delete(src);
      return '';
    });

    lightboxImageCache.set(src, preloadPromise);
    return preloadPromise;
  }

  function setLightboxImage(img, src) {
    if (!img || !src) return;

    const currentAttr = img.getAttribute('src');
    if (currentAttr === src || img.currentSrc === src) return;
    img.src = src;
  }

  function resolveLightboxPreviewSrc(trigger) {
    if (!trigger) return '';

    const img = trigger.querySelector('img');
    return img ? img.currentSrc || img.src : '';
  }

  function openLightbox(trigger) {
    const lightbox = document.getElementById('premium-lightbox');
    const img = document.getElementById('lightbox-img');
    const targetSrc = resolveLightboxSrc(trigger);
    const previewSrc = resolveLightboxPreviewSrc(trigger) || targetSrc;
    if (!lightbox || !img || !previewSrc) return;

    const requestId = String(++lightboxRequestId);
    lightbox.dataset.requestId = requestId;
    setLightboxImage(img, previewSrc);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (!targetSrc || targetSrc === previewSrc) return;

    preloadLightboxImage(targetSrc).then((loadedSrc) => {
      if (!loadedSrc) return;
      if (!lightbox.classList.contains('active')) return;
      if (lightbox.dataset.requestId !== requestId) return;
      setLightboxImage(img, loadedSrc);
    });
  }

  function closeLightbox() {
    const lightbox = document.getElementById('premium-lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    lightbox.dataset.requestId = '';
    document.body.style.overflow = '';
    var img = document.getElementById('lightbox-img');
    if (img) img.removeAttribute('src');
  }

  function resolveLightboxSrc(trigger) {
    if (!trigger) return '';

    const explicitSrc = trigger.dataset.lightboxSrc;
    if (explicitSrc) return explicitSrc;

    const img = trigger.querySelector('img');
    return img ? img.currentSrc || img.src : '';
  }

  function bindGalleryTiles() {
    const triggers = document.querySelectorAll('.js-gallery-lightbox');
    if (!triggers.length) return;

    ensureLightbox();

    triggers.forEach((trigger) => {
      if (trigger.dataset.ssLightboxBound === '1') return;
      trigger.dataset.ssLightboxBound = '1';

      const warmLightbox = () => {
        const targetSrc = resolveLightboxSrc(trigger);
        const previewSrc = resolveLightboxPreviewSrc(trigger);
        if (!targetSrc || targetSrc === previewSrc) return;
        preloadLightboxImage(targetSrc);
      };

      trigger.addEventListener('pointerenter', warmLightbox, { passive: true });
      trigger.addEventListener('touchstart', warmLightbox, { passive: true });
      trigger.addEventListener('focus', warmLightbox);

      trigger.addEventListener('click', () => {
        openLightbox(trigger);
      });

      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openLightbox(trigger);
      });
    });
  }

  function initPremiumGallery() {
    bindGalleryTiles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPremiumGallery);
  } else {
    initPremiumGallery();
  }
})();


(function () {
  'use strict';

  const CATEGORY_ORDER = [
    'general',
    'estate-agents',
    'hospitality',
    'salons',
    'trades',
    'ecommerce',
    'physios',
    'dentists',
    'gyms',
    'fitness-coaches',
  ];

  const CATEGORY_LABELS = {
    all: 'All',
    general: 'General',
    'estate-agents': 'Estate Agents',
    hospitality: 'Hospitality',
    salons: 'Salons & Barbers',
    trades: 'Trades & Field Services',
    ecommerce: 'eCommerce Brands',
    physios: 'Physios & Chiropractors',
    dentists: 'Dentists',
    gyms: 'Gyms & Fitness Studios',
    'fitness-coaches': 'Fitness Coaches',
  };

  const BLOG_TAXONOMY = {
    '/blog/ai-appointment-reminders-uk-2026': 'general',
    '/blog/ai-automation-failures-uk-smes-2026': 'general',
    '/blog/ai-automation-uk-gdpr-2026-sme-guide': 'general',
    '/blog/ai-booking-automation-uk-hospitality-2026': 'hospitality',
    '/blog/ai-document-automation-uk-smes-2026': 'general',
    '/blog/ai-etas-smart-scheduling-uk-trades-2026': 'trades',
    '/blog/ai-lead-capture-trades-uk-2026': 'trades',
    '/blog/ai-lead-capture-uk-trades-2026': 'trades',
    '/blog/ai-lead-qualification-estate-agents-2026': 'estate-agents',
    '/blog/ai-no-show-reduction-uk-salons-barbers': 'salons',
    '/blog/ai-receptionist-small-business-2026': 'general',
    '/blog/ai-receptionist-uk-costs-roi-2026': 'general',
    '/blog/ai-voice-agents-uk-smes-2026': 'general',
    '/blog/ai-website-tools-uk-small-businesses-2026': 'general',
    '/blog/dental-recall-automation-uk-2026': 'dentists',
    '/blog/dm-to-client-automation-uk-fitness-coaches-2026': 'fitness-coaches',
    '/blog/gym-booking-automation-uk-gyms-studios-2026': 'gyms',
    '/blog/ai-automations-physio-chiro-clinics-uk': 'physios',
    '/blog/estate-agent-viewing-confirmations-uk': 'estate-agents',
    '/blog/dental-intake-e-consent-automation-uk': 'dentists',
    '/blog/ai-missed-call-recovery-dentists-uk': 'dentists',
    '/blog/ai-returns-triage-ecommerce-uk': 'ecommerce',
    '/blog/ai-lead-scoring-fitness-coaches-uk': 'fitness-coaches',
    '/blog/ai-win-back-journeys-gyms-uk': 'gyms',
    '/blog/ai-guest-concierge-hotels-bbs-uk': 'hospitality',
    '/blog/clinic-rebooking-physio-chiro-uk': 'physios',
    '/blog/ai-rebooking-journeys-salons-uk': 'salons',
    '/blog/ai-call-answering-trades-uk': 'trades',
    '/blog/post-purchase-automation-uk-ecommerce-repeat-customers': 'ecommerce',
    '/blog/quote-chase-automation-uk-trades-accepted-jobs-2026': 'trades',
    '/blog/quote-follow-up-automation-uk-trades-2026': 'trades',
  };

  function normalizePathname(pathname) {
    if (!pathname) return '/';
    return pathname.replace(/\.html$/, '');
  }

  function normalizeBlogPath(href) {
    if (!href) return '';
    try {
      const url = new window.URL(href, window.location.origin);
      return normalizePathname(url.pathname);
    } catch (error) {
      return '';
    }
  }

  function getCategoryForHref(href) {
    return BLOG_TAXONOMY[normalizeBlogPath(href)] || 'general';
  }

  function getCategoryLabel(category) {
    return CATEGORY_LABELS[category] || CATEGORY_LABELS.general;
  }

  function createFilterShell(options) {
    const shell = document.createElement('div');
    shell.className = options.shellClassName || 'taxonomy-filter-shell';

    const filter = document.createElement('div');
    filter.className = 'taxonomy-filter';

    const header = document.createElement('div');
    header.className = 'taxonomy-filter__header';

    const label = document.createElement('span');
    label.className = 'taxonomy-filter__label';
    label.textContent = options.label;

    const status = document.createElement('span');
    status.className = 'taxonomy-filter__status';
    status.setAttribute('aria-live', 'polite');

    header.append(label, status);

    const chips = document.createElement('div');
    chips.className = 'taxonomy-filter__chips';

    filter.append(header, chips);
    shell.append(filter);

    return { shell, status, chips };
  }

  function createChip(category, onSelect) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'taxonomy-filter__chip';
    button.dataset.taxonomyChip = category;
    button.textContent = getCategoryLabel(category);
    button.addEventListener('click', () => onSelect(category));
    return button;
  }

  function updateChipState(chips, activeCategory) {
    chips.forEach((chip) => {
      const isActive = chip.dataset.taxonomyChip === activeCategory;
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function setupServicesGuideFilters() {
    const section = document.querySelector('#service-supporting-guides');
    const list = section && section.querySelector('.services-resource-list--blogs');
    if (!list) return;

    const allItems = Array.from(list.querySelectorAll('li'));
    const guideItems = allItems.filter((item) => !item.classList.contains('services-resource-item--view-all'));
    const viewAllItem = list.querySelector('.services-resource-item--view-all');
    const desktopQuery = window.matchMedia('(min-width: 769px)');

    guideItems.forEach((item) => {
      const link = item.querySelector('a');
      item.dataset.taxonomyCategory = getCategoryForHref(link && link.getAttribute('href'));
    });

    const { shell, status, chips } = createFilterShell({
      label: 'Guide categories',
      shellClassName: 'taxonomy-filter-shell taxonomy-filter-shell--services',
    });

    const chipElements = CATEGORY_ORDER.map((category) => createChip(category, applyCategory));
    chipElements.forEach((chip) => chips.appendChild(chip));
    list.parentNode.insertBefore(shell, list);

    function applyCategory(category) {
      if (!desktopQuery.matches) {
        shell.hidden = true;
        guideItems.forEach((item) => {
          item.hidden = false;
        });
        if (viewAllItem) {
          viewAllItem.hidden = false;
        }
        return;
      }

      shell.hidden = false;
      let visibleCount = 0;
      guideItems.forEach((item) => {
        const shouldShow = item.dataset.taxonomyCategory === category;
        item.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });
      if (viewAllItem) {
        viewAllItem.hidden = false;
      }
      status.textContent = `Showing ${visibleCount} ${getCategoryLabel(category)} guides`;
      updateChipState(chipElements, category);
    }

    const syncForViewport = () => applyCategory('general');
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', syncForViewport);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(syncForViewport);
    }
    applyCategory('general');
  }

  function setupBlogIndexFilters() {
    const body = document.body;
    if (!body || !body.classList.contains('page-blog') || body.classList.contains('page-blog-article')) {
      return;
    }

    const grid = document.querySelector('.blog-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.blog-card'));
    if (!cards.length) return;

    cards.forEach((card) => {
      const link = card.querySelector('.blog-card__title a, .blog-card__media');
      card.dataset.taxonomyCategory = getCategoryForHref(link && link.getAttribute('href'));
    });

    const { shell, status, chips } = createFilterShell({
      label: 'Filter guides',
      shellClassName: 'neon-card taxonomy-filter-shell taxonomy-filter-shell--blog',
    });

    const chipElements = ['all'].concat(CATEGORY_ORDER).map((category) => createChip(category, applyCategory));
    chipElements.forEach((chip) => chips.appendChild(chip));
    grid.parentNode.insertBefore(shell, grid);

    function applyCategory(category) {
      let visibleCount = 0;
      cards.forEach((card) => {
        const shouldShow = category === 'all' || card.dataset.taxonomyCategory === category;
        card.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });
      status.textContent =
        category === 'all'
          ? `Showing all ${visibleCount} guides`
          : `Showing ${visibleCount} ${getCategoryLabel(category)} guides`;
      updateChipState(chipElements, category);
    }

    applyCategory('all');
  }

  function init() {
    setupServicesGuideFilters();
    setupBlogIndexFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
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
    if (api.initPricingDeeplinks) api.initPricingDeeplinks();
    if (api.initStickyCta) api.initStickyCta();
    if (api.initParallax) api.initParallax();
  });
})();
