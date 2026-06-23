/*
  Silverstone prototype — section reveal + page entry.

  Progressive enhancement only. Every element marked [data-reveal] is fully
  present and readable without JS; this module just adds a one-time, short
  opacity/translate settle as it scrolls into view. Native scroll is never
  hijacked. Under reduced motion (or no IntersectionObserver) everything is
  shown immediately with no transform and no stagger.

  Owner: this is the "section reveal" owner referenced in the motion
  storyboards. Travel is capped small and each reveal runs once.
*/

const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealAll(nodes) {
  for (const el of nodes) el.setAttribute("data-revealed", "true");
}

function initReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-reveal]"));

  // Page-entry marker (CSS may use it for a single calm settle of the hero).
  document.body.setAttribute("data-entered", "true");

  if (nodes.length === 0) return;

  if (reduce() || !("IntersectionObserver" in window)) {
    revealAll(nodes);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-revealed", "true");
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  for (const el of nodes) observer.observe(el);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReveal);
} else {
  initReveal();
}
