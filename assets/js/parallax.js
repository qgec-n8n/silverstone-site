/*!
 * assets/js/parallax.js — Body-section parallax bootstrap
 * - Mobile: inserts a sticky background helper; sets a root flag to disable CSS fallback
 * - Desktop: pure CSS `background-attachment: fixed`
 * - Zero scroll listeners; work is offloaded to the compositor
 */
(function(){
  "use strict";

  var MOBILE_MAX = 768;

  function isMobile(){ return window.matchMedia("(max-width: "+MOBILE_MAX+"px)").matches; }

  function ensureParallaxBg(section){
    if(section.querySelector('.parallax-bg')) return;
    var bg = document.createElement('div');
    bg.className = 'parallax-bg';
    section.insertBefore(bg, section.firstChild);
  }

  function init(){
    var sections = document.querySelectorAll('.section.body-parallax');
    if(!sections.length) return;

    if(isMobile()){
      // Flag to disable the CSS pseudo-element fallback
      document.documentElement.setAttribute('data-parallax-mobile', '1');
      sections.forEach(ensureParallaxBg);
    } else {
      document.documentElement.removeAttribute('data-parallax-mobile');
    }
  }

  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }

  var media = window.matchMedia("(max-width: "+MOBILE_MAX+"px)");
  media.addEventListener ? media.addEventListener('change', init) : media.addListener(init);
})();