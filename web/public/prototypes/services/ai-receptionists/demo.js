/*
  Front-desk routing — synthetic demo scenario for the AI receptionists page.

  The visitor chooses a channel and an enquiry type. The console takes the
  enquiry through intake, an approved-answer check and a routing decision to one
  of four destinations: answer, booking, message or person. Sensitive enquiries
  cannot be automated. Deterministic + synthetic — no live data, no real enquiry.
*/

const CHANNEL = {
  web: "Web chat",
  phone: "Phone",
  message: "Message",
};

const ENQUIRY = {
  question: {
    label: "General question",
    destination: "Answer",
    detail: "Replied from approved content — opening hours, location, simple FAQs.",
    sensitive: false,
  },
  booking: {
    label: "Booking request",
    destination: "Booking",
    detail: "A slot is offered and held; a named person confirms before it is final.",
    sensitive: false,
  },
  capture: {
    label: "Leave a message",
    destination: "Message",
    detail: "Minimum details captured cleanly and routed to the right shared inbox.",
    sensitive: false,
  },
  sensitive: {
    label: "Sensitive / urgent",
    destination: "Person",
    detail: "Safeguards override routing — handed straight to a named human owner.",
    sensitive: true,
  },
};

function read(root) {
  const val = (name, fallback) => {
    const el = root.querySelector(`[name="${name}"]`);
    return el ? el.value : fallback;
  };
  return {
    channel: val("channel", "web"),
    enquiry: val("enquiry", "question"),
  };
}

function stepsFor(options) {
  const ch = CHANNEL[options.channel] || CHANNEL.web;
  const en = ENQUIRY[options.enquiry] || ENQUIRY.question;
  const rows = [
    { stage: "Receive", detail: `Enquiry arrives via ${ch.toLowerCase()} and joins one intake queue.` },
    { stage: "Identify", detail: `Type recognised: ${en.label.toLowerCase()}.` },
  ];
  if (en.sensitive) {
    rows.push({ stage: "Safeguard", detail: "Urgency / vulnerability signal detected — automation steps back." });
    rows.push({ stage: "Route → Person", detail: en.detail });
  } else {
    rows.push({ stage: "Approved-answer check", detail: "Matched against content you have signed off." });
    rows.push({ stage: `Route → ${en.destination}`, detail: en.detail });
  }
  return rows;
}

function renderRoute(stage, rows, count, activeIndex, summary) {
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
    <p class="ss-demo__synthetic">Synthetic routing decision</p>
    <ul style="display:grid; gap:0.5rem; list-style:none; margin:0.75rem 0 0; padding:0">${items}</ul>
    ${summary ? `<p class="ss-note ss-note--info" style="margin-top:0.75rem">${summary}</p>` : ""}`;
}

function reset(stage, options) {
  const rows = stepsFor(options || read(document.querySelector('[data-demo="reception-console"]')));
  renderRoute(stage, rows, rows.length, -1, "Idle — choose options, then press Start to route the enquiry.");
}

function build(options) {
  const ch = CHANNEL[options.channel] || CHANNEL.web;
  const en = ENQUIRY[options.enquiry] || ENQUIRY.question;
  const rows = stepsFor(options);

  const steps = rows.map((row, i) => ({
    log: `${row.stage}: ${row.detail}`,
    status: `Routing enquiry… step ${i + 1} of ${rows.length + 1}.`,
    render: (stage) => renderRoute(stage, rows, i + 1, i),
  }));

  const summary = en.sensitive
    ? `A ${en.label.toLowerCase()} enquiry from ${ch.toLowerCase()} was handed to a person. Sensitive and urgent matters are never automated. This is synthetic — no real enquiry, no live integration.`
    : `A ${en.label.toLowerCase()} enquiry from ${ch.toLowerCase()} resolved to "${en.destination}" using approved content. This is synthetic — no real enquiry, no live integration.`;

  steps.push({
    log: `Destination: ${en.sensitive ? "Person" : en.destination} (synthetic).`,
    status: "Enquiry routed. Reset to try another combination.",
    render: (stage) => renderRoute(stage, rows, rows.length, -1, summary),
  });

  return steps;
}

function ready() {
  if (window.SilverstoneDemo) {
    window.SilverstoneDemo.register("reception-console", {
      temporal: false,
      interval: 600,
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
