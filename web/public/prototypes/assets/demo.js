/*
  Silverstone prototype — shared demo shell controller.

  ONE shell for every route demo (web, app, voice, receptionist, content,
  automation, industry instruments). Demos are synthetic and deterministic.
  They never simulate a real client result or claim live integration.

  Contract (matches the design spec's seven-part shell):
    1. title + purpose                 — authored in HTML
    2. static scenario summary         — authored in HTML
    3. Start / Pause (temporal) / Reset— buttons with [data-demo-action]
    4. stage                           — [data-demo-stage]
    5. event log / status text         — [data-demo-log] (aria-live) + [data-demo-status]
    6. "demonstrates / does not" panel — authored in HTML (native <details>)
    7. fallback static diagram         — [data-demo-fallback], authored in HTML

  Accessibility:
    - keyboard only: all controls are native <button>/<select>
    - current step + result available as text (status + log)
    - reduced motion: instant step replacement, no timers, Pause hidden
    - no autoplay: a run only begins on explicit Start

  A page registers a scenario before this module needs it:

    window.SilverstoneDemo.register("web-conversion", {
      temporal: false,            // show Pause only when true
      interval: 720,              // ms between steps (full-motion only)
      read(root) { ... return options },           // optional
      reset(stageEl, options) { ... },             // initial/idle stage
      build(options) {                             // ordered steps
        return [ { log: "…", status: "…", render(stageEl){…} }, … ];
      },
    });
*/

const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const registry = new Map();

function register(id, scenario) {
  registry.set(id, scenario);
  // Scenarios live in page modules that execute AFTER this shell, so the
  // shell's initial initDemos() pass runs before they register and skips them
  // (no scenario yet). Wire the root here once the scenario exists. initOne is
  // idempotent, so this is safe whether or not the initial pass already ran.
  const root = document.querySelector(`[data-demo="${id}"]`);
  if (root) initOne(root);
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function appendLog(logEl, text) {
  if (!logEl) return;
  const li = document.createElement("li");
  li.className = "ss-demo__log-item";
  li.textContent = text;
  logEl.appendChild(li);
}

function clearLog(logEl) {
  if (logEl) logEl.textContent = "";
}

function initOne(root) {
  const id = root.getAttribute("data-demo");
  const scenario = registry.get(id);
  if (!scenario) return;
  // Idempotent: a root is wired exactly once. Both the initial initDemos() pass
  // and register() can reach here, but listeners must bind a single time.
  if (root.__ssDemoReady) return;

  root.__ssDemoReady = true;

  const stage = root.querySelector("[data-demo-stage]");
  const log = root.querySelector("[data-demo-log]");
  const status = root.querySelector("[data-demo-status]");
  const startBtn = root.querySelector('[data-demo-action="start"]');
  const pauseBtn = root.querySelector('[data-demo-action="pause"]');
  const resetBtn = root.querySelector('[data-demo-action="reset"]');

  const temporal = Boolean(scenario.temporal);
  const interval = Number(scenario.interval) || 720;

  let timer = null;
  let steps = [];
  let index = 0;
  let paused = false;

  if (pauseBtn && !temporal) pauseBtn.hidden = true;

  const readOptions = () =>
    typeof scenario.read === "function" ? scenario.read(root) : undefined;

  function toIdle() {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
    paused = false;
    index = 0;
    steps = [];
    clearLog(log);
    const options = readOptions();
    if (typeof scenario.reset === "function") scenario.reset(stage, options);
    setText(status, "Ready. Press Start to run this synthetic scenario.");
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = startBtn.dataset.labelStart || "Start";
    }
    if (pauseBtn && temporal) {
      pauseBtn.disabled = true;
      pauseBtn.setAttribute("aria-pressed", "false");
      pauseBtn.textContent = "Pause";
    }
  }

  function applyStep(step) {
    if (!step) return;
    if (typeof step.render === "function") step.render(stage);
    if (step.log) appendLog(log, step.log);
    if (step.status) setText(status, step.status);
  }

  function finish() {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
    setText(status, "Scenario complete. Reset to run it again.");
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = "Run again";
    }
    if (pauseBtn && temporal) {
      pauseBtn.disabled = true;
      pauseBtn.setAttribute("aria-pressed", "false");
      pauseBtn.textContent = "Pause";
    }
  }

  function tick() {
    if (paused) return;
    if (index >= steps.length) {
      finish();
      return;
    }
    applyStep(steps[index]);
    index += 1;
    if (index >= steps.length) {
      finish();
      return;
    }
    timer = window.setTimeout(tick, interval);
  }

  function start() {
    const options = readOptions();
    steps = scenario.build(options) || [];
    index = 0;
    paused = false;
    clearLog(log);

    if (reduce()) {
      // Instant step replacement — present the whole sequence as text + end state.
      for (const step of steps) applyStep(step);
      setText(status, "Scenario complete (reduced motion: shown instantly). Reset to run again.");
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "Run again";
      }
      return;
    }

    if (startBtn) {
      startBtn.disabled = true;
      startBtn.textContent = "Running…";
    }
    if (pauseBtn && temporal) {
      pauseBtn.disabled = false;
      pauseBtn.setAttribute("aria-pressed", "false");
      pauseBtn.textContent = "Pause";
    }
    setText(status, "Running synthetic scenario…");
    tick();
  }

  function togglePause() {
    if (!temporal) return;
    paused = !paused;
    pauseBtn.setAttribute("aria-pressed", String(paused));
    pauseBtn.textContent = paused ? "Resume" : "Pause";
    if (paused) {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
      setText(status, "Paused. Resume to continue.");
    } else {
      setText(status, "Running synthetic scenario…");
      timer = window.setTimeout(tick, interval);
    }
  }

  if (startBtn) startBtn.addEventListener("click", start);
  if (pauseBtn) pauseBtn.addEventListener("click", togglePause);
  if (resetBtn) resetBtn.addEventListener("click", toIdle);

  toIdle();
}

function initDemos() {
  const roots = Array.from(document.querySelectorAll("[data-demo]"));
  for (const root of roots) initOne(root);
}

window.SilverstoneDemo = { register };

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDemos);
} else {
  initDemos();
}
