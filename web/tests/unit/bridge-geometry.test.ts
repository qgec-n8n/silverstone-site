/**
 * The Atlantic Bridge's geometry contract.
 *
 * The pulse travels its arc with a CSS `offset-path`, which means the arc
 * exists twice: once as the `d` of a drawn <path>, once as a path() string in
 * the stylesheet. They diverged silently once — the compact pulse was animated
 * along "M 74 30 Q 186 34 250 84" while the plate drew "M 64 36 Q 176 48 238
 * 106", so on every phone the dot flew ~20px off the line and died in empty
 * grid short of New York.
 *
 * Nothing caught it, because the check in use sampled `offset-distance`, and
 * `offset-distance` is progress along whatever path is declared: it cannot
 * know the path is the wrong one. This file compares the two strings instead,
 * which is the only comparison that can.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  BRIDGE_COMPACT,
  BRIDGE_WIDE,
} from "~/features/industries-v2/components/industry-sections";

const css = readFileSync(
  resolve(process.cwd(), "src/styles/industries-v2/industries-v2.css"),
  "utf8",
);

function offsetPathOf(selector: string) {
  const start = css.indexOf(`${selector} {`);
  expect(start, `${selector} is not in the stylesheet`).toBeGreaterThan(-1);
  const block = css.slice(start, css.indexOf("}", start));
  return /offset-path:\s*path\("([^"]+)"\)/.exec(block)?.[1];
}

/** The quadratic the plates draw, evaluated independently of the component. */
function quad(d: string, t: number) {
  const n = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const [x0, y0, cx, cy, x1, y1] = n as [
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  const u = 1 - t;
  return {
    x: u * u * x0 + 2 * u * t * cx + t * t * x1,
    y: u * u * y0 + 2 * u * t * cy + t * t * y1,
  };
}

describe("Atlantic Bridge geometry", () => {
  it("animates each pulse along the arc its own plate draws", () => {
    expect(offsetPathOf(".ss-ind2-bridge__pulse")).toBe(BRIDGE_WIDE.arc);
    expect(offsetPathOf(".ss-ind2-bridge__pulse--compact")).toBe(BRIDGE_COMPACT.arc);
  });

  it("declares no third, unowned path() anywhere in the stylesheet", () => {
    const paths = [...css.matchAll(/path\("([^"]+)"\)/g)].map((m) => m[1]);
    // The @supports probe is the only path() that is not an arc.
    expect(new Set(paths)).toEqual(
      new Set(["M 0 0 L 1 1", BRIDGE_WIDE.arc, BRIDGE_COMPACT.arc]),
    );
  });

  it("parks the reduced-motion pulse on the arc, mid-flight", () => {
    for (const bridge of [BRIDGE_WIDE, BRIDGE_COMPACT]) {
      const onCurve = quad(bridge.arc, 0.62);
      expect(bridge.park.x).toBeCloseTo(onCurve.x, 0);
      expect(bridge.park.y).toBeCloseTo(onCurve.y, 0);
    }
  });

  it("puts both cities where the printed graticule says they are", () => {
    // London 51.51°N, 0.13°W and New York 40.71°N, 74.01°W, read back off the
    // plate's own linear scales — the check that the ticks are not decoration.
    for (const bridge of [BRIDGE_WIDE, BRIDGE_COMPACT]) {
      expect(bridge.ldn.y).toBeCloseTo(bridge.latToY(51.51), 1);
      expect(bridge.ldn.x).toBeCloseTo(bridge.lonToX(-0.13), 1);
      expect(bridge.nyc.y).toBeCloseTo(bridge.latToY(40.71), 1);
      expect(bridge.nyc.x).toBeCloseTo(bridge.lonToX(-74.01), 1);
      // New York is west of and south of London on both plates, which is what
      // lets the ledger's fixed US → UK column order agree with the chart.
      expect(bridge.nyc.x).toBeLessThan(bridge.ldn.x);
      expect(bridge.nyc.y).toBeGreaterThan(bridge.ldn.y);
    }
  });

  it("keeps every drawn feature inside the viewBox window", () => {
    for (const bridge of [BRIDGE_WIDE, BRIDGE_COMPACT]) {
      const bottom = bridge.viewY + bridge.h;
      for (const t of [0, 0.25, 0.5, 0.75, 1]) {
        const point = quad(bridge.arc, t);
        expect(point.y).toBeGreaterThanOrEqual(bridge.viewY);
        expect(point.y).toBeLessThanOrEqual(bottom);
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(bridge.w);
      }
      for (const rule of bridge.latRules) {
        expect(rule.y).toBeGreaterThanOrEqual(bridge.viewY);
        expect(rule.y).toBeLessThanOrEqual(bottom);
      }
    }
  });
});
