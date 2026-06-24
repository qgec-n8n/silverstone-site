import { useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

import { useReducedMotion } from "~/components/accessibility/use-reduced-motion";
import { industryLinks, serviceLinks } from "~/components/layout/nav-data";

const MIN_VISIBLE_MS = 1500;

type RouteIntro = {
  eyebrow: string;
  family: string;
  title: string;
};

const DEFAULT_INTRO: RouteIntro = {
  eyebrow: "Silverstone AI",
  family: "intelligence",
  title: "Loading",
};

const HOME_INTRO: RouteIntro = {
  eyebrow: "Silverstone AI",
  family: "intelligence",
  title: "Bringing the studio into focus",
};

const SERVICES_INTRO: RouteIntro = {
  eyebrow: "Capabilities",
  family: "engineering",
  title: "Lining up the capabilities",
};

const BLOG_INTRO: RouteIntro = {
  eyebrow: "Insights",
  family: "signal",
  title: "Gathering the latest thinking",
};

const STATIC_INTROS: Record<string, RouteIntro> = {
  "/": HOME_INTRO,
  "/about": {
    eyebrow: "Studio",
    family: "intelligence",
    title: "Opening the studio doors",
  },
  "/how-we-work": {
    eyebrow: "Process",
    family: "automation",
    title: "Mapping the way we work",
  },
  "/services": SERVICES_INTRO,
  "/industries": {
    eyebrow: "Industries",
    family: "signal",
    title: "Bringing your sector into view",
  },
  "/blog": BLOG_INTRO,
  "/pricing": {
    eyebrow: "Pricing",
    family: "engineering",
    title: "Laying out the options",
  },
  "/book": {
    eyebrow: "Discovery",
    family: "intelligence",
    title: "Setting up your discovery call",
  },
  "/contact": {
    eyebrow: "Contact",
    family: "signal",
    title: "Opening a line to the studio",
  },
  "/privacy-policy": {
    eyebrow: "Legal",
    family: "assurance",
    title: "Loading the details",
  },
};

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
  }
  return pathname;
}

function getRouteIntro(pathname: string | null): RouteIntro {
  if (pathname === null) {
    return DEFAULT_INTRO;
  }

  const path = normalizePath(pathname);

  const staticIntro = STATIC_INTROS[path];
  if (staticIntro !== undefined) {
    return staticIntro;
  }

  const service = serviceLinks.find((link) => link.href === path);
  if (service !== undefined) {
    return {
      eyebrow: "Capabilities",
      family: service.family ?? "engineering",
      title: `Preparing ${service.label}`,
    };
  }

  const industry = industryLinks.find((link) => link.href === path);
  if (industry !== undefined) {
    return {
      eyebrow: "Industries",
      family: "signal",
      title: `Bringing ${industry.label} into view`,
    };
  }

  if (path.startsWith("/blog/")) {
    return BLOG_INTRO;
  }

  if (path.startsWith("/services/")) {
    return SERVICES_INTRO;
  }

  return DEFAULT_INTRO;
}

function BrandedRouteLoader() {
  const navigation = useNavigation();
  const { reducedMotion } = useReducedMotion();

  const isNavigating = navigation.state !== "idle";
  const destination = navigation.location?.pathname ?? null;

  const [linger, setLinger] = useState(false);
  const [intro, setIntro] = useState<RouteIntro>(DEFAULT_INTRO);

  const shownAtRef = useRef<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isNavigating) {
      shownAtRef.current ??= Date.now();
      if (hideTimerRef.current !== null) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      const nextIntro = getRouteIntro(destination);
      const frame = window.requestAnimationFrame(() => {
        setIntro(nextIntro);
        setLinger(true);
      });
      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    if (shownAtRef.current === null) {
      return;
    }

    const elapsed = Date.now() - shownAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    hideTimerRef.current = setTimeout(() => {
      shownAtRef.current = null;
      hideTimerRef.current = null;
      setLinger(false);
    }, remaining);

    return () => {
      if (hideTimerRef.current !== null) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [isNavigating, destination]);

  const visible = isNavigating || linger;
  const iconMotion = reducedMotion
    ? {}
    : {
        animate: { opacity: [0.65, 1, 0.65] },
        transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-live="polite"
          className="ss-route-loader fixed inset-0 z-[900] grid place-items-center bg-[var(--ss-v2-ink-900)]"
          data-family={intro.family}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          role="status"
          transition={{ duration: reducedMotion ? 0 : 0.4 }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,color-mix(in_srgb,var(--ss-v2-family)_20%,transparent),transparent_62%)]"
          />
          <div className="relative flex flex-col items-center gap-5 px-6 text-center">
            <motion.img
              {...iconMotion}
              alt=""
              className="size-12 drop-shadow-[var(--ss-v2-glow-family)]"
              height={48}
              src="/brand/silverstone-icon.png"
              width={48}
            />
            <div className="flex flex-col items-center gap-1.5">
              <p className="ss-mono-label text-[color:var(--ss-v2-family)]">
                {intro.eyebrow}
              </p>
              <p className="font-display text-h6 font-medium text-foreground">
                {intro.title}
              </p>
            </div>
            <div className="relative h-0.5 w-44 overflow-hidden rounded-full bg-[var(--ss-v2-glass-border)]">
              {reducedMotion ? (
                <span className="absolute inset-y-0 left-0 w-full rounded-full bg-[var(--ss-v2-family)]" />
              ) : (
                <motion.span
                  animate={{ x: ["-120%", "320%"] }}
                  className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[var(--ss-v2-family)]"
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>
            <span className="sr-only">
              {intro.eyebrow}: {intro.title}
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export { BrandedRouteLoader };
