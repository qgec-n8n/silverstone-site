/*
  Silverstone prototype — "Connector Constellation" tools rail.

  A native-scroll, accessible, NON-carousel rail. There is deliberately no
  autoplay, no infinite cloning and no nested scroll trap. Each card is fully
  readable without JS; this module adds category filtering, previous/next
  group movement, and a status line.

  Markup (authored per page):
    <section class="ss-tools" data-tools>
      <div class="ss-tools__filters" role="group" aria-label="Filter tools by category">
        <button data-tools-filter="all" aria-pressed="true">All</button>
        <button data-tools-filter="Scheduling" aria-pressed="false">Scheduling</button> …
      </div>
      <p class="ss-tools__status" data-tools-status aria-live="polite"></p>
      <div class="ss-tools__viewport">
        <ul class="ss-tools__rail" data-tools-rail tabindex="0" role="list"
            aria-label="Compatible tool categories">
          <li class="ss-tool-card" data-category="Scheduling"> … </li> …
        </ul>
      </div>
      <div class="ss-tools__controls">
        <button data-tools-prev aria-label="Previous tools">‹</button>
        <button data-tools-next aria-label="Next tools">›</button>
      </div>
    </section>

  Accessibility:
    - filtering announces the active category and result count;
    - focus is only moved if the currently focused card is hidden by a filter,
      in which case focus returns to the filter group;
    - previous/next move one logical group (roughly one viewport of cards);
    - the rail itself is focusable and responds to Left/Right arrows.
*/

function initOne(root) {
  const filters = Array.from(root.querySelectorAll("[data-tools-filter]"));
  const rail = root.querySelector("[data-tools-rail]");
  const status = root.querySelector("[data-tools-status]");
  const prev = root.querySelector("[data-tools-prev]");
  const next = root.querySelector("[data-tools-next]");
  if (!rail) return;

  const cards = Array.from(rail.querySelectorAll(".ss-tool-card"));
  let activeCategory = "all";

  function visibleCards() {
    return cards.filter((c) => c.hidden === false);
  }

  function announce() {
    if (!status) return;
    const count = visibleCards().length;
    const label = activeCategory === "all" ? "all categories" : activeCategory;
    status.textContent = `Showing ${count} tool${count === 1 ? "" : "s"} in ${label}. These are compatibility categories, not confirmed live integrations.`;
  }

  function applyFilter(category, trigger) {
    const focused = document.activeElement;
    const focusedCard = focused ? focused.closest(".ss-tool-card") : null;

    activeCategory = category;
    for (const card of cards) {
      const match = category === "all" || card.getAttribute("data-category") === category;
      card.hidden = !match;
    }
    for (const btn of filters) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-tools-filter") === category));
    }

    // Only move focus if the previously focused card was hidden.
    if (focusedCard && focusedCard.hidden) {
      const group = root.querySelector(".ss-tools__filters");
      if (group) {
        (trigger || group.querySelector("[data-tools-filter]")).focus();
      }
    }

    rail.scrollTo({ left: 0, behavior: "auto" });
    announce();
  }

  function step(direction) {
    const amount = Math.max(rail.clientWidth * 0.85, 240);
    rail.scrollBy({ left: direction * amount, behavior: reduceMotion() ? "auto" : "smooth" });
  }

  function reduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  for (const btn of filters) {
    btn.addEventListener("click", () => applyFilter(btn.getAttribute("data-tools-filter"), btn));
  }
  if (prev) prev.addEventListener("click", () => step(-1));
  if (next) next.addEventListener("click", () => step(1));

  rail.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  });

  announce();
}

function initTools() {
  for (const root of Array.from(document.querySelectorAll("[data-tools]"))) initOne(root);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTools);
} else {
  initTools();
}
