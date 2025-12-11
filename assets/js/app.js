(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;

  function initHeaderNav() {
    if (initialized) return;
    initialized = true;

    const MOBILE_BREAKPOINT = 768;
    const body = document.body;

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

    let previousScrollY = 0;
    let headerAutoHideTimeoutId;

    const isMobileViewport = () =>
      window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

    function showHeader() {
      if (header) header.classList.remove('header-hidden');
      headerIndicator.classList.remove('active');
    }
    function hideHeader() {
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
      headerAutoHideTimeoutId = window.setTimeout(() => {
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

    function closeServicesDropdown() {
      if (!servicesDropdown || !servicesMenu) return;
      servicesDropdown.classList.remove('open');
      servicesMenu.setAttribute('aria-hidden', 'true');
      if (servicesToggle) servicesToggle.setAttribute('aria-expanded', 'false');
      servicesDropdownOpen = false;
      body.classList.remove('services-dropdown-open');
      if (
        !isServicesOverlayActive() &&
        !(navMenu && navMenu.classList.contains('open'))
      ) {
        scheduleHeaderAutoHide();
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

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        closeServicesDropdown();
        closeServicesOverlay();
        if (navMenu.classList.contains('open')) {
          closeNavMenu();
        } else {
          openNavMenu();
        }
      });
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
          if (!navMenu || !navMenu.classList.contains('open')) {
            openNavMenu();
          }
          if (isServicesOverlayActive()) {
            closeServicesOverlay();
          } else {
            openServicesOverlay();
          }
        } else {
          if (servicesDropdownOpen) {
            closeServicesDropdown();
          } else {
            openServicesDropdown();
          }
        }
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

    headerIndicator.addEventListener('click', (event) => {
      event.stopPropagation();
      closeServicesDropdown();
      closeServicesOverlay();
      if (!navToggle || !navMenu) {
        scheduleHeaderAutoHide();
        return;
      }
      if (isMobileViewport()) {
        if (navMenu.classList.contains('open')) {
          closeNavMenu();
        } else {
          showHeader();
          clearTimeout(headerAutoHideTimeoutId);
          scheduleHeaderAutoHide();
        }
        return;
      }
      if (navMenu.classList.contains('open')) {
        closeNavMenu();
      } else {
        openNavMenu();
        clearTimeout(headerAutoHideTimeoutId);
      }
    });

    headerIndicator.addEventListener('mouseenter', showHeader);
    if (header) {
      header.addEventListener('mouseenter', showHeader);
      header.addEventListener('mouseleave', hideHeader);
      header.addEventListener('click', () => {
        if (!isMobileViewport()) return;
        if (navMenu && navMenu.classList.contains('open')) return;
        scheduleHeaderAutoHide();
      });
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!isMobileViewport()) return;
        if (navMenu && navMenu.classList.contains('open')) return;
        if (servicesDropdownOpen || isServicesOverlayActive()) return;
        clearTimeout(headerAutoHideTimeoutId);
        hideHeader();
      },
      { passive: true },
    );

    scheduleHeaderAutoHide();

    const mobileNavStyles = `
    /*
       Override the default header height variable to make the maximized menu
       banner slightly taller.  The clamp ensures the header scales
       smoothly between a minimum and maximum size across breakpoints.
    */
    :root {
      /* Make the maximized header slightly smaller while maintaining responsive scaling. */
      --headerH: clamp(66px, 8vh, 88px);
    }

    /* Base styling for the header indicator on larger screens.  A
       white glassmorphism panel appears across the top when the
       header is hidden.  On hover the bar expands to the full header
       height.  Colour variables from styles.css are used to blend
       seamlessly with the brand palette. */
    #header-indicator {
      position: fixed;
      top: 0;
      /* The minimized banner spans the full width of the viewport on desktop. */
      left: 0;
      width: 100%;
      /* Increase the default height to present a more substantial banner.
         Rounded bottom corners and a subtle border give it a polished edge.
         A luminous gradient combined with a soft blur conveys a premium,
         high‑tech feel. */
      /* Set the minimized banner height to half of the maximized header height for
         a clear proportional relationship.  Uses the CSS variable so it scales
         consistently across breakpoints. */
      height: calc(var(--headerH) * 0.335);
      background: #ffffff;
      backdrop-filter: blur(6px) saturate(130%);
      border-radius: 0 0 12px 12px;
      border: 1px solid rgba(12, 16, 29, 0.1);
      border-top: none;
      box-shadow:
        0 10px 28px rgba(12, 16, 29, 0.12),
        0 4px 12px rgba(0, 0, 0, 0.08);
      font-family: var(--font-heading);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--color-blue);
      letter-spacing: 0.1em;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 1500;
      opacity: 0;
      /* Translate vertically only so the indicator slides off screen when hidden. */
      transform: translateY(-100%);
      transition: height 0.3s ease, opacity 0.3s ease, transform 0.3s ease,
        box-shadow 0.3s ease, color 0.3s ease, background-color 0.3s ease;
    }
    #header-indicator.active {
      opacity: 1;
      /* The banner simply slides down into view on desktop. */
      transform: translateY(0);
    }
    #header-indicator::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      background: linear-gradient(120deg, rgba(0, 174, 239, 0.18), rgba(157, 78, 221, 0.12));
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    #header-indicator .indicator-copy {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      position: relative;
      z-index: 1;
    }
    #header-indicator .indicator-copy span {
      font-size: 0.85rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: inherit;
      display: inline-flex;
      align-items: center;
    }
    #header-indicator .indicator-copy span::after {
      display: inline-block;
      margin-left: 0.75rem;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      font-weight: 500;
      color: rgba(12, 16, 29, 0.55);
      text-transform: uppercase;
    }
    #header-indicator:hover {
      height: var(--headerH);
      background: #f7f9fc;
      color: var(--color-purple);
      box-shadow:
        0 16px 34px rgba(12, 16, 29, 0.16),
        0 8px 18px rgba(0, 174, 239, 0.18);
    }
    #header-indicator:hover::after {
      opacity: 1;
    }
    #header-indicator:hover .indicator-copy span::after {
      color: rgba(157, 78, 221, 0.75);
    }
    @media (hover: none) {
      #header-indicator .indicator-copy span::after {
        content: '• Tap to expand';
      }
    }
    @media (hover: hover) {
      #header-indicator .indicator-copy span::after {
        content: '• Hover to expand';
      }
    }
    /* Mobile overrides: replace the gradient with a blurred dark bar,
       disable expansion on hover and adjust the height. */
    @media (max-width: 768px) {
      nav ul {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(18px) saturate(180%);
        border: 1px solid rgba(12, 16, 29, 0.05);
        box-shadow: 0 18px 46px rgba(15, 23, 42, 0.18);
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-evenly;
        gap: clamp(3rem, 10vh, 6rem);
        padding: calc(env(safe-area-inset-top, 0) + 1.5rem) 1.75rem calc(env(safe-area-inset-bottom) + 2.75rem);
        opacity: 0;
        transform: translateY(-100%);
        pointer-events: none;
        transition: opacity 0.4s ease, transform 0.4s ease;
        z-index: 2000;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }
      nav ul.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      nav ul::-webkit-scrollbar {
        width: 0.5rem;
      }
      nav ul::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(0, 174, 239, 0.45), rgba(157, 78, 221, 0.35));
        border-radius: 999px;
      }
      nav ul::-webkit-scrollbar-track {
        background: transparent;
      }
      nav ul > li {
        width: 100%;
        display: flex;
      }
      nav ul > li:not(.nav-back-item) {
        flex-grow: 1;
        justify-content: center;
        align-items: center;
      }
      nav ul > li.nav-back-item {
        width: auto;
        flex: 0 0 auto;
        align-self: flex-start;
        justify-content: flex-start;
        margin-bottom: 0.25rem;
      }
      nav ul > li > * {
        width: 100%;
      }
      nav ul li a {
        display: block;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-blue);
        text-align: center;
        letter-spacing: 0.08em;
        padding: 0.85rem 1.65rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
        border: 1px solid rgba(0, 174, 239, 0.18);
        transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
      }
      nav ul li a:hover,
      nav ul li a:focus {
        background: rgba(0, 174, 239, 0.12);
        color: var(--color-purple);
        box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
      }
      .nav-back-item {
        display: flex;
      }
      .nav-back-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.4rem 0.85rem 0.4rem 0.45rem;
        background: rgba(0, 174, 239, 0.06);
        border: 1px solid rgba(0, 174, 239, 0.18);
        border-radius: 999px;
        color: var(--color-blue);
        font-family: var(--font-heading);
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        cursor: pointer;
        width: auto;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.1);
        transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease,
          box-shadow 0.3s ease;
      }
      .nav-back-btn:focus-visible {
        outline: 2px solid rgba(0, 174, 239, 0.65);
        outline-offset: 4px;
      }
      .nav-back-btn:hover,
      .nav-back-btn:focus-visible {
        color: var(--color-purple);
        background: rgba(0, 174, 239, 0.12);
        border-color: rgba(0, 174, 239, 0.24);
        box-shadow: 0 14px 32px rgba(15, 23, 42, 0.16);
      }
      .nav-back-btn:hover .nav-back-icon,
      .nav-back-btn:focus-visible .nav-back-icon {
        box-shadow: 0 18px 36px rgba(15, 23, 42, 0.16);
        transform: translateX(-2px);
      }
      .nav-back-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.4rem;
        height: 2.4rem;
        border-radius: 999px;
        border: 1px solid rgba(0, 174, 239, 0.35);
        background: linear-gradient(135deg, rgba(0, 174, 239, 0.18), rgba(255, 255, 255, 0.92));
        color: var(--color-blue);
        font-size: 1.1rem;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
        transition: box-shadow 0.3s ease, transform 0.3s ease;
        transform: translateX(0);
      }
      .nav-back-icon::before {
        content: '\\2190';
        transform: translateX(-1px);
      }
      .nav-back-label {
        font-size: 0.78rem;
        letter-spacing: 0.2em;
      }
      .nav-toggle {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        z-index: 2500;
        transition: opacity 0.3s ease;
      }
      .nav-toggle span {
        width: 100%;
        height: 2px;
        background-color: var(--color-blue);
        margin-bottom: 4px;
        transition: opacity 0.4s ease;
      }
      .nav-toggle span:last-child {
        margin-bottom: 0;
      }
      .nav-toggle.active {
        opacity: 0;
        pointer-events: none;
      }
      .nav-toggle.active span {
        opacity: 0;
      }
      #header-indicator {
        width: 100%;
        left: 0;
        height: 42px;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(12px) saturate(170%);
        border-radius: 0 0 12px 12px;
        border-top: none;
        border: 1px solid rgba(12, 16, 29, 0.06);
        box-shadow:
          0 10px 28px rgba(15, 23, 42, 0.16),
          0 6px 20px rgba(0, 174, 239, 0.10);
        color: var(--color-blue);
        transform: translateY(-100%);
      }
      #header-indicator.active {
        transform: translateY(0);
      }
      #header-indicator:hover {
        height: 42px;
        background: rgba(255, 255, 255, 0.98);
      }
    }
  `;
    const styleElem = document.createElement('style');
    styleElem.appendChild(document.createTextNode(mobileNavStyles));
    document.head.appendChild(styleElem);
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

    const MOBILE_BREAKPOINT = 768;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const animatedEls = document.querySelectorAll('.animate');
    const mobileViewportForAnimations = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT}px)`,
    ).matches;

    if (animatedEls.length) {
      if (prefersReducedMotion || mobileViewportForAnimations) {
        animatedEls.forEach((el) => el.classList.add('visible'));
      } else {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              }
            });
          },
          { threshold: 0.15 },
        );
        animatedEls.forEach((el) => obs.observe(el));
      }
    }

    // Always reveal neon cards in the gallery grid on page load.
    document.querySelectorAll('.gallery-grid .neon-card').forEach((el) => {
      el.classList.add('visible');
    });
  }

  window.Silverstone.initScrollReveal = initScrollReveal;
})();


(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

  let initialized = false;

  function initStats() {
    if (initialized) return;
    initialized = true;

    const statsSections = Array.from(document.querySelectorAll('.stats')).filter(
      (section) => section.dataset.counter !== 'off',
    );
    if (!statsSections.length) return;

    const prefersReducedMotionCount = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const animateSection = (section) => {
      const numbers = section.querySelectorAll('.number');
      numbers.forEach((number) => {
        const target = parseInt(number.dataset.target, 10) || 0;
        const plus = number.getAttribute('data-plus') || '';
        if (prefersReducedMotionCount) {
          number.textContent = target.toLocaleString() + plus;
          return;
        }
        const duration = 1500;
        const startTime = performance.now();
        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(progress * target);
          number.textContent =
            current.toLocaleString() + (progress === 1 ? plus : '');
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    };

    statsSections.forEach((section) => {
      let hasAnimated = false;
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              hasAnimated = true;
              animateSection(section);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 },
      );
      observer.observe(section);
    });
  }

  window.Silverstone.initStats = initStats;
})();


(function () {
  'use strict';

  window.Silverstone = window.Silverstone || {};

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

    const PARALLAX_MAP = {
      lines: {
        backgroundColor: '#050B18',
        mobileImages: {
          fallback:
            "url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp')",
          standard:
            "image-set(url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp') 1x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@2x.webp') 2x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@3x.webp') 3x)",
          webkit:
            "-webkit-image-set(url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp') 1x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@2x.webp') 2x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@3x.webp') 3x)",
        },
      },
      circuit: {
        backgroundColor: '#050B18',
        mobileImages: {
          fallback: "url('assets/images/internet/mobile/section-waves@1x.webp')",
          standard:
            "image-set(url('assets/images/internet/mobile/section-waves@1x.webp') 1x, url('assets/images/internet/mobile/section-waves@2x.webp') 2x, url('assets/images/internet/mobile/section-waves@3x.webp') 3x)",
          webkit:
            "-webkit-image-set(url('assets/images/internet/mobile/section-waves@1x.webp') 1x, url('assets/images/internet/mobile/section-waves@2x.webp') 2x, url('assets/images/internet/mobile/section-waves@3x.webp') 3x)",
        },
      },
      mesh: {
        backgroundColor: '#050B18',
        mobileImages: {
          fallback: "url('assets/images/internet/mobile/section-mesh@1x.webp')",
          standard:
            "image-set(url('assets/images/internet/mobile/section-mesh@1x.webp') 1x, url('assets/images/internet/mobile/section-mesh@2x.webp') 2x, url('assets/images/internet/mobile/section-mesh@3x.webp') 3x)",
          webkit:
            "-webkit-image-set(url('assets/images/internet/mobile/section-mesh@1x.webp') 1x, url('assets/images/internet/mobile/section-mesh@2x.webp') 2x, url('assets/images/internet/mobile/section-mesh@3x.webp') 3x)",
        },
      },
      waves: {
        backgroundColor: '#050B18',
        mobileImages: {
          fallback: "url('assets/images/internet/mobile/section-waves@1x.webp')",
          standard:
            "image-set(url('assets/images/internet/mobile/section-waves@1x.webp') 1x, url('assets/images/internet/mobile/section-waves@2x.webp') 2x, url('assets/images/internet/mobile/section-waves@3x.webp') 3x)",
          webkit:
            "-webkit-image-set(url('assets/images/internet/mobile/section-waves@1x.webp') 1x, url('assets/images/internet/mobile/section-waves@2x.webp') 2x, url('assets/images/internet/mobile/section-waves@3x.webp') 3x)",
        },
      },
      book: {
        backgroundColor: '#050B18',
        mobileImages: {
          fallback:
            "url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp')",
          standard:
            "image-set(url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp') 1x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@2x.webp') 2x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@3x.webp') 3x)",
          webkit:
            "-webkit-image-set(url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp') 1x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@2x.webp') 2x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@3x.webp') 3x)",
        },
      },
    };

    const state = {
      active: false,
      stage: null,
      current: null,
      observer: null,
      layers: [],
    };

    const setActiveLayer = (section) => {
      state.current = section;
      const theme = section.dataset.parallaxTheme;
      const config = PARALLAX_MAP[theme];
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
          const config = PARALLAX_MAP[theme];
          if (!config) return null;
          const layer = document.createElement('div');
          layer.className = 'parallax-mobile-layer';
          layer.dataset.theme = theme;
          layer.setAttribute('aria-hidden', 'true');
          const imageValue = getImageValue(config.mobileImages);
          layer.style.backgroundImage = imageValue || 'none';
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
  const THEMES = {
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
    // Book (Deep Amber/Orange - "Gold")
    // Adjusted to ensure contrast with white text is acceptable
    // Using a dark base with gold highlights
    amber: {
      line: [1.0, 0.65, 0.0, 1.0],
      bg1: [0.15, 0.05, 0.0, 1.0],
      bg2: [0.3, 0.1, 0.0, 1.0]
    },
    // Contact (Silver/Slate) - Matching #C0C0C0
    silver: {
      line: [0.75, 0.75, 0.75, 1.0],
      bg1: [0.1, 0.1, 0.1, 1.0],
      bg2: [0.25, 0.25, 0.25, 1.0]
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

    // gridColor was constant grey in original, keeping it constant
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

  const ASSET_PATH = 'assets/images/socialmedia/';
  const MARQUEE_IMAGES = [
    '1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg',
    '1-1_business_monitor-graphs_10k-lost-overnight.jpg',
    '1-1_ecommerce_laptop-and-customer-hub_dms-calls-whatsapps-answered.jpg',
    '1-1_legal_desk-phone-with-scales_stop-losing-good-cases-to-voicemail.jpg',
    '1-1_marketing_boardroom-messages_your-prospects-can-tell.jpg',
    '1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.jpg',
    '1-1_voiceagents_digital-dashboard_scale-beyond-human-limits.jpg',
    '2-3_accounting_man-with-holographic-call_tax-season-calls-never-missed.jpg',
    '2-3_accounting_office-with-swirling-invoices_tax-season-calls-never-missed.jpg',
    '2-3_ai_phone-processing_connect-automate-grow.jpg',
    '2-3_ai_smartphone-call-completed_automate-what-matters.jpg',
    '2-3_analytics_dashboard_ai-clarity-for-human-performance.jpg',
    '2-3_auto_mechanic-with-phone_while-you-fix-cars.jpg',
    '2-3_automation_charts-scale_scale-your-output-with-ai.jpg',
    '2-3_charity_call-centre-triage_every-caller-feels-heard.jpg',
    '2-3_cleaning_phone-with-booked-job_turn-every-missed-ring.jpg',
    '2-3_cleaning_phone-with-weekly-job_turn-every-missed-ring-into-regular-client.jpg',
    '2-3_dental_black-phone-appointments_never-miss-toothache.jpg',
    '2-3_dental_phone-with-schedule_every-patient-call-answered.jpg',
    '2-3_fitness_phone-with-schedule_ai-powers-your-fitness-journey.jpg',
    '2-3_gym_phone-trial-ring_ai-calls-every-new-lead.jpg',
    '2-3_healthcare_call-queue_end-the-8am-phone-chaos.jpg',
    '2-3_healthcare_dark-call-queue_end-the-8am-phone-chaos.jpg',
    '2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg',
    '2-3_hospitality_holographic-receptionist_your-front-desk-always-open.jpg',
    '2-3_kitchen_modern-kitchen-with-floorplan_capture-every-dream-kitchen-enquiry.jpg',
    '2-3_realestate_phone-map-at-night_never-miss-a-viewing-again.jpg',
    '2-3_realestate_phone-map_never-miss-a-viewing.jpg',
    '2-3_realestate_phone-with-house-icon_focus-on-the-viewing.jpg',
    '2-3_realestate_phone-with-property-card_ai-qualifies-your-property-leads.jpg',
    '2-3_salon_dark-chair-with-calendar_stay-fully-booked-stay-present.jpg',
    '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.jpg',
    '2-3_tradesman_van-at-night_never-miss-an-emergency-job.jpg',
    '2-3_veterinary_vet-with-tablet_never-miss-a-worried-pet-parent.jpg',
    '2-3_voicebot_globe-and-tablet_100k-conversations-zero-burnout.jpg',
    '3-2_business_hand-holding-phone-with-voice-display_ai-that-speaks-your-language.jpg',
    '3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg',
    '3-2_business_laptop-with-chat-bubbles_hours-lost-leads-unqualified.jpg',
    '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep.jpg',
    '3-2_childcare_tablet-in-playroom_let-ai-handle-the-parent-phone-rush.jpg',
    '3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.jpg',
    '3-2_logistics_laptop-with-truck_ai-optimises-logistics-delivery.jpg',
    '3-2_restaurant_phone-and-reservation-list_never-miss-a-booking-again.jpg',
    '3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.jpg',
    '3-2_tutoring_tutor-with-laptop_more-focused-1-1-lessons.jpg'
  ];

  function initSingleMarquee() {
    if (document.body.classList.contains('page-services')) return;

    cleanupLegacyMarquees();
    ensureLightbox();

    const footer = document.querySelector('footer.site-footer');
    if (!footer || !footer.parentNode) return;

    const marquee = buildSingleRow();
    footer.parentNode.insertBefore(marquee, footer);
  }

  function cleanupLegacyMarquees() {
    document.querySelectorAll('.premium-marquee-container, .logo-slider, .single-marquee, .double-marquee').forEach((el) => el.remove());
  }

  function buildSingleRow() {
    const container = document.createElement('div');
    container.className = 'single-marquee';

    const track = document.createElement('div');
    track.className = 'marquee-track';

    const firstPass = createImagesFragment(MARQUEE_IMAGES);
    const secondPass = createImagesFragment(MARQUEE_IMAGES);

    track.appendChild(firstPass);
    track.appendChild(secondPass);

    container.appendChild(track);
    return container;
  }

  function createImagesFragment(images) {
    const fragment = document.createDocumentFragment();

    images.forEach((filename) => {
      const img = document.createElement('img');
      img.src = ASSET_PATH + filename;
      img.className = 'marquee-img';
      img.alt = 'Silverstone Client Success';
      // img.loading = 'lazy'; // Disabled for marquee to ensure immediate width calculation

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSingleMarquee);
  } else {
    initSingleMarquee();
  }
})();
(function () {
  'use strict';

  const ASSET_PATH = 'assets/images/socialmedia/';
  const MARQUEE_IMAGES = [
    '1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg',
    '1-1_business_monitor-graphs_10k-lost-overnight.jpg',
    '1-1_ecommerce_laptop-and-customer-hub_dms-calls-whatsapps-answered.jpg',
    '1-1_legal_desk-phone-with-scales_stop-losing-good-cases-to-voicemail.jpg',
    '1-1_marketing_boardroom-messages_your-prospects-can-tell.jpg',
    '1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.jpg',
    '1-1_voiceagents_digital-dashboard_scale-beyond-human-limits.jpg',
    '2-3_accounting_man-with-holographic-call_tax-season-calls-never-missed.jpg',
    '2-3_accounting_office-with-swirling-invoices_tax-season-calls-never-missed.jpg',
    '2-3_ai_phone-processing_connect-automate-grow.jpg',
    '2-3_ai_smartphone-call-completed_automate-what-matters.jpg',
    '2-3_analytics_dashboard_ai-clarity-for-human-performance.jpg',
    '2-3_auto_mechanic-with-phone_while-you-fix-cars.jpg',
    '2-3_automation_charts-scale_scale-your-output-with-ai.jpg',
    '2-3_charity_call-centre-triage_every-caller-feels-heard.jpg',
    '2-3_cleaning_phone-with-booked-job_turn-every-missed-ring.jpg',
    '2-3_cleaning_phone-with-weekly-job_turn-every-missed-ring-into-regular-client.jpg',
    '2-3_dental_black-phone-appointments_never-miss-toothache.jpg',
    '2-3_dental_phone-with-schedule_every-patient-call-answered.jpg',
    '2-3_fitness_phone-with-schedule_ai-powers-your-fitness-journey.jpg',
    '2-3_gym_phone-trial-ring_ai-calls-every-new-lead.jpg',
    '2-3_healthcare_call-queue_end-the-8am-phone-chaos.jpg',
    '2-3_healthcare_dark-call-queue_end-the-8am-phone-chaos.jpg',
    '2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg',
    '2-3_hospitality_holographic-receptionist_your-front-desk-always-open.jpg',
    '2-3_kitchen_modern-kitchen-with-floorplan_capture-every-dream-kitchen-enquiry.jpg',
    '2-3_realestate_phone-map-at-night_never-miss-a-viewing-again.jpg',
    '2-3_realestate_phone-map_never-miss-a-viewing.jpg',
    '2-3_realestate_phone-with-house-icon_focus-on-the-viewing.jpg',
    '2-3_realestate_phone-with-property-card_ai-qualifies-your-property-leads.jpg',
    '2-3_salon_dark-chair-with-calendar_stay-fully-booked-stay-present.jpg',
    '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.jpg',
    '2-3_tradesman_van-at-night_never-miss-an-emergency-job.jpg',
    '2-3_veterinary_vet-with-tablet_never-miss-a-worried-pet-parent.jpg',
    '2-3_voicebot_globe-and-tablet_100k-conversations-zero-burnout.jpg',
    '3-2_business_hand-holding-phone-with-voice-display_ai-that-speaks-your-language.jpg',
    '3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg',
    '3-2_business_laptop-with-chat-bubbles_hours-lost-leads-unqualified.jpg',
    '3-2_business_laptop-with-sales-dashboard_your-shop-sells-while-you-sleep.jpg',
    '3-2_childcare_tablet-in-playroom_let-ai-handle-the-parent-phone-rush.jpg',
    '3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.jpg',
    '3-2_logistics_laptop-with-truck_ai-optimises-logistics-delivery.jpg',
    '3-2_restaurant_phone-and-reservation-list_never-miss-a-booking-again.jpg',
    '3-2_sales_laptop-and-graphs_thousands-of-calls-barely-any-conversions.jpg',
    '3-2_tutoring_tutor-with-laptop_more-focused-1-1-lessons.jpg'
  ];

  function initDoubleMarquee() {
    // Safety: only run on Services page
    if (!document.body.classList.contains('page-services')) return;

    cleanupLegacyMarquees();
    ensureLightbox();

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
  }

  function cleanupLegacyMarquees() {
    document.querySelectorAll('.premium-marquee-container, .logo-slider, .double-marquee, .single-marquee').forEach((el) => el.remove());
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

    const firstPass = createImagesFragment(images);
    const secondPass = createImagesFragment(images);

    track.appendChild(firstPass);
    track.appendChild(secondPass);

    return track;
  }

  function createImagesFragment(images) {
    const fragment = document.createDocumentFragment();

    images.forEach((filename) => {
      const img = document.createElement('img');
      img.src = ASSET_PATH + filename;
      img.className = 'marquee-img';
      img.alt = 'Silverstone Client Success';
      // img.loading = 'lazy'; // Disabled for marquee to ensure immediate width calculation

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

    // Allow layout to settle before adjusting scroll
    setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
      window.scrollTo({ top, behavior: 'auto' });
    }, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDoubleMarquee);
  } else {
    initDoubleMarquee();
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
        // --- COLUMN 1 (4 Portraits) ---
        { file: '2-3_ai_phone-processing_connect-automate-grow.jpg', type: 'portrait', title: 'Connect & Grow' },
        { file: '2-3_analytics_dashboard_ai-clarity-for-human-performance.jpg', type: 'portrait', title: 'AI Clarity' },
        { file: '2-3_healthcare_phone-with-appointment_ai-takes-care-of-your-patients.jpg', type: 'portrait', title: 'Patient Care' },
        { file: '2-3_realestate_phone-map-at-night_never-miss-a-viewing-again.jpg', type: 'portrait', title: 'Never Miss Viewing' },

        // --- COLUMN 2 (2 Portraits + 3 Squares) ---
        { file: '2-3_realestate_phone-with-property-card_ai-qualifies-your-property-leads.jpg', type: 'portrait', title: 'Qualified Leads' },
        { file: '2-3_salon_spa-room-booking-confirmed_full-treatment-list-zero-interruptions.jpg', type: 'portrait', title: 'Zero Interruptions' },
        { file: '1-1_business_chart-icon-and-flow_scale-beyond-human-limits.jpg', type: 'square', title: 'Scale Limits' },
        { file: '1-1_marketing_boardroom-messages_your-prospects-can-tell.jpg', type: 'square', title: 'Marketing Intel' },
        { file: '1-1_recruitment_desk-with-candidate-ring_handle-the-next-five.jpg', type: 'square', title: 'Recruitment' },

        // --- COLUMN 3 (2 Portraits + 3 Landscapes + 1 Square) ---
        { file: '2-3_voicebot_globe-and-tablet_100k-conversations-zero-burnout.jpg', type: 'portrait', title: 'Zero Burnout' },
        { file: '2-3_tradesman_van-at-night_never-miss-an-emergency-job.jpg', type: 'portrait', title: 'Emergency Job' },
        { file: '3-2_business_laptop-at-sunset-chat-interface_when-you-wait-they-walk.jpg', type: 'landscape', title: 'Instant Response' },
        { file: '3-2_legal_laptop-with-scales_ai-streamlines-legal-workflows.jpg', type: 'landscape', title: 'Legal Workflows' },
        { file: '3-2_logistics_laptop-with-truck_ai-optimises-logistics-delivery.jpg', type: 'landscape', title: 'Logistics' },
        { file: '1-1_legal_desk-phone-with-scales_stop-losing-good-cases-to-voicemail.jpg', type: 'square', title: 'Stop Losing Cases' }
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
        img.loading = 'lazy';

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
        subtitle.textContent = 'View Detail';
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
    link.href = `./${href}`;
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
