import { render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { MarketLanes } from "~/features/industries-v2/components/industry-sections";
import {
  ATLAS_COMPACT,
  ATLAS_WIDE,
  LINKED_METROS,
  US_METROS,
} from "~/features/industries-v2/content/atlas";
import { industryCopyByRoute, industryRoutes } from "~/features/industries-v2/content";
import { MotionProvider } from "~/motion";

function renderLanes(route: (typeof industryRoutes)[number]) {
  const copy = industryCopyByRoute[route];
  return {
    copy,
    ...render(
      <MemoryRouter>
        <MotionProvider>
          <MarketLanes markets={copy.markets} />
        </MotionProvider>
      </MemoryRouter>,
    ),
  };
}

/*
 * The two-market section's whole contract is that nothing hides: both markets and
 * the shared mechanism must be in the rendered DOM on every industry route, in
 * DOM order US → UK, whatever the reader's currency. These assertions are the
 * guard against a future "just tab it" refactor.
 */
describe("MarketLanes (Atlantic atlas + ledger)", () => {
  it.each(industryRoutes)("renders both market lanes in full for %s", (route) => {
    const { container, copy } = renderLanes(route);
    const lanes = container.querySelectorAll("dl.ss-ind2-market__rows");
    expect(lanes).toHaveLength(2);

    const [usLane, ukLane] = copy.markets.lanes;
    // DOM order is US then UK regardless of the currency-driven visual order.
    expect(usLane.market).toBe("US");
    expect(ukLane.market).toBe("UK");
    expect(
      container.querySelectorAll(".ss-ind2-market--us, .ss-ind2-market--uk"),
    ).toHaveLength(2);

    for (const lane of copy.markets.lanes) {
      const inner = container.querySelector<HTMLElement>(
        `.ss-ind2-market__inner[data-market="${lane.market}"]`,
      );
      if (inner === null) {
        throw new Error(`Missing ${lane.market} lane on ${route}`);
      }
      const scope = within(inner);
      expect(scope.getByText(lane.label)).toBeInTheDocument();
      expect(scope.getByText(lane.operators)).toBeInTheDocument();
      expect(scope.getByText(lane.vocabulary)).toBeInTheDocument();
      expect(scope.getByText(lane.keepsHuman)).toBeInTheDocument();
      for (const tool of lane.tooling) {
        expect(scope.getByText(tool)).toBeInTheDocument();
      }
    }

    for (const item of copy.markets.shared) {
      expect(container.textContent).toContain(item);
    }
  });

  it.each(industryRoutes)("labels every fact in both lanes on %s", (route) => {
    const { container, copy } = renderLanes(route);
    for (const fact of ["operators", "tooling", "vocabulary", "keeps"]) {
      expect(
        container.querySelectorAll(`.ss-ind2-market__row[data-fact="${fact}"]`),
      ).toHaveLength(2);
    }

    // The rulebook row is all-or-nothing: the subgrid pins row n of one market
    // against row n of the other, so one lane's rulebook facing an empty cell
    // would read as "this market has no rules". Both lanes or neither.
    const withRulebook = copy.markets.lanes.filter((lane) => lane.rulebook).length;
    const facts = withRulebook === 2 ? 5 : 4;
    expect(
      container.querySelectorAll('.ss-ind2-market__row[data-fact="rulebook"]'),
    ).toHaveLength(withRulebook === 2 ? 2 : 0);
    expect(container.querySelector(".ss-ind2-markets__lanes")).toHaveAttribute(
      "data-rows",
      String(facts),
    );

    // Every fact prints a label and a value in BOTH lanes — the guarantee the
    // ledger's row alignment rests on.
    const cells = facts * 2;
    expect(container.querySelectorAll("dl.ss-ind2-market__rows dt")).toHaveLength(
      cells,
    );
    expect(container.querySelectorAll("dl.ss-ind2-market__rows dd")).toHaveLength(
      cells,
    );
  });

  it("prints each market's named rulebook where the sector has one", () => {
    const { container, copy } = renderLanes("/industry/estate-agents");
    for (const lane of copy.markets.lanes) {
      const value = container.querySelector(
        `.ss-ind2-market__row[data-fact="rulebook"][data-market="${lane.market}"] dd`,
      );
      expect(value).toHaveTextContent(lane.rulebook ?? "");
    }
    expect(container.textContent).toContain("Fair Housing Act");
    expect(container.textContent).toContain("Equality Act");
  });

  it("draws the atlas with every metro named and a described, decorative plate", () => {
    const { container } = renderLanes("/industry/dentists");
    const metros = US_METROS.map((city) => city.name);

    // One real-text label per named city over the plate, London first, each
    // a <label for> on the market switch: tapping a metro moves the ledger
    // to the US, tapping London to the UK. The quiet tier is plotted but
    // named only by the strip.
    const named = ATLAS_WIDE.cities
      .filter((city) => city.labelled)
      .map((city) => city.name);
    const labels = [
      ...container.querySelectorAll<HTMLLabelElement>(".ss-ind2-atlas__label"),
    ];
    expect(labels.map((label) => label.textContent)).toEqual(["London", ...named]);
    for (const label of labels) {
      const radio = container.querySelector<HTMLInputElement>(`#${label.htmlFor}`);
      expect(radio?.type).toBe("radio");
      expect(radio?.value).toBe(label.textContent === "London" ? "gbp" : "usd");
    }

    // The strip under the plate names every metro at every width.
    expect(
      [...container.querySelectorAll(".ss-ind2-atlas__strip-city")].map(
        (city) => city.textContent,
      ),
    ).toEqual(metros);
    expect(container.querySelector(".ss-ind2-atlas__readout")?.textContent).toContain(
      `${String(US_METROS.length)} US metros`,
    );

    const chart = container.querySelector(".ss-ind2-atlas__chart");
    expect(chart).toHaveAttribute("role", "img");
    expect(chart?.getAttribute("aria-label")).toMatch(/London and twelve US metros/);
    for (const name of metros) {
      expect(chart?.getAttribute("aria-label")).toContain(name);
    }

    // Two plates (wide, compact), each decorative, each drawing three static
    // dot layers, a route to every linked metro, thirteen nodes and a glow
    // per country. Nothing flies the routes any more: the draw itself is the
    // motion, and it leaves London.
    const svgs = container.querySelectorAll(".ss-ind2-atlas__svg");
    expect(svgs).toHaveLength(2);
    for (const svg of svgs) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
      const plate = svg.classList.contains("ss-ind2-atlas__svg--wide")
        ? ATLAS_WIDE
        : ATLAS_COMPACT;
      const layers = [...svg.querySelectorAll("image")].map((image) =>
        image.getAttribute("href"),
      );
      expect(layers).toHaveLength(3);
      for (const href of layers) {
        expect(href).toMatch(/^\/maps\/atlas-(wide|compact)-(world|us|uk)\.svg$/);
      }
      expect(svg.querySelectorAll(".ss-ind2-atlas__link")).toHaveLength(
        LINKED_METROS.length,
      );
      expect(svg.querySelectorAll(".ss-ind2-atlas__node")).toHaveLength(
        US_METROS.length + 1,
      );
      // The linked nodes: every routed metro, plus London at the other end.
      expect(
        svg.querySelectorAll('.ss-ind2-atlas__node[data-linked="true"]'),
      ).toHaveLength(LINKED_METROS.length + 1);
      expect(svg.querySelectorAll(".ss-ind2-atlas__pulse")).toHaveLength(0);
      expect(svg.querySelectorAll(".ss-ind2-atlas__aura-wash")).toHaveLength(2);
      expect(svg.querySelectorAll(".ss-ind2-atlas__ripple")).toHaveLength(6);
      for (const link of svg.querySelectorAll(".ss-ind2-atlas__link")) {
        const d = link.querySelector(".ss-ind2-atlas__arc")?.getAttribute("d") ?? "";
        expect(
          d.startsWith(`M ${String(plate.hub.point.x)} ${String(plate.hub.point.y)} `),
        ).toBe(true);
      }
    }
  });

  it("mounts the market focus control as its own radio group", () => {
    const { container } = renderLanes("/industry/hospitality");
    const radios = [
      ...container.querySelectorAll<HTMLInputElement>(
        '.ss-cur[data-context="markets"] input[type="radio"]',
      ),
    ];
    expect(radios).toHaveLength(2);
    // A per-context name: two controlled React groups sharing one native name
    // would fight over the checked state.
    expect(new Set(radios.map((radio) => radio.name))).toEqual(
      new Set(["ss-currency-markets"]),
    );
    expect(radios.map((radio) => radio.value)).toEqual(["gbp", "usd"]);
  });
});
