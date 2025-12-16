import React from "react";
import { createRoot } from "react-dom/client";
import styles from "./generated/pricing.tailwind.css";
import { PRICING_DATA, PricingPlan } from "./generated/pricing-data.generated";

type MountableElement = HTMLElement & { dataset: Record<string, string> };

const fallbackText =
  "Pricing is loading… If this persists, please refresh.";

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function formatMonthly(value: number) {
  return `${currency.format(value)}/mo`;
}

function formatSetup(value: number) {
  return `Setup ${currency.format(value)}`;
}

function CheckIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 8.5 6.5 12 13 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const features = (plan.features || []).slice(0, 5);
  return (
    <div
      className={`ssw-card ${plan.isPopular ? "ssw-card--popular" : ""}`}
      data-sku={plan.sku}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="ssw-plan-name">{plan.planName}</div>
          <div className="ssw-sku">{plan.sku}</div>
        </div>
        {plan.isPopular && <div className="ssw-chip">Most popular</div>}
      </div>

      <div className="ssw-price-row">
        <div className="ssw-price">{formatMonthly(plan.monthlyRetainer)}</div>
        <div className="ssw-price-sub">per month</div>
      </div>
      <div className="ssw-setup">{formatSetup(plan.setupFee)}</div>

      <p className="ssw-desc">{plan.description}</p>

      <div className="ssw-features">
        {features.map((feat, idx) => (
          <div className="ssw-feature" key={`${plan.sku}-f-${idx}`}>
            <span className="ssw-feature-icon">
              <CheckIcon />
            </span>
            <span>{feat}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-1 items-end">
        <a className="ssw-cta" href="/book.html">
          {plan.buttonText || "Book free audit"}
        </a>
      </div>
    </div>
  );
}

function PricingWidget({
  pageKey,
  fallbackMessage,
}: {
  pageKey: string;
  fallbackMessage: string;
}) {
  const plans = PRICING_DATA.pages[pageKey];
  if (!plans || !plans.length) {
    return (
      <div className="ssw-fallback">
        {fallbackMessage || "Pricing is unavailable right now."}
      </div>
    );
  }

  const isServices = pageKey === "services";
  const title = isServices ? "Starter bundles by niche" : "Transparent pricing";
  const subtitle = isServices
    ? "Choose a starter pack tailored to your niche. Each bundle includes onboarding, optimisation and live automations configured for your workflows."
    : "Pick the bundle that matches where you are today. All plans include live automations, optimisation and a 30-day bedding-in period.";

  return (
    <div className="ssw-app">
      <div className="ssw-header">
        <div className="flex flex-col gap-2">
          <div className="ssw-title">{title}</div>
          <div className="ssw-subtitle">{subtitle}</div>
        </div>
        <div className="ssw-meta">
          <div className="ssw-badge">CSV-backed pricing</div>
          <div className="ssw-badge">Built in React + Shadow DOM</div>
        </div>
      </div>

      <div className="ssw-grid">
        {plans.map((plan) => (
          <PricingCard key={plan.sku} plan={plan} />
        ))}
      </div>

      <div className="ssw-footer">
        <span>All bundles include install, optimisation and monthly support.</span>
        <span>Prices in GBP. VAT may apply.</span>
      </div>
    </div>
  );
}

function getFallback(el: Element | null) {
  if (!el) return fallbackText;
  const fallbackEl = el.querySelector(".ss-react-pricing__fallback");
  if (fallbackEl && fallbackEl.textContent) {
    return fallbackEl.textContent.trim();
  }
  return fallbackText;
}

function renderInto(el: MountableElement, pageKey: string, message: string) {
  const shadow = el.shadowRoot || el.attachShadow({ mode: "open" });
  shadow.innerHTML = "";

  const styleTag = document.createElement("style");
  styleTag.textContent = styles;

  const mountPoint = document.createElement("div");
  shadow.append(styleTag, mountPoint);

  const root = createRoot(mountPoint);
  root.render(
    <React.StrictMode>
      <PricingWidget pageKey={pageKey} fallbackMessage={message} />
    </React.StrictMode>,
  );
}

function mount(el: Element | null, explicitKey?: string) {
  if (!el) return;
  const host = el as MountableElement;
  if (host.dataset.ssMounted === "1") return;
  host.dataset.ssMounted = "1";

  const pageKey = explicitKey || host.getAttribute("data-ss-pricing-key") || "";
  const message = getFallback(host);

  try {
    if (!pageKey) throw new Error("Missing data-ss-pricing-key");
    if (!PRICING_DATA.pages[pageKey]) {
      throw new Error(`Unknown pricing key: ${pageKey}`);
    }
    renderInto(host, pageKey, message);
  } catch (err) {
    console.error("[pricing-widget] Failed to mount:", err);
    try {
      const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
      shadow.innerHTML = "";
      const styleTag = document.createElement("style");
      styleTag.textContent = styles;
      const fallbackBox = document.createElement("div");
      fallbackBox.className = "ssw-fallback";
      fallbackBox.textContent = message;
      shadow.append(styleTag, fallbackBox);
    } catch (_e) {
      host.innerHTML = `<div class="ss-react-pricing__fallback">${message}</div>`;
    }
  }
}

function mountAll() {
  const nodes = Array.from(document.querySelectorAll(".ss-react-pricing"));
  nodes.forEach((node) => mount(node));
}

declare global {
  interface Window {
    SS_PRICING_WIDGET?: {
      mount: typeof mount;
      mountAll: typeof mountAll;
    };
  }
}

if (typeof window !== "undefined") {
  window.SS_PRICING_WIDGET = window.SS_PRICING_WIDGET || {
    mount,
    mountAll,
  };
}
