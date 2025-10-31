/*
      Silverstone site JavaScript (premium cinematic parallax)

      This version provides a refined cinematic parallax experience with
      slower, smoother transitions optimized for performance and premium
      feel. The hero section scales and darkens as the user begins to
      scroll, and the subsequent section fades and slides into view. An
      easing auto-scroll transitions the viewport over 2.8 seconds with
      subtle visual effects. The header hides when scrolling down and
      reappears when scrolling up. Mobile navigation toggling and fade-in
      animations for elements marked with `.animate` are also included.

      The script dynamically injects `assets/css/custom.css` if it is not
      already present. Performance optimizations include reduced layer
      count and elimination of dynamic particle generation for better
      rendering efficiency.
    */

document.addEventListener('DOMContentLoaded', () => {
  // Respect reduced‑motion settings. Rather than exiting the script
  // entirely, treat the page like a mobile layout so core interactions
  // (navigation toggles, cookie banner, etc.) continue to work while the
  // cinematic parallax behaviour remains disabled.
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Determine the current pathname.  We no longer skip parallax on
  // privacy policy pages so that the hero and second section animate
  // consistently across the site.
  const pathname = window.location.pathname;

  // Inject custom.css if it hasn't been loaded yet.  This keeps HTML
  // files clean and allows CSS overrides to apply universally.  After
  // injecting custom.css we also load mobile-fixes.css to override any
  // rules that conflict on small screens.  Both stylesheets are only
  // added once per page.
  if (!document.querySelector('link[href*="assets/css/custom.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Use a relative path anchored at the current location to ensure the file
    // resolves correctly regardless of which page is open (e.g. about.html, services.html).
    // Prefixing with "./" makes the path relative to the site root when pages live at the root.
    link.href = './assets/css/custom.css';
    document.head.appendChild(link);
  }
  // Always append the mobile fixes stylesheet after custom.css so its
  // rules override earlier declarations.  Only inject if not already
  // present to avoid duplicate links.
  if (!document.querySelector('link[href*="assets/css/mobile-fixes.css"]')) {
    const fixesLink = document.createElement('link');
    fixesLink.rel = 'stylesheet';
    // Use a relative path anchored at the current location to ensure the file
    // resolves correctly on all pages.  Prefixing with "./" avoids resolving
    // inside nested directories (if any) and consistently points to the root assets folder.
    fixesLink.href = './assets/css/mobile-fixes.css';
    document.head.appendChild(fixesLink);
  }

  // Determine if the current viewport is considered "mobile".
  // On small screens we disable the cinematic parallax behaviour entirely
  // and allow the page to scroll normally.  The threshold of 900px aligns
  // with the breakpoints used in the CSS.
  //
  // Safari continues to exhibit scroll lock issues after the parallax
  // animation, even in the latest releases.  To preserve a smooth
  // experience we disable the cinematic parallax entirely for all
  // Safari versions.  This effectively treats Safari like a mobile
  // device: normal scrolling is used and no automatic transitions are
  // triggered.  For other browsers the parallax remains enabled unless
  // the viewport width is below the mobile threshold (900px).
  const ua = navigator.userAgent || '';
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android/i.test(ua);
  const disableParallax = isSafari || prefersReducedMotion;
  const isMobile = window.innerWidth <= 900 || disableParallax;

  const hero = document.querySelector('.hero');
  // Find the first <section> after the hero.  Some pages insert
  // <style> tags or other elements between sections, so skip over
  // anything that isn’t a section.
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
    const body = document.body;

    // On the contact or privacy pages ensure the first service row fills the viewport.
    // This applies regardless of the parallax state.
    if (pathname.includes('contact') || pathname.includes('privacy')) {
      const setPageSectionHeight = () => {
        nextSection.style.minHeight = `${window.innerHeight}px`;
      };
      setPageSectionHeight();
      window.addEventListener('resize', setPageSectionHeight);
    }

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    if (!isMobile) {
      nextSection.classList.add('cinematic-section');
      nextSection.style.opacity = '0';
      nextSection.style.transform = 'translate3d(0, 140px, 0)';
      nextSection.style.setProperty('--section-glow', '0');
    } else {
      nextSection.classList.remove('cinematic-section');
      nextSection.style.opacity = '';
      nextSection.style.transform = '';
      nextSection.style.removeProperty('--section-glow');
    }

    document.querySelectorAll('.cinematic-transition').forEach((el) => el.remove());

    let parallaxRaf = null;
    let lastFrame = performance.now();
    let heroHeight = hero.offsetHeight || 1;
    let targetProgress = clamp(window.pageYOffset / heroHeight, 0, 1);
    let renderedProgress = targetProgress;

    const ensureOverlay = () => {
      let overlayEl = document.querySelector('.cinematic-overlay');
      if (overlayEl) return overlayEl;
      overlayEl = document.createElement('div');
      overlayEl.className = 'cinematic-overlay';
      body.appendChild(overlayEl);
      return overlayEl;
    };

    const overlay = !isMobile ? ensureOverlay() : null;

    const renderParallax = (progress) => {
      if (isMobile) return;
      const eased = 1 - Math.pow(1 - progress, 1.2);
      const accent = Math.pow(progress, 0.85);

      const heroScale = 1 + eased * 0.26;
      const heroLift = eased * -18;
      const heroDepth = eased * -120;
      const heroTiltX = eased * -3.2;
      const heroTiltY = Math.sin(accent * Math.PI * 0.5) * 1.8;

      const brightness = Math.max(0.25, 1 - accent * 0.65);
      const saturate = 1 + accent * 0.4;
      const contrast = 1 + accent * 0.2;
      const overlayBoost = 0.16 + accent * 0.48;

      hero.style.transform = `perspective(2200px) translate3d(0, ${heroLift.toFixed(1)}px, ${heroDepth.toFixed(1)}px) scale(${heroScale.toFixed(3)}) rotateX(${heroTiltX.toFixed(2)}deg) rotateY(${heroTiltY.toFixed(2)}deg)`;
      hero.style.filter = `brightness(${brightness.toFixed(3)}) saturate(${saturate.toFixed(3)}) contrast(${contrast.toFixed(3)})`;
      hero.style.setProperty('--overlay-opacity', overlayBoost.toFixed(3));

      if (overlay) {
        overlay.style.setProperty('--overlay-progress', accent.toFixed(3));
      }

      const sectionTranslate = 140 - eased * 190;
      const sectionScale = 0.94 + accent * 0.1;
      const sectionRotateX = (1 - eased) * 4 - 2;
      const sectionDepth = (1 - eased) * 90;

      nextSection.style.transform = `translate3d(0, ${sectionTranslate.toFixed(1)}px, ${sectionDepth.toFixed(1)}px) scale(${sectionScale.toFixed(3)}) rotateX(${sectionRotateX.toFixed(2)}deg)`;
      nextSection.style.opacity = Math.min(1, eased * 1.25).toFixed(3);
      nextSection.style.setProperty('--section-glow', (accent * 0.85).toFixed(3));
    };

    const step = (timestamp) => {
      const delta = Math.min((timestamp - lastFrame) / 1000, 0.12);
      lastFrame = timestamp;
      const smoothing = 1 - Math.pow(1 - 0.22, delta * 60);
      renderedProgress += (targetProgress - renderedProgress) * smoothing;
      if (Math.abs(targetProgress - renderedProgress) < 0.001) {
        renderedProgress = targetProgress;
      }
      renderParallax(renderedProgress);
      if (Math.abs(targetProgress - renderedProgress) > 0.0005) {
        parallaxRaf = requestAnimationFrame(step);
      } else {
        parallaxRaf = null;
      }
    };

    const requestUpdate = () => {
      if (isMobile) return;
      targetProgress = clamp(window.pageYOffset / heroHeight, 0, 1);
      if (parallaxRaf === null) {
        lastFrame = performance.now();
        parallaxRaf = requestAnimationFrame(step);
      }
    };

    const recalcHeight = () => {
      heroHeight = hero.offsetHeight || 1;
      if (!isMobile) {
        requestUpdate();
      }
    };

    if (!isMobile) {
      renderParallax(renderedProgress);
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', recalcHeight);

      if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(recalcHeight);
        observer.observe(hero);
      }
    }

    /**
     * Hide the header when scrolling down and show it when scrolling up.
     * Adds the `.header-hidden` class defined in styles.css to translate
     * the header off‑screen.  This behaviour only applies after the
     * header has been scrolled past its own height.
     */
    let lastScrollY = window.pageYOffset;
    window.addEventListener('scroll', () => {
      const currentY = window.pageYOffset;
      if (currentY > lastScrollY && currentY > header.offsetHeight) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScrollY = currentY;
    });

    /**
     * Show the header when the user hovers near the top of the viewport
     * after scrolling past the hero section.  When the mouse enters
     * the top area (within the header’s height) and the page is
     * scrolled beyond the first section, remove the `header-hidden`
     * class to reveal the navigation bar.  When the mouse leaves
     * this area, reapply `header-hidden` so the header hides again
     * until the user scrolls up.  This allows users to access the
     * menu while reading lower sections of the page without changing
     * the underlying scroll behaviour.
     */
    document.addEventListener('mousemove', (e) => {
      if (isMobile) return;
      const hoverY = e.clientY;
      const headerHeight = header.offsetHeight;
      const scrolledPastHero = window.pageYOffset >= nextSection.offsetTop;
      if (scrolledPastHero && hoverY <= headerHeight) {
        header.classList.remove('header-hidden');
      } else if (scrolledPastHero) {
        header.classList.add('header-hidden');
      }
    });
  }
  // Fade‑in animations for elements with the .animate class.  Use an
  // IntersectionObserver to add the .visible class when elements
  // approach the viewport.
  const animatedEls = document.querySelectorAll('.animate');
  if (animatedEls.length > 0) {
    if (isMobile) {
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