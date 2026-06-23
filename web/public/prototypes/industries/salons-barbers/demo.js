/*
  Chair-and-calendar availability weave — synthetic demo scenario for the Salons & barbers industry page.

  The visitor picks one incoming request. The demo sorts it into a lane and either
  prepares a summary for a person to confirm, or routes the sensitive request
  straight to a human boundary. It is deterministic and illustrative — it never
  confirms, books or decides anything, and uses no real data.
*/

const DATA = {
  "id": "industry-salons-barbers",
  "object": "booking",
  "human": "the stylist",
  "options": [
    {
      "value": "book",
      "label": "New appointment",
      "route": "auto"
    },
    {
      "value": "reschedule",
      "label": "Reschedule request",
      "route": "auto"
    },
    {
      "value": "suitability",
      "label": "Suitability / patch-test question",
      "route": "human"
    }
  ],
  "autoStages": [
    "Captured",
    "Matched to stylist",
    "Slot & deposit offered",
    "Summary ready for desk"
  ],
  "humanStage": "Held for the stylist",
  "autoSummary": "Synthetic run: service, stylist and deposit are woven into one slot and a summary is prepared for the desk to confirm. Nothing is booked automatically.",
  "humanSummary": "Synthetic run: a suitability or patch-test question stops at the practitioner. Automation arranges the slot around it but never makes the suitability call."
};

function read(root) {
  const el = root.querySelector('[name="intake"]');
  return { intake: el ? el.value : DATA.options[0].value };
}

function option(value) {
  return DATA.options.find((o) => o.value === value) || DATA.options[0];
}

function stagesFor(o) {
  return o.route === "human" ? ["Captured", "Sorted to lane", DATA.humanStage] : DATA.autoStages.slice();
}

function renderFlow(stage, stages, activeCount, activeIndex, summary) {
  if (!stage) return;
  const rows = stages
    .map((label, i) => {
      const state = i < activeCount ? (i === activeIndex ? "Active" : "Cleared") : "Waiting";
      return '<li class="ss-tile" data-active="' + (i === activeIndex ? "true" : "false") + '">' +
        '<span class="ss-tile__label">' + String(i + 1).padStart(2, "0") + " · " + label + '</span>' +
        '<span class="ss-tile__value">' + state + '</span></li>';
    })
    .join("");
  stage.innerHTML =
    '<p class="ss-demo__synthetic">Synthetic workflow</p>' +
    '<ul style="display:grid; gap:0.5rem; list-style:none; margin:0.75rem 0 0; padding:0">' + rows + '</ul>' +
    (summary ? '<p class="ss-note ss-note--info" style="margin-top:0.75rem">' + summary + '</p>' : "");
}

function reset(stage, options) {
  const root = document.querySelector('[data-demo="' + DATA.id + '"]');
  const o = option((options || read(root)).intake);
  renderFlow(stage, stagesFor(o), 0, -1, "Idle — choose a request, then press Start to route it.");
}

function build(options) {
  const o = option(options.intake);
  const stages = stagesFor(o);
  const isHuman = o.route === "human";
  const steps = stages.map((label, i) => ({
    log: "Stage " + String(i + 1) + ": " + label + ".",
    status: "Routing… step " + String(i + 1) + " of " + String(stages.length) + ".",
    render: (stage) => renderFlow(stage, stages, i + 1, i),
  }));
  const summary = isHuman ? DATA.humanSummary : DATA.autoSummary;
  steps.push({
    log: isHuman ? "Routed to " + DATA.human + " — automation prepared context only." : "Summary ready for a person to confirm.",
    status: "Done. Reset to try another request.",
    render: (stage) => renderFlow(stage, stages, stages.length, -1, summary),
  });
  return steps;
}

function ready() {
  if (window.SilverstoneDemo) {
    window.SilverstoneDemo.register(DATA.id, {
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
