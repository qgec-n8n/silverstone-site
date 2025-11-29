/*! assets/js/hero-cinematic.js — GSAP ScrollTrigger edition
 *  - Replaces custom scroll logic with GSAP timelines
 *  - Handles hero→body and body→hero transitions with scroll syncing
 *  - Respects orb/hash landings by disabling downward animation on load
 */
(function () {
  'use strict';

  let disableDown = false;

  /**
   * Create decorative hero layers if they are missing.
   * These match the existing cinematic styling without relying on legacy JS.
   */
  function ensureHeroLayers(hero) {
    if (!hero) return;

    if (!hero.querySelector('.fx-layer')) {
      const layer = document.createElement('div');
      layer.className = 'fx-layer';
      layer.setAttribute('aria-hidden', 'true');
      hero.insertBefore(layer, hero.firstChild);
    }

    if (!hero.querySelector('.fx-bloom')) {
      const bloom = document.createElement('div');
      bloom.className = 'fx-bloom';
      bloom.setAttribute('aria-hidden', 'true');
      hero.appendChild(bloom);
    }

    if (!hero.querySelector('.fx-aurora')) {
      const aurora = document.createElement('div');
      aurora.className = 'fx-aurora';
      aurora.setAttribute('aria-hidden', 'true');
      hero.appendChild(aurora);
    }
  }

  /**
   * Ensure the body container has the cinematic veil overlay.
   */
  function ensureVeil(bodyContainer) {
    if (!bodyContainer) return null;
    const existing = bodyContainer.querySelector('.fx-veil');
    if (existing) return existing;

    const veilHost = bodyContainer.firstElementChild || bodyContainer;
    if (getComputedStyle(veilHost).position === 'static') {
      veilHost.style.position = 'relative';
    }

    const veil = document.createElement('div');
    veil.className = 'fx-veil';
    veil.setAttribute('aria-hidden', 'true');
    veilHost.insertBefore(veil, veilHost.firstChild);
    return veil;
  }

  /**
   * Add subtle hover emphasis to gallery cards using Animate.css classes.
   */
  function addGalleryHover() {
    document.querySelectorAll('.neural-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('animate__animated', 'animate__pulse');
      });

      card.addEventListener('animationend', () => {
        card.classList.remove('animate__pulse');
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('animate__pulse');
      });
    });
  }

  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const heroWrapper = document.getElementById('hero');
    const heroSection = heroWrapper ? heroWrapper.querySelector('.hero.title-band') : document.querySelector('.hero.title-band');
    const bodyContainer = document.getElementById('body');

    if (!heroSection || !bodyContainer) return;

    const heroTitle = document.getElementById('hero-title') || heroSection.querySelector('h1');

    ensureHeroLayers(heroSection);
    const veil = ensureVeil(bodyContainer);

    if (!veil) return;

    if (window.location.hash || sessionStorage.getItem('fromOrb') === 'true') {
      disableDown = true;
      sessionStorage.removeItem('fromOrb');
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.set(veil, { opacity: 1, y: 0, force3D: true });
    if (heroTitle) {
      gsap.set(heroTitle, { yPercent: 0, scale: 1, transformOrigin: '50% 50%', force3D: true });
    }

    // Downward animation: hero collapses, overlay fades out
    const tlDown = gsap.timeline({
      paused: disableDown,
      scrollTrigger: {
        trigger: '#hero',
        start: 'bottom bottom',
        end: '+=100%',
        scrub: true,
      },
    });

    tlDown.to(veil, { opacity: 0, y: 200, duration: 1 }, 0);
    if (heroTitle) {
      tlDown.to(heroTitle, { yPercent: -50, scale: 0.8, duration: 1 }, 0);
    }

    if (disableDown) {
      tlDown.progress(1);
    }

    // Upward animation: hero expands when scrolling up
    const tlUp = gsap.timeline({
      scrollTrigger: {
        trigger: '#body',
        start: 'top top',
        end: '-=100%',
        scrub: true,
        onEnter: () => {
          if (disableDown) {
            disableDown = false;
            tlDown.pause(false);
            tlDown.progress(0);
          }
        },
      },
    });

    tlUp.to(veil, { opacity: 1, y: 0, duration: 1 }, 0);
    if (heroTitle) {
      tlUp.to(heroTitle, { yPercent: 0, scale: 1, duration: 1 }, 0);
    }

    ScrollTrigger.refresh();
    window.addEventListener('load', () => ScrollTrigger.refresh());

    addGalleryHover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
