/*
  First-release state map — synthetic demo scenario for the app development page.

  The visitor chooses a core problem and two roles. The demo moves a synthetic
  request through prototype, validation and release states, names the role that
  acts at each state, and defers everything else to a roadmap. It maps STRUCTURE
  ONLY — it never estimates cost, effort or delivery time, and uses no live data.
*/

const PROBLEM = {
  bookings: {
    label: "Take bookings online",
    core: "request a slot",
    record: "Booking",
    defer: ["Loyalty points", "Multi-location rules", "Waitlist automation"],
  },
  jobs: {
    label: "Track field jobs",
    core: "log a job",
    record: "Job",
    defer: ["Route optimisation", "Parts inventory", "Customer ratings"],
  },
  members: {
    label: "Manage members",
    core: "join or renew",
    record: "Membership",
    defer: ["Tiered pricing", "Referral rewards", "Class booking"],
  },
};

const ROLE = {
  user: "User (customer)",
  staff: "Staff",
  admin: "Admin",
};

function read(root) {
  const val = (name, fallback) => {
    const el = root.querySelector(`[name="${name}"]`);
    return el ? el.value : fallback;
  };
  return {
    problem: val("problem", "bookings"),
    role1: val("role1", "user"),
    role2: val("role2", "staff"),
  };
}

function flow(options) {
  const p = PROBLEM[options.problem] || PROBLEM.bookings;
  const r1 = ROLE[options.role1] || ROLE.user;
  const r2 = ROLE[options.role2] || ROLE.staff;
  return [
    { state: "Capture", role: r1, detail: `${r1} starts the core flow: ${p.core}.` },
    { state: "Prototype", role: r1, detail: `A clickable model of "${p.core}" is reviewed before any production code.` },
    { state: "Validate", role: r2, detail: `${r2} checks the request against approved rules — the decision stays with a person.` },
    { state: "Record", role: "System", detail: `One ${p.record} record becomes the source of truth, with history.` },
    { state: "Release", role: r2, detail: `${r2} releases the smallest useful version; everything else moves to the roadmap.` },
  ];
}

function renderFlow(stage, items, count, activeIndex, summary, roadmap) {
  if (!stage) return;
  const rows = items
    .slice(0, count)
    .map(
      (item, i) =>
        `<li class="ss-tile" data-active="${i === activeIndex ? "true" : "false"}">
          <span class="ss-tile__label">${String(i + 1).padStart(2, "0")} · ${item.state} · ${item.role}</span>
          <span class="ss-tile__value">${item.detail}</span>
        </li>`,
    )
    .join("");
  const roadmapBlock =
    roadmap && roadmap.length
      ? `<p class="ss-demo__synthetic" style="margin-top:0.75rem">Deferred to roadmap</p>
         <ul style="display:grid; gap:0.35rem; list-style:none; margin:0.35rem 0 0; padding:0">
           ${roadmap.map((r) => `<li class="ss-tile"><span class="ss-tile__value">${r}</span></li>`).join("")}
         </ul>`
      : "";
  stage.innerHTML = `
    <p class="ss-demo__synthetic">Synthetic first-release flow</p>
    <ul style="display:grid; gap:0.5rem; list-style:none; margin:0.75rem 0 0; padding:0">${rows}</ul>
    ${roadmapBlock}
    ${summary ? `<p class="ss-note ss-note--info" style="margin-top:0.75rem">${summary}</p>` : ""}`;
}

function reset(stage, options) {
  const items = flow(options || read(document.querySelector('[data-demo="app-state"]')));
  renderFlow(stage, items, items.length, -1, "Idle — choose options, then press Start to map the first release.");
}

function build(options) {
  const p = PROBLEM[options.problem] || PROBLEM.bookings;
  const items = flow(options);

  const steps = items.map((item, i) => ({
    log: `${item.state} — ${item.role}: ${item.detail}`,
    status: `Mapping first release… state ${i + 1} of ${items.length + 1}.`,
    render: (stage) => renderFlow(stage, items, i + 1, i),
  }));

  const summary = `Synthetic map for "${p.label.toLowerCase()}": the core flow ships first across user, staff and system states, with ${p.defer.length} features deferred to a roadmap. This maps structure only — it does not estimate cost, effort or delivery time.`;

  steps.push({
    log: `Roadmap recorded: ${p.defer.join(", ")}.`,
    status: "First release mapped. Reset to try another combination.",
    render: (stage) => renderFlow(stage, items, items.length, -1, summary, p.defer),
  });

  return steps;
}

function ready() {
  if (window.SilverstoneDemo) {
    window.SilverstoneDemo.register("app-state", {
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
