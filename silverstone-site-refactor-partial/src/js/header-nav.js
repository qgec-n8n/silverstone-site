/*
 * header-nav.js
 *
 * Handles the site header, mobile navigation, services dropdown, services
 * overlay, and header indicator. Contains helper functions for opening
 * and closing each part and a single exported init function.
 */

/*
 * initHeaderNav
 *
 * This function sets up the navigation, services dropdown/overlay and
 * header indicator for the Silverstone site.  It mirrors the behaviour
 * implemented in the original `assets/js/script.js` file by wiring up
 * event listeners for the hamburger button, services toggle and
 * overlay/back buttons.  It also manages showing and hiding the
 * header based on scroll and interaction state.  The mobile
 * breakpoint is defined in one place so it can be updated easily.
 */
export function initHeaderNav() {
  // Only execute after the DOM is ready.  The caller (app.js) should
  // invoke this after the DOMContentLoaded event, but we defensively
  // check here in case it is called earlier.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderNav);
    return;
  }

  const MOBILE_BREAKPOINT = 768;
  const body = document.body;
  const header = document.querySelector('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');

  // Services dropdown (desktop)
  const servicesDropdown = document.querySelector('.nav-dropdown');
  const servicesToggle = document.querySelector('.services-toggle');
  const servicesMenu = document.querySelector('.services-menu');
  // Services overlay (mobile)
  const servicesOverlay = document.querySelector('.services-overlay');
  const servicesOverlayBack = servicesOverlay
    ? servicesOverlay.querySelector('.services-overlay__back')
    : null;
  const serviceLinks = document.querySelectorAll('.service-link');

  // Track whether the services dropdown is open
  let servicesDropdownOpen = false;
  // Remember scroll position when opening mobile nav
  let previousScrollY = 0;
  // Timeout ID for scheduled header auto‑hide
  let headerAutoHideTimeoutId;

  // Helper: determine if viewport is mobile width
  const isMobileViewport = () =>
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

  // Create a header indicator that appears when the header is hidden
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

  // Functions to show/hide the header.  These toggle classes used by
  // the CSS to translate the header off screen and bring the indicator
  // into view.
  function showHeader() {
    if (header) header.classList.remove('header-hidden');
    headerIndicator.classList.remove('active');
  }
  function hideHeader() {
    // Do not hide while the services menu or overlay is active
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
      // Do not hide while the nav or services menus are open
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

  // Services dropdown (desktop) handlers
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

  // Services overlay (mobile) handlers
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

  // Mobile navigation helpers
  function openNavMenu() {
    if (!navMenu || !navToggle) return;
    closeServicesDropdown();
    clearTimeout(headerAutoHideTimeoutId);
    previousScrollY =
      window.pageYOffset || document.documentElement.scrollTop || 0;
    navMenu.classList.add('open');
    navMenu.scrollTop = 0;
    navToggle.classList.add('active');
    // Freeze background scroll
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

  // Insert a back button into the mobile nav if it does not exist yet
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

  // Attach event listeners
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
    // Close nav when clicking links inside it on mobile
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
      if (navToggle) navToggle.focus();
    });
  }
  if (servicesToggle) {
    servicesToggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (isMobileViewport()) {
        // On mobile, open nav menu first then toggle overlay
        if (!navMenu || !navMenu.classList.contains('open')) {
          openNavMenu();
        }
        if (isServicesOverlayActive()) {
          closeServicesOverlay();
        } else {
          openServicesOverlay();
        }
      } else {
        // Desktop: toggle dropdown
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
        if (isMobileViewport() && navMenu && navMenu.classList.contains('open')) {
          closeNavMenu();
        }
      });
    });
  }
  // Close dropdown if clicking outside of it
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
  // Use the header indicator as a minimal tab for toggling menu
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
    // Desktop: toggle nav overlay
    if (navMenu.classList.contains('open')) {
      closeNavMenu();
    } else {
      openNavMenu();
      clearTimeout(headerAutoHideTimeoutId);
    }
  });
  // Hover interactions for desktop
  headerIndicator.addEventListener('mouseenter', showHeader);
  if (header) {
    header.addEventListener('mouseenter', showHeader);
    header.addEventListener('mouseleave', hideHeader);
    // On mobile, tapping header schedules auto‑hide again
    header.addEventListener('click', () => {
      if (!isMobileViewport()) return;
      if (navMenu && navMenu.classList.contains('open')) return;
      scheduleHeaderAutoHide();
    });
  }
  // Hide header immediately on mobile scroll
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
  // Hide header on page load after a short delay
  scheduleHeaderAutoHide();
}