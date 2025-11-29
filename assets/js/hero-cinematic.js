/*! assets/js/hero-cinematic.js — GSAP ScrollTrigger migration
 *  - Replaces manual scroll listeners with scrubbed GSAP timelines
 *  - Respects orb/hash landings by disabling the downward reveal once
 *    the user is already inside the page content.
 */
(function () {
  'use strict';

  let disableDown = false;

  function ensureHeroLayers(heroSection) {
    if (!heroSection) return;
    const fxLayer = heroSection.querySelector('.fx-layer');
    if (!fxLayer) {
      const layer = document.createElement('div');
      layer.className = 'fx-layer';
      layer.setAttribute('aria-hidden', 'true');
      heroSection.insertBefore(layer, heroSection.firstChild);
    }

    const bloom = heroSection.querySelector('.fx-bloom');
    if (!bloom) {
      const fxBloom = document.createElement('div');
      fxBloom.className = 'fx-bloom';
      fxBloom.setAttribute('aria-hidden', 'true');
      heroSection.appendChild(fxBloom);
    }

    const aurora = heroSection.querySelector('.fx-aurora');
    if (!aurora) {
      const fxAurora = document.createElement('div');
      fxAurora.className = 'fx-aurora';
      fxAurora.setAttribute('aria-hidden', 'true');
      heroSection.appendChild(fxAurora);
    }
  }

  function ensureVeil(target) {
    if (!target) return null;
    let veil = target.querySelector('.fx-veil');
    if (!veil) {
      if (getComputedStyle(target).position === 'static') {
        target.style.position = 'relative';
      }
      veil = document.createElement('div');
      veil.className = 'fx-veil';
      veil.setAttribute('aria-hidden', 'true');
      target.insertBefore(veil, target.firstChild);
    }
    return veil;
  }

  function initHeroCinematic() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const hero = document.getElementById('hero');
    const heroTitle = document.getElementById('hero-title');
    const body = document.getElementById('body');
    const heroSection = hero ? hero.querySelector('.hero') : null;
    const nextSection = body ? body.querySelector('.section') : null;

    if (!hero || !heroSection || !body) return;

    const fromOrb = sessionStorage.getItem('fromOrb') === 'true';
    if (window.location.hash || fromOrb) {
      disableDown = true;
    }
    sessionStorage.removeItem('fromOrb');

    ensureHeroLayers(heroSection);
    const veil = ensureVeil(nextSection || body);

    if (!veil) return;

    if (disableDown) {
      gsap.set(veil, { opacity: 0, y: 200 });
      if (heroTitle) {
        gsap.set(heroTitle, { yPercent: -50, scale: 0.8 });
      }
    }

    const tlDown = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'bottom bottom',
        end: '+=100%',
        scrub: true
      }
    });

    tlDown
      .to(veil, { opacity: 0, y: 200, duration: 1 }, 0);

    if (heroTitle) {
      tlDown.to(heroTitle, { yPercent: -50, scale: 0.8, duration: 1 }, 0);
    }

    if (disableDown && tlDown.scrollTrigger) {
      tlDown.progress(1);
      tlDown.scrollTrigger.disable();
    }

    function reactivateDownward() {
      if (!disableDown) return;
      disableDown = false;
      if (tlDown.scrollTrigger) {
        tlDown.scrollTrigger.enable();
        tlDown.scrollTrigger.refresh();
      }
    }

    const tlUp = gsap.timeline({
      scrollTrigger: {
        trigger: '#body',
        start: 'top top',
        end: '-=100%',
        scrub: true,
        onEnter: reactivateDownward,
        onEnterBack: reactivateDownward
      }
    });

    tlUp
      .to(veil, { opacity: 1, y: 0, duration: 1 }, 0);

    if (heroTitle) {
      tlUp.to(heroTitle, { yPercent: 0, scale: 1, duration: 1 }, 0);
    }

    ScrollTrigger.refresh();
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCinematic);
  } else {
    initHeroCinematic();
  }
})();
