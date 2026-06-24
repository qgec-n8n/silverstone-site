/**
 * The Silverstone method — process story rendered as a pinned/scrolling
 * narrative on the V2 homepage.
 */

export type ProcessStep = {
  id: string;
  number: string;
  title: string;
  summary: string;
  detail: string;
  outcome: string;
  icon: string;
};

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: "audit",
    number: "01",
    title: "Audit",
    summary: "We map where time and revenue leak.",
    detail:
      "A free, structured automation audit traces every call, enquiry and admin loop across your operation to find the highest-leverage wins.",
    outcome: "A prioritised opportunity map",
    icon: "Search",
  },
  {
    id: "blueprint",
    number: "02",
    title: "Blueprint",
    summary: "We design the system before we build it.",
    detail:
      "Each workflow is specified end to end — triggers, guardrails, the tools it touches and the human checkpoints that keep you in control.",
    outcome: "A signed-off automation blueprint",
    icon: "PencilRuler",
  },
  {
    id: "build",
    number: "03",
    title: "Build & integrate",
    summary: "We connect it to the tools you already use.",
    detail:
      "Voice, messaging, calendars and back-office systems are wired together and tested against real scenarios until they hold up live.",
    outcome: "A working system in weeks, not quarters",
    icon: "Workflow",
  },
  {
    id: "optimise",
    number: "04",
    title: "Launch & optimise",
    summary: "We watch it run and tune what matters.",
    detail:
      "After go-live we monitor performance, refine prompts and routing, and compound results — with a human always reviewing the signal.",
    outcome: "Measurable wins that keep improving",
    icon: "TrendingUp",
  },
] as const;
