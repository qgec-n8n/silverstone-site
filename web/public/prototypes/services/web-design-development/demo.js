/*
  Conversion path mapper — synthetic demo scenario for the web design page.

  The visitor chooses one audience, one primary action and one proof type. The
  demo rearranges a synthetic page outline into a single clear path and prints a
  textual journey summary. It maps STRUCTURE ONLY — it never predicts conversion
  rate, search ranking or revenue.
*/

const AUDIENCE = {
  "first-time": {
    label: "First-time visitor",
    promise: "a plain-English promise and one obvious next step",
  },
  comparing: {
    label: "Comparison shopper",
    promise: "a clear point of difference and proof they can verify",
  },
  returning: {
    label: "Returning customer",
    promise: "a fast route back to the action they already trust",
  },
};

const ACTION = {
  book: "Book a discovery call",
  trial: "Start a guided trial",
  quote: "Request a tailored quote",
};

const PROOF = {
  logos: "recognisable client logos",
  outcomes: "illustrative outcome figures (labelled as examples)",
  case: "a short case-style story",
};

function read(root) {
  const val = (name, fallback) => {
    const el = root.querySelector(`[name="${name}"]`);
    return el ? el.value : fallback;
  };
  return {
    audience: val("audience", "first-time"),
    action: val("action", "book"),
    proof: val("proof", "logos"),
  };
}

function outline(options) {
  const a = AUDIENCE[options.audience] || AUDIENCE["first-time"];
  const action = ACTION[options.action] || ACTION.book;
  const proof = PROOF[options.proof] || PROOF.logos;
  return [
    { label: "Clarity banner", detail: `Lead with ${a.promise}.` },
    { label: "Primary path", detail: `Make “${action}” the single dominant call to action.` },
    { label: "Proof block", detail: `Place ${proof} beside the action so it is read in context.` },
    { label: "Wayfinding", detail: "Trim navigation and search to the few paths this audience needs." },
    { label: "Reassurance", detail: "Answer the top objection before it is asked." },
    { label: "Repeat the path", detail: `Restate “${action}” at the natural decision point.` },
  ];
}

function renderOutline(stage, items, count, activeIndex, summary) {
  if (!stage) return;
  const rows = items
    .slice(0, count)
    .map(
      (item, i) =>
        `<li class="ss-tile" data-active="${i === activeIndex ? "true" : "false"}">
          <span class="ss-tile__label">${String(i + 1).padStart(2, "0")} · ${item.label}</span>
          <span class="ss-tile__value">${item.detail}</span>
        </li>`,
    )
    .join("");
  stage.innerHTML = `
    <p class="ss-demo__synthetic">Synthetic page outline</p>
    <ul style="display:grid; gap:0.5rem; list-style:none; margin:0.75rem 0 0; padding:0">${rows}</ul>
    ${summary ? `<p class="ss-note ss-note--info" style="margin-top:0.75rem">${summary}</p>` : ""}`;
}

function reset(stage, options) {
  const items = outline(options || read(document.querySelector('[data-demo="web-conversion"]')));
  renderOutline(stage, items, items.length, -1, "Idle — choose options, then press Start to assemble the path.");
}

function build(options) {
  const items = outline(options);
  const a = AUDIENCE[options.audience] || AUDIENCE["first-time"];
  const action = ACTION[options.action] || ACTION.book;
  const proof = PROOF[options.proof] || PROOF.logos;

  const steps = items.map((item, i) => ({
    log: `Placed: ${item.label} — ${item.detail}`,
    status: `Assembling path… step ${i + 1} of ${items.length + 1}.`,
    render: (stage) => renderOutline(stage, items, i + 1, i),
  }));

  const summary = `Synthetic journey: a ${a.label.toLowerCase()} lands, reads the promise, sees ${proof}, and reaches “${action}”. This maps structure only — it does not predict conversion rate, ranking or revenue.`;

  steps.push({
    log: "Journey summary produced (structure only).",
    status: "Path assembled. Reset to try another combination.",
    render: (stage) => renderOutline(stage, items, items.length, -1, summary),
  });

  return steps;
}

function ready() {
  if (window.SilverstoneDemo) {
    window.SilverstoneDemo.register("web-conversion", {
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
