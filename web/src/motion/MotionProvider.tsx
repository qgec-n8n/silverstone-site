import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

import { loadDomMaxFeatures } from "./features";
import { defaultMotionTransition } from "./transitions";

type MotionProviderProps = {
  children: ReactNode;
};

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user" transition={defaultMotionTransition}>
      <LazyMotion features={loadDomMaxFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
