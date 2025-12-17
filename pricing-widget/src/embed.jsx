import React from "react";
import { createRoot } from "react-dom/client";
import PricingWidget from "./PricingWidget.jsx";
import pricingData from "./pricing-copy-map.json";

const roots = new WeakMap();

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
}

function unmount(el) {
  const root = roots.get(el);
  if (!root) return;
  root.unmount();
  roots.delete(el);
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
