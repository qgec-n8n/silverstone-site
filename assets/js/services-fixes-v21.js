/* v21-edited (Innovation Gallery 4): normalize Data & Analytics heights and center images */
(function(){
  function isTwoCol(){ return window.innerWidth >= 980; }
  function mode(arr){
    var c={}, best=null, n=0;
    for (var i=0;i<arr.length;i++){ var v=Math.round(arr[i]); c[v]=(c[v]||0)+1; if(c[v]>n){n=c[v]; best=v;} }
    return best || (arr.length?Math.round(arr[0]):null);
  }
  function apply(){
    if(!document.body.classList.contains("page-services")) return;
    var row=document.getElementById("analytics");
    if(!row) return;
    var content=row.querySelector(".service-content");
    var img=row.querySelector(".service-image img, .service-image .service-img");
    var imgCol=row.querySelector(".service-image");
    if(content){ content.style.height=""; content.style.maxHeight=""; }
    if(imgCol){ imgCol.style.height=""; imgCol.style.display=""; imgCol.style.alignItems=""; imgCol.style.justifyContent=""; }
    if(img){ img.style.height=""; img.style.width=""; img.style.maxWidth=""; img.style.objectFit=""; }
    if(!isTwoCol()) return;
    var others=[].slice.call(document.querySelectorAll(".page-services .service-row:not(#analytics) .service-content"));
    var hs=others.map(function(el){ return el.getBoundingClientRect().height; }).filter(function(h){return h>0;});
    if(!hs.length) return;
    var h=mode(hs); if(!h) return;
    if(content){ content.style.height=h+"px"; content.style.maxHeight=h+"px"; }
    if(imgCol){ imgCol.style.height=h+"px"; imgCol.style.display="flex"; imgCol.style.alignItems="center"; imgCol.style.justifyContent="center"; }
    if(img){ img.style.height=h+"px"; img.style.width="auto"; img.style.maxWidth="100%"; img.style.objectFit="contain"; }
  }
  var ticking=false;
  function onResize(){ if(ticking) return; ticking=true; requestAnimationFrame(function(){ ticking=false; apply(); }); }
  document.addEventListener("DOMContentLoaded", apply);
  window.addEventListener("load", apply);
  window.addEventListener("resize", onResize);
})();
