/*
  Lightweight cinematic scroll controller
  ---------------------------------------
  Replaces the previous multi‑layer transition system with a GPU‑friendly
  implementation that animates only transforms and opacity.  The script
  locks the viewport on the hero/body boundary and plays a cinematic
  transition whenever the user moves between the sections using scroll,
  wheel, keyboard, or touchpad gestures.

  This version has been modified to disable the cinematic/parallax
  functionality entirely by forcing the feature flag to `false`.  All
  associated event handlers and animations are bypassed, restoring
  standard scroll behaviour while preserving header hiding and
  intersection observer animations.
*/

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const ensureStylesheet = (href) => {
    if (document.querySelector(`link[href*="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./${href}`;
    document.head.appendChild(link);
  };

  ensureStylesheet('assets/css/custom.css');
  ensureStylesheet('assets/css/mobile-fixes.css');

  const hero = document.querySelector('.hero');
  const findNextSection = () => {
    if (!hero) return null;
    let node = hero.nextElementSibling;
    while (node) {
      if (node.tagName && node.tagName.toLowerCase() === 'section') {
        return node;
      }
      node = node.nextElementSibling;
    }
    return null;
  };
  const nextSection = findNextSection();
  const header = document.querySelector('header');

  const pathname = window.location.pathname;
  if (hero && nextSection && (pathname.includes('contact') || pathname.includes('privacy'))) {
    const setPageSectionHeight = () => {
      nextSection.style.minHeight = `${window.innerHeight}px`;
    };
    setPageSectionHeight();
    window.addEventListener('resize', setPageSectionHeight);
  }

  const ua = navigator.userAgent || '';
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android/i.test(ua);
  /*
   * Disable the cinematic/parallax scroll effect entirely.  The original
   * feature required hero and nextSection elements, no reduced motion,
   * non‑Safari browser and a minimum viewport width.  By setting this
   * flag to false unconditionally, the overlay and event interceptors
   * never initialise, allowing the page to scroll normally.
   */
  const cinematicEnabled = false;

  // Parallax logic removed.  We still remove any residual classes
  // that might have been applied on previous versions of the site.
  body.classList.remove('scene-transition', 'scene-hero', 'scene-body');

  if (header) {
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
  }

  const animatedEls = document.querySelectorAll('.animate');
  if (animatedEls.length > 0) {
    if (prefersReducedMotion) {
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
  document.querySelectorAll('.gallery-grid .neon-card').forEach((el) => {
    el.classList.add('visible');
  });
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
    window.addEventListener('scroll', () => {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
    }, { passive: true });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }
});