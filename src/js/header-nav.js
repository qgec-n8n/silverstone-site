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
