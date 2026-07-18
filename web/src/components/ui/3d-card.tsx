import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  motionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import * as m from "motion/react-m";

import { cn } from "~/lib/utils";

type CardMotionContextValue = {
  active: boolean;
  enabled: boolean;
  glareBackground: MotionValue<string>;
};

const CardMotionContext = createContext<CardMotionContextValue>({
  active: false,
  enabled: false,
  glareBackground: motionValue("none"),
});

function useFineHoverPointer() {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setMatches(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return matches;
}

type CardContainerProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  tiltStrength?: number;
};

/**
 * Aceternity's 3D Card Effect, adapted for the app's strict LazyMotion setup.
 * The registry's perspective composition is preserved, while pointer motion is
 * spring-smoothed and disabled for touch, coarse pointers and reduced motion.
 */
export function CardContainer({
  children,
  className,
  containerClassName,
  tiltStrength = 3.25,
}: CardContainerProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const fineHoverPointer = useFineHoverPointer();
  const enabled = fineHoverPointer && !reduceMotion;
  const [active, setActive] = useState(false);
  const rotateXSource = useMotionValue(0);
  const rotateYSource = useMotionValue(0);
  const rotateX = useSpring(rotateXSource, {
    damping: 30,
    mass: 0.45,
    stiffness: 250,
  });
  const rotateY = useSpring(rotateYSource, {
    damping: 30,
    mass: 0.45,
    stiffness: 250,
  });
  const glareXSource = useMotionValue(50);
  const glareYSource = useMotionValue(36);
  const glareX = useSpring(glareXSource, { damping: 34, mass: 0.5, stiffness: 220 });
  const glareY = useSpring(glareYSource, { damping: 34, mass: 0.5, stiffness: 220 });
  const glareBackground = useMotionTemplate`radial-gradient(32rem 24rem at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.16), rgba(38, 221, 255, 0.07) 42%, transparent 72%)`;

  function reset() {
    setActive(false);
    rotateXSource.set(0);
    rotateYSource.set(0);
  }

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== "mouse") {
      return;
    }
    setActive(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateXSource.set(y * -tiltStrength * 2);
    rotateYSource.set(x * tiltStrength * 2);
    glareXSource.set((x + 0.5) * 100);
    glareYSource.set((y + 0.5) * 100);
  }

  return (
    <CardMotionContext.Provider value={{ active, enabled, glareBackground }}>
      <div
        className={cn("ss-3d-card", containerClassName)}
        data-3d-active={active ? "true" : "false"}
        data-3d-enabled={enabled ? "true" : "false"}
        onPointerCancel={reset}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={reset}
        onPointerMove={handlePointerMove}
      >
        <m.div
          className={cn("ss-3d-card__stage", className)}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            willChange: enabled ? "transform" : undefined,
          }}
        >
          {children}
        </m.div>
      </div>
    </CardMotionContext.Provider>
  );
}

/**
 * Glass-reflection layer that tracks the pointer inside a CardContainer.
 * Render it inside the card's clipped, rounded surface; CSS fades it in only
 * while the container reports `data-3d-active="true"`.
 */
export function CardGlare({ className }: { className?: string }) {
  const { glareBackground } = useContext(CardMotionContext);

  return (
    <m.span
      aria-hidden="true"
      className={cn("ss-3d-card__glare", className)}
      style={{ backgroundImage: glareBackground }}
    />
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("ss-3d-card__body", className)}>{children}</div>;
}

type CardItemProps = ComponentPropsWithoutRef<typeof m.div> & {
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
};

export function CardItem({
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: CardItemProps) {
  const { active, enabled } = useContext(CardMotionContext);
  const lifted = active && enabled;

  return (
    <m.div
      animate={{
        rotateX: lifted ? rotateX : 0,
        rotateY: lifted ? rotateY : 0,
        rotateZ: lifted ? rotateZ : 0,
        x: lifted ? translateX : 0,
        y: lifted ? translateY : 0,
        z: lifted ? translateZ : 0,
      }}
      className={cn("ss-3d-card__item", className)}
      data-3d-depth={String(translateZ)}
      transition={{ damping: 30, mass: 0.45, stiffness: 250, type: "spring" }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
