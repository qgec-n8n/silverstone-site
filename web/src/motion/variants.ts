import type { Variants } from "motion/react";

import {
  motionDelays,
  motionDistances,
  motionDurations,
  motionEasings,
  motionScale,
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

export const shellRouteVariants: Variants = {
  initial: {
    opacity: 0,
    y: motionDistances.micro,
    filter: "blur(2px)",
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionDurations.panel,
      ease: motionEasings.entrance,
    },
  },
  exit: {
    opacity: 0,
    y: -motionDistances.micro,
    filter: "blur(0px)",
    transition: {
      duration: motionDurations.ui,
      ease: motionEasings.exit,
    },
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

export const menuPanelVariants: Variants = {
  closed: {
    opacity: 0,
    y: -motionDistances.micro,
    scale: 0.985,
    transition: {
      duration: motionDurations.micro,
      ease: motionEasings.exit,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: motionDurations.panel,
      ease: motionEasings.entrance,
      when: "beforeChildren",
      staggerChildren: motionStaggers.dense,
    },
  },
};

export const menuItemVariants: Variants = {
  closed: {
    opacity: 0,
    y: motionDistances.micro,
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.ui,
      ease: motionEasings.entrance,
    },
  },
};

export const mobileOverlayVariants: Variants = {
  closed: {
    opacity: 0,
    transition: {
      duration: motionDurations.micro,
      ease: motionEasings.exit,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: motionDurations.ui,
      ease: motionEasings.standard,
    },
  },
};

export const mobilePanelVariants: Variants = {
  closed: {
    x: "100%",
    transition: {
      duration: motionDurations.panel,
      ease: motionEasings.exit,
    },
  },
  open: {
    x: 0,
    transition: {
      duration: motionDurations.panel,
      ease: motionEasings.entrance,
      when: "beforeChildren",
      staggerChildren: motionStaggers.standard,
    },
  },
};

export const pressableVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: motionScale.hover,
    y: -1,
    transition: {
      duration: motionDurations.micro,
      ease: motionEasings.standard,
    },
  },
  tap: {
    scale: motionScale.press,
    y: 0,
    transition: {
      duration: motionDurations.feedback,
      ease: motionEasings.standard,
    },
  },
};

export const cardInteractionVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: -4,
    scale: 1.005,
    transition: {
      duration: motionDurations.ui,
      ease: motionEasings.entrance,
    },
  },
};

export const faqContentVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: motionDurations.ui,
      ease: motionEasings.exit,
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: motionDurations.panel,
      ease: motionEasings.entrance,
    },
  },
};
