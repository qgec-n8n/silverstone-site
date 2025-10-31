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
    let heroHeight = hero.offsetHeight || 1;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    let requestTick = null;

    // On the contact or privacy pages ensure the first service row fills the viewport.
    // This applies regardless of the parallax state.
    if (pathname.includes('contact') || pathname.includes('privacy')) {
      const setPageSectionHeight = () => {
        nextSection.style.minHeight = `${window.innerHeight}px`;
      };
      setPageSectionHeight();
      window.addEventListener('resize', setPageSectionHeight);
    }

    if (!isMobile) {
      nextSection.classList.add('cinematic-section');

      const overlay = (
        document.querySelector('.cinematic-overlay') ||
        (() => {
          const overlayEl = document.createElement('div');
          overlayEl.className = 'cinematic-overlay';
          overlayEl.innerHTML = `
            <div class="cinematic-overlay__glow"></div>
            <div class="cinematic-overlay__beam"></div>
          `;
          body.appendChild(overlayEl);
          return overlayEl;
        })()
      );

      const updateScene = () => {
        heroHeight = hero.offsetHeight || heroHeight || 1;
        const rawProgress = heroHeight > 0 ? window.pageYOffset / heroHeight : 0;
        const progress = clamp(rawProgress, 0, 1);

        const scale = 1 + progress * 0.16;
        const tilt = -2 + progress * 6;
        const overlayStrength = clamp(progress, 0, 1);

        hero.style.setProperty('--hero-scale', scale.toFixed(3));
        hero.style.setProperty('--hero-tilt', `${tilt.toFixed(2)}deg`);
        hero.style.setProperty('--hero-overlay', (0.1 + overlayStrength * 0.6).toFixed(3));

        const sectionShift = 120 - progress * 160;
        nextSection.style.setProperty('--section-translate', `${sectionShift.toFixed(1)}px`);
        nextSection.style.setProperty('--section-scale', (0.94 + progress * 0.08).toFixed(3));
        nextSection.style.setProperty('--section-opacity', (0.08 + progress * 0.9).toFixed(3));
        nextSection.style.setProperty('--section-glow', (progress * 0.9).toFixed(3));

        overlay.style.setProperty('--overlay-strength', overlayStrength.toFixed(3));
        body.classList.toggle('cinematic-emphasis', progress > 0.82);
      };

      updateScene();

      requestTick = () => {
        if (requestTick._pending) return;
        requestTick._pending = true;
        requestAnimationFrame(() => {
          requestTick._pending = false;
          updateScene();
        });
      };
      requestTick._pending = false;

      window.addEventListener('resize', () => {
        heroHeight = hero.offsetHeight || 1;
        updateScene();
      });
    } else {
      nextSection.classList.remove('cinematic-section');
    }

    // Hide the header when scrolling down and show it when scrolling up.
    let lastScrollY = window.pageYOffset;
    window.addEventListener(
      'scroll',
      () => {
        if (requestTick) {
          requestTick();
        }
        const currentY = window.pageYOffset;
        if (currentY > lastScrollY && currentY > header.offsetHeight) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
        lastScrollY = currentY;
      },
      { passive: true }
    );

    if (!isMobile) {
      let hoverHideTimer = null;
      document.addEventListener('mousemove', (event) => {
        const scrolledPastHero = window.pageYOffset >= heroHeight;
        if (!scrolledPastHero) return;
        if (event.clientY <= header.offsetHeight + 8) {
          header.classList.remove('header-hidden');
          if (hoverHideTimer) {
            window.clearTimeout(hoverHideTimer);
          }
          hoverHideTimer = window.setTimeout(() => {
            if (window.pageYOffset >= heroHeight) {
              header.classList.add('header-hidden');
            }
          }, 1200);
        }
      });
    }
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