import { describe, expect, it } from "vitest";

import {
  AetherParticle,
  displacedParticlePosition,
  pointerPositionInCanvas,
} from "~/visual/home-v2/hero-aether-field";

describe("HeroAetherField geometry helpers", () => {
  it("calculates pointer coordinates relative to the canvas rect", () => {
    const pointer = pointerPositionInCanvas(
      { clientX: 180, clientY: 260, pointerType: "mouse" },
      { left: 100, top: 200, width: 400, height: 300 },
    );

    expect(pointer.active).toBe(true);
    expect(pointer.x).toBe(80);
    expect(pointer.y).toBe(60);
    expect(pointer.radius).toBeGreaterThan(0);
  });

  it("deactivates the pointer outside the canvas and for touch fallback", () => {
    expect(
      pointerPositionInCanvas(
        { clientX: 80, clientY: 260, pointerType: "mouse" },
        { left: 100, top: 200, width: 400, height: 300 },
      ).active,
    ).toBe(false);
    expect(
      pointerPositionInCanvas(
        { clientX: 180, clientY: 260, pointerType: "touch" },
        { left: 100, top: 200, width: 400, height: 300 },
      ).active,
    ).toBe(false);
  });

  it("displaces nearby particles away from the pointer without moving base coordinates", () => {
    const particle = new AetherParticle(140, 100, 0, 0, 2);
    const displaced = displacedParticlePosition(particle, {
      active: true,
      x: 100,
      y: 100,
      radius: 160,
    });

    expect(displaced.proximity).toBeGreaterThan(0);
    expect(displaced.drawX).toBeGreaterThan(particle.x);
    expect(displaced.drawY).toBe(particle.y);
    expect(particle.x).toBe(140);
  });
});
