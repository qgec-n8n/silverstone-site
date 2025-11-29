/*! assets/js/hero-cinematic.js — GSAP ScrollTrigger rewrite
 *  - Cinematic hero-to-body transition controlled by scroll position
 *  - Respects hash/orb navigation by disabling downward animation on landing
 *  - Keeps overlay layers injected for existing cinematic styling
 */
(function () {
  'use strict';

  let disableDown = false;

  function sizeHero(heroSection) {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    heroSection.style.minHeight = `${Math.max(window.innerHeight - headerHeight, 320)}px`;
  }

  function ensureFxElements(heroSection, bodyWrapper) {
    if (!heroSection.querySelector('.fx-layer')) {
      const layer = document.createElement('div');
      layer.className = 'fx-layer';
      layer.setAttribute('aria-hidden', 'true');
      heroSection.insertBefore(layer, heroSection.firstChild);
    }

    if (!heroSection.querySelector('.fx-bloom')) {
      const bloom = document.createElement('div');
      bloom.className = 'fx-bloom';
      bloom.setAttribute('aria-hidden', 'true');
      heroSection.appendChild(bloom);
    }

    if (!heroSection.querySelector('.fx-aurora')) {
      const aurora = document.createElement('div');
      aurora.className = 'fx-aurora';
      aurora.setAttribute('aria-hidden', 'true');
      heroSection.appendChild(aurora);
    }

    const nextSection = bodyWrapper.querySelector('section') || heroSection.nextElementSibling;

    if (nextSection && !nextSection.querySelector('.fx-veil')) {
      if (getComputedStyle(nextSection).position === 'static') {
        nextSection.style.position = 'relative';
      }
      const veil = document.createElement('div');
      veil.className = 'fx-veil';
      veil.setAttribute('aria-hidden', 'true');
      nextSection.insertBefore(veil, nextSection.firstChild);
    }

    return {
      veil: nextSection ? nextSection.querySelector('.fx-veil') : null,
      targetSection: nextSection,
    };
  }

  function setInitialState(heroSection, veil, heroTitle) {
    const past = disableDown;

    gsap.set(heroSection, {
      '--heroProgress': past ? 1 : 0,
      '--heroDepth': past ? 1.15 : 0,
      '--cineVeil': past ? 0 : 0.45,
      '--cineBars': 0,
      '--cineBloom': 0,
      '--cineBeamBoost': 0,
      '--cineAurora': 0,
      '--cinePulse': 0,
    });

    if (veil) {
      gsap.set(veil, { opacity: past ? 0 : 1, y: past ? 200 : 0 });
    }

    if (heroTitle) {
      gsap.set(heroTitle, {
        yPercent: past ? -50 : 0,
        scale: past ? 0.8 : 1,
        transformOrigin: '50% 50%',
      });
    }
  }

  function initHeroCinematic() {
    if (!document.body.classList.contains('page-services')) return;

    const heroWrapper = document.getElementById('hero');
    const heroSection = heroWrapper ? heroWrapper.querySelector('.hero.title-band') : document.querySelector('.hero.title-band');
    const bodyContainer = document.getElementById('body');

    if (!heroSection || !bodyContainer) return;

    gsap.registerPlugin(ScrollTrigger);

    const { veil } = ensureFxElements(heroSection, bodyContainer);

    disableDown = Boolean(window.location.hash) || sessionStorage.getItem('fromOrb') === 'true';
    if (sessionStorage.getItem('fromOrb') === 'true') {
      sessionStorage.removeItem('fromOrb');
    }

    sizeHero(heroSection);

    const heroTitle = document.getElementById('hero-title');
    setInitialState(heroSection, veil, heroTitle);

    const tlDown = gsap.timeline({
      paused: disableDown,
      scrollTrigger: {
        trigger: '#hero',
        start: 'bottom bottom',
        end: '+=100%',
        scrub: true,
      },
    });

    if (veil) {
      tlDown.to(
        veil,
        {
          opacity: 0,
          y: 200,
          duration: 1,
          ease: 'none',
        },
        0,
      );
    }

    if (heroTitle) {
      tlDown.to(
        heroTitle,
        {
          yPercent: -50,
          scale: 0.8,
          duration: 1,
          ease: 'none',
          transformOrigin: '50% 50%',
        },
        0,
      );
    }

    tlDown.to(
      heroSection,
      {
        '--heroProgress': 1,
        '--heroDepth': 1.15,
        '--cineVeil': 0,
        duration: 1,
        ease: 'none',
      },
      0,
    );

    const tlUp = gsap.timeline({
      scrollTrigger: {
        trigger: '#body',
        start: 'top top',
        end: '-=100%',
        scrub: true,
        onEnter: () => {
          if (disableDown) {
            disableDown = false;
            tlDown.play();
          }
        },
      },
    });

    if (veil) {
      tlUp.to(
        veil,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'none',
        },
        0,
      );
    }

    if (heroTitle) {
      tlUp.to(
        heroTitle,
        {
          yPercent: 0,
          scale: 1,
          duration: 1,
          ease: 'none',
          transformOrigin: '50% 50%',
        },
        0,
      );
    }

    tlUp.to(
      heroSection,
      {
        '--heroProgress': 0,
        '--heroDepth': 0,
        '--cineVeil': 0.45,
        duration: 1,
        ease: 'none',
      },
      0,
    );

    ScrollTrigger.addEventListener('refreshInit', () => sizeHero(heroSection));
    ScrollTrigger.refresh();

    window.addEventListener('load', () => ScrollTrigger.refresh());
    window.addEventListener('resize', () => sizeHero(heroSection));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCinematic);
  } else {
    initHeroCinematic();
  }
})();
