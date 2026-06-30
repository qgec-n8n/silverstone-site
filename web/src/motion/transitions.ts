import type { Transition } from "motion/react";

import { motionDurations, motionEasings, motionSprings } from "./tokens";

export const motionTransitions = {
  feedback: {
    duration: motionDurations.feedback,
    ease: motionEasings.standard,
  },
  micro: {
    duration: motionDurations.micro,
    ease: motionEasings.standard,
  },
  ui: {
    duration: motionDurations.ui,
    ease: motionEasings.standard,
  },
  panel: {
    duration: motionDurations.panel,
    ease: motionEasings.inOut,
  },
  route: {
    duration: motionDurations.route,
    ease: motionEasings.entrance,
  },
  cinematic: {
    duration: motionDurations.cinematic,
    ease: motionEasings.emphasized,
  },
  reduced: {
    duration: motionDurations.reduced,
    ease: motionEasings.linear,
  },
  springs: motionSprings,
} satisfies Record<string, Transition | typeof motionSprings>;

export const defaultMotionTransition: Transition = motionTransitions.ui;
