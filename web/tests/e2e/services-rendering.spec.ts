import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { ApprovedServiceContent } from "../../src/content/services/approved-services";
import { serviceCopyByRoute } from "../../src/features/services-v2/content/copy";

const approvedServices = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "src/content/services/generated/approved-services.json"),
    "utf8",
  ),
) as Record<string, ApprovedServiceContent>;

/**
 * Strings that must never appear on a rendered service page: the removed
 * platinum prototype's section labels, raw authoring scaffolding, and generic
 * prototype copy from earlier failed attempts.
 */
const forbiddenPrototypePhrases = [
  "built around a clear business problem",
  "Service architecture",
  "Conversion path mapper",
  "First-release state map",
  "Exception-aware workflow run",
  "Component microcopy",
  "Outcome framing",
  "Approved capability cards",
  "Approved outcome cards",
  "Published benchmark evidence",
  "Section introduction",
  "Browser-window placeholder",
  "Reserved live website showcase · 01",
  "Reserved live website showcase · 02",
  "Configuration slot:",
] as const;

/** Benchmark figures must be attributed to Silverstone, never distanced from it. */
const forbiddenBenchmarkDistancing = [
  "external industry benchmark",
  "not a Silverstone result",
  "unrelated published case data",
] as const;

// SSR-rendered HTML entity-encodes a straight apostrophe (') as &#x27; but
// leaves a curly one (’) as-is; normalize before a raw-HTML substring check.
const htmlSafe = (text: string) => text.replace(/'/g, "&#x27;");

const serviceRoutes = Object.entries(approvedServices).map(([path, service]) => {
  const copy = serviceCopyByRoute[path as keyof typeof serviceCopyByRoute];
  return {
    button: service.routeEntry.buttonLabel,
    // H1s carry *emphasis* markdown (rendered as <em>), so raw-HTML and
    // accessible-name checks use the plain text, which also appears verbatim
    // in the page's JSON-LD.
    h1: copy.h1.replace(/\*/g, ""),
    path,
    // A short, plain (non-bold/italic) phrase guaranteed to render verbatim.
    // Headings now carry *emphasis* markdown (rendered as <em> in HTML), which
    // breaks a raw-HTML toContain check, so these come from plain body/lead
    // fields instead.
    phrase: copy.process.lead,
    faqQuestion: copy.faqs.items[0]?.q ?? "",
    ctaHeading: copy.finalCta.body,
  };
});

for (const route of serviceRoutes) {
  test(`rewritten service copy renders in HTML and hydrated DOM for ${route.path}`, async ({
    page,
    request,
  }) => {
    const response = await request.get(route.path);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    const jsonLd = [
      ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
    ]
      .map((match) => JSON.parse(match[1] ?? "{}") as { "@graph"?: unknown[] })
      .flatMap((schema) => schema["@graph"] ?? []) as {
      "@type"?: string;
      name?: string;
    }[];
    const serviceSchema = jsonLd.find((entry) => entry["@type"] === "Service");

    // Prerendered HTML carries the real H1, distinctive copy, FAQ and CTA —
    // essential content must not be gated behind the Aether entry interaction.
    expect(html).toContain(htmlSafe(route.h1));
    expect(html).toContain(htmlSafe(route.phrase));
    expect(html).toContain(htmlSafe(route.faqQuestion));
    expect(html).toContain(htmlSafe(route.ctaHeading));
    expect(html).toContain("Verified Silverstone AI performance");
    expect(serviceSchema?.name).toBe(route.h1);
    for (const phrase of forbiddenPrototypePhrases) {
      expect(html).not.toContain(phrase);
    }
    for (const phrase of forbiddenBenchmarkDistancing) {
      expect(html.toLowerCase()).not.toContain(phrase.toLowerCase());
    }

    await page.goto(route.path);
    await expect(page.locator("html")).toHaveAttribute(
      "data-route-experience-state",
      "intro",
      { timeout: 12_000 },
    );

    await page.getByRole("button", { name: route.button }).click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-route-experience-state",
      "body",
      { timeout: 8_000 },
    );
    await expect(page.getByRole("heading", { name: route.h1 })).toBeVisible();
    await expect(page.getByText(route.phrase, { exact: false }).first()).toBeVisible();

    // innerText() reflects rendered CSS (the benchmark tag is styled
    // uppercase), so this check is case-insensitive; the earlier raw-HTML
    // check above already confirmed the exact-case source string.
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toContain(route.faqQuestion);
    expect(bodyText.toLowerCase()).toContain("verified silverstone ai performance");
    for (const phrase of forbiddenPrototypePhrases) {
      expect(bodyText).not.toContain(phrase);
    }
    for (const phrase of forbiddenBenchmarkDistancing) {
      expect(bodyText.toLowerCase()).not.toContain(phrase.toLowerCase());
    }

    // No duplicate H1: the composition owns the single visible H1 now that
    // RoutePageFrame's default header is suppressed for service routes.
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });
}
