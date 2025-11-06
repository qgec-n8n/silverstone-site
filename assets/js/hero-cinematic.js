/*! assets/js/hero-cinematic.js
 * Silverstone-AI — Cinematic hero↔body scroll transition
 * - Locks native scroll input during transitions
 * - Animates hero content via CSS variables (GPU-friendly)
 * - Honors fixed header and optional indicator heights
 * - Respects reduced motion; pauses when mobile menu overlay is open
 */
(function () {
  "use strict";

  var CONFIG = {
    DURATION_MS: 1100, // slow, cinematic
    HEADER_VAR_NAME: "--headerH",
    BOUNDARY_THRESHOLD_PX: 28,
    DISABLE_ON_WIDTH_BELOW: 0, // set to e.g. 640 to disable on very small screens
    EASING: [0.22, 0.61, 0.36, 1.0] // cubic-bezier control points
  };

  // Cubic-bezier implementation (https://github.com/gre/bezier-easing MIT)
  function BezierEasing (mX1, mY1, mX2, mY2) {
    var NEWTON_ITERATIONS = 4;
    var NEWTON_MIN_SLOPE = 0.001;
    var SUBDIVISION_PRECISION = 0.0000001;
    var SUBDIVISION_MAX_ITERATIONS = 10;

    var kSplineTableSize = 11;
    var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    var float32ArraySupported = typeof Float32Array === 'function';

    function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C (aA1)      { return 3.0 * aA1; }

    function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
    function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

    function binarySubdivide (aX, aA, aB, mX1, mX2) {
      var currentX, currentT, i = 0;
      do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
      return currentT;
    }

    function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
      for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) return aGuessT;
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }

    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error("bezier x values must be in [0, 1] range");
    }

    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    for (var i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }

    function getTForX (aX) {
      var intervalStart = 0.0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;

      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function BezierEasing (x) {
      if (mX1 === mY1 && mX2 === mY2) return x; // linear
      if (x === 0 || x === 1) return x;
      return calcBezier(getTForX(x), mY1, mY2);
    };
  }

  var easingFn = BezierEasing.apply(null, CONFIG.EASING);

  // Public API for tuning at runtime if needed
  window.SilverstoneHeroCinematic = window.SilverstoneHeroCinematic || {};
  window.SilverstoneHeroCinematic.setDuration = function (ms) { CONFIG.DURATION_MS = +ms || CONFIG.DURATION_MS; };
  window.SilverstoneHeroCinematic.setThreshold = function (px) { CONFIG.BOUNDARY_THRESHOLD_PX = +px || CONFIG.BOUNDARY_THRESHOLD_PX; };
  window.SilverstoneHeroCinematic.setDisableBelow = function (px) { CONFIG.DISABLE_ON_WIDTH_BELOW = +px || CONFIG.DISABLE_ON_WIDTH_BELOW; };
  window.SilverstoneHeroCinematic.setHeaderVarName = function (name) { if (typeof name === "string" && name.trim()) CONFIG.HEADER_VAR_NAME = name.trim(); };
  window.SilverstoneHeroCinematic.setEasingBezier = function (x1, y1, x2, y2) {
    var p = [x1, y1, x2, y2].map(function(n){ return +n; });
    if (p.every(function(n){ return typeof n === "number" && !isNaN(n); })) {
      CONFIG.EASING = p;
      easingFn = BezierEasing.apply(null, p);
    }
  };
  window.SilverstoneHeroCinematic.config = CONFIG;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function headerEl() {
    return document.querySelector("header.site-header");
  }

  function headerVisible() {
    var h = headerEl();
    return !!(h && !h.classList.contains("header-hidden"));
  }

  function getHeaderHeightPx() {
    var root = document.documentElement;
    var val = getComputedStyle(root).getPropertyValue(CONFIG.HEADER_VAR_NAME).trim();
    var px = parseFloat(val);
    if (!isNaN(px) && px > 0) return px;
    var h = headerEl();
    return h ? h.getBoundingClientRect().height : 0;
  }

  function getIndicatorHeightPx() {
    var el = document.getElementById("header-indicator");
    if (!el) return 0;
    var rect = el.getBoundingClientRect();
    var styles = getComputedStyle(el);
    var visible = styles.display !== "none" && styles.visibility !== "hidden" && rect.height > 0;
    return visible ? rect.height : 0;
  }

  function isOverlayOpen() {
    // existing overlay freezes body via position: fixed; also nav ul gets .open
    var navUl = document.querySelector("header.site-header nav ul");
    if (navUl && navUl.classList.contains("open")) return true;
    return (document.body && getComputedStyle(document.body).position === "fixed");
  }

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function computeGeometry(hero, nextSection) {
    var headerH = getHeaderHeightPx();
    var indicatorH = getIndicatorHeightPx();
    var topOffset = headerVisible() ? headerH : indicatorH;
    topOffset = topOffset || 0;

    var visibleHeight = window.innerHeight - topOffset;
    if (visibleHeight < 0) visibleHeight = 0;

    var nextTop = nextSection.getBoundingClientRect().top + window.scrollY;
    var bodyAlignY = Math.max(0, nextTop - topOffset);

    return { headerH: headerH, indicatorH: indicatorH, topOffset: topOffset, visibleHeight: visibleHeight, bodyAlignY: bodyAlignY };
  }

  function lockInput(lock) {
    var root = document.documentElement;
    if (!root._cineLockRefs) root._cineLockRefs = {};
    var handlerWheel = root._cineLockRefs.handlerWheel || function (e) { e.preventDefault(); };
    var handlerTouch = root._cineLockRefs.handlerTouch || function (e) { e.preventDefault(); };
    var handlerKey = root._cineLockRefs.handlerKey || function (e) {
      var k = e.key || e.code;
      if (k === "ArrowDown" || k === "ArrowUp" || k === "PageDown" || k === "PageUp" || k === "Home" || k === "End" || k === "Space" || k === " ") {
        e.preventDefault();
      }
    };
    root._cineLockRefs = { handlerWheel: handlerWheel, handlerTouch: handlerTouch, handlerKey: handlerKey };

    if (lock) {
      if (!root.classList.contains("cine-locked")) {
        root.classList.add("cine-locked");
        document.body && document.body.classList.add("cine-locked");
        window.addEventListener("wheel", handlerWheel, { passive: false });
        window.addEventListener("touchmove", handlerTouch, { passive: false });
        window.addEventListener("keydown", handlerKey, { passive: false });
      }
    } else {
      if (root.classList.contains("cine-locked")) {
        window.removeEventListener("wheel", handlerWheel);
        window.removeEventListener("touchmove", handlerTouch);
        window.removeEventListener("keydown", handlerKey);
        root.classList.remove("cine-locked");
        document.body && document.body.classList.remove("cine-locked");
      }
    }
  }

  function init() {
    if (CONFIG.DISABLE_ON_WIDTH_BELOW && window.innerWidth < CONFIG.DISABLE_ON_WIDTH_BELOW) return;
    var hero = document.querySelector(".hero.title-band");
    if (!hero) return;
    var next = hero.nextElementSibling;
    if (!next) return;

    // Insert a non-intrusive fx-layer if missing
    if (!hero.querySelector(".fx-layer")) {
      var layer = document.createElement("div");
      layer.className = "fx-layer";
      layer.setAttribute("aria-hidden", "true");
      hero.insertBefore(layer, hero.firstChild);
    }

    // Ensure hero height fills the visible viewport beneath header/indicator
    function sizeHero() {
      var g = computeGeometry(hero, next);
      hero.style.minHeight = g.visibleHeight + "px";
    }
    sizeHero();

    var isAnimating = false;
    var lastScrollY = window.scrollY;

    function setProgress(p) {
      hero.style.setProperty("--heroProgress", String(clamp(p, 0, 1)));
    }

    function animateScrollTo(targetY, direction) {
      isAnimating = true;
      lockInput(true);

      var startY = window.scrollY;
      var delta = targetY - startY;
      var startTime = performance.now();
      var dur = CONFIG.DURATION_MS;

      function tick(now) {
        // Abort if overlay opens mid-flight
        if (isOverlayOpen()) {
          isAnimating = false;
          lockInput(false);
          return;
        }

        var t = (now - startTime) / dur;
        t = clamp(t, 0, 1);
        var e = easingFn(t);
        var y = startY + delta * e;
        window.scrollTo(0, y);

        var progress = (direction === "down") ? e : (1 - e);
        setProgress(progress);

        if (t < 1 && isAnimating) {
          requestAnimationFrame(tick);
        } else {
          window.scrollTo(0, targetY);
          setProgress(direction === "down" ? 1 : 0);
          isAnimating = false;
          lockInput(false);
        }
      }
      requestAnimationFrame(tick);
    }

    function snapTo(y, progress) {
      window.scrollTo({ top: y, behavior: "auto" });
      setProgress(progress);
    }

    function tryDown() {
      if (isAnimating || isOverlayOpen()) return;
      var g = computeGeometry(hero, next);
      if (prefersReducedMotion()) {
        snapTo(g.bodyAlignY, 1);
        return;
      }
      animateScrollTo(g.bodyAlignY, "down");
    }

    function tryUp() {
      if (isAnimating || isOverlayOpen()) return;
      if (prefersReducedMotion()) {
        snapTo(0, 0);
        return;
      }
      animateScrollTo(0, "up");
    }

    // Input gateways
    function onWheel(e) {
      if (isAnimating || isOverlayOpen()) return;
      var dy = e.deltaY;
      var g = computeGeometry(hero, next);
      var sy = window.scrollY;

      // Downward while hero region is active
      if (dy > 0 && sy < g.bodyAlignY - CONFIG.BOUNDARY_THRESHOLD_PX) {
        e.preventDefault();
        tryDown();
      }
      // Upward near boundary to re-enter hero
      else if (dy < 0 && sy <= g.bodyAlignY + CONFIG.BOUNDARY_THRESHOLD_PX) {
        e.preventDefault();
        tryUp();
      }
    }

    var touchStartY = null;
    function onTouchStart(e) {
      if (isAnimating) return;
      var t = e.touches && e.touches[0] || e;
      touchStartY = t.clientY;
    }
    function onTouchMove(e) {
      if (isAnimating || isOverlayOpen() || touchStartY == null) return;
      var t = e.touches && e.touches[0] || e;
      var dy = touchStartY - t.clientY; // >0 means swipe up (scroll down)
      var g = computeGeometry(hero, next);
      var sy = window.scrollY;
      if (dy > 8 && sy < g.bodyAlignY - CONFIG.BOUNDARY_THRESHOLD_PX) {
        e.preventDefault();
        tryDown();
      } else if (dy < -8 && sy <= g.bodyAlignY + CONFIG.BOUNDARY_THRESHOLD_PX) {
        e.preventDefault();
        tryUp();
      }
    }
    function onTouchEnd() { touchStartY = null; }

    function onKeyDown(e) {
      if (isAnimating || isOverlayOpen()) return;
      var k = e.key || e.code;
      var g = computeGeometry(hero, next);
      var sy = window.scrollY;
      var keysDown = ["ArrowDown", "PageDown", "Space", " "];
      var keysUp = ["ArrowUp", "PageUp", "Home"];

      if (keysDown.indexOf(k) !== -1 && sy < g.bodyAlignY - CONFIG.BOUNDARY_THRESHOLD_PX) {
        e.preventDefault();
        tryDown();
      } else if (keysUp.indexOf(k) !== -1 && sy <= g.bodyAlignY + CONFIG.BOUNDARY_THRESHOLD_PX) {
        e.preventDefault();
        tryUp();
      }
    }

    function onScroll() {
      if (isAnimating || isOverlayOpen()) { lastScrollY = window.scrollY; return; }
      var g = computeGeometry(hero, next);
      var sy = window.scrollY;
      var dir = sy - lastScrollY;
      lastScrollY = sy;
      // Capture scrollbar drags / trackpad momentum
      if (dir > 0 && sy < g.bodyAlignY - CONFIG.BOUNDARY_THRESHOLD_PX) {
        tryDown();
      } else if (dir < 0 && sy <= g.bodyAlignY + CONFIG.BOUNDARY_THRESHOLD_PX) {
        tryUp();
      }
    }

    // Initial sync
    (function initState() {
      var g = computeGeometry(hero, next);
      // If loaded below the fold (e.g., via anchor), set progress accordingly
      setProgress(window.scrollY >= g.bodyAlignY ? 1 : 0);
    })();

    // Bind
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sizeHero, { passive: true });
    window.addEventListener("orientationchange", sizeHero, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
