/*
  Customised Silverstone JavaScript (v26)

  This script provides a streamlined, high‑quality parallax experience and
  cleans up redundant logic accumulated over prior revisions.  Key features
  include:

  • Instantaneous triggering: the parallax animation begins as soon as the
    user starts scrolling within the hero for downward movement or between
    the top of the next section and the bottom of the hero for upward
    movement.  There is no “dead zone” where small scrolls are ignored.

  • Cinematic transitions: the hero scales up and darkens while its
    contents fade upward, and the next section fades and slides into view.
    The effect lasts 2.5 seconds to give the page a premium, polished feel.

  • Responsiveness: no page‑wide scaling is used.  Instead, layout
    responsiveness is handled via CSS (see custom.css).  This prevents
    awkward black bars at extreme aspect ratios and keeps the hero filling
    the viewport at all times.

  • Modular architecture: fade‑in animations and mobile navigation are
    implemented independently to avoid interfering with the parallax.

  If you wish to adjust the duration or the intensity of the animation,
  modify the CSS rules associated with the `.scrolling-down` and
  `.scrolling-up` classes in assets/css/custom.css.
*/

document.addEventListener('DOMContentLoaded', () => {
  // Honour reduced motion preferences and skip the parallax entirely if
  // requested by the user.  This improves accessibility for people
  // sensitive to motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Avoid running the parallax on privacy policy pages (or any page
  // containing "privacy" in its path) where animations may be
  // inappropriate.
  const pathname = window.location.pathname;
  if (pathname.includes('privacy')) return;

  // Inject custom responsiveness/parallax styles if they are not already
  // present.  This allows the HTML files to remain untouched while
  // enabling our animation classes and service/gallery fixes.
  const existingLink = document.querySelector('link[href*="assets/css/custom.css"]');
  if (!existingLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/custom.css';
    document.head.appendChild(link);
  }

  // Identify the hero and the first <section> that follows it.  The
  // parallax transition will move between these two elements.  Skip
  // non‑section siblings like <style> tags.
  const hero = document.querySelector('.hero');
  let nextSection = null;
  if (hero) {
    let el = hero.nextElementSibling;
    while (el) {
      if (el.tagName && el.tagName.toLowerCase() === 'section') {
        nextSection = el;
        break;
      }
      el = el.nextElementSibling;
    }
  }
  // If either the hero or next section is missing, there’s nothing to animate.
  if (!hero || !nextSection) return;

  // Flag to prevent multiple animations from overlapping.
  let animating = false;

  /**
   * Initiate the parallax animation.  Adds a class to the body based on
   * scroll direction, waits for the CSS transition to complete, then
   * scrolls to the appropriate position and cleans up the state.
   *
   * @param {boolean} down True if the user is scrolling downward, false
   *                       for upward movement.
   */
  function startParallax(down) {
    animating = true;
    document.body.classList.add(down ? 'scrolling-down' : 'scrolling-up');
    // After the CSS transitions finish (2.5 s), scroll the page and
    // remove the classes.  Use setTimeout rather than transitionend
    // events to ensure consistency across browsers.
    setTimeout(() => {
      const targetY = down ? hero.offsetHeight : 0;
      window.scrollTo({ top: targetY, behavior: 'auto' });
      document.body.classList.remove('scrolling-down', 'scrolling-up');
      animating = false;
    }, 2500);
  }

  /**
   * Wheel handler.  Determines whether to trigger the parallax based on
   * the current scroll position and the wheel delta.  Prevents default
   * scrolling only when initiating the animation.
   */
  function handleWheel(evt) {
    if (animating) {
      evt.preventDefault();
      return;
    }
    const y = window.scrollY;
    const heroHeight = hero.offsetHeight;
    const nextHeight = nextSection.offsetHeight;
    const dy = evt.deltaY;
    if (dy > 0 && y < heroHeight) {
      // Scrolling down from within the hero: animate to next section
      evt.preventDefault();
      startParallax(true);
    } else if (dy < 0 && y >= heroHeight && y < heroHeight + nextHeight) {
      // Scrolling up from within the next section: animate back to top
      evt.preventDefault();
      startParallax(false);
    }
  }

  window.addEventListener('wheel', handleWheel, { passive: false });

  // Fade‑in animation for elements marked with .animate.  As they enter
  // the viewport, they receive a .visible class which triggers CSS
  // transitions defined in styles.css.  This observer runs on all
  // pages and is independent of the parallax effect.
  const animatables = document.querySelectorAll('.animate');
  if (animatables.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });
    animatables.forEach((el) => observer.observe(el));
  }

  // Mobile navigation toggle.  On smaller screens the menu is hidden
  // until the hamburger icon is clicked.  Selecting a link closes the
  // menu.  This has no effect on desktop because the `.open` class is
  // ignored in larger media queries.
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }
});