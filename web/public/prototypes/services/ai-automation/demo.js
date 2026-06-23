/*
  Exception-aware workflow run — synthetic demo scenario for the AI automation page.

  The visitor chooses one queue and one "send to a human" rule. The demo runs a
  fixed synthetic batch through the lattice: routine items are auto-handled along
  one path, and the single item that matches the rule is held for human approval.
  It is deterministic and illustrative — it never acts autonomously, touches real
  records, or predicts any outcome.
*/

const QUEUES = {
  enquiries: {
    label: "Inbound enquiries",
    unit: "enquiry",
    items: [
      { ref: "ENQ-118", summary: "Quote request, full details", value: "low", tone: "calm", details: "complete" },
      { ref: "ENQ-119", summary: "Refund demand, frustrated wording", value: "low", tone: "upset", details: "complete" },
      { ref: "ENQ-120", summary: "Bulk order above approval limit", value: "high", tone: "calm", details: "complete" },
      { ref: "ENQ-121", summary: "Callback request, no phone number", value: "low", tone: "calm", details: "missing" },
      { ref: "ENQ-122", summary: "General question, full details", value: "low", tone: "calm", details: "complete" },
    ],
  },
  invoices: {
    label: "Supplier invoices",
    unit: "invoice",
    items: [
      { ref: "INV-2041", summary: "Recurring invoice, matches PO", value: "low", tone: "calm", details: "complete" },
      { ref: "INV-2042", summary: "Disputed charge, terse note", value: "low", tone: "upset", details: "complete" },
      { ref: "INV-2043", summary: "One-off invoice above approval limit", value: "high", tone: "calm", details: "complete" },
      { ref: "INV-2044", summary: "Invoice missing PO reference", value: "low", tone: "calm", details: "missing" },
      { ref: "INV-2045", summary: "Recurring invoice, matches PO", value: "low", tone: "calm", details: "complete" },
    ],
  },
  onboarding: {
    label: "New-customer onboarding",
    unit: "account",
    items: [
      { ref: "ACC-77", summary: "Standard signup, all fields present", value: "low", tone: "calm", details: "complete" },
      { ref: "ACC-78", summary: "Complaint raised during signup", value: "low", tone: "upset", details: "complete" },
      { ref: "ACC-79", summary: "Enterprise plan, large seat count", value: "high", tone: "calm", details: "complete" },
      { ref: "ACC-80", summary: "Signup missing billing details", value: "low", tone: "calm", details: "missing" },
      { ref: "ACC-81", summary: "Standard signup, all fields present", value: "low", tone: "calm", details: "complete" },
    ],
  },
};

const RULES = {
  value: { label: "a value threshold is crossed", test: (it) => it.value === "high", flag: "Above approval limit" },
  sentiment: { label: "the tone reads as upset", test: (it) => it.tone === "upset", flag: "Tone reads as upset" },
  missing: { label: "required details are missing", test: (it) => it.details === "missing", flag: "Required details missing" },
};

function read(root) {
  const val = (name, fallback) => {
    const el = root.querySelector(`[name="${name}"]`);
    return el ? el.value : fallback;
  };
  return {
    queue: val("queue", "enquiries"),
    rule: val("rule", "value"),
  };
}

function resolve(options) {
  const queue = QUEUES[options.queue] || QUEUES.enquiries;
  const rule = RULES[options.rule] || RULES.value;
  const flaggedIndex = queue.items.findIndex((it) => rule.test(it));
  return { queue, rule, flaggedIndex };
}

function stateFor(index, processedCount, flaggedIndex) {
  if (index >= processedCount) return "Queued";
  if (index === flaggedIndex) return "Held for approval";
  return "Auto-handled";
}

function renderBatch(stage, queue, processedCount, flaggedIndex, activeIndex, summary) {
  if (!stage) return;
  const rows = queue.items
    .map((item, i) => {
      const state = stateFor(i, processedCount, flaggedIndex);
      return `<li class="ss-tile" data-active="${i === activeIndex ? "true" : "false"}">
          <span class="ss-tile__label">${item.ref} · ${state}</span>
          <span class="ss-tile__value">${item.summary}</span>
        </li>`;
    })
    .join("");
  stage.innerHTML = `
    <p class="ss-demo__synthetic">Synthetic batch — ${queue.label}</p>
    <ul style="display:grid; gap:0.5rem; list-style:none; margin:0.75rem 0 0; padding:0">${rows}</ul>
    ${summary ? `<p class="ss-note ss-note--info" style="margin-top:0.75rem">${summary}</p>` : ""}`;
}

function reset(stage, options) {
  const { queue, flaggedIndex } = resolve(options || read(document.querySelector('[data-demo="automation-lattice"]')));
  renderBatch(stage, queue, 0, flaggedIndex, -1, "Idle — choose a queue and a rule, then press Start to run the batch.");
}

function build(options) {
  const { queue, rule, flaggedIndex } = resolve(options);
  const total = queue.items.length;
  const steps = [];

  steps.push({
    log: `Batch received: ${String(total)} items in ${queue.label}.`,
    status: `Intake complete — ${String(total)} ${queue.unit}s queued.`,
    render: (stage) => renderBatch(stage, queue, 0, flaggedIndex, -1),
  });

  queue.items.forEach((item, i) => {
    const held = i === flaggedIndex;
    steps.push({
      log: held
        ? `${item.ref} held: ${rule.flag} — routed to human approval.`
        : `${item.ref} auto-handled: ${item.summary}.`,
      status: held
        ? "Exception found — waiting on a person to approve."
        : `Processing… ${String(i + 1)} of ${String(total)}.`,
      render: (stage) => renderBatch(stage, queue, i + 1, flaggedIndex, i),
    });
  });

  const heldRef = flaggedIndex >= 0 ? queue.items[flaggedIndex].ref : "none";
  const summary = `Synthetic run: ${String(total - 1)} routine ${queue.unit}s auto-handled along one path; 1 (${heldRef}) held for human approval because ${rule.label}. No autonomous or irreversible action is taken.`;

  steps.push({
    log: "Run complete — exception waiting for a named approver.",
    status: "Done. Reset to try another queue or rule.",
    render: (stage) => renderBatch(stage, queue, total, flaggedIndex, -1, summary),
  });

  return steps;
}

function ready() {
  if (window.SilverstoneDemo) {
    window.SilverstoneDemo.register("automation-lattice", {
      temporal: false,
      interval: 620,
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
