import { describe, expect, it } from "vitest";

import { futureRouteManifest } from "~/data/future-routes";
import {
  getCanonicalRouteExperienceByPath,
  routeExperiences,
} from "~/data/route-experiences";

describe("route experience registry", () => {
  it("covers every canonical visual route", () => {
    for (const route of futureRouteManifest) {
      const experience = getCanonicalRouteExperienceByPath(route.path);
      expect(experience, route.path).toBeDefined();
      expect(experience?.path).toBe(route.path);
    }
  });

  it("does not register duplicate route aliases", () => {
    expect(
      getCanonicalRouteExperienceByPath("/services/website-design-development"),
    ).toBeUndefined();
    expect(
      getCanonicalRouteExperienceByPath("/services/ai-agents-automation"),
    ).toBeUndefined();
    expect(getCanonicalRouteExperienceByPath("/services/dentists")).toBeUndefined();
  });

  it("has the required route-specific copy fields", () => {
    for (const experience of routeExperiences) {
      expect(experience.loaderText.trim(), experience.path).not.toHaveLength(0);
      expect(experience.pill.trim(), experience.path).not.toHaveLength(0);
      expect(experience.title.trim(), experience.path).not.toHaveLength(0);
      expect(experience.subtitle.trim(), experience.path).not.toHaveLength(0);
      expect(experience.buttonLabel.trim(), experience.path).not.toHaveLength(0);
      expect(experience.bodyHeadingId.trim(), experience.path).not.toHaveLength(0);
      expect(experience.loaderText, experience.path).not.toMatch(/loading page/i);
      if (experience.path !== "/") {
        expect(experience.buttonLabel, experience.path).not.toBe("Explore the system");
      }
    }
  });

  it("keeps homepage copy exclusive to the homepage", () => {
    const nonHome = routeExperiences.filter((experience) => experience.path !== "/");
    expect(nonHome.map((experience) => experience.title)).not.toContain(
      "The operating system for businesses that refuse to miss.",
    );
    expect(nonHome.map((experience) => experience.buttonLabel)).not.toContain(
      "Explore the system",
    );
  });

  it("does not duplicate loader sentences, titles or subtitles", () => {
    for (const field of ["loaderText", "title", "subtitle"] as const) {
      const values = routeExperiences.map((experience) => experience[field]);
      expect(new Set(values).size, field).toBe(values.length);
    }
  });
});
