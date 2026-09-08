import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  ATLAS_COMPACT,
  ATLAS_PLATES,
  ATLAS_SCALE,
  ATLAS_WIDE,
  LINKED_METROS,
  LONDON,
  US_METROS,
  US_TIME_ZONES,
  projectOn,
  quadAt,
  type AtlasPlate,
} from "~/features/industries-v2/content/atlas";

const plates: AtlasPlate[] = [ATLAS_WIDE, ATLAS_COMPACT];
const publicDir = path.resolve(__dirname, "../../public");

/*
 * Four things have to agree on the atlas's geometry: the generated dot
 * layers, the SVG paths, the HTML labels and this file. The plate table is
 * duplicated in `scripts/generate-atlas-dots.mjs` (a plain .mjs that cannot
 * import TypeScript), so the first test reads the generated files back and
 * fails the moment the two copies drift.
 */
describe("Atlantic atlas geometry", () => {
  it("matches the generated dot plates dot-for-dot", () => {
    for (const plate of plates) {
      const spec = ATLAS_PLATES[plate.name];
      for (const layer of ["world", "us", "uk"] as const) {
        const href = plate.layers[layer];
        const svg = readFileSync(path.join(publicDir, href), "utf8");
        expect(svg, `${href} viewBox`).toContain(
          `viewBox="0 0 ${String(spec.width)} ${String(spec.height)}"`,
        );
        expect(svg, `${href} draws dots`).toMatch(/<path [^>]*stroke-linecap="round"/);
      }
      expect(plate.w).toBe(spec.width * ATLAS_SCALE);
      expect(plate.h).toBe(spec.height * ATLAS_SCALE);
      expect(plate.viewBox).toBe(`0 0 ${String(plate.w)} ${String(plate.h)}`);
      // An equirectangular degree is the same length on both axes.
      const lngSpan = spec.region.lng.max - spec.region.lng.min;
      const latSpan = spec.region.lat.max - spec.region.lat.min;
      expect(spec.width / lngSpan).toBeCloseTo(spec.height / latSpan, 6);
    }
  });

  it("keeps every node and every arc inside its plate", () => {
    for (const plate of plates) {
      for (const node of [plate.hub, ...plate.cities]) {
        expect(node.point.x, `${plate.name} ${node.name} x`).toBeGreaterThan(0);
        expect(node.point.x, `${plate.name} ${node.name} x`).toBeLessThan(plate.w);
        expect(node.point.y, `${plate.name} ${node.name} y`).toBeGreaterThan(0);
        expect(node.point.y, `${plate.name} ${node.name} y`).toBeLessThan(plate.h);
      }
      for (const link of plate.links) {
        // The control point may sit above the plate; what must stay inside it
        // is the curve itself, whose highest point is the apex at t = 0.5.
        const apex = quadAt(link.city.point, link.ctrl, plate.hub.point, 0.5);
        expect(apex.y, `${plate.name} ${link.city.name} apex`).toBeGreaterThanOrEqual(
          plate.h * 0.06,
        );
        expect(link.ctrl.x).toBeGreaterThan(0);
        expect(link.ctrl.x).toBeLessThan(plate.w);
      }
    }
  });

  it("puts the cities where their coordinates say", () => {
    for (const plate of plates) {
      const spec = ATLAS_PLATES[plate.name];
      const expected = (lat: number, lng: number) => ({
        x:
          ((lng - spec.region.lng.min) / (spec.region.lng.max - spec.region.lng.min)) *
          spec.width *
          ATLAS_SCALE,
        y:
          ((spec.region.lat.max - lat) / (spec.region.lat.max - spec.region.lat.min)) *
          spec.height *
          ATLAS_SCALE,
      });
      const london = expected(LONDON.lat, LONDON.lng);
      expect(plate.hub.point.x).toBeCloseTo(london.x, 0);
      expect(plate.hub.point.y).toBeCloseTo(london.y, 0);
      for (const city of plate.cities) {
        const point = expected(city.lat, city.lng);
        expect(city.point.x, city.name).toBeCloseTo(point.x, 0);
        expect(city.point.y, city.name).toBeCloseTo(point.y, 0);
      }
      const direct = projectOn(plate.name, LONDON.lat, LONDON.lng);
      expect(direct).toEqual(plate.hub.point);
    }
  });

  it("reads honestly: north is up, west is left, London is east of every metro", () => {
    for (const plate of plates) {
      const by = Object.fromEntries(plate.cities.map((city) => [city.id, city.point]));
      const point = (id: string) => {
        const found = by[id];
        if (!found) throw new Error(`missing ${id} on ${plate.name}`);
        return found;
      };
      expect(point("sea").x).toBeLessThan(point("bos").x);
      expect(point("sea").y).toBeLessThan(point("mia").y);
      expect(point("mia").y).toBeGreaterThan(point("bos").y);
      expect(point("den").x).toBeGreaterThan(point("sfo").x);
      for (const city of plate.cities) {
        expect(plate.hub.point.x, city.name).toBeGreaterThan(city.point.x);
      }
    }
  });

  it("bows every route north of its chord, leaving London for the metro", () => {
    for (const plate of plates) {
      for (const link of plate.links) {
        // The path starts at the hub, so a dash offset running 1 → 0 draws
        // the route outward from London.
        const from = plate.hub.point;
        const to = link.city.point;
        expect(link.ctrl.y).toBeLessThan((from.y + to.y) / 2);
        expect(link.path).toBe(
          `M ${String(from.x)} ${String(from.y)} Q ${String(link.ctrl.x)} ${String(link.ctrl.y)} ${String(to.x)} ${String(to.y)}`,
        );
      }
    }
  });

  it("draws a route only to the first two tiers, ranked nearest-first", () => {
    expect(LINKED_METROS.every((city) => city.tier <= 2)).toBe(true);
    expect(LINKED_METROS.length).toBeGreaterThanOrEqual(6);
    expect(LINKED_METROS.length).toBeLessThanOrEqual(8);
    for (const plate of plates) {
      expect(plate.links.map((link) => link.city.id)).toEqual(
        LINKED_METROS.map((city) => city.id),
      );
      expect(plate.cities.filter((city) => city.linked)).toHaveLength(
        LINKED_METROS.length,
      );
      // Every quiet metro is still plotted: the geography stays honest.
      expect(plate.cities).toHaveLength(US_METROS.length);
      // Ranks are a permutation ordered by chord length, shortest first.
      const chord = (link: (typeof plate.links)[number]) =>
        Math.hypot(
          plate.hub.point.x - link.city.point.x,
          plate.hub.point.y - link.city.point.y,
        );
      const byRank = [...plate.links].sort((a, b) => a.rank - b.rank);
      expect(byRank.map((link) => link.rank)).toEqual(
        plate.links.map((_, index) => index),
      );
      for (let index = 1; index < byRank.length; index += 1) {
        const previous = byRank[index - 1];
        const current = byRank[index];
        if (!previous || !current) throw new Error("rank gap");
        expect(chord(current)).toBeGreaterThanOrEqual(chord(previous));
      }
    }
  });

  it("labels the first two tiers on the wide plate and the first on the compact one", () => {
    const tierOne = US_METROS.filter((city) => city.tier === 1).length;
    const named = US_METROS.filter((city) => city.tier <= 2).length;
    expect(ATLAS_WIDE.cities.filter((city) => city.labelled)).toHaveLength(named);
    expect(ATLAS_WIDE.hub.labelled).toBe(true);
    expect(ATLAS_COMPACT.cities.filter((city) => city.labelled)).toHaveLength(tierOne);
    expect(tierOne).toBeGreaterThanOrEqual(5);
    expect(tierOne).toBeLessThanOrEqual(7);
    // A labelled city is always a linked one; the quiet tier is never named
    // on the plate (the strip beneath it names every metro).
    for (const plate of plates) {
      for (const city of plate.cities) {
        if (city.labelled) expect(city.linked).toBe(true);
        if (city.tier === 3) expect(city.labelled).toBe(false);
      }
    }
  });

  it("fits each country's glow inside its plate, centred on its cities", () => {
    for (const plate of plates) {
      for (const side of ["us", "uk"] as const) {
        const aura = plate.aura[side];
        expect(aura.rx).toBeGreaterThan(0);
        expect(aura.ry).toBeGreaterThan(0);
        expect(aura.cx).toBeGreaterThan(0);
        expect(aura.cx).toBeLessThan(plate.w);
        expect(aura.cy).toBeGreaterThan(0);
        expect(aura.cy).toBeLessThan(plate.h);
      }
      // The US wash covers every metro; the UK wash sits over London.
      for (const city of plate.cities) {
        const { cx, cy, rx, ry } = plate.aura.us;
        const dx = (city.point.x - cx) / rx;
        const dy = (city.point.y - cy) / ry;
        expect(dx * dx + dy * dy, city.name).toBeLessThanOrEqual(1);
      }
      const uk = plate.aura.uk;
      expect(Math.abs(plate.hub.point.x - uk.cx)).toBeLessThan(uk.rx);
      expect(Math.abs(plate.hub.point.y - uk.cy)).toBeLessThan(uk.ry);
    }
  });

  it("names twelve distinct metros across four continental time zones", () => {
    expect(US_METROS).toHaveLength(12);
    expect(new Set(US_METROS.map((city) => city.id)).size).toBe(12);
    expect(new Set(US_METROS.map((city) => city.name)).size).toBe(12);
    expect(US_TIME_ZONES).toBe(4);
    // Every metro is on the US mainland: no Alaska or Hawaii on a plate cropped
    // to the North Atlantic.
    for (const city of US_METROS) {
      expect(city.lat).toBeGreaterThan(24);
      expect(city.lat).toBeLessThan(49);
      expect(city.lng).toBeGreaterThan(-125);
      expect(city.lng).toBeLessThan(-66);
    }
  });
});
