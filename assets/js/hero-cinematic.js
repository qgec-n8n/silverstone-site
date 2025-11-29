/*! assets/js/hero-cinematic.js — GSAP ScrollTrigger edition
 *  - Migrated cinematic hero transition to GSAP timelines
 *  - Guards downward animation when arriving via hash/orb deep links
 *  - Adds subtle Animate.css microinteractions for gallery cards
 */
(function () {
  'use strict';

  let disableDown = false;

  function ensureFxLayers(heroSection, bodySection) {
    if (heroSection && !heroSection.querySelector('.fx-layer')) {
      const layer = document.createElement('div');
      layer.className = 'fx-layer';
      layer.setAttribute('aria-hidden', 'true');
      heroSection.insertBefore(layer, heroSection.firstChild);
    }

    if (heroSection && !heroSection.querySelector('.fx-bloom')) {
      const bloom = document.createElement('div');
      bloom.className = 'fx-bloom';
      bloom.setAttribute('aria-hidden', 'true');
      heroSection.appendChild(bloom);
    }

    if (heroSection && !heroSection.querySelector('.fx-aurora')) {
      const aurora = document.createElement('div');
      aurora.className = 'fx-aurora';
      aurora.setAttribute('aria-hidden', 'true');
      heroSection.appendChild(aurora);
    }

    if (bodySection && !bodySection.querySelector('.fx-veil')) {
      if (getComputedStyle(bodySection).position === 'static') {
        bodySection.style.position = 'relative';
      }
      const veil = document.createElement('div');
      veil.className = 'fx-veil';
      veil.setAttribute('aria-hidden', 'true');
      bodySection.insertBefore(veil, bodySection.firstChild);
    }
  }

  function setupMicrointeractions() {
    const cards = document.querySelectorAll('#neural-grid .neural-card');
    const pulseClasses = ['animate__animated', 'animate__pulse'];

    const triggerPulse = (card) => {
      card.classList.remove(...pulseClasses);
      // Force reflow so the animation can restart
      void card.offsetWidth;
      card.classList.add(...pulseClasses);
    };

    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => triggerPulse(card));
      card.addEventListener('focus', () => triggerPulse(card));
      card.addEventListener('animationend', () => card.classList.remove(...pulseClasses));
    });
  }

  function initHeroAnimation() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const heroWrapper = document.getElementById('hero');
    const heroSection = heroWrapper ? heroWrapper.querySelector('.hero.title-band') : null;
    const bodySection = document.getElementById('body');
    const heroTitle = document.getElementById('hero-title');

    if (!heroWrapper || !heroSection || !bodySection || !heroTitle) return;

    ensureFxLayers(heroSection, bodySection);
    const veil = bodySection.querySelector('.fx-veil');

    disableDown = !!window.location.hash || sessionStorage.getItem('fromOrb') === 'true';
    if (disableDown) {
      sessionStorage.removeItem('fromOrb');
    }

    gsap.set(heroTitle, { yPercent: 0, scale: 1, transformOrigin: '50% 50%' });
    if (veil) {
      gsap.set(veil, { opacity: 1, y: 0 });
    }

    if (disableDown) {
      if (veil) {
        gsap.set(veil, { opacity: 0, y: 200 });
      }
      gsap.set(heroTitle, { yPercent: -50, scale: 0.8 });
    }

    const tlDown = gsap.timeline({
      paused: disableDown,
      scrollTrigger: {
        trigger: '#hero',
        start: 'bottom bottom',
        end: '+=100%',
        scrub: true,
      },
    });

    tlDown
      .to('.fx-veil', { opacity: 0, y: 200, duration: 1 }, 0)
      .to('#hero-title', { yPercent: -50, scale: 0.8, duration: 1, ease: 'power1.out' }, 0);

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

    tlUp
      .to('.fx-veil', { opacity: 1, y: 0, duration: 1 }, 0)
      .to('#hero-title', { yPercent: 0, scale: 1, duration: 1, ease: 'power1.out' }, 0);

    ScrollTrigger.refresh();
  }

  function init() {
    initHeroAnimation();
    setupMicrointeractions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', () => {
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  });
})();
