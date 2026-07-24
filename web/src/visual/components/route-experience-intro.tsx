import { type Variants } from "motion/react";
import * as m from "motion/react-m";
import type { Ref } from "react";

import { Container } from "~/components/layout/container";
import type { RouteExperience } from "~/data/route-experiences";
import { ExploreSystemButton } from "~/visual/home-v2/explore-system-button";
import {
  AETHER_INDUSTRIES_PALETTE,
  AETHER_INDUSTRY_PALETTES,
  AETHER_ROUTE_PALETTES,
  AETHER_SERVICE_PALETTES,
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
  // Each page family signals itself through the Aether palette: the standalone
  // core pages, the seven Services routes and the nine Industries routes each
  // carry their own registered two-colour scheme (matched to that page's copy
  // accent). The /industry hub falls back to the shared violet family
  // signature; anything still unmatched uses the default cyan field.
  const industriesFamily =
    experience.family === "industry" || experience.path === "/industry";
  const palette =
    AETHER_ROUTE_PALETTES[experience.path] ??
    AETHER_SERVICE_PALETTES[experience.path] ??
    AETHER_INDUSTRY_PALETTES[experience.path] ??
    (industriesFamily ? AETHER_INDUSTRIES_PALETTE : undefined);

  return (
    <section
      className="ss-service-intro ss-route-intro"
      data-route-family={experience.family}
      aria-label={`${experience.title} intro`}
    >
      <HeroAetherField enabled={motionEnabled} palette={palette} />
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

          {/*
            A `div`, not an `h1`. This splash is a teaser for the route, not the
            route's title — the real H1 lives in the body hero (`SecondaryHero`)
            and is the one in the prerendered HTML. Rendering this as an `h1`
            gave every gated non-home route a SECOND h1 the moment it hydrated
            (prerendered 1, hydrated 2, measured on production), invisible to
            the build's one-h1 gate because that gate only counts prerendered
            headings. The section already carries `aria-label="<title> intro"`,
            so the region keeps its accessible name without a heading. Both
            classes set every property the `h1` base rule did — font-family,
            size, weight, tracking, leading and max-width — so the rendering is
            byte-identical; see reports/seo/seojuice-699/session-2-validation.md.
          */}
          <m.div
            className="ss-hv2-aether-reveal ss-hv2-display ss-service-intro__title"
            custom={{ delay: motion.delay, index: 1, y: motion.y }}
            variants={introItem}
          >
            {experience.title}
          </m.div>

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
