
/*! Hero⇄Second snap (GSAP + Observer) — v2.1
    Fix: narrow control zone & safer enable/disable so scrolling is never blocked outside the hero band.
*/
(function(){
  function onReady(fn){ (document.readyState === "loading") ? document.addEventListener("DOMContentLoaded", fn) : fn(); }

  onReady(function(){
    var hero = document.querySelector("section.hero");
    if(!hero) return;

    // find immediate next <section>
    var second = hero.nextElementSibling;
    while(second && (second.nodeType !== 1 || second.tagName.toLowerCase() !== "section")){
      second = second.nextElementSibling;
    }
    if(!second) return;

    if(window.__heroSnapInit) return;
    window.__heroSnapInit = true;

    if(typeof window.gsap === "undefined"){ return; }
    if(window.ScrollToPlugin){ gsap.registerPlugin(ScrollToPlugin); }
    if(window.Observer){ gsap.registerPlugin(Observer); }

    var S = { anim:false, heroTop:0, heroH:0, secondTop:0 };

    function refresh(){
      var heroRect = hero.getBoundingClientRect();
      var secRect = second.getBoundingClientRect();
      S.heroTop = heroRect.top + window.pageYOffset;
      S.heroH   = hero.offsetHeight || window.innerHeight;
      S.secondTop = secRect.top + window.pageYOffset;
    }
    function heroBottom(){ return S.heroTop + S.heroH; }

    // Control zone: only between top of hero and just before top of second (plus a tiny cushion)
    function inControlZone(){
      var y = window.pageYOffset;
      return y >= S.heroTop - 8 && y < (S.secondTop - 8);
    }
    function atOrAboveHeroTop(){ return window.pageYOffset <= S.heroTop + 8; }
    function nearSecondTop(){
      var y = window.pageYOffset;
      return Math.abs(y - S.secondTop) <= Math.max(24, Math.round(S.heroH * 0.04));
    }
    function toY(y){
      if(S.anim) return;
      S.anim = true;
      var opts = { duration: 0.7, ease: "power2.out", onComplete: function(){ S.anim=false; toggleObserver(); } };
      if(window.ScrollToPlugin){
        gsap.to(window, Object.assign(opts, { scrollTo: { y:y, autoKill:true } }));
      } else {
        var t = { p: window.pageYOffset };
        gsap.to(t, { p:y, duration:opts.duration, ease:opts.ease, onUpdate:function(){ window.scrollTo(0, t.p); }, onComplete:opts.onComplete });
      }
    }
    function snapDown(){ toY(S.secondTop); }
    function snapUp(){ toY(S.heroTop); }

    var obs = null;
    function ensureObserver(){
      if(!window.Observer) return;
      if(!obs){
        obs = Observer.create({
          target: window,
          type: "wheel,touch,pointer",
          wheelSpeed: 1,
          preventDefault: true, // ONLY while enabled
          allowClicks: true,
          onChangeY: function(self){
            if(S.anim) return;
            var dy = self.deltaY;
            if(!inControlZone()) { toggleObserver(); return; }
            if(dy > 0 && atOrAboveHeroTop()){
              snapDown();
            } else if(dy < 0 && nearSecondTop()){
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
      if(S.anim){ obs.enable(); return; } // keep control during animation
      if(inControlZone()){
        obs.enable();
      } else {
        obs.disable();
      }
    }

    // Fallback if Observer not available — passive so it never blocks scroll
    if(!window.Observer){
      var startY = 0;
      window.addEventListener("wheel", function(e){
        if(S.anim) return;
        if(!inControlZone()) return;
        if(e.deltaY > 0 && atOrAboveHeroTop()) snapDown();
        else if(e.deltaY < 0 && nearSecondTop()) snapUp();
      }, { passive:true });
      window.addEventListener("touchstart", function(e){ startY = (e.touches && e.touches[0]) ? e.touches[0].clientY : 0; }, { passive:true });
      window.addEventListener("touchmove", function(e){
        if(S.anim || !inControlZone()) return;
        var dy = startY - (e.touches && e.touches[0] ? e.touches[0].clientY : startY);
        if(dy > 12 && atOrAboveHeroTop()) snapDown();
        else if(dy < -12 && nearSecondTop()) snapUp();
      }, { passive:true });
    }

    window.addEventListener("resize", function(){ refresh(); toggleObserver(); }, { passive:true });
    window.addEventListener("scroll", function(){ toggleObserver(); }, { passive:true });
    if(window.visualViewport){ window.visualViewport.addEventListener("resize", function(){ refresh(); toggleObserver(); }); }

    refresh();
    toggleObserver();
  });
})();
