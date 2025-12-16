import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import pricingCopyRaw from "../codex/_generated/pricing-copy.json";

type Row1Plan = {
  name: string;
  setupFee: string;
  monthlyRetainer: string;
  bestFor: string;
  includes: string[];
  badge?: string;
};

type Row2Group = {
  label: string;
  plansIncludedRaw: string;
  oneLiner: string;
};

type PricingPageCopy = {
  row1: { title: string; subtitle?: string; plans: Row1Plan[] };
  row2: { title: string; subtitle?: string; groups: Row2Group[] };
};

type PricingCopyMap = Record<string, PricingPageCopy>;
type BillingMode = "monthly" | "setup";

const STYLE_ID = "ssw-pricing-style";
const STYLE_TEXT = `
:host, .ssw-root { font-family: "Poppins", "Open Sans", system-ui, -apple-system, sans-serif; color: #e9edf5; }
.ssw-root * { box-sizing: border-box; }
.ssw-root { width: 100%; }
.ssw-surface { width: 100%; background: radial-gradient(circle at 0% 0%, rgba(71, 158, 255, 0.08), transparent 45%), radial-gradient(circle at 100% 20%, rgba(0, 226, 183, 0.08), transparent 35%), #0b1020; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 28px; box-shadow: 0 25px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04); }
.ssw-section { margin-top: 18px; }
.ssw-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.ssw-title { margin: 0; font-size: 1.5rem; letter-spacing: -0.01em; }
.ssw-subtitle { margin: 6px 0 0; color: #9db2c8; font-size: 0.95rem; line-height: 1.5; max-width: 46rem; }
.ssw-toggle { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; padding: 4px; display: inline-flex; gap: 4px; }
.ssw-toggle button { border: none; background: transparent; color: #cfd9e6; padding: 8px 14px; border-radius: 999px; font-weight: 700; cursor: pointer; position: relative; transition: color 0.15s ease, background 0.15s ease, transform 0.15s ease; }
.ssw-toggle button[aria-pressed="true"] { background: linear-gradient(135deg, #15c9b5, #5af8d3); color: #04101c; box-shadow: 0 10px 25px rgba(21,201,181,0.25); }
.ssw-toggle button:focus-visible { outline: 2px solid #5af8d3; outline-offset: 2px; }
.ssw-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 14px; }
@media (min-width: 960px) { .ssw-grid { gap: 18px; grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.ssw-card { background: linear-gradient(180deg, rgba(19,29,49,0.95), rgba(11,16,32,0.92)); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px; box-shadow: 0 12px 35px rgba(0,0,0,0.35); position: relative; overflow: hidden; min-height: 100%; }
.ssw-card:hover { border-color: rgba(90,248,211,0.5); }
.ssw-card-popular { border-color: rgba(247,183,51,0.9); box-shadow: 0 14px 40px rgba(247,183,51,0.25); background: linear-gradient(180deg, rgba(28,25,19,0.95), rgba(18,15,9,0.9)); }
.ssw-badge { position: absolute; top: 12px; right: 12px; background: linear-gradient(135deg, #f7b733, #ffdd87); color: #2b1a04; font-weight: 700; font-size: 0.75rem; padding: 6px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.02em; }
.ssw-card-title { margin: 0 0 4px; font-size: 1.15rem; letter-spacing: -0.01em; }
.ssw-price { display: flex; align-items: baseline; gap: 6px; font-weight: 700; }
.ssw-price-value { font-size: 1.45rem; color: #f8fbff; }
.ssw-price-cadence { font-size: 0.9rem; color: #8fb4d8; }
.ssw-bestfor { margin: 8px 0 10px; color: #b6c7dc; line-height: 1.45; font-size: 0.95rem; }
.ssw-includes { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
.ssw-includes li { display: flex; gap: 8px; color: #d5e2f3; font-size: 0.95rem; line-height: 1.4; }
.ssw-includes li::before { content: "•"; color: #5af8d3; margin-top: 1px; }
.ssw-card-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 12px 0; }
.ssw-row2 .ssw-card { background: linear-gradient(180deg, rgba(10,18,32,0.95), rgba(7,13,23,0.94)); border-color: rgba(255,255,255,0.08); }
.ssw-group-title { margin: 0 0 6px; font-size: 1.05rem; letter-spacing: -0.01em; }
.ssw-group-oneliner { margin: 0 0 10px; color: #9fb2c6; font-size: 0.93rem; line-height: 1.4; }
.ssw-group-plans { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; color: #d5e2f3; font-size: 0.95rem; }
.ssw-group-plans li { padding: 8px 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; line-height: 1.35; }
.ssw-muted { color: #9fb2c6; font-size: 0.95rem; }
.ssw-error { padding: 16px; background: rgba(255, 87, 120, 0.1); border: 1px solid rgba(255, 87, 120, 0.4); border-radius: 12px; color: #ffd7df; }
@media (max-width: 640px) { .ssw-surface { padding: 22px; } .ssw-title { font-size: 1.35rem; } }
`;

const pricingCopy = pricingCopyRaw as PricingCopyMap;

function InlineMarkdown({ text }: { text: string }) {
  const parts = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text))) {
      if (match.index > lastIndex) {
        nodes.push(text.slice(lastIndex, match.index));
      }
      nodes.push(
        <strong key={`b-${match.index}`}>{match[1]}</strong>,
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
  }, [text]);

  return <>{parts}</>;
}

