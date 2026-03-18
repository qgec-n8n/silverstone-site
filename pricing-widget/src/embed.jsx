import React from "react";
import { createRoot } from "react-dom/client";
import PricingWidget from "./PricingWidget.jsx";
import pricingData from "./pricing-copy-map.json";

const roots = new WeakMap();
const section2HeightMatchState = new Map([
  ["services.html", { cleanup: null, refs: 0 }],
  ["index.html", { cleanup: null, refs: 0 }],
  ["pricing.html", { cleanup: null, refs: 0 }],
]);

// SS_PRICING_SPEC: SERVICES_SECTION2_HEIGHT_MATCH
// SS_PRICING_SPEC: INDEX_SECTION2_HEIGHT_MATCH
// Selector anchor (validator): data-ss-pricing-page="index.html"
function setupSection2HeightMatch(pageKey) {
  const state = section2HeightMatchState.get(pageKey);
  if (!state) return;
  if (state.cleanup) return;
  if (typeof window === "undefined") return;

  const section1 = document.querySelector(
    `.ss-pricing[data-ss-pricing-page="${pageKey}"][data-ss-pricing-section="1"]`
  );
  const section2 = document.querySelector(
    `.ss-pricing[data-ss-pricing-page="${pageKey}"][data-ss-pricing-section="2"]`
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

  state.cleanup = () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    if (resizeObserver) {
      resizeObserver.disconnect();
    } else {
      window.removeEventListener("resize", scheduleUpdate);
    }
    section2.style.removeProperty("--ss-pricing-match-height");
    state.cleanup = null;
  };
}

function registerSection2HeightMatch(pageKey, sectionId) {
  const state = section2HeightMatchState.get(pageKey);
  if (!state) return;
  if (sectionId !== "1" && sectionId !== "2") return;
  state.refs += 1;
  setupSection2HeightMatch(pageKey);
}

function unregisterSection2HeightMatch(pageKey, sectionId) {
  const state = section2HeightMatchState.get(pageKey);
  if (!state) return;
  if (sectionId !== "1" && sectionId !== "2") return;
  state.refs = Math.max(0, state.refs - 1);
  if (state.refs === 0 && state.cleanup) {
    state.cleanup();
  }
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

  registerSection2HeightMatch(pageKey, sectionId);
}

function unmount(el) {
  const root = roots.get(el);
  if (!root) return;
  root.unmount();
  roots.delete(el);

  unregisterSection2HeightMatch(el?.dataset?.ssPricingPage || "", el?.dataset?.ssPricingSection || "");
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
