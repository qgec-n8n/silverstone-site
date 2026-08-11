import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { industryArt } from "~/features/industries-v2/content/route-art";
import { routeArt as serviceRouteArt } from "~/features/services-v2/content/route-art";
import {
  AETHER_INDUSTRY_PALETTES,
  AETHER_NETWORK_DEFAULT,
  AETHER_NETWORK_PROXIMITY,
  AETHER_PARTICLE_COLOR,
  AETHER_POINTER_RADIUS,
  AETHER_SERVICE_PALETTES,
  AetherParticle,
  applyPointerRepulsion,
  pointerPositionInCanvas,
} from "~/visual/home-v2/hero-aether-field";

describe("HeroAetherField geometry helpers", () => {
  it("calculates pointer coordinates relative to the canvas rect", () => {
    const pointer = pointerPositionInCanvas(
      { clientX: 180, clientY: 260, pointerType: "mouse" },
      { left: 100, top: 200, width: 400, height: 300 },
    );

    expect(pointer.x).toBe(80);
    expect(pointer.y).toBe(60);
    expect(pointer.radius).toBe(AETHER_POINTER_RADIUS);
  });

  it("deactivates the pointer outside the canvas and for touch fallback", () => {
    expect(
      pointerPositionInCanvas(
        { clientX: 80, clientY: 260, pointerType: "mouse" },
        { left: 100, top: 200, width: 400, height: 300 },
      ).x,
    ).toBeNull();
    expect(
      pointerPositionInCanvas(
        { clientX: 180, clientY: 260, pointerType: "touch" },
        { left: 100, top: 200, width: 400, height: 300 },
      ).x,
    ).toBeNull();
  });

  it("repels nearby particles away from the pointer using the canonical mutation model", () => {
    const particle = new AetherParticle(140, 100, 0, 0, 2);
    const moved = applyPointerRepulsion(particle, {
      x: 100,
      y: 100,
      radius: AETHER_POINTER_RADIUS,
    });

    expect(moved).toBe(true);
    expect(particle.x).toBeGreaterThan(140);
    expect(particle.y).toBe(100);
  });

  it("preserves the approved Silverstone Aether colours", () => {
    expect(AETHER_PARTICLE_COLOR).toBe("#66E8F0");
    expect(AETHER_NETWORK_DEFAULT).toBe("#66E8F0");
    expect(AETHER_NETWORK_PROXIMITY).toBe("#F3F7FF");
  });

  /*
   * The Explore CTA tints itself from the palette of the field it stands on, so
   * a base that drifts off its route's copy accent silently puts the button on
   * a hue the body never uses. Three Services bases had drifted this way
   * (#34D5E8, #8B72FF, #6E74F4 against accents #22d3ee, #7c5cff, #5b62f0);
   * these lock the two registries together so it cannot recur unnoticed.
   */
  const expectBasesMatchAccents = (
    family: string,
    palettes: Record<string, { network: string; particle: string }>,
    art: Record<string, { accentFrom: string }>,
  ) => {
    describe(`${family} field bases`, () => {
      it.each(Object.keys(art))(
        "%s draws its dots and lines in its copy accent",
        (route) => {
          const palette = palettes[route];
          const accent = art[route]?.accentFrom.toLowerCase();

          expect(accent).toBeDefined();
          expect(palette).toBeDefined();
          expect(palette?.network.toLowerCase()).toBe(accent);
          expect(palette?.particle.toLowerCase()).toBe(accent);
        },
      );
    });
  };

  expectBasesMatchAccents("Services", AETHER_SERVICE_PALETTES, serviceRouteArt);
  expectBasesMatchAccents("Industries", AETHER_INDUSTRY_PALETTES, industryArt);

  it("does not render a cursor lens or circular overlay around the pointer", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/visual/home-v2/hero-aether-field.tsx"),
      "utf8",
    );

    expect(source).not.toContain("ctx.arc(mouse.x");
    expect(source).not.toMatch(/magnif|spotlight|cursor-following|glass distortion/i);
  });
});
