/*!
 * assets/js/parallax.js
 *
 * Implements a premium parallax effect for the body sections of the
 * Silverstone site.  This module now handles both mobile and desktop
 * environments distinctly:
 *
 * • On mobile devices (viewport width < 769px) fixed backgrounds are
 *   unreliable【358479931463355†L25-L32】.  To provide a crisp,
 *   viewport‑sized background that appears pinned behind the content,
 *   the script injects a single fixed element (`#parallax-bg`) at the
 *   top of the document.  As the user scrolls past themed sections
 *   (e.g. `.section.bg-lines`, `.section.bg-circuit`, etc.), the
 *   script updates the element’s `backgroundImage` to match the
 *   section’s original image and optionally applies a slight vertical
 *   translation for depth.  The original section backgrounds are
 *   removed so that content appears to slide over the image.  This
 *   follows the “fixed element” workaround recommended when
 *   `background-attachment: fixed` isn’t available【358479931463355†L127-L135】.
 *
 * • On desktop (viewport width ≥ 769px) the existing CSS parallax
 *   implementation applies: each themed section retains its
 *   `background-attachment: fixed`, `background-size: cover` and
 *   `background-position: center`.  The script tears down any
 *   mobile-specific scaffolding and restores backgrounds to ensure
 *   content scrolls smoothly over a static scene.
 *
 * This hybrid approach delivers a seamless parallax experience across
 * devices without changing the site’s markup or layout.
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
   * Initialise the parallax behaviour once the DOM is ready.  This
   * orchestrates two separate modes: a mobile mode that uses a
   * fixed overlay element for the background and a desktop mode that
   * defers to CSS.  The appropriate mode is selected based on the
   * current viewport width and updated on resize.
   */
  function initParallax() {
    var MOBILE_BREAKPOINT = 769;
    // Cache references to all sections participating in the parallax
    // effect.  The discovery‑call section on the booking page is
    // included as well.
    var sections = Array.prototype.slice.call(document.querySelectorAll(
      '.section.bg-lines, .section.bg-circuit, .section.bg-city, .section.bg-mesh, .section.bg-waves, .discovery-call-section'
    ));
    if (!sections.length) return;

    var currentMode = null; // 'mobile' or 'desktop'
    var parallaxBg = null;
    var observers = [];

    // Define mobile‑specific background assets for each themed section.  The
    // keys correspond to the base background classes and the values
    // provide relative paths from the HTML documents to the mobile
    // imagery.  These files live under assets/images/internet/mobile.
    var mobileBgMap = {
      'bg-lines': "url('assets/images/internet/mobile/section-abstract-lines@2x.webp')",
      'bg-circuit': "url('assets/images/internet/mobile/section-circuit@2x.webp')",
      'bg-city': "url('assets/images/internet/mobile/section-city@2x.webp')",
      'bg-mesh': "url('assets/images/internet/mobile/section-mesh@2x.webp')",
      'bg-waves': "url('assets/images/internet/mobile/section-waves@2x.webp')"
    };

    /**
     * Restore each section’s original background and remove any inline
     * overrides applied during mobile mode.  Also removes the global
     * parallax background if present.
     */
    function teardownMobile() {
      // Remove global parallax element
      if (parallaxBg && parallaxBg.parentNode) {
        parallaxBg.parentNode.removeChild(parallaxBg);
        parallaxBg = null;
      }
      // Restore background images on sections
      sections.forEach(function(section) {
        if (section._parallaxOriginalBg) {
          section.style.backgroundImage = section._parallaxOriginalBg;
          delete section._parallaxOriginalBg;
        }
        if (section._parallaxOriginalPosition) {
          section.style.backgroundPosition = section._parallaxOriginalPosition;
          delete section._parallaxOriginalPosition;
        }
        if (section._parallaxMobileBg) {
          // remove the mobile background reference
          delete section._parallaxMobileBg;
        }
      });
      // Disconnect observers and scroll handlers
      observers.forEach(function(obs) {
        if (typeof obs.disconnect === 'function') {
          obs.disconnect();
        }
      });
      observers = [];
    }

    /**
     * Set up mobile parallax behaviour.  Creates a single fixed
     * background element sized to the viewport and updates its
     * background image when each section scrolls into view.  Also
     * removes the original background from sections so that content
     * scrolls over the fixed image.
     */
    function setupMobile() {
      // Create the fixed background container if it does not exist
      if (!parallaxBg) {
        parallaxBg = document.createElement('div');
        parallaxBg.id = 'parallax-bg';
        document.body.insertBefore(parallaxBg, document.body.firstChild);
      }
      // Capture each section’s original background and clear it, and
      // compute a mobile‑specific background if available.  This
      // allows us to display crisp, viewport‑sized imagery on small
      // screens without stretching the asset across an entire
      // section.  After we store the originals, we remove the
      // backgrounds so that our global element can show through.
      sections.forEach(function(section) {
        var comp = window.getComputedStyle(section);
        // Persist original background and position for later
        if (!section._parallaxOriginalBg) {
          section._parallaxOriginalBg = comp.backgroundImage;
        }
        if (!section._parallaxOriginalPosition) {
          section._parallaxOriginalPosition = comp.backgroundPosition;
        }
        // Determine the mobile asset based on the section’s class list.
        // We look for any class that matches a key in mobileBgMap.
        var mobileBg = null;
        section.classList.forEach(function(cls) {
          if (mobileBg === null && mobileBgMap[cls]) {
            mobileBg = mobileBgMap[cls];
          }
        });
        // Fall back to the original background if no mapping is found
        section._parallaxMobileBg = mobileBg || section._parallaxOriginalBg;
        // Clear the background and any inline position so the global
        // element is visible
        section.style.backgroundImage = 'none';
        section.style.backgroundPosition = '';
      });
      // Set initial background on the fixed element to the first
      // section’s mobile background.  If no sections exist this
      // assignment is skipped.
      if (sections.length) {
        parallaxBg.style.backgroundImage = sections[0]._parallaxMobileBg;
      }
      // Track the index of the currently active section
      var currentIndex = 0;
      // Use IntersectionObserver to update background when a section
      // becomes visible.  We update on the smallest threshold so that
      // the background changes as soon as the section enters view.
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var idx = sections.indexOf(entry.target);
            if (idx !== -1 && idx !== currentIndex) {
              currentIndex = idx;
              // Swap to the section’s mobile background when it
              // enters view.  This ensures crisp, viewport‑sized
              // imagery on mobile devices.
              parallaxBg.style.backgroundImage = entry.target._parallaxMobileBg;
            }
          }
        });
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.01
      });
      sections.forEach(function(section) {
        io.observe(section);
      });
      observers.push(io);
      // Optionally apply a slight vertical translation to the fixed
      // element to mimic depth.  This uses requestAnimationFrame to
      // throttle updates.  The translation is negative because when
      // scrolling down the content moves up relative to the viewport.
      var ticking = false;
      function onScroll() {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var section = sections[currentIndex];
            if (section) {
              var rect = section.getBoundingClientRect();
              var elementTop = rect.top + scrollTop;
              var speed = 0.2; // smaller values yield more subtle movement
              var yOffset = -(scrollTop - elementTop) * speed;
              parallaxBg.style.transform = 'translateY(' + yOffset + 'px)';
            }
            ticking = false;
          });
          ticking = true;
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      observers.push({ disconnect: function() { window.removeEventListener('scroll', onScroll); } });
    }

    /**
     * Set up desktop parallax behaviour.  Restores the original
     * backgrounds and lets CSS handle the fixed effect.  If mobile
     * elements exist they are removed.
     */
    function setupDesktop() {
      // Tear down any mobile‑mode artefacts and restore original
      // backgrounds.  teardownMobile() will remove the global
      // parallax element and reinstate each section’s stored
      // background properties.
      teardownMobile();
      // After restoration, ensure we don’t leave behind inline
      // properties that might override CSS.  In particular, clear
      // any backgroundPosition overrides added during scrolling.
      sections.forEach(function(section) {
        // If the original background was stored, restore it and
        // delete the temporary storage.  If no original values are
        // stored (meaning we were never in mobile mode), do not
        // modify the inline styles so that CSS rules remain intact.
        if (section._parallaxOriginalBg) {
          section.style.backgroundImage = section._parallaxOriginalBg;
          delete section._parallaxOriginalBg;
        }
        if (section._parallaxOriginalPosition) {
          section.style.backgroundPosition = section._parallaxOriginalPosition;
          delete section._parallaxOriginalPosition;
        }
      });
    }

    /**
     * Switch between mobile and desktop modes based on viewport width.
     * Avoid unnecessary setup if the mode has not changed.
     */
    function updateMode() {
      var newMode = window.innerWidth < MOBILE_BREAKPOINT ? 'mobile' : 'desktop';
      if (newMode === currentMode) return;
      currentMode = newMode;
      if (newMode === 'mobile') {
        setupMobile();
      } else {
        setupDesktop();
      }
    }

    // Perform initial mode check
    updateMode();
    // Listen for resize events to switch modes
    window.addEventListener('resize', updateMode, { passive: true });
  }

  // Initialise when the DOM is ready.
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initParallax();
  } else {
    document.addEventListener('DOMContentLoaded', initParallax);
  }
})();