import { motion, type Variants } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

type TimelineContentProps<T extends keyof JSX.IntrinsicElements = "div"> = {
  as?: T;
  className?: string;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement>;
  customVariants?: Variants;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "ref">;

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export function TimelineContent<T extends keyof JSX.IntrinsicElements = "div">(
  props: TimelineContentProps<T>,
) {
  const {
    as,
    className,
    animationNum = 0,
    customVariants,
    children,
    ...rest
  } = props;

  const Component = (as || "div") as keyof JSX.IntrinsicElements;
  const MotionComponent = motion(Component);
  const variants = customVariants || defaultVariants;

  return (
    <MotionComponent
      variants={variants}
      custom={animationNum}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={cn("relative", className)}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
