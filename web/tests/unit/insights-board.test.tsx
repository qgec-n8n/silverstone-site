import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { InsightsBoard } from "~/features/core-pages/insights-board";
import {
  INSIGHT_ARTICLES,
  INSIGHT_CATEGORIES,
} from "~/features/core-pages/insights-data";
import { MotionProvider } from "~/motion/MotionProvider";

function required<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
  return value;
}

function renderBoard() {
  return render(
    <MemoryRouter>
      <MotionProvider>
        <InsightsBoard />
      </MotionProvider>
    </MemoryRouter>,
  );
}

describe("InsightsBoard", () => {
  it("keeps filtered articles on stable IDs and real article links", () => {
    const { container } = renderBoard();
    const target = required(INSIGHT_ARTICLES.at(0), "Expected a published article");
    const search = screen.getByRole("searchbox", {
      name: /search insights by title or topic/i,
    });

    fireEvent.change(search, { target: { value: target.title } });

    const articleLink = screen.getByRole("link", {
      name: (name) => name.includes(target.title),
    });
    const hoverItem = articleLink.closest<HTMLElement>("[data-card-hover-id]");

    expect(articleLink).toHaveAttribute("href", target.href);
    expect(articleLink).toHaveAttribute("data-insight-id", target.id);
    expect(hoverItem).toHaveAttribute("data-card-hover-id", target.id);
    expect(articleLink).not.toHaveAttribute("style");
    expect(container.querySelector("a a, a button, button a")).toBeNull();
  });

  it("moves the shared hover state for pointer and keyboard focus", () => {
    const { container } = renderBoard();
    const grid = container.querySelector<HTMLElement>(".ss-card-hover-effect");
    const items = container.querySelectorAll<HTMLElement>("[data-card-hover-id]");
    const hoverGrid = required(grid, "Expected the Aceternity hover grid");
    const first = required(items.item(0), "Expected a first hover item");
    const second = required(items.item(1), "Expected a second hover item");
    const firstId = required(first.dataset.cardHoverId, "Expected a stable first ID");
    const secondId = required(
      second.dataset.cardHoverId,
      "Expected a stable second ID",
    );

    fireEvent.pointerOver(first, { pointerType: "mouse" });
    expect(hoverGrid).toHaveAttribute("data-card-hover-active", firstId);

    fireEvent.focus(within(second).getByRole("link"));
    expect(hoverGrid).toHaveAttribute("data-card-hover-active", secondId);

    fireEvent.blur(within(second).getByRole("link"), {
      relatedTarget: null,
    });
    expect(hoverGrid).not.toHaveAttribute("data-card-hover-active");
  });

  it("filters by category without changing article IDs or destinations", () => {
    const { container } = renderBoard();
    const category = INSIGHT_CATEGORIES.find((candidate) =>
      INSIGHT_ARTICLES.some((article) => article.categoryId === candidate.id),
    );

    const selectedCategory = required(category, "Expected a populated category");
    fireEvent.click(screen.getByRole("button", { name: selectedCategory.label }));

    const expected = INSIGHT_ARTICLES.filter(
      (article) => article.categoryId === selectedCategory.id,
    );
    const rendered = container.querySelectorAll<HTMLElement>("[data-insight-id]");

    expect(rendered).toHaveLength(expected.length);
    for (const card of rendered) {
      const article = expected.find(
        (candidate) => candidate.id === card.dataset.insightId,
      );
      expect(card).toHaveAttribute(
        "href",
        required(article, "Expected the rendered article in category").href,
      );
    }
  });

  it("keeps the no-results state functional", () => {
    renderBoard();

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: /search insights by title or topic/i,
      }),
      { target: { value: "no-such-silverstone-topic-9x8y7z" } },
    );

    expect(screen.getByRole("status")).toHaveTextContent("0 topics");
    expect(screen.getByText(/no topics match that search yet/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /read the article/i })).toBeNull();
  });
});