function PriceToggle({
  mode,
  onChange,
}: {
  mode: BillingMode;
  onChange: (mode: BillingMode) => void;
}) {
  return (
    <div className="ssw-toggle" role="group" aria-label="Pricing cadence">
      <button
        type="button"
        aria-pressed={mode === "monthly"}
        onClick={() => onChange("monthly")}
      >
        Monthly
      </button>
      <button
        type="button"
        aria-pressed={mode === "setup"}
        onClick={() => onChange("setup")}
      >
        Setup
      </button>
    </div>
  );
}

function Row1Card({
  plan,
  billingMode,
  highlight,
}: {
  plan: Row1Plan;
  billingMode: BillingMode;
  highlight: boolean;
}) {
  const price = billingMode === "monthly" ? plan.monthlyRetainer : plan.setupFee;
  const cadence = billingMode === "monthly" ? "/mo" : "setup fee";

  return (
    <article className={`ssw-card ${highlight ? "ssw-card-popular" : ""}`}>
      {highlight && plan.badge ? <div className="ssw-badge">{plan.badge}</div> : null}
      <h3 className="ssw-card-title">{plan.name}</h3>
      <div className="ssw-price">
        <span className="ssw-price-value">{price}</span>
        <span className="ssw-price-cadence">{cadence}</span>
      </div>
      <p className="ssw-bestfor">{plan.bestFor}</p>
      <div className="ssw-card-divider" aria-hidden="true"></div>
      <ul className="ssw-includes">
        {plan.includes.map((item, idx) => (
          <li key={`${plan.name}-inc-${idx}`}>
            <InlineMarkdown text={item} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function formatPlansIncluded(raw: string): string[] {
  return raw
    .split(/\n+/)
    .map((line) => line.trim().replace(/^-+\s*/, ""))
    .filter(Boolean);
}

function Row2Card({ group }: { group: Row2Group }) {
  const plans = formatPlansIncluded(group.plansIncludedRaw);

  return (
    <article className="ssw-card">
      <h3 className="ssw-group-title">{group.label}</h3>
      <p className="ssw-group-oneliner">{group.oneLiner}</p>
      <ul className="ssw-group-plans">
        {plans.map((line, idx) => (
          <li key={`${group.label}-plan-${idx}`}>
            <InlineMarkdown text={line} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function PricingWidget({ pageKey }: { pageKey: string }) {
  const [billingMode, setBillingMode] = useState<BillingMode>("monthly");
  const page = pricingCopy[pageKey];

  if (!page) {
    return (
      <div className="ssw-root">
        <div className="ssw-surface">
          <div className="ssw-error">Pricing data is not available for this page.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ssw-root">
      <div className="ssw-surface">
        <section className="ssw-section">
          <div className="ssw-header">
            <div>
              <h2 className="ssw-title">{page.row1.title}</h2>
              {page.row1.subtitle ? (
                <p className="ssw-subtitle">{page.row1.subtitle}</p>
              ) : null}
            </div>
            <PriceToggle mode={billingMode} onChange={setBillingMode} />
          </div>
          <div className="ssw-grid">
            {page.row1.plans.map((plan, idx) => (
              <Row1Card
                key={`${plan.name}-${idx}`}
                plan={plan}
                billingMode={billingMode}
                highlight={idx === 1}
              />
            ))}
          </div>
        </section>

        <section className="ssw-section ssw-row2">
          <div className="ssw-header">
            <div>
              <h2 className="ssw-title">{page.row2.title}</h2>
              {page.row2.subtitle ? (
                <p className="ssw-subtitle">{page.row2.subtitle}</p>
              ) : null}
            </div>
          </div>
          <div className="ssw-grid">
            {page.row2.groups.map((group, idx) => (
              <Row2Card key={`${group.label}-${idx}`} group={group} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

type MountOptions = { pageKey?: string };
type MountedEntry = { root: ReturnType<typeof createRoot>; container: HTMLElement };

const mountedMap = new WeakMap<HTMLElement, MountedEntry>();

function ensureStyle(shadow: ShadowRoot) {
  if (shadow.getElementById(STYLE_ID)) return;
  const styleEl = document.createElement("style");
  styleEl.id = STYLE_ID;
  styleEl.textContent = STYLE_TEXT;
  shadow.appendChild(styleEl);
}

export function mount(el: Element | null, opts: MountOptions = {}) {
  const host = el as HTMLElement | null;
  if (!host || mountedMap.has(host)) return;

  const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
  ensureStyle(shadow);

  const container = document.createElement("div");
  shadow.appendChild(container);

  const root = createRoot(container);
  root.render(<PricingWidget pageKey={opts.pageKey || ""} />);

  mountedMap.set(host, { root, container });
}

export function mountAll() {
  const mounts = Array.from(
    document.querySelectorAll<HTMLElement>(".ss-pricing-mount[data-ss-pricing-page]"),
  );
  mounts.forEach((node) => {
    if (node.getAttribute("data-ss-mounted") === "1") return;
    const pageKey = node.getAttribute("data-ss-pricing-page") || "";
    mount(node, { pageKey });
    node.setAttribute("data-ss-mounted", "1");
  });
}

export default { mount, mountAll };
