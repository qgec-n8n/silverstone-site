import { type Variants } from "motion/react";
import * as m from "motion/react-m";
import type { Ref } from "react";

import { Container } from "~/components/layout/container";
import type { RouteExperience } from "~/data/route-experiences";
import { ExploreSystemButton } from "~/visual/home-v2/explore-system-button";
import {
  AETHER_INDUSTRIES_PALETTE,
  HeroAetherField,
} from "~/visual/home-v2/hero-aether-field";

const familyMotion: Record<RouteExperience["family"], { delay: number; y: number }> = {
  home: { delay: 0.2, y: 18 },
  service: { delay: 0.18, y: 20 },
  industry: { delay: 0.14, y: 18 },
  article: { delay: 0.12, y: 16 },
  directory: { delay: 0.16, y: 18 },
  company: { delay: 0.2, y: 16 },
  conversion: { delay: 0.14, y: 14 },
  legal: { delay: 0.16, y: 12 },
  utility: { delay: 0.12, y: 14 },
};

const introItem: Variants = {
  hidden: (custom: { index: number; y: number }) => ({
    opacity: 0,
    y: custom.y,
    filter: "blur(10px)",
  }),
  show: (custom: { delay: number; index: number }) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.42 + custom.index * custom.delay,
      duration: 0.82,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

type RouteExperienceIntroProps = {
  buttonDisabled: boolean;
  buttonHidden: boolean;
  buttonRef: Ref<HTMLButtonElement>;
  experience: RouteExperience;
  motionEnabled: boolean;
  onExplore: () => void;
};

export function RouteExperienceIntro({
  buttonDisabled,
  buttonHidden,
  buttonRef,
  experience,
  motionEnabled,
  onExplore,
}: RouteExperienceIntroProps) {
  const motion = familyMotion[experience.family];
  // The Industries page family (nine industry routes + the /industries hub)
  // signals itself with a violet Aether palette; behaviour is unchanged.
  const industriesFamily =
    experience.family === "industry" || experience.path === "/industry";

  return (
    <section
      className="ss-service-intro ss-route-intro"
      data-route-family={experience.family}
      aria-label={`${experience.title} intro`}
    >
      <HeroAetherField
        enabled={motionEnabled}
        palette={industriesFamily ? AETHER_INDUSTRIES_PALETTE : undefined}
      />
      <div className="ss-hv2-hero__grid" aria-hidden="true" />
      <div className="ss-hv2-hero__veil" aria-hidden="true" />

      <Container size="wide" className="relative z-10">
        <m.div
          animate="show"
          className="ss-service-intro__content flex flex-col items-center gap-7 text-center"
          initial={motionEnabled ? "hidden" : false}
        >
          <m.span
            className="ss-hv2-aether-reveal ss-hv2-kicker ss-eyebrow font-mono"
            custom={{ delay: motion.delay, index: 0, y: motion.y }}
            variants={introItem}
          >
            <span className="ss-hv2-kicker__dot" aria-hidden="true" />
            {experience.pill}
          </m.span>

          <m.h1
            className="ss-hv2-aether-reveal ss-hv2-display ss-service-intro__title"
            custom={{ delay: motion.delay, index: 1, y: motion.y }}
            variants={introItem}
          >
            {experience.title}
          </m.h1>

          <m.p
            className="ss-lead ss-service-intro__lead text-[color:var(--ss-v2-titanium)]"
            custom={{ delay: motion.delay, index: 2, y: motion.y }}
            variants={introItem}
          >
            {experience.subtitle}
          </m.p>

          {buttonHidden ? null : (
            <m.div
              className="flex flex-wrap items-center justify-center gap-4"
              custom={{ delay: motion.delay, index: 3, y: motion.y }}
              variants={introItem}
            >
              <ExploreSystemButton
                ref={buttonRef}
                disabled={buttonDisabled}
                label={experience.buttonLabel}
                onActivate={onExplore}
              />
            </m.div>
          )}
        </m.div>
      </Container>
    </section>
  );
}
