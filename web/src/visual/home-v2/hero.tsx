import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import type { Ref } from "react";

import { Container } from "~/components/layout/container";
import { useHydrated } from "~/lib/use-hydrated";

import { ExploreSystemButton } from "./explore-system-button";
import { AETHER_ROUTE_PALETTES, HeroAetherField } from "./hero-aether-field";

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    // Instant: the only transition INTO `hidden` happens on the first
    // post-hydration render, underneath the opaque loader overlay. Animating
    // it would just burn time on a frame nobody can see.
    transition: { duration: 0 },
  },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.62 + index * 0.24, duration: 1.05, ease: "easeInOut" },
  }),
};

type HeroProps = {
  exploreButtonDisabled?: boolean;
  exploreButtonLayoutEnabled?: boolean;
  exploreButtonRef?: Ref<HTMLButtonElement>;
  hideExploreButton?: boolean;
  motionEnabled: boolean;
  onExplore: () => void;
  /**
   * Whether the homepage state machine has released the hero (intro / opening
   * / closing). False while the loader is still up, and once the body owns the
   * screen — but the hero stays MOUNTED either way, so its heading, lead and
   * copy are always present in the prerendered document.
   */
  revealed?: boolean;
};

/**
 * V2 primary hero — a single full-viewport stage built on the supplied Aether
 * Flow field. While the homepage is locked it owns the screen with only the
 * kicker, display title, lead and the lone "Explore the system" action; that
 * action morphs into the body and releases the lock. The live-signal console and
 * capability proof open the body in {@link SecondaryHero}.
 */
export function Hero({
  exploreButtonDisabled = false,
  exploreButtonLayoutEnabled = true,
  exploreButtonRef,
  hideExploreButton = false,
  motionEnabled,
  onExplore,
  revealed = true,
}: HeroProps) {
  const hydrated = useHydrated();
  /*
   * The entrance is driven by the homepage STATE, not by mounting, so the hero
   * can stay in the tree from the very first byte of HTML.
   *
   * Prerender and the hydration render both resolve to `show`, so the static
   * document carries the real H1 and lead as visible copy (no `opacity: 0`
   * baked into the HTML for a crawler to discount). The first post-hydration
   * render then snaps to `hidden` — invisible, because the loader overlay owns
   * the screen at that point — and the loader → intro transition plays the
   * staged reveal exactly as it did when the hero was mounted on demand.
   *
   * With motion disabled (reduced motion / low power) the hero simply stays at
   * `show` and never animates, matching the previous behavior.
   */
  const atRest = !motionEnabled || !hydrated || revealed;

  return (
    <section className="ss-hv2-hero">
      <HeroAetherField enabled={motionEnabled} palette={AETHER_ROUTE_PALETTES["/"]} />
      <div className="ss-hv2-hero__veil" aria-hidden="true" />

      <Container size="wide" className="relative z-10">
        <m.div
          initial={false}
          animate={atRest ? "show" : "hidden"}
          className="ss-hv2-hero__content flex flex-col items-center gap-7 text-center"
        >
          <m.span
            variants={item}
            custom={0}
            className="ss-hv2-aether-reveal ss-hv2-kicker ss-eyebrow font-mono"
          >
            <span className="ss-hv2-kicker__dot" aria-hidden="true" />
            London AI automation agency · UK & US
          </m.span>

          <m.h1
            variants={item}
            custom={1}
            className="ss-hv2-aether-reveal ss-hv2-display ss-hv2-hero__title"
          >
            The London AI automation agency for businesses that{" "}
            <span className="ss-chrome-text">refuse to miss</span>.
          </m.h1>

          <m.p
            variants={item}
            custom={2}
            className="ss-lead ss-hv2-hero__lead text-[color:var(--ss-v2-titanium)]"
          >
            <span className="ss-hv2-hero__lead-full">
              Silverstone AI is a London-based AI automation agency. We design AI
              agents, AI voice agents and receptionists, workflow automation, websites
              and apps, and provide AI consulting for UK and US businesses, so every
              call is answered, every inquiry is captured and the repetitive work runs
              itself.
            </span>
            <span className="ss-hv2-hero__lead-short">
              Silverstone AI is a London-based AI automation agency building AI agents,
              voice agents, workflow automation, websites and apps, with AI consulting,
              for UK and US businesses.
            </span>
          </m.p>

          {hideExploreButton ? null : (
            <m.div
              variants={item}
              custom={3}
              className="ss-hv2-hero__actions flex flex-wrap items-center justify-center gap-4"
            >
              <ExploreSystemButton
                ref={exploreButtonRef}
                disabled={exploreButtonDisabled}
                layoutEnabled={exploreButtonLayoutEnabled}
                onActivate={onExplore}
                palette={AETHER_ROUTE_PALETTES["/"]}
              />
            </m.div>
          )}
        </m.div>
      </Container>
    </section>
  );
}
