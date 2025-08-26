/**
 * Parallax for the FIRST hero on the homepage only.
 * Smoothly shifts the hero's background image as you scroll past it,
 * without affecting the rest of the page.
 */
(function () {
  var hero = document.querySelector("section.hero.title-band");
  if (!hero) return;

  // Only run on the homepage (index.html) by checking for a unique class on <body> if present,
  // otherwise infer by URL path (optional, harmless in multi-page static hosting).
  var isHome = document.body.classList.contains("home") || /(?:^|\/)index\.html?$/.test(location.pathname) || location.pathname === "/";

  if (!isHome) return;

  // Ensure base styles are set (in case CSS didn't load for any reason).
  hero.style.backgroundRepeat = hero.style.backgroundRepeat || "no-repeat";
  hero.style.backgroundSize = hero.style.backgroundSize || "cover";
  hero.style.backgroundPosition = hero.style.backgroundPosition || "center 0px";
  hero.style.willChange = "background-position";

  var lastY = -1;
  var maxShift = Math.round(window.innerHeight * 0.25); // cap parallax shift to ~25% of viewport height

  function update() {
    // Compute how much of the hero is in view
    var rect = hero.getBoundingClientRect();
    var viewH = window.innerHeight || document.documentElement.clientHeight;

    // Only animate while the hero intersects the viewport
    if (rect.bottom <= 0 || rect.top >= viewH) return;

    // Progress from 0 (top of page) to 1 (hero completely off-canvas)
    var progress = Math.min(1, Math.max(0, (0 - rect.top) / (rect.height || 1)));

    // Parallax offset: negative to move background up more slowly than scroll
    var offset = Math.round(progress * maxShift * -1);

    if (offset !== lastY) {
      hero.style.backgroundPosition = "center " + offset + "px";
      lastY = offset;
    }
  }

  // Scroll/resize handlers
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    maxShift = Math.round(window.innerHeight * 0.25);
    update();
  });

  // Initial position
  update();
})();