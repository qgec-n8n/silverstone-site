/**
 * Budget guard for the phone-only secondary-hero copy.
 *
 * The phone hero is hard-capped to one screen (see `tests/e2e/mobile-hero-fold.spec.ts`),
 * so its copy is a layout constraint, not just prose: a tagline that wraps to a
 * second line or a fourth word in a signal point costs stage height the fold
 * test has no margin for. Every route that renders a secondary hero must
 * therefore carry a `mobile` block, and every block is measured here against
 * the ceilings declared alongside the type.
 */
import { describe, expect, it } from "vitest";

import { HOME_MOBILE_HERO } from "~/data/home-v2/mobile-hero";
import { resolvePointIcons } from "~/features/services-v2/components/mobile-hero-stack";
import {
  ABOUT_MOBILE_HERO,
  BOOK_MOBILE_HERO,
  CONTACT_MOBILE_HERO,
  HOW_WE_WORK_MOBILE_HERO,
  INSIGHTS_MOBILE_HERO,
  PRICING_MOBILE_HERO,
} from "~/features/core-pages/mobile-hero-copy";
import {
  INDUSTRIES_HUB_MOBILE_HERO,
  SERVICES_HUB_MOBILE_HERO,
} from "~/features/hubs-v2/mobile-hero-copy";
import { industryCopyByRoute } from "~/features/industries-v2/content";
import { serviceCopyByRoute } from "~/features/services-v2/content/copy";
import {
  MOBILE_HERO_POINT_COUNT,
  MOBILE_HERO_POINT_MAX_CHARS,
  MOBILE_HERO_TAGLINE_MAX_CHARS,
  type MobileHeroCopy,
} from "~/features/services-v2/content/mobile-hero";

/**
 * `*emphasis*` markers are RichText syntax, not glyphs — they never reach the
 * screen, so they must not count against the tagline's measured width.
 */
function stripEmphasis(value: string): string {
  return value.replace(/[*`]/g, "");
}

/** Lower-cased word tokens, used to compare a tagline against its chips. */
function words(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

/**
 * Spellings the site standardised on (US English for readers in both markets).
 * Keyed by the offending variant so the failure message names the fix.
 */
const US_SPELLINGS: { wrong: RegExp; right: string }[] = [
  { wrong: /\benquir(y|ies|e|ed|ing)\b/i, right: "inquiry / inquiries" },
  { wrong: /\boptimis(e|ed|ing|ation)\b/i, right: "optimize" },
  { wrong: /\bcolour\b/i, right: "color" },
  { wrong: /\borganis(e|ed|ing|ation)\b/i, right: "organize" },
  { wrong: /\bprogramme\b/i, right: "program" },
];

const CASES: [route: string, copy: MobileHeroCopy | undefined][] = [
  ...Object.entries(serviceCopyByRoute).map(
    ([route, copy]) => [route, copy.mobile] as [string, MobileHeroCopy | undefined],
  ),
  ...Object.entries(industryCopyByRoute).map(
    ([route, copy]) => [route, copy.mobile] as [string, MobileHeroCopy | undefined],
  ),
  ["/services", SERVICES_HUB_MOBILE_HERO],
  ["/industry", INDUSTRIES_HUB_MOBILE_HERO],
  ["/about", ABOUT_MOBILE_HERO],
  ["/book", BOOK_MOBILE_HERO],
  ["/contact", CONTACT_MOBILE_HERO],
  ["/how-we-work", HOW_WE_WORK_MOBILE_HERO],
  ["/blog", INSIGHTS_MOBILE_HERO],
  ["/pricing", PRICING_MOBILE_HERO],
  ["/ (homepage system hero)", HOME_MOBILE_HERO],
];

describe("phone secondary-hero copy", () => {
  it("covers every route that renders a secondary hero", () => {
    // 7 services + 10 industries + 2 hubs + 6 core pages + the homepage.
    expect(CASES).toHaveLength(26);
    expect(
      CASES.filter(([, copy]) => copy === undefined).map(([route]) => route),
    ).toEqual([]);
  });

  describe.each(CASES)("%s", (route, copy) => {
    it("has a mobile block", () => {
      expect(copy, `${route} is missing its mobile hero copy`).toBeDefined();
    });

    it("keeps the tagline inside one line", () => {
      const tagline = copy?.tagline;
      expect(tagline, `${route} has no mobile tagline`).toBeTruthy();
      expect(stripEmphasis(tagline ?? "").length).toBeLessThanOrEqual(
        MOBILE_HERO_TAGLINE_MAX_CHARS,
      );
      expect(tagline).not.toMatch(/\n/);
    });

    it("carries exactly three chip-sized points", () => {
      const points = copy?.points ?? [];
      expect(points).toHaveLength(MOBILE_HERO_POINT_COUNT);
      for (const point of points) {
        expect(
          stripEmphasis(point).length,
          `${route}: "${point}" is ${String(point.length)} chars`,
        ).toBeLessThanOrEqual(MOBILE_HERO_POINT_MAX_CHARS);
        // Chips are labels, not sentences.
        expect(point.endsWith("."), `${route}: "${point}" ends in a period`).toBe(
          false,
        );
        expect(point.trim()).toBe(point);
      }
      expect(new Set(points).size, `${route} repeats a point`).toBe(points.length);
    });

    it("keeps the tagline and the chips saying different things", () => {
      // On a phone the tagline sits directly above the manifest, so a shared
      // run of words reads as a duplicated string rather than as emphasis:
      // the tagline carries the promise, each chip a mechanism or a boundary.
      const taglineWords = words(stripEmphasis(copy?.tagline ?? ""));
      for (const point of copy?.points ?? []) {
        const pointWords = words(stripEmphasis(point));
        for (let i = 0; i + 3 <= pointWords.length; i += 1) {
          const run = pointWords.slice(i, i + 3).join(" ");
          expect(
            taglineWords.join(" ").includes(run),
            `${route}: "${point}" repeats "${run}" from the tagline`,
          ).toBe(false);
        }
      }
    });

    it("holds the site's voice", () => {
      for (const value of [copy?.tagline ?? "", ...(copy?.points ?? [])]) {
        // Em dashes belong to the long-form copy; the phone hero has no room
        // for a subclause, and "AI-powered" is banned site-wide.
        expect(value, "no em dash").not.toMatch(/\u2014/);
        expect(value, "no exclamation mark").not.toMatch(/!/);
        expect(value, 'no "AI-powered"').not.toMatch(/AI-powered/i);
      }
    });

    it("carries three distinct glyphs in the manifest", () => {
      // `inferPointIcon` matches one string at a time, so two points in the
      // same keyword class come back with the same icon — /book's "A quick fit
      // check" and "Choose a verified time" both matched the diagnostic class
      // and both drew Target, which reads in the panel as a repeated stamp.
      // `resolvePointIcons` resolves the set; this is what holds that line for
      // every future copy edit, not just for the one route that tripped it.
      const points = copy?.points ?? [];
      const icons = resolvePointIcons(points);
      expect(icons).toHaveLength(points.length);
      expect(
        new Set(icons).size,
        `${route}: the manifest repeats a glyph across ${JSON.stringify(points)}`,
      ).toBe(points.length);
    });

    it("uses the site's US spellings", () => {
      const strings = [copy?.tagline ?? "", ...(copy?.points ?? [])];
      for (const value of strings) {
        for (const { wrong, right } of US_SPELLINGS) {
          expect(wrong.test(value), `${route}: "${value}" should use "${right}"`).toBe(
            false,
          );
        }
      }
    });
  });
});
