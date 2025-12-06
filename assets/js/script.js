/*
 * Enhanced Navigation and Header Control for Silverstone
 *
 * This script replaces the basic mobile navigation found in the original
 * Silverstone site with a more refined experience inspired by the DC
 * Performance Coaching site.  It adds a full‑screen overlay menu on
 * mobile devices, a slim header indicator bar that appears when the
 * header is hidden, and logic to automatically hide and reveal the
 * header based on user interaction.  The visual style of the overlay
 * has been customised to match Silverstone’s futuristic, high‑tech
 * aesthetic using the existing colour variables defined in
 * `assets/css/styles.css` (e.g. --color-green, --color-blue).  The
 * header still hides on scroll and reappears on hover or tap as in
 * the DC site, but all additional features (such as the video unmute
 * button present in DC) have been omitted since they are not used in
 * Silverstone.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Centralised breakpoint definitions.  Adjust MOBILE_BREAKPOINT to change the
  // viewport threshold at which mobile-specific behaviour is triggered.  All
  // matchMedia checks in this script reference this constant, ensuring the
  // breakpoint is defined in one place.  Changing this value will not
  // automatically update CSS breakpoints; run the build script to update CSS.
  const MOBILE_BREAKPOINT = 768;
  const body = document.body;

  /*
   * Helper to ensure a stylesheet is loaded only once.  This function
   * inserts a `<link>` element into the document head if a matching
   * href has not already been added.  It preserves caching behaviour
   * when the page is refreshed and avoids duplicate downloads.
   */
  const ensureStylesheet = (href) => {
    if (document.querySelector(`link[href*="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./${href}`;
    document.head.appendChild(link);
  };
  // Load custom overrides and mobile styles.  The mobile overrides are
  // crucial for consistent sizing and spacing on small screens.  We
  // intentionally reference mobile.css (rather than mobile-fixes.css as
  // used in the template script) because this repository does not
  // include a separate mobile-fixes file.
  ensureStylesheet('assets/css/custom.css');
  ensureStylesheet('assets/css/mobile.css');

  // Intersection observer: reveal elements with the `.animate` class
  // when they enter the viewport.  This replicates the lightweight
  // reveal behaviour from the original script.  Reduced motion
  // preferences are respected.  On mobile viewports we immediately
  // reveal all animated elements so that content remains visible even
  // if the IntersectionObserver has not yet triggered.
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const animatedEls = document.querySelectorAll('.animate');
  // Determine if the viewport qualifies as mobile (<=768px) for immediate reveal
  const mobileViewportForAnimations = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
  if (animatedEls.length > 0) {
    if (prefersReducedMotion || mobileViewportForAnimations) {
      animatedEls.forEach((el) => el.classList.add('visible'));
    } else {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.15 });
      animatedEls.forEach((el) => obs.observe(el));
    }
  }
  // Always reveal neon cards in the gallery grid on page load.  These
  // elements rely on animations in the main CSS and should be visible
  // immediately.
  document.querySelectorAll('.gallery-grid .neon-card').forEach((el) => {
    el.classList.add('visible');
  });

  // Cache references to header, nav toggle and nav menu.  The
  // Silverstone site uses a fixed site header (`header.site-header`), a
  // hamburger button (`.nav-toggle`) and an unordered list within the
  // navigation (`nav ul`).  These elements must exist for the menu
  // overlay to function correctly.
  const header = document.querySelector('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');

  const servicesDropdown = document.querySelector('.nav-dropdown');
  const servicesToggle = document.querySelector('.services-toggle');
  const servicesMenu = document.querySelector('.services-menu');
  const servicesOverlay = document.querySelector('.services-overlay');
  const servicesOverlayBack = servicesOverlay ? servicesOverlay.querySelector('.services-overlay__back') : null;
  const serviceLinks = document.querySelectorAll('.service-link');

  let servicesDropdownOpen = false;

  let navBackButton;
  if (navMenu && !navMenu.querySelector('.nav-back-item')) {
    const navBackItem = document.createElement('li');
    navBackItem.className = 'nav-back-item';

    navBackButton = document.createElement('button');
    navBackButton.type = 'button';
    navBackButton.className = 'nav-back-btn';
    navBackButton.setAttribute('aria-label', 'Close menu and return to the page');
    navBackButton.innerHTML = `
      <span class="nav-back-icon" aria-hidden="true"></span>
      <span class="nav-back-label">Back to page</span>
    `;

    navBackItem.appendChild(navBackButton);
    navMenu.prepend(navBackItem);
  }

  // Create the header indicator bar.  This small bar appears when the
  // header is hidden to signal that users can reveal the menu.  It
  // functions both as a label (“Menu”) and as a tappable target for
  // opening the overlay.  The actual styling for this element is
  // injected below via dynamic CSS.
  const headerIndicator = document.createElement('div');
  headerIndicator.id = 'header-indicator';
  headerIndicator.setAttribute(
    'aria-label',
    'Silverstone navigation menu. Hover or tap to expand.'
  );
  headerIndicator.innerHTML = `
    <div class="indicator-copy">
      <span>Menu</span>
    </div>
  `.trim();
  document.body.appendChild(headerIndicator);

  // Variables for tracking scroll position and pending auto‑hide
  // operations.  When the overlay is opened we record the current
  // scroll position so we can return the user to the same spot when
  // closing.  The timeout ID allows scheduled hides to be cancelled.
  let previousScrollY = 0;
  let headerAutoHideTimeoutId;

  // Determine whether the viewport width qualifies as mobile.  This
  // helper is referenced throughout to reduce the number of
  // matchMedia evaluations.
  const isMobileViewport = () => window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

  /*
   * Helper functions to show and hide the header.  When the header is
   * hidden the `header-hidden` class causes it to translate upward off
   * screen (defined in the site’s styles), and the indicator is set
   * active to slide into view.  When the header is shown the inverse
   * occurs.  These functions also ensure any existing auto‑hide
   * schedules are cleared.
   */
  function showHeader() {
    if (header) header.classList.remove('header-hidden');
    headerIndicator.classList.remove('active');
  }
  function hideHeader() {
    if (servicesDropdownOpen || (servicesOverlay && servicesOverlay.classList.contains('active'))) return;
    if (header) header.classList.add('header-hidden');
    headerIndicator.classList.add('active');
  }
  function scheduleHeaderAutoHide(delay = 1200) {
    clearTimeout(headerAutoHideTimeoutId);
    headerAutoHideTimeoutId = window.setTimeout(() => {
      // Do not hide while the menu is open
      if (navMenu && navMenu.classList.contains('open')) return;
      if (servicesDropdownOpen || (servicesOverlay && servicesOverlay.classList.contains('active'))) return;
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
    if (!isServicesOverlayActive() && !(navMenu && navMenu.classList.contains('open'))) {
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

  /*
   * Mobile navigation helpers.  Opening the menu saves the scroll
   * position, reveals the overlay and freezes body scrolling.  Closing
   * restores the scroll position and schedules the header to hide
   * again.  The `.active` class on the hamburger icon animates the
   * bars into an X shape via the injected CSS.
   */
  function openNavMenu() {
    if (!navMenu || !navToggle) return;
    closeServicesDropdown();
    clearTimeout(headerAutoHideTimeoutId);
    previousScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
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

  // Attach event listeners for the hamburger button.  Clicking the
  // button toggles the overlay.  We stop propagation so clicks do not
  // bubble into the nav links or other elements.
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
    // Close the menu when any link inside it is activated.  On a small
    // viewport the overlay remains open if the user scrolls or resizes,
    // so closing here ensures the menu collapses before navigation.
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
        if (isMobileViewport() && navMenu && navMenu.classList.contains('open')) {
          closeNavMenu();
        }
      });
    });
  }

  document.addEventListener('click', (event) => {
    if (servicesDropdownOpen && servicesDropdown && !servicesDropdown.contains(event.target)) {
      closeServicesDropdown();
    }
    if (isServicesOverlayActive() && servicesOverlay && event.target === servicesOverlay) {
      closeServicesOverlay();
    }
  });

  // Allow tapping or clicking the indicator bar to toggle the menu.
  headerIndicator.addEventListener('click', (event) => {
    event.stopPropagation();
    closeServicesDropdown();
    closeServicesOverlay();
    // If essential elements are missing, simply reschedule the header auto hide
    if (!navToggle || !navMenu) {
      scheduleHeaderAutoHide();
      return;
    }
    // On mobile clicking the indicator should only reveal the header; the
    // hamburger must be used to open the full menu.  If the menu is
    // already open we close it instead.
    if (isMobileViewport()) {
      if (navMenu.classList.contains('open')) {
        closeNavMenu();
      } else {
        // Reveal the header without opening the overlay
        showHeader();
        clearTimeout(headerAutoHideTimeoutId);
        scheduleHeaderAutoHide();
      }
      return;
    }
    // On desktop toggle the menu overlay
    if (navMenu.classList.contains('open')) {
      closeNavMenu();
    } else {
      openNavMenu();
      clearTimeout(headerAutoHideTimeoutId);
    }
  });
  // Show the header when hovering the indicator on desktop.  On
  // touch devices `mouseenter` does not fire so this effectively
  // applies to pointer devices only.
  headerIndicator.addEventListener('mouseenter', showHeader);
  if (header) {
    header.addEventListener('mouseenter', showHeader);
    header.addEventListener('mouseleave', hideHeader);
    // On mobile tapping the header schedules another auto hide if the
    // menu is not open.  This provides a short grace period for users
    // to reopen the overlay after revealing the header.
    header.addEventListener('click', () => {
      if (!isMobileViewport()) return;
      if (navMenu && navMenu.classList.contains('open')) return;
      scheduleHeaderAutoHide();
    });
  }
  // When scrolling on mobile hide the header immediately unless the
  // overlay is open.  This keeps the view clear while navigating.
  window.addEventListener('scroll', () => {
    if (!isMobileViewport()) return;
    if (navMenu && navMenu.classList.contains('open')) return;
    if (servicesDropdownOpen || isServicesOverlayActive()) return;
    clearTimeout(headerAutoHideTimeoutId);
    hideHeader();
  }, { passive: true });

  // Schedule the header to hide after a short delay on page load.  On
  // desktop we also hide after the same delay to replicate DC’s
  // behaviour.  Users can reveal it again by hovering.
  scheduleHeaderAutoHide();

  /*
   * Numbers counter animation for statistics sections.
   *
   * This code locates each `.stats` container on the page and animates
   * the contained `.number` elements from 0 to their respective
   * `data-target` values when the section scrolls into view.  A plus
   * sign can be appended by adding a `data-plus="+"` attribute to
   * the number element.  If the user has enabled reduced motion in
   * their operating system preferences, the numbers will immediately
   * display their target values without animation.
   */
  const statsSections = Array.from(document.querySelectorAll('.stats')).filter(
    (section) => section.dataset.counter !== 'off'
  );
  if (statsSections.length) {
    const prefersReducedMotionCount = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Animate a single stats section
    const animateSection = (section) => {
      const numbers = section.querySelectorAll('.number');
      numbers.forEach((number) => {
        const target = parseInt(number.dataset.target, 10) || 0;
        const plus = number.getAttribute('data-plus') || '';
        // If reduced motion is requested, set the number immediately
        if (prefersReducedMotionCount) {
          number.textContent = target.toLocaleString() + plus;
          return;
        }
        const duration = 1500; // total animation time in milliseconds
        const startTime = performance.now();
        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(progress * target);
          number.textContent = current.toLocaleString() + (progress === 1 ? plus : '');
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    };
    statsSections.forEach((section) => {
      let hasAnimated = false;
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateSection(section);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      observer.observe(section);
    });
  }

  /*
   * Inject dynamic styles to realise the overlay and indicator
   * aesthetics.  We leverage CSS variables defined in the global
   * stylesheet (styles.css) so the colours automatically match the
   * brand palette.  This block applies only to screens up to 768px.
   */
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
        /* Bright, airy overlay for a premium mobile experience */
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(18px) saturate(180%);
        border: 1px solid rgba(12, 16, 29, 0.05);
        box-shadow: 0 18px 46px rgba(15, 23, 42, 0.18);
        display: flex;
        flex-direction: column;
        align-items: stretch;
        /* Distribute menu items evenly across the full height of the viewport.
           Using space-evenly provides equal spacing above, between and below
           the links, creating a spacious, balanced layout that feels premium.
           Previously the menu items were packed at the top; this change
           spreads them vertically to utilise more of the user’s viewport. */
        justify-content: space-evenly;
        /* Increase the gap between nav items slightly for extra breathing room.
           This fallback gap will apply when space-evenly cannot fill the
           available space (e.g. on very small screens). */
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
        /* Allow each nav item to grow equally so that the spacing is truly
           distributed across the viewport.  Combined with justify-content:
           space-evenly on the parent, this ensures each link occupies
           roughly the same vertical space, producing a modern, airy layout. */
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
      /* Mobile header indicator overrides */
      #header-indicator {
        /* On mobile the indicator spans the viewport with a crisp white finish
           to mirror the desktop banner's typography while keeping focus on the
           hamburger control. */
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
        /* Disable expansion on hover for mobile; height remains constant. */
        height: 42px;
        background: rgba(255, 255, 255, 0.98);
      }
    }
  `;
  const styleElem = document.createElement('style');
  styleElem.appendChild(document.createTextNode(mobileNavStyles));
  document.head.appendChild(styleElem);
});
/*
 * Mobile parallax effect for themed sections
 *
 * Desktop browsers rely on CSS background-attachment: fixed for the
 * parallax treatment (see assets/css/parallax-fix.css).  Mobile browsers
 * struggle with fixed attachments, so we create a lightweight background
 * layer that uses CSS position: sticky to remain visually locked to the
 * viewport while keeping the entire background illustration visible within
 * the section.  The CTA banner and footer then slide over this layer,
 * completing the parallax illusion.
 */
(() => {
  const parallaxSections = Array.from(
    document.querySelectorAll('.parallax-section[data-parallax-theme]')
  );
  if (!parallaxSections.length) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const supportsImageSet =
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('background-image', "image-set(url('data:image/gif;base64,R0lGODlhAQABAAAAACw=') 1x)");
  const supportsWebkitImageSet =
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('background-image', "-webkit-image-set(url('data:image/gif;base64,R0lGODlhAQABAAAAACw=') 1x)");

  const PARALLAX_MAP = {
    lines: {
      backgroundColor: '#050B18',
      mobileImages: {
        fallback: "url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp')",
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
        fallback: "url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp')",
        standard:
          "image-set(url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp') 1x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@2x.webp') 2x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@3x.webp') 3x)",
        webkit:
          "-webkit-image-set(url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@1x.webp') 1x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@2x.webp') 2x, url('assets/images/internet/mobile/book-hero-calendly-mobile-2025@3x.webp') 3x)",
      },
    },
  };

  const state = {
    active: false,
    layers: [],
    stage: null,
    observer: null,
    current: null,
  };

  const createStage = () => {
    const stage = document.createElement('div');
    stage.className = 'parallax-mobile-stage';
    stage.setAttribute('aria-hidden', 'true');
    return stage;
  };

  const setActiveLayer = (section) => {
    if (!state.active) return;
    const entry = state.layers.find((item) => item.section === section);
    if (!entry || state.current === entry) return;
    if (state.current) {
      state.current.layer.classList.remove('is-active');
    }
    entry.layer.classList.add('is-active');
    if (state.stage) {
      const color = entry.config && entry.config.backgroundColor;
      state.stage.style.backgroundColor = color || '';
    }
    state.current = entry;
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
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
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
      .sort((a, b) => a.section.getBoundingClientRect().top - b.section.getBoundingClientRect().top)
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
      entry.section.classList.remove('parallax-ready', 'parallax-mobile-active');
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
})();
