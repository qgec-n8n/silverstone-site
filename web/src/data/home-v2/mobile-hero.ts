/**
 * Phone-only copy for the homepage's secondary hero ("The London AI agency").
 *
 * The homepage hero is its own component (an `h2` title, two-line capability
 * items), but on phones it renders the same stack as the shared secondary hero,
 * so it needs the same shape of copy. The three points compress the desktop
 * capability labels — the seven services in three chips — so the phone fold
 * still says what Silverstone AI is and where it works; nothing new is
 * claimed on the smaller screen. They render directly above the live-signal
 * board (see `.ss-hv2-secondary .ss-mhero__manifest` in home-v2.css), so the
 * phone fold names the service terms the page targets — agents, voice agents,
 * workflow automation, web, apps, consulting — rather than only the figures.
 */
import type { MobileHeroCopy } from "~/features/services-v2/content/mobile-hero";

export const HOME_MOBILE_HERO: MobileHeroCopy = {
  tagline: "Built in London *for UK and US businesses*",
  points: [
    "AI agents & voice agents",
    "AI workflow automation",
    "Web, apps & AI consulting",
  ],
};
