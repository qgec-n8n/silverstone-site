import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { loadMigratedContent } from "~/content/migrated";
import { MigratedContentRenderer } from "~/routes/templates/migrated-content-renderer";

// Every migrated block is wrapped in a scroll-triggered Reveal, and jsdom's
// IntersectionObserver stub never fires, so the animated branch would keep
// content at opacity 0 forever. Reduced motion selects the static branch,
// which is what these content assertions are about.
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

describe("MigratedContentRenderer", () => {
  it("renders source copy and links without activating legacy integrations", async () => {
    const content = await loadMigratedContent("content-contact");

    const { container } = render(<MigratedContentRenderer content={content} />);

    expect(screen.getByText("Useful context")).toBeVisible();
    expect(container.querySelector("form")).not.toBeInTheDocument();
    expect(container.querySelector("iframe")).not.toBeInTheDocument();
    expect(container.querySelector("script")).not.toBeInTheDocument();
    expect(container.querySelectorAll("h1")).toHaveLength(0);
  });

  it("renders article headings, paragraphs, lists and approved images", async () => {
    const content = await loadMigratedContent(
      "content-blog-ai-receptionist-small-business-2026",
    );

    const { container } = render(<MigratedContentRenderer content={content} />);

    expect(
      screen.getByRole("heading", {
        name: "Why the front desk is the strongest first AI project",
      }),
    ).toBeVisible();
    expect(container.querySelectorAll("p").length).toBeGreaterThan(5);
    expect(container.querySelectorAll("li").length).toBeGreaterThan(3);
    expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
    expect(
      [...container.querySelectorAll("img")].every(
        (image) => image.hasAttribute("width") && image.hasAttribute("height"),
      ),
    ).toBe(true);
  });
});
