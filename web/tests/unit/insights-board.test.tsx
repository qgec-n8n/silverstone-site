import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { InsightsBoard } from "~/features/core-pages/insights-board";
import {
  INSIGHT_ARTICLES,
  INSIGHT_CATEGORIES,
  type InsightArticle,
} from "~/features/core-pages/insights-data";
import { MotionProvider } from "~/motion/MotionProvider";

function required<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
  return value;
}

function articleMatchesTerm(article: InsightArticle, term: string): boolean {
  return [
    article.title,
    ...article.summary,
    ...(article.keywords ?? []),
    INSIGHT_CATEGORIES.find((category) => category.id === article.categoryId)?.label ??
      "",
  ]
    .join(" ")
    .toLowerCase()
    .replace(/&/g, " and ")
    .includes(term);
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

  it("keeps the keyboard-focused card lit until the pointer really moves", () => {
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
    const parked = { clientX: 240, clientY: 320, pointerType: "mouse" };

    fireEvent.pointerOver(second, parked);
    expect(hoverGrid).toHaveAttribute("data-card-hover-active", secondId);

    fireEvent.focus(within(first).getByRole("link"));
    /* Focusing scrolls the card into view, so the browser re-dispatches
       `pointerover` for whatever now sits under the unmoved cursor. Those
       repeat coordinates must not steal the surface back from the keyboard. */
    fireEvent.pointerOver(second, parked);
    expect(hoverGrid).toHaveAttribute("data-card-hover-active", firstId);

    fireEvent.pointerMove(second, { ...parked, clientX: 268 });
    expect(hoverGrid).toHaveAttribute("data-card-hover-active", secondId);
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

  it("searches the category label, so a pill name typed into the box matches", () => {
    // The pills and the box answer the same question. Searching only title and
    // summary meant a category name returned nothing while a pill for that
    // exact category sat beside the box.
    const category = required(
      INSIGHT_CATEGORIES.find((candidate) =>
        INSIGHT_ARTICLES.some((article) => article.categoryId === candidate.id),
      ),
      "Expected a populated category",
    );

    renderBoard();
    fireEvent.change(
      screen.getByRole("searchbox", {
        name: /search insights by title or topic/i,
      }),
      // Spelled out, because nobody types the ampersand in "AI & Automation
      // Consulting".
      { target: { value: category.label.replace(/&/g, "and") } },
    );

    const matched = INSIGHT_ARTICLES.filter(
      (article) => article.categoryId === category.id,
    );
    expect(matched.length).toBeGreaterThan(0);
    expect(screen.getByRole("status")).toHaveTextContent(
      new RegExp(`${String(matched.length)} topics?`),
    );
  });

  it("searches the post keywords, not just the headline", () => {
    const article = required(
      INSIGHT_ARTICLES.find((candidate) =>
        (candidate.keywords ?? []).some(
          (keyword) =>
            keyword.trim().length > 8 &&
            !candidate.title.toLowerCase().includes(keyword.toLowerCase()),
        ),
      ),
      "Expected a published article with a keyword absent from its title",
    );
    const keyword = required(
      (article.keywords ?? []).find(
        (candidate) =>
          candidate.trim().length > 8 &&
          !article.title.toLowerCase().includes(candidate.toLowerCase()),
      ),
      "Expected a keyword absent from the title",
    );

    renderBoard();
    fireEvent.change(
      screen.getByRole("searchbox", {
        name: /search insights by title or topic/i,
      }),
      { target: { value: keyword } },
    );

    expect(
      screen.getByRole("link", { name: (name) => name.includes(article.title) }),
    ).toBeInTheDocument();
  });

  it("pages the grid in twelves while every card stays mounted and crawlable", () => {
    // /blog is the primary internal link into the article set, so paging is a
    // presentation concern only: hidden cards keep their real href in the
    // prerendered HTML instead of being sliced out of the array.
    const { container } = renderBoard();
    const total = INSIGHT_ARTICLES.length;
    expect(total).toBeGreaterThan(12);

    const items = () =>
      Array.from(container.querySelectorAll<HTMLElement>("[data-card-hover-id]"));
    const shown = () =>
      items().filter((item) => item.dataset.cardHoverHidden !== "true").length;

    expect(items()).toHaveLength(total);
    expect(shown()).toBe(12);
    expect(container.querySelectorAll('a[href^="/blog/"]')).toHaveLength(
      INSIGHT_ARTICLES.filter((article) => article.status === "published").length,
    );

    fireEvent.click(screen.getByRole("button", { name: /show more articles/i }));

    expect(items()).toHaveLength(total);
    expect(shown()).toBe(Math.min(24, total));
  });

  it("hides the show-more button once the last page is revealed", () => {
    const { container } = renderBoard();
    const total = INSIGHT_ARTICLES.length;
    const clicks = Math.ceil(total / 12) - 1;

    for (let index = 0; index < clicks; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: /show more articles/i }));
    }

    expect(screen.queryByRole("button", { name: /show more articles/i })).toBeNull();
    expect(container.querySelectorAll('[data-card-hover-hidden="true"]')).toHaveLength(
      0,
    );
  });

  it("returns to the first page when the search changes the result set", () => {
    const { container } = renderBoard();
    fireEvent.click(screen.getByRole("button", { name: /show more articles/i }));

    const shown = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>("[data-card-hover-id]"),
      ).filter((item) => item.dataset.cardHoverHidden !== "true").length;
    expect(shown()).toBeGreaterThan(12);

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: /search insights by title or topic/i,
      }),
      { target: { value: "ai" } },
    );

    const matched = INSIGHT_ARTICLES.filter((article) =>
      articleMatchesTerm(article, "ai"),
    ).length;
    expect(matched).toBeGreaterThan(12);
    expect(shown()).toBe(12);
  });

  it("links every service and industry category, filter state aside", () => {
    // The pills filter this page and emit no links, so the 17 routes behind the
    // taxonomy got nothing from /blog. The directory is the crawlable half of
    // that pair, and it is rendered outside the filter and paging state so it
    // survives an empty search.
    const { container } = renderBoard();
    const directory = required(
      container.querySelector<HTMLElement>(".ss-insight-board__directory"),
      "Expected the category directory",
    );
    const routed = INSIGHT_CATEGORIES.filter(
      (category) => category.group === "service" || category.group === "industry",
    );

    expect(routed).toHaveLength(17);
    const links = Array.from(directory.querySelectorAll<HTMLAnchorElement>("a[href]"));
    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      routed.map((category) => category.href),
    );
    expect(links.map((link) => link.textContent)).toEqual(
      routed.map((category) => category.label),
    );

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: /search insights by title or topic/i,
      }),
      { target: { value: "no-such-silverstone-topic-9x8y7z" } },
    );
    expect(
      container.querySelectorAll(".ss-insight-board__directory a[href]"),
    ).toHaveLength(17);
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
