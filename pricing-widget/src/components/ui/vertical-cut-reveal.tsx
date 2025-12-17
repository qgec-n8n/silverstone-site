import { motion, type Transition } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

type VerticalCutRevealProps = {
  children: string;
  splitBy?: "words" | "chars";
  staggerDuration?: number;
  staggerFrom?: "first" | "last";
  reverse?: boolean;
  containerClassName?: string;
  className?: string;
  transition?: Transition;
};

export function VerticalCutReveal({
  children,
  splitBy = "words",
  staggerDuration = 0.08,
  staggerFrom = "first",
  reverse = false,
  containerClassName,
  className,
  transition,
}: VerticalCutRevealProps) {
  const parts = React.useMemo(() => {
    if (splitBy === "chars") return children.split("");
    return children.split(/\s+/);
  }, [children, splitBy]);

  return (
    <span className={cn("inline-flex flex-wrap gap-2", containerClassName)}>
      {parts.map((part, idx) => {
        const index =
          reverse || staggerFrom === "last"
            ? parts.length - 1 - idx
            : idx;
        const delay = index * staggerDuration;

        return (
          <motion.span
            key={`${part}-${idx}`}
            initial={{ y: 26, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 28,
              delay,
              ...transition,
            }}
            className={cn("inline-block", className)}
          >
            {part}
          </motion.span>
        );
      })}
    </span>
  );
}
