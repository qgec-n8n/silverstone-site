/*
  DM-to-consultation pathway — synthetic demo scenario for the Fitness coaches industry page.

  The visitor picks one incoming request. The demo sorts it into a lane and either
  prepares a summary for a person to confirm, or routes the sensitive request
  straight to a human boundary. It is deterministic and illustrative — it never
  confirms, books or decides anything, and uses no real data.
*/

const DATA = {
  "id": "industry-fitness-coaches",
  "object": "consultation request",
  "human": "the coach",
  "options": [
    {
      "value": "consult",
      "label": "Consultation enquiry",
      "route": "auto"
    },
    {
      "value": "resource",
      "label": "Resource / programme question",
      "route": "auto"
    },
    {
      "value": "health",
      "label": "Health disclosure",
      "route": "human"
    }
  ],
  "autoStages": [
    "Captured",
    "Fit questions asked",
    "Consultation offered",
    "Handoff summary ready"
  ],
  "humanStage": "Held for the coach",
  "autoSummary": "Synthetic run: the message is captured, a few fit questions are asked and a consultation is offered, then a concise handoff summary is prepared. Nothing is assessed automatically.",
  "humanSummary": "Synthetic run: a health disclosure is held for the coach. The pathway summarises context only — it never assesses suitability, readiness or health."
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
