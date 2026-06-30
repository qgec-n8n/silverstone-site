import type { ComponentPropsWithoutRef, ReactNode } from "react";
import * as m from "motion/react-m";

import { motionViewport } from "../tokens";
import { revealVariants, staggerGroupVariants } from "../variants";

type MotionDivProps = Omit<ComponentPropsWithoutRef<typeof m.div>, "children"> & {
  children: ReactNode;
};

type MotionSectionProps = Omit<
  ComponentPropsWithoutRef<typeof m.section>,
  "children"
> & {
  children: ReactNode;
};

export function MotionSection({ children, ...props }: MotionSectionProps) {
  return (
    <m.section
      initial="hidden"
      variants={revealVariants}
      viewport={motionViewport.standard}
      whileInView="show"
      {...props}
    >
      {children}
    </m.section>
  );
}

export function Reveal({ children, ...props }: MotionDivProps) {
  return (
    <m.div
      initial="hidden"
      variants={revealVariants}
      viewport={motionViewport.standard}
      whileInView="show"
      {...props}
    >
      {children}
    </m.div>
  );
}

export function StaggerGroup({ children, ...props }: MotionDivProps) {
  return (
    <m.div initial="hidden" animate="show" variants={staggerGroupVariants} {...props}>
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, ...props }: MotionDivProps) {
  return (
    <m.div variants={revealVariants} {...props}>
      {children}
    </m.div>
  );
}
