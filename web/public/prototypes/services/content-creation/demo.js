/*
  Governed repurposing plan — synthetic demo scenario for the content creation page.

  The visitor chooses an approved source and an audience. The loom builds a
  channel plan, inserts review gates, and blocks anything that would need an
  unsupported claim. It plans STRUCTURE ONLY — it never writes finished copy,
  invents facts, or publishes. Deterministic + synthetic, no live data.
*/

const SOURCE = {
  casestudy: { label: "Customer case study", note: "outcomes described qualitatively, with the customer's permission" },
  howto: { label: "How-to guide", note: "steps drawn from your documented process" },
  update: { label: "Product update", note: "facts limited to what has actually shipped" },
};

const AUDIENCE = {
  prospects: "Prospective customers",
  existing: "Existing customers",
  peers: "Industry peers",
};

const CHANNELS = [
  { name: "Website", detail: "Page copy shaped to one clear action." },
  { name: "Article", detail: "Longer-form piece linking back to the source." },
  { name: "Email", detail: "Concise version with a single next step." },
  { name: "Social", detail: "Short, per-platform posts tracing to the same facts." },
];

function read(root) {
  const val = (name, fallback) => {
    const el = root.querySelector(`[name="${name}"]`);
    return el ? el.value : fallback;
  };
  return {
    source: val("source", "casestudy"),
    audience: val("audience", "prospects"),
  };
}

function buildRows(options) {
  const src = SOURCE[options.source] || SOURCE.casestudy;
  const aud = AUDIENCE[options.audience] || AUDIENCE.prospects;
  const rows = [
    { stage: "Source", detail: `${src.label} — ${src.note}.` },
    { stage: "Audience", detail: `Shaped for ${aud.toLowerCase()}.` },
  ];
  CHANNELS.forEach((c) => {
    rows.push({ stage: `Plan → ${c.name}`, detail: c.detail });
  });
  rows.push({ stage: "Claim check", detail: "Unsupported stats, testimonials and regulated advice flagged and blocked." });
  rows.push({ stage: "Review gate", detail: "A person approves each output before anything can publish." });
  return rows;
}

function renderPlan(stage, rows, count, activeIndex, summary) {
  if (!stage) return;
  const items = rows
    .slice(0, count)
    .map(
      (row, i) =>
        `<li class="ss-tile" data-active="${i === activeIndex ? "true" : "false"}">
          <span class="ss-tile__label">${String(i + 1).padStart(2, "0")} · ${row.stage}</span>
          <span class="ss-tile__value">${row.detail}</span>
        </li>`,
    )
    .join("");
  stage.innerHTML = `
    <p class="ss-demo__synthetic">Synthetic content plan</p>
    <ul style="display:grid; gap:0.5rem; list-style:none; margin:0.75rem 0 0; padding:0">${items}</ul>
    ${summary ? `<p class="ss-note ss-note--info" style="margin-top:0.75rem">${summary}</p>` : ""}`;
}

function reset(stage, options) {
  const rows = buildRows(options || read(document.querySelector('[data-demo="content-loom"]')));
  renderPlan(stage, rows, rows.length, -1, "Idle — choose options, then press Start to plan the repurposing.");
}

function build(options) {
  const src = SOURCE[options.source] || SOURCE.casestudy;
  const rows = buildRows(options);

  const steps = rows.map((row, i) => ({
    log: `${row.stage}: ${row.detail}`,
    status: `Planning content… step ${i + 1} of ${rows.length + 1}.`,
    render: (stage) => renderPlan(stage, rows, i + 1, i),
  }));

  const summary = `Synthetic plan from one "${src.label.toLowerCase()}": ${CHANNELS.length} channel outputs, each behind a review gate, with unsupported claims blocked. This plans structure only — it does not write copy, invent facts or publish.`;

  steps.push({
    log: "Plan ready (synthetic). Nothing written or published.",
    status: "Plan complete. Reset to try another combination.",
    render: (stage) => renderPlan(stage, rows, rows.length, -1, summary),
  });

  return steps;
}

function ready() {
  if (window.SilverstoneDemo) {
    window.SilverstoneDemo.register("content-loom", {
      temporal: false,
      interval: 560,
      read,
      reset,
      build,
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
