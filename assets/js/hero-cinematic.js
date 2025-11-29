/*! assets/js/hero-cinematic.js — GSAP ScrollTrigger transition */
(() => {
  'use strict';

  let disableDown = false;

  function initHeroScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const hero = document.getElementById('hero');
    const body = document.getElementById('body');
    const heroTitle = document.getElementById('hero-title');
    const veil = document.querySelector('.fx-veil');
    const veilHost = veil ? veil.parentElement : null;

    if (!hero || !body || !heroTitle || !veil) return;

    gsap.registerPlugin(ScrollTrigger);

    disableDown = !!(window.location.hash || sessionStorage.getItem('fromOrb') === 'true');

    if (sessionStorage.getItem('fromOrb') === 'true') {
      sessionStorage.removeItem('fromOrb');
    }

    gsap.set(heroTitle, { transformOrigin: '50% 50%', y: 0, scale: 1 });
    gsap.set(veil, { opacity: 1, y: 0 });

    if (veilHost && getComputedStyle(veilHost).position === 'static') {
      veilHost.style.position = 'relative';
    }

    const tlDown = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: hero,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    tlDown
      .to(veil, { opacity: 0, y: 200 }, 0)
      .to(heroTitle, { y: -120, scale: 0.8 }, 0);

    const tlUp = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: body,
        start: 'top top',
        end: '+=200',
        scrub: true,
        onEnter: () => {
          disableDown = false;
          if (tlDown.scrollTrigger) {
            tlDown.scrollTrigger.enable();
            tlDown.play();
          }
        },
        onEnterBack: () => {
          disableDown = false;
          if (tlDown.scrollTrigger) {
            tlDown.scrollTrigger.enable();
            tlDown.play();
          }
        }
      }
    });

    tlUp
      .to(veil, { opacity: 1, y: 0 }, 0)
      .to(heroTitle, { y: 0, scale: 1 }, 0);

    if (disableDown && tlDown.scrollTrigger) {
      tlDown.progress(1);
      tlDown.scrollTrigger.disable();
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroScroll);
  } else {
    initHeroScroll();
  }
})();
