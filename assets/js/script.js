/*
  Silverstone site cinematic scroll experience
  -------------------------------------------
  This implementation keeps the vibrant hero-to-content transition while
  prioritising smoothness. Only GPU-friendly transforms and opacity
  updates are animated; heavy filter/keyframe timelines were removed.
*/

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const pathname = window.location.pathname;

  const ensureStylesheet = (href) => {
    if (document.querySelector(`link[href*="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./${href}`;
    document.head.appendChild(link);
  };

  ensureStylesheet('assets/css/custom.css');
  ensureStylesheet('assets/css/mobile-fixes.css');

  const ua = navigator.userAgent || '';
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android/i.test(ua);
  const disableParallax = isSafari || prefersReducedMotion;
  const isMobile = window.innerWidth <= 900 || disableParallax;

  const hero = document.querySelector('.hero');
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
    const heroContent = hero.querySelector('.content');

    if (pathname.includes('contact') || pathname.includes('privacy')) {
      const setPageSectionHeight = () => {
        nextSection.style.minHeight = `${window.innerHeight}px`;
      };
      setPageSectionHeight();
      window.addEventListener('resize', setPageSectionHeight);
    }

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    if (!isMobile) {
      nextSection.classList.add('cinematic-section');

      let heroHeight = hero.offsetHeight || 1;
      let progress = clamp(window.pageYOffset / heroHeight, 0, 1);
      let ticking = false;

      const applyParallax = () => {
        const eased = easeOutCubic(progress);
        const heroScale = 1 + eased * 0.08;
        const heroTilt = eased * 4;
        const overlayStrength = 0.25 + eased * 0.45;
        const glow = eased;

        hero.style.setProperty('--hero-scale', heroScale.toFixed(4));
        hero.style.setProperty('--hero-tilt', `${heroTilt.toFixed(2)}deg`);
        hero.style.setProperty('--hero-overlay', overlayStrength.toFixed(3));
        hero.style.setProperty('--hero-glow', glow.toFixed(3));

        if (heroContent) {
          heroContent.style.setProperty(
            '--hero-content-shift',
            `${(eased * 36).toFixed(1)}`
          );
          heroContent.style.setProperty(
            '--hero-content-opacity',
            (1 - eased * 0.25).toFixed(3)
          );
        }

        const sectionTranslate = (1 - eased) * 160;
        const sectionOpacity = Math.min(1, 0.05 + eased * 0.95);
        const sectionScale = 0.95 + eased * 0.07;

        nextSection.style.setProperty(
          '--section-translate',
          sectionTranslate.toFixed(1)
        );
        nextSection.style.setProperty(
          '--section-opacity',
          sectionOpacity.toFixed(3)
        );
        nextSection.style.setProperty(
          '--section-scale',
          sectionScale.toFixed(3)
        );

        body.classList.toggle('is-cinematic-active', eased > 0.6);

        ticking = false;
      };

      const updateProgress = () => {
        const nextProgress = clamp(window.pageYOffset / heroHeight, 0, 1);
        if (Math.abs(nextProgress - progress) < 0.0005) {
          return;
        }
        progress = nextProgress;
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(applyParallax);
        }
      };

      applyParallax();

      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', () => {
        heroHeight = hero.offsetHeight || 1;
        updateProgress();
      });
    } else {
      body.classList.remove('is-cinematic-active');
    }

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

    document.addEventListener('mousemove', (event) => {
      if (isMobile) return;
      const headerHeight = header.offsetHeight;
      const scrolledPastHero = window.pageYOffset >= nextSection.offsetTop;
      if (scrolledPastHero && event.clientY <= headerHeight) {
        header.classList.remove('header-hidden');
      } else if (scrolledPastHero) {
        header.classList.add('header-hidden');
      }
    });
  }

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
