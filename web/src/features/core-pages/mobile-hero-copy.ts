/**
 * Phone-only secondary-hero copy for the six core pages.
 *
 * Like the hubs, the core compositions pass hero copy inline, so the phone
 * variants are named constants here — that is what lets the shared unit test
 * enforce the `MOBILE_HERO_*` character budgets on every route, not just the
 * ones backed by a copy module.
 */
import type { MobileHeroCopy } from "~/features/services-v2/content/mobile-hero";

/** `/about` */
export const ABOUT_MOBILE_HERO: MobileHeroCopy = {
  tagline: "One studio, *one line of accountability*",
  points: [
    "Six disciplines, one team",
    "London studio, US and UK",
    "Yale and Princeton trained",
  ],
};

/** `/book` */
export const BOOK_MOBILE_HERO: MobileHeroCopy = {
  tagline: "Thirty minutes, *one clear decision at the end*",
  points: ["A quick fit check", "Four questions, 30 minutes", "Choose a verified time"],
};

/** `/contact` */
export const CONTACT_MOBILE_HERO: MobileHeroCopy = {
  tagline: "Write first, *answered across US and UK hours*",
  points: ["Contact or Book", "A short inquiry form", "The London studio"],
};

/** `/how-we-work` */
export const HOW_WE_WORK_MOBILE_HERO: MobileHeroCopy = {
  tagline: "From a costly problem to *a governed live system*",
  points: ["Five gated stages", "Human judgment in charge", "Verified client results"],
};

/** `/blog` — the Insights index. */
export const INSIGHTS_MOBILE_HERO: MobileHeroCopy = {
  tagline: "Practical guides, *filed by service and sector*",
  points: ["Search every guide", "Three newest briefings", "Into services and pricing"],
};

/** `/pricing` */
export const PRICING_MOBILE_HERO: MobileHeroCopy = {
  tagline: "Published bands in *the currency you choose*",
  points: [
    "No hidden build costs",
    "ROI modeled before build",
    "24/7 on Premium and up",
  ],
};
