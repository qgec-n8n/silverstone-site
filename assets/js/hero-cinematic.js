/*! assets/js/hero-cinematic.js — v5 (High-Cinematic, scroll-triggered both directions)
 * - Movie-trailer style cinematic scroll transition both ways
 * - Input locked during transitions; overlay-safe; parallax-safe
 */
(function(){
  "use strict";
  var CONFIG={DURATION_MS:2400,HEADER_VAR_NAME:"--headerH",BOUNDARY_THRESHOLD_PX:28,DISABLE_ON_WIDTH_BELOW:0,EASING:[0.17,0.85,0.25,1.0]};

  function BezierEasing(x1,y1,x2,y2){function A(a1,a2){return 1-3*a2+3*a1}function B(a1,a2){return 3*a2-6*a1}function C(a1){return 3*a1}
    function calc(t,a1,a2){return ((A(a1,a2)*t+B(a1,a2))*t+C(a1))*t}function slope(t,a1,a2){return 3*A(a1,a2)*t*t+2*B(a1,a2)*t+C(a1)}
    var SIZE=11,STEP=1/(SIZE-1),arr=new Float32Array(SIZE);for(var i=0;i<SIZE;++i)arr[i]=calc(i*STEP,x1,x2);
    function getT(x){var start=0,i=1;while(i<SIZE-1&&arr[i]<=x){start+=STEP;++i}--i;
      var dist=(x-arr[i])/(arr[i+1]-arr[i]),guess=start+dist*STEP,s=slope(guess,x1,x2);if(s>=.001){for(var j=0;j<4;++j){var c=calc(guess,x1,x2)-x;guess-=c/slope(guess,x1,x2);}return guess;}return guess;}
    return function(x){if(x1===y1&&x2===y2)return x;if(x===0||x===1)return x;return calc(getT(x),y1,y2)};}
  var ease=BezierEasing.apply(null,CONFIG.EASING);
  function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
  function setVar(name,value){var min=arguments.length>2?arguments[2]:0,max=arguments.length>3?arguments[3]:1;document.documentElement.style.setProperty(name,String(clamp(value,min,max)));}
  function header(){return document.querySelector("header.site-header");}
  function headerVisible(){var h=header();return !!(h&&!h.classList.contains("header-hidden"));}
  function getHeaderH(){var r=document.documentElement,v=parseFloat(getComputedStyle(r).getPropertyValue(CONFIG.HEADER_VAR_NAME));return !isNaN(v)&&v>0?v:(header()?header().getBoundingClientRect().height:0);}
  function getIndicatorH(){var el=document.getElementById("header-indicator");if(!el)return 0;var r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=="none"&&s.visibility!=="hidden"?r.height:0;}
  function isOverlayOpen(){var n=document.querySelector("header.site-header nav ul");if(n&&n.classList.contains("open"))return true;return getComputedStyle(document.body).position==="fixed";}
  function geo(hero,next){
    var h=getHeaderH(),ind=getIndicatorH();
    var off=headerVisible()?h:ind,visH=window.innerHeight-off;
    var nextTop=next.getBoundingClientRect().top+window.scrollY;
    // Update CSS variable for hero offset on mobile.  This helps the
    // sticky background pseudo‑elements align perfectly with the end of
    // the hero.  We only apply this adjustment on screens up to 768px
    // since desktop uses a different parallax technique.  The fallback
    // is harmless if the variable is never referenced.
    try {
      // Centralised breakpoint check – matches the constant used in script.js.
      var MOBILE_BREAKPOINT = 768;
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        document.documentElement.style.setProperty('--heroOffset', off + 'px');
      }
    } catch (e) {
      /* no-op */
    }
    return { off: off, visH: visH, bodyY: Math.max(0, nextTop - off) };
  }
  function lock(l){var r=document.documentElement;if(!r._locks)r._locks={};var w=r._locks.w||function(e){e.preventDefault();},t=r._locks.t||function(e){e.preventDefault();},k=r._locks.k||function(e){if(["ArrowDown","ArrowUp","PageDown","PageUp","Home","End"," ","Space"].includes(e.key))e.preventDefault();};r._locks={w,t,k};
    if(l&&!r.classList.contains("cine-locked")){r.classList.add("cine-locked");document.body.classList.add("cine-locked");
      window.addEventListener("wheel",w,{passive:false});window.addEventListener("touchmove",t,{passive:false});window.addEventListener("keydown",k,{passive:false});}
    else if(!l&&r.classList.contains("cine-locked")){window.removeEventListener("wheel",w);window.removeEventListener("touchmove",t);window.removeEventListener("keydown",k);
      r.classList.remove("cine-locked");document.body.classList.remove("cine-locked");}}
  function ensureBars(){var b=document.querySelector(".fx-bars");if(!b){b=document.createElement("div");b.className="fx-bars";
    b.innerHTML='<div class="bar top"></div><div class="bar bottom"></div><div class="flare"></div>';document.body.appendChild(b);}}
  function init(){
    if(CONFIG.DISABLE_ON_WIDTH_BELOW&&window.innerWidth<CONFIG.DISABLE_ON_WIDTH_BELOW)return;var hero=document.querySelector(".hero.title-band");if(!hero)return;var next=hero.nextElementSibling;if(!next)return;
    if(!hero.querySelector(".fx-layer")){var l=document.createElement("div");l.className="fx-layer";l.setAttribute("aria-hidden","true");hero.insertBefore(l,hero.firstChild);}
    if(!hero.querySelector(".fx-bloom")){var b=document.createElement("div");b.className="fx-bloom";b.setAttribute("aria-hidden","true");hero.appendChild(b);}
    ensureBars();
    if(!next.querySelector(".fx-veil")){
      if(getComputedStyle(next).position==="static")next.style.position="relative";
      var v=document.createElement("div");
      v.className="fx-veil";
      v.setAttribute("aria-hidden","true");
      next.insertBefore(v,next.firstChild);
    }
    if(!next.querySelector(".fx-intro")){
      var i=document.createElement("div");
      i.className="fx-intro";
      i.setAttribute("aria-hidden","true");
      i.innerHTML='<div class="pulse"></div><div class="spark"></div>';
      var anchor=next.querySelector(".fx-veil");
      if(anchor&&anchor.nextSibling)next.insertBefore(i,anchor.nextSibling);
      else if(anchor)next.appendChild(i);
      else if(next.firstChild)next.insertBefore(i,next.firstChild);
      else next.appendChild(i);
    }
    function sizeHero(){hero.style.minHeight=geo(hero,next).visH+"px";}sizeHero();
    var anim=false,lastY=window.scrollY;
    var DEPTH_DOWN_MAX=1.15;
    function animate(yTarget,dir){anim=true;lock(true);var y0=window.scrollY,delta=yTarget-y0,t0=performance.now(),dur=CONFIG.DURATION_MS;
      var depthFrom=dir==="down"?0:DEPTH_DOWN_MAX,depthTo=dir==="down"?DEPTH_DOWN_MAX:0;
      function tick(now){if(isOverlayOpen()){anim=false;lock(false);return;}var t=clamp((now-t0)/dur,0,1),e=ease(t),y=y0+delta*e;window.scrollTo(0,y);
        var progress=dir==="down"?e:1-e;hero.style.setProperty("--heroProgress",progress);
        var depth=depthFrom+(depthTo-depthFrom)*Math.pow(e,dir==="down"?0.88:1);hero.style.setProperty("--heroDepth",depth);
        var bars=Math.sin(Math.PI*t)**0.9;setVar("--cineBars",bars);
        var bloom=dir==="down"?0:Math.pow(Math.sin(Math.PI*t),1.35);setVar("--cineBloom",bloom);
        var beamBoost=dir==="down"?0:Math.pow(Math.sin(Math.PI*t),2.0);setVar("--cineBeamBoost",beamBoost);
        var veil=(dir==="down"?0.45*(1-e):0.45*e);setVar("--cineVeil",veil);
        if(dir==="down"){var introWave=Math.pow(Math.sin(Math.PI*Math.min(1,e||0)),1.12);setVar("--cineIntroDown",introWave);
          var introPulse=Math.pow(Math.sin(Math.PI*Math.min(1,e*0.92)),1.35);setVar("--cineIntroPulse",introPulse);
          var introShift=Math.cos((1-Math.min(1,e))*Math.PI);setVar("--cineIntroShift",introShift,-1,1);
        }else{setVar("--cineIntroDown",0);setVar("--cineIntroPulse",0);setVar("--cineIntroShift",-1,-1,1);}
        if(t<1&&anim)requestAnimationFrame(tick);else{window.scrollTo(0,yTarget);hero.style.setProperty("--heroProgress",dir==="down"?1:0);
          hero.style.setProperty("--heroDepth",depthTo);setVar("--cineBars",0);setVar("--cineBloom",0);setVar("--cineBeamBoost",0);
          setVar("--cineVeil",dir==="down"?0:0.45);setVar("--cineIntroDown",0);setVar("--cineIntroPulse",0);setVar("--cineIntroShift",-1,-1,1);
          anim=false;lock(false);}}
      requestAnimationFrame(tick);}
    function tryDown(){if(anim||isOverlayOpen())return;animate(geo(hero,next).bodyY,"down");}
    function tryUp(){if(anim||isOverlayOpen())return;animate(0,"up");}
    function onWheel(e){if(anim||isOverlayOpen())return;var dy=e.deltaY,g=geo(hero,next),sy=window.scrollY;
      if(dy>0&&sy<g.bodyY-CONFIG.BOUNDARY_THRESHOLD_PX){e.preventDefault();tryDown();}
      else if(dy<0&&sy<=g.bodyY+CONFIG.BOUNDARY_THRESHOLD_PX){e.preventDefault();tryUp();}}
    var tY=null;function tStart(e){if(anim)return;tY=e.touches?e.touches[0].clientY:e.clientY;}
    function tMove(e){if(anim||isOverlayOpen()||tY==null)return;var y=e.touches?e.touches[0].clientY:e.clientY,dy=tY-y,g=geo(hero,next),sy=window.scrollY;
      if(dy>8&&sy<g.bodyY-CONFIG.BOUNDARY_THRESHOLD_PX){e.preventDefault();tryDown();}
      else if(dy<-8&&sy<=g.bodyY+CONFIG.BOUNDARY_THRESHOLD_PX){e.preventDefault();tryUp();}}
    function tEnd(){tY=null;}
    function onKey(e){if(anim||isOverlayOpen())return;var g=geo(hero,next),sy=window.scrollY;
      if(["ArrowDown","PageDown","Space"," "].includes(e.key)&&sy<g.bodyY-CONFIG.BOUNDARY_THRESHOLD_PX){e.preventDefault();tryDown();}
      else if(["ArrowUp","PageUp","Home"].includes(e.key)&&sy<=g.bodyY+CONFIG.BOUNDARY_THRESHOLD_PX){e.preventDefault();tryUp();}}
    function onScroll(){if(anim||isOverlayOpen()){lastY=window.scrollY;return;}var g=geo(hero,next),sy=window.scrollY,dir=sy-lastY;lastY=sy;
      if(dir>0&&sy<g.bodyY-CONFIG.BOUNDARY_THRESHOLD_PX)tryDown();else if(dir<0&&sy<=g.bodyY+CONFIG.BOUNDARY_THRESHOLD_PX)tryUp();}
    (function initState(){var g=geo(hero,next),past=window.scrollY>=g.bodyY;hero.style.setProperty("--heroProgress",past?1:0);
      hero.style.setProperty("--heroDepth",past?DEPTH_DOWN_MAX:0);setVar("--cineBars",0);setVar("--cineBloom",0);setVar("--cineBeamBoost",0);
      setVar("--cineVeil",past?0:0.45);setVar("--cineIntroDown",0);setVar("--cineIntroPulse",0);setVar("--cineIntroShift",-1,-1,1);
    })();window.addEventListener("wheel",onWheel,{passive:false});
    window.addEventListener("touchstart",tStart,{passive:true});window.addEventListener("touchmove",tMove,{passive:false});
    window.addEventListener("touchend",tEnd,{passive:true});window.addEventListener("keydown",onKey,{passive:false});
    window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",sizeHero,{passive:true});}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
