/*
  Defined call flow — synthetic, TEMPORAL demo scenario for the voice agents page.

  The visitor chooses a call type and plays the flow. A synthetic transcript
  moves through disclosure, intent, capture, an approved-rules check and a clear
  ending (action or human handoff). It is deterministic and synthetic — no real
  call, no real audio, no voice impersonation, no claim of human equivalence.
*/

const CALL = {
  routine: {
    label: "Routine — opening hours",
    lines: [
      { who: "Assistant", text: "Hi — you're speaking to an automated assistant. How can I help?" },
      { who: "Caller", text: "What time do you open on Saturday?" },
      { who: "System", text: "Intent: opening-hours enquiry." },
      { who: "System", text: "Approved-rules check: answer from approved opening hours only." },
      { who: "Assistant", text: "We're open 9am to 1pm on Saturdays. Anything else?" },
    ],
    ending: "Routine call answered from approved content. No personal data captured.",
  },
  actionable: {
    label: "Actionable — book a slot",
    lines: [
      { who: "Assistant", text: "Hi — you're speaking to an automated assistant. How can I help?" },
      { who: "Caller", text: "I'd like to book an appointment next week." },
      { who: "System", text: "Intent: booking request." },
      { who: "System", text: "Capture: name and preferred day only — the minimum needed." },
      { who: "System", text: "Approved-rules check: slot offered from the live calendar rules." },
      { who: "Assistant", text: "I can hold Tuesday at 10am. A person confirms the booking by message." },
    ],
    ending: "Booking request captured and queued. A named person confirms — automation does not finalise it.",
  },
  escalate: {
    label: "Escalate — sensitive matter",
    lines: [
      { who: "Assistant", text: "Hi — you're speaking to an automated assistant. How can I help?" },
      { who: "Caller", text: "It's quite urgent and personal, I'd rather speak to someone." },
      { who: "System", text: "Intent: sensitive / urgent matter." },
      { who: "System", text: "Approved-rules check: this category may not be automated." },
      { who: "Assistant", text: "I understand — I'm connecting you to a member of the team now." },
    ],
    ending: "Sensitive call routed straight to a named human owner. Automation handled none of the decision.",
  },
};

function read(root) {
  const el = root.querySelector('[name="type"]');
  return { type: el ? el.value : "routine" };
}

function renderTranscript(stage, lines, count, summary) {
  if (!stage) return;
  const rows = lines
    .slice(0, count)
    .map(
      (line) =>
        `<li class="ss-tile">
          <span class="ss-tile__label">${line.who}</span>
          <span class="ss-tile__value">${line.text}</span>
        </li>`,
    )
    .join("");
  stage.innerHTML = `
    <p class="ss-demo__synthetic">Synthetic call transcript</p>
    <ul style="display:grid; gap:0.5rem; list-style:none; margin:0.75rem 0 0; padding:0">${rows}</ul>
    ${summary ? `<p class="ss-note ss-note--info" style="margin-top:0.75rem">${summary}</p>` : ""}`;
}

function reset(stage, options) {
  const call = CALL[(options && options.type) || "routine"] || CALL.routine;
  renderTranscript(stage, call.lines, 0, "Idle — choose a call type, then press Play to run the synthetic flow.");
}

function build(options) {
  const call = CALL[options.type] || CALL.routine;
  const lines = call.lines;

  const steps = lines.map((line, i) => ({
    log: `${line.who}: ${line.text}`,
    status: `Call in progress… line ${i + 1} of ${lines.length + 1}.`,
    render: (stage) => renderTranscript(stage, lines, i + 1),
  }));

  const summary = `${call.ending} This is a synthetic, deterministic flow — not a real call, and not a person.`;

  steps.push({
    log: "Call ended (synthetic).",
    status: "Call complete. Reset to try another call type.",
    render: (stage) => renderTranscript(stage, lines, lines.length, summary),
  });

  return steps;
}

function ready() {
  if (window.SilverstoneDemo) {
    window.SilverstoneDemo.register("voice-callflow", {
      temporal: true,
      interval: 900,
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
