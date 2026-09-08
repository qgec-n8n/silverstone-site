/**
 * Phone-only secondary-hero copy for the two hubs.
 *
 * The hub compositions pass their hero copy inline rather than through a copy
 * module, so the phone variants live here as named constants: it keeps the
 * budgets (`MOBILE_HERO_*`) enforceable from the unit test that covers every
 * other route's `mobile` block.
 */
import type { MobileHeroCopy } from "~/features/services-v2/content/mobile-hero";

/** `/services` — the seven-discipline hub. */
export const SERVICES_HUB_MOBILE_HERO: MobileHeroCopy = {
  tagline: "Seven disciplines, *one operating standard*",
  points: [
    "Scoped before it is built",
    "Human judgment designed in",
    "Measured after launch",
  ],
};

/** `/industry` — the ten-sector hub. */
export const INDUSTRIES_HUB_MOBILE_HERO: MobileHeroCopy = {
  tagline: "Sector-specific systems, *not generic automation*",
  points: ["Ten sectors, US and UK", "Your source of truth", "Verified client results"],
};
