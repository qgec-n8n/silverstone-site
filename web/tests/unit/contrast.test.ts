import { describe, expect, it } from "vitest";

import { silverstoneTokens } from "~/styles/tokens/silverstone";

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").slice(0, 6);
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function channelToLinear(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const { b, g, r } = hexToRgb(hex);
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

function contrastRatio(foreground: string, background: string) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

describe("Silverstone contrast tokens", () => {
  it("keeps critical light-theme text and control pairs above threshold", () => {
    expect(
      contrastRatio(
        silverstoneTokens.color.light.text.primary,
        silverstoneTokens.color.light.surface.canvas,
      ),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(
        silverstoneTokens.color.light.text.link,
        silverstoneTokens.color.light.surface.canvas,
      ),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(
        silverstoneTokens.color.light.border.default,
        silverstoneTokens.color.light.surface.canvas,
      ),
    ).toBeGreaterThanOrEqual(3);
  });

  it("keeps critical dark-theme text and action pairs above threshold", () => {
    expect(
      contrastRatio(
        silverstoneTokens.color.dark.text.primary,
        silverstoneTokens.color.dark.surface.subtle,
      ),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(
        silverstoneTokens.color.dark.text.link,
        silverstoneTokens.color.dark.surface.subtle,
      ),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(
        silverstoneTokens.color.dark.action.primaryFg,
        silverstoneTokens.color.dark.action.primaryBg,
      ),
    ).toBeGreaterThanOrEqual(4.5);
  });
});
