import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import "~/styles/visual/visual.css";

import { useReducedMotion } from "~/components/accessibility/use-reduced-motion";

export type DemoStep = {
  id: string;
  log: string;
  status: string;
  render: () => ReactNode;
};

export type DemoScenario = {
  id: string;
  title: string;
  summary: string;
  safeguard: string;
  temporal?: boolean;
  interval?: number;
  idle: () => ReactNode;
  build: () => DemoStep[];
};

type Phase = "idle" | "running" | "paused" | "done";

const READY = "Ready. Press Start to run this synthetic scenario.";
const RUNNING = "Running synthetic scenario…";
const COMPLETE = "Scenario complete. Press Reset to run it again.";
const COMPLETE_INSTANT =
  "Scenario complete (reduced motion: shown instantly). Press Reset to run it again.";
const PAUSED = "Paused. Press Resume to continue.";

/**
 * Accessible, reduced-motion-aware controller for the synthetic page demos.
 * Start/Pause/Reset drive a deterministic step list; each step contributes a
 * stage render, a status line and a live-log entry. Reduced motion replays the
 * whole scenario instantly (no information is hidden behind motion). Pause is
 * only offered for genuinely time-based (`temporal`) instruments.
 */
export function DemoShell({ scenario }: { scenario: DemoScenario }) {
  const { reducedMotion } = useReducedMotion();
  const interval = scenario.interval ?? 720;
  const temporal = scenario.temporal ?? false;

  const [stage, setStage] = useState<ReactNode>(() => scenario.idle());
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState(READY);
  const [phase, setPhase] = useState<Phase>("idle");

  const timerRef = useRef<number | null>(null);
  const stepsRef = useRef<DemoStep[]>([]);
  const indexRef = useRef(0);
  const tickRef = useRef<() => void>(() => undefined);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    stepsRef.current = [];
    indexRef.current = 0;
    setStage(scenario.idle());
    setLogs([]);
    setStatus(READY);
    setPhase("idle");
  }, [clearTimer, scenario]);

  const tick = useCallback(() => {
    const steps = stepsRef.current;
    const step = steps[indexRef.current];

    if (step === undefined) {
      clearTimer();
      setStatus(COMPLETE);
      setPhase("done");
      return;
    }

    setStage(step.render());
    setStatus(step.status);
    setLogs((previous) => [...previous, step.log]);
    indexRef.current += 1;

    if (indexRef.current >= steps.length) {
      clearTimer();
      setStatus(COMPLETE);
      setPhase("done");
      return;
    }

    timerRef.current = window.setTimeout(() => {
      tickRef.current();
    }, interval);
  }, [clearTimer, interval]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const start = useCallback(() => {
    clearTimer();
    const steps = scenario.build();
    stepsRef.current = steps;
    indexRef.current = 0;
    setLogs([]);

    if (reducedMotion) {
      const finalStep = steps.at(-1);
      setStage(finalStep ? finalStep.render() : scenario.idle());
      setLogs(steps.map((step) => step.log));
      setStatus(COMPLETE_INSTANT);
      setPhase("done");
      return;
    }

    setStatus(RUNNING);
    setPhase("running");
    tick();
  }, [clearTimer, reducedMotion, scenario, tick]);

  const togglePause = useCallback(() => {
    if (!temporal) {
      return;
    }

    if (phase === "running") {
      clearTimer();
      setStatus(PAUSED);
      setPhase("paused");
      return;
    }

    if (phase === "paused") {
      setStatus(RUNNING);
      setPhase("running");
      tick();
    }
  }, [clearTimer, phase, temporal, tick]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const logId = `${scenario.id}-log`;

  return (
    <div className="ss-demo" data-demo={scenario.id}>
      <div className="ss-demo__head">
        <div>
          <h3 className="ss-demo__title">{scenario.title}</h3>
          <p className="ss-demo__summary">{scenario.summary}</p>
        </div>
        <div className="ss-demo__controls">
          <button
            type="button"
            className="ss-demo__btn ss-demo__btn--primary"
            data-demo-action="start"
            onClick={start}
          >
            {phase === "done" ? "Replay" : "Start"}
          </button>
          {temporal ? (
            <button
              type="button"
              className="ss-demo__btn"
              data-demo-action="pause"
              onClick={togglePause}
              aria-pressed={phase === "paused"}
              disabled={phase !== "running" && phase !== "paused"}
            >
              {phase === "paused" ? "Resume" : "Pause"}
            </button>
          ) : null}
          <button
            type="button"
            className="ss-demo__btn"
            data-demo-action="reset"
            onClick={reset}
            disabled={phase === "idle"}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="ss-demo__stage" data-demo-stage="">
        {stage}
      </div>

      <p
        className="ss-demo__status"
        data-demo-status=""
        role="status"
        aria-live="polite"
      >
        {status}
      </p>

      <div className="ss-demo__log-wrap">
        <h4 className="ss-demo__log-title" id={logId}>
          Event log
        </h4>
        <ol
          className="ss-demo__log"
          data-demo-log=""
          aria-live="polite"
          aria-labelledby={logId}
        >
          {logs.map((entry, position) => (
            <li key={`${scenario.id}-${String(position)}-${entry}`}>{entry}</li>
          ))}
        </ol>
      </div>

      <p className="ss-note ss-note--info">{scenario.safeguard}</p>
    </div>
  );
}
