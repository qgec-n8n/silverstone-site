/**
 * Phone-only copy for the homepage's "The Silverstone System" secondary hero.
 *
 * The homepage hero is its own component (an `h2` title, two-line capability
 * items), but on phones it renders the same stack as the shared secondary hero,
 * so it needs the same shape of copy. The three points restate the desktop
 * capability labels — nothing new is claimed on the smaller screen.
 */
import type { MobileHeroCopy } from "~/features/services-v2/content/mobile-hero";

export const HOME_MOBILE_HERO: MobileHeroCopy = {
  tagline: "Every call, message and booking *in one layer*",
  points: ["No lock-in pilots", "Live in weeks", "Human-in-the-loop"],
};
