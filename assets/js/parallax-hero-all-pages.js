/**
 * Parallax for the FIRST hero on any page.
 * - If an element has [data-parallax-hero], it wins.
 * - Else, the first match of .hero.title-band, .hero, .masthead, or .banner is used.
 * - Respects prefers-reduced-motion.
 */
(function () {
  var mql = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mql && mql.matches) return;

  // Choose target
  var hero =
    document.querySelector("[data-parallax-hero]") ||
    document.querySelector("section.hero.title-band, section.hero, header.masthead, section.banner, .hero.title-band, .hero, .masthead, .banner");

  if (!hero) return;

  // Ensure base styles
  var style = hero.style;
  if (!style.backgroundRepeat) style.backgroundRepeat = "no-repeat";
  if (!style.backgroundSize) style.backgroundSize = "cover";
  if (!style.backgroundPosition) style.backgroundPosition = "center 0px";
  style.willChange = "background-position";

  var lastY = -1;
  var maxShift = Math.round(window.innerHeight * 0.25);

  function update() {
    var rect = hero.getBoundingClientRect();
    var viewH = window.innerHeight || document.documentElement.clientHeight;

    if (rect.bottom <= 0 || rect.top >= viewH) return;

    var progress = Math.min(1, Math.max(0, (0 - rect.top) / (rect.height || 1)));
    var offset = Math.round(progress * maxShift * -1);

    if (offset !== lastY) {
      hero.style.backgroundPosition = "center " + offset + "px";
      lastY = offset;
    }
  }

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

  // Avoid work on very old/low-power devices
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    maxShift = Math.round(window.innerHeight * 0.25);
    update();
  });

  update();
})();