/*
  Simplified cinematic parallax for Silverstone

  This version replaces the original complex scroll‑triggered effect with a
  streamlined implementation that focuses on a handful of GPU‑accelerated
  properties.  It preserves the premium, cinematic feel by gently scaling
  and darkening the hero section while sliding the next section into view.
  Heavy filter animations, multiple simultaneous transforms and elaborate
  overlay elements have been removed to ensure a buttery‑smooth experience
  across devices.  Header hide/show behaviour, fade‑in animations and
  mobile navigation toggling remain intact.

  Key changes:
  – Use a simple requestAnimationFrame loop to update hero scale, overlay
    opacity and next‑section translation/opacity based on scroll position.
  – Limit animated properties to transform and opacity for optimal GPU
    acceleration.  Filters and rotations are no longer applied during
    scroll, eliminating render‑blocking effects.
  – Eliminate the dynamically injected cinematic overlay and its
    associated pseudo‑elements.  The hero’s ::after pseudo‑element still
    provides a subtle darkening overlay controlled via the CSS variable
    `--overlay‑opacity`.
  – Remove auto‑scrolling and velocity‑based guard logic.  The effect now
    responds naturally to user input without locking scroll.

  The result is a vibrant, engaging transition between the hero and the
  first content section while keeping the site responsive and smooth.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Respect the user's reduced‑motion preference.  If the user prefers
  // reduced motion, or if the browser is Safari (which has known issues
  // with complex scroll animations), treat the page as mobile and disable
  // the parallax effect.
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Determine current path for page‑specific tweaks (e.g. contact page)
  const pathname = window.location.pathname;

  // Inject the custom CSS file if it hasn't been loaded.  Prefix with
  // "./" so that relative paths resolve correctly regardless of the
  // current page location.
  if (!document.querySelector('link[href*="assets/css/custom.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './assets/css/custom.css';
    document.head.appendChild(link);
  }
  // Inject the mobile fixes stylesheet after custom.css so its rules
  // override earlier declarations on small screens.
  if (!document.querySelector('link[href*="assets/css/mobile-fixes.css"]')) {
    const fixesLink = document.createElement('link');
    fixesLink.rel = 'stylesheet';
    fixesLink.href = './assets/css/mobile-fixes.css';
    document.head.appendChild(fixesLink);
  }

  // Detect Safari to disable the parallax.  Safari continues to exhibit
  // scroll lock issues even with simplified animations.
  const ua = navigator.userAgent || '';
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android/i.test(ua);
  const disableParallax = isSafari || prefersReducedMotion;
  const isMobile = window.innerWidth <= 900 || disableParallax;

  const hero = document.querySelector('.hero');
  // Find the first <section> after the hero.  Skip over any
  // non‑section elements.
  let nextSection = null;
  if (hero) {
    let node = hero.nextElementSibling;
    while (node) {
      if (node.tagName && node.tagName.toLowerCase() === 'section') {
        nextSection = node;
        break;
      }
      node = node.nextElementSibling;
    }
  }
  const header = document.querySelector('header');
  const hasHeroStructure = Boolean(hero && nextSection && header);

  if (hasHeroStructure) {
    // On contact and privacy pages the first service row should fill the
    // viewport regardless of parallax state.
    if (pathname.includes('contact') || pathname.includes('privacy')) {
      const setPageSectionHeight = () => {
        nextSection.style.minHeight = `${window.innerHeight}px`;
      };
      setPageSectionHeight();
      window.addEventListener('resize', setPageSectionHeight);
    }

    if (!isMobile) {
      // Flags and state for the scroll‑triggered transition
      let transitionInProgress = false;
      let lastDirection = null;

      // Prepare the next section so it starts hidden and lower on the page.
      nextSection.classList.add('cinematic-section');
      nextSection.style.opacity = '0';
      nextSection.style.transform = 'translateY(120px)';
      nextSection.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';

      // Cache the hero height and clamp helper to avoid expensive DOM
      // reads and guard values within [0,1].
      let heroHeight = hero.offsetHeight || 1;
      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      // Update the parallax effect based on scroll position.  This function
      // runs continuously while the user scrolls through the hero.  When
      // the scroll‑triggered auto transition fires, this function will be
      // bypassed in favour of an internal animation.
      function updateParallax() {
        if (transitionInProgress) return;
        const progress = clamp(window.pageYOffset / heroHeight, 0, 1);
        // Scale the hero up to 10% larger as the user scrolls through it.
        const heroScale = 1 + progress * 0.1;
        hero.style.transform = `scale(${heroScale.toFixed(3)})`;
        // Darken the hero by adjusting the overlay opacity.  0.5
        // multiplier yields a maximum of 0.5 (50% darkening) at full
        // progress.
        hero.style.setProperty('--overlay-opacity', (progress * 0.5).toFixed(3));
        // Slide and fade the next section upward while fading it in.
        const translateY = (1 - progress) * 120;
        nextSection.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        nextSection.style.opacity = progress.toFixed(3);
      }

      // Initialise the effect immediately.
      updateParallax();

      // Use a flag to prevent unnecessary requestAnimationFrame calls.
      let ticking = false;
      window.addEventListener(
        'scroll',
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              updateParallax();
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
      window.addEventListener('resize', () => {
        heroHeight = hero.offsetHeight || 1;
        updateParallax();
      });

      // --- Scroll‑triggered cinematic transition setup ---
      // Create an overlay element for the premium glow effect.  It uses
      // only opacity transitions and a radial gradient background to
      // minimise rendering cost.
      const overlay = document.createElement('div');
      overlay.className = 'scroll-overlay';
      document.body.appendChild(overlay);

      // Create a sentinel element at the bottom of the hero to detect
      // when the user reaches the hero boundary.  This element is
      // absolutely positioned and occupies 1px of height.
      const sentinel = document.createElement('div');
      sentinel.style.position = 'absolute';
      sentinel.style.left = '0';
      sentinel.style.right = '0';
      sentinel.style.bottom = '0';
      sentinel.style.height = '1px';
      hero.appendChild(sentinel);

      // Flag variables declared above; do not redeclare here

      // Easing function for smoother progress (ease out cubic)
      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function runAutoTransition(direction) {
        if (transitionInProgress) return;
        transitionInProgress = true;
        lastDirection = direction;
        // Capture current scroll position and progress
        const startY = window.pageYOffset;
        const startProgress = clamp(startY / heroHeight, 0, 1);
        const duration = 900; // ms
        const startTime = performance.now();
        // Lock scrolling during the animation
        const previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        // Activate overlay
        overlay.classList.add('active');
        function animate() {
          const now = performance.now();
          const t = (now - startTime) / duration;
          if (t < 1) {
            const eased = easeOutCubic(t);
            // Interpolate progress towards 1 (fully transitioned)
            const progress = startProgress + (1 - startProgress) * eased;
            // Apply hero scale and darken overlay
            const heroScale = 1 + progress * 0.1;
            hero.style.transform = `scale(${heroScale.toFixed(3)})`;
            hero.style.setProperty('--overlay-opacity', (progress * 0.5).toFixed(3));
            // Move and fade in next section
            const translateY = (1 - progress) * 120;
            nextSection.style.transform = `translateY(${translateY.toFixed(1)}px)`;
            nextSection.style.opacity = progress.toFixed(3);
            requestAnimationFrame(animate);
          } else {
            // Final state: hero fully scaled, next section in place
            hero.style.transform = 'scale(1.1)';
            hero.style.setProperty('--overlay-opacity', '0.5');
            nextSection.style.transform = 'translateY(0px)';
            nextSection.style.opacity = '1';
            // Fade out overlay
            overlay.classList.remove('active');
            // Restore scrolling
            document.documentElement.style.overflow = previousOverflow;
            transitionInProgress = false;
          }
        }
        requestAnimationFrame(animate);
      }

      // Observe the sentinel to trigger the auto transition when leaving
      // the hero.  Use scroll direction to prevent accidental triggers
      // when scrolling upwards back into the hero.
      let lastScrollPos = window.pageYOffset;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const currentY = window.pageYOffset;
            const direction = currentY > lastScrollPos ? 'down' : 'up';
            lastScrollPos = currentY;
            // When sentinel is no longer visible and scrolling down,
            // trigger the transition.  When sentinel becomes visible
            // again while scrolling up, trigger in reverse (same effect).
            if (!entry.isIntersecting && direction === 'down') {
              runAutoTransition('down');
            } else if (entry.isIntersecting && direction === 'up' && currentY < heroHeight) {
              runAutoTransition('up');
            }
          });
        },
        { threshold: 0 }
      );
      observer.observe(sentinel);
    }

    // Hide the header when scrolling down and show it when scrolling up.
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
      const currentY = window.pageYOffset;
      if (currentY > lastScrollY && currentY > header.offsetHeight) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScrollY = currentY;
    });
    // Reveal the header when hovering near the top of the viewport after
    // scrolling past the hero.
    document.addEventListener('mousemove', (e) => {
      if (isMobile) return;
      const hoverY = e.clientY;
      const headerHeight = header.offsetHeight;
      const scrolledPastHero = window.pageYOffset >= nextSection.offsetTop;
      if (scrolledPastHero && hoverY <= headerHeight) {
        header.classList.remove('header-hidden');
      } else {
        if (scrolledPastHero) {
          header.classList.add('header-hidden');
        }
      }
    });
  }

  // Fade‑in animations for elements with the .animate class using
  // IntersectionObserver.  On mobile (or when parallax is disabled) all
  // elements are shown immediately.
  const animatedEls = document.querySelectorAll('.animate');
  if (animatedEls.length > 0) {
    if (isMobile) {
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
        { threshold: 0.15 }
      );
      animatedEls.forEach((el) => obs.observe(el));
    }
  }
  // Immediately show cards in the gallery grid to avoid delayed fade‑in.
  document.querySelectorAll('.gallery-grid .neon-card').forEach((el) => {
    el.classList.add('visible');
  });

  // Mobile navigation toggle: show/hide the nav menu on small screens.
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  if (navToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
    };
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
    window.addEventListener(
      'scroll',
      () => {
        if (navMenu.classList.contains('open')) {
          closeMenu();
        }
      },
      { passive: true }
    );
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }
});