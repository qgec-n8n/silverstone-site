import { createRoot } from "react-dom/client";
import { pricingCopy, type PricingPageId } from "@/data/pricing-copy";
import { PricingWidget } from "@/components/PricingWidget";

function isPricingPageId(value: string | null): value is PricingPageId {
  return !!value && Object.prototype.hasOwnProperty.call(pricingCopy, value);
}

const warnedPages = new Set<string>();

function renderMount(el: HTMLElement) {
  const pageAttr = el.getAttribute("data-ss-pricing-page");
  const pageId = isPricingPageId(pageAttr) ? pageAttr : null;
  const copy = pageId ? pricingCopy[pageId] : undefined;

  if (!copy && pageAttr && !warnedPages.has(pageAttr)) {
    console.warn(
      `[pricing-widget] No pricing copy found for data-ss-pricing-page="${pageAttr}"`
    );
    warnedPages.add(pageAttr);
  }

  const root = createRoot(el);
  root.render(<PricingWidget pageId={pageAttr} copy={copy} />);
}

function init() {
  const mounts = Array.from(
    document.querySelectorAll<HTMLElement>(".ss-pricing")
  );
  if (!mounts.length) return;
  mounts.forEach(renderMount);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
