
/*! Hero Snap Scroll (GSAP Observer) — minimal, non-intrusive
   - Adds a smooth, single-step scroll transition between the first
     `.hero` section and the immediately following `<section>`.
   - No layout/styles/images are changed.
   - Works on wheel, trackpad, and touch.
   - Does nothing if GSAP isn't available.
*/
(function(){
  var onReady = function(fn){
    if(document.readyState === "loading"){ document.addEventListener("DOMContentLoaded", fn); }
    else { fn(); }
  };

  onReady(function(){
    var hero = document.querySelector("section.hero");
    if(!hero) return;
    var second = hero.nextElementSibling;
    while(second && second.tagName && second.tagName.toLowerCase() !== "section"){
      second = second.nextElementSibling;
    }
    if(!second) return;

    // Guard: don't run twice
    if(window.__heroSnapInit) return;
    window.__heroSnapInit = true;

    // Bail gracefully if GSAP is missing
    if(typeof window.gsap === "undefined" || !window.gsap) return;

    // Optional: register plugins if present
    if(window.ScrollToPlugin){ gsap.registerPlugin(ScrollToPlugin); }
    if(window.Observer){ gsap.registerPlugin(Observer); }

    var isAnimating = false;
    var dur = 0.8;

    function scrollToEl(el){
      if(isAnimating) return;
      isAnimating = true;
      var y = el.getBoundingClientRect().top + window.pageYOffset;
      // prefer ScrollToPlugin if available
      if(window.ScrollToPlugin){
        gsap.to(window, { duration: dur, scrollTo: { y: y, autoKill: true }, ease: "power2.out", onComplete: function(){ isAnimating=false; }});
      } else {
        gsap.to({pos: window.pageYOffset}, {pos: y, duration: dur, ease: "power2.out", onUpdate: function(){
          window.scrollTo(0, this.targets()[0].pos);
        }, onComplete: function(){ isAnimating=false; }});
      }
    }

    // Helper to know where we are
    function atHeroTop(){
      return window.pageYOffset < hero.offsetHeight * 0.5;
    }
    function nearSecondTop(){
      var rect = second.getBoundingClientRect();
      return rect.top > -hero.offsetHeight*0.25 && rect.top < hero.offsetHeight*0.5;
    }

    // If Observer exists, use it for robust input capture
    if(window.Observer){
      Observer.create({
        target: window, // window-level
        type: "wheel,touch,pointer",
        // Only intercept when user is within hero (top half) or near second's top
        onChangeY: function(self){
          if(isAnimating) return;
          var delta = self.deltaY;
          if(delta > 0 && atHeroTop()){
            // scrolling down from hero -> snap to second
            scrollToEl(second);
          } else if(delta < 0 && nearSecondTop()){
            // scrolling up near second's start -> snap back to hero
            scrollToEl(hero);
          }
        },
        tolerance: 8,
        preventDefault: false, // don't block native scrolling in general
        // only active for large screens / normal flow
        onEnable: function(){ /* noop */ }
      });
    } else {
      // Fallback: minimal wheel/touch handler without preventing defaults
      var touchStartY = 0;
      window.addEventListener("wheel", function(e){
        if(isAnimating) return;
        if(e.deltaY > 0 && atHeroTop()){
          scrollToEl(second);
        } else if(e.deltaY < 0 && nearSecondTop()){
          scrollToEl(hero);
        }
      }, {passive:true});

      window.addEventListener("touchstart", function(e){
        if(e.touches && e.touches.length){ touchStartY = e.touches[0].clientY; }
      }, {passive:true});
      window.addEventListener("touchmove", function(e){
        if(isAnimating) return;
        if(!e.touches || !e.touches.length) return;
        var dy = touchStartY - e.touches[0].clientY;
        if(dy > 12 && atHeroTop()){
          scrollToEl(second);
        } else if(dy < -12 && nearSecondTop()){
          scrollToEl(hero);
        }
      }, {passive:true});
    }
  });
})();
