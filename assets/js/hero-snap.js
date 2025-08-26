
/*! Hero⇄Second snap (GSAP + Observer)
    - Non-destructive: no DOM, CSS, or layout changes.
    - Runs on all pages that have a `.hero` followed by a `<section>`.
    - Only "grabs" wheel/touch while the viewport is inside the hero or near the second section's top.
*/
(function(){
  var onReady = function(fn){
    if(document.readyState === "loading"){ document.addEventListener("DOMContentLoaded", fn); }
    else { fn(); }
  };

  onReady(function(){
    var hero = document.querySelector("section.hero");
    if(!hero) return;

    // find the next <section> sibling
    var second = hero.nextElementSibling;
    while(second && (second.nodeType !== 1 || second.tagName.toLowerCase() !== "section")){
      second = second.nextElementSibling;
    }
    if(!second) return;

    if(window.__heroSnapInit) return;
    window.__heroSnapInit = true;

    // require gsap
    if(typeof window.gsap === "undefined"){ return; }
    if(window.ScrollToPlugin){ gsap.registerPlugin(ScrollToPlugin); }
    if(window.Observer){ gsap.registerPlugin(Observer); }

    var state = { animating:false, heroTop:0, heroH:0, secondTop:0 };

    function refresh(){
      state.heroTop = hero.getBoundingClientRect().top + window.pageYOffset;
      state.heroH = hero.offsetHeight || window.innerHeight;
      state.secondTop = second.getBoundingClientRect().top + window.pageYOffset;
    }
    refresh();

    function inControlZone(){
      var y = window.pageYOffset;
      // While we're within the hero, or within 40% of hero height above the second section
      return (y <= state.heroTop + state.heroH * 0.9) || (y < state.secondTop + state.heroH * 0.4);
    }
    function atOrAboveHeroTop(){
      return window.pageYOffset <= state.heroTop + 10;
    }
    function nearSecondTop(){
      var y = window.pageYOffset;
      return (y >= state.secondTop - state.heroH * 0.4) && (y <= state.secondTop + state.heroH * 0.4);
    }
    function scrollToY(y){
      if(state.animating) return;
      state.animating = true;
      var opts = { duration: 0.9, ease: "power2.out", onComplete: function(){ state.animating=false; }};
      if(window.ScrollToPlugin){
        opts.scrollTo = { y:y, autoKill:true };
        gsap.to(window, opts);
      } else {
        var t = { p: window.pageYOffset };
        gsap.to(t, { p: y, duration: opts.duration, ease: opts.ease, onUpdate: function(){ window.scrollTo(0, t.p); }, onComplete: opts.onComplete });
      }
    }
    function snapDown(){ scrollToY(state.secondTop); }
    function snapUp(){ scrollToY(state.heroTop); }

    // Observer that is only enabled while in hero/second band
    var obs = null;
    function ensureObserver(){
      if(!window.Observer){
        // fallback listeners (no preventDefault) always attached
        return;
      }
      if(!obs){
        obs = Observer.create({
          target: window,
          type: "wheel,touch,pointer",
          wheelSpeed: 1,
          preventDefault: true,   // only while enabled (see toggleObserver)
          allowClicks: true,
          onChangeY: function(self){
            if(state.animating) return;
            var dy = self.deltaY;
            if(dy > 0 && inControlZone() && atOrAboveHeroTop()){
              snapDown();
            } else if(dy < 0 && inControlZone() && nearSecondTop()){
              snapUp();
            }
          }
        });
        obs.disable();
      }
    }
    ensureObserver();

    function toggleObserver(){
      if(!obs) return;
      if(inControlZone() && !state.animating){
        obs.enable();
      } else {
        obs.disable();
      }
    }

    // Fallback listeners (in case Observer plugin isn't available)
    if(!window.Observer){
      window.addEventListener("wheel", function(e){
        if(state.animating) return;
        if(e.deltaY > 0 && inControlZone() && atOrAboveHeroTop()){
          snapDown();
        } else if(e.deltaY < 0 && inControlZone() && nearSecondTop()){
          snapUp();
        }
      }, { passive:true });
      window.addEventListener("touchstart", function(e){
        state._touchY = (e.touches && e.touches.length) ? e.touches[0].clientY : 0;
      }, { passive:true });
      window.addEventListener("touchmove", function(e){
        if(state.animating || !state._touchY) return;
        var dy = state._touchY - e.touches[0].clientY;
        if(dy > 12 && inControlZone() && atOrAboveHeroTop()){
          snapDown();
        } else if(dy < -12 && inControlZone() && nearSecondTop()){
          snapUp();
        }
      }, { passive:true });
    }

    // Keyboard support
    window.addEventListener("keydown", function(e){
      if(state.animating) return;
      var key = e.key;
      if(!inControlZone()) return;
      if((key === "PageDown" || key === " " || key === "ArrowDown") && atOrAboveHeroTop()){
        e.preventDefault();
        snapDown();
      } else if((key === "PageUp" || key === "ArrowUp") && nearSecondTop()){
        e.preventDefault();
        snapUp();
      }
    });

    // Keep measurements fresh
    window.addEventListener("resize", function(){ refresh(); toggleObserver(); }, { passive:true });
    window.addEventListener("scroll", function(){ toggleObserver(); }, { passive:true });
    if(window.visualViewport){ window.visualViewport.addEventListener("resize", function(){ refresh(); toggleObserver(); }); }

    // initial toggle
    toggleObserver();
  });
})();
