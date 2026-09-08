import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { ExpandableImage } from "~/components/media/expandable-image";
import { MotionProvider } from "~/motion";

/*
 * The lightbox's semantics, on the reduced-motion branch: jsdom has no layout
 * engine, so the shared-layout morph is not what is under test here — the
 * control's name and state, the dialog, its title (the alt), and the close
 * paths are.
 */
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

function renderImage() {
  return render(
    <MotionProvider>
      <figure>
        <ExpandableImage
          alt="A studio at night."
          height={600}
          src="/art.png"
          width={900}
        >
          <img alt="A studio at night." height={600} src="/art.png" width={900} />
        </ExpandableImage>
      </figure>
    </MotionProvider>,
  );
}

describe("ExpandableImage", () => {
  it("wraps the picture in a named dialog trigger that carries the cue", () => {
    const { container } = renderImage();
    const button = screen.getByRole("button", {
      name: "Expand image: A studio at night.",
    });

    expect(button).toHaveAttribute("aria-haspopup", "dialog");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button.querySelector("img")).not.toBeNull();
    expect(container.querySelectorAll(".ss-zoom__corner")).toHaveLength(4);
    expect(container.querySelector(".ss-zoom__cue")?.textContent).toBe("Expand");
    // The page's own image is untouched: still one <img> in the document.
    expect(document.querySelectorAll("img")).toHaveLength(1);
  });

  it("opens the image as a dialog titled by its alt, and closes on Escape", () => {
    renderImage();
    const button = screen.getByRole("button", {
      name: "Expand image: A studio at night.",
    });

    fireEvent.click(button);

    const dialog = screen.getByRole("dialog", { name: "A studio at night." });
    expect(dialog).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");
    // jsdom, like a browser, reports the resolved absolute URL.
    expect(dialog.querySelector(".ss-lightbox__image")?.getAttribute("src")).toMatch(
      /\/art\.png$/,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("closes from its own close button", () => {
    renderImage();
    fireEvent.click(
      screen.getByRole("button", { name: "Expand image: A studio at night." }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(
      screen.getByRole("button", { name: "Expand image: A studio at night." }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
