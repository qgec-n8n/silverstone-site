let disableDown = false;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const hero = document.getElementById('hero');
  const body = document.getElementById('body');
  const heroTitle = document.getElementById('hero-title');

  if (!hero || !body || !heroTitle) return;

  let fxVeil = body.querySelector('.fx-veil');

  if (!fxVeil) {
    if (getComputedStyle(body).position === 'static') {
      body.style.position = 'relative';
    }

    fxVeil = document.createElement('div');
    fxVeil.className = 'fx-veil';
    fxVeil.setAttribute('aria-hidden', 'true');
    body.prepend(fxVeil);
  }

  const arrivedFromOrb = sessionStorage.getItem('fromOrb') === 'true';

  if (window.location.hash || arrivedFromOrb) {
    disableDown = true;
    sessionStorage.removeItem('fromOrb');
  }

  gsap.set(fxVeil, disableDown ? { opacity: 0, y: 200 } : { opacity: 1, y: 0 });
  gsap.set(heroTitle, disableDown ? { y: -80, scale: 0.82 } : { y: 0, scale: 1 });

  const tlDown = gsap.timeline({
    defaults: { ease: 'power2.out' },
  });

  tlDown
    .to(fxVeil, { opacity: 0, y: 200 }, 0)
    .to(heroTitle, { y: -80, scale: 0.82 }, 0);

  const stDown = ScrollTrigger.create({
    trigger: hero,
    start: 'bottom bottom',
    end: 'bottom top',
    scrub: true,
    animation: tlDown,
  });

  if (disableDown) {
    stDown.disable();
    tlDown.progress(1);
  }

  const tlUp = gsap.timeline({
    defaults: { ease: 'power2.out' },
  });

  tlUp
    .to(fxVeil, { opacity: 1, y: 0 }, 0)
    .to(heroTitle, { y: 0, scale: 1 }, 0);

  ScrollTrigger.create({
    trigger: body,
    start: 'top top',
    end: 'top+=200 top',
    scrub: true,
    animation: tlUp,
    onEnter: () => {
      disableDown = false;
      stDown.enable();
      stDown.refresh();
      tlDown.play();
    },
    onEnterBack: () => {
      disableDown = false;
      stDown.enable();
      stDown.refresh();
      tlDown.play();
    },
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
});
