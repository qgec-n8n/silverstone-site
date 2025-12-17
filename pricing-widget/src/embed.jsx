import React from "react";
import { createRoot } from "react-dom/client";
import PricingWidget from "./PricingWidget.jsx";
import pricingData from "./pricing-copy-map.json";

const roots = new WeakMap();
let servicesHeightMatchCleanup = null;

// SS_PRICING_SPEC: SERVICES_SECTION2_HEIGHT_MATCH
function setupServicesSection2HeightMatch() {
  if (servicesHeightMatchCleanup) return;
  if (typeof window === "undefined") return;

  const section1 = document.querySelector(
    '.ss-pricing[data-ss-pricing-page="services.html"][data-ss-pricing-section="1"]'
  );
  const section2 = document.querySelector(
    '.ss-pricing[data-ss-pricing-page="services.html"][data-ss-pricing-section="2"]'
  );

  if (!section1 || !section2) return;

  let rafId = null;

  const updateMatchHeight = () => {
    const cards = section1.querySelectorAll(".ss-pricing__card");
    if (!cards.length) return;
    let maxHeight = 0;
    cards.forEach((card) => {
      const { height } = card.getBoundingClientRect();
      if (height > maxHeight) maxHeight = height;
    });
    if (!Number.isFinite(maxHeight) || maxHeight <= 0) return;
    section2.style.setProperty("--ss-pricing-match-height", `${Math.ceil(maxHeight)}px`);
  };

  const scheduleUpdate = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      updateMatchHeight();
    });
  };

  const resizeObserver =
    typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleUpdate) : null;
  if (resizeObserver) {
    resizeObserver.observe(section1);
  } else {
    window.addEventListener("resize", scheduleUpdate);
  }

  scheduleUpdate();

  servicesHeightMatchCleanup = () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    if (resizeObserver) {
      resizeObserver.disconnect();
    } else {
      window.removeEventListener("resize", scheduleUpdate);
    }
    section2.style.removeProperty("--ss-pricing-match-height");
    servicesHeightMatchCleanup = null;
  };
}

function resolveSectionData(pageKey, sectionId) {
  const page = pricingData[pageKey];
  if (!page) return null;
  if (sectionId === "1") return page.section1;
  if (sectionId === "2") return page.section2;
  return null;
}

function mount(el) {
  if (!el || roots.has(el)) return;
  const pageKey = el.dataset.ssPricingPage || "";
  const sectionId = el.dataset.ssPricingSection || "";
  const sectionData = resolveSectionData(pageKey, sectionId);
  if (!pageKey || !sectionData) return;

  const root = createRoot(el);
  roots.set(el, root);
  root.render(
    <PricingWidget
      pageKey={pageKey}
      sectionId={sectionId}
      sectionData={sectionData}
    />
  );

  setupServicesSection2HeightMatch();
}

function unmount(el) {
  const root = roots.get(el);
  if (!root) return;
  root.unmount();
  roots.delete(el);

  if (
    servicesHeightMatchCleanup &&
    el?.dataset?.ssPricingPage === "services.html" &&
    (el?.dataset?.ssPricingSection === "1" || el?.dataset?.ssPricingSection === "2")
  ) {
    servicesHeightMatchCleanup();
  }
}

function autoMount() {
  const nodes = document.querySelectorAll(".ss-pricing");
  nodes.forEach((node) => mount(node));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", autoMount, { once: true });
} else {
  autoMount();
}

if (typeof window !== "undefined") {
  window.SilverstonePricingWidget = {
    mount,
    unmount,
  };
}

export { mount, unmount };
