(function () {
  'use strict';

  const MOBILE_BREAKPOINT = 768;

  function isReducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getPageName() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!window.gsap) return;

    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector('.hero.title-band');
    if (!hero) return;

    const pageName = getPageName();
    const isServicesPage = pageName === 'services.html';

    const prefersReduced = isReducedMotion();
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

    // baseline content fade-in (safe even with reduced motion)
    const content = hero.querySelector('.content');
    if (content) {
      gsap.fromTo(
        content,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }
      );
    }

    // If reduced motion or narrow viewport -> no pinning / heavy scroll anim
    if (prefersReduced || isMobile) {
      // ensure cinematic vars are neutral/static
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty('--heroProgress', '0');
      rootStyle.setProperty('--cineBars', '0');
      rootStyle.setProperty('--cineBloom', '0');
      rootStyle.setProperty('--cineVeil', '0');
      rootStyle.setProperty('--cineAurora', '0');
      rootStyle.setProperty('--cinePulse', '0');
      return;
    }

    const rootStyle = document.documentElement.style;

    const skipRequested =
      isServicesPage &&
      window.sessionStorage &&
      sessionStorage.getItem('silverstone_skip_hero_anim') === 'true';

    const hash = window.location.hash || '';

    if (isServicesPage && (skipRequested || hash === '#neural-grid')) {
      if (window.sessionStorage) {
        sessionStorage.removeItem('silverstone_skip_hero_anim');
      }
      setupServicesHeroSkipped(hero, rootStyle, hash);
    } else {
      setupHeroTimeline(hero, rootStyle);
    }

    if (isServicesPage) {
      setupOrbArrivalOverlay();
    }
  });

  function setupHeroTimeline(hero, rootStyle) {
    const content = hero.querySelector('.content');
    const fxLayer = hero.querySelector('.fx-layer');
    const veil = hero.querySelector('.fx-veil');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1.5, // luxurious catch-up
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // drive CSS variables for existing hero-cinematic.css
    tl.to(rootStyle, {
      duration: 1,
      '--heroProgress': 1,
      '--cineBars': 1,
      '--cineBloom': 1,
      '--cineVeil': 1,
      '--cineAurora': 1,
      ease: 'none'
    }, 0);

    // text dissipates
    if (content) {
      tl.to(content, {
        y: -80,
        autoAlpha: 0,
        filter: 'blur(10px)',
        duration: 0.9,
        ease: 'power2.out'
      }, 0);
    }

    // background veil deepens
    if (fxLayer) {
      tl.to(fxLayer, {
        duration: 0.9,
        // rely on existing gradients; just subtly strengthen via filter
        filter: 'brightness(0.9) contrast(1.1)',
        ease: 'power1.inOut'
      }, 0);
    }

    // quantum reveal: hero clips away to reveal body
    tl.to(hero, {
      clipPath: 'inset(0 0 100% 0)',
      ease: 'power2.inOut',
      duration: 1.0
    }, 0.35);

    // optional: soften veil at end
    if (veil) {
      tl.to(veil, {
        duration: 0.8,
        autoAlpha: 0.4,
        ease: 'power1.out'
      }, 0.6);
    }
  }

  function setupServicesHeroSkipped(hero, rootStyle, hash) {
    // Immediately force hero to end-of-animation state
    rootStyle.setProperty('--heroProgress', '1');
    rootStyle.setProperty('--cineBars', '0');
    rootStyle.setProperty('--cineBloom', '0');
    rootStyle.setProperty('--cineVeil', '0');
    rootStyle.setProperty('--cineAurora', '0');
    rootStyle.setProperty('--cinePulse', '0');

    document.body.classList.add('hero-anim-skipped');

    // Ensure hero is not pinned initially
    // Reactivate only when user scrolls back up
    const reactivationTrigger = ScrollTrigger.create({
      trigger: hero,
      start: 'top center',
      onEnterBack(self) {
        if (document.body.classList.contains('hero-anim-skipped')) {
          document.body.classList.remove('hero-anim-skipped');
          setupHeroTimeline(hero, rootStyle);
          self.kill();
          ScrollTrigger.refresh();
        }
      }
    });

    // Ensure hash anchor is respected AFTER layout settles
    if (hash === '#neural-grid') {
      const target = document.getElementById('neural-grid');
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ block: 'start' });
        }, 40);
      }
    }
  }

  function setupOrbArrivalOverlay() {
    if (!window.sessionStorage) return;
    const flag = sessionStorage.getItem('silverstone_orb_redirect');
    if (!flag) return;

    // one-shot
    sessionStorage.removeItem('silverstone_orb_redirect');

    const overlay = document.createElement('div');
    overlay.className = 'singularity-overlay';
    document.body.appendChild(overlay);

    gsap.set(overlay, { autoAlpha: 1 });

    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 1.0,
      ease: 'power2.out',
      onComplete() {
        overlay.remove();
      }
    });
  }

})();
