/*!
 * assets/js/parallax.js
 *
 * Implements a lightweight parallax effect for the body sections of the
 * Silverstone site. On desktop devices, the existing CSS rules take
 * advantage of `background‑attachment: fixed` to keep background images
 * pinned while content scrolls over the top. Mobile browsers do not
 * reliably support fixed backgrounds, so this script emulates the same
 * behaviour by dynamically adjusting the vertical background position on
 * scroll. The result is a subtle depth effect that preserves the look
 * and feel of the site without introducing jank or layout thrash.
 *
 * How it works:
 *   • Once the DOM has loaded, the script collects all themed body
 *     sections that should participate in the parallax effect. These
 *     include any `.section` with one of the background classes
 *     (`bg‑lines`, `bg‑circuit`, `bg‑city`, `bg‑mesh`, `bg‑waves`) as
 *     well as the discovery call section on the booking page.
 *   • For viewports wider than the defined breakpoint (769px), no
 *     JavaScript is needed. The backgrounds are reset to their
 *     default positioning and CSS handles the parallax effect via
 *     `background‑attachment: fixed`.
 *   • For narrower viewports, the script calculates the offset of each
 *     section relative to the top of the document and applies a
 *     vertical shift to the background based on the current scroll
 *     position. A lower multiplier yields a slower background movement,
 *     making the image appear pinned while the content slides over it.
 *   • Updates are throttled using `requestAnimationFrame` to avoid
 *     excessive recalculations during rapid scrolling.
 */
(function() {
  "use strict";

  /**
   * Initialise the parallax behaviour once the DOM is ready.
   */
  function initParallax() {
    // Only apply the JS‑driven parallax on narrow screens. When the viewport
    // is wider than this breakpoint, CSS `background‑attachment: fixed`
    // provides the desktop effect.
    var MOBILE_BREAKPOINT = 769;

    // Select all sections that should have a parallax background. The list
    // mirrors the themed section classes used throughout the site. The
    // discovery‑call section on the booking page is included so that a
    // background image can be added there in the future without further
    // changes.
    var sections = document.querySelectorAll(
      '.section.bg-lines, .section.bg-circuit, .section.bg-city, .section.bg-mesh, .section.bg-waves, .discovery-call-section'
    );
    if (!sections.length) return;

    /**
     * Update the background position of each section. On mobile we
     * translate the Y position based on scroll; on desktop we clear any
     * inline style to allow CSS to handle the parallax.
     */
    function updateParallax() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      sections.forEach(function(section) {
        if (window.innerWidth < MOBILE_BREAKPOINT) {
          // Calculate the element's position relative to the document top.
          var rect = section.getBoundingClientRect();
          var elementTop = rect.top + scrollTop;
          // Adjust this multiplier to control the parallax intensity. A
          // smaller value moves the background more slowly, making it appear
          // fixed relative to the viewport.
          var speed = 0.5;
          var yOffset = (scrollTop - elementTop) * speed;
          // Apply the computed offset. Preserve horizontal centering.
          section.style.backgroundPosition = 'center ' + yOffset + 'px';
        } else {
          // Clear inline background positioning on wider screens so the
          // CSS `background‑attachment: fixed` takes effect.
          section.style.backgroundPosition = '';
        }
      });
    }

    // Throttle scroll handling with requestAnimationFrame for smoother
    // animation and better performance on mobile devices.
    var ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Perform an initial update in case the page loads mid‑scroll.
    updateParallax();

    // Listen for scroll and resize events. Resize events trigger an
    // immediate update so that switching between portrait/landscape or
    // rotating a device recalculates the background positions correctly.
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateParallax, { passive: true });
  }

  // Initialise when the DOM is ready.
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initParallax();
  } else {
    document.addEventListener('DOMContentLoaded', initParallax);
  }
})();