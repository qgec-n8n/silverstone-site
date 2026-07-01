export const motionDurations = {
  instant: 0,
  feedback: 0.1,
  micro: 0.14,
  ui: 0.22,
  panel: 0.32,
  route: 0.48,
  cinematic: 0.8,
  ambient: 1.2,
  reduced: 0.08,
} as const;

export const motionDelays = {
  none: 0,
  dense: 0.035,
  standard: 0.055,
  sparse: 0.085,
  route: 0.12,
} as const;

export const motionEasings = {
  standard: [0.22, 1, 0.36, 1],
  emphasized: [0.16, 1, 0.3, 1],
  entrance: [0.21, 0.74, 0.35, 1],
  exit: [0.4, 0, 1, 1],
  inOut: [0.65, 0, 0.35, 1],
  linear: "linear",
} as const;

export const motionSprings = {
  feedback: { type: "spring", stiffness: 520, damping: 34, mass: 0.55 },
  ui: { type: "spring", stiffness: 360, damping: 32, mass: 0.8 },
  layout: { type: "spring", stiffness: 300, damping: 34, mass: 0.9 },
  shared: { type: "spring", stiffness: 260, damping: 28, mass: 0.85 },
  soft: { type: "spring", stiffness: 180, damping: 26, mass: 1 },
} as const;

export const motionStaggers = {
  dense: motionDelays.dense,
  standard: motionDelays.standard,
  sparse: motionDelays.sparse,
  none: 0,
} as const;

export const motionViewport = {
  standard: { once: true, margin: "0px 0px -12% 0px", amount: 0.24 },
  early: { once: true, margin: "0px 0px -20% 0px", amount: 0.18 },
  precise: { once: true, margin: "0px", amount: 0.5 },
  block: { once: true, margin: "0px 0px -12% 0px", amount: "some" },
} as const;

export const motionDistances = {
  micro: 4,
  reveal: 20,
  section: 32,
  route: 48,
} as const;

export const motionScale = {
  press: 0.98,
  hover: 1.015,
  reveal: 0.98,
  emphasisMax: 1.03,
} as const;

export const motionBlur = {
  none: 0,
  soft: 4,
  maxOneShot: 8,
} as const;
