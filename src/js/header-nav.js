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

    const mobileNav = buildMobileNav();
    const mobileNavTrack = mobileNav.querySelector('.mobile-nav-track');
    const mobileRootList = mobileNav.querySelector('.mobile-nav-list--root');
    const mobileServicesList = mobileNav.querySelector(
      '.mobile-nav-list--services',
    );
    const mobileBackdrop = mobileNav.querySelector('.mobile-nav-backdrop');
    const mobileRootBack = mobileNav.querySelector('.mobile-nav-back--root');
    const mobileServicesBack = mobileNav.querySelector(
      '.mobile-nav-back--services',
    );
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
          btn.textContent = 'Services';
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
      mobileNav.classList.add('is-open');
      mobileNav.classList.remove('show-services');
      isMobileNavOpen = true;
      if (navToggle) navToggle.classList.add('active');
      showHeader();
    }

    function closeMobileNav() {
      if (!isMobileNavOpen) return;
      mobileNav.classList.remove('is-open', 'show-services');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('mobile-nav-open');
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, previousScrollY);
      isMobileNavOpen = false;
      if (navToggle) navToggle.classList.remove('active');
      scheduleHeaderAutoHide();
    }

    function openServicesPanel() {
      if (!mobileNavTrack) return;
      mobileNav.classList.add('show-services');
      mobileNavTrack.scrollTop = 0;
    }

    function closeServicesPanel() {
      mobileNav.classList.remove('show-services');
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

    if (navToggle) {
      navToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        if (isMobileViewport()) {
          if (isMobileNavOpen) {
            closeMobileNav();
          } else {
            openMobileNav();
          }
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

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', closeMobileNav);
    }
    if (mobileRootBack) {
      mobileRootBack.addEventListener('click', (event) => {
        event.preventDefault();
        closeMobileNav();
        scheduleHeaderAutoHide(1800);
      });
    }
    if (mobileServicesBack) {
      mobileServicesBack.addEventListener('click', (event) => {
        event.preventDefault();
        closeServicesPanel();
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
      if (isMobileViewport()) {
        if (isMobileNavOpen) {
          closeMobileNav();
        } else {
          showHeader();
          clearTimeout(headerAutoHideTimeoutId);
          scheduleHeaderAutoHide();
        }
        return;
      }
      showHeader();
      clearTimeout(headerAutoHideTimeoutId);
      scheduleHeaderAutoHide();
    });

    headerIndicator.addEventListener('mouseenter', showHeader);
    if (header) {
      header.addEventListener('mouseenter', showHeader);
      header.addEventListener('mouseleave', hideHeader);
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
          </div>
          <div class="mobile-nav-track">
            <div class="mobile-nav-view mobile-nav-view--root" aria-label="Main navigation">
              <div class="mobile-nav-subhead mobile-nav-subhead--root">
                <button class="mobile-nav-back mobile-nav-back--root" type="button" aria-label="Back to page">
                  <span class="mobile-back-icon" aria-hidden="true"></span>
                  <span class="mobile-back-label">Back</span>
                </button>
                <p class="mobile-nav-kicker">Menu</p>
              </div>
              <ul class="mobile-nav-list mobile-nav-list--root"></ul>
            </div>
            <div class="mobile-nav-view mobile-nav-view--services" aria-label="Services navigation">
              <div class="mobile-nav-subhead">
                <button class="mobile-nav-back mobile-nav-back--services" type="button" aria-label="Back to main menu">
                  <span class="mobile-back-icon" aria-hidden="true"></span>
                  <span class="mobile-back-label">Back</span>
                </button>
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
