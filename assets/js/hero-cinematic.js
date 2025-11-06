/*! assets/js/hero-cinematic.js — v3 (hybrid, premium, controlled)
 * - Hybrid: depth camera push (predominant) + tasteful letterbox + bloom + body veil
 * - Plays on every crossing (hero↔body), locks input during timeline
 * - Honors header/indicator heights; safe with parallax (transforms only inner layers)
 * - Reduced-motion: instant snap; no bars/bloom/veil
 */
(function(){
  "use strict";

  var CONFIG = {
    DURATION_MS: 2100,              // slower & premium
    HEADER_VAR_NAME: "--headerH",
    BOUNDARY_THRESHOLD_PX: 28,
    DISABLE_ON_WIDTH_BELOW: 0,      // set to >= 640 to disable on very small screens
    EASING: [0.16, 0.84, 0.22, 1.00] // controlled ease-in-out
  };

  // Bezier (gre/bezier-easing MIT, inlined)
  function BezierEasing(mX1, mY1, mX2, mY2){
    var NEWTON_ITERATIONS=4, NEWTON_MIN_SLOPE=.001, SUBDIVISION_PRECISION=1e-7, SUBDIVISION_MAX_ITERATIONS=10;
    var kSplineTableSize=11, kSampleStepSize=1/(kSplineTableSize-1), float32ArraySupported=typeof Float32Array==="function";
    function A(a1,a2){return 1-3*a2+3*a1} function B(a1,a2){return 3*a2-6*a1} function C(a1){return 3*a1}
    function calc(t,a1,a2){return ((A(a1,a2)*t+B(a1,a2))*t+C(a1))*t} function slope(t,a1,a2){return 3*A(a1,a2)*t*t+2*B(a1,a2)*t+C(a1)}
    function binarySubdivide(x,a,b,mX1,mX2){var curX,curT,i=0;do{curT=a+(b-a)/2;curX=calc(curT,mX1,mX2)-x;if(curX>0)b=curT;else a=curT}while(Math.abs(curX)>SUBDIVISION_PRECISION&&++i<SUBDIVISION_MAX_ITERATIONS);return curT}
    function newtonIterate(x,guessT,mX1,mX2){for(var i=0;i<NEWTON_ITERATIONS;++i){var curSlope=slope(guessT,mX1,mX2);if(curSlope===0)return guessT;var curX=calc(guessT,mX1,mX2)-x;guessT-=curX/curSlope}return guessT}
    if(!(0<=mX1&&mX1<=1&&0<=mX2&&mX2<=1))throw new Error("bezier x values must be in [0,1]");
    var sampleValues=float32ArraySupported?new Float32Array(kSplineTableSize):new Array(kSplineTableSize);
    for(var i=0;i<kSplineTableSize;++i) sampleValues[i]=calc(i*kSampleStepSize,mX1,mX2);
    function getTForX(x){var intervalStart=0,currentSample=1,lastSample=kSplineTableSize-1;for(;currentSample!==lastSample&&sampleValues[currentSample]<=x;++currentSample){intervalStart+=kSampleStepSize}--currentSample;var dist=(x-sampleValues[currentSample])/(sampleValues[currentSample+1]-sampleValues[currentSample]);var guess=intervalStart+dist*kSampleStepSize;var initialSlope=slope(guess,mX1,mX2);if(initialSlope>=NEWTON_MIN_SLOPE)return newtonIterate(x,guess,mX1,mX2);else if(initialSlope===0)return guess;else return binarySubdivide(x,intervalStart,intervalStart+kSampleStepSize,mX1,mX2)}
    return function(x){if(mX1===mY1&&mX2===mY2) return x; if(x===0||x===1) return x; return calc(getTForX(x),mY1,mY2)};
  }
  var easingFn = BezierEasing.apply(null, CONFIG.EASING);

  // Public tuning API
  window.SilverstoneHeroCinematic = window.SilverstoneHeroCinematic || {};
  window.SilverstoneHeroCinematic.setDuration       = function(ms){ CONFIG.DURATION_MS = +ms || CONFIG.DURATION_MS; };
  window.SilverstoneHeroCinematic.setThreshold      = function(px){ CONFIG.BOUNDARY_THRESHOLD_PX = +px || CONFIG.BOUNDARY_THRESHOLD_PX; };
  window.SilverstoneHeroCinematic.setDisableBelow   = function(px){ CONFIG.DISABLE_ON_WIDTH_BELOW = +px || CONFIG.DISABLE_ON_WIDTH_BELOW; };
  window.SilverstoneHeroCinematic.setHeaderVarName  = function(name){ if(typeof name==="string" && name.trim()) CONFIG.HEADER_VAR_NAME = name.trim(); };
  window.SilverstoneHeroCinematic.setEasingBezier   = function(x1,y1,x2,y2){
    var p=[x1,y1,x2,y2].map(function(n){return +n;});
    if(p.every(function(n){return typeof n==="number" && !isNaN(n);})){ CONFIG.EASING=p; easingFn=BezierEasing.apply(null,p); }
  };
  window.SilverstoneHeroCinematic.config = CONFIG;

  // Utilities
  function prefersReducedMotion(){ return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function headerEl(){ return document.querySelector("header.site-header"); }
  function headerVisible(){ var h=headerEl(); return !!(h && !h.classList.contains("header-hidden")); }
  function clamp(v,min,max){ return Math.min(max, Math.max(min, v)); }

  function getHeaderHeightPx(){
    var root=document.documentElement;
    var val=getComputedStyle(root).getPropertyValue(CONFIG.HEADER_VAR_NAME).trim();
    var px=parseFloat(val);
    if(!isNaN(px) && px>0) return px;
    var h=headerEl();
    return h ? h.getBoundingClientRect().height : 0;
  }
  function getIndicatorHeightPx(){
    var el=document.getElementById("header-indicator");
    if(!el) return 0;
    var rect=el.getBoundingClientRect();
    var styles=getComputedStyle(el);
    var visible=styles.display!=="none" && styles.visibility!=="hidden" && rect.height>0;
    return visible ? rect.height : 0;
  }
  function isOverlayOpen(){
    var navUl=document.querySelector("header.site-header nav ul");
    if(navUl && navUl.classList.contains("open")) return true;
    return (document.body && getComputedStyle(document.body).position==="fixed");
  }
  function computeGeometry(hero, nextSection){
    var headerH=getHeaderHeightPx();
    var indicatorH=getIndicatorHeightPx();
    var topOffset=headerVisible()? headerH : indicatorH;
    topOffset = topOffset || 0;
    var visibleHeight = window.innerHeight - topOffset;
    if(visibleHeight<0) visibleHeight=0;
    var nextTop = nextSection.getBoundingClientRect().top + window.scrollY;
    var bodyAlignY = Math.max(0, nextTop - topOffset);
    return { headerH, indicatorH, topOffset, visibleHeight, bodyAlignY };
  }

  // Input lock (wheel/touch/keys)
  function lockInput(lock){
    var root=document.documentElement;
    if(!root._cineLockRefs) root._cineLockRefs = {};
    var onWheel = root._cineLockRefs.onWheel || function(e){ e.preventDefault(); };
    var onTouch = root._cineLockRefs.onTouch || function(e){ e.preventDefault(); };
    var onKey   = root._cineLockRefs.onKey   || function(e){
      var k=e.key||e.code;
      if(k==="ArrowDown"||k==="ArrowUp"||k==="PageDown"||k==="PageUp"||k==="Home"||k==="End"||k==="Space"||k===" "){ e.preventDefault(); }
    };
    root._cineLockRefs = { onWheel, onTouch, onKey };
    if(lock){
      if(!root.classList.contains("cine-locked")){
        root.classList.add("cine-locked");
        document.body && document.body.classList.add("cine-locked");
        window.addEventListener("wheel", onWheel, {passive:false});
        window.addEventListener("touchmove", onTouch, {passive:false});
        window.addEventListener("keydown", onKey, {passive:false});
      }
    } else {
      if(root.classList.contains("cine-locked")){
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchmove", onTouch);
        window.removeEventListener("keydown", onKey);
        root.classList.remove("cine-locked");
        document.body && document.body.classList.remove("cine-locked");
      }
    }
  }

  // Bars root element (viewport-anchored)
  function ensureBars(){
    if(document.querySelector(".fx-bars")) return;
    var bars=document.createElement("div");
    bars.className="fx-bars";
    bars.innerHTML='<div class="bar top"></div><div class="bar bottom"></div>';
    document.body.appendChild(bars);
  }

  function init(){
    if(CONFIG.DISABLE_ON_WIDTH_BELOW && window.innerWidth < CONFIG.DISABLE_ON_WIDTH_BELOW) return;
    var hero=document.querySelector(".hero.title-band");
    if(!hero) return;
    var next=hero.nextElementSibling;
    if(!next) return;

    // Insert hero overlays if missing
    if(!hero.querySelector(".fx-layer")){
      var layer=document.createElement("div");
      layer.className="fx-layer";
      layer.setAttribute("aria-hidden","true");
      hero.insertBefore(layer, hero.firstChild);
    }
    if(!hero.querySelector(".fx-bloom")){
      var bloom=document.createElement("div");
      bloom.className="fx-bloom";
      bloom.setAttribute("aria-hidden","true");
      hero.appendChild(bloom);
    }

    ensureBars();

    // Insert body veil on first section after hero (no transforms on the section itself)
    if(!next.querySelector(".fx-veil")){
      var cs=getComputedStyle(next);
      if(cs.position === "static"){ next.style.position = "relative"; } // safe
      var veil=document.createElement("div");
      veil.className="fx-veil";
      veil.setAttribute("aria-hidden","true");
      next.insertBefore(veil, next.firstChild);
    }

    function sizeHero(){
      var g=computeGeometry(hero,next);
      hero.style.minHeight = g.visibleHeight + "px";
    }
    sizeHero();

    var isAnimating=false, lastScrollY=window.scrollY;
    function setProgress(p){ hero.style.setProperty("--heroProgress", String(clamp(p,0,1))); }
    function setBars(v){ document.documentElement.style.setProperty("--cineBars", String(clamp(v,0,1))); }
    function setBloom(v){ document.documentElement.style.setProperty("--cineBloom", String(clamp(v,0,1))); }
    function setVeil(v){ document.documentElement.style.setProperty("--cineVeil", String(clamp(v,0,1))); }

    function animateScrollTo(targetY, direction){
      isAnimating=true; lockInput(true);
      var startY=window.scrollY, delta=targetY-startY;
      var startTime=performance.now(), dur=CONFIG.DURATION_MS;

      function tick(now){
        if(isOverlayOpen()){ isAnimating=false; lockInput(false); setBars(0); setBloom(0); setVeil(0); return; }
        var t=(now-startTime)/dur; t=clamp(t,0,1);
        var e=easingFn(t);
        var y=startY + delta*e;
        window.scrollTo(0, y);

        // Hero progress
        var progress = (direction==="down") ? e : (1-e);
        setProgress(progress);

        // Letterbox envelope: 0→1→0
        var bars = Math.sin(Math.PI * e);
        setBars(bars);

        // Bloom: bell curve (peaks near mid), gentle amplitude
        var bloom = Math.pow(Math.sin(Math.PI * e), 1.35) * 0.55;
        setBloom(bloom);

        // Veil over next section: down = 0.35→0, up = 0→0.35
        var veil = (direction==="down") ? (0.35 * (1 - e)) : (0.35 * e);
        setVeil(veil);

        if(t<1 && isAnimating){
          requestAnimationFrame(tick);
        } else {
          window.scrollTo(0, targetY);
          setProgress(direction==="down" ? 1 : 0);
          setBars(0);
          setBloom(0);
          setVeil(direction==="down" ? 0 : 0.35); // small hold when parking on hero
          isAnimating=false; lockInput(false);
        }
      }
      requestAnimationFrame(tick);
    }

    function snapTo(y, progress){
      window.scrollTo({top:y, behavior:"auto"});
      setProgress(progress);
      setBars(0); setBloom(0); setVeil(progress===1 ? 0 : 0.35);
    }

    function tryDown(){
      if(isAnimating || isOverlayOpen()) return;
      var g=computeGeometry(hero,next);
      if(prefersReducedMotion()){ snapTo(g.bodyAlignY, 1); return; }
      animateScrollTo(g.bodyAlignY, "down");
    }
    function tryUp(){
      if(isAnimating || isOverlayOpen()) return;
      if(prefersReducedMotion()){ snapTo(0, 0); return; }
      animateScrollTo(0, "up");
    }

    // Input gateways
    function onWheel(e){
      if(isAnimating || isOverlayOpen()) return;
      var dy=e.deltaY, g=computeGeometry(hero,next), sy=window.scrollY;
      if(dy>0 && sy < g.bodyAlignY - CONFIG.BOUNDARY_THRESHOLD_PX){ e.preventDefault(); tryDown(); }
      else if(dy<0 && sy <= g.bodyAlignY + CONFIG.BOUNDARY_THRESHOLD_PX){ e.preventDefault(); tryUp(); }
    }
    var touchStartY=null;
    function onTouchStart(e){ if(isAnimating) return; var t=e.touches&&e.touches[0]||e; touchStartY=t.clientY; }
    function onTouchMove(e){
      if(isAnimating || isOverlayOpen() || touchStartY==null) return;
      var t=e.touches&&e.touches[0]||e, dy=touchStartY - t.clientY;
      var g=computeGeometry(hero,next), sy=window.scrollY;
      if(dy>8 && sy < g.bodyAlignY - CONFIG.BOUNDARY_THRESHOLD_PX){ e.preventDefault(); tryDown(); }
      else if(dy<-8 && sy <= g.bodyAlignY + CONFIG.BOUNDARY_THRESHOLD_PX){ e.preventDefault(); tryUp(); }
    }
    function onTouchEnd(){ touchStartY=null; }
    function onKeyDown(e){
      if(isAnimating || isOverlayOpen()) return;
      var k=e.key||e.code, g=computeGeometry(hero,next), sy=window.scrollY;
      var keysDown=["ArrowDown","PageDown","Space"," "], keysUp=["ArrowUp","PageUp","Home"];
      if(keysDown.indexOf(k)!==-1 && sy < g.bodyAlignY - CONFIG.BOUNDARY_THRESHOLD_PX){ e.preventDefault(); tryDown(); }
      else if(keysUp.indexOf(k)!==-1 && sy <= g.bodyAlignY + CONFIG.BOUNDARY_THRESHOLD_PX){ e.preventDefault(); tryUp(); }
    }
    function onScroll(){
      if(isAnimating || isOverlayOpen()){ lastScrollY=window.scrollY; return; }
      var g=computeGeometry(hero,next), sy=window.scrollY, dir=sy-lastScrollY; lastScrollY=sy;
      if(dir>0 && sy < g.bodyAlignY - CONFIG.BOUNDARY_THRESHOLD_PX) tryDown();
      else if(dir<0 && sy <= g.bodyAlignY + CONFIG.BOUNDARY_THRESHOLD_PX) tryUp();
    }

    // Initial sync
    (function(){
      var g=computeGeometry(hero,next);
      var past = window.scrollY >= g.bodyAlignY;
      setProgress(past ? 1 : 0);
      setBars(0); setBloom(0); setVeil(past ? 0 : 0.35);
    })();

    // Bind
    window.addEventListener("wheel", onWheel, {passive:false});
    window.addEventListener("touchstart", onTouchStart, {passive:true});
    window.addEventListener("touchmove", onTouchMove, {passive:false});
    window.addEventListener("touchend", onTouchEnd, {passive:true});
    window.addEventListener("keydown", onKeyDown, {passive:false});
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", sizeHero, {passive:true});
    window.addEventListener("orientationchange", sizeHero, {passive:true});
  }

  if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded", init); }
  else { init(); }
})();
