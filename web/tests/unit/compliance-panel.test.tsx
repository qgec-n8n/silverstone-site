import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { futureRouteManifest } from "~/data/future-routes";
import { CompliancePanel } from "~/features/industries-v2/components/industry-sections";
import { industryCopyByRoute, industryRoutes } from "~/features/industries-v2/content";
import { MotionProvider } from "~/motion";
import { buildRouteSchemaGraph } from "~/seo/schema";

const estateAgents = industryCopyByRoute["/industry/estate-agents"];

/*
 * The compliance block is the one place on the site that makes claims about
 * law. Two things are being guarded here, and neither is cosmetic:
 *
 * 1. PRESENCE — every rule, its market and the responsibility note reach the
 *    rendered DOM. The panel exists so a US broker can read the fair-housing
 *    answer without asking for it; a regression that hid a card would be
 *    invisible in a screenshot of the ones that remain.
 *
 * 2. WORDING — the copy stays a *structural* claim ("designed to", "configured
 *    so that") and never drifts into a legal status ("complies with",
 *    "guaranteed", "certified"). Compliance depends on the client's own
 *    configuration, staff and jurisdiction; liability does not transfer to a
 *    vendor, and an absolute claim is itself a deception risk. Two named
 *    anchors are also banned outright because they no longer exist: HUD's 2024
 *    AI-in-advertising guidance (withdrawn 17 September 2025) and NTSELAT's
 *    Material Information Parts A/B/C (withdrawn May 2025).
 * Sources: scratchpad/research/fair-housing-mls.md §5.
 */

/**
 * Patterns that assert a legal status, or name a standard that no longer
 * exists. Matched against lowercased prose.
 *
 * "guarantee" is matched only in its affirmative sense: *disclaiming* one
 * ("that is a design constraint, not a legal guarantee") is the whole point of
 * this copy, so the lookbehinds let the denial through and stop the promise.
 */
const BANNED = [
  /(?<!not a legal )(?<!not a )(?<!no )guarantee/,
  /certified|certification|accredited/,
  /complies with|compliant/,
  /bias-free|unbiased|removes human bias/,
  /eliminates (?:fair.housing )?risk/,
  /fully automated screening/,
  /disparate.impact standard|passes hud/,
  // Withdrawn 17 September 2025 — naming it would be a claim about a document
  // that no longer exists.
  /hud guidance|hud's ai|hud's 2024/,
  // Parts A/B/C withdrawn May 2025 with the CPRs; the duty survives under the
  // DMCC Act 2024, which is what the copy names instead.
  /ntselat/,
  // Vacated January 2025.
  /one-to-one consent/,
  // HUD's EO 13988 memo was withdrawn 17 September 2025, so this may not be
  // stated as current federal coverage.
  /sexual orientation and gender identity/,
];

function complianceProse(route: (typeof industryRoutes)[number]): string {
  const copy = industryCopyByRoute[route];
  const compliance = copy.compliance;
  if (!compliance) {
    return "";
  }
  return [
    compliance.eyebrow,
    compliance.heading,
    compliance.lead,
    compliance.note,
    ...compliance.points.flatMap((point) => [
      point.title,
      point.body,
      point.source ?? "",
    ]),
    ...copy.markets.lanes.map((lane) => lane.rulebook ?? ""),
    ...copy.faqs.items.flatMap((item) => [item.q, item.a]),
  ].join(" ");
}

describe("CompliancePanel", () => {
  it("renders every rule, its market and the responsibility note", () => {
    const compliance = estateAgents.compliance;
    if (!compliance) {
      throw new Error("Estate agents copy must carry a compliance block");
    }

    const { container } = render(
      <MemoryRouter>
        <MotionProvider>
          <CompliancePanel compliance={compliance} />
        </MotionProvider>
      </MemoryRouter>,
    );

    expect(container.querySelectorAll(".ss-ind2-compliance__card")).toHaveLength(
      compliance.points.length,
    );

    for (const point of compliance.points) {
      const head = container.querySelector<HTMLElement>(
        `.ss-ind2-compliance__head[data-market="${point.market}"]`,
      );
      expect(head).not.toBeNull();
      expect(container.textContent).toContain(point.title);
      // Bodies carry `**bold**` emphasis, so compare on the visible substring
      // either side of the markup rather than the authored string.
      for (const fragment of point.body.split("**").filter(Boolean)) {
        expect(container.textContent).toContain(fragment);
      }
      if (point.source) {
        expect(container.textContent).toContain(point.source);
      }
    }

    // The market chip is real text, not an aria-hidden decoration: nothing else
    // in a card says which market its rule belongs to.
    const chips = [...container.querySelectorAll(".ss-ind2-compliance__chip")];
    expect(chips.map((chip) => chip.textContent)).toEqual(
      compliance.points.map((point) => point.market),
    );
    for (const chip of chips) {
      expect(chip).not.toHaveAttribute("aria-hidden");
    }

    const note = container.querySelector(".ss-ind2-compliance__note");
    expect(note?.textContent).toContain("not legal advice");
    expect(note?.textContent).toContain("stay responsible for the decisions");
  });

  it.each(industryRoutes)(
    "keeps %s's rule copy structural, never a status",
    (route) => {
      const prose = complianceProse(route).toLowerCase();
      for (const pattern of BANNED) {
        expect(prose, `banned by ${pattern.source}`).not.toMatch(pattern);
      }
    },
  );

  it("describes the artefact with design verbs, not a legal status", () => {
    const compliance = estateAgents.compliance;
    if (!compliance) {
      throw new Error("Estate agents copy must carry a compliance block");
    }
    const prose = complianceProse("/industry/estate-agents").toLowerCase();
    for (const verb of ["configured so", "designed", "never asks", "stay with a"]) {
      expect(prose).toContain(verb);
    }
    // The honesty line is the load-bearing half of the panel; it is required,
    // not optional garnish.
    expect(compliance.note.toLowerCase()).toContain("not legal advice");
  });

  it("states the fair-housing answer in the copy that feeds FAQPage", () => {
    const faq = estateAgents.faqs.items.find((item) =>
      item.q.includes("fair-housing law and MLS rules"),
    );
    expect(faq).toBeDefined();

    const route = futureRouteManifest.find(
      (candidate) => candidate.path === "/industry/estate-agents",
    );
    if (!route || !faq) {
      throw new Error("Estate agents route or fair-housing FAQ is missing");
    }

    const faqPage = buildRouteSchemaGraph(route)["@graph"].find(
      (entry) => entry["@type"] === "FAQPage",
    );
    const questions = (faqPage?.mainEntity ?? []) as { name: string }[];
    expect(questions.map((question) => question.name)).toContain(faq.q);
  });
});
