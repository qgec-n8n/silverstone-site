import type { Variants } from "motion/react";

import {
  motionDelays,
  motionDistances,
  motionDurations,
  motionEasings,
  motionStaggers,
} from "./tokens";

export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: motionDistances.reveal,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.route,
      ease: motionEasings.entrance,
    },
  },
};

export const routeTransitionVariants: Variants = {
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.route,
      ease: motionEasings.entrance,
    },
  },
  exit: {
    opacity: 0,
    y: -motionDistances.micro,
    transition: {
      duration: motionDurations.ui,
      ease: motionEasings.exit,
    },
  },
  initial: {
    opacity: 0,
    y: motionDistances.micro,
  },
};

export const staggerGroupVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: motionDelays.none,
      staggerChildren: motionStaggers.standard,
    },
  },
};
