/**
 * Phone-only copy for the homepage's secondary hero ("The London AI agency").
 *
 * The homepage hero is its own component (an `h2` title, two-line capability
 * items), but on phones it renders the same stack as the shared secondary hero,
 * so it needs the same shape of copy. The three points compress the desktop
 * capability labels — the seven services in three chips — so the phone fold
 * still says what Silverstone AI is and where it works; nothing new is
 * claimed on the smaller screen.
 */
import type { MobileHeroCopy } from "~/features/services-v2/content/mobile-hero";

export const HOME_MOBILE_HERO: MobileHeroCopy = {
  tagline: "Built in London *for UK and US businesses*",
  points: [
    "AI agents & voice agents",
    "Workflow automation",
    "Web, apps & AI consulting",
  ],
};
