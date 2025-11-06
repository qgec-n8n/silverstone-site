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
  const mobileViewportForAnimations = window.matchMedia('(max-width: 768px)').matches;
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
      <div class="indicator-icon" aria-hidden="true"></div>
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
  const isMobileViewport = () => window.matchMedia('(max-width: 768px)').matches;

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
    if (header) header.classList.add('header-hidden');
    headerIndicator.classList.add('active');
  }
  function scheduleHeaderAutoHide(delay = 2000) {
    clearTimeout(headerAutoHideTimeoutId);
    headerAutoHideTimeoutId = window.setTimeout(() => {
      // Do not hide while the menu is open
      if (navMenu && navMenu.classList.contains('open')) return;
      hideHeader();
    }, delay);
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

  // Allow tapping or clicking the indicator bar to toggle the menu.
  headerIndicator.addEventListener('click', (event) => {
    event.stopPropagation();
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
    clearTimeout(headerAutoHideTimeoutId);
    hideHeader();
  }, { passive: true });

  // Schedule the header to hide after a short delay on page load.  On
  // desktop we also hide after the same delay to replicate DC’s
  // behaviour.  Users can reveal it again by hovering.
  scheduleHeaderAutoHide();

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
    #header-indicator .indicator-icon {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      border: 2px solid rgba(0, 174, 239, 0.6);
      display: grid;
      place-items: center;
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 0 0 1px rgba(12, 16, 29, 0.06);
      background: rgba(0, 174, 239, 0.12);
    }
    #header-indicator .indicator-icon::after {
      content: '';
      width: 0.45rem;
      height: 0.45rem;
      border-bottom: 2px solid rgba(0, 174, 239, 0.8);
      border-right: 2px solid rgba(0, 174, 239, 0.8);
      transform: rotate(45deg);
      animation: indicator-pulse 1.6s ease-in-out infinite;
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
    #header-indicator:hover .indicator-icon {
      border-color: rgba(157, 78, 221, 0.65);
      background: rgba(157, 78, 221, 0.15);
    }
    #header-indicator:hover .indicator-icon::after {
      border-color: rgba(157, 78, 221, 0.8);
    }
    #header-indicator:hover .indicator-copy span::after {
      color: rgba(157, 78, 221, 0.75);
    }
    @keyframes indicator-pulse {
      0%,
      100% {
        transform: rotate(45deg) translateY(0);
      }
      50% {
        transform: rotate(45deg) translateY(-2px);
      }
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
        /* Dark, glassy backdrop with saturation boost for a high‑tech feel */
        background: rgba(11, 12, 16, 0.94);
        backdrop-filter: blur(16px) saturate(180%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: calc(env(safe-area-inset-top, 0) + 1rem) 1.5rem calc(env(safe-area-inset-bottom) + 2.5rem);
        gap: 1.75rem;
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
        background: linear-gradient(180deg, rgba(0, 174, 239, 0.65), rgba(157, 78, 221, 0.45));
        border-radius: 999px;
      }
      nav ul::-webkit-scrollbar-track {
        background: transparent;
      }
      nav ul > li {
        width: 100%;
        display: flex;
        justify-content: center;
      }
      nav ul > li > * {
        width: min(100%, 420px);
      }
      nav ul li a {
        display: block;
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--color-green);
        text-align: center;
        letter-spacing: 0.08em;
        padding: 0.8rem 1.5rem;
        border-radius: 999px;
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      nav ul li a:hover,
      nav ul li a:focus {
        background: rgba(0, 174, 239, 0.15);
        color: var(--color-blue);
      }
      /* Hamburger icon styling and transformation */
      .nav-toggle {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        z-index: 2500;
      }
      .nav-toggle span {
        width: 100%;
        height: 2px;
        background-color: var(--color-green);
        margin-bottom: 4px;
        transition: transform 0.4s ease, opacity 0.4s ease;
      }
      .nav-toggle span:last-child {
        margin-bottom: 0;
      }
      .nav-toggle.active span:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
      }
      .nav-toggle.active span:nth-child(2) {
        opacity: 0;
      }
      .nav-toggle.active span:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
      }
      /* Mobile header indicator overrides */
      #header-indicator {
        /* On mobile the indicator should span the full width of the viewport.
           Reset left and width to fill the screen and adjust the transform so
           it slides vertically rather than diagonally.  Height remains reduced
           to maintain a compact feel.  Use the same vibrant gradient and
           glowing effects as the desktop banner for visual consistency. */
        width: 100%;
        left: 0;
        height: 40px;
        background: linear-gradient(
          90deg,
          var(--color-blue),
          var(--color-purple),
          var(--color-green)
        );
        backdrop-filter: blur(8px) saturate(160%);
        border-radius: 0 0 8px 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow:
          0 4px 12px rgba(0, 174, 239, 0.35),
          0 6px 20px rgba(157, 78, 221, 0.30);
        transform: translateY(-100%);
      }
      #header-indicator.active {
        transform: translateY(0);
      }
      #header-indicator:hover {
        /* Disable expansion on hover for mobile; height remains constant. */
        height: 40px;
      }
    }
  `;
  const styleElem = document.createElement('style');
  styleElem.appendChild(document.createTextNode(mobileNavStyles));
  document.head.appendChild(styleElem);
});